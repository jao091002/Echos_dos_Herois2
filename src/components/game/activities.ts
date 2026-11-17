import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { terrainHeight, pondDist, streamDist, seeded, type WorldCollider } from './world';
import type { LootItemId } from './progression';

/* ============================================================================
 *  ATIVIDADES DO MUNDO — o que mantém o vale vivo fora do modo história
 *
 *  - 5 LOCAIS novos no mapa (clareiras reservadas em world.ts): descobrir cada um rende XP ("Cartógrafo").
 *  - 12 ECOS PERDIDOS: cristais com um feixe azul visível de longe; encostar coleta.
 *  - 6 BAÚS escondidos: abrem ao chegar perto e entregam XP + um item.
 *  - EVENTOS cronometrados que se revezam o tempo todo: Estrela Cadente (corra até o feixe), Trilha de Luz
 *    (atravesse os anéis), Caçada Relâmpago (abates contra o relógio) e Fenda de Ecos (segure o círculo).
 *
 *  Regra de todas as missões daqui: ao concluir, a recompensa entra NA HORA (onReward) e a linha some do
 *  rastreador (view). Evento que expira só some.
 *
 *  Desempenho: sem luzes (a contagem de PointLights do jogo não muda), tudo criado uma vez no início e
 *  compilado junto com o resto da cena. Os locais são 2 draws (sólidos + brilhos), os ecos são 2 InstancedMesh
 *  e os objetos dos eventos ficam estacionados abaixo do mapa quando não há evento.
 * ========================================================================== */

export type LandmarkId = 'circulo' | 'poco' | 'arvore' | 'portal' | 'mirante';
/** Locais novos do mapa. As clareiras correspondentes ficam em CLEARINGS (world.ts): mantenha as posições iguais. */
export const LANDMARKS: Record<LandmarkId, { name: string; x: number; z: number; r: number }> = {
  circulo: { name: 'Círculo das Pedras', x: 34, z: 30, r: 9 },
  poco: { name: 'Poço dos Sussurros', x: -30, z: -8, r: 7 },
  arvore: { name: 'Árvore Anciã', x: -40, z: 46, r: 10 },
  portal: { name: 'Portal Arruinado', x: 52, z: -6, r: 8 },
  mirante: { name: 'Obelisco do Norte', x: 10, z: -72, r: 8 },
};
const ECHOES: [number, number][] = [[8, 15], [27, 11], [-11, 5], [-35, 25], [-17, -31], [15, -25], [31, -31], [49, -28], [-6, -63], [25, -58], [41, 17], [-17, 39]];
const CHESTS: [number, number][] = [[25, -6], [-13, 25], [-15, -25], [-24, -50], [47, -51], [58, 24]];
const CHEST_ITEMS: LootItemId[] = ['wolfPelt', 'banditToken', 'wolfPelt', 'banditToken', 'demonAsh', 'moonFang'];

export type ActivitySave = { echoes: number[]; chests: number[]; places: string[] };
/** Linha do rastreador. timed = tem contagem regressiva (ver timeLeft). */
export type ActivityView = { id: string; kicker: string; title: string; text: string; cur: number; max: number; timed: boolean }[];
export type ActivityReward = { xp: number; items: LootItemId[]; message: string; big: boolean };

type EventKind = 'estrela' | 'trilha' | 'cacada' | 'fenda';
type WorldEvent = { kind: EventKind; t: number; x: number; z: number; cur: number; max: number; age: number; hold: number; started: boolean; ring: [number, number][] };
const EVENT_INFO: Record<EventKind, { title: string; text: string; xp: number; item: LootItemId; chance: number }> = {
  estrela: { title: 'Estrela Cadente', text: 'Uma estrela caiu no vale. Chegue ao feixe dourado antes que ela se apague.', xp: 110, item: 'moonFang', chance: .3 },
  trilha: { title: 'Trilha de Luz', text: 'Atravesse os anéis de luz em sequência antes do tempo acabar.', xp: 140, item: 'wolfPelt', chance: .4 },
  cacada: { title: 'Caçada Relâmpago', text: 'Derrote 3 inimigos antes do tempo acabar.', xp: 170, item: 'banditToken', chance: .6 },
  fenda: { title: 'Fenda de Ecos', text: 'Fique dentro do círculo violeta até selar a fenda.', xp: 150, item: 'demonAsh', chance: .35 },
};
const FENDA_R = 5, FENDA_SECS = 10, RINGS = 8, PARK_Y = -500;

