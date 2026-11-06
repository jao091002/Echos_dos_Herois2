import * as THREE from 'three';

/*
 * Material do cajado: madeira procedural (veio longitudinal, nós, poros, desgaste) gerada em canvas,
 * com mapa de cor, normal (relevo/profundidade), rugosidade e oclusão; mais uma máscara de "veias"
 * entalhadas que acendem e pulsam quando a heroína usa magia.
 *
 * Coordenadas de textura: u = volta em torno da haste (contínua em 0/1), v = ao longo do cajado.
 * Na haste, v vai de 0 (ponta de baixo) a 1 (topo); a cabeça reaproveita um trecho sem emenda da textura.
 * As veias nascem na empunhadura (v = GRIP_V) e se espalham conforme a magia cresce.
 */

const W = 128, H = 1024;          // volta x comprimento (a haste é ~10x mais longa que larga)
const GRIP_V = 0.5;               // y = 0 do cajado (mão direita) fica no meio da haste
/** A cabeça usa v em [HEAD_V0, HEAD_V0 + HEAD_V_LEN] da textura (sem emenda), mas brilha como a continuação da haste. */
export const HEAD_V0 = 0.72, HEAD_V_LEN = 0.25;
const HEAD_V_OFFSET = 0.975 - HEAD_V0;

/* ---------------------------------------------------------------- ruído 3D */
function hash3(x: number, y: number, z: number) {
  const v = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return v - Math.floor(v);
}
function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
  return l(
    l(l(c(0, 0, 0), c(1, 0, 0), u), l(c(0, 1, 0), c(1, 1, 0), u), v),
    l(l(c(0, 0, 1), c(1, 0, 1), u), l(c(0, 1, 1), c(1, 1, 1), u), v), w);
}
function fbm3(x: number, y: number, z: number, oct: number) {
  let s = 0, a = 0.5, f = 1, n = 0;
  for (let i = 0; i < oct; i++) { s += noise3(x * f, y * f, z * f) * a; n += a; a *= 0.5; f *= 2.03; }
  return s / n;
}

const smooth = (e0: number, e1: number, x: number) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

/* ------------------------------------------------------------- texturas */
export type StaffTextures = { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture; veinMap: THREE.CanvasTexture };

