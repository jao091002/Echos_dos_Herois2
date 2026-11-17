import * as THREE from 'three';

/*
 * Skinning procedural para modelos estáticos (malhas sem esqueleto, ex.: lobo e demônio gerados por IA).
 * Os próprios grupos do rig procedural viram os ossos de um THREE.Skeleton: o IK das patas, os keyframes de ataque,
 * a cauda e as molas da saia passam a deformar a malha, em vez de carregarem uma estátua rígida.
 *
 *  1. A anatomia do modelo é descrita por segmentos (osso → ponto final) no espaço do root do inimigo.
 *  2. Cada vértice recebe peso dos segmentos mais próximos (distância normalizada pelo raio do membro, com
 *     queda exponencial suave e corte absoluto para membros finos), no máximo 4 ossos.
 *  3. O rig é posto na pose neutra com os pivôs no lugar das juntas do modelo e a malha é ligada (bind) a ele.
 */

export type V3 = [number, number, number];
/** Segmento anatômico: `bone` = índice do osso; r = raio lateral (m); rz = raio em profundidade (tronco elíptico); cut = distância máxima absoluta. */
export type SkinSeg = { bone: number; a: V3; b: V3; r: number; rz?: number; cut?: number; side?: number };

const SHARP = 6.5;

/** Distância normalizada do ponto ao segmento (com raio elíptico opcional) e a distância absoluta. */
function segDistance(x: number, y: number, z: number, s: SkinSeg, out: { n: number; d: number }) {
  const ax = s.a[0], ay = s.a[1], az = s.a[2], bx = s.b[0] - ax, by = s.b[1] - ay, bz = s.b[2] - az;
  const L2 = bx * bx + by * by + bz * bz;
  let t = L2 > 1e-9 ? ((x - ax) * bx + (y - ay) * by + (z - az) * bz) / L2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const dx = x - (ax + bx * t), dy = y - (ay + by * t), dz = z - (az + bz * t);
  const rz = s.rz ?? s.r;
  out.d = Math.sqrt(dx * dx + dy * dy + dz * dz);
  out.n = Math.sqrt((dx * dx + dy * dy) / (s.r * s.r) + (dz * dz) / (rz * rz));
}

/**
 * Calcula skinIndex/skinWeight da geometria. `custom` pode redistribuir os pesos de um vértice (ex.: saia → painéis com mola).
 * Os pesos de cada osso usam o maior valor entre os seus segmentos (um osso pode ter vários, ex.: cabeça + chifres).
 */
export function computeSkin(geo: THREE.BufferGeometry, segs: SkinSeg[], boneCount: number,
  custom?: (x: number, y: number, z: number, w: Float32Array, index: number) => void) {
  const pos = geo.attributes.position as THREE.BufferAttribute, n = pos.count;
  const idx = new Uint16Array(n * 4), wts = new Float32Array(n * 4);
  const w = new Float32Array(boneCount), dn = new Float32Array(segs.length), ok = new Uint8Array(segs.length);
  const tmp = { n: 0, d: 0 };
  for (let i = 0; i < n; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    let best = Infinity, bestAny = Infinity, anyIdx = 0;
    for (let s = 0; s < segs.length; s++) {
      const sg = segs[s];
      segDistance(x, y, z, sg, tmp);
      // lado: membros de um lado não puxam vértices do outro (coxas encostadas, patas)
      const sidePen = sg.side ? Math.max(0, -(x * sg.side) - 0.012) * 40 : 0;
      dn[s] = tmp.n + sidePen;
      ok[s] = sg.cut === undefined || tmp.d <= sg.cut ? 1 : 0;
      if (ok[s] && dn[s] < best) best = dn[s];
      if (dn[s] < bestAny) { bestAny = dn[s]; anyIdx = s; }
    }
    w.fill(0);
    if (best === Infinity) { ok.fill(0); ok[anyIdx] = 1; best = bestAny; }
    for (let s = 0; s < segs.length; s++) {
      if (!ok[s]) continue;
      const e = dn[s] - best; if (e > 1.4) continue;
      const v = Math.exp(-SHARP * e), b = segs[s].bone;
      if (v > w[b]) w[b] = v;
    }
    custom?.(x, y, z, w, i);
    // 4 maiores, normalizados
    for (let k = 0; k < 4; k++) {
      let bi = 0, bv = -1;
      for (let b = 0; b < boneCount; b++) if (w[b] > bv) { bv = w[b]; bi = b; }
      idx[i * 4 + k] = bi; wts[i * 4 + k] = bv > 0 ? bv : 0; w[bi] = -1;
    }
    const sum = wts[i * 4] + wts[i * 4 + 1] + wts[i * 4 + 2] + wts[i * 4 + 3] || 1;
    for (let k = 0; k < 4; k++) wts[i * 4 + k] /= sum;
  }
  geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(idx, 4));
  geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(wts, 4));
}