type V3 = [number, number, number];
type Xf = { p?: V3; r?: V3; s?: V3 | number };
const matrixOf = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1 }: Xf) => new THREE.Matrix4().compose(new THREE.Vector3(...p), new THREE.Quaternion().setFromEuler(new THREE.Euler(...r)), typeof s === 'number' ? new THREE.Vector3(s, s, s) : new THREE.Vector3(...s));
/** Geometria pronta para mesclar: não indexada, só position/normal/color, cor por face (jitter) ou sumindo no topo (fade). */
function colored(geo: THREE.BufferGeometry, color: string, xf: Xf, o: { jitter?: number; fade?: boolean; salt?: number } = {}) {
  const g = geo.index ? geo.toNonIndexed() : geo; if (g !== geo) geo.dispose();
  for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k);
  g.computeBoundingBox();
  const p = g.attributes.position as THREE.BufferAttribute, y0 = g.boundingBox!.min.y, span = Math.max(.001, g.boundingBox!.max.y - y0);
  const base = new THREE.Color(color), col = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    let k = 1;
    if (o.fade) k = Math.pow(1 - (p.getY(i) - y0) / span, 1.6);
    else if (o.jitter) k = 1 - o.jitter / 2 + o.jitter * seeded(Math.floor(i / 3) * 1.37 + (o.salt ?? 0));
    col[i * 3] = base.r * k; col[i * 3 + 1] = base.g * k; col[i * 3 + 2] = base.b * k;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g.applyMatrix4(matrixOf(xf));
}
const merged = (list: THREE.BufferGeometry[]) => { const out = mergeGeometries(list)!; list.forEach(g => g.dispose()); return out; };
const additive = (opacity = 1, color = '#ffffff') => new THREE.MeshBasicMaterial({ color, vertexColors: true, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false, side: THREE.DoubleSide });
const beamGeo = (r: number, h: number, color: string) => colored(new THREE.CylinderGeometry(r * .5, r, h, 8, 1, true), color, { p: [0, h / 2, 0] }, { fade: true });

const STONE = '#8f8b80', DARK = '#6d6a63', WOOD = '#6b4a2e', BARK = '#55412f', ROOF = '#7c3d2b', LEAF = '#3f8f7a', GOLD = '#d8b45a';
const CYAN = '#6fd8ff', VIOLET = '#9a6cff', SUN = '#ffd98a';

export class WorldActivities {
  /** Recompensa entregue (o jogo soma XP/itens e mostra o aviso). */
  onReward: (r: ActivityReward) => void = () => {};
  /** A lista do rastreador mudou. */
  onChange: () => void = () => {};
  /** Aviso sem recompensa (evento começou/expirou). */
  onNotice: (message: string) => void = () => {};
  /** Multiplicador de XP pelo nível do jogador (o jogo atualiza). */
  xpScale = 1;

  private echoGot = new Set<number>();
  private chestGot = new Set<number>();
  private placeGot = new Set<LandmarkId>();
  private readonly echoPos: [number, number, number][];
  private readonly chestPos: [number, number, number][];
  private readonly crystals: THREE.InstancedMesh;
  private readonly beams: THREE.InstancedMesh;
  private readonly chests: { root: THREE.Group; lid: THREE.Object3D; beam: THREE.Mesh; open: number }[] = [];
  private readonly beacon = new THREE.Group();
  private readonly beaconMat: THREE.MeshBasicMaterial;
  private readonly beaconBeam: THREE.Mesh; private readonly beaconRing: THREE.Mesh; private readonly beaconCore: THREE.Mesh; private readonly beaconFill: THREE.Mesh;
  private readonly rings: THREE.InstancedMesh;
  private event: WorldEvent | null = null;
  private nextEvent = 25;
  private cycle = Math.floor(Math.random() * 4);
  private readonly tmpM = new THREE.Matrix4(); private readonly tmpQ = new THREE.Quaternion(); private readonly tmpE = new THREE.Euler();
  private readonly tmpP = new THREE.Vector3(); private readonly tmpS = new THREE.Vector3();

