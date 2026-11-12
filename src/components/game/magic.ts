import * as THREE from 'three';
import { terrainHeight } from './world';
import type { SfxName } from './audio';
import type { CombatSystem } from './combat';
import type { PlayerProgression } from './progression';

export type SpellId = 'zoltraak' | 'vollzanbel' | 'judradjim' | 'shield' | 'flight'
  // guerreiro
  | 'golpe' | 'redemoinho' | 'agarrao' | 'investida' | 'brado'
  // clérigo
  | 'julgamento' | 'cura' | 'consagracao' | 'bencao'
  // desbloqueadas na árvore de habilidades (teclas 3 e 4)
  | 'chuvaEstelar' | 'passoArcano' | 'fenda' | 'lancaSagrada' | 'santuario'
  // clérigo (kit do livro sagrado)
  | 'tresLancas' | 'curaEquipe' | 'despertar';
export const SPELL_IDS: SpellId[] = ['zoltraak', 'vollzanbel', 'judradjim', 'shield', 'flight', 'golpe', 'redemoinho', 'agarrao', 'investida', 'brado', 'julgamento', 'cura', 'consagracao', 'bencao', 'chuvaEstelar', 'passoArcano', 'fenda', 'lancaSagrada', 'santuario', 'tresLancas', 'curaEquipe', 'despertar'];
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

export const COST: Record<SpellId, number> = {
  zoltraak: 10, vollzanbel: 34, judradjim: 27, shield: 20, flight: 12,
  golpe: 8, redemoinho: 26, agarrao: 24, investida: 18, brado: 30,
  julgamento: 14, cura: 32, consagracao: 38, bencao: 30,
  chuvaEstelar: 42, passoArcano: 16, fenda: 30, lancaSagrada: 22, santuario: 45,
  tresLancas: 20, curaEquipe: 40, despertar: 35,
};
const COOLDOWN: Record<SpellId, number> = {
  zoltraak: .38, vollzanbel: 7, judradjim: 3.4, shield: 9, flight: .7,
  golpe: .85, redemoinho: 5, agarrao: 8, investida: 4.5, brado: 18,
  julgamento: 1.1, cura: 7, consagracao: 11, bencao: 20,
  chuvaEstelar: 12, passoArcano: 4.5, fenda: 9, lancaSagrada: 4, santuario: 24,
  tresLancas: 2.4, curaEquipe: 10, despertar: 18,
};
/**
 * Três Lanças da Deusa (clérigo): ajuste fino.
 * range: alcance máximo (m) · hitbox: raio de toque da lança no voo (somado ao corpo do inimigo)
 * blast: raio da explosão de cada lança · damage: dano por lança (3 lanças = até 48 num alvo só)
 */
const TRES_LANCAS = { range: 22, hitbox: .3, blast: .9, damage: 16 };
const zeroCooldowns =() => Object.fromEntries(SPELL_IDS.map(id => [id, 0])) as Record<SpellId, number>;

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
  steel: col('#cfd8e6'), steelHot: col('#fff8ea'),
  heal: col('#6cf0a0'), healHot: col('#e8ffe9'),
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

/**
 * Selo de cura do clérigo: disco luminoso com anel e uma mão aberta no centro (desenhado em branco —
 * a cor vem do material, verde na cura). Mesmo formato dos outros selos (canvas → textura).
 */
