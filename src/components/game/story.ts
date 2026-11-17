import type { LootItemId } from './progression';

/* ============================================================================
 *  MODO HISTÓRIA — uma missão por vez, encadeadas por quem as entrega
 *
 *  Cada missão tem um DOADOR: Aldren (diálogos diferentes a cada etapa) ou um LOCAL do mapa (o Eco do marco, a
 *  inscrição da ruína, o reflexo do lago...). Ciclo: "vá até o doador" → diálogo → aceitar → objetivo → ao cumprir,
 *  a recompensa entra NA HORA e a missão some; o rastreador e a bússola passam a apontar o doador da seguinte.
 *  As caçadas diárias (3 por dia) são aceitas no Quadro de Caçadas depois do capítulo I.
 * ========================================================================== */

export type MobKind = 'wolf' | 'bandit' | 'demon';
export type PlaceId = 'marco' | 'chale' | 'lago' | 'ruina' | 'acampamento' | 'torre' | 'placa';
/** Locais com interação (G). r = distância para interagir. */
export const PLACES: Record<PlaceId, { name: string; x: number; z: number; r: number; verb: string }> = {
  marco: { name: 'Marco do Herói', x: 0, z: -12, r: 4.6, verb: 'Ouvir o Eco do marco' },
  chale: { name: 'Chalé do Vale', x: 19, z: 0, r: 6, verb: 'Examinar o chalé' },
  lago: { name: 'Lago Espelhado', x: -24, z: 16, r: 12.5, verb: 'Olhar o reflexo do lago' },
  ruina: { name: 'Arco Caído', x: -12, z: -21, r: 4.8, verb: 'Ler a inscrição da ruína' },
  acampamento: { name: 'Acampamento Abandonado', x: -19, z: -45, r: 6.5, verb: 'Vasculhar o acampamento' },
  torre: { name: 'Torre Partida', x: 42, z: -46, r: 7, verb: 'Tocar o selo da torre' },
  placa: { name: 'Quadro de Caçadas', x: 3, z: 8.5, r: 3.2, verb: 'Ler o quadro de caçadas' },
};
/** Onde cada tipo de inimigo costuma estar (para a bússola). */
const HUNT: Record<MobKind | 'any', [number, number]> = { wolf: [3, -30], bandit: [-1, -40], demon: [4, -56], any: [2, -38] };

export type Giver = { npc: 'aldren' } | { place: PlaceId };
export type StoryGoal =
  | { kind: 'kill'; mob: MobKind | 'any'; n: number }
  | { kind: 'interact'; place: PlaceId }
  | { kind: 'level'; n: number }
  | { kind: 'cast'; n: number }
  | { kind: 'pvp'; n: number }
  | { kind: 'loot'; n: number };
export type StoryQuest = {
  id: string; chapter: number; title: string; giver: Giver;
  /** Quem fala no diálogo de oferta (locais: o "eco", a inscrição...). */
  speaker?: string;
  lines: string[]; text: string; goal: StoryGoal; xp: number; items?: LootItemId[];
};

export const CHAPTERS = ['I · O Despertar', 'II · Sombras na Mata', 'III · O Acampamento', 'IV · Cinzas de Valkhor'];
const A: Giver = { npc: 'aldren' };

