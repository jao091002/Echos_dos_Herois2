export type LootItemId = 'wolfPelt' | 'banditToken' | 'demonAsh' | 'moonFang' | 'ancientSigil' | 'demonHeart';
export const LOOT_INFO: Record<LootItemId, { name: string; rarity: 'Incomum' | 'Raro' | 'Épico'; source: string }> = {
  wolfPelt: { name: 'Pele de lobo', rarity: 'Incomum', source: 'Lobos' },
  banditToken: { name: 'Ficha de bandido', rarity: 'Incomum', source: 'Bandidos' },
  demonAsh: { name: 'Cinza demoníaca', rarity: 'Incomum', source: 'Demônios' },
  moonFang: { name: 'Presa lunar', rarity: 'Raro', source: 'Lobos' },
  ancientSigil: { name: 'Selo ancestral', rarity: 'Raro', source: 'Bandidos' },
  demonHeart: { name: 'Coração demoníaco', rarity: 'Épico', source: 'Demônios' },
};
export type InventorySnapshot = Record<LootItemId, number> & { echoFragment: number; sentinelCore: number };

/* ====================================================================== árvore de habilidades */
export type Branch = 'root' | 'int' | 'shield' | 'flight';
export type SkillNode = {
  id: string; branch: Branch; name: string; glyph: string; max: number; reqs: string[];
  /** posição polar em volta do nó central (graus, sentido horário a partir de +X; raio em unidades do desenho) */
  ang: number; r: number;
  description: string; perRank: string; keystone?: boolean;
};

export const BRANCH_INFO: Record<Exclude<Branch, 'root'>, { name: string; subtitle: string; color: string }> = {
  int: { name: 'Intelecto', subtitle: 'Mana e dano mágico', color: '#a86bff' },
  shield: { name: 'Escudo', subtitle: 'Barreira e resistência', color: '#4f9bff' },
  flight: { name: 'Voo', subtitle: 'Velocidade e vitalidade', color: '#5fe0b0' },
};

