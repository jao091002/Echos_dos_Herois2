import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/* ============================================================================
 *  CATEDRAL DE LUZ — visual do Santuário do clérigo (invocação em forma de DOMÍNIO)
 *
 *  Sequência do lançamento (ver update):
 *    1. a barreira esférica se expande a partir do clérigo e fecha a área; por dentro, o céu do mundo dá lugar
 *       a uma abóbada estrelada com o sol do domínio no zênite; o selo se abre no chão;
 *    2. a catedral se materializa de baixo para cima, com uma linha de luz subindo pela pedra;
 *    3. vitrais, rosáceas, lanternas e feixes de luz acendem;
 *    4. no fim, a catedral se desfaz de cima para baixo e a barreira se dissipa.
 *
 *  Igreja ABERTA (colunas, arcos, vitrais sem parede opaca nas laterais): o jogador e a câmera ficam dentro dela.
 *  Construída UMA vez (geometrias mescladas, 1 draw por material, sem luzes e sem sombra) e estacionada abaixo do
 *  mapa quando inativa: nenhum material é criado/compilado em jogo. Medidas para R = 10 m; o grupo é escalado
 *  pelo raio real do santuário.
 * ========================================================================== */

const R0 = 10;
const PARK_Y = -500;
/** Altura total da catedral (ponta das cruzes das torres), em unidades de R0. */
const HEIGHT = 18.4;
/** Achatamento vertical da barreira: alta o bastante para conter as torres. */
const DOME_Y = 1.95;

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const JEWELS = ['#3f6fff', '#e8b84a', '#d83a4a', '#3fc28a', '#9a5cff', '#f4f0e0', '#4ad0ff'];
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

/** Vitral: losangos de vidro colorido, três lancetas separadas por chumbo, medalhões e um halo dourado. */
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
    // medalhões: anel de chumbo, vidro claro e uma cruz
    for (const cy of [96, 256, 416]) {
      g.fillStyle = '#1a1408'; g.beginPath(); g.arc(128, cy, 40, 0, Math.PI * 2); g.fill();
      g.fillStyle = cy === 256 ? '#fff2c4' : '#4ad0ff'; g.beginPath(); g.arc(128, cy, 33, 0, Math.PI * 2); g.fill();
      g.fillStyle = cy === 256 ? '#d83a4a' : '#f4f0e0'; g.fillRect(123, cy - 24, 10, 48); g.fillRect(110, cy - 12, 36, 10);
    }
    // chumbo: moldura e os dois montantes que dividem o vitral em três lancetas
    g.fillStyle = '#1a1408'; g.fillRect(82, 0, 5, 512); g.fillRect(169, 0, 5, 512);
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
/** Brilho redondo (chamas das velas, lanternas, halo da cruz). */
function glowTexture() {
  return canvasTex(64, 64, g => {
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, 'rgba(255,250,225,1)'); r.addColorStop(.25, 'rgba(255,220,140,.6)'); r.addColorStop(1, 'rgba(255,200,110,0)');
    g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  });
}
/** Selo do domínio no piso: anéis, estrela de doze pontas, pétalas, runas e a cruz no centro. */
function sealTexture() {
  return canvasTex(512, 512, g => {
    g.translate(256, 256); g.strokeStyle = '#ffd98a'; g.fillStyle = '#ffd98a'; g.lineCap = 'round';
    const ring = (r: number, w: number) => { g.lineWidth = w; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.stroke(); };
    ring(250, 4); ring(236, 1.5); ring(202, 3); ring(152, 2); ring(96, 3); ring(42, 2);
    g.lineWidth = 2;
    for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2, r = i % 4 ? 242 : 236; g.beginPath(); g.moveTo(Math.cos(a) * r, Math.sin(a) * r); g.lineTo(Math.cos(a) * 250, Math.sin(a) * 250); g.stroke(); }
    // runas: traços curtos entre os dois anéis externos
    for (let i = 0; i < 36; i++) {
      g.save(); g.rotate(i / 36 * Math.PI * 2); g.translate(0, -219); g.beginPath();
      for (let k = 0; k < 3; k++) { g.moveTo((rnd() - .5) * 12, (rnd() - .5) * 20); g.lineTo((rnd() - .5) * 12, (rnd() - .5) * 20); }
      g.stroke(); g.restore();
    }
    // estrela de doze pontas (cada ponta liga à quinta seguinte)
    g.lineWidth = 2.5; g.beginPath();
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, b = (i + 5) / 12 * Math.PI * 2; g.moveTo(Math.cos(a) * 202, Math.sin(a) * 202); g.lineTo(Math.cos(b) * 202, Math.sin(b) * 202); }
    g.stroke();
    // oito pétalas
    g.lineWidth = 2;
    for (let i = 0; i < 8; i++) { g.save(); g.rotate(i / 8 * Math.PI * 2); g.beginPath(); g.moveTo(0, -96); g.quadraticCurveTo(34, -124, 0, -152); g.quadraticCurveTo(-34, -124, 0, -96); g.stroke(); g.restore(); }
    for (let i = 0; i < 8; i++) { const a = (i + .5) / 8 * Math.PI * 2; g.beginPath(); g.arc(Math.cos(a) * 70, Math.sin(a) * 70, 5, 0, Math.PI * 2); g.fill(); }
    g.fillRect(-5, -30, 10, 60); g.fillRect(-20, -14, 40, 10);
  });
}

