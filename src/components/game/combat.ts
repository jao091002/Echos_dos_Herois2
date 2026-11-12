import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';
import { registerSpecGloss, retargetModel, type Retarget } from './rig-retarget';
import { adoptFragments, bindSkin, computeSkin, placeAt, segDist, tearSeams, textureSampler, toLocal, type SkinSeg } from './mob-skin';
import { terrainHeight, type WorldCollider } from './world';
import type { SfxName } from './audio';
import type { LootItemId } from './progression';

export type MobKind = 'wolf' | 'bandit' | 'demon';
type V3 = [number, number, number];

const TAU = Math.PI * 2;
const { clamp, damp, lerp, smoothstep } = THREE.MathUtils;
const fract = (x: number) => x - Math.floor(x);
const PELVIS_Y = 1.1;

/* ------------------------------------------------------------------ *
 *  Pose / keyframe system
 *  Every attack is a list of keyframes over normalized time (0..1).
 *  A Pose is a small set of "intent" values that the rig applies to
 *  the torso, head, arms, jaw and legs (legs are solved with IK).
 * ------------------------------------------------------------------ */
type Pose = {
  lean: number; twist: number; roll: number; drop: number; push: number;
  head: number; headYaw: number; jaw: number;
  rX: number; rZ: number; rE: number; lX: number; lZ: number; lE: number;
  reach: number; tail: number; glow: number;
};
const POSE_FIELDS: (keyof Pose)[] = ['lean', 'twist', 'roll', 'drop', 'push', 'head', 'headYaw', 'jaw', 'rX', 'rZ', 'rE', 'lX', 'lZ', 'lE', 'reach', 'tail', 'glow'];
const newPose = (): Pose => ({ lean: 0, twist: 0, roll: 0, drop: 0, push: 0, head: 0, headYaw: 0, jaw: 0, rX: 0, rZ: 0, rE: 0, lX: 0, lZ: 0, lE: 0, reach: 0, tail: 0, glow: 0 });
const clearPose = (p: Pose) => { for (const f of POSE_FIELDS) p[f] = 0; };

type Ease = 'smooth' | 'in' | 'out' | 'back';
type Key = Partial<Pose> & { t: number; ease?: Ease };

function ease(kind: Ease, u: number) {
  switch (kind) {
    case 'in': return u * u * u;
    case 'out': return 1 - Math.pow(1 - u, 3);
    case 'back': { const c1 = 1.2, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); }
    default: return u * u * (3 - 2 * u);
  }
}

function sampleKeys(keys: Key[], t: number, out: Pose) {
  t = clamp(t, 0, 1);
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1].t) i++;
  const a = keys[i], b = keys[i + 1];
  const u = clamp((t - a.t) / Math.max(1e-4, b.t - a.t), 0, 1);
  const e = ease(b.ease ?? 'smooth', u);
  for (const f of POSE_FIELDS) { const av = a[f] ?? 0, bv = b[f] ?? 0; out[f] = av + (bv - av) * e; }
}

type AttackId = 'bite' | 'overhead' | 'slash' | 'swipe' | 'slam';
/** Ordem fixa dos golpes (índice enviado pela rede nas fotos do host). */
const ATTACK_IDS: AttackId[] = ['bite', 'overhead', 'slash', 'swipe', 'slam'];
type AttackDef = {
  id: AttackId; duration: number; hitAt: number;
  lunge: number; lungeFrom: number; lungeTo: number; air: number;
  damage: number; aoe: boolean; arc: 'none' | 'h' | 'v'; keys: Key[];
};

// Arm convention: X negative = raise forward/up, E = elbow flexion, Z = outward.
// lean/head positive = forward/down. twist positive pulls the weapon-side shoulder back.
const ATTACKS: Record<AttackId, AttackDef> = {
  bite: {
    id: 'bite', duration: .85, hitAt: .55, lunge: 1.05, lungeFrom: .34, lungeTo: .55, air: .3, damage: 1, aoe: false, arc: 'none',
    keys: [
      { t: 0 },
      { t: .32, lean: -.1, drop: -.2, push: -.15, head: -.25, jaw: .2, tail: .5, glow: .7 },
      { t: .5, lean: .28, drop: .02, push: .34, head: .5, jaw: 1, reach: 1, tail: -.3, glow: 1, ease: 'out' },
      { t: .58, lean: .32, push: .36, head: .6, jaw: 0, reach: .9, tail: -.3, glow: 1, ease: 'in' },
      { t: .8, lean: .1, push: .1, head: .15, reach: .2, jaw: .05 },
      { t: 1 },
    ],
  },
  overhead: {
    id: 'overhead', duration: 1.1, hitAt: .54, lunge: .5, lungeFrom: .4, lungeTo: .56, air: 0, damage: 1, aoe: false, arc: 'v',
    keys: [
      { t: 0 },
      { t: .4, lean: -.22, drop: -.04, push: -.1, twist: .2, head: -.14, rX: -2.7, rE: 1, rZ: .2, lX: -.45, lE: .7, lZ: .35, glow: .6 },
      { t: .54, lean: .4, drop: -.14, push: .2, twist: -.15, head: .22, rX: -.7, rE: .15, rZ: .05, lX: .3, lE: .5, lZ: .45, glow: 1, ease: 'in' },
      { t: .72, lean: .38, drop: -.13, push: .18, twist: -.15, head: .2, rX: -.65, rE: .2, rZ: .05, lX: .3, lE: .5, lZ: .4 },
      { t: 1 },
    ],
  },
  slash: {
    id: 'slash', duration: .95, hitAt: .5, lunge: .45, lungeFrom: .34, lungeTo: .5, air: 0, damage: 1, aoe: false, arc: 'h',
    keys: [
      { t: 0 },
      { t: .34, lean: -.06, drop: -.1, push: -.12, twist: .85, roll: .12, head: -.05, headYaw: -.35, rX: -1, rE: .5, rZ: .15, lX: -.3, lE: .9, lZ: .4, glow: .6 },
      { t: .5, lean: .2, drop: -.1, push: .18, twist: -.85, roll: -.1, head: .05, headYaw: .3, rX: -1.2, rE: .15, rZ: .1, lX: .2, lE: .3, lZ: .9, glow: 1, ease: 'out' },
      { t: .68, lean: .2, drop: -.1, push: .18, twist: -.8, roll: -.1, head: .05, headYaw: .3, rX: -1.2, rE: .2, rZ: .1, lX: .2, lE: .3, lZ: .8 },
      { t: 1 },
    ],
  },
  swipe: {
    id: 'swipe', duration: 1, hitAt: .5, lunge: .4, lungeFrom: .34, lungeTo: .5, air: 0, damage: 1, aoe: false, arc: 'h',
    keys: [
      { t: 0 },
      { t: .36, lean: -.1, drop: -.1, push: -.1, twist: .55, roll: .08, head: -.06, headYaw: -.3, rX: -.8, rE: .6, rZ: .5, lX: -.5, lE: 1, lZ: .4, glow: 1 },
      { t: .5, lean: .28, drop: -.1, push: .25, twist: -.6, roll: -.08, head: .1, headYaw: .25, rX: -1.2, rE: .1, rZ: .1, lX: -1, lE: .3, lZ: .1, glow: 1, ease: 'out' },
      { t: .7, lean: .25, drop: -.08, push: .22, twist: -.55, head: .08, headYaw: .2, rX: -1.1, rE: .15, rZ: .1, lX: -.9, lE: .3, lZ: .1 },
      { t: 1 },
    ],
  },
  slam: {
    id: 'slam', duration: 1.3, hitAt: .56, lunge: .25, lungeFrom: .46, lungeTo: .56, air: 0, damage: 1.35, aoe: true, arc: 'none',
    keys: [
      { t: 0 },
      { t: .46, lean: -.32, drop: -.05, push: -.14, head: -.28, rX: -2.8, rE: .5, rZ: .35, lX: -2.8, lE: .5, lZ: .35, glow: 1 },
      { t: .56, lean: .5, drop: -.22, push: .28, head: .3, rX: -.4, rE: .2, rZ: .1, lX: -.4, lE: .2, lZ: .1, glow: 1, ease: 'in' },
      { t: .76, lean: .46, drop: -.2, push: .26, head: .28, rX: -.4, rE: .2, rZ: .1, lX: -.4, lE: .2, lZ: .1 },
      { t: 1 },
    ],
  },
};

const FLINCH: Key[] = [
  { t: 0 },
  { t: .18, lean: -.3, drop: -.05, push: -.18, head: -.35, jaw: .5, rX: .5, lX: .5, rE: .5, lE: .5, rZ: .5, lZ: .5 },
  { t: 1 },
];

/* ------------------------------------------------------------------ *
 *  Rig types
 * ------------------------------------------------------------------ */
type Leg = {
  hip: THREE.Group; knee: THREE.Group; ankle: THREE.Group;
  hy: number; hz: number; l1: number; l2: number; bend: number;
  /** phase = fase no trote/caminhada; gallopPhase = fase no galope (sequência rotatória: traseiras, depois dianteiras). */
  phase: number; gallopPhase: number; front: boolean; side: number;
  /** Tornozelo (espaço do root): altura, avanço na marcha e avanço parado (pose esculpida do modelo). */
  footY: number; footZ: number; restZ: number;
  /** Comprimento quadril→tornozelo da pose de ligação: na marcha de compasso a perna de apoio mantém esse valor. */
  stance: number;
};
type Gait = { stride: number; duty: number; lift: number };
/**
 * Ajuste do rig a um modelo com skin procedural: pivôs no lugar das juntas do modelo, pose neutra igual à pose
 * esculpida (braços já afastados, boca já aberta...) e passadas compatíveis com o tamanho real das pernas.
 */
type RigFit = {
  pelvisY: number; pelvisZ: number; walkDrop: number; jaw: number;
  arm: { x: number; z: number; e: number };
  gait: Gait; gallop: Gait | null; cadence: number; legScale: number;
  /** Humanoides: altura da pelve pela perna de apoio (Leg.stance), em vez de um quique fixo. */
  compass: boolean;
};
type Arm = { shoulder: THREE.Group; elbow: THREE.Group; wrist: THREE.Group; side: number; legPhase: number; weapon: boolean };
type Chain = {
  segs: THREE.Object3D[]; restX: number[]; restZ: number[]; x: number[]; z: number[]; vx: number[]; vz: number[];
  k: number; c: number; gainF: number; gainS: number; wave: number; angle: number; lat: 'y' | 'z';
};
type Rig = {
  pelvis: THREE.Group; chest: THREE.Group; neck: THREE.Group | null; head: THREE.Group; jaw: THREE.Group | null;
  legs: Leg[]; arms: Arm[]; ears: { group: THREE.Group; side: number }[];
  tail: Chain | null; braids: Chain[]; cloth: Chain[]; breath: THREE.Mesh | null; target: THREE.Mesh; modelMesh?: THREE.Mesh; retarget?: Retarget;
  fit?: RigFit;
};
type MatEntry = { m: THREE.MeshStandardMaterial; base: number };
type ArcFx = { pivot: THREE.Group; ring: THREE.Mesh; material: THREE.MeshBasicMaterial; axis: 'x' | 'y'; from: number; to: number };

type Mob = {
  kind: MobKind; root: THREE.Group; rig: Rig; target: THREE.Mesh;
  health: number; phase: number; attackTimer: number; respawnTimer: number; spawn: number; hitFlash: number; flashing: boolean;
  attack: AttackDef | null; attackAge: number; attackHit: boolean; lungeU: number; air: number;
  gait: number; speed: number; alert: number; guard: number; aggro: boolean; look: number; slope: number;
  /** 0 = trote, 1 = galope (lobo); misturado continuamente pela velocidade. */
  gallop: number;
  stagger: number; staggerMax: number; staggerPower: number;
  /** Direção do último golpe no espaço do inimigo (x = lado, z = frente); o recuo e a queda vão para o lado oposto. */
  hitX: number; hitZ: number;
  deathAge: number; deathSide: number; knockback: THREE.Vector3;
  home: THREE.Vector3; homeYaw: number; strafeDir: number; strafeTimer: number;
  vel: THREE.Vector2; prev: THREE.Vector2; vf: number; vs: number;
  pose: Pose; mats: MatEntry[]; eyes: MatEntry[]; arc: ArcFx | null;
  /** Preso no Agarrão do guerreiro: posição/rotação vêm de fora (GrabHandle), sem IA. */
  held?: { yaw: number; tilt: number; lift: number } | null;
  /** Multijogador (cliente): última foto do host para este inimigo. */
  net?: { x: number; z: number; yaw: number; atk: number; age: number; stagger: number; air: number; heldTilt: number; heldLift: number };
  /** Multijogador (host): última vez (ms) que um cliente mandou a posição deste inimigo agarrado. */
  netHeldAt?: number;
};
/** Controle de um inimigo agarrado (Agarrão do guerreiro). */
export type GrabHandle = {
  readonly kind: MobKind;
  /** Vivo e ainda preso. */
  readonly alive: boolean;
  readonly position: THREE.Vector3;
  /** Coloca o inimigo (pés em x/z, altura extra lift), virado para yaw e tombado tilt rad (deitado ≈ 1.35). */
  hold: (x: number, z: number, yaw: number, tilt: number, lift?: number) => void;
  hit: (damage: number) => void;
  /** Solta com um empurrão (x/z em m/s). */
  release: (pushX?: number, pushZ?: number) => void;
};
type Drop = { root: THREE.Group; kind: 'experience' | LootItemId; age: number; value: number; materials: THREE.Material[]; color: string };
/**
 * Luzes pontuais com contagem FIXA: no three.js o número de luzes faz parte da chave do shader, então criar/esconder
 * uma luz (drop novo, mob morto ou renascendo) recompila TODOS os materiais iluminados — engasgos de vários segundos.
 * Os drops dividem um conjunto fixo de luzes (as mais próximas da heroína recebem luz); mobs mantêm a sua luz sempre
 * na cena, apenas apagada enquanto estão escondidos.
 */
const DROP_LIGHTS = 3;
type FillLight = { light: THREE.PointLight; mob: THREE.Object3D; base: number; offset: THREE.Vector3 };
type Spawn = { kind: MobKind; x: number; z: number };

const SPAWNS: Spawn[] = [
  { kind: 'wolf', x: -5.6, z: -23 }, { kind: 'wolf', x: 5.8, z: -29 }, { kind: 'wolf', x: 9, z: -39 },
  { kind: 'bandit', x: -9, z: -36 }, { kind: 'bandit', x: 7.5, z: -44 },
  { kind: 'demon', x: -2.5, z: -52 }, { kind: 'demon', x: 11, z: -60 },
];

/** Diferença de altura máxima (m) para um golpe corpo-a-corpo alcançar o jogador. */
const MELEE_HEIGHT = 2.1;
/** Fração de `radius` usada como corpo sólido (o raio cheio é a área de acerto, mais generosa). */
const MOB_BODY = .75;
/** Raio da jogadora (igual ao do PlayerMotor). */
const PLAYER_RADIUS = .62;
/** Acima dessa diferença de altura a jogadora passa por cima dos inimigos (pulo alto / voo). */
const MOB_PLAYER_HEIGHT = 1.6;
/** Tamanho da célula da grade espacial de colisores (m). */
const GRID_CELL = 4;
const MOB_STATS: Record<MobKind, { hp: number; xp: number; speed: number; range: number; damage: number; cadence: number; radius: number }> = {
  wolf: { hp: 72, xp: 28, speed: 3.2, range: 1.35, damage: 5, cadence: 1.8, radius: .8 },
  bandit: { hp: 120, xp: 46, speed: 2.2, range: 2.1, damage: 9, cadence: 2.4, radius: .72 },
  demon: { hp: 190, xp: 82, speed: 1.8, range: 2.35, damage: 14, cadence: 2.7, radius: 1.05 },
};

// stride = foot travel per step (m), duty = fraction of the cycle a foot is planted, lift = swing height
const GAIT: Record<MobKind, Gait> = {
  wolf: { stride: .95, duty: .58, lift: .17 },
  bandit: { stride: .7, duty: .62, lift: .14 },
  demon: { stride: .8, duty: .64, lift: .12 },
};
/** Galope do lobo procedural: apoio curto (fase aérea), passada longa e patas subindo mais. */
const WOLF_GALLOP: Gait = { stride: 1.15, duty: .34, lift: .22 };
/** Velocidades (m/s) em que o lobo passa do trote ao galope. */
const GALLOP_FROM = 2.35, GALLOP_TO = 3.05;
const strideAmp = (g: { stride: number }, speedN: number) => g.stride * smoothstep(speedN, .06, .7) * (.85 + .15 * Math.min(speedN, 1.4));
/** Interpolação de fase no círculo (0..1), pelo caminho mais curto. */
const lerpPhase = (a: number, b: number, t: number) => { let d = b - a; d -= Math.round(d); return a + d * t; };

/* ------------------------------------------------------------------ *
 *  Anatomia dos modelos com skin procedural (medida nos próprios .glb,
 *  espaço do root: y = altura do chão, +z = frente, x = lado; valores de
 *  x dos membros são do lado +X e espelhados para o outro lado)
 * ------------------------------------------------------------------ */
