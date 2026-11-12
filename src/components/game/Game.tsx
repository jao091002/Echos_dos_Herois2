'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AmbientAudio } from './audio';
import { CombatSystem, type GrabHandle } from './combat';
import { createHero, type HeroPose } from './hero';
import { MagicSystem, COST, SPELL_IDS, type SpellId } from './magic';
import { CLASSES, CLASS_LIST, BODY_COLORS, JOINT_COLORS, DEFAULT_APPEARANCE, loadChoice, saveChoice, type HeroClass, type HeroChoice, type ClassDef } from './classes';
import { PlayerProgression, LOOT_INFO, SKILL_TREES, isUnlocked, unlockNode, type LootItemId, type ProgressionSnapshot, type SkillNode } from './progression';
import { PlayerMotor, ThirdPersonCamera } from './simulation';
import { PerfMonitor } from './perf-monitor';
import { QuestGiver, type QuestStage } from './npc';
import { NetClient, r2, defaultServer, listRooms, OFFICIAL_SERVER, isP2P, type NetMsg, type RoomInfo } from './net';
import { RemotePlayers, type RemoteState } from './remote-players';
import { readSave, writeSave, exportSave, importSave, type SaveData } from './save';

/** Missão do Aldren: abater lobos perto do caminho do marco. */
const WOLF_QUEST_GOAL = 3;
type WolfQuest = { stage: QuestStage; kills: number; reward: number };
import { createWorld, setWorldQuality, terrainHeight, updateWorld, updateDayCycle, pondDist, streamDist, POND, type WorldParts } from './world';

type GameStatus = { area: string; discovered: number };
type Quality = 'Baixa' | 'Média' | 'Alta';
type Panel = 'main' | 'options' | 'controls' | 'hero' | 'multi';
type CombatHud = {
  mana: number; maxMana: number; health: number; maxHealth: number; alive: number; shield: boolean; flying: boolean; blocks: number; brado: boolean; bencao: boolean; despertar: boolean;
  cooldowns: Record<SpellId, number>; cdFrac: Record<SpellId, number>;
};
/** Quanto a câmera "entra na mira": cheio ao carregar/disparar o Zoltraak. */
const playingAim = (magic: { charging: boolean; beamActive: boolean; chargeLevel: number }) => magic.beamActive ? 1 : magic.charging ? .45 + magic.chargeLevel * .55 : 0;
const NO_CD = Object.fromEntries(SPELL_IDS.map(id => [id, 0])) as Record<SpellId, number>;

/** Ícones vetoriais das magias e atalhos (herdam a cor do texto). */
const ICONS: Record<SpellId | 'journal' | 'help', ReactNode> = {
  zoltraak: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7.5" cy="12" r="4" fill="currentColor" /><circle cx="7.5" cy="12" r="5.8" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M12.5 10.4h9M12.5 13.6h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M18 6.2v1.6M17.2 7h1.6M15.5 16.8v1.4M14.8 17.5h1.4" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" /></svg>,
  vollzanbel: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.8 3.6 5.6 5.6 5.6 11.3a5.6 5.6 0 0 1-11.2 0c0-2.8 1.7-4.7 2.7-6.5.2 1.9 1 2.9 2 3.1-.1-3 -.8-4.9.9-7.9z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M12 20.5a2.6 2.6 0 0 1-2.6-2.6c0-1.6 1.6-2.4 2.2-4 .9 1.5 3 2.3 3 4a2.6 2.6 0 0 1-2.6 2.6z" fill="currentColor" /></svg>,
  judradjim: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 5.5 13.2h5.6L9.4 22l9.1-12.4h-5.8L14.6 2z" fill="currentColor" /></svg>,
  shield: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.4 20.3 7.2v9.6L12 21.6l-8.3-4.8V7.2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M12 6.8 16.3 9.3v5.4L12 17.2l-4.3-2.5V9.3z" fill="currentColor" opacity=".55" /></svg>,
  flight: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5c-8.3.2-13.8 5-15 12.7l-2 4.3 4.2-2c7.6-1.3 12.6-6.8 12.8-15z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M6.5 17.5 16 8M9 15h4.5M11.5 12.2h3.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>,
  // guerreiro
  golpe: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 3 9 13.5l1.5 1.5L21 4.5V3z" fill="currentColor" /><path d="M7 12.5 11.5 17M8.2 15.8 5 19M4 18l2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M3.5 9.5A9 9 0 0 1 14.5 20.5" fill="none" stroke="currentColor" strokeWidth="1" opacity=".6" /></svg>,
  redemoinho: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 1 1-7.4 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 8a4 4 0 1 1-3.7 2.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="m3 7 1.6 2.2L7 8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /></svg>,
  agarrao: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 13V7.5a1.4 1.4 0 0 1 2.8 0V12M9.8 11V6a1.4 1.4 0 0 1 2.8 0v5M12.6 11V6.6a1.4 1.4 0 0 1 2.8 0V12M15.4 12V9a1.4 1.4 0 0 1 2.8 0v5.5a6 6 0 0 1-6 6h-.6a6 6 0 0 1-5-2.7L4 14.6a1.4 1.4 0 0 1 2.2-1.7L7 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 21.5h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1.6 1.4" /></svg>,
  fenda: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M9 6h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M2 21l4-3 3 2 3-4 3 3 3-2 4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M5 15l1.5 1M18 14l-1.5 1.4M12 13v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  chuvaEstelar: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3 13 9M14 2l-4 4M21 7l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><circle cx="9.5" cy="12.5" r="2.4" fill="currentColor" /><circle cx="15" cy="17" r="1.6" fill="currentColor" /><circle cx="6" cy="18.5" r="1.3" fill="currentColor" /><ellipse cx="11" cy="21" rx="8" ry="1.6" fill="none" stroke="currentColor" strokeWidth="1" /></svg>,
  passoArcano: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeDasharray="1.6 1.2" /><circle cx="18.5" cy="12" r="3.2" fill="currentColor" /><path d="M8.5 12h6M12 9l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  tresLancas: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20 15 9M8 21l9-11M2 16l11-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M15 9l4.5-5.5L17 9.5zM17 10l4.5-4-3.5 5.5zM13 7l3.5-5-1 5.5z" fill="currentColor" /></svg>,
  curaEquipe: <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="17" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.3" /><ellipse cx="12" cy="17" rx="6" ry="2.3" fill="currentColor" opacity=".35" /><path d="M10.6 4h2.8v3.4h3.4v2.8h-3.4v3.4h-2.8v-3.4H7.2V7.4h3.4z" fill="currentColor" /></svg>,
  despertar: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h6v10H5zM13 8h6v10h-6z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M12 2v3M5 4l2 2M19 4l-2 2M2 10h2M20 10h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M7 11h2M7 13.5h2M15 11h2M15 13.5h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>,
  lancaSagrada: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21 17 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M15 4h5v5l-3 1-3-3z" fill="currentColor" /><path d="M5 15l4 4M3 13l2 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".7" /></svg>,
  santuario: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19a9 9 0 0 1 18 0z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M12 7v8M9 10.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M2 21h20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  investida: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6h6l3 6-3 6h-6l3-6z" fill="currentColor" /><path d="M3 9h7M2 12h8M3 15h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  brado: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3l6-4v13l-6-4H4z" fill="currentColor" /><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  // clérigo
  julgamento: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2h4v13h-4z" fill="currentColor" opacity=".85" /><ellipse cx="12" cy="18.5" rx="8" ry="2.6" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M5 13l2 1.5M19 13l-2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  cura: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M11 7h2v4h4v2h-4v4h-2v-4H7v-2h4z" fill="currentColor" opacity=".6" /></svg>,
  consagracao: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.3" /><circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.6" /><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.2" /></svg>,
  bencao: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M12 7.5v8M8.5 11h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  journal: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h9.5a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M5 17a3 3 0 0 1 3-3h9.5M9 8h5M9 10.6h3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  help: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="12" cy="16.9" r="1" fill="currentColor" /></svg>,
};
/** Descrição curta de cada habilidade (lista de controles e dicas). */
const ABILITY_HINT: Record<SpellId, string> = {
  zoltraak: 'segure para carregar', vollzanbel: 'bola de fogo', judradjim: 'relâmpago', shield: 'segure (−3/s)', flight: 'liga / desliga o voo',
  golpe: 'corte pesado à frente', redemoinho: 'giro que fere em volta', agarrao: 'avança, agarra e arrasta o inimigo no chão', fenda: 'erupções de terra em linha à frente', investida: 'avança atravessando inimigos', brado: '+35% de dano e −25% de dano recebido por 8 s',
  julgamento: 'coluna de luz no alvo', cura: 'recupera 35% da vida', consagracao: 'solo sagrado: fere e cura por 6 s', bencao: 'regenera vida por 10 s', lancaSagrada: 'feixe de luz que atravessa a linha', santuario: 'domo: −35% de dano e cura dentro',
  chuvaEstelar: 'estrelas caem sobre a área mirada', passoArcano: 'teletransporte curto na direção da mira',
  tresLancas: 'três lanças de luz que explodem no primeiro inimigo (alcance 22 m)', curaEquipe: 'selo verde no chão: cura 25% + 5 de vida/s por 6 s', despertar: 'remove efeitos negativos · +25% de dano, −20% de dano recebido e +20% de velocidade por 5 s',
};
const WEAPON_NAME = { staff: 'cajado', axe: 'machado', mace: 'maça', book: 'livro' } as const;
/** Artigo da arma (o cajado, o machado, a maça, o livro). */
const WEAPON_ART = { staff: 'o', axe: 'o', mace: 'a', book: 'o' } as const;
const controlsFor = (def: ClassDef): [string[], string][] => [
  [['W', 'A', 'S', 'D'], 'Mover'], [['Cursor'], 'Mirar (mouse livre)'], [['Arrastar'], 'Girar a câmera (botão esq./dir.)'], [['Roda'], 'Zoom da câmera'], [['Shift'], 'Alternar Shift Lock'],
  [['Alt'], def.weapon === 'staff' ? 'Correr / voar rápido' : 'Correr'], [['Espaço'], def.weapon === 'staff' ? 'Pular / subir voando' : 'Pular'], ...(def.weapon === 'staff' ? [[['Ctrl'], 'Descer voando'] as [string[], string]] : []),
  ...def.abilities.map(a => [[a.key], `${a.label} · ${ABILITY_HINT[a.spell]}`] as [string[], string]),
  [['Clique dir.'], `Golpe com ${WEAPON_ART[def.weapon]} ${WEAPON_NAME[def.weapon]} (sem arrastar)`], [['X'], 'Esquiva'], [['T'], `Guardar / sacar ${WEAPON_ART[def.weapon]} ${WEAPON_NAME[def.weapon]}`], [['V'], 'Postura defensiva'],
  [['E'], 'Inventário'], [[','], 'Habilidades'], [['P'], 'Jogadores e grupo (multijogador)'], [['G'], 'Ouvir o Marco'], [['J'], 'Diário de viagem'], [['Esc'], 'Pausar'],
];

type HudStore = { get: () => CombatHud; set: (v: CombatHud) => void; subscribe: (l: () => void) => () => void };
function createHudStore(initial: CombatHud): HudStore {
  let value = initial; const listeners = new Set<() => void>();
  return { get: () => value, set: v => { value = v; listeners.forEach(l => l()); }, subscribe: l => { listeners.add(l); return () => { listeners.delete(l); }; } };
}
const useHud = (store: HudStore) => useSyncExternalStore(store.subscribe, store.get, store.get);
const COSTS = COST;
function HudBars({ store, resource }: { store: HudStore; resource: string }) {
  const h = useHud(store);
  return <>
    <div className="bar bar-health" aria-label={`Vida ${h.health}`}><i style={{ width: `${Math.min(100, h.health / h.maxHealth * 100)}%` }} /><span>VIDA</span><b>{h.health}</b></div>
    <div className="bar bar-mana" aria-label={`${resource} ${h.mana}`}><i style={{ width: `${Math.min(100, h.mana / h.maxMana * 100)}%` }} /><span>{resource}</span><b>{h.mana}</b></div>
  </>;
}
function HudPills({ store }: { store: HudStore }) {
  const h = useHud(store);
  return <>
    {h.shield && <span className="pill">⬡ Escudo{h.blocks > 0 ? ` · ${h.blocks} bloqueios` : ''}</span>}
    {h.flying && <span className="pill">➶ Voo</span>}
    {h.brado && <span className="pill">⚔ Brado de Guerra</span>}
    {h.bencao && <span className="pill">✚ Bênção</span>}
    {h.despertar && <span className="pill">✦ Despertar</span>}
  </>;
}
function EnemiesLeft({ store }: { store: HudStore }) {
  const h = useHud(store);
  return <div className="enemies-left"><b>{h.alive}</b> ecos hostis nos campos</div>;
}
function SpellSlot({ store, spell, hotkey, label, resource, signature, cast, lockedBy }: { store: HudStore; spell: SpellId; hotkey: string; label: string; resource: string; signature: boolean; cast: { current: (spell: SpellId) => void }; lockedBy?: string | null }) {
  const h = useHud(store), cd = h.cooldowns[spell], lacking = h.mana < COSTS[spell];
  const locked = !!lockedBy;
  return <button type="button" className={`slot-btn ${!locked && cd > 0 ? 'cooling' : ''} ${!locked && lacking ? 'no-mana' : ''} ${signature ? 'signature' : ''} ${locked ? 'locked' : ''}`}
    style={{ '--cd': locked ? 0 : h.cdFrac[spell] } as CSSProperties}
    title={locked ? `${label} · bloqueada — desbloqueie “${lockedBy}” na árvore de habilidades (,)` : `${label} · ${ABILITY_HINT[spell]} · ${COSTS[spell]}${spell === 'zoltraak' ? '+' : ''} de ${resource.toLowerCase()}${cd > 0 ? ` · recarga ${cd.toFixed(1)} s` : ''}`}
    onClick={() => cast.current(spell)}>
    <span className="slot-face">{ICONS[spell]}{locked ? <span className="slot-lock" aria-label="bloqueada">⚿</span> : cd > 0 && <span className="slot-cd">{cd.toFixed(1)}</span>}</span>
    <span className="slot-key">{hotkey}</span>
    <span className="slot-cost">{COSTS[spell]}{spell === 'zoltraak' ? '+' : ''}</span>
    <span className="slot-name">{label}</span>
  </button>;
}

