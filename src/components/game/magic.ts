import * as THREE from 'three';
import { terrainHeight } from './world';
import type { CombatSystem } from './combat';
import type { PlayerProgression } from './progression';

export type SpellId = 'zoltraak' | 'vollzanbel' | 'judradjim' | 'shield' | 'flight';
type SigilStyle = 'rune' | 'sun' | 'arc' | 'wind';
type Vec3 = THREE.Vector3;
type LightSlot = { light: THREE.PointLight; age: number; life: number; peak: number; active: boolean; held: boolean };
type Effect = { object: THREE.Object3D; age: number; life: number; step: (t: number, dt: number) => void };
type Projectile = {
  object: THREE.Group; dir: Vec3; velocity: Vec3; speed: number; age: number; kind: 'zoltraak' | 'vollzanbel'; target: Vec3;
  damage: (at: Vec3, radius: number, amount: number) => void; light: LightSlot | null;
  times: { value: number }[]; rings: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial }[]; spins: { obj: THREE.Object3D; rate: number }[]; halo: THREE.Sprite;
};

const COST: Record<SpellId, number> = { zoltraak: 10, vollzanbel: 34, judradjim: 27, shield: 20, flight: 12 };
const COOLDOWN: Record<SpellId, number> = { zoltraak: .38, vollzanbel: 4.2, judradjim: 3.4, shield: 9, flight: .7 };

/* ------------------------------------------------------------------ *
 *  Tunables / helpers
 * ------------------------------------------------------------------ */