export const STORY: StoryQuest[] = [
  { id: 's1', chapter: 0, title: 'O Eco do Marco', giver: A, xp: 40, goal: { kind: 'interact', place: 'marco' }, text: 'Vá até o Marco do Herói e ouça o Eco.',
    lines: ['Você acordou perto das pedras antigas, não foi? Já vi esse brilho nos olhos de outros... poucos, muito poucos.', 'Siga a trilha até o Marco do Herói, ao norte. Dizem que ele fala com quem tem o sangue dos antigos.'] },
  { id: 's2', chapter: 0, title: 'Palavras de Poder', giver: { place: 'marco' }, speaker: 'Eco do Marco', xp: 60, goal: { kind: 'cast', n: 5 }, text: 'Use suas habilidades 5 vezes.',
    lines: ['...herdeiro... mil anos de silêncio... e você ouve.', 'O poder dos heróis dorme em você. Desperte-o: use suas técnicas e lembre-se de quem foi.'] },
  { id: 's3', chapter: 0, title: 'Uivos no Caminho', giver: A, xp: 140, items: ['wolfPelt'], goal: { kind: 'kill', mob: 'wolf', n: 3 }, text: 'Abata 3 lobos na mata ao norte.',
    lines: ['O marco falou com você?! Então as velhas histórias eram verdade...', 'Escute: os lobos desceram da mata e rondam o caminho. Esta semana já levaram duas das minhas ovelhas. Afaste três deles e eu confio em você de vez.'] },
  { id: 's4', chapter: 1, title: 'A Ruína Esquecida', giver: A, xp: 80, goal: { kind: 'interact', place: 'ruina' }, text: 'Investigue o Arco Caído entre as árvores.',
    lines: ['Os uivos pararam. Faz muito tempo que alguém não protegia estes campos assim.', 'Há um arco caído a oeste do marco. Meu avô dizia que lá estão escritos os nomes dos heróis. Vá ver com seus próprios olhos.'] },
  { id: 's5', chapter: 1, title: 'O Espelho do Lago', giver: { place: 'ruina' }, speaker: 'Inscrição antiga', xp: 90, goal: { kind: 'interact', place: 'lago' }, text: 'Encontre o Lago Espelhado a oeste do prado.',
    lines: ['"Aqui caiu o Arco dos Sete. Seus nomes foram levados pela água."', 'Os nomes gravados foram raspados... mas as marcas apontam para o lago a sudoeste.'] },
  { id: 's6', chapter: 1, title: 'Fumaça no Horizonte', giver: { place: 'lago' }, speaker: 'Reflexo no lago', xp: 120, goal: { kind: 'interact', place: 'acampamento' }, text: 'Siga até o acampamento a noroeste.',
    lines: ['A água se aquieta e mostra outro tempo: guerreiros marchando, uma torre inteira, fogueiras ao norte.', 'O reflexo escurece sobre um acampamento. Há algo — ou alguém — ali que não deveria estar.'] },
  { id: 's7', chapter: 2, title: 'Fim da Pilhagem', giver: { place: 'acampamento' }, speaker: 'Bilhete rasgado', xp: 240, items: ['banditToken'], goal: { kind: 'kill', mob: 'bandit', n: 2 }, text: 'Derrote 2 bandidos na mata.',
    lines: ['"Ordens do Corvo: saqueiem o vale antes que o herdeiro desperte."', 'Os bandidos sabem de você. É melhor encontrá-los antes que eles encontrem Aldren.'] },
  { id: 's8', chapter: 2, title: 'Notícias para Aldren', giver: { place: 'acampamento' }, speaker: 'Bilhete rasgado', xp: 120, goal: { kind: 'loot', n: 3 }, text: 'Recolha 3 itens de inimigos como prova e volte ao vale.',
    lines: ['Com os bandidos dispersos, os despojos deles podem contar a Aldren o que está acontecendo.'] },
  { id: 's9', chapter: 2, title: 'Força Crescente', giver: A, xp: 160, items: ['moonFang'], goal: { kind: 'level', n: 4 }, text: 'Alcance o nível 4.',
    lines: ['Um bilhete do Corvo... então o herdeiro é você, e eles sabem.', 'Não posso lutar por você, mas posso dizer: fique mais forte. A torre a nordeste não é lugar para iniciantes.'] },
  { id: 's10', chapter: 3, title: 'A Torre Partida', giver: A, xp: 200, goal: { kind: 'interact', place: 'torre' }, text: 'Suba até a Torre Partida a nordeste.',
    lines: ['Agora sim você tem o porte de um herói. A torre a nordeste guardava o selo que prendia Valkhor.', 'Se o selo estiver rachado... que os antigos nos protejam. Vá até lá.'] },
  { id: 's11', chapter: 3, title: 'Eco Demoníaco', giver: { place: 'torre' }, speaker: 'Selo de Valkhor', xp: 450, items: ['demonAsh', 'ancientSigil'], goal: { kind: 'kill', mob: 'demon', n: 1 }, text: 'Derrote um demônio ao norte.',
    lines: ['O selo pulsa, rachado. Algo escapou por ele e caminha ao norte, entre as árvores mortas.', 'Destrua o eco demoníaco antes que ele encontre o caminho de volta para Valkhor.'] },
  { id: 's12', chapter: 3, title: 'Herdeiro dos Heróis', giver: A, xp: 700, items: ['demonHeart'], goal: { kind: 'level', n: 8 }, text: 'Alcance o nível 8.',
    lines: ['Você derrotou aquilo? Então as canções vão voltar a ser cantadas.', 'Mas o selo ainda está rachado. Treine, herdeiro. Quando estiver pronto, o vale inteiro vai precisar de você.'] },
];