/** Contorno em arco ogival (retângulo + ponta), base em y0, centrado em x. */
function archPath<T extends THREE.Path>(s: T, w: number, h: number, y0 = 0): T {
  const hw = w / 2, rect = y0 + h - w * .75;
  s.moveTo(-hw, y0); s.lineTo(hw, y0); s.lineTo(hw, rect);
  s.quadraticCurveTo(hw, rect + w * .55, 0, y0 + h); s.quadraticCurveTo(-hw, rect + w * .55, -hw, rect); s.lineTo(-hw, y0);
  return s;
}
/** Janela em arco ogival, base em y = 0, com UV 0..1 no retângulo envolvente. */
function archWindow(w: number, h: number) {
  const g = new THREE.ShapeGeometry(archPath(new THREE.Shape(), w, h), 8);
  const p = g.attributes.position as THREE.BufferAttribute, uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, p.getY(i) / h);
  return g;
}
/** Moldura de pedra em volta de um vão ogival w×h (o vão começa em y = t), centrada na espessura. */
function archFrame(w: number, h: number, t: number, depth: number) {
  const s = archPath(new THREE.Shape(), w + t * 2, h + t * 2);
  s.holes.push(archPath(new THREE.Path(), w, h, t));
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 6 });
  g.translate(0, 0, -depth / 2); return g;
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