const TAU = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);
const FWD = new THREE.Vector3(0, 0, 1);
/** Scale for every point light the spells use. Raise it if your scene is bright / lights are physically based and look dim. */
const LIGHT_GAIN = 1;
/** Point lights are pooled (never added/removed at runtime) so casting never triggers a shader recompile hitch. */
const LIGHT_SLOTS = 8;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const rr = (a: number, b: number) => a + Math.random() * (b - a);
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeOutBack = (x: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const col = (hex: string) => new THREE.Color(hex);

/** Frieren palette: muted, soft, slightly desaturated. Gold for basic magic, ember orange for fire, pale blue for lightning, mint for barrier/flight. */
const C = {
  paleGold: col('#fff1c9'), gold: col('#f3d98f'), goldDeep: col('#c99a45'),
  fireHot: col('#fff0b8'), fire: col('#ff9a3c'), ember: col('#7a1d08'),
  smokeA: col('#4a3b33'), smokeB: col('#1b1513'), dust: col('#9a8a74'), dustB: col('#6a5d4e'), debris: col('#3a2b1f'),
  bolt: col('#f4fbff'), boltGlow: col('#86c3ee'),
  barrier: col('#a8e3d2'), barrierHot: col('#eaf8e2'),
  mana: col('#bfeedd'), petalW: col('#fff6f2'), petalP: col('#f7c8d6'), petalB: col('#c4defa'),
};

/* ------------------------------------------------------------------ *
 *  GLSL
 * ------------------------------------------------------------------ */
const GLSL_SRGB = `vec3 toSRGB(vec3 c){return pow(max(c,vec3(0.0)),vec3(1.0/2.2));}`;
const GLSL_NOISE = `
float hash13(vec3 p){p=fract(p*.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}
float vnoise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
return mix(mix(mix(hash13(i),hash13(i+vec3(1,0,0)),f.x),mix(hash13(i+vec3(0,1,0)),hash13(i+vec3(1,1,0)),f.x),f.y),
mix(mix(hash13(i+vec3(0,0,1)),hash13(i+vec3(1,0,1)),f.x),mix(hash13(i+vec3(0,1,1)),hash13(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*vnoise(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s;}`;

const PARTICLE_VS = `
attribute vec3 aColor; attribute vec4 aParams; uniform float uScale; varying vec3 vColor; varying vec4 vParams;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;
gl_PointSize=clamp(aParams.x*uScale/max(-mv.z,.1),0.0,300.0);vColor=aColor;vParams=aParams;}`;
// kind: 0 soft glow, 1 four-point spark, 2 petal, 3 soft disc (smoke / debris)
const PARTICLE_FS = `
${GLSL_SRGB}
varying vec3 vColor; varying vec4 vParams;
void main(){
  vec2 p=gl_PointCoord*2.0-1.0; float c=cos(vParams.z),s=sin(vParams.z); p=vec2(c*p.x-s*p.y,s*p.x+c*p.y);
  float r=length(p); float k=vParams.w; float a;
  if(k<.5){a=pow(max(1.0-r,0.0),2.0)+exp(-r*r*14.0)*.5;}
  else if(k<1.5){float arm=max(0.,1.-abs(p.x)*10.)*max(0.,1.-abs(p.y))+max(0.,1.-abs(p.y)*10.)*max(0.,1.-abs(p.x));a=arm+exp(-r*r*20.)*.9;a*=1.-smoothstep(.85,1.,r);}
  else if(k<2.5){float w=.62*(1.-p.x*p.x)*(.7+.3*(p.x*.5+.5));float d=abs(p.y);a=(1.-smoothstep(w-.16,w,d))*step(abs(p.x),1.0);a*=.78+.22*(1.-d/max(w,.01));a*=1.-.3*(1.-smoothstep(.0,.08,d));}
  else{a=1.-smoothstep(.25,1.,r);}
  if(a<.003)discard;
  gl_FragColor=vec4(toSRGB(vColor),clamp(a,0.,1.)*vParams.y);
}`;

const LANCE_VS = `varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=-mv.xyz;gl_Position=projectionMatrix*mv;}`;
const LANCE_FS = `${GLSL_SRGB}
uniform float uTime; uniform float uGain; uniform vec3 uA; uniform vec3 uB; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main(){
  float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),1.5);
  float sp=.5+.5*sin(vUv.x*6.2831853*3.+vUv.y*26.-uTime*30.);
  float tp=sin(vUv.y*3.14159);
  vec3 c=mix(uA,uB,clamp(f*1.2,0.,1.))*(1.+sp*.35);
  float a=(.5+.5*(1.-f))*(.6+.4*sp)*(.35+.65*tp)*uGain;
  gl_FragColor=vec4(toSRGB(c*1.25),clamp(a,0.,1.));
}`;

const FRESNEL_VS = LANCE_VS;
const FRESNEL_FS = `${GLSL_SRGB}
uniform vec3 uColor; uniform float uPower; uniform float uGain; uniform float uAlpha; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),uPower);
gl_FragColor=vec4(toSRGB(uColor*(.4+f*1.6)*uGain),clamp((f+.04)*uAlpha,0.,1.));}`;

const FIRE_VS = `${GLSL_NOISE}
uniform float uTime; uniform float uSeed; varying vec3 vP; varying vec3 vN; varying vec3 vV;
void main(){
  float n=fbm(position*1.8+vec3(uSeed,uTime*2.0,uSeed*.7));
  vec3 p=position*(1.0+(n-.5)*.55);
  vP=position;vec4 mv=modelViewMatrix*vec4(p,1.);vN=normalize(normalMatrix*normal);vV=-mv.xyz;gl_Position=projectionMatrix*mv;
}`;
const FIRE_FS = `${GLSL_NOISE}${GLSL_SRGB}
uniform float uT; uniform float uTime; uniform float uSeed; varying vec3 vP; varying vec3 vN; varying vec3 vV;
void main(){
  float n=fbm(vP*2.6+vec3(uSeed,-uTime*3.0,uSeed));
  float rim=pow(1.-abs(dot(normalize(vN),normalize(vV))),1.6);
  float heat=clamp(n*1.15+(1.-rim)*.35-uT*.95,0.,1.);
  vec3 c=mix(vec3(.35,.05,.02),vec3(1.,.42,.08),smoothstep(.1,.45,heat));
  c=mix(c,vec3(1.,.82,.4),smoothstep(.45,.8,heat));
  c=mix(c,vec3(1.,.97,.85),smoothstep(.8,1.,heat));
  float a=smoothstep(.0,.25,heat+(1.-uT)*.25-.1)*(1.-smoothstep(.55,1.,uT))*(.55+.45*rim);
  gl_FragColor=vec4(toSRGB(c*1.35),clamp(a,0.,1.));
}`;

const SHIELD_VS = `varying vec2 vUv; varying vec3 vW; varying vec3 vNv; varying vec3 vVv;
void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vec4 mv=viewMatrix*w;vNv=normalize(normalMatrix*normal);vVv=-mv.xyz;gl_Position=projectionMatrix*mv;}`;
const SHIELD_FS = `${GLSL_SRGB}
uniform float uTime; uniform float uFlash; uniform float uAlpha; uniform float uHitT; uniform vec3 uHit; uniform vec3 uColA; uniform vec3 uColB;
varying vec2 vUv; varying vec3 vW; varying vec3 vNv; varying vec3 vVv;
void main(){
  vec2 p=(vUv-.5)*2.;
  float h=max(abs(p.y),abs(p.y)*.5+abs(p.x)*.866025)/.866025;
  float inside=1.-smoothstep(.93,1.,h);
  float border=smoothstep(.74,.95,h)*inside;
  float rim=pow(1.-abs(dot(normalize(vNv),normalize(vVv))),2.);
  float rings=.5+.5*sin(h*22.-uTime*1.4);
  float scan=.5+.5*sin(vW.y*18.-uTime*2.4);
  float d=distance(vW,uHit);
  float wave=exp(-pow((d-uHitT*2.6)*3.2,2.))*(1.-uHitT);
  float a=(.09+border*.55+rim*.18+scan*.04+rings*.025*(1.-border)+uFlash*.5+wave*.9)*inside*uAlpha;
  vec3 c=mix(uColA,uColB,clamp(border*.7+uFlash*.8+wave+rim*.3,0.,1.));
  gl_FragColor=vec4(toSRGB(c),clamp(a,0.,1.));
}`;

/* ------------------------------------------------------------------ *
 *  Procedural textures: Frieren-style magic circles + soft glow
 * ------------------------------------------------------------------ */
function sigilTexture(style: SigilStyle, seed: number): THREE.CanvasTexture {
  const S = 1024, h = S / 2, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const g = cv.getContext('2d')!;
  g.translate(h, h); g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineCap = 'round'; g.lineJoin = 'round'; g.shadowColor = '#fff'; g.shadowBlur = 9;
  let s = seed >>> 0; const rnd = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  const ring = (r: number, w: number) => { g.lineWidth = w; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.stroke(); };
  const poly = (r: number, n: number, rot: number, w: number, step = 1) => {
    g.lineWidth = w; g.beginPath();
    for (let i = 0; i < n; i++) { const a = rot + (i * step) / n * TAU; if (i) g.lineTo(Math.cos(a) * r, Math.sin(a) * r); else g.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    g.closePath(); g.stroke();
  };
  const ticks = (r0: number, r1: number, n: number, w: number) => {
    g.lineWidth = w; g.beginPath();
    for (let i = 0; i < n; i++) { const a = i / n * TAU, c = Math.cos(a), sn = Math.sin(a); g.moveTo(c * r0, sn * r0); g.lineTo(c * r1, sn * r1); }
    g.stroke();
  };
  /** Pseudo-glyphs: random short polylines inside a band — reads as an unknown runic script. */
  const runes = (r0: number, r1: number, n: number, w: number) => {
    g.lineWidth = w; const len = r1 - r0, bw = (r0 + r1) / 2 * TAU / n * .32;
    for (let i = 0; i < n; i++) {
      g.save(); g.rotate(i / n * TAU);
      g.beginPath(); g.moveTo(r0 + rnd() * len, (rnd() - .5) * 2 * bw);
      const k = 3 + Math.floor(rnd() * 3); for (let j = 0; j < k; j++) g.lineTo(r0 + rnd() * len, (rnd() - .5) * 2 * bw);
      g.stroke();
      if (rnd() > .5) { g.beginPath(); g.arc(r0 + rnd() * len, (rnd() - .5) * 2 * bw, 3, 0, TAU); g.fill(); }
      g.restore();
    }
  };
  if (style === 'rune') {
    ring(488, 6); ring(470, 2); ticks(436, 466, 96, 2); ring(430, 3); runes(372, 422, 44, 3); ring(364, 3);
    poly(356, 3, -Math.PI / 2, 4); poly(356, 3, Math.PI / 2, 4);
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; g.lineWidth = 3; g.beginPath(); g.arc(Math.cos(a) * 356, Math.sin(a) * 356, 16, 0, TAU); g.stroke(); }
    ring(262, 4); poly(262, 6, 0, 3); runes(190, 250, 28, 3); ring(182, 3); poly(182, 5, -Math.PI / 2, 3, 2); ring(70, 5);
  } else if (style === 'sun') {
    ring(488, 5); g.lineWidth = 3;
    for (let i = 0; i < 36; i++) { const a = i / 36 * TAU, w = .05; g.beginPath(); g.moveTo(Math.cos(a - w) * 436, Math.sin(a - w) * 436); g.lineTo(Math.cos(a) * 486, Math.sin(a) * 486); g.lineTo(Math.cos(a + w) * 436, Math.sin(a + w) * 436); g.stroke(); }
    ring(430, 4); runes(372, 422, 40, 3); ring(364, 3); poly(350, 8, -Math.PI / 2, 3, 3); poly(350, 8, -Math.PI / 2, 2);
    ring(250, 4);
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, w = .09; g.lineWidth = 3; g.beginPath(); g.moveTo(Math.cos(a - w) * 204, Math.sin(a - w) * 204); g.lineTo(Math.cos(a) * 246, Math.sin(a) * 246); g.lineTo(Math.cos(a + w) * 204, Math.sin(a + w) * 204); g.stroke(); }
    ring(190, 3); ticks(70, 190, 12, 2); ring(70, 5); g.beginPath(); g.arc(0, 0, 24, 0, TAU); g.fill();
  } else if (style === 'arc') {
    ring(488, 6); ring(470, 2);
    for (let i = 0; i < 12; i++) {
      g.save(); g.rotate(i / 12 * TAU); g.lineWidth = 4; g.beginPath(); g.moveTo(404, 0);
      let x = 404; [-1, 1, -1, 1, -1].forEach(d => { x += 14; g.lineTo(x, d * 18); }); g.lineTo(x + 14, 0); g.stroke(); g.restore();
    }
    ring(396, 3); poly(386, 3, -Math.PI / 2, 4); poly(386, 3, Math.PI / 2, 4); ring(300, 3); poly(300, 4, Math.PI / 4, 3); poly(300, 4, 0, 3);
    runes(220, 280, 24, 3); ring(212, 4); ticks(120, 205, 24, 2); ring(110, 3); poly(110, 3, -Math.PI / 2, 3); ring(34, 5);
  } else {
    // wind: Frieren's flower-field motif
    ring(488, 5); runes(430, 478, 48, 3); ring(422, 3);
    for (let i = 0; i < 8; i++) {
      g.save(); g.rotate(i / 8 * TAU); g.lineWidth = 4; g.beginPath(); g.moveTo(96, 0); g.quadraticCurveTo(250, -150, 410, 0); g.quadraticCurveTo(250, 150, 96, 0); g.stroke();
      g.lineWidth = 2; g.beginPath(); g.moveTo(130, 0); g.lineTo(380, 0); g.stroke(); g.restore();
    }
    for (let i = 0; i < 8; i++) { g.save(); g.rotate((i + .5) / 8 * TAU); g.lineWidth = 3; g.beginPath(); g.moveTo(96, 0); g.quadraticCurveTo(190, -70, 290, 0); g.quadraticCurveTo(190, 70, 96, 0); g.stroke(); g.restore(); }
    ring(96, 5); ring(70, 2); poly(60, 6, 0, 3); ring(22, 4);
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

function glowTexture(): THREE.CanvasTexture {
  const S = 128, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const g = cv.getContext('2d')!, gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.55)'); gr.addColorStop(.55, 'rgba(255,255,255,.14)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

const INNER: Record<SigilStyle, SigilStyle> = { rune: 'arc', sun: 'rune', arc: 'rune', wind: 'rune' };

/** Disposes geometry/material of an object tree, skipping anything flagged userData.keep (shared resources). */
function disposeTree(o: THREE.Object3D) {
  o.traverse(c => {
    const m = c as THREE.Mesh;
    if (m.geometry && !(c instanceof THREE.Sprite) && !m.geometry.userData.keep) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (mat) (Array.isArray(mat) ? mat : [mat]).forEach(x => { if (!x.userData.keep) x.dispose(); });
  });
}

/* ------------------------------------------------------------------ *
 *  GPU point-sprite particle pool (one draw call per blending mode)
 * ------------------------------------------------------------------ */
type Emit = { vx?: number; vy?: number; vz?: number; life: number; s0: number; s1: number; c0: THREE.Color; c1?: THREE.Color; kind?: 0 | 1 | 2 | 3; a?: number; drag?: number; grav?: number; rot?: number; rotV?: number; sway?: number };
const PS = 23;

class Particles {
  readonly points: THREE.Points;
  private readonly d: Float32Array; private n = 0;
  private readonly pos: THREE.BufferAttribute; private readonly colA: THREE.BufferAttribute; private readonly par: THREE.BufferAttribute;
  private readonly uniforms = { uScale: { value: 780 } };
  constructor(private readonly cap: number, additive: boolean) {
    this.d = new Float32Array(cap * PS);
    this.pos = new THREE.BufferAttribute(new Float32Array(cap * 3), 3).setUsage(THREE.DynamicDrawUsage);
    this.colA = new THREE.BufferAttribute(new Float32Array(cap * 3), 3).setUsage(THREE.DynamicDrawUsage);
    this.par = new THREE.BufferAttribute(new Float32Array(cap * 4), 4).setUsage(THREE.DynamicDrawUsage);
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', this.pos); geo.setAttribute('aColor', this.colA); geo.setAttribute('aParams', this.par); geo.setDrawRange(0, 0);
    const mat = new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader: PARTICLE_VS, fragmentShader: PARTICLE_FS, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending });
    this.points = new THREE.Points(geo, mat); this.points.frustumCulled = false; this.points.renderOrder = additive ? 10 : 9;
  }
  setScale(v: number) { this.uniforms.uScale.value = v; }
  emit(x: number, y: number, z: number, o: Emit) {
    if (this.n >= this.cap) return;
    const d = this.d, i = this.n++ * PS, c1 = o.c1 ?? o.c0;
    d[i] = x; d[i + 1] = y; d[i + 2] = z; d[i + 3] = o.vx ?? 0; d[i + 4] = o.vy ?? 0; d[i + 5] = o.vz ?? 0;
    d[i + 6] = 0; d[i + 7] = o.life; d[i + 8] = o.s0; d[i + 9] = o.s1;
    d[i + 10] = o.c0.r; d[i + 11] = o.c0.g; d[i + 12] = o.c0.b; d[i + 13] = c1.r; d[i + 14] = c1.g; d[i + 15] = c1.b;
    d[i + 16] = o.rot ?? Math.random() * TAU; d[i + 17] = o.rotV ?? 0; d[i + 18] = o.kind ?? 0; d[i + 19] = o.drag ?? 0; d[i + 20] = o.grav ?? 0; d[i + 21] = o.a ?? 1; d[i + 22] = o.sway ?? 0;
  }
  update(dt: number) {
    const d = this.d, P = this.pos.array as Float32Array, K = this.colA.array as Float32Array, Q = this.par.array as Float32Array;
    let i = 0;
    while (i < this.n) {
      const o = i * PS, age = (d[o + 6] += dt), life = d[o + 7];
      if (age >= life) { this.n--; const last = this.n * PS; if (o !== last) d.copyWithin(o, last, last + PS); continue; }
      if (d[o + 22]) { const ph = age * 4 + d[o + 17] * 3.7; d[o + 3] += Math.cos(ph) * d[o + 22] * dt; d[o + 5] += Math.sin(ph) * d[o + 22] * dt; }
      const k = Math.exp(-d[o + 19] * dt);
      d[o + 3] *= k; d[o + 4] = d[o + 4] * k - d[o + 20] * dt; d[o + 5] *= k;
      d[o] += d[o + 3] * dt; d[o + 1] += d[o + 4] * dt; d[o + 2] += d[o + 5] * dt; d[o + 16] += d[o + 17] * dt;
      const t = age / life, j = i * 3, q = i * 4, f = 1 - t;
      P[j] = d[o]; P[j + 1] = d[o + 1]; P[j + 2] = d[o + 2];
      K[j] = d[o + 10] + (d[o + 13] - d[o + 10]) * t; K[j + 1] = d[o + 11] + (d[o + 14] - d[o + 11]) * t; K[j + 2] = d[o + 12] + (d[o + 15] - d[o + 12]) * t;
      Q[q] = d[o + 8] + (d[o + 9] - d[o + 8]) * t; Q[q + 1] = d[o + 21] * Math.min(1, t * 14) * f * Math.sqrt(f); Q[q + 2] = d[o + 16]; Q[q + 3] = d[o + 18];
      i++;
    }
    this.pos.needsUpdate = this.colA.needsUpdate = this.par.needsUpdate = true;
    this.points.geometry.setDrawRange(0, this.n);
  }
  dispose() { this.points.removeFromParent(); this.points.geometry.dispose(); (this.points.material as THREE.Material).dispose(); }
}

