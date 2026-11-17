import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import {
  TIME, POND, WATER_Y, STREAM, STREAM_BANK, seeded, vnoise, fbm, stoneify, patch, pathX, nearPath, pondDist,
  streamDist, inClearing, terrainHeight, glowTexture, type WorldCollider,
} from './world';

/*
 * Elementos de ambientação dos Campos da Aurora:
 * chalé com jardim e poço, acampamento de bandidos com fogueira, torre em ruínas,
 * riacho correndo até o lago, lampiões na trilha, vegetação de sub-bosque e floresta distante.
 * Peças estáticas são fundidas por material (poucas draw calls); dispersões usam InstancedMesh.
 */

const { smoothstep } = THREE.MathUtils;
const tmp = new THREE.Object3D();
const tc = new THREE.Color();
type V3 = [number, number, number];

export type PropsState = {
  quality: number;
  scalable: THREE.InstancedMesh[];
  warmMaterial: THREE.MeshStandardMaterial;
  flames: THREE.Mesh[];
  fireLight: THREE.PointLight;
  particles: { material: THREE.ShaderMaterial; base: number; night: number; day: number }[];
};

/* ───────────── materiais ───────────── */
function makeMaterials(stone: THREE.Material) {
  const std = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial({ vertexColors: true, ...o });
  return {
    stone,
    wood: std({ roughness: .86 }),
    roof: std({ roughness: .9, flatShading: true }),
    cloth: std({ roughness: 1, side: THREE.DoubleSide }),
    metal: std({ roughness: .42, metalness: .75 }),
    plant: std({ roughness: .9 }),
    // janelas e lampiões: brilho quente controlado pelo ciclo dia/noite
    warm: std({ color: '#ffd7a0', emissive: '#ff9d45', emissiveIntensity: .1, roughness: .4 }),
  };
}
type Mats = ReturnType<typeof makeMaterials>;

/* cor por vértice com veio (madeira) ou manchas (tecido/planta) */
function paint(g: THREE.BufferGeometry, color: string | THREE.Color, grain = .14, seed = 0) {
  const p = g.attributes.position as THREE.BufferAttribute, col = new Float32Array(p.count * 3), base = new THREE.Color(color), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const n = vnoise(x * 7.3 + z * 6.1 + seed * 13.7, y * 1.7 + seed) * .7 + vnoise(x * 23 + seed, z * 23 + y * 4) * .3;
    c.copy(base).multiplyScalar(1 - grain * .5 + n * grain);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}

/* Kit: acumula geometrias já transformadas e funde uma malha por material. */
class Kit {
  private parts = new Map<THREE.Material, THREE.BufferGeometry[]>();
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private e = new THREE.Euler();
  private seed = 0;
  add(mat: THREE.Material, geo: THREE.BufferGeometry, color: string | null, pos: V3, rot: V3 = [0, 0, 0], grain = .14) {
    let g = geo.index ? geo.toNonIndexed() : geo;
    if (color) paint(g, tc.set(color).offsetHSL(0, 0, (seeded(++this.seed * 3.1) - .5) * .05), grain, this.seed);
    else if (!g.attributes.color) paint(g, '#ffffff', 0);
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'color') g.deleteAttribute(k);
    if (!g.attributes.normal) g.computeVertexNormals();
    this.m.compose(new THREE.Vector3(...pos), this.q.setFromEuler(this.e.set(...rot)), new THREE.Vector3(1, 1, 1));
    g = g.clone().applyMatrix4(this.m);
    const list = this.parts.get(mat) ?? []; list.push(g); this.parts.set(mat, list);
    return this;
  }
  box(mat: THREE.Material, size: V3, color: string | null, pos: V3, rot: V3 = [0, 0, 0], grain = .14) {
    return this.add(mat, new THREE.BoxGeometry(...size), color, pos, rot, grain);
  }
  cyl(mat: THREE.Material, r0: number, r1: number, h: number, color: string | null, pos: V3, rot: V3 = [0, 0, 0], seg = 8, grain = .14) {
    return this.add(mat, new THREE.CylinderGeometry(r0, r1, h, seg), color, pos, rot, grain);
  }
  build(name: string, shadows = true) {
    const group = new THREE.Group(); group.name = name;
    this.parts.forEach((geos, mat) => {
      const merged = mergeGeometries(geos, false);
      geos.forEach(g => g.dispose());
      if (!merged) return;
      const mesh = new THREE.Mesh(merged, mat); mesh.castShadow = shadows; mesh.receiveShadow = true; group.add(mesh);
    });
    return group;
  }
}

/* utilitários de colocação: estruturas são montadas em coordenadas locais */
function placer(x: number, z: number, yaw: number, colliders: WorldCollider[]) {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  const world = (lx: number, lz: number) => ({ x: x + lx * c + lz * s, z: z - lx * s + lz * c });
  return {
    world,
    collide: (lx: number, lz: number, r: number) => { const w = world(lx, lz); colliders.push({ x: w.x, z: w.z, radius: r }); },
    ground: (lx: number, lz: number) => { const w = world(lx, lz); return terrainHeight(w.x, w.z); },
  };
}

function barrel(kit: Kit, M: Mats, pos: V3, h = 1, r = .38) {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(new THREE.Vector2(r * (.84 + Math.sin(t * Math.PI) * .16), t * h)); }
  kit.add(M.wood, new THREE.LatheGeometry(pts, 14), '#7a5634', pos, [0, 0, 0], .3);
  kit.cyl(M.wood, r * .86, r * .86, .02, '#5d3f26', [pos[0], pos[1] + h - .02, pos[2]], [0, 0, 0], 14);
  [.15, .85].forEach(t => kit.add(M.metal, new THREE.TorusGeometry(r * (.86 + Math.sin(t * Math.PI) * .16) + .01, .022, 4, 18), '#3b3a38', [pos[0], pos[1] + t * h, pos[2]], [Math.PI / 2, 0, 0]));
}

function crate(kit: Kit, M: Mats, pos: V3, s = .7, yaw = 0) {
  kit.box(M.wood, [s, s, s], '#9a7449', [pos[0], pos[1] + s / 2, pos[2]], [0, yaw, 0], .35);
  const e = s / 2 + .01, t = .07;
  for (const [a, b] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    const off = new THREE.Vector3(a * (e - t / 2), 0, b * (e - t / 2)).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    kit.box(M.wood, [t + .01, s + .02, t + .01], '#6b4a2c', [pos[0] + off.x, pos[1] + s / 2, pos[2] + off.z], [0, yaw, 0]);
  }
}

