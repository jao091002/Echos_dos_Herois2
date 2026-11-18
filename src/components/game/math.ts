import * as THREE from 'three';
import { terrainHeight } from './world';
import type { SfxName } from './audio';

/* ============================================================================
 *  MATEMÁTICO — glifos, forma transformada, Plano Cartesiano e magias
 *
 *  Tudo que é "número" no mundo sai de UM sistema de partículas de glifos (GlyphParticles): um único THREE.Points
 *  com um atlas de caracteres (0–9, π, e, i, Σ, ∫, ∞…). Cada ponto é um glifo virado para a câmera. Há dois usos:
 *    - emit(): glifo com física (voa, cai, some) — explosões, rastros;
 *    - draw(): glifo desenhado só neste quadro — asas, auréola, ondas, números dos eixos.
 *  Um só desenho para todos os jogadores e magias, nenhuma luz nova (o número de PointLights não muda).
 *
 *  A expansão de domínio (Plano Cartesiano) liga:
 *    - MathForm: asas de números nas costas e auréola com Σ sobre a cabeça (local e avatares remotos);
 *    - CartesianDomain: o chão vira um plano cartesiano (grade, eixos numerados, parede de grade em volta).
 * ========================================================================== */

/** Habilidades do matemático (normais e as versões da expansão). */
export const MATH_SPELLS = ['seno', 'numeros', 'exponencial', 'piCirculo', 'imaginario', 'fourier', 'fibonacci', 'euler', 'integral', 'infinito', 'planoCartesiano'] as const;
export type MathSpell = typeof MATH_SPELLS[number];
export const isMathSpell = (s: string): s is MathSpell => (MATH_SPELLS as readonly string[]).includes(s);

/** Cores do corpo enquanto a expansão está ativa (corpo escuro, juntas brilhando em ciano). */
export const DOMAIN_LOOK = { body: '#1a2030', joints: '#7fe8ff' };
/** Mana por segundo consumida enquanto o Plano Cartesiano está aberto (a regeneração para). */
export const DOMAIN_DRAIN = 1;
/** Raio (m) do plano cartesiano no chão. */
export const DOMAIN_R = 20;

const TAU = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);
const rr = (a: number, b: number) => a + Math.random() * (b - a);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
const easeOutCubic = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const col = (hex: string) => new THREE.Color(hex);

export const MC = {
  cyan: col('#7fe8ff'), white: col('#f2fbff'), gold: col('#ffd36b'), violet: col('#b49cff'), deep: col('#2a6cff'), pink: col('#ff8fd8'),
};

/* ------------------------------------------------------------------ atlas de glifos */
const GLYPH_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '−', '×', '÷', '=', 'π', 'e', 'i', 'Σ', '∫', '√', '∞', '∂', 'θ', 'Δ', 'φ', 'λ', 'x', 'y', '(', ')', '^', '!', '.', 'f', 'n', '·', 'a', 'b', 'd'];
const ITALIC = new Set(['e', 'i', 'x', 'y', 'f', 'n', 'θ', 'φ', 'λ', 'a', 'b', 'd', '∂']);
/** Índice do glifo de um caractere (desconhecido = '0'). */
export const G = (ch: string) => { const i = GLYPH_CHARS.indexOf(ch); return i < 0 ? 0 : i; };
const DIGIT = (n: number) => ((n % 10) + 10) % 10;
const SYMBOLS = ['π', 'e', '∞', '√', '∂', 'θ', 'Σ', '∫', 'Δ', 'φ', 'λ', 'i'].map(G);
const PI_DIGITS = '3.14159265358979323846';

function glyphAtlas(): THREE.CanvasTexture {
  const S = 64, canvas = document.createElement('canvas'); canvas.width = canvas.height = S * 8;
  const ctx = canvas.getContext('2d')!;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff';
  GLYPH_CHARS.forEach((ch, i) => {
    const x = (i % 8) * S + S / 2, y = Math.floor(i / 8) * S + S / 2 + 2;
    ctx.font = `${ITALIC.has(ch) ? 'italic ' : ''}600 ${ch === '·' ? 60 : 46}px "Cambria Math", "Times New Roman", serif`;
    // halo suave + traço nítido (o bloom faz o resto)
    ctx.shadowColor = 'rgba(255,255,255,0.9)'; ctx.shadowBlur = 7; ctx.fillText(ch, x, y);
    ctx.shadowBlur = 0; ctx.fillText(ch, x, y);
  });
  const t = new THREE.CanvasTexture(canvas);
  t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter;
  return t;
}

const GLYPH_VS = `
attribute vec3 aColor; attribute vec4 aParams; uniform float uScale; varying vec3 vColor; varying vec4 vParams;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;
gl_PointSize=clamp(aParams.x*uScale/max(-mv.z,.1),0.0,256.0);vColor=aColor;vParams=aParams;}`;
const GLYPH_FS = `
uniform sampler2D uAtlas; varying vec3 vColor; varying vec4 vParams;
vec3 toSRGB(vec3 c){return pow(max(c,vec3(0.0)),vec3(1.0/2.2));}
void main(){
  vec2 p=gl_PointCoord-.5; float c=cos(vParams.w),s=sin(vParams.w); p=vec2(c*p.x-s*p.y,s*p.x+c*p.y)+.5;
  if(p.x<0.||p.y<0.||p.x>1.||p.y>1.)discard;
  float g=floor(vParams.z+.5); float cx=mod(g,8.), cy=floor(g/8.);
  float a=texture2D(uAtlas,vec2((cx+p.x)/8.,1.-(cy+p.y)/8.)).a*vParams.y;
  if(a<.004)discard;
  gl_FragColor=vec4(toSRGB(vColor*(1.+a*.6)),clamp(a,0.,1.));
}`;

export type GlyphEmit = { vx?: number; vy?: number; vz?: number; life: number; s0: number; s1?: number; c0: THREE.Color; c1?: THREE.Color; glyph: number; drag?: number; grav?: number; a?: number; rot?: number };
const GS = 21; // x y z vx vy vz age life s0 s1 r0 g0 b0 r1 g1 b1 glyph drag grav a rot
const IS = 10; // x y z size r g b alpha glyph rot