/* ------------------------------------------------------------------ *
 *  MagicSystem
 * ------------------------------------------------------------------ */
/** Shared spell registry, resource economy, projectile simulation, defensive collision and all spell VFX. */
export class MagicSystem {
  mana = 1000; readonly maxMana = 1000; flying = false; shieldActive = false; shieldTime = 0; blocks = 0;
  /** 0..1 camera-shake request raised by big impacts (already attenuated by distance to the player). Decays on its own; read it from your camera rig. */
  shake = 0;

  private readonly root = new THREE.Group();
  private readonly fx = new Particles(2600, true);   // additive: glows, sparks, embers
  private readonly soft = new Particles(900, false); // normal blending: smoke, petals, debris, dust
  private readonly lights: LightSlot[] = [];
  private projectiles: Projectile[] = []; private effects: Effect[] = [];
  private cooldowns: Record<SpellId, number> = { zoltraak: 0, vollzanbel: 0, judradjim: 0, shield: 0, flight: 0 };
  private readonly tex: Record<SigilStyle | 'glow', THREE.CanvasTexture>;
  private readonly geo = {
    plane: new THREE.PlaneGeometry(2, 2), ring: new THREE.RingGeometry(.86, 1, 72), sphere: new THREE.IcosahedronGeometry(1, 4), torus: new THREE.TorusGeometry(1, .012, 6, 72),
    lance: MagicSystem.lanceGeometry(), lanceRing: new THREE.TorusGeometry(.26, .012, 6, 40), gyro: new THREE.TorusGeometry(.7, .02, 8, 64),
  };
  // shield
  private readonly shieldRoot = new THREE.Group(); private shieldPanels: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>[] = []; private shieldFlash = 0; private shieldAge = 0;
  private readonly shieldHit = { value: new THREE.Vector3(0, -999, 0) }; private readonly shieldHitT = { value: 1 };
  private shieldBack!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>; private shieldGround!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  // flight aura
  private readonly aura = new THREE.Group(); private readonly gyro = new THREE.Group(); private auraT = 0; private auraFloor!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  private readonly auraRings: THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial>[] = [];
  private readonly lastPos = new THREE.Vector3(); private readonly vel = new THREE.Vector3(); private acc = 0; private petalAcc = 0;
  // scratch
  private readonly collisionRay = new THREE.Raycaster(); private readonly box = new THREE.Box3();
  private readonly tA = new THREE.Vector3(); private readonly tB = new THREE.Vector3(); private readonly tC = new THREE.Vector3(); private readonly tN = new THREE.Vector3();

  constructor(private scene: THREE.Scene, private player: THREE.Group, private combat: CombatSystem, private blockers: THREE.Object3D[], private progression: PlayerProgression, private onConfirmedHit: () => void = () => {}) {
    Object.values(this.geo).forEach(g => { g.userData.keep = true; });
    this.tex = { rune: sigilTexture('rune', 11), sun: sigilTexture('sun', 23), arc: sigilTexture('arc', 37), wind: sigilTexture('wind', 51), glow: glowTexture() };
    this.root.name = 'spell-effects'; scene.add(this.root); this.root.add(this.fx.points, this.soft.points);
    for (let i = 0; i < LIGHT_SLOTS; i++) {
      const light = new THREE.PointLight('#ffffff', 0, 10, 2); this.root.add(light);
      this.lights.push({ light, age: 0, life: 1, peak: 0, active: false, held: false });
    }
    this.lastPos.copy(player.position);
    this.buildShield(); this.buildAura();
  }

  cooldown(id: SpellId) { return this.cooldowns[id]; }

  /** Optional: tell the system the drawing-buffer height (px, including pixel ratio) and camera FOV so particle sizes stay physically consistent. */
  setViewport(heightPx: number, fovDeg: number) { const s = heightPx / (2 * Math.tan(THREE.MathUtils.degToRad(fovDeg) / 2)); this.fx.setScale(s); this.soft.setScale(s); }

  /** Optional: call once after creating the system so every spell shader is compiled up-front (no hitch on the first cast). */
  prewarm(renderer: THREE.WebGLRenderer, camera: THREE.Camera) {
    const holder = new THREE.Group(); holder.position.set(0, -9999, 0);
    const mats: THREE.Material[] = [this.fireMaterial(), this.fresnelMaterial(C.fire, 2, 1, 1), this.lanceMaterial(C.paleGold, C.gold, 1), this.basic(C.gold, 1, this.tex.rune)];
    mats.forEach(m => holder.add(new THREE.Mesh(this.geo.sphere, m)));
    holder.add(new THREE.Sprite(new THREE.SpriteMaterial({ map: this.tex.glow, blending: THREE.AdditiveBlending })));
    this.scene.add(holder); renderer.compile(this.scene, camera); this.scene.remove(holder); mats.forEach(m => m.dispose());
  }

