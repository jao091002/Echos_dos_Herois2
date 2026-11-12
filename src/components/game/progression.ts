import type { HeroClass } from './classes';
import type { SpellId } from './magic';

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

/* ====================================================================== atributos */
export type Stats = {
  // magia e recurso
  damage: number; size: number; costMult: number; manaMax: number; manaRegen: number; chargeSpeed: number;
  // escudo
  shieldHp: number; shieldDrain: number; blockCost: number; shieldCd: number; resist: number; blockMana: number; blockHeal: number;
  // voo e vida
  flySpeed: number; flyVertical: number; flyDrain: number; maxHealth: number; flyRegen: number;
  /** Multiplicador de dano corpo a corpo (ataque básico e golpes do guerreiro). */
  melee: number;
  /** Chance de crítico (0..1) e multiplicador do dano crítico. */
  crit: number; critDmg: number;
  /** Fração do dano causado que volta como vida. */
  lifesteal: number;
  /** Vida regenerada por segundo (fora o voo). */
  regen: number;
  /** Poder de cura (Cura, Consagração, Bênção, Santuário, Brado). */
  heal: number;
  /** Redução de recarga das habilidades (0..0.4). */
  cdr: number;
  /** Velocidade de movimento a pé. */
  moveSpeed: number;
  /** Duração dos bônus temporários (Brado, Bênção, Consagração, Santuário). */
  buffTime: number;
  /** Força do Agarrão (dano e duração do arrasto). */
  grab: number;
};
export type StatKey = keyof Stats;
type StatFx = Partial<Stats>;

const BASE_STATS: Stats = {
  damage: 1, size: 1, costMult: 1, manaMax: 0, manaRegen: 1, chargeSpeed: 1,
  shieldHp: 1, shieldDrain: 1, blockCost: 1, shieldCd: 1, resist: 0, blockMana: 0, blockHeal: 0,
  flySpeed: 1, flyVertical: 1, flyDrain: 1, maxHealth: 100, flyRegen: 0,
  melee: 1, crit: 0, critDmg: 1.5, lifesteal: 0, regen: 0, heal: 1, cdr: 0, moveSpeed: 1, buffTime: 1, grab: 1,
};
/** Limites para os somatórios não quebrarem o jogo. */
const STAT_LIMITS: Partial<Record<StatKey, [number, number]>> = {
  costMult: [.5, 2], shieldDrain: [.2, 2], flyDrain: [.15, 2], blockCost: [.3, 2], shieldCd: [.3, 2],
  resist: [0, .6], cdr: [0, .4], crit: [0, .6], lifesteal: [0, .25],
};

/* ====================================================================== árvore de habilidades */
export type SkillNode = {
  id: string; branch: string; name: string; glyph: string; max: number; reqs: string[];
  /** posição polar em volta do nó central (graus, sentido horário a partir de +X; raio em unidades do desenho) */
  ang: number; r: number;
  description: string; perRank: string; keystone?: boolean;
  /** Somado a cada nível. */
  per?: StatFx;
  /** Somado uma vez, a partir do nível 1. */
  once?: StatFx;
  /** Habilidade da barra (teclas 3/4) liberada por este nó. */
  unlock?: SpellId;
};
export type BranchInfo = { name: string; subtitle: string; color: string };
export type SkillTree = { branches: Record<string, BranchInfo>; nodes: SkillNode[]; byId: Record<string, SkillNode>; totals: [string, (s: Stats) => string][] };

const pct = (v: number) => `${v >= 0 ? '+' : ''}${Math.round(v * 100)}%`;
const ROOT = (name: string, description: string): SkillNode => ({ id: 'root', branch: 'root', name, glyph: '✦', max: 1, reqs: [], ang: 0, r: 0, description, perRank: 'Já desperto.' });

/*
 * Layout de cada ramo (c = ângulo central do ramo):
 *   nível 1: c±22° (r 105) · nível 2: c-34°, c, c+34° (r 190–200) · nível 3: c-18° habilidade nova, c+18° nó final (r 285)
 */
const L = (c: number) => ({ a1: c - 22, a2: c + 22, b1: c - 34, b2: c, b3: c + 34, k1: c - 18, k2: c + 18 });
const A = L(180), B = L(300), C = L(60);

function tree(branches: Record<string, BranchInfo>, nodes: SkillNode[], totals: SkillTree['totals']): SkillTree {
  return { branches, nodes, byId: Object.fromEntries(nodes.map(n => [n.id, n])), totals };
}

