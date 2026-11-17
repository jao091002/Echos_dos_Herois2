import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptSimplifier } from 'meshoptimizer';
import { createHero, type HeroPose, type HeroRig, type HeroOverlay } from './hero';
import { ARENA, terrainHeight, type WorldCollider } from './world';
import { LANDMARKS } from './activities';
import { simplifyGeometry } from './mob-skin';
import { bloodMaterial, BloodDrops, BloodSplats, BloodTubes, BloodWave } from './blood-fx';
import type { ExtraTarget } from './combat';
import type { AnimName } from './anim-library';
import type { SfxName } from './audio';

/* ============================================================================
 *  LIEB — chefe de raid, Senhor do Sangue
 *
 *  Arena: bolsão fechado (cúpula carmesim) em ARENA (world.ts), aberto pelo Portal Arruinado do mapa. Lá dentro um
 *  pilar com um cristal de sangue: interagir (G) inicia a cutscene para TODOS os jogadores na arena e a luta começa.
 *
 *  Corpo: public/models/Lieb.glb é uma malha estática (sem esqueleto). Ao carregar, ela é simplificada
 *  (meshoptimizer), ganha um esqueleto no padrão Mixamo encaixado na anatomia medida do modelo (pose T) e pesos de
 *  skin por regiões; depois vira o corpo de um createHero() → o Lieb usa o MESMO sistema de animação do jogador
 *  (locomoção, poses de magia, escudo, voo) e os clipes de public/animations.
 *
 *  Rede: o host (ou o jogo solo) decide a IA e manda o estado (`lb`, 10 Hz) e cada golpe (`lba`, com semente e
 *  alvos). Todos tocam o mesmo golpe e cada jogador testa o acerto em SI MESMO (como o PvP: a vítima decide, com
 *  esquiva e escudo). Dano dos clientes no Lieb vai ao host (`lbh`).
 *
 *  Desempenho: nenhuma PointLight nova; efeitos em InstancedMesh fixos, criados no início e sempre na cena.
 * ========================================================================== */

type V3 = [number, number, number];
const TAU = Math.PI * 2;
const { clamp, lerp, smoothstep, damp } = THREE.MathUtils;
const ease = (u: number) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };
const easeOut = (u: number) => 1 - Math.pow(1 - clamp(u, 0, 1), 3);
const wrap = (a: number) => THREE.MathUtils.euclideanModulo(a + Math.PI, TAU) - Math.PI;
function rng(seed: number) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/** Escala do corpo (o rig do herói tem ~1,8 m: o Lieb fica com ~2,4 m). */
const SCALE = 1.35;
/** Pontos fixos da arena. */
const A = { x: ARENA.x, z: ARENA.z, r: ARENA.r, y: ARENA.y };
export const LIEB_POINTS = {
  entry: new THREE.Vector3(A.x, A.y, A.z + A.r - 4.5),
  pillar: new THREE.Vector3(A.x, A.y, A.z + 9),
  exit: new THREE.Vector3(A.x, A.y, A.z + A.r - 1.2),
  throne: new THREE.Vector3(A.x, A.y, A.z - A.r + 6),
};
const PORTAL = LANDMARKS.portal, PORTAL_YAW = -1.1;

/* ------------------------------------------------------------------ corpo */

/** Anatomia do Lieb.glb (pose T), já virado para +Z, 1,8 m de altura, esquerda = +X. Medida fatia a fatia na malha. */
const BONES: [name: string, parent: number, pos: V3][] = [
  ['Hips', -1, [0, .95, 0]], ['Spine', 0, [0, 1.05, 0]], ['Spine1', 1, [0, 1.15, 0]], ['Spine2', 2, [0, 1.27, 0]],
  ['Neck', 3, [0, 1.47, -.01]], ['Head', 4, [0, 1.57, 0]], ['HeadTop_End', 5, [0, 1.8, 0]],
  ['LeftShoulder', 3, [.05, 1.38, -.01]], ['LeftArm', 7, [.235, 1.335, .02]], ['LeftForeArm', 8, [.42, 1.3, .06]], ['LeftHand', 9, [.605, 1.265, .11]],
  ['RightShoulder', 3, [-.05, 1.38, -.01]], ['RightArm', 11, [-.235, 1.335, .02]], ['RightForeArm', 12, [-.42, 1.3, .06]], ['RightHand', 13, [-.605, 1.265, .11]],
  ['LeftUpLeg', 0, [.1, .92, 0]], ['LeftLeg', 15, [.1, .5, .02]], ['LeftFoot', 16, [.1, .09, -.02]], ['LeftToeBase', 17, [.1, .02, .1]], ['LeftToe_End', 18, [.1, .02, .18]],
  ['RightUpLeg', 0, [-.1, .92, 0]], ['RightLeg', 20, [-.1, .5, .02]], ['RightFoot', 21, [-.1, .09, -.02]], ['RightToeBase', 22, [-.1, .02, .1]], ['RightToe_End', 23, [-.1, .02, .18]],
];
const B = Object.fromEntries(BONES.map((b, i) => [b[0], i])) as Record<string, number>;

/**
 * Pesos de skin por regiões (a malha é uma roupa longa: distância pura a ossos colaria o sobretudo nas pernas):
 * braços e mangas seguem a cadeia do braço pela distância lateral; cabeça por altura; pernas só dentro do cilindro
 * da perna; o sobretudo abaixo do quadril divide o peso entre quadril e pernas (balança com o passo sem rasgar);
 * o resto (tronco, gola, cabelo longo nas costas) segue a coluna por altura.
 */
function skinWeights(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position as THREE.BufferAttribute, n = pos.count;
  const si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
  const w = new Map<number, number>();
  const add = (b: number, v: number) => { if (v > 1e-4) w.set(b, (w.get(b) ?? 0) + v); };
  const chain = (y: number, list: [number, number][], k: number) => {
    // pesos lineares entre ossos consecutivos da lista [osso, altura]
    if (y >= list[0][1]) { add(list[0][0], k); return; }
    for (let i = 0; i < list.length - 1; i++) {
      const [b0, y0] = list[i], [b1, y1] = list[i + 1];
      if (y <= y0 && y >= y1) { const u = (y0 - y) / (y0 - y1); add(b0, k * (1 - u)); add(b1, k * u); return; }
    }
    add(list[list.length - 1][0], k);
  };
  const SPINE: [number, number][] = [[B.Neck, 1.47], [B.Spine2, 1.27], [B.Spine1, 1.15], [B.Spine, 1.05], [B.Hips, .95]];
  for (let i = 0; i < n; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), ax = Math.abs(x), L = x > 0;
    w.clear();
    if (ax > .17 && y > .8) {
      // braço/manga: ombro (mistura com o peito) → braço → antebraço → mão
      const sh = smoothstep(ax, .16, .27), fore = smoothstep(ax, .37, .46), hand = smoothstep(ax, .57, .63);
      add(B.Spine2, 1 - sh);
      add(L ? B.LeftArm : B.RightArm, sh * (1 - fore));
      add(L ? B.LeftForeArm : B.RightForeArm, sh * fore * (1 - hand));
      add(L ? B.LeftHand : B.RightHand, sh * fore * hand);
    } else if (y > 1.5) {
      const h = smoothstep(y, 1.5, 1.58); add(B.Head, h); add(B.Neck, 1 - h);
    } else if (y < .98) {
      const legX = L ? .1 : -.1, inLeg = Math.hypot(x - legX, z) < .085;
      const up = L ? B.LeftUpLeg : B.RightUpLeg, low = L ? B.LeftLeg : B.RightLeg, foot = L ? B.LeftFoot : B.RightFoot;
      if (inLeg) chain(y, [[up, .9], [low, .5], [foot, .1]], 1);
      else {
        // sobretudo: o quadril segura o tecido; as pernas puxam cada lado, mais quanto mais baixo
        const share = .7 * smoothstep(.95 - y, 0, .65), sL = clamp(.5 + x / .24, 0, 1);
        add(B.Hips, 1 - share);
        chain(y, [[B.LeftUpLeg, .9], [B.LeftLeg, .45]], share * sL);
        chain(y, [[B.RightUpLeg, .9], [B.RightLeg, .45]], share * (1 - sL));
      }
    } else chain(y, SPINE, 1);
    const top = [...w.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4), sum = top.reduce((s, e) => s + e[1], 0) || 1;
    top.forEach(([b, v], k) => { si[i * 4 + k] = b; sw[i * 4 + k] = v / sum; });
  }
  geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
  geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
}