  cast(id: SpellId, origin: Vec3, direction: Vec3, target: Vec3) {
    const manaCost = this.progression.manaCost(COST[id]);
    if (this.cooldowns[id] > 0 || this.mana < manaCost) return false;
    this.mana -= manaCost; this.cooldowns[id] = COOLDOWN[id];
    const dir = direction.clone().normalize();
    if (id === 'shield') { this.shieldActive = true; this.shieldTime = 6; this.shieldAge = 0; this.shieldRoot.visible = true; this.shieldFlash = .45; this.shieldCastFx(); return true; }
    if (id === 'flight') { this.flying = !this.flying; this.flightBurst(this.flying); return true; }
    if (id === 'judradjim') { const size = this.progression.sizeMultiplier(); this.lightningFx(origin, target, size); if (this.combat.damageAt(target, 4.4 * size, 46 * this.progression.damageMultiplier()) > 0) this.onConfirmedHit(); return true; }
    const kind = id as 'zoltraak' | 'vollzanbel';
    this.spawnProjectile(kind, origin, dir, target); this.muzzleFx(kind, origin, dir);
    return true;
  }

  blockProjectile(from: Vec3, to: Vec3) {
    if (!this.shieldActive || this.mana <= 0) return false;
    const center = this.shieldRoot.getWorldPosition(new THREE.Vector3()), size = this.progression.sizeMultiplier();
    const segment = new THREE.Line3(from, to), closest = segment.closestPointToPoint(center, true, new THREE.Vector3());
    if (closest.distanceTo(center) > 1.38 * size) return false;
    this.mana = Math.max(0, this.mana - 6); this.shieldTime = Math.max(0, this.shieldTime - .65); this.shieldFlash = .5; this.blocks++;
    // ripple travels across the hex panels from the point of impact
    const n = closest.clone().sub(center); if (n.lengthSq() < 1e-4) n.copy(from).sub(center); n.normalize();
    const hit = center.clone().addScaledVector(n, 1.25 * size);
    this.shieldHit.value.copy(hit); this.shieldHitT.value = 0;
    this.shock(hit, n, C.barrierHot, 1.1 * size, .38);
    this.flash(hit, C.barrierHot, 1.6 * size, .18);
    for (let i = 0; i < 16; i++) {
      const v = this.hemi(n, 1, this.tA), sp = rr(2.5, 7);
      this.fx.emit(hit.x, hit.y, hit.z, { vx: v.x * sp, vy: v.y * sp, vz: v.z * sp, life: rr(.35, .75), s0: rr(.2, .34), s1: .02, c0: C.barrierHot, c1: C.barrier, kind: 1, drag: 2.2, grav: 2 });
    }
    this.flashLight(hit, C.barrier, 5, .3, 6);
    this.shake = Math.max(this.shake, .16);
    return true;
  }