export const SKILL_TREES: Record<HeroClass, SkillTree> = {
  /* ------------------------------------------------------------------ MAGA */
  maga: tree({
    arc: { name: 'Arcano', subtitle: 'Dano mágico, crítico e área', color: '#a86bff' },
    bar: { name: 'Barreira', subtitle: 'Escudo, resistência e recarga', color: '#4f9bff' },
    ceu: { name: 'Céu', subtitle: 'Voo, mobilidade e vitalidade', color: '#5fe0b0' },
  }, [
    ROOT('Despertar do Eco', 'A magia antiga desperta em você. Escolha por onde sua jornada começa.'),
    { id: 'm_a1', branch: 'arc', name: 'Mente Afiada', glyph: '✧', max: 5, reqs: ['root'], ang: A.a1, r: 105, description: 'Foco puro: todas as magias causam mais dano.', perRank: '+8% de dano mágico', per: { damage: .08 } },
    { id: 'm_a2', branch: 'arc', name: 'Reservatório Arcano', glyph: '◈', max: 5, reqs: ['root'], ang: A.a2, r: 105, description: 'Aumenta o tanque de mana que você carrega.', perRank: '+15 de mana máxima', per: { manaMax: 15 } },
    { id: 'm_a3', branch: 'arc', name: 'Foco Amplo', glyph: '⬡', max: 3, reqs: ['m_a1'], ang: A.b1, r: 190, description: 'Ondas, círculos e raios cobrem uma área maior.', perRank: '+8% no tamanho e na área das magias', per: { size: .08 } },
    { id: 'm_a4', branch: 'arc', name: 'Olho Arcano', glyph: '◎', max: 5, reqs: ['m_a1'], ang: A.b2, r: 200, description: 'Você enxerga as falhas na defesa do inimigo.', perRank: '+4% de chance de crítico', per: { crit: .04 } },
    { id: 'm_a5', branch: 'arc', name: 'Fluxo de Mana', glyph: '≈', max: 4, reqs: ['m_a2'], ang: A.b3, r: 190, description: 'A mana volta mais depressa e cada feitiço custa um pouco menos.', perRank: '+20% de regeneração de mana · −3% no custo', per: { manaRegen: .2, costMult: -.03 } },
    { id: 'm_a6', branch: 'arc', name: 'Chuva Estelar', glyph: '☄', max: 1, reqs: ['m_a3', 'm_a4'], ang: A.k1, r: 285, unlock: 'chuvaEstelar', description: 'Nova habilidade (tecla 3): estrelas caem do céu sobre a área mirada, uma após a outra.', perRank: 'Desbloqueia Chuva Estelar', once: { damage: .04 } },
    { id: 'm_a7', branch: 'arc', name: 'Ressonância', glyph: '❖', max: 1, reqs: ['m_a4', 'm_a5'], ang: A.k2, r: 285, keystone: true, description: 'O Zoltraak carrega muito mais rápido e toda magia ganha força, eficiência e críticos mais fortes.', perRank: 'Carga 35% mais rápida · +15% de dano · −8% no custo · +50% de dano crítico', once: { chargeSpeed: .35, damage: .15, costMult: -.08, critDmg: .5 } },

    { id: 'm_b1', branch: 'bar', name: 'Barreira Reforçada', glyph: '⬢', max: 5, reqs: ['root'], ang: B.a1, r: 105, description: 'A muralha de favos aguenta muito mais golpes.', perRank: '+20% de durabilidade do escudo', per: { shieldHp: .2 } },
    { id: 'm_b2', branch: 'bar', name: 'Pele de Pedra', glyph: '◆', max: 5, reqs: ['root'], ang: B.a2, r: 105, description: 'Seu corpo endurece: todo dano recebido é reduzido.', perRank: '−4% do dano recebido', per: { resist: .04 } },
    { id: 'm_b3', branch: 'bar', name: 'Escudo Econômico', glyph: '◌', max: 3, reqs: ['m_b1'], ang: B.b1, r: 190, description: 'Sustentar a barreira consome menos mana por segundo.', perRank: '−25% no consumo de mana do escudo', per: { shieldDrain: -.25 } },
    { id: 'm_b4', branch: 'bar', name: 'Reflexo', glyph: '⟡', max: 3, reqs: ['m_b1'], ang: B.b2, r: 200, description: 'Os impactos desgastam menos a barreira.', perRank: '−10% de desgaste por golpe bloqueado', per: { blockCost: -.1 } },
    { id: 'm_b5', branch: 'bar', name: 'Tempo Dobrado', glyph: '↻', max: 3, reqs: ['m_b2'], ang: B.b3, r: 190, description: 'O escudo e todas as magias voltam mais cedo.', perRank: '−20% na recarga do escudo · −4% em todas as recargas', per: { shieldCd: -.2, cdr: .04 } },
    { id: 'm_b6', branch: 'bar', name: 'Bastião', glyph: '✚', max: 1, reqs: ['m_b3', 'm_b4'], ang: B.k1, r: 285, keystone: true, description: 'Cada golpe bloqueado devolve energia: mana e um pouco de vida.', perRank: 'Cada bloqueio devolve 5 de mana e 4 de vida', once: { blockMana: 5, blockHeal: 4 } },
    { id: 'm_b7', branch: 'bar', name: 'Sabedoria Antiga', glyph: '⧗', max: 3, reqs: ['m_b4', 'm_b5'], ang: B.k2, r: 285, description: 'Mil anos de estudo: recargas mais curtas e um corpo mais resistente.', perRank: '−5% em todas as recargas · +10 de vida máxima', per: { cdr: .05, maxHealth: 10 } },

    { id: 'm_c1', branch: 'ceu', name: 'Asas Leves', glyph: '➶', max: 5, reqs: ['root'], ang: C.a1, r: 105, description: 'Você corta o ar (e o chão) mais rápido.', perRank: '+8% de velocidade de voo · +3% a pé', per: { flySpeed: .08, moveSpeed: .03 } },
    { id: 'm_c2', branch: 'ceu', name: 'Vitalidade', glyph: '♥', max: 5, reqs: ['root'], ang: C.a2, r: 105, description: 'Um corpo mais resistente aguenta mais antes de cair.', perRank: '+12 de vida máxima', per: { maxHealth: 12 } },
    { id: 'm_c3', branch: 'ceu', name: 'Planador', glyph: '◌', max: 3, reqs: ['m_c1'], ang: C.b1, r: 190, description: 'Planar custa menos mana.', perRank: '−20% no consumo de mana do voo', per: { flyDrain: -.2 } },
    { id: 'm_c4', branch: 'ceu', name: 'Ascensão', glyph: '⇡', max: 3, reqs: ['m_c1'], ang: C.b2, r: 200, description: 'Subir e descer no ar fica mais ágil.', perRank: '+15% de velocidade vertical', per: { flyVertical: .15 } },
    { id: 'm_c5', branch: 'ceu', name: 'Brisa Curativa', glyph: '❀', max: 3, reqs: ['m_c2'], ang: C.b3, r: 190, description: 'O vento restaura sua vida, mais ainda enquanto você voa.', perRank: '+0,8 de vida/s voando · +0,3 de vida/s sempre', per: { flyRegen: .8, regen: .3 } },
    { id: 'm_c6', branch: 'ceu', name: 'Passo Arcano', glyph: '⟿', max: 1, reqs: ['m_c3', 'm_c4'], ang: C.k1, r: 285, unlock: 'passoArcano', description: 'Nova habilidade (tecla 4): teletransporte curto na direção da mira, atravessando o perigo.', perRank: 'Desbloqueia Passo Arcano', once: { moveSpeed: .03 } },
    { id: 'm_c7', branch: 'ceu', name: 'Senhora dos Ventos', glyph: '❂', max: 1, reqs: ['m_c4', 'm_c5'], ang: C.k2, r: 285, keystone: true, description: 'Você e o vento se tornam um só: voo veloz e quase sem custo.', perRank: '+15% de voo · −20% no custo do voo · +8% a pé', once: { flySpeed: .15, flyDrain: -.2, moveSpeed: .08 } },
  ], [
    ['Dano mágico', s => pct(s.damage - 1)], ['Crítico', s => `${Math.round(s.crit * 100)}% · ×${s.critDmg.toFixed(2)}`], ['Mana máxima', s => `${100 + s.manaMax}`],
    ['Custo de mana', s => pct(s.costMult - 1)], ['Recarga', s => pct(-s.cdr)], ['Escudo', s => pct(s.shieldHp - 1)],
    ['Resistência', s => pct(s.resist)], ['Velocidade de voo', s => pct(s.flySpeed - 1)], ['Vida máxima', s => `${s.maxHealth}`],
  ]),

  /* ------------------------------------------------------------------ GUERREIRO */
  guerreiro: tree({
    fur: { name: 'Fúria', subtitle: 'Dano corpo a corpo, crítico e roubo de vida', color: '#e0703c' },
    bal: { name: 'Baluarte', subtitle: 'Vida, armadura e escudo', color: '#8fb0d8' },
    con: { name: 'Conquista', subtitle: 'Agarrão, Brado, recargas e mobilidade', color: '#e8c35a' },
  }, [
    ROOT('Juramento da Vanguarda', 'Você jurou ficar na frente. Escolha como vai lutar.'),
    { id: 'g_f1', branch: 'fur', name: 'Braço Forte', glyph: '⚔', max: 5, reqs: ['root'], ang: A.a1, r: 105, description: 'Golpes mais pesados com o machado.', perRank: '+8% de dano corpo a corpo', per: { melee: .08 } },
    { id: 'g_f2', branch: 'fur', name: 'Instinto Assassino', glyph: '◎', max: 5, reqs: ['root'], ang: A.a2, r: 105, description: 'Você acha a brecha na guarda do inimigo.', perRank: '+4% de chance de crítico', per: { crit: .04 } },
    { id: 'g_f3', branch: 'fur', name: 'Lâmina Sedenta', glyph: '❦', max: 3, reqs: ['g_f1'], ang: A.b1, r: 190, description: 'Cada golpe que acerta devolve um pouco de vida.', perRank: '+3% do dano vira vida', per: { lifesteal: .03 } },
    { id: 'g_f4', branch: 'fur', name: 'Golpe Esmagador', glyph: '✷', max: 4, reqs: ['g_f2'], ang: A.b2, r: 200, description: 'Seus críticos quebram ossos.', perRank: '+15% de dano crítico', per: { critDmg: .15 } },
    { id: 'g_f5', branch: 'fur', name: 'Fôlego de Batalha', glyph: '≈', max: 4, reqs: ['g_f2'], ang: A.b3, r: 190, description: 'O fôlego volta mais rápido e as técnicas custam menos.', perRank: '+15% de regeneração de fôlego · −4% no custo', per: { manaRegen: .15, costMult: -.04 } },
    { id: 'g_f6', branch: 'fur', name: 'Redemoinho', glyph: '↺', max: 1, reqs: ['g_f3', 'g_f4'], ang: A.k1, r: 285, unlock: 'redemoinho', description: 'Nova habilidade (tecla 3): giro completo com a lâmina, ferindo todos em volta.', perRank: 'Desbloqueia Redemoinho', once: { melee: .05 } },
    { id: 'g_f7', branch: 'fur', name: 'Sede de Sangue', glyph: '❖', max: 1, reqs: ['g_f4', 'g_f5'], ang: A.k2, r: 285, keystone: true, description: 'A batalha alimenta você: mais dano, mais críticos e muito mais vida roubada.', perRank: '+20% de dano corpo a corpo · +5% de crítico · +5% de roubo de vida', once: { melee: .2, crit: .05, lifesteal: .05 } },

    { id: 'g_b1', branch: 'bal', name: 'Couraça', glyph: '◆', max: 5, reqs: ['root'], ang: B.a1, r: 105, description: 'Placas de aço extras sob a roupa.', perRank: '−4% do dano recebido', per: { resist: .04 } },
    { id: 'g_b2', branch: 'bal', name: 'Vigor', glyph: '♥', max: 5, reqs: ['root'], ang: B.a2, r: 105, description: 'Treino de campanha: muito mais vida.', perRank: '+20 de vida máxima', per: { maxHealth: 20 } },
    { id: 'g_b3', branch: 'bal', name: 'Haste de Aço', glyph: '⛨', max: 4, reqs: ['g_b1'], ang: B.b1, r: 190, description: 'A guarda com o machado aguenta mais e se desgasta menos a cada golpe aparado.', perRank: '+20% de durabilidade da guarda · −8% de desgaste por bloqueio', per: { shieldHp: .2, blockCost: -.08 } },
    { id: 'g_b4', branch: 'bal', name: 'Pele Curtida', glyph: '✚', max: 4, reqs: ['g_b2'], ang: B.b2, r: 200, description: 'Ferimentos fecham sozinhos durante a luta.', perRank: '+0,5 de vida por segundo', per: { regen: .5 } },
    { id: 'g_b5', branch: 'bal', name: 'Guarda Firme', glyph: '↻', max: 3, reqs: ['g_b2'], ang: B.b3, r: 190, description: 'Sustentar a guarda cansa menos e ela volta mais cedo depois de rompida.', perRank: '−20% na recarga e no consumo da guarda', per: { shieldCd: -.2, shieldDrain: -.2 } },
    { id: 'g_b6', branch: 'bal', name: 'Fortaleza', glyph: '▣', max: 1, reqs: ['g_b3', 'g_b4'], ang: B.k1, r: 285, keystone: true, description: 'Você vira uma muralha viva: armadura, vida e cada bloqueio cura.', perRank: '−10% de dano recebido · +40 de vida · cada bloqueio cura 5', once: { resist: .1, maxHealth: 40, blockHeal: 5 } },
    { id: 'g_b7', branch: 'bal', name: 'Inabalável', glyph: '▲', max: 3, reqs: ['g_b4', 'g_b5'], ang: B.k2, r: 285, description: 'Nada te derruba: cada bloqueio devolve fôlego.', perRank: '−3% de dano recebido · +3 de fôlego por bloqueio', per: { resist: .03, blockMana: 3 } },

    { id: 'g_c1', branch: 'con', name: 'Passada Firme', glyph: '➶', max: 5, reqs: ['root'], ang: C.a1, r: 105, description: 'Avanço implacável pelo campo.', perRank: '+4% de velocidade a pé', per: { moveSpeed: .04 } },
    { id: 'g_c2', branch: 'con', name: 'Disciplina', glyph: '⧗', max: 4, reqs: ['root'], ang: C.a2, r: 105, description: 'Técnicas voltam mais cedo.', perRank: '−4% em todas as recargas', per: { cdr: .04 } },
    { id: 'g_c3', branch: 'con', name: 'Pegada de Ferro', glyph: '⋔', max: 4, reqs: ['g_c1'], ang: C.b1, r: 190, description: 'O Agarrão aperta mais forte: mais dano e arrasto mais longo.', perRank: '+15% de força do Agarrão', per: { grab: .15 } },
    { id: 'g_c4', branch: 'con', name: 'Comandante', glyph: '⚑', max: 3, reqs: ['g_c1'], ang: C.b2, r: 200, description: 'Seu Brado ecoa por mais tempo e cura mais.', perRank: '+15% de duração dos bônus · +10% de cura', per: { buffTime: .15, heal: .1 } },
    { id: 'g_c5', branch: 'con', name: 'Investida Brutal', glyph: '➤', max: 3, reqs: ['g_c2'], ang: C.b3, r: 190, description: 'Golpes de área ficam mais largos e mais fortes.', perRank: '+6% de área · +5% de dano corpo a corpo', per: { size: .06, melee: .05 } },
    { id: 'g_c6', branch: 'con', name: 'Fenda Sísmica', glyph: 'ϟ', max: 1, reqs: ['g_c3', 'g_c4'], ang: C.k1, r: 285, unlock: 'fenda', description: 'Nova habilidade (tecla 4): crava o machado no chão e abre uma fenda que explode em linha à frente.', perRank: 'Desbloqueia Fenda Sísmica', once: { size: .04 } },
    { id: 'g_c7', branch: 'con', name: 'Senhor da Guerra', glyph: '♛', max: 1, reqs: ['g_c4', 'g_c5'], ang: C.k2, r: 285, keystone: true, description: 'O campo de batalha é seu: Agarrão devastador, Brado longo e recargas curtas.', perRank: '+30% de força do Agarrão · +30% de duração dos bônus · −8% nas recargas', once: { grab: .3, buffTime: .3, cdr: .08 } },
  ], [
    ['Dano corpo a corpo', s => pct(s.melee - 1)], ['Crítico', s => `${Math.round(s.crit * 100)}% · ×${s.critDmg.toFixed(2)}`], ['Roubo de vida', s => `${Math.round(s.lifesteal * 100)}%`],
    ['Vida máxima', s => `${s.maxHealth + 60}`], ['Resistência', s => pct(s.resist)], ['Regeneração', s => `${s.regen.toFixed(1)}/s`],
    ['Força do Agarrão', s => pct(s.grab - 1)], ['Recarga', s => pct(-s.cdr)], ['Velocidade', s => pct(s.moveSpeed - 1)],
  ]),

  /* ------------------------------------------------------------------ CLÉRIGO */
  clerigo: tree({
    luz: { name: 'Luz', subtitle: 'Dano sagrado, crítico e área', color: '#f3c95a' },
    gra: { name: 'Graça', subtitle: 'Cura, regeneração e bênçãos', color: '#7fe0a8' },
    fe: { name: 'Fé', subtitle: 'Barreira, fé e recargas', color: '#7fb6ff' },
  }, [
    ROOT('Voto da Aurora', 'A luz respondeu ao seu chamado. Escolha como vai servi-la.'),
    { id: 'c_l1', branch: 'luz', name: 'Chama Sagrada', glyph: '☀', max: 5, reqs: ['root'], ang: A.a1, r: 105, description: 'Sua luz queima mais forte.', perRank: '+8% de dano sagrado', per: { damage: .08 } },
    { id: 'c_l2', branch: 'luz', name: 'Olhar Justo', glyph: '◎', max: 5, reqs: ['root'], ang: A.a2, r: 105, description: 'A luz encontra o ponto fraco.', perRank: '+4% de chance de crítico', per: { crit: .04 } },
    { id: 'c_l3', branch: 'luz', name: 'Clarão', glyph: '⬡', max: 3, reqs: ['c_l1'], ang: A.b1, r: 190, description: 'As Três Lanças, o Julgamento e a Cura em Grupo cobrem uma área maior.', perRank: '+8% de área', per: { size: .08 } },
    { id: 'c_l4', branch: 'luz', name: 'Tomo Pesado', glyph: '✣', max: 4, reqs: ['c_l1'], ang: A.b2, r: 200, description: 'Golpes com o livro sagrado batem mais forte.', perRank: '+10% de dano corpo a corpo', per: { melee: .1 } },
    { id: 'c_l5', branch: 'luz', name: 'Veredito', glyph: '✷', max: 4, reqs: ['c_l2'], ang: A.b3, r: 190, description: 'Os críticos sagrados são sentenças.', perRank: '+15% de dano crítico', per: { critDmg: .15 } },
    { id: 'c_l6', branch: 'luz', name: 'Julgamento', glyph: '↡', max: 1, reqs: ['c_l3', 'c_l4'], ang: A.k1, r: 285, unlock: 'julgamento', description: 'Nova habilidade (tecla 3): um selo dourado marca o alvo e uma coluna de luz cai do céu.', perRank: 'Desbloqueia Julgamento', once: { damage: .04 } },
    { id: 'c_l7', branch: 'luz', name: 'Aurora Implacável', glyph: '❖', max: 1, reqs: ['c_l4', 'c_l5'], ang: A.k2, r: 285, keystone: true, description: 'A luz pune e restaura: mais dano, mais críticos e parte do dano vira vida.', perRank: '+15% de dano · +6% de crítico · +4% de roubo de vida', once: { damage: .15, crit: .06, lifesteal: .04 } },

    { id: 'c_g1', branch: 'gra', name: 'Mãos Curativas', glyph: '✚', max: 5, reqs: ['root'], ang: B.a1, r: 105, description: 'Toda cura sua é mais forte.', perRank: '+12% de poder de cura', per: { heal: .12 } },
    { id: 'c_g2', branch: 'gra', name: 'Corpo Consagrado', glyph: '♥', max: 5, reqs: ['root'], ang: B.a2, r: 105, description: 'A fé sustenta o corpo.', perRank: '+15 de vida máxima', per: { maxHealth: 15 } },
    { id: 'c_g3', branch: 'gra', name: 'Prece Constante', glyph: '❀', max: 4, reqs: ['c_g1'], ang: B.b1, r: 190, description: 'Uma oração silenciosa fecha suas feridas o tempo todo.', perRank: '+0,4 de vida por segundo', per: { regen: .4 } },
    { id: 'c_g4', branch: 'gra', name: 'Graça Duradoura', glyph: '⧗', max: 3, reqs: ['c_g1'], ang: B.b2, r: 200, description: 'Despertar, Cura em Grupo e Santuário duram mais.', perRank: '+15% de duração dos bônus', per: { buffTime: .15 } },
    { id: 'c_g5', branch: 'gra', name: 'Espírito Firme', glyph: '◆', max: 4, reqs: ['c_g2'], ang: B.b3, r: 190, description: 'Golpes atingem menos fundo.', perRank: '−3% do dano recebido', per: { resist: .03 } },
    { id: 'c_g6', branch: 'gra', name: 'Santuário', glyph: '⌂', max: 1, reqs: ['c_g3', 'c_g4'], ang: B.k1, r: 285, unlock: 'santuario', description: 'Nova habilidade (tecla 4): ergue um domo sagrado que cura e protege quem estiver dentro.', perRank: 'Desbloqueia Santuário', once: { heal: .05 } },
    { id: 'c_g7', branch: 'gra', name: 'Milagre', glyph: '✺', max: 1, reqs: ['c_g4', 'c_g5'], ang: B.k2, r: 285, keystone: true, description: 'Sua presença é um milagre: curas enormes e regeneração constante.', perRank: '+30% de cura · +1 de vida/s · +30 de vida máxima', once: { heal: .3, regen: 1, maxHealth: 30 } },

    { id: 'c_f1', branch: 'fe', name: 'Devoção', glyph: '◈', max: 5, reqs: ['root'], ang: C.a1, r: 105, description: 'Mais fé para gastar.', perRank: '+15 de fé máxima', per: { manaMax: 15 } },
    { id: 'c_f2', branch: 'fe', name: 'Barreira Reforçada', glyph: '⬢', max: 5, reqs: ['root'], ang: C.a2, r: 105, description: 'A barreira de favos aguenta mais golpes.', perRank: '+20% de durabilidade do escudo', per: { shieldHp: .2 } },
    { id: 'c_f3', branch: 'fe', name: 'Fervor', glyph: '≈', max: 4, reqs: ['c_f1'], ang: C.b1, r: 190, description: 'A fé volta mais depressa.', perRank: '+20% de regeneração de fé', per: { manaRegen: .2 } },
    { id: 'c_f4', branch: 'fe', name: 'Liturgia', glyph: '↻', max: 4, reqs: ['c_f1'], ang: C.b2, r: 200, description: 'Os ritos se repetem mais rápido.', perRank: '−4% em todas as recargas', per: { cdr: .04 } },
    { id: 'c_f5', branch: 'fe', name: 'Muralha da Fé', glyph: '⟡', max: 3, reqs: ['c_f2'], ang: C.b3, r: 190, description: 'Sustentar a barreira custa menos fé e ela se desgasta menos.', perRank: '−25% de consumo · −10% de desgaste', per: { shieldDrain: -.25, blockCost: -.1 } },
    { id: 'c_f6', branch: 'fe', name: 'Contrição', glyph: '◌', max: 3, reqs: ['c_f3', 'c_f4'], ang: C.k1, r: 285, description: 'Humildade: cada prece custa menos fé.', perRank: '−6% no custo de fé', per: { costMult: -.06 } },
    { id: 'c_f7', branch: 'fe', name: 'Escudo dos Mártires', glyph: '✠', max: 1, reqs: ['c_f4', 'c_f5'], ang: C.k2, r: 285, keystone: true, description: 'Cada golpe aparado pela barreira devolve fé e vida, e ela volta muito mais cedo.', perRank: 'Bloqueio devolve 5 de fé e 5 de vida · −30% de recarga do escudo', once: { blockMana: 5, blockHeal: 5, shieldCd: -.3 } },
  ], [
    ['Dano sagrado', s => pct(s.damage - 1)], ['Poder de cura', s => pct(s.heal - 1)], ['Crítico', s => `${Math.round(s.crit * 100)}% · ×${s.critDmg.toFixed(2)}`],
    ['Fé máxima', s => `${100 + s.manaMax}`], ['Regeneração', s => `${s.regen.toFixed(1)}/s`], ['Recarga', s => pct(-s.cdr)],
    ['Barreira', s => pct(s.shieldHp - 1)], ['Resistência', s => pct(s.resist)], ['Vida máxima', s => `${s.maxHealth + 25}`],
  ]),
};

