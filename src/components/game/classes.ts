import type { SpellId } from './magic';

/* ============================================================================
 *  CLASSES — Maga, Guerreiro e Clérigo
 *  Cada classe define a arma, os atributos base e as 5 habilidades da barra
 *  (as teclas são sempre as mesmas: Q, 1, 2, 3, 4, F, R; 3 e 4 se desbloqueiam na árvore de habilidades).
 * ========================================================================== */

export type HeroClass = 'maga' | 'guerreiro' | 'clerigo';
export type WeaponKind = 'staff' | 'axe' | 'mace' | 'book';

/** Como a habilidade é acionada: clique simples, segurar para carregar (Zoltraak) ou segurar para manter (escudo). */
export type AbilityMode = 'tap' | 'charge' | 'hold';
export type Ability = { spell: SpellId; key: 'Q' | '1' | '2' | '3' | '4' | 'F' | 'R'; label: string; mode: AbilityMode; melee?: boolean };

export type ClassDef = {
  id: HeroClass; name: string; epithet: string; description: string; color: string; glyph: string;
  weapon: WeaponKind;
  /** Nome do recurso (a barra azul): mana, fôlego ou fé. */
  resource: string;
  /** Vida base (somada aos talentos de Vitalidade). */
  health: number;
  /** Redução de dano recebido própria da classe (0..1). */
  resist: number;
  /** Ataque básico (clique / botão Atacar): dano e alcance. */
  attack: { damage: number; radius: number; reach: number };
  abilities: Ability[];
  traits: string[];
};

export const CLASSES: Record<HeroClass, ClassDef> = {
  maga: {
    id: 'maga', name: 'Maga', epithet: 'Herdeira do Cajado', glyph: '✧', color: '#a86bff', weapon: 'staff', resource: 'MANA',
    description: 'Domina a magia antiga à distância: raios carregados, fogo e relâmpagos. Frágil de perto, devastadora de longe.',
    health: 100, resist: 0, attack: { damage: 30, radius: 1.25, reach: 2.15 },
    abilities: [
      { spell: 'zoltraak', key: 'Q', label: 'Zoltraak', mode: 'charge' },
      { spell: 'vollzanbel', key: '1', label: 'Vollzanbel', mode: 'tap' },
      { spell: 'judradjim', key: '2', label: 'Judradjim', mode: 'tap' },
      { spell: 'chuvaEstelar', key: '3', label: 'Chuva Estelar', mode: 'tap' },
      { spell: 'passoArcano', key: '4', label: 'Passo Arcano', mode: 'tap' },
      { spell: 'shield', key: 'F', label: 'Escudo', mode: 'hold' },
      { spell: 'flight', key: 'R', label: 'Voo', mode: 'tap' },
    ],
    traits: ['Dano mágico à distância', 'Pode voar', 'Vida baixa'],
  },
  guerreiro: {
    id: 'guerreiro', name: 'Guerreiro', epithet: 'Machado da Vanguarda', glyph: '⚔', color: '#e0703c', weapon: 'axe', resource: 'FÔLEGO',
    description: 'Um machado de batalha de haste longa na linha de frente. Golpes pesados, giros que limpam a área, investidas que atravessam inimigos — e a própria arma como defesa.',
    health: 160, resist: 0.15, attack: { damage: 48, radius: 1.5, reach: 2.2 },
    abilities: [
      { spell: 'golpe', key: 'Q', label: 'Golpe Brutal', mode: 'tap', melee: true },
      { spell: 'agarrao', key: '1', label: 'Agarrão', mode: 'tap', melee: true },
      { spell: 'investida', key: '2', label: 'Investida', mode: 'tap', melee: true },
      { spell: 'redemoinho', key: '3', label: 'Redemoinho', mode: 'tap', melee: true },
      { spell: 'fenda', key: '4', label: 'Fenda Sísmica', mode: 'tap', melee: true },
      { spell: 'shield', key: 'F', label: 'Guarda', mode: 'hold' },
      { spell: 'brado', key: 'R', label: 'Brado', mode: 'tap' },
    ],
    traits: ['Muita vida e armadura', 'Combate corpo a corpo', 'Brado: +35% de dano'],
  },
  clerigo: {
    id: 'clerigo', name: 'Clérigo', epithet: 'Voz da Deusa', glyph: '✚', color: '#f3c95a', weapon: 'book', resource: 'FÉ',
    description: 'O livro sagrado brilha em suas mãos: lanças de luz da Deusa, selos de cura, barreira de favos e o Despertar que fortalece o grupo.',
    health: 125, resist: 0.08, attack: { damage: 34, radius: 1.35, reach: 2.1 },
    abilities: [
      { spell: 'tresLancas', key: 'Q', label: 'Três Lanças da Deusa', mode: 'tap' },
      { spell: 'cura', key: '1', label: 'Magia de Cura', mode: 'tap' },
      { spell: 'curaEquipe', key: '2', label: 'Cura em Grupo', mode: 'tap' },
      { spell: 'julgamento', key: '3', label: 'Julgamento', mode: 'tap' },
      { spell: 'santuario', key: '4', label: 'Santuário', mode: 'tap' },
      { spell: 'shield', key: 'F', label: 'Barreira', mode: 'hold' },
      { spell: 'despertar', key: 'R', label: 'Despertar', mode: 'tap' },
    ],
    traits: ['Livro sagrado', 'Cura e suporte ao grupo', 'Lanças de luz à distância'],
  },
};
export const CLASS_LIST: HeroClass[] = ['maga', 'guerreiro', 'clerigo'];

/* ---------------------------------------------------------------- aparência */
export type Appearance = { body: string; joints: string };
export const BODY_COLORS = ['#c9ccd2', '#3b3f47', '#d8c7a4', '#5a6e8c', '#7d4b4b', '#4f6b52'];
export const JOINT_COLORS = ['#3a3d45', '#e8e3d6', '#a86bff', '#e0703c', '#f3c95a', '#5fe0b0'];
export const DEFAULT_APPEARANCE: Record<HeroClass, Appearance> = {
  maga: { body: '#c9ccd2', joints: '#a86bff' },
  guerreiro: { body: '#3b3f47', joints: '#e0703c' },
  clerigo: { body: '#d8c7a4', joints: '#f3c95a' },
};

export type HeroChoice = { cls: HeroClass; look: Appearance };
const STORE_KEY = 'ecos.hero.v1';
export function loadChoice(): HeroChoice {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORE_KEY) : null;
    if (raw) {
      const v = JSON.parse(raw) as Partial<HeroChoice>;
      if (v.cls && CLASSES[v.cls] && v.look?.body && v.look?.joints) return { cls: v.cls, look: { body: v.look.body, joints: v.look.joints } };
    }
  } catch { /* armazenamento indisponível: usa o padrão */ }
  return { cls: 'maga', look: { ...DEFAULT_APPEARANCE.maga } };
}
export function saveChoice(c: HeroChoice) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(c)); } catch { /* sem armazenamento: só não lembra */ }
}
