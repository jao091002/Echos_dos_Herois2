import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/* ============================================================================
 *  CATEDRAL DE LUZ — visual do Santuário do clérigo
 *
 *  Igreja ABERTA (colunas, arcos góticos, paredes de vitral, rosáceas, feixes de luz): o jogador e a câmera ficam
 *  dentro dela sem paredes opacas no caminho. Construída UMA vez (geometrias mescladas, 1 draw por material) e
 *  estacionada abaixo do mapa quando inativa: nenhum material é criado/compilado em jogo. Medidas para R = 7 m;
 *  o grupo é escalado pelo raio real do santuário.
 * ========================================================================== */

const R0 = 7;
const PARK_Y = -500;

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const JEWELS = ['#3f6fff', '#e8b84a', '#d83a4a', '#3fc28a', '#9a5cff', '#f4f0e0', '#4ad0ff'];
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

/** Vitral: losangos de vidro colorido com chumbo escuro e um halo dourado no centro. */
function stainedGlass() {
  return canvasTex(256, 512, g => {
    g.fillStyle = '#0c0a10'; g.fillRect(0, 0, 256, 512);
    const s = 32;
    for (let y = -s; y < 512 + s; y += s / 2) for (let x = (y / (s / 2)) % 2 ? s / 2 : 0; x < 256 + s; x += s) {
      g.fillStyle = JEWELS[Math.floor(rnd() * JEWELS.length)];
      g.beginPath(); g.moveTo(x, y - s / 2 + 2); g.lineTo(x + s / 2 - 2, y); g.lineTo(x, y + s / 2 - 2); g.lineTo(x - s / 2 + 2, y); g.fill();
    }
    const halo = g.createRadialGradient(128, 200, 10, 128, 200, 120);
    halo.addColorStop(0, 'rgba(255,240,190,.95)'); halo.addColorStop(.35, 'rgba(255,220,140,.35)'); halo.addColorStop(1, 'rgba(255,220,140,0)');
    g.fillStyle = halo; g.fillRect(0, 0, 256, 512);
    g.strokeStyle = '#1a1408'; g.lineWidth = 6; g.strokeRect(3, 3, 250, 506);
  });
}
/** Rosácea: pétalas radiais coloridas em anéis concêntricos. */
function roseWindow() {
  return canvasTex(256, 256, g => {
    g.translate(128, 128);
    g.fillStyle = '#0c0a10'; g.beginPath(); g.arc(0, 0, 127, 0, Math.PI * 2); g.fill();
    for (const [r0, r1, n] of [[18, 56, 8], [60, 96, 16], [100, 124, 24]] as const) for (let i = 0; i < n; i++) {
      const a0 = i / n * Math.PI * 2 + .02, a1 = (i + 1) / n * Math.PI * 2 - .02;
      g.fillStyle = JEWELS[(i + r0) % JEWELS.length];
      g.beginPath(); g.arc(0, 0, r1, a0, a1); g.arc(0, 0, r0, a1, a0, true); g.fill();
    }
    g.fillStyle = '#fff2c4'; g.beginPath(); g.arc(0, 0, 15, 0, Math.PI * 2); g.fill();
  });
}
/** Feixe de luz: forte no alto, some perto do chão e nas bordas. */
function shaftTexture() {
  return canvasTex(64, 256, g => {
    const v = g.createLinearGradient(0, 0, 0, 256); v.addColorStop(0, 'rgba(255,255,255,.9)'); v.addColorStop(.7, 'rgba(255,255,255,.25)'); v.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = v; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const h = g.createLinearGradient(0, 0, 64, 0); h.addColorStop(0, 'rgba(0,0,0,0)'); h.addColorStop(.5, 'rgba(0,0,0,1)'); h.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = h; g.fillRect(0, 0, 64, 256);
  });
}

/** Janela em arco ogival (retângulo + ponta), base em y = 0, centrada em x. */
function archWindow(w: number, h: number) {
  const s = new THREE.Shape(), hw = w / 2, rect = h - w * .75;
  s.moveTo(-hw, 0); s.lineTo(hw, 0); s.lineTo(hw, rect);
  s.quadraticCurveTo(hw, rect + w * .55, 0, h); s.quadraticCurveTo(-hw, rect + w * .55, -hw, rect); s.lineTo(-hw, 0);
  const g = new THREE.ShapeGeometry(s, 8);
  // UV 0..1 no retângulo envolvente
  const p = g.attributes.position as THREE.BufferAttribute, uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + hw) / w, p.getY(i) / h);
  return g;
}