/** wolf.glb (escala 1,1, centrado na caixa envolvente, patas em y = 0). */
const WOLF_ANAT = {
  pelvis: [0, .56, -.33] as V3, chest: [0, .58, .3] as V3, neck: [0, .7, .42] as V3, head: [0, .88, .62] as V3, jaw: [0, .775, .69] as V3,
  tail: [[0, .6, -.42], [0, .36, -.6], [0, .29, -.79]] as V3[],
  /** ombro → cotovelo → carpo (tornozelo do rig) → pata */
  front: { hip: [.2, .56, .31] as V3, l1: .184, l2: .3, footY: .12, footZ: .465 },
  /** quadril → joelho → jarrete (tornozelo do rig) → pata */
  hind: { hip: [.17, .56, -.33] as V3, l1: .206, l2: .206, footY: .28, footZ: -.41 },
  /** apoio das patas na marcha (a pose esculpida tem as dianteiras bem à frente) */
  frontWalkZ: .4, hindWalkZ: -.4,
};
/** Ossos do lobo: 0 pelve, 1 peito, 2 pescoço, 3 cabeça, 4 mandíbula, 5-7 cauda, 8-19 patas (DE, DD, TE, TD × quadril/joelho/tornozelo). */
const WOLF_BONES = 20;
const WOLF_SKIN: SkinSeg[] = (() => {
  const s: SkinSeg[] = [
    { bone: 0, a: [0, .58, -.45], b: [0, .6, -.02], r: .2 },
    { bone: 1, a: [0, .6, -.02], b: [0, .64, .36], r: .25 },
    { bone: 2, a: [0, .66, .36], b: [0, .86, .6], r: .17 },
    { bone: 3, a: [0, .9, .6], b: [0, .84, .96], r: .15 },
    { bone: 4, a: [0, .75, .7], b: [0, .66, .93], r: .07 },
    { bone: 5, a: [0, .6, -.42], b: [0, .36, -.6], r: .1 },
    { bone: 6, a: [0, .36, -.6], b: [0, .29, -.79], r: .1 },
    { bone: 7, a: [0, .29, -.79], b: [0, .56, -.97], r: .11 },
  ];
  for (const side of [-1, 1]) {
    s.push({ bone: 3, a: [side * .14, 1, .66], b: [side * .2, 1.2, .42], r: .07 }); // chifres
    const f = side < 0 ? 8 : 11, h = side < 0 ? 14 : 17;
    s.push({ bone: f, a: [side * .2, .56, .31], b: [side * .21, .38, .35], r: .085, cut: .2, side });
    s.push({ bone: f + 1, a: [side * .21, .38, .35], b: [side * .22, .12, .465], r: .075, cut: .15, side });
    s.push({ bone: f + 2, a: [side * .22, .12, .465], b: [side * .23, .02, .56], r: .07, cut: .14, side });
    s.push({ bone: h, a: [side * .17, .56, -.33], b: [side * .2, .38, -.23], r: .11, cut: .22, side });
    s.push({ bone: h + 1, a: [side * .2, .38, -.23], b: [side * .21, .28, -.41], r: .075, cut: .15, side });
    s.push({ bone: h + 2, a: [side * .21, .28, -.41], b: [side * .21, .03, -.31], r: .07, cut: .14, side });
  }
  return s;
})();

/** aura.glb (altura 2,3 m, eixo do corpo na origem depois de DEMON_DZ). */
const DEMON_DZ = -.18;
const DEMON_ANAT = {
  pelvis: [0, 1.12, .02] as V3, torso: [0, 1.2, 0] as V3, head: [0, 1.8, -.1] as V3,
  // eixo do braço medido pela luva, fatia por fatia
  shoulder: [.2, 1.62, -.11] as V3, elbow: [.285, 1.36, -.072] as V3, wrist: [.372, 1.1, -.021] as V3, hand: [.39, .96, -.02] as V3,
  hip: [.056, 1.07, .04] as V3, knee: [.06, .64, .06] as V3, ankle: [.06, .21, .02] as V3, toe: [.06, .03, .14] as V3, heel: [.06, .03, -.08] as V3,
  l1: .44, l2: .44, footY: .21, footZ: .02,
};
/** Ossos do demônio: 0 pelve, 1 tronco, 2 cabeça, 3-8 braços (E, D × ombro/cotovelo/pulso), 9-14 pernas (E, D × quadril/joelho/tornozelo), 15-20 painéis da saia. */
const DEMON_BONES = 21;
const DEMON_SKIN: SkinSeg[] = (() => {
  const A = DEMON_ANAT, m = (p: V3, s: number): V3 => [p[0] * s, p[1], p[2]];
  const s: SkinSeg[] = [
    { bone: 0, a: [0, .98, .02], b: [0, 1.24, 0], r: .16, rz: .12 },
    { bone: 1, a: [0, 1.24, 0], b: [0, 1.6, -.07], r: .17, rz: .13 },
    { bone: 2, a: [0, 1.6, -.07], b: [0, 1.76, -.1], r: .06 },
    { bone: 2, a: [0, 1.78, -.1], b: [0, 2.12, -.13], r: .2 },
  ];
  for (const side of [-1, 1]) {
    const arm = side < 0 ? 3 : 6, leg = side < 0 ? 9 : 12;
    s.push({ bone: 2, a: [side * .12, 2.05, -.08], b: [side * .2, 2.3, -.12], r: .06 }); // chifres
    // luvas finas: cortes justos para os volumes da saia ao lado dos quadris não seguirem as mãos
    s.push({ bone: arm, a: m(A.shoulder, side), b: m(A.elbow, side), r: .05, cut: .07, side });
    s.push({ bone: arm + 1, a: m(A.elbow, side), b: m(A.wrist, side), r: .045, cut: .062, side });
    s.push({ bone: arm + 2, a: m(A.wrist, side), b: m(A.hand, side), r: .05, cut: .075, side });
    // cortes justos: o vestido que passa perto das coxas fica com a pelve/saia, não balança junto com a perna
    s.push({ bone: leg, a: m(A.hip, side), b: m(A.knee, side), r: .085, cut: .11, side });
    s.push({ bone: leg + 1, a: m(A.knee, side), b: m(A.ankle, side), r: .06, cut: .09, side });
    s.push({ bone: leg + 2, a: m(A.ankle, side), b: m(A.toe, side), r: .055, cut: .1, side });
    s.push({ bone: leg + 2, a: m(A.ankle, side), b: m(A.heel, side), r: .045, cut: .08, side });
  }
  return s;
})();

const LOOT: Record<LootItemId, { color: string }> = {
  wolfPelt: { color: '#c3a77d' }, banditToken: { color: '#d0ad65' }, demonAsh: { color: '#a66a64' },
  moonFang: { color: '#b9d5ce' }, ancientSigil: { color: '#d6ba83' }, demonHeart: { color: '#ef6c63' },
};
const LOOT_NAMES: Record<LootItemId, string> = {
  moonFang: 'Presa lunar', ancientSigil: 'Selo ancestral', demonHeart: 'Coração demoníaco',
  wolfPelt: 'Pele de lobo', banditToken: 'Ficha de bandido', demonAsh: 'Cinza demoníaca',
};

function part(parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, position: V3, scale: V3 = [1, 1, 1], rotation: V3 = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position); mesh.scale.set(...scale); mesh.rotation.set(...rotation);
  mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh);
  return mesh;
}

function makeChain(segs: THREE.Object3D[], restX: number[], o: Partial<Pick<Chain, 'k' | 'c' | 'gainF' | 'gainS' | 'wave' | 'angle' | 'lat'>> = {}): Chain {
  return {
    segs, restX, restZ: restX.map(() => 0), x: restX.slice(), z: segs.map(() => 0), vx: segs.map(() => 0), vz: segs.map(() => 0),
    k: o.k ?? 40, c: o.c ?? 5, gainF: o.gainF ?? .06, gainS: o.gainS ?? -.04, wave: o.wave ?? .04, angle: o.angle ?? 0, lat: o.lat ?? 'z',
  };
}

/** Small instanced particle pool for hit sparks, dust and impact debris. */
class ParticlePool {
  readonly mesh: THREE.InstancedMesh;
  readonly material: THREE.MeshBasicMaterial;
  private readonly items: { p: THREE.Vector3; v: THREE.Vector3; life: number; max: number; size: number }[];
  private cursor = 0;
  private active = 0;
  private readonly dummy = new THREE.Object3D();
  private readonly color = new THREE.Color();