export default function Game() {
  const hostRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const audioRef = useRef<AmbientAudio | null>(null);
  const cameraRigRef = useRef<ThirdPersonCamera | null>(null);
  const qualityTargetsRef = useRef<{ scene: THREE.Scene; sun: THREE.DirectionalLight; composer: EffectComposer; bloom: UnrealBloomPass } | null>(null);
  const progressionRef = useRef<PlayerProgression | null>(null);
  const uiOpenRef = useRef(false);
  const modalFlagsRef = useRef({ help: false, quest: false, inventory: false, skills: false, players: false });
  const castSpellRef = useRef<() => void>(() => {});
  const castAbilityRef = useRef<(spell: SpellId) => void>(() => {});
  const zoltraakRef = useRef({ start: () => {}, release: () => {} });
  const shieldRef = useRef({ start: () => {}, release: () => {} });
  const shieldBarRef = useRef<HTMLDivElement>(null);
  const interactRef = useRef<() => void>(() => {});
  // diálogo com o NPC: ações expostas pelo efeito do jogo (aceitar / entregar / fechar)
  const npcActionsRef = useRef({ accept: () => {}, turnIn: () => {}, close: () => {} });
  const npcDialogRef = useRef(false);
  const attackRef = useRef<() => void>(() => {});
  const dodgeRef = useRef<() => void>(() => {});
  const compassNeedleRef = useRef<HTMLSpanElement>(null);
  const compassPinRef = useRef<HTMLSpanElement>(null);
  const touchKnobRef = useRef<HTMLSpanElement>(null);
  const aimReticleRef = useRef<HTMLDivElement>(null);
  const chargeRef = useRef<HTMLDivElement>(null);
  const fpsRef = useRef<HTMLDivElement>(null);
  const perfPanelRef = useRef<HTMLPreElement>(null);
  const shellRef = useRef<HTMLElement>(null);
  /** Nomes sobre a cabeça dos outros jogadores (um por avatar remoto, posicionados a cada quadro). */
  const nameplatesRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const damageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef(true);
  const hasStartedRef = useRef(false);
  const qualityRef = useRef<Quality>('Média');
  const dynamicResRef = useRef(true);
  const basePixelRatioRef = useRef(1);
  const applyPixelRatioRef = useRef<() => void>(() => {});
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touchPointerRef = useRef<number | null>(null);
  const touchMoveRef = useRef({ forward: 0, side: 0 });
  const touchSprintRef = useRef(false);
  const touchJumpRef = useRef(false);
  const [status, setStatus] = useState<GameStatus>({ area: 'Campos da Aurora', discovered: 0 });
  const [hint, setHint] = useState('');
  const [nearLandmark, setNearLandmark] = useState(false);
  const [muted, setMuted] = useState(false);
  const [screen, setScreen] = useState<'title' | 'playing'>('title');
  const [titlePanel, setTitlePanel] = useState<Panel>('main');
  const [pausePanel, setPausePanel] = useState<Panel>('main');
  const [ready, setReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [areaBanner, setAreaBanner] = useState(false);
  const [dynamicRes, setDynamicRes] = useState(true);
  const [showFps, setShowFps] = useState(false);
  const [aimAssist, setAimAssist] = useState(true);
  const [dayLabel, setDayLabel] = useState('06:00');
  const [help, setHelp] = useState(false);
  const [questOpen, setQuestOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [shiftLocked, setShiftLocked] = useState(false);
  // dispositivos modestos começam no Baixa
  const [quality, setQuality] = useState<Quality>(() => typeof navigator !== 'undefined' && ((navigator.hardwareConcurrency ?? 8) <= 4 || /Mobi|Android/i.test(navigator.userAgent)) ? 'Baixa' : 'Média');
  const [sensitivity, setSensitivity] = useState(5);
  const [gameError, setGameError] = useState('');
  // HUD de combate (mana, vida, recargas) num store próprio: muda várias vezes por segundo em combate e só os
  // componentes do HUD re-renderizam — antes o componente inteiro do jogo (menus, árvore etc.) era refeito a cada mudança
  const hudStoreRef = useRef<HudStore | null>(null);
  if (!hudStoreRef.current) hudStoreRef.current = createHudStore({ mana: 100, maxMana: 100, health: 100, maxHealth: 100, alive: 7, shield: false, flying: false, blocks: 0, brado: false, bencao: false, despertar: false, cooldowns: NO_CD, cdFrac: NO_CD });
  const hudStore = hudStoreRef.current;
  const [progressionHud, setProgressionHud] = useState<ProgressionSnapshot>({ level: 1, experience: 0, nextLevelXp: 100, skillPoints: 0, ranks: { root: 1 }, cls: 'maga', stats: new PlayerProgression().stats, inventory: { echoFragment: 0, sentinelCore: 0, wolfPelt: 0, banditToken: 0, demonAsh: 0, moonFang: 0, ancientSigil: 0, demonHeart: 0 } });
  const [npcDialog, setNpcDialog] = useState(false);
  const [nearNpc, setNearNpc] = useState(false);
  const [wolfQuest, setWolfQuest] = useState<WolfQuest>({ stage: 'available', kills: 0, reward: 0 });
  // classe e aparência escolhidas na criação de personagem (lidas do armazenamento local após montar, sem divergir do SSR)
  const [heroChoice, setHeroChoice] = useState<HeroChoice>({ cls: 'maga', look: { ...DEFAULT_APPEARANCE.maga } });
  const heroChoiceRef = useRef(heroChoice); heroChoiceRef.current = heroChoice;
  const titlePanelRef = useRef<Panel>('main'); titlePanelRef.current = titlePanel;
  /** Ligado pelo efeito do jogo: aplica arma/cores no herói e ajusta vida/recurso da classe. */
  const applyChoiceRef = useRef<(c: HeroChoice) => void>(() => {});
  useEffect(() => { const c = loadChoice(); setHeroChoice(c); }, []);
  useEffect(() => { applyChoiceRef.current(heroChoice); }, [heroChoice]);
  const classDef = CLASSES[heroChoice.cls];

  /* ================= SAVE LOCAL ================= */
  const [savedGame, setSavedGame] = useState<SaveData | null>(null);
  const savedGameRef = useRef(savedGame); savedGameRef.current = savedGame;
  /** Ligados pelo efeito do jogo: monta o save a partir do estado atual / restaura um save. */
  const collectSaveRef = useRef<() => SaveData | null>(() => null);
  const loadSaveRef = useRef<(d: SaveData) => void>(() => {});
  useEffect(() => { setSavedGame(readSave()); }, []);
  const saveNow = useCallback((quiet = false) => {
    const d = collectSaveRef.current(); if (!d) return;
    if (writeSave(d)) { setSavedGame(d); if (!quiet) { setHint('Jogo salvo nesta máquina.'); setTimeout(() => setHint(''), 2200); } }
    else if (!quiet) { setHint('Não foi possível salvar (armazenamento do navegador bloqueado).'); setTimeout(() => setHint(''), 3200); }
  }, []);
  const importInputRef = useRef<HTMLInputElement>(null);
  const onImportFile = async (file: File | undefined) => {
    if (!file) return;
    const d = await importSave(file);
    if (!d) { setHint('Arquivo de save inválido.'); setTimeout(() => setHint(''), 2600); return; }
    writeSave(d); setSavedGame(d); setHint(`Save importado: ${CLASSES[d.choice.cls].name} nível ${d.progression.level}.`); setTimeout(() => setHint(''), 2600);
  };

  /* ================= MULTIJOGADOR ================= */
  const netRef = useRef<NetClient | null>(null);
  if (!netRef.current) netRef.current = new NetClient();
  const net = netRef.current;
  useSyncExternalStore(net.subscribe, net.getVersion, () => 0); // re-renderiza a interface quando a sala muda
  const [mpForm, setMpForm] = useState({ name: '', server: '', room: 'aurora', priv: false });
  const mpNameRef = useRef(''); mpNameRef.current = mpForm.name || 'Viajante';
  useEffect(() => {
    let saved: Partial<typeof mpForm> = {};
    try { saved = JSON.parse(localStorage.getItem('ecos.mp.v1') ?? '{}'); } catch { /* sem armazenamento */ }
    // endereço salvo que aponta para o próprio site (ex.: wss://…vercel.app:3210) nunca funcionou: volta ao padrão
    let server = saved.server || defaultServer();
    try { if (!isP2P(server) && new URL(server).hostname === location.hostname && location.hostname !== 'localhost') server = defaultServer(); } catch { server = defaultServer(); }
    setMpForm({ name: saved.name ?? '', server, room: saved.room ?? 'aurora', priv: !!saved.priv });
  }, []);
  const connectMp = (roomOverride?: string) => {
    const form = roomOverride ? { ...mpForm, room: roomOverride, priv: false } : mpForm;
    if (roomOverride) setMpForm(form);
    try { localStorage.setItem('ecos.mp.v1', JSON.stringify(form)); } catch { /* sem armazenamento */ }
    audioRef.current?.sfx('ui');
    void net.connect(form.server.trim(), form.room.trim() || 'aurora', form.name.trim() || 'Viajante', form.priv);
  };
  /** Salas públicas do servidor (lista do painel Multijogador, atualizada a cada 10 s enquanto aberto e offline). */
  const [rooms, setRooms] = useState<RoomInfo[] | null>(null);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const refreshRooms = useCallback(async (server: string) => {
    if (!server) return; setRoomsLoading(true);
    const list = await listRooms(server); setRooms(list); setRoomsLoading(false);
  }, []);
  const disconnectMp = () => { leaveParty(); net.close(); };
  useEffect(() => () => net.close(), [net]);
  /** Nome/classe/nível de cada jogador remoto (vem do estado que eles enviam; atualizado no HUD). */
  const [roster, setRoster] = useState<Record<string, { name: string; cls: HeroClass; hp: number; mhp: number; lvl: number }>>({});

  /* ================= GRUPO (PARTY) =================
   * O líder convida; quem aceita entra. O líder mantém a lista e a envia aos membros ('pst').
   * Efeitos: Cura em Grupo e Despertar alcançam os membros por perto, quadros de vida no HUD,
   * nomes em verde e +10% de XP por membro além de você.
   */
  type Party = { leader: string; members: string[] };
  const [party, setParty] = useState<Party | null>(null);
  const partyRef = useRef(party); partyRef.current = party;
  const [invites, setInvites] = useState<{ from: string; name: string }[]>([]);
  const [playersOpen, setPlayersOpen] = useState(false);
  const sendParty = (p: Party | null, alsoTo: string[] = []) => {
    const targets = new Set([...(p?.members ?? []), ...alsoTo]); targets.delete(net.id);
    for (const id of targets) net.sendTo(id, { t: 'pst', leader: p && p.members.includes(id) ? p.leader : '', members: p && p.members.includes(id) ? p.members : [] });
  };
  const updateParty = (p: Party | null, removed: string[] = []) => {
    const next = p && p.members.length > 1 ? p : null;
    setParty(next); partyRef.current = next; sendParty(next, [...removed, ...(p && !next ? p.members : [])]);
  };
  const invitePlayer = (id: string) => {
    const p = partyRef.current;
    if (p && p.leader !== net.id) { setHint('Só o líder do grupo pode convidar.'); setTimeout(() => setHint(''), 2200); return; }
    if (p && p.members.length >= 4) return;
    net.sendTo(id, { t: 'pinv', name: mpNameRef.current }); audioRef.current?.sfx('ui');
    setHint(`Convite enviado para ${net.peers.get(id)?.name ?? 'jogador'}.`); setTimeout(() => setHint(''), 2200);
  };
  const answerInvite = (from: string, accept: boolean) => {
    setInvites(list => list.filter(i => i.from !== from));
    if (accept && partyRef.current) leaveParty();
    net.sendTo(from, { t: accept ? 'pacc' : 'pdec', name: mpNameRef.current }); audioRef.current?.sfx('ui');
  };
  function leaveParty() {
    const p = partyRef.current; if (!p) return;
    const rest = p.members.filter(m => m !== net.id);
    if (p.leader === net.id) { if (rest.length >= 2) sendParty({ leader: rest[0], members: rest }); else sendParty(null, rest); }
    else net.sendTo(p.leader, { t: 'pleave' });
    setParty(null); partyRef.current = null;
  }
  /** Mensagens de grupo (chamado pelo efeito do jogo ao receber da rede). */
  const partyMsgRef = useRef<(m: NetMsg) => void>(() => {});
  partyMsgRef.current = m => {
    const from = m.from ?? '', p = partyRef.current, name = String(m.name ?? net.peers.get(from)?.name ?? 'Jogador');
    const note = (s: string) => { setHint(s); setTimeout(() => setHint(''), 2600); };
    if (m.t === 'pinv') { if (!invites.some(i => i.from === from)) setInvites(list => [...list.filter(i => i.from !== from), { from, name }]); audioRef.current?.sfx('ui'); }
    else if (m.t === 'pacc') {
      if (p && p.leader !== net.id) return;
      const base = p ?? { leader: net.id, members: [net.id] };
      if (base.members.length >= 4 || base.members.includes(from)) return;
      updateParty({ leader: base.leader, members: [...base.members, from] }); note(`${name} entrou no grupo.`);
    } else if (m.t === 'pdec') note(`${name} recusou o convite.`);
    else if (m.t === 'pleave') {
      if (!p || p.leader !== net.id) return;
      updateParty({ ...p, members: p.members.filter(x => x !== from) }, [from]); note(`${name} saiu do grupo.`);
    } else if (m.t === 'pst') {
      const members = (m.members as string[]) ?? [];
      if (members.includes(net.id) && members.length > 1) { const np = { leader: String(m.leader), members }; setParty(np); partyRef.current = np; }
      else if (p && (p.leader === from || !members.length)) { setParty(null); partyRef.current = null; note('O grupo foi desfeito.'); }
    }
  };
  /** Alguém saiu da sala: tira do grupo (o primeiro membro restante vira líder se o líder caiu). */
  const partyRosterRef = useRef<(ev: { type: string; id: string }) => void>(() => {});
  partyRosterRef.current = ev => {
    if (ev.type !== 'leave') return;
    if (ev.id === '*') { setParty(null); partyRef.current = null; setInvites([]); setRoster({}); return; }
    setInvites(list => list.filter(i => i.from !== ev.id));
    setRoster(r => { const n = { ...r }; delete n[ev.id]; return n; });
    const p = partyRef.current; if (!p || !p.members.includes(ev.id)) return;
    const rest = p.members.filter(x => x !== ev.id);
    const np = rest.length > 1 ? { leader: p.leader === ev.id ? rest[0] : p.leader, members: rest } : null;
    setParty(np); partyRef.current = np;
    if (np && np.leader === net.id) sendParty(np);
  };
  // painel de multijogador aberto e desconectado: busca as salas públicas agora e a cada 10 s
  const mpPanelOpen = (screen === 'title' && titlePanel === 'multi') || playersOpen;
  const mpOffline = net.status === 'offline' || net.status === 'error';
  useEffect(() => {
    if (!mpPanelOpen || !mpOffline || !mpForm.server) return;
    void refreshRooms(mpForm.server.trim());
    const id = setInterval(() => void refreshRooms(mpForm.server.trim()), 10000);
    return () => clearInterval(id);
  }, [mpPanelOpen, mpOffline, mpForm.server, refreshRooms]);

  npcDialogRef.current = npcDialog;
  uiOpenRef.current = help || questOpen || inventoryOpen || skillsOpen || paused || npcDialog || playersOpen || screen === 'title';
  titleRef.current = screen === 'title';
  qualityRef.current = quality;
  dynamicResRef.current = dynamicRes;
  modalFlagsRef.current = { help, quest: questOpen, inventory: inventoryOpen, skills: skillsOpen, players: playersOpen };

  const releaseMouse = useCallback(() => {
    if (typeof document !== 'undefined' && document.pointerLockElement) document.exitPointerLock();
    cameraRigRef.current?.setShiftLock(false);
    setShiftLocked(false);
  }, []);
  const toggleHelp = useCallback(() => { audioRef.current?.sfx('ui'); releaseMouse(); setHelp(value => !value); setQuestOpen(false); setInventoryOpen(false); setSkillsOpen(false); }, [releaseMouse]);
  const toggleQuest = useCallback(() => { audioRef.current?.sfx('ui'); releaseMouse(); setQuestOpen(value => !value); setHelp(false); setInventoryOpen(false); setSkillsOpen(false); }, [releaseMouse]);
  const toggleInventory = useCallback(() => { audioRef.current?.sfx('ui'); releaseMouse(); setInventoryOpen(value => !value); setSkillsOpen(false); setHelp(false); setQuestOpen(false); }, [releaseMouse]);
  const toggleSkills = useCallback(() => { audioRef.current?.sfx('ui'); releaseMouse(); setSkillsOpen(value => !value); setInventoryOpen(false); setHelp(false); setQuestOpen(false); setPlayersOpen(false); }, [releaseMouse]);
  /** Painel de jogadores e grupo (P). */
  const togglePlayers = useCallback(() => { audioRef.current?.sfx('ui'); releaseMouse(); setPlayersOpen(v => !v); setHelp(false); setQuestOpen(false); setInventoryOpen(false); setSkillsOpen(false); }, [releaseMouse]);
  const startJourney = useCallback(() => {
    if (!rendererRef.current) return;
    // primeira partida: com save local → continua de onde parou; sem save → criação de personagem (classe + cores)
    if (!hasStartedRef.current && titlePanelRef.current !== 'hero') {
      const save = savedGameRef.current;
      if (save) loadSaveRef.current(save);
      else { audioRef.current?.sfx('ui'); setTitlePanel('hero'); return; }
    }
    saveChoice(heroChoiceRef.current);
    setScreen('playing'); setTitlePanel('main'); setPaused(false); setPausePanel('main');
    audioRef.current?.start(); audioRef.current?.sfx('uiStart');
    if (!hasStartedRef.current) {
      hasStartedRef.current = true; setHasStarted(true); setAreaBanner(true);
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
      bannerTimerRef.current = setTimeout(() => setAreaBanner(false), 4600);
    }
    rendererRef.current.domElement.focus();
  }, []);
  const backToTitle = useCallback(() => {
    releaseMouse(); setPaused(false); setPausePanel('main'); setHelp(false); setQuestOpen(false); setInventoryOpen(false); setSkillsOpen(false);
    setScreen('title'); setTitlePanel('main');
  }, [releaseMouse]);
  const startRef = useRef(startJourney); startRef.current = startJourney;
  const toggleMute = useCallback(() => {
    setMuted(value => { audioRef.current?.setMuted(!value); return !value; });
  }, []);
  const onTouchStickMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (touchPointerRef.current !== event.pointerId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const radius = rect.width * .34;
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const length = Math.hypot(dx, dy);
    const ratio = length > radius ? radius / length : 1;
    const x = dx * ratio, y = dy * ratio;
    touchMoveRef.current = { side: x / radius, forward: -y / radius };
    if (touchKnobRef.current) touchKnobRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onTouchStickDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault(); touchPointerRef.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId); onTouchStickMove(event);
  };
  const onTouchStickUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (touchPointerRef.current !== event.pointerId) return;
    touchPointerRef.current = null; touchMoveRef.current = { forward: 0, side: 0 };
    if (touchKnobRef.current) touchKnobRef.current.style.transform = 'translate(0, 0)';
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', alpha: false });
    } catch {
      setGameError('Este navegador ou dispositivo não conseguiu iniciar o WebGL necessário para exibir o mundo 3D.');
      return;
    }
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false; // atualizado manualmente (a cada 2 quadros fora do Alta)
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute('aria-label', 'Explorar os Campos da Aurora. WASD move, clique e arraste para olhar.');
    renderer.domElement.tabIndex = 0;
    host.appendChild(renderer.domElement);
    const perf = new PerfMonitor(renderer);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#a8b7a7');
    scene.fog = new THREE.FogExp2('#a9b6a4', .0062);
    const camera = new THREE.PerspectiveCamera(49, 1, .1, 320);
    const sky = new THREE.HemisphereLight('#f0f0dc', '#52614d', 2.05); scene.add(sky);
    const sun = new THREE.DirectionalLight('#ffebca', 3.05);
    sun.position.set(-34, 48, 22); sun.castShadow = true; sun.shadow.mapSize.set(quality === 'Alta' ? 2048 : 1024, quality === 'Alta' ? 2048 : 1024);
    sun.shadow.camera.left = -48; sun.shadow.camera.right = 48; sun.shadow.camera.top = 48; sun.shadow.camera.bottom = -48; sun.shadow.bias = -.00035; scene.add(sun);
    const fill = new THREE.DirectionalLight('#c5d7da', .72); fill.position.set(25, 22, -32); scene.add(fill);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), quality === 'Alta' ? .48 : .3, .26, .84);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    const world: WorldParts = createWorld(scene);
    qualityTargetsRef.current = { scene, sun, composer, bloom };
    basePixelRatioRef.current = renderer.getPixelRatio();
    let resScale = 1;
    const applyPixelRatio = () => {
      const pr = basePixelRatioRef.current * resScale;
      renderer.setPixelRatio(pr); composer.setPixelRatio(pr); resize();
    };
    applyPixelRatioRef.current = applyPixelRatio;
    const hero = createHero(scene);
    hero.root.rotation.y = Math.PI;
    hero.root.userData.facing = Math.PI;
    let disposed = false;
    // personagem principal: Xbot puro (exemplo oficial do three.js / Mixamo), com as cores da personalização;
    // se falhar, fica o corpo procedural
    const loader = new GLTFLoader();
    // avatares dos outros jogadores (pool fixo, criado já no início: cada um tem uma luz de aura)
    const remotes = new RemotePlayers(scene, 3);
    loader.load('/models/Xbot.glb', gltf => {
      if (disposed) return;
      remotes.attachBodies(gltf); // clona antes: o herói local reaproveita a cena original
      hero.attachBody(gltf, { plain: true });
    }, undefined, () => { /* mantém o corpo procedural */ });
    const motor = new PlayerMotor(hero.root, world.colliders);
    const cameraRig = new ThirdPersonCamera(camera, world);
    cameraRigRef.current = cameraRig;
    camera.position.set(0, 3.95, 9.5); camera.lookAt(0, 1.5, 2);
    const progression = new PlayerProgression();
    progressionRef.current = progression;
    const ambient = new AmbientAudio(); audioRef.current = ambient;
    // navegadores só liberam áudio após um gesto: a primeira interação (inclusive na tela inicial) liga a trilha
    const unlockAudio = () => ambient.start();
    window.addEventListener('pointerdown', unlockAudio, { once: true }); window.addEventListener('keydown', unlockAudio, { once: true });
    let stepDist = 0, lastLevel = 1, audioTick = 0, daylightNow = 0.4;
    const keys = new Set<string>();
    const spellOrigin = new THREE.Vector3();
    const spellAim = new THREE.Vector3();
    const spellDirection = new THREE.Vector3();
    let dragging = false, previousX = 0, previousY = 0;
    let hintTimer: ReturnType<typeof setTimeout> | undefined;

    const showHint = (message: string) => {
      setHint(message);
      if (hintTimer) clearTimeout(hintTimer);
      hintTimer = setTimeout(() => setHint(''), 3100);
    };
    let elapsed = 0, reticleHitUntil = 0;
    /** Grupo: +10% de XP por membro além de você. */
    const xpBonus = () => 1 + .1 * Math.max(0, (partyRef.current?.members.length ?? 1) - 1);
    const combat = new CombatSystem(scene, amount => progression.recordExperience(Math.round(amount * xpBonus())), item => progression.addItem(item), showHint);
    const magic = new MagicSystem(scene, hero.root, combat, world.blockers, progression, () => { reticleHitUntil = elapsed + .28; });
    /** Classe atual (definida na criação de personagem). */
    const cls = () => CLASSES[heroChoiceRef.current.cls];
    const abilityFor = (key: string) => cls().abilities.find(a => a.key.toLowerCase() === key);
    applyChoiceRef.current = c => {
      const def = CLASSES[c.cls];
      hero.setWeapon(def.weapon); hero.setAppearance(c.look);
      // cada classe tem a sua árvore de talentos (trocar de classe devolve os pontos)
      if (progression.cls !== c.cls) { progression.setClass(c.cls); setProgressionHud(progression.snapshot()); }
      // guerreiro apara com o próprio machado; maga e clérigo usam a muralha arcana
      magic.setShieldStyle(def.weapon === 'axe' ? 'physical' : 'arcane', hero.shieldPoint);
      if (def.weapon !== 'staff' && magic.flying) magic.cast('flight', hero.root.position, spellDirection, hero.root.position); // só a maga voa
      combat.health = Math.min(combat.health, combat.maxHealth);
    };
    applyChoiceRef.current(heroChoiceRef.current);
    magic.setStaffTip(hero.spellPoint);
    magic.onSfx = (name, v) => ambient.sfx(name, v);
    // Despertar: remove efeitos negativos (atordoamento do golpe recebido; futuros efeitos entram aqui)
    magic.onCleanse = () => { hitUntil = 0; landUntil = 0; };
    combat.onSfx = (name, v) => ambient.sfx(name, v);

    /* ---- NPC Aldren e a missão dos lobos (ao lado do caminho, à esquerda do ponto de partida) */
    const npc = new QuestGiver(scene, -3.4, -1.6, Math.atan2(0 - -3.4, 2 - -1.6), world.colliders);
    npc.load();
    combat.setColliders(world.colliders); // inimigos colidem com árvores, pedras, construções e o NPC
    const quest: WolfQuest = { stage: 'available', kills: 0, reward: 0 };
    const publishQuest = () => setWolfQuest({ ...quest });
    let isNearNpc = false;
    /** XP que leva exatamente a 2 níveis acima do atual (o que falta para o próximo + o nível seguinte inteiro). */
    const twoLevelXp = () => (progression.nextLevelXp - progression.experience) + (100 + progression.level * 50);
    combat.onKill = kind => {
      if (kind !== 'wolf' || quest.stage !== 'active') return;
      quest.kills = Math.min(WOLF_QUEST_GOAL, quest.kills + 1);
      if (quest.kills >= WOLF_QUEST_GOAL) {
        quest.stage = 'ready'; npc.setStage('ready');
        showHint(`Lobos abatidos ${quest.kills}/${WOLF_QUEST_GOAL} · volte até ${npc.name}`);
        ambient.sfx('ui');
      } else showHint(`Lobos abatidos ${quest.kills}/${WOLF_QUEST_GOAL}`);
      publishQuest();
    };
    const talkToNpc = () => {
      if (!isNearNpc || uiOpenRef.current || combat.health <= 0) return;
      if (magic.flying) { showHint(`Pouse para falar com ${npc.name}.`); return; }
      ambient.start(); ambient.sfx('ui');
      keys.clear();
      if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
      shiftLockActive = false; cameraRig.setShiftLock(false); setShiftLocked(false);
      // a heroína vira para o NPC
      hero.root.userData.facing = Math.atan2(npc.position.x - hero.root.position.x, npc.position.z - hero.root.position.z);
      if (quest.stage === 'ready') quest.reward = twoLevelXp();
      publishQuest();
      npc.setTalking(true);
      setNpcDialog(true);
    };
    npcActionsRef.current = {
      accept: () => {
        if (quest.stage !== 'available') return;
        quest.stage = 'active'; quest.kills = 0; npc.setStage('active'); publishQuest();
        setNpcDialog(false); npc.setTalking(false); npc.play('point');
        ambient.sfx('ui');
        showHint(`Missão aceita · abata ${WOLF_QUEST_GOAL} lobos na mata ao norte`);
      },
      turnIn: () => {
        if (quest.stage !== 'ready') return;
        const reward = twoLevelXp(), before = progression.level;
        progression.recordExperience(reward);
        quest.stage = 'done'; quest.reward = reward; npc.setStage('done'); publishQuest();
        setNpcDialog(false); npc.setTalking(false); npc.play('cheer');
        showHint(`Missão concluída · +${reward} XP · nível ${before} → ${progression.level}`);
      },
      close: () => { setNpcDialog(false); npc.setTalking(false); },
    };
    // compila todos os shaders durante o carregamento (sem engasgos no primeiro feitiço/primeiro olhar)
    // compila os shaders já para o render target do pós-processamento (onde a cena é desenhada de fato):
    // compilar para o canvas gera outra variante (tone mapping/espaço de cor) e o jogo recompilaria tudo ao jogar
    const precompile = (async: boolean) => {
      const prev = renderer.getRenderTarget(); renderer.setRenderTarget(composer.readBuffer);
      try { if (async) renderer.compileAsync(scene, camera).catch(() => {}); else renderer.compile(scene, camera); } finally { renderer.setRenderTarget(prev); }
    };
    try { magic.prewarm(renderer, camera, composer.readBuffer); precompile(false); } catch { /* compilação antecipada é só otimização */ }
    // modelos GLB chegam depois: quando todos terminarem, compila seus materiais em segundo plano (sem engasgo na 1ª aparição)
    THREE.DefaultLoadingManager.onLoad = () => { if (!disposed) precompile(true); };
    let isNearMarker = false, markerRemembered = false, shiftLockActive = false, castUntil = 0, attackUntil = 0, dodgeUntil = 0, hitUntil = 0, landUntil = 0, lastHealth = combat.health, deathTimer = 0, hudTick = 0, cycleTick = 0;
    const castAbility = (spell: SpellId) => {
      if (uiOpenRef.current || combat.health <= 0 || elapsed < cine.until || grab) return;
      if (magic.shieldActive && spell !== 'shield' && spell !== 'flight') { showHint('Solte o escudo (F) para usar outra habilidade.'); return; }
      ambient.start();
      hero.ensureStaff();
      hero.spellPoint.getWorldPosition(spellOrigin);
      cameraRig.getAimPoint(spellAim, combat.targets);
      spellDirection.copy(spellAim).sub(spellOrigin).normalize();
      if (spell === 'flight' && cls().weapon !== 'staff') return;
      if (!progression.unlocked(spell)) { const n = unlockNode(progression.cls, spell); showHint(`Habilidade bloqueada · desbloqueie “${n?.name ?? spell}” na árvore de habilidades (,)`); return; }
      const melee = cls().abilities.find(a => a.spell === spell)?.melee;
      if (melee) {
        // golpes do guerreiro: o corpo vira para a mira antes do golpe (o dano sai na direção para onde ele encara)
        hero.root.userData.facing = Math.atan2(spellAim.x - hero.root.position.x, spellAim.z - hero.root.position.z);
      }
      if (magic.cast(spell, spellOrigin, spellDirection, spellAim)) {
        hero.root.userData.castKind = spell;
        broadcastFx(spell, spellOrigin, spellDirection, spellAim); partyEffects(spell);
        if (spell === 'agarrao') { startGrab(); return; }
        if (spell === 'passoArcano') { blink(); return; }
        if (melee) {
          attackUntil = elapsed + (spell === 'redemoinho' ? .5 : .42); faceAimUntil = elapsed + .45;
          if (spell === 'investida' && motor.dodge(cameraRig.yaw, 1, 0, 0)) dodgeUntil = elapsed + .42;
          return;
        }
        castUntil = elapsed + (spell === 'vollzanbel' ? 1.35 : spell === 'judradjim' ? .95 : spell === 'shield' ? (cls().weapon === 'axe' ? 0 : .62) : .48);
        if (spell !== 'shield' && spell !== 'flight' && spell !== 'cura' && spell !== 'bencao' && spell !== 'brado' && spell !== 'consagracao' && spell !== 'curaEquipe' && spell !== 'despertar' && spell !== 'santuario') faceAimUntil = elapsed + (spell === 'judradjim' ? 1 : spell === 'vollzanbel' ? 1.4 : .6);
        if (spell === 'vollzanbel') startCinematic();
        if (aimReticleRef.current) aimReticleRef.current.classList.add('is-casting');
        if (spell === 'zoltraak') ambient.sfx('cast');
      }
    };
    const castSpell = () => castAbility('zoltraak');
    // Zoltraak carregável: segurar Q / clique esquerdo carrega; soltar dispara o raio.
    const aimNow = () => {
      hero.spellPoint.getWorldPosition(spellOrigin);
      cameraRig.getAimPoint(spellAim, combat.targets);
      spellDirection.copy(spellAim).sub(spellOrigin).normalize();
      magic.setAim(spellOrigin, spellDirection);
    };
    let zoltraakFraming = false, faceAimUntil = 0;
    const shieldBarrier = { center: new THREE.Vector3(), normal: new THREE.Vector3(), half: 1 };
    // mini-cutscene do Vollzanbel: barras de cinema, nome do feitiço, câmera baixa girando em volta da maga
    const cine = { start: -99, until: -99 };
    const startCinematic = (small = 'INVOCAÇÃO DAS CHAMAS INFERNAIS', big = 'Vollzanbel', duration = 1.3) => {
      cine.start = elapsed; cine.until = elapsed + duration;
      const cap = captionRef.current;
      if (cap) { cap.querySelector('small')!.textContent = small; cap.querySelector('strong')!.textContent = big; cap.style.animationDuration = `${duration}s`; }
      const shell = shellRef.current;
      if (shell) { shell.classList.remove('cinematic'); void shell.offsetWidth; shell.classList.add('cinematic'); }
    };

    /* ================= Agarrão do guerreiro =================
     * dash  : avança em linha reta procurando um inimigo à frente (sem acertar = só o avanço)
     * drag  : agarrou → cutscene (barras de cinema, nome do golpe, câmera lateral baixa, hit-stop no impacto);
     *         o guerreiro corre arrastando o inimigo de costas pelo chão, rasgando a terra
     * slam  : ergue o inimigo acima da cabeça e o crava no chão (cratera, onda de choque, dano alto)
     * Durante tudo isso o jogador não controla o movimento e não recebe golpes.
     */
    type Grab = { phase: 'dash' | 'drag' | 'slam'; t: number; yaw: number; dir: THREE.Vector3; mob: GrabHandle | null; tick: number; side: number; slammed: boolean; speed: number };
    let grab: Grab | null = null, hitstop = 0;
    const GRAB = { dash: .4, dashSpeed: 15, drag: 1.75, dragSpeed: 7.2, slam: .85, slamAt: .42 };
    const grabFrom = new THREE.Vector3(), grabCamPos = new THREE.Vector3(), grabLook = new THREE.Vector3();
    /** Câmera da cutscene do Agarrão (continua um instante depois de soltar, para a pancada assentar). */
    const grabCam = { until: -99, blend: 0, dir: new THREE.Vector3(0, 0, 1), side: 1 };
    const blockedAt = (x: number, z: number, r: number) => world.colliders.some(c => Math.hypot(x - c.x, z - c.z) < c.radius + r);
    /** Passo Arcano: teletransporte de até 8,5 m na direção da mira, parando antes de árvores/pedras. */
    const blink = () => {
      const from = hero.root.position.clone(), facing = (hero.root.userData.facing as number | undefined) ?? hero.root.rotation.y;
      const d = new THREE.Vector3(spellAim.x - from.x, 0, spellAim.z - from.z);
      if (d.lengthSq() < 1e-4) d.set(Math.sin(facing), 0, Math.cos(facing));
      d.normalize();
      let dist = 0; const step = .25, max = 8.5;
      while (dist + step <= max && !blockedAt(from.x + d.x * (dist + step), from.z + d.z * (dist + step), .45)) dist += step;
      const to = new THREE.Vector3(from.x + d.x * dist, 0, from.z + d.z * dist);
      to.y = magic.flying ? Math.max(from.y, terrainHeight(to.x, to.z) + .2) : terrainHeight(to.x, to.z);
      hero.root.position.copy(to); motor.velocity.set(0, 0, 0);
      hero.root.userData.facing = Math.atan2(d.x, d.z);
      magic.blinkFx(from, to); castUntil = elapsed + .3;
    };
    const startGrab = () => {
      const yaw = (hero.root.userData.facing as number | undefined) ?? hero.root.rotation.y;
      grab = { phase: 'dash', t: 0, yaw, dir: new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)), mob: null, tick: 0, side: Math.random() < .5 ? -1 : 1, slammed: false, speed: GRAB.dashSpeed };
      combat.invulnerable = true; motor.reset(); keys.delete(' ');
    };
    const endGrab = () => {
      if (!grab) return;
      grab.mob?.release(grab.dir.x * 9, grab.dir.z * 9);
      grab = null; combat.invulnerable = false; motor.reset();
      // a câmera/barras de cinema seguram mais um instante e então devolvem o controle
      if (grabCam.until > elapsed) grabCam.until = cine.until = Math.min(cine.until, elapsed + .45);
    };
    /** Avança o Agarrão (chamado no lugar do PlayerMotor). Retorna a velocidade horizontal (para a pose). */
    const stepGrab = (dt: number) => {
      const g = grab!; g.t += dt;
      const hp = hero.root.position; hero.root.userData.facing = g.yaw;
      const move = (speed: number) => {
        const nx = hp.x + g.dir.x * speed * dt, nz = hp.z + g.dir.z * speed * dt;
        if (blockedAt(nx, nz, .5)) return false;
        if (g.mob && blockedAt(nx + g.dir.x * 1.25, nz + g.dir.z * 1.25, .45)) return false; // inimigo arrastado bateu numa árvore/pedra
        hp.x = nx; hp.z = nz; hp.y = terrainHeight(nx, nz); return true;
      };
      if (g.phase === 'dash') {
        const ok = move(g.speed);
        grabFrom.set(hp.x, hp.y + 1.1, hp.z);
        const caught = combat.grabMob(grabFrom, g.dir, 1.7);
        if (caught) {
          g.mob = caught; g.phase = 'drag'; g.t = 0; g.speed = 2;
          hitstop = .14; magic.grabCatchFx(caught.position); ambient.sfx('hitEnemy', 1.2);
          caught.hit(10);
          startCinematic('FÚRIA DA VANGUARDA', 'Agarrão', GRAB.drag * (.5 + .5 * progression.stats.grab) + GRAB.slam + .45);
          grabCam.until = cine.until; grabCam.blend = 0; grabCam.dir.copy(g.dir); grabCam.side = g.side;
        } else if (!ok || g.t >= GRAB.dash) { attackUntil = elapsed + .3; endGrab(); return 0; }
        return g.speed;
      }
      const m = g.mob;
      if (!m || !m.alive) { endGrab(); return 0; }
      if (g.phase === 'drag') {
        g.speed = Math.min(GRAB.dragSpeed, g.speed + dt * 18);
        const ok = move(g.speed);
        // inimigo deitado de costas à frente, a cabeça presa na mão, raspando o chão
        const wob = Math.sin(elapsed * 19) * .06;
        m.hold(hp.x + g.dir.x * 1.25, hp.z + g.dir.z * 1.25, g.yaw + Math.PI, 1.35 + wob, .05);
        magic.dragFx(m.position, g.dir, dt, g.speed);
        g.tick -= dt; if (g.tick <= 0) { g.tick = .28; const dmg = 7 * magic.buffDamage * progression.stats.grab * progression.meleeMultiplier(); m.hit(dmg); magic.drain(dmg); }
        if (!ok || g.t >= GRAB.drag * (.5 + .5 * progression.stats.grab)) { g.phase = 'slam'; g.t = 0; if (!ok) { hitstop = .1; magic.grabCatchFx(m.position); } }
        return g.speed;
      }
      // slam: ergue (0 → slamAt) e crava no chão
      const lift = g.t < GRAB.slamAt ? Math.sin((g.t / GRAB.slamAt) * Math.PI * .5) : Math.max(0, 1 - (g.t - GRAB.slamAt) / .08);
      const reach = .9 + .45 * (1 - lift);
      m.hold(hp.x + g.dir.x * reach, hp.z + g.dir.z * reach, g.yaw + Math.PI, 1.35 - lift * .9, lift * 2.3);
      if (!g.slammed && g.t >= GRAB.slamAt) {
        g.slammed = true; hitstop = .18;
        m.hold(hp.x + g.dir.x * 1.6, hp.z + g.dir.z * 1.6, g.yaw + Math.PI, 1.5, 0);
        magic.slamFx(m.position);
        { const crit = progression.rollCrit(), dmg = 70 * magic.buffDamage * progression.stats.grab * progression.meleeMultiplier() * crit; m.hit(dmg); magic.drain(dmg); if (crit > 1) magic.critFx(m.position); }
        // a onda da pancada também atinge quem estiver perto
        grabFrom.set(m.position.x, m.position.y + 1, m.position.z); combat.damageAt(grabFrom, 2.6, 18 * magic.buffDamage);
        reticleHitUntil = elapsed + .4;
      }
      if (g.t >= GRAB.slam) endGrab();
      return 0;
    };
    const startZoltraak = () => {
      if (uiOpenRef.current || combat.health <= 0 || magic.shieldActive) return;
      ambient.start(); hero.ensureStaff(); aimNow();
      if (magic.beginCharge() && aimReticleRef.current) aimReticleRef.current.classList.add('is-casting');
    };
    const releaseZoltraak = () => {
      if (!magic.charging) return;
      aimNow();
      if (magic.releaseCharge()) broadcastFx('zoltraak', spellOrigin, spellDirection, spellAim);
    };
    zoltraakRef.current = { start: startZoltraak, release: releaseZoltraak };
    const startShield = () => {
      if (uiOpenRef.current || combat.health <= 0 || elapsed < cine.until || magic.charging || magic.beamActive || grab) return;
      ambient.start(); hero.ensureStaff();
      // guerreiro: ergue o machado em guarda na hora (sem a pose de conjurar a muralha)
      if (magic.beginShield()) { hero.root.userData.castKind = 'shield'; if (cls().weapon !== 'axe') castUntil = elapsed + .62; }
      else if (magic.cooldown('shield') > 0) showHint(`Escudo em recarga · ${magic.cooldown('shield').toFixed(1)} s`);
    };
    const releaseShield = () => magic.releaseShield();
    shieldRef.current = { start: startShield, release: releaseShield };
    const performAttack = () => {
      if (uiOpenRef.current || combat.health <= 0 || magic.shieldActive || grab) return;
      const facing = hero.root.userData.facing ?? hero.root.rotation.y;
      const target = hero.root.position.clone().add(new THREE.Vector3(Math.sin(facing), 0, Math.cos(facing)).multiplyScalar(2.15));
      target.y += 1.2;
      const atk = cls().attack;
      target.copy(hero.root.position).add(new THREE.Vector3(Math.sin(facing), 0, Math.cos(facing)).multiplyScalar(atk.reach)); target.y += 1.2;
      const crit = progression.rollCrit(), dmg = atk.damage * magic.buffDamage * progression.meleeMultiplier() * crit, hits = combat.damageAt(target, atk.radius, dmg);
      if (hits > 0) { reticleHitUntil = elapsed + .28; magic.drain(dmg * hits); if (crit > 1) magic.critFx(target); }
      attackUntil = elapsed + .38;
      ambient.start(); ambient.sfx('swing');
    };
    attackRef.current = performAttack;
    dodgeRef.current = () => {
      if (uiOpenRef.current || combat.health <= 0 || grab) return;
      const fwd = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0) + touchMoveRef.current.forward;
      const side = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0) + touchMoveRef.current.side;
      const vert = magic.flying ? Number(keys.has(' ')) - Number(keys.has('control')) : 0;
      if (motor.dodge(cameraRig.yaw, THREE.MathUtils.clamp(fwd, -1, 1), THREE.MathUtils.clamp(side, -1, 1), vert)) { dodgeUntil = elapsed + (magic.flying ? .3 : .42); ambient.sfx('dodge'); }
    };
    castSpellRef.current = castSpell;
    castAbilityRef.current = castAbility;
    // painel de desempenho: contadores dos sistemas + luzes pontuais realmente visíveis (cada uma pesa em todo material iluminado)
    const countPointLights = () => { let n = 0; scene.traverseVisible(o => { if ((o as THREE.PointLight).isPointLight) n++; }); return n; };
    perf.setExtra(() => ({ ...magic.perfStats(), ...combat.perfStats(), 'luzes pontuais': countPointLights() }));
    if (process.env.NODE_ENV !== 'production') {
      // ganchos de benchmark (só em desenvolvimento): cenários reproduzíveis sem depender de teclado/mouse
      const at = new THREE.Vector3(), from = new THREE.Vector3(), dir = new THREE.Vector3();
      (window as unknown as { __ecos?: unknown }).__ecos = {
        perf, scene, start: () => startRef.current(),
        teleport: (x: number, z: number, yaw?: number) => { hero.root.position.set(x, terrainHeight(x, z), z); motor.reset(); if (yaw !== undefined) cameraRig.yaw = yaw; },
        spin: (dy: number) => { cameraRig.yaw += dy; },
        recharge: () => magic.debugRecharge(),
        cast: (spell: SpellId, tx: number, tz: number) => {
          hero.ensureStaff(); hero.spellPoint.getWorldPosition(from);
          at.set(tx, terrainHeight(tx, tz) + 1, tz); dir.copy(at).sub(from).normalize();
          const ok = magic.cast(spell, from, dir, at); if (ok) { hero.root.userData.castKind = spell; castUntil = elapsed + .5; }
          return ok;
        },
        hurt: (x: number, z: number, r: number, dmg: number) => combat.damageAt(at.set(x, terrainHeight(x, z) + 1, z), r, dmg),
        heal: () => combat.heal(9999),
        pointLights: countPointLights,
        quest: () => ({ ...quest, level: progression.level, xp: progression.experience, next: progression.nextLevelXp }),
        questKill: () => combat.onKill('wolf'),
        npcTalk: () => { isNearNpc = true; talkToNpc(); },
        // multijogador (testes automatizados): rede, avatares remotos e papel no combate
        net: netRef.current, mp: () => ({ status: netRef.current!.status, error: netRef.current!.error, id: netRef.current!.id, host: netRef.current!.host, peers: [...netRef.current!.peers.values()], role: combat.netRole, remotes: remotes.active().map(s => ({ id: s.id, name: s.st.name, cls: s.st.cls, x: s.hero.root.position.x, z: s.hero.root.position.z })), mobs: combat.snapshot().length, mob0: combat.snapshot()[0], health: combat.health, party: partyRef.current }),
      };
    }
    const interactMarker = () => {
      if (!isNearMarker || uiOpenRef.current) return;
      ambient.start();
      if (!markerRemembered) {
        markerRemembered = true;
        setStatus({ area: 'Campos da Aurora', discovered: 1 });
        showHint('O Marco do Herói despertou uma lembrança.');
      } else showHint('O Eco repousa por um instante entre as pedras.');
    };
    interactRef.current = () => { if (isNearNpc) talkToNpc(); else interactMarker(); };

    /* ==================================================================== SAVE LOCAL */
    collectSaveRef.current = () => {
      if (!hasStartedRef.current) return null;
      const p = progression;
      return {
        version: 1, savedAt: Date.now(), name: mpNameRef.current, choice: { ...heroChoiceRef.current },
        progression: { level: p.level, experience: p.experience, nextLevelXp: p.nextLevelXp, skillPoints: p.skillPoints, ranks: { ...p.ranks }, inventory: { ...p.inventory } },
        quest: { ...quest }, markerRemembered,
        position: { x: hero.root.position.x, y: hero.root.position.y, z: hero.root.position.z, yaw: hero.root.rotation.y },
      };
    };
    loadSaveRef.current = d => {
      // a classe primeiro (troca a árvore), depois o progresso; o React aplica arma e cores em seguida
      heroChoiceRef.current = d.choice; setHeroChoice(d.choice);
      progression.setClass(d.choice.cls); progression.restore(d.progression);
      lastLevel = progression.level; setProgressionHud(progression.snapshot());
      const stage = (['available', 'active', 'ready', 'done'] as QuestStage[]).includes(d.quest.stage as QuestStage) ? d.quest.stage as QuestStage : 'available';
      quest.stage = stage; quest.kills = d.quest.kills; quest.reward = d.quest.reward; npc.setStage(stage); publishQuest();
      markerRemembered = d.markerRemembered; if (markerRemembered) setStatus({ area: 'Campos da Aurora', discovered: 1 });
      const x = d.position.x, z = d.position.z;
      hero.root.position.set(x, terrainHeight(x, z), z); hero.root.rotation.y = d.position.yaw; hero.root.userData.facing = d.position.yaw; motor.reset();
      if (d.name && !mpNameRef.current) mpNameRef.current = d.name;
      combat.health = combat.maxHealth;
    };
    // fechar a aba / recarregar: salva antes (só se a jornada já começou)
    const onBeforeUnload = () => { const d = collectSaveRef.current(); if (d) writeSave(d); };
    window.addEventListener('beforeunload', onBeforeUnload);
    let autosaveAcc = 0;

    /* ==================================================================== MULTIJOGADOR */
    const net = netRef.current!;
    const v3 = (a: unknown, out = new THREE.Vector3()) => { const v = a as number[]; return Array.isArray(v) && v.length === 3 ? out.set(+v[0] || 0, +v[1] || 0, +v[2] || 0) : out.set(0, 0, 0); };
    const vArr = (v: THREE.Vector3) => [r2(v.x), r2(v.y), r2(v.z)];
    const netBlock = (from: THREE.Vector3, to: THREE.Vector3) => magic.blockProjectile(from, to);
    // dano do cliente → host; golpe de inimigo do host → jogador remoto; Agarrão do cliente → host
    combat.onHitRequest = (i, d, p, k) => net.sendTo(net.host, { t: 'hit', i, d: r2(d), p: vArr(p), k: r2(k) });
    combat.onRemoteStrike = (id, d, x, z) => net.sendTo(id, { t: 'strike', d: r2(d), x: r2(x), z: r2(z) });
    combat.onNetHold = (i, x, z, yaw, tilt, lift) => net.sendTo(net.host, { t: 'hold', i, x: r2(x), z: r2(z), y: r2(yaw), tl: r2(tilt), l: r2(lift) });
    combat.onNetRelease = (i, px, pz) => net.sendTo(net.host, { t: 'rel', i, x: r2(px), z: r2(pz) });
    const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), tmpC = new THREE.Vector3();
    const peerName = (id: string) => net.peers.get(id)?.name ?? 'Aliado';
    net.onMessage = m => {
      const from = m.from ?? '';
      switch (m.t) {
        case 'st': remotes.setState(from, m as unknown as RemoteState, performance.now()); return;
        case 'snap': if (combat.netRole === 'client' && from === net.host) combat.applySnapshot(m.m as number[][], elapsed); return;
        case 'hit': if (combat.netRole === 'host') combat.netApplyHit(Number(m.i), Number(m.d), v3(m.p, tmpA), Number(m.k)); return;
        case 'hold': if (combat.netRole === 'host') combat.netHold(Number(m.i), Number(m.x), Number(m.z), Number(m.y), Number(m.tl), Number(m.l)); return;
        case 'rel': if (combat.netRole === 'host') combat.netRelease(Number(m.i), Number(m.x), Number(m.z)); return;
        case 'strike': combat.receiveStrike(Number(m.d), Number(m.x), Number(m.z), hero.root.position, netBlock); return;
        case 'fx': {
          const o = v3(m.o, tmpA); if (o.distanceTo(hero.root.position) > 70) return;
          magic.remoteFx(m.s as SpellId, o, v3(m.d, tmpB), v3(m.g, tmpC)); return;
        }
        case 'heal': if (partyRef.current?.members.includes(from)) { magic.allyHeal(Number(m.f), Number(m.h)); showHint(`${peerName(from)} curou você.`); } return;
        case 'buff': if (partyRef.current?.members.includes(from)) { magic.allyDespertar(Number(m.s)); showHint(`${peerName(from)} despertou você: +dano, +defesa, +velocidade.`); } return;
        default: partyMsgRef.current(m);
      }
    };
    net.onRoster = ev => {
      if (ev.type === 'leave') { if (ev.id === '*') remotes.clear(); else remotes.remove(ev.id); }
      if (ev.type === 'welcome') showHint(`Conectado à sala “${net.room}”${net.isHost ? ' · você é o host' : ''}.`);
      if (ev.type === 'join') showHint(`${peerName(ev.id)} entrou na sala.`);
      if (ev.type === 'host' && ev.id === net.id) showHint('Você agora é o host da sala (os inimigos são simulados aqui).');
      partyRosterRef.current(ev);
    };
    /** Avisa os outros jogadores que uma habilidade foi lançada (efeito visual na tela deles). */
    const broadcastFx = (spell: SpellId, origin: THREE.Vector3, dir: THREE.Vector3, target: THREE.Vector3) => {
      if (net.online) net.send({ t: 'fx', s: spell, o: vArr(origin), d: vArr(dir), g: vArr(target) });
    };
    /** Efeitos de grupo: Cura em Grupo e Despertar alcançam os membros por perto. */
    const partyEffects = (spell: SpellId) => {
      const p = partyRef.current; if (!p || !net.online) return;
      for (const s of remotes.active()) {
        if (!p.members.includes(s.id)) continue;
        const d = s.hero.root.position.distanceTo(hero.root.position);
        if (spell === 'curaEquipe' && d <= magic.curaEquipeRadius + 1) net.sendTo(s.id, { t: 'heal', f: .25, h: 6 });
        if (spell === 'despertar' && d <= 14) net.sendTo(s.id, { t: 'buff', s: r2(magic.despertarSecs) });
      }
    };
    // estado deste jogador enviado aos outros e fotos dos inimigos (host)
    let stateAcc = 0, snapAcc = 0, rosterAcc = 0, lastRole = combat.netRole;
    let netPose: HeroPose = 'idle', netLoco: HeroPose = 'idle', netSpeed = 0, netOverlay: [string, number] | null = null;
    const netStep = (delta: number, playing: boolean) => {
      const now = performance.now();
      combat.netRole = net.online ? (net.isHost ? 'host' : 'client') : 'solo';
      if (combat.netRole !== lastRole) { if (lastRole === 'client') combat.resumeAuthority(); if (combat.netRole === 'client') combat.netSynced = false; lastRole = combat.netRole; }
      remotes.update(elapsed, delta, now);
      const active = remotes.active();
      combat.remotes = active.map(s => ({ id: s.id, pos: s.hero.root.position, alive: s.st.hp > 0 }));
      if (net.online && playing) {
        stateAcc += delta;
        if (stateAcc >= 1 / 15) {
          stateAcc = 0;
          const hp = hero.root.position;
          net.send({ t: 'st', x: r2(hp.x), y: r2(hp.y), z: r2(hp.z), yaw: r2(hero.root.rotation.y), pose: netPose, lp: netLoco, spd: r2(netSpeed),
            ov: netOverlay, ck: (hero.root.userData.castKind as string | undefined) ?? null, hp: Math.round(combat.health), mhp: Math.round(combat.maxHealth),
            cls: heroChoiceRef.current.cls, look: heroChoiceRef.current.look, name: net.myName || mpNameRef.current, lvl: progression.level });
        }
      }
      if (combat.netRole === 'host') { snapAcc += delta; if (snapAcc >= .1) { snapAcc = 0; net.send({ t: 'snap', m: combat.snapshot() }); } }
      // nomes sobre a cabeça dos outros jogadores (verde = do seu grupo)
      const plates = nameplatesRef.current;
      if (plates) {
        const p = partyRef.current;
        remotes.slots.forEach((s, i) => {
          const el = plates.children[i] as HTMLDivElement | undefined; if (!el) return;
          if (!s.id || !s.st || !playing) { el.style.display = 'none'; return; }
          tmpA.copy(s.hero.root.position); tmpA.y += 2.75; tmpA.project(camera);
          const dist = s.hero.root.position.distanceTo(camera.position);
          if (tmpA.z > 1 || dist > 60) { el.style.display = 'none'; return; }
          el.style.display = '';
          el.style.transform = `translate(-50%, -100%) translate(${((tmpA.x + 1) / 2 * renderer.domElement.clientWidth).toFixed(1)}px, ${((1 - tmpA.y) / 2 * renderer.domElement.clientHeight).toFixed(1)}px)`;
          el.classList.toggle('party', !!p?.members.includes(s.id));
          const nameEl = el.firstElementChild as HTMLElement, bar = el.lastElementChild?.firstElementChild as HTMLElement | null;
          const label = `${CLASSES[s.st.cls]?.glyph ?? ''} ${s.st.name}`;
          if (nameEl.textContent !== label) nameEl.textContent = label;
          if (bar) bar.style.width = `${Math.max(0, Math.min(100, s.st.hp / Math.max(1, s.st.mhp) * 100))}%`;
        });
      }
      // lista de jogadores para a interface (grupo/HUD), só quando muda
      rosterAcc += delta;
      if (rosterAcc > .5) {
        rosterAcc = 0;
        const next: Record<string, { name: string; cls: HeroClass; hp: number; mhp: number; lvl: number }> = {};
        for (const s of active) next[s.id] = { name: s.st.name, cls: s.st.cls, hp: s.st.hp, mhp: s.st.mhp, lvl: Number((s.st as RemoteState & { lvl?: number }).lvl ?? 1) };
        const key = JSON.stringify(next);
        if (key !== rosterKey) { rosterKey = key; setRoster(next); }
      }
    };
    let rosterKey = '';
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'f3') { // painel de desempenho (desenvolvedor)
        event.preventDefault(); const panel = perfPanelRef.current;
        if (panel) { panel.hidden = !panel.hidden; perf.attachPanel(panel.hidden ? null : panel); }
        return;
      }
      if (titleRef.current) { if (key === 'enter' && !event.repeat) startRef.current(); return; }
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'shift', 'alt', 'escape', 'h', 'j', 'e', 'g', 'q', '1', '2', '3', '4', 'f', 'r', 'v', 'x', 't', 'control', ',', 'p'].includes(key)) event.preventDefault();
      if (event.repeat && ['escape', 'h', 'j', 'e', 'g', 'q', '1', '2', '3', '4', 'f', 'r', 'x', ' ', ',', 'p'].includes(key)) return;
      if (key === 'escape') {
        keys.clear();
        if (npcDialogRef.current) { npcActionsRef.current.close(); return; }
        if (modalFlagsRef.current.help || modalFlagsRef.current.quest || modalFlagsRef.current.inventory || modalFlagsRef.current.skills || modalFlagsRef.current.players) { setHelp(false); setQuestOpen(false); setInventoryOpen(false); setSkillsOpen(false); setPlayersOpen(false); }
        else if (document.pointerLockElement === renderer.domElement) { document.exitPointerLock(); setPaused(true); }
        else setPaused(value => !value);
        return;
      }
      if (key === 'shift') {
        if (!uiOpenRef.current && !event.repeat) {
          if (shiftLockActive) {
            shiftLockActive = false; cameraRig.setShiftLock(false); setShiftLocked(false);
            if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
          } else if (renderer.domElement.requestPointerLock) {
            shiftLockActive = true; cameraRig.setShiftLock(true); setShiftLocked(true);
            const request = renderer.domElement.requestPointerLock();
            if (request && typeof request.catch === 'function') request.catch(() => { shiftLockActive = false; cameraRig.setShiftLock(false); setShiftLocked(false); });
          }
        }
        return;
      }
      if (key === 'h') { releaseMouse(); setHelp(value => !value); return; }
      if (key === 'j') { releaseMouse(); setQuestOpen(value => !value); return; }
      if (key === 'e') { toggleInventory(); return; }
      if (key === ',') { toggleSkills(); return; }
      if (key === 'p') { togglePlayers(); return; }
      if (key === 'g' && isNearNpc && !uiOpenRef.current) { talkToNpc(); return; }
      if (key === 'g' && isNearMarker && !uiOpenRef.current) {
        interactMarker();
        return;
      }
      // barra de habilidades da classe: Q, 1, 2, F, R
      const ab = abilityFor(key);
      if (ab) {
        if (ab.mode === 'charge') startZoltraak();
        else if (ab.mode === 'hold') startShield();
        else castAbility(ab.spell);
        return;
      }
      if (key === 'x') { dodgeRef.current(); return; }
      if (key === 't' && !event.repeat) {
        if (uiOpenRef.current || combat.health <= 0 || elapsed < cine.until || magic.charging || magic.beamActive || magic.shieldActive) return;
        { const w = WEAPON_NAME[cls().weapon], W = w[0].toUpperCase() + w.slice(1), fem = WEAPON_ART[cls().weapon] === 'a';
          showHint((ambient.sfx('staffToggle'), hero.toggleStaff()) ? `${W} em mãos.` : `${W} guardad${fem ? 'a' : 'o'} nas costas.`); }
        return;
      }
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'alt', 'control', 'v'].includes(key)) {
        ambient.start(); keys.add(key);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      keys.delete(key);
      const ab = abilityFor(key);
      if (ab?.mode === 'charge') releaseZoltraak();
      if (ab?.mode === 'hold') releaseShield();
    };
    const onBlur = () => { keys.clear(); magic.cancelCharge(); shiftLockActive = false; cameraRig.setShiftLock(false); setShiftLocked(false); setPaused(true); };
    const onVisibility = () => { if (document.visibilityState === 'hidden') { keys.clear(); shiftLockActive = false; cameraRig.setShiftLock(false); setShiftLocked(false); setPaused(true); } };
    const onPointerLock = () => {
      dragging = document.pointerLockElement === renderer.domElement;
      if (!dragging && shiftLockActive) { shiftLockActive = false; cameraRig.setShiftLock(false); setShiftLocked(false); }
    };
    // Mouse livre (fora do Shift Lock): cursor-mira estilizado, magias miram no cursor,
    // arrastar com botão esquerdo/direito gira a câmera, clique direito sem arrastar = golpe do cajado.
    let dragButton = -1, dragMoved = 0;
    const mouse = { x: 0, y: 0, inside: false };
    const trackMouse = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = event.clientX - rect.left; mouse.y = event.clientY - rect.top; mouse.inside = true;
    };
    const onPointerDown = (event: PointerEvent) => {
      if (uiOpenRef.current) return;
      if (event.button !== 0 && event.button !== 2) return;
      ambient.start();
      if (event.pointerType === 'touch') {
        renderer.domElement.setPointerCapture(event.pointerId);
        dragging = true; previousX = event.clientX; previousY = event.clientY;
        return;
      }
      if (document.pointerLockElement === renderer.domElement) { if (event.button === 2) performAttack(); return; }
      trackMouse(event);
      renderer.domElement.setPointerCapture(event.pointerId);
      dragging = true; dragButton = event.button; dragMoved = 0;
      previousX = event.clientX; previousY = event.clientY;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.target === renderer.domElement || dragButton >= 0) trackMouse(event);
      if (!dragging || uiOpenRef.current) return;
      if (dragButton >= 0) dragMoved += Math.abs(event.clientX - previousX) + Math.abs(event.clientY - previousY);
      const locked = document.pointerLockElement === renderer.domElement;
      cameraRig.rotate(locked ? event.movementX : event.clientX - previousX, locked ? event.movementY : event.clientY - previousY);
      previousX = event.clientX; previousY = event.clientY;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (dragButton === 2 && event.button === 2 && dragMoved < 6) performAttack();
      if (event.button === dragButton) dragButton = -1;
      if (document.pointerLockElement !== renderer.domElement) dragging = false;
    };
    const onWheel = (event: WheelEvent) => { event.preventDefault(); cameraRig.zoom(event.deltaY); };
    const onContext = (event: MouseEvent) => event.preventDefault();
    const resize = () => {
      const width = host.clientWidth, height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false); composer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); resize();
    window.addEventListener('keydown', onKeyDown); window.addEventListener('keyup', onKeyUp); window.addEventListener('blur', onBlur); window.addEventListener('pointermove', onPointerMove); window.addEventListener('pointerup', onPointerUp);
    document.addEventListener('visibilitychange', onVisibility); document.addEventListener('pointerlockchange', onPointerLock);
    renderer.domElement.addEventListener('pointerdown', onPointerDown); renderer.domElement.addEventListener('wheel', onWheel, { passive: false }); renderer.domElement.addEventListener('contextmenu', onContext);

    let frame = 0, frameCount = 0, fpsAcc = 0, fpsFrames = 0, emaMs = 16, resTimer = 0, firstFrame = true;
    let lastHudKey = '', lastSnapKey = '', lowHealth = false;
    const camTarget = new THREE.Vector3();
    const draw = () => composer.render();
    const animate = () => {
      frame = requestAnimationFrame(animate);
      perf.begin(); step(); perf.end();
    };
    const step = () => {
      const rawDelta = clock.getDelta();
      let delta = Math.min(.05, rawDelta);
      // hit-stop: nos impactos do Agarrão o tempo quase congela por um instante
      if (hitstop > 0 && !titleRef.current) { hitstop -= delta; delta *= .06; }
      frameCount++;

      // --- medidor de desempenho + resolução dinâmica (ajusta a escala de pixels pelo tempo de quadro)
      emaMs += (Math.min(rawDelta, .2) * 1000 - emaMs) * .06; fpsAcc += rawDelta; fpsFrames++;
      if (fpsAcc >= .5) { if (fpsRef.current) fpsRef.current.textContent = `${Math.round(fpsFrames / fpsAcc)} FPS · ${Math.round(resScale * 100)}% res`; fpsAcc = 0; fpsFrames = 0; }
      resTimer += rawDelta;
      if (resTimer > 1.5) {
        resTimer = 0;
        const target = !dynamicResRef.current ? 1 : emaMs > 26 ? Math.max(.55, resScale - .1) : emaMs < 19 ? Math.min(1, resScale + .05) : resScale;
        if (Math.abs(target - resScale) > .001) { resScale = target; applyPixelRatio(); }
      }

      // --- tela inicial: câmera cinematográfica orbitando o Marco, mundo vivo ao fundo
      if (titleRef.current) {
        elapsed += delta;
        if (titlePanelRef.current === 'hero') {
          // criação de personagem: câmera de frente para o herói (à direita da tela, ao lado do painel)
          const hp = hero.root.position, ang = hero.root.rotation.y + Math.sin(elapsed * .3) * .35;
          const dx = Math.sin(ang), dz = Math.cos(ang);
          camTarget.set(hp.x + dx * 4.4, hp.y + 1.75, hp.z + dz * 4.4);
          camera.position.lerp(camTarget, 1 - Math.exp(-delta * 3));
          camera.lookAt(hp.x - dz * 1.25, hp.y + 1.15, hp.z + dx * 1.25);
        } else {
          const t = elapsed * .04;
          camTarget.set(Math.sin(t) * 14.5, 0, -12 + Math.cos(t) * 14.5);
          camTarget.y = Math.max(terrainHeight(camTarget.x, camTarget.z) + 2.6, 4.4 + Math.sin(elapsed * .17) * .7);
          camera.position.lerp(camTarget, firstFrame ? 1 : 1 - Math.exp(-delta * 2.5));
          camera.lookAt(0, 3.1, -12);
        }
        hero.update(elapsed, delta, 'idle', 0);
        npc.update(delta, elapsed, hero.root.position);
        magic.update(delta, elapsed);
        updateWorld(world, elapsed);
        cycleTick += delta;
        if (cycleTick >= 1 || firstFrame) { cycleTick = 0; const cycle = updateDayCycle(scene, sun, sky, elapsed); setDayLabel(cycle.label); }
        if (renderer.shadowMap.enabled && frameCount % 3 === 0) renderer.shadowMap.needsUpdate = true;
        netStep(delta, false);
        perf.render(draw);
        if (firstFrame) { firstFrame = false; setReady(true); }
        return;
      }
      // menus abertos: o mundo fica congelado, então basta redesenhar de vez em quando
      if (npcDialogRef.current) {
        elapsed += delta;
        hero.update(elapsed, delta, 'idle', 0);
        npc.update(delta, elapsed, hero.root.position);
      }
      // multijogador não pausa: com um menu aberto, inimigos, magias e os outros jogadores continuam
      if (uiOpenRef.current && net.online) {
        if (!npcDialogRef.current) elapsed += delta;
        magic.update(delta, elapsed);
        combat.barrier = magic.shieldBarrier(shieldBarrier);
        combat.update(delta, elapsed, hero.root.position, (from, to) => magic.blockProjectile(from, to));
        netPose = 'idle'; netOverlay = null; netSpeed = 0; netStep(delta, true);
      }
      if (uiOpenRef.current && !npcDialogRef.current && frameCount % 3 !== 0) return;
      if (!uiOpenRef.current) {
        elapsed += delta;
        const wasGrounded = motor.grounded, vyBefore = motor.verticalSpeed;
        const st = progression.stats; // atributos dos talentos
        const def = cls(), maxHp = st.maxHealth - 100 + def.health; // vida base da classe + talentos de Vitalidade
        if (maxHp > combat.maxHealth) combat.health += maxHp - combat.maxHealth; // melhorar a vida máxima cura a diferença
        combat.maxHealth = maxHp; combat.health = Math.min(combat.health, combat.maxHealth);
        combat.resist = Math.min(.75, st.resist + def.resist + magic.buffResist);
        motor.verticalScale = st.flyVertical;
        if (magic.flying) combat.heal(st.flyRegen * delta);
        if (st.regen > 0 && combat.health > 0) combat.heal(st.regen * delta); // regeneração da árvore
        const zoltraakActive = combat.health > 0 && (magic.charging || magic.beamActive);
        motor.speedScale = (zoltraakActive ? (magic.beamActive ? .35 : .55) : 1) * (magic.flying ? st.flySpeed : st.moveSpeed * magic.buffSpeed);
        const inCine = elapsed < cine.until;
        const forward = inCine ? 0 : (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0) + touchMoveRef.current.forward;
        const side = inCine ? 0 : (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0) + touchMoveRef.current.side;
        if (grab && combat.health <= 0) endGrab();
        const grabSpeed = grab ? stepGrab(delta) : 0;
        const moving = grab ? grabSpeed > .5 : combat.health > 0 && motor.update(delta, THREE.MathUtils.clamp(forward, -1, 1), THREE.MathUtils.clamp(side, -1, 1), keys.has('alt') || touchSprintRef.current, keys.has(' ') || touchJumpRef.current, cameraRig.yaw, magic.flying, Number(keys.has(' ') || touchJumpRef.current) - Number(keys.has('control')), cameraRig.pitch);
        if (!grab) combat.pushPlayer(hero.root.position); // inimigos têm corpo sólido
        if (!grab && combat.health > 0 && (shiftLockActive || Math.hypot(motor.velocity.x, motor.velocity.z) > .2)) {
          hero.root.userData.facing = shiftLockActive ? cameraRig.yaw + Math.PI : Math.atan2(motor.velocity.x, motor.velocity.z);
        }
        // enquanto carrega/dispara, a câmera vai para o ombro (raio e mira ficam livres do corpo)
        if (zoltraakActive !== zoltraakFraming && !shiftLockActive) cameraRig.setShiftLock(zoltraakActive);
        zoltraakFraming = zoltraakActive;
        // ao lançar qualquer feitiço de ataque, a heroína vira para onde a mira aponta
        if (!grab && !zoltraakActive && elapsed < faceAimUntil && combat.health > 0) hero.root.userData.facing = Math.atan2(spellAim.x - hero.root.position.x, spellAim.z - hero.root.position.z);
        if (zoltraakActive) {
          // mira acompanha a câmera enquanto carrega/dispara; a heroína encara o alvo
          aimNow();
          hero.root.userData.facing = Math.atan2(spellAim.x - hero.root.position.x, spellAim.z - hero.root.position.z);
        }
        if (combat.health <= 0) {
          magic.cancelCharge();
          deathTimer += delta;
          if (deathTimer >= 2) {
            hero.root.position.set(0, 0, 2);
            hero.root.rotation.set(0, Math.PI, 0);
            hero.root.userData.facing = Math.PI;
            motor.reset();
            combat.respawnPlayer();
            deathTimer = 0;
          }
        } else deathTimer = 0;
        if (!wasGrounded && motor.grounded) { landUntil = elapsed + .34; if (vyBefore < -3) ambient.sfx('land', THREE.MathUtils.clamp(-vyBefore / 14, .3, 1.3)); }
        if (wasGrounded && !motor.grounded && motor.verticalSpeed > 4) ambient.sfx('jump');
        if (motor.grounded && !magic.flying && moving) {
          const sprinting = keys.has('alt') || touchSprintRef.current;
          stepDist += Math.hypot(motor.velocity.x, motor.velocity.z) * delta;
          if (stepDist > (sprinting ? 2.2 : 1.55)) { stepDist = 0; ambient.sfx('step', sprinting ? 1.5 : 1); }
        }
        audioTick += delta;
        if (audioTick > .25) {
          audioTick = 0;
          const hp = hero.root.position, wd = Math.min(pondDist(hp.x, hp.z) - POND.r * .8, streamDist(hp.x, hp.z) - 1);
          ambient.setState({ daylight: daylightNow, flying: magic.flying, combat: combat.engaged > 0 && combat.health > 0 ? 1 : 0, water: Math.max(0, Math.min(1, 1 - wd / 22)) });
        }
        if (combat.health < lastHealth) {
          hitUntil = elapsed + .45;
          const flash = damageRef.current;
          if (flash) { flash.classList.remove('hit'); void flash.offsetWidth; flash.classList.add('hit'); }
        }
        lastHealth = combat.health;
        // pose de locomoção "por baixo" de ações de parte superior (magia em movimento/voo mantém pernas e inclinação)
        hero.root.userData.locoPose = magic.flying ? 'fly' : !motor.grounded ? 'fall' : moving ? (keys.has('alt') || touchSprintRef.current ? 'run' : 'walk') : 'idle';
        const grabPose: HeroPose | null = grab ? (grab.phase === 'slam' ? (grab.slammed ? 'attack' : 'idle') : 'run') : null;
        if (grab) hero.root.userData.locoPose = grabPose;
        const pose: HeroPose = grabPose ? grabPose : combat.health <= 0 ? 'defeat' : elapsed < hitUntil ? 'hit' : elapsed < castUntil ? 'cast' : elapsed < attackUntil ? 'attack' : elapsed < dodgeUntil ? 'dodge' : elapsed < landUntil ? 'land' : keys.has('v') ? 'guard' : magic.flying ? 'fly' : !motor.grounded ? (motor.verticalSpeed < -1 ? 'fall' : 'jump') : moving ? (keys.has('alt') || touchSprintRef.current ? 'run' : 'walk') : 'idle';
        const overlay = grab && !(grab.phase === 'slam' && grab.slammed) ? { mode: 'grab' as const, power: grab.phase === 'slam' ? Math.min(1, grab.t / GRAB.slamAt) : grab.phase === 'dash' ? .15 : 0 } : magic.charging ? { mode: 'charge' as const, power: magic.chargeLevel } : magic.beamActive ? { mode: 'beam' as const, power: magic.beamPower } : magic.shieldActive && elapsed > castUntil && !magic.flying ? { mode: 'shield' as const, power: magic.shieldDurability } : undefined;
        hero.update(elapsed, delta, pose, grab ? grabSpeed : Math.hypot(motor.velocity.x, motor.velocity.z), overlay);
        // o que os outros jogadores veem deste herói
        netPose = pose; netLoco = (hero.root.userData.locoPose as HeroPose | undefined) ?? pose; netSpeed = grab ? grabSpeed : Math.hypot(motor.velocity.x, motor.velocity.z);
        netOverlay = overlay ? [overlay.mode, Math.round(overlay.power * 100) / 100] : null;
        ambient.setBeam(magic.charging ? 1 : magic.beamActive ? 2 : 0, magic.charging ? magic.chargeLevel : magic.beamPower);
        magic.update(delta, elapsed);
        combat.barrier = magic.shieldBarrier(shieldBarrier);
        combat.update(delta, elapsed, hero.root.position, (from, to) => magic.blockProjectile(from, to));
        netStep(delta, true);
        // salvamento automático local a cada 30 s
        autosaveAcc += delta; if (autosaveAcc >= 30) { autosaveAcc = 0; saveNow(true); }
        npc.update(delta, elapsed, hero.root.position);
        updateWorld(world, elapsed);
        cycleTick += delta;
        if (cycleTick >= 1) { cycleTick = 0; const cycle = updateDayCycle(scene, sun, sky, elapsed); setDayLabel(cycle.label); daylightNow = cycle.daylight; }
        const distanceToMarker = Math.hypot(hero.root.position.x, hero.root.position.z + 12);
        const near = distanceToMarker < 4.6;
        if (near !== isNearMarker) { isNearMarker = near; setNearLandmark(near); }
        const nearN = combat.health > 0 && Math.hypot(hero.root.position.x - npc.position.x, hero.root.position.z - npc.position.z) < 3.3 && Math.abs(hero.root.position.y - npc.position.y) < 2.5;
        if (nearN !== isNearNpc) { isNearNpc = nearN; setNearNpc(nearN); }
        hudTick += delta;
        if (hudTick > .12) {
          hudTick = 0;
          // só re-renderiza o React quando algo visível mudou
          const ids = SPELL_IDS;
          const cooldowns = {} as Record<SpellId, number>, cdFrac = {} as Record<SpellId, number>;
          for (const id of ids) { cooldowns[id] = Math.ceil(magic.cooldown(id) * 10) / 10; cdFrac[id] = Math.round(magic.cooldownFraction(id) * 40) / 40; }
          const hud: CombatHud = { mana: Math.round(magic.mana), maxMana: Math.round(magic.maxMana), health: Math.round(combat.health), maxHealth: Math.round(combat.maxHealth), alive: combat.alive, shield: magic.shieldActive, flying: magic.flying, blocks: magic.blocks, brado: magic.buffs.brado > 0, bencao: magic.buffs.bencao > 0, despertar: magic.buffs.despertar > 0, cooldowns, cdFrac };
          const hudKey = JSON.stringify(hud);
          if (hudKey !== lastHudKey) { lastHudKey = hudKey; hudStore.set(hud); }
          const snap = progression.snapshot(), snapKey = JSON.stringify(snap);
          if (snap.level > lastLevel) ambient.sfx('levelUp'); lastLevel = snap.level;
          if (snapKey !== lastSnapKey) { lastSnapKey = snapKey; setProgressionHud(snap); }
        }
        const low = combat.health > 0 && combat.health <= combat.maxHealth * .3;
        if (low !== lowHealth) { lowHealth = low; shellRef.current?.classList.toggle('low-health', low); }
      }
      cameraRig.aim = playingAim(magic);
      cameraRig.shake = magic.shake;
      // mira: centro da tela com o ponteiro travado (Shift Lock); senão, segue o cursor
      const locked = document.pointerLockElement === renderer.domElement;
      const free = !locked && !titleRef.current && !uiOpenRef.current && mouse.inside;
      if (free) cameraRig.aimNdc.set(mouse.x / renderer.domElement.clientWidth * 2 - 1, -(mouse.y / renderer.domElement.clientHeight) * 2 + 1);
      else cameraRig.aimNdc.set(0, 0);
      shellRef.current?.classList.toggle('free-cursor', free);
      if (aimReticleRef.current) { aimReticleRef.current.style.left = free ? `${mouse.x}px` : '50%'; aimReticleRef.current.style.top = free ? `${mouse.y}px` : '50%'; }
      cameraRig.update(hero.root, delta);
      if (elapsed < grabCam.until) {
        // câmera do Agarrão: lateral e baixa, acompanhando o arrasto; na pancada chega mais perto e olha de baixo
        const hp = hero.root.position, d = grabCam.dir, s = grabCam.side, slam = grab?.phase === 'slam' ? 1 : 0;
        grabCam.blend = Math.min(1, grabCam.blend + delta * 5);
        const mx = hp.x + d.x * .7, mz = hp.z + d.z * .7, dist = 4.6 - slam * 1.1;
        grabCamPos.set(mx + d.z * s * dist - d.x * (1.4 - slam * .6), hp.y + 1.05 - slam * .45, mz - d.x * s * dist - d.z * (1.4 - slam * .6));
        grabCamPos.y = Math.max(grabCamPos.y, terrainHeight(grabCamPos.x, grabCamPos.z) + .35);
        grabLook.set(mx, hp.y + 1 + slam * .5, mz);
        camera.position.lerp(grabCamPos, grabCam.blend < 1 ? grabCam.blend * .3 : 1 - Math.exp(-delta * 9));
        camera.lookAt(grabLook);
      } else if (elapsed < cine.until) {
        const k = (elapsed - cine.start) / (cine.until - cine.start), h = hero.root.position, f = hero.root.rotation.y + 2.25 - k * 1.1;
        const ease = k < .15 ? k / .15 : 1, d = 4.6 - k * .8;
        camera.position.lerp(new THREE.Vector3(h.x + Math.sin(f) * d, h.y + .7 + k * .5, h.z + Math.cos(f) * d), ease);
        camera.lookAt(h.x, h.y + 1.9 + k * .2, h.z);
      } else if (shellRef.current?.classList.contains('cinematic')) shellRef.current.classList.remove('cinematic');
      if (aimReticleRef.current) {
        aimReticleRef.current.classList.toggle('is-casting', elapsed < castUntil || magic.charging || magic.beamActive);
        aimReticleRef.current.classList.toggle('is-hit', elapsed < reticleHitUntil);
        aimReticleRef.current.classList.toggle('is-locked', cameraRig.aimLocked && (magic.charging || magic.beamActive || elapsed < castUntil));
      }
      if (shieldBarRef.current) {
        const bar = shieldBarRef.current, d = magic.shieldDurability;
        bar.classList.toggle('on', magic.shieldActive);
        bar.classList.toggle('low', magic.shieldActive && d < .3);
        bar.style.setProperty('--d', d.toFixed(3));
      }
      if (chargeRef.current) {
        const lvl = magic.charging ? magic.chargeLevel : 0;
        chargeRef.current.style.setProperty('--p', lvl.toFixed(3));
        chargeRef.current.classList.toggle('on', magic.charging);
        chargeRef.current.classList.toggle('full', lvl >= .999);
      }
      if (compassNeedleRef.current) compassNeedleRef.current.style.transform = `rotate(${-cameraRig.yaw}rad)`;
      if (compassPinRef.current) {
        const markerAngle = Math.atan2(-hero.root.position.x, -(hero.root.position.z + 12)) - cameraRig.yaw;
        compassPinRef.current.style.left = `${42 + Math.sin(markerAngle) * 14}px`;
        compassPinRef.current.style.top = `${42 - Math.cos(markerAngle) * 14}px`;
      }
      if (renderer.shadowMap.enabled && (qualityRef.current === 'Alta' || frameCount % 2 === 0)) renderer.shadowMap.needsUpdate = true;
      perf.render(draw);
    };
    const clock = new THREE.Clock();
    animate();

    return () => {
      disposed = true;
      THREE.DefaultLoadingManager.onLoad = () => {};
      cancelAnimationFrame(frame); if (hintTimer) clearTimeout(hintTimer); if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
      applyPixelRatioRef.current = () => {};
      resizeObserver.disconnect(); window.removeEventListener('pointerdown', unlockAudio); window.removeEventListener('keydown', unlockAudio); window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); window.removeEventListener('blur', onBlur); window.removeEventListener('pointermove', onPointerMove); window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('visibilitychange', onVisibility); document.removeEventListener('pointerlockchange', onPointerLock);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown); renderer.domElement.removeEventListener('wheel', onWheel); renderer.domElement.removeEventListener('contextmenu', onContext);
      if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
      perf.dispose(); if (typeof window !== 'undefined') delete (window as unknown as { __ecos?: unknown }).__ecos;
      window.removeEventListener('beforeunload', onBeforeUnload);
      net.onMessage = () => {}; net.onRoster = () => {}; remotes.clear();
      collectSaveRef.current = () => null; loadSaveRef.current = () => {};
      magic.dispose(); combat.dispose(); ambient.dispose(); composer.dispose(); audioRef.current = null; rendererRef.current = null;
      qualityTargetsRef.current = null;
      cameraRigRef.current = null;
      progressionRef.current = null;
      castSpellRef.current = () => {};
      castAbilityRef.current = () => {};
      zoltraakRef.current = { start: () => {}, release: () => {} };
      interactRef.current = () => {};
      npc.dispose();
      npcActionsRef.current = { accept: () => {}, turnIn: () => {}, close: () => {} };
      attackRef.current = () => {};
      dodgeRef.current = () => {};
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>(scene.userData.gameTextures ?? []);
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          geometries.add(object.geometry);
          const list = Array.isArray(object.material) ? object.material : [object.material]; list.forEach(material => materials.add(material));
        }
      });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); textures.forEach(texture => texture.dispose());
      renderer.dispose(); if (host.contains(renderer.domElement)) host.removeChild(renderer.domElement);
    };
  }, [releaseMouse]);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const ratio = quality === 'Alta' ? 1.85 : quality === 'Baixa' ? .85 : 1.3;
    basePixelRatioRef.current = Math.min(window.devicePixelRatio || 1, ratio);
    applyPixelRatioRef.current();
    const targets = qualityTargetsRef.current;
    if (targets) { targets.bloom.enabled = quality !== 'Baixa'; targets.bloom.strength = quality === 'Alta' ? .48 : .3; }
    renderer.shadowMap.enabled = quality !== 'Baixa';
    renderer.shadowMap.needsUpdate = true;
    if (targets) {
      const mapSize = quality === 'Alta' ? 2048 : quality === 'Média' ? 1024 : 512;
      targets.sun.shadow.map?.dispose();
      targets.sun.shadow.map = null;
      targets.sun.shadow.mapSize.set(mapSize, mapSize);
      targets.sun.shadow.needsUpdate = true;
      setWorldQuality(targets.scene, quality);
    }
  }, [quality]);

  useEffect(() => {
    if (cameraRigRef.current) cameraRigRef.current.aimAssistCone = aimAssist ? .07 : 0;
  }, [aimAssist]);

  useEffect(() => {
    if (cameraRigRef.current) cameraRigRef.current.sensitivity = .0008 + sensitivity * .0005;
  }, [sensitivity]);

  const closeMenus = () => { setHelp(false); setQuestOpen(false); setInventoryOpen(false); setSkillsOpen(false); setPlayersOpen(false); setPaused(false); setPausePanel('main'); };
  const [selectedSkill, setSelectedSkill] = useState('root');
  const purchaseUpgrade = (id: string) => {
    if (progressionRef.current?.upgrade(id)) { setProgressionHud(progressionRef.current.snapshot()); audioRef.current?.sfx('pickup'); }
  };
  const respecTalents = () => {
    const spent = progressionRef.current?.respec() ?? 0;
    if (progressionRef.current) setProgressionHud(progressionRef.current.snapshot());
    if (spent) { audioRef.current?.sfx('ui'); setHint(`${spent} ${spent === 1 ? 'ponto devolvido' : 'pontos devolvidos'}.`); setTimeout(() => setHint(''), 2200); }
  };
  const TREE = { x: 500, y: 330 };
  const nodePos = (n: SkillNode) => ({ x: TREE.x + n.r * Math.cos(n.ang * Math.PI / 180), y: TREE.y + n.r * Math.sin(n.ang * Math.PI / 180) });
  const hexPts = (cx: number, cy: number, r: number) => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i - Math.PI / 6; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
  // árvore da classe escolhida (cada classe tem ramos, nós e habilidades próprios)
  const skillDef = SKILL_TREES[progressionHud.cls];
  const nodeColor = (n: SkillNode) => n.branch === 'root' ? '#f1dfa6' : skillDef.branches[n.branch]?.color ?? '#f1dfa6';
  const rankOf = (id: string) => progressionHud.ranks[id] ?? 0;
  const reachable = (n: SkillNode) => n.reqs.every(r => rankOf(r) >= 1);
  const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${Math.round(v * 100)}%`;
  const skillTree = () => {
    const sel = skillDef.byId[selectedSkill] ?? skillDef.byId.root, selRank = rankOf(sel.id), selReach = reachable(sel);
    const selAbility = sel.unlock ? CLASSES[progressionHud.cls].abilities.find(a => a.spell === sel.unlock) : undefined;
    const canBuy = sel.id !== 'root' && progressionHud.skillPoints >= 1 && selRank < sel.max && selReach;
    const stt = progressionHud.stats;
    const totals: [string, string][] = skillDef.totals.map(([k, f]) => [k, f(stt)]);
    return <div className="tree-wrap">
      <div className="tree-head">
        <div><span className="modal-kicker">TALENTOS DO ECO · NÍVEL {progressionHud.level}</span><h2>Caminhos {progressionHud.cls === 'maga' ? 'da Maga' : progressionHud.cls === 'guerreiro' ? 'do Guerreiro' : 'do Clérigo'}</h2></div>
        <div className="tree-points"><span>PONTOS</span><strong>{progressionHud.skillPoints}</strong></div>
      </div>
      <div className="tree-legend">{Object.entries(skillDef.branches).map(([b, info]) => <span key={b} style={{ '--c': info.color } as CSSProperties}><i />{info.name}<small>{info.subtitle}</small></span>)}<span className="legend-unlock"><i />Nova habilidade<small>libera a tecla 3 ou 4</small></span></div>
      <div className="tree-body">
        <svg className="tree-svg" viewBox="170 15 660 635" role="group" aria-label="Árvore de habilidades">
          <defs><radialGradient id="treeGlow" cx="50%" cy="50%" r="55%"><stop offset="0" stopColor="#3a2c5a" stopOpacity=".5" /><stop offset="1" stopColor="#0c1210" stopOpacity="0" /></radialGradient></defs>
          <rect x="170" y="15" width="660" height="635" fill="url(#treeGlow)" />
          {skillDef.nodes.flatMap(n => n.reqs.map(r => {
            const a = nodePos(skillDef.byId[r]), b = nodePos(n), lit = rankOf(r) >= 1, owned = rankOf(n.id) >= 1;
            return <line key={`${r}-${n.id}`} className={`tl ${owned ? 'owned' : lit ? 'lit' : ''}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} style={{ '--c': nodeColor(n) } as CSSProperties} />;
          }))}
          {skillDef.nodes.map(n => {
            const p = nodePos(n), rk = rankOf(n.id), reach = reachable(n), status = rk >= n.max ? 'maxed' : rk > 0 ? 'owned' : reach ? 'avail' : 'locked', R = n.keystone ? 33 : n.id === 'root' ? 30 : 26;
            return <g key={n.id} className={`tn ${status} ${n.keystone ? 'key' : ''} ${n.unlock ? 'unlock' : ''} ${selectedSkill === n.id ? 'sel' : ''}`} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`} style={{ '--c': nodeColor(n) } as CSSProperties}
              tabIndex={0} role="button" aria-label={`${n.name}, nível ${rk} de ${n.max}`} onClick={() => setSelectedSkill(n.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedSkill(n.id); } }}>
              {(n.keystone || n.unlock) && <polygon className="tn-halo" points={hexPts(0, 0, R + 7)} />}
              <polygon className="tn-hex" points={hexPts(0, 0, R)} />
              <polygon className="tn-inner" points={hexPts(0, 0, R - 6)} />
              <text className="tn-glyph" y="1" textAnchor="middle" dominantBaseline="central">{n.glyph}</text>
              {n.id !== 'root' && <text className="tn-rank" y={R + 15} textAnchor="middle">{rk}/{n.max}</text>}
            </g>;
          })}
        </svg>
        <aside className="tree-detail" style={{ '--c': nodeColor(sel) } as CSSProperties}>
          <div className="td-top"><span className="td-glyph">{sel.glyph}</span><div><small>{sel.branch === 'root' ? 'ORIGEM' : `${(skillDef.branches[sel.branch]?.name ?? '').toUpperCase()}${sel.keystone ? ' · NÓ FINAL' : sel.unlock ? ' · NOVA HABILIDADE' : ''}`}</small><strong>{sel.name}</strong></div></div>
          <p>{sel.description}</p>
          <div className="td-effect"><small>{sel.id === 'root' ? 'ESTADO' : sel.max === 1 ? 'EFEITO' : 'POR NÍVEL'}</small><span>{sel.perRank}</span></div>
          {selAbility && <div className="td-ability"><span className="td-ability-icon">{ICONS[selAbility.spell]}</span><div><small>NOVA HABILIDADE · TECLA {selAbility.key}</small><b>{selAbility.label}</b><span>{ABILITY_HINT[selAbility.spell]} · {COSTS[selAbility.spell]} de {CLASSES[progressionHud.cls].resource.toLowerCase()}</span></div></div>}
          {sel.id !== 'root' && <div className="rank-track">{Array.from({ length: sel.max }, (_, i) => <i key={i} className={i < selRank ? 'filled' : ''} />)}</div>}
          {sel.reqs.length > 0 && sel.id !== 'root' && <ul className="td-reqs">{sel.reqs.map(r => <li key={r} className={rankOf(r) >= 1 ? 'ok' : ''}>{rankOf(r) >= 1 ? '✓' : '○'} {skillDef.byId[r].name}</li>)}</ul>}
          {sel.id !== 'root' && <button type="button" className="upgrade-button" disabled={!canBuy} onClick={() => purchaseUpgrade(sel.id)}>{selRank >= sel.max ? 'NÍVEL MÁXIMO' : !selReach ? 'BLOQUEADO' : progressionHud.skillPoints < 1 ? 'SEM PONTOS' : 'MELHORAR · 1 PONTO'}</button>}
          <div className="td-totals"><small>SEUS ATRIBUTOS</small>{totals.map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}</div>
          <button type="button" className="text-btn" onClick={respecTalents}>↺ Redefinir pontos</button>
        </aside>
      </div>
      <button type="button" className="continue" onClick={closeMenus}>VOLTAR À JORNADA <span>→</span></button>
    </div>;
  };

  const toggle = (on: boolean, flip: () => void, label: string) =>
    <button type="button" className={`toggle ${on ? 'on' : ''}`} role="switch" aria-checked={on} aria-label={label} onClick={flip}><i /></button>;
  const optionsPanel = () => <div className="options">
    <div className="opt-row"><span>Qualidade gráfica<small>Sombras, bloom, densidade de vegetação</small></span>
      <div className="segmented" role="radiogroup" aria-label="Qualidade gráfica">{(['Baixa', 'Média', 'Alta'] as Quality[]).map(q => <button type="button" key={q} role="radio" aria-checked={quality === q} className={quality === q ? 'on' : ''} onClick={() => setQuality(q)}>{q}</button>)}</div></div>
    <div className="opt-row"><span>Sensibilidade do mouse</span><div className="range"><input type="range" min="1" max="10" value={sensitivity} aria-label="Sensibilidade do mouse" onChange={event => setSensitivity(Number(event.target.value))} /><b>{sensitivity}</b></div></div>
    <div className="opt-row"><span>Assistência de mira<small>A mira puxa levemente para inimigos próximos dela</small></span>{toggle(aimAssist, () => setAimAssist(v => !v), 'Assistência de mira')}</div>
    <div className="opt-row"><span>Som</span>{toggle(!muted, toggleMute, 'Som')}</div>
    <div className="opt-row"><span>Resolução dinâmica<small>Reduz a resolução quando o FPS cai</small></span>{toggle(dynamicRes, () => setDynamicRes(v => !v), 'Resolução dinâmica')}</div>
    <div className="opt-row"><span>Mostrar FPS</span>{toggle(showFps, () => setShowFps(v => !v), 'Mostrar FPS')}</div>
  </div>;
  const controlsPanel = () => <div className="controls-grid">{controlsFor(classDef).map(([keys, label]) => <div key={label}><span className="kbds">{keys.map(k => <kbd key={k}>{k}</kbd>)}</span><span>{label}</span></div>)}</div>;

  /* ---------------- multijogador: conexão e lista de jogadores ---------------- */
  const mpStatusText = net.status === 'online' ? `Online na sala “${net.room}” · ${net.peers.size + 1}/4 jogadores${net.isHost ? ' · você é o host' : ''}`
    : net.status === 'waking' ? 'Acordando o servidor… (na primeira conexão do dia pode levar até 1 minuto)'
      : net.status === 'connecting' ? 'Conectando…' : net.error || 'Desconectado';
  const mpIdle = net.status === 'offline' || net.status === 'error';
  const p2pMode = isP2P(mpForm.server);
  const usingOfficial = mpForm.server.trim() === OFFICIAL_SERVER || (p2pMode && isP2P(OFFICIAL_SERVER));
  const mpPanel = () => <div className="mp-panel">
    <label className="mp-field"><span>Seu nome</span><input value={mpForm.name} maxLength={16} placeholder="Viajante" disabled={!mpIdle} onChange={e => setMpForm(f => ({ ...f, name: e.target.value }))} /></label>
    <label className="mp-field"><span>Servidor</span><input value={mpForm.server} spellCheck={false} disabled={!mpIdle} onChange={e => { setMpForm(f => ({ ...f, server: e.target.value })); setRooms(null); }} /></label>
    {!usingOfficial && mpIdle && <button type="button" className="text-btn mp-official" onClick={() => { setMpForm(f => ({ ...f, server: OFFICIAL_SERVER })); setRooms(null); void refreshRooms(OFFICIAL_SERVER); }}>{isP2P(OFFICIAL_SERVER) ? '↺ Voltar ao modo padrão (p2p)' : '↺ Usar o servidor oficial'}</button>}
    <label className="mp-field"><span>Sala</span><input value={mpForm.room} maxLength={24} spellCheck={false} disabled={!mpIdle} onChange={e => setMpForm(f => ({ ...f, room: e.target.value }))} /></label>
    {!p2pMode && <label className="mp-check"><input type="checkbox" checked={mpForm.priv} disabled={!mpIdle} onChange={e => setMpForm(f => ({ ...f, priv: e.target.checked }))} /><span>Sala privada (não aparece na lista; entra quem souber o nome)</span></label>}
    <div className={`mp-status mp-${net.status}`}><i />{mpStatusText}</div>
    {!mpIdle
      ? <button type="button" className="menu-line" onClick={disconnectMp}>{net.status === 'online' ? 'Desconectar' : 'Cancelar'}</button>
      : <button type="button" className="continue" onClick={() => connectMp()}>{mpForm.priv && !p2pMode ? 'CRIAR / ENTRAR NA SALA PRIVADA' : 'CRIAR / ENTRAR NA SALA'} <span>→</span></button>}
    {mpIdle && !p2pMode && <div className="mp-rooms">
      <div className="mp-rooms-head"><span>SALAS ABERTAS</span><button type="button" className="text-btn" disabled={roomsLoading} onClick={() => void refreshRooms(mpForm.server.trim())}>{roomsLoading ? 'Buscando…' : '↻ Atualizar'}</button></div>
      {rooms === null ? <p className="mp-help">{roomsLoading ? 'Consultando o servidor (se estava dormindo, pode demorar um pouco)…' : 'Clique em Atualizar para ver as salas.'}</p>
        : rooms.length === 0 ? <p className="mp-help">Nenhuma sala aberta agora — crie uma e chame os amigos.</p>
          : rooms.map(r => <div key={r.room} className="mp-room"><b>{r.room}</b><small>{r.players}/{r.max} jogadores</small>
            <button type="button" className="mp-btn" disabled={r.players >= r.max} onClick={() => connectMp(r.room)}>{r.players >= r.max ? 'Cheia' : 'Entrar'}</button></div>)}
    </div>}
    <p className="mp-help">{p2pMode
      ? <>Modo padrão (<code>p2p</code>): conexão direta entre os navegadores, sem instalar nada. Quem cria a sala vira o host — combine o nome da sala com os amigos e todos entram nela. Até 4 jogadores; cada um salva o próprio herói na própria máquina.</>
      : usingOfficial
      ? 'Servidor público do jogo: qualquer pessoa pode criar ou entrar numa sala. Até 4 jogadores por sala; o primeiro a entrar simula os inimigos. Cada um salva o próprio herói na própria máquina.'
      : <>Servidor próprio: quem hospeda roda <code>npm run server</code> e passa o endereço (na rede local, ex.: <code>ws://192.168.0.10:3210</code>). Até 4 jogadores por sala.</>}</p>
  </div>;
  const playersPanel = () => {
    const p = party, iAmLeader = !!p && p.leader === net.id;
    const row = (id: string, name: string, info: { cls?: HeroClass; lvl?: number; hp?: number; mhp?: number }, me: boolean) => {
      const inParty = !!p?.members.includes(id), d = info.cls ? CLASSES[info.cls] : null;
      return <div key={id} className={`mp-player ${inParty ? 'in-party' : ''}`} style={{ '--c': d?.color ?? '#c9c2a8' } as CSSProperties}>
        <span className="mp-glyph">{d?.glyph ?? '?'}</span>
        <div className="mp-who"><strong>{name}{me && ' (você)'}{p?.leader === id && <em title="Líder do grupo"> ♛</em>}{net.host === id && <small> · host</small>}</strong>
          <small>{d ? `${d.name} · nível ${info.lvl ?? 1}` : 'entrando no mundo…'}</small>
          {info.mhp ? <div className="mp-hp"><i style={{ width: `${Math.max(0, Math.min(100, (info.hp ?? 0) / info.mhp * 100))}%` }} /></div> : null}</div>
        {!me && !inParty && (!p || iAmLeader) && (p?.members.length ?? 1) < 4 && <button type="button" className="mp-btn" onClick={() => invitePlayer(id)}>Convidar</button>}
        {me && p && <button type="button" className="mp-btn ghost" onClick={leaveParty}>Sair do grupo</button>}
      </div>;
    };
    return <>
      <span className="modal-kicker">MULTIJOGADOR · {net.online ? `SALA ${net.room.toUpperCase()}` : 'OFFLINE'}</span><h2>Jogadores e grupo</h2>
      {!net.online ? mpPanel() : <>
        <p>{p ? `Grupo de ${p.members.length}: curas e o Despertar alcançam os membros por perto, e cada um ganha +${(p.members.length - 1) * 10}% de XP.` : 'Convide alguém para formar um grupo: curas e bênçãos passam a alcançá-los e todos ganham XP extra.'}</p>
        <div className="mp-list">
          {row(net.id, mpForm.name || 'Viajante', { cls: heroChoice.cls, lvl: progressionHud.level, hp: hudStore.get().health, mhp: hudStore.get().maxHealth }, true)}
          {[...net.peers.values()].map(peer => row(peer.id, roster[peer.id]?.name ?? peer.name, roster[peer.id] ?? {}, false))}
        </div>
        <button type="button" className="text-btn" onClick={disconnectMp}>Desconectar da sala</button>
      </>}
    </>;
  };

  const playing = screen === 'playing';
  const anyModal = help || questOpen || inventoryOpen || skillsOpen || paused || playersOpen;

  return <main ref={shellRef} className={`game-shell ${playing ? 'is-playing' : 'is-title'}`}>
    <div className="scene" ref={hostRef} aria-label="Mundo 3D explorável dos Campos da Aurora" />
    <div className="vignette" />
    <div ref={damageRef} className="damage-flash" aria-hidden="true" />
    <div ref={fpsRef} className="fps-meter" hidden={!showFps} />
    <pre ref={perfPanelRef} className="perf-panel" hidden />
    <div className="cine-bars" aria-hidden="true"><i /><i /></div>
    {/* nomes sobre a cabeça dos outros jogadores (um por avatar remoto; posicionados pelo loop) */}
    <div ref={nameplatesRef} className="nameplates" aria-hidden="true">{[0, 1, 2].map(i => <div key={i} className="nameplate" style={{ display: 'none' }}><b /><span><i /></span></div>)}</div>
    <input ref={importInputRef} type="file" accept=".json,application/json" hidden onChange={e => { void onImportFile(e.target.files?.[0]); e.target.value = ''; }} />
    <div ref={captionRef} className="spell-caption" aria-hidden="true"><small>INVOCAÇÃO DAS CHAMAS INFERNAIS</small><strong>Vollzanbel</strong></div>

    {/* ======================= TELA INICIAL ======================= */}
    {!playing && <div className="title-screen" role="dialog" aria-label="Tela inicial">
      <div className="title-shade" />
      <div className="title-motes" aria-hidden="true">{Array.from({ length: 22 }, (_, i) => <i key={i} style={{ '--i': i } as CSSProperties} />)}</div>
      <svg className="title-sigil" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="96" /><circle cx="100" cy="100" r="90" className="thin" /><circle cx="100" cy="100" r="66" />
        <circle cx="100" cy="100" r="30" className="thin" />
        <polygon points="100,10 178,145 22,145" /><polygon points="100,190 22,55 178,55" />
        <g className="ticks">{Array.from({ length: 48 }, (_, i) => <line key={i} x1="100" y1="6" x2="100" y2={i % 4 ? 11 : 15} transform={`rotate(${i * 7.5} 100 100)`} />)}</g>
      </svg>
      <div className="title-column">
        <div className="title-eyebrow"><span />UM MUNDO DEPOIS DO FIM<span /></div>
        <h1 className="title-logo"><span className="title-ecos">Ecos</span><span className="title-sub">da Era dos Heróis</span></h1>
        <div className="title-rule" aria-hidden="true"><i />✦<i /></div>
        {titlePanel === 'main' ? <>
          <p className="title-quote">Quase mil anos se passaram desde a queda de Valkhor. A relva tomou os velhos caminhos e os nomes dos heróis se perderam — mas a magia ainda se lembra.</p>
          <nav className="title-menu" aria-label="Menu principal">
            <button type="button" className="title-btn primary" disabled={!ready} onClick={startJourney}>
              <span className="tb-mark">✦</span>{!ready ? 'Despertando o mundo…' : hasStarted ? 'Continuar jornada' : savedGame ? <>Continuar jornada<small className="tb-save">{CLASSES[savedGame.choice.cls].name} · nível {savedGame.progression.level}</small></> : 'Iniciar jornada'}<span className="tb-arrow">→</span>
            </button>
            {savedGame && !hasStarted && <button type="button" className="title-btn" disabled={!ready} onClick={() => { audioRef.current?.sfx('ui'); setTitlePanel('hero'); }}><span className="tb-mark">◇</span>Novo jogo</button>}
            <button type="button" className="title-btn" onClick={() => setTitlePanel('multi')}><span className="tb-mark">◇</span>Multijogador{net.online && <small className="tb-save">online · {net.peers.size + 1} na sala</small>}</button>
            <button type="button" className="title-btn" onClick={() => setTitlePanel('options')}><span className="tb-mark">◇</span>Opções</button>
            <button type="button" className="title-btn" onClick={() => setTitlePanel('controls')}><span className="tb-mark">◇</span>Controles</button>
            <button type="button" className="text-btn" onClick={() => importInputRef.current?.click()}>⇪ Importar save (.json)</button>
          </nav>
        </> : titlePanel === 'hero' ? <div className="title-panel hero-create">
          <h2>Escolha seu herói</h2>
          <div className="class-cards" role="radiogroup" aria-label="Classe">
            {CLASS_LIST.map(id => {
              const d = CLASSES[id], on = heroChoice.cls === id;
              return <button key={id} type="button" role="radio" aria-checked={on} className={`class-card ${on ? 'on' : ''}`} style={{ '--c': d.color } as CSSProperties}
                onClick={() => { audioRef.current?.sfx('ui'); setHeroChoice(c => ({ cls: id, look: c.cls === id ? c.look : { ...DEFAULT_APPEARANCE[id] } })); }}>
                <span className="cc-glyph">{d.glyph}</span><b>{d.name}</b><small>{d.epithet}</small>
              </button>;
            })}
          </div>
          <p className="class-desc">{classDef.description}</p>
          <ul className="class-traits" style={{ '--c': classDef.color } as CSSProperties}>{classDef.traits.map(t => <li key={t}>{t}</li>)}<li>Vida {classDef.health} · {classDef.resource.toLowerCase()}</li></ul>
          <div className="class-kit">{classDef.abilities.map(a => <span key={a.spell} title={ABILITY_HINT[a.spell]}><kbd>{a.key}</kbd>{a.label}</span>)}</div>
          <div className="swatch-row" role="radiogroup" aria-label="Cor do corpo"><span>Corpo</span>{BODY_COLORS.map(col => <button key={col} type="button" role="radio" aria-checked={heroChoice.look.body === col} aria-label={`Cor do corpo ${col}`} className={`swatch ${heroChoice.look.body === col ? 'on' : ''}`} style={{ background: col }} onClick={() => setHeroChoice(c => ({ ...c, look: { ...c.look, body: col } }))} />)}</div>
          <div className="swatch-row" role="radiogroup" aria-label="Cor dos detalhes"><span>Detalhes</span>{JOINT_COLORS.map(col => <button key={col} type="button" role="radio" aria-checked={heroChoice.look.joints === col} aria-label={`Cor dos detalhes ${col}`} className={`swatch ${heroChoice.look.joints === col ? 'on' : ''}`} style={{ background: col }} onClick={() => setHeroChoice(c => ({ ...c, look: { ...c.look, joints: col } }))} />)}</div>
          {savedGame && !hasStarted && <p className="mp-help">Um jogo novo substitui o save atual ({CLASSES[savedGame.choice.cls].name}, nível {savedGame.progression.level}) no próximo salvamento. Exporte-o antes se quiser guardar.</p>}
          <button type="button" className="title-btn primary" disabled={!ready} onClick={startJourney}><span className="tb-mark">{classDef.glyph}</span>Começar como {classDef.name}<span className="tb-arrow">→</span></button>
          <button type="button" className="text-btn" onClick={() => setTitlePanel('main')}>← Voltar</button>
        </div> : titlePanel === 'multi' ? <div className="title-panel">
          <h2>Multijogador</h2>
          {mpPanel()}
          {net.online && <div className="mp-list">{[...net.peers.values()].map(p => <div key={p.id} className="mp-player"><span className="mp-glyph">✦</span><div className="mp-who"><strong>{p.name}{net.host === p.id && <small> · host</small>}</strong></div></div>)}</div>}
          <button type="button" className="text-btn" onClick={() => setTitlePanel('main')}>← Voltar</button>
        </div> : <div className="title-panel">
          <h2>{titlePanel === 'options' ? 'Opções' : 'Controles'}</h2>
          {titlePanel === 'options' ? optionsPanel() : controlsPanel()}
          <button type="button" className="text-btn" onClick={() => setTitlePanel('main')}>← Voltar</button>
        </div>}
      </div>
      <footer className="title-footer">
        <span>Prólogo <b>·</b> Protótipo 0.3 <b>·</b> Herói: Xbot (exemplo do three.js / Mixamo)</span>
        <span className={ready ? 'press' : ''}>{ready ? <>Pressione <kbd>Enter</kbd> para começar</> : <><i className="loader" />Despertando o mundo…</>}</span>
      </footer>
    </div>}

    {/* ======================= HUD ======================= */}
    {playing && !anyModal && <div ref={aimReticleRef} className="aim-reticle" aria-hidden="true">
      <span className="aim-core" /><i className="aim-tick aim-top" /><i className="aim-tick aim-right" /><i className="aim-tick aim-bottom" /><i className="aim-tick aim-left" />
      <div ref={chargeRef} className="charge-ring"><span>MÁX</span></div>
    </div>}
    {playing && <div ref={shieldBarRef} className="shield-bar" aria-hidden="true"><span>{classDef.weapon === 'axe' ? 'GUARDA' : 'BARREIRA'}</span><div><i /></div><small>−3 de {classDef.resource.toLowerCase()}/s · solte F para desfazer</small></div>}
    <div className={`hud ${playing ? '' : 'hud-hidden'}`}>
      <header className="topbar">
        <div className="brand"><div className="brand-mark">✦</div><div><div className="eyebrow">UM MUNDO DEPOIS DO FIM</div><div className="brand-name">ECOS <span>DA ERA DOS HERÓIS</span></div></div></div>
        <div className="region"><span className="region-dot" />{status.area}<div className="region-sub">Oeste · Terras de Avel</div></div>
        <div className="top-actions">
          <button type="button" className="icon-button" onClick={toggleMute} aria-label={muted ? 'Ativar som' : 'Silenciar'} title={muted ? 'Ativar som' : 'Silenciar'}>{muted ? '◖' : '♫'}</button>
          <button type="button" className="icon-button" onClick={toggleInventory} aria-label="Inventário" title="Inventário (E)">E</button>
          <button type="button" className="icon-button" onClick={toggleSkills} aria-label="Árvore de habilidades" title="Habilidades (,)">✧</button>
          <button type="button" className={`icon-button ${net.online ? 'is-online' : ''}`} onClick={togglePlayers} aria-label="Jogadores e grupo" title="Jogadores e grupo (P)">P</button>
          <button type="button" className="icon-button" onClick={() => { releaseMouse(); setPaused(true); }} aria-label="Menu" title="Menu (Esc)">≡</button>
        </div>
      </header>
      <section className="quest-card"><div className="quest-kicker"><span className="tiny-star">✦</span> MEMÓRIA ESQUECIDA</div><h2>O Que Permanece</h2><p>Encontre o Marco do Herói e desperte o Eco que repousa nas pedras.</p><div className="quest-progress"><span style={{ width: `${status.discovered * 100}%` }} /></div><div className="quest-count">{status.discovered ? '1' : '0'} <span>/ 1 memória encontrada</span></div></section>
      {(wolfQuest.stage === 'active' || wolfQuest.stage === 'ready') && <section className={`quest-card quest-card-side ${wolfQuest.stage === 'ready' ? 'is-ready' : ''}`}><div className="quest-kicker"><span className="tiny-star">✦</span> PEDIDO DE ALDREN</div><h2>Uivos no Caminho</h2><p>{wolfQuest.stage === 'ready' ? 'Os lobos foram afastados. Volte até Aldren, perto do ponto de partida.' : 'Abata lobos na mata ao norte do caminho do marco.'}</p><div className="quest-progress"><span style={{ width: `${wolfQuest.kills / WOLF_QUEST_GOAL * 100}%` }} /></div><div className="quest-count">{wolfQuest.kills} <span>/ {WOLF_QUEST_GOAL} lobos abatidos</span></div></section>}
      <div className="compass"><div className="compass-ring"><span className="compass-n">N</span><span ref={compassNeedleRef} className="compass-needle">◆</span><span ref={compassPinRef} className="compass-pin">✦</span><span className="compass-s">S</span></div><div className="compass-label"><span>◷</span> {dayLabel}</div></div>
      {shiftLocked && <div className="shift-lock-indicator">SHIFT LOCK <span>ATIVO</span></div>}
      <div className="touch-controls" aria-label="Controles de toque">
        <div className="touch-stick" role="application" aria-label="Direcional de movimento" onPointerDown={onTouchStickDown} onPointerMove={onTouchStickMove} onPointerUp={onTouchStickUp} onPointerCancel={onTouchStickUp}><span className="touch-stick-n">N</span><span ref={touchKnobRef} className="touch-knob" /></div>
        <div className="touch-actions">
          {nearNpc ? <button type="button" className="touch-action touch-interact" onClick={() => interactRef.current()}>Falar · G</button>
            : nearLandmark && <button type="button" className="touch-action touch-interact" onClick={() => interactRef.current()}>Eco · G</button>}
          <button type="button" className="touch-action" onClick={toggleInventory}>Inventário</button>
          <button type="button" className="touch-action" onClick={toggleSkills}>Habilidades</button>
          <button type="button" className="touch-action" onClick={() => attackRef.current()}>Atacar</button>
          <button type="button" className="touch-action" onClick={() => dodgeRef.current()}>Esquiva</button>
          {classDef.abilities.filter(a => isUnlocked(heroChoice.cls, progressionHud.ranks, a.spell)).map((a, i) => a.mode === 'charge'
            ? <button key={a.spell} type="button" className="touch-action touch-signature" onPointerDown={() => zoltraakRef.current.start()} onPointerUp={() => zoltraakRef.current.release()} onPointerCancel={() => zoltraakRef.current.release()} onPointerLeave={() => zoltraakRef.current.release()}>{a.label}</button>
            : a.mode === 'hold'
              ? <button key={a.spell} type="button" className="touch-action" onPointerDown={() => shieldRef.current.start()} onPointerUp={() => shieldRef.current.release()} onPointerCancel={() => shieldRef.current.release()} onPointerLeave={() => shieldRef.current.release()}>{a.label}</button>
              : <button key={a.spell} type="button" className={`touch-action ${i === 0 ? 'touch-signature' : ''}`} onClick={() => castAbilityRef.current(a.spell)}>{a.label}</button>)}
          <button type="button" className="touch-action" onPointerDown={event => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); touchJumpRef.current = true; }} onPointerUp={() => { touchJumpRef.current = false; }} onPointerCancel={() => { touchJumpRef.current = false; }}>Pular</button>
          <button type="button" className="touch-action touch-sprint" onPointerDown={event => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); touchSprintRef.current = true; }} onPointerUp={() => { touchSprintRef.current = false; }} onPointerCancel={() => { touchSprintRef.current = false; }}>Correr</button>
          <button type="button" className="touch-action" onClick={() => setPaused(true)}>Menu</button>
        </div>
      </div>
      {party && <div className="party-frames" aria-label="Grupo">
        <div className="party-title">GRUPO · {party.members.length}/4</div>
        {party.members.filter(id => id !== net.id).map(id => { const r = roster[id], d = r ? CLASSES[r.cls] : null, pct = r ? Math.max(0, Math.min(100, r.hp / Math.max(1, r.mhp) * 100)) : 0;
          return <div key={id} className={`party-member ${r && r.hp <= 0 ? 'down' : ''}`} style={{ '--c': d?.color ?? '#c9c2a8' } as CSSProperties}>
            <span className="pm-glyph">{d?.glyph ?? '…'}</span>
            <div><strong>{r?.name ?? net.peers.get(id)?.name ?? 'Aliado'}{party.leader === id && ' ♛'}</strong><small>{d ? `Nv ${r!.lvl} · ${d.name}` : 'longe'}</small><div className="pm-hp"><i style={{ width: `${pct}%` }} /></div></div>
          </div>; })}
      </div>}
      {invites.length > 0 && <div className="invites">{invites.map(inv => <div key={inv.from} className="invite"><span>✦ <b>{inv.name}</b> convidou você para o grupo</span><button type="button" className="mp-btn" onClick={() => answerInvite(inv.from, true)}>Aceitar</button><button type="button" className="mp-btn ghost" onClick={() => answerInvite(inv.from, false)}>Recusar</button></div>)}</div>}
      <div className="bottom-left">
        <div className="player-card">
          <div className="portrait"><span>✧</span><b className="portrait-level" title="Nível">{progressionHud.level}</b></div>
          <div className="player-meta">
            <div className="player-name"><strong>Chamado</strong><span>Errante das Terras de Avel</span></div>
            <HudBars store={hudStore} resource={classDef.resource} />
            <div className="bar bar-xp" aria-label="Experiência"><i style={{ width: `${Math.min(100, progressionHud.experience / progressionHud.nextLevelXp * 100)}%` }} /><span>XP {progressionHud.experience}/{progressionHud.nextLevelXp}</span></div>
          </div>
        </div>
        <div className="status-line">
          {progressionHud.skillPoints > 0 && <button type="button" className="pill pill-gold" onClick={toggleSkills}>✦ {progressionHud.skillPoints} {progressionHud.skillPoints === 1 ? 'ponto' : 'pontos'} de habilidade</button>}
          <HudPills store={hudStore} />
        </div>
      </div>
      <div className="bottom-center">
        {nearNpc && !npcDialog ? <div className="interaction"><span className="keycap">G</span><span>Falar com Aldren{wolfQuest.stage === 'ready' ? ' · entregar missão' : ''}</span></div>
          : nearLandmark && <div className="interaction"><span className="keycap">G</span><span>Ouvir o Eco do marco</span></div>}
        <div className="hotbar">
          {classDef.abilities.map((a, i) => <SpellSlot key={a.spell} store={hudStore} spell={a.spell} hotkey={a.key} label={a.label} resource={classDef.resource} signature={i === 0} cast={castAbilityRef} lockedBy={isUnlocked(heroChoice.cls, progressionHud.ranks, a.spell) ? null : unlockNode(heroChoice.cls, a.spell)?.name} />)}
          <span className="hotbar-sep" aria-hidden="true" />
          <button type="button" className="slot-btn util" onClick={toggleQuest} title="Diário de viagem (J)"><span className="slot-face">{ICONS.journal}</span><span className="slot-key">J</span><span className="slot-name">Jornada</span></button>
          <button type="button" className="slot-btn util" onClick={toggleHelp} title="Controles (H)"><span className="slot-face">{ICONS.help}</span><span className="slot-key">H</span><span className="slot-name">Ajuda</span></button>
        </div>
      </div>
      <div className="bottom-right"><EnemiesLeft store={hudStore} /></div>
      {hint && <div className="toast"><span>✦</span>{hint}</div>}
      {areaBanner && <div className="area-banner" aria-live="polite"><small>OESTE · TERRAS DE AVEL</small><strong>Campos da Aurora</strong><i /></div>}
    </div>

    {/* ======================= DIÁLOGO COM NPC ======================= */}
    {playing && npcDialog && <div className="npc-dialog" role="dialog" aria-modal="true" aria-label="Conversa com Aldren">
      <div className="npc-dialog-box">
        <div className="npc-speaker"><span className="npc-badge">✦</span><div><strong>Aldren</strong><small>Pastor dos Campos da Aurora</small></div></div>
        {wolfQuest.stage === 'available' ? <>
          <p>Ei, viajante! Espere um instante. Os lobos desceram da mata e rondam o caminho do marco. Esta semana já levaram duas das minhas ovelhas, e eu não tenho mais pernas para enfrentá-los.</p>
          <p>Se você abater <b>{WOLF_QUEST_GOAL} lobos</b>, divido com você tudo o que aprendi andando por estes campos. Para alguém no começo da jornada, isso vale muito.</p>
          <div className="npc-reward"><span>RECOMPENSA</span>Experiência para subir 2 níveis</div>
          <div className="npc-actions"><button type="button" className="continue" onClick={() => npcActionsRef.current.accept()}>ACEITAR MISSÃO <span>→</span></button><button type="button" className="menu-line" onClick={() => npcActionsRef.current.close()}>Agora não</button></div>
        </> : wolfQuest.stage === 'active' ? <>
          <p>Ainda ouço os uivos lá do norte, perto das árvores além do marco. Cuidado: eles atacam em bando e mordem rápido.</p>
          <div className="npc-reward"><span>PROGRESSO</span>{wolfQuest.kills} / {WOLF_QUEST_GOAL} lobos abatidos</div>
          <div className="npc-actions"><button type="button" className="continue" onClick={() => npcActionsRef.current.close()}>ESTOU A CAMINHO <span>→</span></button></div>
        </> : wolfQuest.stage === 'ready' ? <>
          <p>Os uivos pararam... Você conseguiu! Faz muito tempo que alguém não protegia estes campos como os heróis de antigamente.</p>
          <p>Tome. Não é ouro, mas é o que um velho pastor tem de mais valioso: o que aprendi em uma vida inteira.</p>
          <div className="npc-reward"><span>RECOMPENSA</span>+{wolfQuest.reward} XP · nível {progressionHud.level} → {progressionHud.level + 2}</div>
          <div className="npc-actions"><button type="button" className="continue" onClick={() => npcActionsRef.current.turnIn()}>RECEBER RECOMPENSA <span>→</span></button></div>
        </> : <>
          <p>Os campos estão mais tranquilos graças a você. As ovelhas voltaram a pastar perto do marco. Que o vento esteja a seu favor, viajante.</p>
          <div className="npc-actions"><button type="button" className="continue" onClick={() => npcActionsRef.current.close()}>ATÉ LOGO <span>→</span></button></div>
        </>}
      </div>
    </div>}

    {gameError && <div className="game-error"><strong>O mundo não pôde ser carregado</strong><span>{gameError}</span><button type="button" onClick={() => window.location.reload()}>Tentar novamente</button></div>}

    {/* ======================= MENUS ======================= */}
    {playing && anyModal && <div className="modal-backdrop" onClick={closeMenus}><div className={`modal ${inventoryOpen ? 'progression-modal' : ''} ${skillsOpen ? 'tree-modal' : ''} ${help ? 'wide-modal' : ''}`} role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
      <button type="button" className="modal-close" onClick={closeMenus} aria-label="Fechar">×</button>
      {paused ? <><span className="modal-kicker">CAMPOS DA AURORA · PAUSA</span><h2>A jornada repousa.</h2>
        {pausePanel === 'main' ? <><p>O Eco ainda aguarda entre as pedras. Respire, ajuste o que precisar e retome quando quiser.</p>
          <div className="pause-menu">
            <button type="button" className="continue" onClick={closeMenus}>RETOMAR A JORNADA <span>→</span></button>
            <button type="button" className="menu-line" onClick={() => saveNow()}>Salvar jogo{savedGame && <small> · último: {new Date(savedGame.savedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small>}</button>
            <button type="button" className="menu-line" onClick={() => { const d = collectSaveRef.current(); if (d) { writeSave(d); setSavedGame(d); exportSave(d); } }}>Exportar save (.json)</button>
            <button type="button" className="menu-line" onClick={() => { setPaused(false); setPlayersOpen(true); }}>Jogadores e grupo{net.online ? ` · ${net.peers.size + 1} na sala` : ''}</button>
            <button type="button" className="menu-line" onClick={() => setPausePanel('options')}>Opções</button>
            <button type="button" className="menu-line" onClick={() => setPausePanel('controls')}>Controles</button>
            <button type="button" className="menu-line" onClick={() => { saveNow(true); backToTitle(); }}>Salvar e voltar à tela inicial</button>
          </div></>
          : <>{pausePanel === 'options' ? optionsPanel() : controlsPanel()}<button type="button" className="text-btn" onClick={() => setPausePanel('main')}>← Voltar</button></>}</>
        : playersOpen ? playersPanel()
        : help ? <><span className="modal-kicker">CAMINHOS DO VIAJANTE</span><h2>Um passo de cada vez.</h2><p>Enfrente lobos, bandidos e demônios. A mira central indica o alvo; aproxime-se dos cristais para recolher XP e itens raros.</p>{controlsPanel()}<button type="button" className="continue" onClick={closeMenus}>CONTINUAR A JORNADA <span>→</span></button></>
        : inventoryOpen ? <><span className="modal-kicker">PERTENCES DO VIAJANTE</span><h2>Inventário</h2><p>Recolha os cristais de experiência e os itens deixados pelos inimigos.</p><div className="inventory-grid"><article className="inventory-item"><span className="item-glyph">✧</span><div><strong>Fragmento de Eco</strong><small>Resíduo de energia arcana</small></div><b>{progressionHud.inventory.echoFragment}</b></article><article className="inventory-item"><span className="item-glyph">◇</span><div><strong>Núcleo de sentinela</strong><small>Material deixado pelos Ecos</small></div><b>{progressionHud.inventory.sentinelCore}</b></article>{(Object.keys(LOOT_INFO) as LootItemId[]).map(item => <article className={`inventory-item loot-${LOOT_INFO[item].rarity.toLowerCase()}`} key={item}><span className="item-glyph">{LOOT_INFO[item].rarity === 'Épico' ? '✦' : LOOT_INFO[item].rarity === 'Raro' ? '⬡' : '◇'}</span><div><strong>{LOOT_INFO[item].name}</strong><small>{LOOT_INFO[item].rarity} · {LOOT_INFO[item].source}</small></div><b>{progressionHud.inventory[item]}</b></article>)}</div><div className="inventory-footer">Nível {progressionHud.level} <span>·</span> {progressionHud.experience}/{progressionHud.nextLevelXp} XP <span>·</span> {progressionHud.skillPoints} pontos de habilidade</div><button type="button" className="continue" onClick={closeMenus}>VOLTAR À JORNADA <span>→</span></button></>
        : skillsOpen ? skillTree()
        : <><span className="modal-kicker">DIÁRIO DE VIAGEM · 01</span><h2>O Que Permanece</h2><p>Quase mil anos se passaram desde a derrota de Valkhor. A relva tomou os velhos caminhos, e os nomes dos heróis já não são lembrados.</p><p>Um marco de pedra repousa além do prado, coberto de musgo. Talvez ainda guarde uma lembrança.</p><div className="quest-objective"><span>✦</span>{status.discovered ? 'Memória do Marco do Herói despertada' : 'Encontre o Marco do Herói nos campos'}</div>{wolfQuest.stage !== 'available' && <div className="quest-objective"><span>{wolfQuest.stage === 'done' ? '✓' : '✦'}</span>{wolfQuest.stage === 'done' ? `Uivos no Caminho · concluída (+${wolfQuest.reward} XP)` : wolfQuest.stage === 'ready' ? 'Uivos no Caminho · fale com Aldren para receber a recompensa' : `Uivos no Caminho · ${wolfQuest.kills}/${WOLF_QUEST_GOAL} lobos abatidos`}</div>}</>}
    </div></div>}
  </main>;
}