function makeTextures(): StaffTextures {
  const height = new Float32Array(W * H), vein = new Float32Array(W * H);
  const col = new Uint8ClampedArray(W * H * 4), rough = new Uint8ClampedArray(W * H * 4);
  // nós: centros (u, v), raio em "unidades de volta" (u)
  const knots = [[0.18, 0.12, 0.09], [0.7, 0.31, 0.07], [0.35, 0.66, 0.1], [0.86, 0.83, 0.06], [0.55, 0.95, 0.08]];
  const R = 1.6, L = 16; // proporção física: comprimento ≈ 10x a circunferência

  for (let y = 0; y < H; y++) {
    const v = y / H;
    for (let x = 0; x < W; x++) {
      const u = x / W, a = u * Math.PI * 2;
      const cx = Math.cos(a) * R, cy = Math.sin(a) * R, cz = v * L * 10;
      // distorção de baixa frequência: o veio ondula ao longo da haste
      const warp = fbm3(cx * 0.35, cy * 0.35, cz * 0.035, 3) * 2.4;
      // nós deformam o veio em volta de si
      let knot = 0, knotRing = 0;
      for (const [ku, kv, kr] of knots) {
        let du = Math.abs(u - ku); du = Math.min(du, 1 - du);
        const dv = (v - kv) * L * 0.62; // corrige a proporção (v é bem mais "comprido")
        const d = Math.hypot(du, dv) / kr;
        if (d < 3) { const f = Math.exp(-d * d * 1.4); knot = Math.max(knot, f); knotRing += Math.sin(d * 14) * f * 0.9; }
      }
      // veio: isolinhas de um ruído alongado (muita variação em volta, pouca ao longo)
      const g = fbm3(cx * 2.2 + warp, cy * 2.2 + warp, cz * 0.06, 4) * 9 + knotRing;
      const line = Math.pow(Math.abs(Math.sin(g * Math.PI)), 0.45);         // 0 = sulco escuro do veio
      const pores = noise3(cx * 26, cy * 26, cz * 0.9);
      const tone = fbm3(cx * 0.6, cy * 0.6, cz * 0.012, 2);                 // variação de cor em manchas
      const crack = knot > 0.55 ? smooth(0.55, 0.9, knot) * (0.5 + 0.5 * noise3(cx * 9, cy * 9, cz * 0.5)) : 0;

      // veias de magia: isolinhas finas de outro ruído alongado -> rede ramificada
      const vn = fbm3(cx * 1.15 + 7.3, cy * 1.15 - 2.1, cz * 0.045 + 3.3, 4);
      const vd = Math.abs(vn - 0.5);
      let vm = 1 - smooth(0.006, 0.022, vd);
      vm *= 1 - smooth(0.35, 0.85, knot);                                   // não atravessa o miolo dos nós
      const i = y * W + x;
      vein[i] = vm;

      // altura: sulcos do veio, poros, nó saliente com centro rachado, veias entalhadas
      height[i] = line * 0.55 + pores * 0.12 + knot * 0.55 - crack * 0.9 - vm * 0.6 + tone * 0.2;

      // cor: madeira polida escura com veio mais escuro, nó avermelhado, veia em sulco escuro
      const lightK = 0.35 + 0.65 * line;
      let r = 58 + 66 * lightK + 26 * tone, gg = 36 + 42 * lightK + 16 * tone, b = 20 + 22 * lightK + 8 * tone;
      const kd = knot * 0.55 + crack * 0.4;
      r *= 1 - kd * 0.45; gg *= 1 - kd * 0.55; b *= 1 - kd * 0.6;
      const pd = 1 - (pores > 0.82 ? (pores - 0.82) * 2.2 : 0);
      const vdk = 1 - vm * 0.5;
      col[i * 4] = r * pd * vdk; col[i * 4 + 1] = gg * pd * vdk; col[i * 4 + 2] = b * pd * vdk; col[i * 4 + 3] = 255;

      // rugosidade: madeira encerada (lisa) nas cristas, áspera nos sulcos, rachas e veias
      const ro = 0.42 + (1 - line) * 0.22 + crack * 0.3 + vm * 0.2 + pores * 0.06;
      rough[i * 4] = rough[i * 4 + 1] = rough[i * 4 + 2] = Math.min(255, ro * 255); rough[i * 4 + 3] = 255;
    }
  }
  // desgaste da empunhadura: madeira mais lisa e clara onde a mão segura
  for (let y = 0; y < H; y++) {
    const v = y / H, wear = Math.exp(-(((v - GRIP_V) / 0.05) ** 2));
    if (wear < 0.02) continue;
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      col[i * 4] += 14 * wear; col[i * 4 + 1] += 9 * wear; col[i * 4 + 2] += 4 * wear;
      rough[i * 4] = rough[i * 4 + 1] = rough[i * 4 + 2] = rough[i * 4] * (1 - 0.35 * wear);
      height[i] = height[i] * (1 - 0.5 * wear) + 0.3 * wear;
    }
  }

  // normal a partir da altura (Sobel, contínuo em u e em v)
  const nrm = new Uint8ClampedArray(W * H * 4), vmap = new Uint8ClampedArray(W * H * 4);
  const hAt = (x: number, y: number) => height[((y + H) % H) * W + ((x + W) % W)];
  const strength = 2.6;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const dx = (hAt(x + 1, y - 1) + 2 * hAt(x + 1, y) + hAt(x + 1, y + 1)) - (hAt(x - 1, y - 1) + 2 * hAt(x - 1, y) + hAt(x - 1, y + 1));
    const dy = (hAt(x - 1, y + 1) + 2 * hAt(x, y + 1) + hAt(x + 1, y + 1)) - (hAt(x - 1, y - 1) + 2 * hAt(x, y - 1) + hAt(x + 1, y - 1));
    let nx = -dx * strength, ny = -dy * strength, nz = 1; const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
    const i = (y * W + x) * 4;
    nrm[i] = (nx * 0.5 + 0.5) * 255; nrm[i + 1] = (ny * 0.5 + 0.5) * 255; nrm[i + 2] = (nz * 0.5 + 0.5) * 255; nrm[i + 3] = 255;
    // oclusão embutida na cor: sulcos mais fundos ficam mais escuros (profundidade)
    const cav = Math.max(0, (hAt(x - 1, y) + hAt(x + 1, y) + hAt(x, y - 1) + hAt(x, y + 1)) * 0.25 - hAt(x, y));
    const ao = 1 - Math.min(0.45, cav * 2.2);
    col[i] *= ao; col[i + 1] *= ao; col[i + 2] *= ao;
    const vv = vein[y * W + x] * 255; vmap[i] = vmap[i + 1] = vmap[i + 2] = vv; vmap[i + 3] = 255;
  }

  const tex = (data: Uint8ClampedArray<ArrayBuffer>, srgb: boolean) => {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d')!; ctx.putImageData(new ImageData(data, W, H), 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.needsUpdate = true;
    return t;
  };
  return { map: tex(col, true), normalMap: tex(nrm, false), roughnessMap: tex(rough, false), veinMap: tex(vmap, false) };
}

