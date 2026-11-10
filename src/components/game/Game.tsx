'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AmbientAudio } from './audio';
import { CombatSystem } from './combat';
import { createHero, type HeroPose } from './hero';
import { MagicSystem, type SpellId } from './magic';
import { PlayerProgression, LOOT_INFO, SKILL_NODES, SKILL_BY_ID, BRANCH_INFO, type LootItemId, type ProgressionSnapshot, type SkillNode } from './progression';
import { PlayerMotor, ThirdPersonCamera } from './simulation';
import { PerfMonitor } from './perf-monitor';
import { QuestGiver, type QuestStage } from './npc';

/** Missão do Aldren: abater lobos perto do caminho do marco. */
const WOLF_QUEST_GOAL = 3;
type WolfQuest = { stage: QuestStage; kills: number; reward: number };
import { createWorld, setWorldQuality, terrainHeight, updateWorld, updateDayCycle, pondDist, streamDist, POND, type WorldParts } from './world';

type GameStatus = { area: string; discovered: number };
type Quality = 'Baixa' | 'Média' | 'Alta';
type Panel = 'main' | 'options' | 'controls';
type CombatHud = {
  mana: number; maxMana: number; health: number; maxHealth: number; alive: number; shield: boolean; flying: boolean; blocks: number;
  cooldowns: Record<SpellId, number>; cdFrac: Record<SpellId, number>;
};
/** Quanto a câmera "entra na mira": cheio ao carregar/disparar o Zoltraak. */
const playingAim = (magic: { charging: boolean; beamActive: boolean; chargeLevel: number }) => magic.beamActive ? 1 : magic.charging ? .45 + magic.chargeLevel * .55 : 0;
const NO_CD: Record<SpellId, number> = { zoltraak: 0, vollzanbel: 0, judradjim: 0, shield: 0, flight: 0 };

/** Ícones vetoriais das magias e atalhos (herdam a cor do texto). */
const ICONS: Record<SpellId | 'journal' | 'help', ReactNode> = {
  zoltraak: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7.5" cy="12" r="4" fill="currentColor" /><circle cx="7.5" cy="12" r="5.8" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M12.5 10.4h9M12.5 13.6h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M18 6.2v1.6M17.2 7h1.6M15.5 16.8v1.4M14.8 17.5h1.4" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" /></svg>,
  vollzanbel: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.8 3.6 5.6 5.6 5.6 11.3a5.6 5.6 0 0 1-11.2 0c0-2.8 1.7-4.7 2.7-6.5.2 1.9 1 2.9 2 3.1-.1-3 -.8-4.9.9-7.9z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M12 20.5a2.6 2.6 0 0 1-2.6-2.6c0-1.6 1.6-2.4 2.2-4 .9 1.5 3 2.3 3 4a2.6 2.6 0 0 1-2.6 2.6z" fill="currentColor" /></svg>,
  judradjim: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 5.5 13.2h5.6L9.4 22l9.1-12.4h-5.8L14.6 2z" fill="currentColor" /></svg>,
  shield: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.4 20.3 7.2v9.6L12 21.6l-8.3-4.8V7.2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M12 6.8 16.3 9.3v5.4L12 17.2l-4.3-2.5V9.3z" fill="currentColor" opacity=".55" /></svg>,
  flight: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5c-8.3.2-13.8 5-15 12.7l-2 4.3 4.2-2c7.6-1.3 12.6-6.8 12.8-15z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M6.5 17.5 16 8M9 15h4.5M11.5 12.2h3.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>,
  journal: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h9.5a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M5 17a3 3 0 0 1 3-3h9.5M9 8h5M9 10.6h3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  help: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="12" cy="16.9" r="1" fill="currentColor" /></svg>,
};
const CONTROLS: [string[], string][] = [
  [['W', 'A', 'S', 'D'], 'Mover'], [['Cursor'], 'Mirar (mouse livre)'], [['Arrastar'], 'Girar a câmera (botão esq./dir.)'], [['Roda'], 'Zoom da câmera'], [['Shift'], 'Alternar Shift Lock'],
  [['Alt'], 'Correr / voar rápido'], [['Espaço'], 'Pular / subir voando'], [['Ctrl'], 'Descer voando'],
  [['Q'], 'Zoltraak · segure para carregar'], [['1'], 'Vollzanbel · bola de fogo'], [['2'], 'Judradjim · relâmpago'],
  [['F'], 'Escudo arcano · segure (−3 mana/s)'], [['R'], 'Voo'], [['Clique dir.'], 'Golpe com o cajado (sem arrastar)'], [['X'], 'Esquiva'], [['T'], 'Guardar / sacar o cajado'], [['V'], 'Postura defensiva'],
  [['E'], 'Inventário'], [[','], 'Habilidades'], [['G'], 'Ouvir o Marco'], [['J'], 'Diário de viagem'], [['Esc'], 'Pausar'],
];