/** A habilidade está liberada para esta classe com estes níveis? (habilidades sem nó na árvore estão sempre liberadas) */
export function isUnlocked(cls: HeroClass, ranks: Record<string, number>, spell: SpellId) {
  const node = SKILL_TREES[cls].nodes.find(n => n.unlock === spell);
  return !node || (ranks[node.id] ?? 0) >= 1;
}
/** Nó que libera a habilidade (para a dica "desbloqueie em …"). */
export function unlockNode(cls: HeroClass, spell: SpellId) { return SKILL_TREES[cls].nodes.find(n => n.unlock === spell) ?? null; }

export type ProgressionSnapshot = {
  level: number; experience: number; nextLevelXp: number; skillPoints: number;
  ranks: Record<string, number>; stats: Stats; inventory: InventorySnapshot; cls: HeroClass;
};

const MAX_RANK = 5;

/** Persistent-for-this-run XP, drops, and talent modifiers. */
export class PlayerProgression {
  level = 1;
  experience = 0;
  nextLevelXp = 100;
  skillPoints = 0;
  ranks: Record<string, number> = { root: 1 };
  cls: HeroClass = 'maga';
  inventory: InventorySnapshot = { echoFragment: 0, sentinelCore: 0, wolfPelt: 0, banditToken: 0, demonAsh: 0, moonFang: 0, ancientSigil: 0, demonHeart: 0 };
  /** Atributos derivados dos talentos (recalculados quando os talentos mudam). */
  stats: Stats = this.computeStats();