  constructor(scene: THREE.Scene, private readonly colliders: WorldCollider[]) {
    const root = new THREE.Group(); root.name = 'atividades'; scene.add(root);
    const solidMat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .92, metalness: .02 });
    const glowMat = additive(.85);

    /* ---------------- locais novos: tudo mesclado em 2 geometrias ---------------- */
    const solids: THREE.BufferGeometry[] = [], glows: THREE.BufferGeometry[] = [];
    let local: THREE.BufferGeometry[] = [], localGlow: THREE.BufferGeometry[] = [], salt = 0;
    const S = (geo: THREE.BufferGeometry, color: string, xf: Xf, jitter = .22) => local.push(colored(geo, color, xf, { jitter, salt: salt += 7.1 }));
    const G = (geo: THREE.BufferGeometry, color: string, xf: Xf, fade = false) => localGlow.push(colored(geo, color, xf, { fade }));
    /** Fecha o local em construção: gira, assenta no terreno e registra os colisores (em coordenadas locais). */
    const place = (id: LandmarkId, rotY: number, cols: [number, number, number][]) => {
      const { x, z } = LANDMARKS[id], m = matrixOf({ p: [x, terrainHeight(x, z), z], r: [0, rotY, 0] });
      local.forEach(g => solids.push(g.applyMatrix4(m))); localGlow.forEach(g => glows.push(g.applyMatrix4(m)));
      const c = Math.cos(rotY), s = Math.sin(rotY);
      for (const [lx, lz, r] of cols) this.colliders.push({ x: x + lx * c + lz * s, z: z - lx * s + lz * c, radius: r });
      local = []; localGlow = [];
    };
    const H = Math.PI / 2;

    // Círculo das Pedras: menires, dois lintéis, altar e anéis de runa
    const stones: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2, h = 2.5 + seeded(i * 3.3) * 1.3, x = Math.cos(a) * 5, z = Math.sin(a) * 5;
      S(new THREE.BoxGeometry(1.15, h, .72), i % 3 ? STONE : DARK, { p: [x, h / 2 - .15, z], r: [(seeded(i) - .5) * .12, -a + H, (seeded(i + 9) - .5) * .12] });
      stones.push([x, z, .8]);
    }
    for (const i of [0, 4]) { const a = (i + .5) / 8 * Math.PI * 2; S(new THREE.BoxGeometry(4.3, .5, .85), STONE, { p: [Math.cos(a) * 4.62, 3.05, Math.sin(a) * 4.62], r: [0, -a + H, 0] }); }
    S(new THREE.CylinderGeometry(1.2, 1.45, .6, 8), DARK, { p: [0, .3, 0] });
    G(new THREE.TorusGeometry(2.5, .06, 4, 40), CYAN, { p: [0, .1, 0], r: [H, 0, 0] });
    G(new THREE.TorusGeometry(3.6, .04, 4, 48), CYAN, { p: [0, .1, 0], r: [H, 0, 0] });
    G(new THREE.CircleGeometry(.95, 8), '#2b6f8a', { p: [0, .62, 0], r: [-H, 0, 0] });
    G(new THREE.CylinderGeometry(.3, .7, 9, 8, 1, true), '#2f7fa0', { p: [0, 5.1, 0] }, true);
    place('circulo', .3, [...stones, [0, 0, 1.45]]);

    // Poço dos Sussurros: mureta, água luminosa, cobertura de madeira e balde
    S(new THREE.CylinderGeometry(1.3, 1.42, 1, 10), STONE, { p: [0, .5, 0] });
    S(new THREE.TorusGeometry(1.3, .14, 4, 10), DARK, { p: [0, 1, 0], r: [H, 0, 0] });
    for (const s of [-1, 1]) S(new THREE.BoxGeometry(.17, 2.5, .17), WOOD, { p: [s * 1.18, 1.25, 0] });
    S(new THREE.BoxGeometry(2.7, .13, .13), WOOD, { p: [0, 2.35, 0] });
    S(new THREE.ConeGeometry(2, 1.15, 4), ROOF, { p: [0, 3.05, 0], r: [0, Math.PI / 4, 0] });
    S(new THREE.CylinderGeometry(.2, .16, .32, 6), WOOD, { p: [.25, 1.55, 0] });
    for (let i = 0; i < 5; i++) { const a = i * 1.3 + .4; S(new THREE.BoxGeometry(.5, .28, .42), DARK, { p: [Math.cos(a) * 2.4, .1, Math.sin(a) * 2.4], r: [0, a, 0] }); }
    G(new THREE.CircleGeometry(1.08, 10), '#2b7f9a', { p: [0, 1.03, 0], r: [-H, 0, 0] });
    G(new THREE.CylinderGeometry(.2, .5, 5, 6, 1, true), '#1f5f78', { p: [0, 3.5, 0] }, true);
    place('poco', -.5, [[0, 0, 1.55]]);

    // Árvore Anciã: tronco gigante, raízes, copa em camadas e frutos de luz
    S(new THREE.CylinderGeometry(.95, 1.75, 9, 8), BARK, { p: [0, 4.5, 0] });
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + .3; S(new THREE.ConeGeometry(.62, 3.4, 5), BARK, { p: [Math.cos(a) * 2.2, .35, Math.sin(a) * 2.2], r: [0, -a, -1.25] }); }
    for (let i = 0; i < 3; i++) { const a = i * 2.1 + .8; S(new THREE.CylinderGeometry(.22, .4, 4.6, 5), BARK, { p: [Math.cos(a) * 1.9, 8.4, Math.sin(a) * 1.9], r: [0, -a, -.95] }); }
    for (const [x, y, z, r] of [[0, 11.6, 0, 4.4], [3.3, 10, 1.2, 3.3], [-3, 10.3, 1.8, 3.4], [-1, 9.8, -3.4, 3.2], [2.2, 12.8, -1.8, 2.8], [-2, 13.2, .6, 2.7]] as const)
      S(new THREE.IcosahedronGeometry(r, 0), LEAF, { p: [x, y, z], s: [1, .78, 1] }, .3);
    for (let i = 0; i < 9; i++) { const a = i * 2.4, r = 2.6 + seeded(i * 5.1) * 2.2; G(new THREE.OctahedronGeometry(.2), SUN, { p: [Math.cos(a) * r, 6.2 + seeded(i * 2.2) * 1.8, Math.sin(a) * r], s: [1, 1.5, 1] }); }
    G(new THREE.TorusGeometry(3.1, .05, 4, 40), '#4fbf9a', { p: [0, .12, 0], r: [H, 0, 0] });
    place('arvore', 0, [[0, 0, 1.95]]);

    // Portal Arruinado: dois pilares, arco partido, entulho e o véu violeta que restou
    for (const s of [-1, 1]) { S(new THREE.BoxGeometry(1.05, 5.2, 1.05), STONE, { p: [s * 2.15, 2.6, 0] }); S(new THREE.BoxGeometry(1.4, .4, 1.4), DARK, { p: [s * 2.15, .2, 0] }); S(new THREE.BoxGeometry(1.3, .35, 1.3), DARK, { p: [s * 2.15, 5.3, 0] }); }
    S(new THREE.TorusGeometry(2.15, .42, 5, 10, Math.PI * .72), STONE, { p: [0, 5.4, 0], r: [0, 0, Math.PI * .28] });
    for (const [x, z, s] of [[1.2, 1.6, .7], [-.4, 2.1, .5], [.3, -1.8, .6]] as const) S(new THREE.DodecahedronGeometry(s, 0), DARK, { p: [x, s * .5, z] });
    G(new THREE.CircleGeometry(1.75, 24), '#2a1d5c', { p: [0, 2.9, 0] });
    G(new THREE.TorusGeometry(1.78, .05, 4, 32), VIOLET, { p: [0, 2.9, 0] });
    G(new THREE.TorusGeometry(1.1, .03, 4, 24), VIOLET, { p: [0, 2.9, 0] });
    place('portal', -1.1, [[-2.15, 0, .85], [2.15, 0, .85]]);

    // Obelisco do Norte: farol de pedra com um feixe dourado que se vê de longe
    S(new THREE.CylinderGeometry(2.3, 2.6, .5, 8), DARK, { p: [0, .25, 0] });
    S(new THREE.CylinderGeometry(.55, 1, 7, 4), STONE, { p: [0, 4, 0], r: [0, Math.PI / 4, 0] });
    S(new THREE.ConeGeometry(.62, 1.1, 4), GOLD, { p: [0, 8.05, 0], r: [0, Math.PI / 4, 0] }, .1);
    const ringStones: [number, number, number][] = [];
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; S(new THREE.BoxGeometry(.6, .95, .6), STONE, { p: [Math.cos(a) * 4.2, .4, Math.sin(a) * 4.2], r: [0, a, 0] }); ringStones.push([Math.cos(a) * 4.2, Math.sin(a) * 4.2, .5]); }
    G(new THREE.OctahedronGeometry(.42), SUN, { p: [0, 9.2, 0], s: [1, 1.5, 1] });
    G(new THREE.CylinderGeometry(.2, .45, 42, 8, 1, true), '#8a6a2a', { p: [0, 30, 0] }, true);
    G(new THREE.TorusGeometry(4.2, .04, 4, 48), SUN, { p: [0, .1, 0], r: [H, 0, 0] });
    place('mirante', .2, [[0, 0, 1.35], ...ringStones]);

    const solidMesh = new THREE.Mesh(merged(solids), solidMat); solidMesh.castShadow = solidMesh.receiveShadow = true; root.add(solidMesh);
    root.add(new THREE.Mesh(merged(glows), glowMat));

    /* ---------------- ecos perdidos e baús ---------------- */
    this.echoPos = ECHOES.map(([x, z]) => { const [fx, fz] = this.free(x, z, 1); return [fx, terrainHeight(fx, fz) + 1.15, fz]; });
    this.crystals = new THREE.InstancedMesh(colored(new THREE.OctahedronGeometry(.3), '#bff0ff', { s: [1, 1.6, 1] }), additive(.95), ECHOES.length);
    this.beams = new THREE.InstancedMesh(beamGeo(.28, 16, '#2f8fb8'), additive(.7), ECHOES.length);
    for (const m of [this.crystals, this.beams]) { m.frustumCulled = false; root.add(m); }
    this.echoPos.forEach((_, i) => this.setEcho(i, 0));

    const chestBase = merged([colored(new THREE.BoxGeometry(1, .58, .68), WOOD, { p: [0, .29, 0] }, { jitter: .2 }), ...[-.36, .36].map(x => colored(new THREE.BoxGeometry(.1, .6, .71), GOLD, { p: [x, .29, 0] })), colored(new THREE.BoxGeometry(.16, .2, .06), GOLD, { p: [0, .46, .36] })]);
    const chestLid = merged([colored(new THREE.BoxGeometry(1.04, .24, .72), WOOD, { p: [0, .12, .36] }, { jitter: .2, salt: 3 }), ...[-.36, .36].map(x => colored(new THREE.BoxGeometry(.1, .26, .75), GOLD, { p: [x, .12, .36] }))]);
    const chestBeam = beamGeo(.45, 5, '#8a6a2a');
    this.chestPos = CHESTS.map(([x, z]) => { const [fx, fz] = this.free(x, z, 1.2); return [fx, terrainHeight(fx, fz), fz]; });
    this.chestPos.forEach(([x, y, z], i) => {
      const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = seeded(i * 4.7) * Math.PI * 2;
      const base = new THREE.Mesh(chestBase, solidMat), lid = new THREE.Mesh(chestLid, solidMat), beam = new THREE.Mesh(chestBeam, glowMat);
      base.castShadow = lid.castShadow = true; lid.position.set(0, .58, -.36);
      g.add(base, lid, beam); root.add(g); this.chests.push({ root: g, lid, beam, open: 0 });
      this.colliders.push({ x, z, radius: .55 });
    });

    /* ---------------- objetos dos eventos (estacionados até um evento começar) ---------------- */
    this.beaconMat = additive(.9);
    this.beaconBeam = new THREE.Mesh(beamGeo(.7, 55, '#ffffff'), this.beaconMat);
    this.beaconRing = new THREE.Mesh(colored(new THREE.TorusGeometry(1, .04, 4, 56), '#ffffff', { r: [H, 0, 0] }), this.beaconMat);
    this.beaconCore = new THREE.Mesh(colored(new THREE.IcosahedronGeometry(.55, 0), '#ffffff', {}), this.beaconMat);
    this.beaconFill = new THREE.Mesh(colored(new THREE.CircleGeometry(1, 40), '#55409a', { r: [-H, 0, 0] }), this.beaconMat);
    this.beacon.add(this.beaconBeam, this.beaconRing, this.beaconCore, this.beaconFill); this.beacon.position.y = PARK_Y; root.add(this.beacon);
    this.rings = new THREE.InstancedMesh(colored(new THREE.TorusGeometry(1.5, .09, 5, 28), CYAN, {}), additive(.9), RINGS);
    this.rings.frustumCulled = false; root.add(this.rings);
    this.hideRings();
  }

  /** Afasta (x, z) de árvores/pedras para o objeto não nascer dentro de um colisor. */
  private free(x: number, z: number, pad: number): [number, number] {
    for (let k = 0; k < 4; k++) for (const c of this.colliders) {
      const d = Math.hypot(x - c.x, z - c.z), min = c.radius + pad;
      if (d < min) { const a = d > .01 ? Math.atan2(z - c.z, x - c.x) : 1; x = c.x + Math.cos(a) * min; z = c.z + Math.sin(a) * min; }
    }
    return [x, z];
  }
  private setEcho(i: number, time: number) {
    const [x, y, z] = this.echoPos[i], got = this.echoGot.has(i);
    this.tmpS.setScalar(got ? 0 : 1);
    this.tmpM.compose(this.tmpP.set(x, y + Math.sin(time * 1.6 + i) * .18, z), this.tmpQ.setFromEuler(this.tmpE.set(0, time * 1.2 + i, 0)), this.tmpS);
    this.crystals.setMatrixAt(i, this.tmpM);
    this.tmpM.compose(this.tmpP.set(x, y - 1.1, z), this.tmpQ.identity(), this.tmpS);
    this.beams.setMatrixAt(i, this.tmpM);
  }
  private hideRings() {
    this.tmpM.makeScale(0, 0, 0).setPosition(0, PARK_Y, 0);
    for (let i = 0; i < RINGS; i++) this.rings.setMatrixAt(i, this.tmpM);
    this.rings.instanceMatrix.needsUpdate = true;
  }
  private reward(xp: number, items: LootItemId[], message: string, big = false) {
    const v = Math.round(xp * this.xpScale);
    this.onReward({ xp: v, items, message: `${message} · +${v} XP`, big });
  }

  /* ---------------- eventos ---------------- */
  private spot(px: number, pz: number, min: number, max: number): [number, number] {
    for (let k = 0; k < 16; k++) {
      const a = Math.random() * Math.PI * 2, d = min + Math.random() * (max - min), x = px + Math.cos(a) * d, z = pz + Math.sin(a) * d;
      if (Math.hypot(x, z) < 84 && pondDist(x, z) > 13 && streamDist(x, z) > 5) return this.free(x, z, 1.5);
    }
    return this.free(px * .5, pz * .5 - 10, 1.5);
  }
  private startEvent(px: number, pz: number) {
    const kind = (['estrela', 'cacada', 'trilha', 'fenda'] as EventKind[])[this.cycle++ % 4];
    const ev: WorldEvent = { kind, t: 60, x: 0, z: 0, cur: 0, max: 1, age: 0, hold: 0, started: false, ring: [] };
    if (kind === 'estrela') { [ev.x, ev.z] = this.spot(px, pz, 30, 50); ev.t = 55; }
    else if (kind === 'fenda') { [ev.x, ev.z] = this.spot(px, pz, 22, 38); ev.t = 75; ev.max = FENDA_SECS; }
    else if (kind === 'cacada') { ev.t = 85; ev.max = 3; }
    else {
      // trilha: anéis a cada 8 m, com a direção serpenteando; tenta de novo se cair no lago, no riacho ou fora do mapa
      for (let attempt = 0; attempt < 12 && ev.ring.length < RINGS; attempt++) {
        let a = Math.random() * Math.PI * 2, x = px + Math.cos(a) * 9, z = pz + Math.sin(a) * 9; ev.ring = [];
        for (let i = 0; i < RINGS; i++) {
          if (Math.hypot(x, z) > 84 || pondDist(x, z) < 12 || streamDist(x, z) < 4) break;
          ev.ring.push(this.free(x, z, 1.6));
          a += (Math.random() - .5) * 1.1; x += Math.cos(a) * 8; z += Math.sin(a) * 8;
        }
      }
      if (ev.ring.length < RINGS) { this.nextEvent = 5; return; }
      [ev.x, ev.z] = ev.ring[0]; ev.t = 40; ev.max = RINGS;
    }
    this.event = ev;
    if (kind === 'estrela' || kind === 'fenda') {
      this.beaconMat.color.set(kind === 'estrela' ? SUN : VIOLET);
      this.beacon.position.set(ev.x, terrainHeight(ev.x, ev.z), ev.z);
      this.beaconFill.visible = kind === 'fenda'; this.beaconFill.scale.setScalar(.001);
      this.beaconRing.scale.setScalar(kind === 'fenda' ? FENDA_R : 2.4);
    } else if (kind === 'trilha') this.layRings();
    this.onNotice(`✦ Evento: ${EVENT_INFO[kind].title}! ${EVENT_INFO[kind].text}`);
    this.onChange();
  }
  private layRings() {
    const ev = this.event!;
    ev.ring.forEach(([x, z], i) => {
      const [nx, nz] = ev.ring[Math.min(i + 1, RINGS - 1)], [bx, bz] = ev.ring[Math.max(i - 1, 0)];
      const s = i < ev.cur ? 0 : i === ev.cur ? 1.15 : .8;
      this.tmpM.compose(this.tmpP.set(x, terrainHeight(x, z) + 1.7, z), this.tmpQ.setFromEuler(this.tmpE.set(0, Math.atan2(nx - bx, nz - bz), 0)), this.tmpS.setScalar(s));
      this.rings.setMatrixAt(i, this.tmpM);
    });
    this.rings.instanceMatrix.needsUpdate = true;
  }
  private endEvent(won: boolean) {
    const ev = this.event; if (!ev) return;
    this.event = null; this.beacon.position.y = PARK_Y; this.hideRings();
    this.nextEvent = 40 + Math.random() * 25;
    const info = EVENT_INFO[ev.kind];
    if (won) this.reward(info.xp, Math.random() < info.chance ? [info.item] : [], `Evento concluído: ${info.title}`, true);
    else this.onNotice(`O evento ${info.title} terminou. Outro surge em breve.`);
    this.onChange();
  }
  /** Um inimigo caiu com crédito para o jogador (conta para a Caçada Relâmpago). */
  kill() {
    const ev = this.event; if (ev?.kind !== 'cacada') return;
    if (++ev.cur >= ev.max) this.endEvent(true); else this.onChange();
  }

  /** Por quadro, só durante o jogo. (px, pz) = herói; alive = pode coletar/participar. */
  update(dt: number, time: number, px: number, pz: number, alive: boolean) {
    // ecos: flutuam, giram e são coletados por proximidade
    for (let i = 0; i < this.echoPos.length; i++) {
      if (this.echoGot.has(i)) continue;
      const [x, , z] = this.echoPos[i];
      if (alive && Math.hypot(px - x, pz - z) < 1.8) {
        this.echoGot.add(i); this.setEcho(i, time); this.beams.instanceMatrix.needsUpdate = true;
        const n = this.echoGot.size, all = n === ECHOES.length;
        if (all) this.reward(400, ['ancientSigil'], 'Missão concluída: Ecos Perdidos · Selo Antigo', true);
        else this.reward(20, [], `Eco perdido recolhido (${n}/${ECHOES.length})`);
        this.onChange();
      } else this.setEcho(i, time);
    }
    this.crystals.instanceMatrix.needsUpdate = true;
    // baús: abrem por proximidade; a tampa termina de abrir sozinha
    this.chests.forEach((c, i) => {
      if (!this.chestGot.has(i)) {
        const [x, , z] = this.chestPos[i];
        c.beam.scale.y = 1 + Math.sin(time * 2 + i) * .12;
        if (alive && Math.hypot(px - x, pz - z) < 2.1) {
          this.chestGot.add(i); c.beam.visible = false;
          const n = this.chestGot.size, all = n === CHESTS.length;
          this.reward(55, [CHEST_ITEMS[i]], `Baú aberto (${n}/${CHESTS.length})`);
          if (all) this.reward(300, ['moonFang'], 'Missão concluída: Baús Escondidos · Presa da Lua', true);
          this.onChange();
        }
      } else if (c.open < 1) { c.open = Math.min(1, c.open + dt * 2.2); c.lid.rotation.x = -1.9 * (1 - Math.pow(1 - c.open, 3)); }
    });
    // locais: descobrir ao entrar na clareira
    if (alive) for (const id of Object.keys(LANDMARKS) as LandmarkId[]) {
      const l = LANDMARKS[id]; if (this.placeGot.has(id) || Math.hypot(px - l.x, pz - l.z) > l.r) continue;
      this.placeGot.add(id);
      const all = this.placeGot.size === Object.keys(LANDMARKS).length;
      this.reward(60, [], `Local descoberto: ${l.name}`);
      if (all) this.reward(350, ['demonAsh'], 'Missão concluída: Cartógrafo do Vale · Cinza Demoníaca', true);
      this.onChange();
    }
    // eventos
    const ev = this.event;
    if (!ev) { this.nextEvent -= dt; if (this.nextEvent <= 0 && alive) this.startEvent(px, pz); return; }
    ev.t -= dt; ev.age += dt;
    const d = Math.hypot(px - ev.x, pz - ev.z);
    if (ev.kind === 'estrela') {
      // a estrela desce do céu em 2,5 s e fica pulsando no chão
      const fall = Math.min(1, ev.age / 2.5), k = 1 - Math.pow(1 - fall, 2);
      this.beaconCore.position.set((1 - k) * 26, .9 + (1 - k) * 60, (1 - k) * -14); this.beaconCore.rotation.y = time * 2;
      this.beaconBeam.scale.set(fall, fall, fall); this.beaconRing.scale.setScalar(2.4 + Math.sin(time * 3) * .3);
      this.beaconMat.opacity = .9 * (ev.t < 8 ? .45 + .55 * Math.abs(Math.sin(time * 6)) : 1);
      if (alive && fall >= 1 && d < 2.6) return this.endEvent(true);
    } else if (ev.kind === 'fenda') {
      this.beaconCore.position.set(0, 1.6 + Math.sin(time * 2) * .2, 0); this.beaconCore.rotation.y = -time * 1.5;
      this.beaconBeam.scale.set(1, 1, 1); this.beaconMat.opacity = .85;
      if (alive && d < FENDA_R) {
        const before = Math.floor(ev.hold); ev.hold += dt; ev.cur = Math.min(ev.max, Math.floor(ev.hold));
        if (ev.hold >= ev.max) return this.endEvent(true);
        if (ev.cur !== before) this.onChange();
      }
      this.beaconFill.scale.setScalar(Math.max(.001, FENDA_R * ev.hold / ev.max));
    } else if (ev.kind === 'trilha') {
      if (alive && d < 2.4) {
        ev.cur++; ev.started = true;
        if (ev.cur >= ev.max) return this.endEvent(true);
        [ev.x, ev.z] = ev.ring[ev.cur]; ev.t = Math.max(ev.t, 6) + 2.5; // cada anel devolve um pouco de tempo
        this.layRings(); this.onChange();
      }
    }
    if (ev.t <= 0) this.endEvent(false);
  }

  /** Segundos restantes do evento em curso (null = sem evento). */
  get timeLeft() { return this.event ? Math.max(0, this.event.t) : null; }
  /** Onde fica o evento em curso (para a bússola). */
  target(): { x: number; z: number } | null { const e = this.event; return e && e.kind !== 'cacada' ? e : null; }

  view(): ActivityView {
    const out: ActivityView = [], ev = this.event;
    if (ev) out.push({ id: 'ev-' + ev.kind, kicker: 'Evento', title: EVENT_INFO[ev.kind].title, text: EVENT_INFO[ev.kind].text, cur: ev.cur, max: ev.max, timed: true });
    const side = (id: string, title: string, text: string, cur: number, max: number) => { if (cur < max) out.push({ id, kicker: 'Exploração', title, text, cur, max, timed: false }); };
    side('ecos', 'Ecos Perdidos', 'Siga os feixes azuis espalhados pelo vale.', this.echoGot.size, ECHOES.length);
    side('baus', 'Baús Escondidos', 'Procure os baús perto das construções e ruínas.', this.chestGot.size, CHESTS.length);
    side('locais', 'Cartógrafo do Vale', 'Descubra os cinco novos locais do mapa.', this.placeGot.size, Object.keys(LANDMARKS).length);
    return out;
  }

  save(): ActivitySave { return { echoes: [...this.echoGot], chests: [...this.chestGot], places: [...this.placeGot] }; }
  restore(s: ActivitySave | undefined) {
    this.echoGot = new Set((s?.echoes ?? []).filter(i => i >= 0 && i < ECHOES.length));
    this.chestGot = new Set((s?.chests ?? []).filter(i => i >= 0 && i < CHESTS.length));
    this.placeGot = new Set((s?.places ?? []).filter((p): p is LandmarkId => p in LANDMARKS));
    this.echoPos.forEach((_, i) => this.setEcho(i, 0));
    this.crystals.instanceMatrix.needsUpdate = this.beams.instanceMatrix.needsUpdate = true;
    this.chests.forEach((c, i) => { const got = this.chestGot.has(i); c.beam.visible = !got; c.open = got ? 1 : 0; c.lid.rotation.x = got ? -1.9 : 0; });
    this.onChange();
  }
}