/** Partículas de glifos (um desenho só, aditivo). */
export class GlyphParticles {
  readonly points: THREE.Points;
  private readonly d: Float32Array; private n = 0;
  private readonly q: Float32Array; private m = 0;
  private readonly pos: THREE.BufferAttribute; private readonly colA: THREE.BufferAttribute; private readonly par: THREE.BufferAttribute;
  private readonly uniforms: { uScale: { value: number }; uAtlas: { value: THREE.Texture } };
  private readonly atlas: THREE.CanvasTexture;
  /** Câmera atual (para escrever textos da esquerda para a direita na tela). */
  camera: THREE.Camera | null = null;
  constructor(private readonly cap = 2400, private readonly capImm = 1600) {
    this.d = new Float32Array(cap * GS); this.q = new Float32Array(capImm * IS);
    const total = cap + capImm;
    this.pos = new THREE.BufferAttribute(new Float32Array(total * 3), 3).setUsage(THREE.DynamicDrawUsage);
    this.colA = new THREE.BufferAttribute(new Float32Array(total * 3), 3).setUsage(THREE.DynamicDrawUsage);
    this.par = new THREE.BufferAttribute(new Float32Array(total * 4), 4).setUsage(THREE.DynamicDrawUsage);
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', this.pos); geo.setAttribute('aColor', this.colA); geo.setAttribute('aParams', this.par); geo.setDrawRange(0, 0);
    this.atlas = glyphAtlas();
    this.uniforms = { uScale: { value: 780 }, uAtlas: { value: this.atlas } };
    const mat = new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader: GLYPH_VS, fragmentShader: GLYPH_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    this.points = new THREE.Points(geo, mat); this.points.frustumCulled = false; this.points.renderOrder = 11; this.points.name = 'math-glyphs';
  }
  setScale(v: number) { this.uniforms.uScale.value = v; }
  get count() { return this.n; }
  clear() { this.n = 0; this.m = 0; this.points.geometry.setDrawRange(0, 0); }
  emit(x: number, y: number, z: number, o: GlyphEmit) {
    if (this.n >= this.cap) return;
    const d = this.d, i = this.n++ * GS, c1 = o.c1 ?? o.c0;
    d[i] = x; d[i + 1] = y; d[i + 2] = z; d[i + 3] = o.vx ?? 0; d[i + 4] = o.vy ?? 0; d[i + 5] = o.vz ?? 0;
    d[i + 6] = 0; d[i + 7] = o.life; d[i + 8] = o.s0; d[i + 9] = o.s1 ?? o.s0;
    d[i + 10] = o.c0.r; d[i + 11] = o.c0.g; d[i + 12] = o.c0.b; d[i + 13] = c1.r; d[i + 14] = c1.g; d[i + 15] = c1.b;
    d[i + 16] = o.glyph; d[i + 17] = o.drag ?? 0; d[i + 18] = o.grav ?? 0; d[i + 19] = o.a ?? 1; d[i + 20] = o.rot ?? 0;
  }
  /** Desenha um glifo só neste quadro. */
  draw(x: number, y: number, z: number, size: number, c: THREE.Color, alpha: number, glyph: number, rot = 0) {
    if (this.m >= this.capImm || alpha <= .004) return;
    const q = this.q, i = this.m++ * IS;
    q[i] = x; q[i + 1] = y; q[i + 2] = z; q[i + 3] = size; q[i + 4] = c.r; q[i + 5] = c.g; q[i + 6] = c.b; q[i + 7] = alpha; q[i + 8] = glyph; q[i + 9] = rot;
  }
  /** Direção "direita" da tela (texto legível). */
  right(out: THREE.Vector3) {
    if (this.camera) return out.setFromMatrixColumn(this.camera.matrixWorld, 0).setY(0).normalize();
    return out.set(1, 0, 0);
  }
  private readonly tr = new THREE.Vector3();
  /** Escreve um texto curto centrado em (x, y, z), voltado para a câmera. */
  text(str: string, x: number, y: number, z: number, size: number, c: THREE.Color, alpha: number) {
    const r = this.right(this.tr), w = size * .62, chars = [...str], x0 = -(chars.length - 1) * w / 2;
    chars.forEach((ch, k) => ch !== ' ' && this.draw(x + r.x * (x0 + k * w), y, z + r.z * (x0 + k * w), size, c, alpha, G(ch)));
  }
  update(dt: number) {
    const d = this.d, P = this.pos.array as Float32Array, K = this.colA.array as Float32Array, Q = this.par.array as Float32Array;
    let i = 0;
    while (i < this.n) {
      const o = i * GS, age = (d[o + 6] += dt), life = d[o + 7];
      if (age >= life) { this.n--; const last = this.n * GS; if (o !== last) d.copyWithin(o, last, last + GS); continue; }
      const k = Math.exp(-d[o + 17] * dt);
      d[o + 3] *= k; d[o + 4] = d[o + 4] * k - d[o + 18] * dt; d[o + 5] *= k;
      d[o] += d[o + 3] * dt; d[o + 1] += d[o + 4] * dt; d[o + 2] += d[o + 5] * dt;
      const t = age / life, j = i * 3, p = i * 4, f = 1 - t;
      P[j] = d[o]; P[j + 1] = d[o + 1]; P[j + 2] = d[o + 2];
      K[j] = d[o + 10] + (d[o + 13] - d[o + 10]) * t; K[j + 1] = d[o + 11] + (d[o + 14] - d[o + 11]) * t; K[j + 2] = d[o + 12] + (d[o + 15] - d[o + 12]) * t;
      Q[p] = d[o + 8] + (d[o + 9] - d[o + 8]) * t; Q[p + 1] = d[o + 19] * Math.min(1, t * 12) * f; Q[p + 2] = d[o + 16]; Q[p + 3] = d[o + 20];
      i++;
    }
    const q = this.q;
    for (let k = 0; k < this.m; k++, i++) {
      const o = k * IS, j = i * 3, p = i * 4;
      P[j] = q[o]; P[j + 1] = q[o + 1]; P[j + 2] = q[o + 2];
      K[j] = q[o + 4]; K[j + 1] = q[o + 5]; K[j + 2] = q[o + 6];
      Q[p] = q[o + 3]; Q[p + 1] = q[o + 7]; Q[p + 2] = q[o + 8]; Q[p + 3] = q[o + 9];
    }
    this.m = 0;
    this.pos.needsUpdate = this.colA.needsUpdate = this.par.needsUpdate = true;
    this.points.geometry.setDrawRange(0, i);
  }
  dispose() { this.points.removeFromParent(); this.points.geometry.dispose(); (this.points.material as THREE.Material).dispose(); this.atlas.dispose(); }
}

/* ------------------------------------------------------------------ forma transformada */
type Feather = { f: number; t: number; u: number; v: number; seed: number; sym: boolean };
/** Penas das asas, no plano da asa (u = para fora, v = para cima), com t = 0 no ombro e 1 na ponta. */
const FEATHERS: Feather[] = (() => {
  const out: Feather[] = [], lengths = [1.2, 1.48, 1.62, 1.58, 1.44, 1.24, 1.02, .8];
  lengths.forEach((L, f) => {
    const th = 1.18 - f * .245, n = Math.round(L / .125);
    for (let k = 1; k <= n; k++) {
      const t = k / n, a = th - t * .32 * (1 - f / 10);
      out.push({ f, t, u: .04 + Math.cos(a) * L * t, v: -.03 * f + Math.sin(a) * L * t, seed: (f * 31 + k * 17) % 97, sym: (f * 7 + k * 3) % 6 === 0 });
    }
  });
  return out;
})();
const HALO_Y = 2.16, HALO_R = .3, WING_Y = 1.42, WING_Z = -.2;

/**
 * Asas de números + auréola Σ de um herói (local ou remoto). p vai de 0 (normal) a 1 (transformado);
 * as asas desdobram do ombro para fora e, ao desfazer, os números se soltam e caem.
 */
