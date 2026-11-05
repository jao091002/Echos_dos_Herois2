import * as THREE from 'three';

/* ============================================================================
 *  HERO — rig articulado procedural (Frieren-like)
 *
 *  API 100% compatível com a versão anterior:
 *    createHero(scene) -> { root, spellPoint, update(time, delta, pose, speed) }
 *    root.userData.facing continua controlando a rotação (yaw) do personagem.
 *
 *  Como funciona:
 *   1. Esqueleto de verdade: pelve > coluna > peito > pescoço > cabeça,
 *      ombro > cotovelo > pulso > dedos, quadril > joelho > tornozelo.
 *   2. Cada pose calcula ALVOS de ângulo (ciclos de caminhada/corrida,
 *      keyframes com interpolação cúbica para ações).
 *   3. Cada ângulo é uma MOLA amortecida -> transições fluidas, follow-through
 *      e leve overshoot, sem "cortes" entre poses.
 *   4. Física secundária (cadeias de molas): maria-chiquinhas, saia do casaco,
 *      capa curta, brincos, mechas, bolsa e fita do cajado reagem ao movimento
 *      real do root (velocidade/aceleração) e ao vento.
 *   5. Cajado preso à mão direita com orientação controlada em espaço-mundo;
 *      mão esquerda usa IK de 2 ossos para segurar o cajado (ataque / guarda).
 *   6. Cabeça lidera as curvas, piscar, sobrancelhas, boca, orelhas de elfa.
 *
 *  Convenções: personagem olha para +Z. "L" = lado -X, "R" = lado +X (igual ao
 *  código anterior). Rotação X negativa em braço/perna = para frente.
 * ========================================================================== */

export type HeroPose = 'idle' | 'walk' | 'run' | 'jump' | 'fall' | 'land' | 'attack' | 'dodge' | 'guard' | 'cast' | 'hit' | 'defeat' | 'fly';
/** Camada de parte superior do corpo para o Zoltraak (carregar / sustentar o raio); as pernas seguem a pose base. */
export type HeroOverlay = { mode: 'charge' | 'beam' | 'shield'; power: number };
export type HeroRig = {
  root: THREE.Group; spellPoint: THREE.Object3D;
  update: (time: number, delta: number, pose: HeroPose, speed?: number, overlay?: HeroOverlay) => void;
  /** Troca o corpo procedural pelo corpo esquelético do glTF (Xbot), mantendo cabeça, cabelo, casaco, capa e cajado. */
  /** full=true: o modelo já traz cabeça/cabelo/roupa próprios (só o cajado e a física procedural são mantidos). */
  attachBody: (gltf: { scene: THREE.Object3D; animations: THREE.AnimationClip[] }, opts?: { full?: boolean }) => void;
  /** Guarda/saca o cajado (com animação). Retorna o estado final (true = em mãos). */
  toggleStaff: () => boolean;
  /** Garante o cajado em mãos imediatamente (antes de lançar magia). */
  ensureStaff: () => void;
  isStaffEquipped: () => boolean;
};

/** Liga/desliga o contorno "anime" (casca invertida). Desligar economiza ~1/3 dos draw calls. */
const OUTLINES = true;

type V3 = [number, number, number];
type Key = readonly [number, number];

const { clamp, lerp } = THREE.MathUtils;
const { sin, cos, abs, max, min, sqrt, PI } = Math;
const TAU = PI * 2;
const seeded01 = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const Z_AXIS = new THREE.Vector3(0, 0, 1);
const smoothstep01 = (x: number) => x * x * (3 - 2 * x);

/* ------------------------------------------------------------------ utilidades */

/** Keyframes com interpolação cúbica (Catmull-Rom não uniforme): velocidade contínua entre chaves. */
function kf(t: number, keys: readonly Key[]): number {
  const n = keys.length;
  if (t <= keys[0][0]) return keys[0][1];
  if (t >= keys[n - 1][0]) return keys[n - 1][1];
  let i = 0;
  while (t > keys[i + 1][0]) i++;
  const [t0, v0] = keys[i];
  const [t1, v1] = keys[i + 1];
  const h = t1 - t0;
  const m0 = i > 0 ? (v1 - keys[i - 1][1]) / (t1 - keys[i - 1][0]) : (v1 - v0) / h;
  const m1 = i + 2 < n ? (keys[i + 2][1] - v0) / (keys[i + 2][0] - t0) : (v1 - v0) / h;
  const s = (t - t0) / h, s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * v0 + (s3 - 2 * s2 + s) * h * m0 + (-2 * s3 + 3 * s2) * v1 + (s3 - s2) * h * m1;
}

function wrapAngle(a: number) {
  return THREE.MathUtils.euclideanModulo(a + PI, TAU) - PI;
}

function smoothAngle(current: number, target: number, amount: number) {
  return current + wrapAngle(target - current) * amount;
}

/* ---------------------------------------------------------------- molas (canais) */

type Chan = { v: number; vel: number; t: number };
const chan = (v = 0): Chan => ({ v, vel: 0, t: v });

function stepChan(c: Chan, k: number, d: number, h: number) {
  c.vel += (k * (c.t - c.v) - d * c.vel) * h;
  c.v += c.vel * h;
}

const JOINTS = ['pelvis', 'spine', 'chest', 'neck', 'head', 'armL', 'armR', 'elbowL', 'elbowR', 'wristL', 'wristR', 'hipL', 'hipR', 'kneeL', 'kneeR', 'ankleL', 'ankleR'] as const;
type JointName = (typeof JOINTS)[number];
type Joint = { node: THREE.Object3D; x: Chan; y: Chan; z: Chan };

/** Parâmetros "duros" (seguem a mola da pose) e "macios" (expressão, dedos, magia...). */
const HARD_PARAMS = ['bodyX', 'bodyY', 'bodyZ', 'pitch', 'roll', 'staffP', 'staffY', 'staffR'] as const;
const SOFT_PARAMS = ['gripL', 'gripY', 'curlL', 'curlR', 'lid', 'brow', 'furrow', 'mouth', 'smile', 'magic', 'flare', 'wind', 'ear'] as const;
type ParamName = (typeof HARD_PARAMS)[number] | (typeof SOFT_PARAMS)[number];

/** Rigidez/amortecimento por pose: [k, zeta]. zeta < 1 = overshoot (mais "snappy"/elástico). */
const SPRING: Record<HeroPose, [number, number]> = {
  idle: [170, 0.9], walk: [700, 1.0], run: [900, 0.95], jump: [520, 0.78], fall: [210, 0.85], land: [900, 0.7],
  attack: [1500, 0.62], dodge: [1000, 0.85], guard: [480, 0.9], cast: [720, 0.7], hit: [1300, 0.45], defeat: [150, 0.85], fly: [260, 0.92],
};

/** Articulações mais "soltas" atrasam um pouco -> follow-through natural. */
const JOINT_K: Record<JointName, number> = {
  pelvis: 1, spine: 0.9, chest: 0.85, neck: 0.7, head: 0.55,
  armL: 1, armR: 1, elbowL: 0.9, elbowR: 0.9, wristL: 0.6, wristR: 0.6,
  hipL: 1, hipR: 1, kneeL: 1, kneeR: 1, ankleL: 0.8, ankleR: 0.8,
};

/* ------------------------------------------------------------------ medidas */
const PIV = 1.2;           // pivô de rotação do corpo (centro de massa)
const HIP_H = 1.17;        // altura da pelve
const THIGH = 0.52;        // coxa
const SHIN = 0.45;         // canela (até o tornozelo)
let ARM1 = 0.48;           // braço (atualizado ao trocar para o corpo do Xbot)
let ARM2 = 0.56;           // antebraço + mão (até o centro do punho)

/** IK analítico de 2 ossos (ombro com rotação X/Z, cotovelo dobrando em X). Alvo no espaço do ombro. */
function solveArm(tx: number, ty: number, tz: number, out: { x: number; z: number; e: number }) {
  const d = Math.hypot(tx, ty, tz) || 1e-4;
  const dd = clamp(d, abs(ARM1 - ARM2) + 0.06, (ARM1 + ARM2) * 0.995);
  const k = dd / d;
  tx *= k; ty *= k; tz *= k;
  const interior = Math.acos(clamp((ARM1 * ARM1 + ARM2 * ARM2 - dd * dd) / (2 * ARM1 * ARM2), -1, 1));
  const flex = PI - interior;
  const hy = -(ARM1 + ARM2 * cos(flex));
  const hz = ARM2 * sin(flex);
  const z = Math.asin(clamp(-tx / hy, -1, 1));
  out.x = Math.atan2(tz, ty) - Math.atan2(hz, hy * cos(z));
  out.z = z;
  out.e = -flex;
}

/* ------------------------------------------------------------ cadeias secundárias */

type Chain = {
  segs: THREE.Group[];
  x: number[]; z: number[]; vx: number[]; vz: number[]; lx: number[]; lz: number[];
  k: number; c: number; gain: number; limit: number; lag: number;
  yaw: number; air: number; breeze: number; seed: number;
  restX: number; restZ: number;
};
type ChainOpts = { k: number; c: number; gain: number; limit?: number; lag?: number; yaw?: number; air?: number; breeze?: number; seed?: number };

function makeChain(parent: THREE.Object3D, origin: V3, lengths: number[], build: (seg: THREE.Group, i: number, len: number) => void, o: ChainOpts): Chain {
  const segs: THREE.Group[] = [];
  let p: THREE.Object3D = parent;
  lengths.forEach((len, i) => {
    const g = new THREE.Group();
    if (i === 0) g.position.set(...origin); else g.position.set(0, -lengths[i - 1], 0);
    p.add(g); segs.push(g); build(g, i, len); p = g;
  });
  const n = lengths.length;
  const zeros = () => new Array<number>(n).fill(0);
  return {
    segs, x: zeros(), z: zeros(), vx: zeros(), vz: zeros(), lx: zeros(), lz: zeros(),
    k: o.k, c: o.c, gain: o.gain, limit: o.limit ?? 1.0, lag: o.lag ?? 26,
    yaw: o.yaw ?? 0, air: o.air ?? 1, breeze: o.breeze ?? 0.1, seed: o.seed ?? 0, restX: 0, restZ: 0,
  };
}

/** fx/fz: força "de inércia + arrasto" no espaço local do root. */
function stepChain(ch: Chain, h: number, fx: number, fz: number, time: number) {
  const c = cos(ch.yaw), s = sin(ch.yaw);
  const ux = (fx * c - fz * s) * ch.air + sin(time * 1.7 + ch.seed) * ch.breeze;
  const uz = (fx * s + fz * c) * ch.air + sin(time * 1.3 + ch.seed * 1.7) * ch.breeze * 0.7;
  const n = ch.segs.length;
  for (let i = 0; i < n; i++) {
    // cada segmento "enxerga" a força com atraso crescente -> onda que percorre a cadeia
    const a = 1 - Math.exp(-h * (ch.lag / (1 + i * 0.6)));
    ch.lx[i] += (ux - ch.lx[i]) * a;
    ch.lz[i] += (uz - ch.lz[i]) * a;
    const w = 1 - (i / n) * 0.6;
    const k = ch.k * (1 - 0.35 * (i / n));
    const ax = -ch.gain * ch.lz[i] - k * (ch.x[i] - ch.restX * w) - ch.c * ch.vx[i];
    const az = ch.gain * ch.lx[i] - k * (ch.z[i] - ch.restZ * w) - ch.c * ch.vz[i];
    ch.vx[i] += ax * h; ch.vz[i] += az * h;
    ch.x[i] = clamp(ch.x[i] + ch.vx[i] * h, -ch.limit, ch.limit);
    ch.z[i] = clamp(ch.z[i] + ch.vz[i] * h, -ch.limit, ch.limit);
  }
}

/* ------------------------------------------------------------- helpers de malha */

let outlineMaterial: THREE.MeshBasicMaterial | null = null;
function getOutline() {
  if (!outlineMaterial) {
    outlineMaterial = new THREE.MeshBasicMaterial({ color: '#2b2321', side: THREE.BackSide });
    outlineMaterial.onBeforeCompile = shader => {
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', 'vec3 transformed = position + normal * 0.011;');
    };
    outlineMaterial.customProgramCacheKey = () => 'hero-outline-v1';
  }
  return outlineMaterial;
}

type PartOpts = { rot?: V3; scale?: V3; outline?: boolean; shadow?: boolean };
function part(geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D, position: V3 = [0, 0, 0], o: PartOpts = {}) {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(...position);
  if (o.rot) m.rotation.set(...o.rot);
  if (o.scale) m.scale.set(...o.scale);
  m.castShadow = o.shadow ?? true; m.receiveShadow = true;
  if (OUTLINES && o.outline) m.add(new THREE.Mesh(geometry, getOutline()));
  parent.add(m);
  return m;
}

const caps = (r: number, len: number, seg = 10) => new THREE.CapsuleGeometry(r, len, 4, seg);

/**
 * Sólido de revolução suave a partir de chaves [y, raio] (y crescente), com polos arredondados.
 * zs achata a seção (corpo elíptico). Dá silhuetas orgânicas (cintura, panturrilha, coxa) em vez de cápsulas.
 */
function blob(keys: readonly Key[], zs = 1, seg = 16, steps = 14) {
  const n = keys.length, y0 = keys[0][0], y1 = keys[n - 1][0], r0 = keys[0][1], r1 = keys[n - 1][1];
  const pts = [new THREE.Vector2(0, y0 - r0 * 0.38), new THREE.Vector2(r0 * 0.72, y0 - r0 * 0.26)];
  for (let i = 0; i <= steps; i++) { const y = lerp(y0, y1, i / steps); pts.push(new THREE.Vector2(max(0.002, kf(y, keys)), y)); }
  pts.push(new THREE.Vector2(r1 * 0.72, y1 + r1 * 0.26), new THREE.Vector2(0, y1 + r1 * 0.38));
  const g = new THREE.LatheGeometry(pts, seg);
  if (zs !== 1) g.scale(1, 1, zs);
  return g;
}

/** Trecho [t0,t1] de uma curva, reparametrizado por comprimento de arco. */
class SubCurve extends THREE.Curve<THREE.Vector3> {
  constructor(private c: THREE.Curve<THREE.Vector3>, private t0: number, private t1: number) { super(); }
  getPoint(t: number, out = new THREE.Vector3()) { return this.c.getPointAt(this.t0 + (this.t1 - this.t0) * t, out); }
}

/**
 * Tubo varrido ao longo de uma curva com raio variável e achatamento opcional (seção elíptica).
 * Raio ~0 nas pontas fecha o tubo sem tampas. Base do cajado e das mechas de cabelo.
 */
