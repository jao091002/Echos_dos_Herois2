import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { terrainHeight } from './world';
import type { SfxName } from './audio';
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

/** Zoltraak carregável: raio contínuo de núcleo negro envolto por "estrelas". */
type Charge = {
  t: number; level: number; full: boolean; acc: number; group: THREE.Group; core: THREE.Mesh; rim: THREE.Mesh; glow: THREE.Sprite;
  sigilA: THREE.Mesh; sigilB: THREE.Mesh; mats: THREE.ShaderMaterial[]; light: LightSlot | null;
};
type Beam = {
  age: number; life: number; level: number; R: number; reach: number; tick: number; tickDmg: number; ring: number; acc: number; dark: number;
  dir: Vec3; end: Vec3; normal: Vec3; hitSurface: boolean;
  group: THREE.Group; cyl: { mesh: THREE.Mesh; k: number }[]; mats: THREE.ShaderMaterial[];
  muzzle: THREE.Group; tip: THREE.Group; tipGlow: THREE.Sprite; sigilA: THREE.Mesh; sigilB: THREE.Mesh;
  lightTip: LightSlot | null; lightMuzzle: LightSlot | null;
};
/** Tempo (s) segurando o botão até a carga máxima, e extras da carga máxima. */
const CHARGE_TIME = 1.5;
const BEAM_EXTRA_COST = 34;

const COST: Record<SpellId, number> = { zoltraak: 10, vollzanbel: 34, judradjim: 27, shield: 20, flight: 12 };
const COOLDOWN: Record<SpellId, number> = { zoltraak: .38, vollzanbel: 7, judradjim: 3.4, shield: 9, flight: .7 };

/* ------------------------------------------------------------------ *
 *  Tunables / helpers
 * ------------------------------------------------------------------ */
const TAU = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);
const FWD = new THREE.Vector3(0, 0, 1);
/** Scale for every point light the spells use. Raise it if your scene is bright / lights are physically based and look dim. */
const LIGHT_GAIN = 1;
/** Point lights are pooled (never added/removed at runtime) so casting never triggers a shader recompile hitch. */
const LIGHT_SLOTS = 4; // cada luz pontual custa em TODOS os materiais iluminados — poucas e reaproveitadas

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
  bolt: col('#f6eaff'), boltGlow: col('#a259ff'),
  starW: col('#f6f8ff'), starB: col('#b8c6ff'), starV: col('#8f7cff'),
  barrier: col('#2f6bff'), barrierHot: col('#dff4ff'), barrierDeep: col('#0c1fa8'), barrierCyan: col('#3cc8ff'),
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

/**
 * Vértice do raio: além da normal/visão, exporta o eixo do cilindro em espaço de câmera.
 * O "fresnel" é medido contra a visão SEM a componente ao longo do eixo — assim a borda continua
 * fina e o núcleo escuro aparece mesmo olhando quase de trás do raio (câmera em terceira pessoa).
 */
const BEAM_VS = `varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vAxis;
void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=-mv.xyz;
vAxis=normalize((modelViewMatrix*vec4(0.,0.,1.,0.)).xyz);gl_Position=projectionMatrix*mv;}`;
const GLSL_AXIAL_RIM = `float axialRim(vec3 n,vec3 v,vec3 ax,float p){
  v=normalize(v); vec3 vp=v-ax*dot(v,ax); float l=length(vp);
  if(l<1e-3) return 1.; return pow(1.-abs(dot(normalize(n),vp/l)),p);}`;
/** Casca do raio: brilho de borda com estrias que correm ao longo do feixe. */
const BEAM_FS = `${GLSL_SRGB}${GLSL_AXIAL_RIM}
uniform float uTime; uniform float uLen; uniform float uAlpha; uniform float uPower; uniform float uFlow; uniform vec3 uColor;
varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vAxis;
void main(){
  float f=axialRim(vN,vV,normalize(vAxis),uPower);
  float along=vUv.y*uLen;
  float s=.55+.45*sin(along*2.4-uTime*uFlow+vUv.x*12.566);
  float s2=.5+.5*sin(along*.8-uTime*uFlow*.55-vUv.x*18.85);
  float a=(f*(.55+.45*s)+.02*s2)*uAlpha;
  a*=smoothstep(0.,.3,along);
  gl_FragColor=vec4(toSRGB(uColor*(.7+f*1.3)),clamp(a,0.,1.));
}`;
/** Núcleo negro: vazio absoluto com redemoinhos violeta quase imperceptíveis e um leve brilho frio na borda. */
const VOID_FS = `${GLSL_SRGB}${GLSL_NOISE}${GLSL_AXIAL_RIM}
uniform float uTime; uniform float uLen; uniform float uAxial; varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vAxis;
void main(){
  float f=uAxial>.5?axialRim(vN,vV,normalize(vAxis),2.6):pow(1.-abs(dot(normalize(vN),normalize(vV))),3.);
  float a=vUv.x*6.2831853;
  float n=fbm(vec3(cos(a)*1.6,sin(a)*1.6,vUv.y*uLen*1.3-uTime*16.));
  vec3 c=vec3(.014,.009,.03)*smoothstep(.5,.85,n)+vec3(.5,.55,.8)*f*.22;
  gl_FragColor=vec4(toSRGB(c),1.);
}`;

/**
 * Fitas de fogo do Vollzanbel em estilo anime: faixas de cor duras (vermelho → laranja → amarelo → branco),
 * línguas de fogo recortadas por ruído nas bordas, escoando ao longo da espiral.
 * vUv.x = ao longo da fita (base → topo), vUv.y = largura.
 */
const FLAME_RIBBON_VS = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const FLAME_RIBBON_FS = `${GLSL_SRGB}
uniform float uTime; uniform float uGrow; uniform float uFade; uniform float uSeed; varying vec2 vUv;
float h2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y);}
void main(){
  float x=vUv.x, y=vUv.y;
  if(x>uGrow) discard;
  float fl=n2(vec2(x*16.-uTime*2.6+uSeed,y*2.2+uTime*.8))*.65+n2(vec2(x*40.-uTime*5.+uSeed,y*6.))*.35;
  float edge=abs(y-.5)*2.;
  float tip=smoothstep(.75,1.,x/max(uGrow,.001));
  float tongue=edge+(fl-.5)*.85+tip*.7+(1.-uFade)*.9;
  if(tongue>.95) discard;
  float heat=1.-tongue+(n2(vec2(x*28.-uTime*4.,y*4.+uSeed))-.5)*.3;
  vec3 c=vec3(.5,.05,.03);
  c=mix(c,vec3(.93,.24,.04),step(.28,heat));
  c=mix(c,vec3(1.,.6,.1),step(.52,heat));
  c=mix(c,vec3(1.,.86,.35),step(.72,heat));
  c=mix(c,vec3(1.,.98,.86),step(.9,heat));
  gl_FragColor=vec4(c*vec3(1.,.82,.7),1.); // linear: a passada final já converte para sRGB (cores saturadas)
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
  gl_FragColor=vec4(c*1.25,clamp(a,0.,1.)); // linear (a passada final converte para sRGB)
}`;

const SHIELD_VS = `varying vec2 vUv; varying vec3 vNv; varying vec3 vVv;
void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vNv=normalize(normalMatrix*normal);vVv=-mv.xyz;gl_Position=projectionMatrix*mv;}`;
/**
 * Muralha de favos: grade hexagonal procedural. As células acendem do centro para fora (uReveal),
 * cintilam individualmente, têm bordas brancas/ciano e contorno irregular (células da borda somem aleatoriamente).
 * Impactos geram um anel que percorre as células a partir do ponto atingido (uHitUv/uHitT).
 */