/* ───────────── chalé ───────────── */
function buildCottage(scene: THREE.Scene, M: Mats, colliders: WorldCollider[], blockers: THREE.Object3D[]) {
  const X = 19, Z = 0, YAW = -Math.PI / 2; // frente voltada para a trilha
  const P = placer(X, Z, YAW, colliders);
  const kit = new Kit(), roofKit = new Kit();
  const W = 6, D = 4.4, H = 2.6, B = .45, GABLE = 1.7, RIDGE = B + H + GABLE + .05;
  const WOOD = ['#8d6a45', '#9a7650', '#83603d', '#a07c55'];

  // fundação de pedra
  kit.add(M.stone, stoneify(new THREE.BoxGeometry(W + .45, 1.1, D + .45, 6, 1, 4), .08, '#7e7a6c', .35), null, [0, B - .55, 0]);

  // paredes de tábuas verticais com vãos de porta/janela
  type Seg = [number, number][];
  const wall = (axis: 'x' | 'z', fixed: number, len: number, segs: (u: number) => Seg) => {
    for (let u = -len / 2 + .15, k = 0; u < len / 2; u += .3, k++) {
      for (const [y0, y1] of segs(u)) {
        if (y1 - y0 < .02) continue;
        const size: V3 = axis === 'x' ? [.29, y1 - y0, .1] : [.1, y1 - y0, .29];
        const pos: V3 = axis === 'x' ? [u, B + (y0 + y1) / 2, fixed] : [fixed, B + (y0 + y1) / 2, u];
        kit.box(M.wood, size, WOOD[(k + Math.round(fixed * 3)) % 4], pos, [0, 0, 0], .22);
      }
    }
  };
  const win = (u: number, c: number) => Math.abs(u - c) < .5;
  wall('x', D / 2, W, u => Math.abs(u) < .6 ? [[1.98, H]] : win(u, -1.8) || win(u, 1.8) ? [[0, .95], [1.85, H]] : [[0, H]]);
  wall('x', -D / 2, W, u => win(u, .9) ? [[0, 1.05], [1.8, H]] : [[0, H]]);
  const gable = (u: number) => H + (GABLE - .2) * (1 - Math.abs(u) / (D / 2));
  wall('z', W / 2, D, u => win(u, 0) ? [[0, .95], [1.85, gable(u)]] : [[0, gable(u)]]);
  wall('z', -W / 2, D, u => [[0, gable(u)]]);

  // enxaimel: postes de canto, frechais, travessas e mãos-francesas
  const DARK = '#4a3424';
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) kit.box(M.wood, [.26, H + .05, .26], DARK, [sx * W / 2, B + H / 2, sz * D / 2]);
  for (const sz of [-1, 1]) {
    kit.box(M.wood, [W + .3, .22, .16], DARK, [0, B + H - .05, sz * (D / 2 + .04)]);
    kit.box(M.wood, [W + .1, .16, .14], DARK, [0, B + .1, sz * (D / 2 + .04)]);
  }
  for (const sx of [-1, 1]) {
    kit.box(M.wood, [.16, .22, D + .3], DARK, [sx * (W / 2 + .04), B + H - .05, 0]);
    kit.box(M.wood, [.14, .14, D], DARK, [sx * (W / 2 + .05), B + 1.3, 0]);
    for (const sz of [-1, 1]) kit.box(M.wood, [.12, 1.55, .14], DARK, [sx * (W / 2 + .05), B + 1.95, sz * 1.25], [sz * -.62, 0, 0]);
  }
  kit.box(M.wood, [.12, GABLE, .12], DARK, [W / 2 + .05, B + H + GABLE / 2 - .1, 0]);
  kit.box(M.wood, [.12, GABLE, .12], DARK, [-W / 2 - .05, B + H + GABLE / 2 - .1, 0]);

  // janelas: vidro quente, moldura, cruzeta e venezianas
  const windowAt = (pos: V3, rotY: number, w = .9, h = .85) => {
    const r: V3 = [0, rotY, 0];
    const off = (dx: number, dy: number, dz: number): V3 => { const v = new THREE.Vector3(dx, dy, dz).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY); return [pos[0] + v.x, pos[1] + v.y, pos[2] + v.z]; };
    kit.box(M.warm, [w, h, .04], '#ffffff', off(0, 0, -.02), r, 0);
    kit.box(M.wood, [w + .16, .1, .14], DARK, off(0, h / 2 + .03, .02), r);
    kit.box(M.wood, [w + .22, .1, .22], DARK, off(0, -h / 2 - .03, .06), r);
    kit.box(M.wood, [.08, h, .12], DARK, off(-w / 2 - .04, 0, .02), r);
    kit.box(M.wood, [.08, h, .12], DARK, off(w / 2 + .04, 0, .02), r);
    kit.box(M.wood, [.05, h, .06], DARK, off(0, 0, .02), r);
    kit.box(M.wood, [w, .05, .06], DARK, off(0, 0, .02), r);
    for (const s of [-1, 1]) kit.box(M.wood, [w * .5, h + .05, .05], '#4f6f6a', off(s * (w * .5 + .26), 0, .2), [0, rotY + s * .55, 0], .25);
  };
  windowAt([-1.8, B + 1.4, D / 2 + .06], 0); windowAt([1.8, B + 1.4, D / 2 + .06], 0);
  windowAt([.9, B + 1.42, -D / 2 - .06], Math.PI, .8, .75);
  windowAt([W / 2 + .06, B + 1.4, 0], Math.PI / 2);

  // porta, ferragens, degraus e alpendre
  kit.box(M.wood, [1.08, 1.95, .1], '#5b3b23', [0, B + .98, D / 2 + .02], [0, 0, 0], .3);
  for (const y of [.35, 1.0, 1.65]) kit.box(M.wood, [1.0, .1, .05], '#4a2f1b', [0, B + y, D / 2 + .09]);
  kit.add(M.metal, new THREE.SphereGeometry(.05, 8, 6), '#2f2c28', [.36, B + .95, D / 2 + .12]);
  kit.add(M.stone, stoneify(new THREE.BoxGeometry(1.8, .22, .7, 3, 1, 2), .04, '#8b877a', .2), null, [0, B - .12, D / 2 + .55]);
  kit.add(M.stone, stoneify(new THREE.BoxGeometry(2.1, .22, .7, 3, 1, 2), .04, '#827e72', .25), null, [0, B - .34, D / 2 + 1.05]);
  for (const s of [-1, 1]) kit.box(M.wood, [.14, 2.35, .14], DARK, [s * .95, B + 1.17, D / 2 + 1.0]);
  roofKit.box(M.roof, [2.4, .08, 1.35], '#5a4a3e', [0, B + 2.42, D / 2 + .62], [.32, 0, 0]);
  // lampião ao lado da porta
  kit.box(M.metal, [.04, .04, .3], '#2b2a28', [-.9, B + 2.0, D / 2 + .25]);
  kit.box(M.warm, [.16, .22, .16], '#ffffff', [-.9, B + 1.82, D / 2 + .38], [0, 0, 0], 0);
  kit.add(M.metal, new THREE.ConeGeometry(.15, .12, 4), '#2b2a28', [-.9, B + 1.99, D / 2 + .38], [0, Math.PI / 4, 0]);

  // telhado: laje + fileiras de telhas de madeira com cores variadas + cumeeira
  const slope = GABLE / (D / 2), ang = Math.atan(slope), run = D / 2 + .65, L = run / Math.cos(ang);
  const SHINGLE = ['#6d4e3a', '#5e4434', '#7a5a42', '#674a37', '#56402f'];
  for (const s of [-1, 1]) {
    roofKit.box(M.roof, [W + 1.1, .07, L], '#3d2e24', [0, RIDGE - (L / 2) * Math.sin(ang), s * (L / 2) * Math.cos(ang)], [s * ang, 0, 0]);
    const rows = Math.floor(L / .34);
    for (let r = 0; r < rows; r++) {
      const d = .2 + r * .34, off = r % 2 ? .21 : 0;
      for (let x = -W / 2 - .5 + off, k = 0; x < W / 2 + .55; x += .42, k++) {
        const nx = x + (seeded(r * 31 + k * 7 + s) - .5) * .03;
        roofKit.box(M.roof, [.4, .05, .4], SHINGLE[(r * 3 + k + (s > 0 ? 1 : 0)) % 5],
          [nx, RIDGE + .06 - d * Math.sin(ang) + .02, s * d * Math.cos(ang)], [s * ang - s * .06, (seeded(r + k * 3) - .5) * .05, 0], .18);
      }
    }
  }
  roofKit.cyl(M.roof, .2, .2, W + 1.15, '#4a3628', [0, RIDGE + .08, 0], [0, 0, Math.PI / 2], 3);
  // tábuas de beiral nas empenas
  for (const sx of [-1, 1]) for (const s of [-1, 1])
    roofKit.box(M.wood, [.08, .22, L], DARK, [sx * (W / 2 + .52), RIDGE - (L / 2) * Math.sin(ang) - .05, s * (L / 2) * Math.cos(ang)], [s * ang, 0, 0]);

  // chaminé de pedra
  const chimH = RIDGE + 1.1 - B;
  kit.add(M.stone, stoneify(new THREE.BoxGeometry(.9, chimH, .9, 2, 9, 2), .06, '#7f7466', .15), null, [-1.9, B + chimH / 2, -1.0]);
  kit.add(M.stone, stoneify(new THREE.BoxGeometry(1.05, .16, 1.05, 2, 1, 2), .03, '#6e665c'), null, [-1.9, B + chimH + .08, -1.0]);

  // pilha de lenha encostada na lateral, com cepo e machado
  for (let layer = 0; layer < 4; layer++) for (let i = 0; i < 9 - layer; i++) {
    const z = -1.2 + (i + layer * .5) * .28;
    kit.cyl(M.wood, .13, .13, 1.0 + seeded(i + layer * 9) * .15, ['#7a5a3c', '#6a4c31', '#86654a'][(i + layer) % 3], [-W / 2 - .65, .14 + layer * .24 + P.ground(-W / 2 - .65, z) - P.ground(0, 0), z], [0, 0, Math.PI / 2], 7, .3);
  }
  kit.box(M.wood, [.1, 1.1, 2.9], '#4a3424', [-W / 2 - .1, .55, .0]);
  kit.cyl(M.wood, .34, .38, .55, '#6e5035', [-W / 2 - 1.2, .27, 2.4], [0, 0, 0], 10, .3);
  kit.cyl(M.wood, .3, .3, .02, '#b89770', [-W / 2 - 1.2, .555, 2.4], [0, 0, 0], 10, .2);
  kit.box(M.wood, [.05, .8, .05], '#8a6b48', [-W / 2 - 1.15, .85, 2.4], [0, 0, .5]);
  kit.box(M.metal, [.04, .14, .22], '#5c5b58', [-W / 2 - 1.33, 1.17, 2.4], [0, 0, .5]);

  // barris, caixotes e banco na frente
  barrel(kit, M, [W / 2 + .6, 0, 1.6]); barrel(kit, M, [W / 2 + .75, 0, 2.45], .9, .34);
  crate(kit, M, [W / 2 + .7, 0, .3], .7, .25); crate(kit, M, [W / 2 + .7, .7, .35], .5, .7);
  kit.box(M.wood, [1.7, .08, .4], '#8b6a45', [-1.8, .5, D / 2 + .55]);
  for (const s of [-1, 1]) kit.box(M.wood, [.1, .5, .34], '#5b3f28', [-1.8 + s * .7, .25, D / 2 + .55]);

  // poço com cobertura e sarilho
  const WX = 2.8, WZ = 5.4;
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    kit.add(M.stone, stoneify(new THREE.BoxGeometry(.5, .75, .3, 2, 2, 1), .05, '#88857a', .4), null, [WX + Math.cos(a) * .82, .37, WZ + Math.sin(a) * .82], [0, -a + Math.PI / 2, 0]);
  }
  kit.cyl(M.plant, .7, .7, .02, '#1c3438', [WX, .3, WZ], [0, 0, 0], 16, 0);
  for (const s of [-1, 1]) kit.box(M.wood, [.14, 1.9, .14], DARK, [WX + s * .9, .95, WZ]);
  kit.cyl(M.wood, .07, .07, 2.0, '#6b4e33', [WX, 1.55, WZ], [0, 0, Math.PI / 2], 8);
  kit.box(M.wood, [.05, .3, .05], '#4a3424', [WX + 1.05, 1.42, WZ]);
  kit.cyl(M.wood, .14, .12, .22, '#7a5634', [WX, 1.05, WZ], [0, 0, 0], 10, .3);
  kit.box(M.metal, [.01, .38, .01], '#555', [WX, 1.35, WZ]);
  for (const s of [-1, 1]) roofKit.box(M.roof, [2.3, .06, .95], '#5d4636', [WX, 2.08, WZ + s * .38], [s * .7, 0, 0]);

  // horta cercada atrás da casa
  const GZ0 = -D / 2 - 1.1, GZ1 = -D / 2 - 5.6, GX = 3.2;
  const fencePost = (x: number, z: number, i: number) => kit.box(M.wood, [.12, 1.05, .12], '#6e5a44', [x, .5, z], [(seeded(i) - .5) * .08, seeded(i + 3), (seeded(i + 7) - .5) * .08], .3);
  const rail = (x0: number, z0: number, x1: number, z1: number) => {
    const len = Math.hypot(x1 - x0, z1 - z0), yaw = Math.atan2(-(z1 - z0), x1 - x0);
    for (const y of [.42, .82]) kit.box(M.wood, [len, .07, .05], '#7b6650', [(x0 + x1) / 2, y, (z0 + z1) / 2], [0, yaw, 0], .3);
  };
  const corners: [number, number][] = [[-GX, GZ0], [-GX, GZ1], [GX, GZ1], [GX, GZ0]];
  let fi = 0;
  for (let c = 0; c < 3; c++) {
    const [x0, z0] = corners[c], [x1, z1] = corners[c + 1], n = Math.ceil(Math.hypot(x1 - x0, z1 - z0) / 1.5);
    for (let i = 0; i <= n; i++) fencePost(x0 + (x1 - x0) * i / n, z0 + (z1 - z0) * i / n, fi++);
    rail(x0, z0, x1, z1);
  }
  for (let r = 0; r < 3; r++) {
    const z = GZ0 - 1 - r * 1.3;
    kit.box(M.plant, [5.4, .12, .7], '#5a4632', [0, .04, z], [0, 0, 0], .4);
    for (let i = 0; i < 9; i++) {
      const x = -2.4 + i * .6 + (seeded(i + r * 20) - .5) * .1, s = .2 + seeded(i * 3 + r) * .1;
      kit.add(M.plant, new THREE.IcosahedronGeometry(s, 1), r === 1 ? '#7e9a4a' : '#5f8a45', [x, .12 + s * .6, z], [0, seeded(i) * 6, 0], .4);
    }
  }

  const house = kit.build('cottage'), roof = roofKit.build('cottage-roof');
  const root = new THREE.Group(); root.name = 'cottage-root';
  root.position.set(X, P.ground(0, 0) - .05, Z); root.rotation.y = YAW; root.add(house, roof); scene.add(root);
  blockers.push(root);

  // colisões (casa, poço, lenha, barris, horta)
  for (let lx = -2.4; lx <= 2.4; lx += 1.6) for (const lz of [-1.1, 1.1]) P.collide(lx, lz, 1.3);
  P.collide(WX, WZ, 1.05); P.collide(-W / 2 - .65, 0, .8); P.collide(-W / 2 - 1.2, 2.4, .4);
  P.collide(W / 2 + .7, 1.0, .9); P.collide(W / 2 + .7, 2.45, .45);
  for (let i = 0; i <= 6; i++) { P.collide(-GX, GZ0 - i * .75, .25); P.collide(GX, GZ0 - i * .75, .25); P.collide(-GX + i * GX / 3, GZ1, .25); }

  const chimneyTop = P.world(-1.9, -1.0);
  return { chimney: new THREE.Vector3(chimneyTop.x, root.position.y + B + chimH + .2, chimneyTop.z) };
}

