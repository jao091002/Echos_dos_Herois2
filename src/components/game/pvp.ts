import * as THREE from 'three';

/* ============================================================================
 *  PvP — combate entre jogadores com FLAG GLOBAL
 *
 *  Cada jogador liga/desliga o PvP (tecla K). Só há dano entre dois jogadores com o flag ligado e que NÃO estão
 *  no mesmo grupo. Ligar demora PVP_ARM_SECS; desligar exige PVP_DISARM_SECS sem combate PvP (não dá para fugir
 *  de uma luta desligando o flag).
 *
 *  Autoridade: a VÍTIMA aplica o dano (cada jogador já é dono da própria vida). O atacante detecta o acerto na
 *  tela dele e envia `phit`; quem recebe valida (flag dos dois, grupo, distância com tolerância de lag e taxa de
 *  dano) e só então aplica esquiva, escudo e resistência como num golpe de inimigo.
 * ========================================================================== */

/** Dano entre jogadores é reduzido (as habilidades foram balanceadas contra inimigos). */
export const PVP_DAMAGE_MULT = .6;
export const PVP_ARM_SECS = 5;
export const PVP_DISARM_SECS = 10;
/** Raio e altura da cápsula de acerto de um jogador (pés em pos.y). */
export const PLAYER_HIT_RADIUS = .45;
export const PLAYER_HIT_LOW = .3, PLAYER_HIT_HIGH = 1.65;
/** XP por derrotar um jogador. */
export const PVP_KILL_XP = 15;

/** Pode `a` ferir `b`? Os dois com PvP ligado e fora do mesmo grupo. */
export function canHarm(aPvp: boolean, bPvp: boolean, sameParty: boolean) { return aPvp && bPvp && !sameParty; }

const tmpSeg = new THREE.Line3(), tmpLo = new THREE.Vector3(), tmpHi = new THREE.Vector3(), tmpC = new THREE.Vector3();
/** Distância de um ponto à cápsula (eixo vertical) de um jogador cujos pés estão em feet. Negativa = dentro. */
export function capsuleDistance(feet: THREE.Vector3, point: THREE.Vector3) {
  tmpLo.set(feet.x, feet.y + PLAYER_HIT_LOW, feet.z); tmpHi.set(feet.x, feet.y + PLAYER_HIT_HIGH, feet.z);
  tmpSeg.set(tmpLo, tmpHi).closestPointToPoint(point, true, tmpC);
  return tmpC.distanceTo(point) - PLAYER_HIT_RADIUS;
}
/** Distância entre um segmento e a cápsula de um jogador; devolve também o ponto de contato no segmento. */
export function segmentCapsuleDistance(feet: THREE.Vector3, from: THREE.Vector3, to: THREE.Vector3, out: THREE.Vector3) {
  // amostra o eixo da cápsula em 3 alturas: suficiente para golpes e projéteis (corpo ~1,35 m)
  let best = Infinity; const seg = tmpSeg.set(from, to);
  for (const h of [PLAYER_HIT_LOW, (PLAYER_HIT_LOW + PLAYER_HIT_HIGH) / 2, PLAYER_HIT_HIGH]) {
    tmpC.set(feet.x, feet.y + h, feet.z);
    const contact = seg.closestPointToPoint(tmpC, true, tmpLo), d = contact.distanceTo(tmpC);
    if (d < best) { best = d; out.copy(contact); }
  }
  return best - PLAYER_HIT_RADIUS;
}

/**
 * Validação do lado da vítima. Guarda as próprias posições recentes (compensação de lag: o atacante viu a vítima
 * um pouco no passado) e um orçamento de dano por atacante (impede mensagens forjadas ou repetidas).
 */
export class PvpGuard {
  /** Golpe isolado acima disso é recusado (maior habilidade com árvore cheia, crítico e Brado fica abaixo). */
  static readonly MAX_HIT = 420;
  /** Orçamento de dano por atacante: recarga por segundo e reserva máxima. */
  static readonly RATE = 320;
  static readonly BURST = 700;
  /** Janela de histórico (ms) e tolerância extra (m) da posição do ponto de impacto. */
  static readonly HISTORY_MS = 600;
  static readonly SLACK = 2.4;
  /** Alcance máximo plausível entre atacante e vítima (projéteis/raios) + folga de lag. */
  static readonly MAX_RANGE = 52;

  private history: { t: number; x: number; y: number; z: number }[] = [];
  private budget = new Map<string, { b: number; t: number }>();
  private readonly v = new THREE.Vector3();

  /** Chamado todo quadro com a posição (pés) do jogador local. */
  record(now: number, feet: THREE.Vector3) {
    const h = this.history, last = h[h.length - 1];
    if (!last || now - last.t > 33) h.push({ t: now, x: feet.x, y: feet.y, z: feet.z });
    while (h.length && now - h[0].t > PvpGuard.HISTORY_MS) h.shift();
  }

  /**
   * Aceita o golpe? point = ponto de impacto que o atacante viu; attacker = posição atual do atacante na nossa tela.
   * Devolve o motivo da recusa (para depuração) ou null.
   */
  check(now: number, from: string, damage: number, point: THREE.Vector3, radius: number, attacker: THREE.Vector3 | null): string | null {
    if (!Number.isFinite(damage) || damage <= 0) return 'dano inválido';
    if (damage > PvpGuard.MAX_HIT) return 'dano acima do teto';
    if (!attacker) return 'atacante desconhecido';
    const h = this.history; if (!h.length) return 'sem histórico';
    const cur = h[h.length - 1];
    if (attacker.distanceTo(this.v.set(cur.x, cur.y, cur.z)) > PvpGuard.MAX_RANGE) return 'longe demais';
    // impacto perto de alguma posição recente da vítima (cápsula + raio do golpe + folga de lag)
    const reach = Math.min(radius, 6) + PvpGuard.SLACK;
    if (!h.some(p => capsuleDistance(this.v.set(p.x, p.y, p.z), point) <= reach)) return 'impacto fora do corpo';
    // orçamento de dano por atacante
    const e = this.budget.get(from) ?? { b: PvpGuard.BURST, t: now };
    e.b = Math.min(PvpGuard.BURST, e.b + (now - e.t) / 1000 * PvpGuard.RATE); e.t = now;
    if (damage > e.b) { this.budget.set(from, e); return 'excesso de dano'; }
    e.b -= damage; this.budget.set(from, e);
    return null;
  }
  forget(id: string) { this.budget.delete(id); }
}

/**
 * Dano PvP com teto suave: golpes leves valem 60%, a parte acima de 40 vale só 35%. Habilidades enormes contra
 * inimigos (Vollzanbel 110, Julgamento 64) não apagam um jogador de uma vez; o combate dura mais e premia esquiva.
 */
export function pvpDamage(d: number) { return PVP_DAMAGE_MULT * Math.min(d, 40) + .35 * Math.max(0, d - 40); }
