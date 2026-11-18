import * as THREE from 'three';
import { terrainHeight } from './world';

/* ============================================================================
 *  EFEITOS DE SANGUE LÍQUIDO (magia do Lieb)
 *
 *  - Material: MeshPhysicalMaterial com verniz (clearcoat) e reflexo do ambiente, injetado com um fluxo que
 *    escorre pela superfície (faixas escuras/claras rolando ao longo do tentáculo), brilho de borda e uma leve
 *    deformação que faz a superfície "respirar" como líquido.
 *  - Tubos: tentáculos com malha contínua refeita a cada quadro (transporte paralelo do referencial), com
 *    pulsação peristáltica (ondas de volume correndo até a ponta) e ponta afinando.
 *  - Gotas: esticadas na direção do movimento, com gravidade; ao tocar o chão viram respingos.
 *  - Respingos: manchas de borda irregular que se espalham rápido e secam devagar.
 *  - Onda: anel de sangue rasante com crista irregular (Maré de Sangue).
 *
 *  Tudo é criado uma vez e fica na cena (sem recompilar shaders no meio da luta); nenhuma luz nova.
 * ========================================================================== */

const NOISE = /* glsl */`
float bH(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }
float bN(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(bH(i),bH(i+vec3(1,0,0)),f.x),mix(bH(i+vec3(0,1,0)),bH(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(bH(i+vec3(0,0,1)),bH(i+vec3(1,0,1)),f.x),mix(bH(i+vec3(0,1,1)),bH(i+vec3(1,1,1)),f.x),f.y),f.z); }
float bF(vec3 p){ return bN(p)*.55 + bN(p*2.1+3.7)*.3 + bN(p*4.3+9.1)*.15; }
`;

export type BloodKind = 'flow' | 'splat' | 'wave';

/**
 * Sangue molhado. flow: tentáculos/lanças/gotas (fluxo ao longo do uv.x); splat: mancha no chão (borda irregular
 * por ruído, recortada); wave: onda (crista irregular deslocada para cima).
 */
export function bloodMaterial(time: { value: number }, kind: BloodKind = 'flow') {
  const m = new THREE.MeshPhysicalMaterial({
    color: '#6a0712', roughness: .22, metalness: 0, clearcoat: kind === 'splat' ? .7 : 1, clearcoatRoughness: .06,
    specularIntensity: 1, sheen: kind === 'splat' ? 0 : .15, sheenColor: new THREE.Color('#7a0010'), sheenRoughness: .5,
    // poças refletem pouco o céu (refletindo muito viravam tinta rosa vistas de cima)
    emissive: '#2a0005', emissiveIntensity: 1, envMapIntensity: kind === 'splat' ? .4 : 1,
  });
  const uWobble = { value: kind === 'wave' ? .5 : kind === 'splat' ? 0 : .05 };
  m.userData.wobble = uWobble;
  m.onBeforeCompile = sh => {
    sh.uniforms.uTime = time; sh.uniforms.uWobble = uWobble;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>\nuniform float uTime; uniform float uWobble; varying vec3 vBP; varying vec2 vBU;${NOISE}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vBU = uv; vBP = position;
        #ifdef USE_INSTANCING
          vBP = (instanceMatrix * vec4(position, 1.)).xyz;
        #endif
        ${kind === 'wave'
          // onda: altura irregular ao longo do anel, lábio curvando para fora e crista agitada
          ? 'float crest = uv.y, n1 = bF(vec3(uv.x * 26., uTime * 1.7, 0.)), n2 = bN(vec3(uv.x * 70., uv.y * 4., uTime * 5.)); transformed.y *= .35 + n1 * 1.15; transformed.xz *= 1. + crest * crest * (.05 + n1 * .06); transformed.y += (n2 - .5) * .14 * crest * uWobble;'
          : 'transformed += normal * (bN(vBP*3.1 + vec3(0., uTime*1.7, uTime*.9)) - .5) * uWobble;'}`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\nuniform float uTime; varying vec3 vBP; varying vec2 vBU;${NOISE}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        ${kind === 'splat'
          ? `float rr = length(vBU - .5) * 2.;
             float edge = .62 + bF(vec3(vBU * 5., vBP.x * .3 + vBP.z * .3)) * .5;
             if (rr > edge) discard;
             float fl = bF(vec3(vBU * 9., uTime * .15)), wet = 1. - smoothstep(edge - .35, edge, rr);
             diffuseColor.rgb = mix(vec3(.025,.0,.003), vec3(.15,.004,.012), fl * .8 + wet * .2);`
          : `// fluxo: faixas que escorrem ao longo do tentáculo (uv.x) + manchas que rolam no espaço
             float fl = bF(vec3(vBU.x * 7. - uTime * 2.6, vBU.y * 2.5, uTime * .4)) * .7 + bF(vBP * 2.3 + vec3(0., -uTime * 1.2, 0.)) * .3;
             diffuseColor.rgb = mix(vec3(.045,.0,.005), vec3(.34,.008,.022), smoothstep(.25, .8, fl));`}`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        {
          float fr = pow(1. - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0., 1.), 3.);
          float pulse = bF(vec3(vBU.x * 12. - uTime * 4., vBU.y, 1.));
          totalEmissiveRadiance = vec3(.07, .0, .008) * (.4 + pulse) + vec3(.55, .02, .05) * fr * .7 ${kind === 'splat' ? '* .2' : ''};
        }`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>\n roughnessFactor = clamp(roughnessFactor + (bN(vBP * 6.) - .5) * .18, .05, .6);`);
  };
  m.customProgramCacheKey = () => `lieb-blood-${kind}-v1`;
  return m;
}