/**
 * Corta costuras falsas: malhas geradas por IA (e a redução por agrupamento de vértices) unem superfícies que só se
 * encostam (luva × vestido). Esses triângulos ligam ossos de cadeias diferentes e viram lâminas esticadas quando o
 * membro se afasta; são removidos. `allowed(a, b)` diz se dois ossos dominantes podem dividir um triângulo.
 */
export function tearSeams(geo: THREE.BufferGeometry, allowed: (a: number, b: number, yMax: number) => boolean) {
  const idx = geo.index; if (!idx) return 0;
  const dom = dominantBones(geo), pos = geo.attributes.position as THREE.BufferAttribute;
  const keep: number[] = []; let removed = 0;
  for (let t = 0; t < idx.count; t += 3) {
    const i0 = idx.getX(t), i1 = idx.getX(t + 1), i2 = idx.getX(t + 2), a = dom[i0], b = dom[i1], c = dom[i2];
    const y = Math.max(pos.getY(i0), pos.getY(i1), pos.getY(i2));
    if (allowed(a, b, y) && allowed(b, c, y) && allowed(a, c, y)) keep.push(i0, i1, i2);
    else removed++;
  }
  if (removed) geo.setIndex(new THREE.BufferAttribute(pos.count > 65535 ? new Uint32Array(keep) : new Uint16Array(keep), 1));
  return removed;
}

/** Distância (m) do ponto ao segmento a→b. */
export function segDist(x: number, y: number, z: number, a: V3, b: V3) {
  const o = { n: 0, d: 0 };
  segDistance(x, y, z, { bone: 0, a, b, r: 1 }, o);
  return o.d;
}

/** Osso de maior peso de cada vértice. */
export function dominantBones(geo: THREE.BufferGeometry) {
  const si = geo.attributes.skinIndex as THREE.BufferAttribute, sw = geo.attributes.skinWeight as THREE.BufferAttribute;
  const dom = new Int16Array(si.count);
  for (let i = 0; i < si.count; i++) {
    let b = 0, w = -1;
    for (let k = 0; k < 4; k++) { const v = sw.getComponent(i, k); if (v > w) { w = v; b = si.getComponent(i, k); } }
    dom[i] = b;
  }
  return dom;
}

/**
 * Peças pequenas e soltas (enfeites, pingentes) cujo centro está colado a um membro passam a segui-lo por inteiro,
 * em vez de ficarem flutuando quando o membro se move. `pick(cx, cy, cz)` devolve o osso do membro ou -1.
 */
export function adoptFragments(geo: THREE.BufferGeometry, maxVerts: number, maxSize: number, pick: (x: number, y: number, z: number) => number) {
  const idx = geo.index, pos = geo.attributes.position as THREE.BufferAttribute; if (!idx) return 0;
  const n = pos.count, parent = new Int32Array(n);
  for (let i = 0; i < n; i++) parent[i] = i;
  const find = (i: number) => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
  for (let t = 0; t < idx.count; t += 3) {
    const a = find(idx.getX(t)), b = find(idx.getX(t + 1)), c = find(idx.getX(t + 2));
    parent[b] = a; parent[find(c)] = a;
  }
  type Comp = { n: number; x: number; y: number; z: number; box: THREE.Box3 };
  const count = new Map<number, Comp>(), v = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const r = find(i); let c = count.get(r); if (!c) count.set(r, c = { n: 0, x: 0, y: 0, z: 0, box: new THREE.Box3() });
    c.n++; c.x += pos.getX(i); c.y += pos.getY(i); c.z += pos.getZ(i); c.box.expandByPoint(v.fromBufferAttribute(pos, i));
  }
  const target = new Map<number, number>(), size = new THREE.Vector3();
  for (const [r, c] of count) {
    if (c.n > maxVerts || c.box.getSize(size).length() > maxSize) continue;
    const b = pick(c.x / c.n, c.y / c.n, c.z / c.n); if (b >= 0) target.set(r, b);
  }
  if (!target.size) return 0;
  const si = geo.attributes.skinIndex as THREE.BufferAttribute, sw = geo.attributes.skinWeight as THREE.BufferAttribute;
  let moved = 0;
  for (let i = 0; i < n; i++) {
    const b = target.get(find(i)); if (b === undefined) continue;
    si.setXYZW(i, b, 0, 0, 0); sw.setXYZW(i, 1, 0, 0, 0); moved++;
  }
  si.needsUpdate = sw.needsUpdate = true;
  return moved;
}