  constructor(geometry: THREE.BufferGeometry, private count = 96) {
    this.material = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .92, depthWrite: false });
    this.mesh = new THREE.InstancedMesh(geometry, this.material, count);
    this.mesh.frustumCulled = false; this.mesh.name = 'combat-particles';
    this.items = Array.from({ length: count }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), life: 0, max: 1, size: 1 }));
    this.dummy.scale.setScalar(0); this.dummy.updateMatrix();
    for (let i = 0; i < count; i++) { this.mesh.setMatrixAt(i, this.dummy.matrix); this.mesh.setColorAt(i, this.color.set('#ffffff')); }
  }

  emit(origin: THREE.Vector3, color: string, n: number, speed: number, up: number, life: number, size: number) {
    this.color.set(color);
    for (let i = 0; i < n; i++) {
      const index = this.cursor++ % this.count, it = this.items[index];
      const a = Math.random() * TAU, r = .35 + Math.random() * .65;
      it.p.copy(origin);
      it.v.set(Math.cos(a) * speed * r, up * (.5 + Math.random()), Math.sin(a) * speed * r);
      it.life = it.max = life * (.7 + Math.random() * .5);
      it.size = size * (.7 + Math.random() * .6);
      this.mesh.setColorAt(index, this.color);
    }
    this.active = this.count;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  update(dt: number) {
    if (this.active <= 0) return;
    let alive = 0;
    for (let i = 0; i < this.count; i++) {
      const it = this.items[i];
      if (it.life <= 0) continue;
      it.life -= dt;
      if (it.life <= 0) this.dummy.scale.setScalar(0);
      else {
        alive++;
        it.v.y -= 9 * dt; it.v.multiplyScalar(Math.exp(-1.6 * dt)); it.p.addScaledVector(it.v, dt);
        const ground = terrainHeight(it.p.x, it.p.z) + .04;
        if (it.p.y < ground) { it.p.y = ground; it.v.y *= -.3; it.v.x *= .6; it.v.z *= .6; }
        this.dummy.scale.setScalar(it.size * (it.life / it.max));
      }
      this.dummy.position.copy(it.p); this.dummy.rotation.set(it.life * 6, it.life * 4, 0);
      this.dummy.updateMatrix(); this.mesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.active = alive;
  }
}

/** Melee creature combat with IK-driven locomotion, keyframed attacks, secondary motion and physical XP/loot drops. */
export class CombatSystem {
  readonly targets: THREE.Object3D[] = [];
  readonly playerHealth = 100;
  health = 100;
  /** Vida máxima e resistência (talentos); o jogo atualiza a cada quadro. */
  maxHealth = 100;
  resist = 0;
  heal(amount: number) { if (this.health > 0) this.health = Math.min(this.maxHealth, this.health + amount); }
  blocked = 0;
  private mobs: Mob[] = [];
  private drops: Drop[] = [];
  private root = new THREE.Group();
  private dropRoot = new THREE.Group();
  private lightRoot = new THREE.Group();
  private fills: FillLight[] = [];
  private dropLights: THREE.PointLight[] = [];
  private dropOrder: Drop[] = [];
  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];
  private sphere: THREE.SphereGeometry;
  private unitCapsule: THREE.CapsuleGeometry;
  private cone: THREE.ConeGeometry;
  private cylinder: THREE.CylinderGeometry;
  private taper: THREE.CylinderGeometry;
  private box: THREE.BoxGeometry;
  private itemMaterial = new THREE.MeshStandardMaterial({ color: '#e1d6a7', emissive: '#74633b', emissiveIntensity: .65, metalness: .18, roughness: .42 });
  private xpMaterial = new THREE.MeshStandardMaterial({ color: '#b9dcc2', emissive: '#74a886', emissiveIntensity: 1.15, roughness: .3, metalness: .12 });
  private targetMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  private gemGeometry: THREE.OctahedronGeometry;
  private ringGeometry: THREE.TorusGeometry;
  private arcGeometry: THREE.RingGeometry;
  private shockGeometry: THREE.RingGeometry;
  private particles: ParticlePool;
  private rings: { mesh: THREE.Mesh; material: THREE.MeshBasicMaterial; age: number; life: number; size: number }[] = [];
  private ringCursor = 0;
  private fxRoot = new THREE.Group();
  /** Quantos inimigos vivos estão perseguindo o jogador (para a trilha de combate). */
  get engaged() { let n = 0; for (const m of this.mobs) if (m.aggro && m.health > 0) n++; return n; }
  private tmpA = new THREE.Vector3();
  private tmpB = new THREE.Vector3();
  private tmpC = new THREE.Vector3();
  private tmpD = new THREE.Vector3();
  private segment = new THREE.Line3();
  /** Efeitos sonoros (ligado pelo jogo ao motor de áudio). */
  onSfx: (name: SfxName, v?: number) => void = () => {};
  /** Chamado a cada inimigo derrotado (missões contam abates por tipo). */
  onKill: (kind: MobKind) => void = () => {};
  /** Barreira física (escudo) que os inimigos não atravessam; atualizada pelo jogo a cada quadro. */
  barrier: { center: THREE.Vector3; normal: THREE.Vector3; half: number } | null = null;
  private flinchPose = newPose();
  private colliders: WorldCollider[] = [];
  private colliderCount = -1;
  private grid = new Map<number, WorldCollider[]>();

  constructor(private scene: THREE.Scene, private onExperience: (amount: number) => void = () => { }, private onItem: (item: LootItemId) => void = () => { }, private onPickup: (message: string) => void = () => { }) {
    this.root.name = 'hostile-mobs'; scene.add(this.root);
    this.dropRoot.name = 'mob-drops'; scene.add(this.dropRoot);
    this.lightRoot.name = 'mob-lights'; scene.add(this.lightRoot);
    for (let i = 0; i < DROP_LIGHTS; i++) { const l = new THREE.PointLight('#ffffff', 0, 3); this.lightRoot.add(l); this.dropLights.push(l); }
    this.fxRoot.name = 'mob-fx'; scene.add(this.fxRoot);
    this.sphere = this.geometry(new THREE.SphereGeometry(1, 18, 12));
    this.unitCapsule = this.geometry(new THREE.CapsuleGeometry(.5, 1, 6, 12)); // radius .5, total height 2
    this.cone = this.geometry(new THREE.ConeGeometry(.17, .48, 10));
    this.cylinder = this.geometry(new THREE.CylinderGeometry(.11, .14, .62, 12));
    this.taper = this.geometry(new THREE.CylinderGeometry(.7, 1, 1, 12));
    this.box = this.geometry(new THREE.BoxGeometry(1, 1, 1));
    this.gemGeometry = this.geometry(new THREE.OctahedronGeometry(.2, 0));
    this.ringGeometry = this.geometry(new THREE.TorusGeometry(.3, .018, 6, 24));
    this.arcGeometry = this.geometry(new THREE.RingGeometry(.8, 1.3, 28, 1, -.85, 1.7));
    this.shockGeometry = this.geometry(new THREE.RingGeometry(.86, 1, 40));
    this.materials.push(this.itemMaterial, this.xpMaterial, this.targetMaterial);

    this.particles = new ParticlePool(this.geometry(new THREE.OctahedronGeometry(.07, 0)));
    this.materials.push(this.particles.material);
    this.fxRoot.add(this.particles.mesh);
    for (let i = 0; i < 5; i++) {
      const material = new THREE.MeshBasicMaterial({ color: '#ff8a5c', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
      this.materials.push(material);
      const mesh = new THREE.Mesh(this.shockGeometry, material); mesh.rotation.x = -Math.PI / 2; mesh.visible = false;
      this.fxRoot.add(mesh);
      this.rings.push({ mesh, material, age: 0, life: .55, size: 4 });
    }

    for (let index = 0; index < SPAWNS.length; index++) this.mobs.push(this.createMob(SPAWNS[index], index));
    // lobo modelado (wolf.glb): chega depois de pronto; até lá (ou se falhar) vale o lobo procedural
    new GLTFLoader().load('/models/wolf.glb', gltf => { if (!this.disposed) this.onWolfModel(gltf.scene); }, undefined, () => { /* mantém o procedural */ });
    // demônio modelado (aura.glb): malha de ~1 milhão de vértices, reduzida ao carregar
    new GLTFLoader().load('/models/aura.glb', gltf => { if (!this.disposed) this.onDemonModel(gltf.scene); }, undefined, () => { /* mantém o procedural */ });
    // bandido modelado (perso.glb): cada bandido recebe sua própria cópia do modelo
    const bandits = new GLTFLoader(); registerSpecGloss(bandits);
    bandits.load('/models/perso.glb', gltf => { if (this.disposed) return; this.banditTemplate = gltf.scene; for (const mob of this.mobs) if (mob.kind === 'bandit') this.attachBanditModel(mob); }, undefined, () => { /* mantém o procedural */ });
  }

  private disposed = false;
  private demonGeo: THREE.BufferGeometry | null = null;
  private demonTex: THREE.Material | null = null;
  /** Altura final do demônio (m) e giro do modelo (frente = +Z). */
  private static readonly DEMON_HEIGHT = 2.3;
  private static readonly DEMON_YAW = -Math.PI / 2;

  /** Reduz a malha: vértices na mesma célula 3D (e na mesma célula de UV, para não borrar as costuras da textura) viram um só. */
  private static decimate(geo: THREE.BufferGeometry, cell: number, uvCell: number) {
    const pos = geo.attributes.position as THREE.BufferAttribute, nor = geo.attributes.normal as THREE.BufferAttribute, uv = geo.attributes.uv as THREE.BufferAttribute, idx = geo.index!;
    const n = pos.count, remap = new Uint32Array(n), map = new Map<number, number>();
    const sp = new Float32Array(n * 3), sn = new Float32Array(n * 3), su = new Float32Array(n * 2), cnt = new Uint32Array(n);
    let m = 0;
    for (let i = 0; i < n; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), u = uv.getX(i), v = uv.getY(i);
      const key = ((((Math.round(x / cell) + 512) * 1024 + (Math.round(y / cell) + 512)) * 1024 + (Math.round(z / cell) + 512)) * 1024 + Math.min(1023, Math.round(u / uvCell))) * 1024 + Math.min(1023, Math.round(v / uvCell));
      let id = map.get(key);
      if (id === undefined) { id = m++; map.set(key, id); }
      remap[i] = id; cnt[id]++;
      sp[id * 3] += x; sp[id * 3 + 1] += y; sp[id * 3 + 2] += z;
      sn[id * 3] += nor.getX(i); sn[id * 3 + 1] += nor.getY(i); sn[id * 3 + 2] += nor.getZ(i);
      su[id * 2] += u; su[id * 2 + 1] += v;
    }
    const P = new Float32Array(m * 3), N = new Float32Array(m * 3), U = new Float32Array(m * 2);
    for (let i = 0; i < m; i++) {
      const c = cnt[i]; P[i * 3] = sp[i * 3] / c; P[i * 3 + 1] = sp[i * 3 + 1] / c; P[i * 3 + 2] = sp[i * 3 + 2] / c;
      const l = Math.hypot(sn[i * 3], sn[i * 3 + 1], sn[i * 3 + 2]) || 1; N[i * 3] = sn[i * 3] / l; N[i * 3 + 1] = sn[i * 3 + 1] / l; N[i * 3 + 2] = sn[i * 3 + 2] / l;
      U[i * 2] = su[i * 2] / c; U[i * 2 + 1] = su[i * 2 + 1] / c;
    }
    const tris: number[] = [];
    for (let t = 0; t < idx.count; t += 3) {
      const a = remap[idx.getX(t)], b = remap[idx.getX(t + 1)], c = remap[idx.getX(t + 2)];
      if (a !== b && b !== c && a !== c) tris.push(a, b, c);
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(P, 3)); out.setAttribute('normal', new THREE.BufferAttribute(N, 3)); out.setAttribute('uv', new THREE.BufferAttribute(U, 2));
    out.setIndex(new THREE.BufferAttribute(m > 65535 ? new Uint32Array(tris) : new Uint16Array(tris), 1));
    return out;
  }

  private onDemonModel(scene: THREE.Object3D) {
    scene.updateMatrixWorld(true);
    let src: THREE.Mesh | null = null; scene.traverse(o => { if (!src && (o as THREE.Mesh).isMesh) src = o as THREE.Mesh; });
    if (!src) return;
    const mesh = src as THREE.Mesh, baked = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
    baked.computeBoundingBox();
    const h = baked.boundingBox!.max.y - baked.boundingBox!.min.y, k = CombatSystem.DEMON_HEIGHT / h;
    // tamanho final e pés no chão, antes de reduzir (a célula é relativa à altura)
    baked.rotateY(CombatSystem.DEMON_YAW); baked.scale(k, k, k); baked.computeBoundingBox();
    const bb = baked.boundingBox!; baked.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
    const geo = CombatSystem.decimate(baked, CombatSystem.DEMON_HEIGHT * 0.0045, 1 / 900);
    baked.dispose();
    // o eixo do corpo (pernas, tronco) fica na origem; a caixa envolvente estava deslocada pela cauda do vestido
    geo.translate(0, 0, DEMON_DZ);
    geo.computeBoundingBox(); geo.computeBoundingSphere();
    // pesos de skin: corpo, braços e pernas seguem o rig; o vestido é dividido entre os seis painéis com mola da saia
    const sample = textureSampler((mesh.material as THREE.MeshStandardMaterial).map), uv = geo.attributes.uv as THREE.BufferAttribute, rgb: [number, number, number] = [0, 0, 0];
    computeSkin(geo, DEMON_SKIN, DEMON_BONES, (x, y, z, w, i) => {
      // tecido cor de vinho (vestido, cabelo) encostado nas luvas nunca segue as mãos: senão a saia estica até elas
      if (sample) {
        const c = sample(uv.getX(i), uv.getY(i), rgb);
        if (c[0] > .05 && c[0] > c[1] * 1.6 && c[0] > c[2] * 1.15) {
          let any = 0;
          for (let b = 3; b <= 8; b++) w[b] = 0;
          for (let b = 0; b < DEMON_BONES; b++) any = Math.max(any, w[b]);
          if (any < 1e-3) w[y > 1.45 ? 1 : 0] = 1;
        }
      }
      const zone = smoothstep(Math.hypot(x, z), .13, .23) * smoothstep(1.22 - y, 0, .5);
      if (zone <= 0) return;
      let armW = 0, legW = 0, sum = 0;
      for (let b = 3; b <= 8; b++) armW = Math.max(armW, w[b]);
      for (let b = 9; b <= 14; b++) legW = Math.max(legW, w[b]);
      const s = zone * (1 - smoothstep(armW, .15, .6)) * (1 - smoothstep(legW, .3, .8));
      if (s <= 0) return;
      for (let b = 0; b < 15; b++) sum += w[b];
      const k = (1 - s) / (sum || 1); for (let b = 0; b < 15; b++) w[b] *= k;
      const a = THREE.MathUtils.euclideanModulo(Math.atan2(x, z) / (TAU / 6), 6), i0 = Math.floor(a) % 6, f = a - Math.floor(a);
      w[15 + i0] += s * (1 - f); w[15 + (i0 + 1) % 6] += s * f;
    });
    // antebraço/mão só se ligam à própria cadeia; o braço se liga ao tronco/cabeça apenas no ombro
    const chain = (b: number) => b >= 3 && b <= 5 ? 1 : b >= 6 && b <= 8 ? 2 : 0;
    tearSeams(geo, (a, b, yMax) => {
      const ca = chain(a), cb = chain(b);
      if (ca === cb) return true;
      const arm = ca ? a : b, other = ca ? b : a;
      return (arm === 3 || arm === 6) && (other === 1 || other === 2) && chain(other) === 0 && yMax > 1.47;
    });
    // pingentes e enfeites soltos junto às mãos/antebraços acompanham o membro
    adoptFragments(geo, 600, .14, (x, y, z) => {
      const A = DEMON_ANAT, sd = x < 0 ? -1 : 1, m = (p: V3): V3 => [p[0] * sd, p[1], p[2]];
      if (segDist(x, y, z, m(A.wrist), m(A.hand)) < .1) return sd < 0 ? 5 : 8;
      if (segDist(x, y, z, m(A.elbow), m(A.wrist)) < .08) return sd < 0 ? 4 : 7;
      return -1;
    });
    this.demonGeo = geo; this.geometries.push(geo); this.demonTex = mesh.material as THREE.Material;
    for (const mob of this.mobs) if (mob.kind === 'demon') this.attachDemonModel(mob);
  }

  private attachDemonModel(mob: Mob) {
    if (!this.demonGeo || !this.demonTex || mob.rig.modelMesh) return;
    const rig = mob.rig, mt = (this.demonTex as THREE.MeshStandardMaterial).clone();
    mt.metalness = Math.min(mt.metalness, 0.3); mt.roughness = Math.max(mt.roughness, 0.7); mt.emissive = new THREE.Color('#ff5a3a'); mt.emissiveIntensity = 0; mt.needsUpdate = true;
    this.materials.push(mt);
    this.fitDemon(mob);
    const [aL, aR] = [rig.arms.find(a => a.side < 0)!, rig.arms.find(a => a.side > 0)!], [lL, lR] = [rig.legs.find(l => l.side < 0)!, rig.legs.find(l => l.side > 0)!];
    const bones: THREE.Object3D[] = [rig.pelvis, rig.chest, rig.head,
      aL.shoulder, aL.elbow, aL.wrist, aR.shoulder, aR.elbow, aR.wrist,
      lL.hip, lL.knee, lL.ankle, lR.hip, lR.knee, lR.ankle, ...rig.cloth.map(c => c.segs[0])];
    const model = bindSkin(mob.root, this.demonGeo, mt, bones); model.name = 'demon-model';
    rig.modelMesh = model;
    // a luz de preenchimento ficava encostada na frente do vestido (mancha vermelha): vai para a frente do rosto
    const fill = this.fills.find(f => f.mob === mob.root); if (fill) fill.offset.set(0, 2.7, 1.3);
    rig.pelvis.traverse(o => { const m = o as THREE.Mesh; if (m.isMesh && m !== rig.target) m.visible = false; });
    mob.mats.push({ m: mt, base: 0 });
    mob.eyes = mob.eyes.filter(e => { e.m.emissiveIntensity = 0; return false; });
  }

  /**
   * Encaixa o rig humanoide na anatomia do aura.glb: pivôs nas juntas, pernas e braços com o comprimento real e a pose
   * de repouso dos braços (afastados do vestido, cotovelo dobrado) medida do próprio modelo.
   */
  private fitDemon(mob: Mob) {
    const r = mob.rig, A = DEMON_ANAT, root = mob.root;
    const fit: RigFit = {
      pelvisY: A.pelvis[1], pelvisZ: A.pelvis[2], walkDrop: .015, jaw: 1, arm: { x: 0, z: 0, e: 0 },
      gait: { stride: .6, duty: .6, lift: .09 }, gallop: null, cadence: 3.4, legScale: 1, compass: true,
    };
    r.fit = fit;
    this.neutralPose(mob)();
    placeAt(root, r.chest, A.torso); placeAt(root, r.head, A.head);
    const mir = (p: V3, s: number): V3 => [p[0] * s, p[1], p[2]];
    let ax = 0, az = 0, ae = 0;
    const q = new THREE.Quaternion(), eu = new THREE.Euler();
    for (const arm of r.arms) {
      const s = arm.side, S = mir(A.shoulder, s);
      placeAt(root, arm.shoulder, S);
      const sl = toLocal(root, r.chest, S), d = toLocal(root, r.chest, mir(A.elbow, s)).sub(sl), l1 = d.length(); d.normalize();
      const f = toLocal(root, r.chest, mir(A.wrist, s)).sub(toLocal(root, r.chest, mir(A.elbow, s))), l2 = f.length(); f.normalize();
      // rotação do ombro (ordem XYZ, só X e Z) que leva o braço pendente (-Y) até a direção do braço do modelo
      const zA = Math.asin(clamp(d.x, -1, 1)), xA = Math.atan2(-d.z, -d.y);
      f.applyQuaternion(q.setFromEuler(eu.set(xA, 0, zA, 'XYZ')).invert());
      const eA = Math.atan2(-f.z, -f.y);
      ax += (xA + .06) / 2; az += (s * zA - .1) / 2; ae += (-eA - .22) / 2;
      arm.elbow.position.set(0, -l1, 0); arm.wrist.position.set(0, -l2, 0);
    }
    fit.arm = { x: ax, z: az, e: ae };
    for (const leg of r.legs) {
      const hip = mir(A.hip, leg.side);
      placeAt(root, leg.hip, hip);
      const pl = toLocal(root, r.pelvis, hip); leg.hy = pl.y; leg.hz = pl.z;
      leg.l1 = A.l1; leg.l2 = A.l2; leg.knee.position.set(0, -A.l1, 0); leg.ankle.position.set(0, -A.l2, 0);
      leg.footY = A.footY; leg.footZ = A.footZ; leg.restZ = A.footZ;
    }
    this.neutralPose(mob)();
    // comprimento quadril→tornozelo de cada perna na pose de ligação (a perna de apoio mantém esse valor na marcha)
    const hp = new THREE.Vector3(), ap = new THREE.Vector3();
    for (const leg of r.legs) {
      root.worldToLocal(leg.hip.getWorldPosition(hp)); root.worldToLocal(leg.ankle.getWorldPosition(ap));
      leg.stance = hp.distanceTo(ap);
    }
  }
  private banditTemplate: THREE.Object3D | null = null;

  private attachBanditModel(mob: Mob) {
    const tpl = this.banditTemplate, rig = mob.rig;
    if (!tpl || rig.retarget) return;
    const model = cloneSkinned(tpl);
    // materiais próprios (brilho de dano por inimigo); transparência vira recorte opaco; metal suavizado; roupas um pouco mais escuras
    const mats: MatEntry[] = [];
    model.traverse(o => {
      const m = o as THREE.Mesh; if (!m.isMesh) return;
      m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false;
      const cloned = (Array.isArray(m.material) ? m.material : [m.material]).map(src => {
        const mt = (src as THREE.MeshStandardMaterial).clone();
        if (mt.transparent) { mt.transparent = false; mt.alphaTest = .5; mt.opacity = 1; }
        mt.depthWrite = true; mt.metalness = Math.min(mt.metalness, .12); mt.roughness = Math.max(mt.roughness, .6);
        mt.color.multiplyScalar(.82); mt.emissive = new THREE.Color('#ff5a3a'); mt.emissiveIntensity = 0; mt.needsUpdate = true;
        this.materials.push(mt); mats.push({ m: mt, base: 0 });
        return mt;
      });
      m.material = cloned.length === 1 ? cloned[0] : cloned;
    });
    const L = rig.legs, A = rig.arms, left = A.find(a => a.side < 0)!, right = A.find(a => a.side > 0)!, legL = L.find(l => l.side < 0)!, legR = L.find(l => l.side > 0)!;
    const retarget = retargetModel(mob.root, model, {
      pelvis: rig.pelvis, chest: rig.chest, head: rig.head,
      armL: left.shoulder, elbowL: left.elbow, wristL: left.wrist, armR: right.shoulder, elbowR: right.elbow, wristR: right.wrist,
      hipL: legL.hip, kneeL: legL.knee, ankleL: legL.ankle, hipR: legR.hip, kneeR: legR.knee, ankleR: legR.ankle,
    }, legL.l1 + legL.l2);
    if (!retarget) return;
    rig.retarget = retarget;
    // esconde o corpo procedural; ficam a área de acerto e a arma (cabo e lâmina) da mão direita
    const keep = new Set<THREE.Object3D>([rig.target]);
    right.wrist.children.forEach(c => { if (Math.abs(c.position.y + .05) > 1e-3 || Math.abs(c.position.z - .02) > 1e-3) keep.add(c); }); // a esfera de pele do punho antigo some
    rig.pelvis.traverse(o => { const m = o as THREE.Mesh; if (m.isMesh && !keep.has(m)) m.visible = false; });
    mob.mats.push(...mats);
    mob.eyes = mob.eyes.filter(e => { e.m.emissiveIntensity = 0; return false; });
    retarget.update();
  }
  private wolfGeo: THREE.BufferGeometry | null = null;
  /** Escala e orientação do modelo (frente do modelo = +Z). */
  private static readonly WOLF_SCALE = 1.1;
  private static readonly WOLF_YAW = 0;
  private static readonly WOLF_TINTS = ['#ffffff', '#f3eadb', '#dcc9aa', '#b9bec8', '#9c9184'];

  /** Gera a geometria única (no espaço Y-para-cima, pés no chão local) com cor de pelagem por vértice. */
  private onWolfModel(scene: THREE.Object3D) {
    scene.updateMatrixWorld(true);
    let src: THREE.Mesh | null = null; scene.traverse(o => { if (!src && (o as THREE.Mesh).isMesh) src = o as THREE.Mesh; });
    if (!src) return;
    const mesh = src as THREE.Mesh, geo = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
    geo.rotateY(CombatSystem.WOLF_YAW); geo.scale(CombatSystem.WOLF_SCALE, CombatSystem.WOLF_SCALE, CombatSystem.WOLF_SCALE);
    geo.computeBoundingBox(); const bb = geo.boundingBox!;
    geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2); // pés em y=0, centrado
    geo.computeVertexNormals(); geo.computeBoundingBox(); geo.computeBoundingSphere();
    const pos = geo.attributes.position as THREE.BufferAttribute, nor = geo.attributes.normal as THREE.BufferAttribute, col = new Float32Array(pos.count * 3);
    const H = geo.boundingBox!.max.y, Lz = geo.boundingBox!.max.z - geo.boundingBox!.min.z, z0 = geo.boundingBox!.min.z;
    const C = { mid: new THREE.Color('#a39684'), back: new THREE.Color('#5e544a'), belly: new THREE.Color('#e2d8c5'), socks: new THREE.Color('#3b342d'), muzzle: new THREE.Color('#d3c7b1'), tipDark: new THREE.Color('#3a342e') }, c = new THREE.Color();
    const hash = (x: number, y: number, z: number) => { const v = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return v - Math.floor(v); };
    const sm = (x: number, a: number, b: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), ny = nor.getY(i), h = y / H, along = (z - z0) / Lz;
      c.copy(C.mid);
      c.lerp(C.back, sm(ny, 0.05, 0.75) * 0.9);                         // costas e cabeça: pelo escuro
      c.lerp(C.belly, sm(-ny, 0.15, 0.7) * sm(0.55 - h, 0, 0.35));      // barriga e peito: claro
      c.lerp(C.socks, sm(0.3 - h, 0, 0.25) * 0.85);                     // patas: "meias" escuras
      c.lerp(C.muzzle, sm(along, 0.82, 0.97) * sm(0.78 - h, 0, 0.3) * 0.7); // focinho mais claro
      c.lerp(C.tipDark, sm(h, 0.8, 1.0) * 0.4);                         // pontas altas (orelhas/crista) mais escuras
      // manchas largas + fios finos de pelo
      const patch = hash(Math.floor(x * 5), Math.floor(y * 5), Math.floor(z * 5)) - 0.5, strand = hash(Math.floor(x * 28), Math.floor(y * 28), Math.floor(z * 28)) - 0.5;
      c.multiplyScalar(1 + patch * 0.22 + strand * 0.2);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    // pesos de skin: patas, coluna, pescoço, cabeça, mandíbula e cauda seguem o rig procedural
    computeSkin(geo, WOLF_SKIN, WOLF_BONES, (_x, y, z, w) => {
      // mandíbula: só o que está abaixo da linha da boca, à frente da articulação; a cabeça fica com o resto
      const below = z > .64 && y < .785 + (z - .68) * .06 && y > .5;
      if (below) { const f = smoothstep(z, .66, .76); w[3] *= 1 - f; w[4] = Math.max(w[4], f); }
      else w[4] = 0;
    });
    this.wolfGeo = geo; this.geometries.push(geo);
    for (const mob of this.mobs) if (mob.kind === 'wolf') this.attachWolfModel(mob);
  }

  private attachWolfModel(mob: Mob) {
    if (!this.wolfGeo || mob.rig.modelMesh) return;
    const rig = mob.rig, tint = new THREE.Color(CombatSystem.WOLF_TINTS[mob.spawn % CombatSystem.WOLF_TINTS.length]);
    const material = new THREE.MeshStandardMaterial({ vertexColors: true, color: tint, roughness: 0.88, metalness: 0.04, emissive: new THREE.Color('#ff5a3a'), emissiveIntensity: 0 });
    this.materials.push(material);
    this.fitWolf(mob);
    const L = (front: boolean, side: number) => rig.legs.find(l => l.front === front && l.side === side)!;
    const bones: THREE.Object3D[] = [rig.pelvis, rig.chest, rig.neck!, rig.head, rig.jaw!, ...rig.tail!.segs];
    for (const [front, side] of [[true, -1], [true, 1], [false, -1], [false, 1]] as const) { const l = L(front, side); bones.push(l.hip, l.knee, l.ankle); }
    const model = bindSkin(mob.root, this.wolfGeo, material, bones); model.name = 'wolf-model';
    rig.modelMesh = model;
    // na marcha as patas dianteiras apoiam um pouco mais sob o ombro que na pose esculpida (sobra alcance para a passada)
    for (const leg of rig.legs) leg.footZ = leg.front ? WOLF_ANAT.frontWalkZ : WOLF_ANAT.hindWalkZ;
    // esconde o lobo procedural (a área de acerto e o rig seguem funcionando)
    rig.pelvis.traverse(o => { const m = o as THREE.Mesh; if (m.isMesh && m !== rig.target) m.visible = false; });
    mob.mats.push({ m: material, base: 0 });
    mob.eyes = mob.eyes.filter(e => { e.m.emissiveIntensity = 0; return false; });
  }

  /** Pose neutra de ligação: sem ataque, parado, calmo, cadeias em repouso; aplica o rig uma vez (dt = 0). */
  private neutralPose(mob: Mob) {
    const keep = { speed: mob.speed, alert: mob.alert, guard: mob.guard, look: mob.look, gallop: mob.gallop, gait: mob.gait, vf: mob.vf, vs: mob.vs };
    mob.speed = 0; mob.alert = 0; mob.guard = 0; mob.look = 0; mob.gallop = 0; mob.vf = 0; mob.vs = 0;
    const r = mob.rig;
    for (const chain of [...r.cloth, ...r.braids, ...(r.tail ? [r.tail] : [])]) { chain.x = chain.restX.slice(); chain.z.fill(0); chain.vx.fill(0); chain.vz.fill(0); }
    const p = this.flinchPose; clearPose(p);
    if (mob.kind === 'wolf') this.applyWolf(mob, p, 0, 0); else this.applyHumanoid(mob, p, 0, 0);
    mob.root.updateMatrixWorld(true);
    return () => Object.assign(mob, keep);
  }

  /** Encaixa o rig do lobo na anatomia do wolf.glb (pivôs nas juntas do modelo, pernas com o comprimento real). */
  private fitWolf(mob: Mob) {
    const r = mob.rig, A = WOLF_ANAT, root = mob.root;
    r.fit = {
      pelvisY: A.pelvis[1], pelvisZ: A.pelvis[2], walkDrop: 0, jaw: .45, arm: { x: 0, z: 0, e: 0 },
      gait: { stride: .34, duty: .58, lift: .12 }, gallop: { stride: .4, duty: .3, lift: .17 }, cadence: 4.6, legScale: .62, compass: false,
    };
    this.neutralPose(mob)();
    placeAt(root, r.chest, A.chest); placeAt(root, r.neck!, A.neck); placeAt(root, r.head, A.head); placeAt(root, r.jaw!, A.jaw);
    r.tail!.segs.forEach((s, i) => placeAt(root, s, A.tail[i]));
    for (const leg of r.legs) {
      const d = leg.front ? A.front : A.hind, hip: V3 = [d.hip[0] * leg.side, d.hip[1], d.hip[2]];
      placeAt(root, leg.hip, hip);
      const pl = toLocal(root, r.pelvis, hip); leg.hy = pl.y; leg.hz = pl.z;
      leg.l1 = d.l1; leg.l2 = d.l2; leg.knee.position.set(0, -d.l1, 0); leg.ankle.position.set(0, -d.l2, 0);
      leg.footY = d.footY; leg.footZ = d.footZ; leg.restZ = d.footZ;
    }
    // de novo com as pernas novas: o IK põe joelhos e tornozelos sobre os do modelo; matrizes prontas para o bind
    this.neutralPose(mob)();
  }

  get alive() { return this.mobs.filter(mob => mob.health > 0).length; }
  /** Contadores para o painel de desempenho. */
  perfStats() { return { inimigos: this.alive, drops: this.drops.length }; }

  respawnPlayer() { this.health = this.maxHealth; }

  damageAt(point: THREE.Vector3, radius: number, damage: number) {
    let count = 0;
    for (const mob of this.mobs) {
      if (mob.health <= 0) continue;
      const stats = MOB_STATS[mob.kind];
      this.tmpA.set(mob.root.position.x, mob.root.position.y + (mob.kind === 'wolf' ? .7 : 1.15), mob.root.position.z);
      if (this.tmpA.distanceTo(point) > radius + stats.radius) continue;
      this.applyHit(mob, point, damage, 1); count++;
    }
    return count;
  }

  /**
   * Primeiro inimigo vivo tocado pelo segmento from → to (raio radius + corpo do inimigo). Não causa dano:
   * devolve o ponto de contato mais próximo de from (para projéteis que param no primeiro alvo), ou null.
   */
  firstHitOnSegment(from: THREE.Vector3, to: THREE.Vector3, radius: number, out = new THREE.Vector3()) {
    const seg = this.segment.set(from, to);
    let best = Infinity;
    for (const mob of this.mobs) {
      if (mob.health <= 0) continue;
      const stats = MOB_STATS[mob.kind];
      this.tmpA.set(mob.root.position.x, mob.root.position.y + (mob.kind === 'wolf' ? .7 : 1.15), mob.root.position.z);
      const contact = seg.closestPointToPoint(this.tmpA, true, this.tmpB);
      if (contact.distanceTo(this.tmpA) > radius + stats.radius) continue;
      const d = contact.distanceToSquared(from);
      if (d < best) { best = d; out.copy(contact); }
    }
    return best < Infinity ? out : null;
  }

  /**
   * Dano ao longo de um segmento (raios contínuos). Cada inimigo é atingido no máximo uma vez por chamada;
   * knock escala o empurrão (raios aplicam vários "ticks" pequenos). onHit recebe o ponto de contato no raio.
   */
  damageSegment(from: THREE.Vector3, to: THREE.Vector3, radius: number, damage: number, knock = .35, onHit?: (point: THREE.Vector3) => void, once?: Set<object>) {
    let count = 0;
    const seg = this.segment.set(from, to);
    for (const mob of this.mobs) {
      if (mob.health <= 0) continue;
      // once: projéteis que atravessam (testados todo quadro) só ferem cada inimigo uma vez
      if (once) { if (once.has(mob)) continue; }
      const stats = MOB_STATS[mob.kind];
      this.tmpA.set(mob.root.position.x, mob.root.position.y + (mob.kind === 'wolf' ? .7 : 1.15), mob.root.position.z);
      const contact = seg.closestPointToPoint(this.tmpA, true, this.tmpB);
      if (contact.distanceTo(this.tmpA) > radius + stats.radius) continue;
      once?.add(mob);
      onHit?.(contact);
      this.applyHit(mob, contact, damage, knock); count++;
    }
    return count;
  }

  private applyHit(mob: Mob, point: THREE.Vector3, damage: number, knock: number, fromNet = false) {
    if (this.netRole === 'client' && !fromNet) {
      // cliente: o dano é decidido pelo host; aqui só o retorno visual imediato (piscar, partículas, som)
      this.onHitRequest(this.mobs.indexOf(mob), damage, point, knock);
      mob.hitFlash = .18; mob.root.scale.setScalar(1.05); this.onSfx('hitEnemy', damage / 60);
      this.tmpD.set(mob.root.position.x, mob.root.position.y + (mob.kind === 'wolf' ? .7 : 1.15), mob.root.position.z);
      this.particles.emit(this.tmpD, mob.kind === 'demon' ? '#ff7a5a' : '#ffe2a8', 6 + Math.min(8, Math.floor(damage / 6)), 3.2, 1.8, .4, 1);
      return;
    }
    {
      mob.health = Math.max(0, mob.health - damage); mob.hitFlash = .18; this.onSfx('hitEnemy', damage / 60);
      const pushX = mob.root.position.x - point.x, pushZ = mob.root.position.z - point.z;
      // de onde veio o golpe, no espaço do inimigo (recuo e queda vão para o lado oposto)
      {
        const yaw = mob.root.rotation.y, c = Math.cos(yaw), s = Math.sin(yaw), lx = -pushX * c + pushZ * s, lz = -pushX * s - pushZ * c, l = Math.hypot(lx, lz);
        if (l > 1e-3) { mob.hitX = lx / l; mob.hitZ = lz / l; } else { mob.hitX = 0; mob.hitZ = 1; }
      }
      const pushLength = Math.hypot(pushX, pushZ);
      if (pushLength > .001) {
        const force = (3.2 + Math.min(damage, 44) * .075) * knock;
        mob.knockback.x += pushX / pushLength * force;
        mob.knockback.z += pushZ / pushLength * force;
      } else {
        mob.knockback.x += Math.sin(mob.root.rotation.y) * 3.2 * knock;
        mob.knockback.z += Math.cos(mob.root.rotation.y) * 3.2 * knock;
      }
      mob.root.scale.setScalar(1.05);
      this.particles.emit(this.tmpA, mob.kind === 'demon' ? '#ff7a5a' : '#ffe2a8', 6 + Math.min(8, Math.floor(damage / 6)), 3.2, 1.8, .4, 1);
      if (mob.health === 0) this.defeat(mob);
      else this.reactToHit(mob, damage);
    }
  }

  /** Durante a cutscene do Agarrão a heroína não recebe golpes. */
  invulnerable = false;

  /* ==================================================================== MULTIJOGADOR
   * solo: tudo local. host: simula os inimigos para a sala inteira e escolhe como alvo o jogador mais próximo
   * (local ou remoto). client: os inimigos são "marionetes" que seguem as fotos do host; golpes do cliente viram
   * pedidos ao host. Cada jogador tem os próprios drops (loot instanciado) quando um inimigo cai.
   */
  netRole: 'solo' | 'host' | 'client' = 'solo';
  /** Outros jogadores na sala (o host usa para escolher o alvo dos inimigos). */
  remotes: { id: string; pos: THREE.Vector3; alive: boolean }[] = [];
  /** host → golpe de inimigo acertou um jogador remoto (o jogo envia pela rede). */
  onRemoteStrike: (id: string, damage: number, fromX: number, fromZ: number) => void = () => {};
  /** cliente → pedido de dano a um inimigo (o host aplica). */
  onHitRequest: (index: number, damage: number, point: THREE.Vector3, knock: number) => void = () => {};
  /** cliente → Agarrão: o host passa a posicionar o inimigo como o cliente mandar. */
  onNetHold: (index: number, x: number, z: number, yaw: number, tilt: number, lift: number) => void = () => {};
  onNetRelease: (index: number, pushX: number, pushZ: number) => void = () => {};
  /** Alvo atual do golpe em resolução (id remoto, ou null = jogador local). */
  private strikeTarget: string | null = null;
  private readonly targetTmp = new THREE.Vector3();

  /** Foto do estado dos inimigos (host → clientes, ~10 vezes por segundo). */
  snapshot() {
    return this.mobs.map(m => {
      const atk = m.attack ? ATTACK_IDS.indexOf(m.attack.id) : -1;
      return [Math.round(m.root.position.x * 100) / 100, Math.round(m.root.position.z * 100) / 100, Math.round(m.root.rotation.y * 100) / 100,
        Math.round(m.health * 10) / 10, atk, Math.round(m.attackAge * 100) / 100, Math.round(m.stagger * 100) / 100, Math.round(m.air * 100) / 100,
        m.held ? Math.round(m.held.tilt * 100) / 100 : -1, m.held ? Math.round(m.held.lift * 100) / 100 : 0];
    });
  }
  /** Cliente: aplica a foto do host (posição alvo, vida, ataque em curso, mortes e renascimentos). */
  /** Cliente: false até a primeira foto (ao entrar na sala, inimigos já mortos somem sem dar loot). */
  netSynced = false;
  applySnapshot(snap: number[][], elapsed: number) {
    for (let i = 0; i < this.mobs.length && i < snap.length; i++) {
      const m = this.mobs[i], s = snap[i]; if (!s) continue;
      const [x, z, yaw, hp, atk, age, stagger, air, heldTilt, heldLift] = s;
      if (hp <= 0 && m.health > 0) {
        if (this.netSynced) this.defeat(m); else { m.deathAge = 99; m.root.visible = false; }
        m.health = 0; m.respawnTimer = Infinity; continue;
      }
      if (hp > 0 && m.health <= 0) { this.respawn(m, elapsed); m.root.position.set(x, terrainHeight(x, z), z); m.prev.set(x, z); }
      if (hp <= 0) continue;
      m.health = hp;
      m.net = { x, z, yaw, atk, age, stagger, air, heldTilt, heldLift };
    }
    this.netSynced = true;
  }
  /** Este jogador virou host (o anterior saiu) ou saiu da sala: volta a simular os inimigos daqui. */
  resumeAuthority() {
    for (const m of this.mobs) {
      if (m.health <= 0 && !Number.isFinite(m.respawnTimer)) m.respawnTimer = 6 + Math.random() * 6;
      m.net = undefined; m.knockback.set(0, 0, 0);
      if (m.root.rotation.order === 'YXZ' && !m.held) { m.root.rotation.order = 'XYZ'; m.root.rotation.z = 0; }
      if (m.health > 0) m.home.set(m.root.position.x, 0, m.root.position.z);
    }
  }
  /** Host: aplica o pedido de dano de um cliente. */
  netApplyHit(index: number, damage: number, point: THREE.Vector3, knock: number) {
    const m = this.mobs[index]; if (!m || m.health <= 0) return;
    this.applyHit(m, point, damage, knock, true);
  }
  /** Host: um cliente está segurando este inimigo (Agarrão). */
  netHold(index: number, x: number, z: number, yaw: number, tilt: number, lift: number) {
    const m = this.mobs[index]; if (!m || m.health <= 0) return;
    if (!m.held) { m.held = { yaw, tilt, lift }; m.attack = null; m.speed = 0; m.knockback.set(0, 0, 0); m.root.rotation.order = 'YXZ'; }
    m.held.yaw = yaw; m.held.tilt = tilt; m.held.lift = lift; m.netHeldAt = performance.now();
    m.root.position.set(x, terrainHeight(x, z) + lift, z);
  }
  netRelease(index: number, pushX: number, pushZ: number) {
    const m = this.mobs[index]; if (!m || !m.held) return;
    m.held = null; m.netHeldAt = undefined; m.root.rotation.order = 'XYZ'; m.root.rotation.z = 0;
    m.knockback.set(pushX, 0, pushZ); m.stagger = m.staggerMax = .9; m.staggerPower = 1; m.attackTimer = Math.max(m.attackTimer, 1.4);
  }
  /** Jogador local recebeu um golpe de inimigo vindo do host (aplica escudo, resistência e invulnerabilidade daqui). */
  receiveStrike(damage: number, fromX: number, fromZ: number, player: THREE.Vector3, block: (from: THREE.Vector3, to: THREE.Vector3) => boolean) {
    if (this.invulnerable || this.health <= 0) return;
    this.tmpA.set(player.x, player.y + .9, player.z); this.tmpB.set(fromX, player.y + 1, fromZ);
    if (block(this.tmpA, this.tmpB)) return;
    this.health = Math.max(0, this.health - damage * (1 - this.resist)); this.onSfx('hurt');
    this.tmpA.set(player.x, player.y + 1, player.z); this.particles.emit(this.tmpA, '#ff6a4a', 10, 3.5, 2, .45, 1);
  }

  /** Cliente: inimigo segue a foto do host (sem IA), animado com o mesmo sistema de poses. */
  private updatePuppet(mob: Mob, dt: number, elapsed: number, player: THREE.Vector3) {
    const n = mob.net, root = mob.root, pos = root.position, stats = MOB_STATS[mob.kind];
    mob.hitFlash = Math.max(0, mob.hitFlash - dt);
    root.scale.setScalar(damp(root.scale.x, 1, 18, dt));
    if (n) {
      pos.x = damp(pos.x, n.x, 12, dt); pos.z = damp(pos.z, n.z, 12, dt);
      const dy = THREE.MathUtils.euclideanModulo(n.yaw - root.rotation.y + Math.PI, TAU) - Math.PI; root.rotation.y += dy * (1 - Math.exp(-dt * 12));
      mob.air = damp(mob.air, n.air, 12, dt);
      // ataque em curso: segue o mesmo golpe e tempo do host
      const atkId = n.atk >= 0 ? ATTACK_IDS[n.atk] : null;
      if (atkId) { if (!mob.attack || mob.attack.id !== atkId) { mob.attack = ATTACKS[atkId]; mob.attackAge = n.age; } else mob.attackAge = Math.max(mob.attackAge + dt, n.age); }
      else mob.attack = null;
      mob.stagger = Math.max(n.stagger, mob.stagger - dt);
      if (n.heldTilt >= 0) { root.rotation.order = 'YXZ'; if (mob.kind === 'wolf') root.rotation.z = damp(root.rotation.z, n.heldTilt, 12, dt); else root.rotation.x = damp(root.rotation.x, -n.heldTilt, 12, dt); }
      else if (root.rotation.order === 'YXZ') { root.rotation.order = 'XYZ'; root.rotation.z = 0; }
    }
    const held = !!n && n.heldTilt >= 0;
    pos.y = terrainHeight(pos.x, pos.z) + mob.air + (held && n ? n.heldLift : 0);
    const yaw = root.rotation.y, sy = Math.sin(yaw), cy = Math.cos(yaw);
    if (!held) {
      const hF = terrainHeight(pos.x + sy * .7, pos.z + cy * .7), hB = terrainHeight(pos.x - sy * .7, pos.z - cy * .7);
      mob.slope = damp(mob.slope, clamp(-Math.atan2(hF - hB, 1.4), -.4, .4) * (mob.kind === 'wolf' ? .9 : .35), 8, dt);
      root.rotation.x = mob.slope;
    }
    const inv = 1 / Math.max(dt, 1e-3);
    mob.vel.x = damp(mob.vel.x, (pos.x - mob.prev.x) * inv, 12, dt); mob.vel.y = damp(mob.vel.y, (pos.z - mob.prev.y) * inv, 12, dt);
    mob.prev.set(pos.x, pos.z);
    mob.vf = mob.vel.x * sy + mob.vel.y * cy; mob.vs = mob.vel.x * cy - mob.vel.y * sy;
    mob.speed = damp(mob.speed, Math.min(stats.speed * 1.5, Math.hypot(mob.vel.x, mob.vel.y)), 8, dt);
    const dist = Math.hypot(player.x - pos.x, player.z - pos.z);
    mob.aggro = dist < 24; mob.alert = damp(mob.alert, mob.aggro ? 1 : 0, 4, dt);
    mob.look = damp(mob.look, 0, 6, dt);
    if (mob.kind === 'wolf') mob.gallop = damp(mob.gallop, mob.attack ? mob.gallop : smoothstep(mob.speed, GALLOP_FROM, GALLOP_TO), 3, dt);
    const g = this.gaitOf(mob), speedN = mob.speed / stats.speed, amp = strideAmp(g, speedN);
    if (amp > .05 && mob.speed > .05) mob.gait += Math.min(mob.speed * g.duty / amp, mob.rig.fit?.cadence ?? 3.4) * dt;
    mob.guard = damp(mob.guard, mob.aggro && !mob.attack && mob.stagger <= 0 ? 1 : 0, 6, dt);
    const progress = mob.attack ? mob.attackAge / mob.attack.duration : 0;
    if (mob.attack && progress >= 1) mob.attack = null;
    this.updateArc(mob, progress);
    const pose = mob.pose;
    if (held) { sampleKeys(FLINCH, .35 + .3 * Math.sin(elapsed * 17 + mob.phase), pose); pose.roll += Math.sin(elapsed * 11 + mob.phase) * .25; }
    else {
      if (mob.attack) sampleKeys(mob.attack.keys, progress, pose); else clearPose(pose);
      if (mob.stagger > 0) {
        const fl = this.flinchPose, pw = mob.staggerPower;
        sampleKeys(FLINCH, 1 - Math.min(1, mob.stagger / Math.max(.01, mob.staggerMax)), fl);
        for (const f of POSE_FIELDS) pose[f] += fl[f] * pw;
      }
    }
    if (mob.kind === 'wolf') this.applyWolf(mob, pose, elapsed, dt); else this.applyHumanoid(mob, pose, elapsed, dt);
    this.updateMaterials(mob, 0);
  }

  /**
   * Agarrão: procura o inimigo vivo mais próximo ao longo de from → from + dir·reach (raio radius) e o prende.
   * Retorna o controle (posicionar, ferir, soltar) ou null se não havia ninguém ao alcance.
   */
  grabMob(from: THREE.Vector3, dir: THREE.Vector3, reach: number, radius = 1.1): GrabHandle | null {
    const seg = this.segment.set(from, this.tmpB.copy(from).addScaledVector(dir, reach));
    let best: Mob | null = null, bestD = Infinity;
    for (const mob of this.mobs) {
      if (mob.health <= 0 || mob.held) continue;
      this.tmpA.set(mob.root.position.x, mob.root.position.y + (mob.kind === 'wolf' ? .7 : 1.15), mob.root.position.z);
      const c = seg.closestPointToPoint(this.tmpA, true, this.tmpC);
      if (c.distanceTo(this.tmpA) > radius + MOB_STATS[mob.kind].radius) continue;
      const d = c.distanceTo(from); if (d < bestD) { bestD = d; best = mob; }
    }
    if (!best) return null;
    const mob = best;
    mob.held = { yaw: mob.root.rotation.y, tilt: 0, lift: 0 };
    mob.attack = null; mob.attackAge = 0; mob.speed = 0; mob.knockback.set(0, 0, 0); mob.air = 0;
    mob.root.rotation.order = 'YXZ'; // tombar em volta do eixo lateral do próprio corpo
    this.onSfx('hitEnemy', 1);
    const self = this;
    return {
      kind: mob.kind,
      get alive() { return mob.health > 0 && !!mob.held; },
      position: mob.root.position,
      hold(x, z, yaw, tilt, lift = 0) {
        if (!mob.held) return;
        mob.root.position.set(x, terrainHeight(x, z) + lift, z);
        mob.held.yaw = yaw; mob.held.tilt = tilt; mob.held.lift = lift;
        if (self.netRole === 'client') self.onNetHold(self.mobs.indexOf(mob), x, z, yaw, tilt, lift);
      },
      hit(damage) {
        if (!mob.held || mob.health <= 0) return;
        self.tmpD.copy(mob.root.position); self.tmpD.y += .6;
        self.applyHit(mob, self.tmpD, damage, 0); mob.knockback.set(0, 0, 0);
        if (mob.health <= 0) { mob.held = null; mob.root.rotation.order = 'XYZ'; }
      },
      release(pushX = 0, pushZ = 0) {
        if (!mob.held) return;
        mob.held = null; mob.root.rotation.order = 'XYZ'; mob.root.rotation.z = 0;
        mob.knockback.set(pushX, 0, pushZ);
        mob.stagger = mob.staggerMax = .9; mob.staggerPower = 1; mob.attackTimer = Math.max(mob.attackTimer, 1.4);
        if (self.netRole === 'client') self.onNetRelease(self.mobs.indexOf(mob), pushX, pushZ);
      },
    };
  }

  /** Inimigo preso: segue a posição dada de fora, tomba e se debate (sem IA, sem atacar). */
  private updateHeld(mob: Mob, dt: number, elapsed: number) {
    const h = mob.held!, root = mob.root, pos = root.position;
    mob.hitFlash = Math.max(0, mob.hitFlash - dt);
    root.scale.setScalar(damp(root.scale.x, 1, 18, dt));
    root.rotation.y = h.yaw;
    // humanoides caem de costas (inclinação no eixo lateral); o lobo tomba de lado
    if (mob.kind === 'wolf') { root.rotation.x = damp(root.rotation.x, 0, 10, dt); root.rotation.z = damp(root.rotation.z, h.tilt, 12, dt); }
    else root.rotation.x = damp(root.rotation.x, -h.tilt, 12, dt);
    const inv = 1 / Math.max(dt, 1e-3), yaw = h.yaw, sy = Math.sin(yaw), cy = Math.cos(yaw);
    mob.vel.x = damp(mob.vel.x, (pos.x - mob.prev.x) * inv, 12, dt);
    mob.vel.y = damp(mob.vel.y, (pos.z - mob.prev.y) * inv, 12, dt);
    mob.prev.set(pos.x, pos.z); mob.vf = mob.vel.x * sy + mob.vel.y * cy; mob.vs = mob.vel.x * cy - mob.vel.y * sy;
    mob.speed = 0; mob.guard = damp(mob.guard, 0, 6, dt);
    this.updateArc(mob, 0);
    // debatendo-se: o recuo de golpe oscilando rápido, com a cabeça e os braços em pânico
    const pose = mob.pose;
    sampleKeys(FLINCH, .35 + .3 * Math.sin(elapsed * 17 + mob.phase), pose);
    pose.roll += Math.sin(elapsed * 11 + mob.phase) * .25; pose.headYaw += Math.sin(elapsed * 23) * .4;
    if (mob.kind === 'wolf') this.applyWolf(mob, pose, elapsed, dt); else this.applyHumanoid(mob, pose, elapsed, dt);
    this.updateMaterials(mob, 0);
  }

  /** Colisores estáticos do mundo (círculos) que os inimigos não atravessam. */
  setColliders(colliders: WorldCollider[]) {
    this.colliders = colliders; this.colliderCount = -1;
  }

  /** Grade espacial dos colisores; refeita se a lista mudar (ex.: NPC adicionado depois). */
  private colliderGrid() {
    if (this.colliderCount === this.colliders.length) return this.grid;
    this.grid.clear(); this.colliderCount = this.colliders.length;
    for (const c of this.colliders) {
      const x0 = Math.floor((c.x - c.radius) / GRID_CELL), x1 = Math.floor((c.x + c.radius) / GRID_CELL);
      const z0 = Math.floor((c.z - c.radius) / GRID_CELL), z1 = Math.floor((c.z + c.radius) / GRID_CELL);
      for (let gx = x0; gx <= x1; gx++) for (let gz = z0; gz <= z1; gz++) {
        const key = gx * 73856093 ^ gz * 19349663;
        let cell = this.grid.get(key); if (!cell) this.grid.set(key, cell = []);
        cell.push(c);
      }
    }
    return this.grid;
  }

  private collideWorld(pos: THREE.Vector3, radius: number, knockback: THREE.Vector3) {
    if (!this.colliders.length) return;
    const grid = this.colliderGrid();
    for (let pass = 0; pass < 2; pass++) {
      const x0 = Math.floor((pos.x - radius) / GRID_CELL), x1 = Math.floor((pos.x + radius) / GRID_CELL);
      const z0 = Math.floor((pos.z - radius) / GRID_CELL), z1 = Math.floor((pos.z + radius) / GRID_CELL);
      for (let gx = x0; gx <= x1; gx++) for (let gz = z0; gz <= z1; gz++) {
        const cell = grid.get(gx * 73856093 ^ gz * 19349663); if (!cell) continue;
        for (const c of cell) {
          const dx = pos.x - c.x, dz = pos.z - c.z, min = radius + c.radius, d2 = dx * dx + dz * dz;
          if (d2 >= min * min) continue;
          const d = Math.sqrt(d2) || .001, nx = d2 > 1e-8 ? dx / d : 1, nz = d2 > 1e-8 ? dz / d : 0;
          pos.x = c.x + nx * min; pos.z = c.z + nz * min;
          const into = knockback.x * nx + knockback.z * nz; // o empurrão de golpes não atravessa o obstáculo
          if (into < 0) { knockback.x -= nx * into; knockback.z -= nz * into; }
        }
      }
    }
  }

  /** Empurra a jogadora para fora dos inimigos vivos (corpo sólido); chamar depois do PlayerMotor. */
  pushPlayer(player: THREE.Vector3) {
    for (const mob of this.mobs) {
      if (mob.health <= 0 || mob.held) continue;
      const pos = mob.root.position;
      if (player.y - pos.y >= MOB_PLAYER_HEIGHT) continue;
      const dx = player.x - pos.x, dz = player.z - pos.z, min = MOB_STATS[mob.kind].radius * MOB_BODY + PLAYER_RADIUS, d2 = dx * dx + dz * dz;
      if (d2 >= min * min) continue;
      const d = Math.sqrt(d2) || .001, nx = d2 > 1e-8 ? dx / d : 1, nz = d2 > 1e-8 ? dz / d : 0;
      player.x = pos.x + nx * min; player.z = pos.z + nz * min;
    }
  }

  update(delta: number, elapsed: number, player: THREE.Vector3, block: (from: THREE.Vector3, to: THREE.Vector3) => boolean) {
    const dt = Math.min(delta, .05);
    for (const mob of this.mobs) {
      if (mob.health <= 0) {
        mob.respawnTimer -= dt; mob.deathAge += dt;
        this.animateDefeat(mob, dt, elapsed);
        // cliente: quem decide o renascimento é o host (chega pela foto)
        if (this.netRole === 'client' && !Number.isFinite(mob.respawnTimer)) continue;
        if (mob.respawnTimer <= 0) this.respawn(mob, elapsed);
        continue;
      }
      if (this.netRole === 'client') {
        // mob segurado pelo Agarrão deste cliente: posição local (o host recebe pela rede)
        if (mob.held) this.updateHeld(mob, dt, elapsed); else this.updatePuppet(mob, dt, elapsed, player);
        continue;
      }
      // agarrado por um cliente que sumiu (caiu a conexão): solta depois de 1,5 s sem notícias
      if (mob.held && mob.netHeldAt !== undefined && performance.now() - mob.netHeldAt > 1500) this.netRelease(this.mobs.indexOf(mob), 0, 0);
      if (mob.held) { this.updateHeld(mob, dt, elapsed); continue; }
      // host: persegue o jogador mais próximo (local ou remoto)
      let target = player; this.strikeTarget = null;
      if (this.netRole === 'host' && this.remotes.length) {
        let best = Math.hypot(player.x - mob.root.position.x, player.z - mob.root.position.z);
        if (this.health <= 0) best = Infinity;
        for (const r of this.remotes) {
          if (!r.alive) continue;
          const d = Math.hypot(r.pos.x - mob.root.position.x, r.pos.z - mob.root.position.z);
          if (d < best) { best = d; target = this.targetTmp.copy(r.pos); this.strikeTarget = r.id; }
        }
      }
      this.updateMob(mob, dt, elapsed, target, block);
    }

    for (let index = this.drops.length - 1; index >= 0; index--) {
      const drop = this.drops[index]; drop.age += dt;
      if (drop.age > 120) { this.removeDrop(drop, index); continue; }
      drop.root.rotation.y += dt * 1.3;
      drop.root.position.y = terrainHeight(drop.root.position.x, drop.root.position.z) + .48 + Math.sin(drop.age * 3.5) * .12;
      if (Math.hypot(drop.root.position.x - player.x, drop.root.position.z - player.z) < 1.55) {
        this.onSfx('pickup');
        if (drop.kind === 'experience') { this.onExperience(drop.value); this.onPickup(`+${drop.value} XP`); }
        else { this.onItem(drop.kind); this.onPickup(`Item encontrado: ${LOOT_NAMES[drop.kind]}`); }
        this.removeDrop(drop, index);
      }
    }

    // luzes de contagem fixa (ver DROP_LIGHTS)
    for (const f of this.fills) {
      const on = f.mob.visible; f.light.intensity = on ? f.base : 0;
      if (on) f.mob.localToWorld(f.light.position.copy(f.offset));
    }
    const order = this.dropOrder; order.length = 0; order.push(...this.drops);
    if (order.length > DROP_LIGHTS) order.sort((a, b) => a.root.position.distanceToSquared(player) - b.root.position.distanceToSquared(player));
    for (let i = 0; i < DROP_LIGHTS; i++) {
      const l = this.dropLights[i], d = order[i];
      if (!d) { l.intensity = 0; continue; }
      l.intensity = .45; l.color.set(d.color); l.position.copy(d.root.position);
    }
    this.particles.update(dt);
    for (const ring of this.rings) {
      if (!ring.mesh.visible) continue;
      ring.age += dt;
      const u = ring.age / ring.life;
      if (u >= 1) { ring.mesh.visible = false; continue; }
      ring.mesh.scale.setScalar(lerp(.3, ring.size, 1 - Math.pow(1 - u, 3)));
      ring.material.opacity = (1 - u) * .7;
    }
  }

  dispose() {
    this.disposed = true;
    this.root.removeFromParent(); this.dropRoot.removeFromParent(); this.fxRoot.removeFromParent(); this.lightRoot.removeFromParent();
    this.lightRoot.traverse(o => { if ((o as THREE.PointLight).isPointLight) (o as THREE.PointLight).dispose(); });
    this.particles.mesh.dispose();
    this.geometries.forEach(geometry => geometry.dispose());
    this.materials.forEach(material => material.dispose());
  }

  /* ------------------------------------------------------------------ *
   *  Per-mob simulation
   * ------------------------------------------------------------------ */
  private updateMob(mob: Mob, dt: number, elapsed: number, player: THREE.Vector3, block: (from: THREE.Vector3, to: THREE.Vector3) => boolean) {
    const stats = MOB_STATS[mob.kind], root = mob.root, pos = root.position;
    const dx = player.x - pos.x, dz = player.z - pos.z;
    const distance = Math.hypot(dx, dz);
    if (distance < 24) mob.aggro = true; else if (distance > 34) mob.aggro = false;
    mob.alert = damp(mob.alert, mob.aggro ? 1 : 0, 4, dt);
    mob.attackTimer -= dt;
    mob.hitFlash = Math.max(0, mob.hitFlash - dt);
    mob.stagger = Math.max(0, mob.stagger - dt);
    mob.strafeTimer -= dt;
    if (mob.strafeTimer <= 0) { mob.strafeDir = Math.random() < .5 ? -1 : 1; mob.strafeTimer = 1.4 + Math.random() * 2; }
    root.scale.setScalar(damp(root.scale.x, 1, 18, dt));

    const def = mob.attack;
    if (def) mob.attackAge += dt;
    const progress = def ? mob.attackAge / def.duration : 0;

    // --- steering: face the goal with a committed (slow) turn during the strike window
    const homeDist = Math.hypot(mob.home.x - pos.x, mob.home.z - pos.z);
    const returning = !mob.aggro && homeDist > 1.2;
    const goalX = returning ? mob.home.x : player.x, goalZ = returning ? mob.home.z : player.z;
    const targetYaw = mob.aggro || returning ? Math.atan2(goalX - pos.x, goalZ - pos.z) : mob.homeYaw + Math.sin(elapsed * .25 + mob.phase) * .7;
    const angleDelta = THREE.MathUtils.euclideanModulo(targetYaw - root.rotation.y + Math.PI, TAU) - Math.PI;
    let turn = mob.kind === 'wolf' ? 8 : 5.5;
    if (def) turn = progress > .28 && progress < def.hitAt + .1 ? .6 : 2.4;
    else if (mob.stagger > 0) turn = 1.2;
    root.rotation.y += angleDelta * (1 - Math.exp(-dt * turn));
    mob.look = damp(mob.look, mob.aggro ? clamp(angleDelta * .8, -.9, .9) : 0, 6, dt);

    // --- locomotion intent (wolves circle their prey before committing)
    let want = 0, strafe = 0;
    if (!def && mob.stagger <= 0) {
      if (mob.aggro && distance > stats.range * .8) {
        want = stats.speed * (mob.kind === 'wolf' && distance > 9 ? 1.4 : 1);
        if (mob.kind === 'wolf' && distance < 4.8 && mob.attackTimer > .5) { want *= .6; strafe = mob.strafeDir * .75; }
      } else if (returning) want = stats.speed * .45;
    }
    if (Math.abs(angleDelta) > 1.2) want *= .35;
    mob.speed = damp(mob.speed, want, want > mob.speed ? 5 : 10, dt);

    const yaw = root.rotation.y, sy = Math.sin(yaw), cy = Math.cos(yaw);
    const kb = Math.hypot(mob.knockback.x, mob.knockback.z);
    let step = mob.speed * (1 - clamp(kb / 4, 0, .85));
    if (mob.aggro) step = Math.min(step, Math.max(0, distance - stats.range * .7) / Math.max(dt, 1e-3));
    pos.x += (sy * step + cy * strafe * step) * dt;
    pos.z += (cy * step - sy * strafe * step) * dt;
    pos.x += mob.knockback.x * dt; pos.z += mob.knockback.z * dt;
    mob.knockback.multiplyScalar(Math.exp(-5.5 * dt));

    // --- attack lunge (forward impulse + optional airborne arc)
    if (def && def.lunge > 0) {
      const span = def.lungeTo - def.lungeFrom;
      const u = clamp((progress - def.lungeFrom) / span, 0, 1), f = u * u * (3 - 2 * u);
      const move = Math.min(def.lunge * (f - mob.lungeU), Math.max(0, distance - .85));
      mob.lungeU = f;
      pos.x += sy * move; pos.z += cy * move;
      mob.air = def.air * Math.sin(clamp((progress - def.lungeFrom) / (span + .1), 0, 1) * Math.PI);
    } else mob.air = damp(mob.air, 0, 12, dt);

    // --- colisão entre inimigos: cada um resolve metade da sobreposição (o outro resolve a outra metade na sua vez)
    const body = stats.radius * MOB_BODY;
    for (const other of this.mobs) {
      if (other === mob || other.health <= 0) continue;
      const ox = pos.x - other.root.position.x, oz = pos.z - other.root.position.z;
      const min = body + MOB_STATS[other.kind].radius * MOB_BODY, d2 = ox * ox + oz * oz;
      if (d2 >= min * min) continue;
      if (d2 > 1e-6) { const d = Math.sqrt(d2), push = (min - d) * .5; pos.x += ox / d * push; pos.z += oz / d * push; }
      else { pos.x += Math.sin(mob.phase) * .05; pos.z += Math.cos(mob.phase) * .05; } // empilhados exatamente: desempata
    }

    // --- colisão com a jogadora (só quando ela está na altura do inimigo, não voando por cima)
    if (player.y - pos.y < MOB_PLAYER_HEIGHT) {
      const px = pos.x - player.x, pz = pos.z - player.z, min = body + PLAYER_RADIUS, d2 = px * px + pz * pz;
      if (d2 < min * min && d2 > 1e-6) {
        const d = Math.sqrt(d2), nx = px / d, nz = pz / d;
        pos.x = player.x + nx * min; pos.z = player.z + nz * min;
        const into = mob.knockback.x * nx + mob.knockback.z * nz;
        if (into < 0) { mob.knockback.x -= nx * into; mob.knockback.z -= nz * into; }
      }
    }

    // --- colisão com o cenário (árvores, pedras, construções): duas passadas para deslizar sem atravessar
    this.collideWorld(pos, body, mob.knockback);

    // --- terrain follow + body tilt to the slope
    // escudo sólido: empurra o inimigo para fora da muralha e anula o avanço contra ela
    const bar = this.barrier;
    if (bar) {
      const r = MOB_STATS[mob.kind].radius * .8, dx = pos.x - bar.center.x, dz = pos.z - bar.center.z;
      const depth = dx * bar.normal.x + dz * bar.normal.z, lat = -dx * bar.normal.z + dz * bar.normal.x;
      if (Math.abs(lat) < bar.half + r * .5 && depth > -1.2 && depth < r) {
        const push = r - depth;
        pos.x += bar.normal.x * push; pos.z += bar.normal.z * push;
        const into = mob.knockback.x * bar.normal.x + mob.knockback.z * bar.normal.z;
        if (into < 0) { mob.knockback.x -= bar.normal.x * into; mob.knockback.z -= bar.normal.z * into; }
      }
    }
    pos.y = terrainHeight(pos.x, pos.z) + mob.air;
    const hF = terrainHeight(pos.x + sy * .7, pos.z + cy * .7), hB = terrainHeight(pos.x - sy * .7, pos.z - cy * .7);
    mob.slope = damp(mob.slope, clamp(-Math.atan2(hF - hB, 1.4), -.4, .4) * (mob.kind === 'wolf' ? .9 : .35), 8, dt);
    root.rotation.x = mob.slope;

    // --- actual velocity (feeds cloth / tail / hair spring chains)
    const inv = 1 / Math.max(dt, 1e-3);
    mob.vel.x = damp(mob.vel.x, (pos.x - mob.prev.x) * inv, 12, dt);
    mob.vel.y = damp(mob.vel.y, (pos.z - mob.prev.y) * inv, 12, dt);
    mob.prev.set(pos.x, pos.z);
    mob.vf = mob.vel.x * sy + mob.vel.y * cy;
    mob.vs = mob.vel.x * cy - mob.vel.y * sy;

    // --- gait phase advances with ground speed so planted feet do not slide
    // lobo: trote em velocidade baixa, galope na perseguição (troca contínua, as patas re-sincronizam aos poucos)
    if (mob.kind === 'wolf') mob.gallop = damp(mob.gallop, def ? mob.gallop : smoothstep(mob.speed, GALLOP_FROM, GALLOP_TO), 3, dt);
    const g = this.gaitOf(mob), speedN = mob.speed / stats.speed, amp = strideAmp(g, speedN);
    if (amp > .05 && mob.speed > .05) mob.gait += Math.min(mob.speed * g.duty / amp, mob.rig.fit?.cadence ?? 3.4) * dt;

    // --- attack state machine
    mob.guard = damp(mob.guard, mob.aggro && !def && mob.stagger <= 0 ? 1 : 0, 6, dt);
    if (!def) {
      if (mob.aggro && distance <= stats.range && player.y - pos.y < MELEE_HEIGHT && mob.attackTimer <= 0 && mob.stagger <= .05 && Math.abs(angleDelta) < .55) this.beginAttack(mob);
    } else {
      if (!mob.attackHit && progress >= def.hitAt) { mob.attackHit = true; this.resolveStrike(mob, def, player, block); }
      if (progress >= 1) { mob.attack = null; mob.attackAge = 0; }
    }
    this.updateArc(mob, progress);

    // --- pose = attack keys (or neutral) + additive hit flinch
    const pose = mob.pose;
    if (mob.attack) sampleKeys(mob.attack.keys, mob.attackAge / mob.attack.duration, pose); else clearPose(pose);
    if (mob.stagger > 0) {
      // recuo direcional: o tronco cede para longe do golpe (de frente = para trás, de lado = inclina e gira)
      const fl = this.flinchPose, pw = mob.staggerPower;
      sampleKeys(FLINCH, 1 - mob.stagger / mob.staggerMax, fl);
      const k = clamp(-fl.lean / .3, 0, 1) * pw;
      for (const f of POSE_FIELDS) if (f !== 'lean') pose[f] += fl[f] * pw;
      pose.lean += fl.lean * pw * (.3 + .7 * mob.hitZ);
      pose.roll += .32 * k * mob.hitX; pose.twist += .35 * k * mob.hitX; pose.headYaw -= .4 * k * mob.hitX;
    }

    if (mob.kind === 'wolf') this.applyWolf(mob, pose, elapsed, dt); else this.applyHumanoid(mob, pose, elapsed, dt);
    this.updateMaterials(mob, 0);
  }

  private beginAttack(mob: Mob) {
    const stats = MOB_STATS[mob.kind];
    const id: AttackId = mob.kind === 'wolf' ? 'bite' : mob.kind === 'bandit' ? (Math.random() < .5 ? 'overhead' : 'slash') : (Math.random() < .35 ? 'slam' : 'swipe');
    const def = ATTACKS[id];
    this.onSfx(mob.kind === 'wolf' ? 'wolfAttack' : mob.kind === 'bandit' ? 'banditAttack' : 'demonAttack');
    mob.attack = def; mob.attackAge = 0; mob.attackHit = false; mob.lungeU = 0;
    mob.attackTimer = stats.cadence * (.85 + Math.random() * .3);
    const arc = mob.arc;
    if (arc) {
      if (def.arc === 'h') { arc.ring.rotation.set(-Math.PI / 2, 0, -Math.PI / 2); arc.axis = 'y'; arc.from = .95; arc.to = -.95; arc.pivot.position.set(0, 1.25, .1); }
      else if (def.arc === 'v') { arc.ring.rotation.set(0, Math.PI / 2, 0); arc.axis = 'x'; arc.from = .8; arc.to = -2.4; arc.pivot.position.set(0, 1.35, .25); }
    }
  }

  private resolveStrike(mob: Mob, def: AttackDef, player: THREE.Vector3, block: (from: THREE.Vector3, to: THREE.Vector3) => boolean) {
    const stats = MOB_STATS[mob.kind], root = mob.root;
    const dx = player.x - root.position.x, dz = player.z - root.position.z;
    const dist = Math.hypot(dx, dz);
    const facing = dist > .001 ? (Math.sin(root.rotation.y) * dx + Math.cos(root.rotation.y) * dz) / dist : 1;
    const range = def.aoe ? stats.range + .9 : stats.range + .35;
    if (def.aoe) {
      this.tmpA.set(root.position.x + Math.sin(root.rotation.y) * 1.2, root.position.y, root.position.z + Math.cos(root.rotation.y) * 1.2);
      this.shock(this.tmpA, '#ff8a5c', range * 2.2);
      this.particles.emit(this.tmpA, '#b9a98a', 16, 3.4, 1.6, .7, 1.7);
    }
    if (dist > range || (!def.aoe && facing < .25)) return;
    if (player.y - root.position.y > MELEE_HEIGHT + (def.aoe ? .4 : 0)) return; // fora do alcance vertical (voando/pulando alto)
    // alvo remoto: o próprio jogador aplica escudo/resistência na máquina dele
    if (this.strikeTarget) { this.onRemoteStrike(this.strikeTarget, stats.damage * def.damage, root.position.x, root.position.z); return; }
    if (this.invulnerable) return;
    this.tmpA.set(player.x, player.y + .9, player.z);
    this.tmpB.set(root.position.x, root.position.y + 1, root.position.z);
    if (block(this.tmpA, this.tmpB)) return;
    this.health = Math.max(0, this.health - stats.damage * def.damage * (1 - this.resist)); this.onSfx('hurt');
    this.tmpA.set(player.x, player.y + 1, player.z);
    this.particles.emit(this.tmpA, '#ff6a4a', 10, 3.5, 2, .45, 1);
  }

  private reactToHit(mob: Mob, damage: number) {
    const stats = MOB_STATS[mob.kind];
    const heavy = damage >= stats.hp * .12;
    mob.staggerMax = heavy ? .5 : .24; mob.stagger = mob.staggerMax; mob.staggerPower = heavy ? 1 : .55;
    // heavy hits interrupt the wind-up (but never the strike itself)
    if (heavy && mob.attack && mob.attackAge / mob.attack.duration < mob.attack.hitAt - .06) {
      mob.attack = null; mob.attackAge = 0; mob.attackTimer = Math.max(mob.attackTimer, .6);
    }
  }

  private updateArc(mob: Mob, progress: number) {
    const arc = mob.arc, def = mob.attack;
    if (!arc) return;
    if (!def || def.arc === 'none') { arc.pivot.visible = false; return; }
    const u = clamp((progress - (def.hitAt - .14)) / .32, 0, 1);
    const visible = progress >= def.hitAt - .14 && u < 1;
    arc.pivot.visible = visible;
    if (!visible) return;
    const ang = lerp(arc.from, arc.to, 1 - Math.pow(1 - u, 2));
    arc.pivot.rotation.set(arc.axis === 'x' ? ang : 0, arc.axis === 'y' ? ang : 0, 0);
    arc.material.opacity = Math.sin(u * Math.PI) * .6;
  }

  private updateMaterials(mob: Mob, fade: number) {
    const flash = mob.hitFlash;
    if (flash > 0 || mob.flashing) {
      for (const e of mob.mats) e.m.emissiveIntensity = e.base + flash * 2.5;
      mob.flashing = flash > 0;
    }
    const glow = mob.pose.glow * 1.1;
    for (const e of mob.eyes) e.m.emissiveIntensity = e.base * (1 - fade * .9) + glow * (1 - fade);
  }

  /* ------------------------------------------------------------------ *
   *  Procedural rigs
   * ------------------------------------------------------------------ */
  private stepChain(c: Chain, dt: number, fwd: number, side: number, phase: number, offsetX = 0) {
    for (let i = 0; i < c.segs.length; i++) {
      const k = c.k * (1 - i * .1), depth = 1 + i * .35;
      const tx = c.restX[i] + (i === 0 ? offsetX : 0) + c.gainF * fwd * depth + Math.sin(phase + i * .9) * c.wave * depth;
      const tz = c.restZ[i] + c.gainS * side * depth + Math.cos(phase * .8 + i * 1.3) * c.wave * .6 * depth;
      c.vx[i] += (k * (tx - c.x[i]) - c.c * c.vx[i]) * dt;
      c.vz[i] += (k * (tz - c.z[i]) - c.c * c.vz[i]) * dt;
      c.x[i] += c.vx[i] * dt; c.z[i] += c.vz[i] * dt;
      c.segs[i].rotation.x = c.x[i];
      if (c.lat === 'y') c.segs[i].rotation.y = c.z[i]; else c.segs[i].rotation.z = c.z[i];
    }
  }

  /** Two-bone IK in the sagittal plane. Targets are expressed in root space (z forward, y up from the ground). */
  private solveLeg(leg: Leg, py: number, pz: number, pitch: number, parentPitch: number, footZ: number, footY: number, footPitch: number) {
    const c = Math.cos(pitch), s = Math.sin(pitch);
    const hipY = py + leg.hy * c - leg.hz * s, hipZ = pz + leg.hy * s + leg.hz * c;
    let dz = footZ - hipZ, dy = footY - hipY, d = Math.hypot(dz, dy);
    const maxD = leg.l1 + leg.l2 - .003, minD = Math.abs(leg.l1 - leg.l2) + .03;
    if (d > maxD) { const k = maxD / d; dz *= k; dy *= k; d = maxD; }
    else if (d < minD) { const k = minD / Math.max(d, 1e-4); dz *= k; dy *= k; d = minD; }
    const beta = Math.atan2(dz, -dy);
    const a = Math.acos(clamp((leg.l1 * leg.l1 + d * d - leg.l2 * leg.l2) / (2 * leg.l1 * d), -1, 1));
    const cc = Math.acos(clamp((leg.l2 * leg.l2 + d * d - leg.l1 * leg.l1) / (2 * leg.l2 * d), -1, 1));
    const a1 = beta + leg.bend * a, a2 = beta - leg.bend * cc;
    leg.hip.rotation.x = -a1 - pitch - parentPitch;
    leg.knee.rotation.x = -(a2 - a1);
    leg.ankle.rotation.x = a2 + footPitch;
  }

  /** Marcha atual: a do modelo ajustado (pernas reais) ou a do rig procedural, misturada com o galope. */
  private gaitOf(mob: Mob): Gait {
    const fit = mob.rig.fit, trot = fit?.gait ?? GAIT[mob.kind], gal = mob.kind === 'wolf' ? (fit ? fit.gallop : WOLF_GALLOP) : null;
    const k = gal ? mob.gallop : 0;
    if (k <= 0 || !gal) return trot;
    const o = this.gaitTmp;
    o.stride = lerp(trot.stride, gal.stride, k); o.duty = lerp(trot.duty, gal.duty, k); o.lift = lerp(trot.lift, gal.lift, k);
    return o;
  }
  private gaitTmp: Gait = { stride: 0, duty: 0, lift: 0 };

  private footCycle(mob: Mob, leg: Leg, amp: number, g: Gait) {
    const ph = fract(mob.gait + lerpPhase(leg.phase, leg.gallopPhase, mob.gallop));
    let stepZ = 0, lift = 0, toeOff = 0;
    if (amp > .01) {
      if (ph < g.duty) { const s = ph / g.duty; stepZ = amp * (.5 - s); toeOff = smoothstep(s, .75, 1); }
      else {
        const s = (ph - g.duty) / (1 - g.duty), e = s * s * (3 - 2 * s);
        stepZ = amp * (-.5 + e); lift = Math.sin(s * Math.PI) * g.lift * clamp(amp / g.stride, .3, 1.2);
      }
    }
    return { stepZ, lift, toeOff };
  }

  private applyWolf(mob: Mob, p: Pose, t: number, dt: number) {
    const r = mob.rig, fit = r.fit, g = this.gaitOf(mob), neck = r.neck!, jaw = r.jaw!;
    const speedN = clamp(mob.speed / MOB_STATS.wolf.speed, 0, 1.5);
    const amp = strideAmp(g, speedN), w = smoothstep(speedN, .05, .6);
    const c = mob.gait * TAU, alert = mob.alert, gal = mob.gallop, trot = 1 - gal;
    // respiração: ofegante (mais rápida e funda) depois de correr
    const pant = w * .6 + alert * .25, breath = Math.sin(t * (2.4 + pant * 4) + mob.phase) * (1 + pant);
    // trote: quique duplo por ciclo; galope: corpo mais alto na fase aérea agrupada (~.1), mais baixo no apoio
    // das dianteiras (~.6), e a coluna flexiona/estende
    const bob = (Math.cos(c * 2) * .03 * trot + Math.cos(c - TAU * .1) * .05 * gal) * w;
    const flex = Math.cos(c - TAU * .9) * gal * w;
    const pitchOsc = Math.sin(c * 2 + .8) * .028 * w * trot, sway = Math.sin(c) * w * trot;
    const k = fit?.legScale ?? 1;

    r.pelvis.position.set(0, (fit?.pelvisY ?? .82) + bob * k + p.drop * k - alert * .035 * k + breath * .004, (fit?.pelvisZ ?? -.08) + p.push * k);
    // flexão: a pelve "encaixa" (frente sobe) e o peito desce, arqueando as costas; extensão faz o contrário
    r.pelvis.rotation.set(p.lean + pitchOsc + alert * .03 - flex * .12 - gal * w * .04, sway * .06, sway * .03 + p.roll);
    r.chest.rotation.set(-pitchOsc * 1.3 - p.lean * .3 + flex * .24, -sway * .1 + p.twist * .4, -sway * .03);
    // no galope a cabeça estica para a frente e compensa o balanço do corpo (olhar fixo na presa)
    neck.rotation.set(-alert * .1 + p.head * .5 - .04 + breath * .01 + gal * w * .22, mob.look * .5, 0);
    r.head.rotation.set(.1 + p.head * .55 - (r.pelvis.rotation.x + r.chest.rotation.x + neck.rotation.x) * .55 - gal * w * .1, mob.look * .5 + p.headYaw * .7 - r.chest.rotation.y * .5, 0);
    jaw.rotation.x = clamp((p.jaw * .85 + w * (.08 + Math.sin(t * 13) * .04) + alert * .05 + Math.max(0, breath) * pant * .05) * (fit?.jaw ?? 1), 0, 1);

    for (const ear of r.ears) {
      const flick = Math.max(0, Math.sin(t * 1.1 + mob.phase * 5 + ear.side) - .9) * 6;
      ear.group.rotation.set(-.12 - p.glow * .55 - flick * .3, 0, ear.side * (.24 + p.glow * .3 + alert * .1 + flick * .2));
    }
    if (r.breath) {
      const base = r.breath.userData.base as THREE.Vector3;
      r.breath.scale.set(base.x * (1 + breath * .012), base.y * (1 + breath * .03 + alert * .01), base.z);
    }
    if (r.tail) this.stepChain(r.tail, dt, mob.vf, mob.vs, t * 4 + mob.phase, p.tail * .6 + alert * .2 - w * .15);

    for (const leg of r.legs) {
      const { stepZ, lift, toeOff } = this.footCycle(mob, leg, amp, g);
      let footZ = lerp(leg.restZ, leg.footZ, w) + stepZ, footY = leg.footY + lift;
      if (leg.front) { footZ += p.reach * .42 * k; footY += p.reach * .24 * k; } else { footZ -= p.reach * .26 * k; footY += p.reach * .1 * k; }
      this.solveLeg(leg, r.pelvis.position.y, r.pelvis.position.z, r.pelvis.rotation.x, leg.front ? r.chest.rotation.x : 0, footZ, footY, toeOff * .45 + p.reach * (leg.front ? .5 : .8));
    }
  }

  private applyHumanoid(mob: Mob, p: Pose, t: number, dt: number) {
    const r = mob.rig, fit = r.fit, kind = mob.kind, g = this.gaitOf(mob), heavy = kind === 'demon' ? 1.12 : 1;
    const speedN = clamp(mob.speed / MOB_STATS[kind].speed, 0, 1.5);
    const amp = strideAmp(g, speedN), w = smoothstep(speedN, .05, .6);
    const c = mob.gait * TAU, alert = mob.alert, guard = mob.guard;
    const breath = Math.sin(t * 2.1 + mob.phase), sway = Math.sin(c) * w;
    const armX = fit?.arm.x ?? 0, armZ = fit?.arm.z ?? 0, armE = fit?.arm.e ?? 0;

    const feet = r.legs.map(leg => this.footCycle(mob, leg, amp, g));
    let py = (fit?.pelvisY ?? PELVIS_Y) - Math.cos(c * 2) * .04 * w * heavy;
    const pz = (fit?.pelvisZ ?? 0) + p.push;
    if (fit && fit.compass) {
      // marcha de compasso: a pelve fica na altura em que a perna de apoio tem o mesmo comprimento da pose esculpida
      // (malha reta no apoio, só dobra no balanço); sobe no meio do apoio e desce no duplo apoio, sem salto na troca
      py = fit.pelvisY;
      r.legs.forEach((leg, i) => {
        const dz = lerp(leg.restZ, leg.footZ, w) + feet[i].stepZ - (pz + leg.hz);
        const need = Math.sqrt(Math.max(0, leg.stance * leg.stance - dz * dz)) + leg.footY - leg.hy + feet[i].lift * 3;
        if (need < py) py = need;
      });
      py -= fit.walkDrop * w; // sem agachar em alerta: com salto alto a perna de apoio fica esticada
    } else py -= alert * .03;
    r.pelvis.position.set(sway * .028, py + p.drop + breath * .006, pz);
    r.pelvis.rotation.set(.03 * w + p.lean * .3 + alert * .04, p.twist * .35 + sway * .1 * heavy, sway * .035 + p.roll * .4);
    r.chest.rotation.set(p.lean * .7 + w * .04 + breath * .01, p.twist * .65 - sway * .2 * heavy, -sway * .04 + p.roll * .6);
    r.head.rotation.set(
      p.head - (r.pelvis.rotation.x + r.chest.rotation.x) * .6 + .02 + Math.sin(t * 1.6 + mob.phase) * .02,
      mob.look * .7 + p.headYaw - (r.pelvis.rotation.y + r.chest.rotation.y) * .6, 0);
    if (r.breath) {
      const base = r.breath.userData.base as THREE.Vector3;
      r.breath.scale.set(base.x * (1 + breath * .01), base.y, base.z * (1 + breath * .018));
    }

    for (const arm of r.arms) {
      const left = arm.side < 0;
      const pX = left ? p.lX : p.rX, pZ = left ? p.lZ : p.rZ, pE = left ? p.lE : p.rE;
      const swing = Math.cos((mob.gait + arm.legPhase) * TAU) * (arm.weapon ? .2 : .45) * w * heavy;
      const guardX = (arm.weapon ? -.5 : -.3) * guard, idleSway = Math.sin(t * 1.7 + mob.phase + arm.side) * .02;
      arm.shoulder.rotation.set(-.06 + swing + pX + guardX + idleSway + armX, 0, arm.side * (.1 + pZ + armZ));
      arm.elbow.rotation.x = -(.22 + pE + guard * .55 + w * .12 + armE);
      arm.wrist.rotation.x = arm.weapon ? -.45 : -.1;
    }

    r.legs.forEach((leg, i) => {
      const { stepZ, lift, toeOff } = feet[i];
      this.solveLeg(leg, r.pelvis.position.y, r.pelvis.position.z, r.pelvis.rotation.x, 0, lerp(leg.restZ, leg.footZ, w) + stepZ, leg.footY + lift, toeOff * .4);
    });
    r.retarget?.update();

    for (const chain of r.cloth) {
      if (chain.segs.length === 1 && chain.angle !== 0) this.stepChain(chain, dt, mob.vf * Math.cos(chain.angle) + mob.vs * Math.sin(chain.angle), 0, t * 2 + chain.angle, 0);
      else this.stepChain(chain, dt, mob.vf, mob.vs, t * 2.2 + mob.phase, 0);
    }
    for (const chain of r.braids) this.stepChain(chain, dt, mob.vf, mob.vs, t * 2.6 + mob.phase, 0);
    if (r.tail) this.stepChain(r.tail, dt, mob.vf, mob.vs, t * 2.4 + mob.phase, p.glow * .1);
  }

  /**
   * Morte em etapas: recuo do golpe final (o corpo ainda desliza com o empurrão) → pernas cedem → queda com
   * gravidade (acelera até bater no chão) e um pequeno quique → membros relaxam → afunda na terra e some.
   * O lobo tomba de lado; humanoides caem para longe do golpe (de costas quando atingidos de frente).
   */
  private animateDefeat(mob: Mob, dt: number, elapsed: number) {
    const age = mob.deathAge, root = mob.root, pos = root.position, wolf = mob.kind === 'wolf';
    mob.hitFlash = Math.max(0, mob.hitFlash - dt);
    if (age > 3.6) { root.visible = false; return; }
    pos.x += mob.knockback.x * dt; pos.z += mob.knockback.z * dt;
    mob.knockback.multiplyScalar(Math.exp(-4.5 * dt));
    this.collideWorld(pos, MOB_STATS[mob.kind].radius * MOB_BODY, mob.knockback);

    const t0 = wolf ? .26 : .38, T = wolf ? .4 : .48, u = clamp((age - t0) / T, 0, 1), b = age - t0 - T;
    const fall = b < 0 ? u * u : 1 - .085 * Math.exp(-5 * b) * Math.abs(Math.sin(b * 13));
    const recoil = smoothstep(age, 0, .09) * (1 - smoothstep(age, .1, .45));
    const buckle = smoothstep(age, .06, .45), settle = b > 0 ? smoothstep(b, 0, .6) : 0;
    const sink = smoothstep(age, 2.5, 3.6);

    const p = mob.pose; clearPose(p);
    if (wolf) {
      // ganido (cabeça para trás, boca aberta) → patas cedem → tomba de lado com a cabeça e a cauda largadas
      p.head = -.45 * recoil + .55 * fall; p.jaw = .9 * recoil + .4 * fall * (1 - settle * .5);
      p.lean = .12 * buckle * (1 - fall); p.drop = -.2 * buckle * (1 - fall * .7);
      p.tail = .5 * recoil - .5 * fall; p.reach = .25 * fall * (1 - settle);
      root.rotation.set(0, root.rotation.y, -mob.deathSide * 1.48 * fall);
      pos.y = terrainHeight(pos.x, pos.z) + Math.sin(1.48 * fall) * .27 - sink * .55;
    } else {
      // jogado para trás → joelhos cedem → cai para longe do golpe; os braços sobem na queda e se abrem no chão
      const dx = -mob.hitX, dz = -mob.hitZ, fly = fall * (1 - settle);
      p.lean = -.35 * recoil + .3 * buckle * (1 - fall) - .1 * fall; p.drop = -.18 * buckle * (1 - fall * .8);
      p.head = -.5 * recoil + .25 * buckle * (1 - fall) - .2 * fly + .15 * settle; p.headYaw = .5 * settle * (mob.deathSide);
      p.rX = -1.1 * fly + .25 * settle + .3 * buckle * (1 - fall); p.lX = -.9 * fly + .35 * settle + .3 * buckle * (1 - fall);
      p.rZ = .55 * fall + .4 * settle; p.lZ = .6 * fall + .5 * settle; p.rE = .3 * buckle + .2 * settle; p.lE = .4 * buckle + .3 * settle;
      p.twist = .25 * fall * mob.deathSide; p.roll = .2 * fall * mob.deathSide;
      const ang = 1.42 * fall;
      root.rotation.set(ang * dz, root.rotation.y, -ang * dx);
      pos.y = terrainHeight(pos.x, pos.z) + Math.sin(ang) * (mob.kind === 'demon' ? .26 : .17) - sink * .7;
    }
    mob.speed = 0; mob.alert = 0; mob.guard = 0; mob.look = 0; mob.vf = 0; mob.vs = 0; mob.gallop = 0;
    root.scale.setScalar(1 - sink * .35);
    if (wolf) this.applyWolf(mob, p, elapsed, dt); else this.applyHumanoid(mob, p, elapsed, dt);
    this.updateMaterials(mob, buckle);
    if (mob.arc) mob.arc.pivot.visible = false;
  }

  /* ------------------------------------------------------------------ *
   *  Modeling
   * ------------------------------------------------------------------ */
  private geometry<T extends THREE.BufferGeometry>(geometry: T) { this.geometries.push(geometry); return geometry; }
  private material(color: string, emissive = '#000000', emissiveIntensity = .03, roughness = .82) {
    const material = new THREE.MeshStandardMaterial({ color, emissive: emissive === '#000000' ? color : emissive, emissiveIntensity: emissive === '#000000' ? .72 : emissiveIntensity, roughness, flatShading: false });
    this.materials.push(material); return material;
  }
  /** Capsule limb: radius and TOTAL height are in meters (unit capsule is r=.5, h=2). */
  private limb(parent: THREE.Object3D, material: THREE.Material, center: V3, radius: number, height: number, rotation: V3 = [0, 0, 0]) {
    return part(parent, this.unitCapsule, material, center, [radius / .5, height / 2, radius / .5], rotation);
  }
  private eyePart(parent: THREE.Object3D, material: THREE.Material, position: V3, scale: V3) {
    const mesh = part(parent, this.sphere, material, position, scale); mesh.userData.eye = true; return mesh;
  }

  private createMob(spawn: Spawn, index: number): Mob {
    const root = new THREE.Group(); root.name = `${spawn.kind}-mob`; root.rotation.order = 'YXZ';
    root.position.set(spawn.x, terrainHeight(spawn.x, spawn.z), spawn.z); this.root.add(root);
    const rig = spawn.kind === 'wolf' ? this.buildWolf(root) : this.buildHumanoid(root, spawn.kind);
    for (const light of root.children.filter(c => (c as THREE.PointLight).isPointLight) as THREE.PointLight[]) {
      this.fills.push({ light, mob: root, base: light.intensity, offset: light.position.clone() }); this.lightRoot.add(light);
    }
    this.targets.push(rig.target);

    const seen = new Set<THREE.MeshStandardMaterial>(), mats: MatEntry[] = [], eyes: MatEntry[] = [];
    root.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      const m = object.material;
      if (!(m instanceof THREE.MeshStandardMaterial) || seen.has(m)) return;
      seen.add(m);
      (object.userData.eye ? eyes : mats).push({ m, base: m.emissiveIntensity });
    });

    let arc: ArcFx | null = null;
    if (spawn.kind !== 'wolf') {
      const material = new THREE.MeshBasicMaterial({ color: spawn.kind === 'demon' ? '#ff7aa8' : '#dfeaf0', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
      this.materials.push(material);
      const pivot = new THREE.Group(); pivot.visible = false; pivot.position.set(0, 1.25, .1); root.add(pivot);
      const ring = new THREE.Mesh(this.arcGeometry, material); pivot.add(ring);
      arc = { pivot, ring, material, axis: 'y', from: 0, to: 0 };
    }

    const stats = MOB_STATS[spawn.kind];
    return {
      kind: spawn.kind, root, rig, target: rig.target, health: stats.hp, phase: Math.random() * 6, attackTimer: 1 + Math.random() * 1.8,
      respawnTimer: 0, spawn: index, hitFlash: 0, flashing: false,
      attack: null, attackAge: 0, attackHit: false, lungeU: 0, air: 0,
      gait: Math.random(), speed: 0, alert: 0, guard: 0, aggro: false, look: 0, slope: 0, gallop: 0,
      stagger: 0, staggerMax: .3, staggerPower: 1, hitX: 0, hitZ: -1, deathAge: 0, deathSide: 1, knockback: new THREE.Vector3(),
      home: new THREE.Vector3(spawn.x, 0, spawn.z), homeYaw: 0, strafeDir: Math.random() < .5 ? -1 : 1, strafeTimer: 1 + Math.random() * 2,
      vel: new THREE.Vector2(), prev: new THREE.Vector2(spawn.x, spawn.z), vf: 0, vs: 0,
      pose: newPose(), mats, eyes, arc,
    };
  }

  private buildWolf(root: THREE.Group): Rig {
    const hide = this.material('#26272b');
    const fur = this.material('#77766d', '#000000', .025);
    const furDark = this.material('#55544e');
    const accent = this.material('#aaa395');
    const tongue = this.material('#c46d6d');
    const fang = this.material('#e8e2d0');
    const eye = this.material('#ddbd76', '#8c552a', 1.3, .25);
    const fill = new THREE.PointLight('#c5a16c', .28, 3.2, 2); fill.position.set(0, 1.15, .15); root.add(fill);

    const pelvis = new THREE.Group(); pelvis.position.set(0, .82, -.08); root.add(pelvis);
    part(pelvis, this.sphere, fur, [0, .03, -.34], [.44, .43, .46]);
    part(pelvis, this.sphere, fur, [0, 0, .02], [.43, .4, .5]);
    part(pelvis, this.sphere, accent, [0, -.15, .04], [.3, .2, .5]);
    part(pelvis, this.sphere, furDark, [0, .17, -.14], [.32, .16, .6]);
    for (const z of [-.42, -.2, .02]) part(pelvis, this.cone, furDark, [0, .2, z], [.5, .55, .5], [-.9, 0, 0]);

    const chest = new THREE.Group(); chest.position.set(0, .05, .4); pelvis.add(chest);
    const ribs = part(chest, this.sphere, fur, [0, .03, .06], [.47, .48, .5]); ribs.userData.base = ribs.scale.clone();
    part(chest, this.sphere, accent, [0, -.14, .12], [.33, .3, .4]);
    part(chest, this.sphere, furDark, [0, .22, 0], [.3, .18, .4]);
    for (const side of [-1, 1]) part(chest, this.sphere, fur, [side * .27, .27, -.02], [.19, .22, .3]);
    for (const z of [.1, .3]) part(chest, this.cone, furDark, [0, .3, z], [.55, .65, .55], [-.7, 0, 0]);

    const neck = new THREE.Group(); neck.position.set(0, .18, .36); chest.add(neck);
    this.limb(neck, fur, [0, .09, .235], .2, .62, [1.21, 0, 0]);
    part(neck, this.sphere, accent, [0, -.03, .28], [.2, .2, .26]);
    part(neck, this.sphere, furDark, [0, .14, .18], [.17, .14, .3]);
    const head = new THREE.Group(); head.position.set(0, .17, .47); neck.add(head);
    part(head, this.sphere, fur, [0, .02, .04], [.3, .28, .3]);
    for (const side of [-1, 1]) part(head, this.sphere, accent, [side * .15, -.05, .04], [.13, .14, .2]);
    part(head, this.sphere, accent, [0, -.04, .3], [.15, .12, .26]);
    part(head, this.sphere, furDark, [0, .05, .28], [.11, .07, .26]);
    part(head, this.sphere, hide, [0, -.005, .54], [.07, .06, .065]);
    const jaw = new THREE.Group(); jaw.position.set(0, -.1, .1); head.add(jaw);
    part(jaw, this.sphere, accent, [0, -.025, .2], [.11, .06, .24]);
    part(jaw, this.sphere, tongue, [0, .005, .22], [.06, .025, .15]);

    const ears: { group: THREE.Group; side: number }[] = [];
    for (const side of [-1, 1]) {
      part(jaw, this.cone, fang, [side * .06, .04, .36], [.22, .28, .22]);
      part(head, this.cone, fang, [side * .07, -.1, .42], [.24, .34, .24], [Math.PI, 0, 0]);
      const ear = new THREE.Group(); ear.position.set(side * .14, .24, -.04); head.add(ear); ears.push({ group: ear, side });
      part(ear, this.cone, fur, [0, .13, 0], [.62, .85, .5]);
      part(ear, this.cone, tongue, [0, .12, .025], [.36, .6, .3]);
      part(head, this.sphere, hide, [side * .13, .07, .27], [.06, .05, .05]);
      this.eyePart(head, eye, [side * .13, .07, .31], [.05, .045, .03]);
      part(head, this.sphere, hide, [side * .13, .07, .335], [.012, .034, .012]);
    }
    const target = part(head, this.sphere, this.targetMaterial, [0, 0, .2], [.3, .26, .38]); target.name = 'wolf-target';

    const tail = new THREE.Group(); tail.position.set(0, .12, -.66); pelvis.add(tail);
    part(tail, this.sphere, fur, [0, 0, -.12], [.2, .2, .3]);
    const t1 = new THREE.Group(); t1.position.set(0, 0, -.24); tail.add(t1); part(t1, this.sphere, fur, [0, 0, -.12], [.18, .18, .28]);
    const t2 = new THREE.Group(); t2.position.set(0, 0, -.24); t1.add(t2); part(t2, this.sphere, accent, [0, 0, -.12], [.14, .14, .26]);
    const tailChain = makeChain([tail, t1, t2], [.5, -.2, -.25], { k: 34, c: 4.5, gainF: .05, gainS: .03, wave: .12, lat: 'y' });

    const legs: Leg[] = [];
    const makeLeg = (parent: THREE.Object3D, local: V3, pelvisPos: V3, front: boolean, side: number, phase: number) => {
      const l1 = .36, l2 = front ? .4 : .38;
      const hip = new THREE.Group(); hip.position.set(...local); parent.add(hip);
      const knee = new THREE.Group(); knee.position.set(0, -l1, 0); hip.add(knee);
      const ankle = new THREE.Group(); ankle.position.set(0, -l2, 0); knee.add(ankle);
      if (front) {
        part(hip, this.sphere, fur, [0, -.05, -.01], [.16, .2, .2]);
        this.limb(hip, fur, [0, -l1 / 2 + .02, 0], .085, l1 + .1);
        this.limb(knee, fur, [0, -l2 / 2 + .02, .01], .062, l2 + .08);
        part(knee, this.sphere, furDark, [0, 0, -.04], [.08, .08, .09]);
      } else {
        part(hip, this.sphere, fur, [0, -.09, 0], [.2, .3, .27]);
        this.limb(hip, fur, [0, -l1 / 2 + .02, 0], .08, l1 + .1);
        this.limb(knee, fur, [0, -l2 / 2 + .02, -.02], .055, l2 + .1, [-.12, 0, 0]);
        part(knee, this.sphere, furDark, [0, 0, .04], [.07, .08, .08]);
      }
      part(ankle, this.sphere, hide, [0, -.03, .07], [.095, .065, .15]);
      for (const toe of [-1, 0, 1]) part(ankle, this.sphere, hide, [toe * .055, -.035, .19], [.04, .04, .07]);
      // galope rotatório: traseira esquerda, traseira direita, dianteira direita, dianteira esquerda
      const gallopPhase = front ? (side < 0 ? .56 : .45) : (side < 0 ? 0 : .1);
      legs.push({ hip, knee, ankle, hy: pelvisPos[1], hz: pelvisPos[2], l1, l2, bend: front ? -1 : 1, phase, gallopPhase, front, side, footY: .09, footZ: pelvisPos[2] - .08, restZ: pelvisPos[2] - .08, stance: 0 });
    };
    // trot: diagonal pairs move together
    for (const side of [-1, 1]) {
      makeLeg(chest, [side * .27, -.06, .16], [side * .27, -.01, .56], true, side, side < 0 ? 0 : .5);
      makeLeg(pelvis, [side * .3, -.08, -.42], [side * .3, -.08, -.42], false, side, side < 0 ? .5 : 0);
    }

    return { pelvis, chest, neck, head, jaw, legs, arms: [], ears, tail: tailChain, braids: [], cloth: [], breath: ribs, target };
  }

  private buildHumanoid(root: THREE.Group, kind: 'bandit' | 'demon'): Rig {
    const demon = kind === 'demon';
    const hide = this.material('#26272b');
    const fur = this.material(demon ? '#522f32' : '#423a37', demon ? '#6b2022' : '#000000', demon ? .42 : .025);
    const accent = this.material(demon ? '#a14d3c' : '#756449', demon ? '#992f25' : '#000000', demon ? .4 : .025);
    const skin = this.material(demon ? '#782e2e' : '#a47e61', demon ? '#8c2824' : '#000000', demon ? .48 : .025);
    const eye = this.material(demon ? '#ff9b63' : '#ddbd76', demon ? '#ef3d2c' : '#8c552a', 1.3, .25);
    const gold = demon ? this.material('#d7b66d', '#74532b', .12, .42) : accent;
    const cloth = this.material(demon ? '#3b2230' : '#2e2a2d');
    const claw = this.material('#2b2427');
    const steel = this.material('#aab3b8', '#2a3034', .2, .3); (steel as THREE.MeshStandardMaterial).metalness = .6;
    const fill = new THREE.PointLight(demon ? '#d24e43' : '#b39164', demon ? .55 : .28, demon ? 4.8 : 3.2, 2); fill.position.set(0, 1.15, .15); root.add(fill);

    const pelvis = new THREE.Group(); pelvis.position.set(0, PELVIS_Y, 0); root.add(pelvis);
    const torso = new THREE.Group(); torso.position.set(0, .06, 0); pelvis.add(torso);
    const head = new THREE.Group(); head.position.set(0, .74, .02); torso.add(head);

    // ---- pelvis, belt, legs
    part(pelvis, this.sphere, demon ? skin : fur, [0, 0, 0], demon ? [.38, .22, .28] : [.36, .22, .26]);
    part(pelvis, this.cylinder, gold, [0, .1, 0], demon ? [3.3, .16, 2.6] : [3, .16, 2.3]);
    if (!demon) {
      part(pelvis, this.box, gold, [0, .1, .33], [.12, .1, .05]);
      for (const side of [-1, 1]) part(pelvis, this.box, hide, [side * .34, -.02, .06], [.14, .18, .12]);
    }
    const legs: Leg[] = [];
    for (const side of [-1, 1]) {
      const l1 = .48, l2 = .52, legMat = demon ? skin : fur;
      const hip = new THREE.Group(); hip.position.set(side * .2, -.04, 0); pelvis.add(hip);
      const knee = new THREE.Group(); knee.position.set(0, -l1, 0); hip.add(knee);
      const ankle = new THREE.Group(); ankle.position.set(0, -l2, 0); knee.add(ankle);
      this.limb(hip, legMat, [0, -.23, 0], demon ? .15 : .135, .62);
      this.limb(knee, legMat, [0, -.25, 0], demon ? .115 : .1, .6);
      part(knee, this.sphere, demon ? skin : accent, [0, 0, .06], [.11, .11, .09]);
      if (!demon) part(knee, this.cylinder, accent, [0, -.34, 0], [1.15, .22, 1.15]);
      part(ankle, this.box, hide, [0, -.05, .08], [.19, .13, .34]);
      part(ankle, this.sphere, hide, [0, -.05, .26], [.095, .065, .1]);
      legs.push({ hip, knee, ankle, hy: -.04, hz: 0, l1, l2, bend: 1, phase: side > 0 ? 0 : .5, gallopPhase: side > 0 ? 0 : .5, front: false, side, footY: demon ? .13 : .12, footZ: .04, restZ: .04, stance: 0 });
    }

    // ---- torso
    const chestMesh = this.limb(torso, demon ? skin : fur, [0, .02, 0], demon ? .44 : .38, 1.04); chestMesh.userData.base = chestMesh.scale.clone();
    part(torso, this.cylinder, skin, [0, .58, 0], [.9, .34, .9]);
    part(torso, this.sphere, demon ? fur : accent, [0, -.34, -.02], [.4, .2, .3]);

    const cloth0: Chain[] = [], braids: Chain[] = [];
    let tailChain: Chain | null = null;

    if (!demon) {
      part(torso, this.box, accent, [0, .12, .34], [.8, .1, .07], [0, 0, -.35]);
      part(torso, this.sphere, accent, [0, .55, .06], [.3, .1, .26]);
      for (const side of [-1, 1]) part(torso, this.sphere, hide, [side * .5, .42, 0], side > 0 ? [.24, .14, .22] : [.2, .12, .19]);
      // hood, mask, eyes
      part(head, this.sphere, skin, [0, .02, 0], [.32, .36, .3]);
      part(head, this.sphere, fur, [0, .09, -.07], [.37, .39, .35]);
      part(head, this.cone, fur, [0, .26, -.12], [1.9, .9, 1.6], [-.5, 0, 0]);
      part(head, this.box, hide, [0, -.11, .27], [.5, .2, .07]);
      for (const side of [-1, 1]) this.eyePart(head, eye, [side * .12, .07, .285], [.045, .035, .028]);
      // cloak: three swaying plates
      const cloak = new THREE.Group(); cloak.position.set(0, .5, -.32); torso.add(cloak);
      part(cloak, this.box, cloth, [0, -.2, 0], [.78, .42, .05]);
      const c1 = new THREE.Group(); c1.position.set(0, -.4, 0); cloak.add(c1); part(c1, this.box, cloth, [0, -.2, 0], [.72, .4, .05]);
      const c2 = new THREE.Group(); c2.position.set(0, -.4, 0); c1.add(c2); part(c2, this.box, cloth, [0, -.2, 0], [.62, .4, .05]);
      part(c2, this.cone, cloth, [0, -.43, 0], [1.2, .35, .15], [Math.PI, 0, 0]);
      cloth0.push(makeChain([cloak, c1, c2], [.1, .05, .05], { k: 45, c: 6, gainF: .08, gainS: -.05, wave: .03 }));
    } else {
      // ornaments, plate, glowing core, spikes
      part(torso, this.box, accent, [0, .08, .4], [.5, .56, .1]);
      part(torso, this.box, gold, [0, .09, .46], [.045, .54, .025]);
      this.eyePart(torso, eye, [0, .4, .38], [.08, .09, .06]);
      for (const z of [.28, .02, -.24]) part(torso, this.cone, hide, [0, z + .1, -.45], [.9, 1.6, .9], [-1.1, 0, 0]);
      for (const side of [-1, 1]) {
        part(torso, this.sphere, gold, [side * .4, .4, .05], [.1, .1, .08]);
        part(torso, this.cone, gold, [side * .46, .3, .07], [.28, .18, .22], [0, 0, side * .3]);
        part(torso, this.cone, hide, [side * .66, .52, 0], [.8, 1.3, .8], [0, 0, -side * 1.2]);
      }
      // skull, hair, horns, face
      part(head, this.sphere, skin, [0, .02, 0], [.34, .4, .3]);
      const hair = this.material('#ad4c91', '#612553', .16, .6), hairLight = this.material('#d76cb0', '#8b3975', .1, .54);
      const horn = this.material('#ded0ca', '#4b3037', .12, .34);
      part(head, this.sphere, hair, [0, .17, -.1], [.39, .39, .36]);
      part(head, this.sphere, hair, [0, -.12, -.22], [.36, .56, .23]);
      for (const side of [-1, 1]) {
        const braid = new THREE.Group(); braid.position.set(side * .27, .08, -.03); head.add(braid);
        const segs: THREE.Group[] = [braid];
        for (let i = 0; i < 3; i++) {
          const seg = i === 0 ? braid : new THREE.Group();
          if (i > 0) { seg.position.set(0, -.27, 0); segs[i - 1].add(seg); segs.push(seg); }
          part(seg, this.sphere, hair, [side * .02, -.07, -.04], [.13 - i * .01, .16, .14]);
          part(seg, this.sphere, hairLight, [side * .02, -.19, -.02], [.12 - i * .01, .14, .13]);
        }
        braids.push(makeChain(segs, [.1, .05, .05], { k: 38, c: 4.5, gainF: .07, gainS: -.05, wave: .05 }));
        this.eyePart(head, eye, [side * .14, .04, .265], [.045, .042, .03]);
        part(head, this.sphere, hide, [side * .14, .04, .282], [.064, .052, .025]);
        part(head, this.sphere, eye, [side * .14, .04, .3], [.029, .03, .02]).userData.eye = true;
        part(head, this.box, hide, [side * .14, .115, .27], [.13, .028, .03], [0, 0, side * .38]);
        part(head, this.cone, horn, [side * .05, -.13, .28], [.18, .2, .18], [Math.PI, 0, 0]);
        const hornCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * .23, .29, -.03), new THREE.Vector3(side * .34, .54, -.06),
          new THREE.Vector3(side * .37, .79, -.12), new THREE.Vector3(side * .29, .98, -.2),
        ]);
        part(head, this.geometry(new THREE.TubeGeometry(hornCurve, 12, .075, 8, false)), horn, [0, 0, 0]);
      }
      part(head, this.box, hide, [0, -.1, .28], [.16, .03, .03]);
      // skirt: six panels with individual spring physics
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU;
        const panel = new THREE.Group(); panel.rotation.order = 'YXZ'; panel.rotation.y = a;
        panel.position.set(Math.sin(a) * .22, .0, Math.cos(a) * .2); pelvis.add(panel);
        part(panel, this.taper, fur, [0, -.28, 0], [.28, .58, .06]);
        part(panel, this.box, gold, [0, -.57, 0], [.5, .04, .07]);
        cloth0.push(makeChain([panel], [-.14], { k: 40, c: 5, gainF: .09, gainS: 0, wave: .02, angle: a }));
      }
      // tail with a golden spade tip
      const tail = new THREE.Group(); tail.position.set(0, -.02, -.2); pelvis.add(tail);
      const tsegs: THREE.Group[] = [tail];
      for (let i = 0; i < 5; i++) {
        const seg = i === 0 ? tail : new THREE.Group();
        if (i > 0) { seg.position.set(0, 0, -.22); tsegs[i - 1].add(seg); tsegs.push(seg); }
        part(seg, this.sphere, skin, [0, 0, -.11], [.12 - i * .012, .12 - i * .012, .15]);
        if (i === 4) part(seg, this.cone, gold, [0, 0, -.28], [.4, .5, .4], [-Math.PI / 2, 0, 0]);
      }
      tailChain = makeChain(tsegs, [.35, -.12, -.12, -.1, 0], { k: 30, c: 4, gainF: .05, gainS: .03, wave: .12, lat: 'y' });
    }

    // ---- arms (index 0 = left, 1 = right / weapon side)
    const arms: Arm[] = [];
    for (const side of [-1, 1]) {
      const shoulder = new THREE.Group(); shoulder.position.set(side * (demon ? .52 : .46), .36, 0); torso.add(shoulder);
      const elbow = new THREE.Group(); elbow.position.set(0, -.32, 0); shoulder.add(elbow);
      const wrist = new THREE.Group(); wrist.position.set(0, -.34, 0); elbow.add(wrist);
      part(shoulder, this.sphere, demon ? skin : fur, [0, 0, 0], [.15, .15, .15]);
      this.limb(shoulder, demon ? skin : fur, [0, -.16, 0], demon ? .125 : .105, .42);
      this.limb(elbow, demon ? skin : skin, [0, -.17, 0], demon ? .105 : .09, .42);
      part(elbow, this.cylinder, demon ? gold : accent, [0, -.2, 0], demon ? [1.0, .22, 1.0] : [.95, .26, .95]);
      part(wrist, this.sphere, skin, [0, -.05, .02], [.09, .09, .09]);
      if (demon) {
        for (const i of [-1, 0, 1]) part(wrist, this.cone, claw, [i * .06, -.15, .06], [.16, .55, .16], [Math.PI - .35, 0, i * .1]);
      } else if (side > 0) {
        part(wrist, this.box, hide, [0, -.03, 0], [.05, .2, .05]);
        part(wrist, this.sphere, gold, [0, .08, 0], [.035, .035, .035]);
        part(wrist, this.box, gold, [0, -.14, 0], [.2, .035, .06]);
        const blade = part(wrist, this.box, steel, [0, -.55, 0], [.075, .8, .022]); blade.name = 'bandit-blade';
        part(wrist, this.box, this.material('#e5ecef'), [0, -.55, .012], [.02, .78, .008]);
        part(wrist, this.cone, steel, [0, -.99, 0], [.22, .18, .07], [Math.PI, 0, 0]);
      } else {
        part(wrist, this.box, hide, [0, -.1, .02], [.04, .16, .035]);
      }
      arms.push({ shoulder, elbow, wrist, side, legPhase: side > 0 ? 0 : .5, weapon: !demon && side > 0 });
    }

    const target = part(head, this.sphere, this.targetMaterial, [0, .02, .19], [.35, .48, .34]); target.name = `${kind}-target`;
    return { pelvis, chest: torso, neck: null, head, jaw: null, legs, arms, ears: [], tail: tailChain, braids, cloth: cloth0, breath: chestMesh, target };
  }

  /* ------------------------------------------------------------------ *
   *  Death, drops, respawn, effects
   * ------------------------------------------------------------------ */
  private defeat(mob: Mob) {
    if (mob.held) { mob.held = null; mob.root.rotation.order = 'XYZ'; mob.root.rotation.z = 0; }
    this.onSfx('enemyDie');
    this.onKill(mob.kind);
    mob.root.visible = true;
    // tomba para longe do golpe (de lado, para o lobo); golpe de frente/de trás sorteia o lado
    mob.deathAge = 0; mob.deathSide = Math.abs(mob.hitX) > .25 ? -Math.sign(mob.hitX) : Math.random() < .5 ? 1 : -1;
    mob.attack = null; mob.attackAge = 0; mob.stagger = 0;
    mob.respawnTimer = 12 + Math.random() * 8;
    const stats = MOB_STATS[mob.kind];
    this.tmpA.set(mob.root.position.x, mob.root.position.y + .4, mob.root.position.z);
    this.particles.emit(this.tmpA, '#b9a98a', 14, 2.2, 1.4, .8, 1.5);
    this.spawnDrop('experience', mob.root.position, stats.xp);
    const roll = Math.random();
    const loot: LootItemId | undefined = mob.kind === 'wolf'
      ? roll < .045 ? 'moonFang' : roll < .32 ? 'wolfPelt' : undefined
      : mob.kind === 'bandit'
        ? roll < .055 ? 'ancientSigil' : roll < .36 ? 'banditToken' : undefined
        : roll < .1 ? 'demonHeart' : roll < .42 ? 'demonAsh' : undefined;
    if (loot) this.spawnDrop(loot, mob.root.position, 1);
  }

  private shock(position: THREE.Vector3, color: string, size: number) {
    const ring = this.rings[this.ringCursor++ % this.rings.length];
    ring.age = 0; ring.life = .55; ring.size = size; ring.mesh.visible = true;
    ring.material.color.set(color);
    ring.mesh.position.set(position.x, terrainHeight(position.x, position.z) + .08, position.z);
    ring.mesh.scale.setScalar(.3);
  }

  private spawnDrop(kind: Drop['kind'], position: THREE.Vector3, value: number) {
    const root = new THREE.Group(); root.position.copy(position); this.dropRoot.add(root);
    const temporaryMaterials: THREE.Material[] = [];
    const material = kind === 'experience' ? this.xpMaterial : this.material(LOOT[kind].color, LOOT[kind].color, .45, .32);
    if (kind !== 'experience') temporaryMaterials.push(material);
    const gem = new THREE.Mesh(this.gemGeometry, material);
    if (kind !== 'experience') gem.scale.setScalar(.84);
    gem.castShadow = false; root.add(gem);
    const ringMat = new THREE.MeshBasicMaterial({ color: kind === 'experience' ? '#b9dcc2' : LOOT[kind].color, transparent: true, opacity: .62 });
    this.materials.push(ringMat);
    temporaryMaterials.push(ringMat);
    const ring = new THREE.Mesh(this.ringGeometry, ringMat); ring.rotation.x = Math.PI / 2; root.add(ring);
    this.drops.push({ root, kind, age: Math.random() * 4, value, materials: temporaryMaterials, color: kind === 'experience' ? '#93c5a2' : LOOT[kind].color });
  }

  private removeDrop(drop: Drop, index: number) {
    drop.root.removeFromParent();
    drop.materials.forEach(material => { material.dispose(); this.materials.splice(this.materials.indexOf(material), 1); });
    this.drops.splice(index, 1);
  }

  private respawn(mob: Mob, elapsed: number) {
    const choices = SPAWNS.map((spawn, index) => ({ spawn, index })).filter(entry => entry.spawn.kind === mob.kind);
    const next = choices[(Math.floor(elapsed / 6) + mob.spawn + 1) % choices.length];
    mob.spawn = next.index;
    mob.root.position.set(next.spawn.x, terrainHeight(next.spawn.x, next.spawn.z), next.spawn.z);
    mob.root.rotation.set(0, 0, 0); mob.root.scale.setScalar(1); mob.root.visible = true;
    mob.health = MOB_STATS[mob.kind].hp;
    mob.home.set(next.spawn.x, 0, next.spawn.z); mob.prev.set(next.spawn.x, next.spawn.z); mob.vel.set(0, 0);
    mob.attack = null; mob.attackAge = 0; mob.attackHit = false; mob.lungeU = 0; mob.air = 0;
    mob.speed = 0; mob.alert = 0; mob.guard = 0; mob.aggro = false; mob.look = 0; mob.slope = 0;
    mob.stagger = 0; mob.deathAge = 0; mob.hitFlash = 0; mob.flashing = false;
    mob.knockback.set(0, 0, 0);
    mob.attackTimer = 1.2 + Math.random() * 1.4; mob.respawnTimer = 0;
    for (const e of mob.mats) e.m.emissiveIntensity = e.base;
    if (mob.arc) mob.arc.pivot.visible = false;
    for (const chain of [...mob.rig.cloth, ...mob.rig.braids, ...(mob.rig.tail ? [mob.rig.tail] : [])]) {
      chain.x = chain.restX.slice(); chain.z.fill(0); chain.vx.fill(0); chain.vz.fill(0);
    }
  }
}