/** Malha estática do Lieb.glb → modelo skinned com esqueleto Mixamo em pose T (entrada de attachBody). */
function buildBody(src: THREE.Object3D) {
  src.updateMatrixWorld(true);
  let mesh: THREE.Mesh | null = null; src.traverse(o => { if (!mesh && (o as THREE.Mesh).isMesh) mesh = o as THREE.Mesh; });
  if (!mesh) return null;
  const m = mesh as THREE.Mesh, baked = m.geometry.clone().applyMatrix4(m.matrixWorld);
  baked.rotateY(-Math.PI / 2); baked.computeBoundingBox();
  let bb = baked.boundingBox!; const k = 1.8 / (bb.max.y - bb.min.y); baked.scale(k, k, k); baked.computeBoundingBox(); bb = baked.boundingBox!;
  baked.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
  // ~1,4 milhão de triângulos → ~80 mil (silhueta e costuras de textura preservadas)
  const geo = MeshoptSimplifier.supported ? simplifyGeometry(baked, 80000) : baked;
  if (geo !== baked) baked.dispose();
  geo.computeBoundingSphere();
  skinWeights(geo);
  const bones = BONES.map(([name]) => { const b = new THREE.Bone(); b.name = name; return b; });
  BONES.forEach(([, parent, p], i) => {
    if (parent < 0) bones[i].position.set(...p);
    else { const q = BONES[parent][2]; bones[i].position.set(p[0] - q[0], p[1] - q[1], p[2] - q[2]); bones[parent].add(bones[i]); }
  });
  const skinned = new THREE.SkinnedMesh(geo, m.material as THREE.Material); skinned.name = 'lieb-body';
  skinned.add(bones[0]); skinned.updateMatrixWorld(true); skinned.bind(new THREE.Skeleton(bones));
  const group = new THREE.Group(); group.name = 'lieb-model'; group.add(skinned);
  return group;
}

/* ------------------------------------------------------------------ golpes */

type AtkId = 'whip' | 'spikes' | 'tendrils' | 'nova' | 'blink' | 'shield' | 'rain';
/** Ordem fixa (índice vai pela rede): golpes novos SEMPRE no fim. */
const ATK_IDS: AtkId[] = ['whip', 'spikes', 'tendrils', 'nova', 'blink', 'shield', 'rain'];
const DUR: Record<AtkId, number> = { whip: 1.45, spikes: 2.1, tendrils: 2.3, nova: 3.1, blink: .9, shield: 1.3, rain: 2.5 };
const DMG: Record<AtkId, number> = { whip: 24, spikes: 32, tendrils: 15, nova: 36, blink: 0, shield: 0, rain: 13 };
/** Nome da magia (legenda rápida na tela quando o Lieb conjura). */
const NAMES: Partial<Record<AtkId, string>> = { spikes: 'Lanças Carmesins', tendrils: 'Tentáculos de Sangue', nova: 'Maré de Sangue', shield: 'Escudo de Sangue', rain: 'Chuva de Sangue' };
type AtkEvent = { id: AtkId; t0: number; seed: number; ox: number; oz: number; yaw: number; tg: THREE.Vector3[]; dx: number; dz: number; hits: number; done: Set<number>; moved: boolean };

export type LiebPlayer = { id: string; pos: THREE.Vector3; alive: boolean; vx: number; vz: number };
export type LiebIO = {
  role: () => 'solo' | 'host' | 'client';
  selfId: () => string;
  /** Jogadores (o local primeiro) com posição dos pés e velocidade. */
  players: () => LiebPlayer[];
  /** Altura do jogador local acima do chão (pular/voar escapa da Maré de Sangue). */
  localAir: () => number;
  /** Golpe no jogador local (esquiva, escudo e resistência como os outros inimigos). */
  hurt: (damage: number, fromX: number, fromZ: number) => void;
  send: (msg: Record<string, unknown>) => void;
  sendHost: (msg: Record<string, unknown>) => void;
  damageNumber: (at: THREE.Vector3, amount: number, kind: 'mine' | 'ally' | 'hurt' | 'dodge' | 'block') => void;
  sfx: (name: SfxName, gain?: number) => void;
  hint: (text: string) => void;
  /** Cutscene de abertura (só para quem está na arena). */
  intro: (center: THREE.Vector3, secs: number) => void;
  /** Legenda de magia (barras de cinema rápidas, sem travar o jogador). */
  caption: (small: string, big: string) => void;
  defeated: () => void;
  shake: (power: number) => void;
};

type Phase = 'dormant' | 'intro' | 'fight' | 'dead';
const PHASES: Phase[] = ['dormant', 'intro', 'fight', 'dead'];
const INTRO_SECS = 7.5;