function sweep(curve: THREE.Curve<THREE.Vector3>, radius: (t: number) => number, o: { segs?: number; radial?: number; flat?: (t: number) => number } = {}) {
  const segs = o.segs ?? 40, radial = o.radial ?? 10;
  const frames = curve.computeFrenetFrames(segs, false);
  const pos: number[] = [], idx: number[] = [], uv: number[] = [];
  const pnt = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) {
    const t = i / segs, N = frames.normals[i], B = frames.binormals[i], r = radius(t), f = o.flat ? o.flat(t) : 1;
    curve.getPointAt(t, pnt);
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * TAU, c = cos(a) * r, sn = sin(a) * r * f;
      pos.push(pnt.x + N.x * c + B.x * sn, pnt.y + N.y * c + B.y * sn, pnt.z + N.z * c + B.z * sn); uv.push(j / radial, t);
      if (i < segs && j < radial) { const q = i * (radial + 1) + j; idx.push(q, q + 1, q + radial + 1, q + 1, q + radial + 2, q + radial + 1); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
const bump = (t: number, at: number, w: number) => Math.exp(-(((t - at) / w) ** 2));

/** Casca aberta (punhos, golas): perfil [raio, y]. */
function shell(profile: [number, number][], seg = 16) {
  return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg);
}

/**
 * Painel curvo de tecido (arco de cilindro que se alarga para baixo). A linha central fica em z=0
 * e as bordas curvam para dentro (dir=1) ou para frente (dir=-1, capa): painéis vizinhos se sobrepõem
 * e formam uma saia contínua em vez de placas retas.
 */
function arcPanel(r0: number, r1: number, len: number, arc: number, dir = 1, cols = 6, rows = 3) {
  const pos: number[] = [], idx: number[] = [], uv: number[] = [];
  for (let j = 0; j <= rows; j++) {
    const v = j / rows, r = lerp(r0, r1, v), y = -v * len;
    for (let i = 0; i <= cols; i++) {
      const th = (i / cols - 0.5) * arc;
      pos.push(r * sin(th), y, dir * (r * cos(th) - r)); uv.push(i / cols, 1 - v);
      if (i < cols && j < rows) { const a = j * (cols + 1) + i, b = a + cols + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

/* ======================================================================== HERO */

export function createHero(scene: THREE.Scene): HeroRig {
  const root = new THREE.Group(); root.name = 'called-wanderer';
  const pivot = new THREE.Group(); pivot.name = 'hero-pivot'; pivot.position.y = PIV; root.add(pivot);
  const body = new THREE.Group(); body.name = 'articulated-rig'; body.position.y = -PIV; pivot.add(body);

  /* ------------------------------------------------------------- materiais */
  const toonRamp = new THREE.DataTexture(new Uint8Array([22, 86, 158, 232]), 4, 1, THREE.RedFormat);
  toonRamp.magFilter = THREE.NearestFilter; toonRamp.minFilter = THREE.NearestFilter; toonRamp.generateMipmaps = false; toonRamp.needsUpdate = true;
  scene.userData.gameTextures = [...(scene.userData.gameTextures ?? []), toonRamp];
  const toon = (color: string, side: THREE.Side = THREE.FrontSide) => new THREE.MeshToonMaterial({ color, gradientMap: toonRamp, side });
  const mat = {
    suit: toon('#33454c'), cloth: toon('#42616a'), clothD: toon('#42616a', THREE.DoubleSide),
    coat: toon('#ddd5bd'), coatD: toon('#ddd5bd', THREE.DoubleSide), coatShade: toon('#cbc3aa', THREE.DoubleSide), coatDark: toon('#a5a18c'),
    leather: toon('#544337'), leatherD: toon('#3d3028'),
    metal: new THREE.MeshStandardMaterial({ color: '#b99d67', roughness: 0.43, metalness: 0.42 }),
    metalD: new THREE.MeshStandardMaterial({ color: '#b99d67', roughness: 0.43, metalness: 0.42, side: THREE.DoubleSide }),
    skin: toon('#edc9a9'), skinD: toon('#edc9a9', THREE.DoubleSide),
    hair: toon('#e4e1d3'), hairShade: toon('#aeb9b5'),
    iris: toon('#5fa58f'), irisDark: new THREE.MeshBasicMaterial({ color: '#244a42' }),
    eyeWhite: new THREE.MeshBasicMaterial({ color: '#f7f0df' }), shine: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
    lash: new THREE.MeshBasicMaterial({ color: '#3a2f2b' }), lip: toon('#c98a86'), mouthIn: new THREE.MeshBasicMaterial({ color: '#7a3a3a' }),
    wood: new THREE.MeshStandardMaterial({ color: '#6e4a2c', roughness: 0.72 }),
    woodHead: new THREE.MeshStandardMaterial({ color: '#7a5233', roughness: 0.6 }),
    purple: toon('#b98ad9'), purpleD: toon('#9a6cc0', THREE.DoubleSide),
    silver: new THREE.MeshStandardMaterial({ color: '#d9dce3', roughness: 0.28, metalness: 0.85 }),
    bead: toon('#c7383a'),
    blush: new THREE.MeshBasicMaterial({ color: '#f29a9a', transparent: true, opacity: 0.22, depthWrite: false }),
    glow: new THREE.MeshToonMaterial({ color: '#f2dca5', emissive: '#b58a3f', emissiveIntensity: 1.2, gradientMap: toonRamp }),
    halo: new THREE.MeshBasicMaterial({ color: '#f6e4ae', transparent: true, opacity: 0.75, depthWrite: false, side: THREE.DoubleSide }),
  };

  /* ------------------------------------------------------- registro de juntas */
  const J = {} as Record<JointName, Joint>;
  const reg = (name: JointName, node: THREE.Object3D) => { J[name] = { node, x: chan(), y: chan(), z: chan() }; };
  const P = {} as Record<ParamName, Chan>;
  for (const n of [...HARD_PARAMS, ...SOFT_PARAMS]) P[n] = chan();
  P.lid.v = P.lid.t = 0.78;

  const chains: Chain[] = [];

  /* ================================================================== TRONCO */
  const pelvis = new THREE.Group(); pelvis.position.y = HIP_H; body.add(pelvis); reg('pelvis', pelvis);
  part(blob([[-0.13, 0.165], [-0.03, 0.212], [0.07, 0.2], [0.15, 0.17]], 0.82, 18), mat.suit, pelvis, [0, 0, 0], { outline: true });
  part(new THREE.TorusGeometry(0.215, 0.036, 8, 24), mat.leather, pelvis, [0, 0.1, 0], { rot: [PI / 2, 0, 0], scale: [1, 0.86, 1] });
  const clasp = part(new THREE.BoxGeometry(0.13, 0.11, 0.045), mat.metal, pelvis, [0, 0.1, 0.19]);

  const spine = new THREE.Group(); spine.position.y = 0.08; pelvis.add(spine); reg('spine', spine);
  part(blob([[0.0, 0.165], [0.14, 0.18], [0.3, 0.215]], 0.8, 18), mat.suit, spine, [0, 0, 0]);
  part(blob([[-0.02, 0.188], [0.12, 0.198], [0.3, 0.238]], 0.84, 18), mat.coat, spine, [0, 0, 0], { outline: true });

  const chest = new THREE.Group(); chest.position.y = 0.3; spine.add(chest); reg('chest', chest);
  part(blob([[-0.08, 0.22], [0.06, 0.255], [0.2, 0.265], [0.34, 0.21]], 0.78, 20), mat.suit, chest, [0, 0, 0]);
  part(blob([[-0.09, 0.238], [0.04, 0.272], [0.17, 0.292], [0.29, 0.272], [0.38, 0.2]], 0.84, 20), mat.coat, chest, [0, 0, 0], { outline: true });
  // lapelas do casaco em V
  for (const side of [-1, 1]) part(new THREE.BoxGeometry(0.11, 0.28, 0.018), mat.coatShade, chest, [side * 0.075, 0.24, 0.236], { rot: [-0.2, side * 0.3, side * 0.36], shadow: false });
  part(new THREE.TorusGeometry(0.287, 0.014, 6, 28), mat.metal, chest, [0, 0.0, 0], { rot: [PI / 2, 0, 0], scale: [1.02, 0.84, 1] });
  part(new THREE.BoxGeometry(0.022, 0.4, 0.02), mat.metal, chest, [0, 0.14, 0.243]);
  for (let i = 0; i < 3; i++) part(new THREE.SphereGeometry(0.02, 8, 6), mat.metal, chest, [0, 0.0 + i * 0.12, 0.252]);
  // linha de ombros (suaviza a transição tronco -> ombro)
  part(caps(0.12, 0.5, 10), mat.coat, chest, [0, 0.3, 0], { rot: [0, 0, PI / 2], scale: [1, 1, 0.85] });
  // gola
  part(new THREE.TorusGeometry(0.17, 0.075, 8, 20), mat.coat, chest, [0, 0.4, -0.01], { rot: [PI / 2, 0, 0], outline: true });
  part(new THREE.TorusGeometry(0.17, 0.014, 6, 20), mat.metal, chest, [0, 0.45, -0.01], { rot: [PI / 2, 0, 0] });
  // alça diagonal da bolsa
  const strapPivot = new THREE.Group(); strapPivot.position.set(0, 0.06, 0); strapPivot.rotation.z = -0.62; chest.add(strapPivot);
  part(new THREE.TorusGeometry(0.29, 0.018, 6, 28), mat.leather, strapPivot, [0, 0, 0], { rot: [PI / 2, 0, 0], scale: [1, 0.86, 1] });

  /* ================================================================== CABEÇA */
  const neck = new THREE.Group(); neck.position.set(0, 0.42, 0); chest.add(neck); reg('neck', neck);
  part(new THREE.CylinderGeometry(0.068, 0.078, 0.2, 10), mat.skin, neck, [0, 0.07, 0]);
  const head = new THREE.Group(); head.position.set(0, 0.2, 0); neck.add(head); reg('head', head);
  const skirtAnchors: THREE.Group[] = [];

  // crânio + rosto: esfera deformada (mandíbula afina para o queixo, maçãs do rosto, nuca mais cheia)
  const faceGeo = new THREE.SphereGeometry(0.25, 36, 28);
  { const fp = faceGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < fp.count; i++) {
      let x = fp.getX(i), y = fp.getY(i), z = fp.getZ(i);
      const ny = y / 0.25, nz = z / 0.25;
      if (ny < 0) x *= 1 - 0.34 * Math.pow(-ny, 1.5) * (0.6 + 0.4 * max(0, nz));          // mandíbula → queixo
      if (ny < -0.45 && nz > 0.2) { z += 0.022 * (-ny - 0.45); y -= 0.012; }                  // queixo levemente à frente
      if (nz > 0.55 && abs(ny + 0.1) < 0.3) x *= 1 + 0.04;                                   // maçãs do rosto
      if (nz < 0) z *= 1.06;                                                                  // nuca
      fp.setXYZ(i, x, y, z);
    }
    faceGeo.computeVertexNormals(); }
  part(faceGeo, mat.skin, head, [0, 0.03, 0.01], { scale: [0.86, 1.06, 0.9], outline: true });
  // nariz pequeno (dorso + ponta) e bochechas rosadas
  part(new THREE.ConeGeometry(0.014, 0.05, 4), mat.skin, head, [0, -0.002, 0.232], { rot: [-0.35, PI / 4, 0], scale: [1, 1, 0.75], shadow: false });
  part(new THREE.SphereGeometry(0.011, 8, 6), mat.skin, head, [0, -0.026, 0.24], { shadow: false });
  for (const sd of [-1, 1]) part(new THREE.CircleGeometry(0.03, 14), mat.blush, head, [sd * 0.105, -0.03, 0.2], { rot: [0, sd * 0.45, 0], shadow: false });

  // olhos (menores, proporção mais realista)
  const lids: THREE.Group[] = [], irises: THREE.Group[] = [], brows: THREE.Group[] = [], ears: THREE.Group[] = [];
  const BROW_Y = 0.112;
  for (const side of [-1, 1] as const) {
    const eye = new THREE.Group(); eye.position.set(side * 0.082, 0.04, 0.2); eye.rotation.y = side * 0.18; head.add(eye);
    part(new THREE.SphereGeometry(0.042, 16, 12), mat.eyeWhite, eye, [0, 0, 0], { scale: [1.22, 0.82, 0.45], shadow: false });
    const iris = new THREE.Group(); iris.position.set(0, -0.003, 0.014); eye.add(iris); irises.push(iris);
    part(new THREE.SphereGeometry(0.028, 16, 12), mat.iris, iris, [0, 0, 0], { scale: [1, 1.12, 0.35], shadow: false });
    part(new THREE.SphereGeometry(0.013, 10, 8), mat.irisDark, iris, [0, 0, 0.008], { scale: [1, 1.1, 0.3], shadow: false });
    part(new THREE.SphereGeometry(0.006, 8, 6), mat.shine, iris, [0.009, 0.011, 0.013], { scale: [1, 1, 0.4], shadow: false });
    const lid = new THREE.Group(); eye.add(lid); lids.push(lid);
    part(new THREE.SphereGeometry(0.047, 16, 8, 0, TAU, 0, PI * 0.52), mat.skinD, lid, [0, 0, 0], { scale: [1.22, 0.85, 0.5], shadow: false });
    part(new THREE.TorusGeometry(0.048, 0.0055, 5, 16, PI), mat.lash, lid, [0, 0, 0.02], { scale: [1.22, 0.85, 1], shadow: false });
    part(new THREE.TorusGeometry(0.044, 0.0022, 4, 12, PI * 0.8), mat.lash, eye, [0, -0.002, 0.018], { rot: [0, 0, PI + 0.3], scale: [1.2, 0.7, 1], shadow: false });
    const brow = new THREE.Group(); brow.position.set(side * 0.084, BROW_Y, 0.205); brow.rotation.y = side * 0.2; head.add(brow); brows.push(brow);
    part(caps(0.0065, 0.058, 6), mat.hairShade, brow, [0, 0, 0], { rot: [0, 0, PI / 2 - side * 0.12], shadow: false });
  }
  // boca: lábio superior em arco + lábio inferior
  const mouthLine = part(new THREE.TorusGeometry(0.021, 0.0042, 5, 14, PI), mat.lip, head, [0, -0.082, 0.218], { rot: [0, 0, PI], shadow: false });
  part(new THREE.SphereGeometry(0.014, 10, 6), mat.lip, head, [0, -0.095, 0.214], { scale: [1.5, 0.45, 0.55], shadow: false });
  const mouthOpen = part(new THREE.SphereGeometry(0.017, 10, 8), mat.mouthIn, head, [0, -0.088, 0.214], { scale: [1, 0.2, 0.4], shadow: false });
  mouthOpen.visible = false;

  // orelhas de elfa (finas e longas) + brincos (com física)
  for (const side of [-1, 1] as const) {
    const earG = new THREE.Group(); earG.position.set(side * 0.212, 0.03, -0.02); earG.rotation.y = side * 0.45; head.add(earG); ears.push(earG);
    const earGeo = new THREE.ConeGeometry(0.038, 0.25, 10); earGeo.translate(0, 0.125, 0);
    part(earGeo, mat.skin, earG, [0, 0, 0], { rot: [0, 0, -side * (PI / 2 - 0.32)], scale: [1, 1, 0.34], outline: true });
    chains.push(makeChain(head, [side * 0.228, -0.045, -0.02], [0.05, 0.05], (seg, i) => {
      if (i === 0) part(new THREE.SphereGeometry(0.012, 8, 6), mat.metal, seg, [0, 0, 0]);
      part(new THREE.CylinderGeometry(0.006, 0.006, 0.04, 5), mat.metal, seg, [0, -0.025, 0], { shadow: false });
      if (i === 1) part(new THREE.OctahedronGeometry(0.017, 0), mat.glow, seg, [0, -0.058, 0], { scale: [0.8, 1.4, 0.8] });
    }, { k: 70, c: 5, gain: 9, limit: 1.1, lag: 40, air: 0.9, breeze: 0.25, seed: side * 3 }));
  }

  // cabelo: calota, volume da nuca e franja de mechas modeladas (tubos achatados que afinam na ponta)
  part(new THREE.SphereGeometry(0.268, 36, 22, 0, TAU, 0, PI * 0.6), mat.hair, head, [0, 0.055, -0.018], { rot: [-0.5, 0, 0], scale: [1.0, 1.0, 1.05], outline: true });
  part(new THREE.SphereGeometry(0.25, 24, 18), mat.hair, head, [0, -0.03, -0.09], { scale: [1.0, 1.14, 0.84], outline: true });
  const strand = (pts: THREE.Vector3[], r0: number, shade: boolean, flat = 0.42) => part(
    sweep(new THREE.CatmullRomCurve3(pts), t => r0 * Math.pow(1 - t, 0.75) + 0.0015 + r0 * 0.25 * bump(t, 0.25, 0.25), { segs: 18, radial: 8, flat: () => flat }),
    shade ? mat.hairShade : mat.hair, head, [0, 0, 0], { shadow: false });
  // franja: mechas caindo da risca até logo acima dos olhos, com a do meio repartida
  for (let k = 0; k < 13; k++) {
    const a = (k - 6) * 0.15 + (k === 6 ? 0.05 : 0), rnd = seeded01(k * 7 + 3);
    const sx = sin(a), cz = cos(a), side = abs(a);
    strand([
      new THREE.Vector3(sx * 0.12, 0.25 - side * 0.05, cz * 0.1),
      new THREE.Vector3(sx * 0.22, 0.2 - side * 0.04, cz * 0.215),
      new THREE.Vector3(sx * 0.245 + sx * 0.02, 0.12 - side * 0.08 + rnd * 0.02, cz * 0.247),
      new THREE.Vector3(sx * 0.23 + (rnd - 0.5) * 0.02, 0.07 - side * 0.16 - rnd * 0.03, cz * 0.252 - 0.004),
    ], 0.03 + rnd * 0.008, k % 3 === 1);
  }
  // mechas da nuca (dão volume e caem sobre o pescoço)
  for (let k = 0; k < 9; k++) {
    const a = PI + (k - 4) * 0.3, rnd = seeded01(k * 13 + 1);
    strand([
      new THREE.Vector3(sin(a) * 0.18, 0.2, cos(a) * 0.17),
      new THREE.Vector3(sin(a) * 0.27, 0.02, cos(a) * 0.25),
      new THREE.Vector3(sin(a) * 0.24, -0.16 - rnd * 0.04, cos(a) * 0.2),
    ], 0.045, k % 2 === 0, 0.5);
  }
  // diadema fina + gema
  part(new THREE.TorusGeometry(0.262, 0.011, 6, 28, PI * 1.05), mat.metal, head, [0, 0.17, -0.01], { rot: [PI / 2 - 0.3, 0, 0] });
  part(new THREE.OctahedronGeometry(0.03, 0), mat.glow, head, [0, 0.225, 0.235], { scale: [0.75, 1.3, 0.6] });

  // maria-chiquinhas (7 segmentos cada) e mechas laterais
  const tailLens = [0.2, 0.2, 0.2, 0.2, 0.18, 0.18, 0.16];
  const tails: { chain: Chain; side: number }[] = [];
  const sideLocks: { chain: Chain; side: number }[] = [];
  for (const side of [-1, 1] as const) {
    const chain = makeChain(head, [side * 0.235, 0.15, -0.11], tailLens, (seg, i, len) => {
      const r = lerp(0.072, 0.03, i / 6);
      const r2 = lerp(0.072, 0.03, min(1, (i + 1) / 6));
      const m = part(blob([[-len - r2 * 0.2, r2 * 0.95], [-len * 0.5, r * 1.12], [0, r]], 0.75, 12, 8), i % 2 ? mat.hair : mat.hairShade, seg, [0, 0, 0], { outline: true });
      m.castShadow = true;
      for (const o of [-1, 1]) part(caps(r * 0.7, max(0.01, len * 0.9 - 1.4 * r), 6), o > 0 ? mat.hair : mat.hairShade, seg, [o * r * 0.8, -len / 2 - 0.01, -r * 0.2], { scale: [1, 1, 0.7] });
      if (i === 0) {
        part(new THREE.TorusGeometry(0.062, 0.016, 6, 14), mat.metal, seg, [0, -0.01, 0], { rot: [PI / 2, 0, 0] });
        part(new THREE.SphereGeometry(0.02, 8, 6), mat.glow, seg, [side * 0.06, 0.0, 0.0]);
      }
    }, { k: 26, c: 3.6, gain: 4.0, limit: 1.25, lag: 24, air: 1, breeze: 0.16, seed: side * 5 });
    chains.push(chain); tails.push({ chain, side });

    const lock = makeChain(head, [side * 0.2, 0.09, 0.11], [0.12, 0.12, 0.11], (seg, i, len) => {
      const r = lerp(0.036, 0.018, i / 2);
      part(caps(r, max(0.01, len - 2 * r), 6), i === 1 ? mat.hairShade : mat.hair, seg, [0, -len / 2, 0], { scale: [1, 1, 0.8], outline: i === 0 });
    }, { k: 55, c: 6, gain: 6.5, limit: 1.0, lag: 30, air: 0.8, breeze: 0.2, seed: side * 7 });
    chains.push(lock); sideLocks.push({ chain: lock, side });
  }

  /* ================================================================== PERNAS */
  for (const side of [-1, 1] as const) {
    const S = side < 0 ? 'L' : 'R';
    const hip = new THREE.Group(); hip.position.set(side * 0.15, -0.05, 0); pelvis.add(hip); reg(`hip${S}`, hip);
    part(new THREE.SphereGeometry(0.115, 14, 10), mat.suit, hip, [0, 0, 0]);
    part(blob([[-0.5, 0.086], [-0.38, 0.096], [-0.2, 0.112], [-0.02, 0.114]], 0.95, 14), mat.suit, hip, [0, 0, 0], { outline: true });
    const knee = new THREE.Group(); knee.position.set(0, -THIGH, 0); hip.add(knee); reg(`knee${S}`, knee);
    part(new THREE.SphereGeometry(0.092, 12, 8), mat.suit, knee, [0, 0, 0]);
    part(blob([[-0.26, 0.066], [-0.16, 0.08], [-0.06, 0.084], [0.0, 0.08]], 0.95, 14), mat.suit, knee, [0, 0, 0]);
    // bota de cano médio: cano afunilado, dobra de couro e fivela
    part(blob([[-0.47, 0.074], [-0.38, 0.076], [-0.27, 0.088], [-0.2, 0.096]], 0.95, 14), mat.leather, knee, [0, 0, 0], { outline: true });
    part(new THREE.TorusGeometry(0.098, 0.022, 6, 16), mat.leatherD, knee, [0, -0.2, 0], { rot: [PI / 2, 0, 0] });
    part(new THREE.TorusGeometry(0.083, 0.011, 6, 14), mat.leatherD, knee, [0, -0.36, 0], { rot: [PI / 2, 0, 0] });
    part(new THREE.BoxGeometry(0.035, 0.03, 0.012), mat.metal, knee, [side * 0.03, -0.36, 0.083]);
    const ankle = new THREE.Group(); ankle.position.set(0, -SHIN, 0); knee.add(ankle); reg(`ankle${S}`, ankle);
    const footGeo = blob([[-0.08, 0.068], [0.0, 0.078], [0.1, 0.074], [0.2, 0.048]], 0.62, 14); footGeo.rotateX(PI / 2);
    part(footGeo, mat.leather, ankle, [0, -0.072, 0.03], { outline: true });
    part(new THREE.BoxGeometry(0.15, 0.03, 0.33), mat.leatherD, ankle, [0, -0.118, 0.06]);          // sola
    part(new THREE.BoxGeometry(0.12, 0.05, 0.08), mat.leatherD, ankle, [0, -0.112, -0.065]);        // salto
    part(new THREE.SphereGeometry(0.05, 10, 6), mat.leatherD, ankle, [0, -0.085, 0.2], { scale: [1.3, 0.75, 0.8] }); // biqueira
  }

  /* ================================================================== BRAÇOS + MÃOS */
  type Finger = { prox: THREE.Group; dist: THREE.Group };
  const hands: { fingers: Finger[]; thumb: THREE.Group }[] = [];
  const buildHand = (wrist: THREE.Object3D, side: number) => {
    const hr = new THREE.Group(); hr.rotation.y = side > 0 ? -PI / 2 : PI / 2; wrist.add(hr);   // palma voltada p/ dentro
    part(new THREE.BoxGeometry(0.085, 0.1, 0.045), mat.skin, hr, [0, -0.055, 0]);
    part(new THREE.SphereGeometry(0.036, 8, 6), mat.skin, hr, [0, -0.01, 0], { scale: [1.1, 0.8, 0.9] });
    const fingers: Finger[] = [];
    const lens = [0.03, 0.036, 0.034, 0.026];
    for (let i = 0; i < 4; i++) {
      const prox = new THREE.Group(); prox.position.set((i - 1.5) * 0.0225, -0.108, 0); hr.add(prox);
      part(caps(0.0145, lens[i], 5), mat.skin, prox, [0, -0.026, 0], { shadow: false });
      const dist = new THREE.Group(); dist.position.set(0, -0.052, 0); prox.add(dist);
      part(caps(0.013, lens[i] - 0.008, 5), mat.skin, dist, [0, -0.02, 0], { shadow: false });
      fingers.push({ prox, dist });
    }
    const thumb = new THREE.Group(); thumb.position.set(-side * 0.05, -0.045, 0.012); hr.add(thumb);
    part(caps(0.0165, 0.03, 5), mat.skin, thumb, [0, -0.025, 0], { shadow: false });
    hands.push({ fingers, thumb });
  };

  const armNodes: THREE.Group[] = [];
  let wristR: THREE.Group = new THREE.Group();
  for (const side of [-1, 1] as const) {
    const S = side < 0 ? 'L' : 'R';
    const arm = new THREE.Group(); arm.name = side < 0 ? 'arm-left' : 'arm-right'; arm.position.set(side * 0.4, 0.3, 0); chest.add(arm); reg(`arm${S}`, arm); armNodes.push(arm);
    part(new THREE.SphereGeometry(0.17, 14, 12), mat.coat, arm, [0, -0.03, 0], { scale: [1, 0.9, 0.95], outline: true });
    part(blob([[-0.36, 0.1], [-0.24, 0.108], [-0.1, 0.118], [0.0, 0.13]], 0.95, 14), mat.coat, arm, [0, 0, 0], { outline: true });
    part(new THREE.TorusGeometry(0.104, 0.014, 6, 16), mat.metal, arm, [0, -0.33, 0], { rot: [PI / 2, 0, 0] });
    part(caps(0.085, 0.3, 10), mat.suit, arm, [0, -0.3, 0]);
    const elbow = new THREE.Group(); elbow.position.set(0, -ARM1, 0); arm.add(elbow); reg(`elbow${S}`, elbow);
    part(new THREE.SphereGeometry(0.082, 10, 8), mat.suit, elbow, [0, 0, 0]);
    part(blob([[-0.42, 0.05], [-0.3, 0.062], [-0.13, 0.074], [0.0, 0.072]], 0.92, 14), mat.suit, elbow, [0, 0, 0], { outline: true });
    // punho evasê do casaco
    part(shell([[0.074, -0.27], [0.084, -0.33], [0.1, -0.39], [0.104, -0.4]]), mat.coatD, elbow, [0, 0, 0]);
    part(new THREE.TorusGeometry(0.1, 0.012, 6, 16), mat.metal, elbow, [0, -0.398, 0], { rot: [PI / 2, 0, 0] });
    const wrist = new THREE.Group(); wrist.position.set(0, -0.46, 0); elbow.add(wrist); reg(`wrist${S}`, wrist);
    buildHand(wrist, side);
    if (side > 0) wristR = wrist;
  }

  /* ================================================================== SAIA (painéis), CAPA, BOLSA */
  const PANELS = 8;
  const panels: { chain: Chain; phi: number }[] = [];
  const clothMeshes: { mesh: THREE.Mesh; kind: 'skirt' | 'skirtHem' | 'cape' | 'capeHem'; j: number }[] = [];
  for (let i = 0; i < PANELS; i++) {
    const phi = (i / PANELS) * TAU;
    const anchor = new THREE.Group(); anchor.rotation.y = phi; anchor.position.set(sin(phi) * 0.29, 0.06, cos(phi) * 0.24); pelvis.add(anchor); skirtAnchors.push(anchor);
    const lens = [0.24, 0.24, 0.22];
    const radii = [[0.27, 0.29], [0.29, 0.32], [0.32, 0.36]];
    const ARC = (TAU / PANELS) * 1.22; // sobreposição: sem frestas quando o tecido abre
    const lift = 0.004 * (i % 2);      // painéis alternados ficam por cima (pregas)
    const chain = makeChain(anchor, [0, 0, 0], lens, (seg, j, len) => {
      clothMeshes.push({ mesh: part(arcPanel(radii[j][0], radii[j][1], len, ARC), i % 2 ? mat.coatD : mat.coatShade, seg, [0, 0, lift], { shadow: true }), kind: 'skirt', j });
      if (j === 2) clothMeshes.push({ mesh: part(arcPanel(radii[j][1] + 0.004, radii[j][1] + 0.005, 0.032, ARC, 1, 6, 1), mat.metalD, seg, [0, -len + 0.03, lift + 0.002], { shadow: false }), kind: 'skirtHem', j });
    }, { k: 46, c: 6.2, gain: 6.5, limit: 0.7, lag: 22, yaw: phi, air: 0.75, breeze: 0.07, seed: i * 1.3 });
    chains.push(chain); panels.push({ chain, phi });
  }
  const cape = makeChain(chest, [0, 0.36, -0.2], [0.3, 0.28, 0.26], (seg, j, len) => {
    clothMeshes.push({ mesh: part(arcPanel(0.3 + j * 0.02, 0.32 + j * 0.02, len, 1.75 + j * 0.06, -1, 8, 3), j % 2 ? mat.coatShade : mat.coatD, seg, [0, 0, 0]), kind: 'cape', j });
    if (j === 2) clothMeshes.push({ mesh: part(arcPanel(0.345, 0.346, 0.03, 1.87, -1, 8, 1), mat.metalD, seg, [0, -len + 0.03, -0.002], { shadow: false }), kind: 'capeHem', j });
  }, { k: 30, c: 4.5, gain: 5.5, limit: 1.25, lag: 20, air: 0.8, breeze: 0.08, seed: 11 });
  chains.push(cape);
  const satchel = makeChain(pelvis, [-0.34, 0.03, 0.02], [0.26], (seg) => {
    part(new THREE.BoxGeometry(0.2, 0.24, 0.1), mat.leather, seg, [0, -0.14, 0], { outline: true });
    part(new THREE.BoxGeometry(0.21, 0.09, 0.11), mat.leatherD, seg, [0, -0.05, 0]);
    part(new THREE.BoxGeometry(0.04, 0.045, 0.02), mat.metal, seg, [0, -0.09, 0.058]);
  }, { k: 70, c: 7, gain: 7, limit: 0.9, lag: 28, air: 0.7, breeze: 0.04, seed: 21 });
  chains.push(satchel);

  /* ================================================================== CAJADO */
  const staffMount = new THREE.Group(); staffMount.position.set(-0.05, -0.1, 0); wristR.add(staffMount);
  const staff = new THREE.Group(); staff.name = 'heirloom-staff'; staffMount.add(staff);
  /*
   * Cajado (referência fotográfica): haste de madeira levemente sinuosa com nós, enrolamento roxo na base
   * e abaixo da cabeça, anéis de prata gravados, cabeça de madeira que engrossa, achata e inclina para o lado
   * terminando num corte em bisel, e uma fita roxa amarrada com uma conta vermelha.
   * Eixo local Y = haste; y=0 fica na mão direita.
   */
  const shaftCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1.0, 0), new THREE.Vector3(0.004, -0.55, 0.002), new THREE.Vector3(-0.006, -0.1, 0),
    new THREE.Vector3(0.006, 0.25, 0.002), new THREE.Vector3(0.026, 0.46, -0.004), new THREE.Vector3(0.014, 0.66, 0),
    new THREE.Vector3(-0.004, 0.95, 0.002), new THREE.Vector3(0.002, 1.3, 0),
  ]);
  const shaftR = (t: number) => (0.025 + 0.009 * t + 0.01 * bump(t, 0.645, 0.035) + 0.006 * bump(t, 0.4, 0.02) + 0.007 * bump(t, 0.715, 0.03)) * min(1, (t + 0.004) / 0.012);
  part(sweep(shaftCurve, shaftR, { segs: 90, radial: 12 }), mat.wood, staff, [0, 0, 0], { outline: true });
  const at = (t: number) => shaftCurve.getPointAt(t);
  // enrolamento roxo da base (tiras com relevo)
  part(sweep(new SubCurve(shaftCurve, 0.003, 0.27), t => 0.031 + 0.0025 * max(0, sin(t * 120)) + 0.002 * t, { segs: 120, radial: 12 }), mat.purple, staff, [0, 0, 0], { outline: true });
  // anel de prata ornamentado (logo acima do enrolamento)
  const ring = (t: number, rr: number, h: number) => { const p = at(t); part(new THREE.CylinderGeometry(rr, rr, h, 16), mat.silver, staff, [p.x, p.y, p.z]); };
  const rim = (t: number, rr: number) => { const p = at(t); part(new THREE.TorusGeometry(rr, 0.006, 6, 18), mat.silver, staff, [p.x, p.y, p.z], { rot: [PI / 2, 0, 0] }); };
  ring(0.29, 0.035, 0.11); rim(0.268, 0.036); rim(0.312, 0.036); rim(0.29, 0.037);
  ring(0.51, 0.033, 0.03); ring(0.6, 0.036, 0.025);
  // enrolamento roxo abaixo da cabeça + anéis de prata
  part(sweep(new SubCurve(shaftCurve, 0.82, 0.985), t => 0.04 + 0.0022 * max(0, sin(t * 70)), { segs: 70, radial: 12 }), mat.purple, staff, [0, 0, 0], { outline: true });
  ring(0.845, 0.043, 0.022); ring(0.905, 0.043, 0.018);
  // cabeça de madeira: engrossa, inclina para o lado e termina achatada em bisel
  const headCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.002, 1.24, 0), new THREE.Vector3(0.012, 1.42, 0), new THREE.Vector3(0.05, 1.6, 0), new THREE.Vector3(0.115, 1.78, 0), new THREE.Vector3(0.14, 1.83, 0),
  ]);
  part(sweep(headCurve, t => (0.036 + 0.042 * smoothstep01(clamp((t - 0.25) / 0.6, 0, 1))) * (t > 0.9 ? Math.sqrt(max(0.0001, 1 - ((t - 0.9) / 0.1) ** 2)) : 1), { segs: 40, radial: 14, flat: t => 1 - 0.42 * smoothstep01(clamp((t - 0.35) / 0.6, 0, 1)) }), mat.woodHead, staff, [0, 0, 0], { outline: true });
  // fita roxa amarrada + conta vermelha
  const tie = at(0.86);
  part(new THREE.TorusGeometry(0.046, 0.012, 6, 16), mat.purple, staff, [tie.x, tie.y, tie.z], { rot: [PI / 2, 0, 0] });
  part(new THREE.SphereGeometry(0.016, 10, 8), mat.bead, staff, [tie.x + 0.05, tie.y - 0.05, tie.z + 0.012]);
  const focus = part(new THREE.IcosahedronGeometry(0.026, 1), mat.glow, staff, [0.128, 1.8, 0.02]);
  const spellPoint = new THREE.Object3D(); spellPoint.position.set(0.13, 1.84, 0.02); staff.add(spellPoint);
  const aura = new THREE.PointLight('#efdba9', 0.85, 4, 2); aura.position.set(0.1, 1.8, 0.1); staff.add(aura);
  const haloA = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.008, 5, 32), mat.halo); haloA.position.set(0.12, 1.78, 0); staff.add(haloA);
  const haloB = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.006, 5, 32), mat.halo); haloB.position.set(0.12, 1.78, 0); staff.add(haloB);
  haloA.visible = haloB.visible = false;
  chains.push(makeChain(staff, [tie.x + 0.035, tie.y, tie.z + 0.02], [0.13, 0.13, 0.12, 0.1], (seg, j, len) => {
    part(new THREE.BoxGeometry(0.058 - j * 0.006, len, 0.006), mat.purpleD, seg, [0, -len / 2, 0], { shadow: false });
  }, { k: 26, c: 3, gain: 4.5, limit: 1.2, lag: 22, air: 1, breeze: 0.2, seed: 31 }));

  Object.assign(root.userData, { body, legs: [J.hipL.node, J.hipR.node], arms: armNodes, focus, clasp, satchel: satchel.segs[0], shoulder: root });
  root.position.set(0, 0, 2);
  scene.add(root);

  /* ================================================================== ESTADO DE ANIMAÇÃO */
  const setJ = (n: JointName, x = 0, y = 0, z = 0) => { const j = J[n]; j.x.t = x; j.y.t = y; j.z.t = z; };
  const addJ = (n: JointName, x = 0, y = 0, z = 0) => { const j = J[n]; j.x.t += x; j.y.t += y; j.z.t += z; };

  const legHeight = (hip: number, knee: number) => THIGH * cos(hip) + SHIN * cos(hip + knee);
  /** Ajusta a altura da pelve para a perna mais "esticada" tocar o chão (nenhum pé atravessa o piso). */
  const plant = (extra = 0) => {
    const h = max(legHeight(J.hipL.x.t, J.kneeL.x.t), legHeight(J.hipR.x.t, J.kneeR.x.t));
    P.bodyY.t = h - (THIGH + SHIN) + extra;
  };
  /** Mantém o pé paralelo ao chão (k=1 totalmente plano). */
  const autoFoot = (k = 1) => {
    J.ankleL.x.t = -(J.hipL.x.t + J.kneeL.x.t) * k;
    J.ankleR.x.t = -(J.hipR.x.t + J.kneeR.x.t) * k;
  };

  const resetTargets = () => {
    for (const n of JOINTS) setJ(n);
    for (const n of HARD_PARAMS) P[n].t = 0;
    for (const n of SOFT_PARAMS) P[n].t = 0;
    setJ('armL', 0, 0, -0.08); setJ('armR', 0, 0, 0.08);
    setJ('elbowL', -0.2); setJ('elbowR', -0.3);
    P.lid.t = 0.78; P.curlL.t = 0.3; P.curlR.t = 1; P.gripY.t = -0.4; P.staffR.t = -0.06;
  };

  // movimento do root
  const prevPos = new THREE.Vector3(); let hasPrev = false;
  const vel = new THREE.Vector3(), sVel = new THREE.Vector3(), pVel = new THREE.Vector3(), acc = new THREE.Vector3(), sAcc = new THREE.Vector3();
  const vL = new THREE.Vector3(), aL = new THREE.Vector3();
  let turnVel = 0;
  const toLocal = (v: THREE.Vector3, out: THREE.Vector3, yaw: number) => {
    out.set(v.x * cos(yaw) - v.z * sin(yaw), v.y, v.x * sin(yaw) + v.z * cos(yaw));
  };

  let activePose: HeroPose = 'idle';
  let poseTime = 0;
  let phase = 0;
  let blinkWait = 2.4, blinkP = 0, earWait = 3;
  // ociosidade: pequenos gestos ("fidgets") e passinhos ao girar parada
  let idleClock = 0, fidget = -1, fidgetKind = 2, fidgetT = 0, nextFidget = 7;
  // cajado: em mãos ou preso nas costas (diagonal); troca animada
  let staffEquipped = true, swapT = -1, swapTo = true;
  const backMount = new THREE.Group(); backMount.name = 'staff-back-mount';
  backMount.position.set(0.02, 0.16, -0.2); backMount.rotation.set(0.12, 0, 0.62); chest.add(backMount);
  const placeStaff = (inHand: boolean) => {
    if (inHand) { staffMount.add(staff); staff.position.set(0, 0, 0); }
    else { backMount.add(staff); staff.position.set(0, -0.42, 0); staff.quaternion.identity(); }
    staffEquipped = inHand;
  };
  // olhos: pequenas sacadas (movimentos rápidos e naturais do olhar)
  let saccadeWait = 1.5; const saccade = { x: 0, y: 0, tx: 0, ty: 0 };
  // reação a dano: lado aleatório a cada golpe
  let hitSide = 1;
  let shuffle = 0, shufflePhase = 0;
  // impacto da aterrissagem proporcional à velocidade de queda
  let airMinVy = 0, landImpact = 0.7;
  const FIDGET_DUR = [2.6, 1.9, 2.8];
  const ik = { x: 0, z: 0, e: 0 };
  const qParent = new THREE.Quaternion(), qRoot = new THREE.Quaternion(), qDesired = new THREE.Quaternion();
  const eul = new THREE.Euler(0, 0, 0, 'YXZ');
  const tmp = new THREE.Vector3();

  /* ================================================================== CORPO glTF (Xbot)
   * Híbrido: a animação procedural continua calculando os ângulos de cada junta (springs, IK, voo, carga...).
   * Esses ângulos são retargetados para os ossos do Xbot e misturados por região com os clipes de mocap
   * do arquivo (idle/walk/run), sincronizados com o ciclo de passos procedural.
   * Retarget: o bind do Xbot tem todos os ossos alinhados ao mundo (T-pose). Para cada osso guardamos C, a
   * orientação de "repouso" no padrão do rig procedural (braços para baixo). Quaternion local = Cp⁻¹ · R · C,
   * onde R é a rotação da junta procedural (eixos do personagem) e Cp o C do pai.
   */
  /*
   * Retarget genérico para esqueletos Mixamo (Xbot ou personagens baixados com orientações de bind quaisquer).
   * No espaço do corpo: W = orientação de bind do osso; O = giro que leva o braço da T-pose para baixo
   * (calculado da direção real do braço no bind). Orientação desejada D = Rcadeia · Oacum · W, onde
   * Rcadeia é a composição das rotações procedurais das juntas mapeadas. Quaternion local = D_pai⁻¹ · D.
   */
  type Region = 'legs' | 'torso' | 'armL' | 'armR' | 'hips' | 'head' | 'none';
  type XNode = { bone: THREE.Bone; parentIdx: number; joint: JointName | null; region: Region; rest: THREE.Quaternion; clip: THREE.Quaternion; Rc: THREE.Quaternion; D: THREE.Quaternion };
  let xb: null | {
    model: THREE.Object3D; nodes: XNode[]; rootParentQ: THREE.Quaternion; full: boolean;
    mixer: THREE.AnimationMixer | null; idle: THREE.AnimationAction | null; walk: THREE.AnimationAction | null; run: THREE.AnimationAction | null;
    sockets: { obj: THREE.Object3D; idx: number }[]; hipsIdx: number; hipsBind: THREE.Vector3; hipsClipY: number; walkOff: number; runOff: number;
    fingers: { bones: THREE.Bone[]; sign: number; side: 0 | 1 }[]; chestSocket: THREE.Object3D; shoulderL: THREE.Bone; w: { legs: number; torso: number; armL: number; walk: number; run: number };
  } = null;
  const clipT = { legs: 0, torso: 0, armL: 0, walk: 0, run: 0 };
  const xq = new THREE.Quaternion(), xq2 = new THREE.Quaternion(), xe = new THREE.Euler(), xv = new THREE.Vector3(), bodyQInv = new THREE.Quaternion();
  const boneKey = (n: string) => n.replace(/^mixamorig[:_]?/, '').replace(/_\d+$/, '');

  const xbSample = (dt: number) => {
    if (!xb) return;
    const w = xb.w, k = 1 - Math.exp(-dt * 8);
    (Object.keys(w) as (keyof typeof w)[]).forEach(n => { w[n] += ((xb!.walk ? clipT[n] : 0) - w[n]) * k; });
    if (!xb.mixer || !xb.walk || !xb.run || !xb.idle) return;
    xb.walk.time = THREE.MathUtils.euclideanModulo(phase + xb.walkOff, 1) * xb.walk.getClip().duration;
    xb.run.time = THREE.MathUtils.euclideanModulo(phase + xb.runOff, 1) * xb.run.getClip().duration;
    xb.walk.setEffectiveWeight(w.walk); xb.run.setEffectiveWeight(w.run); xb.idle.setEffectiveWeight(Math.max(0, 1 - w.walk - w.run));
    xb.mixer.update(dt);
    for (const n of xb.nodes) n.clip.copy(n.bone.quaternion);
    xb.hipsClipY = xb.nodes[xb.hipsIdx].bone.position.y;
  };
  const xbApply = () => {
    if (!xb) return;
    const w = xb.w, I = xq2.identity();
    for (const n of xb.nodes) {
      const pR = n.parentIdx >= 0 ? xb.nodes[n.parentIdx].Rc : I, pD = n.parentIdx >= 0 ? xb.nodes[n.parentIdx].D : xb.rootParentQ;
      if (n.joint) { const r = J[n.joint].node.rotation; xe.set(r.x, r.y, r.z, 'XYZ'); xq.setFromEuler(xe); } else xq.identity();
      n.Rc.copy(pR).multiply(xq);
      n.D.copy(n.Rc).multiply(n.rest);
      n.bone.quaternion.copy(pD).invert().multiply(n.D);
      if (xb.mixer && n.joint) {
        const wr = (n.region === 'armR' && staffEquipped) || n.region === 'head' ? 0 : n.region === 'armR' ? w.armL : n.region === 'hips' ? w.legs * 0.8 : n.region === 'none' ? 0 : w[n.region];
        if (wr > 0.001) n.bone.quaternion.slerp(n.clip, wr);
      }
    }
    const hips = xb.nodes[xb.hipsIdx].bone;
    hips.position.set(xb.hipsBind.x, xb.hipsBind.y + (xb.mixer ? (xb.hipsClipY - xb.hipsBind.y) * w.legs : 0), xb.hipsBind.z);
    const curls = [clamp(P.curlL.v, 0, 1), clamp(P.curlR.v, 0, 1)];
    for (const f of xb.fingers) { const c = curls[f.side]; f.bones.forEach((bn, i) => { xq.setFromAxisAngle(Z_AXIS, f.sign * (0.15 + c * (i === 0 ? 1.15 : 1.0))); bn.quaternion.slerp(xq, 0.85); }); }
    xb.model.updateMatrixWorld(true);
    body.updateWorldMatrix(true, false);
    for (const sk of xb.sockets) {
      const n = xb.nodes[sk.idx];
      n.bone.getWorldPosition(xv); body.worldToLocal(xv); sk.obj.position.copy(xv);
      sk.obj.quaternion.copy(n.Rc);
      sk.obj.updateMatrixWorld(true);
    }
  };

  const attachBody: HeroRig['attachBody'] = (gltf, opts = {}) => {
    if (xb) return;
    const full = !!opts.full;
    const model = gltf.scene; model.name = full ? 'character-body' : 'xbot-body';
    const holder = new THREE.Group(); holder.name = 'body-holder'; holder.add(model); body.add(holder);
    const byName: Record<string, THREE.Bone> = {};
    model.traverse(o => { if ((o as THREE.Bone).isBone) { const k = boneKey(o.name); if (!byName[k]) byName[k] = o as THREE.Bone; } });
    const local = (n: string) => { body.updateWorldMatrix(true, true); return body.worldToLocal(byName[n].getWorldPosition(new THREE.Vector3())); };
    // 1) virar para +Z (direção dos dedos dos pés)
    const toe = local('LeftToeBase').sub(local('LeftFoot')); holder.rotation.y = -Math.atan2(toe.x, toe.z);
    // 2) escala pelo comprimento da perna; 3) sola no chão
    const k = (THIGH + SHIN) / Math.max(0.01, local('LeftUpLeg').y - local('LeftFoot').y);
    holder.scale.setScalar(k);
    const soleY = Math.min(local('LeftToeBase').y, local('RightToeBase').y, local('LeftFoot').y - 0.07 * k);
    holder.position.y = -soleY + 0.01;
    holder.updateMatrixWorld(true);
    // lado: "L" do rig procedural = lado -X do corpo
    const leftIsNeg = local('LeftArm').x < 0;
    const sideL = leftIsNeg ? 'Left' : 'Right', sideR = leftIsNeg ? 'Right' : 'Left';
    ARM1 = local(`${sideL}Arm`).distanceTo(local(`${sideL}ForeArm`));
    ARM2 = local(`${sideL}ForeArm`).distanceTo(local(`${sideL}Hand`)) + 0.08 * k;

    // materiais
    const skinned: THREE.SkinnedMesh[] = [];
    model.traverse(o => { if ((o as THREE.SkinnedMesh).isSkinnedMesh || (o as THREE.Mesh).isMesh) skinned.push(o as THREE.SkinnedMesh); });
    const outlineSkin = new THREE.MeshBasicMaterial({ color: '#2b2321', side: THREE.BackSide });
    outlineSkin.onBeforeCompile = shader => { shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', 'vec3 transformed = position + normal * 0.011;'); };
    outlineSkin.customProgramCacheKey = () => 'hero-outline-skin-v1';
    for (const m of skinned) {
      m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false;
      if (!full) {
        m.material = m.name.includes('Joints') ? mat.suit : mat.coat;
        if (OUTLINES && (m as THREE.SkinnedMesh).isSkinnedMesh) { const o = new THREE.SkinnedMesh(m.geometry, outlineSkin); o.position.copy(m.position); o.quaternion.copy(m.quaternion); o.scale.copy(m.scale); o.bind(m.skeleton, m.bindMatrix); o.frustumCulled = false; o.castShadow = false; m.parent!.add(o); }
      }
    }
    if (!full) byName.Head.scale.setScalar(0.001);

    // nós do esqueleto em pré-ordem (pais antes dos filhos)
    const MAP: Record<string, [JointName, Region]> = {
      Hips: ['pelvis', 'hips'], Spine: ['spine', 'torso'], Spine2: ['chest', 'torso'], Neck: ['neck', 'torso'],
      [`${sideL}Arm`]: ['armL', 'armL'], [`${sideL}ForeArm`]: ['elbowL', 'armL'], [`${sideL}Hand`]: ['wristL', 'armL'],
      [`${sideR}Arm`]: ['armR', 'armR'], [`${sideR}ForeArm`]: ['elbowR', 'armR'], [`${sideR}Hand`]: ['wristR', 'armR'],
      [`${sideL}UpLeg`]: ['hipL', 'legs'], [`${sideL}Leg`]: ['kneeL', 'legs'], [`${sideL}Foot`]: ['ankleL', 'legs'],
      [`${sideR}UpLeg`]: ['hipR', 'legs'], [`${sideR}Leg`]: ['kneeR', 'legs'], [`${sideR}Foot`]: ['ankleR', 'legs'],
    };
    if (full) MAP.Head = ['head', 'head'];
    body.updateWorldMatrix(true, true);
    const bodyQ = body.getWorldQuaternion(new THREE.Quaternion()), bodyQI = bodyQ.clone().invert();
    const wq = (o: THREE.Object3D) => bodyQI.clone().multiply(o.getWorldQuaternion(new THREE.Quaternion()));
    const DOWN = new THREE.Vector3(0, -1, 0);
    const nodes: XNode[] = [], idxOf = new Map<THREE.Object3D, number>(), oacc: THREE.Quaternion[] = [];
    let rootParentQ = new THREE.Quaternion();
    model.traverse(o => {
      if (!(o as THREE.Bone).isBone) return;
      const bone = o as THREE.Bone, key = boneKey(bone.name), pIdx = idxOf.has(bone.parent!) ? idxOf.get(bone.parent!)! : -1;
      if (pIdx < 0 && nodes.length === 0) rootParentQ = wq(bone.parent!);
      let O = new THREE.Quaternion();
      if (key === `${sideL}Arm` || key === `${sideR}Arm`) {
        const fore = byName[key.replace('Arm', 'ForeArm')];
        const dir = local(key.replace('Arm', 'ForeArm')).sub(local(key)).normalize();
        if (fore) O = new THREE.Quaternion().setFromUnitVectors(dir, DOWN);
      }
      const acc = (pIdx >= 0 ? oacc[pIdx].clone() : new THREE.Quaternion()).multiply(O);
      const m = MAP[key];
      idxOf.set(bone, nodes.length); oacc.push(acc);
      nodes.push({ bone, parentIdx: pIdx, joint: m ? m[0] : null, region: m ? m[1] : 'none', rest: acc.clone().multiply(wq(bone)), clip: new THREE.Quaternion(), Rc: new THREE.Quaternion(), D: new THREE.Quaternion() });
    });
    const hipsIdx = idxOf.get(byName.Hips)!;

    // clipes de mocap (só se houver idle/walk/run, como no Xbot)
    const clip = (n: string) => gltf.animations.find(a => a.name === n);
    let mixer: THREE.AnimationMixer | null = null, idle: THREE.AnimationAction | null = null, walk: THREE.AnimationAction | null = null, run: THREE.AnimationAction | null = null, walkOff = 0, runOff = 0;
    if (clip('idle') && clip('walk') && clip('run')) {
      mixer = new THREE.AnimationMixer(model);
      idle = mixer.clipAction(clip('idle')!); walk = mixer.clipAction(clip('walk')!); run = mixer.clipAction(clip('run')!);
      for (const a of [idle, walk, run]) { a.play(); a.setEffectiveWeight(0); }
      walk.setEffectiveTimeScale(0); run.setEffectiveTimeScale(0);
      const peak = (a: THREE.AnimationAction) => {
        for (const o of [idle!, walk!, run!]) o.setEffectiveWeight(o === a ? 1 : 0);
        let best = 0, bestZ = -Infinity;
        for (let i = 0; i < 50; i++) { a.time = (i / 50) * a.getClip().duration; mixer!.update(0); const z = local(`${sideL}Foot`).z - local(`${sideL}UpLeg`).z; if (z > bestZ) { bestZ = z; best = i / 50; } }
        return best - 0.25;
      };
      walkOff = peak(walk); runOff = peak(run);
      idle.setEffectiveWeight(1); walk.setEffectiveWeight(0); run.setEffectiveWeight(0); mixer.update(0);
    }

    // encaixes (seguem os ossos com a rotação procedural, sem herdar escala)
    const sockets: { obj: THREE.Object3D; idx: number }[] = [];
    const socket = (key: string) => { const obj = new THREE.Group(); body.add(obj); sockets.push({ obj, idx: idxOf.get(byName[key])! }); return obj; };
    const handR = socket(`${sideR}Hand`), chestS = socket('Spine2');
    chestS.add(backMount); backMount.position.set(0.02, 0.12, -0.16);
    handR.add(staffMount); staffMount.position.set(0.0, -0.085, 0.0);
    const keep = new Set<THREE.Object3D>([staffMount, holder, ...sockets.map(sk => sk.obj)]);
    if (!full) {
      const neckS = socket('Neck'), hipsS = socket('Hips');
      neckS.add(head); head.position.set(0, (local('Head').y - local('Neck').y) + 0.085, 0.025); head.scale.setScalar(0.8);
      skirtAnchors.forEach((a, i) => { const phi = (i / skirtAnchors.length) * TAU; hipsS.add(a); a.position.set(sin(phi) * 0.19, 0.075, cos(phi) * 0.15 + 0.01); });
      const SK = [[0.19, 0.215], [0.215, 0.255], [0.255, 0.3]], ARC = (TAU / skirtAnchors.length) * 1.24;
      for (const c of clothMeshes) {
        const old = c.mesh.geometry;
        if (c.kind === 'skirt') c.mesh.geometry = arcPanel(SK[c.j][0], SK[c.j][1], [0.24, 0.24, 0.22][c.j], ARC);
        else if (c.kind === 'skirtHem') c.mesh.geometry = arcPanel(SK[2][1] + 0.004, SK[2][1] + 0.005, 0.032, ARC, 1, 6, 1);
        else if (c.kind === 'cape') c.mesh.geometry = arcPanel(0.2 + c.j * 0.018, 0.218 + c.j * 0.018, [0.3, 0.28, 0.26][c.j], 1.95 + c.j * 0.05, -1, 8, 3);
        else c.mesh.geometry = arcPanel(0.256, 0.257, 0.03, 2.05, -1, 8, 1);
        old.dispose();
      }
      chestS.add(cape.segs[0]); cape.segs[0].position.set(0, 0.16, -0.1);
      const belt = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.024, 8, 32), mat.leather); belt.scale.set(1, 0.8, 1); belt.rotation.x = PI / 2; belt.position.set(0, 0.09, 0.012); hipsS.add(belt);
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.015), mat.silver); buckle.position.set(0, 0.09, 0.15); hipsS.add(buckle);
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.03, 8, 24), mat.coat); collar.rotation.x = PI / 2; collar.scale.set(1.15, 1, 1); collar.position.set(0, 0.2, -0.005); chestS.add(collar);
      for (const m of [belt, buckle, collar]) { m.castShadow = true; m.receiveShadow = true; }
      hipsS.add(satchel.segs[0]); satchel.segs[0].position.set(-0.21, -0.02, 0.04);
      [head, cape.segs[0], satchel.segs[0], ...skirtAnchors, neckS, hipsS].forEach(o => keep.add(o));
    }
    // esconde o corpo procedural (as juntas continuam calculando a pose)
    const kept = (o: THREE.Object3D) => { for (let c: THREE.Object3D | null = o; c && c !== body; c = c.parent) if (keep.has(c)) return true; return false; };
    body.traverse(o => { if ((o as THREE.Mesh).isMesh && !kept(o)) o.visible = false; });

    const fingers: { bones: THREE.Bone[]; sign: number; side: 0 | 1 }[] = [];
    if (!full) for (const [side, prefix, sign] of [[0, 'RightHand', 1], [1, 'LeftHand', -1]] as const)
      for (const f of ['Index', 'Middle', 'Ring', 'Pinky']) fingers.push({ side, sign, bones: [1, 2, 3].map(i => byName[`${prefix}${f}${i}`]).filter(Boolean) });

    xb = { model, nodes, rootParentQ, full, mixer, idle, walk, run, sockets, hipsIdx, hipsBind: byName.Hips.position.clone(), hipsClipY: byName.Hips.position.y, walkOff, runOff, fingers, chestSocket: chestS, shoulderL: byName[`${sideL}Arm`], w: { legs: 0, torso: 0, armL: 0, walk: 0, run: 0 } };
  };

  return {
    root,
    spellPoint,
    attachBody,
    toggleStaff() { if (swapT < 0) { swapT = 0; swapTo = !staffEquipped; } return swapTo; },
    ensureStaff() { swapT = -1; if (!staffEquipped) placeStaff(true); },
    isStaffEquipped: () => staffEquipped,
    update(time, delta, pose, speed = 0, overlay) {
      const dt = clamp(delta, 1 / 240, 1 / 20);
      if (pose !== activePose) {
        if (pose === 'land') { landImpact = clamp(-airMinVy / 13, 0.35, 1.25); airMinVy = 0; }
        if (pose === 'jump' && activePose !== 'fall') airMinVy = 0;
        if (pose === 'hit') hitSide = Math.random() < 0.5 ? -1 : 1;
        activePose = pose; poseTime = 0;
      }
      poseTime += dt;

      /* ---- orientação (yaw) com cabeça liderando a curva */
      const target = (root.userData.facing as number | undefined) ?? root.rotation.y;
      const facingErr = wrapAngle(target - root.rotation.y);
      const prevYaw = root.rotation.y;
      root.rotation.y = smoothAngle(root.rotation.y, target, 1 - Math.exp(-dt * 13));
      turnVel = lerp(turnVel, wrapAngle(root.rotation.y - prevYaw) / dt, 1 - Math.exp(-dt * 12));

      /* ---- velocidade/aceleração reais do root (para lean, cloth e cabelo) */
      if (!hasPrev) { prevPos.copy(root.position); hasPrev = true; }
      vel.copy(root.position).sub(prevPos).divideScalar(dt); prevPos.copy(root.position);
      if (vel.length() > 40) vel.setLength(40);
      pVel.copy(sVel);
      sVel.lerp(vel, 1 - Math.exp(-dt * 14));
      acc.copy(sVel).sub(pVel).divideScalar(dt);
      if (acc.length() > 80) acc.setLength(80);
      sAcc.lerp(acc, 1 - Math.exp(-dt * 10));
      toLocal(sVel, vL, root.rotation.y); toLocal(sAcc, aL, root.rotation.y);
      const planar = Math.hypot(sVel.x, sVel.z);
      if (pose === 'jump' || pose === 'fall') airMinVy = min(airMinVy, sVel.y);

      /* ---- alvos da pose */
      resetTargets();
      const A_LEAN = clamp(aL.z * 0.004, -0.12, 0.12);

      /**
       * Locomoção direcional: o quadril aponta para onde o corpo se desloca (strafe/diagonal),
       * o tronco compensa para continuar olhando para a frente, e o ciclo roda ao contrário ao andar de costas.
       * Ciclo: contato de calcanhar (ponta do pé sobe), apoio (joelho absorve), impulso (ponta desce), balanço.
       */
      const locomote = (run: boolean) => {
        const moving = planar > 0.25;
        const fwd = moving ? vL.z / planar : 1, side = moving ? vL.x / planar : 0;
        const back = fwd < -0.3, dir = back ? -1 : 1;
        const legYaw = clamp(Math.atan2(side, abs(fwd) + 0.05), -1.2, 1.2) * 0.62 * dir;
        const rate = run ? (speed > 0.1 ? clamp(speed / 4.0, 0.95, 2.4) : 1.9) : (speed > 0.1 ? clamp(speed / 3.3, 0.7, 1.85) : 1.3);
        const A = run ? (speed > 0.1 ? clamp(speed / (TAU * rate) * 1.15, 0.5, 0.92) : 0.72) : (speed > 0.1 ? clamp(speed / (TAU * rate) * 0.98, 0.3, 0.6) : 0.42);
        phase += dt * rate * dir;
        const phi = phase * TAU;
        const fAmp = 0.55 + 0.45 * abs(fwd), lat = side * dir * 0.42;
        // mocap só quando anda para a frente (strafe/costas ficam 100% procedurais)
        const fwdness = back ? 0 : clamp((abs(fwd) - 0.35) / 0.5, 0, 1) * (moving ? 1 : 0);
        if (run) clipT.run = fwdness; else clipT.walk = fwdness;
        clipT.legs = fwdness * 0.85; clipT.torso = fwdness * 0.55; clipT.armL = fwdness * 0.6;
        for (const [hipN, kneeN, ankN, off, sgn] of [['hipL', 'kneeL', 'ankleL', 0, -1], ['hipR', 'kneeR', 'ankleR', PI, 1]] as const) {
          const p = phi + off, sp = sin(p), cp = cos(p) * dir;           // cp>0: perna em balanço
          const swing = max(0, cp), stance = max(0, -cp);
          setJ(hipN, -sp * A * fAmp + (run ? 0.05 : 0.03), 0, sgn * (run ? 0.03 : 0.015) + sp * A * lat);
          const kneeBase = run ? 0.22 + swing * (1.25 + A * 0.5) + stance * max(0, sp) * 0.35 : 0.06 + swing * (0.5 + A * 0.95) + stance * max(0, sp) * 0.16;
          setJ(kneeN, kneeBase);
          J[ankN].x.t = -(J[hipN].x.t + J[kneeN].x.t) * (run ? 0.72 : 0.85)
            - max(0, sp) * stance * (run ? 0.1 : 0.28)                    // calcanhar toca: ponta do pé sobe
            + max(0, -sp) * (run ? 0.55 : 0.4) * (stance + swing * 0.6);  // impulso: ponta empurra o chão
        }
        plant(run ? abs(sin(phi)) * 0.11 : 0);
        const s1 = sin(phi), twist = run ? 0.2 : 0.11;
        setJ('pelvis', 0, legYaw + s1 * twist, s1 * (run ? 0.05 : 0.045));       // giro + queda do quadril
        setJ('spine', run ? 0.1 : 0.04, -legYaw * 0.45 - s1 * twist * 0.45, -s1 * 0.025);
        setJ('chest', run ? 0.12 : 0.02, -legYaw * 0.45 - s1 * twist * 1.1, -s1 * 0.03);
        setJ('neck', run ? -0.05 : 0, -legYaw * 0.08 + s1 * 0.05, 0);
        setJ('head', run ? -0.12 : -0.03, s1 * (run ? 0.12 : 0.08), s1 * 0.015);
        P.bodyX.t = s1 * (run ? 0.025 : 0.02);
        // braços: contra-balanço com atraso do cotovelo (follow-through)
        const B = run ? 0.8 : 0.2 + A * 0.4, lagP = phi - 0.35 * dir;
        setJ('armL', sin(lagP) * B * (0.6 + 0.4 * abs(fwd)), 0, run ? -0.12 : -0.09);
        setJ('elbowL', -((run ? 1.15 : 0.22) + max(0, -sin(lagP - 0.3)) * (run ? 0.35 : 0.3)));
        setJ('wristL', run ? 0.1 : 0.05);
        if (run) { setJ('armR', -0.25 - sin(lagP) * 0.3, 0, 0.12); setJ('elbowR', -1.0); setJ('wristR', -0.4); P.staffP.t = -0.62; P.staffR.t = -0.22; }
        else { setJ('armR', -0.08 - sin(lagP) * B * 0.3, 0, 0.1); setJ('elbowR', -0.5 - max(0, sin(lagP)) * 0.12); setJ('wristR', -0.4); P.staffP.t = 0.04 - sin(lagP) * 0.06; }
        // inclinação: para frente ao avançar, levemente para trás de costas, rolagem no strafe
        const lean = (run ? 0.16 : 0.03) + clamp(planar * (run ? 0.012 : 0.02), 0, run ? 0.1 : 0.12);
        P.pitch.t = lean * (back ? -0.45 : 0.3 + 0.7 * abs(fwd));
        P.roll.t = -side * (run ? 0.1 : 0.05);
        if (run) { P.smile.t = 0.1; P.furrow.t = 0.15; P.flare.t = 0.25; }
      };

      // pesos dos clipes de mocap (só têm efeito com o corpo glTF)
      clipT.legs = clipT.torso = clipT.armL = clipT.walk = clipT.run = 0;

      // ociosidade
      if (pose === 'idle') idleClock += dt; else { idleClock = 0; fidget = -1; nextFidget = 6 + Math.random() * 4; }

      switch (pose) {
        case 'idle': {
          const br = sin(time * 1.8), sh = sin(time * 0.4);
          P.bodyX.t = sh * 0.02;
          setJ('pelvis', 0, sin(time * 0.4 + 1) * 0.05, sh * 0.035);
          setJ('spine', 0.02 + br * 0.008, 0, -sh * 0.02);
          setJ('chest', br * 0.016, sin(time * 0.33) * 0.05, -sh * 0.03);
          const look = sin(time * 0.31) * 0.2 + sin(time * 0.83) * 0.06;
          setJ('neck', 0.02, look * 0.35, 0);
          setJ('head', 0.02 + sin(time * 0.23 + 1) * 0.05, look * 0.65, sin(time * 0.19) * 0.035 + sh * 0.02);
          const rl = max(0, sh), rr = max(0, -sh);
          setJ('hipL', -rr * 0.07, 0, -0.015); setJ('hipR', -rl * 0.07, 0, 0.015);
          setJ('kneeL', rr * 0.14); setJ('kneeR', rl * 0.14);
          autoFoot(1); plant();
          setJ('armL', 0.03 + br * 0.01, 0, -0.09); setJ('elbowL', -0.2 - br * 0.02); setJ('wristL', 0.05);
          setJ('armR', -0.05, 0, 0.1); setJ('elbowR', -0.5); setJ('wristR', -0.4);
          P.staffP.t = -0.04; P.smile.t = 0.25;

          // passinhos ao girar sem sair do lugar
          shuffle = lerp(shuffle, clamp(abs(turnVel) / 3, 0, 1), 1 - Math.exp(-dt * 8));
          clipT.legs = 0.5 * (1 - shuffle); clipT.torso = 0.45; clipT.armL = 0.55;
          if (shuffle > 0.05) {
            shufflePhase += dt * 2.6;
            const q = shufflePhase * TAU, lift = shuffle;
            addJ('hipL', -max(0, sin(q)) * 0.32 * lift, 0, -max(0, sin(q)) * 0.06 * lift); addJ('kneeL', max(0, sin(q)) * 0.62 * lift);
            addJ('hipR', -max(0, -sin(q)) * 0.32 * lift, 0, max(0, -sin(q)) * 0.06 * lift); addJ('kneeR', max(0, -sin(q)) * 0.62 * lift);
            autoFoot(1); plant();
            addJ('pelvis', 0, clamp(turnVel * 0.06, -0.3, 0.3));
          }

          // gestos ocasionais: olhar em volta, girar o cajado, espreguiçar/bocejar
          if (fidget < 0 && idleClock > nextFidget && shuffle < 0.05) { fidgetKind = (fidgetKind + 1) % 3; fidget = fidgetKind; fidgetT = 0; }
          if (fidget >= 0) {
            clipT.armL = 0; clipT.torso = 0.15;
            fidgetT += dt;
            const u = fidgetT / FIDGET_DUR[fidget];
            if (fidget === 0) {
              const look = kf(u, [[0, 0], [0.18, 0.75], [0.42, 0.7], [0.58, -0.65], [0.82, -0.6], [1, 0]]);
              addJ('head', kf(u, [[0, 0], [0.2, -0.08], [0.6, 0.06], [1, 0]]), look * 0.6); addJ('neck', 0, look * 0.3); addJ('chest', 0, look * 0.15);
              P.brow.t = 0.4 * sin(u * PI);
            } else if (fidget === 1) {
              const up = kf(u, [[0, 0], [0.12, 1], [0.8, 1], [1, 0]]);
              setJ('armR', -0.45 * up - 0.05, 0, 0.12 + 0.1 * up); setJ('elbowR', -0.5 - 0.55 * up); setJ('wristR', -0.4 + 0.3 * up);
              P.staffY.t = kf(u, [[0, 0], [0.12, -0.15], [0.62, TAU + 0.15], [0.8, TAU], [1, TAU]]);
              P.staffP.t = -0.04 + 0.25 * up;
              setJ('head', 0.12 * up, 0.25 * up); P.smile.t = 0.25 + 0.3 * up;
              if (u > 0.86 && u < 0.95) P.bodyY.t -= 0.03; // batidinha do cajado no chão
            } else {
              const st = kf(u, [[0, 0], [0.25, 1], [0.6, 1], [0.85, 0.2], [1, 0]]);
              setJ('armL', -2.5 * st + 0.03, 0, -0.3 * st - 0.09); setJ('elbowL', -0.2 - 0.6 * st); setJ('wristL', 0.4 * st);
              setJ('armR', -0.05 - 0.35 * st, 0, 0.1 + 0.2 * st);
              addJ('chest', -0.16 * st); addJ('spine', -0.06 * st); addJ('head', -0.25 * st);
              P.bodyY.t += 0.02 * st;
              P.mouth.t = 0.55 * kf(u, [[0, 0], [0.3, 0], [0.45, 1], [0.7, 0.9], [0.85, 0]]); P.lid.t = lerp(0.78, 0.15, st);
              P.curlL.t = 0.3 - 0.3 * st;
            }
            if (u >= 1) {
              if (fidget === 1) P.staffY.v -= TAU; // volta ao ângulo base sem "desenrolar" o giro
              fidget = -1; nextFidget = idleClock + 6 + Math.random() * 7;
            }
          }
          break;
        }
        case 'walk': locomote(false); break;
        case 'run': locomote(true); break;
        case 'jump': {
          const u = poseTime;
          setJ('hipL', kf(u, [[0, 0.3], [0.14, -0.9], [0.5, -0.7]]), 0, -0.05); setJ('kneeL', kf(u, [[0, 0.1], [0.14, 1.3], [0.5, 1.1]]));
          setJ('hipR', kf(u, [[0, 0.35], [0.14, -0.25], [0.5, -0.2]]), 0, 0.05); setJ('kneeR', kf(u, [[0, 0.1], [0.14, 0.6], [0.5, 0.5]]));
          J.ankleL.x.t = 0.4; J.ankleR.x.t = 0.35;
          setJ('armL', kf(u, [[0, 0.2], [0.16, -1.9], [0.5, -1.5]]), 0, -0.55); setJ('elbowL', -0.35);
          setJ('armR', kf(u, [[0, 0.1], [0.16, -1.3], [0.5, -1.0]]), 0, 0.35); setJ('elbowR', -0.5); setJ('wristR', -0.3);
          setJ('chest', kf(u, [[0, 0.15], [0.16, -0.14], [0.5, -0.08]])); setJ('spine', kf(u, [[0, 0.1], [0.16, -0.06], [0.5, -0.02]]));
          setJ('head', -0.18); setJ('neck', -0.08);
          P.staffP.t = 0.35; P.staffR.t = -0.25;
          P.pitch.t = kf(u, [[0, 0.06], [0.2, -0.05], [0.5, 0.02]]);
          P.lid.t = 1; P.smile.t = 0.3; P.mouth.t = 0.15; P.flare.t = 0.2;
          break;
        }
        case 'fall': {
          const f = sin(time * 6);
          setJ('hipL', -0.3 + f * 0.06, 0, -0.06); setJ('kneeL', 0.45);
          setJ('hipR', 0.05 + sin(time * 6 + 2) * 0.06, 0, 0.06); setJ('kneeR', 0.35);
          J.ankleL.x.t = 0.35; J.ankleR.x.t = 0.3;
          setJ('armL', -0.3 + sin(time * 5) * 0.1, 0, -0.95); setJ('elbowL', -0.3);
          setJ('armR', -0.55 + sin(time * 5 + 1) * 0.1, 0, 0.85); setJ('elbowR', -0.3); setJ('wristR', -0.2);
          setJ('chest', -0.04); setJ('head', -0.1);
          P.staffP.t = 0.5; P.staffR.t = -0.9;
          P.lid.t = 0.95; P.mouth.t = 0.2; P.flare.t = 0.6;
          break;
        }
        case 'land': {
          const u = clamp(poseTime / (0.3 + landImpact * 0.14), 0, 1);
          const d = kf(u, [[0, 0.2], [0.3, 1], [1, 0]]) * landImpact;
          setJ('hipL', -0.9 * d, 0, -0.1 * d); setJ('hipR', -0.8 * d, 0, 0.1 * d);
          setJ('kneeL', 1.6 * d); setJ('kneeR', 1.5 * d);
          autoFoot(1); plant();
          setJ('spine', 0.15 * d); setJ('chest', 0.3 * d); setJ('head', -0.2 * d);
          setJ('armL', -0.5 * d, 0, -0.5 * d - 0.09); setJ('elbowL', -0.2 - 0.3 * d);
          setJ('armR', -0.3 * d, 0, 0.35 * d + 0.08); setJ('elbowR', -0.5); setJ('wristR', -0.4);
          P.staffP.t = -0.1; P.pitch.t = 0.08 * d; P.flare.t = 0.4 * d;
          break;
        }
        case 'attack': {
          const u = clamp(poseTime / 0.42, 0, 1);
          setJ('chest', kf(u, [[0, 0], [0.28, -0.08], [0.5, 0.22], [1, 0.1]]), kf(u, [[0, 0], [0.28, 0.65], [0.5, -0.55], [1, -0.2]]));
          setJ('pelvis', 0, kf(u, [[0, 0], [0.28, 0.3], [0.5, -0.3], [1, -0.1]]));
          setJ('spine', kf(u, [[0, 0], [0.28, -0.05], [0.5, 0.12], [1, 0.06]]));
          setJ('head', kf(u, [[0, 0], [0.28, -0.1], [0.5, 0.12], [1, 0.05]]), -J.chest.y.t * 0.5);
          setJ('armR', kf(u, [[0, -0.14], [0.28, -2.45], [0.36, -2.45], [0.52, -0.65], [1, -0.25]]), 0, kf(u, [[0, 0.1], [0.28, 0.45], [0.5, 0.15], [1, 0.1]]));
          setJ('elbowR', kf(u, [[0, -0.5], [0.28, -1.0], [0.52, -0.35], [1, -0.5]])); setJ('wristR', -0.3);
          P.staffP.t = kf(u, [[0, -0.04], [0.28, -1.0], [0.36, -1.05], [0.52, 1.7], [1, 1.2]]);
          P.staffY.t = kf(u, [[0, 0], [0.28, 0.4], [0.52, -0.5], [1, -0.3]]);
          P.staffR.t = kf(u, [[0, -0.06], [0.28, -0.3], [0.52, -0.1], [1, -0.1]]);
          setJ('armL', -0.6, 0, -0.5); setJ('elbowL', -0.8);   // FK de fallback; o IK assume com gripL
          P.gripL.t = kf(u, [[0, 0], [0.15, 1], [1, 1]]); P.gripY.t = -0.35; P.curlL.t = 1;
          setJ('hipL', kf(u, [[0, 0], [0.28, 0.12], [0.5, -0.75], [1, -0.5]]), 0, -0.05); setJ('kneeL', kf(u, [[0, 0], [0.28, 0.2], [0.5, 0.7], [1, 0.5]]));
          setJ('hipR', kf(u, [[0, 0], [0.28, -0.1], [0.5, 0.5], [1, 0.35]]), 0, 0.05); setJ('kneeR', kf(u, [[0, 0], [0.28, 0.1], [0.5, 0.5], [1, 0.35]]));
          autoFoot(0.9); plant();
          P.bodyZ.t = kf(u, [[0, 0], [0.28, -0.08], [0.5, 0.25], [1, 0.15]]);
          P.pitch.t = kf(u, [[0, 0], [0.28, -0.08], [0.5, 0.18], [1, 0.1]]);
          P.mouth.t = kf(u, [[0, 0], [0.3, 0], [0.45, 0.6], [1, 0.2]]); P.furrow.t = 0.7; P.lid.t = 0.95; P.flare.t = 0.3; P.magic.t = 0.15;
          break;
        }
        case 'dodge': {
          const u = clamp(poseTime / 0.42, 0, 1);
          const tuck = kf(u, [[0, 0], [0.15, 0.3], [0.35, 1], [0.7, 1], [0.9, 0.2], [1, 0]]);
          P.pitch.t = kf(u, [[0, 0], [0.12, 0.25], [0.8, TAU - 0.3], [1, TAU]]);
          P.bodyY.t = -0.4 * tuck;
          setJ('hipL', -1.35 * tuck, 0, -0.05); setJ('hipR', -1.3 * tuck, 0, 0.05);
          setJ('kneeL', 2.0 * tuck); setJ('kneeR', 1.95 * tuck);
          J.ankleL.x.t = 0.4 * tuck; J.ankleR.x.t = 0.4 * tuck;
          setJ('spine', 0.4 * tuck); setJ('chest', 0.6 * tuck); setJ('head', 0.5 * tuck);
          setJ('armL', -1.0 * tuck, 0, -0.2); setJ('elbowL', -1.4 * tuck - 0.2);
          setJ('armR', -1.0 * tuck - 0.05, 0, 0.2); setJ('elbowR', -1.2 * tuck - 0.3); setJ('wristR', -0.3);
          P.staffP.t = P.pitch.t - 0.04 + 0.5 * tuck; P.curlL.t = 0.8;
          P.lid.t = 0.5; P.flare.t = 0.5; P.furrow.t = 0.3;
          break;
        }
        case 'guard': {
          setJ('armR', -0.55, 0, 0.18); setJ('elbowR', -1.35); setJ('wristR', -0.2);
          P.staffP.t = 0.15; P.staffR.t = -1.3; P.staffY.t = 0;
          setJ('armL', -0.6, 0, -0.4); setJ('elbowL', -1.0);
          P.gripL.t = 1; P.gripY.t = -0.5; P.curlL.t = 1;
          setJ('hipL', -0.35, 0, -0.1); setJ('kneeL', 0.65); setJ('hipR', 0.3, 0, 0.1); setJ('kneeR', 0.55);
          autoFoot(1); plant();
          setJ('spine', 0.08); setJ('chest', 0.12 + sin(time * 3) * 0.01); setJ('head', 0.06); setJ('pelvis', 0, 0.2);
          P.bodyZ.t = -0.05; P.pitch.t = 0.08; P.furrow.t = 0.5; P.lid.t = 0.9; P.magic.t = 0.3;
          break;
        }
        case 'cast': {
          // cada magia tem sua própria pose (Game define root.userData.castKind ao lançar)
          const kind = (root.userData.castKind as string | undefined) ?? 'zoltraak';
          if (kind === 'shield') {
            // cajado cravado à frente, mão esquerda empurra a barreira, base em avanço
            const u = clamp(poseTime / 0.6, 0, 1);
            setJ('armR', kf(u, [[0, -0.14], [0.3, -0.5], [1, -0.42]]), 0, 0.16); setJ('elbowR', kf(u, [[0, -0.5], [0.3, -1.2], [1, -1.1]])); setJ('wristR', -0.1);
            P.staffP.t = kf(u, [[0, -0.04], [0.3, 0.12], [1, 0.08]]); P.staffR.t = -0.12; P.staffY.t = 0;
            setJ('armL', kf(u, [[0, 0.03], [0.22, -0.9], [0.38, -1.5], [1, -1.38]]), 0, kf(u, [[0, -0.09], [0.38, -0.12], [1, -0.16]]));
            setJ('elbowL', kf(u, [[0, -0.2], [0.22, -0.9], [0.38, -0.08], [1, -0.15]])); setJ('wristL', kf(u, [[0, 0], [0.3, -0.4], [0.42, -1.1], [1, -1.0]]));
            P.curlL.t = 0;
            setJ('hipL', -0.42, 0, -0.12); setJ('kneeL', 0.62); setJ('hipR', 0.38, 0, 0.12); setJ('kneeR', 0.42);
            autoFoot(1); plant();
            setJ('pelvis', 0, 0.28); setJ('chest', kf(u, [[0, 0], [0.38, 0.12], [1, 0.08]]), -0.3); setJ('spine', 0.06); setJ('head', 0.04, 0.12);
            P.bodyZ.t = kf(u, [[0, 0], [0.38, 0.08], [1, 0.04]]);
            P.magic.t = kf(u, [[0, 0], [0.38, 1], [1, 0.6]]); P.flare.t = kf(u, [[0, 0], [0.38, 0.6], [1, 0.3]]);
            P.furrow.t = 0.6; P.lid.t = 0.9; P.mouth.t = kf(u, [[0, 0], [0.38, 0.35], [1, 0]]);
          } else if (kind === 'vollzanbel') {
            // invocação: levita com o cajado na vertical à frente, mão esquerda estendida para o alvo,
            // pernas soltas e cabelo/casaco subindo; no fim crava o cajado à frente liberando o fogo
            const u = clamp(poseTime / 1.35, 0, 1), lev = kf(u, [[0, 0], [0.22, 0.48], [0.85, 0.55], [1, 0.15]]);
            const hover = sin(time * 3.1) * 0.03 * (u < 0.85 ? 1 : 0);
            P.bodyY.t = lev + hover; P.pitch.t = kf(u, [[0, 0], [0.25, -0.06], [0.85, -0.04], [0.92, 0.12], [1, 0.05]]);
            setJ('armR', kf(u, [[0, -0.14], [0.2, -0.85], [0.85, -0.9], [0.92, -1.4], [1, -1.2]]), 0, 0.12);
            setJ('elbowR', kf(u, [[0, -0.5], [0.2, -1.25], [0.85, -1.2], [0.92, -0.2], [1, -0.4]])); setJ('wristR', -0.1);
            P.staffP.t = kf(u, [[0, -0.04], [0.2, -0.08], [0.85, -0.06], [0.92, 1.35], [1, 1.2]]); P.staffY.t = 0; P.staffR.t = kf(u, [[0, -0.06], [0.2, 0], [1, 0]]);
            setJ('armL', kf(u, [[0, 0.03], [0.25, -1.5], [0.85, -1.62], [1, -1.2]]), 0, kf(u, [[0, -0.09], [0.25, -0.28], [1, -0.2]]));
            setJ('elbowL', kf(u, [[0, -0.2], [0.25, -0.08], [1, -0.2]])); setJ('wristL', kf(u, [[0, 0], [0.3, -0.7], [0.85, -0.8], [1, -0.3]])); P.curlL.t = kf(u, [[0, 0.3], [0.25, 0], [0.85, 0.15], [1, 0.4]]);
            setJ('hipL', kf(u, [[0, 0], [0.25, 0.08], [1, 0]]), 0, -0.03); setJ('kneeL', kf(u, [[0, 0], [0.25, 0.3], [0.85, 0.32], [1, 0.1]]));
            setJ('hipR', kf(u, [[0, 0], [0.25, 0.22], [1, 0.05]]), 0, 0.03); setJ('kneeR', kf(u, [[0, 0], [0.25, 0.55], [0.85, 0.5], [1, 0.15]]));
            J.ankleL.x.t = 0.55 * min(1, lev * 2); J.ankleR.x.t = 0.65 * min(1, lev * 2);
            setJ('chest', kf(u, [[0, 0], [0.25, -0.1], [0.85, -0.12], [0.92, 0.15], [1, 0.05]])); setJ('spine', -0.03);
            setJ('head', kf(u, [[0, 0], [0.25, 0.12], [0.6, 0.05], [0.85, -0.05], [0.92, 0.04], [1, 0]]), sin(time * 0.9) * 0.04);
            P.wind.t = kf(u, [[0, 0], [0.2, 0.9], [0.85, 1], [1, 0.3]]); P.flare.t = kf(u, [[0, 0], [0.25, 0.7], [0.92, 0.9], [1, 0.3]]);
            P.magic.t = kf(u, [[0, 0.2], [0.3, 1], [0.85, 1.2], [1, 0.5]]);
            P.lid.t = kf(u, [[0, 0.8], [0.25, 0.45], [0.85, 0.45], [0.92, 0.95], [1, 0.85]]); P.furrow.t = 0.55;
            P.mouth.t = kf(u, [[0, 0], [0.3, 0.12], [0.5, 0.2], [0.7, 0.12], [0.88, 0.6], [1, 0.1]]); P.smile.t = 0;
          } else if (kind === 'judradjim') {
            // estocada: recolhe o cajado, avança de lado e aponta à frente com as duas mãos; treme com a descarga
            const u = clamp(poseTime / 0.95, 0, 1), dis = u > 0.22 && u < 0.78 ? 1 : 0;
            const jit = dis * (sin(time * 61) * 0.025 + sin(time * 37 + 1) * 0.015);
            setJ('armR', kf(u, [[0, -0.14], [0.14, -0.35], [0.24, -1.4], [0.8, -1.35], [1, -1.0]]) + jit, 0, kf(u, [[0, 0.1], [0.14, 0.25], [0.24, 0.05], [1, 0.08]]));
            setJ('elbowR', kf(u, [[0, -0.5], [0.14, -1.4], [0.24, -0.12], [0.8, -0.18], [1, -0.4]])); setJ('wristR', -0.1);
            P.staffP.t = kf(u, [[0, -0.04], [0.14, 0.9], [0.24, 1.52], [0.8, 1.5], [1, 1.2]]) + jit * 2;
            P.staffY.t = kf(u, [[0, 0], [0.14, 0.35], [0.24, -0.18], [1, -0.1]]); P.staffR.t = -0.04;
            P.gripL.t = kf(u, [[0, 0], [0.14, 1], [1, 1]]); P.gripY.t = kf(u, [[0, 0.3], [0.24, 0.62], [1, 0.55]]); P.curlL.t = 1;
            setJ('pelvis', 0, kf(u, [[0, 0], [0.14, 0.75], [0.24, 0.55], [0.85, 0.5], [1, 0.2]]));
            setJ('spine', kf(u, [[0, 0], [0.14, -0.06], [0.24, 0.08], [1, 0.04]]), kf(u, [[0, 0], [0.24, -0.1], [1, -0.05]]));
            setJ('chest', kf(u, [[0, 0], [0.14, -0.12], [0.24, 0.1], [0.8, 0.08], [1, 0.03]]) + jit, kf(u, [[0, 0], [0.14, 0.1], [0.24, -0.15], [1, -0.08]]));
            setJ('neck', 0, kf(u, [[0, 0], [0.24, -0.25], [1, -0.1]])); setJ('head', kf(u, [[0, 0], [0.14, -0.08], [0.24, 0.02], [1, 0]]), kf(u, [[0, 0], [0.14, -0.4], [0.24, -0.35], [1, -0.12]]));
            setJ('hipL', kf(u, [[0, 0], [0.14, -0.15], [0.24, -0.62], [0.85, -0.6], [1, -0.25]]), 0, -0.12); setJ('kneeL', kf(u, [[0, 0.05], [0.24, 0.62], [0.85, 0.6], [1, 0.3]]));
            setJ('hipR', kf(u, [[0, 0], [0.14, 0.15], [0.24, 0.55], [0.85, 0.5], [1, 0.2]]), 0, 0.14); setJ('kneeR', kf(u, [[0, 0.05], [0.24, 0.15], [1, 0.1]]));
            autoFoot(1); plant();
            P.bodyZ.t = kf(u, [[0, 0], [0.14, -0.06], [0.24, 0.16], [0.8, 0.1], [1, 0.04]]) - dis * 0.03; P.pitch.t = kf(u, [[0, 0], [0.14, -0.04], [0.24, 0.1], [1, 0.03]]);
            P.magic.t = kf(u, [[0, 0.2], [0.2, 0.9], [0.3, 1.2], [0.8, 1], [1, 0.3]]); P.flare.t = kf(u, [[0, 0], [0.24, 0.8], [0.8, 0.6], [1, 0.2]]);
            P.wind.t = kf(u, [[0, 0], [0.24, 0.85], [0.8, 0.7], [1, 0]]);
            P.furrow.t = 0.75; P.lid.t = kf(u, [[0, 0.9], [0.22, 0.5], [0.8, 0.5], [1, 0.85]]); P.mouth.t = kf(u, [[0, 0], [0.18, 0.5], [0.3, 0.75], [0.7, 0.55], [0.85, 0], [1, 0]]);
          } else if (kind === 'flight') {
            // impulso de decolagem: agacha e abre os braços para o alto
            const u = clamp(poseTime / 0.48, 0, 1), crouch = kf(u, [[0, 0], [0.3, 1], [0.55, 0.2], [1, 0]]);
            setJ('hipL', -0.7 * crouch, 0, -0.08); setJ('kneeL', 1.2 * crouch); setJ('hipR', -0.6 * crouch, 0, 0.08); setJ('kneeR', 1.1 * crouch);
            autoFoot(1); plant();
            setJ('armL', kf(u, [[0, 0.03], [0.3, 0.3], [0.6, -2.4], [1, -2.2]]), 0, kf(u, [[0, -0.1], [0.6, -0.7], [1, -0.6]])); setJ('elbowL', -0.15);
            setJ('armR', kf(u, [[0, -0.14], [0.3, 0.1], [0.6, -1.9], [1, -1.7]]), 0, kf(u, [[0, 0.1], [0.6, 0.5], [1, 0.45]])); setJ('elbowR', -0.3);
            P.staffP.t = kf(u, [[0, -0.04], [0.6, 0.4], [1, 0.3]]); setJ('chest', kf(u, [[0, 0], [0.3, 0.2], [0.6, -0.2], [1, -0.12]])); setJ('head', kf(u, [[0, 0], [0.3, 0.15], [0.6, -0.3], [1, -0.2]]));
            P.magic.t = kf(u, [[0, 0], [0.6, 0.8], [1, 0.4]]); P.flare.t = kf(u, [[0, 0], [0.6, 0.8], [1, 0.4]]); P.wind.t = kf(u, [[0, 0], [0.6, 0.6], [1, 0.4]]); P.smile.t = 0.4;
          } else {
            const u = clamp(poseTime / 0.58, 0, 1);
            setJ('armR', kf(u, [[0, -0.14], [0.22, -0.75], [0.4, -1.5], [1, -1.35]]), 0, kf(u, [[0, 0.1], [0.4, 0.05], [1, 0.05]]));
            setJ('elbowR', kf(u, [[0, -0.5], [0.22, -1.0], [0.4, -0.35], [1, -0.4]])); setJ('wristR', -0.2);
            P.staffP.t = kf(u, [[0, -0.04], [0.22, -0.5], [0.4, 1.05], [1, 0.95]]);
            setJ('armL', kf(u, [[0, 0.03], [0.25, -0.4], [0.4, -1.25], [1, -1.15]]), 0, kf(u, [[0, -0.09], [0.4, -0.45], [1, -0.4]]));
            setJ('elbowL', kf(u, [[0, -0.2], [0.4, -0.45], [1, -0.4]])); setJ('wristL', -0.1);
            P.curlL.t = 0;
            setJ('chest', kf(u, [[0, 0], [0.22, -0.14], [0.4, 0.1], [1, 0.05]]), -0.12);
            setJ('head', kf(u, [[0, 0], [0.22, -0.18], [0.4, -0.05], [1, -0.08]]));
            setJ('hipL', -0.25, 0, -0.1); setJ('kneeL', 0.3); setJ('hipR', 0.2, 0, 0.1); setJ('kneeR', 0.25);
            autoFoot(1); plant();
            P.pitch.t = kf(u, [[0, 0], [0.22, -0.06], [0.4, 0.05], [1, 0.03]]);
            P.magic.t = kf(u, [[0, 0], [0.25, 0.6], [0.45, 1], [1, 0.85]]);
            P.lid.t = 0.95; P.furrow.t = 0.2; P.flare.t = 0.3;
          }
          break;
        }
        case 'hit': {
          // impacto → tronco torce para um lado, cabeça chicoteia, passo para trás para recuperar o equilíbrio → volta
          const u = clamp(poseTime / 0.45, 0, 1);
          const e = kf(u, [[0, 0], [0.1, 1], [0.35, 0.6], [0.7, 0.18], [1, 0]]), step = kf(u, [[0, 0], [0.15, 0.2], [0.4, 1], [0.75, 0.6], [1, 0]]);
          setJ('chest', -0.42 * e, 0.32 * e * hitSide, 0.12 * e * hitSide); setJ('spine', -0.14 * e, 0.1 * e * hitSide); setJ('neck', -0.2 * e, 0, 0.1 * e * hitSide);
          setJ('head', -0.42 * e + 0.12 * step, -0.25 * e * hitSide, 0.18 * e * hitSide);
          setJ('hipL', 0.35 * step * (hitSide > 0 ? 1 : 0.2), 0, -0.05); setJ('kneeL', 0.3 * e + 0.25 * step);
          setJ('hipR', 0.35 * step * (hitSide < 0 ? 1 : 0.2), 0, 0.05); setJ('kneeR', 0.3 * e + 0.25 * step);
          autoFoot(1); plant();
          setJ('armL', 0.45 * e + 0.03, 0, -0.55 * e - 0.09); setJ('elbowL', -0.2 - 0.5 * e); setJ('wristL', 0.3 * e);
          setJ('armR', -0.05 + 0.35 * e, 0, 0.1 + 0.3 * e); setJ('elbowR', -0.5 - 0.3 * e); setJ('wristR', -0.4);
          P.bodyZ.t = -0.18 * e - 0.08 * step; P.bodyX.t = 0.06 * e * hitSide; P.pitch.t = -0.12 * e; P.roll.t = 0.08 * e * hitSide; P.staffP.t = -0.04 - 0.25 * e;
          P.lid.t = lerp(0.85, 0.15, e); P.furrow.t = 0.9 * e + 0.2; P.brow.t = 0.6 * e; P.mouth.t = 0.7 * e; P.ear.t = -0.6 * e; P.flare.t = 0.35 * e;
          break;
        }
        case 'defeat': {
          // joelhos cedem → tronco desaba para a frente → corpo tomba de lado e relaxa no chão, olhos fechando
          const buckle = kf(poseTime, [[0, 0], [0.4, 1], [1.4, 1]]);
          const fall = kf(poseTime, [[0, 0], [0.45, 0], [1.05, 1], [1.4, 1]]);
          const settle = kf(poseTime, [[0, 0], [1.05, 0], [1.25, 1], [1.6, 0.85]]);
          setJ('hipL', lerp(0, -0.25, buckle) + 0.35 * fall, 0, -0.04 - 0.15 * fall); setJ('hipR', lerp(0, -0.1, buckle) + 0.15 * fall, 0, 0.1 + 0.2 * fall);
          setJ('kneeL', lerp(0, 1.55, buckle) - 0.9 * fall); setJ('kneeR', lerp(0, 1.4, buckle) - 0.6 * fall);
          J.ankleL.x.t = 0.55 * buckle; J.ankleR.x.t = 0.45 * buckle;
          P.bodyY.t = -0.52 * buckle - 0.42 * fall - 0.02 * settle;
          P.pitch.t = 0.35 * buckle * (1 - fall) - 1.48 * fall; P.roll.t = 0.45 * fall; P.bodyX.t = 0.15 * fall;
          setJ('spine', 0.35 * buckle * (1 - fall) + 0.05 * settle, 0.15 * fall); setJ('chest', 0.5 * buckle * (1 - fall) - 0.1 * fall, 0.2 * fall);
          setJ('neck', 0.25 * buckle * (1 - fall)); setJ('head', 0.55 * buckle * (1 - fall) + 0.1 * fall, 0.55 * fall, 0.15 * fall);
          setJ('armL', 0.15 - 0.6 * fall, 0, -0.25 - 0.9 * fall); setJ('elbowL', -0.3 - 0.4 * fall);
          setJ('armR', 0.1 - 0.2 * fall, 0, 0.25 + 0.5 * fall); setJ('elbowR', -0.3 - 0.6 * fall); setJ('wristR', 0.1);
          P.staffP.t = -0.04; P.staffR.t = -0.4 - 1.1 * fall; P.curlR.t = 1 - 0.8 * fall; P.curlL.t = 0.15;
          P.lid.t = lerp(0.78, 0.0, kf(poseTime, [[0, 0], [0.4, 0.35], [1.1, 1]]));
          P.mouth.t = 0.25 * buckle * (1 - fall); P.ear.t = -0.8 * buckle; P.furrow.t = 0.5 * buckle * (1 - fall);
          break;
        }
        case 'fly': {
          // voo dependente da velocidade: pairando = ereta, pernas soltas balançando; rápido = mergulho deitado,
          // pernas esticadas para trás; subindo inclina para trás, descendo mergulha; strafe inclina para o lado
          const fwdSp = vL.z, sideSp = vL.x, up = clamp(sVel.y, -14, 14);
          const move = clamp(Math.hypot(fwdSp, sideSp) / 11, 0, 1), dash = smoothstep01(clamp((planar - 9) / 5, 0, 1));
          const back = fwdSp < -1 ? clamp(-fwdSp / 8, 0, 1) : 0;
          const hover = 1 - move, bob = sin(time * 1.9);
          P.pitch.t = 0.06 + move * (0.55 + dash * 0.5) * (1 - back * 1.4) - up * 0.035 * (0.4 + move * 0.6);
          P.roll.t = clamp(-sideSp * 0.055, -0.5, 0.5);
          P.bodyY.t = 0.42 + bob * 0.07 * hover;
          P.bodyX.t = sin(time * 0.9) * 0.03 * hover;
          // tronco e cabeça compensam a inclinação para continuar olhando à frente
          const comp = P.pitch.t;
          setJ('spine', -0.05 * move, 0, -P.roll.t * 0.3); setJ('chest', -0.1 - 0.12 * move, -sideSp * 0.02);
          setJ('neck', -comp * 0.35); setJ('head', -comp * 0.45 + 0.05, -sideSp * 0.03);
          // pernas: pairando = penduradas com chutinhos alternados; rápido = juntas e estendidas atrás
          const k1 = sin(time * 2.1), k2 = sin(time * 2.1 + 1.6);
          setJ('hipL', lerp(0.18 + k1 * 0.12, 0.28, move), 0, lerp(-0.08, -0.03, move)); setJ('kneeL', lerp(0.55 + max(0, k1) * 0.3, 0.12, move));
          setJ('hipR', lerp(-0.05 + k2 * 0.12, 0.2, move), 0, lerp(0.08, 0.03, move)); setJ('kneeR', lerp(0.75 + max(0, k2) * 0.3, 0.22, move));
          J.ankleL.x.t = lerp(0.5, 0.75, move); J.ankleR.x.t = lerp(0.55, 0.8, move);
          // braços: pairando = esquerdo aberto equilibrando; rápido = esquerdo junto ao corpo, cajado apontado à frente
          setJ('armL', lerp(-0.35 + bob * 0.06, 0.45, move), 0, lerp(-0.75, -0.18, move)); setJ('elbowL', lerp(-0.45, -0.2, move)); setJ('wristL', 0.15);
          setJ('armR', lerp(-0.55, -1.25, move), 0, lerp(0.35, 0.12, move)); setJ('elbowR', lerp(-0.7, -0.25, move)); setJ('wristR', -0.2);
          P.staffP.t = lerp(0.35, 1.45, move) + up * 0.015; P.staffR.t = lerp(-0.25, 0, move); P.staffY.t = 0;
          // vento: cabelo e casaco esvoaçam conforme a velocidade
          P.wind.t = 0.25 + move * 0.55 + dash * 0.25; P.flare.t = 0.25 + move * 0.25 + max(0, -up) * 0.03;
          P.smile.t = 0.35 + dash * 0.2; P.lid.t = 0.85 - dash * 0.1; P.magic.t = 0.25 + dash * 0.2;
          // transição de entrada: pernas encolhidas e braços abrindo, dissolvendo na pose de voo
          const ent = poseTime < 0.7 ? 1 - smoothstep01(poseTime / 0.7) : 0;
          if (ent > 0) {
            addJ('hipL', -0.5 * ent); addJ('kneeL', 0.7 * ent); addJ('hipR', -0.4 * ent); addJ('kneeR', 0.6 * ent);
            addJ('armL', -0.9 * ent, 0, -0.3 * ent); P.pitch.t -= 0.25 * ent; P.flare.t += 0.4 * ent;
          }
          break;
        }
      }

      /* ---- camadas globais sobre qualquer pose */
      if (pose !== 'dodge' && pose !== 'defeat') {
        P.pitch.t += A_LEAN;
        P.roll.t += clamp(-turnVel * 0.018, -0.3, 0.3);
      }
      if (pose === 'idle' || pose === 'walk' || pose === 'run' || pose === 'guard') {
        // cabeça/tronco "puxam" a curva antes do corpo
        addJ('head', 0, clamp(facingErr * 0.5, -0.5, 0.5));
        addJ('chest', 0, clamp(facingErr * 0.2, -0.2, 0.2));
      }
      /* ---- Zoltraak: carregar (cajado apontado, mão esquerda firmando, tremor crescente) e disparar (postura travada, recuo) */
      if (overlay && pose !== 'defeat' && pose !== 'hit' && pose !== 'dodge') {
        clipT.armL = 0; clipT.torso = 0;
        const pw = clamp(overlay.power, 0, 1), still = pose === 'idle' || pose === 'land';
        if (overlay.mode === 'shield') {
          // segurando a barreira: cajado erguido ao lado, mão esquerda espalmada à frente; treme quando a barreira está fraca
          const strain = (1 - pw) * (sin(time * 41) * 0.03);
          setJ('armR', -0.45, 0, 0.16); setJ('elbowR', -1.15); setJ('wristR', -0.1); P.staffP.t = 0.08; P.staffR.t = -0.1; P.staffY.t = 0;
          setJ('armL', -1.38 + strain, 0, -0.16); setJ('elbowL', -0.15); setJ('wristL', -1.0); P.curlL.t = 0;
          setJ('chest', 0.06 + strain, -0.22); setJ('head', 0.04, 0.1);
          P.magic.t = 0.7; P.flare.t = 0.25; P.furrow.t = 0.4 + (1 - pw) * 0.5; P.lid.t = 0.9;
          if (still) { setJ('hipL', -0.3, 0, -0.1); setJ('kneeL', 0.45); setJ('hipR', 0.28, 0, 0.1); setJ('kneeR', 0.32); setJ('pelvis', 0, 0.2); autoFoot(1); plant(); }
        } else if (overlay.mode === 'charge') {
          const tremor = sin(time * 37) * (0.004 + pw * pw * 0.022) + (pw >= 0.999 ? sin(time * 61) * 0.012 : 0);
          setJ('armR', -1.05 - pw * 0.2, 0, 0.14); setJ('elbowR', -0.7 + pw * 0.2); setJ('wristR', -0.15);
          P.staffP.t = 1.2 + pw * 0.2 + tremor * 3; P.staffY.t = -0.05; P.staffR.t = -0.04;
          P.gripL.t = 1; P.gripY.t = 0.5 + pw * 0.25; P.curlL.t = 0.7;
          setJ('chest', 0.04 + pw * 0.08 + tremor, -0.12 + J.chest.y.t * 0.3, tremor * 0.5); setJ('spine', 0.04 + pw * 0.06); setJ('neck', 0.02, 0.06);
          setJ('head', 0.06 + pw * 0.04 + tremor, 0.04);
          P.magic.t = 0.3 + pw * 0.7; P.flare.t = 0.1 + pw * 0.35; P.wind.t = pw * 0.2;
          P.furrow.t = 0.3 + pw * 0.6; P.lid.t = 0.95 - pw * 0.1; P.mouth.t = pw > 0.95 ? 0.18 : 0; P.smile.t = 0;
          if (still) {
            setJ('hipL', -0.12 - 0.25 * pw, 0, -0.08 - 0.06 * pw); setJ('kneeL', 0.12 + 0.45 * pw);
            setJ('hipR', 0.1 + 0.22 * pw, 0, 0.08 + 0.06 * pw); setJ('kneeR', 0.1 + 0.35 * pw);
            setJ('pelvis', 0, 0.18 * pw); autoFoot(1); plant();
          }
        } else {
          const kick = sin(time * 52) * (0.01 + pw * 0.02);
          setJ('armR', -1.4, 0, 0.1); setJ('elbowR', -0.22 + kick); setJ('wristR', -0.1);
          P.staffP.t = 1.5 + kick * 2; P.staffY.t = -0.04; P.staffR.t = 0;
          P.gripL.t = 1; P.gripY.t = 0.42; P.curlL.t = 1;
          setJ('chest', 0.14 + kick, -0.1, kick * 0.6); setJ('spine', 0.08); setJ('neck', 0.04); setJ('head', 0.08 + kick * 0.5, 0.03);
          P.pitch.t += 0.04 + 0.04 * pw; P.bodyZ.t -= (0.03 + 0.06 * pw) * (1 + sin(time * 30) * 0.3);   // recuo
          P.magic.t = 1; P.flare.t = 0.3 + pw * 0.35; P.wind.t = 0.25 + pw * 0.2;              // tecido e cabelo soprados para trás
          P.furrow.t = 0.85; P.lid.t = 0.85; P.mouth.t = 0.35 + pw * 0.4; P.smile.t = 0;
          if (still) {
            setJ('hipL', -0.45, 0, -0.12); setJ('kneeL', 0.62); setJ('hipR', 0.42, 0, 0.12); setJ('kneeR', 0.45);
            setJ('pelvis', 0, 0.22); autoFoot(1); plant();
          }
        }
      }

      /* ---- cajado nas costas / troca animada */
      if (swapT >= 0) {
        swapT += dt;
        const u = clamp(swapT / 0.6, 0, 1);
        // mão direita alcança por cima do ombro, agarra/solta o cajado e volta
        setJ('armR', kf(u, [[0, -0.1], [0.42, -2.55], [0.55, -2.5], [1, -0.2]]), 0, kf(u, [[0, 0.1], [0.42, -0.35], [0.55, -0.3], [1, 0.1]]));
        setJ('elbowR', kf(u, [[0, -0.4], [0.42, -2.1], [0.55, -2.0], [1, -0.45]])); setJ('wristR', kf(u, [[0, 0], [0.42, -0.4], [1, -0.3]]));
        addJ('chest', 0, kf(u, [[0, 0], [0.42, 0.28], [1, 0]]), kf(u, [[0, 0], [0.42, -0.08], [1, 0]])); addJ('head', 0, kf(u, [[0, 0], [0.42, 0.35], [1, 0]]));
        P.curlR.t = kf(u, [[0, 1], [0.35, 0.1], [0.5, 1], [1, 1]]); P.gripL.t = 0;
        if (u >= 0.5 && staffEquipped !== swapTo) placeStaff(swapTo);
        if (u >= 1) swapT = -1;
      } else if (!staffEquipped && pose !== 'defeat' && pose !== 'hit' && pose !== 'dodge') {
        // sem cajado: braço direito espelha o esquerdo (balanço natural e oposto ao andar)
        setJ('armR', J.armL.x.t * (pose === 'walk' || pose === 'run' ? -1 : 1), 0, -J.armL.z.t); setJ('elbowR', J.elbowL.x.t); setJ('wristR', 0.05);
        P.curlR.t = 0.35; P.gripL.t = 0;
      }

      // dedos: cada mão acompanha o alvo de "curl"
      // ouvidinhos: twitch ocasional
      earWait -= dt;
      if (earWait <= 0) { P.ear.v += 0.45; earWait = 2.5 + Math.random() * 5; }
      // piscar
      if (blinkWait > 0) blinkWait -= dt;
      else { blinkP += dt / 0.15; if (blinkP >= 1) { blinkP = 0; blinkWait = 1.8 + Math.random() * 4; } }
      const blink = blinkWait > 0 ? 0 : sin(blinkP * PI);

      /* ---- integração das molas */
      const [k0, zeta] = overlay && (pose === 'idle' || pose === 'walk' || pose === 'land') ? [620, 0.8] as const : SPRING[pose];
      const steps = min(8, Math.ceil(dt / (1 / 180)));
      const h = dt / steps;
      // evita "desenrolar" a cambalhota completa ao sair do dodge
      if (pose !== 'dodge' && P.pitch.v > PI) P.pitch.v -= TAU;
      const kSoft = 160, dSoft = 2 * sqrt(kSoft);
      for (let s = 0; s < steps; s++) {
        for (const n of JOINTS) {
          const j = J[n]; const k = k0 * JOINT_K[n]; const d = 2 * zeta * sqrt(k);
          stepChan(j.x, k, d, h); stepChan(j.y, k, d, h); stepChan(j.z, k, d, h);
        }
        const dHard = 2 * zeta * sqrt(k0);
        for (const n of HARD_PARAMS) stepChan(P[n], k0, dHard, h);
        for (const n of SOFT_PARAMS) stepChan(P[n], kSoft, dSoft, h);
      }

      /* ---- aplica no esqueleto */
      for (const n of JOINTS) { const j = J[n]; j.node.rotation.set(j.x.v, j.y.v, j.z.v); }
      // com mocap nas pernas, o "afundar" procedural do quadril é reduzido (o clipe já sobe/desce o quadril)
      pivot.position.set(P.bodyX.v, PIV + P.bodyY.v * (1 - (xb ? xb.w.legs * 0.9 : 0)), P.bodyZ.v);
      pivot.rotation.set(P.pitch.v, 0, P.roll.v);
      if (xb) { xbSample(dt); xbApply(); }

      // dedos
      const curls = [P.curlL.v, P.curlR.v];
      hands.forEach((hd, i) => {
        const c = clamp(curls[i], 0, 1);
        hd.fingers.forEach((f, fi) => {
          f.prox.rotation.x = -(0.12 + c * 1.2) - fi * 0.02 * c;
          f.dist.rotation.x = -(0.1 + c * 1.05);
        });
        hd.thumb.rotation.x = -(0.15 + c * 0.6);
        hd.thumb.rotation.z = (i === 0 ? -1 : 1) * (0.5 - c * 0.25);
      });

      /* ---- cajado: orientação em espaço-mundo, independente da lag das molas do braço */
      if (staff.parent === staffMount) {
        staffMount.getWorldQuaternion(qParent);
        root.getWorldQuaternion(qRoot);
        eul.set(P.staffP.v, P.staffY.v, P.staffR.v, 'YXZ');
        qDesired.setFromEuler(eul).premultiply(qRoot);
        staff.quaternion.copy(qParent).invert().multiply(qDesired);
      }

      /* ---- IK da mão esquerda segurando o cajado */
      const g = staffEquipped ? clamp(P.gripL.v, 0, 1) : 0;
      if (g > 0.01) {
        staff.updateWorldMatrix(true, false);
        const frame = xb ? xb.chestSocket : chest;
        frame.updateWorldMatrix(true, false);
        tmp.set(0, P.gripY.v, 0.0);
        staff.localToWorld(tmp);
        frame.worldToLocal(tmp);
        const sh = xb ? frame.worldToLocal(xb.shoulderL.getWorldPosition(new THREE.Vector3())) : armNodes[0].position;
        solveArm(tmp.x - sh.x, tmp.y - sh.y, tmp.z - sh.z, ik);
        const fkX = J.armL.x.v, fkZ = J.armL.z.v, fkE = J.elbowL.x.v;
        J.armL.node.rotation.x = fkX + g * wrapAngle(ik.x - fkX);
        J.armL.node.rotation.z = lerp(fkZ, ik.z, g);
        J.elbowL.node.rotation.x = lerp(fkE, ik.e, g);
        if (xb) xbApply(); // braço esquerdo corrigido pelo IK
      }

      /* ---- expressão */
      const lidRot = lerp(1.15, -0.32, clamp(P.lid.v, 0, 1.1));
      const lidFinal = lerp(lidRot, 1.15, blink);
      for (const l of lids) l.rotation.x = lidFinal;
      brows.forEach((b, i) => {
        const side = i === 0 ? -1 : 1;
        b.position.y = BROW_Y + P.brow.v * 0.02 - P.furrow.v * 0.012;
        b.rotation.z = side * P.furrow.v * 0.35;
      });
      const gaze = clamp(-J.head.y.v * 0.8, -1, 1);
      saccadeWait -= dt;
      if (saccadeWait <= 0) { saccadeWait = 0.6 + Math.random() * 2.6; saccade.tx = (Math.random() - 0.5) * 0.012; saccade.ty = (Math.random() - 0.5) * 0.006; }
      saccade.x += (saccade.tx - saccade.x) * min(1, dt * 30); saccade.y += (saccade.ty - saccade.y) * min(1, dt * 30);
      for (const ir of irises) { ir.position.x = gaze * 0.012 + saccade.x; ir.position.y = -0.003 + saccade.y; }
      mouthLine.scale.set(1, clamp(0.25 + P.smile.v * 0.9, 0.05, 1.2), 1);
      mouthLine.visible = P.mouth.v < 0.25;
      mouthOpen.visible = P.mouth.v > 0.06;
      mouthOpen.scale.set(1.1, 0.15 + clamp(P.mouth.v, 0, 1) * 1.3, 0.5);
      ears.forEach((e, i) => { const side = i === 0 ? -1 : 1; e.rotation.z = side * P.ear.v * 0.5; e.rotation.x = -P.ear.v * 0.15; });

      /* ---- física secundária */
      const flare = P.flare.v + clamp(-sVel.y * 0.08, 0, 0.9);
      const fx = clamp(-aL.x * 0.018 - vL.x * 0.1, -4, 4);
      const fz = clamp(-aL.z * 0.018 - vL.z * 0.115 - P.wind.v * 3.2, -5, 5);
      const fL = -J.hipL.x.v, fR = -J.hipR.x.v;
      for (const p of panels) {
        const nz = cos(p.phi);
        const demand = max(0, sin(fL) * 0.9 * nz, sin(fR) * 0.9 * nz);
        p.chain.restX = -min(0.42, 0.1 + demand * 0.9 + flare * 0.25 + P.magic.v * 0.15);
      }
      cape.restX = -min(0.4, 0.06 + flare * 0.3 + P.magic.v * 0.15);
      for (const t of tails) {
        t.chain.restZ = t.side * (0.12 + min(P.magic.v, 1) * 0.06 + min(flare, 1) * 0.04);
        t.chain.restX = P.wind.v * 0.12 - min(P.magic.v, 1) * 0.04;
      }
      for (const l of sideLocks) l.chain.restZ = l.side * (0.1 + P.magic.v * 0.2);
      for (let s = 0; s < steps; s++) for (const ch of chains) stepChain(ch, h, fx, fz, time);
      for (const ch of chains) ch.segs.forEach((seg, i) => seg.rotation.set(ch.x[i], 0, ch.z[i]));

      /* ---- brilho do foco, halos de magia, luz */
      const magic = clamp(P.magic.v, 0, 1.2);
      focus.scale.setScalar(0.93 + sin(time * 1.8) * 0.08 + magic * 0.35);
      mat.glow.emissiveIntensity = 1.2 + magic * 1.6 + sin(time * 5) * 0.1 * magic;
      aura.intensity = 0.85 + magic * 1.6;
      const showHalo = magic > 0.12;
      haloA.visible = haloB.visible = showHalo;
      if (showHalo) {
        haloA.scale.setScalar(0.4 + magic * 0.7); haloB.scale.setScalar(0.3 + magic * 0.8);
        haloA.rotation.set(time * 1.6, time * 0.9, 0); haloB.rotation.set(-time * 1.1, 0.8, time * 1.4);
        mat.halo.opacity = clamp(magic * 0.8, 0, 0.8);
      }
    },
  };
}   