export class MathForm {
  p = 0; private target = 0;
  private readonly halo: THREE.Mesh;
  private readonly w = new THREE.Vector3(); private readonly m = new THREE.Matrix4();
  constructor(private readonly root: THREE.Object3D, private readonly glyphs: GlyphParticles, haloGeo: THREE.BufferGeometry, haloMat: THREE.Material) {
    this.halo = new THREE.Mesh(haloGeo, haloMat); this.halo.rotation.x = Math.PI / 2; this.halo.position.y = HALO_Y; this.halo.visible = false; this.halo.name = 'math-halo';
    root.add(this.halo);
  }
  get active() { return this.target > 0; }
  /** Pré-compilação: mostra a auréola por um instante. */
  setCompile(v: boolean) { this.halo.visible = v || this.p > .01; }
  set(on: boolean, instant = false) {
    const t = on ? 1 : 0; if (t === this.target && !instant) return;
    if (!on && !instant && this.p > .2 && this.root.visible) this.scatter();
    this.target = t; if (instant) this.p = t;
  }
  /** Os números das asas se soltam e caem (fim da expansão). */
  private scatter() {
    this.root.updateMatrixWorld();
    for (let i = 0; i < FEATHERS.length; i += 2) for (const s of [-1, 1]) {
      const ft = FEATHERS[i]; this.wingPoint(ft, s, 0, this.w);
      this.glyphs.emit(this.w.x, this.w.y, this.w.z, { vx: rr(-1.2, 1.2), vy: rr(.5, 2.4), vz: rr(-1.2, 1.2), life: rr(.9, 1.6), s0: .17, s1: .05, c0: MC.white, c1: MC.cyan, glyph: DIGIT(ft.seed), drag: 1.2, grav: 3.2, rot: rr(-.5, .5) });
    }
  }
  /** Ponto de uma pena no mundo. flap = abertura extra (radianos). */
  private wingPoint(ft: Feather, side: number, flap: number, out: THREE.Vector3) {
    const sweep = .32 + flap, u = ft.u * this.unfold(ft);
    out.set(side * (.14 + u * Math.cos(sweep)), WING_Y + ft.v * this.unfold(ft) + ft.t * ft.t * .08, WING_Z - u * Math.sin(sweep) - .05 * ft.t);
    return out.applyMatrix4(this.root.matrixWorld);
  }
  private unfold(ft: Feather) { return .25 + .75 * smooth(this.p * 1.5 - ft.t * .5); }
  update(dt: number, time: number) {
    const rate = this.target > this.p ? 1 / 2.2 : 1 / .9;
    this.p = this.target > this.p ? Math.min(this.target, this.p + dt * rate) : Math.max(this.target, this.p - dt * rate);
    const vis = this.p > .01 && this.root.visible && this.root.position.y > -100;
    this.halo.visible = vis;
    if (!vis) return;
    this.root.updateMatrixWorld();
    const g = this.glyphs, flap = Math.sin(time * 2.1) * .2 + (1 - this.p) * .6, bob = Math.sin(time * 1.7) * .03;
    // asas: cada pena é uma fileira de números que mudam o tempo todo
    for (const ft of FEATHERS) {
      const q = smooth(this.p * 1.6 - ft.t * .6); if (q <= .01) continue;
      const tick = Math.floor(time * 3 + ft.seed * .37), glyph = ft.sym ? SYMBOLS[(ft.seed + tick) % SYMBOLS.length] : DIGIT(ft.seed + tick);
      const c = ft.t > .7 ? MC.gold : ft.f < 2 ? MC.white : MC.cyan, size = (.19 - ft.t * .05) * (.6 + .4 * q), a = q * (.55 + .45 * Math.sin(time * 4 + ft.seed));
      for (const s of [-1, 1]) {
        this.wingPoint(ft, s, flap * (.4 + ft.t * .6), this.w); this.w.y += bob;
        g.draw(this.w.x, this.w.y, this.w.z, size, c, a, glyph);
      }
    }
    // auréola: anel girando com os dígitos de π e um Σ grande no meio
    const hp = smooth(this.p * 1.4 - .3);
    this.halo.scale.setScalar(.2 + hp * .8); this.halo.rotation.z = time * .8;
    (this.halo.material as THREE.MeshBasicMaterial).opacity = .85;
    const e = this.root.matrixWorld.elements, ry = Math.atan2(e[8], e[10]);
    for (let k = 0; k < 12; k++) {
      const a = time * .9 + k / 12 * TAU + ry;
      this.w.set(Math.sin(a) * HALO_R * 1.25 * hp, HALO_Y + .02, Math.cos(a) * HALO_R * 1.25 * hp);
      this.w.x += e[12]; this.w.y += e[13]; this.w.z += e[14];
      g.draw(this.w.x, this.w.y, this.w.z, .085, MC.gold, hp * .9, G(PI_DIGITS[k + 2] ?? '0'));
    }
    g.draw(e[12], e[13] + HALO_Y + .24 + Math.sin(time * 2) * .025, e[14], .44 * hp, MC.white, hp, G('Σ'));
    g.draw(e[12], e[13] + HALO_Y + .24, e[14], .66 * hp, MC.cyan, hp * .35, G('Σ'));
  }
}