  update(delta: number, elapsed: number) {
    this.mana = Math.min(this.maxMana, this.mana + delta * (this.flying ? 1.2 : 4.2));
    for (const id of Object.keys(this.cooldowns) as SpellId[]) this.cooldowns[id] = Math.max(0, this.cooldowns[id] - delta);
    if (this.flying) { this.mana -= delta * 8; if (this.mana <= 0) { this.mana = 0; this.flying = false; this.flightBurst(false); } }
    if (this.shieldActive) { this.mana -= delta * 2.4; this.shieldTime -= delta; }
    if (this.shieldActive && (this.shieldTime <= 0 || this.mana <= 0)) { const broke = this.mana <= 0; this.shieldActive = false; this.shieldBreakFx(broke); }
    const dt = Math.min(delta, .05);
    this.updateShield(delta, elapsed);
    this.updateAura(delta, elapsed);
    this.updateProjectiles(delta, elapsed);
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const e = this.effects[i]; e.age += dt; const t = Math.min(1, e.age / e.life); e.step(t, dt);
      if (t >= 1) { e.object.removeFromParent(); disposeTree(e.object); this.effects.splice(i, 1); }
    }
    for (const s of this.lights) {
      if (!s.active || s.held) continue;
      s.age += dt; const t = s.age / s.life;
      if (t >= 1) { s.active = false; s.light.intensity = 0; } else s.light.intensity = s.peak * (1 - t) * (1 - t);
    }
    this.fx.update(dt); this.soft.update(dt);
    this.shake = Math.max(0, this.shake - delta * 2.2);
  }

  dispose() {
    this.projectiles.forEach(p => { p.object.removeFromParent(); disposeTree(p.object); }); this.projectiles = [];
    this.effects.forEach(e => { e.object.removeFromParent(); disposeTree(e.object); }); this.effects = [];
    this.root.removeFromParent(); this.shieldRoot.removeFromParent(); this.aura.removeFromParent();
    disposeTree(this.shieldRoot); disposeTree(this.aura);
    this.fx.dispose(); this.soft.dispose();
    this.lights.forEach(s => s.light.dispose());
    Object.values(this.geo).forEach(g => g.dispose()); Object.values(this.tex).forEach(t => t.dispose());
  }

  /* ---------------------------------------------------------------- *
   *  Building blocks
   * ---------------------------------------------------------------- */
  private static lanceGeometry() {
    const prof = [[0, -1.1], [.05, -.95], [.09, -.5], [.1, .1], [.085, .7], [.04, 1.1], [0, 1.5]].map(([x, y]) => new THREE.Vector2(x, y));
    const g = new THREE.LatheGeometry(prof, 20); g.rotateX(Math.PI / 2); return g;
  }
  private basic(color: THREE.ColorRepresentation, opacity = 1, map: THREE.Texture | null = null) {
    return new THREE.MeshBasicMaterial({ color, map, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false });
  }
  private lanceMaterial(a: THREE.Color, b: THREE.Color, gain: number) {
    return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: LANCE_VS, fragmentShader: LANCE_FS, uniforms: { uTime: { value: 0 }, uGain: { value: gain }, uA: { value: a.clone() }, uB: { value: b.clone() } } });
  }
  private fresnelMaterial(color: THREE.Color, power: number, gain: number, alpha: number) {
    return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: FRESNEL_VS, fragmentShader: FRESNEL_FS, uniforms: { uColor: { value: color.clone() }, uPower: { value: power }, uGain: { value: gain }, uAlpha: { value: alpha } } });
  }
  private fireMaterial() {
    return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: FIRE_VS, fragmentShader: FIRE_FS, uniforms: { uT: { value: 0 }, uTime: { value: 0 }, uSeed: { value: Math.random() * 40 } } });
  }
  private addEffect(object: THREE.Object3D, life: number, step: (t: number, dt: number) => void = () => { }) {
    this.root.add(object); this.effects.push({ object, age: 0, life, step }); step(0, 0);
  }
  /** Random unit vector in the hemisphere around n. spread 1 = full hemisphere, 0 = straight along n. */
  private hemi(n: Vec3, spread: number, out: Vec3) {
    out.set(rr(-1, 1), rr(-1, 1), rr(-1, 1)); if (out.lengthSq() < 1e-4) out.set(0, 1, 0); out.normalize();
    const d = out.dot(n); if (d < 0) out.addScaledVector(n, -2 * d);
    return out.lerp(n, 1 - spread).normalize();
  }
  private flashLight(pos: Vec3, color: THREE.Color, peak: number, life: number, dist: number, held = false): LightSlot | null {
    let slot = this.lights.find(s => !s.active);
    if (!slot) slot = this.lights.filter(s => !s.held).sort((a, b) => b.age / b.life - a.age / a.life)[0];
    if (!slot) return null;
    slot.active = true; slot.held = held; slot.age = 0; slot.life = life; slot.peak = peak * LIGHT_GAIN;
    slot.light.color.copy(color); slot.light.distance = dist; slot.light.position.copy(pos); slot.light.intensity = slot.peak;
    return slot;
  }
  private releaseLight(s: LightSlot | null) { if (s) { s.active = false; s.held = false; s.light.intensity = 0; } }
  private addShake(at: Vec3, amount: number, range = 28) { this.shake = Math.max(this.shake, clamp01(1 - at.distanceTo(this.player.position) / range) * amount); }

  /** Soft additive billboard flash. */
  private flash(pos: Vec3, color: THREE.Color, size: number, life: number) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.tex.glow, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    s.position.copy(pos);
    this.addEffect(s, life, t => { s.scale.setScalar(Math.max(.01, size * (.4 + .9 * easeOutCubic(t)))); (s.material as THREE.SpriteMaterial).opacity = (1 - t) * (1 - t); });
  }
  /** Expanding flat ring oriented along a surface normal. */
  private shock(pos: Vec3, normal: Vec3, color: THREE.Color, radius: number, life: number) {
    const mat = this.basic(color, .9), m = new THREE.Mesh(this.geo.ring, mat);
    m.position.copy(pos).addScaledVector(normal, .06); m.quaternion.setFromUnitVectors(FWD, normal);
    this.addEffect(m, life, t => { m.scale.setScalar(Math.max(.01, radius * (.15 + .85 * easeOutCubic(t)))); mat.opacity = (1 - t) * (1 - t) * .9; });
  }
  /** Fresnel shell that expands and fades (shock dome). */
  private dome(pos: Vec3, color: THREE.Color, radius: number, life: number, power = 2.4) {
    const mat = this.fresnelMaterial(color, power, 1.2, 1), m = new THREE.Mesh(this.geo.sphere, mat); m.position.copy(pos);
    this.addEffect(m, life, t => { m.scale.setScalar(Math.max(.01, radius * (.15 + .85 * easeOutCubic(t)))); mat.uniforms.uAlpha.value = (1 - t) * (1 - t); });
  }
  /** Layered, counter-rotating magic circle that blooms in, holds and fades — the signature Frieren casting visual. */
  private sigil(pos: Vec3, normal: Vec3, style: SigilStyle, color: THREE.Color, radius: number, life: number, o: { spin?: number; grow?: number; hold?: number } = {}) {
    const g = new THREE.Group(); g.position.copy(pos); g.quaternion.setFromUnitVectors(FWD, normal);
    const a = new THREE.Mesh(this.geo.plane, this.basic(color, 0, this.tex[style])), b = new THREE.Mesh(this.geo.plane, this.basic(C.paleGold, 0, this.tex[INNER[style]]));
    b.position.z = .01; g.add(a, b);
    const spin = o.spin ?? 1.2, grow = o.grow ?? .12, hold = o.hold ?? .3;
    this.addEffect(g, life, t => {
      const s = radius * easeOutBack(clamp01(t * life / .2)) * (1 + grow * t);
      a.scale.setScalar(Math.max(.001, s)); b.scale.setScalar(Math.max(.001, s * .62));
      a.rotation.z = t * life * spin; b.rotation.z = -t * life * spin * 1.7;
      const fade = t < hold ? 1 : 1 - Math.pow((t - hold) / (1 - hold), 1.6), appear = clamp01(t * life / .12);
      (a.material as THREE.MeshBasicMaterial).opacity = fade * appear; (b.material as THREE.MeshBasicMaterial).opacity = fade * appear * .75;
    });
  }

  /* ---------------------------------------------------------------- *
   *  Zoltraak / Vollzanbel projectiles
   * ---------------------------------------------------------------- */
  private spawnProjectile(kind: 'zoltraak' | 'vollzanbel', origin: Vec3, dir: Vec3, target: Vec3) {
    const fire = kind === 'vollzanbel', size = this.progression.sizeMultiplier(), speed = fire ? 13 : 34;
    const g = new THREE.Group(); g.name = kind; g.position.copy(origin).addScaledVector(dir, .5); g.quaternion.setFromUnitVectors(FWD, dir); g.scale.setScalar(size);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.tex.glow, color: fire ? C.fire : C.gold, transparent: true, opacity: fire ? .6 : .55, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    halo.scale.setScalar(fire ? 3.6 : 1.8);
    const p: Projectile = {
      object: g, dir: dir.clone(), velocity: dir.clone().multiplyScalar(speed), speed, age: 0, kind, target: target.clone(), light: null, times: [], rings: [], spins: [], halo,
      damage: (at, radius, amount) => { const s = this.progression.sizeMultiplier(); if (this.combat.damageAt(at, radius * s, amount * this.progression.damageMultiplier()) > 0) this.onConfirmedHit(); },
    };
    if (!fire) {
      // Zoltraak: a piercing spiral lance wrapped in a pale-gold shell, shedding mana rings behind it
      const core = new THREE.Mesh(this.geo.lance, this.lanceMaterial(C.bolt, C.gold, 1)), shell = new THREE.Mesh(this.geo.lance, this.lanceMaterial(C.gold, C.goldDeep, .45));
      shell.scale.set(2.2, 2.2, 1.12); p.times.push((core.material as THREE.ShaderMaterial).uniforms.uTime, (shell.material as THREE.ShaderMaterial).uniforms.uTime);
      g.add(shell, core, halo);
      for (let k = 0; k < 3; k++) { const mat = this.basic(C.paleGold, 0), mesh = new THREE.Mesh(this.geo.lanceRing, mat); g.add(mesh); p.rings.push({ mesh, mat }); }
      p.light = this.flashLight(g.position, C.gold, 4.5, 1, 7, true);
    } else {
      // Vollzanbel: roiling fire core + fresnel plasma shell, flanked by counter-rotating sun sigils
      const fm = this.fireMaterial(); fm.uniforms.uT.value = .08; p.times.push(fm.uniforms.uTime);
      const core = new THREE.Mesh(this.geo.sphere, fm); core.scale.set(.36, .36, .55);
      const shell = new THREE.Mesh(this.geo.sphere, this.fresnelMaterial(C.fire, 2, 1.1, .85)); shell.scale.set(.62, .62, .95);
      const front = new THREE.Mesh(this.geo.plane, this.basic(C.fire, .9, this.tex.sun)); front.position.z = .95; front.scale.setScalar(.6);
      const back = new THREE.Mesh(this.geo.plane, this.basic(C.gold, .7, this.tex.rune)); back.position.z = -.7; back.scale.setScalar(.95);
      const gyro = new THREE.Group(), gr = new THREE.Mesh(this.geo.gyro, this.basic(C.fireHot, .8)); gr.rotation.x = 1.15; gyro.add(gr);
      g.add(shell, core, front, back, gyro, halo);
      p.spins.push({ obj: front, rate: 4 }, { obj: back, rate: -2.6 }, { obj: gyro, rate: 4.5 });
      p.light = this.flashLight(g.position, C.fire, 7, 1, 11, true);
    }
    this.root.add(g); this.projectiles.push(p);
  }

  private muzzleFx(kind: 'zoltraak' | 'vollzanbel', origin: Vec3, dir: Vec3) {
    const fire = kind === 'vollzanbel', size = this.progression.sizeMultiplier(), c = this.tC.copy(origin).addScaledVector(dir, 1);
    this.sigil(c, dir, fire ? 'sun' : 'rune', fire ? C.fire : C.paleGold, (fire ? 1.5 : .78) * size, fire ? .8 : .5, { spin: fire ? 1.6 : 2.4 });
    this.flash(c, fire ? C.fireHot : C.paleGold, (fire ? 2.6 : 1.1) * size, fire ? .22 : .14);
    for (let i = 0; i < (fire ? 22 : 10); i++) {
      const v = this.tB.copy(dir).add(this.tA.set(rr(-1, 1), rr(-1, 1), rr(-1, 1)).multiplyScalar(.35)).normalize(), sp = fire ? rr(3, 9) : rr(5, 12);
      this.fx.emit(c.x, c.y, c.z, { vx: v.x * sp, vy: v.y * sp, vz: v.z * sp, life: rr(.25, .6), s0: rr(.2, .36), s1: .02, c0: fire ? C.fireHot : C.paleGold, c1: fire ? C.fire : C.gold, kind: 1, drag: 2.4, grav: fire ? 2 : 0 });
    }
    if (fire) this.shake = Math.max(this.shake, .12);
  }

  private updateProjectiles(delta: number, elapsed: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i], pos = p.object.position, prev = this.tA.copy(pos), size = this.progression.sizeMultiplier();
      p.age += delta; pos.addScaledVector(p.velocity, delta);
      this.collisionRay.set(prev, p.dir); this.collisionRay.near = 0; this.collisionRay.far = p.speed * delta + .12;
      const obstacle = this.collisionRay.intersectObjects(this.blockers, true)[0];
      if (obstacle) pos.copy(obstacle.point);
      const ground = pos.y < terrainHeight(pos.x, pos.z) + .15;
      const targetHit = pos.distanceTo(p.target) < Math.max(.35, p.speed * delta);
      const enemyHit = this.combat.targets.some(target => { if (!target.visible) return false; target.updateMatrixWorld(); return this.box.setFromObject(target).expandByScalar(.42).containsPoint(pos); });
      this.animateProjectile(p, prev, delta, elapsed);
      if (obstacle || enemyHit || targetHit || ground || p.age > (p.kind === 'vollzanbel' ? 2.5 : 1.35)) {
        const n = this.tN.set(0, 1, 0);
        if (ground) pos.y = terrainHeight(pos.x, pos.z) + .05;
        else { if (obstacle?.face) n.copy(obstacle.face.normal).transformDirection(obstacle.object.matrixWorld); else n.copy(p.dir).negate(); if (n.dot(p.dir) > 0) n.negate(); }
        const fire = p.kind === 'vollzanbel', radius = fire ? 4.6 : .9;
        p.damage(pos, radius, fire ? 58 : 34);
        if (fire) this.fireExplosion(pos.clone(), n.clone(), radius * size); else this.zoltraakImpact(pos.clone(), n.clone(), size);
        p.object.removeFromParent(); disposeTree(p.object); this.releaseLight(p.light); this.projectiles.splice(i, 1);
      }
    }
  }

  private animateProjectile(p: Projectile, from: Vec3, delta: number, elapsed: number) {
    const pos = p.object.position, size = this.progression.sizeMultiplier(), fire = p.kind === 'vollzanbel';
    p.times.forEach(u => { u.value = elapsed; });
    p.spins.forEach(s => { s.obj.rotation.z += s.rate * delta; });
    p.rings.forEach((r, k) => { const ph = (p.age * 2.2 + k / 3) % 1; r.mesh.position.z = .9 - ph * 2.5; r.mesh.scale.setScalar(.7 + ph * 1.1); r.mat.opacity = Math.min(1, ph * 8) * (1 - ph) * .9; });
    p.halo.material.opacity = (fire ? .6 : .55) * (.85 + .15 * Math.sin(elapsed * 40 + p.age * 9));
    if (p.light) { p.light.light.position.copy(pos); p.light.light.intensity = p.light.peak * (1 + .18 * Math.sin(elapsed * 31)); }
    const dist = from.distanceTo(pos), spacing = (fire ? .16 : .11) * size, n = Math.min(24, Math.max(1, Math.ceil(dist / spacing)));
    for (let k = 1; k <= n; k++) {
      const u = k / n, x = from.x + (pos.x - from.x) * u, y = from.y + (pos.y - from.y) * u, z = from.z + (pos.z - from.z) * u;
      if (!fire) {
        this.fx.emit(x, y, z, { life: .34, s0: .3 * size, s1: .02, c0: C.paleGold, c1: C.gold, a: .85 });
        if (Math.random() < .12) this.fx.emit(x, y, z, { vx: rr(-.8, .8), vy: rr(-.8, .8), vz: rr(-.8, .8), life: rr(.3, .55), s0: .22 * size, s1: .02, c0: C.paleGold, kind: 1, drag: 2 });
      } else {
        this.fx.emit(x, y, z, { vx: rr(-.5, .5), vy: rr(.2, 1.2), vz: rr(-.5, .5), life: rr(.45, .8), s0: rr(.5, .8) * size, s1: .05, c0: C.fire, c1: C.ember, a: .65, drag: .6 });
        if (Math.random() < .4) this.fx.emit(x, y, z, { vx: rr(-1.6, 1.6), vy: rr(0, 1.5), vz: rr(-1.6, 1.6), life: rr(.4, .9), s0: .22 * size, s1: .02, c0: C.fireHot, c1: C.fire, kind: 1, grav: 3 });
        if (Math.random() < .3) this.soft.emit(x, y, z, { vx: rr(-.3, .3), vy: rr(.4, 1.1), vz: rr(-.3, .3), life: rr(1, 1.7), s0: .4 * size, s1: 1.5 * size, c0: C.smokeA, c1: C.smokeB, a: .35, kind: 3, drag: .5 });
      }
    }
  }

  private zoltraakImpact(pos: Vec3, n: Vec3, size: number) {
    this.flash(pos, C.paleGold, 1.8 * size, .16);
    this.shock(pos, n, C.paleGold, 1.5 * size, .38);
    for (let i = 0; i < 22; i++) {
      const v = this.hemi(n, 1, this.tA), sp = rr(4, 11);
      this.fx.emit(pos.x, pos.y, pos.z, { vx: v.x * sp, vy: v.y * sp, vz: v.z * sp, life: rr(.35, .7), s0: rr(.22, .4) * size, s1: .02, c0: C.paleGold, c1: C.gold, kind: 1, drag: 2, grav: 4 });
    }
    for (let i = 0; i < 8; i++) this.fx.emit(pos.x, pos.y, pos.z, { vx: rr(-1, 1), vy: rr(.5, 2), vz: rr(-1, 1), life: .35, s0: .5 * size, s1: 0, c0: C.gold, a: .8 });
    this.flashLight(this.tB.copy(pos).addScaledVector(n, .6), C.gold, 7, .3, 6);
    this.addShake(pos, .1, 14);
  }

  private fireExplosion(pos: Vec3, n: Vec3, R: number) {
    const k = R / 4.6, lift = n.clone().multiplyScalar(R * .28);
    // volumetric fire lobes (noise-driven shader, dissolve over time)
    const ball = (off: Vec3, size: number, delay: number, dur: number, rise: number) => {
      const mat = this.fireMaterial(), m = new THREE.Mesh(this.geo.sphere, mat); m.position.copy(pos).add(off); const y0 = m.position.y, life = delay + dur;
      this.addEffect(m, life, t => {
        const u = clamp01((t * life - delay) / dur); m.visible = u > 0; mat.uniforms.uT.value = u; mat.uniforms.uTime.value = t * life;
        m.scale.setScalar(Math.max(.01, size * (.35 + .65 * easeOutCubic(u)))); m.position.y = y0 + rise * easeOutCubic(u);
      });
    };
    ball(lift, R * .62, 0, .75, R * .2);
    ball(lift.clone().addScaledVector(UP, R * .35), R * .42, .07, .85, R * .55);
    for (let i = 0; i < 2; i++) { const a = Math.random() * TAU; ball(new THREE.Vector3(Math.cos(a) * R * .4, R * .12, Math.sin(a) * R * .4), R * .3, rr(0, .1), .6, R * .25); }
    // shock dome + rings + scorched sigil
    this.dome(this.tA.copy(pos).addScaledVector(n, R * .2), C.fire, R * 1.05, .45, 2.2);
    this.shock(pos, n, C.fireHot, R * 1.05, .55); this.shock(pos, n, C.fire, R * .7, .4);
    if (n.y > .6) this.sigil(this.tA.copy(pos).addScaledVector(n, .05), n, 'sun', C.fire, R * .9, 1.8, { spin: .5, grow: .06, hold: .35 });
    this.flash(this.tA.copy(pos).addScaledVector(n, R * .15), C.fireHot, R * 2.6, .22);
    // particles
    const v = this.tB;
    for (let i = 0; i < 70; i++) {
      this.hemi(n, .95, v); const sp = rr(3, 11) * Math.max(.6, k);
      this.fx.emit(pos.x, pos.y + .2, pos.z, { vx: v.x * sp, vy: v.y * sp + 2, vz: v.z * sp, life: rr(.9, 1.9), s0: rr(.18, .4), s1: .02, c0: C.fireHot, c1: C.ember, a: .9, drag: 1.1, grav: Math.random() < .5 ? -1.2 : 4.5 });
    }
    for (let i = 0; i < 36; i++) {
      this.hemi(n, 1, v); const sp = rr(8, 18) * Math.max(.6, k);
      this.fx.emit(pos.x, pos.y + .1, pos.z, { vx: v.x * sp, vy: v.y * sp, vz: v.z * sp, life: rr(.45, 1), s0: rr(.25, .45), s1: .02, c0: C.fireHot, c1: C.fire, kind: 1, drag: .5, grav: 12 });
    }
    for (let i = 0; i < 16; i++) {
      this.hemi(n, .7, v);
      this.soft.emit(pos.x + rr(-.4, .4) * R * .5, pos.y + R * .15, pos.z + rr(-.4, .4) * R * .5, { vx: v.x * 2, vy: rr(1, 3), vz: v.z * 2, life: rr(1.6, 2.8), s0: R * .18, s1: R * .55, c0: C.smokeA, c1: C.smokeB, a: .5, kind: 3, drag: 1.2 });
    }
    for (let i = 0; i < 18; i++) {
      this.hemi(n, .8, v); const sp = rr(5, 13);
      this.soft.emit(pos.x, pos.y + .1, pos.z, { vx: v.x * sp, vy: v.y * sp, vz: v.z * sp, life: rr(.7, 1.3), s0: rr(.1, .2), s1: .06, c0: C.debris, kind: 3, grav: 16, a: .95 });
    }
    if (n.y > .6) for (let i = 0; i < 14; i++) {
      const a = Math.random() * TAU, sp = rr(3, 7) * Math.max(.7, k);
      this.soft.emit(pos.x, pos.y + .15, pos.z, { vx: Math.cos(a) * sp, vy: rr(.2, .8), vz: Math.sin(a) * sp, life: rr(1.2, 1.8), s0: R * .2, s1: R * .6, c0: C.dust, c1: C.dustB, a: .35, kind: 3, drag: 1.6 });
    }
    this.flashLight(this.tA.copy(pos).addScaledVector(n, 1.2), C.fire, 34, .7, R * 3.4);
    this.addShake(pos, .85);
  }

  /* ---------------------------------------------------------------- *
   *  Judradjim — lightning
   * ---------------------------------------------------------------- */
  private jag(a: Vec3, b: Vec3, gens: number, amp: number): Vec3[] {
    let pts = [a.clone(), b.clone()];
    for (let g = 0; g < gens; g++) {
      const next: Vec3[] = [pts[0]];
      for (let i = 0; i < pts.length - 1; i++) {
        const m = pts[i].clone().add(pts[i + 1]).multiplyScalar(.5);
        m.x += (Math.random() - .5) * amp; m.y += (Math.random() - .5) * amp; m.z += (Math.random() - .5) * amp;
        next.push(m, pts[i + 1]);
      }
      pts = next; amp *= .55;
    }
    return pts;
  }

  private lightningFx(from: Vec3, to: Vec3, size: number) {
    const R = 4.4 * size, dir = to.clone().sub(from), len = dir.length(); dir.normalize();
    this.sigil(from.clone().addScaledVector(dir, .9), dir, 'arc', C.boltGlow, .85 * Math.max(1, size * .8), .5, { spin: 2.4 });
    const g = new THREE.Group(), bolts: { mat: THREE.MeshBasicMaterial; base: number }[] = [];
    const addBolt = (pts: Vec3[], radius: number, color: THREE.Color, opacity: number) => {
      const curve = new THREE.CatmullRomCurve3(pts, false, 'chordal'), mat = this.basic(color, opacity);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, pts.length * 2, radius, 5, false), mat)); bolts.push({ mat, base: opacity });
    };
    // arc from the caster's hand + branches
    const main = this.jag(from, to, 5, len * .12);
    addBolt(main, .05 * size, C.bolt, 1); addBolt(main, .16 * size, C.boltGlow, .35);
    for (let i = 0; i < 5; i++) {
      const a = main[3 + Math.floor(Math.random() * (main.length - 6))], d = dir.clone().add(new THREE.Vector3(rr(-.5, .5), rr(-.5, .5), rr(-.5, .5)).multiplyScalar(1.8)).normalize();
      addBolt(this.jag(a, a.clone().addScaledVector(d, rr(1, 3.5) * size), 3, .5 * size), .02 * size, C.bolt, .85);
    }
    // thunder strike from above the target
    const top = to.clone().add(new THREE.Vector3(rr(-1.5, 1.5), 24, rr(-1.5, 1.5))), sky = this.jag(top, to, 6, 3.2);
    addBolt(sky, .11 * size, C.bolt, 1); addBolt(sky, .42 * size, C.boltGlow, .3);
    for (let i = 0; i < 3; i++) { const a = sky[8 + Math.floor(Math.random() * (sky.length - 16))]; addBolt(this.jag(a, a.clone().add(new THREE.Vector3(rr(-3, 3), rr(-4, -1), rr(-3, 3))), 3, .8), .03 * size, C.bolt, .8); }
    // arcs crawling along the terrain through the whole damage radius
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * TAU + Math.random() * .6, rad = R * rr(.55, 1), pts: Vec3[] = [];
      for (let s = 0; s <= 9; s++) { const u = s / 9, x = to.x + Math.cos(a) * rad * u + rr(-.25, .25) * u, z = to.z + Math.sin(a) * rad * u + rr(-.25, .25) * u; pts.push(new THREE.Vector3(x, terrainHeight(x, z) + .1 + Math.random() * .08, z)); }
      addBolt(pts, .022 * size, C.bolt, .9);
    }
    this.addEffect(g, .5, t => {
      const f = t < .1 ? 1 : (Math.random() < .55 ? 1 : .25 + Math.random() * .4), fade = t < .35 ? 1 : 1 - (t - .35) / .65;
      bolts.forEach(b => { b.mat.opacity = b.base * f * fade; });
    });
    // impact: flash, damage-radius sigil, shock, dome, sparks, thunder light
    this.flash(to, C.bolt, R * 1.1, .24);
    this.sigil(this.tA.copy(to).addScaledVector(UP, .07), UP, 'arc', C.boltGlow, R, 1, { spin: 1.1, grow: .05, hold: .4 });
    this.shock(to, UP, C.bolt, R, .45); this.shock(to, UP, C.boltGlow, R * .55, .3);
    this.dome(this.tA.copy(to).addScaledVector(UP, .3), C.boltGlow, R * .55, .3, 2);
    const v = this.tB;
    for (let i = 0; i < 36; i++) {
      this.hemi(UP, 1, v); const sp = rr(4, 12);
      this.fx.emit(to.x, to.y + .1, to.z, { vx: v.x * sp, vy: v.y * sp, vz: v.z * sp, life: rr(.5, 1), s0: rr(.22, .4), s1: .02, c0: C.bolt, c1: C.boltGlow, kind: 1, drag: 1.2, grav: 12 });
    }
    for (let i = 0; i < 16; i++) this.fx.emit(to.x + rr(-1, 1), to.y + .2, to.z + rr(-1, 1), { vx: rr(-.5, .5), vy: rr(1, 3), vz: rr(-.5, .5), life: rr(1, 1.6), s0: rr(.2, .4), s1: 0, c0: C.boltGlow, a: .7, drag: .5 });
    for (let i = 0; i < 6; i++) this.soft.emit(to.x + rr(-.8, .8), to.y + .1, to.z + rr(-.8, .8), { vy: rr(.6, 1.6), life: rr(1.2, 2), s0: .5, s1: 1.4, c0: C.dust, c1: C.dustB, a: .25, kind: 3, drag: .8 });
    this.flashLight(this.tA.copy(to).addScaledVector(UP, 2.2), C.boltGlow, 28, .35, R * 3.2);
    this.addShake(to, .55);
  }

  /* ---------------------------------------------------------------- *
   *  Hex Aegis — barrier
   * ---------------------------------------------------------------- */
  private buildShield() {
    this.shieldRoot.name = 'hex-aegis'; this.player.add(this.shieldRoot); this.shieldRoot.position.set(0, 1.28, .72);
    const R = .49, step = Math.sqrt(3) * R * 1.07, panelGeo = new THREE.CircleGeometry(R, 6);
    for (let i = 0; i < 7; i++) {
      const mat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, vertexShader: SHIELD_VS, fragmentShader: SHIELD_FS,
        uniforms: { uTime: { value: 0 }, uFlash: { value: 0 }, uAlpha: { value: 0 }, uHitT: this.shieldHitT, uHit: this.shieldHit, uColA: { value: C.barrier.clone() }, uColB: { value: C.barrierHot.clone() } },
      });
      const a = Math.PI / 6 + (i - 1) * Math.PI / 3, x = i ? Math.cos(a) * step : 0, y = i ? Math.sin(a) * step : 0;
      const panel = new THREE.Mesh(panelGeo, mat); panel.position.set(x, y, -(x * x + y * y) * .16); panel.rotation.set(-y * .22, x * .22, 0);
      this.shieldRoot.add(panel); this.shieldPanels.push(panel);
    }
    this.shieldBack = new THREE.Mesh(this.geo.plane, this.basic(C.barrier, 0, this.tex.rune)); this.shieldBack.position.z = -.12; this.shieldBack.scale.setScalar(1.55); this.shieldRoot.add(this.shieldBack);
    this.shieldGround = new THREE.Mesh(this.geo.plane, this.basic(C.barrier, 0, this.tex.rune)); this.shieldGround.rotation.x = -Math.PI / 2; this.shieldGround.position.y = .06; this.shieldGround.scale.setScalar(1.5); this.player.add(this.shieldGround);
    this.shieldRoot.visible = false;
  }

  private updateShield(delta: number, elapsed: number) {
    if (!this.shieldActive) { this.shieldRoot.visible = false; this.shieldGround.material.opacity = 0; return; }
    this.shieldAge += delta; const size = this.progression.sizeMultiplier();
    this.shieldRoot.visible = true;
    this.shieldRoot.scale.setScalar(size * (.8 + .2 * easeOutBack(clamp01(this.shieldAge / .32))));
    this.shieldRoot.rotation.y = Math.sin(elapsed * 1.1) * .055;
    this.shieldFlash = Math.max(0, this.shieldFlash - delta * 2.4);
    if (this.shieldHitT.value < 1) this.shieldHitT.value = Math.min(1, this.shieldHitT.value + delta * 1.6);
    const fade = clamp01(this.shieldTime / .7) * (this.shieldTime < 1.2 ? .8 + .2 * Math.sin(elapsed * 38) : 1);
    this.shieldPanels.forEach((panel, i) => {
      const u = panel.material.uniforms, appear = easeOutCubic(clamp01((this.shieldAge - (i ? .06 : 0)) / .24));
      u.uTime.value = elapsed + i * .22; u.uFlash.value = Math.max(0, this.shieldFlash + Math.sin(elapsed * 2.4 + i) * .015); u.uAlpha.value = appear * fade;
    });
    this.shieldBack.material.opacity = .3 * fade * clamp01(this.shieldAge / .4); this.shieldBack.rotation.z = elapsed * .35;
    this.shieldGround.material.opacity = .45 * fade * clamp01(this.shieldAge / .4); this.shieldGround.rotation.z = -elapsed * .5;
  }

  private shieldCastFx() {
    const c = this.shieldRoot.getWorldPosition(new THREE.Vector3()), n = this.shieldRoot.getWorldDirection(new THREE.Vector3());
    this.sigil(c.clone().addScaledVector(n, .25), n, 'rune', C.barrier, 1.7, .7, { spin: 1.4, grow: .2 });
    this.flash(c, C.barrierHot, 3, .3); this.flashLight(c, C.barrier, 8, .5, 8);
    const g = this.player.position, gy = terrainHeight(g.x, g.z) + .08; this.shock(this.tA.set(g.x, gy, g.z), UP, C.barrier, 2.1, .5);
  }

  private shieldBreakFx(broke: boolean) {
    const c = this.shieldRoot.getWorldPosition(new THREE.Vector3()), n = broke ? 26 : 12;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU, r = rr(.2, 1.2), sp = rr(2, broke ? 6 : 3);
      this.fx.emit(c.x + Math.cos(a) * r, c.y + rr(-.8, .8), c.z + Math.sin(a) * r, { vx: Math.cos(a) * sp, vy: rr(-1, 2), vz: Math.sin(a) * sp, life: rr(.5, 1), s0: rr(.2, .36), s1: .02, c0: C.barrierHot, c1: C.barrier, kind: 1, drag: 1.8, grav: 2 });
    }
    if (broke) { this.flash(c, C.barrierHot, 3.2, .25); this.shake = Math.max(this.shake, .2); }
  }

  /* ---------------------------------------------------------------- *
   *  Flight — petals, wind sigil, orbiting mana rings
   * ---------------------------------------------------------------- */
  private buildAura() {
    this.aura.name = 'flight-aura'; this.player.add(this.aura); this.aura.visible = false;
    this.auraFloor = new THREE.Mesh(this.geo.plane, this.basic(C.mana, 0, this.tex.wind)); this.auraFloor.rotation.x = -Math.PI / 2; this.auraFloor.position.y = .05; this.auraFloor.scale.setScalar(1.25);
    this.gyro.position.y = 1.15; this.aura.add(this.auraFloor, this.gyro);
    for (let i = 0; i < 2; i++) {
      const ring = new THREE.Mesh(this.geo.gyro, this.basic(i ? C.petalB : C.mana, 0)); ring.scale.setScalar(1.3 - i * .1); i ? ring.rotation.z = 1.1 : ring.rotation.x = 1.1;
      this.gyro.add(ring); this.auraRings.push(ring as THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial>);
    }
  }

  private updateAura(delta: number, elapsed: number) {
    this.auraT += ((this.flying ? 1 : 0) - this.auraT) * Math.min(1, delta * 5); if (!this.flying && this.auraT < .004) this.auraT = 0;
    this.aura.visible = this.auraT > .01;
    if (this.aura.visible) {
      this.auraFloor.material.opacity = this.auraT * .55; this.auraFloor.rotation.z = elapsed * .8;
      this.gyro.rotation.y = elapsed * 1.1; this.gyro.rotation.x = Math.sin(elapsed * .7) * .25;
      this.auraRings.forEach(r => { r.material.opacity = this.auraT * .6; });
    }
    const p = this.player.position; this.vel.copy(p).sub(this.lastPos).divideScalar(Math.max(delta, 1e-3)); if (this.vel.lengthSq() > 900) this.vel.setLength(30); this.lastPos.copy(p);
    if (!this.flying) { this.acc = 0; this.petalAcc = 0; return; }
    this.acc += delta; this.petalAcc += delta; let n = 0;
    while (this.acc > .02 && n++ < 5) {
      this.acc -= .02; const a = Math.random() * TAU, r = rr(.25, .75);
      this.fx.emit(p.x + Math.cos(a) * r, p.y + rr(.1, 1.9), p.z + Math.sin(a) * r, { vx: -this.vel.x * .25 + rr(-.3, .3), vy: rr(.1, .6), vz: -this.vel.z * .25 + rr(-.3, .3), life: rr(.8, 1.4), s0: rr(.14, .26), s1: .01, c0: Math.random() < .5 ? C.mana : C.paleGold, c1: C.barrier, a: .7, drag: .8 });
    }
    if (this.acc > .1) this.acc = 0;
    n = 0;
    while (this.petalAcc > .12 && n++ < 3) {
      this.petalAcc -= .12; const a = Math.random() * TAU, r = rr(.3, 1);
      this.soft.emit(p.x + Math.cos(a) * r, p.y + rr(.4, 1.8), p.z + Math.sin(a) * r, { vx: -this.vel.x * .3, vy: rr(-.2, .4), vz: -this.vel.z * .3, life: rr(2, 3.2), s0: rr(.14, .22), s1: rr(.1, .16), c0: [C.petalW, C.petalP, C.petalB][Math.floor(Math.random() * 3)], kind: 2, a: .95, drag: 1, grav: .4, rotV: rr(-4, 4), sway: rr(.4, 1.1) });
    }
    if (this.petalAcc > .5) this.petalAcc = 0;
  }

  private flightBurst(entering: boolean) {
    const p = this.player.position, gy = terrainHeight(p.x, p.z) + .08;
    this.sigil(this.tA.set(p.x, gy, p.z), UP, 'wind', C.mana, 2.2, 1.1, { spin: 1.5, grow: .3 });
    for (let k = 0; k < 2; k++) {
      const mat = this.basic(k ? C.petalB : C.mana, .8), ring = new THREE.Mesh(this.geo.torus, mat), delay = k * .1, dur = .6; ring.rotation.x = Math.PI / 2;
      this.addEffect(ring, delay + dur, t => {
        const u = clamp01((t * (delay + dur) - delay) / dur), e = easeOutCubic(u); ring.visible = u > 0 && u < 1;
        ring.position.set(p.x, p.y + (entering ? e : 1 - e) * 2.4, p.z); ring.scale.setScalar(entering ? 1.1 - e * .4 : .7 + e * .5); mat.opacity = Math.sin(u * Math.PI) * .85;
      });
    }
    for (let i = 0; i < 54; i++) {
      const u = i / 54, a = u * TAU * 3 + Math.random() * .3, r = rr(.45, 1) * (entering ? 1 : .8), tx = -Math.sin(a), tz = Math.cos(a), py = p.y + (entering ? u * .6 : u * 2.2);
      this.fx.emit(p.x + Math.cos(a) * r, py, p.z + Math.sin(a) * r, { vx: tx * 3.2, vy: entering ? rr(2.5, 5.5) : rr(-1.5, .2), vz: tz * 3.2, life: rr(.7, 1.3), s0: rr(.18, .34), s1: .02, c0: C.mana, c1: C.barrier, a: .8, drag: 1.5 });
    }
    for (let i = 0; i < 32; i++) {
      const a = Math.random() * TAU, r = rr(.4, 1.3), tx = -Math.sin(a), tz = Math.cos(a), cl = [C.petalW, C.petalP, C.petalB][i % 3];
      this.soft.emit(p.x + Math.cos(a) * r, p.y + (entering ? rr(0, .5) : rr(.3, 2)), p.z + Math.sin(a) * r, { vx: tx * rr(1.5, 3.5), vy: entering ? rr(1.6, 4.2) : rr(-.4, .6), vz: tz * rr(1.5, 3.5), life: rr(1.8, 3), s0: rr(.14, .22), s1: rr(.1, .16), c0: cl, kind: 2, a: .95, drag: 1.2, grav: entering ? .5 : 1.1, rotV: rr(-5, 5), sway: rr(.5, 1.4) });
    }
    this.flashLight(this.tB.set(p.x, p.y + 1, p.z), C.mana, 8, .5, 9);
  }
}