/** Caçadas do dia (3 sorteadas pela data), aceitas no Quadro de Caçadas. */
const DAILY_POOL: Omit<StoryQuest, 'id' | 'chapter' | 'giver' | 'lines'>[] = [
  { title: 'Patrulha da Mata', text: 'Abata 4 lobos.', goal: { kind: 'kill', mob: 'wolf', n: 4 }, xp: 150, items: ['wolfPelt'] },
  { title: 'Justiça na Estrada', text: 'Derrote 2 bandidos.', goal: { kind: 'kill', mob: 'bandit', n: 2 }, xp: 200, items: ['banditToken'] },
  { title: 'Treino Arcano', text: 'Use 25 habilidades.', goal: { kind: 'cast', n: 25 }, xp: 140 },
  { title: 'Caçador de Ecos', text: 'Derrote 6 inimigos de qualquer tipo.', goal: { kind: 'kill', mob: 'any', n: 6 }, xp: 220 },
  { title: 'Coletor', text: 'Recolha 4 itens.', goal: { kind: 'loot', n: 4 }, xp: 160 },
  { title: 'Duelista', text: 'Derrote 1 jogador em PvP.', goal: { kind: 'pvp', n: 1 }, xp: 250, items: ['moonFang'] },
  { title: 'Peregrino', text: 'Toque o selo da Torre Partida.', goal: { kind: 'interact', place: 'torre' }, xp: 120 },
  { title: 'Banimento', text: 'Derrote um demônio.', goal: { kind: 'kill', mob: 'demon', n: 1 }, xp: 320, items: ['demonAsh'] },
];
const BOARD_ID = 'board';

export const dayKey = (d = new Date()) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
function dailiesFor(key: string): StoryQuest[] {
  let s = Number(key) % 2147483647 || 1; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pool = [...DAILY_POOL], out: StoryQuest[] = [];
  for (let i = 0; i < 3; i++) { const q = pool.splice(Math.floor(rnd() * pool.length), 1)[0]; out.push({ ...q, id: `d${key}-${i}`, chapter: -1, giver: { place: 'placa' }, lines: [] }); }
  return out;
}

/* ───────── conquistas: metas de longo prazo com recompensa (contadores acumulados no save) ───────── */
export type StatKey = 'wolf' | 'bandit' | 'demon' | 'cast' | 'loot' | 'pvp' | 'story';
export type Achievement = { id: string; title: string; text: string; stat: StatKey; n: number; xp: number };
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a-wolf10', title: 'Terror dos Lobos', text: 'Abata 10 lobos.', stat: 'wolf', n: 10, xp: 150 },
  { id: 'a-wolf50', title: 'Senhor da Matilha', text: 'Abata 50 lobos.', stat: 'wolf', n: 50, xp: 500 },
  { id: 'a-band10', title: 'Lei nas Estradas', text: 'Derrote 10 bandidos.', stat: 'bandit', n: 10, xp: 300 },
  { id: 'a-demon5', title: 'Exorcista', text: 'Derrote 5 demônios.', stat: 'demon', n: 5, xp: 600 },
  { id: 'a-cast100', title: 'Voz de Poder', text: 'Use 100 habilidades.', stat: 'cast', n: 100, xp: 200 },
  { id: 'a-cast1000', title: 'Arquimago', text: 'Use 1000 habilidades.', stat: 'cast', n: 1000, xp: 800 },
  { id: 'a-loot25', title: 'Colecionador', text: 'Recolha 25 itens.', stat: 'loot', n: 25, xp: 250 },
  { id: 'a-pvp1', title: 'Primeiro Duelo', text: 'Derrote um jogador em PvP.', stat: 'pvp', n: 1, xp: 150 },
  { id: 'a-pvp20', title: 'Campeão da Arena', text: 'Derrote 20 jogadores em PvP.', stat: 'pvp', n: 20, xp: 1000 },
  { id: 'a-story', title: 'Eco Desperto', text: 'Conclua todo o modo história.', stat: 'story', n: STORY.length, xp: 1500 },
];

export type StorySave = { done: string[]; prog: Record<string, number>; stats?: Partial<Record<StatKey, number>>; acc?: string[] };
/** Linha do rastreador: 'go' = ir até o doador; 'goal' = objetivo em curso. */
export type StoryView = { id: string; title: string; text: string; chapter: string; daily: boolean; cur: number; max: number; step: 'go' | 'goal' }[];
/** Diálogo de oferta mostrado ao interagir com um doador. */
export type StoryOffer = { id: string; speaker: string; sub: string; title: string; lines: string[]; objective: string; reward: string };