/**
 * Liga a malha aos grupos do rig (que precisam estar na pose de ligação, com matrixWorld atualizada).
 * A malha fica no `owner` (root do inimigo) na origem: o espaço da geometria = espaço local do root.
 * Modo "attached": a posição final vem só dos ossos, então a malha pode ficar em qualquer lugar da hierarquia.
 */
export function bindSkin(owner: THREE.Object3D, geo: THREE.BufferGeometry, material: THREE.Material, bones: THREE.Object3D[]) {
  const mesh = new THREE.SkinnedMesh(geo, material);
  mesh.castShadow = true; mesh.receiveShadow = true;
  // esfera fixa no espaço do inimigo (cobre lobo e demônio em qualquer pose): o frustum culling volta a valer,
  // e inimigos fora da tela (ou fora da área de sombra) deixam de ser desenhados
  mesh.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 1.1, 0), 2.6);
  owner.add(mesh); owner.updateMatrixWorld(true);
  // Skeleton aceita qualquer Object3D como osso (usa só matrixWorld); os inversos saem da pose atual
  const skeleton = new THREE.Skeleton(bones as unknown as THREE.Bone[]);
  mesh.bind(skeleton, mesh.matrixWorld);
  return mesh;
}

/**
 * Leitor da cor da textura base nas UVs de cada vértice (sRGB 0..1), para separar partes que se encostam
 * (ex.: luva × vestido). Retorna null se a imagem não puder ser lida (o skin segue só pela distância).
 */
export function textureSampler(map: THREE.Texture | null | undefined) {
  const img = map?.image as CanvasImageSource & { width: number; height: number } | undefined;
  if (!img || !img.width || !img.height || typeof document === 'undefined') return null;
  try {
    const W = Math.min(512, img.width), H = Math.min(512, img.height);
    const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true }); if (!ctx) return null;
    ctx.drawImage(img, 0, 0, W, H);
    const px = ctx.getImageData(0, 0, W, H).data, flip = map!.flipY;
    return (u: number, v: number, out: [number, number, number]) => {
      u -= Math.floor(u); v -= Math.floor(v); if (flip) v = 1 - v;
      const o = (Math.min(H - 1, Math.floor(v * H)) * W + Math.min(W - 1, Math.floor(u * W))) * 4;
      out[0] = px[o] / 255; out[1] = px[o + 1] / 255; out[2] = px[o + 2] / 255;
      return out;
    };
  } catch { return null; }
}

/** Põe o pivô `obj` no ponto `p` (espaço do `root`), mantendo a rotação local. Exige matrizes do pai atualizadas. */
export function placeAt(root: THREE.Object3D, obj: THREE.Object3D, p: V3) {
  const parent = obj.parent!;
  parent.updateWorldMatrix(true, false);
  const v = root.localToWorld(new THREE.Vector3(p[0], p[1], p[2]));
  obj.position.copy(parent.worldToLocal(v));
  obj.updateMatrixWorld(true);
}

/** Converte um ponto do espaço do `root` para o espaço local de `obj`. */
export function toLocal(root: THREE.Object3D, obj: THREE.Object3D, p: V3) {
  obj.updateWorldMatrix(true, false);
  return obj.worldToLocal(root.localToWorld(new THREE.Vector3(p[0], p[1], p[2])));
}
