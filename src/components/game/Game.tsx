'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { AmbientAudio } from './audio';
import { CombatSystem } from './combat';
import { createHero, type HeroPose } from './hero';
import { MagicSystem, type SpellId } from './magic';
import { PlayerProgression, UPGRADE_INFO, LOOT_INFO, MAX_RANK, type LootItemId, type ProgressionSnapshot, type UpgradeId } from './progression';
import { PlayerMotor, ThirdPersonCamera } from './simulation';
import { createWorld, setWorldQuality, updateWorld, updateDayCycle, type WorldParts } from './world';

type GameStatus = { area: string; discovered: number };
type Quality = 'Baixa' | 'Média' | 'Alta';

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
  const interactRef = useRef<() => void>(() => {});
  const attackRef = useRef<() => void>(() => {});
  const dodgeRef = useRef<() => void>(() => {});
  const compassNeedleRef = useRef<HTMLSpanElement>(null);
  const compassPinRef = useRef<HTMLSpanElement>(null);
  const touchKnobRef = useRef<HTMLSpanElement>(null);
  const aimReticleRef = useRef<HTMLDivElement>(null);
  const touchPointerRef = useRef<number | null>(null);
  const touchMoveRef = useRef({ forward: 0, side: 0 });
  const touchSprintRef = useRef(false);
  const touchJumpRef = useRef(false);
  const [status, setStatus] = useState<GameStatus>({ area: 'Campos da Aurora', discovered: 0 });
  const [hint, setHint] = useState('');
  const [nearLandmark, setNearLandmark] = useState(false);
  const [muted, setMuted] = useState(true);
  const [dayLabel, setDayLabel] = useState('06:00');
  const [help, setHelp] = useState(false);
  const [questOpen, setQuestOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [shiftLocked, setShiftLocked] = useState(false);
  const [quality, setQuality] = useState<Quality>('Média');
  const [sensitivity, setSensitivity] = useState(5);
  const [gameError, setGameError] = useState('');
  const [combatHud, setCombatHud] = useState({ mana: 100, health: 100, alive: 7, shield: false, flying: false, blocks: 0, cooldowns: { zoltraak: 0, vollzanbel: 0, judradjim: 0, shield: 0, flight: 0 } });
  const [progressionHud, setProgressionHud] = useState<ProgressionSnapshot>({ level: 1, experience: 0, nextLevelXp: 100, skillPoints: 0, ranks: { damage: 0, size: 0, efficiency: 0 }, inventory: { echoFragment: 0, sentinelCore: 0, wolfPelt: 0, banditToken: 0, demonAsh: 0, moonFang: 0, ancientSigil: 0, demonHeart: 0 } });
  uiOpenRef.current = help || questOpen || inventoryOpen || skillsOpen || paused;
  modalFlagsRef.current = { help, quest: questOpen, inventory: inventoryOpen, skills: skillsOpen };

  const releaseMouse = useCallback(() => {
    if (typeof document !== 'undefined' && document.pointerLockElement) document.exitPointerLock();
    cameraRigRef.current?.setShiftLock(false);
    setShiftLocked(false);
  }, []);
  const toggleHelp = useCallback(() => { releaseMouse(); setHelp(value => !value); setQuestOpen(false); setInventoryOpen(false); setSkillsOpen(false); }, [releaseMouse]);
  const toggleQuest = useCallback(() => { releaseMouse(); setQuestOpen(value => !value); setHelp(false); setInventoryOpen(false); setSkillsOpen(false); }, [releaseMouse]);
  const toggleInventory = useCallback(() => { releaseMouse(); setInventoryOpen(value => !value); setSkillsOpen(false); setHelp(false); setQuestOpen(false); }, [releaseMouse]);
  const toggleSkills = useCallback(() => { releaseMouse(); setSkillsOpen(value => !value); setInventoryOpen(false); setHelp(false); setQuestOpen(false); }, [releaseMouse]);
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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute('aria-label', 'Explorar os Campos da Aurora. WASD move, clique e arraste para olhar.');
    renderer.domElement.tabIndex = 0;
    host.appendChild(renderer.domElement);

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
    const hero = createHero(scene);
    hero.root.rotation.y = Math.PI;
    hero.root.userData.facing = Math.PI;
    const motor = new PlayerMotor(hero.root, world.colliders);
    const cameraRig = new ThirdPersonCamera(camera, world);
    cameraRigRef.current = cameraRig;
    camera.position.set(0, 3.95, 9.5); camera.lookAt(0, 1.5, 2);
    const progression = new PlayerProgression();
    progressionRef.current = progression;
    const ambient = new AmbientAudio(); audioRef.current = ambient;
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
    let isNearMarker = false, markerRemembered = false, shiftLockActive = false, castUntil = 0, attackUntil = 0, dodgeUntil = 0, hitUntil = 0, landUntil = 0, lastHealth = combat.health, deathTimer = 0, hudTick = 0, cycleTick = 0;
    const castAbility = (spell: SpellId) => {
      if (uiOpenRef.current || combat.health <= 0) return;
      ambient.start();
      hero.spellPoint.getWorldPosition(spellOrigin);
      cameraRig.getAimPoint(spellAim, combat.targets);
      spellDirection.copy(spellAim).sub(spellOrigin).normalize();
      if (magic.cast(spell, spellOrigin, spellDirection, spellAim)) {
        castUntil = elapsed + .48;
        if (aimReticleRef.current) aimReticleRef.current.classList.add('is-casting');
        ambient.playCast();
      }
    };
    const castSpell = () => castAbility('zoltraak');
    const performAttack = () => {
      if (uiOpenRef.current || combat.health <= 0) return;
      const facing = hero.root.userData.facing ?? hero.root.rotation.y;
      const target = hero.root.position.clone().add(new THREE.Vector3(Math.sin(facing), 0, Math.cos(facing)).multiplyScalar(2.15));
      target.y += 1.2;
      if (combat.damageAt(target, 1.25, 30) > 0) reticleHitUntil = elapsed + .28;
      attackUntil = elapsed + .38;
      ambient.start(); ambient.playCast();
    };
    attackRef.current = performAttack;
    dodgeRef.current = () => { if (!uiOpenRef.current && combat.health > 0) { const side = Number(keys.has('d')) - Number(keys.has('a')); motor.dodge(cameraRig.yaw, side); dodgeUntil = elapsed + .42; } };
    castSpellRef.current = castSpell;
    castAbilityRef.current = castAbility;
    const interactMarker = () => {
      if (!isNearMarker || uiOpenRef.current) return;
      ambient.start();
      if (!markerRemembered) {
        markerRemembered = true;
        setStatus({ area: 'Campos da Aurora', discovered: 1 });
        showHint('O Marco do Herói despertou uma lembrança.');
      } else showHint('O Eco repousa por um instante entre as pedras.');
    };
    interactRef.current = interactMarker;
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'shift', 'alt', 'escape', 'h', 'j', 'e', 'g', 'q', '1', '2', 'f', 'r', 'v', 'x', 'control', ','].includes(key)) event.preventDefault();
      if (event.repeat && ['escape', 'h', 'j', 'e', 'g', 'q', '1', '2', 'f', 'r', 'x', ' ', ','].includes(key)) return;
      if (key === 'escape') {
        keys.clear();
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
      if (key === 'g' && isNearMarker && !uiOpenRef.current) {
        interactMarker();
        return;
      }
      if (key === 'q') { castSpell(); return; }
      if (key === '1') { castAbility('vollzanbel'); return; }
      if (key === '2') { castAbility('judradjim'); return; }
      if (key === 'f') { castAbility('shield'); return; }
      if (key === 'r') { castAbility('flight'); return; }
      if (key === 'x') { dodgeRef.current(); return; }
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'alt', 'control', 'v'].includes(key)) {
        ambient.start(); keys.add(key);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());
    const onBlur = () => { keys.clear(); shiftLockActive = false; cameraRig.setShiftLock(false); setShiftLocked(false); setPaused(true); };
    const onVisibility = () => { if (document.visibilityState === 'hidden') { keys.clear(); shiftLockActive = false; cameraRig.setShiftLock(false); setShiftLocked(false); setPaused(true); } };
    const onPointerLock = () => {
      dragging = document.pointerLockElement === renderer.domElement;
      if (!dragging && shiftLockActive) { shiftLockActive = false; cameraRig.setShiftLock(false); setShiftLocked(false); }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (uiOpenRef.current) return;
      if (event.button === 2) { performAttack(); return; }
      if (event.button !== 0) return;
      ambient.start();
      if (event.pointerType === 'touch') {
        renderer.domElement.setPointerCapture(event.pointerId);
        dragging = true; previousX = event.clientX; previousY = event.clientY;
        return;
      }
      castSpell();
      if (renderer.domElement.requestPointerLock) {
        const lockRequest = renderer.domElement.requestPointerLock();
        if (lockRequest && typeof lockRequest.catch === 'function') lockRequest.catch(() => { dragging = true; });
        dragging = true;
      } else dragging = true;
      previousX = event.clientX; previousY = event.clientY;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || uiOpenRef.current) return;
      const locked = document.pointerLockElement === renderer.domElement;
      cameraRig.rotate(locked ? event.movementX : event.clientX - previousX, locked ? event.movementY : event.clientY - previousY);
      previousX = event.clientX; previousY = event.clientY;
    };
    const onPointerUp = () => { if (document.pointerLockElement !== renderer.domElement) dragging = false; };
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

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const delta = Math.min(.05, clock.getDelta());
      if (!uiOpenRef.current) {
        elapsed += delta;
        const wasGrounded = motor.grounded;
        const forward = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0) + touchMoveRef.current.forward;
        const side = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0) + touchMoveRef.current.side;
        const moving = combat.health > 0 && motor.update(delta, THREE.MathUtils.clamp(forward, -1, 1), THREE.MathUtils.clamp(side, -1, 1), keys.has('alt') || touchSprintRef.current, keys.has(' ') || touchJumpRef.current, cameraRig.yaw, magic.flying, Number(keys.has(' ') || touchJumpRef.current) - Number(keys.has('control')), cameraRig.pitch);
        if (combat.health > 0 && (shiftLockActive || Math.hypot(motor.velocity.x, motor.velocity.z) > .2)) {
          hero.root.userData.facing = shiftLockActive ? cameraRig.yaw + Math.PI : Math.atan2(motor.velocity.x, motor.velocity.z);
        }
        if (combat.health <= 0) {
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
        if (!wasGrounded && motor.grounded) landUntil = elapsed + .34;
        touchJumpRef.current = false;
        if (combat.health < lastHealth) hitUntil = elapsed + .28;
        lastHealth = combat.health;
        const pose: HeroPose = combat.health <= 0 ? 'defeat' : elapsed < hitUntil ? 'hit' : elapsed < castUntil ? 'cast' : elapsed < attackUntil ? 'attack' : elapsed < dodgeUntil ? 'dodge' : elapsed < landUntil ? 'land' : keys.has('v') ? 'guard' : magic.flying ? 'fly' : !motor.grounded ? (motor.verticalSpeed < -1 ? 'fall' : 'jump') : moving ? (keys.has('alt') || touchSprintRef.current ? 'run' : 'walk') : 'idle';
        hero.update(elapsed, delta, pose, Math.hypot(motor.velocity.x, motor.velocity.z));
        magic.update(delta, elapsed);
        combat.update(delta, elapsed, hero.root.position, (from, to) => magic.blockProjectile(from, to));
        updateWorld(world, elapsed);
        cycleTick += delta;
        if (cycleTick >= 1) { cycleTick = 0; const cycle = updateDayCycle(scene, sun, sky, elapsed); setDayLabel(cycle.label); }
        const distanceToMarker = Math.hypot(hero.root.position.x, hero.root.position.z + 12);
        const near = distanceToMarker < 4.6;
        if (near !== isNearMarker) { isNearMarker = near; setNearLandmark(near); }
        hudTick += delta;
        if (hudTick > .16) { hudTick = 0; setCombatHud({ mana: Math.round(magic.mana), health: combat.health, alive: combat.alive, shield: magic.shieldActive, flying: magic.flying, blocks: magic.blocks, cooldowns: { zoltraak: magic.cooldown('zoltraak'), vollzanbel: magic.cooldown('vollzanbel'), judradjim: magic.cooldown('judradjim'), shield: magic.cooldown('shield'), flight: magic.cooldown('flight') } }); setProgressionHud(progression.snapshot()); }
      }
      cameraRig.update(hero.root, delta);
      if (aimReticleRef.current) {
        aimReticleRef.current.classList.toggle('is-casting', elapsed < castUntil);
        aimReticleRef.current.classList.toggle('is-hit', elapsed < reticleHitUntil);
      }
      if (compassNeedleRef.current) compassNeedleRef.current.style.transform = `rotate(${-cameraRig.yaw}rad)`;
      if (compassPinRef.current) {
        const markerAngle = Math.atan2(-hero.root.position.x, -(hero.root.position.z + 12)) - cameraRig.yaw;
        compassPinRef.current.style.left = `${42 + Math.sin(markerAngle) * 14}px`;
        compassPinRef.current.style.top = `${42 - Math.cos(markerAngle) * 14}px`;
      }
      composer.render();
    };
    const clock = new THREE.Clock();
    animate();

    return () => {
      cancelAnimationFrame(frame); if (hintTimer) clearTimeout(hintTimer);
      resizeObserver.disconnect(); window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); window.removeEventListener('blur', onBlur); window.removeEventListener('pointermove', onPointerMove); window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('visibilitychange', onVisibility); document.removeEventListener('pointerlockchange', onPointerLock);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown); renderer.domElement.removeEventListener('wheel', onWheel); renderer.domElement.removeEventListener('contextmenu', onContext);
      if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
      magic.dispose(); combat.dispose(); ambient.dispose(); composer.dispose(); audioRef.current = null; rendererRef.current = null;
      qualityTargetsRef.current = null;
      cameraRigRef.current = null;
      progressionRef.current = null;
      castSpellRef.current = () => {};
      castAbilityRef.current = () => {};
      interactRef.current = () => {};
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
    const ratio = quality === 'Alta' ? 1.85 : quality === 'Baixa' ? 1 : 1.45;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, ratio));
    const targets = qualityTargetsRef.current;
    targets?.composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, ratio));
    if (targets) targets.bloom.strength = quality === 'Baixa' ? .12 : quality === 'Alta' ? .48 : .3;
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
    if (cameraRigRef.current) cameraRigRef.current.sensitivity = .0008 + sensitivity * .0005;
  }, [sensitivity]);

  const closeMenus = () => { setHelp(false); setQuestOpen(false); setInventoryOpen(false); setSkillsOpen(false); setPaused(false); };
  const purchaseUpgrade = (id: UpgradeId) => {
    if (progressionRef.current?.upgrade(id)) setProgressionHud(progressionRef.current.snapshot());
  };
  const spellButton = (spell: SpellId, key: string, label: string) => <button className={`hotkey ${combatHud.cooldowns[spell] > 0 ? 'on-cooldown' : ''}`} title={`${label} · ${combatHud.cooldowns[spell] > 0 ? `recarga ${combatHud.cooldowns[spell].toFixed(1)} s` : 'pronto'}`} onClick={() => castAbilityRef.current(spell)}><span className="slot">{key}</span><span className="slot-label">{label}</span>{combatHud.cooldowns[spell] > 0 && <small className="cooldown-label">{combatHud.cooldowns[spell].toFixed(1)}s</small>}</button>;

  return <main className="game-shell">
    <div className="scene" ref={hostRef} aria-label="Mundo 3D explorável dos Campos da Aurora" />
    <div className="vignette" />
    {!(help || questOpen || inventoryOpen || skillsOpen || paused) && <div ref={aimReticleRef} className="aim-reticle" aria-hidden="true"><span className="aim-core" /><i className="aim-tick aim-top" /><i className="aim-tick aim-right" /><i className="aim-tick aim-bottom" /><i className="aim-tick aim-left" /></div>}
    <header className="topbar">
      <div className="brand"><div className="brand-mark">✦</div><div><div className="eyebrow">UM MUNDO DEPOIS DO FIM</div><div className="brand-name">ECOS <span>DA ERA DOS HERÓIS</span></div></div></div>
      <div className="region"><span className="region-dot" />{status.area}<div className="region-sub">Oeste · Terras de Avel</div></div>
      <div className="top-actions"><button className="icon-button" onClick={toggleMute} aria-label={muted ? 'Ativar som' : 'Silenciar'} title={muted ? 'Ativar som' : 'Silenciar'}>{muted ? '◖' : '♫'}</button><button className="icon-button" onClick={toggleInventory} aria-label="Inventário" title="Inventário (E)">E</button><button className="icon-button" onClick={toggleSkills} aria-label="Árvore de habilidades" title="Habilidades (,)">,</button><button className="icon-button" onClick={toggleHelp} aria-label="Ajuda" title="Controles">?</button></div>
    </header>
    <section className="quest-card"><div className="quest-kicker"><span className="tiny-star">✦</span> MEMÓRIA ESQUECIDA</div><h1>O Que Permanece</h1><p>Encontre o Marco do Herói e desperte o Eco que repousa nas pedras.</p><div className="quest-progress"><span style={{ width: `${status.discovered * 100}%` }} /></div><div className="quest-count">{status.discovered ? '1' : '0'} <span>/ 1 memória encontrada</span></div></section>
    <div className="compass"><div className="compass-ring"><span className="compass-n">N</span><span ref={compassNeedleRef} className="compass-needle">◆</span><span ref={compassPinRef} className="compass-pin">✦</span><span className="compass-s">S</span></div><div className="compass-label">CAMPOS DA AURORA</div></div>
    {shiftLocked && <div className="shift-lock-indicator">SHIFT LOCK <span>ATIVO</span></div>}
    <div className="touch-controls" aria-label="Controles de toque">
      <div className="touch-stick" role="application" aria-label="Direcional de movimento" onPointerDown={onTouchStickDown} onPointerMove={onTouchStickMove} onPointerUp={onTouchStickUp} onPointerCancel={onTouchStickUp}><span className="touch-stick-n">N</span><span ref={touchKnobRef} className="touch-knob" /></div>
      <div className="touch-actions">
        {nearLandmark && <button className="touch-action touch-interact" onClick={() => interactRef.current()}>Eco · G</button>}
        <button className="touch-action" onClick={toggleInventory}>Inventário</button>
        <button className="touch-action" onClick={toggleSkills}>Habilidades</button>
        <button className="touch-action" onClick={() => attackRef.current()}>Atacar</button>
        <button className="touch-action" onClick={() => dodgeRef.current()}>Esquiva</button>
        <button className="touch-action" onClick={() => castSpellRef.current()}>Zoltraak</button>
        <button className="touch-action" onClick={() => castAbilityRef.current('vollzanbel')}>Fogo</button>
        <button className="touch-action" onClick={() => castAbilityRef.current('judradjim')}>Raio</button>
        <button className="touch-action" onClick={() => castAbilityRef.current('shield')}>Escudo</button>
        <button className="touch-action" onClick={() => castAbilityRef.current('flight')}>Voo</button>
        <button className="touch-action" onPointerDown={event => { event.preventDefault(); touchJumpRef.current = true; }} onClick={() => { touchJumpRef.current = true; }}>Pular</button>
        <button className="touch-action touch-sprint" onPointerDown={event => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); touchSprintRef.current = true; }} onPointerUp={() => { touchSprintRef.current = false; }} onPointerCancel={() => { touchSprintRef.current = false; }}>Correr</button>
        <button className="touch-action" onClick={() => setPaused(true)}>Menu</button>
      </div>
    </div>
    <div className="bottom-left"><div className="player-card"><div className="portrait">✧</div><div className="player-meta"><strong>Chamado</strong><span>Errante das Terras de Avel</span><div className="resource-row"><span>VIDA</span><div className="resource-track"><i className="health-fill" style={{ width: `${combatHud.health}%` }} /></div><b>{combatHud.health}</b></div><div className="resource-row"><span>MANA</span><div className="resource-track"><i className="mana-fill" style={{ width: `${combatHud.mana}%` }} /></div><b>{combatHud.mana}</b></div><div className="xp-row"><span>NV {progressionHud.level}</span><div className="resource-track"><i style={{ width: `${Math.min(100, progressionHud.experience / progressionHud.nextLevelXp * 100)}%` }} /></div><b>{progressionHud.experience}/{progressionHud.nextLevelXp}</b></div></div><div className="level">{progressionHud.skillPoints}<small> pontos</small></div></div>{(combatHud.shield || combatHud.flying) && <div className="active-magic">{combatHud.shield ? 'ESCUDO ATIVO' : 'VOO ATIVO'}{combatHud.blocks > 0 && <span> · {combatHud.blocks} bloqueios</span>}</div>}</div>
    <div className="bottom-center">{nearLandmark && <div className="interaction"><span className="keycap">G</span><span>Ouvir o Eco do marco</span></div>}<div className="hotbar">{spellButton('zoltraak', 'Q', 'Zoltraak')}{spellButton('vollzanbel', '1', 'Vollzanbel')}{spellButton('judradjim', '2', 'Judradjim')}{spellButton('shield', 'F', 'Escudo')}{spellButton('flight', 'R', 'Voo')}<button className="hotkey" onClick={toggleQuest}><span className="slot">J</span><span className="slot-label">Jornada</span></button><button className="hotkey" onClick={toggleHelp}><span className="slot">H</span><span className="slot-label">Ajuda</span></button></div></div>
    <div className="bottom-right"><div className="world-time"><span>◷</span> {dayLabel}</div><div className="weather">CAMPOS DA AURORA</div></div>
    {hint && <div className="toast"><span>✦</span>{hint}</div>}
    {gameError && <div className="game-error"><strong>O mundo não pôde ser carregado</strong><span>{gameError}</span><button onClick={() => window.location.reload()}>Tentar novamente</button></div>}
    {(help || questOpen || inventoryOpen || skillsOpen || paused) && <div className="modal-backdrop" onClick={closeMenus}><div className={`modal ${(inventoryOpen || skillsOpen) ? 'progression-modal' : ''}`} role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
      <button className="modal-close" onClick={closeMenus} aria-label="Fechar">×</button>
      {paused ? <><span className="modal-kicker">CAMPOS DA AURORA</span><h2>A jornada repousa.</h2><p>O Eco ainda aguarda. Ajuste a qualidade ou retome a exploração.</p><label className="quality-select">Qualidade gráfica<select value={quality} onChange={event => setQuality(event.target.value as Quality)}><option>Baixa</option><option>Média</option><option>Alta</option></select></label><label className="quality-select sensitivity-control">Sensibilidade do mouse<input type="range" min="1" max="10" value={sensitivity} onChange={event => setSensitivity(Number(event.target.value))} /><span>{sensitivity}</span></label><button className="continue" onClick={closeMenus}>RETOMAR A JORNADA <span>→</span></button></>
        : help ? <><span className="modal-kicker">CAMINHOS DO VIAJANTE</span><h2>Um passo de cada vez.</h2><p>Enfrente lobos, bandidos e demônios. A mira central indica o alvo; aproxime-se dos cristais para recolher XP e possíveis itens raros.</p><div className="controls-grid"><div><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><span>Mover</span></div><div><kbd>Mouse</kbd><span>Olhar ao redor</span></div><div><kbd>Roda</kbd><span>Zoom da câmera</span></div><div><kbd>Shift</kbd><span>Alternar Shift Lock</span></div><div><kbd>Alt</kbd><span>Correr / voar rápido</span></div><div><kbd>Espaço</kbd><span>Pular / subir voando</span></div><div><kbd>Ctrl</kbd><span>Descer voando</span></div><div><kbd>Q / Clique esq.</kbd><span>Zoltraak · 10 mana</span></div><div><kbd>1</kbd><span>Vollzanbel · 34 mana</span></div><div><kbd>2</kbd><span>Judradjim · 27 mana</span></div><div><kbd>F</kbd><span>Escudo · 20 mana + manutenção</span></div><div><kbd>R</kbd><span>Voo · 12 mana + manutenção</span></div><div><kbd>Clique dir.</kbd><span>Ataque com o cajado</span></div><div><kbd>X</kbd><span>Esquiva</span></div><div><kbd>V</kbd><span>Postura defensiva</span></div><div><kbd>E</kbd><span>Abrir inventário</span></div><div><kbd>,</kbd><span>Árvore de habilidades</span></div><div><kbd>G</kbd><span>Ouvir o Marco</span></div><div><kbd>J</kbd><span>Diário de viagem</span></div><div><kbd>Esc</kbd><span>Pausar e liberar cursor</span></div></div><button className="continue" onClick={closeMenus}>CONTINUAR A JORNADA <span>→</span></button></>
        : inventoryOpen ? <><span className="modal-kicker">PERTENCES DO VIAJANTE</span><h2>Inventário</h2><p>Recolha os cristais de experiência e os itens deixados pelos inimigos.</p><div className="inventory-grid"><article className="inventory-item"><span className="item-glyph">✧</span><div><strong>Fragmento de Eco</strong><small>Resíduo de energia arcana</small></div><b>{progressionHud.inventory.echoFragment}</b></article><article className="inventory-item"><span className="item-glyph">◇</span><div><strong>Núcleo de sentinela</strong><small>Material deixado pelos Ecos</small></div><b>{progressionHud.inventory.sentinelCore}</b></article>{(Object.keys(LOOT_INFO) as LootItemId[]).map(item => <article className={`inventory-item loot-${LOOT_INFO[item].rarity.toLowerCase()}`} key={item}><span className="item-glyph">{LOOT_INFO[item].rarity === 'Épico' ? '✦' : LOOT_INFO[item].rarity === 'Raro' ? '⬡' : '◇'}</span><div><strong>{LOOT_INFO[item].name}</strong><small>{LOOT_INFO[item].rarity} · {LOOT_INFO[item].source}</small></div><b>{progressionHud.inventory[item]}</b></article>)}</div><div className="inventory-footer">Nível {progressionHud.level} <span>·</span> {progressionHud.experience}/{progressionHud.nextLevelXp} XP <span>·</span> {progressionHud.skillPoints} pontos de habilidade</div><button className="continue" onClick={closeMenus}>VOLTAR À JORNADA <span>→</span></button></>
        : skillsOpen ? <><span className="modal-kicker">TALENTOS DO ECO · NÍVEL {progressionHud.level}</span><h2>Árvore de habilidades</h2><p>Derrote Ecos para ganhar XP. Cada nível concede 1 ponto; melhorias podem chegar ao nível {MAX_RANK}.</p><div className="skill-points">PONTOS DISPONÍVEIS <strong>{progressionHud.skillPoints}</strong></div><div className="upgrade-grid">{(['damage', 'size', 'efficiency'] as UpgradeId[]).map(id => <article className="upgrade-card" key={id}><div className="upgrade-heading"><span>{id === 'damage' ? '✦' : id === 'size' ? '⬡' : '◌'}</span><div><strong>{UPGRADE_INFO[id].title}</strong><small>NÍVEL {progressionHud.ranks[id]} / {MAX_RANK}</small></div></div><p>{UPGRADE_INFO[id].description}</p><div className="rank-track">{Array.from({ length: MAX_RANK }, (_, index) => <i key={index} className={index < progressionHud.ranks[id] ? 'filled' : ''} />)}</div><button className="upgrade-button" disabled={!progressionHud.skillPoints || progressionHud.ranks[id] >= MAX_RANK} onClick={() => purchaseUpgrade(id)}>{progressionHud.ranks[id] >= MAX_RANK ? 'NÍVEL MÁXIMO' : 'MELHORAR · 1 PONTO'}</button></article>)}</div><button className="continue" onClick={closeMenus}>VOLTAR À JORNADA <span>→</span></button></>
        : <><span className="modal-kicker">DIÁRIO DE VIAGEM · 01</span><h2>O Que Permanece</h2><p>Quase mil anos se passaram desde a derrota de Valkhor. A relva tomou os velhos caminhos, e os nomes dos heróis já não são lembrados.</p><p>Um marco de pedra repousa além do prado, coberto de musgo. Talvez ainda guarde uma lembrança.</p><div className="quest-objective"><span>✦</span>{status.discovered ? 'Memória do Marco do Herói despertada' : 'Encontre o Marco do Herói nos campos'}</div></>}
    </div></div>}
    {paused && <div className="pause-stamp">PAUSADO</div>}
    <div className="build-stamp">PRÓLOGO <span>·</span> PROTÓTIPO 0.2</div>
  </main>;
}