const giverName = (g: Giver) => ('npc' in g ? 'Aldren' : PLACES[g.place].name);
const goalMax = (g: StoryGoal) => (g.kind === 'interact' ? 1 : g.n);
const sameGiver = (a: Giver, b: Giver) => ('npc' in a ? 'npc' in b : 'place' in b && a.place === b.place);

export class StoryLog {
  private done = new Set<string>();
  private acc = new Set<string>();
  private prog = new Map<string, number>();
  private daily: StoryQuest[] = [];
  private day = '';
  private stats: Partial<Record<StatKey, number>> = {};
  /** Missão concluída: o jogo entrega a recompensa e avisa (next = doador da próxima). */
  onComplete: (q: StoryQuest, next: string | null) => void = () => {};
  /** Conquista desbloqueada. */
  onAchievement: (a: Achievement) => void = () => {};
  /** Algo mudou (lista/progresso/doador): o jogo atualiza HUD, marcador do NPC e bússola. */
  onChange: () => void = () => {};

  constructor() { this.refreshDay(); }
  private refreshDay() {
    const k = dayKey(); if (k === this.day) return;
    this.day = k; this.daily = dailiesFor(k);
    const old = (id: string) => id.startsWith('d2') && !id.startsWith(`d${k}`);
    for (const id of [...this.done]) if (old(id)) this.done.delete(id);
    for (const id of [...this.acc]) if (old(id)) this.acc.delete(id);
    for (const id of [...this.prog.keys()]) if (old(id)) this.prog.delete(id);
  }
  /** A missão da história em curso (a primeira não concluída). */
  get current() { return STORY.find(q => !this.done.has(q.id)) ?? null; }
  get storyDone() { return STORY.filter(q => this.done.has(q.id)).length; }
  get achievementsDone() { return ACHIEVEMENTS.filter(a => this.done.has(a.id)).length; }
  private get boardOpen() { return STORY.filter(q => q.chapter === 0).every(q => this.done.has(q.id)); }
  /** Missões aceitas e não concluídas (onde o progresso conta). */
  private accepted() { this.refreshDay(); return [...STORY, ...this.daily].filter(q => this.acc.has(q.id) && !this.done.has(q.id)); }

