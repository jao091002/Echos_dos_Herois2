import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';
import { createHero, type HeroPose, type HeroRig } from './hero';
import { CLASSES, type Appearance, type HeroClass } from './classes';
import { terrainHeight } from './world';

/* ============================================================================
 *  JOGADORES REMOTOS — avatares dos outros jogadores da sala
 *
 *  Pool FIXO de avatares criado no início (máx. 3 outros jogadores por sala de 4): cada herói tem uma
 *  PointLight (aura da arma) e o número de luzes visíveis precisa ficar constante — criar um avatar novo no
 *  meio do jogo recompilaria todos os materiais. Avatares livres ficam estacionados bem abaixo do mapa.
 * ========================================================================== */

/** Estado que cada jogador envia ~15 vezes por segundo. */
export type RemoteState = {
  x: number; y: number; z: number; yaw: number;
  pose: HeroPose; lp: HeroPose; spd: number;
  ov: [string, number] | null; ck: string | null;
  hp: number; mhp: number; cls: HeroClass; look: Appearance; name: string;
};

type Slot = { hero: HeroRig; id: string | null; st: RemoteState | null; cls: HeroClass | null; look: string; seen: number };
const PARK_Y = -400;

export class RemotePlayers {
  readonly slots: Slot[] = [];
  private readonly target = new THREE.Vector3();

  constructor(scene: THREE.Scene, count = 3) {
    for (let i = 0; i < count; i++) {
      const hero = createHero(scene);
      hero.root.position.set(i * 3, PARK_Y, 0); hero.root.name = `remote-player-${i}`;
      this.slots.push({ hero, id: null, st: null, cls: null, look: '', seen: 0 });
    }
  }

  /** Corpo esquelético (Xbot) para todos os avatares, a partir do glTF já carregado pelo herói local. */
  attachBodies(gltf: { scene: THREE.Object3D; animations: THREE.AnimationClip[] }) {
    for (const s of this.slots) s.hero.attachBody({ scene: cloneSkinned(gltf.scene), animations: gltf.animations }, { plain: true });
  }

  /** Atualiza (ou ocupa um avatar livre para) o jogador id. Retorna false se não há avatar livre. */
  setState(id: string, st: RemoteState, now: number) {
    let s = this.slots.find(x => x.id === id);
    if (!s) {
      s = this.slots.find(x => !x.id); if (!s) return false;
      s.id = id; s.st = null; s.cls = null; s.look = '';
      s.hero.root.position.set(st.x, st.y, st.z); s.hero.root.rotation.y = st.yaw;
    }
    if (s.cls !== st.cls) { s.cls = st.cls; s.hero.setWeapon(CLASSES[st.cls]?.weapon ?? 'staff'); s.hero.ensureStaff(); }
    const lookKey = `${st.look.body}|${st.look.joints}`;
    if (s.look !== lookKey) { s.look = lookKey; s.hero.setAppearance(st.look); }
    s.st = st; s.seen = now;
    return true;
  }

  remove(id: string) {
    const s = this.slots.find(x => x.id === id); if (!s) return;
    s.id = null; s.st = null; s.hero.root.position.set(0, PARK_Y, 0);
  }
  clear() { for (const s of this.slots) if (s.id) this.remove(s.id); }

  /** Interpola posição/rotação e anima os avatares ativos. Some quem ficou 15 s sem mandar estado (aba em segundo plano para de enviar). */
  update(time: number, dt: number, now: number) {
    for (const s of this.slots) {
      if (!s.id || !s.st) continue;
      if (now - s.seen > 15000) { this.remove(s.id); continue; }
      const st = s.st, root = s.hero.root;
      this.target.set(st.x, st.y, st.z);
      if (root.position.distanceTo(this.target) > 8) root.position.copy(this.target); // teleporte (Passo Arcano, renascer)
      else root.position.lerp(this.target, 1 - Math.exp(-dt * 12));
      root.position.y = Math.max(root.position.y, terrainHeight(root.position.x, root.position.z) - .05);
      root.userData.facing = st.yaw; root.userData.castKind = st.ck ?? undefined; root.userData.locoPose = st.lp;
      const ov = st.ov ? { mode: st.ov[0] as 'charge' | 'beam' | 'shield' | 'grab', power: st.ov[1] } : undefined;
      s.hero.update(time, dt, st.hp <= 0 ? 'defeat' : st.pose, st.spd, ov);
    }
  }

  /** Jogadores ativos (para nomes, alvo dos inimigos e quadros do grupo). */
  active() { return this.slots.filter(s => s.id && s.st) as (Slot & { id: string; st: RemoteState })[]; }
}
