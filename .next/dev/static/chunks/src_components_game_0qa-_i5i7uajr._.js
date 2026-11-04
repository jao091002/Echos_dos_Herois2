(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/game/Game.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Game
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$hero$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/hero.ts [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './magic'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$simulation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/simulation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function Game() {
    _s();
    const hostRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rendererRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cameraRigRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const qualityTargetsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const uiOpenRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const modalFlagsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        help: false,
        quest: false
    });
    const castSpellRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        "Game.useRef[castSpellRef]": ()=>{}
    }["Game.useRef[castSpellRef]"]);
    const interactRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        "Game.useRef[interactRef]": ()=>{}
    }["Game.useRef[interactRef]"]);
    const compassNeedleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const compassPinRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const touchKnobRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const touchPointerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const touchMoveRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        forward: 0,
        side: 0
    });
    const touchSprintRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const touchJumpRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        area: 'Campos da Aurora',
        discovered: 0
    });
    const [hint, setHint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [nearLandmark, setNearLandmark] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [muted, setMuted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [help, setHelp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [questOpen, setQuestOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [paused, setPaused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [quality, setQuality] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Média');
    const [sensitivity, setSensitivity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5);
    const [gameError, setGameError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    uiOpenRef.current = help || questOpen || paused;
    modalFlagsRef.current = {
        help,
        quest: questOpen
    };
    const releaseMouse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Game.useCallback[releaseMouse]": ()=>{
            if (typeof document !== 'undefined' && document.pointerLockElement) document.exitPointerLock();
        }
    }["Game.useCallback[releaseMouse]"], []);
    const toggleHelp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Game.useCallback[toggleHelp]": ()=>{
            releaseMouse();
            setHelp({
                "Game.useCallback[toggleHelp]": (value)=>!value
            }["Game.useCallback[toggleHelp]"]);
        }
    }["Game.useCallback[toggleHelp]"], [
        releaseMouse
    ]);
    const toggleQuest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Game.useCallback[toggleQuest]": ()=>{
            releaseMouse();
            setQuestOpen({
                "Game.useCallback[toggleQuest]": (value)=>!value
            }["Game.useCallback[toggleQuest]"]);
        }
    }["Game.useCallback[toggleQuest]"], [
        releaseMouse
    ]);
    const toggleMute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Game.useCallback[toggleMute]": ()=>{
            setMuted({
                "Game.useCallback[toggleMute]": (value)=>{
                    audioRef.current?.setMuted(!value);
                    return !value;
                }
            }["Game.useCallback[toggleMute]"]);
        }
    }["Game.useCallback[toggleMute]"], []);
    const onTouchStickMove = (event)=>{
        if (touchPointerRef.current !== event.pointerId) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const radius = rect.width * .34;
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const length = Math.hypot(dx, dy);
        const ratio = length > radius ? radius / length : 1;
        const x = dx * ratio, y = dy * ratio;
        touchMoveRef.current = {
            side: x / radius,
            forward: -y / radius
        };
        if (touchKnobRef.current) touchKnobRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    const onTouchStickDown = (event)=>{
        event.preventDefault();
        touchPointerRef.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        onTouchStickMove(event);
    };
    const onTouchStickUp = (event)=>{
        if (touchPointerRef.current !== event.pointerId) return;
        touchPointerRef.current = null;
        touchMoveRef.current = {
            forward: 0,
            side: 0
        };
        if (touchKnobRef.current) touchKnobRef.current.style.transform = 'translate(0, 0)';
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Game.useEffect": ()=>{
            const host = hostRef.current;
            if (!host) return;
            let renderer;
            try {
                renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
                    antialias: true,
                    powerPreference: 'high-performance',
                    alpha: false
                });
            } catch  {
                setGameError('Este navegador ou dispositivo não conseguiu iniciar o WebGL necessário para exibir o mundo 3D.');
                return;
            }
            rendererRef.current = renderer;
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PCFSoftShadowMap"];
            renderer.outputColorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
            renderer.toneMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACESFilmicToneMapping"];
            renderer.toneMappingExposure = 1.05;
            renderer.domElement.setAttribute('aria-label', 'Explorar os Campos da Aurora. WASD move, clique e arraste para olhar.');
            renderer.domElement.tabIndex = 0;
            host.appendChild(renderer.domElement);
            const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"]();
            scene.background = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#a8b7a7');
            scene.fog = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FogExp2"]('#a9b6a4', .0062);
            const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"](49, 1, .1, 320);
            const sky = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HemisphereLight"]('#f0f0dc', '#52614d', 2.05);
            scene.add(sky);
            const sun = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"]('#ffebca', 3.05);
            sun.position.set(-34, 48, 22);
            sun.castShadow = true;
            sun.shadow.mapSize.set(quality === 'Alta' ? 2048 : 1024, quality === 'Alta' ? 2048 : 1024);
            sun.shadow.camera.left = -48;
            sun.shadow.camera.right = 48;
            sun.shadow.camera.top = 48;
            sun.shadow.camera.bottom = -48;
            sun.shadow.bias = -.00035;
            scene.add(sun);
            const fill = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"]('#c5d7da', .72);
            fill.position.set(25, 22, -32);
            scene.add(fill);
            const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createWorld"])(scene);
            qualityTargetsRef.current = {
                scene,
                sun
            };
            const hero = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$hero$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHero"])(scene);
            hero.root.rotation.y = Math.PI;
            hero.root.userData.facing = Math.PI;
            const motor = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$simulation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlayerMotor"](hero.root, world.colliders);
            const cameraRig = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$simulation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThirdPersonCamera"](camera, world);
            cameraRigRef.current = cameraRig;
            camera.position.set(0, 3.95, 9.5);
            camera.lookAt(0, 1.5, 2);
            const magic = new MagicSystem(scene);
            const ambient = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AmbientAudio"]();
            audioRef.current = ambient;
            const keys = new Set();
            const spellOrigin = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
            const spellAim = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
            const spellDirection = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
            let elapsed = 0, isNearMarker = false, markerRemembered = false, castUntil = 0;
            let dragging = false, previousX = 0, previousY = 0;
            let hintTimer;
            const showHint = {
                "Game.useEffect.showHint": (message)=>{
                    setHint(message);
                    if (hintTimer) clearTimeout(hintTimer);
                    hintTimer = setTimeout({
                        "Game.useEffect.showHint": ()=>setHint('')
                    }["Game.useEffect.showHint"], 3100);
                }
            }["Game.useEffect.showHint"];
            const castSpell = {
                "Game.useEffect.castSpell": ()=>{
                    if (uiOpenRef.current) return;
                    ambient.start();
                    hero.spellPoint.getWorldPosition(spellOrigin);
                    cameraRig.getAimPoint(spellAim);
                    spellDirection.copy(spellAim).sub(spellOrigin).normalize();
                    if (magic.cast(spellOrigin, spellDirection, spellAim)) {
                        castUntil = elapsed + .48;
                        ambient.playCast();
                    }
                }
            }["Game.useEffect.castSpell"];
            castSpellRef.current = castSpell;
            const interactMarker = {
                "Game.useEffect.interactMarker": ()=>{
                    if (!isNearMarker || uiOpenRef.current) return;
                    ambient.start();
                    if (!markerRemembered) {
                        markerRemembered = true;
                        setStatus({
                            area: 'Campos da Aurora',
                            discovered: 1
                        });
                        showHint('O Marco do Herói despertou uma lembrança.');
                    } else showHint('O Eco repousa por um instante entre as pedras.');
                }
            }["Game.useEffect.interactMarker"];
            interactRef.current = interactMarker;
            const onKeyDown = {
                "Game.useEffect.onKeyDown": (event)=>{
                    const key = event.key.toLowerCase();
                    if ([
                        'w',
                        'a',
                        's',
                        'd',
                        'arrowup',
                        'arrowdown',
                        'arrowleft',
                        'arrowright',
                        ' ',
                        'shift',
                        'escape',
                        'h',
                        'j',
                        'e',
                        'q'
                    ].includes(key)) event.preventDefault();
                    if (event.repeat && [
                        'escape',
                        'h',
                        'j',
                        'e',
                        'q',
                        ' '
                    ].includes(key)) return;
                    if (key === 'escape') {
                        keys.clear();
                        if (modalFlagsRef.current.help || modalFlagsRef.current.quest) {
                            setHelp(false);
                            setQuestOpen(false);
                        } else if (document.pointerLockElement === renderer.domElement) {
                            document.exitPointerLock();
                            setPaused(true);
                        } else setPaused({
                            "Game.useEffect.onKeyDown": (value)=>!value
                        }["Game.useEffect.onKeyDown"]);
                        return;
                    }
                    if (key === 'h') {
                        releaseMouse();
                        setHelp({
                            "Game.useEffect.onKeyDown": (value)=>!value
                        }["Game.useEffect.onKeyDown"]);
                        return;
                    }
                    if (key === 'j') {
                        releaseMouse();
                        setQuestOpen({
                            "Game.useEffect.onKeyDown": (value)=>!value
                        }["Game.useEffect.onKeyDown"]);
                        return;
                    }
                    if (key === 'e' && isNearMarker && !uiOpenRef.current) {
                        interactMarker();
                        return;
                    }
                    if (key === 'q') {
                        castSpell();
                        return;
                    }
                    if ([
                        'w',
                        'a',
                        's',
                        'd',
                        'arrowup',
                        'arrowdown',
                        'arrowleft',
                        'arrowright',
                        ' ',
                        'shift'
                    ].includes(key)) {
                        ambient.start();
                        keys.add(key);
                    }
                }
            }["Game.useEffect.onKeyDown"];
            const onKeyUp = {
                "Game.useEffect.onKeyUp": (event)=>keys.delete(event.key.toLowerCase())
            }["Game.useEffect.onKeyUp"];
            const onBlur = {
                "Game.useEffect.onBlur": ()=>{
                    keys.clear();
                    setPaused(true);
                }
            }["Game.useEffect.onBlur"];
            const onVisibility = {
                "Game.useEffect.onVisibility": ()=>{
                    if (document.visibilityState === 'hidden') {
                        keys.clear();
                        setPaused(true);
                    }
                }
            }["Game.useEffect.onVisibility"];
            const onPointerLock = {
                "Game.useEffect.onPointerLock": ()=>{
                    dragging = document.pointerLockElement === renderer.domElement;
                }
            }["Game.useEffect.onPointerLock"];
            const onPointerDown = {
                "Game.useEffect.onPointerDown": (event)=>{
                    if (event.button !== 0 || uiOpenRef.current) return;
                    ambient.start();
                    if (event.pointerType === 'touch') {
                        renderer.domElement.setPointerCapture(event.pointerId);
                        dragging = true;
                        previousX = event.clientX;
                        previousY = event.clientY;
                        return;
                    }
                    castSpell();
                    if (renderer.domElement.requestPointerLock) {
                        const lockRequest = renderer.domElement.requestPointerLock();
                        if (lockRequest && typeof lockRequest.catch === 'function') lockRequest.catch({
                            "Game.useEffect.onPointerDown": ()=>{
                                dragging = true;
                            }
                        }["Game.useEffect.onPointerDown"]);
                        dragging = true;
                    } else dragging = true;
                    previousX = event.clientX;
                    previousY = event.clientY;
                }
            }["Game.useEffect.onPointerDown"];
            const onPointerMove = {
                "Game.useEffect.onPointerMove": (event)=>{
                    if (!dragging || uiOpenRef.current) return;
                    const locked = document.pointerLockElement === renderer.domElement;
                    cameraRig.rotate(locked ? event.movementX : event.clientX - previousX, locked ? event.movementY : event.clientY - previousY);
                    previousX = event.clientX;
                    previousY = event.clientY;
                }
            }["Game.useEffect.onPointerMove"];
            const onPointerUp = {
                "Game.useEffect.onPointerUp": ()=>{
                    if (document.pointerLockElement !== renderer.domElement) dragging = false;
                }
            }["Game.useEffect.onPointerUp"];
            const onWheel = {
                "Game.useEffect.onWheel": (event)=>cameraRig.zoom(event.deltaY)
            }["Game.useEffect.onWheel"];
            const onContext = {
                "Game.useEffect.onContext": (event)=>event.preventDefault()
            }["Game.useEffect.onContext"];
            const resize = {
                "Game.useEffect.resize": ()=>{
                    const width = host.clientWidth, height = host.clientHeight;
                    if (!width || !height) return;
                    renderer.setSize(width, height, false);
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                }
            }["Game.useEffect.resize"];
            const resizeObserver = new ResizeObserver(resize);
            resizeObserver.observe(host);
            resize();
            window.addEventListener('keydown', onKeyDown);
            window.addEventListener('keyup', onKeyUp);
            window.addEventListener('blur', onBlur);
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
            document.addEventListener('visibilitychange', onVisibility);
            document.addEventListener('pointerlockchange', onPointerLock);
            renderer.domElement.addEventListener('pointerdown', onPointerDown);
            renderer.domElement.addEventListener('wheel', onWheel, {
                passive: true
            });
            renderer.domElement.addEventListener('contextmenu', onContext);
            let frame = 0;
            const animate = {
                "Game.useEffect.animate": ()=>{
                    frame = requestAnimationFrame(animate);
                    const delta = Math.min(.05, clock.getDelta());
                    if (!uiOpenRef.current) {
                        elapsed += delta;
                        const forward = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0) + touchMoveRef.current.forward;
                        const side = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0) + touchMoveRef.current.side;
                        const moving = motor.update(delta, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(forward, -1, 1), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(side, -1, 1), keys.has('shift') || touchSprintRef.current, keys.has(' ') || touchJumpRef.current, cameraRig.yaw);
                        touchJumpRef.current = false;
                        const pose = elapsed < castUntil ? 'cast' : !motor.grounded ? 'jump' : moving ? keys.has('shift') ? 'run' : 'walk' : 'idle';
                        hero.update(elapsed, delta, pose);
                        magic.update(delta, elapsed);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateWorld"])(world, elapsed);
                        const distanceToMarker = Math.hypot(hero.root.position.x, hero.root.position.z + 12);
                        const near = distanceToMarker < 4.6;
                        if (near !== isNearMarker) {
                            isNearMarker = near;
                            setNearLandmark(near);
                        }
                    }
                    cameraRig.update(hero.root, delta);
                    if (compassNeedleRef.current) compassNeedleRef.current.style.transform = `rotate(${-cameraRig.yaw}rad)`;
                    if (compassPinRef.current) {
                        const markerAngle = Math.atan2(-hero.root.position.x, -(hero.root.position.z + 12)) - cameraRig.yaw;
                        compassPinRef.current.style.left = `${42 + Math.sin(markerAngle) * 14}px`;
                        compassPinRef.current.style.top = `${42 - Math.cos(markerAngle) * 14}px`;
                    }
                    renderer.render(scene, camera);
                }
            }["Game.useEffect.animate"];
            const clock = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Clock"]();
            animate();
            return ({
                "Game.useEffect": ()=>{
                    cancelAnimationFrame(frame);
                    if (hintTimer) clearTimeout(hintTimer);
                    resizeObserver.disconnect();
                    window.removeEventListener('keydown', onKeyDown);
                    window.removeEventListener('keyup', onKeyUp);
                    window.removeEventListener('blur', onBlur);
                    window.removeEventListener('pointermove', onPointerMove);
                    window.removeEventListener('pointerup', onPointerUp);
                    document.removeEventListener('visibilitychange', onVisibility);
                    document.removeEventListener('pointerlockchange', onPointerLock);
                    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
                    renderer.domElement.removeEventListener('wheel', onWheel);
                    renderer.domElement.removeEventListener('contextmenu', onContext);
                    if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
                    magic.dispose();
                    ambient.dispose();
                    audioRef.current = null;
                    rendererRef.current = null;
                    qualityTargetsRef.current = null;
                    cameraRigRef.current = null;
                    castSpellRef.current = ({
                        "Game.useEffect": ()=>{}
                    })["Game.useEffect"];
                    interactRef.current = ({
                        "Game.useEffect": ()=>{}
                    })["Game.useEffect"];
                    const geometries = new Set(), materials = new Set();
                    scene.traverse({
                        "Game.useEffect": (object)=>{
                            if (object instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"] || object instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"] || object instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Points"]) {
                                geometries.add(object.geometry);
                                const list = Array.isArray(object.material) ? object.material : [
                                    object.material
                                ];
                                list.forEach({
                                    "Game.useEffect": (material)=>materials.add(material)
                                }["Game.useEffect"]);
                            }
                        }
                    }["Game.useEffect"]);
                    geometries.forEach({
                        "Game.useEffect": (geometry)=>geometry.dispose()
                    }["Game.useEffect"]);
                    materials.forEach({
                        "Game.useEffect": (material)=>material.dispose()
                    }["Game.useEffect"]);
                    renderer.dispose();
                    if (host.contains(renderer.domElement)) host.removeChild(renderer.domElement);
                }
            })["Game.useEffect"];
        }
    }["Game.useEffect"], [
        releaseMouse
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Game.useEffect": ()=>{
            const renderer = rendererRef.current;
            if (!renderer) return;
            const ratio = quality === 'Alta' ? 1.85 : quality === 'Baixa' ? 1 : 1.45;
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, ratio));
            renderer.shadowMap.enabled = quality !== 'Baixa';
            renderer.shadowMap.needsUpdate = true;
            const targets = qualityTargetsRef.current;
            if (targets) {
                const mapSize = quality === 'Alta' ? 2048 : quality === 'Média' ? 1024 : 512;
                targets.sun.shadow.map?.dispose();
                targets.sun.shadow.map = null;
                targets.sun.shadow.mapSize.set(mapSize, mapSize);
                targets.sun.shadow.needsUpdate = true;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setWorldQuality"])(targets.scene, quality);
            }
        }
    }["Game.useEffect"], [
        quality
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Game.useEffect": ()=>{
            if (cameraRigRef.current) cameraRigRef.current.sensitivity = .0008 + sensitivity * .0005;
        }
    }["Game.useEffect"], [
        sensitivity
    ]);
    const closeMenus = ()=>{
        setHelp(false);
        setQuestOpen(false);
        setPaused(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "game-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scene",
                ref: hostRef,
                "aria-label": "Mundo 3D explorável dos Campos da Aurora"
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 289,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "vignette"
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 290,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "aim-reticle",
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "aim-core"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 291,
                        columnNumber: 53
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "aim-tick aim-top"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 291,
                        columnNumber: 82
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "aim-tick aim-right"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 291,
                        columnNumber: 116
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "aim-tick aim-bottom"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 291,
                        columnNumber: 152
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "aim-tick aim-left"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 291,
                        columnNumber: 189
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 291,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "topbar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "brand",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "brand-mark",
                                children: "✦"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 293,
                                columnNumber: 30
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "eyebrow",
                                        children: "UM MUNDO DEPOIS DO FIM"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 293,
                                        columnNumber: 70
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "brand-name",
                                        children: [
                                            "ECOS ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "DA ERA DOS HERÓIS"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 293,
                                                columnNumber: 156
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 293,
                                        columnNumber: 123
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 293,
                                columnNumber: 65
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 293,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "region",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "region-dot"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 294,
                                columnNumber: 31
                            }, this),
                            status.area,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "region-sub",
                                children: "Oeste · Terras de Avel"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 294,
                                columnNumber: 75
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 294,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "top-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "icon-button",
                                onClick: toggleMute,
                                "aria-label": muted ? 'Ativar som' : 'Silenciar',
                                title: muted ? 'Ativar som' : 'Silenciar',
                                children: muted ? '◖' : '♫'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 295,
                                columnNumber: 36
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "icon-button",
                                onClick: toggleHelp,
                                "aria-label": "Ajuda",
                                title: "Controles",
                                children: "?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 295,
                                columnNumber: 208
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 295,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 292,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "quest-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "quest-kicker",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "tiny-star",
                                children: "✦"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 297,
                                columnNumber: 67
                            }, this),
                            " MEMÓRIA ESQUECIDA"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 297,
                        columnNumber: 37
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "O Que Permanece"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 297,
                        columnNumber: 127
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Encontre o Marco do Herói e desperte o Eco que repousa nas pedras."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 297,
                        columnNumber: 151
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "quest-progress",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                width: `${status.discovered * 100}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 297,
                            columnNumber: 256
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 297,
                        columnNumber: 224
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "quest-count",
                        children: [
                            status.discovered ? '1' : '0',
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "/ 1 memória encontrada"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 297,
                                columnNumber: 380
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 297,
                        columnNumber: 319
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 297,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "compass",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "compass-ring",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "compass-n",
                                children: "N"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 298,
                                columnNumber: 60
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                ref: compassNeedleRef,
                                className: "compass-needle",
                                children: "◆"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 298,
                                columnNumber: 96
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                ref: compassPinRef,
                                className: "compass-pin",
                                children: "✦"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 298,
                                columnNumber: 160
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "compass-s",
                                children: "S"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 298,
                                columnNumber: 218
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 298,
                        columnNumber: 30
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "compass-label",
                        children: "CAMPOS DA AURORA"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 298,
                        columnNumber: 260
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 298,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "touch-controls",
                "aria-label": "Controles de toque",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "touch-stick",
                        role: "application",
                        "aria-label": "Direcional de movimento",
                        onPointerDown: onTouchStickDown,
                        onPointerMove: onTouchStickMove,
                        onPointerUp: onTouchStickUp,
                        onPointerCancel: onTouchStickUp,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "touch-stick-n",
                                children: "N"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 300,
                                columnNumber: 220
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                ref: touchKnobRef,
                                className: "touch-knob"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 300,
                                columnNumber: 260
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 300,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "touch-actions",
                        children: [
                            nearLandmark && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action touch-interact",
                                onClick: ()=>interactRef.current(),
                                children: "Eco"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 302,
                                columnNumber: 26
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>castSpellRef.current(),
                                children: "Magia"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 303,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onPointerDown: (event)=>{
                                    event.preventDefault();
                                    touchJumpRef.current = true;
                                },
                                onClick: ()=>{
                                    touchJumpRef.current = true;
                                },
                                children: "Pular"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 304,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action touch-sprint",
                                onPointerDown: (event)=>{
                                    event.preventDefault();
                                    event.currentTarget.setPointerCapture(event.pointerId);
                                    touchSprintRef.current = true;
                                },
                                onPointerUp: ()=>{
                                    touchSprintRef.current = false;
                                },
                                onPointerCancel: ()=>{
                                    touchSprintRef.current = false;
                                },
                                children: "Correr"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 305,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>setPaused(true),
                                children: "Menu"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 306,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 301,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 299,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bottom-left",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "player-card",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "portrait",
                            children: "✧"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 309,
                            columnNumber: 63
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "player-meta",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Chamado"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 309,
                                    columnNumber: 125
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Errante das Terras de Avel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 309,
                                    columnNumber: 149
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 309,
                            columnNumber: 96
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "level",
                            children: "✦"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 309,
                            columnNumber: 194
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/Game.tsx",
                    lineNumber: 309,
                    columnNumber: 34
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 309,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bottom-center",
                children: [
                    nearLandmark && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "interaction",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "keycap",
                                children: "E"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 310,
                                columnNumber: 82
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Ouvir o Eco do marco"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 310,
                                columnNumber: 115
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 310,
                        columnNumber: 53
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hotbar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "hotkey",
                                onClick: toggleQuest,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot",
                                        children: "J"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 310,
                                        columnNumber: 228
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot-label",
                                        children: "Jornada"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 310,
                                        columnNumber: 259
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 310,
                                columnNumber: 179
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "hotkey",
                                onClick: ()=>castSpellRef.current(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot",
                                        children: "Q"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 310,
                                        columnNumber: 377
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot-label",
                                        children: "Magia do Eco"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 310,
                                        columnNumber: 408
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 310,
                                columnNumber: 311
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "hotkey",
                                onClick: toggleHelp,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot",
                                        children: "H"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 310,
                                        columnNumber: 513
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot-label",
                                        children: "Ajuda"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 310,
                                        columnNumber: 544
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 310,
                                columnNumber: 465
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 310,
                        columnNumber: 155
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 310,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bottom-right",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "world-time",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "◷"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 311,
                                columnNumber: 63
                            }, this),
                            " AMANHECER"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 311,
                        columnNumber: 35
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "weather",
                        children: "PRÓLOGO · CAMPOS DA AURORA"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 311,
                        columnNumber: 93
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 311,
                columnNumber: 5
            }, this),
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "toast",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "✦"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 312,
                        columnNumber: 37
                    }, this),
                    hint
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 312,
                columnNumber: 14
            }, this),
            gameError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "game-error",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "O mundo não pôde ser carregado"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 313,
                        columnNumber: 47
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: gameError
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 313,
                        columnNumber: 94
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.location.reload(),
                        children: "Tentar novamente"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 313,
                        columnNumber: 118
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 313,
                columnNumber: 19
            }, this),
            (help || questOpen || paused) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-backdrop",
                onClick: closeMenus,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal",
                    role: "dialog",
                    "aria-modal": "true",
                    onClick: (event)=>event.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "modal-close",
                            onClick: closeMenus,
                            "aria-label": "Fechar",
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 315,
                            columnNumber: 7
                        }, this),
                        paused ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "modal-kicker",
                                    children: "CAMPOS DA AURORA"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 316,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "A jornada repousa."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 316,
                                    columnNumber: 73
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "O Eco ainda aguarda. Ajuste a qualidade ou retome a exploração."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 316,
                                    columnNumber: 100
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "quality-select",
                                    children: [
                                        "Qualidade gráfica",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: quality,
                                            onChange: (event)=>setQuality(event.target.value),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Baixa"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 316,
                                                    columnNumber: 307
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Média"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 316,
                                                    columnNumber: 329
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Alta"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 316,
                                                    columnNumber: 351
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 316,
                                            columnNumber: 221
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 316,
                                    columnNumber: 170
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "quality-select sensitivity-control",
                                    children: [
                                        "Sensibilidade do mouse",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "range",
                                            min: "1",
                                            max: "10",
                                            value: sensitivity,
                                            onChange: (event)=>setSensitivity(Number(event.target.value))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 316,
                                            columnNumber: 465
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: sensitivity
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 316,
                                            columnNumber: 587
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 316,
                                    columnNumber: 389
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "continue",
                                    onClick: closeMenus,
                                    children: [
                                        "RETOMAR A JORNADA ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 316,
                                            columnNumber: 689
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 316,
                                    columnNumber: 621
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 316,
                            columnNumber: 17
                        }, this) : help ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "modal-kicker",
                                    children: "CAMINHOS DO VIAJANTE"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 317,
                                    columnNumber: 20
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Um passo de cada vez."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 317,
                                    columnNumber: 78
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Explore os Campos da Aurora, procure o Marco do Herói e use a magia do Eco para tocar o mundo. A mira central indica onde o feitiço vai atingir."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 317,
                                    columnNumber: 108
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "controls-grid",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "W"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 295
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "A"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 307
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "S"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 319
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "D"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 331
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Mover"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 343
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 317,
                                            columnNumber: 290
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Mouse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 372
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Olhar ao redor"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 388
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 317,
                                            columnNumber: 367
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Roda"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 426
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Zoom da câmera"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 441
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 317,
                                            columnNumber: 421
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Shift"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 479
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Correr"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 495
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 317,
                                            columnNumber: 474
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Espaço"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 525
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Pular"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 542
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 317,
                                            columnNumber: 520
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "E"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 571
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Ouvir o Marco"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 583
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 317,
                                            columnNumber: 566
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Q / Clique"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 620
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Lançar magia"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 641
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 317,
                                            columnNumber: 615
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "J"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 677
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Diário de viagem"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 689
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 317,
                                            columnNumber: 672
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Esc"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 729
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Pausar e liberar cursor"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 743
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 317,
                                            columnNumber: 724
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 317,
                                    columnNumber: 259
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "continue",
                                    onClick: closeMenus,
                                    children: [
                                        "CONTINUAR A JORNADA ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 317,
                                            columnNumber: 861
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 317,
                                    columnNumber: 791
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 317,
                            columnNumber: 18
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "modal-kicker",
                                    children: "DIÁRIO DE VIAGEM · 01"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 318,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "O Que Permanece"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 318,
                                    columnNumber: 72
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Quase mil anos se passaram desde a derrota de Valkhor. A relva tomou os velhos caminhos, e os nomes dos heróis já não são lembrados."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 318,
                                    columnNumber: 96
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Um marco de pedra repousa além do prado, coberto de musgo. Talvez ainda guarde uma lembrança."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 318,
                                    columnNumber: 235
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "quest-objective",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "✦"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 318,
                                            columnNumber: 368
                                        }, this),
                                        status.discovered ? 'Memória do Marco do Herói despertada' : 'Encontre o Marco do Herói nos campos'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 318,
                                    columnNumber: 335
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 318,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/Game.tsx",
                    lineNumber: 314,
                    columnNumber: 92
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 314,
                columnNumber: 39
            }, this),
            paused && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pause-stamp",
                children: "PAUSADO"
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 320,
                columnNumber: 16
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "build-stamp",
                children: [
                    "PRÓLOGO ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "·"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 321,
                        columnNumber: 42
                    }, this),
                    " PROTÓTIPO 0.2"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 321,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/Game.tsx",
        lineNumber: 288,
        columnNumber: 10
    }, this);
}
_s(Game, "LKx15++3v8o6OmZbUHF5zfu2ob4=");
_c = Game;
var _c;
__turbopack_context__.k.register(_c, "Game");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/audio.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AmbientAudio",
    ()=>AmbientAudio
]);
class AmbientAudio {
    context = null;
    master = null;
    muted = false;
    start() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (!this.context) {
            const AudioContextConstructor = window.AudioContext;
            if (!AudioContextConstructor) return;
            this.context = new AudioContextConstructor();
            this.master = this.context.createGain();
            this.master.gain.value = this.muted ? 0 : .12;
            const filter = this.context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 520;
            filter.Q.value = .55;
            const length = this.context.sampleRate * 5;
            const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
            const channel = buffer.getChannelData(0);
            let brown = 0;
            for(let i = 0; i < length; i++){
                brown = (brown + .018 * (Math.random() * 2 - 1)) / 1.018;
                channel[i] = brown * 3.1;
            }
            const wind = this.context.createBufferSource();
            wind.buffer = buffer;
            wind.loop = true;
            wind.connect(filter).connect(this.master).connect(this.context.destination);
            wind.start();
        }
        void this.context.resume();
    }
    setMuted(muted) {
        this.muted = muted;
        if (this.master && this.context) this.master.gain.setTargetAtTime(muted ? 0 : .12, this.context.currentTime, .18);
        if (!muted) this.start();
    }
    playCast() {
        this.start();
        if (!this.context || this.muted) return;
        const now = this.context.currentTime;
        const tone = this.context.createOscillator();
        tone.type = 'sine';
        tone.frequency.setValueAtTime(660, now);
        tone.frequency.exponentialRampToValueAtTime(220, now + .24);
        const envelope = this.context.createGain();
        envelope.gain.setValueAtTime(.0001, now);
        envelope.gain.exponentialRampToValueAtTime(.14, now + .025);
        envelope.gain.exponentialRampToValueAtTime(.0001, now + .34);
        tone.connect(envelope).connect(this.context.destination);
        tone.start(now);
        tone.stop(now + .36);
    }
    dispose() {
        if (this.context && this.context.state !== 'closed') void this.context.close();
        this.context = null;
        this.master = null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/hero.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createHero",
    ()=>createHero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
;
function mesh(geometry, material, parent, position = [
    0,
    0,
    0
]) {
    const object = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](geometry, material);
    object.position.set(...position);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
}
function capsule(material, radius, length, parent, position = [
    0,
    0,
    0
]) {
    return mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CapsuleGeometry"](radius, length, 5, 10), material, parent, position);
}
function smoothAngle(current, target, amount) {
    const difference = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].euclideanModulo(target - current + Math.PI, Math.PI * 2) - Math.PI;
    return current + difference * amount;
}
function createHero(scene) {
    const root = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    root.name = 'called-wanderer';
    const body = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    body.name = 'provisional-articulated-rig';
    root.add(body);
    const cloth = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#42616a',
        roughness: .79
    });
    const coat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#dad1b7',
        roughness: .91
    });
    const coatShadow = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#a5a18c',
        roughness: .94
    });
    const leather = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#544337',
        roughness: .82
    });
    const metal = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#b99d67',
        roughness: .43,
        metalness: .42
    });
    const skin = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#edc9a9',
        roughness: .81
    });
    const hair = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#e4e1d3',
        roughness: .76
    });
    const hairShade = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#aeb9b5',
        roughness: .82
    });
    const eye = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#6f998e',
        roughness: .36,
        metalness: .08
    });
    const glow = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#f2dca5',
        emissive: '#b58a3f',
        emissiveIntensity: 1.2,
        roughness: .34
    });
    const torso = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.38, .62, 7, 14), cloth, body, [
        0,
        1.43,
        0
    ]);
    torso.scale.set(1, 1, .78);
    const mantle = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LatheGeometry"]([
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](.54, .12),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](.58, .22),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](.49, .5),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](.39, .82),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](.4, 1.13),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](.53, 1.43),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](.45, 1.58),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](.28, 1.65)
    ], 16), coat);
    mantle.position.set(0, .25, -.035);
    mantle.castShadow = true;
    mantle.receiveShadow = true;
    body.add(mantle);
    for (const side of [
        -1,
        1
    ]){
        const seamCurve = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CatmullRomCurve3"]([
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](side * .15, 1.82, -.31),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](side * .2, 1.35, -.48),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](side * .26, .85, -.51),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](side * .45, .38, -.57)
        ]);
        mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TubeGeometry"](seamCurve, 18, .012, 5, false), coatShadow, body);
    }
    const mantlePanel = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"](), coatShadow, body);
    const panelShape = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shape"]();
    panelShape.moveTo(-.09, 1.38);
    panelShape.lineTo(.3, 1.42);
    panelShape.lineTo(.44, .12);
    panelShape.lineTo(.16, .04);
    panelShape.closePath();
    mantlePanel.geometry.dispose();
    mantlePanel.geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShapeGeometry"](panelShape, 1);
    mantlePanel.position.set(.04, .25, .37);
    const collar = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](.39, .095, 9, 20, Math.PI), coat, body, [
        0,
        2.02,
        0
    ]);
    collar.rotation.z = Math.PI;
    const scarf = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](.36, .1, 8, 24), cloth, body, [
        0,
        1.89,
        .015
    ]);
    scarf.rotation.x = Math.PI / 2;
    const head = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    head.position.set(0, 2.13, .015);
    body.add(head);
    const face = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.31, 20, 18), skin, head, [
        0,
        .04,
        .015
    ]);
    face.scale.set(.92, 1.08, .83);
    for (const side of [
        -1,
        1
    ]){
        const ear = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.09, 12, 10), skin, head, [
            side * .29,
            .045,
            -.005
        ]);
        ear.scale.set(.55, 1.18, .68);
        const eyeWhite = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.052, 10, 10), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#f7f0df'
        }), head, [
            side * .112,
            .065,
            .268
        ]);
        eyeWhite.scale.set(1.15, .82, .45);
        mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.028, 10, 8), eye, head, [
            side * .112,
            .065,
            .29
        ]);
        const brow = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.018, .075, 2, 6), hairShade, head, [
            side * .11,
            .145,
            .25
        ]);
        brow.rotation.z = side * -.12;
        brow.rotation.y = side * -.08;
    }
    mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.025, 9, 7), skin, head, [
        0,
        -.025,
        .277
    ]);
    const fringe = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.31, 18, 12, 0, Math.PI * 2, 0, Math.PI * .62), hair, head, [
        0,
        .17,
        -.018
    ]);
    fringe.scale.set(1.1, 1.05, 1);
    for(let i = 0; i < 7; i++){
        const side = i % 2 ? 1 : -1;
        const lock = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.065, .2 + i % 3 * .035, 4, 8), i % 3 === 0 ? hairShade : hair, head, [
            side * (.1 + Math.floor(i / 2) * .055),
            -.02 - i % 3 * .045,
            .18 - Math.floor(i / 2) * .045
        ]);
        lock.rotation.z = side * (.25 + i % 3 * .12);
        lock.rotation.x = .18;
    }
    for(let i = 0; i < 6; i++){
        const x = (i - 2.5) * .085;
        const length = .21 + i % 3 * .07;
        const backLock = capsule(i % 2 ? hair : hairShade, .047, length + .08, head, [
            x,
            -.14 - length * .34,
            -.19
        ]);
        backLock.scale.set(.92, 1.08, .68);
        backLock.rotation.z = x * -.42;
    }
    for (const side of [
        -1,
        1
    ]){
        const sideLock = capsule(hair, .07, .22, head, [
            side * .265,
            -.11,
            -.02
        ]);
        sideLock.scale.set(.82, 1.25, .74);
        sideLock.rotation.z = side * .1;
    }
    const circlet = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](.255, .028, 7, 24, Math.PI), metal, head, [
        0,
        .27,
        .005
    ]);
    circlet.rotation.z = Math.PI;
    const circletGem = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OctahedronGeometry"](.065, 0), glow, head, [
        0,
        .48,
        .015
    ]);
    circletGem.scale.set(.76, 1.28, .62);
    const hips = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    hips.position.set(0, .73, 0);
    body.add(hips);
    const legs = [];
    for (const side of [
        -1,
        1
    ]){
        const thigh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        thigh.position.set(side * .19, 0, 0);
        hips.add(thigh);
        legs.push(thigh);
        capsule(leather, .13, .33, thigh, [
            0,
            -.31,
            0
        ]);
        const shin = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        shin.position.set(0, -.57, 0);
        thigh.add(shin);
        capsule(coatShadow, .12, .3, shin, [
            0,
            -.22,
            0
        ]);
        const boot = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.14, .2, 4, 9), leather, shin, [
            0,
            -.49,
            .075
        ]);
        boot.rotation.x = Math.PI / 2;
        const bootTrim = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](.122, .025, 6, 12), metal, shin, [
            0,
            -.34,
            0
        ]);
        bootTrim.rotation.x = Math.PI / 2;
    }
    const arms = [];
    for (const side of [
        -1,
        1
    ]){
        const shoulder = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.2, 12, 10), coatShadow, body, [
            side * .43,
            1.79,
            0
        ]);
        shoulder.scale.set(1.06, .74, .83);
        const arm = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        arm.position.set(side * .46, 1.78, .01);
        body.add(arm);
        arms.push(arm);
        capsule(cloth, .115, .31, arm, [
            0,
            -.25,
            0
        ]);
        const cuff = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](.12, .024, 6, 12), metal, arm, [
            0,
            -.48,
            0
        ]);
        capsule(coat, .095, .26, arm, [
            0,
            -.64,
            0
        ]);
        mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.11, 10, 8), leather, arm, [
            0,
            -.84,
            .025
        ]);
        cuff.position.y = -.48;
    }
    const belt = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](.35, .055, 8, 24), leather, body, [
        0,
        .99,
        0
    ]);
    belt.rotation.x = Math.PI / 2;
    const clasp = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](.16, .14, .055), metal, body, [
        0,
        .99,
        .36
    ]);
    const satchel = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](.24, .27, .13), leather, body, [
        -.42,
        1.05,
        .04
    ]);
    satchel.rotation.z = -.14;
    const strap = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.025, .72, 4, 7), leather, body, [
        -.22,
        1.48,
        -.06
    ]);
    strap.rotation.z = -.32;
    strap.rotation.x = -.2;
    const staff = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    staff.name = 'heirloom-staff';
    staff.position.set(.52, .67, .15);
    staff.rotation.z = -.11;
    body.add(staff);
    const wood = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#644b35',
        roughness: .83
    });
    const shaft = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](.038, .065, 2.2, 9), wood, staff, [
        0,
        .66,
        0
    ]);
    const grip = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.07, .2, 4, 8), leather, staff, [
        0,
        .48,
        .02
    ]);
    for(let i = 0; i < 3; i++){
        const wrap = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](.055, .018, 6, 10), metal, staff, [
            0,
            .35 + i * .12,
            0
        ]);
        wrap.rotation.x = Math.PI / 2;
    }
    const headRing = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](.15, .035, 8, 18), metal, staff, [
        0,
        1.87,
        0
    ]);
    headRing.rotation.x = Math.PI / 2;
    const focus = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IcosahedronGeometry"](.115, 1), glow, staff, [
        0,
        1.87,
        0
    ]);
    const spellPoint = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Object3D"]();
    spellPoint.position.set(0, 1.91, .04);
    staff.add(spellPoint);
    const aura = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"]('#efdba9', .85, 4, 2);
    aura.position.set(0, 1.9, .1);
    staff.add(aura);
    root.userData = {
        body,
        legs,
        arms,
        focus,
        clasp,
        satchel,
        shoulder: root
    };
    root.position.set(0, 0, 2);
    scene.add(root);
    let gait = 0;
    return {
        root,
        spellPoint,
        update (time, delta, pose) {
            const targetGait = pose === 'run' ? 1 : pose === 'walk' ? .64 : 0;
            gait = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(gait, targetGait, 10, delta);
            const swing = Math.sin(time * (pose === 'run' ? 13.5 : 9.5));
            legs[0].rotation.x = swing * .48 * gait;
            legs[1].rotation.x = -swing * .48 * gait;
            arms[0].rotation.x = -swing * .28 * gait + (pose === 'cast' ? -.55 : 0);
            arms[1].rotation.x = swing * .28 * gait + (pose === 'cast' ? -.72 : 0);
            body.position.y = pose === 'jump' ? .08 : Math.abs(swing) * .045 * gait + Math.sin(time * 1.4) * .018;
            body.rotation.z = pose === 'cast' ? .045 : Math.sin(time * .8) * .008;
            root.rotation.y = smoothAngle(root.rotation.y, root.userData.facing ?? root.rotation.y, 1 - Math.exp(-delta * 13));
            focus.scale.setScalar(.93 + Math.sin(time * 1.8) * .08);
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/simulation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PlayerMotor",
    ()=>PlayerMotor,
    "ThirdPersonCamera",
    ()=>ThirdPersonCamera
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world.ts [app-client] (ecmascript)");
;
;
class PlayerMotor {
    root;
    colliders;
    velocity;
    grounded;
    verticalVelocity;
    constructor(root, colliders){
        this.root = root;
        this.colliders = colliders;
        this.velocity = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.grounded = false;
        this.verticalVelocity = 0;
    }
    update(delta, moveForward, moveSide, sprint, jump, facingYaw) {
        const inputLength = Math.hypot(moveForward, moveSide);
        let desiredX = 0, desiredZ = 0;
        if (inputLength > 0) {
            const fX = -Math.sin(facingYaw), fZ = -Math.cos(facingYaw);
            const rX = Math.cos(facingYaw), rZ = -Math.sin(facingYaw);
            desiredX = (fX * moveForward + rX * moveSide) / inputLength;
            desiredZ = (fZ * moveForward + rZ * moveSide) / inputLength;
            const speed = sprint ? 7.4 : 4.35;
            desiredX *= speed;
            desiredZ *= speed;
        }
        const response = inputLength > 0 ? 16 : 20;
        this.velocity.x = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(this.velocity.x, desiredX, response, delta);
        this.velocity.z = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(this.velocity.z, desiredZ, response, delta);
        const steps = Math.max(1, Math.ceil(Math.hypot(this.velocity.x, this.velocity.z) * delta / .22));
        const stepDelta = delta / steps;
        for(let step = 0; step < steps; step++){
            let x = this.root.position.x + this.velocity.x * stepDelta;
            let z = this.root.position.z + this.velocity.z * stepDelta;
            x = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(x, -105, 105);
            z = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(z, -105, 105);
            for (const collider of this.colliders){
                let dx = x - collider.x, dz = z - collider.z;
                const minimum = collider.radius + .31;
                const distance = Math.hypot(dx, dz);
                if (distance < minimum) {
                    if (distance < .0001) {
                        dx = .001;
                        dz = 0;
                    }
                    const length = Math.hypot(dx, dz);
                    x = collider.x + dx / length * minimum;
                    z = collider.z + dz / length * minimum;
                    const normalVelocity = this.velocity.x * (dx / length) + this.velocity.z * (dz / length);
                    if (normalVelocity < 0) {
                        this.velocity.x -= normalVelocity * (dx / length);
                        this.velocity.z -= normalVelocity * (dz / length);
                    }
                }
            }
            this.root.position.x = x;
            this.root.position.z = z;
        }
        const surfaceY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(this.root.position.x, this.root.position.z);
        if (this.root.position.y <= surfaceY + .06 && this.verticalVelocity <= 0) {
            this.root.position.y = surfaceY;
            this.verticalVelocity = 0;
            this.grounded = true;
        } else this.grounded = false;
        if (jump && this.grounded) {
            this.verticalVelocity = 9.4;
            this.grounded = false;
        }
        this.verticalVelocity -= 26 * delta;
        this.root.position.y += this.verticalVelocity * delta;
        if (this.root.position.y <= surfaceY) {
            this.root.position.y = surfaceY;
            this.verticalVelocity = 0;
            this.grounded = true;
        }
        if (inputLength > 0 && Math.hypot(this.velocity.x, this.velocity.z) > .2) {
            const facing = Math.atan2(this.velocity.x, this.velocity.z);
            this.root.userData.facing = facing;
        }
        return inputLength > 0 && Math.hypot(this.velocity.x, this.velocity.z) > .35;
    }
}
class ThirdPersonCamera {
    camera;
    parts;
    yaw;
    pitch;
    distance;
    sensitivity;
    currentDistance;
    raycaster;
    target;
    offset;
    desired;
    look;
    collisionDistance;
    collisionObjects;
    constructor(camera, parts){
        this.camera = camera;
        this.parts = parts;
        this.yaw = 0;
        this.pitch = .19;
        this.distance = 7.4;
        this.sensitivity = .0032;
        this.currentDistance = 7.4;
        this.raycaster = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Raycaster"]();
        this.target = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.offset = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.desired = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.look = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.collisionDistance = 7.4;
        this.collisionObjects = parts.blockers;
    }
    rotate(dx, dy) {
        this.yaw -= dx * this.sensitivity;
        this.pitch = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(this.pitch + dy * this.sensitivity, -.12, .72);
    }
    zoom(delta) {
        this.distance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(this.distance + delta * .008, 3.4, 13.5);
    }
    update(root, delta) {
        this.target.set(root.position.x, root.position.y + 1.48, root.position.z);
        const horizontal = Math.cos(this.pitch) * this.distance;
        this.offset.set(Math.sin(this.yaw) * horizontal, Math.sin(this.pitch) * this.distance + .48, Math.cos(this.yaw) * horizontal);
        this.desired.copy(this.target).add(this.offset);
        this.raycaster.near = .1;
        this.raycaster.far = this.distance;
        this.raycaster.set(this.target, this.offset.clone().normalize());
        const hit = this.raycaster.intersectObjects(this.collisionObjects, true).find((item)=>item.distance < this.distance - .2);
        const requestedDistance = hit ? Math.max(.8, hit.distance - .36) : this.distance;
        if (requestedDistance < this.collisionDistance) this.collisionDistance = requestedDistance;
        else this.collisionDistance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(this.collisionDistance, requestedDistance, 7, delta);
        this.currentDistance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(this.currentDistance, this.collisionDistance, 18, delta);
        this.look.copy(this.target);
        this.desired.copy(this.offset).setLength(this.currentDistance).add(this.target);
        this.desired.y = Math.max(this.desired.y, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(this.desired.x, this.desired.z) + .85);
        this.camera.position.lerp(this.desired, 1 - Math.exp(-delta * 12));
        this.camera.lookAt(this.look);
    }
    getAimPoint(out) {
        this.camera.updateMatrixWorld();
        this.raycaster.setFromCamera(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](0, 0), this.camera);
        this.raycaster.near = .1;
        this.raycaster.far = 30;
        const hit = this.raycaster.intersectObjects([
            ...this.parts.blockers,
            this.parts.ground
        ], true)[0];
        if (hit) out.copy(hit.point);
        else this.raycaster.ray.at(30, out);
        return out;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/world.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createWorld",
    ()=>createWorld,
    "setWorldQuality",
    ()=>setWorldQuality,
    "terrainHeight",
    ()=>terrainHeight,
    "updateWorld",
    ()=>updateWorld
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
;
const COLORS = [
    '#4d7356',
    '#66855e',
    '#82956a',
    '#506c64',
    '#758b58'
];
const temp = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Object3D"]();
function seeded(n) {
    const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
}
function terrainHeight(x, z) {
    const meadowFade = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(Math.hypot(x * .72, z + 1) - 12, 0, 24);
    const hills = Math.max(0, Math.sin(x * .036 + 1.2) * Math.cos(z * .029) + Math.sin(z * .052) * .28);
    const rolling = hills * 3.2 + Math.sin(x * .09) * Math.cos(z * .07) * .26;
    return rolling * meadowFade;
}
function makeRibbon(points, widths, material) {
    const vertices = [];
    const indices = [];
    points.forEach((point, index)=>{
        const before = points[Math.max(0, index - 1)];
        const after = points[Math.min(points.length - 1, index + 1)];
        const tangent = after.clone().sub(before).normalize();
        const side = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-tangent.z, 0, tangent.x).multiplyScalar(widths[index] / 2);
        const left = point.clone().add(side);
        const right = point.clone().sub(side);
        left.y = terrainHeight(left.x, left.z) + .035;
        right.y = terrainHeight(right.x, right.z) + .035;
        vertices.push(left.x, left.y, left.z, right.x, right.y, right.z);
        if (index < points.length - 1) {
            const i = index * 2;
            indices.push(i, i + 1, i + 2, i + 1, i + 3, i + 2);
        }
    });
    const geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    geometry.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](geometry, material);
}
function makeLandmark(scene) {
    const group = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    group.name = 'hero-marker';
    group.position.set(0, terrainHeight(0, -12), -12);
    const stone = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#aaa58f',
        roughness: .88
    });
    const shadowStone = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#696f66',
        roughness: .94
    });
    const gold = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#d8c38e',
        roughness: .46,
        metalness: .28,
        emissive: '#685532',
        emissiveIntensity: .18
    });
    const base = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](2.1, 2.32, .42, 12), shadowStone);
    base.position.y = .2;
    base.receiveShadow = true;
    group.add(base);
    const step = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](1.7, 1.9, .2, 12), stone);
    step.position.y = .49;
    step.castShadow = true;
    group.add(step);
    const shaft = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](1.15, 3.5, .65), stone);
    shaft.position.set(0, 2.32, 0);
    shaft.rotation.z = -.045;
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    group.add(shaft);
    const bevel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](1.42, .16, .82), shadowStone);
    bevel.position.y = 4.05;
    bevel.castShadow = true;
    group.add(bevel);
    const crown = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](.82, .72, 4), stone);
    crown.position.y = 4.47;
    crown.rotation.y = Math.PI / 4;
    crown.castShadow = true;
    group.add(crown);
    const medallion = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](.31, .045, 10, 36), gold);
    medallion.position.set(0, 2.55, .36);
    group.add(medallion);
    const inset = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OctahedronGeometry"](.15, 0), gold);
    inset.position.set(0, 2.55, .42);
    group.add(inset);
    const rune = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    rune.name = 'marker-rune';
    rune.position.set(0, 2.55, .58);
    for(let i = 0; i < 5; i++){
        const fleck = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.035, 8, 6), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#f4dfaa'
        }));
        const a = i / 5 * Math.PI * 2;
        fleck.position.set(Math.cos(a) * .68, Math.sin(a) * .54, 0);
        rune.add(fleck);
    }
    group.add(rune);
    const stoneLight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"]('#d9c78e', .65, 8, 2);
    stoneLight.position.set(0, 2.8, 1.3);
    group.add(stoneLight);
    scene.add(group);
    return {
        group,
        rune
    };
}
function createWorld(scene) {
    const groundGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](260, 260, 150, 150);
    const positions = groundGeometry.attributes.position;
    for(let i = 0; i < positions.count; i++){
        const x = positions.getX(i), z = -positions.getY(i);
        positions.setZ(i, terrainHeight(x, z));
    }
    groundGeometry.computeVertexNormals();
    const groundMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#819171',
        roughness: 1,
        metalness: 0
    });
    const ground = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](groundGeometry, groundMaterial);
    ground.name = 'ground';
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const blockers = [];
    const colliders = [];
    const trunkGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](.18, .32, 1, 9, 1);
    const leafGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IcosahedronGeometry"](1, 2);
    const trunkMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#74543a',
        roughness: .94
    });
    const leafMaterials = COLORS.map((color)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            color,
            roughness: .91,
            flatShading: true
        }));
    const trunkCount = 62;
    const trunks = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](trunkGeometry, trunkMaterial, trunkCount);
    trunks.castShadow = true;
    trunks.receiveShadow = true;
    trunks.name = 'forest-trunks';
    const canopies = leafMaterials.map((material, index)=>{
        const mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](leafGeometry, material, trunkCount * 3);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `canopy-${index}`;
        scene.add(mesh);
        return mesh;
    });
    const canopyCounts = Array(canopies.length).fill(0);
    let treeIndex = 0;
    for(let i = 0; i < trunkCount; i++){
        const angle = seeded(i + 3) * Math.PI * 2;
        const radius = 18 + seeded(i + 90) * 48;
        const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
        if (Math.abs(x) < 12 && z > -22 && z < 12) continue;
        const scale = .78 + seeded(i + 14) * .74;
        const y = terrainHeight(x, z);
        temp.position.set(x, y + 2.05 * scale, z);
        temp.scale.set(scale, 4.1 * scale, scale);
        temp.rotation.y = seeded(i + 500) * Math.PI;
        temp.updateMatrix();
        trunks.setMatrixAt(treeIndex, temp.matrix);
        const crownShapes = [
            [
                0,
                3.2,
                0,
                1.22
            ],
            [
                -.72,
                3.68,
                .18,
                .97
            ],
            [
                .75,
                3.56,
                -.16,
                .94
            ]
        ];
        for(let layer = 0; layer < crownShapes.length; layer++){
            const [offsetX, offsetY, offsetZ, size] = crownShapes[layer];
            const crownScale = size * scale;
            temp.position.set(x + offsetX * scale, y + offsetY * scale, z + offsetZ * scale);
            temp.scale.set(crownScale, crownScale * 1.16, crownScale * .94);
            temp.rotation.set(0, seeded(i + layer * 19) * Math.PI * 2, 0);
            temp.updateMatrix();
            const colorIndex = (i + layer) % leafMaterials.length;
            canopies[colorIndex].setMatrixAt(canopyCounts[colorIndex]++, temp.matrix);
        }
        colliders.push({
            x,
            z,
            radius: .64 * scale
        });
        treeIndex++;
    }
    trunks.count = treeIndex;
    trunks.instanceMatrix.needsUpdate = true;
    scene.add(trunks);
    blockers.push(trunks);
    for(let i = 0; i < canopies.length; i++){
        canopies[i].count = canopyCounts[i];
        canopies[i].instanceMatrix.needsUpdate = true;
    }
    const rockGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DodecahedronGeometry"](1, 1);
    const rockMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#838477',
        roughness: .97,
        flatShading: true
    });
    const rocks = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](rockGeometry, rockMaterial, 46);
    rocks.castShadow = true;
    rocks.receiveShadow = true;
    rocks.name = 'field-stones';
    let rockCount = 0;
    for(let i = 0; i < 46; i++){
        const x = (seeded(300 + i) - .5) * 88, z = (seeded(500 + i) - .5) * 82;
        if (Math.abs(x) < 6 && z > -18 && z < 7) continue;
        const size = .32 + seeded(700 + i) * .9;
        temp.position.set(x, terrainHeight(x, z) + size * .38, z);
        temp.scale.set(size, size * .68, size * .82);
        temp.rotation.set(.1, seeded(900 + i) * 6, .13);
        temp.updateMatrix();
        rocks.setMatrixAt(rockCount++, temp.matrix);
        colliders.push({
            x,
            z,
            radius: size * .85
        });
    }
    rocks.count = rockCount;
    rocks.instanceMatrix.needsUpdate = true;
    scene.add(rocks);
    blockers.push(rocks);
    const grassGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    const grassVertices = [];
    const grassIndices = [];
    for(let blade = 0; blade < 4; blade++){
        const angle = blade * Math.PI / 4;
        const sideX = Math.cos(angle) * .035, sideZ = Math.sin(angle) * .035;
        const tipX = Math.cos(angle + .72) * .1, tipZ = Math.sin(angle + .72) * .1;
        const start = grassVertices.length / 3;
        grassVertices.push(-sideX, 0, -sideZ, sideX, 0, sideZ, tipX, .34 + blade % 2 * .08, tipZ);
        grassIndices.push(start, start + 1, start + 2);
    }
    grassGeometry.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](grassVertices, 3));
    grassGeometry.setIndex(grassIndices);
    grassGeometry.computeVertexNormals();
    const grassMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#829c68',
        roughness: .96,
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"],
        vertexColors: false
    });
    grassMaterial.onBeforeCompile = (shader)=>{
        shader.uniforms.uWindTime = {
            value: 0
        };
        shader.vertexShader = `uniform float uWindTime;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.x += sin(uWindTime + instanceMatrix[3].x * 0.17 + position.y * 2.0) * 0.12 * position.y;');
        grassMaterial.userData.windUniform = shader.uniforms.uWindTime;
    };
    grassMaterial.customProgramCacheKey = ()=>'aurora-grass-wind-v1';
    const grass = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](grassGeometry, grassMaterial, 950);
    grass.name = 'wind-grass';
    grass.castShadow = false;
    grass.receiveShadow = true;
    let grassCount = 0;
    for(let i = 0; i < 950; i++){
        const x = (seeded(1200 + i) - .5) * 44, z = (seeded(1600 + i) - .5) * 40;
        if (Math.abs(x) < 3.2 && z > -17 && z < 7 || Math.hypot(x, z + 12) < 2.8) continue;
        const scale = .62 + seeded(1900 + i) * .78;
        temp.position.set(x, terrainHeight(x, z), z);
        temp.scale.set(scale, scale, scale);
        temp.rotation.y = seeded(2200 + i) * Math.PI;
        temp.updateMatrix();
        grass.setMatrixAt(grassCount, temp.matrix);
        grass.setColorAt(grassCount, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](COLORS[i % COLORS.length]));
        grassCount++;
    }
    grass.count = grassCount;
    grass.userData.maxInstances = grassCount;
    grass.instanceMatrix.needsUpdate = true;
    if (grass.instanceColor) grass.instanceColor.needsUpdate = true;
    scene.add(grass);
    const motePositions = [];
    for(let i = 0; i < 74; i++)motePositions.push((seeded(3200 + i) - .5) * 54, 1.2 + seeded(3400 + i) * 4.2, (seeded(3600 + i) - .5) * 54);
    const moteGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    moteGeometry.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](motePositions, 3));
    const moteMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointsMaterial"]({
        color: '#e7d9a8',
        size: .085,
        transparent: true,
        opacity: .53,
        depthWrite: false,
        sizeAttenuation: true
    });
    moteMaterial.onBeforeCompile = (shader)=>{
        shader.uniforms.uMoteTime = {
            value: 0
        };
        shader.vertexShader = `uniform float uMoteTime;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.y += sin(uMoteTime * 0.65 + position.x * 0.29 + position.z * 0.2) * 0.16;');
        moteMaterial.userData.timeUniform = shader.uniforms.uMoteTime;
    };
    moteMaterial.customProgramCacheKey = ()=>'aurora-motes-v1';
    const motes = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Points"](moteGeometry, moteMaterial);
    motes.name = 'windborne-echoes';
    scene.add(motes);
    const flowerGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.055, 7, 6);
    const flowerMaterials = [
        '#e8d7a6',
        '#d89f98',
        '#e4e0c6'
    ].map((color)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color
        }));
    const flowers = flowerMaterials.map((material, i)=>{
        const mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](flowerGeometry, material, 75);
        mesh.name = `meadow-blooms-${i}`;
        let count = 0;
        for(let j = 0; j < 75; j++){
            const x = (seeded(2500 + j) - .5) * 24, z = (seeded(2700 + j) - .5) * 25;
            if (Math.abs(x) < 4 && z > -18 && z < 7 || j % 3 !== i) continue;
            temp.position.set(x, terrainHeight(x, z) + .3, z);
            const size = .65 + seeded(2900 + j) * .8;
            temp.scale.setScalar(size);
            temp.updateMatrix();
            mesh.setMatrixAt(count++, temp.matrix);
        }
        mesh.count = count;
        mesh.userData.maxInstances = count;
        mesh.instanceMatrix.needsUpdate = true;
        scene.add(mesh);
        return mesh;
    });
    const pathMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#a59471',
        roughness: 1,
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
    });
    const pathPoints = [];
    const widths = [];
    for(let i = 0; i <= 30; i++){
        const t = i / 30;
        const z = 10 - t * 31;
        const x = Math.sin(t * Math.PI * 1.15) * 1.5;
        pathPoints.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x, 0, z));
        widths.push(3.2 + Math.sin(t * Math.PI) * .45);
    }
    const path = makeRibbon(pathPoints, widths, pathMaterial);
    path.name = 'waystone-trail';
    path.receiveShadow = true;
    scene.add(path);
    const ruin = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    ruin.name = 'fallen-arch';
    ruin.position.set(-12, terrainHeight(-12, -21), -21);
    const ruinStone = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#888b7c',
        roughness: .92
    });
    const left = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](.65, 3.4, .7), ruinStone);
    left.position.set(-1.6, 1.7, 0);
    left.rotation.z = -.08;
    left.castShadow = true;
    ruin.add(left);
    const right = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](.65, 2.3, .7), ruinStone);
    right.position.set(1.6, 1.15, 0);
    right.rotation.z = .12;
    right.castShadow = true;
    ruin.add(right);
    const lintel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](4.1, .55, .8), ruinStone);
    lintel.position.set(0, 3.35, 0);
    lintel.rotation.z = .045;
    lintel.castShadow = true;
    ruin.add(lintel);
    const fallen = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](1.7, .4, .65), ruinStone);
    fallen.position.set(2.5, .2, 1.3);
    fallen.rotation.z = .23;
    fallen.castShadow = true;
    ruin.add(fallen);
    scene.add(ruin);
    blockers.push(ruin);
    colliders.push({
        x: -13.6,
        z: -21,
        radius: .65
    }, {
        x: -10.4,
        z: -21,
        radius: .65
    });
    const { group: landmark, rune } = makeLandmark(scene);
    blockers.push(landmark);
    colliders.push({
        x: 0,
        z: -12,
        radius: 2.05
    });
    scene.userData.environment = {
        grassMaterial,
        flowers,
        moteMaterial,
        grass,
        bloomMeshes: flowers
    };
    return {
        ground,
        blockers,
        colliders,
        rune
    };
}
function setWorldQuality(scene, quality) {
    const environment = scene.userData.environment;
    if (!environment) return;
    const grass = environment.grass;
    const blooms = environment.bloomMeshes;
    const grassMax = grass.userData.maxInstances;
    grass.count = quality === 'Baixa' ? Math.floor(grassMax * .35) : quality === 'Média' ? Math.floor(grassMax * .68) : grassMax;
    for (const bloom of blooms){
        const max = bloom.userData.maxInstances;
        if (max === undefined) bloom.userData.maxInstances = bloom.count;
        const count = bloom.userData.maxInstances * (quality === 'Baixa' ? .35 : quality === 'Média' ? .68 : 1);
        bloom.count = Math.floor(count);
    }
}
function updateWorld(parts, time) {
    parts.rune.rotation.z = Math.sin(time * .7) * .06;
    const env = parts.ground.parent?.userData.environment;
    const uniform = env?.grassMaterial?.userData.windUniform;
    if (uniform) uniform.value = time;
    const moteTime = env?.moteMaterial?.userData.timeUniform;
    if (moteTime) moteTime.value = time;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=src_components_game_0qa-_i5i7uajr._.js.map