/* ------------------------------------------------------------------ materiais */
const SWIRL_VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`;
const SWIRL_FS = `uniform float uTime; uniform float uOpen; varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y); }
void main(){
  vec2 p = vUv*2.-1.; float r = length(p), a = atan(p.y,p.x);
  float sw = a + r*5. - uTime*1.6;
  float v = n(vec2(sw*1.6, r*4. - uTime*.8)) * .7 + n(vec2(sw*4., r*9.)) * .3;
  vec3 col = mix(vec3(.08,0.,.01), vec3(.75,.03,.08), smoothstep(.25,.85,v)) + vec3(1.,.25,.2)*pow(1.-r,4.)*.9;
  float edge = smoothstep(1., .82, r) * uOpen;
  col += vec3(1.2,.15,.12) * smoothstep(.72,.98,r) * smoothstep(1.,.93,r) * 1.5;
  gl_FragColor = vec4(col, edge);
}`;
const SHIELD_VS = `varying vec3 vN; varying vec3 vV; varying vec3 vP;
uniform float uTime;
void main(){ vec3 pp = position * (1. + (sin(position.y * 9. + uTime * 4.) * .5 + sin(position.x * 7. - uTime * 3.) * .5) * .025 + sin(dot(position, vec3(3.1, 5.7, 2.3)) + uTime * 2.) * .02);
  vec4 w = modelMatrix * vec4(pp,1.); vP = position; vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }`;
const SHIELD_FS = `uniform float uTime; uniform float uHp; uniform float uFlash; varying vec3 vN; varying vec3 vV; varying vec3 vP;
float h(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }
float n(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
void main(){
  float fr = pow(1. - abs(dot(vN, vV)), 2.2);
  float flow = n(vP*2.2 + vec3(0., -uTime*1.4, 0.)) * .65 + n(vP*5. + vec3(uTime*.6, 0., 0.)) * .35;
  float veins = smoothstep(.58, .61, flow) * (1. - smoothstep(.61, .64, flow));
  vec3 col = vec3(.09,0.,.01) + vec3(.55,.02,.05) * fr + vec3(.75,.06,.08) * veins * (.5 + uFlash);
  float a = (.1 + fr * .62 + veins * .35) * (.45 + .55 * uHp) + uFlash * .35;
  gl_FragColor = vec4(col * (1. + uFlash * 2.), clamp(a, 0., .95));
}`;

/* ============================================================================ */
export class LiebBoss {
  readonly hero: HeroRig;
  /** Cápsula invisível de mira (entra em combat.targets: assistência de mira e colisão de projéteis). */
  readonly target: THREE.Mesh;
  readonly extra: ExtraTarget;
  readonly colliders: WorldCollider[] = [];
  /** Chão/paredes da arena para mira e colisão da câmera. */
  readonly surfaces: THREE.Object3D[] = [];
  ready = false;
  failed = false;
  phase: Phase = 'dormant';
  hp = 1; maxHp = 1; shield = 0; shieldMax = 0;
  private phaseT = 0;
  private readonly root: THREE.Group;
  private readonly time = { value: 0 };
  private readonly loading = { started: false };
  private readonly pos = new THREE.Vector3();
  private yaw = 0;
  private speed = 0;
  private hover = 0;
  private stagger = 0;
  private events: AtkEvent[] = [];
  private cooldown = 2;
  private targetId = '';
  private targetHold = 0;
  private aggro = new Map<string, number>();
  private shieldUntil = 0;
  private shieldDone = { a: false, b: false };
  private nextShield = 0;
  private rainT = 0;
  private wipeT = 0;
  private respawnT = 0;
  private stateAcc = 0;
  private net: { x: number; z: number; yaw: number; hover: number } | null = null;
  private readonly prev = new THREE.Vector3();
  private hitFlash = 0;
  private shieldFlash = 0;
  private lastLocalHit = -99;
  private veilOpen = 0;
  private readonly tmp = new THREE.Vector3();
  private readonly tmp2 = new THREE.Vector3();
  private readonly handV = new THREE.Vector3();
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly s3 = new THREE.Vector3();
  private readonly col = new THREE.Color();
  private readonly UP = new THREE.Vector3(0, 1, 0);

  // efeitos (instanciados, fixos)
  private readonly blob: THREE.InstancedMesh;
  private readonly spike: THREE.InstancedMesh;
  private readonly mark: THREE.InstancedMesh;
  private readonly tubes: BloodTubes;
  private readonly drops: BloodDrops;
  private readonly splats: BloodSplats;
  private readonly wave: BloodWave;
  private readonly shieldMesh: THREE.Mesh;
  private readonly shieldMat: THREE.ShaderMaterial;
  private readonly crystal: THREE.Mesh;
  private readonly crystalMat: THREE.MeshStandardMaterial;
  private readonly swirls: THREE.ShaderMaterial[] = [];
  private nBlob = 0; private nSpike = 0; private nMark = 0;
  private drip = 0;
  private novaX = 0; private novaZ = 0; private novaH = 0;
  private readonly owned: { geometries: THREE.BufferGeometry[]; materials: THREE.Material[] } = { geometries: [], materials: [] };

  constructor(scene: THREE.Scene, private readonly io: LiebIO) {
    const G = <T extends THREE.BufferGeometry>(g: T) => { this.owned.geometries.push(g); return g; };
    const M = <T extends THREE.Material>(m: T) => { this.owned.materials.push(m); return m; };

    /* ---------------- arena ---------------- */
    const arena = new THREE.Group(); arena.name = 'lieb-arena'; arena.position.set(A.x, A.y, A.z); scene.add(arena);
    const stone = M(new THREE.MeshStandardMaterial({ color: '#2b2427', roughness: .88, metalness: .05 }));
    const obsidian = M(new THREE.MeshStandardMaterial({ color: '#140d10', roughness: .3, metalness: .35 }));
    const blood = M(new THREE.MeshStandardMaterial({ color: '#4a040b', roughness: .14, metalness: .2, emissive: '#3a0208', emissiveIntensity: .7 }));
    const rune = M(new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, .12, .14), toneMapped: false }));
    const floor = new THREE.Mesh(G(new THREE.CircleGeometry(A.r + 10, 72)), stone); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; floor.name = 'lieb-floor'; arena.add(floor);
    // anéis e raios de runa no chão (acendem com bloom)
    for (const [r, t] of [[A.r - 1.2, .07], [A.r - 3, .04], [11, .06], [6.5, .05]] as const) {
      const ring = new THREE.Mesh(G(new THREE.TorusGeometry(r, t, 4, 96)), rune); ring.rotation.x = Math.PI / 2; ring.position.y = .02; arena.add(ring);
    }
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU, bar = new THREE.Mesh(G(new THREE.BoxGeometry(.06, .02, A.r - 15)), rune);
      bar.position.set(Math.sin(a) * (A.r / 2 + 3.4), .02, Math.cos(a) * (A.r / 2 + 3.4)); bar.rotation.y = a; arena.add(bar);
    }
    // poças de sangue
    const pr = rng(7), splatMat = M(bloodMaterial(this.time, 'splat')); splatMat.polygonOffset = true; splatMat.polygonOffsetFactor = -2; splatMat.polygonOffsetUnits = -2;
    for (let i = 0; i < 11; i++) {
      const a = pr() * TAU, d = 7 + pr() * (A.r - 10), pool = new THREE.Mesh(G(new THREE.CircleGeometry(1, 32).rotateX(-Math.PI / 2)), splatMat);
      const r = 1 + pr() * 2.2; pool.position.set(Math.sin(a) * d, .012 + i * .001, Math.cos(a) * d); pool.scale.set(r, 1, r * (.7 + pr() * .5)); pool.rotation.y = pr() * TAU; pool.receiveShadow = true; arena.add(pool);
    }
    void blood;
    // muralha de espinhos de obsidiana (instanciada) + colisores
    const wallN = 46, wall = new THREE.InstancedMesh(G(new THREE.ConeGeometry(1.4, 1, 5)), obsidian, wallN * 2);
    for (let i = 0; i < wallN * 2; i++) {
      const outer = i >= wallN, j = i % wallN, a = (j + (outer ? .5 : 0)) / wallN * TAU, d = A.r + 1.4 + (outer ? 2.6 : 0) + pr() * .8;
      const h = (outer ? 11 : 6) + pr() * (outer ? 9 : 5);
      this.q.setFromEuler(new THREE.Euler((pr() - .5) * .25, pr() * TAU, (pr() - .5) * .25));
      this.m4.compose(this.tmp.set(Math.sin(a) * d, h / 2 - .3, Math.cos(a) * d), this.q, this.s3.set(.8 + pr() * .6, h, .8 + pr() * .6)); wall.setMatrixAt(i, this.m4);
    }
    wall.castShadow = true; wall.receiveShadow = true; wall.name = 'lieb-wall'; arena.add(wall); this.surfaces.push(floor, wall);
    for (let i = 0; i < 40; i++) { const a = i / 40 * TAU; this.colliders.push({ x: A.x + Math.sin(a) * (A.r + 1.6), z: A.z + Math.cos(a) * (A.r + 1.6), radius: 2.2 }); }
    // cúpula do céu carmesim com lua de sangue (esconde o mapa; sem neblina)
    const dome = new THREE.SphereGeometry(95, 40, 20), dc = new Float32Array(dome.attributes.position.count * 3), c = new THREE.Color();
    for (let i = 0; i < dome.attributes.position.count; i++) {
      const y = dome.attributes.position.getY(i) / 95;
      c.set('#14030a').lerp(new THREE.Color('#8e0f22'), smoothstep(y, .5, .02)).lerp(new THREE.Color('#2a0408'), smoothstep(y, -.02, -.3));
      dc[i * 3] = c.r; dc[i * 3 + 1] = c.g; dc[i * 3 + 2] = c.b;
    }
    dome.setAttribute('color', new THREE.BufferAttribute(dc, 3));
    const domeMesh = new THREE.Mesh(G(dome), M(new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false })));
    domeMesh.renderOrder = -10; arena.add(domeMesh);
    const moon = new THREE.Mesh(G(new THREE.CircleGeometry(7, 40)), M(new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, .25, .2), fog: false, toneMapped: false })));
    moon.position.set(-30, 48, -70); moon.lookAt(0, 0, 0); arena.add(moon);
    // trono (onde o Lieb espera)
    const tz = LIEB_POINTS.throne.z - A.z;
    for (let i = 0; i < 3; i++) { const st = new THREE.Mesh(G(new THREE.CylinderGeometry(4.2 - i * .9, 4.4 - i * .9, .28, 8)), stone); st.position.set(0, .14 + i * .28, tz - 1.2); st.receiveShadow = true; st.castShadow = true; arena.add(st); }
    const back = new THREE.Mesh(G(new THREE.BoxGeometry(2.6, 5.5, .6)), obsidian); back.position.set(0, 3.4, tz - 2.9); back.castShadow = true; arena.add(back);
    for (const s of [-1, 0, 1]) { const sp = new THREE.Mesh(G(new THREE.ConeGeometry(.35, 2.4, 5)), obsidian); sp.position.set(s * .95, 7.1 - Math.abs(s) * .6, tz - 2.9); arena.add(sp); }
    this.colliders.push({ x: A.x, z: A.z + tz - 2.9, radius: 1.6 });
    // pilar do ritual com o cristal de sangue
    const pz = LIEB_POINTS.pillar.z - A.z;
    const pillar = new THREE.Mesh(G(new THREE.CylinderGeometry(.42, .62, 2.4, 6)), obsidian); pillar.position.set(0, 1.2, pz); pillar.castShadow = true; arena.add(pillar);
    const base = new THREE.Mesh(G(new THREE.CylinderGeometry(1.1, 1.3, .3, 6)), stone); base.position.set(0, .15, pz); arena.add(base);
    this.crystalMat = M(new THREE.MeshStandardMaterial({ color: '#8a0c18', roughness: .08, metalness: .3, emissive: '#ff1530', emissiveIntensity: 1.6 }));
    this.crystal = new THREE.Mesh(G(new THREE.OctahedronGeometry(.42, 0)), this.crystalMat); this.crystal.scale.set(1, 1.6, 1); this.crystal.position.set(0, 3.05, pz); arena.add(this.crystal);
    this.colliders.push({ x: A.x, z: A.z + pz, radius: .9 });
    // portal de saída (arco + véu) atrás da entrada
    const swirl = () => { const m = M(new THREE.ShaderMaterial({ uniforms: { uTime: this.time, uOpen: { value: 1 } }, vertexShader: SWIRL_VS, fragmentShader: SWIRL_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })); this.swirls.push(m); return m; };
    const ez = LIEB_POINTS.exit.z - A.z;
    const arch = new THREE.Mesh(G(new THREE.TorusGeometry(1.95, .28, 6, 20, Math.PI)), obsidian); arch.position.set(0, 1.4, ez); arena.add(arch);
    for (const s of [-1, 1]) { const leg = new THREE.Mesh(G(new THREE.BoxGeometry(.5, 1.4, .5)), obsidian); leg.position.set(s * 1.95, .7, ez); arena.add(leg); this.colliders.push({ x: A.x + s * 1.95, z: A.z + ez, radius: .45 }); }
    const veil = new THREE.Mesh(G(new THREE.CircleGeometry(1.7, 40)), swirl()); veil.position.set(0, 1.55, ez); veil.scale.set(1, 1.15, 1); arena.add(veil);
    // véu de sangue no Portal Arruinado do mapa (a entrada)
    const ph = terrainHeight(PORTAL.x, PORTAL.z), mainVeil = new THREE.Mesh(G(new THREE.CircleGeometry(1.72, 40)), swirl());
    const pv = new THREE.Group(); pv.position.set(PORTAL.x, ph, PORTAL.z); pv.rotation.y = PORTAL_YAW; scene.add(pv);
    mainVeil.position.set(0, 2.9, .04); pv.add(mainVeil);

    /* ---------------- efeitos de sangue ---------------- */
    const bloodFx = M(bloodMaterial(this.time, 'flow')), waveMat = M(bloodMaterial(this.time, 'wave'));
    this.blob = new THREE.InstancedMesh(G(new THREE.SphereGeometry(1, 14, 10)), bloodFx, 900);
    this.spike = new THREE.InstancedMesh(G(new THREE.ConeGeometry(1, 1, 10, 3).translate(0, .5, 0)), bloodFx, 220);
    const markMat = M(new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    this.mark = new THREE.InstancedMesh(G(new THREE.RingGeometry(.88, 1, 48).rotateX(-Math.PI / 2)), markMat, 48);
    for (const im of [this.blob, this.spike, this.mark]) { im.frustumCulled = false; im.count = 0; im.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(im); }
    this.blob.castShadow = true; this.spike.castShadow = true;
    this.mark.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(48 * 3), 3);
    this.tubes = new BloodTubes(scene, bloodFx, 16);
    this.splats = new BloodSplats(scene, splatMat, 120);
    this.drops = new BloodDrops(scene, bloodFx, this.splats, 460);
    this.wave = new BloodWave(scene, waveMat);
    for (const m of [...this.tubes.meshes, this.splats.mesh, this.drops.mesh, this.wave.mesh]) { this.owned.geometries.push(m.geometry); }
    this.shieldMat = M(new THREE.ShaderMaterial({ uniforms: { uTime: this.time, uHp: { value: 1 }, uFlash: { value: 0 } }, vertexShader: SHIELD_VS, fragmentShader: SHIELD_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
    this.shieldMesh = new THREE.Mesh(G(new THREE.IcosahedronGeometry(1, 4)), this.shieldMat); this.shieldMesh.position.set(A.x, -600, A.z); scene.add(this.shieldMesh);

    /* ---------------- corpo (rig do herói; o modelo chega depois) ---------------- */
    this.hero = createHero(scene, { auraLight: false });
    this.root = this.hero.root; this.root.name = 'lieb'; this.root.scale.setScalar(SCALE); this.root.visible = false;
    this.pos.copy(LIEB_POINTS.throne); this.root.position.copy(this.pos); this.prev.copy(this.pos);
    this.target = new THREE.Mesh(G(new THREE.CylinderGeometry(.42, .42, 1.6, 8)), M(new THREE.MeshBasicMaterial({ visible: false })));
    this.target.name = 'lieb-target'; this.target.position.y = 1.05; this.root.add(this.target);
    this.extra = { pos: this.pos, radius: .55, low: .25, high: 2.25, alive: () => this.phase === 'fight' && this.root.visible, hit: (d, p) => this.onHit(d, p) };
  }

  /** Começa a carregar o modelo (chamado ao chegar perto do portal ou da arena: o Lieb.glb tem ~55 MB). */
  load() {
    if (this.loading.started) return; this.loading.started = true;
    new GLTFLoader().load('/models/Lieb.glb', gltf => {
      if (this.disposed) return;
      MeshoptSimplifier.ready.then(() => {
        if (this.disposed) return;
        const body = buildBody(gltf.scene);
        if (!body) { this.fallback(); return; }
        this.hero.attachBody({ scene: body, animations: [] }, { full: true });
        this.ready = true; this.root.visible = this.phase !== 'dead';
        // a malha original (1,4 mi de triângulos) não é usada: libera a memória
        gltf.scene.traverse(o => { const m = o as THREE.Mesh; if (m.isMesh) m.geometry.dispose(); });
      }, () => this.fallback());
    }, undefined, () => this.fallback());
  }
  /** Sem o modelo: corpo procedural escuro (o chefe continua jogável). */
  private fallback() { if (this.disposed) return; this.failed = true; this.ready = true; this.hero.setAppearance({ body: '#2a0d12', joints: '#8a1020' } as never); this.root.visible = this.phase !== 'dead'; }

  addClips(clips: Partial<Record<AnimName, THREE.AnimationClip>>) { this.hero.addClips(clips); }

  private disposed = false;
  dispose() { this.disposed = true; this.owned.geometries.forEach(g => g.dispose()); this.owned.materials.forEach(m => m.dispose()); }

  /** Jogador na arena? */
  static inArena(p: THREE.Vector3) { return Math.hypot(p.x - A.x, p.z - A.z) < A.r + 6; }
  /** Teleporte pelos portais: 'enter' (Portal Arruinado → arena), 'exit' (arena → mapa) ou null. */
  static portalAt(p: THREE.Vector3): 'enter' | 'exit' | null {
    const dx = p.x - PORTAL.x, dz = p.z - PORTAL.z, c = Math.cos(PORTAL_YAW), s = Math.sin(PORTAL_YAW);
    const lx = dx * c - dz * s, lz = dx * s + dz * c;
    if (Math.abs(lx) < 1.45 && Math.abs(lz) < .5 && p.y - terrainHeight(p.x, p.z) < 3) return 'enter';
    if (Math.abs(p.x - LIEB_POINTS.exit.x) < 1.5 && Math.abs(p.z - LIEB_POINTS.exit.z) < .5) return 'exit';
    return null;
  }
  /** Onde o jogador aparece ao voltar do portal (na frente do Portal Arruinado). */
  static returnPoint(out: THREE.Vector3) { const s = Math.sin(PORTAL_YAW), c = Math.cos(PORTAL_YAW); return out.set(PORTAL.x + s * 3, 0, PORTAL.z + c * 3); }
  static get portalCenter() { return new THREE.Vector3(PORTAL.x, 0, PORTAL.z); }
  nearPillar(p: THREE.Vector3) { return Math.hypot(p.x - LIEB_POINTS.pillar.x, p.z - LIEB_POINTS.pillar.z) < 2.8; }

  /* ================================================================ início/fim */

  /** G no pilar: o host inicia; o cliente pede ao host. */
  requestStart() {
    if (this.phase !== 'dormant') return false;
    if (!this.ready) { this.io.hint('O selo de sangue ainda está despertando… (carregando o Lieb)'); return false; }
    if (this.io.role() === 'client') this.io.sendHost({ t: 'lbs' }); else this.begin();
    return true;
  }
  private begin() {
    const n = Math.max(1, this.io.players().filter(p => LiebBoss.inArena(p.pos)).length);
    this.maxHp = Math.round(5200 * (1 + .65 * (n - 1)));
    this.startIntro(this.maxHp);
    if (this.io.role() === 'host') this.io.send({ t: 'lbgo', hp: this.maxHp });
  }
  private startIntro(maxHp: number) {
    this.maxHp = maxHp; this.hp = maxHp; this.shield = 0; this.shieldMax = 0; this.events = []; this.aggro.clear();
    this.shieldDone = { a: false, b: false }; this.nextShield = 0; this.stagger = 0; this.cooldown = 2.2;
    this.phase = 'intro'; this.phaseT = 0; this.pos.copy(LIEB_POINTS.throne); this.yaw = 0;
    this.root.visible = this.ready;
    const me = this.io.players()[0];
    if (me && LiebBoss.inArena(me.pos)) this.io.intro(this.tmp.set(this.pos.x, this.pos.y + 2, this.pos.z + .4).clone(), INTRO_SECS);
    this.burst(this.tmp.set(LIEB_POINTS.pillar.x, 3.05, LIEB_POINTS.pillar.z), 40, 6, .5);
    this.io.sfx('fireBoom', .8);
  }
  private resetBoss(announce: boolean) {
    this.phase = 'dormant'; this.phaseT = 0; this.events = []; this.shield = 0; this.hp = this.maxHp;
    this.pos.copy(LIEB_POINTS.throne); this.yaw = 0; this.root.visible = this.ready;
    if (announce) this.io.hint('O Lieb voltou ao trono. O cristal de sangue pulsa outra vez.');
    if (this.io.role() === 'host') this.io.send({ t: 'lbr' });
  }
  private die() {
    this.phase = 'dead'; this.phaseT = 0; this.events = []; this.shield = 0; this.hp = 0;
    this.burst(this.tmp.set(this.pos.x, this.pos.y + 1.6, this.pos.z), 70, 7, .8);
    this.io.sfx('enemyDie', 1.4); this.io.shake(1.2);
    const me = this.io.players()[0];
    if (me && LiebBoss.inArena(me.pos)) this.io.defeated();
    if (this.io.role() === 'host') this.io.send({ t: 'lbd' });
  }

  /* ================================================================ dano no Lieb */

  private onHit(damage: number, point: THREE.Vector3) {
    if (this.phase !== 'fight') return;
    const vuln = this.stagger > 0 ? 1.5 : 1, d = damage * vuln;
    this.hitFlash = .15;
    if (this.shield > 0) this.shieldFlash = .25;
    this.io.damageNumber(this.tmp.set(point.x, Math.max(point.y, this.pos.y + 2.6), point.z), Math.round(d), this.shield > 0 ? 'block' : 'mine');
    if (this.io.role() === 'client') { this.io.sendHost({ t: 'lbh', d: Math.round(d * 10) / 10 }); return; }
    this.applyDamage(this.io.selfId(), d);
  }
  private applyDamage(from: string, d: number) {
    if (this.phase !== 'fight' || !Number.isFinite(d) || d <= 0) return;
    d = Math.min(d, 600);
    this.aggro.set(from, (this.aggro.get(from) ?? 0) + d);
    if (this.shield > 0) {
      this.shield -= d;
      if (this.shield <= 0) {
        // escudo quebrado: atordoado e vulnerável (+50% de dano) por 3,5 s
        this.shield = 0; this.stagger = 3.5; this.events = this.events.filter(e => e.id !== 'rain');
        this.burst(this.tmp.set(this.pos.x, this.pos.y + 1.8, this.pos.z), 60, 8, .7); this.io.sfx('shieldBreak', 1.2); this.io.shake(.8);
        this.io.hint('🩸 O Escudo de Sangue partiu! O Lieb está vulnerável.');
        if (this.io.role() === 'host') this.io.send({ t: 'lbx' });
      }
      return;
    }
    this.hp = Math.max(0, this.hp - d);
    if (this.hp <= 0) this.die();
  }

  /* ================================================================ rede */

  netMessage(from: string, m: Record<string, unknown>) {
    const role = this.io.role();
    switch (m.t) {
      case 'lbs': if (role === 'host' && this.phase === 'dormant' && this.ready) this.begin(); return;
      case 'lbgo': if (role === 'client') this.startIntro(Number(m.hp) || 5200); return;
      case 'lbh': if (role === 'host') this.applyDamage(from, Number(m.d)); return;
      case 'lbr': if (role === 'client') this.resetBoss(false); return;
      case 'lbd': if (role === 'client' && this.phase !== 'dead') this.die(); return;
      case 'lbx': if (role === 'client') { this.stagger = 3.5; this.burst(this.tmp.set(this.pos.x, this.pos.y + 1.8, this.pos.z), 60, 8, .7); this.io.sfx('shieldBreak', 1.2); } return;
      case 'lba': {
        if (role !== 'client') return;
        const id = ATK_IDS[Number(m.a)]; if (!id) return;
        const g = (m.g as number[] | undefined) ?? [], tg: THREE.Vector3[] = [];
        for (let i = 0; i + 1 < g.length; i += 2) tg.push(new THREE.Vector3(g[i], A.y, g[i + 1]));
        this.play(id, Number(m.s) >>> 0, Number(m.x), Number(m.z), Number(m.y), tg, Number(m.dx ?? m.x), Number(m.dz ?? m.z));
        return;
      }
      case 'lb': {
        if (role !== 'client') return;
        const ph = PHASES[Number(m.p)] ?? 'dormant';
        if (ph === 'fight' && this.phase !== 'fight') { this.phase = 'fight'; this.root.visible = this.ready; }
        if (ph === 'dormant' && this.phase === 'fight') this.resetBoss(false);
        this.hp = Number(m.h); this.maxHp = Number(m.mh) || this.maxHp; this.shield = Number(m.sh); this.shieldMax = Number(m.sm) || this.shieldMax;
        this.net = { x: Number(m.x), z: Number(m.z), yaw: Number(m.yw), hover: Number(m.hv) || 0 };
        return;
      }
    }
  }

  /* ================================================================ IA (host/solo) */

  private alivePlayers() { return this.io.players().filter(p => p.alive && LiebBoss.inArena(p.pos)); }
  private pickTarget(list: LiebPlayer[], dt: number) {
    this.targetHold -= dt;
    let cur = list.find(p => p.id === this.targetId);
    if (!cur || this.targetHold <= 0) {
      // ameaça (dano causado) pesa mais que a distância; troca de alvo a cada 4–7 s
      let best = -Infinity;
      for (const p of list) { const s = (this.aggro.get(p.id) ?? 0) * .02 - Math.hypot(p.pos.x - this.pos.x, p.pos.z - this.pos.z) + Math.random() * 6; if (s > best) { best = s; cur = p; } }
      this.targetId = cur?.id ?? ''; this.targetHold = 4 + Math.random() * 3;
      for (const [k, v] of this.aggro) this.aggro.set(k, v * .6);
    }
    return cur ?? null;
  }
  private fire(id: AtkId, tg: THREE.Vector3[], dx = this.pos.x, dz = this.pos.z) {
    const seed = (Math.random() * 2 ** 31) >>> 0;
    this.play(id, seed, this.pos.x, this.pos.z, this.yaw, tg, dx, dz);
    if (this.io.role() === 'host') {
      const g: number[] = []; for (const v of tg) g.push(Math.round(v.x * 100) / 100, Math.round(v.z * 100) / 100);
      this.io.send({ t: 'lba', a: ATK_IDS.indexOf(id), s: seed, x: Math.round(this.pos.x * 100) / 100, z: Math.round(this.pos.z * 100) / 100, y: Math.round(this.yaw * 1000) / 1000, g, dx: Math.round(dx * 100) / 100, dz: Math.round(dz * 100) / 100 });
    }
  }
  private lead(p: LiebPlayer, s: number) { return new THREE.Vector3(p.pos.x + p.vx * s, A.y, p.pos.z + p.vz * s); }

  private think(dt: number) {
    const list = this.alivePlayers();
    if (!list.length) { this.wipeT += dt; if (this.wipeT > 6) this.resetBoss(true); this.speed = damp(this.speed, 0, 6, dt); return; }
    this.wipeT = 0;
    const tgt = this.pickTarget(list, dt); if (!tgt) return;
    const busy = this.events.some(e => e.id !== 'rain');
    const dx = tgt.pos.x - this.pos.x, dz = tgt.pos.z - this.pos.z, dist = Math.hypot(dx, dz);
    const p3 = this.hp / this.maxHp < .3;
    // escudo: aos 70% e 35% (e a cada ~28 s na fase final); expira em 12 s curando o Lieb se não for quebrado
    if (this.shield > 0 && this.io.role() !== 'client' && performance.now() / 1000 > this.shieldUntil) {
      this.hp = Math.min(this.maxHp, this.hp + this.maxHp * .08); this.shield = 0;
      this.io.hint('🩸 O Escudo de Sangue não foi quebrado: o Lieb absorveu o sangue e recuperou vida.');
    }
    if (this.shield > 0) { this.rainT -= dt; if (this.rainT <= 0 && !busy) { this.rainT = 2.6; this.fire('rain', list.map(p => this.lead(p, .9))); } }
    if (this.stagger > 0) { this.speed = damp(this.speed, 0, 8, dt); return; }
    if (!busy) {
      const frac = this.hp / this.maxHp, now = performance.now() / 1000;
      const wantShield = (!this.shieldDone.a && frac < .7) || (!this.shieldDone.b && frac < .35) || (p3 && now > this.nextShield && this.nextShield > 0);
      if (wantShield && this.shield <= 0) {
        if (frac < .7) this.shieldDone.a = true; if (frac < .35) this.shieldDone.b = true;
        if (p3) this.nextShield = now + 28; else if (frac < .35) this.nextShield = now + 20;
        this.shieldMax = this.maxHp * .14; this.shield = this.shieldMax; this.shieldUntil = now + 12; this.rainT = 1.6;
        this.fire('shield', []); return;
      }
    }
    // virar para o alvo (devagar no meio dos golpes)
    const want = Math.atan2(dx, dz);
    this.yaw += wrap(want - this.yaw) * (1 - Math.exp(-dt * (busy ? 2 : 7)));
    if (busy) { this.speed = damp(this.speed, 0, 6, dt); return; }
    // locomoção: aproxima até 4–7 m; longe demais = Névoa Sangrenta (teleporte atrás do alvo)
    let mv = 0, side = 0;
    if (dist > 7.5) mv = dist > 12 ? 6.2 : 4.2;
    else if (dist < 3.2) mv = -2.2;
    else side = Math.sin(performance.now() / 1700) > 0 ? 1 : -1;
    this.speed = damp(this.speed, Math.abs(mv) + Math.abs(side) * 2.2, 5, dt);
    const fx = Math.sin(this.yaw), fz = Math.cos(this.yaw);
    this.pos.x += (fx * mv + fz * side * 2.2) * dt; this.pos.z += (fz * mv - fx * side * 2.2) * dt;
    const r = Math.hypot(this.pos.x - A.x, this.pos.z - A.z); if (r > A.r - 2) { const k = (A.r - 2) / r; this.pos.x = A.x + (this.pos.x - A.x) * k; this.pos.z = A.z + (this.pos.z - A.z) * k; }
    this.cooldown -= dt; if (this.cooldown > 0) return;
    // escolhe o golpe pela distância e pela fase
    const roll = Math.random();
    let id: AtkId;
    if (dist > 15) id = 'blink';
    else if (dist < 7.5) id = roll < .5 ? 'whip' : roll < .7 ? 'nova' : roll < .85 ? 'spikes' : 'tendrils';
    else id = roll < .38 ? 'tendrils' : roll < .72 ? 'spikes' : roll < .86 ? 'nova' : 'blink';
    this.cooldown = (p3 ? .75 : 1.15) + Math.random() * (p3 ? .7 : 1.1);
    if (id === 'whip') this.fire('whip', [tgt.pos.clone()]);
    else if (id === 'spikes') { const tg = list.map(p => this.lead(p, 1)); if (p3) for (const p of list) tg.push(this.lead(p, 1.6)); this.fire('spikes', tg.slice(0, 8)); }
    else if (id === 'tendrils') { const tg: THREE.Vector3[] = []; for (let i = 0; i < 6; i++) { const p = list[i % list.length]; tg.push(this.lead(p, 1.25).add(this.tmp.set((Math.random() - .5) * 2.4, 0, (Math.random() - .5) * 2.4))); } this.fire('tendrils', tg); }
    else if (id === 'nova') this.fire('nova', []);
    else {
      // aparece atrás do alvo, a 2,6 m, e emenda um chicote
      const back = Math.atan2(tgt.pos.x - this.pos.x, tgt.pos.z - this.pos.z), bx = tgt.pos.x + Math.sin(back) * 2.6, bz = tgt.pos.z + Math.cos(back) * 2.6;
      const rr = Math.hypot(bx - A.x, bz - A.z), k = rr > A.r - 2 ? (A.r - 2) / rr : 1;
      this.fire('blink', [tgt.pos.clone()], A.x + (bx - A.x) * k, A.z + (bz - A.z) * k);
      this.cooldown = .35;
    }
  }

  /* ================================================================ golpes (todos os jogadores) */

  private play(id: AtkId, seed: number, ox: number, oz: number, yaw: number, tg: THREE.Vector3[], dx: number, dz: number) {
    this.events.push({ id, t0: this.time.value, seed, ox, oz, yaw, tg, dx, dz, hits: 0, done: new Set(), moved: false });
    const name = NAMES[id];
    const me = this.io.players()[0];
    if (name && me && LiebBoss.inArena(me.pos)) this.io.caption('MAGIA DE SANGUE', name);
    this.io.sfx(id === 'nova' || id === 'spikes' ? 'fireCharge' : id === 'shield' ? 'shieldUp' : id === 'blink' ? 'dodge' : 'demonAttack', .9);
  }
  private ageOf(e: AtkEvent) { return this.time.value - e.t0; }
  /** Golpe no jogador local (uma vez por chave), com multiplicador da fase final. */
  private strike(e: AtkEvent, key: number, fromX: number, fromZ: number) {
    if (e.done.has(key)) return; e.done.add(key);
    const me = this.io.players()[0]; if (!me?.alive || !LiebBoss.inArena(me.pos)) return;
    const mult = this.hp / this.maxHp < .3 ? 1.25 : 1;
    this.io.hurt(DMG[e.id] * mult, fromX, fromZ); this.lastLocalHit = this.time.value; this.io.shake(.35);
    this.burst(this.tmp.set(me.pos.x, me.pos.y + 1, me.pos.z), 14, 3.5, .45); this.splats.add(me.pos.x, me.pos.z, .6 + Math.random() * .4, 7);
  }

  /** Avança os golpes ativos: monta os efeitos e testa os acertos no jogador local. */
  private runEvents(dt: number) {
    const me = this.io.players()[0], mp = me?.pos;
    this.nBlob = 0; this.nSpike = 0; this.nMark = 0;
    let novaR = -1;
    for (const e of this.events) {
      const a = this.ageOf(e), r = rng(e.seed);
      const hand = this.handPoint(this.handV);
      switch (e.id) {
        case 'whip': {
          // três chicotes de sangue saem da mão e varrem 150° à frente (de um lado ao outro)
          const sweep = smoothstep(a, .5, .8), grow = smoothstep(a, .2, .5) * (1 - smoothstep(a, 1.05, 1.4));
          for (let k = 0; k < 3; k++) {
            const ang = e.yaw + lerp(1.3, -1.3, clamp(sweep - k * .06, 0, 1)) + (k - 1) * .08, len = (6.2 + k * .5) * grow;
            this.tendril(hand, this.tmp.set(hand.x + Math.sin(ang) * len, A.y + .6 + k * .25, hand.z + Math.cos(ang) * len), 2.2 - k * .5, .14, 18, a * 9 + k, 1);
          }
          if (mp && a > .5 && a < .82) {
            const rel = wrap(Math.atan2(mp.x - e.ox, mp.z - e.oz) - e.yaw), cur = lerp(1.3, -1.3, sweep), dist = Math.hypot(mp.x - e.ox, mp.z - e.oz);
            if (dist < 7.6 && Math.abs(rel) < 1.4 && rel >= cur - .15 && mp.y - A.y < 2.2) this.strike(e, 0, e.ox, e.oz);
          }
          break;
        }
        case 'spikes': {
          // marca no chão (1 s) → lanças irrompem → afundam
          for (let i = 0; i < e.tg.length; i++) {
            const c = e.tg[i], delay = i >= 4 ? .5 : 0, u = a - delay;
            if (u < 0) continue;
            if (u < 1.05) this.addMark(c, 2.4, smoothstep(u, 0, .9), u);
            const rise = easeOut((u - 1) / .12) * (1 - smoothstep(u, 1.5, 2));
            if (u > 1 && rise > 0) {
              this.addSpike(c.x, c.z, 0, 0, .5, 2.6 * rise);
              for (let k = 0; k < 9; k++) { const ang = k / 9 * TAU + r() * .5, d = .7 + r() * 1.3; this.addSpike(c.x + Math.sin(ang) * d, c.z + Math.cos(ang) * d, Math.sin(ang) * .45, Math.cos(ang) * .45, .25 + r() * .15, (1 + r() * .9) * rise); }
              if (u - dt <= 1) { this.splats.add(c.x, c.z, 2.3, 9); this.drops.burst(this.tmp.set(c.x, .5, c.z), 20, 7, .07, .25); this.io.sfx('fireBoom', .5); }
              if (Math.random() < .5) { const ang = Math.random() * TAU, d = Math.random() * 1.6; this.drops.emit(this.tmp.set(c.x + Math.sin(ang) * d, A.y + 2.2 * rise * Math.random(), c.z + Math.cos(ang) * d), this.tmp2.set(0, -.3, 0), .05 + Math.random() * .04, 1, 0); }
            }
            if (mp && u > 1 && u < 1.2 && Math.hypot(mp.x - c.x, mp.z - c.z) < 2.4 && mp.y - A.y < 2.4) this.strike(e, 0, c.x, c.z);
          }
          break;
        }
        case 'tendrils': {
          // seis tentáculos saem das costas, sobem em arco e caem sobre os alvos
          for (let i = 0; i < e.tg.length; i++) {
            const c = e.tg[i], side = i % 2 ? 1 : -1, start = .45 + i * .06;
            const reach = smoothstep(a, start, start + .75), hold = 1 - smoothstep(a, 1.6 + i * .04, 2.2);
            if (reach <= 0 || hold <= 0) continue;
            const from = this.tmp.set(this.pos.x - Math.sin(this.yaw) * .4 + Math.cos(this.yaw) * side * .3, this.pos.y + 1.9 * SCALE * .75, this.pos.z - Math.cos(this.yaw) * .4 - Math.sin(this.yaw) * side * .3).clone();
            this.tendril(from, c, 4.5 + i * .3, .2, 22, a * 7 + i, reach * hold, side);
            const arrive = start + .75;
            if (a - dt <= arrive && a > arrive) this.burst(this.tmp.set(c.x, .3, c.z), 8, 4, .4);
            if (mp && a > arrive - .02 && a < arrive + .18 && e.hits < 2 && Math.hypot(mp.x - c.x, mp.z - c.z) < 1.7 && mp.y - A.y < 2.2) { if (!e.done.has(i)) { e.hits++; this.strike(e, i, c.x, c.z); } }
          }
          break;
        }
        case 'nova': {
          // reúne o sangue (levita) → anel de sangue rasante que se expande pela arena: pule ou esquive
          // seis correntes de sangue sobem do chão em espiral até as mãos dele
          if (a < 1.15) for (let k = 0; k < 6; k++) {
            const ang = k / 6 * TAU + a * 1.2, d = 6.5, from = this.tmp.set(e.ox + Math.sin(ang) * d, A.y + .05, e.oz + Math.cos(ang) * d);
            this.tendril(from, this.tmp2.set(this.pos.x, A.y + this.hover + 1.7, this.pos.z), 2.2, .16, 20, k * 1.7, smoothstep(a, k * .05, .55 + k * .05) * (1 - smoothstep(a, .95, 1.15)), k % 2 ? 1 : -1);
          }
          const R = 1 + Math.max(0, a - 1.1) * 18;
          if (a > 1.1 && a < 2.7) {
            novaR = R; this.novaX = e.ox; this.novaZ = e.oz; this.novaH = 1.55 * (1 - smoothstep(a, 2.15, 2.7)) * (.85 + .15 * Math.sin(a * 20));
            // crista espirrando gotas e deixando um rastro de respingos
            for (let k = 0; k < 7; k++) {
              const ang = Math.random() * TAU, out = 3 + Math.random() * 4;
              this.drops.emit(this.tmp.set(e.ox + Math.sin(ang) * R, A.y + this.novaH * (.7 + Math.random() * .3), e.oz + Math.cos(ang) * R), this.tmp2.set(Math.sin(ang) * out, 2.5 + Math.random() * 4, Math.cos(ang) * out), .04 + Math.random() * .05, 1.4, Math.random() < .12 ? .2 + Math.random() * .3 : 0);
            }
            if (Math.random() < .35) { const ang = Math.random() * TAU; this.splats.add(e.ox + Math.sin(ang) * R * .97, e.oz + Math.cos(ang) * R * .97, .4 + Math.random() * .6, 7); }
            if (mp && Math.abs(Math.hypot(mp.x - e.ox, mp.z - e.oz) - R) < 1 && this.io.localAir() < .7) this.strike(e, 0, e.ox, e.oz);
          }
          if (a - dt <= 1.1 && a > 1.1) { this.io.sfx('fireBoom', 1.1); this.io.shake(.7); }
          break;
        }
        case 'blink': {
          // some numa névoa de sangue e reaparece atrás do alvo
          if (a > .3 && !e.moved) {
            e.moved = true; this.burst(this.tmp.set(this.pos.x, this.pos.y + 1.4, this.pos.z), 26, 4, .6);
            this.pos.set(e.dx, A.y, e.dz); this.prev.copy(this.pos);
            if (e.tg[0]) this.yaw = Math.atan2(e.tg[0].x - e.dx, e.tg[0].z - e.dz);
            this.burst(this.tmp.set(e.dx, A.y + 1.4, e.dz), 26, 4, .6);
            if (this.io.role() !== 'client' && e.tg[0]) this.fire('whip', [e.tg[0]]);
          }
          break;
        }
        case 'shield': {
          if (a < 1) for (let k = 0; k < 14; k++) { const ang = a * 7 + k / 14 * TAU, d = 3.5 * (1 - easeOut(a)) + 1.2; this.addBlob(this.pos.x + Math.sin(ang) * d, this.pos.y + .4 + k / 14 * 3, this.pos.z + Math.cos(ang) * d, .14); }
          break;
        }
        case 'rain': {
          // gotas gigantes caem do alto sobre marcas no chão perto de cada jogador
          for (let i = 0; i < e.tg.length * 3; i++) {
            const c = e.tg[i % e.tg.length], ox = (r() - .5) * 7, oz = (r() - .5) * 7, delay = r() * .6, u = a - delay;
            const cx = c.x + ox, cz = c.z + oz;
            if (u < 0 || u > 1.6) continue;
            if (u < 1) { this.addMark(this.tmp.set(cx, 0, cz), 1.6, u, u); this.addBlob(cx, A.y + 14 * (1 - u * u), cz, .32, 1.6); }
            if (u - dt <= 1 && u > 1) { this.splats.add(cx, cz, 1.1 + r() * .5, 8); this.drops.burst(this.tmp.set(cx, .25, cz), 12, 5, .07, .4); }
            if (mp && u > 1 && u < 1.15 && Math.hypot(mp.x - cx, mp.z - cz) < 1.7) this.strike(e, 100 + i, cx, cz);
          }
          break;
        }
      }
    }
    this.events = this.events.filter(e => this.ageOf(e) < DUR[e.id]);
    // anel da maré
    this.wave.set(this.novaX, A.y - .05, this.novaZ, novaR, novaR > 0 ? this.novaH : 0);
    this.blob.count = this.nBlob; this.spike.count = this.nSpike; this.mark.count = this.nMark;
    this.blob.instanceMatrix.needsUpdate = true; this.spike.instanceMatrix.needsUpdate = true; this.mark.instanceMatrix.needsUpdate = true;
    if (this.mark.instanceColor) this.mark.instanceColor.needsUpdate = true;
  }

  private handPoint(out: THREE.Vector3) {
    return out.set(this.pos.x + Math.sin(this.yaw) * .7 + Math.cos(this.yaw) * -.45, this.pos.y + 1.55, this.pos.z + Math.cos(this.yaw) * .7 - Math.sin(this.yaw) * -.45);
  }
  /**
   * Tentáculo de sangue: tubo líquido contínuo por uma Bézier que serpenteia (BloodTubes: pulsação que corre até a
   * ponta, ponta afinando). Pinga gotas pelo caminho e a ponta espirra quando chega.
   */
  private tendril(from: THREE.Vector3, to: THREE.Vector3, arc: number, thick: number, _segs: number, phase: number, reach: number, side = 0) {
    const f = this.tf.copy(from), t = this.tt.copy(to);
    const ctrl = this.tc.copy(f).lerp(t, .5); ctrl.y += arc;
    const dx = t.x - f.x, dz = t.z - f.z, l = Math.hypot(dx, dz) || 1, px = -dz / l, pz = dx / l;
    ctrl.x += px * side * arc * .4; ctrl.z += pz * side * arc * .4;
    const time = this.time.value;
    const C = this.tubes.draw((u, out) => {
      const iu = 1 - u, wob = Math.sin(phase + u * 9 - time * 3) * .22 * u * (1 - u) * 4;
      out.set(iu * iu * f.x + 2 * iu * u * ctrl.x + u * u * t.x + px * wob, iu * iu * f.y + 2 * iu * u * ctrl.y + u * u * t.y + Math.cos(phase * 1.3 + u * 7 - time * 4) * .1 * u, iu * iu * f.z + 2 * iu * u * ctrl.z + u * u * t.z + pz * wob);
    }, reach, thick * 1.1, phase, time);
    if (!C) return;
    // gotas que escorrem e pingam ao longo do tentáculo
    if (Math.random() < .12) {
      const i = Math.floor(Math.random() * this.tubes.rings * .9) + 2, p = this.tubes.point(i, this.tD);
      this.drops.emit(p, this.tP.set((Math.random() - .5) * .6, -.5 - Math.random(), (Math.random() - .5) * .6), thick * (.18 + Math.random() * .18), 1.6, Math.random() < .15 ? .1 + Math.random() * .15 : 0);
    }
  }
  private readonly tf = new THREE.Vector3(); private readonly tt = new THREE.Vector3(); private readonly tc = new THREE.Vector3();
  private addBlob(x: number, y: number, z: number, s: number, stretch = 1) {
    if (this.nBlob >= 900) return;
    this.m4.compose(this.tmp.set(x, y, z), this.q.identity(), this.s3.set(s, s * stretch, s)); this.blob.setMatrixAt(this.nBlob++, this.m4);
  }
  private readonly tP = new THREE.Vector3(); private readonly tQ = new THREE.Vector3(); private readonly tD = new THREE.Vector3();
  /** Gomo de sangue de a até b (esfera esticada ao longo do segmento, sobrepondo os vizinhos). */
  private addSeg(a: THREE.Vector3, b: THREE.Vector3, r: number) {
    if (this.nBlob >= 900) return;
    const len = this.tD.copy(b).sub(a).length(); if (len < 1e-4) return;
    this.q.setFromUnitVectors(this.UP, this.tD.divideScalar(len));
    this.m4.compose(this.tmp.copy(a).add(b).multiplyScalar(.5), this.q, this.s3.set(r, Math.max(r, len * .62), r)); this.blob.setMatrixAt(this.nBlob++, this.m4);
  }
  private addSpike(x: number, z: number, tx: number, tz: number, w: number, h: number) {
    if (this.nSpike >= 220 || h <= .01) return;
    this.q.setFromUnitVectors(this.UP, this.tmp.set(tx, 1, tz).normalize());
    this.m4.compose(this.tmp.set(x, A.y - .05, z), this.q, this.s3.set(w, h, w)); this.spike.setMatrixAt(this.nSpike++, this.m4);
  }
  private addMark(c: THREE.Vector3, r: number, k: number, t: number) {
    if (this.nMark >= 46) return;
    const pulse = .55 + .45 * Math.sin(t * 18);
    this.m4.compose(this.tmp2.set(c.x, A.y + .04, c.z), this.q.identity(), this.s3.set(r, 1, r)); this.mark.setMatrixAt(this.nMark, this.m4);
    this.mark.setColorAt(this.nMark++, this.col.setRGB(1.4 * pulse, .06, .08));
    this.m4.compose(this.tmp2.set(c.x, A.y + .05, c.z), this.q.identity(), this.s3.set(r * Math.max(.05, k), 1, r * Math.max(.05, k))); this.mark.setMatrixAt(this.nMark, this.m4);
    this.mark.setColorAt(this.nMark++, this.col.setRGB(.9, .04, .06));
  }
  /** Jorro de sangue: gotas esticadas pela velocidade; parte delas deixa respingos onde cai. */
  private burst(at: THREE.Vector3, n: number, speed: number, _life: number) {
    this.drops.burst(at, n, speed * 1.1, .06, .25);
  }
  private stepParticles(dt: number) { this.drops.update(dt); this.splats.update(dt); }

  /* ================================================================ quadro */

  update(dt: number, elapsed: number) {
    this.time.value = elapsed;
    this.tubes.begin();
    const role = this.io.role(), me = this.io.players()[0];
    // carrega o modelo quando alguém chega perto do portal ou já está na arena
    if (!this.loading.started && me && (LiebBoss.inArena(me.pos) || Math.hypot(me.pos.x - PORTAL.x, me.pos.z - PORTAL.z) < 55)) this.load();
    this.phaseT += dt; this.hitFlash = Math.max(0, this.hitFlash - dt); this.shieldFlash = Math.max(0, this.shieldFlash - dt);
    this.stagger = Math.max(0, this.stagger - dt);

    if (this.phase === 'intro') {
      // ergue-se do trono envolto em sangue, desce os degraus e abre os braços
      const k = this.phaseT;
      this.hover = k < 4.6 ? 1.5 * smoothstep(k, 1.2, 3.4) : 1.5 * (1 - smoothstep(k, 5.6, 6.6));
      this.pos.z = LIEB_POINTS.throne.z + 2.6 * smoothstep(k, 3.6, 6);
      if (k < 5.2) for (let i = 0; i < 4; i++) {
        const a0 = i / 4 * TAU, grow = smoothstep(k, .3 + i * .15, 2.2 + i * .15) * (1 - smoothstep(k, 4.6, 5.2)), cx = this.pos.x, cz = this.pos.z, top = A.y + this.hover + 2.6;
        this.tubes.draw((u, out) => { const ang = a0 + u * 7 + k * 2.2, rr = 1.6 - u * .9; out.set(cx + Math.sin(ang) * rr, A.y + u * (top - A.y), cz + Math.cos(ang) * rr); }, grow, .13, i * 1.9, elapsed);
        if (grow > .2 && Math.random() < .4) this.drops.emit(this.tmp.set(cx + (Math.random() - .5) * 2.4, A.y + Math.random() * 2.5, cz + (Math.random() - .5) * 2.4), this.tmp2.set(0, -1, 0), .05, 1, Math.random() < .3 ? .3 : 0);
      }
      if (k > INTRO_SECS) { this.phase = 'fight'; this.phaseT = 0; this.cooldown = 1.2; }
    } else if (this.phase === 'fight') {
      if (role !== 'client') this.think(dt);
      else if (this.net) {
        this.pos.x = damp(this.pos.x, this.net.x, 10, dt); this.pos.z = damp(this.pos.z, this.net.z, 10, dt);
        if (Math.hypot(this.pos.x - this.net.x, this.pos.z - this.net.z) > 6) this.pos.set(this.net.x, A.y, this.net.z);
        this.yaw += wrap(this.net.yaw - this.yaw) * (1 - Math.exp(-dt * 12));
      }
      const nova = this.events.find(e => e.id === 'nova'), na = nova ? this.ageOf(nova) : -1;
      this.hover = damp(this.hover, nova && na < 2.6 ? 1.3 : 0, 4, dt);
    } else if (this.phase === 'dead') {
      this.hover = 0;
      if (this.phaseT > 4) this.root.visible = false;
      if (role !== 'client') { this.respawnT += dt; if (this.respawnT > 90) { this.respawnT = 0; this.resetBoss(true); } }
    } else this.hover = .25 + Math.sin(elapsed * .9) * .08;

    // velocidade real (clientes também: anima a corrida a partir do movimento)
    const moved = Math.hypot(this.pos.x - this.prev.x, this.pos.z - this.prev.z) / Math.max(dt, 1e-3); this.prev.copy(this.pos);
    if (role === 'client' || this.phase !== 'fight') this.speed = damp(this.speed, moved > 15 ? 0 : moved, 8, dt);

    this.runEvents(dt);
    this.stepParticles(dt);

    // estado para os clientes
    if (role === 'host' && this.phase !== 'dormant') {
      this.stateAcc += dt;
      if (this.stateAcc >= .1) {
        this.stateAcc = 0;
        this.io.send({ t: 'lb', p: PHASES.indexOf(this.phase), x: Math.round(this.pos.x * 100) / 100, z: Math.round(this.pos.z * 100) / 100, yw: Math.round(this.yaw * 1000) / 1000, h: Math.round(this.hp), mh: this.maxHp, sh: Math.round(this.shield), sm: Math.round(this.shieldMax), hv: Math.round(this.hover * 100) / 100 });
      }
    }

    // corpo: mesmo sistema de poses do jogador
    const root = this.root;
    root.position.set(this.pos.x, A.y + this.hover, this.pos.z);
    root.userData.facing = this.yaw;
    const ev = this.events.find(e => e.id !== 'rain'), ea = ev ? this.ageOf(ev) : 0;
    let pose: HeroPose = this.speed > 3.2 ? 'run' : this.speed > .4 ? 'walk' : 'idle', overlay: HeroOverlay | undefined;
    const loco = pose;
    if (this.phase === 'dead') pose = 'defeat';
    else if (this.phase === 'intro') { pose = this.phaseT < 4.6 ? 'fly' : 'cast'; root.userData.castKind = 'flight'; }
    else if (this.stagger > 0) pose = 'hit';
    else if (this.shield > 0 && (!ev || ev.id === 'shield')) overlay = { mode: 'shield', power: 1 };
    else if (ev) {
      if (ev.id === 'whip') { pose = ea < .9 ? 'attack' : 'cast'; root.userData.castKind = 'judradjim'; }
      else if (ev.id === 'spikes') { pose = 'cast'; root.userData.castKind = 'judradjim'; }
      else if (ev.id === 'tendrils') { pose = 'cast'; root.userData.castKind = 'vollzanbel'; }
      else if (ev.id === 'nova') { pose = ea < 1.1 ? 'fly' : 'cast'; root.userData.castKind = 'flight'; }
      else if (ev.id === 'shield') overlay = { mode: 'shield', power: 1 };
      else if (ev.id === 'blink') { pose = 'dodge'; root.visible = this.ready && (ea < .22 || ea > .42); }
    }
    if (!ev || ev.id !== 'blink') root.visible = this.ready && !(this.phase === 'dead' && this.phaseT > 4);
    root.userData.locoPose = loco;
    if (this.ready && root.visible) {
      this.hero.update(elapsed, dt, pose, this.speed, overlay);
      // sem arma: o Lieb luta só com o sangue
      const staff = root.getObjectByName('heirloom-staff'); if (staff) staff.visible = false;
    }

    // escudo de sangue
    if (this.shield > 0) {
      const s = 1.9 * SCALE * (1 + Math.sin(elapsed * 3) * .02);
      this.shieldMesh.position.set(this.pos.x, A.y + this.hover + 1.25 * SCALE, this.pos.z); this.shieldMesh.scale.setScalar(s);
      this.shieldMat.uniforms.uHp.value = this.shield / Math.max(1, this.shieldMax); this.shieldMat.uniforms.uFlash.value = this.shieldFlash * 3;
      // três correntes de sangue circulam a esfera (cada uma inclinada) e o sangue escorre pela base
      const cy = A.y + this.hover + 1.25 * SCALE, cx = this.pos.x, cz = this.pos.z;
      for (let k = 0; k < 3; k++) {
        const tilt = .5 + k * .45, spin = elapsed * (1.4 + k * .3) + k * 2.1, rr = s * 1.06;
        this.tubes.draw((u, out) => { const ang = spin + u * 4.4, x = Math.sin(ang) * rr, y = Math.cos(ang) * rr; out.set(cx + x, cy + y * Math.sin(tilt) * .55 + Math.sin(u * 9 + elapsed * 3) * .06, cz + y * Math.cos(tilt)); }, 1, .09, k * 2.3, elapsed);
      }
      if (Math.random() < .6) { const ang = Math.random() * TAU, d = Math.random() * s * .6; this.drops.emit(this.tmp.set(cx + Math.sin(ang) * d, cy - s * .92, cz + Math.cos(ang) * d), this.tmp2.set(0, -.4, 0), .05 + Math.random() * .05, 1.2, Math.random() < .5 ? .25 + Math.random() * .3 : 0); }
    } else this.shieldMesh.position.y = -600;
    this.tubes.end();

    // cristal do pilar (some enquanto a luta acontece) e portais
    const idle = this.phase === 'dormant';
    this.crystal.visible = idle; this.crystal.rotation.y = elapsed * .8; this.crystal.position.y = 3.05 + Math.sin(elapsed * 1.6) * .12;
    this.crystalMat.emissiveIntensity = 1.3 + Math.sin(elapsed * 3) * .5;
    this.veilOpen = damp(this.veilOpen, this.ready || this.loading.started ? 1 : .75, 2, dt);
    for (const s of this.swirls) s.uniforms.uOpen.value = this.veilOpen;
  }
  /** Gotas extras depois de runEvents (órbita do escudo). */
  private addBlobLate(x: number, y: number, z: number, s: number) {
    if (this.nBlob >= 900) return;
    this.m4.compose(this.tmp.set(x, y, z), this.q.identity(), this.s3.set(s, s, s)); this.blob.setMatrixAt(this.nBlob++, this.m4);
    this.blob.count = this.nBlob; this.blob.instanceMatrix.needsUpdate = true;
  }

  /** Barra do chefe (HUD). */
  hud() {
    return { show: this.phase === 'intro' || this.phase === 'fight', hp: this.hp, max: this.maxHp, shield: this.shield, shieldMax: this.shieldMax, stagger: this.stagger > 0, enraged: this.hp / this.maxHp < .3 };
  }
  /** Centro do corpo (para trava de alvo). */
  center(out: THREE.Vector3) { return out.set(this.pos.x, A.y + this.hover + 1.3 * SCALE, this.pos.z); }
  get alive() { return this.phase === 'fight' && this.root.visible; }
}