/* ------------------------------------------------------------------ Plano Cartesiano (chão) */
const GRID_VS = `
varying vec3 vW;
void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;
const GRID_FS = `
uniform vec2 uOrigin; uniform float uR; uniform float uTime; uniform float uFade; uniform vec3 uColor; uniform vec3 uAxis;
varying vec3 vW;
vec3 toSRGB(vec3 c){return pow(max(c,vec3(0.0)),vec3(1.0/2.2));}
void main(){
  vec2 w=vW.xz-uOrigin; float d=length(w);
  float inside=1.-smoothstep(uR*.86,uR,d); if(inside<=0.)discard;
  vec2 g=w*.5; vec2 fw=max(fwidth(g),vec2(1e-4)); vec2 l=abs(fract(g-.5)-.5)/fw; float line=1.-min(min(l.x,l.y),1.);
  vec2 g2=w*2.; vec2 fw2=max(fwidth(g2),vec2(1e-4)); vec2 l2=abs(fract(g2-.5)-.5)/fw2; float minor=(1.-min(min(l2.x,l2.y),1.))*.25;
  vec2 aw=abs(w)/max(fwidth(w),vec2(1e-4)); float axis=1.-min(min(aw.x,aw.y)/2.2,1.);
  float pulse=.55+.45*sin(d*.9-uTime*2.6);
  float ring=1.-smoothstep(0.,.35,abs(d-uR*.93));
  float a=(line*.42*pulse+minor*.5+axis*1.1+ring*.9)*inside+.045*inside;
  vec3 c=mix(uColor,uAxis,clamp(axis+ring*.6,0.,1.));
  gl_FragColor=vec4(toSRGB(c),clamp(a*uFade,0.,1.));
}`;
const WALL_FS = `
uniform float uTime; uniform float uFade; uniform vec3 uColor;
varying vec2 vUv;
vec3 toSRGB(vec3 c){return pow(max(c,vec3(0.0)),vec3(1.0/2.2));}
void main(){
  vec2 g=vec2(vUv.x*72.,vUv.y*7.); vec2 fw=max(fwidth(g),vec2(1e-4)); vec2 l=abs(fract(g-.5)-.5)/fw; float line=1.-min(min(l.x,l.y),1.);
  float up=pow(1.-vUv.y,1.6); float scan=smoothstep(.0,.04,abs(fract(vUv.y*1.5-uTime*.35)-.5))*.0+exp(-pow((fract(vUv.y-uTime*.18)-.5)*14.,2.))*.6;
  float a=(line*.5+.06+scan*.5)*up;
  gl_FragColor=vec4(toSRGB(uColor),clamp(a*uFade,0.,1.));
}`;
const WALL_VS = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;

/**
 * O chão em volta do matemático vira um plano cartesiano: grade de 2 m, eixos x e y numerados, anel na borda e
 * uma parede de grade subindo. Acompanha o jogador (recentra a cada 2 m, alinhado à grade, então as linhas não "andam").
 */
export class CartesianDomain {
  readonly group = new THREE.Group();
  private readonly floor: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private readonly wall: THREE.Mesh<THREE.CylinderGeometry, THREE.ShaderMaterial>;
  private readonly u = { uOrigin: { value: new THREE.Vector2() }, uR: { value: 0 }, uTime: { value: 0 }, uFade: { value: 0 }, uColor: { value: MC.deep.clone() }, uAxis: { value: MC.white.clone() } };
  private readonly wu = { uTime: { value: 0 }, uFade: { value: 0 }, uColor: { value: MC.cyan.clone() } };
  private readonly center = new THREE.Vector2(1e9, 1e9);
  /** 0..1 aberto. */
  open = 0; private on = false;
  constructor(parent: THREE.Object3D, private readonly glyphs: GlyphParticles) {
    const R = DOMAIN_R, geo = new THREE.PlaneGeometry(R * 2, R * 2, 44, 44); geo.rotateX(-Math.PI / 2);
    this.floor = new THREE.Mesh(geo, new THREE.ShaderMaterial({ uniforms: this.u, vertexShader: GRID_VS, fragmentShader: GRID_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.floor.frustumCulled = false; this.floor.renderOrder = 8;
    this.wall = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 72, 1, true), new THREE.ShaderMaterial({ uniforms: this.wu, vertexShader: WALL_VS, fragmentShader: WALL_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
    this.wall.frustumCulled = false; this.wall.renderOrder = 8;
    this.group.add(this.floor, this.wall); this.group.name = 'plano-cartesiano'; this.group.visible = false;
    parent.add(this.group);
  }
  get active() { return this.on; }
  /** Para pré-compilar os shaders (mostra por um instante). */
  setVisibleForCompile(v: boolean) { this.group.visible = v || this.open > 0; }
  start(at: THREE.Vector3) { this.on = true; this.recenter(at.x, at.z, true); }
  stop() { this.on = false; }
  dispose() { this.group.removeFromParent(); this.floor.geometry.dispose(); this.floor.material.dispose(); this.wall.geometry.dispose(); this.wall.material.dispose(); }
  private recenter(x: number, z: number, force = false) {
    const cx = Math.round(x / 2) * 2, cz = Math.round(z / 2) * 2;
    if (!force && cx === this.center.x && cz === this.center.y) return;
    this.center.set(cx, cz); this.u.uOrigin.value.set(cx, cz);
    // o chão acompanha o relevo (alguns centímetros acima, sem brigar com a grama)
    const pos = this.floor.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) pos.setY(i, terrainHeight(cx + pos.getX(i), cz + pos.getZ(i)) + .07);
    pos.needsUpdate = true;
    this.floor.position.set(cx, 0, cz);
  }
  update(dt: number, time: number, player: THREE.Vector3) {
    this.open = this.on ? Math.min(1, this.open + dt / 2.4) : Math.max(0, this.open - dt / .8);
    this.group.visible = this.open > 0;
    if (!this.group.visible) return;
    this.recenter(player.x, player.z);
    const k = this.on ? easeOutCubic(this.open) : smooth(this.open), R = DOMAIN_R * k, cx = this.center.x, cz = this.center.y;
    this.u.uR.value = R; this.u.uTime.value = time; this.u.uFade.value = Math.min(1, this.open * 2);
    this.wu.uTime.value = time; this.wu.uFade.value = Math.min(1, this.open * 1.5) * .8;
    const gy = terrainHeight(cx, cz);
    this.wall.position.set(cx, gy - 1 + 4, cz); this.wall.scale.set(Math.max(.01, R * .93), 8, Math.max(.01, R * .93));
    // números nos eixos: …, −2, 2, 4, … a cada 2 m (eixo x vermelho-dourado, eixo y ciano)
    const g = this.glyphs, fade = this.u.uFade.value;
    for (let n = -8; n <= 8; n++) {
      if (n === 0) continue;
      const v = n * 2; if (Math.abs(v) > R * .82) continue;
      const lab = n < 0 ? `−${-n}` : `${n}`;
      g.text(lab, cx + v, terrainHeight(cx + v, cz) + .45, cz + .55, .34, MC.gold, fade * .85);
      g.text(lab, cx + .55, terrainHeight(cx, cz + v) + .45, cz + v, .34, MC.cyan, fade * .85);
    }
    if (R > 3) {
      g.text('0', cx + .45, gy + .45, cz + .45, .38, MC.white, fade);
      g.text('x', cx + R * .86, terrainHeight(cx + R * .86, cz) + .7, cz, .6, MC.gold, fade);
      g.text('y', cx, terrainHeight(cx, cz + R * .86) + .7, cz + R * .86, .6, MC.cyan, fade);
    }
    // símbolos flutuando para cima dentro do domínio
    if (this.on && Math.random() < dt * 14) {
      const a = Math.random() * TAU, r = Math.sqrt(Math.random()) * R * .85, x = cx + Math.sin(a) * r, z = cz + Math.cos(a) * r;
      g.emit(x, terrainHeight(x, z) + .2, z, { vy: rr(.5, 1.2), life: rr(2, 3.5), s0: rr(.2, .42), s1: .05, c0: MC.cyan, c1: MC.violet, glyph: Math.random() < .5 ? SYMBOLS[(Math.random() * SYMBOLS.length) | 0] : DIGIT((Math.random() * 10) | 0), a: .7 });
    }
  }
}

/* ------------------------------------------------------------------ magias */
/** O que as magias do matemático usam do MagicSystem (partículas, clarões, dano). */
export type MathKit = {
  player: THREE.Object3D;
  glyphs: GlyphParticles;
  spark: (x: number, y: number, z: number, vx: number, vy: number, vz: number, life: number, size: number, c0: THREE.Color, c1: THREE.Color) => void;
  flash: (pos: THREE.Vector3, color: THREE.Color, size: number, life: number) => void;
  shock: (pos: THREE.Vector3, normal: THREE.Vector3, color: THREE.Color, radius: number, life: number) => void;
  dome: (pos: THREE.Vector3, color: THREE.Color, radius: number, life: number) => void;
  light: (pos: THREE.Vector3, color: THREE.Color, peak: number, life: number, dist: number) => void;
  /** Efeito com duração: step(t 0..1, dt). */
  effect: (life: number, step: (t: number, dt: number) => void) => void;
  shake: (amount: number) => void;
  /** Dano em área (crítico, buffs e tamanho aplicados). Retorna se acertou alguém. */
  hit: (at: THREE.Vector3, radius: number, amount: number, pvpCap?: { hits: Map<string, number>; max: number }) => boolean;
  /** Dano em linha; once evita acertar o mesmo alvo duas vezes no mesmo feitiço. */
  line: (from: THREE.Vector3, to: THREE.Vector3, radius: number, amount: number, once: Set<object>, pvpCap?: { hits: Map<string, number>; max: number }) => number;
  sfx: (name: SfxName, v?: number) => void;
  size: () => number;
};

/** Ondas (série de Fourier): amplitude, frequência espacial, fase e cor. */
type Wave = { A: number; k: number; ph: number; c: THREE.Color; tilt: number };

export class MathSpells {
  private readonly v1 = new THREE.Vector3(); private readonly v2 = new THREE.Vector3(); private readonly v3 = new THREE.Vector3();
  constructor(private readonly k: MathKit) {}

  /** live = false: só o visual (feitiço de outro jogador). */
  cast(id: MathSpell, origin: THREE.Vector3, dir: THREE.Vector3, target: THREE.Vector3, live: boolean) {
    const o = origin.clone(), d = dir.clone().normalize(), t = target.clone();
    // feitiço de outro jogador: o que gira "em volta do matemático" fica parado onde ele estava ao lançar
    const anchor = live ? this.k.player.position : o.clone().setY(terrainHeight(o.x, o.z));
    switch (id) {
      case 'seno': this.wave(o, d, false, live); break;
      case 'fourier': this.wave(o, d, true, live); break;
      case 'numeros': this.numeros(o, d, t, live); break;
      case 'fibonacci': this.fibonacci(this.ground(t), live); break;
      case 'exponencial': this.exponencial(this.ground(t), live); break;
      case 'euler': this.euler(this.ground(t), live); break;
      case 'piCirculo': this.piCirculo(anchor, live); break;
      case 'integral': this.integral(anchor.clone(), d, live); break;
      case 'planoCartesiano': this.domainBurst(anchor.clone(), true); break;
      case 'imaginario': case 'infinito': break; // o jogo teletransporta e chama blink()
    }
  }

  private ground(p: THREE.Vector3) { return p.set(p.x, terrainHeight(p.x, p.z), p.z); }
  private flatDir(d: THREE.Vector3) { const f = new THREE.Vector3(d.x, 0, d.z); return f.lengthSq() < 1e-6 ? f.set(0, 0, 1) : f.normalize(); }

  /** Onda Seno (Q) / Série de Fourier (Q na expansão): números correndo sobre senoides, atravessando inimigos. */
  private wave(origin: THREE.Vector3, d: THREE.Vector3, big: boolean, live: boolean) {
    const k = this.k, range = big ? 30 : 24, speed = big ? 30 : 26, life = range / speed + .45;
    const side = new THREE.Vector3().crossVectors(d, UP); if (side.lengthSq() < 1e-6) side.set(1, 0, 0); side.normalize();
    const up2 = new THREE.Vector3().crossVectors(side, d).normalize();
    const waves: Wave[] = big
      ? [{ A: .55, k: 1.7, ph: 0, c: MC.cyan, tilt: 0 }, { A: .38, k: 3.3, ph: 1.3, c: MC.violet, tilt: 1.1 }, { A: .8, k: .85, ph: 2.6, c: MC.gold, tilt: 2.1 }, { A: .3, k: 5.1, ph: .4, c: MC.pink, tilt: .6 }]
      : [{ A: .62, k: 1.5, ph: 0, c: MC.cyan, tilt: 0 }];
    const once = new Set<object>(), dmg = big ? 72 : 34, R = big ? 1.25 : .85;
    let age = 0, prev = 0;
    k.flash(origin, big ? MC.white : MC.cyan, big ? 1.8 : 1.1, .2);
    k.light(origin, MC.cyan, big ? 6 : 3.5, .35, 7);
    k.sfx(big ? 'beamFire' : 'cast', big ? .7 : .8);
    if (big) this.label('f(x)=Σ...', origin.clone().addScaledVector(up2, .9), .32, MC.white);
    k.effect(life, (_, dt) => {
      age += dt; const head = Math.min(range, age * speed);
      if (live && head > prev) {
        k.line(this.v1.copy(origin).addScaledVector(d, prev), this.v2.copy(origin).addScaledVector(d, head), R, dmg, once);
      }
      prev = head;
      const tail = Math.max(0, head - (big ? 9 : 7)), fadeAll = age > range / speed ? 1 - (age - range / speed) / .45 : 1;
      for (const w of waves) {
        const c = Math.cos(w.tilt), s = Math.sin(w.tilt);
        for (let x = tail; x <= head; x += .42) {
          const env = smooth((x - tail) / 2) * smooth((head - x) / .6 + .3), y = w.A * Math.sin(w.k * x - age * 7 + w.ph) * env;
          const p = this.v3.copy(origin).addScaledVector(d, x).addScaledVector(side, y * c).addScaledVector(up2, y * s);
          k.glyphs.draw(p.x, p.y, p.z, big ? .24 : .21, w.c, fadeAll * (.4 + .6 * env), DIGIT(Math.floor(x / .42) + Math.floor(age * 6)));
        }
      }
      const h = this.v3.copy(origin).addScaledVector(d, head);
      if (head < range) for (let i = 0; i < (big ? 3 : 2); i++) k.spark(h.x, h.y, h.z, rr(-1.5, 1.5), rr(-1, 1.5), rr(-1.5, 1.5), rr(.25, .5), big ? .3 : .22, MC.white, MC.cyan);
    });
  }

  /** Rajada Numérica (1): seis números disparados em sequência; cada um explode no primeiro alvo. */
  private numeros(origin: THREE.Vector3, d: THREE.Vector3, target: THREE.Vector3, live: boolean) {
    const k = this.k, dist = Math.min(28, Math.max(3, origin.distanceTo(target)));
    const side = new THREE.Vector3().crossVectors(d, UP); if (side.lengthSq() < 1e-6) side.set(1, 0, 0); side.normalize();
    const shots = [1, 2, 3, 5, 7, 9].map((n, i) => {
      const end = target.clone().addScaledVector(side, rr(-.5, .5)).add(this.v1.set(0, rr(-.2, .4), 0));
      const from = origin.clone().addScaledVector(side, (i % 2 ? 1 : -1) * .35 * (1 + (i >> 1) * .3));
      return { from, vel: end.sub(from).normalize().multiplyScalar(32), pos: from.clone(), delay: i * .065, left: dist + 1.5, done: false, n };
    });
    k.sfx('cast', .9);
    k.effect(1.4, (_, dt) => {
      for (const s of shots) {
        if (s.done) continue;
        if (s.delay > 0) { s.delay -= dt; if (s.delay <= 0) k.flash(s.from, MC.cyan, .5, .12); continue; }
        const step = 32 * dt; s.pos.addScaledVector(s.vel, dt); s.left -= step;
        k.glyphs.draw(s.pos.x, s.pos.y, s.pos.z, .42, MC.white, 1, s.n, Math.sin(s.left * 2) * .3);
        k.glyphs.emit(s.pos.x, s.pos.y, s.pos.z, { life: .22, s0: .2, s1: .02, c0: MC.cyan, c1: MC.violet, glyph: s.n });
        const hitNow = live && k.hit(s.pos, .5, 13);
        const groundY = terrainHeight(s.pos.x, s.pos.z);
        if (hitNow || s.left <= 0 || s.pos.y < groundY) {
          s.done = true;
          k.flash(s.pos, MC.cyan, 1.1, .18);
          for (let i = 0; i < 6; i++) k.glyphs.emit(s.pos.x, s.pos.y, s.pos.z, { vx: rr(-3, 3), vy: rr(-1, 3), vz: rr(-3, 3), life: rr(.35, .6), s0: .18, s1: .04, c0: MC.white, c1: MC.cyan, glyph: DIGIT(s.n + i), drag: 3 });
          if (live && !hitNow) k.hit(s.pos, .9, 9);
        }
      }
    });
  }

  /** Explosão Exponencial (2): um "e" cresce como eˣ sobre o alvo e explode. */
  private exponencial(c: THREE.Vector3, live: boolean) {
    const k = this.k, T = 1.1, center = c.clone().setY(c.y + 1.2);
    let age = 0, boomed = false;
    k.sfx('fireCharge', .6);
    k.effect(1.7, (_, dt) => {
      age += dt;
      if (age < T) {
        const g = Math.exp(age * 1.6), sz = .26 * g, r = .25 * g;
        k.glyphs.draw(center.x, center.y + sz * .2, center.z, sz, MC.gold, .95, G('e'));
        k.glyphs.draw(center.x + sz * .38, center.y + sz * .55, center.z, sz * .45, MC.white, .9, G('x'));
        for (let i = 0; i < 8; i++) {
          const a = age * (3 + g) + i / 8 * TAU;
          k.glyphs.draw(center.x + Math.sin(a) * r * 1.4, center.y + Math.sin(a * 2) * .2, center.z + Math.cos(a) * r * 1.4, .2, MC.cyan, .8, DIGIT(Math.round(Math.exp(i * .5))));
        }
        if (Math.random() < dt * 30) k.spark(center.x, center.y, center.z, rr(-2, 2), rr(-1, 2), rr(-2, 2), .4, .25, MC.gold, MC.pink);
      } else if (!boomed) {
        boomed = true;
        const R = 4.2 * k.size();
        if (live) k.hit(center, 4.2, 85);
        k.flash(center, MC.gold, 5, .35); k.dome(center, MC.gold, R, .45); k.shock(this.v1.copy(c).setY(c.y + .08), UP, MC.cyan, R * 1.1, .5);
        k.light(center, MC.gold, 9, .5, 14); k.shake(.4); k.sfx('fireBoom', .8);
        for (let i = 0; i < 46; i++) {
          const a = Math.random() * TAU, e = rr(-.2, 1), sp = rr(5, 11);
          k.glyphs.emit(center.x, center.y, center.z, { vx: Math.cos(a) * sp, vy: e * sp * .7 + 1, vz: Math.sin(a) * sp, life: rr(.6, 1.1), s0: rr(.22, .4), s1: .05, c0: MC.white, c1: i % 3 ? MC.gold : MC.cyan, glyph: i % 4 ? DIGIT(i) : G('e'), drag: 2.5, grav: 3, rot: rr(-1, 1) });
        }
      }
    });
  }

  /** Espiral de Fibonacci (1 na expansão): 1, 1, 2, 3, 5, 8… pousando numa espiral áurea, cada número explode. */
  private fibonacci(c: THREE.Vector3, live: boolean) {
    const k = this.k, fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144], phi = 1.618034;
    const pts = fib.map((n, i) => {
      const th = i * Math.PI / 2 * .92 + .3, r = .32 * Math.pow(phi, i * .52) * k.size();
      return { n, x: c.x + Math.cos(th) * r, z: c.z + Math.sin(th) * r, at: .12 + i * .075, done: false, rad: .9 + i * .07 };
    });
    let age = 0;
    const pvpCap = { hits: new Map<string, number>(), max: 3 }; // no PvP, no máx. 3 das 12 explosões acertam cada jogador
    k.sfx('chargeFull', .8);
    this.label('φ=1.618', c.clone().setY(c.y + 3.4), .4, MC.gold);
    k.effect(2, (t, dt) => {
      age += dt;
      // a espiral sendo desenhada (pontos dourados)
      const reach = Math.min(fib.length - 1, age / .075);
      for (let s = 0; s <= reach * 4; s++) {
        const i = s / 4, th = i * Math.PI / 2 * .92 + .3, r = .32 * Math.pow(phi, i * .52) * k.size(), x = c.x + Math.cos(th) * r, z = c.z + Math.sin(th) * r;
        k.glyphs.draw(x, terrainHeight(x, z) + .25, z, .2, MC.gold, (1 - t) * .9, G('·'));
      }
      for (const p of pts) {
        if (age < p.at) continue;
        const y = terrainHeight(p.x, p.z);
        if (!p.done) {
          p.done = true; this.v1.set(p.x, y + .9, p.z);
          if (live) k.hit(this.v1, p.rad, 24, pvpCap);
          k.flash(this.v1, MC.gold, 1 + p.rad * .5, .2); k.shock(this.v2.set(p.x, y + .08, p.z), UP, MC.cyan, p.rad * 1.3, .35);
          for (let i = 0; i < 5; i++) k.spark(p.x, y + .9, p.z, rr(-2.5, 2.5), rr(1, 4), rr(-2.5, 2.5), .5, .25, MC.white, MC.gold);
        }
        const life = clamp01(1 - (age - p.at) / 1.4);
        k.glyphs.text(String(p.n), p.x, y + 1.1 + (1 - life) * .6, p.z, .36 + p.rad * .12, MC.white, life);
      }
      if (age > .1 && age < .2) k.light(c, MC.gold, 7, .9, 14);
    });
  }

  /** Identidade de Euler (2 na expansão): e^{iπ}+1=0 escrito no céu, colapsa num 0 gigante que cai sobre a área. */
  private euler(c: THREE.Vector3, live: boolean) {
    const k = this.k, eq = 'e^iπ+1=0', top = c.clone().setY(c.y + 3.6), R = 5.5;
    let age = 0, boomed = false;
    k.sfx('lightCharge', 1);
    k.effect(1.9, (_, dt) => {
      age += dt;
      const r = k.glyphs.right(this.v3), chars = [...eq], w = .62 * .62;
      if (age < 1) {
        // as letras aparecem uma a uma e depois correm para o centro
        const gather = smooth((age - .62) / .32);
        chars.forEach((ch, i) => {
          const appear = smooth((age - i * .06) / .12); if (appear <= 0) return;
          const off = (-(chars.length - 1) / 2 + i) * w * (1 - gather);
          k.glyphs.draw(top.x + r.x * off, top.y + (ch === 'i' || ch === 'π' ? .18 : 0) * (1 - gather), top.z + r.z * off, .62 * (1 - gather * .4), i === chars.length - 1 ? MC.gold : MC.white, appear, G(ch === '^' ? '^' : ch));
        });
        // círculo unitário girando (e^{iθ}) em volta do alvo
        for (let i = 0; i < 24; i++) {
          const a = i / 24 * TAU + age * 3, x = c.x + Math.cos(a) * R, z = c.z + Math.sin(a) * R;
          k.glyphs.draw(x, terrainHeight(x, z) + .3, z, .26, i % 6 ? MC.cyan : MC.gold, smooth(age * 2) * .8, i % 6 ? G('·') : G('i'));
        }
        if (Math.random() < dt * 40) k.spark(top.x, top.y, top.z, rr(-1, 1), rr(-1, 1), rr(-1, 1), .4, .3, MC.white, MC.violet);
      } else {
        if (!boomed) {
          boomed = true;
          if (live) k.hit(c.clone().setY(c.y + 1), R, 190);
          const g = c.clone().setY(c.y + .1);
          k.flash(c.clone().setY(c.y + 1.2), MC.white, 7, .4); k.dome(c.clone().setY(c.y + .5), MC.cyan, R * k.size(), .55);
          k.shock(g, UP, MC.gold, R * 1.3 * k.size(), .6); k.shock(g, UP, MC.cyan, R * .8 * k.size(), .45);
          k.light(g, MC.white, 12, .6, 18); k.shake(.6); k.sfx('fireBoom', 1);
          for (let i = 0; i < 60; i++) {
            const a = i / 60 * TAU, sp = rr(6, 13);
            k.glyphs.emit(c.x, c.y + .6, c.z, { vx: Math.cos(a) * sp, vy: rr(1, 5), vz: Math.sin(a) * sp, life: rr(.7, 1.2), s0: .34, s1: .06, c0: MC.white, c1: i % 2 ? MC.cyan : MC.gold, glyph: G('0'), drag: 2.4, grav: 4, rot: rr(-1, 1) });
          }
        }
        // o "0" gigante caindo e assentando como um anel
        const f = clamp01((age - 1) / .9);
        for (let i = 0; i < 28; i++) {
          const a = i / 28 * TAU, x = c.x + Math.cos(a) * R * k.size(), z = c.z + Math.sin(a) * R * k.size();
          k.glyphs.draw(x, terrainHeight(x, z) + .5 + (1 - f) * .3, z, .5, MC.gold, 1 - f, G('0'));
        }
      }
    });
  }

  /** Círculo de π (3): os dígitos de π orbitam o matemático e ferem quem chegar perto. */
  private piCirculo(anchor: THREE.Vector3, live: boolean) {
    const k = this.k, life = 4.2, R = 3.2 * k.size();
    let age = 0, tick = 0;
    k.sfx('shieldUp', .7);
    k.effect(life, (t, dt) => {
      age += dt; const p = anchor, fade = smooth(age * 3) * smooth((life - age) * 2);
      for (let i = 0; i < PI_DIGITS.length; i++) {
        const a = age * 2.6 + i / PI_DIGITS.length * TAU, h = 1.1 + Math.sin(a * 2 + age * 3) * .15;
        k.glyphs.draw(p.x + Math.sin(a) * R, p.y + h, p.z + Math.cos(a) * R, .32, i === 0 ? MC.gold : MC.white, fade, G(PI_DIGITS[i]));
        const b = -age * 1.8 + i / PI_DIGITS.length * TAU;
        if (i % 2 === 0) k.glyphs.draw(p.x + Math.sin(b) * R * .6, p.y + .5, p.z + Math.cos(b) * R * .6, .2, MC.cyan, fade * .6, G('·'));
      }
      k.glyphs.draw(p.x, p.y + 2.75, p.z, .55, MC.gold, fade * .9, G('π'));
      tick -= dt;
      if (tick <= 0) {
        tick = .45;
        if (live) k.hit(this.v1.set(p.x, p.y + 1, p.z), R + .3, 15);
        k.shock(this.v2.set(p.x, terrainHeight(p.x, p.z) + .08, p.z), UP, MC.cyan, R, .4);
      }
      void t;
    });
  }

  /** Integral Definida (3 na expansão): a área sob a curva enche uma faixa à frente e fere tudo nela, várias vezes. */
  private integral(from: THREE.Vector3, dir: THREE.Vector3, live: boolean) {
    const k = this.k, d = this.flatDir(dir), side = new THREE.Vector3(d.z, 0, -d.x), len = 18 * k.size(), life = 2.8;
    const start = from.addScaledVector(d, 1.2), end = start.clone().addScaledVector(d, len);
    const f = (s: number) => 1.3 + .9 * Math.sin(s * .55) + .35 * Math.sin(s * 1.7);
    let age = 0, tick = .25;
    const pvpCap = { hits: new Map<string, number>(), max: 3 }; // no PvP, no máx. 3 dos 5 golpes da área acertam cada jogador
    k.sfx('lightCharge', .8);
    k.effect(life, (_, dt) => {
      age += dt; const fill = smooth(age / .5) * len, fade = smooth((life - age) * 2);
      // o ∫ gigante e os limites a e b
      const gy0 = terrainHeight(start.x, start.z);
      k.glyphs.draw(start.x - d.x * .6, gy0 + 1.6, start.z - d.z * .6, 1.5, MC.white, fade, G('∫'));
      k.glyphs.draw(start.x - d.x * .2 + side.x * .5, gy0 + 2.5, start.z - d.z * .2 + side.z * .5, .4, MC.gold, fade, G('b'));
      k.glyphs.draw(start.x - d.x * .9 - side.x * .3, gy0 + .55, start.z - d.z * .9 - side.z * .3, .4, MC.gold, fade, G('a'));
      for (let s = 0; s <= fill; s += .8) {
        const x0 = start.x + d.x * s, z0 = start.z + d.z * s, gy = terrainHeight(x0, z0), h = f(s);
        // curva f(x) em dourado e colunas de números enchendo a área por baixo
        k.glyphs.draw(x0, gy + h + .15, z0, .42, MC.gold, fade, G('·'));
        for (let y = .3; y < h; y += .36) {
          const glyph = DIGIT(Math.floor(s * 3 + y * 5 + age * 4));
          for (const o of [-1, 0, 1]) k.glyphs.draw(x0 + side.x * o * 1.05, gy + y, z0 + side.z * o * 1.05, .3, o ? MC.deep : MC.cyan, fade * (.35 + .4 * (y / h)), glyph);
        }
      }
      tick -= dt;
      if (tick <= 0 && age < life - .3) {
        tick = .5;
        const once = new Set<object>(), a = this.v1.copy(start).setY(gy0 + 1), b = this.v2.copy(start).addScaledVector(d, fill); b.y = terrainHeight(b.x, b.z) + 1;
        if (live) k.line(a, b, 1.7, 34, once, pvpCap);
        for (let i = 0; i < 6; i++) { const s = Math.random() * fill, x = start.x + d.x * s, z = start.z + d.z * s; k.spark(x, terrainHeight(x, z) + .3, z, 0, rr(2, 4), 0, .5, .3, MC.cyan, MC.white); }
      }
    });
    void end;
  }

  /** Pulso da abertura do domínio: anel de números saindo do matemático. */
  domainBurst(at: THREE.Vector3, opening: boolean) {
    const k = this.k, g = this.v1.set(at.x, terrainHeight(at.x, at.z) + .1, at.z);
    k.shock(g, UP, MC.cyan, opening ? 9 : 5, opening ? 1.1 : .6); k.shock(g, UP, MC.white, opening ? 4 : 3, .5);
    k.flash(this.v2.set(at.x, at.y + 1.3, at.z), MC.white, opening ? 4 : 2.5, .4);
    k.light(this.v2, MC.cyan, opening ? 10 : 6, opening ? .9 : .5, 16);
    for (let i = 0; i < (opening ? 70 : 40); i++) {
      const a = Math.random() * TAU, sp = rr(3, opening ? 12 : 7);
      k.glyphs.emit(at.x, at.y + rr(.4, 2), at.z, { vx: Math.cos(a) * sp, vy: rr(-.5, 3), vz: Math.sin(a) * sp, life: rr(.8, 1.6), s0: rr(.25, .45), s1: .05, c0: MC.white, c1: i % 3 ? MC.cyan : MC.gold, glyph: i % 3 ? DIGIT(i) : SYMBOLS[i % SYMBOLS.length], drag: 1.6, grav: opening ? 0 : 3, rot: rr(-1, 1) });
    }
    k.shake(opening ? .45 : .25);
  }

  /** Rotação i (4) e Limite ao Infinito (4 na expansão): efeito do teletransporte (o jogo move o herói). */
  blink(from: THREE.Vector3, to: THREE.Vector3, big: boolean, live: boolean) {
    const k = this.k, a = from.clone(), b = to.clone();
    k.sfx('dodge', 1);
    if (big && live) { k.line(this.v1.copy(a).setY(a.y + 1), this.v2.copy(b).setY(b.y + 1), 1.3, 60, new Set()); k.hit(this.v1.copy(b).setY(b.y + 1), 3, 40); }
    else if (live) k.hit(this.v1.copy(b).setY(b.y + 1), 2, 22);
    k.flash(this.v1.copy(a).setY(a.y + 1.1), MC.cyan, 1.6, .25); k.flash(this.v2.copy(b).setY(b.y + 1.1), MC.white, big ? 3 : 2, .3);
    k.shock(this.v1.copy(b).setY(terrainHeight(b.x, b.z) + .08), UP, big ? MC.gold : MC.cyan, big ? 3.2 : 2, .45);
    const steps = Math.max(6, Math.round(a.distanceTo(b) * 2));
    for (let i = 0; i <= steps; i++) {
      const f = i / steps;
      k.glyphs.emit(a.x + (b.x - a.x) * f, a.y + 1 + (b.y - a.y) * f, a.z + (b.z - a.z) * f, { vy: rr(.2, .8), life: rr(.4, .8), s0: .22, s1: .03, c0: MC.white, c1: big ? MC.gold : MC.violet, glyph: big ? G('∞') : G('i'), drag: 1 });
    }
    let age = 0;
    k.effect(big ? 1.1 : .8, (t) => {
      age = t;
      for (const [p, s] of [[a, 1], [b, 1.2]] as [THREE.Vector3, number][]) {
        for (let i = 0; i < 20; i++) {
          const th = i / 20 * TAU + age * 6, fade = 1 - age;
          let x: number, y: number;
          if (big) { const den = 1 + Math.sin(th) ** 2; x = 1.6 * s * Math.cos(th) / den; y = 1.6 * s * Math.sin(th) * Math.cos(th) / den; } // lemniscata ∞
          else { x = Math.cos(th) * s; y = Math.sin(th) * s; } // círculo unitário (× i = girar 90°)
          const r = k.glyphs.right(this.v3);
          k.glyphs.draw(p.x + r.x * x, p.y + 1.1 + y, p.z + r.z * x, .18, i % 5 ? MC.cyan : MC.gold, fade, i % 5 ? G('·') : big ? G('∞') : G('i'));
        }
        k.glyphs.draw(p.x, p.y + 1.1, p.z, big ? .9 : .6, MC.white, 1 - age, big ? G('∞') : G('i'));
      }
    });
  }

  /** Ataque básico: números saltam do golpe (na expansão: um × gigante). */
  slash(at: THREE.Vector3, big: boolean) {
    const k = this.k;
    k.flash(at, big ? MC.white : MC.cyan, big ? 1.6 : .9, .16);
    if (big) { k.glyphs.emit(at.x, at.y, at.z, { life: .35, s0: 1.1, s1: .4, c0: MC.white, c1: MC.gold, glyph: G('×'), rot: rr(-.6, .6) }); k.shock(at, this.flatDir(this.v1.subVectors(at, k.player.position)), MC.cyan, 1.6, .3); }
    for (let i = 0; i < (big ? 14 : 6); i++) k.glyphs.emit(at.x, at.y, at.z, { vx: rr(-3, 3), vy: rr(0, 3), vz: rr(-3, 3), life: rr(.3, .55), s0: .2, s1: .04, c0: MC.white, c1: big ? MC.gold : MC.cyan, glyph: DIGIT(i * 7), drag: 3, grav: 2 });
  }

  /** Fórmula escrita no ar por um instante. */
  private label(str: string, at: THREE.Vector3, size: number, c: THREE.Color) {
    const k = this.k, p = at.clone();
    k.effect(1.1, t => k.glyphs.text(str, p.x, p.y + t * .4, p.z, size, c, smooth(t * 6) * (1 - t)));
  }
}

/* ------------------------------------------------------------------ barreira do matemático */
/** Lado (m) do painel da barreira: o mesmo da muralha arcana (a colisão usa a mesma meia-largura). */
export const MATH_WALL = 3.7;
const PANEL_VS = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const PANEL_FS = `
uniform float uTime; uniform float uAlpha; uniform float uReveal; uniform float uFlash; uniform vec2 uHit; uniform float uHitT; uniform float uMinor;
uniform vec3 uDeep; uniform vec3 uGrid; uniform vec3 uAxis; uniform vec3 uCurve;
varying vec2 vUv;
vec3 toSRGB(vec3 c){return pow(max(c,vec3(0.0)),vec3(1.0/2.2));}
float lineAA(float v){float fw=max(fwidth(v),1e-4);return 1.-min(abs(v)/fw,1.);}
void main(){
  vec2 p=(vUv-.5)*8.; // coordenadas do plano: -4..4
  float box=max(abs(p.x),abs(p.y)); if(box>uReveal*4.)discard;
  vec2 g=abs(fract(p-.5)-.5); float grid=max(lineAA(g.x),lineAA(g.y));
  vec2 g2=abs(fract(p*4.-.5)-.5); float minor=max(lineAA(g2.x),lineAA(g2.y))*.3*uMinor;
  float axis=max(lineAA(p.x)*1.6,lineAA(p.y)*1.6); axis=clamp(axis,0.,1.);
  // gráfico animado: y = 2·sen(1,3x − t) e uma parábola pontilhada
  float f=2.*sin(p.x*1.3-uTime*2.2); float fy=p.y-f; float curve=1.-smoothstep(0.,2.2,abs(fy)/max(fwidth(fy),1e-4));
  float q=p.x*p.x*.25-3.; float qy=p.y-q; float para=(1.-smoothstep(0.,1.6,abs(qy)/max(fwidth(qy),1e-4)))*step(.5,fract(p.x*2.+uTime*.5));
  float edge=smoothstep(3.75,3.97,box)*(1.-smoothstep(3.97,4.,box));
  float scan=exp(-pow((p.y-(fract(uTime*.35)*8.-4.))*3.,2.))*.35;
  float r=length(p-uHit*4.); float ring=exp(-pow((r-uHitT*9.)*1.6,2.))*(1.-uHitT)*1.5;
  float rim=smoothstep(uReveal*4.-.35,uReveal*4.,box)*step(uReveal,.999);
  vec3 c=uDeep*.55+uGrid*(grid*.55+minor)+uAxis*axis+uCurve*curve+uCurve*para*.6+uAxis*(edge+rim+ring+scan)+uAxis*uFlash*.6;
  float a=.16*uMinor+.06+grid*(.2+.2*uMinor)+minor*.5+axis*.9+curve*.9+para*.5+edge+rim+ring+scan+uFlash*.35;
  gl_FragColor=vec4(toSRGB(c),clamp(a*uAlpha,0.,1.));
}`;
/**
 * Sinal de Igual (F do matemático): em vez da muralha de favos, um mini plano cartesiano vertical à frente —
 * grade, eixos numerados, um gráfico animado e números escorrendo. Abre do centro (como um "zoom" do plano).
 * Um por herói (o local fica dentro do shieldRoot do MagicSystem; os remotos, presos ao avatar).
 */
export class MathBarrier {
  readonly mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private readonly u = {
    uTime: { value: 0 }, uAlpha: { value: 0 }, uReveal: { value: 0 }, uFlash: { value: 0 }, uHit: { value: new THREE.Vector2(9, 9) }, uHitT: { value: 1 }, uMinor: { value: 1 },
    uDeep: { value: MC.deep.clone() }, uGrid: { value: col('#4fb4ff') }, uAxis: { value: MC.white.clone() }, uCurve: { value: MC.gold.clone() },
  };
  private age = 0; private on = false; private readonly w = new THREE.Vector3();
  /** gs: escala dos números desenhados (os mini escudos usam números menores). */
  constructor(parent: THREE.Object3D, private readonly glyphs: GlyphParticles, private readonly gs = 1) {
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(MATH_WALL, MATH_WALL), new THREE.ShaderMaterial({ uniforms: this.u, vertexShader: PANEL_VS, fragmentShader: PANEL_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
    this.mesh.renderOrder = 8; this.mesh.visible = false; this.mesh.name = 'math-barrier'; this.mesh.frustumCulled = false;
    this.u.uMinor.value = gs < 1 ? 0 : 1; // mini escudo: sem a grade fina (pequena demais, estouraria em branco)
    parent.add(this.mesh);
  }
  setCompile(v: boolean) { this.mesh.visible = v || this.on; if (v) { this.u.uAlpha.value = .01; this.u.uReveal.value = 1; } }
  /** Golpe bloqueado: onda saindo do ponto (coordenadas locais do painel, em metros). */
  hit(lx: number, ly: number) { this.u.uHit.value.set(lx / (MATH_WALL / 2), ly / (MATH_WALL / 2)); this.u.uHitT.value = 0; this.u.uFlash.value = .6; }
  /** fade: 0..1 (piscando quando quase quebrando); closing: fecha de fora para dentro. */
  update(dt: number, time: number, active: boolean, fade = 1, closing = false) {
    if (active && !this.on) this.age = 0;
    this.on = active; this.mesh.visible = active;
    if (!active) return;
    this.age += dt;
    const u = this.u;
    u.uTime.value = time; u.uAlpha.value = fade; u.uReveal.value = closing ? Math.max(.05, fade) : easeOutCubic(this.age / .45) * 1.02;
    u.uFlash.value = Math.max(0, u.uFlash.value - dt * 2.4); if (u.uHitT.value < 1) u.uHitT.value = Math.min(1, u.uHitT.value + dt * 1.5);
    // números do plano: marcas dos eixos, x, y e 0, e colunas de algarismos escorrendo
    this.mesh.updateMatrixWorld();
    const g = this.glyphs, H = MATH_WALL / 2, step = MATH_WALL / 8, reveal = u.uReveal.value, a = fade;
    const put = (lx: number, ly: number, size: number, c: THREE.Color, alpha: number, glyph: number) => {
      if (Math.max(Math.abs(lx), Math.abs(ly)) > H * reveal) return;
      this.w.set(lx, ly, .04).applyMatrix4(this.mesh.matrixWorld); g.draw(this.w.x, this.w.y, this.w.z, size * this.gs, c, alpha, glyph);
    };
    for (let i = -3; i <= 3; i++) {
      if (!i) continue;
      if (i < 0) put(i * step - .07, -.14, .13, MC.white, a * .8, G('−'));
      put(i * step + (i < 0 ? .03 : 0), -.14, .15, MC.white, a * .9, DIGIT(Math.abs(i)));
      if (i < 0) put(.1, i * step, .13, MC.white, a * .8, G('−'));
      put(.17, i * step, .15, MC.white, a * .9, DIGIT(Math.abs(i)));
    }
    put(.12, -.14, .15, MC.white, a, G('0'));
    put(H - .18, .16, .22, MC.gold, a, G('x')); put(.2, H - .2, .22, MC.cyan, a, G('y'));
    put(-H + .5, H - .25, .2, MC.gold, a * .9, G('f'));
    for (let c = 0; c < 9; c++) {
      const x = -H + .2 + c * (MATH_WALL - .4) / 8, sp = .5 + (c * 37 % 7) * .12;
      for (let k = 0; k < 6; k++) {
        const y = H - (((time * sp + k / 6 + c * .13) % 1) * MATH_WALL);
        put(x, y, .14, MC.cyan, a * .35 * (1 - k / 7), DIGIT(c * 3 + k + Math.floor(time * 5)));
      }
    }
  }
  dispose() { this.mesh.removeFromParent(); this.mesh.geometry.dispose(); this.mesh.material.dispose(); }
}

/** Escala dos mini escudos em relação ao Sinal de Igual (painel de ~1,3 m). */
const MINI = .36;
type MiniSlot = { holder: THREE.Group; bar: MathBarrier; t: number; life: number; anchor: THREE.Vector3 | null; offset: THREE.Vector3; dir: THREE.Vector3 };
/**
 * Mini escudos automáticos do Plano Cartesiano: um pequeno plano cartesiano surge entre o matemático e o golpe,
 * por um instante, e acompanha o corpo. Pool fixo (sem criar nada em combate).
 */
export class MiniGuards {
  private readonly slots: MiniSlot[] = [];
  private readonly look = new THREE.Vector3();
  constructor(parent: THREE.Object3D, glyphs: GlyphParticles, count = 4) {
    for (let i = 0; i < count; i++) {
      const holder = new THREE.Group(); holder.name = 'math-mini-guard'; holder.visible = false; parent.add(holder);
      this.slots.push({ holder, bar: new MathBarrier(holder, glyphs, MINI * 1.6), t: 0, life: 0, anchor: null, offset: new THREE.Vector3(), dir: new THREE.Vector3(0, 0, 1) });
    }
  }
  setCompile(v: boolean) { const s = this.slots[0]; s.holder.visible = v || s.life > 0; s.holder.scale.setScalar(MINI); s.bar.setCompile(v); }
  /** Ergue um mini escudo em anchor + offset, virado para dir. anchor é seguido enquanto o escudo dura. */
  pop(anchor: THREE.Vector3, offset: THREE.Vector3, dir: THREE.Vector3, life = .75) {
    const s = this.slots.find(x => x.life <= 0) ?? this.slots.reduce((a, b) => (a.t / a.life > b.t / b.life ? a : b));
    s.anchor = anchor; s.offset.copy(offset); s.dir.copy(dir); s.t = 0; s.life = life; s.holder.visible = true;
    s.bar.update(0, 0, false); s.bar.hit(0, 0);
    this.place(s, 0);
    return s.holder;
  }
  private place(s: MiniSlot, k: number) {
    const a = s.anchor!; s.holder.position.copy(a).add(s.offset);
    s.holder.lookAt(this.look.copy(s.holder.position).add(s.dir));
    const x = clamp01(k / .18), back = 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2); // estalo de abertura (easeOutBack)
    s.holder.scale.setScalar(Math.max(.001, MINI * back));
  }
  update(dt: number, time: number) {
    for (const s of this.slots) {
      if (s.life <= 0) continue;
      s.t += dt;
      if (s.t >= s.life) { s.life = 0; s.holder.visible = false; s.bar.update(dt, time, false); continue; }
      this.place(s, s.t);
      const fade = clamp01((s.life - s.t) / .25);
      s.bar.update(dt, time, true, fade, s.t > s.life - .25);
    }
  }
}