/* ───────────── acampamento dos bandidos ───────────── */
function buildCamp(scene: THREE.Scene, M: Mats, colliders: WorldCollider[], blockers: THREE.Object3D[]) {
  const X = -19, Z = -45, YAW = .9;
  const P = placer(X, Z, YAW, colliders);
  const kit = new Kit();
  const y0 = P.ground(0, 0);
  const gy = (lx: number, lz: number) => P.ground(lx, lz) - y0;

  // fogueira: pedras, cinzas, lenha em pirâmide
  for (let i = 0; i < 11; i++) {
    const a = i / 11 * Math.PI * 2, s = .22 + seeded(i + 70) * .1;
    kit.add(M.stone, stoneify(new THREE.IcosahedronGeometry(s, 1), .08, ['#6f6d66', '#7d786e', '#5f5c56'][i % 3]), null, [Math.cos(a) * .85, s * .55, Math.sin(a) * .85]);
  }
  kit.cyl(M.plant, .72, .78, .06, '#2a2420', [0, .02, 0], [0, 0, 0], 14, .5);
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2;
    kit.cyl(M.wood, .07, .09, 1.05, '#3a2a1e', [Math.cos(a) * .22, .32, Math.sin(a) * .22], [Math.sin(a) * .7, 0, -Math.cos(a) * .7], 6, .4);
  }
  // espeto com panela
  for (const s of [-1, 1]) { kit.cyl(M.wood, .04, .05, 1.4, '#5a4330', [s * 1.05, .7, 0], [0, 0, s * .08], 6); kit.box(M.wood, [.05, .25, .05], '#5a4330', [s * 1.0, 1.42, 0], [0, 0, s * .5]); }
  kit.cyl(M.wood, .03, .03, 2.3, '#4f3a29', [0, 1.38, 0], [0, 0, Math.PI / 2], 6);
  kit.add(M.metal, new THREE.SphereGeometry(.26, 12, 8, 0, Math.PI * 2, Math.PI * .45, Math.PI * .55), '#2e2c2a', [0, 1.1, 0]);
  kit.box(M.metal, [.01, .2, .01], '#333', [0, 1.28, 0]);

  // tenda em "A" com mastro, estacas e saco de dormir
  const TZ = -3.4, TW = 2.6, TH = 1.75, TL = 3.2;
  const half = TW / 2;
  const tri = (pts: number[]) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); g.computeVertexNormals(); return g; };
  for (const s of [-1, 1]) { // lonas inclinadas (cumeeira → chão), com leve barriga no meio
    const f = TZ + TL / 2, b = TZ - TL / 2, gf = gy(0, f), gb = gy(0, b), sag = .08;
    const pts: number[] = [];
    for (let k = 0; k < 4; k++) {
      const z0 = f - TL * k / 4, z1 = f - TL * (k + 1) / 4, d0 = Math.sin(k / 4 * Math.PI) * sag, d1 = Math.sin((k + 1) / 4 * Math.PI) * sag;
      const r0 = [0, TH + gf, z0], r1 = [0, TH + gf, z1], g0 = [s * (half - d0), gf, z0], g1 = [s * (half - d1), gb, z1];
      pts.push(...r0, ...g0, ...g1, ...r0, ...g1, ...r1);
    }
    kit.add(M.cloth, tri(pts), '#a8946c', [0, 0, 0], [0, 0, 0], .25);
  }
  kit.add(M.cloth, tri([-half, 0, 0, half, 0, 0, 0, TH, 0]), '#97835e', [0, gy(0, TZ - TL / 2), TZ - TL / 2]);
  for (const s of [-1, 1]) { // abas da entrada dobradas
    kit.add(M.cloth, tri([0, TH, 0, s * half, 0, 0, s * half * 1.3, 0, .55]), '#8f7a56', [0, gy(0, TZ + TL / 2), TZ + TL / 2]);
  }
  kit.cyl(M.wood, .05, .05, TL + .5, '#4f3a29', [0, gy(0, TZ) + TH + .02, TZ], [Math.PI / 2, 0, 0], 6);
  for (const s of [-1, 1]) {
    kit.cyl(M.wood, .05, .05, TH + .2, '#4f3a29', [0, gy(0, TZ + s * (TL / 2 + .2)) + TH / 2, TZ + s * (TL / 2 + .2)], [0, 0, 0], 6);
    for (const e of [-1, 1]) kit.cyl(M.wood, .03, .02, .4, '#6a5038', [s * (half + .3), .1, TZ + e * TL / 2.4], [0, 0, s * .4], 4);
  }
  kit.cyl(M.cloth, .32, .32, 1.9, '#6d4a3a', [.3, .16 + gy(0, TZ), TZ - .1], [Math.PI / 2, 0, 0], 10, .2);

  // bancos de tora, caixotes, barril, estandarte e porta-lanças
  for (const [bx, bz, yaw] of [[2.2, .6, 1.3], [-2.1, 1.1, -1.1], [.4, 2.5, .1]] as V3[]) {
    kit.cyl(M.wood, .26, .28, 1.7, '#6d5038', [bx, .26 + gy(bx, bz), bz], [0, yaw, Math.PI / 2], 9, .35);
    P.collide(bx, bz, .45);
  }
  crate(kit, M, [2.4, gy(2.4, -3.0), -3.0], .75, .3); crate(kit, M, [2.6, gy(2.6, -2.2), -2.2], .6, .9); crate(kit, M, [2.45, .75 + gy(2.4, -3.0), -3.0], .5, .1);
  barrel(kit, M, [-2.4, gy(-2.4, -2.6), -2.6], .95, .36);
  kit.cyl(M.wood, .05, .06, 3.4, '#4a3626', [-2.9, 1.7 + gy(-2.9, -.8), -.8], [0, 0, 0], 6);
  kit.add(M.cloth, new THREE.PlaneGeometry(.8, 1.2, 1, 3), '#7c2f2a', [-2.48, 2.65 + gy(-2.9, -.8), -.8], [0, .25, 0], .3);
  kit.box(M.wood, [.08, .08, .9], '#4a3626', [-2.5, 3.28 + gy(-2.9, -.8), -.8], [0, Math.PI / 2 + .25, 0]);
  const RX = -3.2, RZ = 1.8;
  for (const s of [-1, 1]) kit.box(M.wood, [.08, 1.2, .08], '#4a3626', [RX, .6 + gy(RX, RZ), RZ + s * .6]);
  kit.box(M.wood, [.06, .06, 1.4], '#4a3626', [RX, 1.1 + gy(RX, RZ), RZ]);
  for (let i = 0; i < 3; i++) {
    const z = RZ - .4 + i * .4;
    kit.cyl(M.wood, .025, .025, 2.0, '#6a5038', [RX + .25, .95 + gy(RX, RZ), z], [0, 0, .22], 5);
    kit.add(M.metal, new THREE.ConeGeometry(.05, .22, 4), '#9a9a96', [RX + .03, 1.98 + gy(RX, RZ), z], [0, 0, .22]);
  }

  const camp = kit.build('bandit-camp');
  camp.position.set(X, y0, Z); camp.rotation.y = YAW; scene.add(camp); blockers.push(camp);
  for (const z of [-2.2, -3.4, -4.6]) P.collide(0, TZ + (z + 3.4), 1.25);
  P.collide(2.5, -2.7, .65); P.collide(-2.4, -2.6, .4); P.collide(RX, RZ, .5); P.collide(0, 0, .95);

  // chamas animadas + luz tremulante
  const flames: THREE.Mesh[] = [];
  const flameGeo = new THREE.ConeGeometry(.32, 1, 9, 4, true); flameGeo.translate(0, .5, 0);
  ['#ff6a1e', '#ffa53a', '#ffe08a'].forEach((c, i) => {
    const f = new THREE.Mesh(flameGeo, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .75 - i * .1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    f.position.set(X, y0 + .12, Z); f.scale.set(1 - i * .28, 1.1 - i * .25, 1 - i * .28); f.userData.base = f.scale.clone(); f.userData.k = i; scene.add(f); flames.push(f);
  });
  const fireLight = new THREE.PointLight('#ff9a45', 3, 14, 1.8); fireLight.position.set(X, y0 + 1.2, Z); scene.add(fireLight);
  return { fire: new THREE.Vector3(X, y0 + .5, Z), flames, fireLight };
}