export const SKILL_NODES: SkillNode[] = [
  { id: 'root', branch: 'root', name: 'Despertar do Eco', glyph: '✦', max: 1, reqs: [], ang: 0, r: 0, description: 'A origem de todos os caminhos. Escolha por onde sua jornada começa.', perRank: 'Já desperto.' },

  // ---- Intelecto (roxo)
  { id: 'int_a', branch: 'int', name: 'Mente Afiada', glyph: '✧', max: 5, reqs: ['root'], ang: 202, r: 105, description: 'Foco puro: todas as magias causam mais dano.', perRank: '+8% de dano mágico' },
  { id: 'int_b', branch: 'int', name: 'Reservatório Arcano', glyph: '◈', max: 5, reqs: ['root'], ang: 158, r: 105, description: 'Aumenta o tanque de mana que você carrega.', perRank: '+100 de mana máxima' },
  { id: 'int_d', branch: 'int', name: 'Economia Arcana', glyph: '◌', max: 3, reqs: ['int_a'], ang: 224, r: 190, description: 'Magias mais baratas: gaste menos mana em cada feitiço.', perRank: '−6% no custo de mana' },
  { id: 'int_e', branch: 'int', name: 'Foco Amplo', glyph: '⬡', max: 3, reqs: ['int_a'], ang: 190, r: 195, description: 'Ondas, círculos e raios cobrem uma área maior.', perRank: '+8% no tamanho e na área das magias' },
  { id: 'int_c', branch: 'int', name: 'Fluxo de Mana', glyph: '≈', max: 4, reqs: ['int_b'], ang: 150, r: 190, description: 'A mana volta mais depressa entre um feitiço e outro.', perRank: '+20% na regeneração de mana' },
  { id: 'int_f', branch: 'int', name: 'Ressonância', glyph: '❖', max: 1, reqs: ['int_e', 'int_c'], ang: 180, r: 295, keystone: true, description: 'O Zoltraak carrega muito mais rápido e toda magia ganha força e eficiência.', perRank: 'Carga do Zoltraak 35% mais rápida · +15% de dano · −8% no custo' },

  // ---- Escudo (azul)
  { id: 'sh_a', branch: 'shield', name: 'Barreira Reforçada', glyph: '⬢', max: 5, reqs: ['root'], ang: 278, r: 105, description: 'A muralha de favos aguenta muito mais golpes.', perRank: '+20% de durabilidade do escudo' },
  { id: 'sh_b', branch: 'shield', name: 'Pele de Pedra', glyph: '◆', max: 5, reqs: ['root'], ang: 322, r: 105, description: 'Seu corpo endurece: todo dano recebido é reduzido.', perRank: '−4% do dano recebido' },
  { id: 'sh_c', branch: 'shield', name: 'Escudo Econômico', glyph: '◌', max: 3, reqs: ['sh_a'], ang: 266, r: 195, description: 'Sustentar a barreira consome menos mana por segundo.', perRank: '−25% no consumo de mana do escudo' },
  { id: 'sh_d', branch: 'shield', name: 'Reflexo', glyph: '⟡', max: 3, reqs: ['sh_a'], ang: 298, r: 200, description: 'Os impactos desgastam menos a barreira.', perRank: '−10% de desgaste por golpe bloqueado' },
  { id: 'sh_e', branch: 'shield', name: 'Recarga Rápida', glyph: '↻', max: 3, reqs: ['sh_b'], ang: 334, r: 190, description: 'Depois de soltar ou quebrar, o escudo volta mais cedo.', perRank: '−20% na recarga do escudo' },
  { id: 'sh_f', branch: 'shield', name: 'Bastião', glyph: '✚', max: 1, reqs: ['sh_d', 'sh_e'], ang: 300, r: 295, keystone: true, description: 'Cada golpe bloqueado devolve energia: mana e um pouco de vida.', perRank: 'Cada bloqueio devolve 5 de mana e 2 de vida' },

  // ---- Voo (verde)
  { id: 'fl_a', branch: 'flight', name: 'Asas Leves', glyph: '➶', max: 5, reqs: ['root'], ang: 38, r: 105, description: 'Você corta o ar mais rápido.', perRank: '+8% de velocidade de voo' },
  { id: 'fl_b', branch: 'flight', name: 'Vitalidade', glyph: '♥', max: 5, reqs: ['root'], ang: 82, r: 105, description: 'Um corpo mais resistente aguenta mais antes de cair.', perRank: '+12 de vida máxima' },
  { id: 'fl_c', branch: 'flight', name: 'Planador', glyph: '◌', max: 3, reqs: ['fl_a'], ang: 26, r: 195, description: 'Planar custa menos mana.', perRank: '−20% no consumo de mana do voo' },
  { id: 'fl_e', branch: 'flight', name: 'Ascensão', glyph: '⇡', max: 3, reqs: ['fl_a'], ang: 58, r: 205, description: 'Subir e descer no ar fica mais ágil.', perRank: '+15% na velocidade vertical' },
  { id: 'fl_d', branch: 'flight', name: 'Brisa Curativa', glyph: '❀', max: 3, reqs: ['fl_b'], ang: 92, r: 195, description: 'O vento restaura sua vida enquanto você voa.', perRank: '+0,8 de vida por segundo voando' },
  { id: 'fl_f', branch: 'flight', name: 'Senhor dos Ventos', glyph: '❂', max: 1, reqs: ['fl_c', 'fl_d'], ang: 60, r: 295, keystone: true, description: 'Você e o vento se tornam um só: voo mais veloz e quase sem custo.', perRank: '+15% de velocidade de voo · −20% no consumo de mana do voo' },
];
export const SKILL_BY_ID: Record<string, SkillNode> = Object.fromEntries(SKILL_NODES.map(n => [n.id, n]));

export type Stats = {
  damage: number; size: number; costMult: number; manaMax: number; manaRegen: number; chargeSpeed: number;
  shieldHp: number; shieldDrain: number; blockCost: number; shieldCd: number; resist: number; blockMana: number; blockHeal: number;
  flySpeed: number; flyVertical: number; flyDrain: number; maxHealth: number; flyRegen: number;
};
export type ProgressionSnapshot = {
  level: number; experience: number; nextLevelXp: number; skillPoints: number;
  ranks: Record<string, number>; stats: Stats; inventory: InventorySnapshot;
};

