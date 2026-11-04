import * as THREE from 'three';

export type WorldCollider = { x: number; z: number; radius: number };
export type WorldParts = { ground: THREE.Mesh; blockers: THREE.Object3D[]; colliders: WorldCollider[]; rune: THREE.Group };
export type WorldQuality = 'Baixa' | 'Média' | 'Alta';

type Flier = { cx: number; cz: number; sp: number; ph: number; sc: number; rad: number; alt: number };
type Environment = {
  grass: THREE.InstancedMesh; grassMaterial: THREE.Material; bloomMeshes: THREE.InstancedMesh[];
  moteMaterial: THREE.PointsMaterial; motes: THREE.Points; skyMaterial: THREE.ShaderMaterial;
  sunDisc: THREE.Mesh; moon: THREE.Mesh; scalable: THREE.InstancedMesh[];
  butterflies: THREE.InstancedMesh; birds: THREE.InstancedMesh; butterflyData: Flier[]; birdData: Flier[];
  crystal: THREE.Mesh; crystalBase: number; orbit: THREE.Group; crystalMaterial: THREE.MeshStandardMaterial;
  glyphMaterial: THREE.MeshStandardMaterial; ringMaterial: THREE.MeshBasicMaterial; stoneLight: THREE.PointLight;
  glow: number;
};

const { smoothstep, lerp } = THREE.MathUtils;
const TIME = { value: 0 }; // uniform compartilhado: vento, água, céu, brilho
const temp = new THREE.Object3D();
const tmpColor = new THREE.Color();
const tmpV = new THREE.Vector3();
const POND = { x: -24, z: 16, r: 9 };
const WATER_Y = -.3;
const FOLIAGE = ['#4d7356', '#66855e', '#82956a', '#506c64', '#758b58'];
const PINES = ['#2f5440', '#3a6249', '#2b4c3d', '#42694e'];
const GRASS = ['#7aa254', '#8cb060', '#6a9648', '#98b462', '#82a65a'];
const BLOOMS = ['#f2e3a0', '#e59a94', '#f0efe0', '#b9a6e0', '#f6c86a'];
const ROCKS = ['#8a8b7e', '#7b7d72', '#9a968a', '#6f7768', '#847a6a'];

/* ───────────── ruído e utilidades ───────────── */
function seeded(n: number) { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); }
function h3(x: number, y: number, z: number, s: number) { const v = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + s) * 43758.5453; return v - Math.floor(v); }
function vnoise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = seeded(ix + iy * 57), b = seeded(ix + 1 + iy * 57), c = seeded(ix + (iy + 1) * 57), d = seeded(ix + 1 + (iy + 1) * 57);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, y: number, oct = 4) {
  let s = 0, a = .5;
  for (let i = 0; i < oct; i++) { s += vnoise(x, y) * a; x = x * 2.03 + 17; y = y * 2.03 + 9; a *= .5; }
  return s;
}
function pathX(z: number) { const t = (10 - z) / 31; return Math.sin(t * Math.PI * 1.15) * 1.5; }
function nearPath(x: number, z: number, pad: number) { return z > -22 - pad && z < 11 + pad && Math.abs(x - pathX(z)) < 1.7 + pad; }
function pondDist(x: number, z: number) { return Math.hypot(x - POND.x, z - POND.z); }

export function terrainHeight(x: number, z: number) {
  const meadowFade = smoothstep(Math.hypot(x * .72, z + 1) - 12, 0, 24);
  const edge = 1 - smoothstep(Math.hypot(x, z), 92, 124);
  const broad = Math.max(0, fbm(x * .021 + 4.3, z * .021 - 2.7) - .36) * 13;
  const detail = (fbm(x * .11 + 19, z * .11 + 7, 3) - .5) * .7;
  const h = (broad + detail) * meadowFade * edge;
  const p = 1 - smoothstep(pondDist(x, z), POND.r * .45, POND.r * 1.7);
  return lerp(h, -1.05, p * p * (3 - 2 * p));
}

/* ───────────── geometria procedural ───────────── */
// Pedra lascada: deslocamento determinístico por posição (sem rachaduras) + cor por vértice + musgo no topo.
function stoneify(g: THREE.BufferGeometry, amp: number, color: string, moss = 0) {
  g.computeBoundingBox();
  const top = g.boundingBox!.max.y, span = Math.max(.01, top - g.boundingBox!.min.y);
  const p = g.attributes.position as THREE.BufferAttribute;
  const col = new Float32Array(p.count * 3);
  const base = new THREE.Color(color), mossC = new THREE.Color('#6d8a49'), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const ox = p.getX(i), oy = p.getY(i), oz = p.getZ(i);
    p.setXYZ(i, ox + (h3(ox, oy, oz, 1) - .5) * amp, oy + (h3(ox, oy, oz, 2) - .5) * amp, oz + (h3(ox, oy, oz, 3) - .5) * amp);
    c.copy(base).multiplyScalar(.7 + vnoise(ox * 2.1 + oz * 1.3, oy * 2.4 + ox) * .55);
    if (moss) c.lerp(mossC, smoothstep(oy, top - span * .35, top) * moss);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}

function makeGrassGeometry(blades: number) {
  const pos: number[] = [], col: number[] = [], idx: number[] = [];
  for (let b = 0; b < blades; b++) {
    const a = seeded(b * 7 + 1) * 6.283, d = .02 + seeded(b * 3 + 2) * .17;
    const ox = Math.cos(a) * d, oz = Math.sin(a) * d, dir = seeded(b * 5 + 3) * 6.283;
    const h = .3 + seeded(b * 11 + 4) * .34, w = .03 + seeded(b + 9) * .016, lean = .04 + seeded(b * 13 + 5) * .13;
    const cx = Math.cos(dir), cz = Math.sin(dir), s = pos.length / 3;
    pos.push(ox - cz * w, 0, oz + cx * w, ox + cz * w, 0, oz - cx * w, ox + cx * lean, h, oz + cz * lean);
    col.push(.4, .45, .35, .4, .45, .35, 1.05, 1.05, .8);
    idx.push(s, s + 1, s + 2, s, s + 2, s + 1); // as duas faces, sem depender de DoubleSide
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(pos.map((_, i) => (i % 3 === 1 ? 1 : 0)), 3)); // normal para cima = luz suave
  g.setIndex(idx);
  return g;
}

