import type { HeroChoice } from './classes';
import type { InventorySnapshot } from './progression';
import type { StorySave } from './story';

/* ============================================================================
 *  SAVE LOCAL — o progresso fica só na máquina do jogador
 *  Gravado no armazenamento do navegador (localStorage) e, se quiser, exportado/importado como arquivo .json.
 *  Em multijogador cada jogador salva o próprio herói na própria máquina.
 * ========================================================================== */

export type SaveData = {
  version: 1;
  savedAt: number;
  /** Nome usado no multijogador. */
  name: string;
  choice: HeroChoice;
  progression: { level: number; experience: number; nextLevelXp: number; skillPoints: number; ranks: Record<string, number>; inventory: InventorySnapshot };
  quest: { stage: string; kills: number; reward: number };
  markerRemembered: boolean;
  position: { x: number; y: number; z: number; yaw: number };
  /** Modo história: missões concluídas e progresso das ativas (saves antigos não têm). */
  story?: StorySave;
};

const KEY = 'ecos.save.v1';

export function readSave(): SaveData | null {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null;
    return raw ? validate(JSON.parse(raw)) : null;
  } catch { return null; }
}
export function writeSave(data: SaveData) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch { return false; }
}
export function clearSave() { try { localStorage.removeItem(KEY); } catch { /* sem armazenamento */ } }

/** Baixa o save como arquivo .json (fica onde o navegador salva downloads). */
export function exportSave(data: SaveData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  const stamp = new Date(data.savedAt).toISOString().slice(0, 16).replace(/[:T]/g, '-');
  a.href = url; a.download = `ecos-save-${data.choice.cls}-nv${data.progression.level}-${stamp}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
/** Lê um arquivo .json de save escolhido pelo jogador. */
export async function importSave(file: File): Promise<SaveData | null> {
  try { return validate(JSON.parse(await file.text())); } catch { return null; }
}

/** Confere a forma do save (arquivo importado pode vir de qualquer lugar). */
function validate(v: unknown): SaveData | null {
  const d = v as SaveData;
  if (!d || d.version !== 1 || typeof d.progression?.level !== 'number' || !d.choice?.cls || !d.choice?.look) return null;
  const num = (x: unknown, def: number) => (typeof x === 'number' && Number.isFinite(x) ? x : def);
  return {
    version: 1, savedAt: num(d.savedAt, Date.now()), name: String(d.name ?? '').slice(0, 16),
    choice: { cls: d.choice.cls, look: { body: String(d.choice.look.body), joints: String(d.choice.look.joints) } },
    progression: {
      level: Math.max(1, Math.floor(num(d.progression.level, 1))), experience: Math.max(0, num(d.progression.experience, 0)),
      nextLevelXp: Math.max(1, num(d.progression.nextLevelXp, 100)), skillPoints: Math.max(0, Math.floor(num(d.progression.skillPoints, 0))),
      ranks: typeof d.progression.ranks === 'object' && d.progression.ranks ? Object.fromEntries(Object.entries(d.progression.ranks).filter(([, r]) => typeof r === 'number')) : { root: 1 },
      inventory: { ...d.progression.inventory },
    },
    quest: { stage: String(d.quest?.stage ?? 'available'), kills: num(d.quest?.kills, 0), reward: num(d.quest?.reward, 0) },
    markerRemembered: !!d.markerRemembered,
    position: { x: num(d.position?.x, 0), y: num(d.position?.y, 0), z: num(d.position?.z, 2), yaw: num(d.position?.yaw, Math.PI) },
    story: Array.isArray(d.story?.done) ? { done: d.story.done.filter(s => typeof s === 'string'), prog: typeof d.story.prog === 'object' && d.story.prog ? d.story.prog : {}, stats: typeof d.story.stats === 'object' && d.story.stats ? d.story.stats : {}, acc: Array.isArray(d.story.acc) ? d.story.acc.filter(s => typeof s === 'string') : [] } : undefined,
  };
}