/* ------------------------------------------------------------------ tubos */

/** Pool de tentáculos com malha contínua (anéis × lados fixos; o que não é usado fica com drawRange vazio). */
export class BloodTubes {
  readonly meshes: THREE.Mesh[] = [];
  private readonly S: number; private readonly R: number;
  private used = 0;
  private readonly C: THREE.Vector3[]; private readonly rad: Float32Array;
  private readonly T = new THREE.Vector3(); private readonly N = new THREE.Vector3(); private readonly Bv = new THREE.Vector3(); private readonly D = new THREE.Vector3();

  constructor(scene: THREE.Scene, material: THREE.Material, count = 16, rings = 56, sides = 10) {
    this.S = rings; this.R = sides;
    this.C = Array.from({ length: rings + 1 }, () => new THREE.Vector3()); this.rad = new Float32Array(rings + 1);
    const vc = (rings + 1) * (sides + 1), idx: number[] = [];
    for (let i = 0; i < rings; i++) for (let j = 0; j < sides; j++) {
      const a = i * (sides + 1) + j, b = a + sides + 1;
      idx.push(a, a + 1, b, b, a + 1, b + 1); // anti-horário visto de fora (normais para fora)
    }
    const uv = new Float32Array(vc * 2);
    for (let i = 0; i <= rings; i++) for (let j = 0; j <= sides; j++) { const k = i * (sides + 1) + j; uv[k * 2] = i / rings; uv[k * 2 + 1] = j / sides; }
    for (let n = 0; n < count; n++) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vc * 3), 3).setUsage(THREE.DynamicDrawUsage));
      g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(vc * 3), 3).setUsage(THREE.DynamicDrawUsage));
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx); g.setDrawRange(0, 0);
      const mesh = new THREE.Mesh(g, material); mesh.frustumCulled = false; mesh.castShadow = true; mesh.name = 'blood-tube';
      scene.add(mesh); this.meshes.push(mesh);
    }
  }
  /** Início do quadro: esconde todos (os usados neste quadro voltam a aparecer). */
  begin() { this.used = 0; }
  end() { for (let i = this.used; i < this.meshes.length; i++) this.meshes[i].geometry.setDrawRange(0, 0); }

  /**
   * Desenha um tubo pela curva sample(u, out) com u ∈ [0, reach]. thick = raio na base; phase desloca a pulsação.
   * Devolve o ponto da ponta (para gotas/respingos) ou null se o pool acabou.
   */
  draw(sample: (u: number, out: THREE.Vector3) => void, reach: number, thick: number, phase: number, time: number, tipOut?: THREE.Vector3) {
    if (this.used >= this.meshes.length || reach <= .01) return null;
    const mesh = this.meshes[this.used++], g = mesh.geometry, S = this.S, R = this.R;
    const P = g.attributes.position as THREE.BufferAttribute, Nn = g.attributes.normal as THREE.BufferAttribute;
    for (let i = 0; i <= S; i++) {
      const s = i / S; sample(s * reach, this.C[i]);
      // afina até a ponta; ondas de volume correm da base para a ponta (peristaltismo); gomos irregulares
      const taper = (1 - s * .72) * (1 - Math.pow(s, 6)), bulge = 1 + .26 * Math.sin(s * 24 - time * 11 + phase) * (1 - s * .5) + .08 * Math.sin(s * 61 + phase * 3);
      this.rad[i] = Math.max(.004, thick * taper * bulge);
    }
    // referencial por transporte paralelo (sem torções bruscas)
    this.T.subVectors(this.C[1], this.C[0]).normalize();
    this.N.set(0, 1, 0); if (Math.abs(this.T.y) > .9) this.N.set(1, 0, 0);
    this.N.sub(this.D.copy(this.T).multiplyScalar(this.N.dot(this.T))).normalize();
    for (let i = 0; i <= S; i++) {
      const a = this.C[Math.max(0, i - 1)], b = this.C[Math.min(S, i + 1)];
      this.T.subVectors(b, a); if (this.T.lengthSq() < 1e-10) this.T.set(0, 0, 1); this.T.normalize();
      this.N.sub(this.D.copy(this.T).multiplyScalar(this.N.dot(this.T))); if (this.N.lengthSq() < 1e-8) this.N.set(1, 0, 0); this.N.normalize();
      this.Bv.crossVectors(this.T, this.N);
      const c = this.C[i], r = this.rad[i];
      for (let j = 0; j <= R; j++) {
        const ang = j / R * Math.PI * 2, cs = Math.cos(ang), sn = Math.sin(ang), k = i * (R + 1) + j;
        const nx = this.N.x * cs + this.Bv.x * sn, ny = this.N.y * cs + this.Bv.y * sn, nz = this.N.z * cs + this.Bv.z * sn;
        P.setXYZ(k, c.x + nx * r, c.y + ny * r, c.z + nz * r); Nn.setXYZ(k, nx, ny, nz);
      }
    }
    P.needsUpdate = true; Nn.needsUpdate = true; g.setDrawRange(0, S * R * 6);
    g.boundingSphere = null;
    if (tipOut) tipOut.copy(this.C[S]);
    return this.C;
  }
  /** Ponto i-ésimo (0..rings) do último tubo desenhado, para pingar gotas ao longo dele. */
  point(i: number, out: THREE.Vector3) { return out.copy(this.C[Math.max(0, Math.min(this.S, i))]); }
  get rings() { return this.S; }
}

