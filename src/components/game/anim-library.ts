import * as THREE from 'three';

/* ============================================================================
 *  BIBLIOTECA DE ANIMAÇÕES (public/animations/*.fbx, exportadas do Mixamo)
 *
 *  Os FBX trazem o próprio X Bot em T-pose; as rotações locais dos ossos usam eixos diferentes dos do
 *  Xbot.glb e dos modelos dos inimigos (a coxa direita, por exemplo, tem o repouso girado 180°). Por isso cada
 *  clipe é convertido para o esqueleto de destino pela diferença de orientação de repouso de cada osso:
 *
 *      q_destino(t) = O_pai⁻¹ · q_fonte(t) · O_osso,   O = W_fonte_repouso⁻¹ · W_destino_repouso
 *
 *  (W = orientação no mundo com os dois esqueletos em T-pose). Os ossos são casados pelo nome Mixamo
 *  ("mixamorigLeftArm", "mixamorigLeftArm_09"…). Ficam de fora o deslocamento do quadril (o jogo move o
 *  personagem) e a rotação da raiz (o jogo inclina o corpo): o clipe anima pernas, braços e coluna.
 * ========================================================================== */

export type AnimName = 'run' | 'fly' | 'fall';
/** Arquivos da pasta public/animations usados pelo jogo. */
export const ANIM_FILES: Record<AnimName, string> = {
  run: '/animations/Running.fbx',
  fly: '/animations/Flying.fbx',
  fall: '/animations/Jumping Down.fbx',
};
/**
 * Trechos usados de cada clipe (segundos). Jumping Down é um pulo completo (agacha, sobe, cai, aterrissa):
 * só o trecho no ar vira a pose de queda.
 */
export const ANIM_TRIM: Partial<Record<AnimName, [number, number]>> = { fall: [1.2, 1.8] };

/** Nome Mixamo normalizado ("mixamorig:LeftArm", "mixamorigLeftArm_09" → "LeftArm"). */
export const mixamoKey = (n: string) => n.replace(/^mixamorig[:_]?/, '').replace(/_\d+$/, '');

/** Ossos por nome normalizado (o primeiro encontrado: FBX às vezes repete ossos por malha). */
function bonesByKey(root: THREE.Object3D) {
  const out: Record<string, THREE.Object3D> = {};
  root.traverse(o => { if ((o as THREE.Bone).isBone) { const k = mixamoKey(o.name); if (!out[k]) out[k] = o; } });
  return out;
}

/**
 * Converte um clipe do esqueleto `source` (cena do FBX, em repouso) para o esqueleto `target` (cena do
 * modelo recém-carregada, em repouso). As faixas do resultado usam os nomes dos ossos do destino.
 */
export function retargetMixamoClip(source: THREE.Object3D, target: THREE.Object3D, clip: THREE.AnimationClip, name: string, trim?: [number, number]) {
  source.updateMatrixWorld(true); target.updateMatrixWorld(true);
  const src = bonesByKey(source), dst = bonesByKey(target);
  const wq = (o: THREE.Object3D) => o.getWorldQuaternion(new THREE.Quaternion());
  const tracks: THREE.KeyframeTrack[] = [];
  const q = new THREE.Quaternion();
  for (const track of clip.tracks) {
    const dot = track.name.lastIndexOf('.'), node = track.name.slice(0, dot), prop = track.name.slice(dot + 1);
    if (prop !== 'quaternion') continue;                  // sem deslocamento (posições/escala)
    const key = mixamoKey(node);
    if (key === 'Hips') continue;                          // sem rotação da raiz
    const s = src[key], d = dst[key];
    if (!s || !d || !s.parent || !d.parent) continue;
    const ob = wq(s).invert().multiply(wq(d));            // O_osso
    const opInv = wq(s.parent).invert().multiply(wq(d.parent)).invert(); // O_pai⁻¹
    const v = (track.values as Float32Array).slice();
    for (let i = 0; i < v.length; i += 4) {
      q.set(v[i], v[i + 1], v[i + 2], v[i + 3]);
      q.premultiply(opInv).multiply(ob).normalize();
      v[i] = q.x; v[i + 1] = q.y; v[i + 2] = q.z; v[i + 3] = q.w;
    }
    tracks.push(new THREE.QuaternionKeyframeTrack(`${d.name}.quaternion`, Array.from(track.times), Array.from(v)));
  }
  let out = new THREE.AnimationClip(name, clip.duration, tracks);
  if (trim) {
    const fps = 30;
    out = THREE.AnimationUtils.subclip(out, name, Math.round(trim[0] * fps), Math.round(trim[1] * fps), fps);
  }
  return out;
}

/** FBX carregados (cena em repouso + clipe original), compartilhados por todos que pedirem. */
type Loaded = { scene: THREE.Object3D; clip: THREE.AnimationClip };
let cache: Promise<Partial<Record<AnimName, Loaded>>> | null = null;
export function loadAnimationLibrary(): Promise<Partial<Record<AnimName, Loaded>>> {
  if (cache) return cache;
  cache = (async () => {
    const { FBXLoader } = await import('three/addons/loaders/FBXLoader.js');
    const loader = new FBXLoader(), out: Partial<Record<AnimName, Loaded>> = {};
    await Promise.all((Object.keys(ANIM_FILES) as AnimName[]).map(async name => {
      try {
        const fbx = await loader.loadAsync(encodeURI(ANIM_FILES[name]));
        const clip = fbx.animations[0]; if (!clip) return;
        // só o esqueleto interessa: as malhas do FBX são descartadas (libera a memória da GPU/CPU)
        fbx.traverse(o => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry.dispose(); (Array.isArray(m.material) ? m.material : [m.material]).forEach(mt => mt.dispose()); } });
        out[name] = { scene: fbx, clip };
      } catch { /* arquivo ausente: o personagem continua com a animação procedural */ }
    }));
    return out;
  })();
  return cache;
}

/** Converte todos os clipes da biblioteca para um modelo (cena em repouso, antes de qualquer pose). */
export async function clipsFor(target: THREE.Object3D): Promise<Partial<Record<AnimName, THREE.AnimationClip>>> {
  const lib = await loadAnimationLibrary(), out: Partial<Record<AnimName, THREE.AnimationClip>> = {};
  for (const name of Object.keys(lib) as AnimName[]) {
    const l = lib[name]!; out[name] = retargetMixamoClip(l.scene, target, l.clip, name, ANIM_TRIM[name]);
  }
  return out;
}