const MAX_RANK = 5;

/** Persistent-for-this-run XP, drops, and talent modifiers. */
export class PlayerProgression {
  level = 1;
  experience = 0;
  nextLevelXp = 100;
  skillPoints = 0;
  ranks: Record<string, number> = { root: 1 };
  inventory: InventorySnapshot = { echoFragment: 0, sentinelCore: 0, wolfPelt: 0, banditToken: 0, demonAsh: 0, moonFang: 0, ancientSigil: 0, demonHeart: 0 };
  /** Atributos derivados dos talentos (recalculados quando os talentos mudam). */
  stats: Stats = this.computeStats();

  recordSentinelDefeat() {
    this.recordExperience(50);
    this.inventory.echoFragment += 1;
    this.inventory.sentinelCore += 1;
  }

  recordExperience(amount: number) {
    this.experience += amount;
    while (this.experience >= this.nextLevelXp) {
      this.experience -= this.nextLevelXp;
      this.level += 1;
      this.skillPoints += 1;
      this.nextLevelXp = 100 + (this.level - 1) * 50;
    }
  }

  addItem(item: LootItemId) { this.inventory[item] += 1; }

  rank(id: string) { return this.ranks[id] ?? 0; }
  /** Todos os pré-requisitos desbloqueados? */
  reachable(id: string) { const n = SKILL_BY_ID[id]; return !!n && n.reqs.every(r => this.rank(r) >= 1); }
  canUpgrade(id: string) { const n = SKILL_BY_ID[id]; return !!n && id !== 'root' && this.skillPoints >= 1 && this.rank(id) < n.max && this.reachable(id); }

  upgrade(id: string) {
    if (!this.canUpgrade(id)) return false;
    this.skillPoints -= 1; this.ranks[id] = this.rank(id) + 1; this.stats = this.computeStats();
    return true;
  }

  /** Devolve todos os pontos gastos. */
  respec() {
    let spent = 0; for (const id of Object.keys(this.ranks)) if (id !== 'root') spent += this.ranks[id];
    this.skillPoints += spent; this.ranks = { root: 1 }; this.stats = this.computeStats();
    return spent;
  }

  private computeStats(): Stats {
    const r = (id: string) => this.ranks?.[id] ?? 0, key = (id: string) => (r(id) > 0 ? 1 : 0);
    return {
      damage: 1 + 0.08 * r('int_a') + 0.15 * key('int_f'),
      size: 1 + 0.08 * r('int_e'),
      costMult: Math.max(0.55, 1 - 0.06 * r('int_d') - 0.08 * key('int_f')),
      manaMax: 100 * r('int_b'),
      manaRegen: 1 + 0.2 * r('int_c'),
      chargeSpeed: 1 + 0.35 * key('int_f'),
      shieldHp: 1 + 0.2 * r('sh_a'),
      shieldDrain: Math.max(0.2, 1 - 0.25 * r('sh_c')),
      blockCost: 1 - 0.1 * r('sh_d'),
      shieldCd: 1 - 0.2 * r('sh_e'),
      resist: Math.min(0.5, 0.04 * r('sh_b')),
      blockMana: 5 * key('sh_f'),
      blockHeal: 2 * key('sh_f'),
      flySpeed: 1 + 0.08 * r('fl_a') + 0.15 * key('fl_f'),
      flyVertical: 1 + 0.15 * r('fl_e'),
      flyDrain: Math.max(0.15, 1 - 0.2 * r('fl_c') - 0.2 * key('fl_f')),
      maxHealth: 100 + 12 * r('fl_b'),
      flyRegen: 0.8 * r('fl_d'),
    };
  }

  damageMultiplier() { return this.stats.damage; }
  sizeMultiplier() { return this.stats.size; }
  manaCost(baseCost: number) { return Math.max(1, Math.ceil(baseCost * this.stats.costMult)); }
  snapshot(): ProgressionSnapshot {
    return { level: this.level, experience: this.experience, nextLevelXp: this.nextLevelXp, skillPoints: this.skillPoints, ranks: { ...this.ranks }, stats: { ...this.stats }, inventory: { ...this.inventory } };
  }
}
export { MAX_RANK };