/* ------------------------------------------------------------------ respingos */

export class BloodSplats {
  readonly mesh: THREE.InstancedMesh;
  private readonly items: { x: number; y: number; z: number; r: number; rot: number; age: number; life: number }[] = [];
  private cursor = 0;
  private readonly m4 = new THREE.Matrix4(); private readonly q = new THREE.Quaternion(); private readonly p = new THREE.Vector3(); private readonly s = new THREE.Vector3(); private readonly Y = new THREE.Vector3(0, 1, 0);
  constructor(scene: THREE.Scene, material: THREE.Material, count = 110) {
    this.mesh = new THREE.InstancedMesh(new THREE.CircleGeometry(1, 28).rotateX(-Math.PI / 2), material, count);
    this.mesh.frustumCulled = false; this.mesh.receiveShadow = true; this.mesh.count = 0; this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.mesh.name = 'blood-splats';
    scene.add(this.mesh);
    for (let i = 0; i < count; i++) this.items.push({ x: 0, y: 0, z: 0, r: 0, rot: 0, age: 0, life: 0 });
  }
  /** Mancha nova (espalha em ~0,2 s, seca e some no fim da vida). */
  add(x: number, z: number, r: number, life = 9) {
    const it = this.items[this.cursor++ % this.items.length];
    it.x = x; it.z = z; it.y = terrainHeight(x, z) + .012 + (this.cursor % 7) * .0015; it.r = r; it.rot = Math.random() * Math.PI * 2; it.age = 0; it.life = life * (.8 + Math.random() * .4);
  }
  update(dt: number) {
    let n = 0;
    for (const it of this.items) {
      if (it.age >= it.life) continue;
      it.age += dt;
      const spread = 1 - Math.pow(1 - Math.min(1, it.age / .22), 3), dry = 1 - Math.max(0, (it.age - it.life * .7) / (it.life * .3)) ** 2;
      const r = it.r * spread * Math.max(.02, dry);
      this.m4.compose(this.p.set(it.x, it.y, it.z), this.q.setFromAxisAngle(this.Y, it.rot), this.s.set(r, 1, r * .85)); this.mesh.setMatrixAt(n++, this.m4);
    }
    this.mesh.count = n; this.mesh.instanceMatrix.needsUpdate = true;
  }
}