/* ───────────── torre em ruínas ───────────── */
function buildTower(scene: THREE.Scene, M: Mats, colliders: WorldCollider[], blockers: THREE.Object3D[]) {
  const X = 42, Z = -46, R = 2.5, PER = 16, BH = .52;
  const kit = new Kit(), y0 = terrainHeight(X, Z) - .2;
  const door = Math.PI; // entrada voltada para oeste (trilha)
  const angDist = (a: number, b: number) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
  const blockGeo = () => stoneify(new THREE.BoxGeometry(.98, BH - .03, .72, 2, 1, 1), .07, '#ffffff');
  const STONE = ['#8f8b7d', '#7f7d72', '#9b9686', '#868272', '#77786e'];
  for (let ring = 0; ring < 18; ring++) {
    for (let i = 0; i < PER; i++) {
      const a = (i + (ring % 2) * .5) / PER * Math.PI * 2;
      const top = 7 + (Math.sin(a + 1.2) * .5 + .5) * 10 + (seeded(i * 13 + 7) - .5) * 3;
      if (ring > top) continue;
      if (ring < 5 && angDist(a, door) < .32) continue;           // portal
      if ((ring === 9 || ring === 10) && (i === 3 || i === 11)) continue; // seteiras
      const g = blockGeo(), col = tc.set(STONE[(i + ring * 3) % 5]).lerp(new THREE.Color('#6a8247'), ring < 2 || seeded(i + ring * 40) > .9 ? .35 : 0);
      const c = g.attributes.color as THREE.BufferAttribute;
      for (let v = 0; v < c.count; v++) c.setXYZ(v, c.getX(v) * col.r, c.getY(v) * col.g, c.getZ(v) * col.b);
      kit.add(M.stone, g, null, [Math.cos(a) * R, BH / 2 + ring * BH, Math.sin(a) * R], [0, -a + Math.PI / 2, 0]);
    }
  }
  // lintel do portal, vigas do piso (uma quebrada) e escombros
  kit.add(M.stone, stoneify(new THREE.BoxGeometry(1.9, .45, .85, 3, 1, 1), .05, '#8a8678', .3), null, [-R, 5 * BH + .2, 0], [0, Math.PI / 2, 0]);
  kit.box(M.wood, [.22, .22, R * 2 + .3], '#4b3a2b', [-.7, BH * 10.5, 0]);
  kit.box(M.wood, [.22, .22, R * 2 + .3], '#4b3a2b', [.7, BH * 10.5, 0]);
  kit.box(M.wood, [.22, .22, 2.6], '#4b3a2b', [0, BH * 10.5 - .6, 1.4], [.55, 0, .1]);
  for (let i = 0; i < 30; i++) {
    const a = .6 + (seeded(i + 300) - .5) * 2.2, d = R + .8 + seeded(i + 310) * 4.2, s = .3 + seeded(i + 320) * .45;
    const x = Math.cos(a) * d, z = Math.sin(a) * d;
    kit.add(M.stone, stoneify(new THREE.BoxGeometry(s * 1.8, s, s * 1.3, 2, 1, 1), .08, STONE[i % 5], .45), null,
      [x, terrainHeight(X + x, Z + z) - y0 + s * .3, z], [(seeded(i + 330) - .5) * .8, seeded(i + 340) * 6, (seeded(i + 350) - .5) * .8]);
    if (s > .55) colliders.push({ x: X + x, z: Z + z, radius: s * .9 });
  }
  // trepadeiras escorrendo pela parede
  for (let i = 0; i < 14; i++) {
    const a = seeded(i + 400) * Math.PI * 2, len = 1.5 + seeded(i + 410) * 3;
    if (angDist(a, door) < .5) continue;
    kit.box(M.plant, [.35, len, .06], ['#4c6b3a', '#5b7a40', '#3f5d34'][i % 3], [Math.cos(a) * (R + .38), 3.8 - len / 2 + seeded(i) * 2, Math.sin(a) * (R + .38)], [0, -a + Math.PI / 2, 0], .5);
  }
  const tower = kit.build('ruined-watchtower');
  tower.position.set(X, y0, Z); scene.add(tower); blockers.push(tower);
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * Math.PI * 2;
    if (angDist(a, door) < .4) continue;
    colliders.push({ x: X + Math.cos(a) * R, z: Z + Math.sin(a) * R, radius: .65 });
  }
}