/** Céu interno do domínio (visto de dentro da barreira): abóbada índigo, estrelas e o sol do domínio no zênite. */
function skyMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uAlpha: { value: 0 } },
    side: THREE.BackSide, transparent: true, depthWrite: false, toneMapped: false,
    vertexShader: /* glsl */`
      varying vec3 vDir;
      void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: /* glsl */`
      uniform float uTime, uAlpha; varying vec3 vDir;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main() {
        vec3 d = normalize(vDir);
        float h = d.y, az = atan(d.z, d.x), a = acos(clamp(h, -1., 1.));
        vec3 col = mix(vec3(.15, .09, .04), vec3(.014, .018, .075), smoothstep(-.05, .5, h));
        col = mix(col, vec3(.004, .005, .024), smoothstep(.5, 1., h));
        vec2 g = vec2(az / 6.2832 * 90., h * 24.), id = floor(g), f = fract(g) - .5;
        float r = hash(id);
        vec2 o = (vec2(hash(id + 7.3), hash(id + 2.9)) - .5) * .6;
        float star = smoothstep(.1, 0., length(f - o)) * step(.7, r) * (.55 + .45 * sin(uTime * (1.5 + r * 3.) + r * 40.));
        col += vec3(1., .9, .7) * star * smoothstep(.05, .3, h) * 1.6;
        float sun = smoothstep(.17, 0., a);
        float rings = smoothstep(.02, 0., abs(a - .27)) + .6 * smoothstep(.014, 0., abs(a - .4));
        float rays = pow(.5 + .5 * sin(az * 12. + uTime * .15), 6.) * smoothstep(1.3, .25, a) * smoothstep(.17, .32, a);
        col += vec3(1., .82, .45) * (sun * 2.2 + rings * .9 + rays * .32);
        // o horizonte fica mais transparente: quem está dentro ainda enxerga o que se aproxima por fora
        gl_FragColor = vec4(col, mix(.55, .93, smoothstep(0., .5, h)) * smoothstep(-.12, 0., h) * uAlpha);
      }`,
  });
}
/** Barreira vista de fora: contorno dourado, trama em losangos e uma faixa de luz subindo. */
function shellMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uAlpha: { value: 0 } },
    side: THREE.FrontSide, transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      varying vec3 vP, vN, vV;
      void main() { vP = position; vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalMatrix * normal; vV = -mv.xyz; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: /* glsl */`
      uniform float uTime, uAlpha; varying vec3 vP, vN, vV;
      void main() {
        float fr = pow(1. - abs(dot(normalize(vN), normalize(vV))), 2.2);
        vec2 g = vec2(atan(vP.z, vP.x) / 6.2832 * 36., vP.y * 14.);
        float lat = smoothstep(.44, .5, max(abs(fract(g.x + g.y) - .5), abs(fract(g.x - g.y) - .5)));
        float band = smoothstep(.12, 0., abs(vP.y - (fract(uTime * .22) * 1.6 - .3)));
        gl_FragColor = vec4(vec3(1., .8, .42), (fr * .9 + lat * .22 + band * .3) * smoothstep(-.1, 0., vP.y) * uAlpha);
      }`,
  });
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
  const stone = new THREE.MeshStandardMaterial({ color: '#c6bfb2', roughness: .45, metalness: .05, emissive: '#fff1c8', emissiveIntensity: .05 });
  const gold = new THREE.MeshStandardMaterial({ color: '#e8c46a', roughness: .25, metalness: .9, emissive: '#7a5a20', emissiveIntensity: .45 });
  // materialização: a pedra só existe abaixo de uReveal (altura local) e a borda dessa linha brilha
  const uReveal = { value: HEIGHT + 2 };
  for (const m of [stone, gold]) {
    m.onBeforeCompile = shader => {
      shader.uniforms.uReveal = uReveal;
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying float vRevY;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvRevY = position.y;');
      shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uReveal;\nvarying float vRevY;')
        .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\nif (vRevY > uReveal) discard;')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(1., .82, .45) * smoothstep(.9, 0., uReveal - vRevY) * 3.;');
    };
    m.customProgramCacheKey = () => 'catedral-reveal';
  }
  const additive = (map: THREE.Texture, opacity: number, color = '#ffffff') => new THREE.MeshBasicMaterial({ map, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
  const glassMat = additive(stainedGlass(), .78), roseMat = additive(roseWindow(), .95), shaftMat = additive(shaftTexture(), .1, '#fff1c4');
  const glowMat = additive(glowTexture(), .7), sealMat = additive(sealTexture(), .6);
  sealMat.polygonOffset = true; sealMat.polygonOffsetFactor = -2; sealMat.polygonOffsetUnits = -2;
  const skyMat = skyMaterial(), shellMat = shellMaterial();

  const PI = Math.PI, H = PI / 2;
  const W = 3.4, Z = [-4.8, -2.4, 0, 2.4, 4.8], ZF = 7, ZA = -4.8, FLOOR = .16, COL_H = 7.6, VAULT = 1.4;
  const top = FLOOR + .5 + COL_H + .4, apex = top + W * VAULT;
  const stoneParts: Part[] = [], goldParts: Part[] = [], glassParts: Part[] = [], roseParts: Part[] = [], shaftParts: Part[] = [], glowParts: Part[] = [];
  /** Dois planos cruzados de brilho (lê bem de qualquer ângulo sem billboard). */
  const glowAt = (x: number, y: number, z: number, s: number) => { for (const ry of [0, H]) glowParts.push({ geo: new THREE.PlaneGeometry(s, s), pos: [x, y, z], rot: [0, ry, 0] }); };
  const cross = (x: number, y: number, z: number, s: number) => {
    goldParts.push({ geo: new THREE.BoxGeometry(.14 * s, 1.5 * s, .14 * s), pos: [x, y + .75 * s, z] });
    goldParts.push({ geo: new THREE.BoxGeometry(.85 * s, .14 * s, .14 * s), pos: [x, y + 1.02 * s, z] });
  };

  // piso de mármore (com saia para cobrir desníveis do terreno) e meio-fio dourado marcando o limite do domínio
  stoneParts.push({ geo: new THREE.CylinderGeometry(R0, R0 + .35, 1.6, 56), pos: [0, FLOOR - .8, 0] });
  goldParts.push({ geo: new THREE.TorusGeometry(R0 - .16, .13, 5, 64), pos: [0, FLOOR + .04, 0], rot: [H, 0, 0] });

  // nave: pilares compostos (fuste + 4 colunetas), base, anel e capitel dourados
  for (const x of [-W, W]) for (const z of Z) {
    stoneParts.push({ geo: new THREE.BoxGeometry(.95, .5, .95), pos: [x, FLOOR + .25, z] });
    stoneParts.push({ geo: new THREE.CylinderGeometry(.28, .34, COL_H, 10), pos: [x, FLOOR + .5 + COL_H / 2, z] });
    for (const [dx, dz] of [[.3, 0], [-.3, 0], [0, .3], [0, -.3]]) stoneParts.push({ geo: new THREE.CylinderGeometry(.085, .085, COL_H, 6, 1, true), pos: [x + dx, FLOOR + .5 + COL_H / 2, z + dz] });
    goldParts.push({ geo: new THREE.CylinderGeometry(.42, .42, .1, 10), pos: [x, FLOOR + .5 + COL_H * .58, z] });
    goldParts.push({ geo: new THREE.CylinderGeometry(.58, .36, .4, 10), pos: [x, FLOOR + .5 + COL_H + .2, z] });
  }
  // abóbada: nervuras transversais douradas, nervuras diagonais de pedra em cada tramo e florões no cruzamento
  const zs = [...Z, ZF];
  for (const z of Z) goldParts.push({ geo: new THREE.TorusGeometry(W, .13, 6, 28, PI), pos: [0, top, z], scale: [1, VAULT, 1] });
  for (let i = 0; i < zs.length - 1; i++) {
    const zm = (zs[i] + zs[i + 1]) / 2, half = (zs[i + 1] - zs[i]) / 2, rd = Math.hypot(W, half), ang = Math.atan2(half, W);
    for (const s of [-1, 1]) stoneParts.push({ geo: new THREE.TorusGeometry(rd, .08, 5, 18, PI), pos: [0, top, zm], rot: [0, s * ang, 0], scale: [1, W * VAULT / rd, 1] });
    goldParts.push({ geo: new THREE.OctahedronGeometry(.3), pos: [0, apex - .05, zm] });
    for (const x of [-W, W]) {
      // arcos formeiros sobre cada tramo
      stoneParts.push({ geo: new THREE.TorusGeometry(half, .11, 5, 14, PI), pos: [x, top - .05, zm], rot: [0, H, 0], scale: [1, 1.35, 1] });
      // vitrais entre os pilares (as "paredes" da igreja), com moldura de pedra; o tramo da entrada fica aberto
      if (i < Z.length - 1) {
        glassParts.push({ geo: archWindow(1.8, 6.6), pos: [x, FLOOR + .7, zm], rot: [0, H, 0] });
        stoneParts.push({ geo: archFrame(1.8, 6.6, .11, .16), pos: [x, FLOOR + .59, zm], rot: [0, H, 0] });
      }
    }
  }
  const naveLen = ZF - ZA, naveMid = (ZF + ZA) / 2;
  stoneParts.push({ geo: new THREE.BoxGeometry(.2, .2, naveLen), pos: [0, apex, naveMid] });
  for (const x of [-W, W]) stoneParts.push({ geo: new THREE.BoxGeometry(.34, .3, naveLen), pos: [x, top + .05, naveMid] });

  // arcobotantes: contraforte com pináculo e meio-arco apoiado na parede alta da nave
  for (const s of [-1, 1]) for (const z of Z) {
    stoneParts.push({ geo: new THREE.BoxGeometry(.8, 6.2, .8), pos: [s * 6.5, FLOOR - .3 + 3.1, z] });
    goldParts.push({ geo: new THREE.BoxGeometry(.94, .14, .94), pos: [s * 6.5, FLOOR + 5.95, z] });
    stoneParts.push({ geo: new THREE.ConeGeometry(.6, 1.6, 4), pos: [s * 6.5, FLOOR + 6.8, z], rot: [0, PI / 4, 0] });
    stoneParts.push({ geo: new THREE.TorusGeometry(6.5 - W, .13, 5, 12, H), pos: [s * W, top - (6.5 - W), z], rot: [0, s < 0 ? PI : 0, 0] });
  }

  // fachada (+z): parede com portal ogival e óculo da rosácea, empena com cruz e duas torres sineiras
  const wall = new THREE.Shape();
  wall.moveTo(-3.8, 0); wall.lineTo(3.8, 0); wall.lineTo(3.8, 10.2); wall.lineTo(0, 14.9); wall.lineTo(-3.8, 10.2); wall.lineTo(-3.8, 0);
  wall.holes.push(archPath(new THREE.Path(), 3.2, 6.2, .2));
  const oculus = new THREE.Path(); oculus.absarc(0, 9.5, 1.75, 0, PI * 2, false); wall.holes.push(oculus);
  const wallY = FLOOR - .3;
  stoneParts.push({ geo: new THREE.ExtrudeGeometry(wall, { depth: .35, bevelEnabled: false, curveSegments: 10 }), pos: [0, wallY, ZF - .175] });
  goldParts.push({ geo: archFrame(3.2, 6.2, .2, .55), pos: [0, wallY, ZF + .1] });
  stoneParts.push({ geo: archFrame(3.6, 6.6, .24, .32), pos: [0, wallY - .24, ZF + .3] });
  roseParts.push({ geo: new THREE.CircleGeometry(1.75, 40), pos: [0, wallY + 9.5, ZF + .05] });
  goldParts.push({ geo: new THREE.TorusGeometry(1.8, .13, 6, 40), pos: [0, wallY + 9.5, ZF + .18] });
  for (const s of [-1, 1]) stoneParts.push({ geo: new THREE.BoxGeometry(.3, .3, .5), pos: [s * 2, wallY + 12.65, ZF], rot: [0, 0, s * -.89], scale: [20.6, 1, 1] }); // cornija inclinada da empena
  cross(0, wallY + 14.9, ZF, 1);
  for (const s of [-1, 1]) {
    const x = s * 4.75, y0 = wallY;
    stoneParts.push({ geo: new THREE.BoxGeometry(1.9, 10.6, 1.9), pos: [x, y0 + 5.3, ZF] });
    for (const cx of [-1, 1]) for (const cz of [-1, 1]) {
      stoneParts.push({ geo: new THREE.BoxGeometry(.3, 10.6, .3), pos: [x + cx * .92, y0 + 5.3, ZF + cz * .92] });
      stoneParts.push({ geo: new THREE.BoxGeometry(.3, 2.3, .3), pos: [x + cx * .8, y0 + 11.75, ZF + cz * .8] }); // pilares do campanário
      stoneParts.push({ geo: new THREE.ConeGeometry(.22, 1.2, 4), pos: [x + cx * .92, y0 + 13.7, ZF + cz * .92], rot: [0, PI / 4, 0] });
    }
    for (const y of [3.9, 7.3, 10.6, 12.95]) goldParts.push({ geo: new THREE.BoxGeometry(2.14, .16, 2.14), pos: [x, y0 + y, ZF] });
    stoneParts.push({ geo: new THREE.ConeGeometry(1.4, 4.2, 4), pos: [x, y0 + 15.1, ZF], rot: [0, PI / 4, 0] });
    cross(x, y0 + 17.1, ZF, .7);
    glowAt(x, y0 + 11.8, ZF, 1.7); // luz do sino
    // lancetas acesas na frente e no lado de fora da torre
    for (const y of [4.6, 8]) {
      glassParts.push({ geo: archWindow(.7, 2.3), pos: [x, y0 + y, ZF + .97] });
      glassParts.push({ geo: archWindow(.7, 2.3), pos: [x + s * .97, y0 + y, ZF], rot: [0, H, 0] });
    }
  }
  // flecha sobre o cruzeiro
  goldParts.push({ geo: new THREE.CylinderGeometry(.3, .44, .7, 6), pos: [0, apex + .35, 0] });
  stoneParts.push({ geo: new THREE.ConeGeometry(.42, 3.4, 6), pos: [0, apex + 2.4, 0] });
  glowAt(0, apex + 4.2, 0, 1.1);

  // abside (−z): colunas em semicírculo, nervuras até o fecho, vitrais altos e a rosácea atrás do altar
  for (let i = 0; i <= 5; i++) {
    const tm = (i + .5) * PI / 6, rg = W * Math.cos(PI / 12);
    glassParts.push({ geo: archWindow(1.3, 7.2), pos: [rg * Math.cos(tm), FLOOR + .7, ZA - rg * Math.sin(tm)], rot: [0, tm + H, 0] });
    stoneParts.push({ geo: archFrame(1.3, 7.2, .1, .14), pos: [rg * Math.cos(tm), FLOOR + .6, ZA - rg * Math.sin(tm)], rot: [0, tm + H, 0] });
    if (!i) continue;
    const th = i * PI / 6, x = W * Math.cos(th), z = ZA - W * Math.sin(th);
    stoneParts.push({ geo: new THREE.CylinderGeometry(.19, .25, COL_H + .5, 8), pos: [x, FLOOR + (COL_H + .5) / 2, z] });
    goldParts.push({ geo: new THREE.CylinderGeometry(.42, .24, .4, 8), pos: [x, FLOOR + COL_H + .7, z] });
    stoneParts.push({ geo: new THREE.TorusGeometry(W, .09, 5, 12, H), pos: [0, top, ZA], rot: [0, th, 0], scale: [1, VAULT, 1] });
  }
  goldParts.push({ geo: new THREE.OctahedronGeometry(.36), pos: [0, apex - .05, ZA] });
  const roseY = top + 2.5, roseZ = ZA - W - .15;
  roseParts.push({ geo: new THREE.CircleGeometry(2, 48), pos: [0, roseY, roseZ] });
  goldParts.push({ geo: new THREE.TorusGeometry(2.06, .14, 6, 48), pos: [0, roseY, roseZ + .03] });
  for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2; goldParts.push({ geo: new THREE.ConeGeometry(.1, i % 2 ? .7 : 1.2, 4), pos: [Math.cos(a) * (i % 2 ? 2.5 : 2.75), roseY + Math.sin(a) * (i % 2 ? 2.5 : 2.75), roseZ], rot: [0, 0, a - H] }); } // resplendor

  // altar: estrado em dois degraus, mesa, cruz com auréola e castiçais
  const AZ = -5.7;
  stoneParts.push({ geo: new THREE.CylinderGeometry(2.7, 2.9, .18, 24), pos: [0, FLOOR + .09, AZ] });
  stoneParts.push({ geo: new THREE.CylinderGeometry(2.1, 2.3, .18, 24), pos: [0, FLOOR + .27, AZ] });
  const dais = FLOOR + .36;
  stoneParts.push({ geo: new THREE.BoxGeometry(2.3, .95, .9), pos: [0, dais + .475, AZ] });
  goldParts.push({ geo: new THREE.BoxGeometry(2.5, .1, 1.05), pos: [0, dais + 1, AZ] });
  goldParts.push({ geo: new THREE.BoxGeometry(.2, 3.4, .2), pos: [0, dais + 1.7, AZ - 1] });
  goldParts.push({ geo: new THREE.BoxGeometry(1.4, .2, .2), pos: [0, dais + 2.6, AZ - 1] });
  goldParts.push({ geo: new THREE.TorusGeometry(.8, .05, 5, 28), pos: [0, dais + 2.6, AZ - 1] });
  glowParts.push({ geo: new THREE.PlaneGeometry(4.2, 4.2), pos: [0, dais + 2.6, AZ - 1.12] });
  for (const s of [-1, 1]) {
    goldParts.push({ geo: new THREE.CylinderGeometry(.05, .14, 1.7, 6), pos: [s * 1.75, dais + .85, AZ] });
    goldParts.push({ geo: new THREE.CylinderGeometry(.16, .05, .12, 6), pos: [s * 1.75, dais + 1.74, AZ] });
    glowAt(s * 1.75, dais + 1.98, AZ, .7);
  }

  // lanternas pendentes da cumeeira e feixes de luz descendo da abóbada (planos cruzados, leves)
  for (let i = 0; i < Z.length - 1; i++) {
    const z = (Z[i] + Z[i + 1]) / 2;
    goldParts.push({ geo: new THREE.CylinderGeometry(.025, .025, 3.1, 4, 1, true), pos: [0, apex - 1.6, z] });
    goldParts.push({ geo: new THREE.OctahedronGeometry(.3), pos: [0, apex - 3.3, z], scale: [1, 1.5, 1] });
    glowAt(0, apex - 3.3, z, 1.5);
    for (const ry of [0, H]) shaftParts.push({ geo: new THREE.PlaneGeometry(2.4, apex - .4), pos: [0, apex / 2 + .2, z], rot: [0, ry, 0] });
  }

  // sem projetar sombra: o shadow pass da igreja estacionada não é pré-compilado (evita compilar shader no lançamento)
  const mk = (geo: THREE.BufferGeometry, mat: THREE.Material, order = 0) => {
    const m = new THREE.Mesh(geo, mat); m.castShadow = false; m.receiveShadow = mat === stone || mat === gold; m.renderOrder = order; root.add(m); return m;
  };
  mk(bake(stoneParts), stone); mk(bake(goldParts), gold);
  mk(bake(glassParts), glassMat, 3); mk(bake(roseParts), roseMat, 3); mk(bake(shaftParts), shaftMat, 4); mk(bake(glowParts), glowMat, 4);
  const seal = mk(new THREE.CircleGeometry(R0 * .96, 48).rotateX(-H), sealMat, 2); seal.position.y = FLOOR + .05;
  // barreira: a mesma esfera para o céu interno (desenhado antes dos outros transparentes, para as partículas
  // do combate ficarem por cima dele) e para a casca vista de fora
  const sphere = new THREE.SphereGeometry(1, 40, 24);
  const sky = mk(sphere, skyMat, -1), shell = mk(sphere, shellMat, 5);

  const clamp01 = (v: number) => Math.min(1, Math.max(0, v)), smooth = (v: number) => v * v * (3 - 2 * v);
  let active = false;

  return {
    root,
    get active() { return active; },
    show(center, R) { root.scale.setScalar(R / R0); root.position.copy(center); active = true; this.update(0, 8, 0); },
    hide() { active = false; root.position.y = PARK_Y; },
    update(t, life, time) {
      if (!active) return;
      const out = clamp01((t - (life - 1.1)) / 1.1);                 // 0..1: o domínio se desfaz
      const open = 1 - Math.pow(1 - clamp01(t / .6), 3);             // barreira e selo se expandem a partir do clérigo
      const build = smooth(clamp01((t - .3) / 1.7));                 // a catedral se materializa de baixo para cima
      uReveal.value = Math.min(-1 + (HEIGHT + 3) * build, -1 + (HEIGHT + 3) * (1 - smooth(clamp01(out / .8))));
      const glow = smooth(clamp01((build - .3) / .6)) * (1 - clamp01(out * 1.6));
      const lights = clamp01((t - 1.7) / .8) * (1 - clamp01(out * 2));
      glassMat.opacity = .78 * glow * (.9 + .1 * Math.sin(time * 2.1));
      roseMat.opacity = .95 * glow;
      shaftMat.opacity = .1 * lights * (.75 + .25 * Math.sin(time * 1.3));
      glowMat.opacity = .7 * lights * (.85 + .15 * Math.sin(time * 5.3));
      stone.emissiveIntensity = .05 + .1 * glow;
      sealMat.opacity = .6 * open * (1 - out) * (.85 + .15 * Math.sin(time * 1.7));
      seal.scale.setScalar(Math.max(.001, open)); seal.rotation.y = time * .1;
      const k = Math.max(.001, open) * (1 + .06 * out) * R0;
      sky.scale.set(k, k * DOME_Y, k); shell.scale.set(k * 1.01, k * DOME_Y * 1.01, k * 1.01);
      skyMat.uniforms.uTime.value = shellMat.uniforms.uTime.value = time;
      skyMat.uniforms.uAlpha.value = open * (1 - smooth(clamp01((out - .3) / .7)));
      shellMat.uniforms.uAlpha.value = open * (1 - out) * (.55 + 1.6 * (1 - clamp01(t / .9)) + 1.2 * Math.sin(out * Math.PI));
      if (t >= life) this.hide();
    },
  };
}