/* ------------------------------------------------------------------ gotas */

export class BloodDrops {
  readonly mesh: THREE.InstancedMesh;
  private readonly items: { p: THREE.Vector3; v: THREE.Vector3; life: number; max: number; size: number; splat: number }[] = [];
  private cursor = 0;
  private readonly m4 = new THREE.Matrix4(); private readonly q = new THREE.Quaternion(); private readonly s = new THREE.Vector3(); private readonly d = new THREE.Vector3(); private readonly Y = new THREE.Vector3(0, 1, 0);
  constructor(scene: THREE.Scene, material: THREE.Material, private readonly splats: BloodSplats, count = 420) {
    this.mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), material, count);
    this.mesh.frustumCulled = false; this.mesh.castShadow = true; this.mesh.count = 0; this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.mesh.name = 'blood-drops';
    scene.add(this.mesh);
    for (let i = 0; i < count; i++) this.items.push({ p: new THREE.Vector3(), v: new THREE.Vector3(), life: 0, max: 1, size: 0, splat: 0 });
  }
  /** Uma gota. splat = raio da mancha que ela deixa ao cair (0 = nenhuma). */
  emit(p: THREE.Vector3, v: THREE.Vector3, size: number, life = 1.4, splat = 0) {
    const it = this.items[this.cursor++ % this.items.length];
    it.p.copy(p); it.v.copy(v); it.size = size; it.life = it.max = life; it.splat = splat;
  }
  /** Jorro em todas as direções (impactos, golpes). */
  burst(at: THREE.Vector3, n: number, speed: number, size = .07, splatChance = .35) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, u = Math.random() * 2 - 1, k = Math.sqrt(1 - u * u), sp = speed * (.35 + Math.random() * .75);
      this.d.set(Math.cos(a) * k * sp, (Math.abs(u) * .8 + .5) * sp, Math.sin(a) * k * sp);
      this.emit(at, this.d, size * (.35 + Math.random() * .7), 1.6, Math.random() < splatChance ? .14 + Math.random() * .26 : 0);
    }
  }
  update(dt: number) {
    let n = 0;
    for (const it of this.items) {
      if (it.life <= 0) continue;
      it.life -= dt; it.v.y -= 15 * dt; it.v.multiplyScalar(Math.exp(-.35 * dt)); it.p.addScaledVector(it.v, dt);
      const floor = terrainHeight(it.p.x, it.p.z);
      if (it.p.y <= floor) {
        if (it.splat > 0) this.splats.add(it.p.x, it.p.z, it.splat, 6 + Math.random() * 5);
        it.life = 0; continue;
      }
      // esticada na direção do movimento (gota de verdade), encolhe no fim da vida
      const sp = it.v.length(), k = it.size * Math.min(1, it.life / .25 + .2);
      this.q.setFromUnitVectors(this.Y, sp > .01 ? this.d.copy(it.v).divideScalar(sp) : this.d.set(0, 1, 0));
      this.m4.compose(it.p, this.q, this.s.set(k * .85, k * (1 + Math.min(2.4, sp * .14)), k * .85)); this.mesh.setMatrixAt(n++, this.m4);
    }
    this.mesh.count = n; this.mesh.instanceMatrix.needsUpdate = true;
  }
}

/* ------------------------------------------------------------------ onda */

/** Anel de sangue que se expande (Maré de Sangue): faixa aberta com crista irregular. */
export class BloodWave {
  readonly mesh: THREE.Mesh;
  constructor(scene: THREE.Scene, material: THREE.Material) {
    const g = new THREE.CylinderGeometry(1, 1.08, 1, 128, 6, true).translate(0, .5, 0);
    // uv.y = altura (0 base, 1 crista); a geometria do cilindro já vem assim
    this.mesh = new THREE.Mesh(g, material); this.mesh.frustumCulled = false; this.mesh.castShadow = true; this.mesh.position.y = -600; this.mesh.name = 'blood-wave';
    (this.mesh.material as THREE.Material).side = THREE.DoubleSide;
    scene.add(this.mesh);
  }
  set(x: number, y: number, z: number, radius: number, height: number) {
    if (radius <= 0 || height <= .01) { this.mesh.position.y = -600; return; }
    this.mesh.position.set(x, y, z); this.mesh.scale.set(radius, height, radius);
  }
}