  get tree() { return SKILL_TREES[this.cls]; }

  /** Troca a árvore de talentos para a classe (os pontos já gastos voltam). */
  setClass(cls: HeroClass) {
    if (cls === this.cls) return;
    this.respec(); this.cls = cls; this.stats = this.computeStats();
  }

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
  reachable(id: string) { const n = this.tree.byId[id]; return !!n && n.reqs.every(r => this.rank(r) >= 1); }
  canUpgrade(id: string) { const n = this.tree.byId[id]; return !!n && id !== 'root' && this.skillPoints >= 1 && this.rank(id) < n.max && this.reachable(id); }
  unlocked(spell: SpellId) { return isUnlocked(this.cls, this.ranks, spell); }

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
    const s: Stats = { ...BASE_STATS };
    const nodes = SKILL_TREES[this.cls ?? 'maga'].nodes;
    for (const n of nodes) {
      const r = this.ranks?.[n.id] ?? 0; if (r <= 0) continue;
      if (n.per) for (const k of Object.keys(n.per) as StatKey[]) s[k] += n.per[k]! * r;
      if (n.once) for (const k of Object.keys(n.once) as StatKey[]) s[k] += n.once[k]!;
    }
    for (const k of Object.keys(STAT_LIMITS) as StatKey[]) { const [lo, hi] = STAT_LIMITS[k]!; s[k] = Math.min(hi, Math.max(lo, s[k])); }
    return s;
  }

  /** Restaura o progresso de um save local (a classe já deve ter sido aplicada com setClass). */
  restore(d: { level: number; experience: number; nextLevelXp: number; skillPoints: number; ranks: Record<string, number>; inventory: InventorySnapshot }) {
    this.level = d.level; this.experience = d.experience; this.nextLevelXp = d.nextLevelXp; this.skillPoints = d.skillPoints;
    // só nós que existem na árvore desta classe, no máximo do nível de cada um
    const tree = this.tree.byId; this.ranks = { root: 1 };
    for (const [id, r] of Object.entries(d.ranks)) if (tree[id] && id !== 'root') this.ranks[id] = Math.min(tree[id].max, Math.max(0, Math.floor(r)));
    for (const k of Object.keys(this.inventory) as (keyof InventorySnapshot)[]) this.inventory[k] = Math.max(0, Math.floor(Number(d.inventory?.[k] ?? 0)));
    this.stats = this.computeStats();
  }

  damageMultiplier() { return this.stats.damage; }
  /** Dano dos golpes físicos (ataque básico e técnicas do guerreiro). */
  meleeMultiplier() { return this.stats.melee; }
  sizeMultiplier() { return this.stats.size; }
  manaCost(baseCost: number) { return Math.max(1, Math.ceil(baseCost * this.stats.costMult)); }
  /** Sorteia crítico: devolve o multiplicador (1 ou critDmg). */
  rollCrit() { return Math.random() < this.stats.crit ? this.stats.critDmg : 1; }
  snapshot(): ProgressionSnapshot {
    return { level: this.level, experience: this.experience, nextLevelXp: this.nextLevelXp, skillPoints: this.skillPoints, ranks: { ...this.ranks }, stats: { ...this.stats }, inventory: { ...this.inventory }, cls: this.cls };
  }
}
export { MAX_RANK };