/* ───────────── lampiões e placa da trilha ───────────── */
function buildTrailProps(scene: THREE.Scene, M: Mats, colliders: WorldCollider[]) {
  const kit = new Kit();
  [[6.5, 1], [1, -1], [-4.5, 1], [-19.5, -1]].forEach(([z, side]) => {
    const x = pathX(z) + side * 2.15, y = terrainHeight(x, z);
    kit.add(M.stone, stoneify(new THREE.CylinderGeometry(.22, .3, .3, 7), .05, '#7d7a6e', .4), null, [x, y + .1, z]);
    kit.cyl(M.wood, .07, .09, 2.6, '#4b3727', [x, y + 1.35, z], [0, 0, 0], 7);
    const ax = x - side * .35;
    kit.box(M.wood, [.75, .07, .07], '#4b3727', [x - side * .3, y + 2.55, z]);
    kit.box(M.wood, [.05, .4, .05], '#4b3727', [x - side * .12, y + 2.35, z], [0, 0, side * .8]);
    kit.box(M.metal, [.015, .15, .015], '#2a2826', [ax - side * .25, y + 2.45, z]);
    kit.add(M.metal, new THREE.ConeGeometry(.17, .14, 4), '#2a2826', [ax - side * .25, y + 2.33, z], [0, Math.PI / 4, 0]);
    kit.box(M.warm, [.17, .24, .17], '#ffffff', [ax - side * .25, y + 2.14, z], [0, 0, 0], 0);
    kit.box(M.metal, [.22, .03, .22], '#2a2826', [ax - side * .25, y + 2.01, z]);
    colliders.push({ x, z, radius: .25 });
  });
  // placa de direção
  const sx = 3, sz = 8.5, sy = terrainHeight(sx, sz);
  kit.cyl(M.wood, .07, .08, 2.1, '#5a4330', [sx, sy + 1.05, sz], [0, 0, 0], 6);
  kit.box(M.wood, [1.1, .24, .05], '#9a7b55', [sx - .35, sy + 1.75, sz], [0, -.15, .04], .3);
  kit.box(M.wood, [1.0, .22, .05], '#8f7150', [sx + .3, sy + 1.42, sz], [0, Math.PI * .5 + .3, -.05], .3);
  kit.box(M.wood, [.9, .2, .05], '#9f8058', [sx - .2, sy + 1.12, sz], [0, Math.PI - .4, .03], .3);
  colliders.push({ x: sx, z: sz, radius: .2 });
  scene.add(kit.build('trail-props'));
}

