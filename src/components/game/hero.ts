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
export type HeroRig = { root: THREE.Group; spellPoint: THREE.Object3D; update: (time: number, delta: number, pose: HeroPose, speed?: number) => void };

/** Liga/desliga o contorno "anime" (casca invertida). Desligar economiza ~1/3 dos draw calls. */
const OUTLINES = true;

type V3 = [number, number, number];
type Key = readonly [number, number];

const { clamp, lerp } = THREE.MathUtils;
const { sin, cos, abs, max, min, sqrt, PI } = Math;
const TAU = PI * 2;

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
  attack: [1500, 0.62], dodge: [1000, 0.85], guard: [480, 0.9], cast: [720, 0.7], hit: [1300, 0.45], defeat: [150, 0.85], fly: [170, 0.9],
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
const ARM1 = 0.48;         // braço
const ARM2 = 0.56;         // antebraço + mão (até o centro do punho)

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

/** Painel fino trapezoidal (para saia/capa). */
function panelGeometry(topW: number, botW: number, len: number) {
  const g = new THREE.CylinderGeometry(topW / Math.SQRT2, botW / Math.SQRT2, len, 4, 1);
  g.rotateY(PI / 4);
  g.scale(1, 1, 0.14);
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
    wood: new THREE.MeshStandardMaterial({ color: '#644b35', roughness: 0.83 }),
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
  part(caps(0.16, 0.14, 12), mat.suit, pelvis, [0, 0, 0], { rot: [0, 0, PI / 2], scale: [1, 1, 0.86], outline: true });
  part(new THREE.TorusGeometry(0.215, 0.036, 8, 24), mat.leather, pelvis, [0, 0.1, 0], { rot: [PI / 2, 0, 0], scale: [1, 0.86, 1] });
  const clasp = part(new THREE.BoxGeometry(0.13, 0.11, 0.045), mat.metal, pelvis, [0, 0.1, 0.19]);

  const spine = new THREE.Group(); spine.position.y = 0.08; pelvis.add(spine); reg('spine', spine);
  part(caps(0.2, 0.12, 12), mat.suit, spine, [0, 0.15, 0], { scale: [1, 1, 0.8], outline: true });
  part(caps(0.225, 0.1, 12), mat.coat, spine, [0, 0.14, 0], { scale: [1, 1, 0.84], outline: true });

  const chest = new THREE.Group(); chest.position.y = 0.3; spine.add(chest); reg('chest', chest);
  part(caps(0.255, 0.18, 14), mat.suit, chest, [0, 0.1, 0], { scale: [1, 1, 0.78] });
  part(caps(0.285, 0.15, 14), mat.coat, chest, [0, 0.1, 0], { scale: [1.02, 1, 0.84], outline: true });
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

  part(new THREE.SphereGeometry(0.28, 24, 20), mat.skin, head, [0, 0.04, 0.015], { scale: [0.9, 1.05, 0.86], outline: true });
  part(new THREE.SphereGeometry(0.018, 8, 6), mat.skin, head, [0, -0.045, 0.238], { scale: [1, 1, 0.9] });   // nariz

  // olhos
  const lids: THREE.Group[] = [], irises: THREE.Group[] = [], brows: THREE.Group[] = [], ears: THREE.Group[] = [];
  const BROW_Y = 0.155;
  for (const side of [-1, 1] as const) {
    const eye = new THREE.Group(); eye.position.set(side * 0.105, 0.06, 0.222); head.add(eye);
    part(new THREE.SphereGeometry(0.06, 14, 12), mat.eyeWhite, eye, [0, 0, 0], { scale: [1.15, 0.95, 0.5], shadow: false });
    const iris = new THREE.Group(); iris.position.set(0, -0.004, 0.02); eye.add(iris); irises.push(iris);
    part(new THREE.SphereGeometry(0.042, 14, 12), mat.iris, iris, [0, 0, 0.0], { scale: [1, 1.15, 0.35], shadow: false });
    part(new THREE.SphereGeometry(0.02, 10, 8), mat.irisDark, iris, [0, 0, 0.012], { scale: [1, 1.1, 0.3], shadow: false });
    part(new THREE.SphereGeometry(0.009, 8, 6), mat.shine, iris, [0.012, 0.016, 0.02], { scale: [1, 1, 0.4], shadow: false });
    const lid = new THREE.Group(); eye.add(lid); lids.push(lid);
    part(new THREE.SphereGeometry(0.067, 14, 8, 0, TAU, 0, PI * 0.52), mat.skinD, lid, [0, 0, 0], { scale: [1.15, 0.95, 0.55], shadow: false });
    part(new THREE.TorusGeometry(0.068, 0.0085, 5, 14, PI), mat.lash, lid, [0, 0, 0.03], { scale: [1.15, 0.95, 1], shadow: false });
    const brow = new THREE.Group(); brow.position.set(side * 0.108, BROW_Y, 0.212); head.add(brow); brows.push(brow);
    part(caps(0.011, 0.06, 6), mat.hairShade, brow, [0, 0, 0], { rot: [0, 0, PI / 2], shadow: false });
  }
  // boca
  const mouthLine = part(new THREE.TorusGeometry(0.03, 0.006, 5, 12, PI), mat.lip, head, [0, -0.098, 0.226], { rot: [0, 0, PI], shadow: false });
  const mouthOpen = part(new THREE.SphereGeometry(0.02, 10, 8), mat.mouthIn, head, [0, -0.11, 0.222], { scale: [1, 0.2, 0.4], shadow: false });
  mouthOpen.visible = false;

  // orelhas de elfa + brincos (com física)
  for (const side of [-1, 1] as const) {
    const earG = new THREE.Group(); earG.position.set(side * 0.255, 0.065, -0.03); earG.rotation.y = side * 0.5; head.add(earG); ears.push(earG);
    const earGeo = new THREE.ConeGeometry(0.055, 0.32, 8); earGeo.translate(0, 0.16, 0);
    part(earGeo, mat.skin, earG, [0, 0, 0], { rot: [0, 0, -side * (PI / 2 - 0.28)], scale: [1, 1, 0.42], outline: true });
    chains.push(makeChain(head, [side * 0.278, -0.015, -0.03], [0.06, 0.06], (seg, i) => {
      if (i === 0) part(new THREE.SphereGeometry(0.016, 8, 6), mat.metal, seg, [0, 0, 0]);
      part(new THREE.CylinderGeometry(0.008, 0.008, 0.05, 5), mat.metal, seg, [0, -0.03, 0], { shadow: false });
      if (i === 1) part(new THREE.OctahedronGeometry(0.022, 0), mat.glow, seg, [0, -0.07, 0], { scale: [0.8, 1.4, 0.8] });
    }, { k: 70, c: 5, gain: 9, limit: 1.1, lag: 40, air: 0.9, breeze: 0.25, seed: side * 3 }));
  }

  // cabelo: calota + volume traseiro + franja de cones
  part(new THREE.SphereGeometry(0.315, 22, 16, 0, TAU, 0, PI * 0.55), mat.hair, head, [0, 0.085, -0.03], { rot: [-0.6, 0, 0], scale: [1.04, 1.04, 1.06], outline: true });
  part(new THREE.SphereGeometry(0.3, 16, 14), mat.hair, head, [0, -0.04, -0.12], { scale: [1.0, 1.25, 0.85], outline: true });
  for (let i = 0; i < 9; i++) {
    const a = (i - 4) * 0.26;
    const bang = part(new THREE.ConeGeometry(0.052 + (i % 3) * 0.006, 0.2 + (i % 2) * 0.03, 6), i % 3 === 1 ? mat.hairShade : mat.hair, head,
      [sin(a) * 0.275, 0.265 - abs(a) * 0.04, cos(a) * 0.255 + 0.0]);
    bang.rotation.order = 'YXZ'; bang.rotation.set(PI - 0.25, a, 0);
    bang.castShadow = true;
  }
  // diadema discreta + gema
  part(new THREE.TorusGeometry(0.295, 0.016, 6, 22, PI * 1.05), mat.metal, head, [0, 0.225, -0.01], { rot: [PI / 2 - 0.25, 0, 0] });
  part(new THREE.OctahedronGeometry(0.05, 0), mat.glow, head, [0, 0.285, 0.265], { scale: [0.75, 1.3, 0.6] });

  // maria-chiquinhas (7 segmentos cada) e mechas laterais
  const tailLens = [0.2, 0.2, 0.2, 0.2, 0.18, 0.18, 0.16];
  const tails: { chain: Chain; side: number }[] = [];
  const sideLocks: { chain: Chain; side: number }[] = [];
  for (const side of [-1, 1] as const) {
    const chain = makeChain(head, [side * 0.3, 0.17, -0.1], tailLens, (seg, i, len) => {
      const r = lerp(0.085, 0.04, i / 6);
      const m = part(caps(r, max(0.01, len - 2 * r), 8), i % 2 ? mat.hair : mat.hairShade, seg, [0, -len / 2, 0], { scale: [1, 1, 0.75], outline: true });
      m.castShadow = true;
      for (const o of [-1, 1]) part(caps(r * 0.7, max(0.01, len * 0.9 - 1.4 * r), 6), o > 0 ? mat.hair : mat.hairShade, seg, [o * r * 0.8, -len / 2 - 0.01, -r * 0.2], { scale: [1, 1, 0.7] });
      if (i === 0) {
        part(new THREE.TorusGeometry(0.075, 0.022, 6, 12), mat.metal, seg, [0, -0.01, 0], { rot: [PI / 2, 0, 0] });
        part(new THREE.SphereGeometry(0.026, 8, 6), mat.glow, seg, [side * 0.07, 0.0, 0.0]);
      }
    }, { k: 26, c: 3.6, gain: 4.0, limit: 1.25, lag: 24, air: 1, breeze: 0.16, seed: side * 5 });
    chains.push(chain); tails.push({ chain, side });

    const lock = makeChain(head, [side * 0.24, 0.12, 0.12], [0.13, 0.13, 0.12], (seg, i, len) => {
      const r = lerp(0.052, 0.028, i / 2);
      part(caps(r, max(0.01, len - 2 * r), 6), i === 1 ? mat.hairShade : mat.hair, seg, [0, -len / 2, 0], { scale: [1, 1, 0.8], outline: i === 0 });
    }, { k: 55, c: 6, gain: 6.5, limit: 1.0, lag: 30, air: 0.8, breeze: 0.2, seed: side * 7 });
    chains.push(lock); sideLocks.push({ chain: lock, side });
  }

  /* ================================================================== PERNAS */
  for (const side of [-1, 1] as const) {
    const S = side < 0 ? 'L' : 'R';
    const hip = new THREE.Group(); hip.position.set(side * 0.15, -0.05, 0); pelvis.add(hip); reg(`hip${S}`, hip);
    part(new THREE.SphereGeometry(0.115, 12, 10), mat.suit, hip, [0, 0, 0]);
    part(caps(0.105, 0.3, 10), mat.suit, hip, [0, -0.26, 0], { outline: true });
    const knee = new THREE.Group(); knee.position.set(0, -THIGH, 0); hip.add(knee); reg(`knee${S}`, knee);
    part(new THREE.SphereGeometry(0.1, 10, 8), mat.suit, knee, [0, 0, 0]);
    part(caps(0.085, 0.28, 10), mat.suit, knee, [0, -0.2, 0], { outline: true });
    part(caps(0.1, 0.1, 10), mat.leather, knee, [0, -0.35, 0], { outline: true });
    part(new THREE.TorusGeometry(0.1, 0.014, 6, 14), mat.metal, knee, [0, -0.28, 0], { rot: [PI / 2, 0, 0] });
    const ankle = new THREE.Group(); ankle.position.set(0, -SHIN, 0); knee.add(ankle); reg(`ankle${S}`, ankle);
    part(caps(0.093, 0.17, 10), mat.leather, ankle, [0, -0.055, 0.07], { rot: [PI / 2, 0, 0], scale: [1, 1, 0.92], outline: true });
    part(new THREE.BoxGeometry(0.15, 0.045, 0.1), mat.leatherD, ankle, [0, -0.128, -0.035]);
    part(new THREE.SphereGeometry(0.06, 8, 6), mat.leatherD, ankle, [0, -0.09, 0.15], { scale: [1.4, 0.8, 1] });
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
    part(caps(0.115, 0.2, 10), mat.coat, arm, [0, -0.19, 0], { outline: true });
    part(new THREE.TorusGeometry(0.118, 0.014, 6, 16), mat.metal, arm, [0, -0.33, 0], { rot: [PI / 2, 0, 0] });
    part(caps(0.085, 0.3, 10), mat.suit, arm, [0, -0.3, 0]);
    const elbow = new THREE.Group(); elbow.position.set(0, -ARM1, 0); arm.add(elbow); reg(`elbow${S}`, elbow);
    part(new THREE.SphereGeometry(0.082, 10, 8), mat.suit, elbow, [0, 0, 0]);
    part(caps(0.075, 0.24, 10), mat.suit, elbow, [0, -0.22, 0], { outline: true });
    part(new THREE.TorusGeometry(0.082, 0.016, 6, 14), mat.metal, elbow, [0, -0.38, 0], { rot: [PI / 2, 0, 0] });
    const wrist = new THREE.Group(); wrist.position.set(0, -0.46, 0); elbow.add(wrist); reg(`wrist${S}`, wrist);
    buildHand(wrist, side);
    if (side > 0) wristR = wrist;
  }

  /* ================================================================== SAIA (painéis), CAPA, BOLSA */
  const PANELS = 8;
  const panels: { chain: Chain; phi: number }[] = [];
  for (let i = 0; i < PANELS; i++) {
    const phi = (i / PANELS) * TAU;
    const anchor = new THREE.Group(); anchor.rotation.y = phi; anchor.position.set(sin(phi) * 0.29, 0.06, cos(phi) * 0.24); pelvis.add(anchor);
    const lens = [0.24, 0.24, 0.22];
    const widths: [number, number][] = [[0.27, 0.3], [0.3, 0.33], [0.33, 0.38]];
    const chain = makeChain(anchor, [0, 0, 0], lens, (seg, j, len) => {
      part(panelGeometry(widths[j][0], widths[j][1], len), (i + j) % 2 ? mat.coatD : mat.coatShade, seg, [0, -len / 2, 0], { shadow: true });
      if (j === 2) part(new THREE.BoxGeometry(widths[j][1] * 0.98, 0.026, 0.02), mat.metalD, seg, [0, -len + 0.013, 0.0]);
    }, { k: 46, c: 6.2, gain: 6.5, limit: 1.2, lag: 22, yaw: phi, air: 0.75, breeze: 0.07, seed: i * 1.3 });
    chains.push(chain); panels.push({ chain, phi });
  }
  const cape = makeChain(chest, [0, 0.36, -0.2], [0.3, 0.28, 0.26], (seg, j, len) => {
    part(panelGeometry(0.46 + j * 0.03, 0.49 + j * 0.03, len), j % 2 ? mat.coatShade : mat.coatD, seg, [0, -len / 2, 0]);
    if (j === 2) part(new THREE.BoxGeometry(0.52, 0.026, 0.02), mat.metalD, seg, [0, -len + 0.013, 0]);
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
  part(new THREE.CylinderGeometry(0.036, 0.05, 2.3, 9), mat.wood, staff, [0, 0.25, 0], { outline: true });
  part(caps(0.054, 0.26, 8), mat.leather, staff, [0, 0, 0]);
  for (const y of [-0.17, 0.17, 0.45]) part(new THREE.TorusGeometry(0.052, 0.016, 6, 12), mat.metal, staff, [0, y, 0], { rot: [PI / 2, 0, 0] });
  part(new THREE.CylinderGeometry(0.052, 0.034, 0.12, 8), mat.metal, staff, [0, -0.86, 0]);
  part(new THREE.TorusGeometry(0.06, 0.02, 6, 12), mat.metal, staff, [0, 1.4, 0], { rot: [PI / 2, 0, 0] });
  part(new THREE.TorusGeometry(0.2, 0.03, 8, 24, PI), mat.metal, staff, [0, 1.66, 0], { rot: [0, 0, PI], outline: true });
  part(new THREE.TorusGeometry(0.16, 0.012, 6, 24), mat.metal, staff, [0, 1.68, 0]);
  const focus = part(new THREE.IcosahedronGeometry(0.105, 1), mat.glow, staff, [0, 1.68, 0]);
  for (const o of [-1, 1]) {
    const wg = new THREE.ConeGeometry(0.035, 0.26, 6);
    part(wg, mat.metal, staff, [o * 0.2, 1.84, 0], { rot: [0, 0, -o * 0.6] });
  }
  part(new THREE.ConeGeometry(0.03, 0.2, 6), mat.metal, staff, [0, 2.0, 0]);
  const spellPoint = new THREE.Object3D(); spellPoint.position.set(0, 1.7, 0.06); staff.add(spellPoint);
  const aura = new THREE.PointLight('#efdba9', 0.85, 4, 2); aura.position.set(0, 1.7, 0.1); staff.add(aura);
  const haloA = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.008, 5, 32), mat.halo); haloA.position.set(0, 1.68, 0); staff.add(haloA);
  const haloB = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.006, 5, 32), mat.halo); haloB.position.set(0, 1.68, 0); staff.add(haloB);
  haloA.visible = haloB.visible = false;
  chains.push(makeChain(staff, [0, 1.42, 0.07], [0.12, 0.12, 0.1], (seg, j, len) => {
    part(new THREE.BoxGeometry(0.05 - j * 0.008, len, 0.012), mat.clothD, seg, [0, -len / 2, 0]);
    if (j === 2) part(new THREE.SphereGeometry(0.022, 8, 6), mat.metal, seg, [0, -len, 0]);
  }, { k: 30, c: 3.2, gain: 4.5, limit: 1.3, lag: 22, air: 1, breeze: 0.18, seed: 31 }));

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
  const ik = { x: 0, z: 0, e: 0 };
  const qParent = new THREE.Quaternion(), qRoot = new THREE.Quaternion(), qDesired = new THREE.Quaternion();
  const eul = new THREE.Euler(0, 0, 0, 'YXZ');
  const tmp = new THREE.Vector3();

  return {
    root,
    spellPoint,
    update(time, delta, pose, speed = 0) {
      const dt = clamp(delta, 1 / 240, 1 / 20);
      if (pose !== activePose) { activePose = pose; poseTime = 0; }
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

      /* ---- alvos da pose */
      resetTargets();
      const A_LEAN = clamp(aL.z * 0.004, -0.12, 0.12);

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
          break;
        }
        case 'walk': {
          const rate = speed > 0.1 ? clamp(speed / 3.2, 0.6, 1.7) : 1.28;
          const A = speed > 0.1 ? clamp((speed / (TAU * rate)) * 0.95, 0.3, 0.62) : 0.42;
          phase += dt * rate;
          const phi = phase * TAU;
          const sL = sin(phi), cL = cos(phi), sR = -sL, cR = -cL;
          setJ('hipL', -sL * A + 0.03, 0, -0.015); setJ('hipR', -sR * A + 0.03, 0, 0.015);
          setJ('kneeL', 0.07 + max(0, cL) * (0.55 + A * 0.9)); setJ('kneeR', 0.07 + max(0, cR) * (0.55 + A * 0.9));
          autoFoot(0.8); plant();
          setJ('pelvis', 0, sL * 0.12, sL * 0.03);
          setJ('spine', 0.04, -sL * 0.06, -sL * 0.02);
          setJ('chest', 0.02, -sL * 0.14, -sL * 0.025);
          setJ('neck', 0, sL * 0.05, 0); setJ('head', -0.03, sL * 0.1, 0);
          P.bodyX.t = sL * 0.018;
          const B = 0.2 + A * 0.4;
          setJ('armL', sL * B, 0, -0.09); setJ('elbowL', -(0.22 + max(0, -sL) * 0.3)); setJ('wristL', 0.05);
          setJ('armR', -0.08 + sR * B * 0.3, 0, 0.1); setJ('elbowR', -0.5 - max(0, -sR) * 0.1); setJ('wristR', -0.4);
          P.staffP.t = 0.04 + sR * 0.05;
          P.pitch.t = clamp(planar * 0.02, 0, 0.14);
          break;
        }
        case 'run': {
          const rate = speed > 0.1 ? clamp(speed / 3.7, 0.8, 2.3) : 1.9;
          const A = speed > 0.1 ? clamp((speed / (TAU * rate)) * 1.1, 0.5, 0.9) : 0.7;
          phase += dt * rate;
          const phi = phase * TAU;
          const sL = sin(phi), cL = cos(phi), sR = -sL, cR = -cL;
          setJ('hipL', -sL * A, 0, -0.03); setJ('hipR', -sR * A, 0, 0.03);
          setJ('kneeL', 0.25 + max(0, cL) * 1.45); setJ('kneeR', 0.25 + max(0, cR) * 1.45);
          autoFoot(0.75); plant(abs(sin(phi)) * 0.1);
          setJ('pelvis', 0, sL * 0.2, sL * 0.05);
          setJ('spine', 0.08, -sL * 0.1, -sL * 0.03);
          setJ('chest', 0.12, -sL * 0.22, -sL * 0.04);
          setJ('neck', -0.05, sL * 0.08, 0); setJ('head', -0.12, sL * 0.14, 0);
          setJ('armL', sL * 0.78, 0, -0.1); setJ('elbowL', -(1.15 + max(0, -sL) * 0.3)); setJ('wristL', 0.1);
          setJ('armR', -0.2 + sR * 0.35, 0, 0.12); setJ('elbowR', -0.95); setJ('wristR', -0.4);
          P.staffP.t = -0.6; P.staffR.t = -0.2;
          P.pitch.t = 0.16 + clamp(planar * 0.012, 0, 0.1); P.smile.t = 0.1; P.furrow.t = 0.15;
          P.flare.t = 0.25;
          break;
        }
        case 'jump': {
          const u = poseTime;
          setJ('hipL', kf(u, [[0, 0.3], [0.14, -0.9], [0.5, -0.7]]), 0, -0.05); setJ('kneeL', kf(u, [[0, 0.1], [0.14, 1.3], [0.5, 1.1]]));
          setJ('hipR', kf(u, [[0, 0.35], [0.14, -0.25], [0.5, -0.2]]), 0, 0.05); setJ('kneeR', kf(u, [[0, 0.1], [0.14, 0.6], [0.5, 0.5]]));
          J.ankleL.x.t = 0.4; J.ankleR.x.t = 0.35;
          setJ('armL', kf(u, [[0, 0.2], [0.16, -1.9], [0.5, -1.5]]), 0, -0.55); setJ('elbowL', -0.35);
          setJ('armR', kf(u, [[0, 0.1], [0.16, -1.3], [0.5, -1.0]]), 0, 0.35); setJ('elbowR', -0.5); setJ('wristR', -0.3);
          setJ('chest', -0.12); setJ('spine', -0.05); setJ('head', -0.18); setJ('neck', -0.08);
          P.staffP.t = 0.35; P.staffR.t = -0.25;
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
          const u = clamp(poseTime / 0.42, 0, 1);
          const d = kf(u, [[0, 0.2], [0.3, 1], [1, 0]]);
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
          break;
        }
        case 'hit': {
          const u = clamp(poseTime / 0.28, 0, 1);
          const e = kf(u, [[0, 0], [0.12, 1], [0.45, 0.45], [1, 0]]);
          setJ('chest', -0.4 * e, 0.25 * e); setJ('spine', -0.12 * e); setJ('head', -0.45 * e, 0, 0.15 * e);
          setJ('hipL', 0.2 * e, 0, -0.03); setJ('kneeL', 0.35 * e); setJ('hipR', -0.25 * e, 0, 0.03); setJ('kneeR', 0.4 * e);
          autoFoot(1); plant();
          setJ('armL', 0.35 * e + 0.03, 0, -0.4 * e - 0.09); setJ('elbowL', -0.2);
          setJ('armR', -0.05 + 0.3 * e, 0, 0.1); setJ('elbowR', -0.5); setJ('wristR', -0.4);
          P.bodyZ.t = -0.15 * e; P.pitch.t = -0.1 * e; P.staffP.t = -0.04 - 0.2 * e;
          P.lid.t = 0.25; P.furrow.t = 0.8; P.mouth.t = 0.65 * e; P.ear.t = -0.5 * e; P.flare.t = 0.3 * e;
          break;
        }
        case 'defeat': {
          const kneel = kf(poseTime, [[0, 0], [0.45, 1], [1.2, 1]]);
          const fall = kf(poseTime, [[0, 0], [0.45, 0], [1.0, 1], [1.2, 1]]);
          setJ('hipL', lerp(0, -0.15, kneel) + 0.2 * fall, 0, -0.04); setJ('hipR', lerp(0, -0.15, kneel) + 0.2 * fall, 0, 0.04);
          setJ('kneeL', lerp(0, 1.65, kneel) - 1.1 * fall); setJ('kneeR', lerp(0, 1.6, kneel) - 1.05 * fall);
          J.ankleL.x.t = 0.5 * kneel; J.ankleR.x.t = 0.5 * kneel;
          P.bodyY.t = -0.55 * kneel - 0.38 * fall;
          P.pitch.t = -1.52 * fall;
          setJ('spine', 0.3 * kneel * (1 - fall)); setJ('chest', 0.45 * kneel * (1 - fall) - 0.1 * fall);
          setJ('head', 0.5 * kneel * (1 - fall), 0.3 * fall); setJ('neck', 0.2 * kneel * (1 - fall));
          setJ('armL', 0.1, 0, -0.2 - 0.6 * fall); setJ('elbowL', -0.3);
          setJ('armR', 0.1, 0, 0.2 + 0.7 * fall); setJ('elbowR', -0.3); setJ('wristR', 0.1);
          P.staffP.t = -0.04; P.staffR.t = -0.4 - 1.1 * fall; P.curlR.t = 1 - 0.7 * fall; P.curlL.t = 0.2;
          P.lid.t = lerp(0.78, 0.02, kf(poseTime, [[0, 0], [0.5, 0.3], [1.0, 1]]));
          P.mouth.t = 0.2 * kneel; P.ear.t = -0.7 * kneel;
          break;
        }
        case 'fly': {
          P.pitch.t = 0.65 + clamp(planar / 10, 0, 0.3);
          P.bodyY.t = 0.45 + sin(time * 1.9) * 0.06;
          setJ('chest', -0.12); setJ('neck', -0.2); setJ('head', -0.35);
          setJ('hipL', 0.25 + sin(time * 2.1) * 0.06, 0, -0.06); setJ('kneeL', 0.5);
          setJ('hipR', 0.1 + sin(time * 2.1 + 1) * 0.06, 0, 0.06); setJ('kneeR', 0.65);
          J.ankleL.x.t = 0.55; J.ankleR.x.t = 0.55;
          setJ('armL', -0.75 + sin(time * 1.7) * 0.05, 0, -0.35); setJ('elbowL', -0.35);
          setJ('armR', -0.9, 0, 0.3); setJ('elbowR', -0.5); setJ('wristR', -0.2);
          P.staffP.t = 1.35; P.staffR.t = 0;
          P.wind.t = 1; P.smile.t = 0.45; P.lid.t = 0.85; P.flare.t = 0.4; P.magic.t = 0.25;
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
      // dedos: cada mão acompanha o alvo de "curl"
      // ouvidinhos: twitch ocasional
      earWait -= dt;
      if (earWait <= 0) { P.ear.v += 0.45; earWait = 2.5 + Math.random() * 5; }
      // piscar
      if (blinkWait > 0) blinkWait -= dt;
      else { blinkP += dt / 0.15; if (blinkP >= 1) { blinkP = 0; blinkWait = 1.8 + Math.random() * 4; } }
      const blink = blinkWait > 0 ? 0 : sin(blinkP * PI);

      /* ---- integração das molas */
      const [k0, zeta] = SPRING[pose];
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
      pivot.position.set(P.bodyX.v, PIV + P.bodyY.v, P.bodyZ.v);
      pivot.rotation.set(P.pitch.v, 0, P.roll.v);

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
      staffMount.getWorldQuaternion(qParent);
      root.getWorldQuaternion(qRoot);
      eul.set(P.staffP.v, P.staffY.v, P.staffR.v, 'YXZ');
      qDesired.setFromEuler(eul).premultiply(qRoot);
      staff.quaternion.copy(qParent).invert().multiply(qDesired);

      /* ---- IK da mão esquerda segurando o cajado */
      const g = clamp(P.gripL.v, 0, 1);
      if (g > 0.01) {
        staff.updateWorldMatrix(true, false);
        chest.updateWorldMatrix(true, false);
        tmp.set(0, P.gripY.v, 0.0);
        staff.localToWorld(tmp);
        chest.worldToLocal(tmp);
        const sh = armNodes[0].position;
        solveArm(tmp.x - sh.x, tmp.y - sh.y, tmp.z - sh.z, ik);
        const fkX = J.armL.x.v, fkZ = J.armL.z.v, fkE = J.elbowL.x.v;
        J.armL.node.rotation.x = fkX + g * wrapAngle(ik.x - fkX);
        J.armL.node.rotation.z = lerp(fkZ, ik.z, g);
        J.elbowL.node.rotation.x = lerp(fkE, ik.e, g);
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
      for (const ir of irises) ir.position.x = gaze * 0.012;
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
        p.chain.restX = -(0.1 + demand * 1.05 + flare * 0.6 + P.magic.v * 0.5);
      }
      cape.restX = -(0.06 + flare * 0.5 + P.magic.v * 0.3);
      for (const t of tails) {
        t.chain.restZ = t.side * (0.12 + P.magic.v * 0.6 + flare * 0.2);
        t.chain.restX = P.wind.v * 0.3 - P.magic.v * 0.1;
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