function healSigilTexture(): THREE.CanvasTexture {
  const S = 512, h = S / 2, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const g = cv.getContext('2d')!; g.translate(h, h);
  // disco preenchido com brilho suave e borda luminosa
  const disc = g.createRadialGradient(0, 0, 0, 0, 0, h * .78);
  disc.addColorStop(0, 'rgba(255,255,255,.55)'); disc.addColorStop(.7, 'rgba(255,255,255,.32)'); disc.addColorStop(.92, 'rgba(255,255,255,.75)'); disc.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = disc; g.beginPath(); g.arc(0, 0, h * .78, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 10; g.beginPath(); g.arc(0, 0, h * .74, 0, TAU); g.stroke();
  // anel externo fino e tracejado
  g.lineWidth = 4; g.setLineDash([18, 14]); g.beginPath(); g.arc(0, 0, h * .95, 0, TAU); g.stroke(); g.setLineDash([]);
  // mão aberta (palma + cinco dedos abertos em leque)
  g.fillStyle = '#ffffff'; g.shadowColor = 'rgba(255,255,255,.9)'; g.shadowBlur = 18;
  g.beginPath(); g.ellipse(0, h * .14, h * .17, h * .19, 0, 0, TAU); g.fill();
  const finger = (ang: number, len: number, w: number, base: number) => {
    g.save(); g.rotate(ang); g.translate(0, -base);
    g.beginPath(); g.moveTo(-w, 0); g.lineTo(-w * .8, -len); g.arc(0, -len, w * .8, Math.PI, 0); g.lineTo(w, 0); g.closePath(); g.fill(); g.restore();
  };
  finger(-.42, h * .2, h * .045, h * .06); finger(-.15, h * .27, h * .045, h * .08); finger(.08, h * .29, h * .045, h * .08); finger(.3, h * .25, h * .042, h * .07);
  g.save(); g.translate(-h * .12, h * .2); finger(-1.15, h * .2, h * .05, 0); g.restore(); // polegar
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
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
/*
 * Guardião de programas de shader. No three.js um programa compilado é apagado quando o ÚLTIMO material que o usa
 * recebe dispose(); como cada efeito de magia cria e descarta seus materiais, o feitiço seguinte recompilava tudo
 * (engasgos de centenas de ms). O primeiro material de cada variante nunca é descartado: o programa fica vivo.
 */
const keptPrograms = new Map<string, THREE.Material>();
function programKey(m: THREE.Material) {
  const sm = m as THREE.ShaderMaterial, mm = m as THREE.MeshBasicMaterial & { fog?: boolean };
  return [m.type, sm.isShaderMaterial ? `${sm.vertexShader}§${sm.fragmentShader}` : '', !!mm.map, m.side, m.toneMapped, m.vertexColors, m.alphaTest > 0, m.premultipliedAlpha, mm.fog].join('|');
}
let keeperRenderer: THREE.WebGLRenderer | null = null;
/** Só vale guardar um material que já tem programa compilado (senão o "real" seria o último dono e o apagaria). */
const compiled = (m: THREE.Material) => !!keeperRenderer && !!(keeperRenderer.properties.get(m) as { currentProgram?: unknown }).currentProgram;
/*
 * Pool de materiais dos efeitos. Material novo custa CPU no primeiro desenho (o three monta parâmetros e a chave
 * do programa); com dezenas de efeitos por feitiço isso aparecia no topo do perfil. Materiais das fábricas
 * (basic, fresnel, lança, fogo, raio, vazio, brilho) voltam para cá ao fim do efeito e são reaproveitados,
 * redefinidos exatamente com os valores da fábrica.
 */
const matPool = new Map<string, THREE.Material[]>();
const POOL_CAP = 64;
function pooled<T extends THREE.Material>(kind: string, make: () => T, reset: (m: T) => void): T {
  const m = matPool.get(kind)?.pop() as T | undefined;
  if (m) { m.userData.inPool = false; reset(m); return m; }
  const n = make(); n.userData.pool = kind; return n;
}
function retire(m: THREE.Material) {
  if (m.userData.keep || m.userData.inPool) return;
  const kind = m.userData.pool as string | undefined;
  if (kind) {
    let list = matPool.get(kind); if (!list) matPool.set(kind, list = []);
    if (list.length < POOL_CAP) { m.userData.inPool = true; list.push(m); return; }
  }
  const k = programKey(m), kept = keptPrograms.get(k);
  if (kept === m) return;
  if (!kept && compiled(m)) { keptPrograms.set(k, m); return; }
  m.dispose();
}
function disposeTree(o: THREE.Object3D) {
  o.traverse(c => {
    const m = c as THREE.Mesh;
    if (m.geometry && !(c instanceof THREE.Sprite) && !m.geometry.userData.keep) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (mat) (Array.isArray(mat) ? mat : [mat]).forEach(retire);
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
  get count() { return this.n; }
  clear() { this.n = 0; this.points.geometry.setDrawRange(0, 0); }
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
  /** Mana (ou fôlego/fé) inicial e máxima base: 100, mais os talentos da árvore. */
  static readonly BASE_MANA = 100;
  mana = MagicSystem.BASE_MANA; get maxMana() { return MagicSystem.BASE_MANA + this.progression.stats.manaMax; } flying = false; shieldActive = false; shieldTime = 0; blocks = 0;
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
  private cooldowns: Record<SpellId, number> = zeroCooldowns();
  /* bônus temporários (Brado do guerreiro, Bênção do clérigo) */
  private bradoT = 0; private bencaoT = 0; private despertarT = 0; private curaZoneT = 0;
  /** Multiplicador de dano vindo do Brado (guerreiro) e do Despertar (clérigo). */
  get buffDamage() { return (this.bradoT > 0 ? 1.35 : 1) * (this.despertarT > 0 ? 1.25 : 1); }
  /** Redução de dano extra (Brado, Bênção, Santuário, Despertar), somada à dos talentos e da classe. */
  get buffResist() { return (this.bradoT > 0 ? .25 : 0) + (this.bencaoT > 0 ? .15 : 0) + (this.insideSantuario ? .35 : 0) + (this.despertarT > 0 ? .2 : 0); }
  /** Velocidade extra do Despertar. */
  get buffSpeed() { return this.despertarT > 0 ? 1.2 : 1; }
  get buffs() { return { brado: this.bradoT, bencao: this.bencaoT, despertar: this.despertarT }; }
  /** Despertar: o jogo remove efeitos negativos (atordoamento etc.) quando isto é chamado. */
  onCleanse: () => void = () => {};
  private healTex!: THREE.CanvasTexture;
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
  private readonly bT = new THREE.Vector3(); private readonly bN = new THREE.Vector3(); private readonly bB = new THREE.Vector3();
  private readonly tA = new THREE.Vector3(); private readonly tB = new THREE.Vector3(); private readonly tC = new THREE.Vector3(); private readonly tN = new THREE.Vector3();

  constructor(private scene: THREE.Scene, private player: THREE.Group, private combat: CombatSystem, private blockers: THREE.Object3D[], private progression: PlayerProgression, private onConfirmedHit: () => void = () => {}) {
    Object.values(this.geo).forEach(g => { g.userData.keep = true; });
    this.starTex = [starburstTexture(5), starburstTexture(17), starburstTexture(29)];
    this.tex = { rune: sigilTexture('rune', 11), sun: sigilTexture('sun', 23), arc: sigilTexture('arc', 37), wind: sigilTexture('wind', 51), glow: glowTexture() };
    this.healTex = healSigilTexture();
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
    out.half = this.shieldHalf;
    return out;
  }
  /*
   * Estilo do escudo: 'arcane' = muralha de favos (maga, clérigo); 'physical' = o escudo de verdade na mão
   * do guerreiro — sem muralha mágica, bloqueia só o que vem pela frente, numa largura do tamanho do escudo.
   */
  private shieldStyle: 'arcane' | 'physical' = 'arcane';
  private shieldHand: THREE.Object3D | null = null;
  setShieldStyle(style: 'arcane' | 'physical', hand: THREE.Object3D | null = null) {
    if (this.shieldActive && style !== this.shieldStyle) this.endShield(false);
    this.shieldStyle = style; this.shieldHand = hand;
  }
  private get physicalShield() { return this.shieldStyle === 'physical'; }
  private get shieldHalf() { return this.physicalShield ? .9 : MagicSystem.WALL * .5 * this.shieldRoot.scale.x; }
  /** Ponto do escudo no mundo (o da mão, no físico; o centro da muralha, no arcano). */
  private shieldPos(out: Vec3) { return (this.physicalShield && this.shieldHand ? this.shieldHand : this.shieldRoot).getWorldPosition(out); }
  get shieldDurability() { return this.shieldHp / Math.max(1, this.shieldHpMax); }
  beginShield() {
    const cost = this.progression.manaCost(COST.shield);
    if (this.shieldActive || this.cooldowns.shield > 0 || this.mana < cost) return false;
    this.mana -= cost;
    this.shieldHpMax = 100 * this.progression.stats.shieldHp; this.shieldHp = this.shieldHpMax;
    this.shieldActive = true; this.shieldTime = 99; this.shieldAge = 0; this.shieldRoot.visible = !this.physicalShield; this.shieldFlash = .45; this.shieldCastFx();
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
  /** Só para benchmark: zera recargas e enche a mana. */
  debugRecharge() { for (const id of Object.keys(this.cooldowns) as SpellId[]) this.cooldowns[id] = 0; this.mana = this.maxMana; }
  /** Contadores para o painel de desempenho. */
  perfStats() {
    return {
      'partículas': this.fx.count + this.soft.count, efeitos: this.effects.length, 'projéteis': this.projectiles.length,
      'luzes de magia': this.lights.filter(s => s.active).length,
      'magias ativas': this.effects.length + this.projectiles.length + (this.charge ? 1 : 0) + (this.beam ? 1 : 0) + (this.shieldActive ? 1 : 0) + (this.flying ? 1 : 0),
    };
  }
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
    const glow = new THREE.Sprite(this.pSprite('s545', { map: this.tex.glow, color: C.starB, transparent: true, opacity: .4, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
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

  /**
   * Compila antes todos os shaders das magias (sem engasgo no primeiro feitiço).
   * target: o render target onde a cena é desenhada (o do pós-processamento). O three gera variantes diferentes
   * de shader para canvas e para render target (tone mapping / espaço de cor), então é preciso compilar para o certo.
   */
  prewarm(renderer: THREE.WebGLRenderer, camera: THREE.Camera, target: THREE.WebGLRenderTarget | null = null) {
    const prevTarget = renderer.getRenderTarget(); renderer.setRenderTarget(target);
    // executa de verdade cada efeito longe da vista (sem som, sem alvos por perto) e compila tudo o que ele cria
    // ao longo da animação; os materiais vão para o guardião, então os programas nunca são apagados
    keeperRenderer = renderer;
    const sfx = this.onSfx, hit = this.onConfirmedHit, manaBefore = this.mana, cds = { ...this.cooldowns };
    this.onSfx = () => {}; this.onConfirmedHit = () => {};
    const far = new THREE.Vector3(0, -500, 0), far2 = new THREE.Vector3(0, -500, 6);
    const holder = new THREE.Group(); holder.position.copy(far);
    const mats: THREE.Material[] = [this.fireMaterial(), this.fresnelMaterial(C.fire, 2, 1, 1), this.lanceMaterial(C.paleGold, C.gold, 1), this.basic(C.gold, 1, this.tex.rune), this.basic(C.gold, 1), this.beamMaterial(C.gold, 1, 1, 1), this.voidMaterial(true), this.scorch()];
    mats.forEach(m => holder.add(new THREE.Mesh(this.geo.sphere, m)));
    this.scene.add(holder);
    try {
      this.flash(far, C.gold, 1, 1); this.shock(far, UP, C.gold, 1, 1); this.dome(far, C.gold, 1, 1);
      for (const st of ['rune', 'sun', 'arc', 'wind'] as SigilStyle[]) this.sigil(far, UP, st, C.gold, 1, 1);
      this.zoltraakImpact(far, UP, 1); this.fireExplosion(far, UP, 1);
      this.muzzleFx('zoltraak', far, FWD); this.muzzleFx('vollzanbel', far, FWD);
      this.spawnProjectile('zoltraak', far, FWD, far2); this.spawnProjectile('vollzanbel', far, FWD, far2);
      this.lightningFx(far, far2, 1); this.vollzanbelFx(far2.clone(), 1);
      renderer.compile(this.scene, camera);
      for (let i = 1; i <= 50; i++) { renderer.compile(this.root, camera, this.scene); this.update(.05, i * .05); }
    } finally {
      this.scene.remove(holder); mats.forEach(retire);
      this.projectiles.forEach(p => { p.object.removeFromParent(); disposeTree(p.object); this.releaseLight(p.light); }); this.projectiles = [];
      this.effects.forEach(e => { e.object.removeFromParent(); disposeTree(e.object); }); this.effects = [];
      this.lights.forEach(sl => this.releaseLight(sl));
      this.fx.clear(); this.soft.clear(); this.shake = 0;
      this.mana = manaBefore; Object.assign(this.cooldowns, cds);
      this.onSfx = sfx; this.onConfirmedHit = hit;
      renderer.setRenderTarget(prevTarget);
    }
  }

  cast(id: SpellId, origin: Vec3, direction: Vec3, target: Vec3) {
    if (id === 'zoltraak') { this.setAim(origin, direction); return this.beginCharge() && this.releaseCharge(); }
    const manaCost = this.progression.manaCost(COST[id]);
    if (this.cooldowns[id] > 0 || this.mana < manaCost) return false;
    this.mana -= manaCost; this.cooldowns[id] = this.cooldownMax[id] = COOLDOWN[id] * (1 - this.progression.stats.cdr);
    const dir = direction.clone().normalize();
    if (id === 'shield') { this.mana += manaCost; this.cooldowns[id] = 0; return this.shieldActive ? (this.releaseShield(), true) : this.beginShield(); } // clique = alterna
    if (id === 'flight') { this.flying = !this.flying; this.flightBurst(this.flying); return true; }
    if (id === 'judradjim') { this.lightningFx(origin, target, this.progression.sizeMultiplier()); return true; }
    if (id === 'vollzanbel') { this.vollzanbelFx(target, this.progression.sizeMultiplier()); return true; }
    switch (id) {
      case 'golpe': this.golpeFx(dir); return true;
      case 'redemoinho': this.redemoinhoFx(); return true;
      case 'agarrao': this.grabLungeFx(dir); return true;
      case 'investida': this.investidaFx(dir); return true;
      case 'brado': this.bradoFx(); return true;
      case 'julgamento': this.julgamentoFx(origin, dir, target); return true;
      case 'cura': this.curaFx(); return true;
      case 'consagracao': this.consagracaoFx(); return true;
      case 'bencao': this.bencaoFx(); return true;
      case 'chuvaEstelar': this.chuvaEstelarFx(origin, dir, target); return true;
      case 'passoArcano': return true; // o jogo move a maga e chama blinkFx
      case 'fenda': this.fendaFx(dir); return true;
      case 'lancaSagrada': this.lancaSagradaFx(origin, dir); return true;
      case 'santuario': this.santuarioFx(); return true;
      case 'tresLancas': this.tresLancasFx(origin, dir, target); return true;
      case 'curaEquipe': this.curaEquipeFx(); return true;
      case 'despertar': this.despertarFx(origin); return true;
    }
    const kind = id as 'zoltraak' | 'vollzanbel';
    this.spawnProjectile(kind, origin, dir, target); this.muzzleFx(kind, origin, dir);
    return true;
  }

  blockProjectile(from: Vec3, to: Vec3) {
    if (!this.shieldActive || this.mana <= 0) return false;
    const half = this.shieldHalf;
    const center = this.shieldRoot.getWorldPosition(new THREE.Vector3());
    const segment = new THREE.Line3(from, to), closest = segment.closestPointToPoint(center, true, new THREE.Vector3());
    if (closest.distanceTo(center) > half * 1.05) return false;
    if (this.physicalShield) {
      // guarda com a arma (guerreiro): só bloqueia golpes vindos da frente (o ponto mais distante do corpo precisa estar à frente)
      const p = this.player.position, far = from.distanceToSquared(p) > to.distanceToSquared(p) ? from : to;
      const fwd = this.shieldRoot.getWorldDirection(this.tN);
      if ((far.x - p.x) * fwd.x + (far.z - p.z) * fwd.z < .15) return false;
    }
    this.onSfx('shieldBlock'); const st = this.progression.stats;
    this.shieldHp = Math.max(0, this.shieldHp - 22 * st.blockCost); this.shieldFlash = .5; this.blocks++;
    if (st.blockMana) this.mana = Math.min(this.maxMana, this.mana + st.blockMana); // Bastião: bloquear devolve energia
    if (st.blockHeal) this.combat.heal(st.blockHeal);
    if (this.physicalShield) {
      // faíscas de aço saindo da haste do machado
      const hit = this.shieldPos(new THREE.Vector3()), n = this.shieldRoot.getWorldDirection(new THREE.Vector3());
      hit.addScaledVector(n, .12);
      this.flash(hit, C.steelHot, 1.3, .14);
      this.burst(hit, 22, 7, C.steelHot, C.ember, { up: .3, spread: 1.1, size: .14, life: .35 });
      this.flashLight(hit, C.steelHot, 4, .2, 5);
      this.shake = Math.max(this.shake, .14);
      return true;
    }
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
    this.bradoT = Math.max(0, this.bradoT - delta); this.despertarT = Math.max(0, this.despertarT - delta);
    if (this.curaZoneT > 0) { this.curaZoneT = Math.max(0, this.curaZoneT - delta); this.healSelf(5 * delta); }
    if (this.bencaoT > 0) { this.bencaoT = Math.max(0, this.bencaoT - delta); this.healSelf(3 * delta); }
    this.updateSantuario(delta); this.updateDespertarAura();
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
    keptPrograms.forEach(m => m.dispose()); keptPrograms.clear(); keeperRenderer = null;
    matPool.forEach(list => list.forEach(m => m.dispose())); matPool.clear();
    Object.values(this.geo).forEach(g => g.dispose()); Object.values(this.tex).forEach(t => t.dispose()); this.healTex.dispose(); this.starTex.forEach(t => t.dispose());
  }

  /* ---------------------------------------------------------------- *
   *  Building blocks
   * ---------------------------------------------------------------- */
  /** Cilindro aberto com eixo em +Z de 0 a 1 (escala Z = comprimento do raio). */
  private static beamGeometry() {
    const g = new THREE.CylinderGeometry(1, 1, 1, 28, 12, true); g.translate(0, .5, 0); g.rotateX(Math.PI / 2); return g;
  }
  private beamMaterial(color: THREE.Color, power: number, alpha: number, flow: number) {
    return pooled('beam', () => this.newBeamMaterial(color, power, alpha, flow), m => { const u = m.uniforms; u.uTime.value = 0; u.uLen.value = 1; u.uAlpha.value = alpha; u.uPower.value = power; u.uFlow.value = flow; u.uColor.value.copy(color); });
  }
  private newBeamMaterial(color: THREE.Color, power: number, alpha: number, flow: number) {
    return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, vertexShader: BEAM_VS, fragmentShader: BEAM_FS,
      uniforms: { uTime: { value: 0 }, uLen: { value: 1 }, uAlpha: { value: alpha }, uPower: { value: power }, uFlow: { value: flow }, uColor: { value: color.clone() } } });
  }
  /** axial=true para o cilindro do raio; false para orbes (esferas). */
  private voidMaterial(axial = false) {
    return pooled('void', () => this.newVoidMaterial(axial), m => { const u = m.uniforms; u.uTime.value = 0; u.uLen.value = 1; u.uAxial.value = axial ? 1 : 0; });
  }
  private newVoidMaterial(axial: boolean) {
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
    const tipGlow = new THREE.Sprite(this.pSprite('s778', { map: this.tex.glow, color: C.starB, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
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
      const hits = this.combat.damageSegment(origin, b.end, w + .3, b.tickDmg * this.progression.damageMultiplier() * this.progression.rollCrit(), .3 + b.level * .25, p => {
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
    return pooled(map ? 'basic-map' : 'basic', () => this.newBasic(color, opacity, map), m => { m.color.set(color); m.opacity = opacity; m.map = map; });
  }
  /** Sprite/material básico do pool: cada ponto de chamada tem seu tipo e é redefinido com os mesmos parâmetros. */
  private pSprite(kind: string, params: THREE.SpriteMaterialParameters) {
    return pooled(kind, () => new THREE.SpriteMaterial(params), m => m.setValues({ opacity: 1, rotation: 0, ...params }));
  }
  private pBasic(kind: string, params: THREE.MeshBasicMaterialParameters) {
    return pooled(kind, () => new THREE.MeshBasicMaterial(params), m => m.setValues({ opacity: 1, ...params }));
  }
  private newBasic(color: THREE.ColorRepresentation, opacity: number, map: THREE.Texture | null) {
    return new THREE.MeshBasicMaterial({ color, map, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false });
  }
  private lanceMaterial(a: THREE.Color, b: THREE.Color, gain: number) {
    return pooled('lance', () => this.newLanceMaterial(a, b, gain), m => { const u = m.uniforms; u.uTime.value = 0; u.uGain.value = gain; u.uA.value.copy(a); u.uB.value.copy(b); });
  }
  private newLanceMaterial(a: THREE.Color, b: THREE.Color, gain: number) {
    return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: LANCE_VS, fragmentShader: LANCE_FS, uniforms: { uTime: { value: 0 }, uGain: { value: gain }, uA: { value: a.clone() }, uB: { value: b.clone() } } });
  }
  private fresnelMaterial(color: THREE.Color, power: number, gain: number, alpha: number) {
    return pooled('fresnel', () => this.newFresnelMaterial(color, power, gain, alpha), m => { const u = m.uniforms; u.uColor.value.copy(color); u.uPower.value = power; u.uGain.value = gain; u.uAlpha.value = alpha; });
  }
  private newFresnelMaterial(color: THREE.Color, power: number, gain: number, alpha: number) {
    return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: FRESNEL_VS, fragmentShader: FRESNEL_FS, uniforms: { uColor: { value: color.clone() }, uPower: { value: power }, uGain: { value: gain }, uAlpha: { value: alpha } } });
  }
  private fireMaterial() {
    return pooled('fire', () => this.newFireMaterial(), m => { const u = m.uniforms; u.uT.value = 0; u.uTime.value = 0; u.uSeed.value = Math.random() * 40; });
  }
  private newFireMaterial() {
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
    const s = new THREE.Sprite(pooled('flash', () => new THREE.SpriteMaterial({ map: this.tex.glow, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }), m => { m.color.copy(color); m.opacity = 1; m.rotation = 0; }));
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
   *  Guerreiro e Clérigo
   *  Usam só os blocos já pré-compilados (flash, shock, dome, sigil, partículas e luzes do pool),
   *  então nenhuma habilidade nova causa compilação de shader no primeiro uso.
   * ---------------------------------------------------------------- */
  /** Explosão de partículas genérica (faíscas, poeira, motas de luz). */
  private burst(at: Vec3, count: number, speed: number, c0: THREE.Color, c1: THREE.Color, o: { up?: number; spread?: number; size?: number; life?: number; grav?: number; soft?: boolean } = {}) {
    const up = o.up ?? .4, spread = o.spread ?? 1, size = o.size ?? .22, life = o.life ?? .6, grav = o.grav ?? 4;
    const ps = o.soft ? this.soft : this.fx;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * TAU, h = rr(0, 1) * spread, sp = speed * rr(.4, 1);
      ps.emit(at.x, at.y, at.z, { vx: Math.cos(a) * h * sp, vy: (up + rr(0, .6)) * sp, vz: Math.sin(a) * h * sp, life: life * rr(.6, 1.2), s0: size * rr(.6, 1.2), s1: .02, c0, c1, kind: o.soft ? 0 : 1, drag: 2.2, grav });
    }
  }
  private groundAt(p: Vec3, out = new THREE.Vector3()) { return out.set(p.x, terrainHeight(p.x, p.z) + .05, p.z); }
  private flat(dir: Vec3) { const d = new THREE.Vector3(dir.x, 0, dir.z); return d.lengthSq() < 1e-6 ? d.set(Math.sin(this.player.rotation.y), 0, Math.cos(this.player.rotation.y)) : d.normalize(); }
  /**
   * Dano em área das técnicas novas: multiplicadores da árvore (mágico ou corpo a corpo), Brado, crítico e roubo de vida.
   * melee = golpe físico (usa o dano corpo a corpo em vez do mágico).
   */
  private hit(at: Vec3, radius: number, amount: number, melee = false) {
    const crit = this.progression.rollCrit();
    const dmg = amount * (melee ? this.progression.meleeMultiplier() : this.progression.damageMultiplier()) * this.buffDamage * crit;
    const n = this.combat.damageAt(at, radius * this.progression.sizeMultiplier(), dmg);
    if (n > 0) { this.onConfirmedHit(); this.drain(dmg * n); if (crit > 1) this.critFx(at); return true; }
    return false;
  }
  /** Roubo de vida: parte do dano causado volta como vida. */
  drain(damage: number) { const ls = this.progression.stats.lifesteal; if (ls > 0) this.combat.heal(damage * ls); }
  /** Cura escalada pelo poder de cura da árvore. */
  private healSelf(amount: number) { this.combat.heal(amount * this.progression.stats.heal); }
  /** Duração de bônus escalada pela árvore. */
  private buffSecs(base: number) { return base * this.progression.stats.buffTime; }
  /** Crítico: estrela dourada rápida no ponto do golpe. */
  critFx(at: Vec3) { const c = at.clone(); c.y += .4; this.flash(c, C.paleGold, 2.2, .18); this.burst(c, 12, 6, C.paleGold, C.goldDeep, { up: .4, size: .16, life: .35 }); this.onCrit(c); }
  /** Avisado a cada crítico (o jogo mostra um número/realce). */
  onCrit: (at: Vec3) => void = () => {};

  /** Golpe Brutal: corte pesado em arco à frente, com onda de faíscas de aço. */
  private golpeFx(direction: Vec3) {
    const d = this.flat(direction), p = this.player.position;
    const at = new THREE.Vector3(p.x + d.x * 1.7, p.y + 1.1, p.z + d.z * 1.7);
    this.hit(at, 1.8, 62, true);
    this.shock(this.groundAt(at), UP, C.steel, 2.2, .35);
    this.flash(at, C.steelHot, 2.4, .2);
    this.burst(at, 26, 7, C.steelHot, C.ember, { up: .2, spread: 1.2, size: .18, life: .4 });
    this.flashLight(at, C.steelHot, 4, .25, 6);
    this.addShake(at, .14); this.onSfx('swing');
  }

  /** Redemoinho: giro completo com a lâmina — dano em volta e anel de poeira. */
  private redemoinhoFx() {
    const p = this.player.position, c = new THREE.Vector3(p.x, p.y + 1, p.z), g = this.groundAt(p);
    this.hit(c, 3.3, 78, true);
    this.shock(g, UP, C.steel, 3.8, .45); this.shock(g, UP, C.ember, 2.6, .35);
    this.burst(g, 46, 6, C.dust, C.dustB, { up: .25, spread: 1.4, size: .55, life: .9, grav: 1, soft: true });
    this.burst(c, 30, 9, C.steelHot, C.ember, { up: .1, spread: 1.3, size: .16, life: .45 });
    this.flashLight(c, C.steelHot, 5, .3, 8);
    this.addShake(c, .28); this.onSfx('swing');
  }

  /* ---------------- Multijogador: efeitos de outros jogadores e do grupo ---------------- */
  /**
   * Efeito visual de uma habilidade lançada por outro jogador (sem dano: o dano já foi resolvido na máquina dele
   * e no host). Projéteis viram um rastro de luz até o alvo; habilidades em si mesmo, um selo e um clarão.
   */
  remoteFx(spell: SpellId, origin: Vec3, dir: Vec3, target: Vec3) {
    const color: THREE.Color =
      spell === 'vollzanbel' || spell === 'brado' || spell === 'fenda' ? C.fire
        : spell === 'judradjim' ? C.bolt
          : spell === 'zoltraak' || spell === 'chuvaEstelar' || spell === 'passoArcano' ? C.starB
            : spell === 'shield' ? C.barrier
              : spell === 'flight' || spell === 'bencao' ? C.mana
                : spell === 'cura' || spell === 'curaEquipe' ? C.heal
                  : spell === 'golpe' || spell === 'redemoinho' || spell === 'investida' || spell === 'agarrao' ? C.steelHot
                    : C.gold;
    const ranged = ['zoltraak', 'vollzanbel', 'judradjim', 'tresLancas', 'lancaSagrada', 'chuvaEstelar', 'julgamento'].includes(spell);
    if (ranged) {
      const end = target.distanceTo(origin) > 40 ? origin.clone().addScaledVector(dir, 40) : target.clone();
      const n = Math.max(8, Math.round(origin.distanceTo(end) * 1.5));
      for (let i = 0; i <= n; i++) { const f = i / n; this.fx.emit(origin.x + (end.x - origin.x) * f, origin.y + (end.y - origin.y) * f, origin.z + (end.z - origin.z) * f, { vx: rr(-.3, .3), vy: rr(0, .4), vz: rr(-.3, .3), life: .25 + f * .35, s0: .28, s1: .02, c0: C.paleGold, c1: color, kind: 1, drag: 2 }); }
      this.flash(origin, color, 1.4, .2);
      this.flash(end, color, 3, .3); this.dome(end, color, 1.6, .35, 2.6); this.shock(this.groundAt(end), UP, color, 2.4, .4);
      this.burst(end, 22, 6, C.paleGold, color, { up: .6, size: .2, life: .5 });
    } else {
      const g = this.groundAt(origin), c = origin.clone();
      this.sigil(g, UP, spell === 'flight' ? 'wind' : spell === 'shield' ? 'rune' : 'sun', color, 1.8, .9, { spin: 1.6, grow: .2 });
      this.flash(c, color, 2.2, .3); this.dome(c, color, 1.6, .45, 2.4);
      this.burst(c, 24, 4, C.paleGold, color, { up: .8, size: .2, life: .7, grav: -1 });
    }
  }
  /** Cura recebida de um aliado do grupo (Cura em Grupo de outro clérigo): fração da vida + cura contínua. */
  allyHeal(fraction: number, hotSecs: number) {
    this.combat.heal(this.combat.maxHealth * fraction);
    this.curaZoneT = Math.max(this.curaZoneT, hotSecs);
    const p = this.player.position;
    this.healSeal(this.groundAt(p).setY(this.groundAt(p).y + .04), UP, 1.1, 1.2);
    this.burst(this.groundAt(p), 26, 2.2, C.healHot, C.heal, { up: 1.4, spread: .7, size: .18, life: 1.2, grav: -1.5 });
    this.onSfx('cast');
  }
  /** Despertar recebido de um aliado: remove efeitos negativos e dá o mesmo bônus por alguns segundos. */
  allyDespertar(secs: number) {
    this.despertarT = Math.max(this.despertarT, secs); this.onCleanse();
    const p = this.player.position, c = new THREE.Vector3(p.x, p.y + 1.2, p.z);
    this.dome(c, C.gold, 2.2, .6, 2); this.flash(c, C.paleGold, 2.4, .3);
    this.burst(c, 30, 3.5, C.paleGold, C.goldDeep, { up: 1, size: .2, life: 1, grav: -1.5 });
    this.onSfx('chargeFull');
  }
  /** Raio da Cura em Grupo (para o jogo saber quem do grupo está dentro). */
  get curaEquipeRadius() { return 4.2 * this.progression.sizeMultiplier(); }
  get despertarSecs() { return this.buffSecs(5); }

  /* ---------------- Habilidades da árvore (teclas 3 e 4) ---------------- */
  /** Chuva Estelar (maga): selo no alvo e 8 estrelas caindo em sequência dentro da área. */
  private chuvaEstelarFx(origin: Vec3, direction: Vec3, target: Vec3) {
    const reach = Math.min(28, origin.distanceTo(target)), s = this.progression.sizeMultiplier();
    const center = this.groundAt(origin.clone().addScaledVector(direction, reach)), R = 3.6 * s;
    this.sigil(center, UP, 'arc', C.starB, R * 1.1, 2.2, { spin: .8, grow: .05, hold: .8 });
    this.onSfx('lightCharge');
    let next = 0, t = 0;
    this.addEffect(new THREE.Object3D(), 2.2, (_u, dt) => {
      t += dt;
      while (next < 8 && t >= .35 + next * .2) {
        next++;
        const a = Math.random() * TAU, r = Math.sqrt(Math.random()) * R * .85;
        const hitAt = this.groundAt(this.tB.set(center.x + Math.cos(a) * r, 0, center.z + Math.sin(a) * r));
        const sky = hitAt.clone().add(this.tC.set(rr(-2, 2), 9, rr(-2, 2)));
        // rastro: faíscas descendo do céu até o ponto
        for (let k = 0; k < 10; k++) { const f = k / 10; this.fx.emit(sky.x + (hitAt.x - sky.x) * f, sky.y + (hitAt.y - sky.y) * f, sky.z + (hitAt.z - sky.z) * f, { life: .25 + f * .15, s0: .5 * (1 - f * .5), s1: .02, c0: C.starW, c1: C.starV, kind: 1 }); }
        const mid = hitAt.clone(); mid.y += .8;
        this.flash(mid, C.starW, 2.4, .25); this.dome(mid, C.starB, 1.5 * s, .35, 2.6); this.shock(hitAt, UP, C.starV, 2.2 * s, .4);
        this.burst(mid, 18, 6, C.starW, C.starV, { up: .7, size: .2, life: .5 });
        this.hit(mid, 1.6, 34);
        if (next % 2) this.flashLight(mid, C.starB, 5, .3, 7);
        this.addShake(mid, .12); this.onSfx('lightning', .35);
      }
    });
  }
  /** Passo Arcano (maga): o jogo teletransporta; aqui o rastro de partida e chegada. */
  blinkFx(from: Vec3, to: Vec3) {
    for (const [p, big] of [[from, false], [to, true]] as const) {
      const g = this.groundAt(p), c = g.clone(); c.y += 1.1;
      this.sigil(g, UP, 'rune', C.starB, big ? 1.6 : 1.2, .7, { spin: 3, grow: .3 });
      this.flash(c, C.starW, big ? 2.6 : 1.8, .25); this.dome(c, C.starV, big ? 1.6 : 1.1, .3, 3);
      this.burst(c, 22, 4, C.starW, C.starV, { up: .5, spread: 1, size: .18, life: .5, grav: -1 });
    }
    // fio de luz entre os dois pontos
    const n = Math.max(6, Math.round(from.distanceTo(to) * 3));
    for (let i = 0; i <= n; i++) { const f = i / n; this.fx.emit(from.x + (to.x - from.x) * f, from.y + 1.1 + (to.y - from.y) * f, from.z + (to.z - from.z) * f, { vx: rr(-.3, .3), vy: rr(0, .5), vz: rr(-.3, .3), life: rr(.3, .6), s0: .22, s1: .02, c0: C.starW, c1: C.starV, kind: 1, drag: 2 }); }
    this.flashLight(to.clone().setY(to.y + 1), C.starB, 5, .3, 7);
    this.onSfx('dodge');
  }
  /** Fenda Sísmica (guerreiro): erupções de terra em linha à frente, uma após a outra. */
  private fendaFx(direction: Vec3) {
    const d = this.flat(direction), start = this.player.position.clone(), s = this.progression.sizeMultiplier();
    this.shock(this.groundAt(start), UP, C.ember, 2.2, .35); this.addShake(start, .25);
    this.onSfx('fireBoom', .4);
    let next = 0, t = 0;
    this.addEffect(new THREE.Object3D(), 1, (_u, dt) => {
      t += dt;
      while (next < 8 && t >= next * .07) {
        next++;
        const g = this.groundAt(this.tB.copy(start).addScaledVector(d, 1.2 + next * 1.25)), mid = g.clone(); mid.y += .7;
        this.shock(g, UP, C.ember, 1.6 * s, .35); this.flash(mid, C.fire, 1.5, .2);
        this.burst(g, 16, 5, C.dust, C.dustB, { up: 1.1, spread: .6, size: .5, life: .9, grav: 2, soft: true });
        for (let k = 0; k < 6; k++) this.soft.emit(g.x, g.y + .1, g.z, { vx: rr(-2, 2), vy: rr(4, 7.5), vz: rr(-2, 2), life: rr(.6, 1), s0: rr(.15, .28), s1: .12, c0: C.debris, kind: 2, a: 1, drag: .4, grav: 14, rotV: rr(-9, 9) });
        // marca da fenda no chão
        const mat = this.scorch(), m = new THREE.Mesh(this.geo.plane, mat); m.position.copy(g); m.position.y += .03; m.rotation.set(-Math.PI / 2, 0, Math.atan2(d.x, d.z)); m.scale.set(.35, .7, 1);
        this.addEffect(m, 3, u => { mat.opacity = .6 * (1 - u * u); });
        this.hit(mid, 1.5, 34, true);
        if (next === 4) this.flashLight(mid, C.fire, 5, .35, 8);
        this.addShake(mid, .1);
      }
    });
  }
  /** Lança Sagrada (clérigo): feixe de luz em linha reta que atravessa todos à frente. */
  private lancaSagradaFx(origin: Vec3, direction: Vec3) {
    const d = direction.clone().normalize(), len = 16, end = origin.clone().addScaledVector(d, len);
    const crit = this.progression.rollCrit(), dmg = 58 * this.progression.damageMultiplier() * this.buffDamage * crit;
    const n = this.combat.damageSegment(origin, end, .9, dmg, .8, p => { this.flash(p, C.paleGold, 1.6, .2); if (crit > 1) this.critFx(p); });
    if (n > 0) { this.onConfirmedHit(); this.drain(dmg * n); }
    for (let i = 0; i <= 14; i++) {
      const f = i / 14, p = this.tB.copy(origin).addScaledVector(d, len * f);
      this.flash(p, i % 3 ? C.gold : C.paleGold, .9 - f * .3, .22 + f * .12);
      this.fx.emit(p.x, p.y, p.z, { vx: rr(-.6, .6), vy: rr(.2, 1.4), vz: rr(-.6, .6), life: rr(.4, .8), s0: .2, s1: .02, c0: C.paleGold, c1: C.goldDeep, kind: 1, drag: 1.5, grav: -1 });
    }
    this.sigil(origin, d, 'sun', C.gold, .9, .45, { spin: 3 });
    this.shock(end, d.clone().negate(), C.gold, 1.6, .35);
    this.flashLight(origin, C.gold, 5, .3, 8);
    this.onSfx('lightning', .5);
  }
  /** Santuário (clérigo): domo sagrado no chão — dentro dele: −35% de dano recebido e cura contínua. */
  private santuario: { center: THREE.Vector3; R: number; t: number; life: number; tick: number; dome: THREE.Mesh; mat: THREE.ShaderMaterial } | null = null;
  get insideSantuario() { const s = this.santuario; if (!s) return false; const p = this.player.position; return Math.hypot(p.x - s.center.x, p.z - s.center.z) < s.R; }
  private santuarioFx() {
    if (this.santuario) this.santuario.t = this.santuario.life; // um novo substitui o anterior
    const center = this.groundAt(this.player.position), R = 4.6 * this.progression.sizeMultiplier(), life = this.buffSecs(7);
    this.sigil(center, UP, 'sun', C.gold, R, life, { spin: .35, grow: 0, hold: .9 });
    this.sigil(center, UP, 'rune', C.mana, R * .6, life, { spin: -.6, grow: 0, hold: .9 });
    const mat = this.fresnelMaterial(C.paleGold, 2.2, .9, .5), dome = new THREE.Mesh(this.geo.sphere, mat);
    dome.position.copy(center); dome.scale.set(R, R * .7, R);
    this.addEffect(dome, life, u => { mat.uniforms.uAlpha.value = Math.min(1, u * life / .3) * (u > .9 ? (1 - u) / .1 : 1) * .45; });
    this.santuario = { center, R, t: 0, life, tick: 0, dome, mat };
    this.shock(center, UP, C.paleGold, R * 1.2, .5); this.flashLight(center.clone().setY(center.y + 1.5), C.gold, 6, .6, 10);
    this.burst(center, 40, 3, C.paleGold, C.mana, { up: 1.4, spread: 1.2, size: .22, life: 1.4, grav: -1.5 });
    this.onSfx('shieldUp');
  }
  private updateSantuario(delta: number) {
    const s = this.santuario; if (!s) return;
    s.t += delta; if (s.t >= s.life) { this.santuario = null; return; }
    if (Math.random() < delta * 20) { const a = Math.random() * TAU, r = Math.sqrt(Math.random()) * s.R; this.fx.emit(s.center.x + Math.cos(a) * r, s.center.y + .1, s.center.z + Math.sin(a) * r, { vy: rr(.8, 2), life: rr(.8, 1.4), s0: rr(.12, .2), s1: .02, c0: C.paleGold, c1: C.mana, kind: 1, drag: 1, grav: -.4 }); }
    if (this.insideSantuario) this.healSelf(4 * delta);
  }

  /* ---------------- Agarrão (guerreiro): avanço, captura, arrasto no chão e pancada final ---------------- */
  /** Arrancada: poeira levantando atrás e um anel de impulso no chão. */
  private grabLungeFx(direction: Vec3) {
    const d = this.flat(direction), p = this.player.position, g = this.groundAt(p);
    this.burst(g.clone().addScaledVector(d, -.4), 26, 4.5, C.dust, C.dustB, { up: .35, spread: 1.1, size: .5, life: .8, grav: 1, soft: true });
    this.shock(g, UP, C.steel, 1.8, .3);
    this.onSfx('dodge');
  }
  /** Captura: clarão de impacto, faíscas e onda de choque onde a mão encontra o inimigo. */
  grabCatchFx(at: Vec3) {
    const c = at.clone(); c.y += 1;
    this.flash(c, C.steelHot, 3.2, .22); this.flash(c, C.fire, 1.8, .3);
    this.dome(c, C.fireHot, 1.7, .3, 3);
    this.burst(c, 40, 9, C.steelHot, C.ember, { up: .25, spread: 1.4, size: .2, life: .45 });
    this.shock(this.groundAt(at), UP, C.fire, 3, .4);
    this.flashLight(c, C.fireHot, 7, .35, 8);
    this.shake = Math.max(this.shake, .35); this.onSfx('swing');
  }
  private dragAcc = 0; private gashAcc = 0;
  /** Marca escura no chão (mistura normal: o aditivo não escurece). Mesmo programa do material básico, sem recompilar. */
  private scorch() { return this.pBasic('scorch', { color: C.smokeB, map: this.tex.glow, transparent: true, opacity: .7, depthWrite: false, side: THREE.DoubleSide, blending: THREE.NormalBlending, toneMapped: false }); }
  /**
   * Arrasto (chamar todo quadro): o corpo do inimigo rasga o chão — sulco de terra escura, torrões e
   * poeira voando para os lados, faíscas onde raspa e tremor contínuo da câmera.
   */
  dragFx(at: Vec3, direction: Vec3, dt: number, speed: number) {
    const d = this.flat(direction), g = this.groundAt(at), side = this.tA.set(d.z, 0, -d.x);
    this.dragAcc += dt * 60 * Math.min(1, speed / 6); this.gashAcc += dt;
    let n = 0;
    while (this.dragAcc >= 1 && n++ < 6) {
      this.dragAcc -= 1;
      const s = Math.random() < .5 ? -1 : 1, o = rr(.2, .55) * s;
      // poeira em leque para os dois lados
      this.soft.emit(g.x + side.x * o, g.y + .1, g.z + side.z * o, { vx: side.x * s * rr(1.5, 4) - d.x * rr(.5, 2), vy: rr(.8, 2.6), vz: side.z * s * rr(1.5, 4) - d.z * rr(.5, 2), life: rr(.7, 1.4), s0: rr(.35, .6), s1: rr(.9, 1.4), c0: C.dust, c1: C.dustB, kind: 0, a: .75, drag: 2.2, grav: .6 });
      // torrões de terra
      if (Math.random() < .5) this.soft.emit(g.x, g.y + .15, g.z, { vx: side.x * s * rr(2, 5) + d.x * rr(-1, 2), vy: rr(2.5, 5), vz: side.z * s * rr(2, 5) + d.z * rr(-1, 2), life: rr(.6, 1), s0: rr(.12, .2), s1: .1, c0: C.debris, kind: 2, a: 1, drag: .6, grav: 9, rotV: rr(-9, 9) });
      // faíscas onde raspa
      if (Math.random() < .35) this.fx.emit(g.x, g.y + .2, g.z, { vx: -d.x * rr(3, 7) + side.x * rr(-2, 2), vy: rr(1, 3.5), vz: -d.z * rr(3, 7) + side.z * rr(-2, 2), life: rr(.25, .5), s0: rr(.1, .18), s1: .02, c0: C.steelHot, c1: C.ember, kind: 1, drag: 1.5, grav: 6 });
    }
    // sulco: marcas escuras deixadas no chão a cada trecho
    if (this.gashAcc > .07) {
      this.gashAcc = 0;
      const mat = this.scorch(), m = new THREE.Mesh(this.geo.plane, mat);
      m.position.copy(g); m.position.y += .03; m.rotation.set(-Math.PI / 2, 0, Math.atan2(d.x, d.z));
      m.scale.set(rr(.42, .55), .45, 1);
      this.addEffect(m, 3.5, t => { mat.opacity = .55 * (1 - t * t); });
    }
    this.shake = Math.max(this.shake, .1);
  }
  /** Pancada final: o inimigo é cravado no chão — cratera, anel de choque, coluna de poeira e detritos. */
  slamFx(at: Vec3) {
    const g = this.groundAt(at), c = g.clone(); c.y += .6;
    this.flash(c, C.steelHot, 4.5, .25); this.flash(c, C.fire, 3, .35);
    this.dome(c, C.fireHot, 3.2, .45, 2.2); this.dome(c, C.dust, 4.2, .7, 1.4);
    this.shock(g, UP, C.fire, 6, .55); this.shock(g, UP, C.steel, 4, .4);
    this.sigil(g, UP, 'sun', C.ember, 2.4, .9, { spin: .4, grow: .4 });
    this.burst(g, 60, 7, C.dust, C.dustB, { up: .6, spread: 1.6, size: .7, life: 1.3, grav: 1.2, soft: true });
    for (let i = 0; i < 26; i++) this.soft.emit(g.x, g.y + .2, g.z, { vx: rr(-6, 6), vy: rr(4, 9), vz: rr(-6, 6), life: rr(.8, 1.4), s0: rr(.14, .26), s1: .12, c0: C.debris, kind: 2, a: 1, drag: .4, grav: 14, rotV: rr(-10, 10) });
    this.burst(c, 40, 10, C.steelHot, C.ember, { up: .5, spread: 1.5, size: .2, life: .5 });
    // cratera escura que some aos poucos
    const mat = this.scorch(), crater = new THREE.Mesh(this.geo.plane, mat);
    crater.position.copy(g); crater.position.y += .035; crater.rotation.x = -Math.PI / 2;
    this.addEffect(crater, 5, t => { crater.scale.setScalar(Math.min(1, t * 20) * 1.4); mat.opacity = .7 * (1 - t * t); });
    this.flashLight(c, C.fireHot, 10, .5, 12);
    this.shake = Math.max(this.shake, .6); this.onSfx('fireBoom', .7);
  }

  /** Investida: o Game projeta o corpo à frente; aqui o rastro de impacto ao longo do caminho. */
  private investidaFx(direction: Vec3) {
    const d = this.flat(direction), p = this.player.position;
    const a = new THREE.Vector3(p.x, p.y + 1, p.z), b = a.clone().addScaledVector(d, 7);
    { const dmg = 52 * this.progression.meleeMultiplier() * this.buffDamage * this.progression.rollCrit(), n = this.combat.damageSegment(a, b, 1.3, dmg, .9); if (n > 0) { this.onConfirmedHit(); this.drain(dmg * n); } }
    this.burst(this.groundAt(p), 34, 5, C.dust, C.dustB, { up: .3, spread: 1, size: .5, life: .8, grav: 1, soft: true });
    this.flash(a, C.steelHot, 1.8, .2);
    this.addEffect(new THREE.Object3D(), .3, (t, dt) => { // poeira acompanha o avanço
      if (Math.random() < dt * 40) this.burst(this.groundAt(this.player.position), 3, 3, C.dust, C.dustB, { up: .3, size: .45, life: .7, grav: 1, soft: true });
      if (t >= 1) this.shock(this.groundAt(this.player.position), UP, C.steel, 2.4, .3);
    });
    this.addShake(a, .18);
  }

  /** Brado de Guerra: aura de fúria — +35% de dano, −25% de dano recebido e um pouco de vida. */
  private bradoFx() {
    this.bradoT = this.buffSecs(8); this.healSelf(20);
    const p = this.player.position, c = new THREE.Vector3(p.x, p.y + 1.2, p.z), g = this.groundAt(p);
    this.dome(c, C.ember, 3.4, .6, 1.8); this.shock(g, UP, C.fire, 4.5, .55);
    this.sigil(g, UP, 'sun', C.fire, 2.2, 1.2, { spin: 2.4 });
    this.burst(c, 40, 5, C.fireHot, C.ember, { up: .8, spread: 1, size: .2, life: .8, grav: -1 });
    this.flashLight(c, C.fire, 6, .6, 9);
    this.addShake(c, .22); this.onSfx('cast');
  }

  /** Julgamento: selo dourado no chão do alvo e, logo depois, uma coluna de luz que cai do céu. */
  private julgamentoFx(origin: Vec3, direction: Vec3, target: Vec3) {
    const reach = Math.min(26, origin.distanceTo(target));
    const spot = this.groundAt(origin.clone().addScaledVector(direction, reach));
    const s = this.progression.sizeMultiplier();
    this.sigil(spot, UP, 'sun', C.gold, 1.6 * s, .9, { spin: 2, hold: .5 });
    this.flash(origin, C.paleGold, .8, .2);
    let fired = false;
    this.addEffect(new THREE.Object3D(), .32, t => {
      if (fired || t < 1) return; fired = true;
      const mid = spot.clone(); mid.y += 1;
      this.hit(mid, 2.1, 64);
      for (let i = 0; i < 4; i++) this.flash(mid.clone().setY(spot.y + .6 + i * 1.6), i ? C.gold : C.paleGold, 2.6 - i * .35, .35 + i * .05);
      this.dome(mid, C.gold, 2.4 * s, .45); this.shock(spot, UP, C.paleGold, 3 * s, .4);
      this.burst(mid, 30, 6, C.paleGold, C.goldDeep, { up: .9, spread: .9, size: .2, life: .7, grav: -2 });
      this.flashLight(mid, C.gold, 7, .4, 9);
      this.addShake(mid, .16); this.onSfx('lightning', .6);
    });
  }

  /**
   * Selo verde da mão (Magia de Cura): disco luminoso com a mão aberta, de frente, com anel externo pulsando e
   * motas verdes. pos = centro; normal = para onde o disco olha.
   */
  private healSeal(pos: Vec3, normal: Vec3, radius: number, life: number) {
    const g = new THREE.Group(); g.position.copy(pos); g.quaternion.setFromUnitVectors(FWD, normal);
    const disc = new THREE.Mesh(this.geo.plane, this.basic(C.heal, 0, this.healTex));
    const ring = new THREE.Mesh(this.geo.ring, this.basic(C.heal, 0)), ring2 = new THREE.Mesh(this.geo.ring, this.basic(C.healHot, 0));
    const glow = new THREE.Sprite(this.pSprite('heal-glow', { map: this.tex.glow, color: C.heal, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    ring.position.z = -.02; ring2.position.z = -.03; g.add(glow, ring, ring2, disc);
    this.addEffect(g, life, t => {
      const tt = t * life, appear = easeOutBack(clamp01(tt / .22)), fade = t > .75 ? 1 - (t - .75) / .25 : 1;
      disc.scale.setScalar(Math.max(.001, radius * appear)); disc.rotation.z = Math.sin(tt * 2) * .08;
      (disc.material as THREE.MeshBasicMaterial).opacity = fade;
      // anel externo: abre além do disco e "respira"
      ring.scale.setScalar(Math.max(.001, radius * (1.25 + .5 * easeOutCubic(clamp01(tt / .5))) * (1 + Math.sin(tt * 6) * .03)));
      (ring.material as THREE.MeshBasicMaterial).opacity = .45 * fade;
      const pulse = (tt * 1.6) % 1; ring2.scale.setScalar(Math.max(.001, radius * (1 + pulse * 1.2)));
      (ring2.material as THREE.MeshBasicMaterial).opacity = (1 - pulse) * .5 * fade;
      glow.scale.setScalar(radius * 3.2 * appear); (glow.material as THREE.SpriteMaterial).opacity = .5 * fade;
      if (Math.random() < .5) { // motas verdes saindo do selo
        const a = Math.random() * TAU, r = radius * rr(.4, 1.3), p = this.tA.set(Math.cos(a) * r, Math.sin(a) * r, 0).applyQuaternion(g.quaternion).add(g.position);
        this.fx.emit(p.x, p.y, p.z, { vx: normal.x * rr(.2, .8), vy: rr(.3, 1.2), vz: normal.z * rr(.2, .8), life: rr(.5, 1), s0: rr(.08, .16), s1: .02, c0: C.healHot, c1: C.heal, kind: 1, drag: 1.2, grav: -.6 });
      }
    });
  }
  /** Magia de Cura: selo verde da mão aberto à frente, cura 35% da vida. */
  private curaFx() {
    this.healSelf(this.combat.maxHealth * .35);
    const p = this.player.position, yaw = this.player.rotation.y, f = this.tB.set(Math.sin(yaw), 0, Math.cos(yaw));
    const side = this.tC.set(f.z, 0, -f.x); // à esquerda do corpo (mão livre)
    const at = new THREE.Vector3(p.x + f.x * .85 - side.x * .25, p.y + 1.25, p.z + f.z * .85 - side.z * .25);
    this.healSeal(at, f.clone(), .55, 1.3);
    const c = new THREE.Vector3(p.x, p.y + 1.1, p.z);
    this.dome(c, C.heal, 1.5, .55, 3);
    this.burst(this.groundAt(p), 30, 2.2, C.healHot, C.heal, { up: 1.4, spread: .7, size: .18, life: 1.3, grav: -1.5 });
    this.flashLight(at, C.heal, 4, .8, 6);
    this.onSfx('cast');
  }
  /** Magia de Cura (equipe): grande selo verde no chão — cura todos dentro (25% na hora + 5 de vida/s por 6 s). */
  private curaEquipeFx() {
    const p = this.player.position, g = this.groundAt(p), R = 4.2 * this.progression.sizeMultiplier();
    this.healSelf(this.combat.maxHealth * .25); this.curaZoneT = this.buffSecs(6);
    this.healSeal(g.clone().setY(g.y + .04), UP, R * .55, 2.4);
    this.sigil(g, UP, 'rune', C.heal, R, 2.4, { spin: .6, grow: .05, hold: .7 });
    this.shock(g, UP, C.healHot, R * 1.25, .6);
    // colunas de luz verde subindo em volta do círculo
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU, x = g.x + Math.cos(a) * R * .9, z = g.z + Math.sin(a) * R * .9;
      for (let k = 0; k < 6; k++) this.fx.emit(x, g.y + .1 + k * .25, z, { vy: rr(1.5, 3), life: rr(.6, 1.1), s0: .22 - k * .02, s1: .02, c0: C.healHot, c1: C.heal, kind: 1, drag: 1, grav: -1 });
    }
    this.dome(g.clone().setY(g.y + .5), C.heal, R * 1.05, .8, 1.8);
    this.flashLight(g.clone().setY(g.y + 1.5), C.heal, 7, .9, 10);
    this.onSfx('shieldUp');
  }
  /**
   * Três Lanças da Deusa: o livro brilha e três lanças de luz dourada partem em leque, convergem no alvo e
   * explodem em raios (atravessam quem estiver no caminho).
   */
  private tresLancasFx(origin: Vec3, direction: Vec3, target: Vec3) {
    // alcance máximo 22 m (antes 30): mirando além disso, as lanças se desfazem no ar no fim do alcance
    const dir = direction.clone().normalize(), dist = Math.min(TRES_LANCAS.range, Math.max(3, origin.distanceTo(target)));
    const end = origin.clone().addScaledVector(dir, dist), side = new THREE.Vector3(dir.z, 0, -dir.x).normalize();
    // livro: clarão em estrela dourada
    const star = new THREE.Sprite(this.pSprite('book-star', { map: this.starTex[0], color: C.paleGold, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    star.position.copy(origin);
    this.addEffect(star, .35, t => { star.scale.setScalar(.4 + 1.6 * easeOutCubic(t)); (star.material as THREE.SpriteMaterial).opacity = (1 - t) * (1 - t); star.material.rotation = t * 1.5; });
    this.flashLight(origin, C.gold, 5, .3, 6);
    this.onSfx('cast');
    for (let i = 0; i < 3; i++) {
      const lane = i - 1, delay = i * .09, travel = dist / 34;
      // cada lança nasce acima/ao lado do livro e faz uma curva até o alvo
      const start = origin.clone().addScaledVector(side, lane * .9).addScaledVector(UP, .45 + (lane === 0 ? .35 : 0)).addScaledVector(dir, -.3);
      // leque mais fechado (antes ±1,4 m no meio do voo e ±0,35 m no alvo) para as três convergirem no mesmo ponto
      const ctrl = start.clone().lerp(end, .35).addScaledVector(side, lane * .9).addScaledVector(UP, .45);
      const curve = new THREE.QuadraticBezierCurve3(start, ctrl, end.clone().addScaledVector(side, lane * .12));
      const g = new THREE.Group(); g.visible = false;
      const core = new THREE.Mesh(this.geo.lance, this.lanceMaterial(C.paleGold, C.gold, 1.2)), shell = new THREE.Mesh(this.geo.lance, this.lanceMaterial(C.gold, C.goldDeep, .5));
      shell.scale.set(2, 2, 1.1); g.add(shell, core); g.scale.set(.75, .75, 1.1);
      const times = [(core.material as THREE.ShaderMaterial).uniforms.uTime, (shell.material as THREE.ShaderMaterial).uniforms.uTime];
      const prev = start.clone(); let landed = false;
      this.addEffect(g, delay + travel + .05, (t, dt) => {
        const tt = t * (delay + travel + .05) - delay; if (tt < 0) return;
        const u = Math.min(1, tt / travel); g.visible = u < 1;
        const pos = curve.getPoint(u), tan = curve.getTangent(Math.min(.999, u));
        g.position.copy(pos); g.quaternion.setFromUnitVectors(FWD, tan);
        times.forEach(tm => { tm.value += dt; });
        // rastro de faíscas douradas
        for (let k = 0; k < 3; k++) { const f = k / 3; this.fx.emit(prev.x + (pos.x - prev.x) * f, prev.y + (pos.y - prev.y) * f, prev.z + (pos.z - prev.z) * f, { vx: rr(-.4, .4), vy: rr(-.2, .5), vz: rr(-.4, .4), life: rr(.2, .4), s0: .2, s1: .02, c0: C.paleGold, c1: C.goldDeep, kind: 1, drag: 2 }); }
        if (landed) return;
        // hitbox: a lança para no primeiro inimigo que tocar no trecho percorrido neste quadro e explode ali
        // (antes atravessava e feria a cada quadro — o mesmo alvo levava dano várias vezes)
        const hitAt = this.combat.firstHitOnSegment(prev, pos, TRES_LANCAS.hitbox, this.tC);
        if (hitAt) { landed = true; g.visible = false; this.lanceImpact(hitAt.clone(), tan); return; }
        prev.copy(pos);
        if (u >= 1) { landed = true; this.lanceImpact(pos, tan); }
      });
    }
  }
  /** Impacto de cada lança: estrela de luz, raios dourados disparando para todos os lados e anel. */
  private lanceImpact(at: Vec3, tan: Vec3) {
    const s = this.progression.sizeMultiplier();
    this.hit(at, TRES_LANCAS.blast, TRES_LANCAS.damage);
    this.flash(at, C.paleGold, 3.2 * s, .25); this.dome(at, C.gold, 1.3 * s, .3, 3);
    const star = new THREE.Sprite(this.pSprite('book-star', { map: this.starTex[1], color: C.paleGold, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    star.position.copy(at);
    this.addEffect(star, .3, t => { star.scale.setScalar((1 + 3 * easeOutCubic(t)) * s); (star.material as THREE.SpriteMaterial).opacity = 1 - t; star.material.rotation = -t; });
    // raios: faíscas longas e rápidas em leque (como os fios de luz da referência)
    for (let i = 0; i < 26; i++) {
      const v = this.tA.set(rr(-1, 1), rr(-.3, 1), rr(-1, 1)).normalize().addScaledVector(tan, -.4).normalize(), sp = rr(9, 18);
      for (let k = 0; k < 4; k++) this.fx.emit(at.x - v.x * k * .12, at.y - v.y * k * .12, at.z - v.z * k * .12, { vx: v.x * sp, vy: v.y * sp, vz: v.z * sp, life: rr(.25, .5) * (1 - k * .15), s0: .2 * (1 - k * .2), s1: .02, c0: C.paleGold, c1: C.gold, kind: 1, drag: 3.2, grav: .8 });
    }
    this.shock(this.groundAt(at), UP, C.gold, 2.2 * s, .35);
    this.flashLight(at, C.gold, 6, .3, 8); this.addShake(at, .1);
    this.onSfx('lightning', .4);
  }
  /**
   * Despertar: o livro explode em luz dourada — remove efeitos negativos e dá bônus por 5 s
   * (+25% de dano, −20% de dano recebido, +20% de velocidade).
   */
  private despertarFx(origin: Vec3) {
    this.despertarT = this.buffSecs(5); this.onCleanse();
    const p = this.player.position, c = new THREE.Vector3(p.x, p.y + 1.2, p.z), g = this.groundAt(p);
    const star = new THREE.Sprite(this.pSprite('book-star', { map: this.starTex[2], color: C.paleGold, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    star.position.copy(origin);
    this.addEffect(star, .7, t => { star.scale.setScalar(.6 + 4.5 * easeOutCubic(t)); (star.material as THREE.SpriteMaterial).opacity = (1 - t) * (1 - t); star.material.rotation = t * .8; });
    this.flash(origin, C.paleGold, 3.5, .35);
    this.dome(c, C.gold, 3, .7, 2); this.shock(g, UP, C.paleGold, 4.5, .6);
    this.sigil(g, UP, 'sun', C.gold, 2.2, 1.4, { spin: 2, grow: .2 });
    this.burst(c, 50, 4, C.paleGold, C.goldDeep, { up: 1, spread: 1.2, size: .22, life: 1.2, grav: -1.5 });
    this.flashLight(c, C.gold, 8, .7, 10);
    this.addShake(c, .15); this.onSfx('chargeFull');
  }
  /** Aura do Despertar enquanto dura: motas douradas subindo em volta do corpo. */
  private updateDespertarAura() {
    if (this.despertarT <= 0 || Math.random() > .5) return;
    const p = this.player.position, a = Math.random() * TAU, r = rr(.3, .7);
    this.fx.emit(p.x + Math.cos(a) * r, p.y + rr(.1, 1.6), p.z + Math.sin(a) * r, { vy: rr(.6, 1.6), life: rr(.5, .9), s0: rr(.1, .18), s1: .02, c0: C.paleGold, c1: C.goldDeep, kind: 1, drag: 1, grav: -.5 });
  }

  /** Consagração: o chão em volta vira solo sagrado por 6 s — fere inimigos e cura o clérigo dentro dele. */
  private consagracaoFx() {
    const center = this.groundAt(this.player.position), R = 4.2 * this.progression.sizeMultiplier(), life = this.buffSecs(6);
    this.sigil(center, UP, 'sun', C.gold, R, life, { spin: .5, grow: 0, hold: .85 });
    this.shock(center, UP, C.paleGold, R * 1.1, .5);
    this.flashLight(center.clone().setY(center.y + 1), C.gold, 5, .5, 9);
    let tick = 0;
    const mid = center.clone(); mid.y += 1;
    this.addEffect(new THREE.Object3D(), life, (_t, dt) => {
      tick -= dt;
      if (Math.random() < dt * 30) { const a = Math.random() * TAU, r = Math.sqrt(Math.random()) * R; this.fx.emit(center.x + Math.cos(a) * r, center.y + .1, center.z + Math.sin(a) * r, { vy: rr(1, 2.4), life: rr(.7, 1.3), s0: rr(.12, .22), s1: .02, c0: C.paleGold, c1: C.goldDeep, kind: 1, drag: 1, grav: -.5 }); }
      if (tick > 0) return; tick = .5;
      if (this.combat.damageAt(mid, R, 16 * this.progression.damageMultiplier() * this.buffDamage, ) > 0) this.onConfirmedHit();
      const pp = this.player.position; if (Math.hypot(pp.x - center.x, pp.z - center.z) < R) this.healSelf(3);
    });
    this.onSfx('cast');
  }

  /** Bênção: 10 s de regeneração (+3 de vida/s) e −15% de dano recebido. */
  private bencaoFx() {
    this.bencaoT = this.buffSecs(10);
    const p = this.player.position, c = new THREE.Vector3(p.x, p.y + 1.2, p.z), g = this.groundAt(p);
    this.dome(c, C.mana, 2.6, .7, 2.2); this.sigil(g, UP, 'wind', C.mana, 1.6, 1.2, { spin: 1.8 });
    this.burst(c, 36, 3.2, C.petalW, C.mana, { up: 1, spread: 1, size: .22, life: 1.2, grav: -1 });
    this.flashLight(c, C.mana, 4, .6, 7);
    this.onSfx('cast');
  }

  /* ---------------------------------------------------------------- *
   *  Zoltraak / Vollzanbel projectiles
   * ---------------------------------------------------------------- */
  private spawnProjectile(kind: 'zoltraak' | 'vollzanbel', origin: Vec3, dir: Vec3, target: Vec3) {
    const fire = kind === 'vollzanbel', size = this.progression.sizeMultiplier(), speed = fire ? 13 : 34;
    const g = new THREE.Group(); g.name = kind; g.position.copy(origin).addScaledVector(dir, .5); g.quaternion.setFromUnitVectors(FWD, dir); g.scale.setScalar(size);
    const halo = new THREE.Sprite(this.pSprite('s975', { map: this.tex.glow, color: fire ? C.fire : C.gold, transparent: true, opacity: fire ? .6 : .55, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    halo.scale.setScalar(fire ? 3.6 : 1.8);
    const p: Projectile = {
      object: g, dir: dir.clone(), velocity: dir.clone().multiplyScalar(speed), speed, age: 0, kind, target: target.clone(), light: null, times: [], rings: [], spins: [], halo,
      damage: (at, radius, amount) => { const s = this.progression.sizeMultiplier(), crit = this.progression.rollCrit(), dmg = amount * this.progression.damageMultiplier() * crit, n = this.combat.damageAt(at, radius * s, dmg); if (n > 0) { this.onConfirmedHit(); this.drain(dmg * n); if (crit > 1) this.critFx(at); } },
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

  /**
   * Todos os raios de uma descarga num único tubo poligonal (5 lados, quinas vivas: um anel em cada vértice do
   * zigue-zague, com a orientação transportada ao longo do caminho). Escreve direto no buffer — sem curvas,
   * sem cálculo de comprimento de arco, sem fundir dezenas de geometrias — e sem normais (material não iluminado).
   */
  private boltGeometry(paths: { pts: Vec3[]; r: number }[], scale: number) {
    const RAD = 5;
    let verts = 0, tris = 0;
    for (const p of paths) { verts += p.pts.length * RAD; tris += (p.pts.length - 1) * RAD * 2; }
    const pos = new Float32Array(verts * 3), idx = verts > 65535 ? new Uint32Array(tris * 3) : new Uint16Array(tris * 3);
    const t = this.bT, n = this.bN, b = this.bB;
    let v = 0, k = 0;
    for (const { pts, r: r0 } of paths) {
      const r = r0 * scale, last = pts.length - 1, base = v / 3;
      for (let i = 0; i <= last; i++) {
        t.subVectors(pts[Math.min(i + 1, last)], pts[Math.max(i - 1, 0)]); if (t.lengthSq() < 1e-12) t.set(0, 0, 1); t.normalize();
        if (i === 0) { n.set(0, 1, 0); if (Math.abs(t.y) > .9) n.set(1, 0, 0); }
        n.addScaledVector(t, -n.dot(t)); if (n.lengthSq() < 1e-8) n.set(t.z, 0, -t.x); n.normalize(); b.crossVectors(t, n);
        const p = pts[i];
        for (let j = 0; j < RAD; j++) {
          const a = j / RAD * TAU, c = Math.cos(a) * r, sn = Math.sin(a) * r;
          pos[v++] = p.x + n.x * c + b.x * sn; pos[v++] = p.y + n.y * c + b.y * sn; pos[v++] = p.z + n.z * c + b.z * sn;
        }
      }
      for (let i = 0; i < last; i++) for (let j = 0; j < RAD; j++) {
        const a0 = base + i * RAD + j, a1 = base + i * RAD + (j + 1) % RAD;
        idx[k++] = a0; idx[k++] = a0 + RAD; idx[k++] = a1; idx[k++] = a1; idx[k++] = a0 + RAD; idx[k++] = a1 + RAD;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.computeBoundingSphere();
    return g;
  }

  /**
   * Uma "descarga" do Judradjim: leque de raios grossos da ponta do cajado até a área do alvo, com bifurcações,
   * sub-bifurcações, espinhos curtos ao longo do raio e arcos largos que se abrem para os lados.
   * Tudo fundido em duas malhas (núcleo branco + brilho azul aditivo).
   */
  private buildStrike(from: Vec3, to: Vec3, size: number) {
    const R = 4.4 * size, dir = this.tC.copy(to).sub(from), len = Math.max(1, dir.length()); dir.normalize();
    this.basis(dir);
    const e1 = this.e1.clone(), e2 = this.e2.clone(), paths: { pts: Vec3[]; r: number }[] = [];
    const add = (pts: Vec3[], r: number) => { paths.push({ pts, r }); };
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
    const coreMat = this.pBasic('b1203', { color: '#f1e0ff', transparent: true, opacity: 1, depthWrite: false, toneMapped: false });
    const glowMat = this.basic(C.boltGlow, .4);
    const group = new THREE.Group();
    const cm = this.boltGeometry(paths, 1), gm = this.boltGeometry(paths, 3.4);
    group.add(new THREE.Mesh(gm, glowMat));
    { const m = new THREE.Mesh(cm, coreMat); m.renderOrder = 11; group.add(m); }
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
    const burstMat = this.pSprite('s1227', { map: this.starTex[0], color: '#efdcff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    const burst = new THREE.Sprite(burstMat); root.add(burst);
    const hitMat = this.pSprite('s1229', { map: this.starTex[1], color: '#dcc2ff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
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
          const crit = this.progression.rollCrit(), mult = this.progression.damageMultiplier() * crit;
          if (crit > 1) this.critFx(target);
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
    const coreMat = this.pBasic('b1321', { color: new THREE.Color(4, 3.8, 3.2), toneMapped: false });
    const core = new THREE.Mesh(this.geo.sphere, coreMat); mass.add(core);
    // camadas de fogo turbulento (dourado → laranja) e casca brilhante
    const layers = [0, 1, 2].map(i => { const m = this.fireMaterial(); m.uniforms.uT.value = .28 + i * .14; const mesh = new THREE.Mesh(this.geo.sphere, m); mass.add(mesh); return { mesh, m, k: 1.35 + i * .45 }; });
    const shellMat = this.fresnelMaterial(C.fire, 3, .6, 1), shell = new THREE.Mesh(this.geo.sphere, shellMat); shell.visible = false; mass.add(shell);
    const haloMat = this.pSprite('s1326', { map: this.tex.glow, color: C.fireHot, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
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
        { const crit = this.progression.rollCrit(), dmg = 110 * this.progression.damageMultiplier() * crit, n = this.combat.damageAt(to, R * 1.2, dmg); if (n > 0) { this.onConfirmedHit(); this.drain(dmg * n); if (crit > 1) this.critFx(to); } }
        this.fireExplosion(to.clone(), UP.clone(), R);
        // centro branco ofuscante que se expande e some
        const flashMat = this.pBasic('b1377', { color: new THREE.Color(5, 4.6, 3.8), transparent: true, depthWrite: false, toneMapped: false });
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
    const physical = this.physicalShield;
    // guarda com a arma: o "plano" de bloqueio fica colado à frente do peito e gira junto, sem inércia
    const goal = physical ? this.tC.set(0, 1.2, .7).applyMatrix4(this.player.matrixWorld) : this.tC.copy(this.shieldAnchor).applyMatrix4(this.player.matrixWorld);
    this.player.getWorldQuaternion(this.shieldQ);
    if (!this.shieldPlaced || physical) { this.shieldRoot.position.copy(goal); this.shieldRoot.quaternion.copy(this.shieldQ); this.shieldPlaced = true; }
    this.shieldRoot.position.lerp(goal, 1 - Math.exp(-delta * 16));
    this.shieldRoot.quaternion.slerp(this.shieldQ, 1 - Math.exp(-delta * 9));
    if (!this.shieldActive) { this.shieldRoot.visible = false; this.shieldGround.material.opacity = 0; return; }
    this.shieldAge += delta; const size = this.progression.sizeMultiplier();
    if (physical) { this.shieldRoot.visible = false; this.shieldGround.material.opacity = 0; this.shieldFlash = Math.max(0, this.shieldFlash - delta * 2.4); return; }
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
    this.shieldPlaced = false; this.updateShield(0, 0);
    if (this.physicalShield) { // erguer o escudo: só o som do metal e um brilho discreto no aço
      this.onSfx('staffToggle');
      const h = this.shieldPos(new THREE.Vector3()); this.flash(h, C.steel, .9, .18);
      return;
    }
    this.onSfx('shieldUp');
    const c = this.shieldRoot.getWorldPosition(new THREE.Vector3()), n = this.shieldRoot.getWorldDirection(new THREE.Vector3());
    this.sigil(c.clone().addScaledVector(n, .1), n, 'rune', C.barrierCyan, 2.1, .7, { spin: 1.6, grow: .25 });
    this.flash(c, C.barrierHot, 4, .3); this.flashLight(c, C.barrier, 10, .6, 10);
    this.spray(c, n, 40, 1);
    const g = this.player.position, gy = terrainHeight(g.x, g.z) + .08; this.shock(this.tA.set(g.x, gy, g.z), UP, C.barrier, 2.6, .5);
    this.shake = Math.max(this.shake, .1);
  }

  private shieldBreakFx(broke: boolean) {
    if (this.physicalShield) { // baixar o escudo; se "quebrou" (guarda rompida), faíscas e tranco
      if (!broke) return;
      const h = this.shieldPos(new THREE.Vector3());
      this.burst(h, 36, 6, C.steelHot, C.ember, { up: .5, spread: 1.2, size: .16, life: .5 });
      this.flash(h, C.steelHot, 1.8, .2); this.shake = Math.max(this.shake, .22);
      return;
    }
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