/* ───────────── riacho ───────────── */
function buildStream(scene: THREE.Scene, M: Mats, colliders: WorldCollider[]) {
  const ACROSS = [-1, -.6, -.25, 0, .25, .6, 1], HALF = 3.1;
  const pos: number[] = [], flow: number[] = [], idx: number[] = [];
  let along = 0;
  STREAM.forEach((p, i) => {
    const prev = STREAM[Math.max(0, i - 1)], next = STREAM[Math.min(STREAM.length - 1, i + 1)];
    const tx = next.x - prev.x, tz = next.y - prev.y, tl = Math.hypot(tx, tz) || 1, nx = -tz / tl, nz = tx / tl;
    if (i > 0) along += p.distanceTo(prev);
    const y = Math.max(STREAM_BANK[i] - .45, WATER_Y - .04);
    ACROSS.forEach(u => { pos.push(p.x + nx * u * HALF, y, p.y + nz * u * HALF); flow.push(u * .5 + .5, along); });
    if (i < STREAM.length - 1) for (let k = 0; k < ACROSS.length - 1; k++) {
      const a = i * ACROSS.length + k, b = a + ACROSS.length;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aFlow', new THREE.Float32BufferAttribute(flow, 2));
  g.setIndex(idx); g.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ color: '#3d6b74', roughness: .08, metalness: .1, transparent: true, opacity: .86, depthWrite: false });
  mat.onBeforeCompile = shader => {
    shader.uniforms.uTime = TIME;
    shader.vertexShader = `attribute vec2 aFlow; varying vec2 vFlow;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\nvFlow = aFlow;');
    shader.fragmentShader = `uniform float uTime; varying vec2 vFlow;
      float fh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float fn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(fh(i),fh(i+vec2(1,0)),f.x),mix(fh(i+vec2(0,1)),fh(i+vec2(1,1)),f.x),f.y);}
      ${shader.fragmentShader}`
      .replace('#include <color_fragment>', `#include <color_fragment>
        float across = abs(vFlow.x - .5) * 2.;
        vec2 fp = vec2(vFlow.x * 7., vFlow.y * .55 - uTime * 1.5);
        float streak = smoothstep(.62, .9, fn(fp) * .65 + fn(fp * 2.3 + 4.1) * .35);
        float foam = streak * .35 + smoothstep(.55, .85, across) * fn(fp * 3.) * .5;
        diffuseColor.rgb = mix(vec3(.07,.22,.26), vec3(.3,.5,.48), smoothstep(.0, .8, across));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.86,.92,.9), foam);
        diffuseColor.a *= 1. - smoothstep(.82, 1., across);`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        float w1 = sin(vFlow.y * 2.2 - uTime * 4. + vFlow.x * 5.) * .5 + fn(fp * 1.7) - .5;
        normal = normalize(normal + (viewMatrix * vec4(w1 * .08, 0., w1 * .06, 0.)).xyz);`);
  };
  mat.customProgramCacheKey = () => 'aurora-stream-v1';
  const water = new THREE.Mesh(g, mat); water.name = 'stream'; water.renderOrder = 2; water.receiveShadow = true; scene.add(water);

  // pedras da margem, pedras de travessia e taboas
  const rocks = new THREE.InstancedMesh(stoneify(new THREE.IcosahedronGeometry(1, 1), .3, '#ffffff', .6), patch(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95, flatShading: true }), 'aurora-bankrock-v1', { fade: true }), 150);
  let n = 0;
  const RC = ['#7c7d72', '#6d7068', '#8a877a', '#64675f'];
  const put = (x: number, z: number, s: number, seed: number, y?: number) => {
    tmp.position.set(x, (y ?? terrainHeight(x, z)) + s * .2, z); tmp.scale.set(s, s * .6, s * .85); tmp.rotation.set(.1, seeded(seed) * 6, .1); tmp.updateMatrix();
    rocks.setMatrixAt(n, tmp.matrix); rocks.setColorAt(n++, tc.set(RC[seed % 4]).offsetHSL(0, 0, (seeded(seed + 1) - .5) * .06));
    if (s > .6) colliders.push({ x, z, radius: s * .8 });
  };
  for (let i = 0; i < 130 && n < 140; i++) {
    const t = Math.floor(seeded(i + 11000) * (STREAM.length - 1)), p = STREAM[t], q = STREAM[t + 1];
    const tl = Math.hypot(q.x - p.x, q.y - p.y) || 1, side = seeded(i + 11100) > .5 ? 1 : -1, d = 2.3 + seeded(i + 11200) * 1.8;
    const x = p.x - (q.y - p.y) / tl * side * d, z = p.y + (q.x - p.x) / tl * side * d;
    if (pondDist(x, z) < POND.r * .9) continue;
    put(x, z, .25 + seeded(i + 11300) * .7, 11400 + i);
  }
  // travessia de pedras
  const cross = 62, cp = STREAM[cross], cq = STREAM[cross + 1], cl = Math.hypot(cq.x - cp.x, cq.y - cp.y) || 1;
  for (let k = -2; k <= 2; k++) {
    const x = cp.x - (cq.y - cp.y) / cl * k * .95, z = cp.y + (cq.x - cp.x) / cl * k * .95;
    put(x, z, .42, 11800 + k + 2, STREAM_BANK[cross] - .62);
  }
  rocks.count = n; rocks.castShadow = false; rocks.receiveShadow = true; rocks.instanceMatrix.needsUpdate = true; if (rocks.instanceColor) rocks.instanceColor.needsUpdate = true; scene.add(rocks);

  const stemGeo = new THREE.CylinderGeometry(.012, .02, 1, 4); stemGeo.translate(0, .5, 0);
  const headGeo = new THREE.CapsuleGeometry(.04, .2, 2, 6);
  const plantMat = (key: string, color: string, base: number) => patch(new THREE.MeshLambertMaterial({ color }), key, { sway: [.06, base] });
  const MAXC = 240;
  const stems = new THREE.InstancedMesh(stemGeo, plantMat('aurora-cattail-stem', '#7a8f4a', 0), MAXC);
  const heads = new THREE.InstancedMesh(headGeo, plantMat('aurora-cattail-head', '#5d3c22', .95), MAXC);
  let nc = 0;
  for (let i = 0; i < 600 && nc < MAXC; i++) {
    const t = Math.floor(seeded(i + 12000) * (STREAM.length - 1)), p = STREAM[t], q = STREAM[t + 1];
    const tl = Math.hypot(q.x - p.x, q.y - p.y) || 1, side = seeded(i + 12100) > .5 ? 1 : -1, d = 2.6 + seeded(i + 12200) * 1.4;
    const x = p.x - (q.y - p.y) / tl * side * d + (seeded(i + 12300) - .5) * .6, z = p.y + (q.x - p.x) / tl * side * d;
    if (pondDist(x, z) < POND.r * .8 || fbm(x * .2, z * .2) < .45) continue;
    const y = terrainHeight(x, z), h = 1.1 + seeded(i + 12400) * .9;
    tmp.position.set(x, y, z); tmp.rotation.set((seeded(i) - .5) * .15, 0, (seeded(i + 1) - .5) * .15); tmp.scale.set(1, h, 1); tmp.updateMatrix(); stems.setMatrixAt(nc, tmp.matrix);
    tmp.position.set(x, y + h * .9, z); tmp.scale.setScalar(1); tmp.updateMatrix(); heads.setMatrixAt(nc++, tmp.matrix);
  }
  stems.count = heads.count = nc; stems.instanceMatrix.needsUpdate = heads.instanceMatrix.needsUpdate = true;
  scene.add(stems, heads);
  return [stems, heads];
}