  view(): StoryView {
    this.refreshDay();
    const out: StoryView = [], q = this.current;
    if (q) {
      if (this.acc.has(q.id)) out.push({ id: q.id, title: q.title, text: q.text, chapter: CHAPTERS[q.chapter], daily: false, cur: Math.min(this.prog.get(q.id) ?? 0, goalMax(q.goal)), max: goalMax(q.goal), step: 'goal' });
      else out.push({ id: q.id, title: 'npc' in q.giver ? 'Fale com Aldren' : `Vá até: ${giverName(q.giver)}`, text: 'npc' in q.giver ? 'Aldren, o pastor, está perto do início da trilha.' : 'Algo ali chama por você.', chapter: CHAPTERS[q.chapter], daily: false, cur: 0, max: 1, step: 'go' });
    }
    for (const d of this.daily) if (this.acc.has(d.id) && !this.done.has(d.id)) out.push({ id: d.id, title: d.title, text: d.text, chapter: 'Caçada do dia', daily: true, cur: Math.min(this.prog.get(d.id) ?? 0, goalMax(d.goal)), max: goalMax(d.goal), step: 'goal' });
    return out;
  }
  /** Para onde a bússola aponta: doador da próxima missão ou o local/área do objetivo. npcPos vem do jogo. */
  target(npcPos: { x: number; z: number }): { x: number; z: number } | null {
    const q = this.current; if (!q) return null;
    if (!this.acc.has(q.id)) return 'npc' in q.giver ? npcPos : PLACES[q.giver.place];
    const g = q.goal;
    if (g.kind === 'interact') return PLACES[g.place];
    if (g.kind === 'kill') { const [x, z] = HUNT[g.mob]; return { x, z }; }
    return null;
  }
  /** Aldren tem algo a dizer? ('offer' = missão nova, 'active' = missão dele em curso, null = nada). */
  npcState(): 'offer' | 'active' | null {
    const q = this.current; if (!q || !('npc' in q.giver)) return null;
    return this.acc.has(q.id) ? 'active' : 'offer';
  }
  /** Local relevante em (x, z): doador da próxima missão, objetivo "interagir" ou o quadro com caçadas novas. */
  placeAt(x: number, z: number): PlaceId | null {
    const q = this.current;
    for (const id of Object.keys(PLACES) as PlaceId[]) {
      const p = PLACES[id]; if (Math.hypot(x - p.x, z - p.z) > p.r) continue;
      if (q && !this.acc.has(q.id) && 'place' in q.giver && q.giver.place === id) return id;
      if (this.accepted().some(a => a.goal.kind === 'interact' && a.goal.place === id)) return id;
      if (id === 'placa' && this.boardOpen && this.daily.some(d => !this.acc.has(d.id))) return id;
    }
    return null;
  }
  /** Oferta disponível com este doador agora. */
  offerAt(g: Giver): StoryOffer | null {
    const q = this.current;
    if (q && !this.acc.has(q.id) && sameGiver(q.giver, g)) {
      const items = q.items?.length ? ` + ${q.items.length} ${q.items.length > 1 ? 'itens' : 'item'}` : '';
      return { id: q.id, speaker: q.speaker ?? 'Aldren', sub: 'npc' in q.giver ? 'Pastor dos Campos da Aurora' : PLACES[q.giver.place].name, title: q.title, lines: q.lines, objective: q.text, reward: `+${q.xp} XP${items}` };
    }
    if ('place' in g && g.place === 'placa' && this.boardOpen && this.daily.some(d => !this.acc.has(d.id))) {
      const ds = this.daily.filter(d => !this.acc.has(d.id));
      return { id: BOARD_ID, speaker: 'Quadro de Caçadas', sub: 'Avisos do vale · renovam todo dia', title: 'Caçadas do Dia', lines: ds.map(d => `• ${d.title}: ${d.text} (+${d.xp} XP)`), objective: 'Cumpra as caçadas até a meia-noite.', reward: `+${ds.reduce((s, d) => s + d.xp, 0)} XP no total` };
    }
    return null;
  }
  accept(id: string) {
    if (id === BOARD_ID) this.daily.forEach(d => this.acc.add(d.id)); else this.acc.add(id);
    // missões de "nível" já podem estar cumpridas ao aceitar
    this.onChange();
  }
  /** Interagiu (G) com um local: conclui objetivos "interagir" ali. */
  interact(place: PlaceId) { this.bump(g => g.kind === 'interact' && g.place === place); }

  private stat(k: StatKey, amount = 1) {
    const v = this.stats[k] = (this.stats[k] ?? 0) + amount;
    for (const a of ACHIEVEMENTS) if (a.stat === k && v >= a.n && !this.done.has(a.id)) { this.done.add(a.id); this.onAchievement(a); }
  }
  private bump(match: (g: StoryGoal) => boolean, amount = 1, absolute = false) {
    let changed = false;
    for (const q of this.accepted()) {
      if (!match(q.goal)) continue;
      const max = goalMax(q.goal), before = this.prog.get(q.id) ?? 0, now = absolute ? Math.max(before, amount) : before + amount;
      if (now === before) continue;
      this.prog.set(q.id, now); changed = true;
      if (now >= max) {
        this.done.add(q.id); this.prog.delete(q.id);
        const next = q.chapter >= 0 ? this.current : null;
        this.onComplete(q, next ? giverName(next.giver) : null);
        if (q.chapter >= 0) this.stat('story');
      }
    }
    if (changed) this.onChange();
  }
  kill(mob: MobKind) { this.stat(mob); this.bump(g => g.kind === 'kill' && (g.mob === 'any' || g.mob === mob)); }
  cast() { this.stat('cast'); this.bump(g => g.kind === 'cast'); }
  loot() { this.stat('loot'); this.bump(g => g.kind === 'loot'); }
  pvpKill() { this.stat('pvp'); this.bump(g => g.kind === 'pvp'); }
  /** Nível atual (chamar ao subir e ao aceitar missões de nível). */
  level(n: number) { this.bump(g => g.kind === 'level', n, true); }

  save(): StorySave { return { done: [...this.done], prog: Object.fromEntries(this.prog), stats: { ...this.stats }, acc: [...this.acc] }; }
  restore(s: StorySave | undefined) {
    this.done = new Set(s?.done ?? []); this.acc = new Set(s?.acc ?? []);
    this.prog = new Map(Object.entries(s?.prog ?? {}).filter(([, v]) => typeof v === 'number'));
    this.stats = Object.fromEntries(Object.entries(s?.stats ?? {}).filter(([, v]) => typeof v === 'number'));
    this.day = ''; this.refreshDay(); this.onChange();
  }
}