const SHIELD_FS = `${GLSL_SRGB}
uniform float uTime; uniform float uFlash; uniform float uAlpha; uniform float uReveal; uniform float uHitT; uniform vec2 uHitUv; uniform float uCells;
uniform vec3 uDeep; uniform vec3 uColA; uniform vec3 uColB; uniform vec3 uWhite;
varying vec2 vUv; varying vec3 vNv; varying vec3 vVv;
float hexDist(vec2 p){p=abs(p);return max(dot(p,normalize(vec2(1.,1.7320508))),p.x);}
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
void main(){
  vec2 p=(vUv-.5)*uCells;
  vec2 r=vec2(1.,1.7320508), hh=r*.5;
  vec2 a=mod(p,r)-hh, b=mod(p-hh,r)-hh;
  vec2 gv=dot(a,a)<dot(b,b)?a:b; vec2 id=p-gv;
  float edge=.5-hexDist(gv);
  float rnd=h21(id);
  float cd=length(id)/(uCells*.5);
  float border=1.-.16*rnd;
  if(cd>border) discard;
  float shown=step(cd,uReveal);
  float front=exp(-pow((cd-uReveal)*9.,2.))*step(uReveal,1.25);
  float line=smoothstep(.06,.0,edge);
  float glowLine=smoothstep(.16,.0,edge);
  float flick=.5+.5*sin(uTime*(1.6+rnd*4.)+rnd*40.);
  float flow=.5+.5*sin(id.y*.55-uTime*3.2+rnd*3.);
  float spark=step(.985,fract(rnd*91.7+uTime*.35))*flick;
  float hit=exp(-pow((length(id/(uCells*.5)-uHitUv)-uHitT*1.6)*4.5,2.))*(1.-uHitT);
  float rim=smoothstep(.62,1.,cd);
  float rf=pow(1.-abs(dot(normalize(vNv),normalize(vVv))),1.5);
  vec3 col=mix(uDeep,uColA,.35+.45*flow+rim*.3);
  col=mix(col,uColB,glowLine*.9);
  col=mix(col*.55,col,glowLine);
  col+=uWhite*(line*(.06+.12*flick)+front*.9+hit*1.1+spark*.8+uFlash*.3);
  float fill=.28+.18*flick*flow+rf*.12;
  float alpha=(fill+glowLine*.45+line*(.5+.4*flick)+rim*.18+front+hit*1.1+spark+uFlash*.35)*shown*uAlpha;
  gl_FragColor=vec4(toSRGB(col*1.1),clamp(alpha*.85,0.,.92));
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

/** Explosão em estrela (espinhos irregulares + brilho) — o "clarão" do relâmpago na ponta do cajado e no impacto. */
function starburstTexture(seed: number): THREE.CanvasTexture {
  const S = 512, h = S / 2, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const g = cv.getContext('2d')!; g.translate(h, h);
  let st = seed >>> 0; const rnd = () => (st = (Math.imul(st, 1664525) + 1013904223) >>> 0) / 4294967296;
  const glow = g.createRadialGradient(0, 0, 0, 0, 0, h);
  glow.addColorStop(0, 'rgba(255,255,255,1)'); glow.addColorStop(.18, 'rgba(242,226,255,.8)'); glow.addColorStop(.45, 'rgba(176,120,255,.22)'); glow.addColorStop(1, 'rgba(176,120,255,0)');
  g.fillStyle = glow; g.fillRect(-h, -h, S, S);
  g.fillStyle = '#fbf4ff'; g.shadowColor = '#c39bff'; g.shadowBlur = 14;
  const N = 34;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * TAU + rnd() * .12, L = h * (.45 + rnd() * .52), w = .035 + rnd() * .05;
    g.beginPath(); g.moveTo(Math.cos(a - w) * h * .12, Math.sin(a - w) * h * .12);
    // espinho serrilhado
    const kx = Math.cos(a), ky = Math.sin(a);
    g.lineTo(kx * L * .55 - ky * L * .03, ky * L * .55 + kx * L * .03); g.lineTo(kx * L, ky * L); g.lineTo(kx * L * .6 + ky * L * .025, ky * L * .6 - kx * L * .025);
    g.lineTo(Math.cos(a + w) * h * .12, Math.sin(a + w) * h * .12); g.closePath(); g.fill();
  }
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
  mana = 1000; /** Mana máxima: base + talentos de Intelecto. */ get maxMana() { return 1000 + this.progression.stats.manaMax; } flying = false; shieldActive = false; shieldTime = 0; blocks = 0;
  /** 0..1 camera-shake request raised by big impacts (already attenuated by distance to the player). Decays on its own; read it from your camera rig. */
  shake = 0;

  private readonly root = new THREE.Group();
  private readonly fx = new Particles(2600, true);   // additive: glows, sparks, embers
  private readonly soft = new Particles(900, false); // normal blending: smoke, petals, debris, dust
  private readonly lights: LightSlot[] = [];
  private projectiles: Projectile[] = []; private effects: Effect[] = [];
  /** Efeitos sonoros (ligado pelo jogo ao motor de áudio). */
  onSfx: (name: SfxName, v?: number) => void = () => {};
  private charge: Charge | null = null; private beam: Beam | null = null;
  private shieldHp = 0; private shieldHpMax = 100;
  /** Mana por segundo enquanto o escudo é segurado. */
  static readonly SHIELD_DRAIN = 3;
  private staffTip: THREE.Object3D | null = null; private starTex: THREE.CanvasTexture[] = [];
  private readonly aimO = new THREE.Vector3(); private readonly aimD = new THREE.Vector3(0, 0, 1);
  private readonly e1 = new THREE.Vector3(); private readonly e2 = new THREE.Vector3();
  private cooldowns: Record<SpellId, number> = { zoltraak: 0, vollzanbel: 0, judradjim: 0, shield: 0, flight: 0 };
  private cooldownMax: Record<SpellId, number> = { ...COOLDOWN };
  private readonly tex: Record<SigilStyle | 'glow', THREE.CanvasTexture>;
  private readonly geo = {
    plane: new THREE.PlaneGeometry(2, 2), ring: new THREE.RingGeometry(.86, 1, 72), sphere: new THREE.IcosahedronGeometry(1, 4), torus: new THREE.TorusGeometry(1, .012, 6, 72),
    beam: MagicSystem.beamGeometry(), lance: MagicSystem.lanceGeometry(), lanceRing: new THREE.TorusGeometry(.26, .012, 6, 40), gyro: new THREE.TorusGeometry(.7, .02, 8, 64),
  };
  // shield
  private readonly shieldRoot = new THREE.Group(); private shieldWall!: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>; private shieldFlash = 0; private shieldAge = 0; private shieldSpray = 0;
  private readonly shieldAnchor = new THREE.Vector3(0, 1.45, 1.05); private readonly shieldQ = new THREE.Quaternion(); private shieldPlaced = false;
  private readonly shieldHitUv = { value: new THREE.Vector2(9, 9) }; private readonly shieldHitT = { value: 1 };
  private static readonly WALL = 3.7;
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
    this.starTex = [starburstTexture(5), starburstTexture(17), starburstTexture(29)];
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

  /* ---------------- Escudo segurável: dura enquanto o botão estiver pressionado ---------------- */
  /** Durabilidade 0..1 (cai a cada golpe bloqueado; ao zerar, o escudo quebra). */
  /** Muralha do escudo como obstáculo físico (plano à frente da maga): centro, normal (para fora), meia-largura/altura. */
  shieldBarrier(out: { center: Vec3; normal: Vec3; half: number }) {
    if (!this.shieldActive || this.shieldAge < .15) return null;
    this.shieldRoot.getWorldPosition(out.center); this.shieldRoot.getWorldDirection(out.normal); out.normal.y = 0; out.normal.normalize();
    out.half = MagicSystem.WALL * .5 * this.shieldRoot.scale.x;
    return out;
  }
  get shieldDurability() { return this.shieldHp / Math.max(1, this.shieldHpMax); }
  beginShield() {
    const cost = this.progression.manaCost(COST.shield);
    if (this.shieldActive || this.cooldowns.shield > 0 || this.mana < cost) return false;
    this.mana -= cost;
    this.shieldHpMax = 100 * this.progression.stats.shieldHp; this.shieldHp = this.shieldHpMax;
    this.shieldActive = true; this.shieldTime = 99; this.shieldAge = 0; this.shieldRoot.visible = true; this.shieldFlash = .45; this.shieldCastFx();
    return true;
  }
  /** Soltar: desfaz sem quebrar (recarga curta). */
  releaseShield() { if (this.shieldActive) this.endShield(false); }
  private endShield(broke: boolean) {
    this.shieldActive = false; this.shieldBreakFx(broke); this.onSfx(broke ? 'shieldBreak' : 'shieldDown');
    this.cooldowns.shield = this.cooldownMax.shield = (broke ? 9 : 1.5) * this.progression.stats.shieldCd;
  }
  /** Ponta do cajado (para efeitos que acompanham a pose em tempo real, como o Judradjim). */
  setStaffTip(o: THREE.Object3D) { this.staffTip = o; }
  /** 0..1 da recarga restante (para o anel de recarga da interface). */
  cooldownFraction(id: SpellId) { return Math.min(1, this.cooldowns[id] / Math.max(.001, this.cooldownMax[id])); }

  /* ---------------- Zoltraak: carregar (segurar) e disparar (soltar) ---------------- */
  get charging() { return !!this.charge; }
  get chargeLevel() { return this.charge ? this.charge.level : 0; }
  get beamActive() { return !!this.beam; }
  get beamPower() { return this.beam ? this.beam.level : 0; }
  /** Origem (ponta do cajado) e direção de mira atuais; chame a cada quadro enquanto carrega ou dispara. */
  setAim(origin: Vec3, direction: Vec3) { this.aimO.copy(origin); this.aimD.copy(direction).normalize(); }

  beginCharge() {
    if (this.charge || this.beam || this.cooldowns.zoltraak > 0 || this.mana < this.progression.manaCost(COST.zoltraak)) return false;
    const g = new THREE.Group(); g.name = 'zoltraak-charge';
    const coreMat = this.voidMaterial(), core = new THREE.Mesh(this.geo.sphere, coreMat);
    const rim = new THREE.Mesh(this.geo.sphere, this.fresnelMaterial(C.starW, 3, 1.7, 1));
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.tex.glow, color: C.starB, transparent: true, opacity: .4, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    const sigilA = new THREE.Mesh(this.geo.plane, this.basic(C.starW, 0, this.tex.rune)), sigilB = new THREE.Mesh(this.geo.plane, this.basic(C.starB, 0, this.tex.arc));
    sigilA.position.z = -.12; sigilB.position.z = -.1;
    g.add(sigilA, sigilB, glow, rim, core);
    this.root.add(g);
    this.charge = { t: 0, level: 0, full: false, acc: 0, group: g, core, rim, glow, sigilA, sigilB, mats: [coreMat], light: this.flashLight(this.aimO, C.starB, 1, 1, 6, true) };
    this.updateCharge(0, 0);
    return true;
  }

  /** Solta a carga: dispara o raio com tamanho/dano/duração proporcionais ao nível. */
  releaseCharge() {
    const c = this.charge; if (!c) return false;
    this.disposeCharge();
    const base = this.progression.manaCost(COST.zoltraak), extra = this.progression.manaCost(BEAM_EXTRA_COST);
    if (this.mana < base) return false;
    const level = Math.min(c.level, clamp01((this.mana - base) / extra));
    this.mana -= base + extra * level;
    this.cooldowns.zoltraak = this.cooldownMax.zoltraak = COOLDOWN.zoltraak + level * .9;
    this.fireBeam(level);
    return true;
  }

  cancelCharge() { if (this.charge) this.disposeCharge(); }

  private disposeCharge() {
    const c = this.charge; if (!c) return;
    c.group.removeFromParent(); disposeTree(c.group); this.releaseLight(c.light); this.charge = null;
  }

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
    if (id === 'zoltraak') { this.setAim(origin, direction); return this.beginCharge() && this.releaseCharge(); }
    const manaCost = this.progression.manaCost(COST[id]);
    if (this.cooldowns[id] > 0 || this.mana < manaCost) return false;
    this.mana -= manaCost; this.cooldowns[id] = COOLDOWN[id]; this.cooldownMax[id] = COOLDOWN[id];
    const dir = direction.clone().normalize();
    if (id === 'shield') { this.mana += manaCost; this.cooldowns[id] = 0; return this.shieldActive ? (this.releaseShield(), true) : this.beginShield(); } // clique = alterna
    if (id === 'flight') { this.flying = !this.flying; this.flightBurst(this.flying); return true; }
    if (id === 'judradjim') { this.lightningFx(origin, target, this.progression.sizeMultiplier()); return true; }
    if (id === 'vollzanbel') { this.vollzanbelFx(target, this.progression.sizeMultiplier()); return true; }
    const kind = id as 'zoltraak' | 'vollzanbel';
    this.spawnProjectile(kind, origin, dir, target); this.muzzleFx(kind, origin, dir);
    return true;
  }

  blockProjectile(from: Vec3, to: Vec3) {
    if (!this.shieldActive || this.mana <= 0) return false;
    const half = MagicSystem.WALL * .5 * this.shieldRoot.scale.x;
    const center = this.shieldRoot.getWorldPosition(new THREE.Vector3());
    const segment = new THREE.Line3(from, to), closest = segment.closestPointToPoint(center, true, new THREE.Vector3());
    if (closest.distanceTo(center) > half * 1.05) return false;
    this.onSfx('shieldBlock'); const st = this.progression.stats;
    this.shieldHp = Math.max(0, this.shieldHp - 22 * st.blockCost); this.shieldFlash = .5; this.blocks++;
    if (st.blockMana) this.mana = Math.min(this.maxMana, this.mana + st.blockMana); // Bastião: bloquear devolve energia
    if (st.blockHeal) this.combat.heal(st.blockHeal);
    // ponto de impacto em coordenadas da muralha -> anel que percorre os favos
    const local = this.shieldRoot.worldToLocal(closest.clone());
    this.shieldHitUv.value.set(local.x / (MagicSystem.WALL * .5), local.y / (MagicSystem.WALL * .5)); this.shieldHitT.value = 0;
    const n = this.shieldRoot.getWorldDirection(new THREE.Vector3());
    const hit = this.shieldRoot.localToWorld(local.setZ(.02));
    this.flash(hit, C.barrierHot, 2 * half, .18);
    this.spray(hit, n, 34, 1.2);
    this.flashLight(hit, C.barrier, 7, .35, 8);
    this.shake = Math.max(this.shake, .16);
    return true;
  }

  update(delta: number, elapsed: number) {
    this.mana = Math.min(this.maxMana, this.mana + delta * (this.flying ? 1.2 : 4.2) * this.progression.stats.manaRegen);
    for (const id of Object.keys(this.cooldowns) as SpellId[]) this.cooldowns[id] = Math.max(0, this.cooldowns[id] - delta);
    if (this.flying) { this.mana -= delta * 8 * this.progression.stats.flyDrain; if (this.mana <= 0) { this.mana = 0; this.flying = false; this.flightBurst(false); } }
    if (this.shieldActive) { this.mana = Math.max(0, this.mana - delta * MagicSystem.SHIELD_DRAIN * this.progression.stats.shieldDrain); this.shieldTime = this.shieldHp / this.shieldHpMax < .25 ? 1 : 99; }
    if (this.shieldActive && (this.shieldHp <= 0 || this.mana <= 0)) this.endShield(true);
    const dt = Math.min(delta, .05);
    this.updateShield(delta, elapsed);
    this.updateAura(delta, elapsed);
    this.updateProjectiles(delta, elapsed);
    this.updateCharge(dt, elapsed);
    this.updateBeam(dt, elapsed);
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
    this.disposeCharge(); this.endBeam();
    this.effects.forEach(e => { e.object.removeFromParent(); disposeTree(e.object); }); this.effects = [];
    this.root.removeFromParent(); this.shieldRoot.removeFromParent(); this.aura.removeFromParent();
    disposeTree(this.shieldRoot); disposeTree(this.aura); this.shieldGround.removeFromParent(); disposeTree(this.shieldGround);
    this.fx.dispose(); this.soft.dispose();
    this.lights.forEach(s => s.light.dispose());
    Object.values(this.geo).forEach(g => g.dispose()); Object.values(this.tex).forEach(t => t.dispose()); this.starTex.forEach(t => t.dispose());
  }

  /* ---------------------------------------------------------------- *
   *  Building blocks
   * ---------------------------------------------------------------- */
  /** Cilindro aberto com eixo em +Z de 0 a 1 (escala Z = comprimento do raio). */
  private static beamGeometry() {
    const g = new THREE.CylinderGeometry(1, 1, 1, 28, 12, true); g.translate(0, .5, 0); g.rotateX(Math.PI / 2); return g;
  }
  private beamMaterial(color: THREE.Color, power: number, alpha: number, flow: number) {
    return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, vertexShader: BEAM_VS, fragmentShader: BEAM_FS,
      uniforms: { uTime: { value: 0 }, uLen: { value: 1 }, uAlpha: { value: alpha }, uPower: { value: power }, uFlow: { value: flow }, uColor: { value: color.clone() } } });
  }
  /** axial=true para o cilindro do raio; false para orbes (esferas). */
  private voidMaterial(axial = false) {
    return new THREE.ShaderMaterial({ vertexShader: BEAM_VS, fragmentShader: VOID_FS, uniforms: { uTime: { value: 0 }, uLen: { value: 1 }, uAxial: { value: axial ? 1 : 0 } } });
  }
  /** Base ortonormal perpendicular a d (para espalhar partículas em volta do raio). */
  private basis(d: Vec3) {
    this.e1.set(0, 1, 0); if (Math.abs(d.y) > .9) this.e1.set(1, 0, 0);
    this.e1.cross(d).normalize(); this.e2.crossVectors(d, this.e1).normalize();
  }
  /** Partícula-estrela: brilho em cruz que cintila (gira) e se dissolve. */
  private star(x: number, y: number, z: number, vx: number, vy: number, vz: number, size: number, life: number, blue = false) {
    this.fx.emit(x, y, z, { vx, vy, vz, life, s0: size, s1: size * .15, c0: C.starW, c1: blue ? C.starB : C.starW, kind: 1, rotV: rr(-7, 7), drag: 1.4 });
  }

  /* ---------------------------------------------------------------- *
   *  Zoltraak — carga e raio
   * ---------------------------------------------------------------- */
  private updateCharge(dt: number, elapsed: number) {
    const c = this.charge; if (!c) return;
    c.t += dt;
    const raw = clamp01((c.t * this.progression.stats.chargeSpeed - .1) / CHARGE_TIME), size = this.progression.sizeMultiplier();
    c.level = 1 - (1 - raw) * (1 - raw);
    const pos = this.tA.copy(this.aimO).addScaledVector(this.aimD, .22);
    c.group.position.copy(pos); c.group.quaternion.setFromUnitVectors(FWD, this.aimD);
    if (!c.full && raw >= 1) {
      this.onSfx('chargeFull');
      // carga máxima: estalo de luz, anel e chuva de estrelas
      c.full = true;
      this.flash(pos, C.starW, 2.4 * size, .2); this.shock(pos, this.aimD, C.starW, 1.6 * size, .35);
      for (let i = 0; i < 26; i++) { const v = this.tB.set(rr(-1, 1), rr(-1, 1), rr(-1, 1)).normalize(), sp = rr(3, 7); this.star(pos.x, pos.y, pos.z, v.x * sp, v.y * sp, v.z * sp, rr(.16, .3), rr(.35, .7)); }
      this.addShake(pos, .1);
    }
    const wob = 1 + Math.sin(elapsed * 31) * .05 * c.level + (c.full ? Math.sin(elapsed * 13) * .07 : 0);
    const r = (.06 + c.level * .3) * size * wob;
    c.core.scale.setScalar(r); c.rim.scale.setScalar(r * 1.32);
    c.glow.scale.setScalar(r * 6); c.glow.material.opacity = .18 + c.level * .3;
    const appear = clamp01(c.t * 6);
    c.sigilA.scale.setScalar((.2 + c.level * .5) * size); c.sigilB.scale.setScalar((.13 + c.level * .32) * size);
    c.sigilA.rotation.z += dt * (1.5 + c.level * 5); c.sigilB.rotation.z -= dt * (2.5 + c.level * 7);
    (c.sigilA.material as THREE.MeshBasicMaterial).opacity = appear * (.55 + c.level * .4);
    (c.sigilB.material as THREE.MeshBasicMaterial).opacity = appear * (.4 + c.level * .4);
    c.mats.forEach(m => { m.uniforms.uTime.value = elapsed; });
    if (c.light) { c.light.light.position.copy(pos); c.light.light.intensity = (1.2 + c.level * 6) * (1 + .15 * Math.sin(elapsed * 27)) * LIGHT_GAIN; }
    // estrelas sendo sugadas para o orbe
    c.acc += dt * (30 + c.level * 110);
    while (c.acc >= 1) {
      c.acc -= 1;
      const v = this.tB.set(rr(-1, 1), rr(-1, 1), rr(-1, 1)).normalize(), d = rr(.7, 1.7) * (.7 + c.level * .9), life = rr(.28, .5);
      this.star(pos.x + v.x * d, pos.y + v.y * d, pos.z + v.z * d, -v.x * d / life * 1.3, -v.y * d / life * 1.3, -v.z * d / life * 1.3, rr(.07, .16) * (1 + c.level * .6), life, Math.random() < .35);
    }
  }

  private fireBeam(level: number) {
    this.onSfx('beamFire', level);
    const size = this.progression.sizeMultiplier(), R = (.14 + level * .34) * size, life = .5 + level * 1.1;
    const g = new THREE.Group(); g.name = 'zoltraak-beam';
    const coreMat = this.voidMaterial(true), orbMat = this.voidMaterial(), rimMat = this.beamMaterial(C.starW, 3.2, 1.7, 42), auraMat = this.beamMaterial(C.starB, 1.3, .5, 26);
    const cyl = [{ mesh: new THREE.Mesh(this.geo.beam, auraMat), k: 2.2 }, { mesh: new THREE.Mesh(this.geo.beam, rimMat), k: 1.22 }, { mesh: new THREE.Mesh(this.geo.beam, coreMat), k: 1 }];
    cyl.forEach(c => { c.mesh.frustumCulled = false; g.add(c.mesh); });
    // boca: orbe negro com aro branco e dois círculos mágicos girando
    const muzzle = new THREE.Group();
    const mCore = new THREE.Mesh(this.geo.sphere, orbMat), mRim = new THREE.Mesh(this.geo.sphere, this.fresnelMaterial(C.starW, 3, 1.8, 1));
    mCore.scale.setScalar(1.06); mRim.scale.setScalar(1.22);
    const sigilA = new THREE.Mesh(this.geo.plane, this.basic(C.starW, .85, this.tex.rune)), sigilB = new THREE.Mesh(this.geo.plane, this.basic(C.starB, .7, this.tex.arc));
    sigilA.scale.setScalar(3.1); sigilB.scale.setScalar(2.1); sigilA.position.z = -.25; sigilB.position.z = -.15;
    muzzle.add(sigilA, sigilB, mRim, mCore);
    // ponta/impacto
    const tip = new THREE.Group();
    const tCore = new THREE.Mesh(this.geo.sphere, orbMat), tRim = new THREE.Mesh(this.geo.sphere, this.fresnelMaterial(C.starW, 2.6, 1.8, 1));
    tCore.scale.setScalar(1.15); tRim.scale.setScalar(1.6);
    const tipGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.tex.glow, color: C.starB, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    tip.add(tipGlow, tRim, tCore);
    this.root.add(g, muzzle, tip);
    const ticks = Math.ceil(life / .1);
    this.beam = {
      age: 0, life, level, R, reach: 1, tick: 0, tickDmg: (34 + 166 * level) / ticks, ring: 0, acc: 0, dark: 0,
      dir: this.aimD.clone(), end: this.aimO.clone(), normal: new THREE.Vector3(0, 1, 0), hitSurface: false,
      group: g, cyl, mats: [coreMat, rimMat, auraMat, orbMat], muzzle, tip, tipGlow, sigilA, sigilB,
      lightTip: this.flashLight(this.aimO, C.starB, 6, 1, 9, true), lightMuzzle: this.flashLight(this.aimO, C.starW, 5, 1, 7, true),
    };
    // disparo: círculo, clarão, onda e tranco de câmera proporcional à carga
    const c = this.tC.copy(this.aimO).addScaledVector(this.aimD, .4);
    this.sigil(c, this.aimD, 'rune', C.starW, (.55 + level * .6) * size, .45 + level * .3, { spin: 3 });
    this.flash(c, C.starW, (1.4 + level * 3) * size, .2);
    this.shock(c, this.aimD, C.starB, (1.2 + level * 2.4) * size, .35);
    this.shake = Math.max(this.shake, .12 + level * .45);
    this.updateBeam(0, 0);
  }

  private endBeam() {
    const b = this.beam; if (!b) return;
    [b.group, b.muzzle, b.tip].forEach(o => { o.removeFromParent(); disposeTree(o); });
    this.releaseLight(b.lightTip); this.releaseLight(b.lightMuzzle); this.beam = null;
  }

  private updateBeam(dt: number, elapsed: number) {
    const b = this.beam; if (!b) return;
    b.age += dt;
    const fadeT = b.age - b.life;
    if (fadeT > .24) { this.endBeam(); return; }
    const fade = fadeT > 0 ? 1 - fadeT / .24 : 1;
    const grow = easeOutCubic(clamp01(b.age / .12));
    const w = Math.max(.001, b.R * grow * Math.pow(fade, .7) * (1 + .07 * Math.sin(elapsed * 47) + .04 * Math.sin(elapsed * 23)));
    // direção acompanha a mira com um pouco de "peso"
    b.dir.lerp(this.aimD, 1 - Math.exp(-dt * 9)).normalize();
    const dir = b.dir, origin = this.tA.copy(this.aimO).addScaledVector(this.aimD, .2);
    b.reach = Math.min(48, b.reach + dt * 170);
    // alcance: obstáculos, chão
    this.collisionRay.set(origin, dir); this.collisionRay.near = 0; this.collisionRay.far = b.reach;
    const hit = this.collisionRay.intersectObjects(this.blockers, true)[0];
    let L = hit ? hit.distance : b.reach;
    b.normal.copy(dir).negate();
    if (hit?.face) { b.normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld); if (b.normal.dot(dir) > 0) b.normal.negate(); }
    for (let d = .5; d < L; d += .5) {
      const x = origin.x + dir.x * d, y = origin.y + dir.y * d, z = origin.z + dir.z * d;
      if (y < terrainHeight(x, z)) {
        let lo = d - .5, hi = d;
        for (let k = 0; k < 4; k++) { const m = (lo + hi) / 2; if (origin.y + dir.y * m < terrainHeight(origin.x + dir.x * m, origin.z + dir.z * m)) hi = m; else lo = m; }
        L = hi; b.normal.set(0, 1, 0); break;
      }
    }
    b.hitSurface = L < b.reach - .01;
    b.end.copy(origin).addScaledVector(dir, L);
    // malhas
    b.group.position.copy(origin); b.group.quaternion.setFromUnitVectors(FWD, dir);
    b.cyl.forEach(c => c.mesh.scale.set(w * c.k, w * c.k, L));
    b.mats.forEach(m => { m.uniforms.uTime.value = elapsed; if (m.uniforms.uLen) m.uniforms.uLen.value = L; });
    b.mats[1].uniforms.uAlpha.value = 1.7 * fade; b.mats[2].uniforms.uAlpha.value = .5 * fade;
    b.muzzle.position.copy(origin); b.muzzle.quaternion.copy(b.group.quaternion); b.muzzle.scale.setScalar(w);
    b.sigilA.rotation.z += dt * 4; b.sigilB.rotation.z -= dt * 6;
    (b.sigilA.material as THREE.MeshBasicMaterial).opacity = .55 * fade; (b.sigilB.material as THREE.MeshBasicMaterial).opacity = .45 * fade;
    b.tip.position.copy(b.end); b.tip.scale.setScalar(w * (b.hitSurface ? 1.25 : .9));
    b.tipGlow.scale.setScalar(b.hitSurface ? 7 : 4); b.tipGlow.material.opacity = .8 * fade;
    if (b.lightTip) { b.lightTip.light.position.copy(b.end).addScaledVector(b.normal, .5); b.lightTip.light.intensity = (5 + b.level * 12) * fade * (1 + .2 * Math.sin(elapsed * 37)) * LIGHT_GAIN; }
    if (b.lightMuzzle) { b.lightMuzzle.light.position.copy(origin); b.lightMuzzle.light.intensity = (3 + b.level * 7) * fade * LIGHT_GAIN; }
    if (dt === 0) return;

    // dano contínuo em "ticks"
    b.tick -= dt;
    if (b.tick <= 0 && fadeT <= 0) {
      b.tick += .1;
      const hits = this.combat.damageSegment(origin, b.end, w + .3, b.tickDmg * this.progression.damageMultiplier(), .3 + b.level * .25, p => {
        for (let i = 0; i < 5; i++) { const v = this.tB.set(rr(-1, 1), rr(-1, 1), rr(-1, 1)).normalize(), sp = rr(3, 8); this.star(p.x, p.y, p.z, v.x * sp, v.y * sp, v.z * sp, rr(.14, .26), rr(.25, .5)); }
      });
      if (hits > 0) this.onConfirmedHit();
    }

    // estrelas girando em espiral em volta do feixe
    this.basis(dir);
    b.acc += dt * (70 + b.level * 190) * fade;
    while (b.acc >= 1) {
      b.acc -= 1;
      const u = Math.random() * L, a = Math.random() * TAU, rad = w * rr(1.3, 3.4), ca = Math.cos(a), sa = Math.sin(a);
      const ox = this.e1.x * ca + this.e2.x * sa, oy = this.e1.y * ca + this.e2.y * sa, oz = this.e1.z * ca + this.e2.z * sa;
      const tx = -this.e1.x * sa + this.e2.x * ca, ty = -this.e1.y * sa + this.e2.y * ca, tz = -this.e1.z * sa + this.e2.z * ca;
      const swirl = rr(2, 6) * (1 + b.level), fwd = rr(3, 14), out = rr(.2, 1.4);
      this.star(origin.x + dir.x * u + ox * rad, origin.y + dir.y * u + oy * rad, origin.z + dir.z * u + oz * rad,
        tx * swirl + dir.x * fwd + ox * out, ty * swirl + dir.y * fwd + oy * out, tz * swirl + dir.z * fwd + oz * out,
        rr(.07, .2) * (1 + b.level * .8), rr(.25, .6), Math.random() < .3);
      if (Math.random() < .18) this.fx.emit(origin.x + dir.x * u + ox * rad * .6, origin.y + dir.y * u + oy * rad * .6, origin.z + dir.z * u + oz * rad * .6, { vx: dir.x * fwd, vy: dir.y * fwd, vz: dir.z * fwd, life: rr(.2, .4), s0: w * 1.6, s1: .02, c0: C.starB, c1: C.starV, a: .45 });
    }
    // fiapos escuros saindo do núcleo
    b.dark += dt * 40 * fade;
    while (b.dark >= 1) {
      b.dark -= 1;
      const u = Math.random() * L, a = Math.random() * TAU, ca = Math.cos(a), sa = Math.sin(a);
      const ox = this.e1.x * ca + this.e2.x * sa, oy = this.e1.y * ca + this.e2.y * sa, oz = this.e1.z * ca + this.e2.z * sa;
      this.soft.emit(origin.x + dir.x * u + ox * w * .9, origin.y + dir.y * u + oy * w * .9, origin.z + dir.z * u + oz * w * .9,
        { vx: ox * rr(.5, 1.5) + dir.x * 4, vy: oy * rr(.5, 1.5) + dir.y * 4, vz: oz * rr(.5, 1.5) + dir.z * 4, life: rr(.2, .4), s0: w * 1.3, s1: w * .3, c0: C.smokeB, a: .55, kind: 3, drag: 2 });
    }
    // impacto: faíscas-estrela, anéis e poeira
    if (b.hitSurface && fade > .2) {
      const n = b.normal, e = b.end;
      for (let i = 0; i < 3 + b.level * 5; i++) { this.hemi(n, .9, this.tB); const sp = rr(4, 12); this.star(e.x, e.y, e.z, this.tB.x * sp, this.tB.y * sp, this.tB.z * sp, rr(.12, .3) * (1 + b.level * .5), rr(.25, .55), Math.random() < .4); }
      if (n.y > .5 && Math.random() < .5) this.soft.emit(e.x, e.y + .1, e.z, { vx: rr(-2, 2), vy: rr(.5, 2), vz: rr(-2, 2), life: rr(.6, 1.1), s0: .4, s1: 1.4 * (1 + b.level), c0: C.dust, c1: C.dustB, a: .3, kind: 3, drag: 1.4 });
      b.ring -= dt;
      if (b.ring <= 0) { b.ring = .09; this.shock(e, n, C.starW, w * 6, .28); if (Math.random() < .5) this.flash(e, C.starB, w * 7, .12); }
    }
    this.addShake(origin, .04 + b.level * .14, 16);
  }

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

  /** Caminho em zigue-zague com quinas vivas (segmentos retos). */
  private boltTube(pts: Vec3[], r: number) {
    const path = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
    const g = new THREE.TubeGeometry(path, Math.max(2, (pts.length - 1) * 2), r, 5, false);
    g.deleteAttribute('uv'); return g;
  }

  /**
   * Uma "descarga" do Judradjim: leque de raios grossos da ponta do cajado até a área do alvo, com bifurcações,
   * sub-bifurcações, espinhos curtos ao longo do raio e arcos largos que se abrem para os lados.
   * Tudo fundido em duas malhas (núcleo branco + brilho azul aditivo).
   */
  private buildStrike(from: Vec3, to: Vec3, size: number) {
    const R = 4.4 * size, dir = this.tC.copy(to).sub(from), len = Math.max(1, dir.length()); dir.normalize();
    this.basis(dir);
    const e1 = this.e1.clone(), e2 = this.e2.clone(), core: THREE.BufferGeometry[] = [], glow: THREE.BufferGeometry[] = [];
    const add = (pts: Vec3[], r: number) => { core.push(this.boltTube(pts, r)); glow.push(this.boltTube(pts, r * 3.4)); };
    const lateral = (k: number) => { const a = Math.random() * TAU; return e1.clone().multiplyScalar(Math.cos(a) * k).addScaledVector(e2, Math.sin(a) * k); };
    const mains: Vec3[][] = [];
    const nMain = 4 + Math.round(size * 2);
    for (let i = 0; i < nMain; i++) {
      const end = to.clone().add(i === 0 ? new THREE.Vector3() : lateral(rr(.3, .75) * R));
      const pts = this.jag(from, end, 5, len * .085); mains.push(pts);
      add(pts, (i === 0 ? .12 : rr(.06, .095)) * size);
      for (let f = 0; f < 4; f++) {
        const st = pts[Math.floor(rr(.18, .85) * pts.length)], fl = rr(1.4, 5) * size;
        const fd = dir.clone().addScaledVector(lateral(1), rr(.5, 1.3)).normalize();
        const fp = this.jag(st, st.clone().addScaledVector(fd, fl), 3, fl * .2); add(fp, .034 * size);
        if (Math.random() < .7) { const s2 = fp[Math.floor(fp.length * rr(.3, .7))], sl = fl * rr(.3, .6); add(this.jag(s2, s2.clone().addScaledVector(fd.clone().addScaledVector(lateral(1), .9).normalize(), sl), 2, sl * .25), .018 * size); }
      }
      // espinhos curtos (o contorno "eriçado" do raio)
      for (let k = 0; k < 7; k++) { const sp = pts[Math.floor(Math.random() * pts.length)], sl = rr(.25, .7) * size; add(this.jag(sp, sp.clone().add(lateral(sl)).addScaledVector(dir, sl * .3), 1, sl * .4), .014 * size); }
    }
    // arcos largos que se abrem para cima/lados (o leque da referência)
    for (let i = 0; i < 3; i++) {
      const end = from.clone().addScaledVector(dir, len * rr(.35, .7)).add(lateral(len * rr(.25, .45))).addScaledVector(UP, len * rr(0, .25));
      add(this.jag(from, end, 4, len * .1), .07 * size);
    }
    // arcos rastejando no chão em volta do alvo
    for (let i = 0; i < 7; i++) {
      const a = i / 7 * TAU + Math.random() * .7, rad = R * rr(.5, 1), pts: Vec3[] = [];
      for (let k = 0; k <= 8; k++) { const u = k / 8, x = to.x + Math.cos(a) * rad * u + rr(-.25, .25) * u, z = to.z + Math.sin(a) * rad * u + rr(-.25, .25) * u; pts.push(new THREE.Vector3(x, terrainHeight(x, z) + .08 + Math.random() * .08, z)); }
      add(pts, .022 * size);
    }
    const coreMat = new THREE.MeshBasicMaterial({ color: '#f1e0ff', transparent: true, opacity: 1, depthWrite: false, toneMapped: false });
    const glowMat = this.basic(C.boltGlow, .4);
    const group = new THREE.Group();
    const cm = mergeGeometries(core), gm = mergeGeometries(glow);
    core.forEach(g => g.dispose()); glow.forEach(g => g.dispose());
    if (gm) group.add(new THREE.Mesh(gm, glowMat));
    if (cm) { const m = new THREE.Mesh(cm, coreMat); m.renderOrder = 11; group.add(m); }
    return { group, coreMat, glowMat, mains };
  }

  /**
   * Judradjim (referência: estocada com o cajado e raio destrutivo em leque).
   * 0–0,22 s: carga na ponta (faíscas sugadas); 0,22 s: golpe — "olho" na ponta (núcleo escuro, anel, estrela),
   * leque de raios até o alvo, explosão; refaz a descarga 2× (estroboscópio) e se dissipa.
   */
  private lightningFx(from: Vec3, to: Vec3, size: number) {
    this.onSfx('lightCharge');
    const R = 4.4 * size, STRIKE = .22, LIFE = 1.05, RESTRIKES = [STRIKE, STRIKE + .11, STRIKE + .24];
    const root = new THREE.Group(), target = to.clone();
    const tip = () => this.staffTip ? this.staffTip.getWorldPosition(new THREE.Vector3()) : from.clone();
    // "olho" na ponta do cajado
    const eye = new THREE.Group(); root.add(eye);
    const orbMat = this.voidMaterial(), orb = new THREE.Mesh(this.geo.sphere, orbMat); orb.scale.setScalar(.001); eye.add(orb);
    const ringMat = this.basic(C.bolt, 0), ring = new THREE.Mesh(new THREE.TorusGeometry(1, .09, 8, 40), ringMat); eye.add(ring);
    const ring2Mat = this.basic(C.boltGlow, 0), ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.45, .035, 6, 48), ring2Mat); eye.add(ring2);
    const burstMat = new THREE.SpriteMaterial({ map: this.starTex[0], color: '#efdcff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    const burst = new THREE.Sprite(burstMat); root.add(burst);
    const hitMat = new THREE.SpriteMaterial({ map: this.starTex[1], color: '#dcc2ff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    const hitBurst = new THREE.Sprite(hitMat); hitBurst.position.copy(target).addScaledVector(UP, .8); root.add(hitBurst);
    const tipLight = this.flashLight(from, C.boltGlow, 3, LIFE, 9, true);
    let strike: ReturnType<MagicSystem['buildStrike']> | null = null, next = 0, struck = false, acc = 0;
    const dir = new THREE.Vector3();

    this.addEffect(root, LIFE, (t, dt) => {
      const time = t * LIFE, p = tip();
      dir.copy(target).sub(p).normalize();
      eye.position.copy(p); eye.quaternion.setFromUnitVectors(FWD, dir);
      burst.position.copy(p).addScaledVector(dir, .1);
      orbMat.uniforms.uTime.value = time;
      if (time < STRIKE) {
        // carga: estrelas sugadas para a ponta, olho crescendo
        const k = time / STRIKE;
        orb.scale.setScalar(.04 + .1 * k * size); ring.scale.setScalar((.08 + .14 * k) * size); ringMat.opacity = .5 * k; ring.rotation.z += dt * 6;
        acc += dt * 160;
        while (acc >= 1) { acc -= 1; const v = this.tB.set(rr(-1, 1), rr(-1, 1), rr(-1, 1)).normalize(), d = rr(.5, 1.3), l = rr(.12, .2); this.fx.emit(p.x + v.x * d, p.y + v.y * d, p.z + v.z * d, { vx: -v.x * d / l, vy: -v.y * d / l, vz: -v.z * d / l, life: l, s0: rr(.08, .16), s1: .02, c0: C.bolt, c1: C.boltGlow, kind: 1 }); }
        if (tipLight) { tipLight.light.position.copy(p); tipLight.light.intensity = (2 + 10 * k) * LIGHT_GAIN; }
        return;
      }
      // novas descargas (a primeira aplica o dano)
      if (next < RESTRIKES.length && time >= RESTRIKES[next]) {
        if (strike) { strike.group.removeFromParent(); disposeTree(strike.group); }
        strike = this.buildStrike(p, target, size); root.add(strike.group);
        burstMat.map = this.starTex[next % this.starTex.length]; burst.material.rotation = Math.random() * TAU;
        this.flash(target, C.bolt, R * (next ? .7 : 1.2), .2);
        this.shock(this.tA.copy(target).addScaledVector(UP, .06), UP, C.bolt, R * (next ? .7 : 1), .4);
        if (!struck) {
          struck = true; this.onSfx('lightning');
          const mult = this.progression.damageMultiplier();
          let hits = this.combat.damageAt(target, R, 46 * mult);
          hits += this.combat.damageSegment(p, target, .9 * size, 18 * mult, .5);
          if (hits > 0) this.onConfirmedHit();
          this.impactFx(target, R, size);
          this.sigil(p.clone().addScaledVector(dir, .35), dir, 'arc', C.boltGlow, .75 * size, .45, { spin: 3.2 });
          this.shock(p.clone().addScaledVector(dir, .3), dir, C.bolt, 1.4 * size, .25);
          this.shake = Math.max(this.shake, .5);
        } else this.addShake(target, .25);
        next++;
      }
      const since = time - STRIKE, fade = since < .45 ? 1 : Math.max(0, 1 - (since - .45) / (LIFE - STRIKE - .45));
      const strobe = since < .45 ? (Math.random() < .7 ? 1 : .35 + Math.random() * .3) : 1;
      if (strike) { strike.coreMat.opacity = fade * strobe; strike.glowMat.opacity = .4 * fade * strobe; }
      // olho e estrela: estouram no golpe e recolhem
      const pop = Math.exp(-since * 7);
      orb.scale.setScalar((.14 + .08 * pop) * size * Math.max(.05, fade)); ring.scale.setScalar((.22 + .25 * pop) * size); ring2.scale.setScalar((.24 + .4 * (1 - pop)) * size);
      ringMat.opacity = .95 * fade; ring2Mat.opacity = .6 * fade * pop + .2 * fade; ring.rotation.z += dt * 9; ring2.rotation.z -= dt * 5;
      burst.scale.setScalar((1.2 + 2.6 * pop + Math.random() * .3) * size); burstMat.opacity = Math.min(1, .55 + pop) * fade * strobe;
      hitBurst.scale.setScalar((2 + 4 * pop) * size); hitMat.opacity = .9 * fade * strobe * (.4 + .6 * pop);
      if (tipLight) { tipLight.light.position.copy(p); tipLight.light.intensity = (14 * strobe * fade + 2) * LIGHT_GAIN; }
      // faíscas correndo pelos raios principais
      if (strike && fade > .3) for (let k = 0; k < 4; k++) {
        const m = strike.mains[Math.floor(Math.random() * strike.mains.length)], q = m[Math.floor(Math.random() * m.length)], v = this.tB.set(rr(-1, 1), rr(-1, 1), rr(-1, 1)).normalize(), sp = rr(2, 6);
        this.fx.emit(q.x, q.y, q.z, { vx: v.x * sp, vy: v.y * sp, vz: v.z * sp, life: rr(.2, .4), s0: rr(.12, .24), s1: .02, c0: C.bolt, c1: C.boltGlow, kind: 1, drag: 2 });
      }
      if (t >= 1 || time >= LIFE - dt) this.releaseLight(tipLight);
    });
  }

  /* ---------------------------------------------------------------- *
   *  Vollzanbel — invocação das chamas infernais
   * ---------------------------------------------------------------- */
  /** Fita espiral (parede de fogo que sobe girando). */
  private static spiralRibbon(turns: number, r0: number, r1: number, h: number, w0: number, w1: number, segs = 150) {
    const pos: number[] = [], uv: number[] = [], idx: number[] = [];
    for (let i = 0; i <= segs; i++) {
      const u = i / segs, a = u * turns * TAU, r = r0 + (r1 - r0) * u, w = (w0 + (w1 - w0) * u) * Math.min(1, u * 6 + .15);
      const x = Math.cos(a) * r, z = Math.sin(a) * r, y = u * h;
      // largura inclinada: parte vertical, parte para fora (dá o "lençol" curvo da referência)
      const ox = Math.cos(a) * w * .35, oz = Math.sin(a) * w * .35;
      pos.push(x - ox, y - w * .5, z - oz, x + ox, y + w * .5, z + oz); uv.push(u, 0, u, 1);
      if (i < segs) { const q = i * 2; idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
    return g;
  }

  /**
   * Vollzanbel:
   *  Formação (0–1,2 s): a energia nasce num ponto à frente da ponta do cajado; faíscas surgem em volta,
   *    a massa flamejante cresce rápido, turbulenta e pulsando, e o núcleo branco fica cada vez mais intenso.
   *  Liberação (1,2–1,5 s): a massa dispara até o alvo, acelerando.
   *  Impacto: expansão violenta — clarão branco no centro, bola de fogo dourada/laranja, onda de choque
   *    rasante, fragmentos incandescentes em todas as direções, fumaça; a luz se apaga aos poucos.
   */
  private vollzanbelFx(target: Vec3, size: number) {
    const FORM = 1.2, TRAVEL = .3, LIFE = FORM + TRAVEL + 2.2, R = 4.8 * size;
    const to = target.clone(); to.y = Math.max(to.y, terrainHeight(to.x, to.z) + .6);
    const root = new THREE.Group(), mass = new THREE.Group(); root.add(mass);
    // núcleo branco quase puro (acima de 1 para o bloom estourar)
    const coreMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 3.8, 3.2), toneMapped: false });
    const core = new THREE.Mesh(this.geo.sphere, coreMat); mass.add(core);
    // camadas de fogo turbulento (dourado → laranja) e casca brilhante
    const layers = [0, 1, 2].map(i => { const m = this.fireMaterial(); m.uniforms.uT.value = .28 + i * .14; const mesh = new THREE.Mesh(this.geo.sphere, m); mass.add(mesh); return { mesh, m, k: 1.35 + i * .45 }; });
    const shellMat = this.fresnelMaterial(C.fire, 3, .6, 1), shell = new THREE.Mesh(this.geo.sphere, shellMat); shell.visible = false; mass.add(shell);
    const haloMat = new THREE.SpriteMaterial({ map: this.tex.glow, color: C.fireHot, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    const halo = new THREE.Sprite(haloMat); mass.add(halo);
    let light: LightSlot | null = null, exploded = false, acc = 0, started = false;
    const start = new THREE.Vector3(), pos = new THREE.Vector3(), dir = new THREE.Vector3();

    this.addEffect(root, LIFE, (t, dt) => {
      const time = t * LIFE;
      const tip = this.staffTip ? this.staffTip.getWorldPosition(this.tC) : this.tC.copy(this.player.position).setY(this.player.position.y + 2);
      dir.copy(to).sub(tip).normalize();
      if (!started) { started = true; this.onSfx('fireCharge'); light = this.flashLight(tip, C.fireHot, 2, LIFE, R * 4, true); }

      // ------------------------------------------------ formação
      if (time < FORM + TRAVEL) {
        const k = clamp01(time / FORM), grow = k * k * (3 - 2 * k);
        if (time < FORM) { pos.copy(tip).addScaledVector(dir, .6 + grow * .6).addScaledVector(UP, grow * .4); start.copy(pos); }
        else { const u = (time - FORM) / TRAVEL; pos.lerpVectors(start, to, u * u); } // dispara acelerando
        mass.position.copy(pos);
        const pulse = 1 + Math.sin(time * (14 + 16 * k)) * (.05 + .07 * k) + (Math.random() - .5) * .04 * k;
        const r = (.07 + .58 * grow) * size * pulse;
        core.scale.setScalar(r * (.42 + .2 * k));
        coreMat.color.setRGB(2 + 4 * k, 1.9 + 3.6 * k, 1.6 + 2.6 * k);
        layers.forEach((l, i) => { l.m.uniforms.uTime.value = time * (1.4 + i * .5); l.mesh.scale.setScalar(r * l.k * (1 + Math.sin(time * 9 + i * 2) * .06)); l.mesh.rotation.set(time * (1 + i), time * (1.7 - i * .4), time * .6); });
        shell.scale.setScalar(r * 2.3); shellMat.uniforms.uAlpha.value = .25 + .3 * k;
        halo.scale.setScalar(r * 4.2); haloMat.opacity = .18 + .32 * k;
        if (light) { light.light.position.copy(pos); light.light.intensity = (3 + 40 * grow * pulse) * LIGHT_GAIN; light.light.distance = R * (2 + 2 * k); }
        // faíscas: nascem em volta do núcleo e são lançadas para fora (vermelhas/laranja); algumas sugadas para dentro
        acc += dt * (40 + 220 * k);
        while (acc >= 1) {
          acc -= 1;
          const v = this.tB.set(rr(-1, 1), rr(-1, 1), rr(-1, 1)).normalize();
          if (Math.random() < .35 && time < FORM) {
            const d = r * rr(3, 5), l = rr(.2, .35);
            this.fx.emit(pos.x + v.x * d, pos.y + v.y * d, pos.z + v.z * d, { vx: -v.x * d / l, vy: -v.y * d / l, vz: -v.z * d / l, life: l, s0: rr(.1, .2), s1: .02, c0: C.fireHot, c1: C.gold, kind: 1 });
          } else {
            const sp = rr(2, 7) * (.5 + k);
            this.fx.emit(pos.x + v.x * r * 1.2, pos.y + v.y * r * 1.2, pos.z + v.z * r * 1.2, { vx: v.x * sp, vy: v.y * sp + 1, vz: v.z * sp, life: rr(.3, .7), s0: rr(.12, .3), s1: .02, c0: C.fire, c1: C.ember, kind: Math.random() < .5 ? 1 : 0, drag: 1.5 });
          }
        }
        if (time >= FORM) { // rastro de fogo no voo
          for (let i = 0; i < 6; i++) this.fx.emit(pos.x + rr(-.3, .3), pos.y + rr(-.3, .3), pos.z + rr(-.3, .3), { vx: -dir.x * 3 + rr(-1, 1), vy: rr(0, 1.5), vz: -dir.z * 3 + rr(-1, 1), life: rr(.3, .6), s0: rr(.6, 1.1) * size, s1: .05, c0: C.fireHot, c1: C.fire, a: .8, drag: 1 });
        }
        return;
      }

      // ------------------------------------------------ impacto
      if (!exploded) {
        exploded = true; mass.visible = false; this.onSfx('fireBoom');
        const ground = this.tA.copy(to).setY(terrainHeight(to.x, to.z) + .05);
        if (this.combat.damageAt(to, R * 1.2, 110 * this.progression.damageMultiplier()) > 0) this.onConfirmedHit();
        this.fireExplosion(to.clone(), UP.clone(), R);
        // centro branco ofuscante que se expande e some
        const flashMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 4.6, 3.8), transparent: true, depthWrite: false, toneMapped: false });
        const flashBall = new THREE.Mesh(this.geo.sphere, flashMat); flashBall.position.copy(to);
        this.addEffect(flashBall, .4, u => { flashBall.scale.setScalar(R * (.15 + .45 * easeOutCubic(u))); flashMat.opacity = (1 - u) * (1 - u) * (1 - u); });
        this.flash(to, C.fireHot, R * 2.4, .3);
        // ondas de energia rasantes que varrem o cenário
        this.shock(ground, UP, C.fire, R * 3.2, .9); this.shock(ground, UP, C.gold, R * 2.2, .7); this.shock(ground, UP, C.fireHot, R * 1.2, .45);
        this.dome(to, C.fire, R * 1.4, .55, 2.4);
        // fragmentos incandescentes em todas as direções (com gravidade)
        for (let i = 0; i < 90; i++) {
          const v = this.tB.set(rr(-1, 1), rr(-.2, 1), rr(-1, 1)).normalize(), sp = rr(6, 22) * Math.max(.7, size);
          this.fx.emit(to.x, to.y, to.z, { vx: v.x * sp, vy: v.y * sp + 3, vz: v.z * sp, life: rr(.8, 1.9), s0: rr(.18, .42), s1: .02, c0: C.fireHot, c1: C.ember, kind: 1, drag: .6, grav: 9 });
        }
        for (let i = 0; i < 40; i++) {
          const a = Math.random() * TAU, sp = rr(10, 20);
          this.fx.emit(ground.x, ground.y + .3, ground.z, { vx: Math.cos(a) * sp, vy: rr(0, 1.5), vz: Math.sin(a) * sp, life: rr(.5, .9), s0: rr(.5, 1), s1: .05, c0: C.gold, c1: C.fire, a: .7, drag: 2.2 });
        }
        this.shake = Math.max(this.shake, 1);
      }
      // a luz diminui gradualmente
      const fade = 1 - (time - FORM - TRAVEL) / (LIFE - FORM - TRAVEL);
      if (light) { light.light.position.copy(to).addScaledVector(UP, 2.5); light.light.intensity = 70 * fade * fade * LIGHT_GAIN; light.light.distance = R * 5; }
      if (time >= LIFE - dt * 1.5) this.releaseLight(light);
    });
  }

  /** Impacto do Judradjim: clarão, cúpula, anéis, faíscas, poeira e trovão de luz. */
  private impactFx(to: Vec3, R: number, size: number) {
    this.sigil(this.tA.copy(to).addScaledVector(UP, .07), UP, 'arc', C.boltGlow, R, 1.1, { spin: 1.3, grow: .05, hold: .4 });
    this.shock(to, UP, C.boltGlow, R * .55, .3);
    this.dome(this.tA.copy(to).addScaledVector(UP, .3), C.boltGlow, R * .6, .35, 2);
    const v = this.tB;
    for (let i = 0; i < 48; i++) { this.hemi(UP, 1, v); const sp = rr(4, 14); this.fx.emit(to.x, to.y + .1, to.z, { vx: v.x * sp, vy: v.y * sp, vz: v.z * sp, life: rr(.5, 1), s0: rr(.22, .42), s1: .02, c0: C.bolt, c1: C.boltGlow, kind: 1, drag: 1.2, grav: 12 }); }
    for (let i = 0; i < 16; i++) this.fx.emit(to.x + rr(-1, 1), to.y + .2, to.z + rr(-1, 1), { vx: rr(-.5, .5), vy: rr(1, 3), vz: rr(-.5, .5), life: rr(1, 1.6), s0: rr(.2, .4), s1: 0, c0: C.boltGlow, a: .7, drag: .5 });
    for (let i = 0; i < 10; i++) this.soft.emit(to.x + rr(-1, 1), to.y + .1, to.z + rr(-1, 1), { vx: rr(-1.5, 1.5), vy: rr(.6, 1.8), vz: rr(-1.5, 1.5), life: rr(1.2, 2), s0: .5, s1: 1.6 * size, c0: C.dust, c1: C.dustB, a: .3, kind: 3, drag: .9 });
    this.flashLight(this.tA.copy(to).addScaledVector(UP, 2.2), C.boltGlow, 30, .45, R * 3.2);
  }

  /* ---------------------------------------------------------------- *
   *  Hex Aegis — barrier
   * ---------------------------------------------------------------- */
  private buildShield() {
    // muralha curva: as bordas dobram em direção à heroína, envolvendo-a
    this.shieldRoot.name = 'hex-aegis'; this.root.add(this.shieldRoot);
    const W = MagicSystem.WALL, geo = new THREE.PlaneGeometry(W, W, 28, 28), pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, -(x * x) * .13 - (y * y) * .045); }
    geo.computeVertexNormals();
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.NormalBlending, vertexShader: SHIELD_VS, fragmentShader: SHIELD_FS,
      uniforms: {
        uTime: { value: 0 }, uFlash: { value: 0 }, uAlpha: { value: 0 }, uReveal: { value: 0 }, uHitT: this.shieldHitT, uHitUv: this.shieldHitUv, uCells: { value: 15 },
        uDeep: { value: C.barrierDeep.clone() }, uColA: { value: C.barrier.clone() }, uColB: { value: C.barrierCyan.clone() }, uWhite: { value: C.barrierHot.clone() },
      },
    });
    this.shieldWall = new THREE.Mesh(geo, mat); this.shieldWall.renderOrder = 8; this.shieldRoot.add(this.shieldWall);
    this.shieldBack = new THREE.Mesh(this.geo.plane, this.basic(C.barrierCyan, 0, this.tex.rune)); this.shieldBack.position.z = -.25; this.shieldBack.scale.setScalar(1.05); this.shieldRoot.add(this.shieldBack);
    this.shieldGround = new THREE.Mesh(this.geo.plane, this.basic(C.barrier, 0, this.tex.rune)); this.shieldGround.rotation.x = -Math.PI / 2; this.shieldGround.position.y = .06; this.shieldGround.scale.setScalar(1.7); this.player.add(this.shieldGround);
    this.shieldRoot.visible = false;
  }

  /** Jato de faíscas azuis que escorrem pela superfície e são repelidas (estilo da barreira). */
  private spray(at: Vec3, n: Vec3, count: number, power: number) {
    this.basis(n);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * TAU, along = rr(.3, 1), out = rr(.15, .8);
      const vx = (this.e1.x * Math.cos(a) + this.e2.x * Math.sin(a)) * along + n.x * out, vy = (this.e1.y * Math.cos(a) + this.e2.y * Math.sin(a)) * along + n.y * out, vz = (this.e1.z * Math.cos(a) + this.e2.z * Math.sin(a)) * along + n.z * out;
      const sp = rr(6, 16) * power, life = rr(.25, .6);
      // 3 pontos em linha = rastro alongado
      for (let k = 0; k < 3; k++) this.fx.emit(at.x - vx * k * .06, at.y - vy * k * .06, at.z - vz * k * .06, { vx: vx * sp, vy: vy * sp, vz: vz * sp, life: life * (1 - k * .2), s0: rr(.16, .3) * (1 - k * .25), s1: .02, c0: k ? C.barrierCyan : C.barrierHot, c1: C.barrier, kind: k ? 0 : 1, drag: 2.6, grav: 1.5 });
    }
  }

  private updateShield(delta: number, elapsed: number) {
    // a muralha segue a heroína com um leve atraso (inércia), em vez de grudada no corpo
    this.player.updateMatrixWorld();
    const goal = this.tC.copy(this.shieldAnchor).applyMatrix4(this.player.matrixWorld);
    this.player.getWorldQuaternion(this.shieldQ);
    if (!this.shieldPlaced) { this.shieldRoot.position.copy(goal); this.shieldRoot.quaternion.copy(this.shieldQ); this.shieldPlaced = true; }
    this.shieldRoot.position.lerp(goal, 1 - Math.exp(-delta * 16));
    this.shieldRoot.quaternion.slerp(this.shieldQ, 1 - Math.exp(-delta * 9));
    if (!this.shieldActive) { this.shieldRoot.visible = false; this.shieldGround.material.opacity = 0; return; }
    this.shieldAge += delta; const size = this.progression.sizeMultiplier();
    this.shieldRoot.visible = true;
    this.shieldRoot.scale.setScalar(size * (.86 + .14 * easeOutBack(clamp01(this.shieldAge / .4))) * (1 + Math.sin(elapsed * 2.2) * .008));
    this.shieldFlash = Math.max(0, this.shieldFlash - delta * 2.4);
    if (this.shieldHitT.value < 1) this.shieldHitT.value = Math.min(1, this.shieldHitT.value + delta * 1.5);
    const fade = clamp01(this.shieldTime / .7) * (this.shieldTime < 1.2 ? .75 + .25 * Math.sin(elapsed * 38) : 1);
    const u = this.shieldWall.material.uniforms;
    u.uTime.value = elapsed; u.uFlash.value = this.shieldFlash; u.uAlpha.value = fade;
    u.uReveal.value = this.shieldTime < .5 ? 1.3 * clamp01(this.shieldTime / .5) : easeOutCubic(clamp01(this.shieldAge / .45)) * 1.3; // abre do centro, fecha de fora para dentro
    this.shieldBack.material.opacity = .22 * fade * clamp01(this.shieldAge / .5); this.shieldBack.rotation.z = elapsed * .4;
    this.shieldGround.material.opacity = .5 * fade * clamp01(this.shieldAge / .4); this.shieldGround.rotation.z = -elapsed * .5;
    // energia escorrendo: faíscas e jatos ocasionais saindo da superfície
    this.shieldSpray += delta * 40 * fade;
    const n = this.shieldRoot.getWorldDirection(this.tN), half = MagicSystem.WALL * .45 * this.shieldRoot.scale.x;
    while (this.shieldSpray >= 1) {
      this.shieldSpray -= 1;
      const p = this.tB.set(rr(-half, half), rr(-half, half), 0); if (p.length() > half) continue;
      this.shieldRoot.localToWorld(p.setZ(-(p.x * p.x) * .13 / this.shieldRoot.scale.x));
      this.fx.emit(p.x, p.y, p.z, { vx: n.x * rr(.3, 1.5), vy: rr(.4, 1.8), vz: n.z * rr(.3, 1.5), life: rr(.4, .9), s0: rr(.1, .22), s1: .02, c0: C.barrierHot, c1: C.barrier, kind: Math.random() < .5 ? 1 : 0, drag: 1.2, rotV: rr(-5, 5) });
    }
    if (Math.random() < delta * 3 * fade) this.spray(this.tB.set(rr(-half, half) * .7, rr(-half, half) * .7, 0).applyMatrix4(this.shieldRoot.matrixWorld), n, 8, .6);
  }

  private shieldCastFx() {
    this.shieldPlaced = false; this.updateShield(0, 0); this.onSfx('shieldUp');
    const c = this.shieldRoot.getWorldPosition(new THREE.Vector3()), n = this.shieldRoot.getWorldDirection(new THREE.Vector3());
    this.sigil(c.clone().addScaledVector(n, .1), n, 'rune', C.barrierCyan, 2.1, .7, { spin: 1.6, grow: .25 });
    this.flash(c, C.barrierHot, 4, .3); this.flashLight(c, C.barrier, 10, .6, 10);
    this.spray(c, n, 40, 1);
    const g = this.player.position, gy = terrainHeight(g.x, g.z) + .08; this.shock(this.tA.set(g.x, gy, g.z), UP, C.barrier, 2.6, .5);
    this.shake = Math.max(this.shake, .1);
  }

  private shieldBreakFx(broke: boolean) {
    // estilhaça: faíscas saindo de pontos espalhados pela muralha
    const n = this.shieldRoot.getWorldDirection(new THREE.Vector3()), half = MagicSystem.WALL * .45 * this.shieldRoot.scale.x, count = broke ? 60 : 26;
    for (let i = 0; i < count; i++) {
      const p = this.tB.set(rr(-half, half), rr(-half, half), 0).applyMatrix4(this.shieldRoot.matrixWorld);
      const sp = rr(2, broke ? 8 : 3.5);
      this.fx.emit(p.x, p.y, p.z, { vx: n.x * sp + rr(-1.5, 1.5), vy: rr(-1, 2.5), vz: n.z * sp + rr(-1.5, 1.5), life: rr(.5, 1.1), s0: rr(.18, .36), s1: .02, c0: C.barrierHot, c1: C.barrier, kind: 1, drag: 1.6, grav: 3, rotV: rr(-8, 8) });
    }
    const c = this.shieldRoot.getWorldPosition(this.tA);
    this.flash(c, C.barrierHot, broke ? 4.5 : 2.5, .25);
    if (broke) this.shake = Math.max(this.shake, .25);
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
    this.onSfx(entering ? 'flightOn' : 'flightOff');
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