/* ───────────── sub-bosque: samambaias, cogumelos, tocos e troncos caídos ───────────── */
function makeFernGeometry() {
  const pos: number[] = [], col: number[] = [], idx: number[] = [];
  const FR = 7, SEG = 6;
  for (let f = 0; f < FR; f++) {
    const yaw = f / FR * Math.PI * 2 + seeded(f) * .4, len = .75 + seeded(f + 9) * .35, lift = .55 + seeded(f + 4) * .3;
    const cx = Math.cos(yaw), cz = Math.sin(yaw), base = pos.length / 3;
    for (let s = 0; s <= SEG; s++) {
      const t = s / SEG, r = t * len, y = Math.sin(t * Math.PI * .8) * lift * (1 - t * .35) - t * t * .15;
      const w = Math.sin(t * Math.PI) * .16 * (1 - t * .3);
      pos.push(cx * r - cz * w, y, cz * r + cx * w, cx * r, y + .03, cz * r, cx * r + cz * w, y, cz * r - cx * w);
      const shade = .55 + t * .5;
      col.push(shade * .85, shade * .9, shade * .8, shade, shade, shade * .9, shade * .85, shade * .9, shade * .8);
      if (s < SEG) { const q = base + s * 3; idx.push(q, q + 3, q + 1, q + 1, q + 3, q + 4, q + 1, q + 4, q + 2, q + 2, q + 4, q + 5, q + 1, q + 3, q, q + 4, q + 3, q + 1, q + 4, q + 1, q + 2, q + 5, q + 4, q + 2); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(pos.map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
  g.setIndex(idx); return g;
}

function forestSpot(i: number, seedBase: number, rMin: number, rMax: number) {
  const a = seeded(seedBase + i) * Math.PI * 2, r = rMin + Math.sqrt(seeded(seedBase + 5000 + i)) * (rMax - rMin);
  return { x: Math.cos(a) * r, z: Math.sin(a) * r - 6 };
}
const blocked = (x: number, z: number, pad: number) =>
  nearPath(x, z, pad + .4) || pondDist(x, z) < POND.r * 1.25 + pad || streamDist(x, z) < 3.4 + pad || inClearing(x, z, pad) || Math.hypot(x, z + 12) < 8 + pad;
const combatLane = (x: number, z: number) => Math.abs(x) < 15 && z < 12 && z > -66;

function buildUndergrowth(scene: THREE.Scene, colliders: WorldCollider[]) {
  const out: THREE.InstancedMesh[] = [];
  // samambaias
  const ferns = new THREE.InstancedMesh(makeFernGeometry(), patch(new THREE.MeshLambertMaterial({ vertexColors: true }), 'aurora-fern-v1', { fade: true, sway: [.08, .1] }), 1100);
  const FERN = ['#4f7a3c', '#5e8a44', '#46703a', '#6a9149', '#557f3f'];
  let n = 0;
  for (let i = 0; i < 3200 && n < 1100; i++) {
    const { x, z } = forestSpot(i, 20000, 13, 70);
    if (blocked(x, z, 0) || fbm(x * .045 + 9, z * .045 + 3) < .4 || terrainHeight(x, z) > 4.5) continue;
    const s = .6 + seeded(i + 21000) * .75;
    tmp.position.set(x, terrainHeight(x, z) - .03, z); tmp.rotation.set(0, seeded(i + 22000) * 6.28, 0); tmp.scale.set(s, s * (.8 + seeded(i + 23000) * .4), s); tmp.updateMatrix();
    ferns.setMatrixAt(n, tmp.matrix); ferns.setColorAt(n++, tc.set(FERN[i % 5]).offsetHSL(0, 0, (seeded(i + 24000) - .5) * .06));
  }
  ferns.count = n; ferns.receiveShadow = true; ferns.name = 'ferns'; ferns.instanceMatrix.needsUpdate = true; if (ferns.instanceColor) ferns.instanceColor.needsUpdate = true; scene.add(ferns); out.push(ferns);

  // cogumelos em grupos
  const capGeo = new THREE.SphereGeometry(1, 10, 6, 0, Math.PI * 2, 0, Math.PI * .5); capGeo.scale(1, .6, 1);
  const stemGeo = new THREE.CylinderGeometry(.35, .45, 1, 7); stemGeo.translate(0, .5, 0);
  const caps = new THREE.InstancedMesh(capGeo, new THREE.MeshStandardMaterial({ roughness: .6 }), 260);
  const stalks = new THREE.InstancedMesh(stemGeo, new THREE.MeshStandardMaterial({ color: '#e8dfc8', roughness: .8 }), 260);
  const CAP = ['#b8432f', '#8a5a3a', '#c49a6a', '#a8743f', '#d7c49c'];
  let nm = 0;
  for (let c = 0; c < 70 && nm < 255; c++) {
    const { x: cx, z: cz } = forestSpot(c, 30000, 14, 60);
    if (blocked(cx, cz, .5) || fbm(cx * .045 + 9, cz * .045 + 3) < .42) continue;
    const kind = CAP[c % 5], count = 3 + Math.floor(seeded(c + 30500) * 4);
    for (let k = 0; k < count && nm < 260; k++) {
      const x = cx + (seeded(c * 9 + k + 31000) - .5) * .9, z = cz + (seeded(c * 9 + k + 32000) - .5) * .9, y = terrainHeight(x, z);
      const s = .08 + seeded(c * 9 + k + 33000) * .1, h = s * (1.6 + seeded(k + c) * 1.2);
      tmp.position.set(x, y - .02, z); tmp.rotation.set((seeded(k + c * 5) - .5) * .3, 0, (seeded(k + c * 7) - .5) * .3); tmp.scale.set(s * .5, h, s * .5); tmp.updateMatrix(); stalks.setMatrixAt(nm, tmp.matrix);
      tmp.position.set(x, y + h - .03, z); tmp.scale.setScalar(s * 1.4); tmp.updateMatrix(); caps.setMatrixAt(nm, tmp.matrix);
      caps.setColorAt(nm++, tc.set(kind).offsetHSL(0, 0, (seeded(k) - .5) * .08));
    }
  }
  caps.count = stalks.count = nm; caps.castShadow = false; [caps, stalks].forEach(m => { m.instanceMatrix.needsUpdate = true; m.receiveShadow = true; scene.add(m); out.push(m); });
  if (caps.instanceColor) caps.instanceColor.needsUpdate = true;

  // tocos com anéis no topo
  const stumpGeo = new THREE.CylinderGeometry(.34, .5, .55, 11, 2); stumpGeo.translate(0, .27, 0);
  { const p = stumpGeo.attributes.position as THREE.BufferAttribute, cc = new Float32Array(p.count * 3), bark = new THREE.Color('#5d4532'), ring = new THREE.Color('#b8956a'), c = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const top = p.getY(i) > .5, r = Math.hypot(p.getX(i), p.getZ(i));
      if (!top) p.setXYZ(i, p.getX(i) * (1 + Math.sin(Math.atan2(p.getZ(i), p.getX(i)) * 5) * .08 * (1 - p.getY(i))), p.getY(i), p.getZ(i) * (1 + Math.sin(Math.atan2(p.getZ(i), p.getX(i)) * 5) * .08 * (1 - p.getY(i))));
      c.copy(top && r < .3 ? ring : bark).multiplyScalar(.85 + vnoise(p.getX(i) * 9, p.getY(i) * 9 + p.getZ(i) * 9) * .3);
      cc[i * 3] = c.r; cc[i * 3 + 1] = c.g; cc[i * 3 + 2] = c.b;
    }
    stumpGeo.setAttribute('color', new THREE.BufferAttribute(cc, 3)); stumpGeo.computeVertexNormals(); }
  const stumps = new THREE.InstancedMesh(stumpGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95 }), 30);
  let ns = 0;
  for (let i = 0; i < 200 && ns < 30; i++) {
    const { x, z } = forestSpot(i, 40000, 15, 62);
    if (blocked(x, z, 1) || combatLane(x, z)) continue;
    const s = .7 + seeded(i + 40500) * .7;
    tmp.position.set(x, terrainHeight(x, z) - .05, z); tmp.rotation.set(0, seeded(i + 41000) * 6, 0); tmp.scale.set(s, s * (.7 + seeded(i + 41500) * .8), s); tmp.updateMatrix();
    stumps.setMatrixAt(ns++, tmp.matrix); colliders.push({ x, z, radius: .45 * s });
  }
  stumps.count = ns; stumps.castShadow = stumps.receiveShadow = true; stumps.instanceMatrix.needsUpdate = true; scene.add(stumps);

  // troncos caídos com musgo
  const logGeo = new THREE.CylinderGeometry(.3, .36, 4.2, 11, 8); logGeo.rotateZ(Math.PI / 2);
  { const p = logGeo.attributes.position as THREE.BufferAttribute, cc = new Float32Array(p.count * 3), bark = new THREE.Color('#5a4433'), moss = new THREE.Color('#5f7d3e'), endC = new THREE.Color('#a88760'), c = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), endCap = Math.abs(x) > 2.09 && Math.hypot(y, z) < .28;
      const k = 1 + (vnoise(x * 3, Math.atan2(z, y) * 2) - .5) * .18;
      if (!endCap) p.setXYZ(i, x, y * k, z * k);
      c.copy(endCap ? endC : bark).multiplyScalar(.8 + vnoise(x * 4 + 3, y * 12 + z * 12) * .4);
      if (!endCap) c.lerp(moss, smoothstep(y, .05, .3) * (.4 + vnoise(x * 1.3, z) * .6));
      cc[i * 3] = c.r; cc[i * 3 + 1] = c.g; cc[i * 3 + 2] = c.b;
    }
    logGeo.setAttribute('color', new THREE.BufferAttribute(cc, 3)); logGeo.computeVertexNormals(); }
  const logs = new THREE.InstancedMesh(logGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95 }), 16);
  let nl = 0;
  for (let i = 0; i < 200 && nl < 16; i++) {
    const { x, z } = forestSpot(i, 50000, 17, 64);
    if (blocked(x, z, 2.5) || combatLane(x, z)) continue;
    const yaw = seeded(i + 50500) * Math.PI, s = .8 + seeded(i + 51000) * .5, cx = Math.cos(yaw), sz = -Math.sin(yaw);
    const yA = terrainHeight(x + cx * 2 * s, z + sz * 2 * s), yB = terrainHeight(x - cx * 2 * s, z - sz * 2 * s);
    tmp.position.set(x, (yA + yB) / 2 + .2 * s, z); tmp.rotation.set(0, yaw, Math.atan2(yA - yB, 4 * s)); tmp.scale.setScalar(s); tmp.updateMatrix();
    logs.setMatrixAt(nl++, tmp.matrix);
    for (const t of [-1.5, 0, 1.5]) colliders.push({ x: x + cx * t * s, z: z + sz * t * s, radius: .42 * s });
  }
  logs.count = nl; logs.castShadow = logs.receiveShadow = true; logs.instanceMatrix.needsUpdate = true; scene.add(logs);
  return out;
}