/* ------------------------------------------------------------ material */
/** Uniforms compartilhados pela haste e pela cabeça (atualize a cada quadro). */
export type StaffVeinUniforms = {
  uMagic: { value: number }; uTime: { value: number }; uVeinColor: { value: THREE.Color };
};

export function createStaffMaterials(scene: THREE.Scene) {
  const textures = makeTextures();
  scene.userData.gameTextures = [...(scene.userData.gameTextures ?? []), ...Object.values(textures)];
  const uniforms: StaffVeinUniforms = { uMagic: { value: 0 }, uTime: { value: 0 }, uVeinColor: { value: new THREE.Color('#ffd27a') } };

  /** vOffset: somado ao v da textura dá a posição real ao longo do cajado. */
  const make = (tint: string, roughness: number, vOffset: number) => {
    const m = new THREE.MeshStandardMaterial({
      color: tint, roughness, metalness: 0,
      map: textures.map, normalMap: textures.normalMap, normalScale: new THREE.Vector2(1.1, 1.1), roughnessMap: textures.roughnessMap,
    });
    m.onBeforeCompile = shader => {
      shader.uniforms.uVeinMap = { value: textures.veinMap };
      shader.uniforms.uMagic = uniforms.uMagic; shader.uniforms.uTime = uniforms.uTime; shader.uniforms.uVeinColor = uniforms.uVeinColor;
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
uniform sampler2D uVeinMap; uniform float uMagic; uniform float uTime; uniform vec3 uVeinColor;`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
  // veias: acendem a partir da empunhadura e avançam pela haste conforme a magia cresce;
  // pulsos de energia correm da mão para as pontas (mais fortes rumo à cabeça)
  float vm = texture2D(uVeinMap, vMapUv).r;
  float fv = vMapUv.y + ${vOffset.toFixed(3)};
  float s = abs(fv - ${GRIP_V.toFixed(2)});
  float reach = uMagic * 0.95;
  float reveal = 1.0 - smoothstep(reach - 0.18, reach, s);
  float pulse = 0.3 + 0.7 * pow(0.5 + 0.5 * sin((s * 7.0 - uTime * 2.6) * 6.2831), 4.0);
  float flicker = 0.85 + 0.15 * sin(uTime * 23.0 + fv * 40.0);
  float headBoost = 0.7 + 0.9 * smoothstep(0.6, 1.15, fv);
  float glow = vm * reveal * pulse * flicker * headBoost * clamp(uMagic, 0.0, 1.2);
  // brilho fraco residual em repouso, para as veias "respirarem"
  glow += vm * 0.04 * (0.5 + 0.5 * sin(uTime * 1.3 + fv * 9.0));
  totalEmissiveRadiance += uVeinColor * glow * 3.2;
  diffuseColor.rgb = mix(diffuseColor.rgb, uVeinColor * 0.35, clamp(glow * 0.6, 0.0, 0.6));
}`);
    };
    m.customProgramCacheKey = () => `staff-wood-veins-v1-${vOffset}`;
    return m;
  };

  return { shaft: make('#f4e6d6', 0.95, 0), head: make('#ffeedd', 0.9, HEAD_V_OFFSET), uniforms };
}

/** Cor das veias por magia (o espírito de cada feitiço percorre a madeira). */
export const VEIN_COLORS: Record<string, string> = {
  zoltraak: '#ffd77a', vollzanbel: '#ff7a2e', judradjim: '#7fc8ff', shield: '#8ff0ff', flight: '#b6ffcf',
};