function makeWings(span: number, chord: number) {
  const pos: number[] = [], idx: number[] = [];
  [-1, 1].forEach((s, k) => {
    const o = k * 4;
    pos.push(0, 0, chord * .4, s * span, 0, chord * .1, s * span * .9, 0, -chord * .55, 0, 0, -chord * .35);
    idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  return g;
}

function makeMountainRing(radius: number, maxH: number, seed: number, rows: string[]) {
  const seg = 200, vertices: number[] = [], colors: number[] = [], indices: number[] = [];
  const cols = rows.map(r => new THREE.Color(r)), fr = [0, .5, .8, 1];
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    const ridge = 1 - Math.abs(fbm(Math.cos(a) * 3.7 + seed * 11, Math.sin(a) * 3.7 + seed * 7) * 2 - 1);
    const jag = Math.sin(a * 61 + seed) * .5 + Math.sin(a * 137 + seed * 2) * .3;
    const peak = 6 + Math.pow(ridge, 1.8) * maxH + jag * maxH * .05;
    for (let r = 0; r < 4; r++) {
      vertices.push(Math.cos(a) * radius, -8 + (peak + 8) * fr[r], Math.sin(a) * radius);
      colors.push(cols[r].r, cols[r].g, cols[r].b);
      if (i < seg && r < 3) { const q = i * 4 + r; indices.push(q, q + 4, q + 1, q + 1, q + 4, q + 5); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.setIndex(indices); g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: THREE.DoubleSide }));
  m.name = 'distant-mountain-ridge'; return m;
}

function makeRibbon(points: THREE.Vector3[], widths: number[], material: THREE.Material, center: string, edge: string) {
  const vertices: number[] = [], colors: number[] = [], indices: number[] = [];
  const cc = new THREE.Color(center), ec = new THREE.Color(edge);
  points.forEach((point, i) => {
    const before = points[Math.max(0, i - 1)], after = points[Math.min(points.length - 1, i + 1)];
    const t = after.clone().sub(before).normalize();
    const w = widths[i] * (.88 + vnoise(i * .7, 3) * .24) / 2;
    const side = new THREE.Vector3(-t.z, 0, t.x).multiplyScalar(w);
    [point.clone().add(side), point.clone(), point.clone().sub(side)].forEach((v, k) => {
      vertices.push(v.x, terrainHeight(v.x, v.z) + .08, v.z);
      const c = k === 1 ? cc : ec; colors.push(c.r, c.g, c.b);
    });
    if (i < points.length - 1) { const q = i * 3; indices.push(q, q + 3, q + 1, q + 1, q + 3, q + 4, q + 1, q + 4, q + 2, q + 2, q + 4, q + 5); }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.setIndex(indices); g.computeVertexNormals();
  return new THREE.Mesh(g, material);
}

function glowTexture() {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d')!, gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ───────────── materiais com vento / fade de câmera ───────────── */
function patch(material: THREE.Material, key: string, o: { fade?: boolean; sway?: [number, number] } = {}) {
  const fade = !!o.fade;
  if (fade) (material as THREE.MeshStandardMaterial).alphaHash = true;
  material.onBeforeCompile = shader => {
    shader.uniforms.uTime = TIME;
    const sway = o.sway ? `float sw = sin(uTime * 1.1 + ip.x * .23 + ip.z * .19);
      float bend = max(position.y + ${o.sway[1].toFixed(2)}, 0.0);
      transformed.x += sw * ${o.sway[0].toFixed(3)} * bend;
      transformed.z += sw * ${(o.sway[0] * .5).toFixed(3)} * bend;` : '';
    shader.vertexShader = `uniform float uTime;\n${fade ? 'varying vec3 vFadePos;\n' : ''}${shader.vertexShader}`.replace('#include <begin_vertex>', `#include <begin_vertex>
      vec3 ip = vec3(0.0); mat4 im = mat4(1.0);
      #ifdef USE_INSTANCING
      im = instanceMatrix; ip = instanceMatrix[3].xyz;
      #endif
      ${sway}
      ${fade ? 'vFadePos = (modelMatrix * im * vec4(transformed, 1.0)).xyz;' : ''}`);
    if (fade) shader.fragmentShader = `varying vec3 vFadePos;\n${shader.fragmentShader}`.replace('#include <color_fragment>',
      '#include <color_fragment>\ndiffuseColor.a *= smoothstep(1.4, 4.6, distance(vFadePos, cameraPosition));');
  };
  material.customProgramCacheKey = () => key;
  return material;
}

function flapMaterial(speed: number, amp: number, key: string) {
  const m = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  m.onBeforeCompile = shader => {
    shader.uniforms.uTime = TIME;
    shader.vertexShader = `uniform float uTime;\n${shader.vertexShader}`.replace('#include <begin_vertex>', `#include <begin_vertex>
      float fl = sin(uTime * ${speed.toFixed(1)} + float(gl_InstanceID) * 2.7);
      transformed.y += abs(position.x) * fl * ${amp.toFixed(2)};
      transformed.x *= 1.0 - 0.22 * abs(fl);`);
  };
  m.customProgramCacheKey = () => key;
  return m;
}

/* ───────────── monumento ───────────── */
function makeLandmark(scene: THREE.Scene, stoneMat: THREE.Material, colliders: WorldCollider[], blockers: THREE.Object3D[]) {
  const group = new THREE.Group();
  group.name = 'hero-marker';
  group.position.set(0, terrainHeight(0, -12), -12);
  const add = (g: THREE.BufferGeometry, y: number, color: string, amp = .06, moss = 0) => {
    const m = new THREE.Mesh(stoneify(g, amp, color, moss), stoneMat);
    m.position.y = y; m.castShadow = m.receiveShadow = true; group.add(m); return m;
  };
  add(new THREE.CylinderGeometry(2.9, 3.1, .35, 12, 2), .17, '#6b7168', .08, .5);
  add(new THREE.CylinderGeometry(2.4, 2.7, .28, 12, 2), .49, '#8c8c7c', .07, .4);
  add(new THREE.CylinderGeometry(1.8, 2.05, .24, 12, 2), .75, '#a5a28d', .05, .3);

  const shaftGeo = new THREE.BoxGeometry(1.15, 3.6, .7, 3, 8, 2);
  const sp = shaftGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < sp.count; i++) { const k = 1 - (sp.getY(i) + 1.8) / 3.6 * .22; sp.setX(i, sp.getX(i) * k); sp.setZ(i, sp.getZ(i) * k); }
  const shaft = add(shaftGeo, 2.67, '#aaa58f', .05, .35); shaft.rotation.z = -.04;
  add(new THREE.BoxGeometry(1.42, .18, .82, 3, 1, 2), 4.55, '#6f766b', .04);
  const crown = add(new THREE.ConeGeometry(.82, .8, 4, 1, false), 5.04, '#aaa58f', .03); crown.rotation.y = Math.PI / 4;

  const gold = new THREE.MeshStandardMaterial({ color: '#d8c38e', roughness: .4, metalness: .45, emissive: '#685532', emissiveIntensity: .25 });
  const medallion = new THREE.Mesh(new THREE.TorusGeometry(.31, .05, 10, 36), gold); medallion.position.set(0, 3.0, .38); group.add(medallion);
  const inset = new THREE.Mesh(new THREE.OctahedronGeometry(.15, 0), gold); inset.position.set(0, 3.0, .43); group.add(inset);

  const glyphMaterial = new THREE.MeshStandardMaterial({ color: '#16322d', emissive: '#6ff0d0', emissiveIntensity: .8, roughness: .5 });
  ([[0, 2.2, .05, .5], [-.22, 3.65, .26, .05], [.22, 3.65, .26, .05], [0, 3.8, .05, .36], [-.26, 1.95, .24, .05], [.26, 1.95, .24, .05]] as number[][])
    .forEach(([x, y, w, h]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, .02), glyphMaterial); m.position.set(x, y, .355); group.add(m); });

  const rune = new THREE.Group(); rune.name = 'marker-rune'; rune.position.set(0, 3.0, .6);
  for (let i = 0; i < 5; i++) {
    const f = new THREE.Mesh(new THREE.SphereGeometry(.04, 8, 6), new THREE.MeshBasicMaterial({ color: '#bffff0' }));
    const a = (i / 5) * Math.PI * 2; f.position.set(Math.cos(a) * .68, Math.sin(a) * .54, 0); rune.add(f);
  }
  group.add(rune);

  const crystalMaterial = new THREE.MeshStandardMaterial({ color: '#bff4e6', emissive: '#5fe0c4', emissiveIntensity: 1, roughness: .15, metalness: .1, transparent: true, opacity: .93, flatShading: true });
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(.34, 0), crystalMaterial);
  crystal.scale.set(1, 1.8, 1); crystal.position.y = 6.5; crystal.castShadow = true; group.add(crystal);
  const crystalLight = new THREE.PointLight('#7fead0', 1.1, 11, 2); crystal.add(crystalLight);
  const orbit = new THREE.Group(); orbit.position.y = 6.5;
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Mesh(new THREE.OctahedronGeometry(.1, 0), crystalMaterial); const a = i / 3 * Math.PI * 2;
    s.position.set(Math.cos(a) * .85, Math.sin(a * 2) * .2, Math.sin(a) * .85); orbit.add(s);
  }
  group.add(orbit);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: '#7ad8c0', transparent: true, opacity: .18, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(new THREE.RingGeometry(3.15, 3.95, 56), ringMaterial); ring.rotation.x = -Math.PI / 2; ring.position.y = .06; group.add(ring);

  const stoneLight = new THREE.PointLight('#d9c78e', .65, 9, 2); stoneLight.position.set(0, 2.8, 1.5); group.add(stoneLight);

  // círculo de pedras erguidas (abre passagem para a trilha)
  for (let k = 0; k < 9; k++) {
    const a = k / 9 * Math.PI * 2 + .3;
    if (Math.abs(Math.cos(a)) < .3) continue;
    const x = Math.cos(a) * 7, z = -12 + Math.sin(a) * 7, hgt = 1.7 + seeded(k + 40) * 1.2;
    const m = new THREE.Mesh(stoneify(new THREE.BoxGeometry(.75, hgt, .55, 2, 4, 2), .12, '#8e8e80', .5), stoneMat);
    m.position.set(x, terrainHeight(x, z) + hgt / 2 - .1, z); m.rotation.set((seeded(k + 70) - .5) * .12, seeded(k + 80) * 3, (seeded(k + 90) - .5) * .14);
    m.castShadow = m.receiveShadow = true; scene.add(m); blockers.push(m); colliders.push({ x, z, radius: .5 });
  }
  scene.add(group);
  return { group, rune, crystal, orbit, crystalMaterial, glyphMaterial, ringMaterial, stoneLight };
}

