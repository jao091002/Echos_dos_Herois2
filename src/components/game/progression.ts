export type UpgradeId = 'damage' | 'size' | 'efficiency';
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
export type ProgressionSnapshot = {
  level: number;
  experience: number;
  nextLevelXp: number;
  skillPoints: number;
  ranks: Record<UpgradeId, number>;
  inventory: InventorySnapshot;
};

const MAX_RANK = 5;

/** Persistent-for-this-run XP, drops, and spell talent modifiers. */
export class PlayerProgression {
  level = 1;
  experience = 0;
  nextLevelXp = 100;
  skillPoints = 0;
  ranks: Record<UpgradeId, number> = { damage: 0, size: 0, efficiency: 0 };
  inventory: InventorySnapshot = { echoFragment: 0, sentinelCore: 0, wolfPelt: 0, banditToken: 0, demonAsh: 0, moonFang: 0, ancientSigil: 0, demonHeart: 0 };

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

  upgrade(id: UpgradeId) {
    if (this.skillPoints < 1 || this.ranks[id] >= MAX_RANK) return false;
    this.skillPoints -= 1;
    this.ranks[id] += 1;
    return true;
  }

  damageMultiplier() { return 1 + this.ranks.damage * .15; }
  sizeMultiplier() { return 1 + this.ranks.size * .14; }
  manaCost(baseCost: number) { return Math.max(1, Math.ceil(baseCost * (1 - this.ranks.efficiency * .1))); }
  snapshot(): ProgressionSnapshot {
    return { level: this.level, experience: this.experience, nextLevelXp: this.nextLevelXp, skillPoints: this.skillPoints, ranks: { ...this.ranks }, inventory: { ...this.inventory } };
  }
}

export const UPGRADE_INFO: Record<UpgradeId, { title: string; description: string }> = {
  damage: { title: 'Potência arcana', description: '+15% de dano por nível em todas as magias.' },
  size: { title: 'Ampliação', description: '+14% no tamanho e na área dos efeitos.' },
  efficiency: { title: 'Eficiência de mana', description: '−10% no custo de mana por nível.' },
};
export { MAX_RANK };