type Part = { geo: THREE.BufferGeometry; pos?: [number, number, number]; rot?: [number, number, number]; scale?: [number, number, number] };
function bake(parts: Part[]) {
  const geos = parts.map(({ geo, pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1] }) => {
    const m = new THREE.Matrix4().compose(new THREE.Vector3(...pos), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)), new THREE.Vector3(...scale));
    const g = (geo.index ? geo.toNonIndexed() : geo).applyMatrix4(m);
    if (g !== geo) geo.dispose();
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
    return g;
  });
  const out = mergeGeometries(geos)!; geos.forEach(g => g.dispose()); return out;
}

export type Church = {
  root: THREE.Group;
  /** Mostra a igreja em center com raio R (m). */
  show(center: THREE.Vector3, R: number): void;
  /** t = segundos desde o início, life = duração; time = relógio global (pulso dos vitrais). Esconde ao terminar. */
  update(t: number, life: number, time: number): void;
  hide(): void;
  readonly active: boolean;
};

export function createChurch(parent: THREE.Object3D): Church {
  const root = new THREE.Group(); root.name = 'santuario-catedral'; root.position.y = PARK_Y; parent.add(root);
  const stone = new THREE.MeshStandardMaterial({ color: '#d8d1c2', roughness: .4, metalness: .05, emissive: '#fff1c8', emissiveIntensity: .05 });
  const gold = new THREE.MeshStandardMaterial({ color: '#e8c46a', roughness: .25, metalness: .9, emissive: '#7a5a20', emissiveIntensity: .45 });
  const glassMat = new THREE.MeshBasicMaterial({ map: stainedGlass(), transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
  const roseMat = new THREE.MeshBasicMaterial({ map: roseWindow(), transparent: true, opacity: .95, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
  const shaftMat = new THREE.MeshBasicMaterial({ map: shaftTexture(), color: '#fff1c4', transparent: true, opacity: .2, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });

  const W = 3.6, Z = [-5, -2.5, 0, 2.5, 5], COL_H = 6.2, VAULT = 1.5;
  const stoneParts: Part[] = [], goldParts: Part[] = [], glassParts: Part[] = [], roseParts: Part[] = [], shaftParts: Part[] = [];
  // piso de mármore e degraus
  stoneParts.push({ geo: new THREE.CylinderGeometry(R0 + .2, R0 + .45, .2, 48), pos: [0, .1, 0] });
  stoneParts.push({ geo: new THREE.BoxGeometry(W * 2 + 1.4, .16, 13), pos: [0, .28, 0] });
  for (const x of [-W, W]) for (const z of Z) {
    stoneParts.push({ geo: new THREE.BoxGeometry(.95, .45, .95), pos: [x, .55, z] });
    stoneParts.push({ geo: new THREE.CylinderGeometry(.27, .33, COL_H, 12), pos: [x, .55 + COL_H / 2, z] });
    goldParts.push({ geo: new THREE.CylinderGeometry(.5, .3, .38, 12), pos: [x, .55 + COL_H + .19, z] });
  }
  const top = .55 + COL_H + .38;
  // nervuras ogivais da abóbada (atravessam a nave) e arcos laterais entre as colunas
  for (const z of Z) goldParts.push({ geo: new THREE.TorusGeometry(W, .13, 6, 28, Math.PI), pos: [0, top, z], scale: [1, VAULT, 1] });
  for (const x of [-W, W]) for (let i = 0; i < Z.length - 1; i++) {
    const zm = (Z[i] + Z[i + 1]) / 2;
    stoneParts.push({ geo: new THREE.TorusGeometry(1.25, .12, 6, 16, Math.PI), pos: [x, top - .05, zm], rot: [0, Math.PI / 2, 0], scale: [1, 1.3, 1] });
    // vitrais entre as colunas (as "paredes" da igreja)
    glassParts.push({ geo: archWindow(2.1, 5.6), pos: [x, .75, zm], rot: [0, Math.PI / 2, 0] });
  }
  // cumeeira e frisos superiores
  stoneParts.push({ geo: new THREE.BoxGeometry(.24, .24, 10.6), pos: [0, top + W * VAULT, 0] });
  for (const x of [-W, W]) stoneParts.push({ geo: new THREE.BoxGeometry(.32, .3, 10.6), pos: [x, top + .05, 0] });
  // fachada (frente, +z): arco de entrada, rosácea e torre com agulha e cruz de luz
  goldParts.push({ geo: new THREE.TorusGeometry(2.2, .2, 8, 32, Math.PI), pos: [0, top, 6.1], scale: [1, 1.25, 1] });
  roseParts.push({ geo: new THREE.CircleGeometry(1.7, 40), pos: [0, top + 4.4, 6.15] });
  stoneParts.push({ geo: new THREE.TorusGeometry(1.75, .16, 6, 40), pos: [0, top + 4.4, 6.12] });
  stoneParts.push({ geo: new THREE.CylinderGeometry(.9, 1.1, 2.4, 8), pos: [0, top + W * VAULT + 1.2, 5.2] });
  stoneParts.push({ geo: new THREE.ConeGeometry(1.05, 5.2, 8), pos: [0, top + W * VAULT + 5, 5.2] });
  goldParts.push({ geo: new THREE.BoxGeometry(.16, 1.5, .16), pos: [0, top + W * VAULT + 8.3, 5.2] });
  goldParts.push({ geo: new THREE.BoxGeometry(.9, .16, .16), pos: [0, top + W * VAULT + 8.55, 5.2] });
  // abside (fundo, −z): vitral alto atrás do altar e rosácea grande
  glassParts.push({ geo: archWindow(3.2, 6.4), pos: [0, .9, -6.2] });
  roseParts.push({ geo: new THREE.CircleGeometry(2.3, 48), pos: [0, top + 3.6, -6.25] });
  stoneParts.push({ geo: new THREE.TorusGeometry(2.35, .18, 6, 48), pos: [0, top + 3.6, -6.22] });
  // altar
  stoneParts.push({ geo: new THREE.BoxGeometry(2.4, 1, 1), pos: [0, .9, -4.6] });
  goldParts.push({ geo: new THREE.BoxGeometry(2.6, .1, 1.2), pos: [0, 1.45, -4.6] });
  // feixes de luz descendo da abóbada (planos cruzados, leves)
  for (const z of [-3.75, 0, 3.75]) for (const ry of [0, Math.PI / 2]) shaftParts.push({ geo: new THREE.PlaneGeometry(2.6, top + W * VAULT - .4), pos: [0, (top + W * VAULT) / 2 + .2, z], rot: [0, ry, 0] });

  const mk = (parts: Part[], mat: THREE.Material, shadow: boolean) => {
    const m = new THREE.Mesh(bake(parts), mat); m.castShadow = false; m.receiveShadow = shadow || mat === stone || mat === gold; root.add(m); return m;
  };
  // sem projetar sombra: o shadow pass da igreja estacionada não é pré-compilado (evita compilar shader no lançamento)
  mk(stoneParts, stone, false); mk(goldParts, gold, false);
  const glass = mk(glassParts, glassMat, false), rose = mk(roseParts, roseMat, false), shafts = mk(shaftParts, shaftMat, false);
  glass.renderOrder = rose.renderOrder = 3; shafts.renderOrder = 4;
  const height = top + W * VAULT + 9;
  const base = new THREE.Vector3();
  let active = false, scale = 1;

  return {
    root,
    get active() { return active; },
    show(center, R) { base.copy(center); scale = R / R0; root.scale.setScalar(scale); root.position.set(center.x, center.y - height * scale, center.z); active = true; },
    hide() { active = false; root.position.y = PARK_Y; },
    update(t, life, time) {
      if (!active) return;
      // ergue-se do chão (1,4 s, desacelerando) e afunda no último segundo
      const rise = 1 - Math.pow(1 - Math.min(1, t / 1.4), 3), sink = Math.max(0, (t - (life - 1)) / 1);
      root.position.y = base.y - height * scale * (1 - rise + sink * sink);
      const glow = Math.min(1, t / 1.6) * (1 - sink);
      glassMat.opacity = .9 * glow * (.9 + .1 * Math.sin(time * 2.1));
      roseMat.opacity = .95 * glow;
      shaftMat.opacity = .2 * glow * (.75 + .25 * Math.sin(time * 1.3));
      stone.emissiveIntensity = .05 + .1 * glow;
      if (t >= life) this.hide();
    },
  };
}