/* ───────────── floresta distante (silhuetas além da área jogável) ───────────── */
function buildDistantForest(scene: THREE.Scene) {
  const MAX = 900;
  // três camadas de copa + tronco curto, fundidos (cor do tronco via vértice)
  const parts = [[.62, .5, .2], [.48, .4, .45], [.32, .32, .68]].map(([r, h, y]) => { const c = new THREE.ConeGeometry(r, h, 7, 1); c.translate(0, y + h / 2 - .04, 0); return paint(c.toNonIndexed(), '#ffffff', .12); });
  const trunk = new THREE.CylinderGeometry(.05, .07, .25, 5); trunk.translate(0, .12, 0); parts.push(paint(trunk.toNonIndexed(), '#6a5a4a', 0));
  parts.forEach(g => g.deleteAttribute('uv'));
  const geo = mergeGeometries(parts)!;
  const trees = new THREE.InstancedMesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }), MAX);
  const COL = ['#2c4a3a', '#33523f', '#2a4436', '#3b5a44', '#4a6448'];
  let n = 0;
  for (let i = 0; i < 2600 && n < MAX; i++) {
    const a = seeded(i + 60000) * Math.PI * 2, r = 74 + Math.pow(seeded(i + 61000), .7) * 52;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (streamDist(x, z) < 6 || vnoise(x * .05 + 3, z * .05) < .32) continue;
    const h = 7 + seeded(i + 62000) * 8, w = h * (.5 + seeded(i + 63000) * .14);
    tmp.position.set(x, terrainHeight(x, z) - .3, z); tmp.rotation.set(0, seeded(i) * 6, 0); tmp.scale.set(w, h, w); tmp.updateMatrix();
    trees.setMatrixAt(n, tmp.matrix); trees.setColorAt(n++, tc.set(COL[i % 5]).offsetHSL(0, 0, (seeded(i + 64000) - .5) * .05));
  }
  trees.count = n; trees.name = 'distant-forest'; trees.instanceMatrix.needsUpdate = true; if (trees.instanceColor) trees.instanceColor.needsUpdate = true;
  trees.receiveShadow = true; scene.add(trees);
  return trees;
}

/* ───────────── partículas (fumaça, brasas, névoa) ───────────── */
function particles(scene: THREE.Scene, origins: THREE.Vector3[], count: number, o: {
  color: string; size: number; grow: number; rise: number; spread: number; rate: number; opacity: number; additive?: boolean; scatter?: number; tex: THREE.Texture | null;
}) {
  const pos: number[] = [], seeds: number[] = [];
  for (let i = 0; i < count; i++) {
    const p = origins[i % origins.length], s = o.scatter ?? 0;
    pos.push(p.x + (seeded(i + 70000) - .5) * s, p.y, p.z + (seeded(i + 71000) - .5) * s); seeds.push(seeded(i + 72000));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 1));
  const material = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: o.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    uniforms: { uTime: TIME, uColor: { value: new THREE.Color(o.color) }, uOpacity: { value: o.opacity }, uMap: { value: o.tex },
      uSize: { value: o.size }, uGrow: { value: o.grow }, uRise: { value: o.rise }, uSpread: { value: o.spread }, uRate: { value: o.rate } },
    vertexShader: `attribute float aSeed; uniform float uTime, uSize, uGrow, uRise, uSpread, uRate; varying float vLife;
      void main(){
        float life = fract(uTime * uRate + aSeed);
        vec3 p = position + vec3(sin(aSeed * 61. + uTime * .7) * uSpread * (.3 + life), life * uRise, cos(aSeed * 37. + uTime * .55) * uSpread * (.3 + life));
        p.x += life * life * uSpread * .8; // vento leve
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * (1. + life * uGrow) * (220. / max(1., -mv.z));
        vLife = life;
      }`,
    fragmentShader: `uniform vec3 uColor; uniform float uOpacity; uniform sampler2D uMap; varying float vLife;
      void main(){
        float a = texture2D(uMap, gl_PointCoord).a * sin(vLife * 3.14159) * uOpacity;
        if (a < .004) discard;
        gl_FragColor = vec4(uColor, a);
      }`,
  });
  const pts = new THREE.Points(g, material); pts.frustumCulled = false; scene.add(pts);
  return material;
}

/* ───────────── montagem e animação ───────────── */
export function createProps(scene: THREE.Scene, stoneMat: THREE.Material, colliders: WorldCollider[], blockers: THREE.Object3D[]): PropsState {
  const M = makeMaterials(stoneMat);
  const cottage = buildCottage(scene, M, colliders, blockers);
  const camp = buildCamp(scene, M, colliders, blockers);
  buildTower(scene, M, colliders, blockers);
  buildTrailProps(scene, M, colliders);
  const reeds = buildStream(scene, M, colliders);
  const under = buildUndergrowth(scene, colliders);
  buildDistantForest(scene);

  const tex = glowTexture();
  const mistOrigins: THREE.Vector3[] = [];
  for (let i = 0; i < 24; i++) { const a = seeded(i + 80000) * 6.28, d = seeded(i + 80100) * POND.r * 1.2; mistOrigins.push(new THREE.Vector3(POND.x + Math.cos(a) * d, WATER_Y + .2, POND.z + Math.sin(a) * d)); }
  for (let i = 30; i < STREAM.length - 4; i += 9) mistOrigins.push(new THREE.Vector3(STREAM[i].x, STREAM_BANK[i] - .2, STREAM[i].y));
  const particleSets = [
    { material: particles(scene, [cottage.chimney], 40, { color: '#c9c6c0', size: 3.2, grow: 3, rise: 7, spread: 1.2, rate: .08, opacity: .32, tex }), base: .32, night: .2, day: .32 },
    { material: particles(scene, [camp.fire.clone().setY(camp.fire.y + .9)], 30, { color: '#8d8a86', size: 2.4, grow: 2.5, rise: 6, spread: .9, rate: .1, opacity: .28, tex }), base: .28, night: .18, day: .28 },
    { material: particles(scene, [camp.fire], 50, { color: '#ffb35a', size: .22, grow: -.6, rise: 3.2, spread: .45, rate: .35, opacity: 1, additive: true, scatter: .5, tex }), base: 1, night: 1, day: .7 },
    { material: particles(scene, mistOrigins, 60, { color: '#dfe8ec', size: 7, grow: .5, rise: .5, spread: 2.2, rate: .02, opacity: .08, scatter: 6, tex }), base: .08, night: .14, day: .035 },
  ];

  return { quality: 1, scalable: [...reeds, ...under], warmMaterial: M.warm, flames: camp.flames, fireLight: camp.fireLight, particles: particleSets };
}

export function updateProps(state: PropsState, time: number, night: number) {
  const flicker = .75 + Math.sin(time * 13.1) * .1 + Math.sin(time * 7.3 + 1.7) * .12 + Math.sin(time * 23.7) * .05;
  state.fireLight.intensity = (3 + night * 9) * flicker;
  state.flames.forEach((f, i) => {
    const b = f.userData.base as THREE.Vector3;
    f.scale.set(b.x * (.92 + Math.sin(time * 9 + i * 2) * .08), b.y * (flicker + Math.sin(time * 11 + i) * .12), b.z * (.92 + Math.cos(time * 8 + i) * .08));
    f.rotation.y = time * (1.5 + i * .7);
  });
  state.warmMaterial.emissiveIntensity = .08 + smoothstep(night, .15, .7) * 2.4;
  state.particles.forEach(p => { p.material.uniforms.uOpacity.value = p.day + (p.night - p.day) * night; });
}