type HudStore = { get: () => CombatHud; set: (v: CombatHud) => void; subscribe: (l: () => void) => () => void };
function createHudStore(initial: CombatHud): HudStore {
  let value = initial; const listeners = new Set<() => void>();
  return { get: () => value, set: v => { value = v; listeners.forEach(l => l()); }, subscribe: l => { listeners.add(l); return () => { listeners.delete(l); }; } };
}
const useHud = (store: HudStore) => useSyncExternalStore(store.subscribe, store.get, store.get);
const COSTS: Record<SpellId, number> = { zoltraak: 10, vollzanbel: 34, judradjim: 27, shield: 20, flight: 12 };
const SLOTS: [SpellId, string, string][] = [['zoltraak', 'Q', 'Zoltraak'], ['vollzanbel', '1', 'Vollzanbel'], ['judradjim', '2', 'Judradjim'], ['shield', 'F', 'Escudo'], ['flight', 'R', 'Voo']];
function HudBars({ store }: { store: HudStore }) {
  const h = useHud(store);
  return <>
    <div className="bar bar-health" aria-label={`Vida ${h.health}`}><i style={{ width: `${Math.min(100, h.health / h.maxHealth * 100)}%` }} /><span>VIDA</span><b>{h.health}</b></div>
    <div className="bar bar-mana" aria-label={`Mana ${h.mana}`}><i style={{ width: `${Math.min(100, h.mana / h.maxMana * 100)}%` }} /><span>MANA</span><b>{h.mana}</b></div>
  </>;
}
function HudPills({ store }: { store: HudStore }) {
  const h = useHud(store);
  return <>
    {h.shield && <span className="pill">⬡ Escudo{h.blocks > 0 ? ` · ${h.blocks} bloqueios` : ''}</span>}
    {h.flying && <span className="pill">➶ Voo</span>}
  </>;
}
function EnemiesLeft({ store }: { store: HudStore }) {
  const h = useHud(store);
  return <div className="enemies-left"><b>{h.alive}</b> ecos hostis nos campos</div>;
}
function SpellSlot({ store, spell, hotkey, label, cast }: { store: HudStore; spell: SpellId; hotkey: string; label: string; cast: { current: (spell: SpellId) => void } }) {
  const h = useHud(store), cd = h.cooldowns[spell], lacking = h.mana < COSTS[spell];
  return <button type="button" className={`slot-btn ${cd > 0 ? 'cooling' : ''} ${lacking ? 'no-mana' : ''} ${spell === 'zoltraak' ? 'signature' : ''}`}
    style={{ '--cd': h.cdFrac[spell] } as CSSProperties}
    title={`${label} · ${COSTS[spell]}${spell === 'zoltraak' ? '+' : ''} mana${cd > 0 ? ` · recarga ${cd.toFixed(1)} s` : ''}`}
    onClick={() => cast.current(spell)}>
    <span className="slot-face">{ICONS[spell]}{cd > 0 && <span className="slot-cd">{cd.toFixed(1)}</span>}</span>
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
  const modalFlagsRef = useRef({ help: false, quest: false, inventory: false, skills: false });
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
  if (!hudStoreRef.current) hudStoreRef.current = createHudStore({ mana: 1000, maxMana: 1000, health: 100, maxHealth: 100, alive: 7, shield: false, flying: false, blocks: 0, cooldowns: NO_CD, cdFrac: NO_CD });
  const hudStore = hudStoreRef.current;
  const [progressionHud, setProgressionHud] = useState<ProgressionSnapshot>({ level: 1, experience: 0, nextLevelXp: 100, skillPoints: 0, ranks: { root: 1 }, stats: new PlayerProgression().stats, inventory: { echoFragment: 0, sentinelCore: 0, wolfPelt: 0, banditToken: 0, demonAsh: 0, moonFang: 0, ancientSigil: 0, demonHeart: 0 } });
  const [npcDialog, setNpcDialog] = useState(false);
  const [nearNpc, setNearNpc] = useState(false);
  const [wolfQuest, setWolfQuest] = useState<WolfQuest>({ stage: 'available', kills: 0, reward: 0 });
  npcDialogRef.current = npcDialog;
  uiOpenRef.current = help || questOpen || inventoryOpen || skillsOpen || paused || npcDialog || screen === 'title';
  titleRef.current = screen === 'title';
  qualityRef.current = quality;
  dynamicResRef.current = dynamicRes;
  modalFlagsRef.current = { help, quest: questOpen, inventory: inventoryOpen, skills: skillsOpen };

  const releaseMouse = useCallback(() => {
    if (typeof document !== 'undefined' && document.pointerLockElement) document.exitPointerLock();
    cameraRigRef.current?.setShiftLock(false);
    setShiftLocked(false);
  }, []);
  const toggleHelp = useCallback(() => { audioRef.current?.sfx('ui'); releaseMouse(); setHelp(value => !value); setQuestOpen(false); setInventoryOpen(false); setSkillsOpen(false); }, [releaseMouse]);
  const toggleQuest = useCallback(() => { audioRef.current?.sfx('ui'); releaseMouse(); setQuestOpen(value => !value); setHelp(false); setInventoryOpen(false); setSkillsOpen(false); }, [releaseMouse]);
  const toggleInventory = useCallback(() => { audioRef.current?.sfx('ui'); releaseMouse(); setInventoryOpen(value => !value); setSkillsOpen(false); setHelp(false); setQuestOpen(false); }, [releaseMouse]);
  const toggleSkills = useCallback(() => { audioRef.current?.sfx('ui'); releaseMouse(); setSkillsOpen(value => !value); setInventoryOpen(false); setHelp(false); setQuestOpen(false); }, [releaseMouse]);
  const startJourney = useCallback(() => {
    if (!rendererRef.current) return;
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
    // corpo esquelético (Xbot, exemplo oficial do three.js / Mixamo); se falhar, fica o corpo procedural
    let disposed = false;
    // corpo esquelético (Xbot, exemplo oficial do three.js / Mixamo); se falhar, fica o corpo procedural
    // personagem principal: Agris (agris.glb); se falhar, Xbot; se falhar, corpo procedural
    const loader = new GLTFLoader();
    loader.load('/models/agris.glb', gltf => { if (!disposed) hero.attachBody(gltf, { full: true }); }, undefined,
      () => loader.load('/models/Xbot.glb', gltf => { if (!disposed) hero.attachBody(gltf); }, undefined, () => { /* mantém o corpo procedural */ }));
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
    const combat = new CombatSystem(scene, amount => progression.recordExperience(amount), item => progression.addItem(item), showHint);
    const magic = new MagicSystem(scene, hero.root, combat, world.blockers, progression, () => { reticleHitUntil = elapsed + .28; });
    magic.setStaffTip(hero.spellPoint);
    magic.onSfx = (name, v) => ambient.sfx(name, v);
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
      if (uiOpenRef.current || combat.health <= 0 || elapsed < cine.until) return;
      if (magic.shieldActive && spell !== 'shield' && spell !== 'flight') { showHint('Solte o escudo (F) para usar outra habilidade.'); return; }
      ambient.start();
      hero.ensureStaff();
      hero.spellPoint.getWorldPosition(spellOrigin);
      cameraRig.getAimPoint(spellAim, combat.targets);
      spellDirection.copy(spellAim).sub(spellOrigin).normalize();
      if (magic.cast(spell, spellOrigin, spellDirection, spellAim)) {
        hero.root.userData.castKind = spell;
        castUntil = elapsed + (spell === 'vollzanbel' ? 1.35 : spell === 'judradjim' ? .95 : spell === 'shield' ? .62 : .48);
        if (spell !== 'shield' && spell !== 'flight') faceAimUntil = elapsed + (spell === 'judradjim' ? 1 : spell === 'vollzanbel' ? 1.4 : .6);
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
    const startCinematic = () => {
      cine.start = elapsed; cine.until = elapsed + 1.3;
      const shell = shellRef.current;
      if (shell) { shell.classList.remove('cinematic'); void shell.offsetWidth; shell.classList.add('cinematic'); }
    };
    const startZoltraak = () => {
      if (uiOpenRef.current || combat.health <= 0 || magic.shieldActive) return;
      ambient.start(); hero.ensureStaff(); aimNow();
      if (magic.beginCharge() && aimReticleRef.current) aimReticleRef.current.classList.add('is-casting');
    };
    const releaseZoltraak = () => {
      if (!magic.charging) return;
      aimNow();
      magic.releaseCharge();
    };
    zoltraakRef.current = { start: startZoltraak, release: releaseZoltraak };
    const startShield = () => {
      if (uiOpenRef.current || combat.health <= 0 || elapsed < cine.until || magic.charging || magic.beamActive) return;
      ambient.start(); hero.ensureStaff();
      if (magic.beginShield()) { hero.root.userData.castKind = 'shield'; castUntil = elapsed + .62; }
      else if (magic.cooldown('shield') > 0) showHint(`Escudo em recarga · ${magic.cooldown('shield').toFixed(1)} s`);
    };
    const releaseShield = () => magic.releaseShield();
    shieldRef.current = { start: startShield, release: releaseShield };
    const performAttack = () => {
      if (uiOpenRef.current || combat.health <= 0 || magic.shieldActive) return;
      const facing = hero.root.userData.facing ?? hero.root.rotation.y;
      const target = hero.root.position.clone().add(new THREE.Vector3(Math.sin(facing), 0, Math.cos(facing)).multiplyScalar(2.15));
      target.y += 1.2;
      if (combat.damageAt(target, 1.25, 30) > 0) reticleHitUntil = elapsed + .28;
      attackUntil = elapsed + .38;
      ambient.start(); ambient.sfx('swing');
    };
    attackRef.current = performAttack;
    dodgeRef.current = () => {
      if (uiOpenRef.current || combat.health <= 0) return;
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
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'f3') { // painel de desempenho (desenvolvedor)
        event.preventDefault(); const panel = perfPanelRef.current;
        if (panel) { panel.hidden = !panel.hidden; perf.attachPanel(panel.hidden ? null : panel); }
        return;
      }
      if (titleRef.current) { if (key === 'enter' && !event.repeat) startRef.current(); return; }
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'shift', 'alt', 'escape', 'h', 'j', 'e', 'g', 'q', '1', '2', 'f', 'r', 'v', 'x', 't', 'control', ','].includes(key)) event.preventDefault();
      if (event.repeat && ['escape', 'h', 'j', 'e', 'g', 'q', '1', '2', 'f', 'r', 'x', ' ', ','].includes(key)) return;
      if (key === 'escape') {
        keys.clear();
        if (npcDialogRef.current) { npcActionsRef.current.close(); return; }
        if (modalFlagsRef.current.help || modalFlagsRef.current.quest || modalFlagsRef.current.inventory || modalFlagsRef.current.skills) { setHelp(false); setQuestOpen(false); setInventoryOpen(false); setSkillsOpen(false); }
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
      if (key === 'g' && isNearNpc && !uiOpenRef.current) { talkToNpc(); return; }
      if (key === 'g' && isNearMarker && !uiOpenRef.current) {
        interactMarker();
        return;
      }
      if (key === 'q') { startZoltraak(); return; }
      if (key === '1') { castAbility('vollzanbel'); return; }
      if (key === '2') { castAbility('judradjim'); return; }
      if (key === 'f') { startShield(); return; }
      if (key === 'r') { castAbility('flight'); return; }
      if (key === 'x') { dodgeRef.current(); return; }
      if (key === 't' && !event.repeat) {
        if (uiOpenRef.current || combat.health <= 0 || elapsed < cine.until || magic.charging || magic.beamActive || magic.shieldActive) return;
        showHint((ambient.sfx('staffToggle'), hero.toggleStaff()) ? 'Cajado em mãos.' : 'Cajado guardado nas costas.');
        return;
      }
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'alt', 'control', 'v'].includes(key)) {
        ambient.start(); keys.add(key);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      keys.delete(key);
      if (key === 'q') releaseZoltraak();
      if (key === 'f') releaseShield();
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
      const rawDelta = clock.getDelta(), delta = Math.min(.05, rawDelta);
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
        const t = elapsed * .04;
        camTarget.set(Math.sin(t) * 14.5, 0, -12 + Math.cos(t) * 14.5);
        camTarget.y = Math.max(terrainHeight(camTarget.x, camTarget.z) + 2.6, 4.4 + Math.sin(elapsed * .17) * .7);
        camera.position.lerp(camTarget, firstFrame ? 1 : 1 - Math.exp(-delta * 2.5));
        camera.lookAt(0, 3.1, -12);
        hero.update(elapsed, delta, 'idle', 0);
        npc.update(delta, elapsed, hero.root.position);
        magic.update(delta, elapsed);
        updateWorld(world, elapsed);
        cycleTick += delta;
        if (cycleTick >= 1 || firstFrame) { cycleTick = 0; const cycle = updateDayCycle(scene, sun, sky, elapsed); setDayLabel(cycle.label); }
        if (renderer.shadowMap.enabled && frameCount % 3 === 0) renderer.shadowMap.needsUpdate = true;
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
      if (uiOpenRef.current && !npcDialogRef.current && frameCount % 3 !== 0) return;
      if (!uiOpenRef.current) {
        elapsed += delta;
        const wasGrounded = motor.grounded, vyBefore = motor.verticalSpeed;
        const st = progression.stats; // atributos dos talentos
        if (st.maxHealth > combat.maxHealth) combat.health += st.maxHealth - combat.maxHealth; // melhorar a vida máxima cura a diferença
        combat.maxHealth = st.maxHealth; combat.health = Math.min(combat.health, combat.maxHealth); combat.resist = st.resist;
        motor.verticalScale = st.flyVertical;
        if (magic.flying) combat.heal(st.flyRegen * delta);
        const zoltraakActive = combat.health > 0 && (magic.charging || magic.beamActive);
        motor.speedScale = (zoltraakActive ? (magic.beamActive ? .35 : .55) : 1) * (magic.flying ? st.flySpeed : 1);
        const inCine = elapsed < cine.until;
        const forward = inCine ? 0 : (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0) + touchMoveRef.current.forward;
        const side = inCine ? 0 : (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0) + touchMoveRef.current.side;
        const moving = combat.health > 0 && motor.update(delta, THREE.MathUtils.clamp(forward, -1, 1), THREE.MathUtils.clamp(side, -1, 1), keys.has('alt') || touchSprintRef.current, keys.has(' ') || touchJumpRef.current, cameraRig.yaw, magic.flying, Number(keys.has(' ') || touchJumpRef.current) - Number(keys.has('control')), cameraRig.pitch);
        combat.pushPlayer(hero.root.position); // inimigos têm corpo sólido
        if (combat.health > 0 && (shiftLockActive || Math.hypot(motor.velocity.x, motor.velocity.z) > .2)) {
          hero.root.userData.facing = shiftLockActive ? cameraRig.yaw + Math.PI : Math.atan2(motor.velocity.x, motor.velocity.z);
        }
        // enquanto carrega/dispara, a câmera vai para o ombro (raio e mira ficam livres do corpo)
        if (zoltraakActive !== zoltraakFraming && !shiftLockActive) cameraRig.setShiftLock(zoltraakActive);
        zoltraakFraming = zoltraakActive;
        // ao lançar qualquer feitiço de ataque, a heroína vira para onde a mira aponta
        if (!zoltraakActive && elapsed < faceAimUntil && combat.health > 0) hero.root.userData.facing = Math.atan2(spellAim.x - hero.root.position.x, spellAim.z - hero.root.position.z);
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
        const pose: HeroPose = combat.health <= 0 ? 'defeat' : elapsed < hitUntil ? 'hit' : elapsed < castUntil ? 'cast' : elapsed < attackUntil ? 'attack' : elapsed < dodgeUntil ? 'dodge' : elapsed < landUntil ? 'land' : keys.has('v') ? 'guard' : magic.flying ? 'fly' : !motor.grounded ? (motor.verticalSpeed < -1 ? 'fall' : 'jump') : moving ? (keys.has('alt') || touchSprintRef.current ? 'run' : 'walk') : 'idle';
        const overlay = magic.charging ? { mode: 'charge' as const, power: magic.chargeLevel } : magic.beamActive ? { mode: 'beam' as const, power: magic.beamPower } : magic.shieldActive && elapsed > castUntil && !magic.flying ? { mode: 'shield' as const, power: magic.shieldDurability } : undefined;
        hero.update(elapsed, delta, pose, Math.hypot(motor.velocity.x, motor.velocity.z), overlay);
        ambient.setBeam(magic.charging ? 1 : magic.beamActive ? 2 : 0, magic.charging ? magic.chargeLevel : magic.beamPower);
        magic.update(delta, elapsed);
        combat.barrier = magic.shieldBarrier(shieldBarrier);
        combat.update(delta, elapsed, hero.root.position, (from, to) => magic.blockProjectile(from, to));
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
          const ids: SpellId[] = ['zoltraak', 'vollzanbel', 'judradjim', 'shield', 'flight'];
          const cooldowns = {} as Record<SpellId, number>, cdFrac = {} as Record<SpellId, number>;
          for (const id of ids) { cooldowns[id] = Math.ceil(magic.cooldown(id) * 10) / 10; cdFrac[id] = Math.round(magic.cooldownFraction(id) * 40) / 40; }
          const hud: CombatHud = { mana: Math.round(magic.mana), maxMana: Math.round(magic.maxMana), health: Math.round(combat.health), maxHealth: Math.round(combat.maxHealth), alive: combat.alive, shield: magic.shieldActive, flying: magic.flying, blocks: magic.blocks, cooldowns, cdFrac };
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
      if (elapsed < cine.until) {
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

  const closeMenus = () => { setHelp(false); setQuestOpen(false); setInventoryOpen(false); setSkillsOpen(false); setPaused(false); setPausePanel('main'); };
  const [selectedSkill, setSelectedSkill] = useState('int_a');
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
  const nodeColor = (n: SkillNode) => n.branch === 'root' ? '#f1dfa6' : BRANCH_INFO[n.branch].color;
  const rankOf = (id: string) => progressionHud.ranks[id] ?? 0;
  const reachable = (n: SkillNode) => n.reqs.every(r => rankOf(r) >= 1);
  const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${Math.round(v * 100)}%`;
  const skillTree = () => {
    const sel = SKILL_BY_ID[selectedSkill] ?? SKILL_BY_ID.int_a, selRank = rankOf(sel.id), selReach = reachable(sel);
    const canBuy = sel.id !== 'root' && progressionHud.skillPoints >= 1 && selRank < sel.max && selReach;
    const stt = progressionHud.stats;
    const totals: [string, string][] = [
      ['Dano mágico', fmtPct(stt.damage - 1)], ['Mana máxima', `${1000 + stt.manaMax}`], ['Custo de mana', fmtPct(stt.costMult - 1)],
      ['Durabilidade do escudo', fmtPct(stt.shieldHp - 1)], ['Resistência a dano', fmtPct(stt.resist)],
      ['Velocidade de voo', fmtPct(stt.flySpeed - 1)], ['Vida máxima', `${stt.maxHealth}`],
    ];
    return <div className="tree-wrap">
      <div className="tree-head">
        <div><span className="modal-kicker">TALENTOS DO ECO · NÍVEL {progressionHud.level}</span><h2>Árvore de habilidades</h2></div>
        <div className="tree-points"><span>PONTOS</span><strong>{progressionHud.skillPoints}</strong></div>
      </div>
      <div className="tree-legend">{(Object.keys(BRANCH_INFO) as (keyof typeof BRANCH_INFO)[]).map(b => <span key={b} style={{ '--c': BRANCH_INFO[b].color } as CSSProperties}><i />{BRANCH_INFO[b].name}<small>{BRANCH_INFO[b].subtitle}</small></span>)}</div>
      <div className="tree-body">
        <svg className="tree-svg" viewBox="170 15 660 635" role="group" aria-label="Árvore de habilidades">
          <defs><radialGradient id="treeGlow" cx="50%" cy="50%" r="55%"><stop offset="0" stopColor="#3a2c5a" stopOpacity=".5" /><stop offset="1" stopColor="#0c1210" stopOpacity="0" /></radialGradient></defs>
          <rect x="170" y="15" width="660" height="635" fill="url(#treeGlow)" />
          {SKILL_NODES.flatMap(n => n.reqs.map(r => {
            const a = nodePos(SKILL_BY_ID[r]), b = nodePos(n), lit = rankOf(r) >= 1, owned = rankOf(n.id) >= 1;
            return <line key={`${r}-${n.id}`} className={`tl ${owned ? 'owned' : lit ? 'lit' : ''}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} style={{ '--c': nodeColor(n) } as CSSProperties} />;
          }))}
          {SKILL_NODES.map(n => {
            const p = nodePos(n), rk = rankOf(n.id), reach = reachable(n), status = rk >= n.max ? 'maxed' : rk > 0 ? 'owned' : reach ? 'avail' : 'locked', R = n.keystone ? 33 : n.id === 'root' ? 30 : 26;
            return <g key={n.id} className={`tn ${status} ${n.keystone ? 'key' : ''} ${selectedSkill === n.id ? 'sel' : ''}`} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`} style={{ '--c': nodeColor(n) } as CSSProperties}
              tabIndex={0} role="button" aria-label={`${n.name}, nível ${rk} de ${n.max}`} onClick={() => setSelectedSkill(n.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedSkill(n.id); } }}>
              {n.keystone && <polygon className="tn-halo" points={hexPts(0, 0, R + 7)} />}
              <polygon className="tn-hex" points={hexPts(0, 0, R)} />
              <polygon className="tn-inner" points={hexPts(0, 0, R - 6)} />
              <text className="tn-glyph" y="1" textAnchor="middle" dominantBaseline="central">{n.glyph}</text>
              {n.id !== 'root' && <text className="tn-rank" y={R + 15} textAnchor="middle">{rk}/{n.max}</text>}
            </g>;
          })}
        </svg>
        <aside className="tree-detail" style={{ '--c': nodeColor(sel) } as CSSProperties}>
          <div className="td-top"><span className="td-glyph">{sel.glyph}</span><div><small>{sel.branch === 'root' ? 'ORIGEM' : `${BRANCH_INFO[sel.branch].name.toUpperCase()}${sel.keystone ? ' · NÓ FINAL' : ''}`}</small><strong>{sel.name}</strong></div></div>
          <p>{sel.description}</p>
          <div className="td-effect"><small>{sel.id === 'root' ? 'ESTADO' : 'POR NÍVEL'}</small><span>{sel.perRank}</span></div>
          {sel.id !== 'root' && <div className="rank-track">{Array.from({ length: sel.max }, (_, i) => <i key={i} className={i < selRank ? 'filled' : ''} />)}</div>}
          {sel.reqs.length > 0 && sel.id !== 'root' && <ul className="td-reqs">{sel.reqs.map(r => <li key={r} className={rankOf(r) >= 1 ? 'ok' : ''}>{rankOf(r) >= 1 ? '✓' : '○'} {SKILL_BY_ID[r].name}</li>)}</ul>}
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
  const controlsPanel = () => <div className="controls-grid">{CONTROLS.map(([keys, label]) => <div key={label}><span className="kbds">{keys.map(k => <kbd key={k}>{k}</kbd>)}</span><span>{label}</span></div>)}</div>;

  const playing = screen === 'playing';
  const anyModal = help || questOpen || inventoryOpen || skillsOpen || paused;

  return <main ref={shellRef} className={`game-shell ${playing ? 'is-playing' : 'is-title'}`}>
    <div className="scene" ref={hostRef} aria-label="Mundo 3D explorável dos Campos da Aurora" />
    <div className="vignette" />
    <div ref={damageRef} className="damage-flash" aria-hidden="true" />
    <div ref={fpsRef} className="fps-meter" hidden={!showFps} />
    <pre ref={perfPanelRef} className="perf-panel" hidden />
    <div className="cine-bars" aria-hidden="true"><i /><i /></div>
    <div className="spell-caption" aria-hidden="true"><small>INVOCAÇÃO DAS CHAMAS INFERNAIS</small><strong>Vollzanbel</strong></div>

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
              <span className="tb-mark">✦</span>{ready ? (hasStarted ? 'Continuar jornada' : 'Iniciar jornada') : 'Despertando o mundo…'}<span className="tb-arrow">→</span>
            </button>
            <button type="button" className="title-btn" onClick={() => setTitlePanel('options')}><span className="tb-mark">◇</span>Opções</button>
            <button type="button" className="title-btn" onClick={() => setTitlePanel('controls')}><span className="tb-mark">◇</span>Controles</button>
          </nav>
        </> : <div className="title-panel">
          <h2>{titlePanel === 'options' ? 'Opções' : 'Controles'}</h2>
          {titlePanel === 'options' ? optionsPanel() : controlsPanel()}
          <button type="button" className="text-btn" onClick={() => setTitlePanel('main')}>← Voltar</button>
        </div>}
      </div>
      <footer className="title-footer">
        <span>Prólogo <b>·</b> Protótipo 0.3 <b>·</b> Personagem “Agris” por Vasian-Digital3D (CC BY 4.0)</span>
        <span className={ready ? 'press' : ''}>{ready ? <>Pressione <kbd>Enter</kbd> para começar</> : <><i className="loader" />Despertando o mundo…</>}</span>
      </footer>
    </div>}

    {/* ======================= HUD ======================= */}
    {playing && !anyModal && <div ref={aimReticleRef} className="aim-reticle" aria-hidden="true">
      <span className="aim-core" /><i className="aim-tick aim-top" /><i className="aim-tick aim-right" /><i className="aim-tick aim-bottom" /><i className="aim-tick aim-left" />
      <div ref={chargeRef} className="charge-ring"><span>MÁX</span></div>
    </div>}
    {playing && <div ref={shieldBarRef} className="shield-bar" aria-hidden="true"><span>ESCUDO</span><div><i /></div><small>−3 mana/s · solte F para desfazer</small></div>}
    <div className={`hud ${playing ? '' : 'hud-hidden'}`}>
      <header className="topbar">
        <div className="brand"><div className="brand-mark">✦</div><div><div className="eyebrow">UM MUNDO DEPOIS DO FIM</div><div className="brand-name">ECOS <span>DA ERA DOS HERÓIS</span></div></div></div>
        <div className="region"><span className="region-dot" />{status.area}<div className="region-sub">Oeste · Terras de Avel</div></div>
        <div className="top-actions">
          <button type="button" className="icon-button" onClick={toggleMute} aria-label={muted ? 'Ativar som' : 'Silenciar'} title={muted ? 'Ativar som' : 'Silenciar'}>{muted ? '◖' : '♫'}</button>
          <button type="button" className="icon-button" onClick={toggleInventory} aria-label="Inventário" title="Inventário (E)">E</button>
          <button type="button" className="icon-button" onClick={toggleSkills} aria-label="Árvore de habilidades" title="Habilidades (,)">✧</button>
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
          <button type="button" className="touch-action touch-signature" onPointerDown={() => zoltraakRef.current.start()} onPointerUp={() => zoltraakRef.current.release()} onPointerCancel={() => zoltraakRef.current.release()} onPointerLeave={() => zoltraakRef.current.release()}>Zoltraak</button>
          <button type="button" className="touch-action" onClick={() => castAbilityRef.current('vollzanbel')}>Fogo</button>
          <button type="button" className="touch-action" onClick={() => castAbilityRef.current('judradjim')}>Raio</button>
          <button type="button" className="touch-action" onPointerDown={() => shieldRef.current.start()} onPointerUp={() => shieldRef.current.release()} onPointerCancel={() => shieldRef.current.release()} onPointerLeave={() => shieldRef.current.release()}>Escudo</button>
          <button type="button" className="touch-action" onClick={() => castAbilityRef.current('flight')}>Voo</button>
          <button type="button" className="touch-action" onPointerDown={event => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); touchJumpRef.current = true; }} onPointerUp={() => { touchJumpRef.current = false; }} onPointerCancel={() => { touchJumpRef.current = false; }}>Pular</button>
          <button type="button" className="touch-action touch-sprint" onPointerDown={event => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); touchSprintRef.current = true; }} onPointerUp={() => { touchSprintRef.current = false; }} onPointerCancel={() => { touchSprintRef.current = false; }}>Correr</button>
          <button type="button" className="touch-action" onClick={() => setPaused(true)}>Menu</button>
        </div>
      </div>
      <div className="bottom-left">
        <div className="player-card">
          <div className="portrait"><span>✧</span><b className="portrait-level" title="Nível">{progressionHud.level}</b></div>
          <div className="player-meta">
            <div className="player-name"><strong>Chamado</strong><span>Errante das Terras de Avel</span></div>
            <HudBars store={hudStore} />
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
          {SLOTS.map(([spell, key, label]) => <SpellSlot key={spell} store={hudStore} spell={spell} hotkey={key} label={label} cast={castAbilityRef} />)}
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
            <button type="button" className="menu-line" onClick={() => setPausePanel('options')}>Opções</button>
            <button type="button" className="menu-line" onClick={() => setPausePanel('controls')}>Controles</button>
            <button type="button" className="menu-line" onClick={backToTitle}>Voltar à tela inicial</button>
          </div></>
          : <>{pausePanel === 'options' ? optionsPanel() : controlsPanel()}<button type="button" className="text-btn" onClick={() => setPausePanel('main')}>← Voltar</button></>}</>
        : help ? <><span className="modal-kicker">CAMINHOS DO VIAJANTE</span><h2>Um passo de cada vez.</h2><p>Enfrente lobos, bandidos e demônios. A mira central indica o alvo; aproxime-se dos cristais para recolher XP e itens raros.</p>{controlsPanel()}<button type="button" className="continue" onClick={closeMenus}>CONTINUAR A JORNADA <span>→</span></button></>
        : inventoryOpen ? <><span className="modal-kicker">PERTENCES DO VIAJANTE</span><h2>Inventário</h2><p>Recolha os cristais de experiência e os itens deixados pelos inimigos.</p><div className="inventory-grid"><article className="inventory-item"><span className="item-glyph">✧</span><div><strong>Fragmento de Eco</strong><small>Resíduo de energia arcana</small></div><b>{progressionHud.inventory.echoFragment}</b></article><article className="inventory-item"><span className="item-glyph">◇</span><div><strong>Núcleo de sentinela</strong><small>Material deixado pelos Ecos</small></div><b>{progressionHud.inventory.sentinelCore}</b></article>{(Object.keys(LOOT_INFO) as LootItemId[]).map(item => <article className={`inventory-item loot-${LOOT_INFO[item].rarity.toLowerCase()}`} key={item}><span className="item-glyph">{LOOT_INFO[item].rarity === 'Épico' ? '✦' : LOOT_INFO[item].rarity === 'Raro' ? '⬡' : '◇'}</span><div><strong>{LOOT_INFO[item].name}</strong><small>{LOOT_INFO[item].rarity} · {LOOT_INFO[item].source}</small></div><b>{progressionHud.inventory[item]}</b></article>)}</div><div className="inventory-footer">Nível {progressionHud.level} <span>·</span> {progressionHud.experience}/{progressionHud.nextLevelXp} XP <span>·</span> {progressionHud.skillPoints} pontos de habilidade</div><button type="button" className="continue" onClick={closeMenus}>VOLTAR À JORNADA <span>→</span></button></>
        : skillsOpen ? skillTree()
        : <><span className="modal-kicker">DIÁRIO DE VIAGEM · 01</span><h2>O Que Permanece</h2><p>Quase mil anos se passaram desde a derrota de Valkhor. A relva tomou os velhos caminhos, e os nomes dos heróis já não são lembrados.</p><p>Um marco de pedra repousa além do prado, coberto de musgo. Talvez ainda guarde uma lembrança.</p><div className="quest-objective"><span>✦</span>{status.discovered ? 'Memória do Marco do Herói despertada' : 'Encontre o Marco do Herói nos campos'}</div>{wolfQuest.stage !== 'available' && <div className="quest-objective"><span>{wolfQuest.stage === 'done' ? '✓' : '✦'}</span>{wolfQuest.stage === 'done' ? `Uivos no Caminho · concluída (+${wolfQuest.reward} XP)` : wolfQuest.stage === 'ready' ? 'Uivos no Caminho · fale com Aldren para receber a recompensa' : `Uivos no Caminho · ${wolfQuest.kills}/${WOLF_QUEST_GOAL} lobos abatidos`}</div>}</>}
    </div></div>}
  </main>;
}