/* ───────────── mundo ───────────── */
export function createWorld(scene: THREE.Scene): WorldParts {
  const blockers: THREE.Object3D[] = [];
  const colliders: WorldCollider[] = [];
  const scalable: THREE.InstancedMesh[] = [];
  const keepMax = (m: THREE.InstancedMesh) => { m.userData.maxInstances = m.count; m.frustumCulled = false; scalable.push(m); return m; };
  const stoneMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .93, flatShading: true });

  // terreno com cor por altura / inclinação / margem do lago
  const gg = new THREE.PlaneGeometry(260, 260, 180, 180);
  const gp = gg.attributes.position;
  for (let i = 0; i < gp.count; i++) gp.setZ(i, terrainHeight(gp.getX(i), -gp.getY(i)));
  gg.computeVertexNormals();
  const gn = gg.attributes.normal, gc = new Float32Array(gp.count * 3);
  const C = { lush: new THREE.Color('#6f9552'), dark: new THREE.Color('#4f7440'), dry: new THREE.Color('#a3a366'), rock: new THREE.Color('#85836f'), sand: new THREE.Color('#b9a97e'), mud: new THREE.Color('#665641') };
  const col = new THREE.Color();
  for (let i = 0; i < gp.count; i++) {
    const x = gp.getX(i), z = -gp.getY(i), h = gp.getZ(i), dp = pondDist(x, z), slope = 1 - gn.getZ(i);
    col.copy(C.lush).lerp(C.dark, smoothstep(fbm(x * .045, z * .045), .35, .6))
      .lerp(C.dry, smoothstep(vnoise(x * .35, z * .35), .5, .95) * .45 + smoothstep(h, 2.2, 5.5) * .35)
      .lerp(C.rock, smoothstep(slope, .05, .2) * .85)
      .lerp(C.sand, smoothstep(dp, POND.r * .6, POND.r) * (1 - smoothstep(dp, POND.r * 1.15, POND.r * 1.6)) * .8)
      .lerp(C.mud, (1 - smoothstep(dp, POND.r * .3, POND.r * .95)) * .85);
    gc[i * 3] = col.r; gc[i * 3 + 1] = col.g; gc[i * 3 + 2] = col.b;
  }
  gg.setAttribute('color', new THREE.BufferAttribute(gc, 3));
  const groundMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .97 });
  groundMaterial.onBeforeCompile = shader => {
    shader.vertexShader = `varying vec3 vMeadowPosition;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\nvMeadowPosition = (modelMatrix * vec4(position, 1.0)).xyz;');
    shader.fragmentShader = `varying vec3 vMeadowPosition;\n${shader.fragmentShader}`.replace('#include <color_fragment>', `#include <color_fragment>
      float broad = sin(vMeadowPosition.x * .19 + sin(vMeadowPosition.z * .13)) * cos(vMeadowPosition.z * .16);
      float fine = sin(vMeadowPosition.x * 2.7 + vMeadowPosition.z * 1.9) * cos(vMeadowPosition.z * 2.4 - vMeadowPosition.x * .7);
      float grain = fract(sin(dot(floor(vMeadowPosition.xz * 12.0), vec2(12.9898, 78.233))) * 43758.5453);
      diffuseColor.rgb *= 0.95 + broad * .05 + fine * .02 + grain * .07;`);
  };
  groundMaterial.customProgramCacheKey = () => 'aurora-meadow-v3';
  const ground = new THREE.Mesh(gg, groundMaterial);
  ground.name = 'ground'; ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  const far = new THREE.Mesh(new THREE.CircleGeometry(300, 48), new THREE.MeshStandardMaterial({ color: '#667a52', roughness: 1 }));
  far.rotation.x = -Math.PI / 2; far.position.y = -.15; scene.add(far);

  // céu: gradiente, nuvens animadas, estrelas e brilho do sol
  const skyMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uDaylight: { value: .18 }, uDusk: { value: 1 }, uTime: TIME, uSunDir: { value: new THREE.Vector3(0, 1, 0) } },
    vertexShader: `varying vec3 vDir; void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vDir = wp.xyz - cameraPosition; gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: `uniform float uDaylight; uniform float uDusk; uniform float uTime; uniform vec3 uSunDir; varying vec3 vDir;
      float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1.,0.)),f.x),mix(hs(i+vec2(0.,1.)),hs(i+vec2(1.,1.)),f.x),f.y);}
      float fb(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=ns(p)*a;p=p*2.03+7.3;a*=.5;}return s;}
      void main(){
        vec3 d = normalize(vDir);
        float h = smoothstep(-.28, .78, d.y);
        vec3 horizon = mix(mix(vec3(.09,.13,.2), vec3(.82,.57,.48), uDusk), vec3(.62,.76,.83), uDaylight);
        vec3 zenith = mix(vec3(.05,.08,.16), vec3(.3,.52,.68), uDaylight);
        vec3 col = mix(horizon, zenith, pow(h, .72));
        float sd = max(dot(d, uSunDir), 0.);
        col += vec3(1.,.72,.45) * (pow(sd,48.)*.55 + pow(sd,6.)*.18) * (.25 + uDusk*.75) * smoothstep(-.2,.1,uSunDir.y);
        float cm = smoothstep(0., .22, d.y);
        vec2 uv = d.xz / (max(d.y, 0.) + .18) * 1.15 + vec2(uTime*.012, uTime*.005);
        float c = smoothstep(.46, .8, fb(uv)) * cm;
        vec3 q = floor(d * 160.);
        float r = fract(sin(dot(q, vec3(12.9898,78.233,37.719))) * 43758.5453);
        float star = step(.9972, r) * (1.-uDaylight) * smoothstep(.02,.3,d.y) * (.6 + .4*sin(uTime*2. + r*90.));
        col += vec3(star) * (1. - c);
        vec3 cl = mix(vec3(.2,.24,.34), vec3(1.), uDaylight);
        cl = mix(cl, vec3(1.,.7,.55), uDusk*.55);
        float shade = smoothstep(.45, .95, fb(uv*1.7 + 3.1));
        vec3 cc = cl * (1. - shade*.28) + vec3(1.,.8,.6) * pow(sd,5.) * .25 * uDaylight;
        gl_FragColor = vec4(mix(col, cc, c*.9), 1.);
      }`,
  });
  const skyDome = new THREE.Mesh(new THREE.SphereGeometry(220, 40, 24), skyMaterial);
  skyDome.name = 'atmosphere-sky-dome'; skyDome.frustumCulled = false; skyDome.renderOrder = -1000; scene.add(skyDome);
  const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(2.7, 24, 16), new THREE.MeshBasicMaterial({ color: '#ffe0ad', fog: false }));
  sunDisc.name = 'soft-sun-disc'; scene.add(sunDisc);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(2.1, 24, 16), new THREE.MeshBasicMaterial({ color: '#dfe6f2', fog: false }));
  moon.name = 'moon'; scene.add(moon);

  scene.add(
    makeMountainRing(150, 26, 1, ['#2f4a3a', '#43604a', '#66756c', '#8b9794']),
    makeMountainRing(174, 36, 2, ['#425c52', '#587068', '#7b8b88', '#a2b0b2']),
    makeMountainRing(198, 46, 3, ['#586f6c', '#6e8582', '#92a2a2', '#c4d0d4']),
  );

  // lago animado
  const waterMaterial = new THREE.MeshStandardMaterial({ color: '#3f6f7d', roughness: .06, metalness: .15, transparent: true, opacity: .85 });
  waterMaterial.onBeforeCompile = shader => {
    shader.uniforms.uTime = TIME; shader.uniforms.uPond = { value: new THREE.Vector3(POND.x, POND.z, 15) };
    shader.vertexShader = `varying vec3 vWPos;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = `uniform float uTime; uniform vec3 uPond; varying vec3 vWPos;\n${shader.fragmentShader}`
      .replace('#include <color_fragment>', `#include <color_fragment>
        float rr = length(vWPos.xz - uPond.xy) / uPond.z;
        diffuseColor.rgb = mix(vec3(.04,.16,.2), vec3(.22,.48,.46), smoothstep(0., .75, rr));
        diffuseColor.a *= (1. - smoothstep(.6, .98, rr)) * .8 + .12;`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        vec2 wp = vWPos.xz;
        float w1 = sin(wp.x*1.7 + uTime*1.3) * cos(wp.y*1.3 - uTime*.9);
        float w2 = sin(wp.x*4.1 - uTime*2.1 + wp.y*2.3) * .5;
        normal = normalize(normal + (viewMatrix * vec4(w1*.05 + w2*.03, 0., (w1+w2)*.04, 0.)).xyz);`);
  };
  waterMaterial.customProgramCacheKey = () => 'aurora-water-v1';
  const water = new THREE.Mesh(new THREE.CircleGeometry(15, 56), waterMaterial);
  water.rotation.x = -Math.PI / 2; water.position.set(POND.x, WATER_Y, POND.z); water.renderOrder = 2; scene.add(water);

  const padGeo = new THREE.CircleGeometry(.4, 12, .3, 5.7); padGeo.rotateX(-Math.PI / 2);
  const pads = new THREE.InstancedMesh(padGeo, new THREE.MeshStandardMaterial({ color: '#4f7f46', roughness: .7, side: THREE.DoubleSide }), 18);
  for (let i = 0; i < 18; i++) {
    const a = seeded(i + 5100) * 6.28, d = Math.sqrt(seeded(i + 5200)) * POND.r * .85;
    temp.position.set(POND.x + Math.cos(a) * d, WATER_Y + .02, POND.z + Math.sin(a) * d); temp.rotation.set(0, seeded(i + 5300) * 6.28, 0); temp.scale.setScalar(.7 + seeded(i + 5400)); temp.updateMatrix(); pads.setMatrixAt(i, temp.matrix);
  }
  pads.receiveShadow = true; scene.add(pads);

  // árvores: folhosas (copas orgânicas) e pinheiros, balançando ao vento
  const trunkGeo = new THREE.CylinderGeometry(.16, .3, 1, 8, 4);
  const tp = trunkGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < tp.count; i++) {
    const x = tp.getX(i), y = tp.getY(i), z = tp.getZ(i), f = (y < -.3 ? 1 + (-.3 - y) * 1.4 : 1) * (1 + (h3(x, y, z, 5) - .5) * .12);
    tp.setXYZ(i, x * f, y, z * f);
  }
  trunkGeo.computeVertexNormals();
  const leafGeo = new THREE.SphereGeometry(1, 10, 8);
  const lp = leafGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < lp.count; i++) {
    const x = lp.getX(i), y = lp.getY(i), z = lp.getZ(i);
    const k = 1 + (Math.sin(x * 3.1 + y * 2.3) * Math.sin(z * 3.7 + x * 1.9) * .5 + Math.sin(y * 5.3 + z * 4.1) * .25) * .22;
    lp.setXYZ(i, x * k, y * k, z * k);
  }
  leafGeo.computeVertexNormals();
  const pineGeo = new THREE.ConeGeometry(1, 1.5, 10, 2);
  const pp = pineGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pp.count; i++) {
    const x = pp.getX(i), y = pp.getY(i), z = pp.getZ(i), k = 1 + Math.sin(Math.atan2(z, x) * 7 + y * 4) * .07;
    pp.setXYZ(i, x * k, y, z * k);
  }
  pineGeo.computeVertexNormals();

  const MAXT = 170;
  const trunks = new THREE.InstancedMesh(trunkGeo, patch(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .95 }), 'aurora-trunk-v2', { fade: true }), MAXT);
  const crowns = new THREE.InstancedMesh(leafGeo, patch(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .92 }), 'aurora-leaf-v2', { fade: true, sway: [.045, 1] }), MAXT * 6);
  const tiers = new THREE.InstancedMesh(pineGeo, patch(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .94 }), 'aurora-pine-v2', { fade: true, sway: [.03, .75] }), MAXT * 4);
  const crownShapes = [[0, 3.15, 0, 1.24], [-.73, 3.46, .13, .91], [.73, 3.53, -.13, .92], [-.3, 4.1, .1, .78], [.42, 4.18, -.12, .8], [.05, 4.72, 0, .56]];
  const tierShapes = [[2.1, 1.35, 1.35], [3.0, 1.1, 1.1], [3.8, .85, .9], [4.6, .6, .75]];
  let nt = 0, nc = 0, np = 0;
  for (let i = 0; i < 480 && nt < MAXT; i++) {
    const a = seeded(i + 3) * Math.PI * 2, rad = 16 + seeded(i + 90) * 54;
    const x = Math.cos(a) * rad, z = Math.sin(a) * rad;
    if (Math.abs(x) < 12 && z > -22 && z < 12) continue;
    if (pondDist(x, z) < POND.r * 1.9) continue;
    if (fbm(x * .045 + 9, z * .045 + 3) < .42 && seeded(i + 2000) > .18) continue;
    const y = terrainHeight(x, z), sc = .78 + seeded(i + 14) * .74, pine = y > 1.4 || seeded(i + 700) > .58, tw = sc * (pine ? .8 : 1);
    temp.position.set(x, y + 2.05 * sc, z); temp.scale.set(tw, 4.1 * sc, tw); temp.rotation.set(0, seeded(i + 500) * Math.PI, 0); temp.updateMatrix();
    trunks.setMatrixAt(nt, temp.matrix); trunks.setColorAt(nt, tmpColor.set('#6e5038').offsetHSL(0, 0, (seeded(i + 60) - .5) * .07));
    if (pine) {
      tierShapes.forEach(([ty, r, hs], k) => {
        temp.position.set(x, y + ty * sc, z); temp.scale.set(r * sc, hs * sc, r * sc); temp.rotation.set(0, seeded(i + k * 31) * 6.28, 0); temp.updateMatrix();
        tiers.setMatrixAt(np, temp.matrix); tiers.setColorAt(np++, tmpColor.set(PINES[(i + k) % PINES.length]).offsetHSL(0, 0, k * .014 + (seeded(i + 9) - .5) * .03));
      });
    } else {
      crownShapes.forEach(([ox, oy, oz, size], layer) => {
        const s = size * sc;
        temp.position.set(x + ox * sc, y + oy * sc, z + oz * sc); temp.scale.set(s, s * 1.16, s * .94); temp.rotation.set(0, seeded(i + layer * 19) * 6.28, 0); temp.updateMatrix();
        crowns.setMatrixAt(nc, temp.matrix); crowns.setColorAt(nc++, tmpColor.set(FOLIAGE[(i + layer) % FOLIAGE.length]).offsetHSL((seeded(i + 4) - .5) * .02, 0, layer * .012 + (seeded(i + layer) - .5) * .04));
      });
    }
    colliders.push({ x, z, radius: .64 * sc }); nt++;
  }
  trunks.count = nt; crowns.count = nc; tiers.count = np;
  [trunks, crowns, tiers].forEach((m, i) => { m.castShadow = m.receiveShadow = true; m.name = ['forest-trunks', 'canopy-broadleaf', 'canopy-pine'][i]; m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; scene.add(m); });
  blockers.push(trunks);

  // pedras, margem do lago e arbustos
  const rockMat = patch(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .97, flatShading: true }), 'aurora-rock-v2', { fade: true });
  const rocks = new THREE.InstancedMesh(stoneify(new THREE.IcosahedronGeometry(1, 1), .3, '#ffffff', .55), rockMat, 100);
  rocks.castShadow = rocks.receiveShadow = true; rocks.name = 'field-stones';
  let nr = 0;
  const placeRock = (x: number, z: number, size: number, seed: number) => {
    temp.position.set(x, terrainHeight(x, z) + size * .38, z); temp.scale.set(size, size * .68, size * .82); temp.rotation.set(.1, seeded(seed) * 6, .13); temp.updateMatrix();
    rocks.setMatrixAt(nr, temp.matrix); rocks.setColorAt(nr++, tmpColor.set(ROCKS[seed % ROCKS.length])); colliders.push({ x, z, radius: size * .85 });
  };
  for (let i = 0; i < 70; i++) {
    const x = (seeded(300 + i) - .5) * 100, z = (seeded(500 + i) - .5) * 92;
    if ((Math.abs(x) < 6 && z > -18 && z < 7) || pondDist(x, z) < POND.r * 1.0) continue;
    placeRock(x, z, .32 + seeded(700 + i) * .9, 900 + i);
  }
  for (let i = 0; i < 24; i++) { const a = seeded(i + 5500) * 6.28, d = POND.r * (1.0 + seeded(i + 5600) * .35); placeRock(POND.x + Math.cos(a) * d, POND.z + Math.sin(a) * d, .25 + seeded(i + 5700) * .5, 6000 + i); }
  rocks.count = nr; rocks.instanceMatrix.needsUpdate = true; if (rocks.instanceColor) rocks.instanceColor.needsUpdate = true; scene.add(rocks); blockers.push(rocks);

  const bushGeo = new THREE.SphereGeometry(1, 9, 7);
  const bp = bushGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < bp.count; i++) { const x = bp.getX(i), y = bp.getY(i), z = bp.getZ(i), k = 1 + (h3(x, y, z, 7) - .5) * .35; bp.setXYZ(i, x * k, y * k, z * k); }
  bushGeo.computeVertexNormals();
  const bushes = new THREE.InstancedMesh(bushGeo, patch(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .95 }), 'aurora-bush-v1', { fade: true, sway: [.03, 1] }), 80);
  let nb = 0;
  for (let i = 0; i < 80; i++) {
    const x = (seeded(7000 + i) - .5) * 110, z = (seeded(7100 + i) - .5) * 100;
    if ((Math.abs(x) < 8 && z > -22 && z < 12) || pondDist(x, z) < POND.r * 1.2 || terrainHeight(x, z) > 3) continue;
    const s = .45 + seeded(7200 + i) * .65;
    temp.position.set(x, terrainHeight(x, z) + s * .35, z); temp.scale.set(s * 1.2, s * .8, s); temp.rotation.set(0, seeded(7300 + i) * 6.28, 0); temp.updateMatrix();
    bushes.setMatrixAt(nb, temp.matrix); bushes.setColorAt(nb++, tmpColor.set(FOLIAGE[i % 5]).offsetHSL(0, .02, -.05 + seeded(i + 7400) * .06));
  }
  bushes.count = nb; bushes.castShadow = bushes.receiveShadow = true; bushes.instanceMatrix.needsUpdate = true; if (bushes.instanceColor) bushes.instanceColor.needsUpdate = true; scene.add(bushes);

  // grama (vento) e juncos do lago
  const grassMaterial = new THREE.MeshLambertMaterial({ vertexColors: true });
  grassMaterial.onBeforeCompile = shader => {
    shader.uniforms.uTime = TIME;
    shader.vertexShader = `uniform float uTime;\n${shader.vertexShader}`.replace('#include <begin_vertex>', `#include <begin_vertex>
      float gp = instanceMatrix[3].x * .17 + instanceMatrix[3].z * .11;
      float gw = sin(uTime * 1.7 + gp + position.y * 2.0) * .11 + sin(uTime * 3.1 + gp * 2.3) * .035;
      transformed.x += gw * position.y;
      transformed.z += cos(uTime * 1.3 + gp) * .06 * position.y;`);
  };
  grassMaterial.customProgramCacheKey = () => 'aurora-grass-v3';
  const grassGeo = makeGrassGeometry(7);
  const grass = new THREE.InstancedMesh(grassGeo, grassMaterial, 6000);
  grass.name = 'wind-grass'; grass.receiveShadow = true;
  let ng = 0;
  for (let i = 0; i < 6000; i++) {
    const a = seeded(1200 + i) * 6.283, d = Math.sqrt(seeded(1600 + i)) * 44, x = Math.cos(a) * d, z = Math.sin(a) * d - 4;
    if (nearPath(x, z, .5) || Math.hypot(x, z + 12) < 3.6 || pondDist(x, z) < POND.r * 1.15) continue;
    const s = .62 + seeded(1900 + i) * .8;
    temp.position.set(x, terrainHeight(x, z), z); temp.scale.set(s, s * (.8 + seeded(i + 2) * .6), s); temp.rotation.set(0, seeded(2200 + i) * Math.PI, 0); temp.updateMatrix();
    grass.setMatrixAt(ng, temp.matrix); grass.setColorAt(ng++, tmpColor.set(GRASS[i % GRASS.length]).offsetHSL(0, 0, (seeded(i + 33) - .5) * .06));
  }
  grass.count = ng; grass.instanceMatrix.needsUpdate = true; if (grass.instanceColor) grass.instanceColor.needsUpdate = true; keepMax(grass); scene.add(grass);

  const reeds = new THREE.InstancedMesh(grassGeo, grassMaterial, 260);
  let nrd = 0;
  for (let i = 0; i < 260; i++) {
    const a = seeded(i + 8000) * 6.283, d = POND.r * (.9 + seeded(i + 8100) * .5), x = POND.x + Math.cos(a) * d, z = POND.z + Math.sin(a) * d, y = terrainHeight(x, z);
    if (y < -.7 || y > .5) continue;
    temp.position.set(x, y, z); temp.scale.set(1.3, 2.4 + seeded(i + 8200) * 1.1, 1.3); temp.rotation.set(0, seeded(i + 8300) * 6.28, 0); temp.updateMatrix();
    reeds.setMatrixAt(nrd, temp.matrix); reeds.setColorAt(nrd++, tmpColor.set('#8a9a5a').offsetHSL(0, 0, (seeded(i) - .5) * .1));
  }
  reeds.count = nrd; reeds.instanceMatrix.needsUpdate = true; if (reeds.instanceColor) reeds.instanceColor.needsUpdate = true; keepMax(reeds); scene.add(reeds);

  // flores (haste + botão)
  const stems = new THREE.InstancedMesh(new THREE.CylinderGeometry(.008, .014, .32, 4), new THREE.MeshLambertMaterial({ color: '#5d8a3c' }), 260);
  const heads = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.06, 1), new THREE.MeshLambertMaterial({ color: '#ffffff' }), 260);
  let nf = 0;
  for (let j = 0; j < 260; j++) {
    const x = (seeded(2500 + j) - .5) * 40, z = (seeded(2700 + j) - .5) * 40;
    if (nearPath(x, z, .6) || Math.hypot(x, z + 12) < 3.6 || pondDist(x, z) < POND.r * 1.15) continue;
    const s = .7 + seeded(2900 + j) * .8, y = terrainHeight(x, z);
    temp.rotation.set((seeded(j + 1) - .5) * .25, 0, (seeded(j + 2) - .5) * .25);
    temp.position.set(x, y + .16 * s, z); temp.scale.setScalar(s); temp.updateMatrix(); stems.setMatrixAt(nf, temp.matrix);
    temp.position.set(x, y + .33 * s, z); temp.scale.set(s, s * .65, s); temp.updateMatrix(); heads.setMatrixAt(nf, temp.matrix);
    heads.setColorAt(nf++, tmpColor.set(BLOOMS[j % BLOOMS.length]));
  }
  [stems, heads].forEach(m => { m.count = nf; m.instanceMatrix.needsUpdate = true; keepMax(m); scene.add(m); });
  if (heads.instanceColor) heads.instanceColor.needsUpdate = true;

  // trilha com bordas suaves e seixos
  const pathPoints: THREE.Vector3[] = [], widths: number[] = [];
  for (let i = 0; i <= 64; i++) { const t = i / 64, z = 10 - t * 31; pathPoints.push(new THREE.Vector3(pathX(z), 0, z)); widths.push(3.2 + Math.sin(t * Math.PI) * .45); }
  const pathMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const path = makeRibbon(pathPoints, widths, pathMat, '#9c8a66', '#7f8a5c'); path.name = 'waystone-trail'; path.receiveShadow = true; scene.add(path);
  const pebbles = new THREE.InstancedMesh(stoneify(new THREE.IcosahedronGeometry(.12, 0), .05, '#ffffff'), rockMat.clone(), 110);
  pebbles.material.alphaHash = false; pebbles.castShadow = pebbles.receiveShadow = true;
  for (let i = 0; i < 110; i++) {
    const t = seeded(i + 9000), z = 10 - t * 31, x = pathX(z) + (seeded(i + 9100) > .5 ? 1 : -1) * (1.55 + seeded(i + 9200) * .5), s = .6 + seeded(i + 9300) * 1.2;
    temp.position.set(x, terrainHeight(x, z) + .04, z); temp.scale.set(s, s * .6, s); temp.rotation.set(0, seeded(i + 9400) * 6, 0); temp.updateMatrix();
    pebbles.setMatrixAt(i, temp.matrix); pebbles.setColorAt(i, tmpColor.set(ROCKS[i % 5]));
  }
  scene.add(pebbles);

  // ruína: pilares em tambores de pedra, lintel caído e blocos soltos
  const ruin = new THREE.Group(); ruin.name = 'fallen-arch'; ruin.position.set(-12, terrainHeight(-12, -21), -21);
  const block = (w: number, h: number, d: number, x: number, y: number, z: number, rx: number, ry: number, rz: number, moss = .3) => {
    const m = new THREE.Mesh(stoneify(new THREE.BoxGeometry(w, h, d, Math.max(2, Math.round(w * 2)), Math.max(2, Math.round(h * 2)), 2), .1, '#8a8c7e', moss), stoneMat);
    m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.castShadow = m.receiveShadow = true; ruin.add(m);
  };
  for (let k = 0; k < 4; k++) block(.7, .85, .7, -1.6 + (seeded(k) - .5) * .06, .43 + k * .85, 0, 0, k * .4, -.02 * k, .2 + k * .1);
  for (let k = 0; k < 2; k++) block(.7, .85, .7, 1.6, .43 + k * .85, 0, 0, k * .7, .03 * k, .3);
  block(.75, .5, .75, 1.65, 1.95, .1, .15, .5, .35, .5);
  block(4.2, .55, .85, .2, 2.65, 0, 0, 0, -.5, .5);
  block(1.7, .4, .65, 2.8, .2, 1.4, 0, .3, .1); block(.7, .7, .7, -2.6, .35, 1.2, 0, .6, 0); block(1.3, .25, 1.1, 0, .12, 1.8, 0, .2, 0, .5);
  scene.add(ruin); blockers.push(ruin); colliders.push({ x: -13.6, z: -21, radius: .65 }, { x: -10.4, z: -21, radius: .65 });

  // vagalumes / poeira luminosa
  const motePositions: number[] = [];
  for (let i = 0; i < 140; i++) { const x = (seeded(3200 + i) - .5) * 64, z = (seeded(3600 + i) - .5) * 64; motePositions.push(x, terrainHeight(x, z) + .6 + seeded(3400 + i) * 4.5, z); }
  const moteGeometry = new THREE.BufferGeometry(); moteGeometry.setAttribute('position', new THREE.Float32BufferAttribute(motePositions, 3));
  const moteMaterial = new THREE.PointsMaterial({ color: '#f3e4a8', size: .3, map: glowTexture(), transparent: true, opacity: .4, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  moteMaterial.onBeforeCompile = shader => {
    shader.uniforms.uTime = TIME;
    shader.vertexShader = `uniform float uTime;\n${shader.vertexShader}`.replace('#include <begin_vertex>', `#include <begin_vertex>
      transformed.x += sin(uTime * .4 + position.y * 3.0) * .6;
      transformed.y += sin(uTime * .65 + position.x * .29 + position.z * .2) * .25;
      transformed.z += cos(uTime * .33 + position.x * .7) * .6;`);
  };
  moteMaterial.customProgramCacheKey = () => 'aurora-motes-v2';
  const motes = new THREE.Points(moteGeometry, moteMaterial); motes.name = 'windborne-echoes'; motes.frustumCulled = false; motes.userData.max = 140; scene.add(motes);

  // borboletas e pássaros (instanciados, asas batendo no shader)
  const NB = 26, bData: Flier[] = [];
  const butterflies = new THREE.InstancedMesh(makeWings(.11, .12), flapMaterial(17, 1.1, 'aurora-flap-b'), NB);
  const bCol = ['#f39a4c', '#f6f0d8', '#79a8e8', '#f2d44d', '#d986c4'];
  for (let i = 0; i < NB; i++) {
    bData.push({ cx: (seeded(4000 + i) - .5) * 40, cz: (seeded(4100 + i) - .5) * 36 - 4, sp: .7 + seeded(4200 + i) * .8, ph: seeded(4300 + i) * 6.28, sc: .8 + seeded(4400 + i) * .6, rad: 2 + seeded(4500 + i) * 3, alt: .6 + seeded(4600 + i) * 1.2 });
    butterflies.setColorAt(i, tmpColor.set(bCol[i % 5]));
  }
  keepMax(butterflies); scene.add(butterflies);
  const NBD = 9, dData: Flier[] = [];
  const birds = new THREE.InstancedMesh(makeWings(.9, .28), flapMaterial(6.5, .5, 'aurora-flap-d'), NBD);
  for (let i = 0; i < NBD; i++) {
    dData.push({ cx: (seeded(4700 + i) - .5) * 30, cz: -20 + (seeded(4800 + i) - .5) * 30, sp: (.06 + seeded(4900 + i) * .05) * (i % 2 ? 1 : -1), ph: seeded(5000 + i) * 6.28, sc: .9 + seeded(5050 + i) * .5, rad: 38 + seeded(5100 + i) * 30, alt: 28 + seeded(5150 + i) * 12 });
    birds.setColorAt(i, tmpColor.set('#2b3036'));
  }
  keepMax(birds); scene.add(birds);

  const L = makeLandmark(scene, stoneMat, colliders, blockers);
  blockers.push(L.group); colliders.push({ x: 0, z: -12, radius: 3 });

  const env: Environment = {
    grass, grassMaterial, bloomMeshes: [heads, stems], moteMaterial, motes, skyMaterial, sunDisc, moon, scalable,
    butterflies, birds, butterflyData: bData, birdData: dData, crystal: L.crystal, crystalBase: 6.5, orbit: L.orbit,
    crystalMaterial: L.crystalMaterial, glyphMaterial: L.glyphMaterial, ringMaterial: L.ringMaterial, stoneLight: L.stoneLight, glow: 1,
  };
  scene.userData.environment = env;
  moveFliers(env, 0);
  return { ground, blockers, colliders, rune: L.rune };
}

function moveFliers(env: Environment, t: number) {
  const b = env.butterflies;
  for (let i = 0; i < b.count; i++) {
    const f = env.butterflyData[i], u = t * .35 * f.sp + f.ph, v = t * .27 * f.sp + f.ph * 1.3;
    const x = f.cx + Math.sin(u) * f.rad, z = f.cz + Math.cos(v) * f.rad;
    temp.position.set(x, terrainHeight(x, z) + f.alt + Math.sin(t * 1.7 + f.ph) * .35, z);
    temp.rotation.set(0, Math.atan2(Math.cos(u) * .35 * f.sp, -Math.sin(v) * .27 * f.sp), 0); temp.scale.setScalar(f.sc); temp.updateMatrix(); b.setMatrixAt(i, temp.matrix);
  }
  b.instanceMatrix.needsUpdate = true;
  const d = env.birds;
  for (let i = 0; i < d.count; i++) {
    const f = env.birdData[i], a = f.ph + t * f.sp;
    temp.position.set(f.cx + Math.cos(a) * f.rad, f.alt + Math.sin(t * .5 + f.ph) * 1.5, f.cz + Math.sin(a) * f.rad);
    temp.rotation.set(0, f.sp > 0 ? -a : Math.PI - a, f.sp > 0 ? .3 : -.3); temp.scale.setScalar(f.sc); temp.updateMatrix(); d.setMatrixAt(i, temp.matrix);
  }
  d.instanceMatrix.needsUpdate = true;
}

export function setWorldQuality(scene: THREE.Scene, quality: WorldQuality) {
  const env = scene.userData.environment as Environment | undefined;
  if (!env) return;
  const f = quality === 'Baixa' ? .35 : quality === 'Média' ? .68 : 1;
  for (const m of env.scalable) m.count = Math.max(1, Math.floor((m.userData.maxInstances as number) * f));
  env.motes.geometry.setDrawRange(0, Math.floor((env.motes.userData.max as number) * f));
}

export function updateWorld(parts: WorldParts, time: number) {
  TIME.value = time;
  const env = parts.ground.parent?.userData.environment as Environment | undefined;
  parts.rune.rotation.z = Math.sin(time * .7) * .06;
  parts.rune.children.forEach((c, i) => c.scale.setScalar(.85 + Math.sin(time * 2.2 + i * 1.3) * .3));
  if (!env) return;
  env.crystal.position.y = env.crystalBase + Math.sin(time * 1.1) * .2; env.crystal.rotation.y = time * .7;
  env.orbit.position.y = env.crystal.position.y; env.orbit.rotation.y = -time * .9;
  const pulse = .8 + Math.sin(time * 1.6) * .25;
  env.crystalMaterial.emissiveIntensity = .5 + env.glow * .6 * pulse;
  env.glyphMaterial.emissiveIntensity = env.glow * pulse;
  env.ringMaterial.opacity = (.06 + .1 * env.glow) * (.8 + Math.sin(time * 1.2) * .2);
  moveFliers(env, time);
}

/* ───────────── ciclo dia/noite ───────────── */
const cycleSky = new THREE.Color();
const cycleDawn = new THREE.Color('#e6ac91');
const cycleDay = new THREE.Color('#9fb9c4');
const cycleNight = new THREE.Color('#263346');
const cycleSunset = new THREE.Color('#f6b690');
const cycleSkyColor = new THREE.Color('#a9c4d4');
const cycleGroundDay = new THREE.Color('#687451');
const cycleFogDay = new THREE.Color('#a1ad99');

export function updateDayCycle(scene: THREE.Scene, sun: THREE.DirectionalLight, sky: THREE.HemisphereLight, time: number) {
  const phase = (time / 240) * Math.PI * 2;
  const sunArc = Math.sin(phase);
  const daylight = smoothstep(sunArc, -.08, .42);
  const dusk = Math.max(0, 1 - Math.abs(sunArc) * 3.2);
  sun.position.set(Math.cos(phase) * 46, 14 + sunArc * 43, Math.sin(phase * .5) * 19);
  sun.intensity = .16 + daylight * 2.72;
  sun.color.set('#fff0d9').lerp(cycleSunset, dusk * .55);
  sky.intensity = .52 + daylight * 1.45;
  sky.color.copy(cycleSkyColor).lerp(cycleDawn, dusk * .42);
  sky.groundColor.set('#26303d').lerp(cycleGroundDay, daylight * .62);
  cycleSky.copy(cycleNight).lerp(cycleDawn, Math.max(dusk, .06)).lerp(cycleDay, daylight);
  if (scene.background instanceof THREE.Color) scene.background.copy(cycleSky);
  if (scene.fog instanceof THREE.FogExp2) {
    if (scene.userData.fogBase === undefined) scene.userData.fogBase = scene.fog.density;
    scene.fog.color.copy(cycleSky).lerp(cycleFogDay, daylight * .24);
    scene.fog.density = (scene.userData.fogBase as number) * (1 + dusk * .5); // névoa mais densa no amanhecer/entardecer
  }
  const env = scene.userData.environment as Environment | undefined;
  if (env) {
    tmpV.copy(sun.position).normalize();
    env.skyMaterial.uniforms.uDaylight.value = daylight; env.skyMaterial.uniforms.uDusk.value = dusk; env.skyMaterial.uniforms.uSunDir.value.copy(tmpV);
    env.sunDisc.position.copy(tmpV).multiplyScalar(168); env.sunDisc.visible = sunArc > -.1;
    env.moon.position.copy(tmpV).multiplyScalar(-168); env.moon.visible = sunArc < .1;
    env.glow = .45 + (1 - daylight) * 1.7;
    env.stoneLight.intensity = .4 + (1 - daylight) * 1.8;
    env.moteMaterial.opacity = .25 + (1 - daylight) * .7;
    env.butterflies.visible = daylight > .2; env.birds.visible = daylight > .15;
  }
  const hour = Math.floor(((time / 240) * 24 + 6) % 24);
  return { label: `${String(hour).padStart(2, '0')}:00`, daylight };
}