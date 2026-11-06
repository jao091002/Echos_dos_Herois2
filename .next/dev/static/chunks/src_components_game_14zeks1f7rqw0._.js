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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$EffectComposer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/postprocessing/EffectComposer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$RenderPass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/postprocessing/RenderPass.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$UnrealBloomPass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$OutputPass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/postprocessing/OutputPass.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$combat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/combat.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$hero$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/hero.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$magic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/magic.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/progression.ts [app-client] (ecmascript)");
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
    const progressionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const uiOpenRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const modalFlagsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        help: false,
        quest: false,
        inventory: false,
        skills: false
    });
    const castSpellRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        "Game.useRef[castSpellRef]": ()=>{}
    }["Game.useRef[castSpellRef]"]);
    const castAbilityRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        "Game.useRef[castAbilityRef]": ()=>{}
    }["Game.useRef[castAbilityRef]"]);
    const interactRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        "Game.useRef[interactRef]": ()=>{}
    }["Game.useRef[interactRef]"]);
    const attackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        "Game.useRef[attackRef]": ()=>{}
    }["Game.useRef[attackRef]"]);
    const dodgeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        "Game.useRef[dodgeRef]": ()=>{}
    }["Game.useRef[dodgeRef]"]);
    const compassNeedleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const compassPinRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const touchKnobRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const aimReticleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
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
    const [dayLabel, setDayLabel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('06:00');
    const [help, setHelp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [questOpen, setQuestOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [inventoryOpen, setInventoryOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [skillsOpen, setSkillsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [paused, setPaused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [shiftLocked, setShiftLocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [quality, setQuality] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Média');
    const [sensitivity, setSensitivity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5);
    const [gameError, setGameError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [combatHud, setCombatHud] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        mana: 100,
        health: 100,
        alive: 7,
        shield: false,
        flying: false,
        blocks: 0,
        cooldowns: {
            zoltraak: 0,
            vollzanbel: 0,
            judradjim: 0,
            shield: 0,
            flight: 0
        }
    });
    const [progressionHud, setProgressionHud] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        level: 1,
        experience: 0,
        nextLevelXp: 100,
        skillPoints: 0,
        ranks: {
            damage: 0,
            size: 0,
            efficiency: 0
        },
        inventory: {
            echoFragment: 0,
            sentinelCore: 0,
            wolfPelt: 0,
            banditToken: 0,
            demonAsh: 0,
            moonFang: 0,
            ancientSigil: 0,
            demonHeart: 0
        }
    });
    uiOpenRef.current = help || questOpen || inventoryOpen || skillsOpen || paused;
    modalFlagsRef.current = {
        help,
        quest: questOpen,
        inventory: inventoryOpen,
        skills: skillsOpen
    };
    const releaseMouse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Game.useCallback[releaseMouse]": ()=>{
            if (typeof document !== 'undefined' && document.pointerLockElement) document.exitPointerLock();
            cameraRigRef.current?.setShiftLock(false);
            setShiftLocked(false);
        }
    }["Game.useCallback[releaseMouse]"], []);
    const toggleHelp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Game.useCallback[toggleHelp]": ()=>{
            releaseMouse();
            setHelp({
                "Game.useCallback[toggleHelp]": (value)=>!value
            }["Game.useCallback[toggleHelp]"]);
            setQuestOpen(false);
            setInventoryOpen(false);
            setSkillsOpen(false);
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
            setHelp(false);
            setInventoryOpen(false);
            setSkillsOpen(false);
        }
    }["Game.useCallback[toggleQuest]"], [
        releaseMouse
    ]);
    const toggleInventory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Game.useCallback[toggleInventory]": ()=>{
            releaseMouse();
            setInventoryOpen({
                "Game.useCallback[toggleInventory]": (value)=>!value
            }["Game.useCallback[toggleInventory]"]);
            setSkillsOpen(false);
            setHelp(false);
            setQuestOpen(false);
        }
    }["Game.useCallback[toggleInventory]"], [
        releaseMouse
    ]);
    const toggleSkills = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Game.useCallback[toggleSkills]": ()=>{
            releaseMouse();
            setSkillsOpen({
                "Game.useCallback[toggleSkills]": (value)=>!value
            }["Game.useCallback[toggleSkills]"]);
            setInventoryOpen(false);
            setHelp(false);
            setQuestOpen(false);
        }
    }["Game.useCallback[toggleSkills]"], [
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
            const composer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$EffectComposer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EffectComposer"](renderer);
            composer.addPass(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$RenderPass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RenderPass"](scene, camera));
            const bloom = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$UnrealBloomPass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UnrealBloomPass"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](1, 1), quality === 'Alta' ? .48 : .3, .26, .84);
            composer.addPass(bloom);
            composer.addPass(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$OutputPass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OutputPass"]());
            const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createWorld"])(scene);
            qualityTargetsRef.current = {
                scene,
                sun,
                composer,
                bloom
            };
            const hero = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$hero$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHero"])(scene);
            hero.root.rotation.y = Math.PI;
            hero.root.userData.facing = Math.PI;
            const motor = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$simulation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlayerMotor"](hero.root, world.colliders);
            const cameraRig = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$simulation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThirdPersonCamera"](camera, world);
            cameraRigRef.current = cameraRig;
            camera.position.set(0, 3.95, 9.5);
            camera.lookAt(0, 1.5, 2);
            const progression = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlayerProgression"]();
            progressionRef.current = progression;
            const ambient = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AmbientAudio"]();
            audioRef.current = ambient;
            const keys = new Set();
            const spellOrigin = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
            const spellAim = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
            const spellDirection = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
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
            let elapsed = 0, reticleHitUntil = 0;
            const combat = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$combat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CombatSystem"](scene, {
                "Game.useEffect": (amount)=>progression.recordExperience(amount)
            }["Game.useEffect"], {
                "Game.useEffect": (item)=>progression.addItem(item)
            }["Game.useEffect"], showHint);
            const magic = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$magic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MagicSystem"](scene, hero.root, combat, world.blockers, progression, {
                "Game.useEffect": ()=>{
                    reticleHitUntil = elapsed + .28;
                }
            }["Game.useEffect"]);
            let isNearMarker = false, markerRemembered = false, shiftLockActive = false, castUntil = 0, attackUntil = 0, dodgeUntil = 0, hitUntil = 0, landUntil = 0, lastHealth = combat.health, deathTimer = 0, hudTick = 0, cycleTick = 0;
            const castAbility = {
                "Game.useEffect.castAbility": (spell)=>{
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
                }
            }["Game.useEffect.castAbility"];
            const castSpell = {
                "Game.useEffect.castSpell": ()=>castAbility('zoltraak')
            }["Game.useEffect.castSpell"];
            const performAttack = {
                "Game.useEffect.performAttack": ()=>{
                    if (uiOpenRef.current || combat.health <= 0) return;
                    const facing = hero.root.userData.facing ?? hero.root.rotation.y;
                    const target = hero.root.position.clone().add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](Math.sin(facing), 0, Math.cos(facing)).multiplyScalar(2.15));
                    target.y += 1.2;
                    if (combat.damageAt(target, 1.25, 30) > 0) reticleHitUntil = elapsed + .28;
                    attackUntil = elapsed + .38;
                    ambient.start();
                    ambient.playCast();
                }
            }["Game.useEffect.performAttack"];
            attackRef.current = performAttack;
            dodgeRef.current = ({
                "Game.useEffect": ()=>{
                    if (!uiOpenRef.current && combat.health > 0) {
                        const side = Number(keys.has('d')) - Number(keys.has('a'));
                        motor.dodge(cameraRig.yaw, side);
                        dodgeUntil = elapsed + .42;
                    }
                }
            })["Game.useEffect"];
            castSpellRef.current = castSpell;
            castAbilityRef.current = castAbility;
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
                        'alt',
                        'escape',
                        'h',
                        'j',
                        'e',
                        'g',
                        'q',
                        '1',
                        '2',
                        'f',
                        'r',
                        'v',
                        'x',
                        'control',
                        ','
                    ].includes(key)) event.preventDefault();
                    if (event.repeat && [
                        'escape',
                        'h',
                        'j',
                        'e',
                        'g',
                        'q',
                        '1',
                        '2',
                        'f',
                        'r',
                        'x',
                        ' ',
                        ','
                    ].includes(key)) return;
                    if (key === 'escape') {
                        keys.clear();
                        if (modalFlagsRef.current.help || modalFlagsRef.current.quest || modalFlagsRef.current.inventory || modalFlagsRef.current.skills) {
                            setHelp(false);
                            setQuestOpen(false);
                            setInventoryOpen(false);
                            setSkillsOpen(false);
                        } else if (document.pointerLockElement === renderer.domElement) {
                            document.exitPointerLock();
                            setPaused(true);
                        } else setPaused({
                            "Game.useEffect.onKeyDown": (value)=>!value
                        }["Game.useEffect.onKeyDown"]);
                        return;
                    }
                    if (key === 'shift') {
                        if (!uiOpenRef.current && !event.repeat) {
                            if (shiftLockActive) {
                                shiftLockActive = false;
                                cameraRig.setShiftLock(false);
                                setShiftLocked(false);
                                if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
                            } else if (renderer.domElement.requestPointerLock) {
                                shiftLockActive = true;
                                cameraRig.setShiftLock(true);
                                setShiftLocked(true);
                                const request = renderer.domElement.requestPointerLock();
                                if (request && typeof request.catch === 'function') request.catch({
                                    "Game.useEffect.onKeyDown": ()=>{
                                        shiftLockActive = false;
                                        cameraRig.setShiftLock(false);
                                        setShiftLocked(false);
                                    }
                                }["Game.useEffect.onKeyDown"]);
                            }
                        }
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
                    if (key === 'e') {
                        toggleInventory();
                        return;
                    }
                    if (key === ',') {
                        toggleSkills();
                        return;
                    }
                    if (key === 'g' && isNearMarker && !uiOpenRef.current) {
                        interactMarker();
                        return;
                    }
                    if (key === 'q') {
                        castSpell();
                        return;
                    }
                    if (key === '1') {
                        castAbility('vollzanbel');
                        return;
                    }
                    if (key === '2') {
                        castAbility('judradjim');
                        return;
                    }
                    if (key === 'f') {
                        castAbility('shield');
                        return;
                    }
                    if (key === 'r') {
                        castAbility('flight');
                        return;
                    }
                    if (key === 'x') {
                        dodgeRef.current();
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
                        'alt',
                        'control',
                        'v'
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
                    shiftLockActive = false;
                    cameraRig.setShiftLock(false);
                    setShiftLocked(false);
                    setPaused(true);
                }
            }["Game.useEffect.onBlur"];
            const onVisibility = {
                "Game.useEffect.onVisibility": ()=>{
                    if (document.visibilityState === 'hidden') {
                        keys.clear();
                        shiftLockActive = false;
                        cameraRig.setShiftLock(false);
                        setShiftLocked(false);
                        setPaused(true);
                    }
                }
            }["Game.useEffect.onVisibility"];
            const onPointerLock = {
                "Game.useEffect.onPointerLock": ()=>{
                    dragging = document.pointerLockElement === renderer.domElement;
                    if (!dragging && shiftLockActive) {
                        shiftLockActive = false;
                        cameraRig.setShiftLock(false);
                        setShiftLocked(false);
                    }
                }
            }["Game.useEffect.onPointerLock"];
            const onPointerDown = {
                "Game.useEffect.onPointerDown": (event)=>{
                    if (uiOpenRef.current) return;
                    if (event.button === 2) {
                        performAttack();
                        return;
                    }
                    if (event.button !== 0) return;
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
                "Game.useEffect.onWheel": (event)=>{
                    event.preventDefault();
                    cameraRig.zoom(event.deltaY);
                }
            }["Game.useEffect.onWheel"];
            const onContext = {
                "Game.useEffect.onContext": (event)=>event.preventDefault()
            }["Game.useEffect.onContext"];
            const resize = {
                "Game.useEffect.resize": ()=>{
                    const width = host.clientWidth, height = host.clientHeight;
                    if (!width || !height) return;
                    renderer.setSize(width, height, false);
                    composer.setSize(width, height);
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
                passive: false
            });
            renderer.domElement.addEventListener('contextmenu', onContext);
            let frame = 0;
            const animate = {
                "Game.useEffect.animate": ()=>{
                    frame = requestAnimationFrame(animate);
                    const delta = Math.min(.05, clock.getDelta());
                    if (!uiOpenRef.current) {
                        elapsed += delta;
                        const wasGrounded = motor.grounded;
                        const forward = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0) + touchMoveRef.current.forward;
                        const side = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0) + touchMoveRef.current.side;
                        const moving = combat.health > 0 && motor.update(delta, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(forward, -1, 1), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(side, -1, 1), keys.has('alt') || touchSprintRef.current, keys.has(' ') || touchJumpRef.current, cameraRig.yaw, magic.flying, Number(keys.has(' ') || touchJumpRef.current) - Number(keys.has('control')), cameraRig.pitch);
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
                        const pose = combat.health <= 0 ? 'defeat' : elapsed < hitUntil ? 'hit' : elapsed < castUntil ? 'cast' : elapsed < attackUntil ? 'attack' : elapsed < dodgeUntil ? 'dodge' : elapsed < landUntil ? 'land' : keys.has('v') ? 'guard' : magic.flying ? 'fly' : !motor.grounded ? motor.verticalSpeed < -1 ? 'fall' : 'jump' : moving ? keys.has('alt') || touchSprintRef.current ? 'run' : 'walk' : 'idle';
                        hero.update(elapsed, delta, pose, Math.hypot(motor.velocity.x, motor.velocity.z));
                        magic.update(delta, elapsed);
                        combat.update(delta, elapsed, hero.root.position, {
                            "Game.useEffect.animate": (from, to)=>magic.blockProjectile(from, to)
                        }["Game.useEffect.animate"]);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateWorld"])(world, elapsed);
                        cycleTick += delta;
                        if (cycleTick >= 1) {
                            cycleTick = 0;
                            const cycle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDayCycle"])(scene, sun, sky, elapsed);
                            setDayLabel(cycle.label);
                        }
                        const distanceToMarker = Math.hypot(hero.root.position.x, hero.root.position.z + 12);
                        const near = distanceToMarker < 4.6;
                        if (near !== isNearMarker) {
                            isNearMarker = near;
                            setNearLandmark(near);
                        }
                        hudTick += delta;
                        if (hudTick > .16) {
                            hudTick = 0;
                            setCombatHud({
                                mana: Math.round(magic.mana),
                                health: combat.health,
                                alive: combat.alive,
                                shield: magic.shieldActive,
                                flying: magic.flying,
                                blocks: magic.blocks,
                                cooldowns: {
                                    zoltraak: magic.cooldown('zoltraak'),
                                    vollzanbel: magic.cooldown('vollzanbel'),
                                    judradjim: magic.cooldown('judradjim'),
                                    shield: magic.cooldown('shield'),
                                    flight: magic.cooldown('flight')
                                }
                            });
                            setProgressionHud(progression.snapshot());
                        }
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
                    combat.dispose();
                    ambient.dispose();
                    composer.dispose();
                    audioRef.current = null;
                    rendererRef.current = null;
                    qualityTargetsRef.current = null;
                    cameraRigRef.current = null;
                    progressionRef.current = null;
                    castSpellRef.current = ({
                        "Game.useEffect": ()=>{}
                    })["Game.useEffect"];
                    castAbilityRef.current = ({
                        "Game.useEffect": ()=>{}
                    })["Game.useEffect"];
                    interactRef.current = ({
                        "Game.useEffect": ()=>{}
                    })["Game.useEffect"];
                    attackRef.current = ({
                        "Game.useEffect": ()=>{}
                    })["Game.useEffect"];
                    dodgeRef.current = ({
                        "Game.useEffect": ()=>{}
                    })["Game.useEffect"];
                    const geometries = new Set(), materials = new Set(), textures = new Set(scene.userData.gameTextures ?? []);
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
                    textures.forEach({
                        "Game.useEffect": (texture)=>texture.dispose()
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
        setInventoryOpen(false);
        setSkillsOpen(false);
        setPaused(false);
    };
    const purchaseUpgrade = (id)=>{
        if (progressionRef.current?.upgrade(id)) setProgressionHud(progressionRef.current.snapshot());
    };
    const spellButton = (spell, key, label)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            className: `hotkey ${combatHud.cooldowns[spell] > 0 ? 'on-cooldown' : ''}`,
            title: `${label} · ${combatHud.cooldowns[spell] > 0 ? `recarga ${combatHud.cooldowns[spell].toFixed(1)} s` : 'pronto'}`,
            onClick: ()=>castAbilityRef.current(spell),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "slot",
                    children: key
                }, void 0, false, {
                    fileName: "[project]/src/components/game/Game.tsx",
                    lineNumber: 393,
                    columnNumber: 322
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "slot-label",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/src/components/game/Game.tsx",
                    lineNumber: 393,
                    columnNumber: 357
                }, this),
                combatHud.cooldowns[spell] > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                    className: "cooldown-label",
                    children: [
                        combatHud.cooldowns[spell].toFixed(1),
                        "s"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/Game.tsx",
                    lineNumber: 393,
                    columnNumber: 435
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/Game.tsx",
            lineNumber: 393,
            columnNumber: 71
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "game-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scene",
                ref: hostRef,
                "aria-label": "Mundo 3D explorável dos Campos da Aurora"
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 396,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "vignette"
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 397,
                columnNumber: 5
            }, this),
            !(help || questOpen || inventoryOpen || skillsOpen || paused) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: aimReticleRef,
                className: "aim-reticle",
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "aim-core"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 398,
                        columnNumber: 139
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "aim-tick aim-top"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 398,
                        columnNumber: 168
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "aim-tick aim-right"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 398,
                        columnNumber: 202
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "aim-tick aim-bottom"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 398,
                        columnNumber: 238
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "aim-tick aim-left"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 398,
                        columnNumber: 275
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 398,
                columnNumber: 71
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
                                lineNumber: 400,
                                columnNumber: 30
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "eyebrow",
                                        children: "UM MUNDO DEPOIS DO FIM"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 400,
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
                                                lineNumber: 400,
                                                columnNumber: 156
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 400,
                                        columnNumber: 123
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 400,
                                columnNumber: 65
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 400,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "region",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "region-dot"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 401,
                                columnNumber: 31
                            }, this),
                            status.area,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "region-sub",
                                children: "Oeste · Terras de Avel"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 401,
                                columnNumber: 75
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 401,
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
                                lineNumber: 402,
                                columnNumber: 36
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "icon-button",
                                onClick: toggleInventory,
                                "aria-label": "Inventário",
                                title: "Inventário (E)",
                                children: "E"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 402,
                                columnNumber: 208
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "icon-button",
                                onClick: toggleSkills,
                                "aria-label": "Árvore de habilidades",
                                title: "Habilidades (,)",
                                children: ","
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 402,
                                columnNumber: 323
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "icon-button",
                                onClick: toggleHelp,
                                "aria-label": "Ajuda",
                                title: "Controles",
                                children: "?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 402,
                                columnNumber: 447
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 402,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 399,
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
                                lineNumber: 404,
                                columnNumber: 67
                            }, this),
                            " MEMÓRIA ESQUECIDA"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 404,
                        columnNumber: 37
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "O Que Permanece"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 404,
                        columnNumber: 127
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Encontre o Marco do Herói e desperte o Eco que repousa nas pedras."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 404,
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
                            lineNumber: 404,
                            columnNumber: 256
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 404,
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
                                lineNumber: 404,
                                columnNumber: 380
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 404,
                        columnNumber: 319
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 404,
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
                                lineNumber: 405,
                                columnNumber: 60
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                ref: compassNeedleRef,
                                className: "compass-needle",
                                children: "◆"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 405,
                                columnNumber: 96
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                ref: compassPinRef,
                                className: "compass-pin",
                                children: "✦"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 405,
                                columnNumber: 160
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "compass-s",
                                children: "S"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 405,
                                columnNumber: 218
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 405,
                        columnNumber: 30
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "compass-label",
                        children: "CAMPOS DA AURORA"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 405,
                        columnNumber: 260
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 405,
                columnNumber: 5
            }, this),
            shiftLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shift-lock-indicator",
                children: [
                    "SHIFT LOCK ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "ATIVO"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 406,
                        columnNumber: 70
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 406,
                columnNumber: 21
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
                                lineNumber: 408,
                                columnNumber: 220
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                ref: touchKnobRef,
                                className: "touch-knob"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 408,
                                columnNumber: 260
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 408,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "touch-actions",
                        children: [
                            nearLandmark && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action touch-interact",
                                onClick: ()=>interactRef.current(),
                                children: "Eco · G"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 410,
                                columnNumber: 26
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: toggleInventory,
                                children: "Inventário"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 411,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: toggleSkills,
                                children: "Habilidades"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 412,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>attackRef.current(),
                                children: "Atacar"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 413,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>dodgeRef.current(),
                                children: "Esquiva"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 414,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>castSpellRef.current(),
                                children: "Zoltraak"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 415,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>castAbilityRef.current('vollzanbel'),
                                children: "Fogo"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 416,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>castAbilityRef.current('judradjim'),
                                children: "Raio"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 417,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>castAbilityRef.current('shield'),
                                children: "Escudo"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 418,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>castAbilityRef.current('flight'),
                                children: "Voo"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 419,
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
                                lineNumber: 420,
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
                                lineNumber: 421,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>setPaused(true),
                                children: "Menu"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 422,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 409,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 407,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bottom-left",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "player-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "portrait",
                                children: "✧"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 425,
                                columnNumber: 63
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "player-meta",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Chamado"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 425,
                                        columnNumber: 125
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Errante das Terras de Avel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 425,
                                        columnNumber: 149
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "resource-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "VIDA"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 425,
                                                columnNumber: 218
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "resource-track",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "health-fill",
                                                    style: {
                                                        width: `${combatHud.health}%`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 267
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 425,
                                                columnNumber: 235
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: combatHud.health
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 425,
                                                columnNumber: 344
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 425,
                                        columnNumber: 188
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "resource-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "MANA"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 425,
                                                columnNumber: 405
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "resource-track",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "mana-fill",
                                                    style: {
                                                        width: `${combatHud.mana}%`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 454
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 425,
                                                columnNumber: 422
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: combatHud.mana
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 425,
                                                columnNumber: 527
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 425,
                                        columnNumber: 375
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "xp-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "NV ",
                                                    progressionHud.level
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 425,
                                                columnNumber: 580
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "resource-track",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    style: {
                                                        width: `${Math.min(100, progressionHud.experience / progressionHud.nextLevelXp * 100)}%`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 650
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 425,
                                                columnNumber: 618
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: [
                                                    progressionHud.experience,
                                                    "/",
                                                    progressionHud.nextLevelXp
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 425,
                                                columnNumber: 762
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 425,
                                        columnNumber: 556
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 425,
                                columnNumber: 96
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "level",
                                children: [
                                    progressionHud.skillPoints,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        children: " pontos"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 425,
                                        columnNumber: 888
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 425,
                                columnNumber: 837
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 425,
                        columnNumber: 34
                    }, this),
                    (combatHud.shield || combatHud.flying) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "active-magic",
                        children: [
                            combatHud.shield ? 'ESCUDO ATIVO' : 'VOO ATIVO',
                            combatHud.blocks > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    " · ",
                                    combatHud.blocks,
                                    " bloqueios"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 425,
                                columnNumber: 1069
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 425,
                        columnNumber: 965
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 425,
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
                                children: "G"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 426,
                                columnNumber: 82
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Ouvir o Eco do marco"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 426,
                                columnNumber: 115
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 426,
                        columnNumber: 53
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hotbar",
                        children: [
                            spellButton('zoltraak', 'Q', 'Zoltraak'),
                            spellButton('vollzanbel', '1', 'Vollzanbel'),
                            spellButton('judradjim', '2', 'Judradjim'),
                            spellButton('shield', 'F', 'Escudo'),
                            spellButton('flight', 'R', 'Voo'),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "hotkey",
                                onClick: toggleQuest,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot",
                                        children: "J"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 426,
                                        columnNumber: 433
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot-label",
                                        children: "Jornada"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 426,
                                        columnNumber: 464
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 426,
                                columnNumber: 384
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
                                        lineNumber: 426,
                                        columnNumber: 564
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot-label",
                                        children: "Ajuda"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 426,
                                        columnNumber: 595
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 426,
                                columnNumber: 516
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 426,
                        columnNumber: 155
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 426,
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
                                lineNumber: 427,
                                columnNumber: 63
                            }, this),
                            " ",
                            dayLabel
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 427,
                        columnNumber: 35
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "weather",
                        children: "CAMPOS DA AURORA"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 427,
                        columnNumber: 94
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 427,
                columnNumber: 5
            }, this),
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "toast",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "✦"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 428,
                        columnNumber: 37
                    }, this),
                    hint
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 428,
                columnNumber: 14
            }, this),
            gameError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "game-error",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "O mundo não pôde ser carregado"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 429,
                        columnNumber: 47
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: gameError
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 429,
                        columnNumber: 94
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.location.reload(),
                        children: "Tentar novamente"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 429,
                        columnNumber: 118
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 429,
                columnNumber: 19
            }, this),
            (help || questOpen || inventoryOpen || skillsOpen || paused) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-backdrop",
                onClick: closeMenus,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `modal ${inventoryOpen || skillsOpen ? 'progression-modal' : ''}`,
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
                            lineNumber: 431,
                            columnNumber: 7
                        }, this),
                        paused ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "modal-kicker",
                                    children: "CAMPOS DA AURORA"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 432,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "A jornada repousa."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 432,
                                    columnNumber: 73
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "O Eco ainda aguarda. Ajuste a qualidade ou retome a exploração."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 432,
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
                                                    lineNumber: 432,
                                                    columnNumber: 307
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Média"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 432,
                                                    columnNumber: 329
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Alta"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 432,
                                                    columnNumber: 351
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 432,
                                            columnNumber: 221
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 432,
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
                                            lineNumber: 432,
                                            columnNumber: 465
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: sensitivity
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 432,
                                            columnNumber: 587
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 432,
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
                                            lineNumber: 432,
                                            columnNumber: 689
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 432,
                                    columnNumber: 621
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 432,
                            columnNumber: 17
                        }, this) : help ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "modal-kicker",
                                    children: "CAMINHOS DO VIAJANTE"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 433,
                                    columnNumber: 20
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Um passo de cada vez."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 433,
                                    columnNumber: 78
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Enfrente lobos, bandidos e demônios. A mira central indica o alvo; aproxime-se dos cristais para recolher XP e possíveis itens raros."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 433,
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
                                                    lineNumber: 433,
                                                    columnNumber: 284
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "A"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 296
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "S"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 308
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "D"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 320
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Mover"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 332
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 279
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Mouse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 361
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Olhar ao redor"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 377
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 356
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Roda"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 415
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Zoom da câmera"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 430
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 410
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Shift"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 468
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Alternar Shift Lock"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 484
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 463
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Alt"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 527
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Correr / voar rápido"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 541
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 522
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Espaço"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 585
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Pular / subir voando"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 602
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 580
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Ctrl"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 646
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Descer voando"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 661
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 641
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Q / Clique esq."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 698
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Zoltraak · 10 mana"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 724
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 693
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "1"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 766
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Vollzanbel · 34 mana"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 778
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 761
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 822
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Judradjim · 27 mana"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 834
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 817
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "F"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 877
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Escudo · 20 mana + manutenção"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 889
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 872
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "R"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 942
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Voo · 12 mana + manutenção"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 954
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 937
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Clique dir."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1004
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Ataque com o cajado"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1026
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 999
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "X"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1069
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Esquiva"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1081
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 1064
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "V"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1112
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Postura defensiva"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1124
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 1107
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "E"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1165
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Abrir inventário"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1177
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 1160
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: ","
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1217
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Árvore de habilidades"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1229
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 1212
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "G"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1274
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Ouvir o Marco"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1286
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 1269
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "J"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1323
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Diário de viagem"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1335
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 1318
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Esc"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1375
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Pausar e liberar cursor"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 1389
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 433,
                                            columnNumber: 1370
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 433,
                                    columnNumber: 248
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
                                            lineNumber: 433,
                                            columnNumber: 1507
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 433,
                                    columnNumber: 1437
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 433,
                            columnNumber: 18
                        }, this) : inventoryOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "modal-kicker",
                                    children: "PERTENCES DO VIAJANTE"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 434,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Inventário"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 434,
                                    columnNumber: 88
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Recolha os cristais de experiência e os itens deixados pelos inimigos."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 434,
                                    columnNumber: 107
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inventory-grid",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: "inventory-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "item-glyph",
                                                    children: "✧"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 434,
                                                    columnNumber: 252
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Fragmento de Eco"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/Game.tsx",
                                                            lineNumber: 434,
                                                            columnNumber: 294
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            children: "Resíduo de energia arcana"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/Game.tsx",
                                                            lineNumber: 434,
                                                            columnNumber: 327
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 434,
                                                    columnNumber: 289
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: progressionHud.inventory.echoFragment
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 434,
                                                    columnNumber: 373
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 434,
                                            columnNumber: 216
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: "inventory-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "item-glyph",
                                                    children: "◇"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 434,
                                                    columnNumber: 465
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Núcleo de sentinela"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/Game.tsx",
                                                            lineNumber: 434,
                                                            columnNumber: 507
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            children: "Material deixado pelos Ecos"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/Game.tsx",
                                                            lineNumber: 434,
                                                            columnNumber: 543
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 434,
                                                    columnNumber: 502
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: progressionHud.inventory.sentinelCore
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 434,
                                                    columnNumber: 591
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 434,
                                            columnNumber: 429
                                        }, this),
                                        Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOOT_INFO"]).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                                className: `inventory-item loot-${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOOT_INFO"][item].rarity.toLowerCase()}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "item-glyph",
                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOOT_INFO"][item].rarity === 'Épico' ? '✦' : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOOT_INFO"][item].rarity === 'Raro' ? '⬡' : '◇'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/Game.tsx",
                                                        lineNumber: 434,
                                                        columnNumber: 795
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOOT_INFO"][item].name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/game/Game.tsx",
                                                                lineNumber: 434,
                                                                columnNumber: 926
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                children: [
                                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOOT_INFO"][item].rarity,
                                                                    " · ",
                                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOOT_INFO"][item].source
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/game/Game.tsx",
                                                                lineNumber: 434,
                                                                columnNumber: 965
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/Game.tsx",
                                                        lineNumber: 434,
                                                        columnNumber: 921
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: progressionHud.inventory[item]
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/Game.tsx",
                                                        lineNumber: 434,
                                                        columnNumber: 1037
                                                    }, this)
                                                ]
                                            }, item, true, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 434,
                                                columnNumber: 701
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 434,
                                    columnNumber: 184
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inventory-footer",
                                    children: [
                                        "Nível ",
                                        progressionHud.level,
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "·"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 434,
                                            columnNumber: 1157
                                        }, this),
                                        " ",
                                        progressionHud.experience,
                                        "/",
                                        progressionHud.nextLevelXp,
                                        " XP ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "·"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 434,
                                            columnNumber: 1232
                                        }, this),
                                        " ",
                                        progressionHud.skillPoints,
                                        " pontos de habilidade"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 434,
                                    columnNumber: 1094
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "continue",
                                    onClick: closeMenus,
                                    children: [
                                        "VOLTAR À JORNADA ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 434,
                                            columnNumber: 1369
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 434,
                                    columnNumber: 1302
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 434,
                            columnNumber: 27
                        }, this) : skillsOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "modal-kicker",
                                    children: [
                                        "TALENTOS DO ECO · NÍVEL ",
                                        progressionHud.level
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 435,
                                    columnNumber: 26
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Árvore de habilidades"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 435,
                                    columnNumber: 110
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "Derrote Ecos para ganhar XP. Cada nível concede 1 ponto; melhorias podem chegar ao nível ",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAX_RANK"],
                                        "."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 435,
                                    columnNumber: 140
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "skill-points",
                                    children: [
                                        "PONTOS DISPONÍVEIS ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: progressionHud.skillPoints
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 435,
                                            columnNumber: 296
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 435,
                                    columnNumber: 247
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "upgrade-grid",
                                    children: [
                                        'damage',
                                        'size',
                                        'efficiency'
                                    ].map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: "upgrade-card",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "upgrade-heading",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: id === 'damage' ? '✦' : id === 'size' ? '⬡' : '◌'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/Game.tsx",
                                                            lineNumber: 435,
                                                            columnNumber: 514
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UPGRADE_INFO"][id].title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                                    lineNumber: 435,
                                                                    columnNumber: 583
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                    children: [
                                                                        "NÍVEL ",
                                                                        progressionHud.ranks[id],
                                                                        " / ",
                                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAX_RANK"]
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                                    lineNumber: 435,
                                                                    columnNumber: 624
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/game/Game.tsx",
                                                            lineNumber: 435,
                                                            columnNumber: 578
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 435,
                                                    columnNumber: 481
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UPGRADE_INFO"][id].description
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 435,
                                                    columnNumber: 696
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rank-track",
                                                    children: Array.from({
                                                        length: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAX_RANK"]
                                                    }, (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: index < progressionHud.ranks[id] ? 'filled' : ''
                                                        }, index, false, {
                                                            fileName: "[project]/src/components/game/Game.tsx",
                                                            lineNumber: 435,
                                                            columnNumber: 809
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 435,
                                                    columnNumber: 733
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "upgrade-button",
                                                    disabled: !progressionHud.skillPoints || progressionHud.ranks[id] >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAX_RANK"],
                                                    onClick: ()=>purchaseUpgrade(id),
                                                    children: progressionHud.ranks[id] >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAX_RANK"] ? 'NÍVEL MÁXIMO' : 'MELHORAR · 1 PONTO'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 435,
                                                    columnNumber: 895
                                                }, this)
                                            ]
                                        }, id, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 435,
                                            columnNumber: 438
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 435,
                                    columnNumber: 347
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "continue",
                                    onClick: closeMenus,
                                    children: [
                                        "VOLTAR À JORNADA ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 435,
                                            columnNumber: 1217
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 435,
                                    columnNumber: 1150
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 435,
                            columnNumber: 24
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "modal-kicker",
                                    children: "DIÁRIO DE VIAGEM · 01"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 436,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "O Que Permanece"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 436,
                                    columnNumber: 72
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Quase mil anos se passaram desde a derrota de Valkhor. A relva tomou os velhos caminhos, e os nomes dos heróis já não são lembrados."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 436,
                                    columnNumber: 96
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Um marco de pedra repousa além do prado, coberto de musgo. Talvez ainda guarde uma lembrança."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 436,
                                    columnNumber: 235
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "quest-objective",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "✦"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 436,
                                            columnNumber: 368
                                        }, this),
                                        status.discovered ? 'Memória do Marco do Herói despertada' : 'Encontre o Marco do Herói nos campos'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 436,
                                    columnNumber: 335
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 436,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/Game.tsx",
                    lineNumber: 430,
                    columnNumber: 123
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 430,
                columnNumber: 70
            }, this),
            paused && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pause-stamp",
                children: "PAUSADO"
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 438,
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
                        lineNumber: 439,
                        columnNumber: 42
                    }, this),
                    " PROTÓTIPO 0.2"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 439,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/Game.tsx",
        lineNumber: 395,
        columnNumber: 10
    }, this);
}
_s(Game, "q4EOAxPDpipCmHAR4k8Xt1c2zZk=");
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
"[project]/src/components/game/combat.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CombatSystem",
    ()=>CombatSystem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world.ts [app-client] (ecmascript)");
;
;
const TAU = Math.PI * 2;
const { clamp, damp, lerp, smoothstep } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"];
const fract = (x)=>x - Math.floor(x);
const PELVIS_Y = 1.1;
const POSE_FIELDS = [
    'lean',
    'twist',
    'roll',
    'drop',
    'push',
    'head',
    'headYaw',
    'jaw',
    'rX',
    'rZ',
    'rE',
    'lX',
    'lZ',
    'lE',
    'reach',
    'tail',
    'glow'
];
const newPose = ()=>({
        lean: 0,
        twist: 0,
        roll: 0,
        drop: 0,
        push: 0,
        head: 0,
        headYaw: 0,
        jaw: 0,
        rX: 0,
        rZ: 0,
        rE: 0,
        lX: 0,
        lZ: 0,
        lE: 0,
        reach: 0,
        tail: 0,
        glow: 0
    });
const clearPose = (p)=>{
    for (const f of POSE_FIELDS)p[f] = 0;
};
function ease(kind, u) {
    switch(kind){
        case 'in':
            return u * u * u;
        case 'out':
            return 1 - Math.pow(1 - u, 3);
        case 'back':
            {
                const c1 = 1.2, c3 = c1 + 1;
                return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
            }
        default:
            return u * u * (3 - 2 * u);
    }
}
function sampleKeys(keys, t, out) {
    t = clamp(t, 0, 1);
    let i = 0;
    while(i < keys.length - 2 && t > keys[i + 1].t)i++;
    const a = keys[i], b = keys[i + 1];
    const u = clamp((t - a.t) / Math.max(1e-4, b.t - a.t), 0, 1);
    const e = ease(b.ease ?? 'smooth', u);
    for (const f of POSE_FIELDS){
        const av = a[f] ?? 0, bv = b[f] ?? 0;
        out[f] = av + (bv - av) * e;
    }
}
// Arm convention: X negative = raise forward/up, E = elbow flexion, Z = outward.
// lean/head positive = forward/down. twist positive pulls the weapon-side shoulder back.
const ATTACKS = {
    bite: {
        id: 'bite',
        duration: .85,
        hitAt: .55,
        lunge: 1.05,
        lungeFrom: .34,
        lungeTo: .55,
        air: .3,
        damage: 1,
        aoe: false,
        arc: 'none',
        keys: [
            {
                t: 0
            },
            {
                t: .32,
                lean: -.1,
                drop: -.2,
                push: -.15,
                head: -.25,
                jaw: .2,
                tail: .5,
                glow: .7
            },
            {
                t: .5,
                lean: .28,
                drop: .02,
                push: .34,
                head: .5,
                jaw: 1,
                reach: 1,
                tail: -.3,
                glow: 1,
                ease: 'out'
            },
            {
                t: .58,
                lean: .32,
                push: .36,
                head: .6,
                jaw: 0,
                reach: .9,
                tail: -.3,
                glow: 1,
                ease: 'in'
            },
            {
                t: .8,
                lean: .1,
                push: .1,
                head: .15,
                reach: .2,
                jaw: .05
            },
            {
                t: 1
            }
        ]
    },
    overhead: {
        id: 'overhead',
        duration: 1.1,
        hitAt: .54,
        lunge: .5,
        lungeFrom: .4,
        lungeTo: .56,
        air: 0,
        damage: 1,
        aoe: false,
        arc: 'v',
        keys: [
            {
                t: 0
            },
            {
                t: .4,
                lean: -.22,
                drop: -.04,
                push: -.1,
                twist: .2,
                head: -.14,
                rX: -2.7,
                rE: 1,
                rZ: .2,
                lX: -.45,
                lE: .7,
                lZ: .35,
                glow: .6
            },
            {
                t: .54,
                lean: .4,
                drop: -.14,
                push: .2,
                twist: -.15,
                head: .22,
                rX: -.7,
                rE: .15,
                rZ: .05,
                lX: .3,
                lE: .5,
                lZ: .45,
                glow: 1,
                ease: 'in'
            },
            {
                t: .72,
                lean: .38,
                drop: -.13,
                push: .18,
                twist: -.15,
                head: .2,
                rX: -.65,
                rE: .2,
                rZ: .05,
                lX: .3,
                lE: .5,
                lZ: .4
            },
            {
                t: 1
            }
        ]
    },
    slash: {
        id: 'slash',
        duration: .95,
        hitAt: .5,
        lunge: .45,
        lungeFrom: .34,
        lungeTo: .5,
        air: 0,
        damage: 1,
        aoe: false,
        arc: 'h',
        keys: [
            {
                t: 0
            },
            {
                t: .34,
                lean: -.06,
                drop: -.1,
                push: -.12,
                twist: .85,
                roll: .12,
                head: -.05,
                headYaw: -.35,
                rX: -1,
                rE: .5,
                rZ: .15,
                lX: -.3,
                lE: .9,
                lZ: .4,
                glow: .6
            },
            {
                t: .5,
                lean: .2,
                drop: -.1,
                push: .18,
                twist: -.85,
                roll: -.1,
                head: .05,
                headYaw: .3,
                rX: -1.2,
                rE: .15,
                rZ: .1,
                lX: .2,
                lE: .3,
                lZ: .9,
                glow: 1,
                ease: 'out'
            },
            {
                t: .68,
                lean: .2,
                drop: -.1,
                push: .18,
                twist: -.8,
                roll: -.1,
                head: .05,
                headYaw: .3,
                rX: -1.2,
                rE: .2,
                rZ: .1,
                lX: .2,
                lE: .3,
                lZ: .8
            },
            {
                t: 1
            }
        ]
    },
    swipe: {
        id: 'swipe',
        duration: 1,
        hitAt: .5,
        lunge: .4,
        lungeFrom: .34,
        lungeTo: .5,
        air: 0,
        damage: 1,
        aoe: false,
        arc: 'h',
        keys: [
            {
                t: 0
            },
            {
                t: .36,
                lean: -.1,
                drop: -.1,
                push: -.1,
                twist: .55,
                roll: .08,
                head: -.06,
                headYaw: -.3,
                rX: -.8,
                rE: .6,
                rZ: .5,
                lX: -.5,
                lE: 1,
                lZ: .4,
                glow: 1
            },
            {
                t: .5,
                lean: .28,
                drop: -.1,
                push: .25,
                twist: -.6,
                roll: -.08,
                head: .1,
                headYaw: .25,
                rX: -1.2,
                rE: .1,
                rZ: .1,
                lX: -1,
                lE: .3,
                lZ: .1,
                glow: 1,
                ease: 'out'
            },
            {
                t: .7,
                lean: .25,
                drop: -.08,
                push: .22,
                twist: -.55,
                head: .08,
                headYaw: .2,
                rX: -1.1,
                rE: .15,
                rZ: .1,
                lX: -.9,
                lE: .3,
                lZ: .1
            },
            {
                t: 1
            }
        ]
    },
    slam: {
        id: 'slam',
        duration: 1.3,
        hitAt: .56,
        lunge: .25,
        lungeFrom: .46,
        lungeTo: .56,
        air: 0,
        damage: 1.35,
        aoe: true,
        arc: 'none',
        keys: [
            {
                t: 0
            },
            {
                t: .46,
                lean: -.32,
                drop: -.05,
                push: -.14,
                head: -.28,
                rX: -2.8,
                rE: .5,
                rZ: .35,
                lX: -2.8,
                lE: .5,
                lZ: .35,
                glow: 1
            },
            {
                t: .56,
                lean: .5,
                drop: -.22,
                push: .28,
                head: .3,
                rX: -.4,
                rE: .2,
                rZ: .1,
                lX: -.4,
                lE: .2,
                lZ: .1,
                glow: 1,
                ease: 'in'
            },
            {
                t: .76,
                lean: .46,
                drop: -.2,
                push: .26,
                head: .28,
                rX: -.4,
                rE: .2,
                rZ: .1,
                lX: -.4,
                lE: .2,
                lZ: .1
            },
            {
                t: 1
            }
        ]
    }
};
const FLINCH = [
    {
        t: 0
    },
    {
        t: .18,
        lean: -.3,
        drop: -.05,
        push: -.18,
        head: -.35,
        jaw: .5,
        rX: .5,
        lX: .5,
        rE: .5,
        lE: .5,
        rZ: .5,
        lZ: .5
    },
    {
        t: 1
    }
];
const SPAWNS = [
    {
        kind: 'wolf',
        x: -5.6,
        z: -23
    },
    {
        kind: 'wolf',
        x: 5.8,
        z: -29
    },
    {
        kind: 'wolf',
        x: 9,
        z: -39
    },
    {
        kind: 'bandit',
        x: -9,
        z: -36
    },
    {
        kind: 'bandit',
        x: 7.5,
        z: -44
    },
    {
        kind: 'demon',
        x: -2.5,
        z: -52
    },
    {
        kind: 'demon',
        x: 11,
        z: -60
    }
];
const MOB_STATS = {
    wolf: {
        hp: 72,
        xp: 28,
        speed: 3.2,
        range: 1.35,
        damage: 5,
        cadence: 1.8,
        radius: .8
    },
    bandit: {
        hp: 120,
        xp: 46,
        speed: 2.2,
        range: 2.1,
        damage: 9,
        cadence: 2.4,
        radius: .72
    },
    demon: {
        hp: 190,
        xp: 82,
        speed: 1.8,
        range: 2.35,
        damage: 14,
        cadence: 2.7,
        radius: 1.05
    }
};
// stride = foot travel per step (m), duty = fraction of the cycle a foot is planted, lift = swing height
const GAIT = {
    wolf: {
        stride: .95,
        duty: .58,
        lift: .17
    },
    bandit: {
        stride: .7,
        duty: .62,
        lift: .14
    },
    demon: {
        stride: .8,
        duty: .64,
        lift: .12
    }
};
const strideAmp = (g, speedN)=>g.stride * smoothstep(speedN, .06, .7) * (.85 + .15 * Math.min(speedN, 1.4));
const LOOT = {
    wolfPelt: {
        color: '#c3a77d'
    },
    banditToken: {
        color: '#d0ad65'
    },
    demonAsh: {
        color: '#a66a64'
    },
    moonFang: {
        color: '#b9d5ce'
    },
    ancientSigil: {
        color: '#d6ba83'
    },
    demonHeart: {
        color: '#ef6c63'
    }
};
const LOOT_NAMES = {
    moonFang: 'Presa lunar',
    ancientSigil: 'Selo ancestral',
    demonHeart: 'Coração demoníaco',
    wolfPelt: 'Pele de lobo',
    banditToken: 'Ficha de bandido',
    demonAsh: 'Cinza demoníaca'
};
function part(parent, geometry, material, position, scale = [
    1,
    1,
    1
], rotation = [
    0,
    0,
    0
]) {
    const mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](geometry, material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
}
function makeChain(segs, restX, o = {}) {
    return {
        segs,
        restX,
        restZ: restX.map(()=>0),
        x: restX.slice(),
        z: segs.map(()=>0),
        vx: segs.map(()=>0),
        vz: segs.map(()=>0),
        k: o.k ?? 40,
        c: o.c ?? 5,
        gainF: o.gainF ?? .06,
        gainS: o.gainS ?? -.04,
        wave: o.wave ?? .04,
        angle: o.angle ?? 0,
        lat: o.lat ?? 'z'
    };
}
/** Small instanced particle pool for hit sparks, dust and impact debris. */ class ParticlePool {
    count;
    mesh;
    material;
    items;
    cursor;
    active;
    dummy;
    color;
    constructor(geometry, count = 96){
        this.count = count;
        this.cursor = 0;
        this.active = 0;
        this.dummy = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Object3D"]();
        this.color = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]();
        this.material = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#ffffff',
            transparent: true,
            opacity: .92,
            depthWrite: false
        });
        this.mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](geometry, this.material, count);
        this.mesh.frustumCulled = false;
        this.mesh.name = 'combat-particles';
        this.items = Array.from({
            length: count
        }, ()=>({
                p: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](),
                v: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](),
                life: 0,
                max: 1,
                size: 1
            }));
        this.dummy.scale.setScalar(0);
        this.dummy.updateMatrix();
        for(let i = 0; i < count; i++){
            this.mesh.setMatrixAt(i, this.dummy.matrix);
            this.mesh.setColorAt(i, this.color.set('#ffffff'));
        }
    }
    emit(origin, color, n, speed, up, life, size) {
        this.color.set(color);
        for(let i = 0; i < n; i++){
            const index = this.cursor++ % this.count, it = this.items[index];
            const a = Math.random() * TAU, r = .35 + Math.random() * .65;
            it.p.copy(origin);
            it.v.set(Math.cos(a) * speed * r, up * (.5 + Math.random()), Math.sin(a) * speed * r);
            it.life = it.max = life * (.7 + Math.random() * .5);
            it.size = size * (.7 + Math.random() * .6);
            this.mesh.setColorAt(index, this.color);
        }
        this.active = this.count;
        if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
    }
    update(dt) {
        if (this.active <= 0) return;
        let alive = 0;
        for(let i = 0; i < this.count; i++){
            const it = this.items[i];
            if (it.life <= 0) continue;
            it.life -= dt;
            if (it.life <= 0) this.dummy.scale.setScalar(0);
            else {
                alive++;
                it.v.y -= 9 * dt;
                it.v.multiplyScalar(Math.exp(-1.6 * dt));
                it.p.addScaledVector(it.v, dt);
                const ground = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(it.p.x, it.p.z) + .04;
                if (it.p.y < ground) {
                    it.p.y = ground;
                    it.v.y *= -.3;
                    it.v.x *= .6;
                    it.v.z *= .6;
                }
                this.dummy.scale.setScalar(it.size * (it.life / it.max));
            }
            this.dummy.position.copy(it.p);
            this.dummy.rotation.set(it.life * 6, it.life * 4, 0);
            this.dummy.updateMatrix();
            this.mesh.setMatrixAt(i, this.dummy.matrix);
        }
        this.mesh.instanceMatrix.needsUpdate = true;
        this.active = alive;
    }
}
class CombatSystem {
    scene;
    onExperience;
    onItem;
    onPickup;
    targets;
    playerHealth;
    health;
    blocked;
    mobs;
    drops;
    root;
    dropRoot;
    geometries;
    materials;
    sphere;
    unitCapsule;
    cone;
    cylinder;
    taper;
    box;
    itemMaterial;
    xpMaterial;
    targetMaterial;
    gemGeometry;
    ringGeometry;
    arcGeometry;
    shockGeometry;
    particles;
    rings;
    ringCursor;
    fxRoot;
    tmpA;
    tmpB;
    flinchPose;
    constructor(scene, onExperience = ()=>{}, onItem = ()=>{}, onPickup = ()=>{}){
        this.scene = scene;
        this.onExperience = onExperience;
        this.onItem = onItem;
        this.onPickup = onPickup;
        this.targets = [];
        this.playerHealth = 100;
        this.health = 100;
        this.blocked = 0;
        this.mobs = [];
        this.drops = [];
        this.root = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        this.dropRoot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        this.geometries = [];
        this.materials = [];
        this.itemMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            color: '#e1d6a7',
            emissive: '#74633b',
            emissiveIntensity: .65,
            metalness: .18,
            roughness: .42
        });
        this.xpMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            color: '#b9dcc2',
            emissive: '#74a886',
            emissiveIntensity: 1.15,
            roughness: .3,
            metalness: .12
        });
        this.targetMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            transparent: true,
            opacity: 0,
            depthWrite: false
        });
        this.rings = [];
        this.ringCursor = 0;
        this.fxRoot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        this.tmpA = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.tmpB = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.flinchPose = newPose();
        this.root.name = 'hostile-mobs';
        scene.add(this.root);
        this.dropRoot.name = 'mob-drops';
        scene.add(this.dropRoot);
        this.fxRoot.name = 'mob-fx';
        scene.add(this.fxRoot);
        this.sphere = this.geometry(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](1, 18, 12));
        this.unitCapsule = this.geometry(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.5, 1, 6, 12)); // radius .5, total height 2
        this.cone = this.geometry(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](.17, .48, 10));
        this.cylinder = this.geometry(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](.11, .14, .62, 12));
        this.taper = this.geometry(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](.7, 1, 1, 12));
        this.box = this.geometry(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](1, 1, 1));
        this.gemGeometry = this.geometry(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OctahedronGeometry"](.2, 0));
        this.ringGeometry = this.geometry(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](.3, .018, 6, 24));
        this.arcGeometry = this.geometry(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RingGeometry"](.8, 1.3, 28, 1, -.85, 1.7));
        this.shockGeometry = this.geometry(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RingGeometry"](.86, 1, 40));
        this.materials.push(this.itemMaterial, this.xpMaterial, this.targetMaterial);
        this.particles = new ParticlePool(this.geometry(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OctahedronGeometry"](.07, 0)));
        this.materials.push(this.particles.material);
        this.fxRoot.add(this.particles.mesh);
        for(let i = 0; i < 5; i++){
            const material = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                color: '#ff8a5c',
                transparent: true,
                opacity: 0,
                side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"],
                depthWrite: false
            });
            this.materials.push(material);
            const mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.shockGeometry, material);
            mesh.rotation.x = -Math.PI / 2;
            mesh.visible = false;
            this.fxRoot.add(mesh);
            this.rings.push({
                mesh,
                material,
                age: 0,
                life: .55,
                size: 4
            });
        }
        for(let index = 0; index < SPAWNS.length; index++)this.mobs.push(this.createMob(SPAWNS[index], index));
    }
    get alive() {
        return this.mobs.filter((mob)=>mob.health > 0).length;
    }
    respawnPlayer() {
        this.health = this.playerHealth;
    }
    damageAt(point, radius, damage) {
        let count = 0;
        for (const mob of this.mobs){
            if (mob.health <= 0) continue;
            const stats = MOB_STATS[mob.kind];
            this.tmpA.set(mob.root.position.x, mob.root.position.y + (mob.kind === 'wolf' ? .7 : 1.15), mob.root.position.z);
            if (this.tmpA.distanceTo(point) > radius + stats.radius) continue;
            mob.health = Math.max(0, mob.health - damage);
            mob.hitFlash = .18;
            count++;
            const pushX = mob.root.position.x - point.x, pushZ = mob.root.position.z - point.z;
            const pushLength = Math.hypot(pushX, pushZ);
            if (pushLength > .001) {
                const force = 3.2 + Math.min(damage, 44) * .075;
                mob.knockback.x += pushX / pushLength * force;
                mob.knockback.z += pushZ / pushLength * force;
            } else {
                mob.knockback.x += Math.sin(mob.root.rotation.y) * 3.2;
                mob.knockback.z += Math.cos(mob.root.rotation.y) * 3.2;
            }
            mob.root.scale.setScalar(1.05);
            this.particles.emit(this.tmpA, mob.kind === 'demon' ? '#ff7a5a' : '#ffe2a8', 6 + Math.min(8, Math.floor(damage / 6)), 3.2, 1.8, .4, 1);
            if (mob.health === 0) this.defeat(mob);
            else this.reactToHit(mob, damage);
        }
        return count;
    }
    update(delta, elapsed, player, block) {
        const dt = Math.min(delta, .05);
        for (const mob of this.mobs){
            if (mob.health <= 0) {
                mob.respawnTimer -= dt;
                mob.deathAge += dt;
                this.animateDefeat(mob, dt, elapsed);
                if (mob.respawnTimer <= 0) this.respawn(mob, elapsed);
                continue;
            }
            this.updateMob(mob, dt, elapsed, player, block);
        }
        for(let index = this.drops.length - 1; index >= 0; index--){
            const drop = this.drops[index];
            drop.age += dt;
            if (drop.age > 120) {
                this.removeDrop(drop, index);
                continue;
            }
            drop.root.rotation.y += dt * 1.3;
            drop.root.position.y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(drop.root.position.x, drop.root.position.z) + .48 + Math.sin(drop.age * 3.5) * .12;
            if (Math.hypot(drop.root.position.x - player.x, drop.root.position.z - player.z) < 1.55) {
                if (drop.kind === 'experience') {
                    this.onExperience(drop.value);
                    this.onPickup(`+${drop.value} XP`);
                } else {
                    this.onItem(drop.kind);
                    this.onPickup(`Item encontrado: ${LOOT_NAMES[drop.kind]}`);
                }
                this.removeDrop(drop, index);
            }
        }
        this.particles.update(dt);
        for (const ring of this.rings){
            if (!ring.mesh.visible) continue;
            ring.age += dt;
            const u = ring.age / ring.life;
            if (u >= 1) {
                ring.mesh.visible = false;
                continue;
            }
            ring.mesh.scale.setScalar(lerp(.3, ring.size, 1 - Math.pow(1 - u, 3)));
            ring.material.opacity = (1 - u) * .7;
        }
    }
    dispose() {
        this.root.removeFromParent();
        this.dropRoot.removeFromParent();
        this.fxRoot.removeFromParent();
        this.particles.mesh.dispose();
        this.geometries.forEach((geometry)=>geometry.dispose());
        this.materials.forEach((material)=>material.dispose());
    }
    /* ------------------------------------------------------------------ *
   *  Per-mob simulation
   * ------------------------------------------------------------------ */ updateMob(mob, dt, elapsed, player, block) {
        const stats = MOB_STATS[mob.kind], root = mob.root, pos = root.position;
        const dx = player.x - pos.x, dz = player.z - pos.z;
        const distance = Math.hypot(dx, dz);
        if (distance < 24) mob.aggro = true;
        else if (distance > 34) mob.aggro = false;
        mob.alert = damp(mob.alert, mob.aggro ? 1 : 0, 4, dt);
        mob.attackTimer -= dt;
        mob.hitFlash = Math.max(0, mob.hitFlash - dt);
        mob.stagger = Math.max(0, mob.stagger - dt);
        mob.strafeTimer -= dt;
        if (mob.strafeTimer <= 0) {
            mob.strafeDir = Math.random() < .5 ? -1 : 1;
            mob.strafeTimer = 1.4 + Math.random() * 2;
        }
        root.scale.setScalar(damp(root.scale.x, 1, 18, dt));
        const def = mob.attack;
        if (def) mob.attackAge += dt;
        const progress = def ? mob.attackAge / def.duration : 0;
        // --- steering: face the goal with a committed (slow) turn during the strike window
        const homeDist = Math.hypot(mob.home.x - pos.x, mob.home.z - pos.z);
        const returning = !mob.aggro && homeDist > 1.2;
        const goalX = returning ? mob.home.x : player.x, goalZ = returning ? mob.home.z : player.z;
        const targetYaw = mob.aggro || returning ? Math.atan2(goalX - pos.x, goalZ - pos.z) : mob.homeYaw + Math.sin(elapsed * .25 + mob.phase) * .7;
        const angleDelta = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].euclideanModulo(targetYaw - root.rotation.y + Math.PI, TAU) - Math.PI;
        let turn = mob.kind === 'wolf' ? 8 : 5.5;
        if (def) turn = progress > .28 && progress < def.hitAt + .1 ? .6 : 2.4;
        else if (mob.stagger > 0) turn = 1.2;
        root.rotation.y += angleDelta * (1 - Math.exp(-dt * turn));
        mob.look = damp(mob.look, mob.aggro ? clamp(angleDelta * .8, -.9, .9) : 0, 6, dt);
        // --- locomotion intent (wolves circle their prey before committing)
        let want = 0, strafe = 0;
        if (!def && mob.stagger <= 0) {
            if (mob.aggro && distance > stats.range * .8) {
                want = stats.speed * (mob.kind === 'wolf' && distance > 9 ? 1.4 : 1);
                if (mob.kind === 'wolf' && distance < 4.8 && mob.attackTimer > .5) {
                    want *= .6;
                    strafe = mob.strafeDir * .75;
                }
            } else if (returning) want = stats.speed * .45;
        }
        if (Math.abs(angleDelta) > 1.2) want *= .35;
        mob.speed = damp(mob.speed, want, want > mob.speed ? 5 : 10, dt);
        const yaw = root.rotation.y, sy = Math.sin(yaw), cy = Math.cos(yaw);
        const kb = Math.hypot(mob.knockback.x, mob.knockback.z);
        let step = mob.speed * (1 - clamp(kb / 4, 0, .85));
        if (mob.aggro) step = Math.min(step, Math.max(0, distance - stats.range * .7) / Math.max(dt, 1e-3));
        pos.x += (sy * step + cy * strafe * step) * dt;
        pos.z += (cy * step - sy * strafe * step) * dt;
        pos.x += mob.knockback.x * dt;
        pos.z += mob.knockback.z * dt;
        mob.knockback.multiplyScalar(Math.exp(-5.5 * dt));
        // --- attack lunge (forward impulse + optional airborne arc)
        if (def && def.lunge > 0) {
            const span = def.lungeTo - def.lungeFrom;
            const u = clamp((progress - def.lungeFrom) / span, 0, 1), f = u * u * (3 - 2 * u);
            const move = Math.min(def.lunge * (f - mob.lungeU), Math.max(0, distance - .85));
            mob.lungeU = f;
            pos.x += sy * move;
            pos.z += cy * move;
            mob.air = def.air * Math.sin(clamp((progress - def.lungeFrom) / (span + .1), 0, 1) * Math.PI);
        } else mob.air = damp(mob.air, 0, 12, dt);
        // --- soft separation so packs do not stack into each other
        for (const other of this.mobs){
            if (other === mob || other.health <= 0) continue;
            const ox = pos.x - other.root.position.x, oz = pos.z - other.root.position.z;
            const min = (stats.radius + MOB_STATS[other.kind].radius) * .55, d2 = ox * ox + oz * oz;
            if (d2 < min * min && d2 > 1e-6) {
                const d = Math.sqrt(d2), push = (min - d) * .5;
                pos.x += ox / d * push;
                pos.z += oz / d * push;
            }
        }
        // --- terrain follow + body tilt to the slope
        pos.y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(pos.x, pos.z) + mob.air;
        const hF = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(pos.x + sy * .7, pos.z + cy * .7), hB = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(pos.x - sy * .7, pos.z - cy * .7);
        mob.slope = damp(mob.slope, clamp(-Math.atan2(hF - hB, 1.4), -.4, .4) * (mob.kind === 'wolf' ? .9 : .35), 8, dt);
        root.rotation.x = mob.slope;
        // --- actual velocity (feeds cloth / tail / hair spring chains)
        const inv = 1 / Math.max(dt, 1e-3);
        mob.vel.x = damp(mob.vel.x, (pos.x - mob.prev.x) * inv, 12, dt);
        mob.vel.y = damp(mob.vel.y, (pos.z - mob.prev.y) * inv, 12, dt);
        mob.prev.set(pos.x, pos.z);
        mob.vf = mob.vel.x * sy + mob.vel.y * cy;
        mob.vs = mob.vel.x * cy - mob.vel.y * sy;
        // --- gait phase advances with ground speed so planted feet do not slide
        const g = GAIT[mob.kind], speedN = mob.speed / stats.speed, amp = strideAmp(g, speedN);
        if (amp > .05 && mob.speed > .05) mob.gait += Math.min(mob.speed * g.duty / amp, 3.4) * dt;
        // --- attack state machine
        mob.guard = damp(mob.guard, mob.aggro && !def && mob.stagger <= 0 ? 1 : 0, 6, dt);
        if (!def) {
            if (mob.aggro && distance <= stats.range && mob.attackTimer <= 0 && mob.stagger <= .05 && Math.abs(angleDelta) < .55) this.beginAttack(mob);
        } else {
            if (!mob.attackHit && progress >= def.hitAt) {
                mob.attackHit = true;
                this.resolveStrike(mob, def, player, block);
            }
            if (progress >= 1) {
                mob.attack = null;
                mob.attackAge = 0;
            }
        }
        this.updateArc(mob, progress);
        // --- pose = attack keys (or neutral) + additive hit flinch
        const pose = mob.pose;
        if (mob.attack) sampleKeys(mob.attack.keys, mob.attackAge / mob.attack.duration, pose);
        else clearPose(pose);
        if (mob.stagger > 0) {
            sampleKeys(FLINCH, 1 - mob.stagger / mob.staggerMax, this.flinchPose);
            for (const f of POSE_FIELDS)pose[f] += this.flinchPose[f] * mob.staggerPower;
        }
        if (mob.kind === 'wolf') this.applyWolf(mob, pose, elapsed, dt);
        else this.applyHumanoid(mob, pose, elapsed, dt);
        this.updateMaterials(mob, 0);
    }
    beginAttack(mob) {
        const stats = MOB_STATS[mob.kind];
        const id = mob.kind === 'wolf' ? 'bite' : mob.kind === 'bandit' ? Math.random() < .5 ? 'overhead' : 'slash' : Math.random() < .35 ? 'slam' : 'swipe';
        const def = ATTACKS[id];
        mob.attack = def;
        mob.attackAge = 0;
        mob.attackHit = false;
        mob.lungeU = 0;
        mob.attackTimer = stats.cadence * (.85 + Math.random() * .3);
        const arc = mob.arc;
        if (arc) {
            if (def.arc === 'h') {
                arc.ring.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
                arc.axis = 'y';
                arc.from = .95;
                arc.to = -.95;
                arc.pivot.position.set(0, 1.25, .1);
            } else if (def.arc === 'v') {
                arc.ring.rotation.set(0, Math.PI / 2, 0);
                arc.axis = 'x';
                arc.from = .8;
                arc.to = -2.4;
                arc.pivot.position.set(0, 1.35, .25);
            }
        }
    }
    resolveStrike(mob, def, player, block) {
        const stats = MOB_STATS[mob.kind], root = mob.root;
        const dx = player.x - root.position.x, dz = player.z - root.position.z;
        const dist = Math.hypot(dx, dz);
        const facing = dist > .001 ? (Math.sin(root.rotation.y) * dx + Math.cos(root.rotation.y) * dz) / dist : 1;
        const range = def.aoe ? stats.range + .9 : stats.range + .35;
        if (def.aoe) {
            this.tmpA.set(root.position.x + Math.sin(root.rotation.y) * 1.2, root.position.y, root.position.z + Math.cos(root.rotation.y) * 1.2);
            this.shock(this.tmpA, '#ff8a5c', range * 2.2);
            this.particles.emit(this.tmpA, '#b9a98a', 16, 3.4, 1.6, .7, 1.7);
        }
        if (dist > range || !def.aoe && facing < .25) return;
        this.tmpA.set(player.x, player.y + .9, player.z);
        this.tmpB.set(root.position.x, root.position.y + 1, root.position.z);
        if (block(this.tmpA, this.tmpB)) return;
        this.health = Math.max(0, this.health - stats.damage * def.damage);
        this.tmpA.set(player.x, player.y + 1, player.z);
        this.particles.emit(this.tmpA, '#ff6a4a', 10, 3.5, 2, .45, 1);
    }
    reactToHit(mob, damage) {
        const stats = MOB_STATS[mob.kind];
        const heavy = damage >= stats.hp * .12;
        mob.staggerMax = heavy ? .5 : .24;
        mob.stagger = mob.staggerMax;
        mob.staggerPower = heavy ? 1 : .55;
        // heavy hits interrupt the wind-up (but never the strike itself)
        if (heavy && mob.attack && mob.attackAge / mob.attack.duration < mob.attack.hitAt - .06) {
            mob.attack = null;
            mob.attackAge = 0;
            mob.attackTimer = Math.max(mob.attackTimer, .6);
        }
    }
    updateArc(mob, progress) {
        const arc = mob.arc, def = mob.attack;
        if (!arc) return;
        if (!def || def.arc === 'none') {
            arc.pivot.visible = false;
            return;
        }
        const u = clamp((progress - (def.hitAt - .14)) / .32, 0, 1);
        const visible = progress >= def.hitAt - .14 && u < 1;
        arc.pivot.visible = visible;
        if (!visible) return;
        const ang = lerp(arc.from, arc.to, 1 - Math.pow(1 - u, 2));
        arc.pivot.rotation.set(arc.axis === 'x' ? ang : 0, arc.axis === 'y' ? ang : 0, 0);
        arc.material.opacity = Math.sin(u * Math.PI) * .6;
    }
    updateMaterials(mob, fade) {
        const flash = mob.hitFlash;
        if (flash > 0 || mob.flashing) {
            for (const e of mob.mats)e.m.emissiveIntensity = e.base + flash * 2.5;
            mob.flashing = flash > 0;
        }
        const glow = mob.pose.glow * 1.1;
        for (const e of mob.eyes)e.m.emissiveIntensity = e.base * (1 - fade * .9) + glow * (1 - fade);
    }
    /* ------------------------------------------------------------------ *
   *  Procedural rigs
   * ------------------------------------------------------------------ */ stepChain(c, dt, fwd, side, phase, offsetX = 0) {
        for(let i = 0; i < c.segs.length; i++){
            const k = c.k * (1 - i * .1), depth = 1 + i * .35;
            const tx = c.restX[i] + (i === 0 ? offsetX : 0) + c.gainF * fwd * depth + Math.sin(phase + i * .9) * c.wave * depth;
            const tz = c.restZ[i] + c.gainS * side * depth + Math.cos(phase * .8 + i * 1.3) * c.wave * .6 * depth;
            c.vx[i] += (k * (tx - c.x[i]) - c.c * c.vx[i]) * dt;
            c.vz[i] += (k * (tz - c.z[i]) - c.c * c.vz[i]) * dt;
            c.x[i] += c.vx[i] * dt;
            c.z[i] += c.vz[i] * dt;
            c.segs[i].rotation.x = c.x[i];
            if (c.lat === 'y') c.segs[i].rotation.y = c.z[i];
            else c.segs[i].rotation.z = c.z[i];
        }
    }
    /** Two-bone IK in the sagittal plane. Targets are expressed in root space (z forward, y up from the ground). */ solveLeg(leg, py, pz, pitch, parentPitch, footZ, footY, footPitch) {
        const c = Math.cos(pitch), s = Math.sin(pitch);
        const hipY = py + leg.hy * c - leg.hz * s, hipZ = pz + leg.hy * s + leg.hz * c;
        let dz = footZ - hipZ, dy = footY - hipY, d = Math.hypot(dz, dy);
        const maxD = leg.l1 + leg.l2 - .003, minD = Math.abs(leg.l1 - leg.l2) + .03;
        if (d > maxD) {
            const k = maxD / d;
            dz *= k;
            dy *= k;
            d = maxD;
        } else if (d < minD) {
            const k = minD / Math.max(d, 1e-4);
            dz *= k;
            dy *= k;
            d = minD;
        }
        const beta = Math.atan2(dz, -dy);
        const a = Math.acos(clamp((leg.l1 * leg.l1 + d * d - leg.l2 * leg.l2) / (2 * leg.l1 * d), -1, 1));
        const cc = Math.acos(clamp((leg.l2 * leg.l2 + d * d - leg.l1 * leg.l1) / (2 * leg.l2 * d), -1, 1));
        const a1 = beta + leg.bend * a, a2 = beta - leg.bend * cc;
        leg.hip.rotation.x = -a1 - pitch - parentPitch;
        leg.knee.rotation.x = -(a2 - a1);
        leg.ankle.rotation.x = a2 + footPitch;
    }
    footCycle(mob, leg, amp, g) {
        const ph = fract(mob.gait + leg.phase);
        let stepZ = 0, lift = 0, toeOff = 0;
        if (amp > .01) {
            if (ph < g.duty) {
                const s = ph / g.duty;
                stepZ = amp * (.5 - s);
                toeOff = smoothstep(s, .75, 1);
            } else {
                const s = (ph - g.duty) / (1 - g.duty), e = s * s * (3 - 2 * s);
                stepZ = amp * (-.5 + e);
                lift = Math.sin(s * Math.PI) * g.lift * clamp(amp / g.stride, .3, 1.2);
            }
        }
        return {
            stepZ,
            lift,
            toeOff
        };
    }
    applyWolf(mob, p, t, dt) {
        const r = mob.rig, g = GAIT.wolf, neck = r.neck, jaw = r.jaw;
        const speedN = clamp(mob.speed / MOB_STATS.wolf.speed, 0, 1.5);
        const amp = strideAmp(g, speedN), w = smoothstep(speedN, .05, .6);
        const c = mob.gait * TAU, alert = mob.alert;
        const breath = Math.sin(t * 2.4 + mob.phase);
        const bob = Math.cos(c * 2) * .03 * w, pitchOsc = Math.sin(c * 2 + .8) * .028 * w, sway = Math.sin(c) * w;
        r.pelvis.position.set(0, .82 + bob + p.drop - alert * .035 + breath * .004, -.08 + p.push);
        r.pelvis.rotation.set(p.lean + pitchOsc + alert * .03, sway * .06, sway * .03 + p.roll);
        r.chest.rotation.set(-pitchOsc * 1.3 - p.lean * .3, -sway * .1 + p.twist * .4, -sway * .03);
        neck.rotation.set(-alert * .1 + p.head * .5 - .04 + breath * .01, mob.look * .5, 0);
        r.head.rotation.set(.1 + p.head * .55 - (r.pelvis.rotation.x + r.chest.rotation.x + neck.rotation.x) * .55, mob.look * .5 + p.headYaw * .7 - r.chest.rotation.y * .5, 0);
        jaw.rotation.x = clamp(p.jaw * .85 + w * (.08 + Math.sin(t * 13) * .04) + alert * .05, 0, 1);
        for (const ear of r.ears){
            const flick = Math.max(0, Math.sin(t * 1.1 + mob.phase * 5 + ear.side) - .9) * 6;
            ear.group.rotation.set(-.12 - p.glow * .55 - flick * .3, 0, ear.side * (.24 + p.glow * .3 + alert * .1 + flick * .2));
        }
        if (r.breath) {
            const base = r.breath.userData.base;
            r.breath.scale.set(base.x * (1 + breath * .012), base.y * (1 + breath * .03 + alert * .01), base.z);
        }
        if (r.tail) this.stepChain(r.tail, dt, mob.vf, mob.vs, t * 4 + mob.phase, p.tail * .6 + alert * .2 - w * .15);
        for (const leg of r.legs){
            const { stepZ, lift, toeOff } = this.footCycle(mob, leg, amp, g);
            let footZ = leg.hz - .08 + stepZ, footY = leg.footY + lift;
            if (leg.front) {
                footZ += p.reach * .42;
                footY += p.reach * .24;
            } else {
                footZ -= p.reach * .26;
                footY += p.reach * .1;
            }
            this.solveLeg(leg, r.pelvis.position.y, r.pelvis.position.z, r.pelvis.rotation.x, leg.front ? r.chest.rotation.x : 0, footZ, footY, toeOff * .45 + p.reach * (leg.front ? .5 : .8));
        }
    }
    applyHumanoid(mob, p, t, dt) {
        const r = mob.rig, kind = mob.kind, g = GAIT[kind], heavy = kind === 'demon' ? 1.12 : 1;
        const speedN = clamp(mob.speed / MOB_STATS[kind].speed, 0, 1.5);
        const amp = strideAmp(g, speedN), w = smoothstep(speedN, .05, .6);
        const c = mob.gait * TAU, alert = mob.alert, guard = mob.guard;
        const breath = Math.sin(t * 2.1 + mob.phase), sway = Math.sin(c) * w;
        r.pelvis.position.set(sway * .028, PELVIS_Y - Math.cos(c * 2) * .04 * w * heavy + p.drop + breath * .006 - alert * .03, p.push);
        r.pelvis.rotation.set(.03 * w + p.lean * .3 + alert * .04, p.twist * .35 + sway * .1 * heavy, sway * .035 + p.roll * .4);
        r.chest.rotation.set(p.lean * .7 + w * .04 + breath * .01, p.twist * .65 - sway * .2 * heavy, -sway * .04 + p.roll * .6);
        r.head.rotation.set(p.head - (r.pelvis.rotation.x + r.chest.rotation.x) * .6 + .02 + Math.sin(t * 1.6 + mob.phase) * .02, mob.look * .7 + p.headYaw - (r.pelvis.rotation.y + r.chest.rotation.y) * .6, 0);
        if (r.breath) {
            const base = r.breath.userData.base;
            r.breath.scale.set(base.x * (1 + breath * .01), base.y, base.z * (1 + breath * .018));
        }
        for (const arm of r.arms){
            const left = arm.side < 0;
            const pX = left ? p.lX : p.rX, pZ = left ? p.lZ : p.rZ, pE = left ? p.lE : p.rE;
            const swing = Math.cos((mob.gait + arm.legPhase) * TAU) * (arm.weapon ? .2 : .45) * w * heavy;
            const guardX = (arm.weapon ? -.5 : -.3) * guard, idleSway = Math.sin(t * 1.7 + mob.phase + arm.side) * .02;
            arm.shoulder.rotation.set(-.06 + swing + pX + guardX + idleSway, 0, arm.side * (.1 + pZ));
            arm.elbow.rotation.x = -(.22 + pE + guard * .55 + w * .12);
            arm.wrist.rotation.x = arm.weapon ? -.45 : -.1;
        }
        for (const leg of r.legs){
            const { stepZ, lift, toeOff } = this.footCycle(mob, leg, amp, g);
            this.solveLeg(leg, r.pelvis.position.y, r.pelvis.position.z, r.pelvis.rotation.x, 0, .04 + stepZ, leg.footY + lift, toeOff * .4);
        }
        for (const chain of r.cloth){
            if (chain.segs.length === 1 && chain.angle !== 0) this.stepChain(chain, dt, mob.vf * Math.cos(chain.angle) + mob.vs * Math.sin(chain.angle), 0, t * 2 + chain.angle, 0);
            else this.stepChain(chain, dt, mob.vf, mob.vs, t * 2.2 + mob.phase, 0);
        }
        for (const chain of r.braids)this.stepChain(chain, dt, mob.vf, mob.vs, t * 2.6 + mob.phase, 0);
        if (r.tail) this.stepChain(r.tail, dt, mob.vf, mob.vs, t * 2.4 + mob.phase, p.glow * .1);
    }
    animateDefeat(mob, dt, elapsed) {
        const age = mob.deathAge;
        if (age > 3.1) {
            mob.root.visible = false;
            return;
        }
        const f = Math.min(1, age / .9), e = f * f * (3 - 2 * f), wolf = mob.kind === 'wolf';
        const p = mob.pose;
        clearPose(p);
        p.lean = (wolf ? .15 : .45) * e;
        p.drop = -(wolf ? .36 : .5) * e;
        p.head = .6 * e;
        p.jaw = .6 * e;
        p.rX = .45 * e;
        p.lX = .5 * e;
        p.rE = .2 * e;
        p.lE = .3 * e;
        p.rZ = .6 * e;
        p.lZ = .6 * e;
        p.tail = -.4 * e;
        mob.speed = 0;
        mob.alert = 0;
        mob.guard = 0;
        mob.look = 0;
        mob.vf = 0;
        mob.vs = 0;
        mob.root.rotation.z = mob.deathSide * e * 1.4;
        mob.root.scale.setScalar(Math.max(.001, 1 - smoothstep(age, 2.4, 3.1)));
        if (wolf) this.applyWolf(mob, p, elapsed, dt);
        else this.applyHumanoid(mob, p, elapsed, dt);
        this.updateMaterials(mob, e);
        if (mob.arc) mob.arc.pivot.visible = false;
    }
    /* ------------------------------------------------------------------ *
   *  Modeling
   * ------------------------------------------------------------------ */ geometry(geometry) {
        this.geometries.push(geometry);
        return geometry;
    }
    material(color, emissive = '#000000', emissiveIntensity = .03, roughness = .82) {
        const material = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            color,
            emissive: emissive === '#000000' ? color : emissive,
            emissiveIntensity: emissive === '#000000' ? .72 : emissiveIntensity,
            roughness,
            flatShading: false
        });
        this.materials.push(material);
        return material;
    }
    /** Capsule limb: radius and TOTAL height are in meters (unit capsule is r=.5, h=2). */ limb(parent, material, center, radius, height, rotation = [
        0,
        0,
        0
    ]) {
        return part(parent, this.unitCapsule, material, center, [
            radius / .5,
            height / 2,
            radius / .5
        ], rotation);
    }
    eyePart(parent, material, position, scale) {
        const mesh = part(parent, this.sphere, material, position, scale);
        mesh.userData.eye = true;
        return mesh;
    }
    createMob(spawn, index) {
        const root = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        root.name = `${spawn.kind}-mob`;
        root.rotation.order = 'YXZ';
        root.position.set(spawn.x, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(spawn.x, spawn.z), spawn.z);
        this.root.add(root);
        const rig = spawn.kind === 'wolf' ? this.buildWolf(root) : this.buildHumanoid(root, spawn.kind);
        this.targets.push(rig.target);
        const seen = new Set(), mats = [], eyes = [];
        root.traverse((object)=>{
            if (!(object instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"])) return;
            const m = object.material;
            if (!(m instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]) || seen.has(m)) return;
            seen.add(m);
            (object.userData.eye ? eyes : mats).push({
                m,
                base: m.emissiveIntensity
            });
        });
        let arc = null;
        if (spawn.kind !== 'wolf') {
            const material = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                color: spawn.kind === 'demon' ? '#ff7aa8' : '#dfeaf0',
                transparent: true,
                opacity: 0,
                side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"],
                depthWrite: false,
                blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"]
            });
            this.materials.push(material);
            const pivot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            pivot.visible = false;
            pivot.position.set(0, 1.25, .1);
            root.add(pivot);
            const ring = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.arcGeometry, material);
            pivot.add(ring);
            arc = {
                pivot,
                ring,
                material,
                axis: 'y',
                from: 0,
                to: 0
            };
        }
        const stats = MOB_STATS[spawn.kind];
        return {
            kind: spawn.kind,
            root,
            rig,
            target: rig.target,
            health: stats.hp,
            phase: Math.random() * 6,
            attackTimer: 1 + Math.random() * 1.8,
            respawnTimer: 0,
            spawn: index,
            hitFlash: 0,
            flashing: false,
            attack: null,
            attackAge: 0,
            attackHit: false,
            lungeU: 0,
            air: 0,
            gait: Math.random(),
            speed: 0,
            alert: 0,
            guard: 0,
            aggro: false,
            look: 0,
            slope: 0,
            stagger: 0,
            staggerMax: .3,
            staggerPower: 1,
            deathAge: 0,
            deathSide: 1,
            knockback: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](),
            home: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](spawn.x, 0, spawn.z),
            homeYaw: 0,
            strafeDir: Math.random() < .5 ? -1 : 1,
            strafeTimer: 1 + Math.random() * 2,
            vel: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](),
            prev: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](spawn.x, spawn.z),
            vf: 0,
            vs: 0,
            pose: newPose(),
            mats,
            eyes,
            arc
        };
    }
    buildWolf(root) {
        const hide = this.material('#26272b');
        const fur = this.material('#77766d', '#000000', .025);
        const furDark = this.material('#55544e');
        const accent = this.material('#aaa395');
        const tongue = this.material('#c46d6d');
        const fang = this.material('#e8e2d0');
        const eye = this.material('#ddbd76', '#8c552a', 1.3, .25);
        const fill = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"]('#c5a16c', .28, 3.2, 2);
        fill.position.set(0, 1.15, .15);
        root.add(fill);
        const pelvis = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        pelvis.position.set(0, .82, -.08);
        root.add(pelvis);
        part(pelvis, this.sphere, fur, [
            0,
            .03,
            -.34
        ], [
            .44,
            .43,
            .46
        ]);
        part(pelvis, this.sphere, fur, [
            0,
            0,
            .02
        ], [
            .43,
            .4,
            .5
        ]);
        part(pelvis, this.sphere, accent, [
            0,
            -.15,
            .04
        ], [
            .3,
            .2,
            .5
        ]);
        part(pelvis, this.sphere, furDark, [
            0,
            .17,
            -.14
        ], [
            .32,
            .16,
            .6
        ]);
        for (const z of [
            -.42,
            -.2,
            .02
        ])part(pelvis, this.cone, furDark, [
            0,
            .2,
            z
        ], [
            .5,
            .55,
            .5
        ], [
            -.9,
            0,
            0
        ]);
        const chest = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        chest.position.set(0, .05, .4);
        pelvis.add(chest);
        const ribs = part(chest, this.sphere, fur, [
            0,
            .03,
            .06
        ], [
            .47,
            .48,
            .5
        ]);
        ribs.userData.base = ribs.scale.clone();
        part(chest, this.sphere, accent, [
            0,
            -.14,
            .12
        ], [
            .33,
            .3,
            .4
        ]);
        part(chest, this.sphere, furDark, [
            0,
            .22,
            0
        ], [
            .3,
            .18,
            .4
        ]);
        for (const side of [
            -1,
            1
        ])part(chest, this.sphere, fur, [
            side * .27,
            .27,
            -.02
        ], [
            .19,
            .22,
            .3
        ]);
        for (const z of [
            .1,
            .3
        ])part(chest, this.cone, furDark, [
            0,
            .3,
            z
        ], [
            .55,
            .65,
            .55
        ], [
            -.7,
            0,
            0
        ]);
        const neck = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        neck.position.set(0, .18, .36);
        chest.add(neck);
        this.limb(neck, fur, [
            0,
            .09,
            .235
        ], .2, .62, [
            1.21,
            0,
            0
        ]);
        part(neck, this.sphere, accent, [
            0,
            -.03,
            .28
        ], [
            .2,
            .2,
            .26
        ]);
        part(neck, this.sphere, furDark, [
            0,
            .14,
            .18
        ], [
            .17,
            .14,
            .3
        ]);
        const head = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        head.position.set(0, .17, .47);
        neck.add(head);
        part(head, this.sphere, fur, [
            0,
            .02,
            .04
        ], [
            .3,
            .28,
            .3
        ]);
        for (const side of [
            -1,
            1
        ])part(head, this.sphere, accent, [
            side * .15,
            -.05,
            .04
        ], [
            .13,
            .14,
            .2
        ]);
        part(head, this.sphere, accent, [
            0,
            -.04,
            .3
        ], [
            .15,
            .12,
            .26
        ]);
        part(head, this.sphere, furDark, [
            0,
            .05,
            .28
        ], [
            .11,
            .07,
            .26
        ]);
        part(head, this.sphere, hide, [
            0,
            -.005,
            .54
        ], [
            .07,
            .06,
            .065
        ]);
        const jaw = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        jaw.position.set(0, -.1, .1);
        head.add(jaw);
        part(jaw, this.sphere, accent, [
            0,
            -.025,
            .2
        ], [
            .11,
            .06,
            .24
        ]);
        part(jaw, this.sphere, tongue, [
            0,
            .005,
            .22
        ], [
            .06,
            .025,
            .15
        ]);
        const ears = [];
        for (const side of [
            -1,
            1
        ]){
            part(jaw, this.cone, fang, [
                side * .06,
                .04,
                .36
            ], [
                .22,
                .28,
                .22
            ]);
            part(head, this.cone, fang, [
                side * .07,
                -.1,
                .42
            ], [
                .24,
                .34,
                .24
            ], [
                Math.PI,
                0,
                0
            ]);
            const ear = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            ear.position.set(side * .14, .24, -.04);
            head.add(ear);
            ears.push({
                group: ear,
                side
            });
            part(ear, this.cone, fur, [
                0,
                .13,
                0
            ], [
                .62,
                .85,
                .5
            ]);
            part(ear, this.cone, tongue, [
                0,
                .12,
                .025
            ], [
                .36,
                .6,
                .3
            ]);
            part(head, this.sphere, hide, [
                side * .13,
                .07,
                .27
            ], [
                .06,
                .05,
                .05
            ]);
            this.eyePart(head, eye, [
                side * .13,
                .07,
                .31
            ], [
                .05,
                .045,
                .03
            ]);
            part(head, this.sphere, hide, [
                side * .13,
                .07,
                .335
            ], [
                .012,
                .034,
                .012
            ]);
        }
        const target = part(head, this.sphere, this.targetMaterial, [
            0,
            0,
            .2
        ], [
            .3,
            .26,
            .38
        ]);
        target.name = 'wolf-target';
        const tail = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        tail.position.set(0, .12, -.66);
        pelvis.add(tail);
        part(tail, this.sphere, fur, [
            0,
            0,
            -.12
        ], [
            .2,
            .2,
            .3
        ]);
        const t1 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        t1.position.set(0, 0, -.24);
        tail.add(t1);
        part(t1, this.sphere, fur, [
            0,
            0,
            -.12
        ], [
            .18,
            .18,
            .28
        ]);
        const t2 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        t2.position.set(0, 0, -.24);
        t1.add(t2);
        part(t2, this.sphere, accent, [
            0,
            0,
            -.12
        ], [
            .14,
            .14,
            .26
        ]);
        const tailChain = makeChain([
            tail,
            t1,
            t2
        ], [
            .5,
            -.2,
            -.25
        ], {
            k: 34,
            c: 4.5,
            gainF: .05,
            gainS: .03,
            wave: .12,
            lat: 'y'
        });
        const legs = [];
        const makeLeg = (parent, local, pelvisPos, front, side, phase)=>{
            const l1 = .36, l2 = front ? .4 : .38;
            const hip = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            hip.position.set(...local);
            parent.add(hip);
            const knee = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            knee.position.set(0, -l1, 0);
            hip.add(knee);
            const ankle = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            ankle.position.set(0, -l2, 0);
            knee.add(ankle);
            if (front) {
                part(hip, this.sphere, fur, [
                    0,
                    -.05,
                    -.01
                ], [
                    .16,
                    .2,
                    .2
                ]);
                this.limb(hip, fur, [
                    0,
                    -l1 / 2 + .02,
                    0
                ], .085, l1 + .1);
                this.limb(knee, fur, [
                    0,
                    -l2 / 2 + .02,
                    .01
                ], .062, l2 + .08);
                part(knee, this.sphere, furDark, [
                    0,
                    0,
                    -.04
                ], [
                    .08,
                    .08,
                    .09
                ]);
            } else {
                part(hip, this.sphere, fur, [
                    0,
                    -.09,
                    0
                ], [
                    .2,
                    .3,
                    .27
                ]);
                this.limb(hip, fur, [
                    0,
                    -l1 / 2 + .02,
                    0
                ], .08, l1 + .1);
                this.limb(knee, fur, [
                    0,
                    -l2 / 2 + .02,
                    -.02
                ], .055, l2 + .1, [
                    -.12,
                    0,
                    0
                ]);
                part(knee, this.sphere, furDark, [
                    0,
                    0,
                    .04
                ], [
                    .07,
                    .08,
                    .08
                ]);
            }
            part(ankle, this.sphere, hide, [
                0,
                -.03,
                .07
            ], [
                .095,
                .065,
                .15
            ]);
            for (const toe of [
                -1,
                0,
                1
            ])part(ankle, this.sphere, hide, [
                toe * .055,
                -.035,
                .19
            ], [
                .04,
                .04,
                .07
            ]);
            legs.push({
                hip,
                knee,
                ankle,
                hy: pelvisPos[1],
                hz: pelvisPos[2],
                l1,
                l2,
                bend: front ? -1 : 1,
                phase,
                front,
                side,
                footY: .09
            });
        };
        // trot: diagonal pairs move together
        for (const side of [
            -1,
            1
        ]){
            makeLeg(chest, [
                side * .27,
                -.06,
                .16
            ], [
                side * .27,
                -.01,
                .56
            ], true, side, side < 0 ? 0 : .5);
            makeLeg(pelvis, [
                side * .3,
                -.08,
                -.42
            ], [
                side * .3,
                -.08,
                -.42
            ], false, side, side < 0 ? .5 : 0);
        }
        return {
            pelvis,
            chest,
            neck,
            head,
            jaw,
            legs,
            arms: [],
            ears,
            tail: tailChain,
            braids: [],
            cloth: [],
            breath: ribs,
            target
        };
    }
    buildHumanoid(root, kind) {
        const demon = kind === 'demon';
        const hide = this.material('#26272b');
        const fur = this.material(demon ? '#522f32' : '#423a37', demon ? '#6b2022' : '#000000', demon ? .42 : .025);
        const accent = this.material(demon ? '#a14d3c' : '#756449', demon ? '#992f25' : '#000000', demon ? .4 : .025);
        const skin = this.material(demon ? '#782e2e' : '#a47e61', demon ? '#8c2824' : '#000000', demon ? .48 : .025);
        const eye = this.material(demon ? '#ff9b63' : '#ddbd76', demon ? '#ef3d2c' : '#8c552a', 1.3, .25);
        const gold = demon ? this.material('#d7b66d', '#74532b', .12, .42) : accent;
        const cloth = this.material(demon ? '#3b2230' : '#2e2a2d');
        const claw = this.material('#2b2427');
        const steel = this.material('#aab3b8', '#2a3034', .2, .3);
        steel.metalness = .6;
        const fill = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"](demon ? '#d24e43' : '#b39164', demon ? .55 : .28, demon ? 4.8 : 3.2, 2);
        fill.position.set(0, 1.15, .15);
        root.add(fill);
        const pelvis = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        pelvis.position.set(0, PELVIS_Y, 0);
        root.add(pelvis);
        const torso = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        torso.position.set(0, .06, 0);
        pelvis.add(torso);
        const head = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        head.position.set(0, .74, .02);
        torso.add(head);
        // ---- pelvis, belt, legs
        part(pelvis, this.sphere, demon ? skin : fur, [
            0,
            0,
            0
        ], demon ? [
            .38,
            .22,
            .28
        ] : [
            .36,
            .22,
            .26
        ]);
        part(pelvis, this.cylinder, gold, [
            0,
            .1,
            0
        ], demon ? [
            3.3,
            .16,
            2.6
        ] : [
            3,
            .16,
            2.3
        ]);
        if (!demon) {
            part(pelvis, this.box, gold, [
                0,
                .1,
                .33
            ], [
                .12,
                .1,
                .05
            ]);
            for (const side of [
                -1,
                1
            ])part(pelvis, this.box, hide, [
                side * .34,
                -.02,
                .06
            ], [
                .14,
                .18,
                .12
            ]);
        }
        const legs = [];
        for (const side of [
            -1,
            1
        ]){
            const l1 = .48, l2 = .52, legMat = demon ? skin : fur;
            const hip = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            hip.position.set(side * .2, -.04, 0);
            pelvis.add(hip);
            const knee = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            knee.position.set(0, -l1, 0);
            hip.add(knee);
            const ankle = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            ankle.position.set(0, -l2, 0);
            knee.add(ankle);
            this.limb(hip, legMat, [
                0,
                -.23,
                0
            ], demon ? .15 : .135, .62);
            this.limb(knee, legMat, [
                0,
                -.25,
                0
            ], demon ? .115 : .1, .6);
            part(knee, this.sphere, demon ? skin : accent, [
                0,
                0,
                .06
            ], [
                .11,
                .11,
                .09
            ]);
            if (!demon) part(knee, this.cylinder, accent, [
                0,
                -.34,
                0
            ], [
                1.15,
                .22,
                1.15
            ]);
            part(ankle, this.box, hide, [
                0,
                -.05,
                .08
            ], [
                .19,
                .13,
                .34
            ]);
            part(ankle, this.sphere, hide, [
                0,
                -.05,
                .26
            ], [
                .095,
                .065,
                .1
            ]);
            legs.push({
                hip,
                knee,
                ankle,
                hy: -.04,
                hz: 0,
                l1,
                l2,
                bend: 1,
                phase: side > 0 ? 0 : .5,
                front: false,
                side,
                footY: demon ? .13 : .12
            });
        }
        // ---- torso
        const chestMesh = this.limb(torso, demon ? skin : fur, [
            0,
            .02,
            0
        ], demon ? .44 : .38, 1.04);
        chestMesh.userData.base = chestMesh.scale.clone();
        part(torso, this.cylinder, skin, [
            0,
            .58,
            0
        ], [
            .9,
            .34,
            .9
        ]);
        part(torso, this.sphere, demon ? fur : accent, [
            0,
            -.34,
            -.02
        ], [
            .4,
            .2,
            .3
        ]);
        const cloth0 = [], braids = [];
        let tailChain = null;
        if (!demon) {
            part(torso, this.box, accent, [
                0,
                .12,
                .34
            ], [
                .8,
                .1,
                .07
            ], [
                0,
                0,
                -.35
            ]);
            part(torso, this.sphere, accent, [
                0,
                .55,
                .06
            ], [
                .3,
                .1,
                .26
            ]);
            for (const side of [
                -1,
                1
            ])part(torso, this.sphere, hide, [
                side * .5,
                .42,
                0
            ], side > 0 ? [
                .24,
                .14,
                .22
            ] : [
                .2,
                .12,
                .19
            ]);
            // hood, mask, eyes
            part(head, this.sphere, skin, [
                0,
                .02,
                0
            ], [
                .32,
                .36,
                .3
            ]);
            part(head, this.sphere, fur, [
                0,
                .09,
                -.07
            ], [
                .37,
                .39,
                .35
            ]);
            part(head, this.cone, fur, [
                0,
                .26,
                -.12
            ], [
                1.9,
                .9,
                1.6
            ], [
                -.5,
                0,
                0
            ]);
            part(head, this.box, hide, [
                0,
                -.11,
                .27
            ], [
                .5,
                .2,
                .07
            ]);
            for (const side of [
                -1,
                1
            ])this.eyePart(head, eye, [
                side * .12,
                .07,
                .285
            ], [
                .045,
                .035,
                .028
            ]);
            // cloak: three swaying plates
            const cloak = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            cloak.position.set(0, .5, -.32);
            torso.add(cloak);
            part(cloak, this.box, cloth, [
                0,
                -.2,
                0
            ], [
                .78,
                .42,
                .05
            ]);
            const c1 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            c1.position.set(0, -.4, 0);
            cloak.add(c1);
            part(c1, this.box, cloth, [
                0,
                -.2,
                0
            ], [
                .72,
                .4,
                .05
            ]);
            const c2 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            c2.position.set(0, -.4, 0);
            c1.add(c2);
            part(c2, this.box, cloth, [
                0,
                -.2,
                0
            ], [
                .62,
                .4,
                .05
            ]);
            part(c2, this.cone, cloth, [
                0,
                -.43,
                0
            ], [
                1.2,
                .35,
                .15
            ], [
                Math.PI,
                0,
                0
            ]);
            cloth0.push(makeChain([
                cloak,
                c1,
                c2
            ], [
                .1,
                .05,
                .05
            ], {
                k: 45,
                c: 6,
                gainF: .08,
                gainS: -.05,
                wave: .03
            }));
        } else {
            // ornaments, plate, glowing core, spikes
            part(torso, this.box, accent, [
                0,
                .08,
                .4
            ], [
                .5,
                .56,
                .1
            ]);
            part(torso, this.box, gold, [
                0,
                .09,
                .46
            ], [
                .045,
                .54,
                .025
            ]);
            this.eyePart(torso, eye, [
                0,
                .4,
                .38
            ], [
                .08,
                .09,
                .06
            ]);
            for (const z of [
                .28,
                .02,
                -.24
            ])part(torso, this.cone, hide, [
                0,
                z + .1,
                -.45
            ], [
                .9,
                1.6,
                .9
            ], [
                -1.1,
                0,
                0
            ]);
            for (const side of [
                -1,
                1
            ]){
                part(torso, this.sphere, gold, [
                    side * .4,
                    .4,
                    .05
                ], [
                    .1,
                    .1,
                    .08
                ]);
                part(torso, this.cone, gold, [
                    side * .46,
                    .3,
                    .07
                ], [
                    .28,
                    .18,
                    .22
                ], [
                    0,
                    0,
                    side * .3
                ]);
                part(torso, this.cone, hide, [
                    side * .66,
                    .52,
                    0
                ], [
                    .8,
                    1.3,
                    .8
                ], [
                    0,
                    0,
                    -side * 1.2
                ]);
            }
            // skull, hair, horns, face
            part(head, this.sphere, skin, [
                0,
                .02,
                0
            ], [
                .34,
                .4,
                .3
            ]);
            const hair = this.material('#ad4c91', '#612553', .16, .6), hairLight = this.material('#d76cb0', '#8b3975', .1, .54);
            const horn = this.material('#ded0ca', '#4b3037', .12, .34);
            part(head, this.sphere, hair, [
                0,
                .17,
                -.1
            ], [
                .39,
                .39,
                .36
            ]);
            part(head, this.sphere, hair, [
                0,
                -.12,
                -.22
            ], [
                .36,
                .56,
                .23
            ]);
            for (const side of [
                -1,
                1
            ]){
                const braid = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
                braid.position.set(side * .27, .08, -.03);
                head.add(braid);
                const segs = [
                    braid
                ];
                for(let i = 0; i < 3; i++){
                    const seg = i === 0 ? braid : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
                    if (i > 0) {
                        seg.position.set(0, -.27, 0);
                        segs[i - 1].add(seg);
                        segs.push(seg);
                    }
                    part(seg, this.sphere, hair, [
                        side * .02,
                        -.07,
                        -.04
                    ], [
                        .13 - i * .01,
                        .16,
                        .14
                    ]);
                    part(seg, this.sphere, hairLight, [
                        side * .02,
                        -.19,
                        -.02
                    ], [
                        .12 - i * .01,
                        .14,
                        .13
                    ]);
                }
                braids.push(makeChain(segs, [
                    .1,
                    .05,
                    .05
                ], {
                    k: 38,
                    c: 4.5,
                    gainF: .07,
                    gainS: -.05,
                    wave: .05
                }));
                this.eyePart(head, eye, [
                    side * .14,
                    .04,
                    .265
                ], [
                    .045,
                    .042,
                    .03
                ]);
                part(head, this.sphere, hide, [
                    side * .14,
                    .04,
                    .282
                ], [
                    .064,
                    .052,
                    .025
                ]);
                part(head, this.sphere, eye, [
                    side * .14,
                    .04,
                    .3
                ], [
                    .029,
                    .03,
                    .02
                ]).userData.eye = true;
                part(head, this.box, hide, [
                    side * .14,
                    .115,
                    .27
                ], [
                    .13,
                    .028,
                    .03
                ], [
                    0,
                    0,
                    side * .38
                ]);
                part(head, this.cone, horn, [
                    side * .05,
                    -.13,
                    .28
                ], [
                    .18,
                    .2,
                    .18
                ], [
                    Math.PI,
                    0,
                    0
                ]);
                const hornCurve = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CatmullRomCurve3"]([
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](side * .23, .29, -.03),
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](side * .34, .54, -.06),
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](side * .37, .79, -.12),
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](side * .29, .98, -.2)
                ]);
                part(head, this.geometry(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TubeGeometry"](hornCurve, 12, .075, 8, false)), horn, [
                    0,
                    0,
                    0
                ]);
            }
            part(head, this.box, hide, [
                0,
                -.1,
                .28
            ], [
                .16,
                .03,
                .03
            ]);
            // skirt: six panels with individual spring physics
            for(let i = 0; i < 6; i++){
                const a = i / 6 * TAU;
                const panel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
                panel.rotation.order = 'YXZ';
                panel.rotation.y = a;
                panel.position.set(Math.sin(a) * .22, .0, Math.cos(a) * .2);
                pelvis.add(panel);
                part(panel, this.taper, fur, [
                    0,
                    -.28,
                    0
                ], [
                    .28,
                    .58,
                    .06
                ]);
                part(panel, this.box, gold, [
                    0,
                    -.57,
                    0
                ], [
                    .5,
                    .04,
                    .07
                ]);
                cloth0.push(makeChain([
                    panel
                ], [
                    -.14
                ], {
                    k: 40,
                    c: 5,
                    gainF: .09,
                    gainS: 0,
                    wave: .02,
                    angle: a
                }));
            }
            // tail with a golden spade tip
            const tail = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            tail.position.set(0, -.02, -.2);
            pelvis.add(tail);
            const tsegs = [
                tail
            ];
            for(let i = 0; i < 5; i++){
                const seg = i === 0 ? tail : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
                if (i > 0) {
                    seg.position.set(0, 0, -.22);
                    tsegs[i - 1].add(seg);
                    tsegs.push(seg);
                }
                part(seg, this.sphere, skin, [
                    0,
                    0,
                    -.11
                ], [
                    .12 - i * .012,
                    .12 - i * .012,
                    .15
                ]);
                if (i === 4) part(seg, this.cone, gold, [
                    0,
                    0,
                    -.28
                ], [
                    .4,
                    .5,
                    .4
                ], [
                    -Math.PI / 2,
                    0,
                    0
                ]);
            }
            tailChain = makeChain(tsegs, [
                .35,
                -.12,
                -.12,
                -.1,
                0
            ], {
                k: 30,
                c: 4,
                gainF: .05,
                gainS: .03,
                wave: .12,
                lat: 'y'
            });
        }
        // ---- arms (index 0 = left, 1 = right / weapon side)
        const arms = [];
        for (const side of [
            -1,
            1
        ]){
            const shoulder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            shoulder.position.set(side * (demon ? .52 : .46), .36, 0);
            torso.add(shoulder);
            const elbow = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            elbow.position.set(0, -.32, 0);
            shoulder.add(elbow);
            const wrist = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            wrist.position.set(0, -.34, 0);
            elbow.add(wrist);
            part(shoulder, this.sphere, demon ? skin : fur, [
                0,
                0,
                0
            ], [
                .15,
                .15,
                .15
            ]);
            this.limb(shoulder, demon ? skin : fur, [
                0,
                -.16,
                0
            ], demon ? .125 : .105, .42);
            this.limb(elbow, demon ? skin : skin, [
                0,
                -.17,
                0
            ], demon ? .105 : .09, .42);
            part(elbow, this.cylinder, demon ? gold : accent, [
                0,
                -.2,
                0
            ], demon ? [
                1.0,
                .22,
                1.0
            ] : [
                .95,
                .26,
                .95
            ]);
            part(wrist, this.sphere, skin, [
                0,
                -.05,
                .02
            ], [
                .09,
                .09,
                .09
            ]);
            if (demon) {
                for (const i of [
                    -1,
                    0,
                    1
                ])part(wrist, this.cone, claw, [
                    i * .06,
                    -.15,
                    .06
                ], [
                    .16,
                    .55,
                    .16
                ], [
                    Math.PI - .35,
                    0,
                    i * .1
                ]);
            } else if (side > 0) {
                part(wrist, this.box, hide, [
                    0,
                    -.03,
                    0
                ], [
                    .05,
                    .2,
                    .05
                ]);
                part(wrist, this.sphere, gold, [
                    0,
                    .08,
                    0
                ], [
                    .035,
                    .035,
                    .035
                ]);
                part(wrist, this.box, gold, [
                    0,
                    -.14,
                    0
                ], [
                    .2,
                    .035,
                    .06
                ]);
                const blade = part(wrist, this.box, steel, [
                    0,
                    -.55,
                    0
                ], [
                    .075,
                    .8,
                    .022
                ]);
                blade.name = 'bandit-blade';
                part(wrist, this.box, this.material('#e5ecef'), [
                    0,
                    -.55,
                    .012
                ], [
                    .02,
                    .78,
                    .008
                ]);
                part(wrist, this.cone, steel, [
                    0,
                    -.99,
                    0
                ], [
                    .22,
                    .18,
                    .07
                ], [
                    Math.PI,
                    0,
                    0
                ]);
            } else {
                part(wrist, this.box, hide, [
                    0,
                    -.1,
                    .02
                ], [
                    .04,
                    .16,
                    .035
                ]);
            }
            arms.push({
                shoulder,
                elbow,
                wrist,
                side,
                legPhase: side > 0 ? 0 : .5,
                weapon: !demon && side > 0
            });
        }
        const target = part(head, this.sphere, this.targetMaterial, [
            0,
            .02,
            .19
        ], [
            .35,
            .48,
            .34
        ]);
        target.name = `${kind}-target`;
        return {
            pelvis,
            chest: torso,
            neck: null,
            head,
            jaw: null,
            legs,
            arms,
            ears: [],
            tail: tailChain,
            braids,
            cloth: cloth0,
            breath: chestMesh,
            target
        };
    }
    /* ------------------------------------------------------------------ *
   *  Death, drops, respawn, effects
   * ------------------------------------------------------------------ */ defeat(mob) {
        mob.root.visible = true;
        mob.deathAge = 0;
        mob.deathSide = Math.random() < .5 ? 1 : -1;
        mob.attack = null;
        mob.attackAge = 0;
        mob.stagger = 0;
        mob.respawnTimer = 12 + Math.random() * 8;
        const stats = MOB_STATS[mob.kind];
        this.tmpA.set(mob.root.position.x, mob.root.position.y + .4, mob.root.position.z);
        this.particles.emit(this.tmpA, '#b9a98a', 14, 2.2, 1.4, .8, 1.5);
        this.spawnDrop('experience', mob.root.position, stats.xp);
        const roll = Math.random();
        const loot = mob.kind === 'wolf' ? roll < .045 ? 'moonFang' : roll < .32 ? 'wolfPelt' : undefined : mob.kind === 'bandit' ? roll < .055 ? 'ancientSigil' : roll < .36 ? 'banditToken' : undefined : roll < .1 ? 'demonHeart' : roll < .42 ? 'demonAsh' : undefined;
        if (loot) this.spawnDrop(loot, mob.root.position, 1);
    }
    shock(position, color, size) {
        const ring = this.rings[this.ringCursor++ % this.rings.length];
        ring.age = 0;
        ring.life = .55;
        ring.size = size;
        ring.mesh.visible = true;
        ring.material.color.set(color);
        ring.mesh.position.set(position.x, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(position.x, position.z) + .08, position.z);
        ring.mesh.scale.setScalar(.3);
    }
    spawnDrop(kind, position, value) {
        const root = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        root.position.copy(position);
        this.dropRoot.add(root);
        const temporaryMaterials = [];
        const material = kind === 'experience' ? this.xpMaterial : this.material(LOOT[kind].color, LOOT[kind].color, .45, .32);
        if (kind !== 'experience') temporaryMaterials.push(material);
        const gem = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.gemGeometry, material);
        if (kind !== 'experience') gem.scale.setScalar(.84);
        gem.castShadow = false;
        root.add(gem);
        const ringMat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: kind === 'experience' ? '#b9dcc2' : LOOT[kind].color,
            transparent: true,
            opacity: .62
        });
        this.materials.push(ringMat);
        temporaryMaterials.push(ringMat);
        const ring = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.ringGeometry, ringMat);
        ring.rotation.x = Math.PI / 2;
        root.add(ring);
        const light = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"](kind === 'experience' ? '#93c5a2' : LOOT[kind].color, .45, 3);
        root.add(light);
        this.drops.push({
            root,
            kind,
            age: Math.random() * 4,
            value,
            materials: temporaryMaterials
        });
    }
    removeDrop(drop, index) {
        drop.root.removeFromParent();
        drop.materials.forEach((material)=>{
            material.dispose();
            this.materials.splice(this.materials.indexOf(material), 1);
        });
        this.drops.splice(index, 1);
    }
    respawn(mob, elapsed) {
        const choices = SPAWNS.map((spawn, index)=>({
                spawn,
                index
            })).filter((entry)=>entry.spawn.kind === mob.kind);
        const next = choices[(Math.floor(elapsed / 6) + mob.spawn + 1) % choices.length];
        mob.spawn = next.index;
        mob.root.position.set(next.spawn.x, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(next.spawn.x, next.spawn.z), next.spawn.z);
        mob.root.rotation.set(0, 0, 0);
        mob.root.scale.setScalar(1);
        mob.root.visible = true;
        mob.health = MOB_STATS[mob.kind].hp;
        mob.home.set(next.spawn.x, 0, next.spawn.z);
        mob.prev.set(next.spawn.x, next.spawn.z);
        mob.vel.set(0, 0);
        mob.attack = null;
        mob.attackAge = 0;
        mob.attackHit = false;
        mob.lungeU = 0;
        mob.air = 0;
        mob.speed = 0;
        mob.alert = 0;
        mob.guard = 0;
        mob.aggro = false;
        mob.look = 0;
        mob.slope = 0;
        mob.stagger = 0;
        mob.deathAge = 0;
        mob.hitFlash = 0;
        mob.flashing = false;
        mob.knockback.set(0, 0, 0);
        mob.attackTimer = 1.2 + Math.random() * 1.4;
        mob.respawnTimer = 0;
        for (const e of mob.mats)e.m.emissiveIntensity = e.base;
        if (mob.arc) mob.arc.pivot.visible = false;
        for (const chain of [
            ...mob.rig.cloth,
            ...mob.rig.braids,
            ...mob.rig.tail ? [
                mob.rig.tail
            ] : []
        ]){
            chain.x = chain.restX.slice();
            chain.z.fill(0);
            chain.vx.fill(0);
            chain.vz.fill(0);
        }
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
/** Liga/desliga o contorno "anime" (casca invertida). Desligar economiza ~1/3 dos draw calls. */ const OUTLINES = true;
const { clamp, lerp } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"];
const { sin, cos, abs, max, min, sqrt, PI } = Math;
const TAU = PI * 2;
/* ------------------------------------------------------------------ utilidades */ /** Keyframes com interpolação cúbica (Catmull-Rom não uniforme): velocidade contínua entre chaves. */ function kf(t, keys) {
    const n = keys.length;
    if (t <= keys[0][0]) return keys[0][1];
    if (t >= keys[n - 1][0]) return keys[n - 1][1];
    let i = 0;
    while(t > keys[i + 1][0])i++;
    const [t0, v0] = keys[i];
    const [t1, v1] = keys[i + 1];
    const h = t1 - t0;
    const m0 = i > 0 ? (v1 - keys[i - 1][1]) / (t1 - keys[i - 1][0]) : (v1 - v0) / h;
    const m1 = i + 2 < n ? (keys[i + 2][1] - v0) / (keys[i + 2][0] - t0) : (v1 - v0) / h;
    const s = (t - t0) / h, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * v0 + (s3 - 2 * s2 + s) * h * m0 + (-2 * s3 + 3 * s2) * v1 + (s3 - s2) * h * m1;
}
function wrapAngle(a) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].euclideanModulo(a + PI, TAU) - PI;
}
function smoothAngle(current, target, amount) {
    return current + wrapAngle(target - current) * amount;
}
const chan = (v = 0)=>({
        v,
        vel: 0,
        t: v
    });
function stepChan(c, k, d, h) {
    c.vel += (k * (c.t - c.v) - d * c.vel) * h;
    c.v += c.vel * h;
}
const JOINTS = [
    'pelvis',
    'spine',
    'chest',
    'neck',
    'head',
    'armL',
    'armR',
    'elbowL',
    'elbowR',
    'wristL',
    'wristR',
    'hipL',
    'hipR',
    'kneeL',
    'kneeR',
    'ankleL',
    'ankleR'
];
/** Parâmetros "duros" (seguem a mola da pose) e "macios" (expressão, dedos, magia...). */ const HARD_PARAMS = [
    'bodyX',
    'bodyY',
    'bodyZ',
    'pitch',
    'roll',
    'staffP',
    'staffY',
    'staffR'
];
const SOFT_PARAMS = [
    'gripL',
    'gripY',
    'curlL',
    'curlR',
    'lid',
    'brow',
    'furrow',
    'mouth',
    'smile',
    'magic',
    'flare',
    'wind',
    'ear'
];
/** Rigidez/amortecimento por pose: [k, zeta]. zeta < 1 = overshoot (mais "snappy"/elástico). */ const SPRING = {
    idle: [
        170,
        0.9
    ],
    walk: [
        700,
        1.0
    ],
    run: [
        900,
        0.95
    ],
    jump: [
        520,
        0.78
    ],
    fall: [
        210,
        0.85
    ],
    land: [
        900,
        0.7
    ],
    attack: [
        1500,
        0.62
    ],
    dodge: [
        1000,
        0.85
    ],
    guard: [
        480,
        0.9
    ],
    cast: [
        720,
        0.7
    ],
    hit: [
        1300,
        0.45
    ],
    defeat: [
        150,
        0.85
    ],
    fly: [
        170,
        0.9
    ]
};
/** Articulações mais "soltas" atrasam um pouco -> follow-through natural. */ const JOINT_K = {
    pelvis: 1,
    spine: 0.9,
    chest: 0.85,
    neck: 0.7,
    head: 0.55,
    armL: 1,
    armR: 1,
    elbowL: 0.9,
    elbowR: 0.9,
    wristL: 0.6,
    wristR: 0.6,
    hipL: 1,
    hipR: 1,
    kneeL: 1,
    kneeR: 1,
    ankleL: 0.8,
    ankleR: 0.8
};
/* ------------------------------------------------------------------ medidas */ const PIV = 1.2; // pivô de rotação do corpo (centro de massa)
const HIP_H = 1.17; // altura da pelve
const THIGH = 0.52; // coxa
const SHIN = 0.45; // canela (até o tornozelo)
const ARM1 = 0.48; // braço
const ARM2 = 0.56; // antebraço + mão (até o centro do punho)
/** IK analítico de 2 ossos (ombro com rotação X/Z, cotovelo dobrando em X). Alvo no espaço do ombro. */ function solveArm(tx, ty, tz, out) {
    const d = Math.hypot(tx, ty, tz) || 1e-4;
    const dd = clamp(d, abs(ARM1 - ARM2) + 0.06, (ARM1 + ARM2) * 0.995);
    const k = dd / d;
    tx *= k;
    ty *= k;
    tz *= k;
    const interior = Math.acos(clamp((ARM1 * ARM1 + ARM2 * ARM2 - dd * dd) / (2 * ARM1 * ARM2), -1, 1));
    const flex = PI - interior;
    const hy = -(ARM1 + ARM2 * cos(flex));
    const hz = ARM2 * sin(flex);
    const z = Math.asin(clamp(-tx / hy, -1, 1));
    out.x = Math.atan2(tz, ty) - Math.atan2(hz, hy * cos(z));
    out.z = z;
    out.e = -flex;
}
function makeChain(parent, origin, lengths, build, o) {
    const segs = [];
    let p = parent;
    lengths.forEach((len, i)=>{
        const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        if (i === 0) g.position.set(...origin);
        else g.position.set(0, -lengths[i - 1], 0);
        p.add(g);
        segs.push(g);
        build(g, i, len);
        p = g;
    });
    const n = lengths.length;
    const zeros = ()=>new Array(n).fill(0);
    return {
        segs,
        x: zeros(),
        z: zeros(),
        vx: zeros(),
        vz: zeros(),
        lx: zeros(),
        lz: zeros(),
        k: o.k,
        c: o.c,
        gain: o.gain,
        limit: o.limit ?? 1.0,
        lag: o.lag ?? 26,
        yaw: o.yaw ?? 0,
        air: o.air ?? 1,
        breeze: o.breeze ?? 0.1,
        seed: o.seed ?? 0,
        restX: 0,
        restZ: 0
    };
}
/** fx/fz: força "de inércia + arrasto" no espaço local do root. */ function stepChain(ch, h, fx, fz, time) {
    const c = cos(ch.yaw), s = sin(ch.yaw);
    const ux = (fx * c - fz * s) * ch.air + sin(time * 1.7 + ch.seed) * ch.breeze;
    const uz = (fx * s + fz * c) * ch.air + sin(time * 1.3 + ch.seed * 1.7) * ch.breeze * 0.7;
    const n = ch.segs.length;
    for(let i = 0; i < n; i++){
        // cada segmento "enxerga" a força com atraso crescente -> onda que percorre a cadeia
        const a = 1 - Math.exp(-h * (ch.lag / (1 + i * 0.6)));
        ch.lx[i] += (ux - ch.lx[i]) * a;
        ch.lz[i] += (uz - ch.lz[i]) * a;
        const w = 1 - i / n * 0.6;
        const k = ch.k * (1 - 0.35 * (i / n));
        const ax = -ch.gain * ch.lz[i] - k * (ch.x[i] - ch.restX * w) - ch.c * ch.vx[i];
        const az = ch.gain * ch.lx[i] - k * (ch.z[i] - ch.restZ * w) - ch.c * ch.vz[i];
        ch.vx[i] += ax * h;
        ch.vz[i] += az * h;
        ch.x[i] = clamp(ch.x[i] + ch.vx[i] * h, -ch.limit, ch.limit);
        ch.z[i] = clamp(ch.z[i] + ch.vz[i] * h, -ch.limit, ch.limit);
    }
}
/* ------------------------------------------------------------- helpers de malha */ let outlineMaterial = null;
function getOutline() {
    if (!outlineMaterial) {
        outlineMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#2b2321',
            side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BackSide"]
        });
        outlineMaterial.onBeforeCompile = (shader)=>{
            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', 'vec3 transformed = position + normal * 0.011;');
        };
        outlineMaterial.customProgramCacheKey = ()=>'hero-outline-v1';
    }
    return outlineMaterial;
}
function part(geometry, material, parent, position = [
    0,
    0,
    0
], o = {}) {
    const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](geometry, material);
    m.position.set(...position);
    if (o.rot) m.rotation.set(...o.rot);
    if (o.scale) m.scale.set(...o.scale);
    m.castShadow = o.shadow ?? true;
    m.receiveShadow = true;
    if (OUTLINES && o.outline) m.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](geometry, getOutline()));
    parent.add(m);
    return m;
}
const caps = (r, len, seg = 10)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CapsuleGeometry"](r, len, 4, seg);
/** Painel fino trapezoidal (para saia/capa). */ function panelGeometry(topW, botW, len) {
    const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](topW / Math.SQRT2, botW / Math.SQRT2, len, 4, 1);
    g.rotateY(PI / 4);
    g.scale(1, 1, 0.14);
    return g;
}
function createHero(scene) {
    const root = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    root.name = 'called-wanderer';
    const pivot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    pivot.name = 'hero-pivot';
    pivot.position.y = PIV;
    root.add(pivot);
    const body = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    body.name = 'articulated-rig';
    body.position.y = -PIV;
    pivot.add(body);
    /* ------------------------------------------------------------- materiais */ const toonRamp = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTexture"](new Uint8Array([
        22,
        86,
        158,
        232
    ]), 4, 1, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RedFormat"]);
    toonRamp.magFilter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NearestFilter"];
    toonRamp.minFilter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NearestFilter"];
    toonRamp.generateMipmaps = false;
    toonRamp.needsUpdate = true;
    scene.userData.gameTextures = [
        ...scene.userData.gameTextures ?? [],
        toonRamp
    ];
    const toon = (color, side = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrontSide"])=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshToonMaterial"]({
            color,
            gradientMap: toonRamp,
            side
        });
    const mat = {
        suit: toon('#33454c'),
        cloth: toon('#42616a'),
        clothD: toon('#42616a', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]),
        coat: toon('#ddd5bd'),
        coatD: toon('#ddd5bd', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]),
        coatShade: toon('#cbc3aa', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]),
        coatDark: toon('#a5a18c'),
        leather: toon('#544337'),
        leatherD: toon('#3d3028'),
        metal: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            color: '#b99d67',
            roughness: 0.43,
            metalness: 0.42
        }),
        metalD: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            color: '#b99d67',
            roughness: 0.43,
            metalness: 0.42,
            side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
        }),
        skin: toon('#edc9a9'),
        skinD: toon('#edc9a9', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]),
        hair: toon('#e4e1d3'),
        hairShade: toon('#aeb9b5'),
        iris: toon('#5fa58f'),
        irisDark: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#244a42'
        }),
        eyeWhite: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#f7f0df'
        }),
        shine: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#ffffff'
        }),
        lash: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#3a2f2b'
        }),
        lip: toon('#c98a86'),
        mouthIn: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#7a3a3a'
        }),
        wood: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            color: '#644b35',
            roughness: 0.83
        }),
        glow: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshToonMaterial"]({
            color: '#f2dca5',
            emissive: '#b58a3f',
            emissiveIntensity: 1.2,
            gradientMap: toonRamp
        }),
        halo: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#f6e4ae',
            transparent: true,
            opacity: 0.75,
            depthWrite: false,
            side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
        })
    };
    /* ------------------------------------------------------- registro de juntas */ const J = {};
    const reg = (name, node)=>{
        J[name] = {
            node,
            x: chan(),
            y: chan(),
            z: chan()
        };
    };
    const P = {};
    for (const n of [
        ...HARD_PARAMS,
        ...SOFT_PARAMS
    ])P[n] = chan();
    P.lid.v = P.lid.t = 0.78;
    const chains = [];
    /* ================================================================== TRONCO */ const pelvis = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    pelvis.position.y = HIP_H;
    body.add(pelvis);
    reg('pelvis', pelvis);
    part(caps(0.16, 0.14, 12), mat.suit, pelvis, [
        0,
        0,
        0
    ], {
        rot: [
            0,
            0,
            PI / 2
        ],
        scale: [
            1,
            1,
            0.86
        ],
        outline: true
    });
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.215, 0.036, 8, 24), mat.leather, pelvis, [
        0,
        0.1,
        0
    ], {
        rot: [
            PI / 2,
            0,
            0
        ],
        scale: [
            1,
            0.86,
            1
        ]
    });
    const clasp = part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](0.13, 0.11, 0.045), mat.metal, pelvis, [
        0,
        0.1,
        0.19
    ]);
    const spine = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    spine.position.y = 0.08;
    pelvis.add(spine);
    reg('spine', spine);
    part(caps(0.2, 0.12, 12), mat.suit, spine, [
        0,
        0.15,
        0
    ], {
        scale: [
            1,
            1,
            0.8
        ],
        outline: true
    });
    part(caps(0.225, 0.1, 12), mat.coat, spine, [
        0,
        0.14,
        0
    ], {
        scale: [
            1,
            1,
            0.84
        ],
        outline: true
    });
    const chest = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    chest.position.y = 0.3;
    spine.add(chest);
    reg('chest', chest);
    part(caps(0.255, 0.18, 14), mat.suit, chest, [
        0,
        0.1,
        0
    ], {
        scale: [
            1,
            1,
            0.78
        ]
    });
    part(caps(0.285, 0.15, 14), mat.coat, chest, [
        0,
        0.1,
        0
    ], {
        scale: [
            1.02,
            1,
            0.84
        ],
        outline: true
    });
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.287, 0.014, 6, 28), mat.metal, chest, [
        0,
        0.0,
        0
    ], {
        rot: [
            PI / 2,
            0,
            0
        ],
        scale: [
            1.02,
            0.84,
            1
        ]
    });
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](0.022, 0.4, 0.02), mat.metal, chest, [
        0,
        0.14,
        0.243
    ]);
    for(let i = 0; i < 3; i++)part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.02, 8, 6), mat.metal, chest, [
        0,
        0.0 + i * 0.12,
        0.252
    ]);
    // linha de ombros (suaviza a transição tronco -> ombro)
    part(caps(0.12, 0.5, 10), mat.coat, chest, [
        0,
        0.3,
        0
    ], {
        rot: [
            0,
            0,
            PI / 2
        ],
        scale: [
            1,
            1,
            0.85
        ]
    });
    // gola
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.17, 0.075, 8, 20), mat.coat, chest, [
        0,
        0.4,
        -0.01
    ], {
        rot: [
            PI / 2,
            0,
            0
        ],
        outline: true
    });
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.17, 0.014, 6, 20), mat.metal, chest, [
        0,
        0.45,
        -0.01
    ], {
        rot: [
            PI / 2,
            0,
            0
        ]
    });
    // alça diagonal da bolsa
    const strapPivot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    strapPivot.position.set(0, 0.06, 0);
    strapPivot.rotation.z = -0.62;
    chest.add(strapPivot);
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.29, 0.018, 6, 28), mat.leather, strapPivot, [
        0,
        0,
        0
    ], {
        rot: [
            PI / 2,
            0,
            0
        ],
        scale: [
            1,
            0.86,
            1
        ]
    });
    /* ================================================================== CABEÇA */ const neck = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    neck.position.set(0, 0.42, 0);
    chest.add(neck);
    reg('neck', neck);
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.068, 0.078, 0.2, 10), mat.skin, neck, [
        0,
        0.07,
        0
    ]);
    const head = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    head.position.set(0, 0.2, 0);
    neck.add(head);
    reg('head', head);
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.28, 24, 20), mat.skin, head, [
        0,
        0.04,
        0.015
    ], {
        scale: [
            0.9,
            1.05,
            0.86
        ],
        outline: true
    });
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.018, 8, 6), mat.skin, head, [
        0,
        -0.045,
        0.238
    ], {
        scale: [
            1,
            1,
            0.9
        ]
    }); // nariz
    // olhos
    const lids = [], irises = [], brows = [], ears = [];
    const BROW_Y = 0.155;
    for (const side of [
        -1,
        1
    ]){
        const eye = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        eye.position.set(side * 0.105, 0.06, 0.222);
        head.add(eye);
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.06, 14, 12), mat.eyeWhite, eye, [
            0,
            0,
            0
        ], {
            scale: [
                1.15,
                0.95,
                0.5
            ],
            shadow: false
        });
        const iris = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        iris.position.set(0, -0.004, 0.02);
        eye.add(iris);
        irises.push(iris);
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.042, 14, 12), mat.iris, iris, [
            0,
            0,
            0.0
        ], {
            scale: [
                1,
                1.15,
                0.35
            ],
            shadow: false
        });
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.02, 10, 8), mat.irisDark, iris, [
            0,
            0,
            0.012
        ], {
            scale: [
                1,
                1.1,
                0.3
            ],
            shadow: false
        });
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.009, 8, 6), mat.shine, iris, [
            0.012,
            0.016,
            0.02
        ], {
            scale: [
                1,
                1,
                0.4
            ],
            shadow: false
        });
        const lid = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        eye.add(lid);
        lids.push(lid);
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.067, 14, 8, 0, TAU, 0, PI * 0.52), mat.skinD, lid, [
            0,
            0,
            0
        ], {
            scale: [
                1.15,
                0.95,
                0.55
            ],
            shadow: false
        });
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.068, 0.0085, 5, 14, PI), mat.lash, lid, [
            0,
            0,
            0.03
        ], {
            scale: [
                1.15,
                0.95,
                1
            ],
            shadow: false
        });
        const brow = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        brow.position.set(side * 0.108, BROW_Y, 0.212);
        head.add(brow);
        brows.push(brow);
        part(caps(0.011, 0.06, 6), mat.hairShade, brow, [
            0,
            0,
            0
        ], {
            rot: [
                0,
                0,
                PI / 2
            ],
            shadow: false
        });
    }
    // boca
    const mouthLine = part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.03, 0.006, 5, 12, PI), mat.lip, head, [
        0,
        -0.098,
        0.226
    ], {
        rot: [
            0,
            0,
            PI
        ],
        shadow: false
    });
    const mouthOpen = part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.02, 10, 8), mat.mouthIn, head, [
        0,
        -0.11,
        0.222
    ], {
        scale: [
            1,
            0.2,
            0.4
        ],
        shadow: false
    });
    mouthOpen.visible = false;
    // orelhas de elfa + brincos (com física)
    for (const side of [
        -1,
        1
    ]){
        const earG = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        earG.position.set(side * 0.255, 0.065, -0.03);
        earG.rotation.y = side * 0.5;
        head.add(earG);
        ears.push(earG);
        const earGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](0.055, 0.32, 8);
        earGeo.translate(0, 0.16, 0);
        part(earGeo, mat.skin, earG, [
            0,
            0,
            0
        ], {
            rot: [
                0,
                0,
                -side * (PI / 2 - 0.28)
            ],
            scale: [
                1,
                1,
                0.42
            ],
            outline: true
        });
        chains.push(makeChain(head, [
            side * 0.278,
            -0.015,
            -0.03
        ], [
            0.06,
            0.06
        ], (seg, i)=>{
            if (i === 0) part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.016, 8, 6), mat.metal, seg, [
                0,
                0,
                0
            ]);
            part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.008, 0.008, 0.05, 5), mat.metal, seg, [
                0,
                -0.03,
                0
            ], {
                shadow: false
            });
            if (i === 1) part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OctahedronGeometry"](0.022, 0), mat.glow, seg, [
                0,
                -0.07,
                0
            ], {
                scale: [
                    0.8,
                    1.4,
                    0.8
                ]
            });
        }, {
            k: 70,
            c: 5,
            gain: 9,
            limit: 1.1,
            lag: 40,
            air: 0.9,
            breeze: 0.25,
            seed: side * 3
        }));
    }
    // cabelo: calota + volume traseiro + franja de cones
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.315, 22, 16, 0, TAU, 0, PI * 0.55), mat.hair, head, [
        0,
        0.085,
        -0.03
    ], {
        rot: [
            -0.6,
            0,
            0
        ],
        scale: [
            1.04,
            1.04,
            1.06
        ],
        outline: true
    });
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.3, 16, 14), mat.hair, head, [
        0,
        -0.04,
        -0.12
    ], {
        scale: [
            1.0,
            1.25,
            0.85
        ],
        outline: true
    });
    for(let i = 0; i < 9; i++){
        const a = (i - 4) * 0.26;
        const bang = part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](0.052 + i % 3 * 0.006, 0.2 + i % 2 * 0.03, 6), i % 3 === 1 ? mat.hairShade : mat.hair, head, [
            sin(a) * 0.275,
            0.265 - abs(a) * 0.04,
            cos(a) * 0.255 + 0.0
        ]);
        bang.rotation.order = 'YXZ';
        bang.rotation.set(PI - 0.25, a, 0);
        bang.castShadow = true;
    }
    // diadema discreta + gema
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.295, 0.016, 6, 22, PI * 1.05), mat.metal, head, [
        0,
        0.225,
        -0.01
    ], {
        rot: [
            PI / 2 - 0.25,
            0,
            0
        ]
    });
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OctahedronGeometry"](0.05, 0), mat.glow, head, [
        0,
        0.285,
        0.265
    ], {
        scale: [
            0.75,
            1.3,
            0.6
        ]
    });
    // maria-chiquinhas (7 segmentos cada) e mechas laterais
    const tailLens = [
        0.2,
        0.2,
        0.2,
        0.2,
        0.18,
        0.18,
        0.16
    ];
    const tails = [];
    const sideLocks = [];
    for (const side of [
        -1,
        1
    ]){
        const chain = makeChain(head, [
            side * 0.3,
            0.17,
            -0.1
        ], tailLens, (seg, i, len)=>{
            const r = lerp(0.085, 0.04, i / 6);
            const m = part(caps(r, max(0.01, len - 2 * r), 8), i % 2 ? mat.hair : mat.hairShade, seg, [
                0,
                -len / 2,
                0
            ], {
                scale: [
                    1,
                    1,
                    0.75
                ],
                outline: true
            });
            m.castShadow = true;
            for (const o of [
                -1,
                1
            ])part(caps(r * 0.7, max(0.01, len * 0.9 - 1.4 * r), 6), o > 0 ? mat.hair : mat.hairShade, seg, [
                o * r * 0.8,
                -len / 2 - 0.01,
                -r * 0.2
            ], {
                scale: [
                    1,
                    1,
                    0.7
                ]
            });
            if (i === 0) {
                part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.075, 0.022, 6, 12), mat.metal, seg, [
                    0,
                    -0.01,
                    0
                ], {
                    rot: [
                        PI / 2,
                        0,
                        0
                    ]
                });
                part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.026, 8, 6), mat.glow, seg, [
                    side * 0.07,
                    0.0,
                    0.0
                ]);
            }
        }, {
            k: 26,
            c: 3.6,
            gain: 4.0,
            limit: 1.25,
            lag: 24,
            air: 1,
            breeze: 0.16,
            seed: side * 5
        });
        chains.push(chain);
        tails.push({
            chain,
            side
        });
        const lock = makeChain(head, [
            side * 0.24,
            0.12,
            0.12
        ], [
            0.13,
            0.13,
            0.12
        ], (seg, i, len)=>{
            const r = lerp(0.052, 0.028, i / 2);
            part(caps(r, max(0.01, len - 2 * r), 6), i === 1 ? mat.hairShade : mat.hair, seg, [
                0,
                -len / 2,
                0
            ], {
                scale: [
                    1,
                    1,
                    0.8
                ],
                outline: i === 0
            });
        }, {
            k: 55,
            c: 6,
            gain: 6.5,
            limit: 1.0,
            lag: 30,
            air: 0.8,
            breeze: 0.2,
            seed: side * 7
        });
        chains.push(lock);
        sideLocks.push({
            chain: lock,
            side
        });
    }
    /* ================================================================== PERNAS */ for (const side of [
        -1,
        1
    ]){
        const S = side < 0 ? 'L' : 'R';
        const hip = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        hip.position.set(side * 0.15, -0.05, 0);
        pelvis.add(hip);
        reg(`hip${S}`, hip);
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.115, 12, 10), mat.suit, hip, [
            0,
            0,
            0
        ]);
        part(caps(0.105, 0.3, 10), mat.suit, hip, [
            0,
            -0.26,
            0
        ], {
            outline: true
        });
        const knee = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        knee.position.set(0, -THIGH, 0);
        hip.add(knee);
        reg(`knee${S}`, knee);
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.1, 10, 8), mat.suit, knee, [
            0,
            0,
            0
        ]);
        part(caps(0.085, 0.28, 10), mat.suit, knee, [
            0,
            -0.2,
            0
        ], {
            outline: true
        });
        part(caps(0.1, 0.1, 10), mat.leather, knee, [
            0,
            -0.35,
            0
        ], {
            outline: true
        });
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.1, 0.014, 6, 14), mat.metal, knee, [
            0,
            -0.28,
            0
        ], {
            rot: [
                PI / 2,
                0,
                0
            ]
        });
        const ankle = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        ankle.position.set(0, -SHIN, 0);
        knee.add(ankle);
        reg(`ankle${S}`, ankle);
        part(caps(0.093, 0.17, 10), mat.leather, ankle, [
            0,
            -0.055,
            0.07
        ], {
            rot: [
                PI / 2,
                0,
                0
            ],
            scale: [
                1,
                1,
                0.92
            ],
            outline: true
        });
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](0.15, 0.045, 0.1), mat.leatherD, ankle, [
            0,
            -0.128,
            -0.035
        ]);
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.06, 8, 6), mat.leatherD, ankle, [
            0,
            -0.09,
            0.15
        ], {
            scale: [
                1.4,
                0.8,
                1
            ]
        });
    }
    const hands = [];
    const buildHand = (wrist, side)=>{
        const hr = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        hr.rotation.y = side > 0 ? -PI / 2 : PI / 2;
        wrist.add(hr); // palma voltada p/ dentro
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](0.085, 0.1, 0.045), mat.skin, hr, [
            0,
            -0.055,
            0
        ]);
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.036, 8, 6), mat.skin, hr, [
            0,
            -0.01,
            0
        ], {
            scale: [
                1.1,
                0.8,
                0.9
            ]
        });
        const fingers = [];
        const lens = [
            0.03,
            0.036,
            0.034,
            0.026
        ];
        for(let i = 0; i < 4; i++){
            const prox = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            prox.position.set((i - 1.5) * 0.0225, -0.108, 0);
            hr.add(prox);
            part(caps(0.0145, lens[i], 5), mat.skin, prox, [
                0,
                -0.026,
                0
            ], {
                shadow: false
            });
            const dist = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            dist.position.set(0, -0.052, 0);
            prox.add(dist);
            part(caps(0.013, lens[i] - 0.008, 5), mat.skin, dist, [
                0,
                -0.02,
                0
            ], {
                shadow: false
            });
            fingers.push({
                prox,
                dist
            });
        }
        const thumb = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        thumb.position.set(-side * 0.05, -0.045, 0.012);
        hr.add(thumb);
        part(caps(0.0165, 0.03, 5), mat.skin, thumb, [
            0,
            -0.025,
            0
        ], {
            shadow: false
        });
        hands.push({
            fingers,
            thumb
        });
    };
    const armNodes = [];
    let wristR = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    for (const side of [
        -1,
        1
    ]){
        const S = side < 0 ? 'L' : 'R';
        const arm = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        arm.name = side < 0 ? 'arm-left' : 'arm-right';
        arm.position.set(side * 0.4, 0.3, 0);
        chest.add(arm);
        reg(`arm${S}`, arm);
        armNodes.push(arm);
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.17, 14, 12), mat.coat, arm, [
            0,
            -0.03,
            0
        ], {
            scale: [
                1,
                0.9,
                0.95
            ],
            outline: true
        });
        part(caps(0.115, 0.2, 10), mat.coat, arm, [
            0,
            -0.19,
            0
        ], {
            outline: true
        });
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.118, 0.014, 6, 16), mat.metal, arm, [
            0,
            -0.33,
            0
        ], {
            rot: [
                PI / 2,
                0,
                0
            ]
        });
        part(caps(0.085, 0.3, 10), mat.suit, arm, [
            0,
            -0.3,
            0
        ]);
        const elbow = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        elbow.position.set(0, -ARM1, 0);
        arm.add(elbow);
        reg(`elbow${S}`, elbow);
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.082, 10, 8), mat.suit, elbow, [
            0,
            0,
            0
        ]);
        part(caps(0.075, 0.24, 10), mat.suit, elbow, [
            0,
            -0.22,
            0
        ], {
            outline: true
        });
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.082, 0.016, 6, 14), mat.metal, elbow, [
            0,
            -0.38,
            0
        ], {
            rot: [
                PI / 2,
                0,
                0
            ]
        });
        const wrist = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        wrist.position.set(0, -0.46, 0);
        elbow.add(wrist);
        reg(`wrist${S}`, wrist);
        buildHand(wrist, side);
        if (side > 0) wristR = wrist;
    }
    /* ================================================================== SAIA (painéis), CAPA, BOLSA */ const PANELS = 8;
    const panels = [];
    for(let i = 0; i < PANELS; i++){
        const phi = i / PANELS * TAU;
        const anchor = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        anchor.rotation.y = phi;
        anchor.position.set(sin(phi) * 0.29, 0.06, cos(phi) * 0.24);
        pelvis.add(anchor);
        const lens = [
            0.24,
            0.24,
            0.22
        ];
        const widths = [
            [
                0.27,
                0.3
            ],
            [
                0.3,
                0.33
            ],
            [
                0.33,
                0.38
            ]
        ];
        const chain = makeChain(anchor, [
            0,
            0,
            0
        ], lens, (seg, j, len)=>{
            part(panelGeometry(widths[j][0], widths[j][1], len), (i + j) % 2 ? mat.coatD : mat.coatShade, seg, [
                0,
                -len / 2,
                0
            ], {
                shadow: true
            });
            if (j === 2) part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](widths[j][1] * 0.98, 0.026, 0.02), mat.metalD, seg, [
                0,
                -len + 0.013,
                0.0
            ]);
        }, {
            k: 46,
            c: 6.2,
            gain: 6.5,
            limit: 1.2,
            lag: 22,
            yaw: phi,
            air: 0.75,
            breeze: 0.07,
            seed: i * 1.3
        });
        chains.push(chain);
        panels.push({
            chain,
            phi
        });
    }
    const cape = makeChain(chest, [
        0,
        0.36,
        -0.2
    ], [
        0.3,
        0.28,
        0.26
    ], (seg, j, len)=>{
        part(panelGeometry(0.46 + j * 0.03, 0.49 + j * 0.03, len), j % 2 ? mat.coatShade : mat.coatD, seg, [
            0,
            -len / 2,
            0
        ]);
        if (j === 2) part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](0.52, 0.026, 0.02), mat.metalD, seg, [
            0,
            -len + 0.013,
            0
        ]);
    }, {
        k: 30,
        c: 4.5,
        gain: 5.5,
        limit: 1.25,
        lag: 20,
        air: 0.8,
        breeze: 0.08,
        seed: 11
    });
    chains.push(cape);
    const satchel = makeChain(pelvis, [
        -0.34,
        0.03,
        0.02
    ], [
        0.26
    ], (seg)=>{
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](0.2, 0.24, 0.1), mat.leather, seg, [
            0,
            -0.14,
            0
        ], {
            outline: true
        });
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](0.21, 0.09, 0.11), mat.leatherD, seg, [
            0,
            -0.05,
            0
        ]);
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](0.04, 0.045, 0.02), mat.metal, seg, [
            0,
            -0.09,
            0.058
        ]);
    }, {
        k: 70,
        c: 7,
        gain: 7,
        limit: 0.9,
        lag: 28,
        air: 0.7,
        breeze: 0.04,
        seed: 21
    });
    chains.push(satchel);
    /* ================================================================== CAJADO */ const staffMount = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    staffMount.position.set(-0.05, -0.1, 0);
    wristR.add(staffMount);
    const staff = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    staff.name = 'heirloom-staff';
    staffMount.add(staff);
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.036, 0.05, 2.3, 9), mat.wood, staff, [
        0,
        0.25,
        0
    ], {
        outline: true
    });
    part(caps(0.054, 0.26, 8), mat.leather, staff, [
        0,
        0,
        0
    ]);
    for (const y of [
        -0.17,
        0.17,
        0.45
    ])part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.052, 0.016, 6, 12), mat.metal, staff, [
        0,
        y,
        0
    ], {
        rot: [
            PI / 2,
            0,
            0
        ]
    });
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.052, 0.034, 0.12, 8), mat.metal, staff, [
        0,
        -0.86,
        0
    ]);
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.06, 0.02, 6, 12), mat.metal, staff, [
        0,
        1.4,
        0
    ], {
        rot: [
            PI / 2,
            0,
            0
        ]
    });
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.2, 0.03, 8, 24, PI), mat.metal, staff, [
        0,
        1.66,
        0
    ], {
        rot: [
            0,
            0,
            PI
        ],
        outline: true
    });
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.16, 0.012, 6, 24), mat.metal, staff, [
        0,
        1.68,
        0
    ]);
    const focus = part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IcosahedronGeometry"](0.105, 1), mat.glow, staff, [
        0,
        1.68,
        0
    ]);
    for (const o of [
        -1,
        1
    ]){
        const wg = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](0.035, 0.26, 6);
        part(wg, mat.metal, staff, [
            o * 0.2,
            1.84,
            0
        ], {
            rot: [
                0,
                0,
                -o * 0.6
            ]
        });
    }
    part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](0.03, 0.2, 6), mat.metal, staff, [
        0,
        2.0,
        0
    ]);
    const spellPoint = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Object3D"]();
    spellPoint.position.set(0, 1.7, 0.06);
    staff.add(spellPoint);
    const aura = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"]('#efdba9', 0.85, 4, 2);
    aura.position.set(0, 1.7, 0.1);
    staff.add(aura);
    const haloA = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.27, 0.008, 5, 32), mat.halo);
    haloA.position.set(0, 1.68, 0);
    staff.add(haloA);
    const haloB = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.36, 0.006, 5, 32), mat.halo);
    haloB.position.set(0, 1.68, 0);
    staff.add(haloB);
    haloA.visible = haloB.visible = false;
    chains.push(makeChain(staff, [
        0,
        1.42,
        0.07
    ], [
        0.12,
        0.12,
        0.1
    ], (seg, j, len)=>{
        part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](0.05 - j * 0.008, len, 0.012), mat.clothD, seg, [
            0,
            -len / 2,
            0
        ]);
        if (j === 2) part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.022, 8, 6), mat.metal, seg, [
            0,
            -len,
            0
        ]);
    }, {
        k: 30,
        c: 3.2,
        gain: 4.5,
        limit: 1.3,
        lag: 22,
        air: 1,
        breeze: 0.18,
        seed: 31
    }));
    Object.assign(root.userData, {
        body,
        legs: [
            J.hipL.node,
            J.hipR.node
        ],
        arms: armNodes,
        focus,
        clasp,
        satchel: satchel.segs[0],
        shoulder: root
    });
    root.position.set(0, 0, 2);
    scene.add(root);
    /* ================================================================== ESTADO DE ANIMAÇÃO */ const setJ = (n, x = 0, y = 0, z = 0)=>{
        const j = J[n];
        j.x.t = x;
        j.y.t = y;
        j.z.t = z;
    };
    const addJ = (n, x = 0, y = 0, z = 0)=>{
        const j = J[n];
        j.x.t += x;
        j.y.t += y;
        j.z.t += z;
    };
    const legHeight = (hip, knee)=>THIGH * cos(hip) + SHIN * cos(hip + knee);
    /** Ajusta a altura da pelve para a perna mais "esticada" tocar o chão (nenhum pé atravessa o piso). */ const plant = (extra = 0)=>{
        const h = max(legHeight(J.hipL.x.t, J.kneeL.x.t), legHeight(J.hipR.x.t, J.kneeR.x.t));
        P.bodyY.t = h - (THIGH + SHIN) + extra;
    };
    /** Mantém o pé paralelo ao chão (k=1 totalmente plano). */ const autoFoot = (k = 1)=>{
        J.ankleL.x.t = -(J.hipL.x.t + J.kneeL.x.t) * k;
        J.ankleR.x.t = -(J.hipR.x.t + J.kneeR.x.t) * k;
    };
    const resetTargets = ()=>{
        for (const n of JOINTS)setJ(n);
        for (const n of HARD_PARAMS)P[n].t = 0;
        for (const n of SOFT_PARAMS)P[n].t = 0;
        setJ('armL', 0, 0, -0.08);
        setJ('armR', 0, 0, 0.08);
        setJ('elbowL', -0.2);
        setJ('elbowR', -0.3);
        P.lid.t = 0.78;
        P.curlL.t = 0.3;
        P.curlR.t = 1;
        P.gripY.t = -0.4;
        P.staffR.t = -0.06;
    };
    // movimento do root
    const prevPos = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
    let hasPrev = false;
    const vel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](), sVel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](), pVel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](), acc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](), sAcc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
    const vL = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](), aL = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
    let turnVel = 0;
    const toLocal = (v, out, yaw)=>{
        out.set(v.x * cos(yaw) - v.z * sin(yaw), v.y, v.x * sin(yaw) + v.z * cos(yaw));
    };
    let activePose = 'idle';
    let poseTime = 0;
    let phase = 0;
    let blinkWait = 2.4, blinkP = 0, earWait = 3;
    const ik = {
        x: 0,
        z: 0,
        e: 0
    };
    const qParent = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Quaternion"](), qRoot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Quaternion"](), qDesired = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Quaternion"]();
    const eul = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Euler"](0, 0, 0, 'YXZ');
    const tmp = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
    return {
        root,
        spellPoint,
        update (time, delta, pose, speed = 0) {
            const dt = clamp(delta, 1 / 240, 1 / 20);
            if (pose !== activePose) {
                activePose = pose;
                poseTime = 0;
            }
            poseTime += dt;
            /* ---- orientação (yaw) com cabeça liderando a curva */ const target = root.userData.facing ?? root.rotation.y;
            const facingErr = wrapAngle(target - root.rotation.y);
            const prevYaw = root.rotation.y;
            root.rotation.y = smoothAngle(root.rotation.y, target, 1 - Math.exp(-dt * 13));
            turnVel = lerp(turnVel, wrapAngle(root.rotation.y - prevYaw) / dt, 1 - Math.exp(-dt * 12));
            /* ---- velocidade/aceleração reais do root (para lean, cloth e cabelo) */ if (!hasPrev) {
                prevPos.copy(root.position);
                hasPrev = true;
            }
            vel.copy(root.position).sub(prevPos).divideScalar(dt);
            prevPos.copy(root.position);
            if (vel.length() > 40) vel.setLength(40);
            pVel.copy(sVel);
            sVel.lerp(vel, 1 - Math.exp(-dt * 14));
            acc.copy(sVel).sub(pVel).divideScalar(dt);
            if (acc.length() > 80) acc.setLength(80);
            sAcc.lerp(acc, 1 - Math.exp(-dt * 10));
            toLocal(sVel, vL, root.rotation.y);
            toLocal(sAcc, aL, root.rotation.y);
            const planar = Math.hypot(sVel.x, sVel.z);
            /* ---- alvos da pose */ resetTargets();
            const A_LEAN = clamp(aL.z * 0.004, -0.12, 0.12);
            switch(pose){
                case 'idle':
                    {
                        const br = sin(time * 1.8), sh = sin(time * 0.4);
                        P.bodyX.t = sh * 0.02;
                        setJ('pelvis', 0, sin(time * 0.4 + 1) * 0.05, sh * 0.035);
                        setJ('spine', 0.02 + br * 0.008, 0, -sh * 0.02);
                        setJ('chest', br * 0.016, sin(time * 0.33) * 0.05, -sh * 0.03);
                        const look = sin(time * 0.31) * 0.2 + sin(time * 0.83) * 0.06;
                        setJ('neck', 0.02, look * 0.35, 0);
                        setJ('head', 0.02 + sin(time * 0.23 + 1) * 0.05, look * 0.65, sin(time * 0.19) * 0.035 + sh * 0.02);
                        const rl = max(0, sh), rr = max(0, -sh);
                        setJ('hipL', -rr * 0.07, 0, -0.015);
                        setJ('hipR', -rl * 0.07, 0, 0.015);
                        setJ('kneeL', rr * 0.14);
                        setJ('kneeR', rl * 0.14);
                        autoFoot(1);
                        plant();
                        setJ('armL', 0.03 + br * 0.01, 0, -0.09);
                        setJ('elbowL', -0.2 - br * 0.02);
                        setJ('wristL', 0.05);
                        setJ('armR', -0.05, 0, 0.1);
                        setJ('elbowR', -0.5);
                        setJ('wristR', -0.4);
                        P.staffP.t = -0.04;
                        P.smile.t = 0.25;
                        break;
                    }
                case 'walk':
                    {
                        const rate = speed > 0.1 ? clamp(speed / 3.2, 0.6, 1.7) : 1.28;
                        const A = speed > 0.1 ? clamp(speed / (TAU * rate) * 0.95, 0.3, 0.62) : 0.42;
                        phase += dt * rate;
                        const phi = phase * TAU;
                        const sL = sin(phi), cL = cos(phi), sR = -sL, cR = -cL;
                        setJ('hipL', -sL * A + 0.03, 0, -0.015);
                        setJ('hipR', -sR * A + 0.03, 0, 0.015);
                        setJ('kneeL', 0.07 + max(0, cL) * (0.55 + A * 0.9));
                        setJ('kneeR', 0.07 + max(0, cR) * (0.55 + A * 0.9));
                        autoFoot(0.8);
                        plant();
                        setJ('pelvis', 0, sL * 0.12, sL * 0.03);
                        setJ('spine', 0.04, -sL * 0.06, -sL * 0.02);
                        setJ('chest', 0.02, -sL * 0.14, -sL * 0.025);
                        setJ('neck', 0, sL * 0.05, 0);
                        setJ('head', -0.03, sL * 0.1, 0);
                        P.bodyX.t = sL * 0.018;
                        const B = 0.2 + A * 0.4;
                        setJ('armL', sL * B, 0, -0.09);
                        setJ('elbowL', -(0.22 + max(0, -sL) * 0.3));
                        setJ('wristL', 0.05);
                        setJ('armR', -0.08 + sR * B * 0.3, 0, 0.1);
                        setJ('elbowR', -0.5 - max(0, -sR) * 0.1);
                        setJ('wristR', -0.4);
                        P.staffP.t = 0.04 + sR * 0.05;
                        P.pitch.t = clamp(planar * 0.02, 0, 0.14);
                        break;
                    }
                case 'run':
                    {
                        const rate = speed > 0.1 ? clamp(speed / 3.7, 0.8, 2.3) : 1.9;
                        const A = speed > 0.1 ? clamp(speed / (TAU * rate) * 1.1, 0.5, 0.9) : 0.7;
                        phase += dt * rate;
                        const phi = phase * TAU;
                        const sL = sin(phi), cL = cos(phi), sR = -sL, cR = -cL;
                        setJ('hipL', -sL * A, 0, -0.03);
                        setJ('hipR', -sR * A, 0, 0.03);
                        setJ('kneeL', 0.25 + max(0, cL) * 1.45);
                        setJ('kneeR', 0.25 + max(0, cR) * 1.45);
                        autoFoot(0.75);
                        plant(abs(sin(phi)) * 0.1);
                        setJ('pelvis', 0, sL * 0.2, sL * 0.05);
                        setJ('spine', 0.08, -sL * 0.1, -sL * 0.03);
                        setJ('chest', 0.12, -sL * 0.22, -sL * 0.04);
                        setJ('neck', -0.05, sL * 0.08, 0);
                        setJ('head', -0.12, sL * 0.14, 0);
                        setJ('armL', sL * 0.78, 0, -0.1);
                        setJ('elbowL', -(1.15 + max(0, -sL) * 0.3));
                        setJ('wristL', 0.1);
                        setJ('armR', -0.2 + sR * 0.35, 0, 0.12);
                        setJ('elbowR', -0.95);
                        setJ('wristR', -0.4);
                        P.staffP.t = -0.6;
                        P.staffR.t = -0.2;
                        P.pitch.t = 0.16 + clamp(planar * 0.012, 0, 0.1);
                        P.smile.t = 0.1;
                        P.furrow.t = 0.15;
                        P.flare.t = 0.25;
                        break;
                    }
                case 'jump':
                    {
                        const u = poseTime;
                        setJ('hipL', kf(u, [
                            [
                                0,
                                0.3
                            ],
                            [
                                0.14,
                                -0.9
                            ],
                            [
                                0.5,
                                -0.7
                            ]
                        ]), 0, -0.05);
                        setJ('kneeL', kf(u, [
                            [
                                0,
                                0.1
                            ],
                            [
                                0.14,
                                1.3
                            ],
                            [
                                0.5,
                                1.1
                            ]
                        ]));
                        setJ('hipR', kf(u, [
                            [
                                0,
                                0.35
                            ],
                            [
                                0.14,
                                -0.25
                            ],
                            [
                                0.5,
                                -0.2
                            ]
                        ]), 0, 0.05);
                        setJ('kneeR', kf(u, [
                            [
                                0,
                                0.1
                            ],
                            [
                                0.14,
                                0.6
                            ],
                            [
                                0.5,
                                0.5
                            ]
                        ]));
                        J.ankleL.x.t = 0.4;
                        J.ankleR.x.t = 0.35;
                        setJ('armL', kf(u, [
                            [
                                0,
                                0.2
                            ],
                            [
                                0.16,
                                -1.9
                            ],
                            [
                                0.5,
                                -1.5
                            ]
                        ]), 0, -0.55);
                        setJ('elbowL', -0.35);
                        setJ('armR', kf(u, [
                            [
                                0,
                                0.1
                            ],
                            [
                                0.16,
                                -1.3
                            ],
                            [
                                0.5,
                                -1.0
                            ]
                        ]), 0, 0.35);
                        setJ('elbowR', -0.5);
                        setJ('wristR', -0.3);
                        setJ('chest', -0.12);
                        setJ('spine', -0.05);
                        setJ('head', -0.18);
                        setJ('neck', -0.08);
                        P.staffP.t = 0.35;
                        P.staffR.t = -0.25;
                        P.lid.t = 1;
                        P.smile.t = 0.3;
                        P.mouth.t = 0.15;
                        P.flare.t = 0.2;
                        break;
                    }
                case 'fall':
                    {
                        const f = sin(time * 6);
                        setJ('hipL', -0.3 + f * 0.06, 0, -0.06);
                        setJ('kneeL', 0.45);
                        setJ('hipR', 0.05 + sin(time * 6 + 2) * 0.06, 0, 0.06);
                        setJ('kneeR', 0.35);
                        J.ankleL.x.t = 0.35;
                        J.ankleR.x.t = 0.3;
                        setJ('armL', -0.3 + sin(time * 5) * 0.1, 0, -0.95);
                        setJ('elbowL', -0.3);
                        setJ('armR', -0.55 + sin(time * 5 + 1) * 0.1, 0, 0.85);
                        setJ('elbowR', -0.3);
                        setJ('wristR', -0.2);
                        setJ('chest', -0.04);
                        setJ('head', -0.1);
                        P.staffP.t = 0.5;
                        P.staffR.t = -0.9;
                        P.lid.t = 0.95;
                        P.mouth.t = 0.2;
                        P.flare.t = 0.6;
                        break;
                    }
                case 'land':
                    {
                        const u = clamp(poseTime / 0.42, 0, 1);
                        const d = kf(u, [
                            [
                                0,
                                0.2
                            ],
                            [
                                0.3,
                                1
                            ],
                            [
                                1,
                                0
                            ]
                        ]);
                        setJ('hipL', -0.9 * d, 0, -0.1 * d);
                        setJ('hipR', -0.8 * d, 0, 0.1 * d);
                        setJ('kneeL', 1.6 * d);
                        setJ('kneeR', 1.5 * d);
                        autoFoot(1);
                        plant();
                        setJ('spine', 0.15 * d);
                        setJ('chest', 0.3 * d);
                        setJ('head', -0.2 * d);
                        setJ('armL', -0.5 * d, 0, -0.5 * d - 0.09);
                        setJ('elbowL', -0.2 - 0.3 * d);
                        setJ('armR', -0.3 * d, 0, 0.35 * d + 0.08);
                        setJ('elbowR', -0.5);
                        setJ('wristR', -0.4);
                        P.staffP.t = -0.1;
                        P.pitch.t = 0.08 * d;
                        P.flare.t = 0.4 * d;
                        break;
                    }
                case 'attack':
                    {
                        const u = clamp(poseTime / 0.42, 0, 1);
                        setJ('chest', kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.28,
                                -0.08
                            ],
                            [
                                0.5,
                                0.22
                            ],
                            [
                                1,
                                0.1
                            ]
                        ]), kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.28,
                                0.65
                            ],
                            [
                                0.5,
                                -0.55
                            ],
                            [
                                1,
                                -0.2
                            ]
                        ]));
                        setJ('pelvis', 0, kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.28,
                                0.3
                            ],
                            [
                                0.5,
                                -0.3
                            ],
                            [
                                1,
                                -0.1
                            ]
                        ]));
                        setJ('spine', kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.28,
                                -0.05
                            ],
                            [
                                0.5,
                                0.12
                            ],
                            [
                                1,
                                0.06
                            ]
                        ]));
                        setJ('head', kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.28,
                                -0.1
                            ],
                            [
                                0.5,
                                0.12
                            ],
                            [
                                1,
                                0.05
                            ]
                        ]), -J.chest.y.t * 0.5);
                        setJ('armR', kf(u, [
                            [
                                0,
                                -0.14
                            ],
                            [
                                0.28,
                                -2.45
                            ],
                            [
                                0.36,
                                -2.45
                            ],
                            [
                                0.52,
                                -0.65
                            ],
                            [
                                1,
                                -0.25
                            ]
                        ]), 0, kf(u, [
                            [
                                0,
                                0.1
                            ],
                            [
                                0.28,
                                0.45
                            ],
                            [
                                0.5,
                                0.15
                            ],
                            [
                                1,
                                0.1
                            ]
                        ]));
                        setJ('elbowR', kf(u, [
                            [
                                0,
                                -0.5
                            ],
                            [
                                0.28,
                                -1.0
                            ],
                            [
                                0.52,
                                -0.35
                            ],
                            [
                                1,
                                -0.5
                            ]
                        ]));
                        setJ('wristR', -0.3);
                        P.staffP.t = kf(u, [
                            [
                                0,
                                -0.04
                            ],
                            [
                                0.28,
                                -1.0
                            ],
                            [
                                0.36,
                                -1.05
                            ],
                            [
                                0.52,
                                1.7
                            ],
                            [
                                1,
                                1.2
                            ]
                        ]);
                        P.staffY.t = kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.28,
                                0.4
                            ],
                            [
                                0.52,
                                -0.5
                            ],
                            [
                                1,
                                -0.3
                            ]
                        ]);
                        P.staffR.t = kf(u, [
                            [
                                0,
                                -0.06
                            ],
                            [
                                0.28,
                                -0.3
                            ],
                            [
                                0.52,
                                -0.1
                            ],
                            [
                                1,
                                -0.1
                            ]
                        ]);
                        setJ('armL', -0.6, 0, -0.5);
                        setJ('elbowL', -0.8); // FK de fallback; o IK assume com gripL
                        P.gripL.t = kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.15,
                                1
                            ],
                            [
                                1,
                                1
                            ]
                        ]);
                        P.gripY.t = -0.35;
                        P.curlL.t = 1;
                        setJ('hipL', kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.28,
                                0.12
                            ],
                            [
                                0.5,
                                -0.75
                            ],
                            [
                                1,
                                -0.5
                            ]
                        ]), 0, -0.05);
                        setJ('kneeL', kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.28,
                                0.2
                            ],
                            [
                                0.5,
                                0.7
                            ],
                            [
                                1,
                                0.5
                            ]
                        ]));
                        setJ('hipR', kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.28,
                                -0.1
                            ],
                            [
                                0.5,
                                0.5
                            ],
                            [
                                1,
                                0.35
                            ]
                        ]), 0, 0.05);
                        setJ('kneeR', kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.28,
                                0.1
                            ],
                            [
                                0.5,
                                0.5
                            ],
                            [
                                1,
                                0.35
                            ]
                        ]));
                        autoFoot(0.9);
                        plant();
                        P.bodyZ.t = kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.28,
                                -0.08
                            ],
                            [
                                0.5,
                                0.25
                            ],
                            [
                                1,
                                0.15
                            ]
                        ]);
                        P.pitch.t = kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.28,
                                -0.08
                            ],
                            [
                                0.5,
                                0.18
                            ],
                            [
                                1,
                                0.1
                            ]
                        ]);
                        P.mouth.t = kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.3,
                                0
                            ],
                            [
                                0.45,
                                0.6
                            ],
                            [
                                1,
                                0.2
                            ]
                        ]);
                        P.furrow.t = 0.7;
                        P.lid.t = 0.95;
                        P.flare.t = 0.3;
                        P.magic.t = 0.15;
                        break;
                    }
                case 'dodge':
                    {
                        const u = clamp(poseTime / 0.42, 0, 1);
                        const tuck = kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.15,
                                0.3
                            ],
                            [
                                0.35,
                                1
                            ],
                            [
                                0.7,
                                1
                            ],
                            [
                                0.9,
                                0.2
                            ],
                            [
                                1,
                                0
                            ]
                        ]);
                        P.pitch.t = kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.12,
                                0.25
                            ],
                            [
                                0.8,
                                TAU - 0.3
                            ],
                            [
                                1,
                                TAU
                            ]
                        ]);
                        P.bodyY.t = -0.4 * tuck;
                        setJ('hipL', -1.35 * tuck, 0, -0.05);
                        setJ('hipR', -1.3 * tuck, 0, 0.05);
                        setJ('kneeL', 2.0 * tuck);
                        setJ('kneeR', 1.95 * tuck);
                        J.ankleL.x.t = 0.4 * tuck;
                        J.ankleR.x.t = 0.4 * tuck;
                        setJ('spine', 0.4 * tuck);
                        setJ('chest', 0.6 * tuck);
                        setJ('head', 0.5 * tuck);
                        setJ('armL', -1.0 * tuck, 0, -0.2);
                        setJ('elbowL', -1.4 * tuck - 0.2);
                        setJ('armR', -1.0 * tuck - 0.05, 0, 0.2);
                        setJ('elbowR', -1.2 * tuck - 0.3);
                        setJ('wristR', -0.3);
                        P.staffP.t = P.pitch.t - 0.04 + 0.5 * tuck;
                        P.curlL.t = 0.8;
                        P.lid.t = 0.5;
                        P.flare.t = 0.5;
                        P.furrow.t = 0.3;
                        break;
                    }
                case 'guard':
                    {
                        setJ('armR', -0.55, 0, 0.18);
                        setJ('elbowR', -1.35);
                        setJ('wristR', -0.2);
                        P.staffP.t = 0.15;
                        P.staffR.t = -1.3;
                        P.staffY.t = 0;
                        setJ('armL', -0.6, 0, -0.4);
                        setJ('elbowL', -1.0);
                        P.gripL.t = 1;
                        P.gripY.t = -0.5;
                        P.curlL.t = 1;
                        setJ('hipL', -0.35, 0, -0.1);
                        setJ('kneeL', 0.65);
                        setJ('hipR', 0.3, 0, 0.1);
                        setJ('kneeR', 0.55);
                        autoFoot(1);
                        plant();
                        setJ('spine', 0.08);
                        setJ('chest', 0.12 + sin(time * 3) * 0.01);
                        setJ('head', 0.06);
                        setJ('pelvis', 0, 0.2);
                        P.bodyZ.t = -0.05;
                        P.pitch.t = 0.08;
                        P.furrow.t = 0.5;
                        P.lid.t = 0.9;
                        P.magic.t = 0.3;
                        break;
                    }
                case 'cast':
                    {
                        const u = clamp(poseTime / 0.58, 0, 1);
                        setJ('armR', kf(u, [
                            [
                                0,
                                -0.14
                            ],
                            [
                                0.22,
                                -0.75
                            ],
                            [
                                0.4,
                                -1.5
                            ],
                            [
                                1,
                                -1.35
                            ]
                        ]), 0, kf(u, [
                            [
                                0,
                                0.1
                            ],
                            [
                                0.4,
                                0.05
                            ],
                            [
                                1,
                                0.05
                            ]
                        ]));
                        setJ('elbowR', kf(u, [
                            [
                                0,
                                -0.5
                            ],
                            [
                                0.22,
                                -1.0
                            ],
                            [
                                0.4,
                                -0.35
                            ],
                            [
                                1,
                                -0.4
                            ]
                        ]));
                        setJ('wristR', -0.2);
                        P.staffP.t = kf(u, [
                            [
                                0,
                                -0.04
                            ],
                            [
                                0.22,
                                -0.5
                            ],
                            [
                                0.4,
                                1.05
                            ],
                            [
                                1,
                                0.95
                            ]
                        ]);
                        setJ('armL', kf(u, [
                            [
                                0,
                                0.03
                            ],
                            [
                                0.25,
                                -0.4
                            ],
                            [
                                0.4,
                                -1.25
                            ],
                            [
                                1,
                                -1.15
                            ]
                        ]), 0, kf(u, [
                            [
                                0,
                                -0.09
                            ],
                            [
                                0.4,
                                -0.45
                            ],
                            [
                                1,
                                -0.4
                            ]
                        ]));
                        setJ('elbowL', kf(u, [
                            [
                                0,
                                -0.2
                            ],
                            [
                                0.4,
                                -0.45
                            ],
                            [
                                1,
                                -0.4
                            ]
                        ]));
                        setJ('wristL', -0.1);
                        P.curlL.t = 0;
                        setJ('chest', kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.22,
                                -0.14
                            ],
                            [
                                0.4,
                                0.1
                            ],
                            [
                                1,
                                0.05
                            ]
                        ]), -0.12);
                        setJ('head', kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.22,
                                -0.18
                            ],
                            [
                                0.4,
                                -0.05
                            ],
                            [
                                1,
                                -0.08
                            ]
                        ]));
                        setJ('hipL', -0.25, 0, -0.1);
                        setJ('kneeL', 0.3);
                        setJ('hipR', 0.2, 0, 0.1);
                        setJ('kneeR', 0.25);
                        autoFoot(1);
                        plant();
                        P.pitch.t = kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.22,
                                -0.06
                            ],
                            [
                                0.4,
                                0.05
                            ],
                            [
                                1,
                                0.03
                            ]
                        ]);
                        P.magic.t = kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.25,
                                0.6
                            ],
                            [
                                0.45,
                                1
                            ],
                            [
                                1,
                                0.85
                            ]
                        ]);
                        P.lid.t = 0.95;
                        P.furrow.t = 0.2;
                        P.flare.t = 0.3;
                        break;
                    }
                case 'hit':
                    {
                        const u = clamp(poseTime / 0.28, 0, 1);
                        const e = kf(u, [
                            [
                                0,
                                0
                            ],
                            [
                                0.12,
                                1
                            ],
                            [
                                0.45,
                                0.45
                            ],
                            [
                                1,
                                0
                            ]
                        ]);
                        setJ('chest', -0.4 * e, 0.25 * e);
                        setJ('spine', -0.12 * e);
                        setJ('head', -0.45 * e, 0, 0.15 * e);
                        setJ('hipL', 0.2 * e, 0, -0.03);
                        setJ('kneeL', 0.35 * e);
                        setJ('hipR', -0.25 * e, 0, 0.03);
                        setJ('kneeR', 0.4 * e);
                        autoFoot(1);
                        plant();
                        setJ('armL', 0.35 * e + 0.03, 0, -0.4 * e - 0.09);
                        setJ('elbowL', -0.2);
                        setJ('armR', -0.05 + 0.3 * e, 0, 0.1);
                        setJ('elbowR', -0.5);
                        setJ('wristR', -0.4);
                        P.bodyZ.t = -0.15 * e;
                        P.pitch.t = -0.1 * e;
                        P.staffP.t = -0.04 - 0.2 * e;
                        P.lid.t = 0.25;
                        P.furrow.t = 0.8;
                        P.mouth.t = 0.65 * e;
                        P.ear.t = -0.5 * e;
                        P.flare.t = 0.3 * e;
                        break;
                    }
                case 'defeat':
                    {
                        const kneel = kf(poseTime, [
                            [
                                0,
                                0
                            ],
                            [
                                0.45,
                                1
                            ],
                            [
                                1.2,
                                1
                            ]
                        ]);
                        const fall = kf(poseTime, [
                            [
                                0,
                                0
                            ],
                            [
                                0.45,
                                0
                            ],
                            [
                                1.0,
                                1
                            ],
                            [
                                1.2,
                                1
                            ]
                        ]);
                        setJ('hipL', lerp(0, -0.15, kneel) + 0.2 * fall, 0, -0.04);
                        setJ('hipR', lerp(0, -0.15, kneel) + 0.2 * fall, 0, 0.04);
                        setJ('kneeL', lerp(0, 1.65, kneel) - 1.1 * fall);
                        setJ('kneeR', lerp(0, 1.6, kneel) - 1.05 * fall);
                        J.ankleL.x.t = 0.5 * kneel;
                        J.ankleR.x.t = 0.5 * kneel;
                        P.bodyY.t = -0.55 * kneel - 0.38 * fall;
                        P.pitch.t = -1.52 * fall;
                        setJ('spine', 0.3 * kneel * (1 - fall));
                        setJ('chest', 0.45 * kneel * (1 - fall) - 0.1 * fall);
                        setJ('head', 0.5 * kneel * (1 - fall), 0.3 * fall);
                        setJ('neck', 0.2 * kneel * (1 - fall));
                        setJ('armL', 0.1, 0, -0.2 - 0.6 * fall);
                        setJ('elbowL', -0.3);
                        setJ('armR', 0.1, 0, 0.2 + 0.7 * fall);
                        setJ('elbowR', -0.3);
                        setJ('wristR', 0.1);
                        P.staffP.t = -0.04;
                        P.staffR.t = -0.4 - 1.1 * fall;
                        P.curlR.t = 1 - 0.7 * fall;
                        P.curlL.t = 0.2;
                        P.lid.t = lerp(0.78, 0.02, kf(poseTime, [
                            [
                                0,
                                0
                            ],
                            [
                                0.5,
                                0.3
                            ],
                            [
                                1.0,
                                1
                            ]
                        ]));
                        P.mouth.t = 0.2 * kneel;
                        P.ear.t = -0.7 * kneel;
                        break;
                    }
                case 'fly':
                    {
                        P.pitch.t = 0.65 + clamp(planar / 10, 0, 0.3);
                        P.bodyY.t = 0.45 + sin(time * 1.9) * 0.06;
                        setJ('chest', -0.12);
                        setJ('neck', -0.2);
                        setJ('head', -0.35);
                        setJ('hipL', 0.25 + sin(time * 2.1) * 0.06, 0, -0.06);
                        setJ('kneeL', 0.5);
                        setJ('hipR', 0.1 + sin(time * 2.1 + 1) * 0.06, 0, 0.06);
                        setJ('kneeR', 0.65);
                        J.ankleL.x.t = 0.55;
                        J.ankleR.x.t = 0.55;
                        setJ('armL', -0.75 + sin(time * 1.7) * 0.05, 0, -0.35);
                        setJ('elbowL', -0.35);
                        setJ('armR', -0.9, 0, 0.3);
                        setJ('elbowR', -0.5);
                        setJ('wristR', -0.2);
                        P.staffP.t = 1.35;
                        P.staffR.t = 0;
                        P.wind.t = 1;
                        P.smile.t = 0.45;
                        P.lid.t = 0.85;
                        P.flare.t = 0.4;
                        P.magic.t = 0.25;
                        break;
                    }
            }
            /* ---- camadas globais sobre qualquer pose */ if (pose !== 'dodge' && pose !== 'defeat') {
                P.pitch.t += A_LEAN;
                P.roll.t += clamp(-turnVel * 0.018, -0.3, 0.3);
            }
            if (pose === 'idle' || pose === 'walk' || pose === 'run' || pose === 'guard') {
                // cabeça/tronco "puxam" a curva antes do corpo
                addJ('head', 0, clamp(facingErr * 0.5, -0.5, 0.5));
                addJ('chest', 0, clamp(facingErr * 0.2, -0.2, 0.2));
            }
            // dedos: cada mão acompanha o alvo de "curl"
            // ouvidinhos: twitch ocasional
            earWait -= dt;
            if (earWait <= 0) {
                P.ear.v += 0.45;
                earWait = 2.5 + Math.random() * 5;
            }
            // piscar
            if (blinkWait > 0) blinkWait -= dt;
            else {
                blinkP += dt / 0.15;
                if (blinkP >= 1) {
                    blinkP = 0;
                    blinkWait = 1.8 + Math.random() * 4;
                }
            }
            const blink = blinkWait > 0 ? 0 : sin(blinkP * PI);
            /* ---- integração das molas */ const [k0, zeta] = SPRING[pose];
            const steps = min(8, Math.ceil(dt / (1 / 180)));
            const h = dt / steps;
            // evita "desenrolar" a cambalhota completa ao sair do dodge
            if (pose !== 'dodge' && P.pitch.v > PI) P.pitch.v -= TAU;
            const kSoft = 160, dSoft = 2 * sqrt(kSoft);
            for(let s = 0; s < steps; s++){
                for (const n of JOINTS){
                    const j = J[n];
                    const k = k0 * JOINT_K[n];
                    const d = 2 * zeta * sqrt(k);
                    stepChan(j.x, k, d, h);
                    stepChan(j.y, k, d, h);
                    stepChan(j.z, k, d, h);
                }
                const dHard = 2 * zeta * sqrt(k0);
                for (const n of HARD_PARAMS)stepChan(P[n], k0, dHard, h);
                for (const n of SOFT_PARAMS)stepChan(P[n], kSoft, dSoft, h);
            }
            /* ---- aplica no esqueleto */ for (const n of JOINTS){
                const j = J[n];
                j.node.rotation.set(j.x.v, j.y.v, j.z.v);
            }
            pivot.position.set(P.bodyX.v, PIV + P.bodyY.v, P.bodyZ.v);
            pivot.rotation.set(P.pitch.v, 0, P.roll.v);
            // dedos
            const curls = [
                P.curlL.v,
                P.curlR.v
            ];
            hands.forEach((hd, i)=>{
                const c = clamp(curls[i], 0, 1);
                hd.fingers.forEach((f, fi)=>{
                    f.prox.rotation.x = -(0.12 + c * 1.2) - fi * 0.02 * c;
                    f.dist.rotation.x = -(0.1 + c * 1.05);
                });
                hd.thumb.rotation.x = -(0.15 + c * 0.6);
                hd.thumb.rotation.z = (i === 0 ? -1 : 1) * (0.5 - c * 0.25);
            });
            /* ---- cajado: orientação em espaço-mundo, independente da lag das molas do braço */ staffMount.getWorldQuaternion(qParent);
            root.getWorldQuaternion(qRoot);
            eul.set(P.staffP.v, P.staffY.v, P.staffR.v, 'YXZ');
            qDesired.setFromEuler(eul).premultiply(qRoot);
            staff.quaternion.copy(qParent).invert().multiply(qDesired);
            /* ---- IK da mão esquerda segurando o cajado */ const g = clamp(P.gripL.v, 0, 1);
            if (g > 0.01) {
                staff.updateWorldMatrix(true, false);
                chest.updateWorldMatrix(true, false);
                tmp.set(0, P.gripY.v, 0.0);
                staff.localToWorld(tmp);
                chest.worldToLocal(tmp);
                const sh = armNodes[0].position;
                solveArm(tmp.x - sh.x, tmp.y - sh.y, tmp.z - sh.z, ik);
                const fkX = J.armL.x.v, fkZ = J.armL.z.v, fkE = J.elbowL.x.v;
                J.armL.node.rotation.x = fkX + g * wrapAngle(ik.x - fkX);
                J.armL.node.rotation.z = lerp(fkZ, ik.z, g);
                J.elbowL.node.rotation.x = lerp(fkE, ik.e, g);
            }
            /* ---- expressão */ const lidRot = lerp(1.15, -0.32, clamp(P.lid.v, 0, 1.1));
            const lidFinal = lerp(lidRot, 1.15, blink);
            for (const l of lids)l.rotation.x = lidFinal;
            brows.forEach((b, i)=>{
                const side = i === 0 ? -1 : 1;
                b.position.y = BROW_Y + P.brow.v * 0.02 - P.furrow.v * 0.012;
                b.rotation.z = side * P.furrow.v * 0.35;
            });
            const gaze = clamp(-J.head.y.v * 0.8, -1, 1);
            for (const ir of irises)ir.position.x = gaze * 0.012;
            mouthLine.scale.set(1, clamp(0.25 + P.smile.v * 0.9, 0.05, 1.2), 1);
            mouthLine.visible = P.mouth.v < 0.25;
            mouthOpen.visible = P.mouth.v > 0.06;
            mouthOpen.scale.set(1.1, 0.15 + clamp(P.mouth.v, 0, 1) * 1.3, 0.5);
            ears.forEach((e, i)=>{
                const side = i === 0 ? -1 : 1;
                e.rotation.z = side * P.ear.v * 0.5;
                e.rotation.x = -P.ear.v * 0.15;
            });
            /* ---- física secundária */ const flare = P.flare.v + clamp(-sVel.y * 0.08, 0, 0.9);
            const fx = clamp(-aL.x * 0.018 - vL.x * 0.1, -4, 4);
            const fz = clamp(-aL.z * 0.018 - vL.z * 0.115 - P.wind.v * 3.2, -5, 5);
            const fL = -J.hipL.x.v, fR = -J.hipR.x.v;
            for (const p of panels){
                const nz = cos(p.phi);
                const demand = max(0, sin(fL) * 0.9 * nz, sin(fR) * 0.9 * nz);
                p.chain.restX = -(0.1 + demand * 1.05 + flare * 0.6 + P.magic.v * 0.5);
            }
            cape.restX = -(0.06 + flare * 0.5 + P.magic.v * 0.3);
            for (const t of tails){
                t.chain.restZ = t.side * (0.12 + P.magic.v * 0.6 + flare * 0.2);
                t.chain.restX = P.wind.v * 0.3 - P.magic.v * 0.1;
            }
            for (const l of sideLocks)l.chain.restZ = l.side * (0.1 + P.magic.v * 0.2);
            for(let s = 0; s < steps; s++)for (const ch of chains)stepChain(ch, h, fx, fz, time);
            for (const ch of chains)ch.segs.forEach((seg, i)=>seg.rotation.set(ch.x[i], 0, ch.z[i]));
            /* ---- brilho do foco, halos de magia, luz */ const magic = clamp(P.magic.v, 0, 1.2);
            focus.scale.setScalar(0.93 + sin(time * 1.8) * 0.08 + magic * 0.35);
            mat.glow.emissiveIntensity = 1.2 + magic * 1.6 + sin(time * 5) * 0.1 * magic;
            aura.intensity = 0.85 + magic * 1.6;
            const showHalo = magic > 0.12;
            haloA.visible = haloB.visible = showHalo;
            if (showHalo) {
                haloA.scale.setScalar(0.4 + magic * 0.7);
                haloB.scale.setScalar(0.3 + magic * 0.8);
                haloA.rotation.set(time * 1.6, time * 0.9, 0);
                haloB.rotation.set(-time * 1.1, 0.8, time * 1.4);
                mat.halo.opacity = clamp(magic * 0.8, 0, 0.8);
            }
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/magic.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MagicSystem",
    ()=>MagicSystem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world.ts [app-client] (ecmascript)");
;
;
const COST = {
    zoltraak: 10,
    vollzanbel: 34,
    judradjim: 27,
    shield: 20,
    flight: 12
};
const COOLDOWN = {
    zoltraak: .38,
    vollzanbel: 4.2,
    judradjim: 3.4,
    shield: 9,
    flight: .7
};
/* ------------------------------------------------------------------ *
 *  Tunables / helpers
 * ------------------------------------------------------------------ */ const TAU = Math.PI * 2;
const UP = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 1, 0);
const FWD = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, 1);
/** Scale for every point light the spells use. Raise it if your scene is bright / lights are physically based and look dim. */ const LIGHT_GAIN = 1;
/** Point lights are pooled (never added/removed at runtime) so casting never triggers a shader recompile hitch. */ const LIGHT_SLOTS = 8;
const clamp01 = (x)=>Math.min(1, Math.max(0, x));
const rr = (a, b)=>a + Math.random() * (b - a);
const easeOutCubic = (x)=>1 - Math.pow(1 - x, 3);
const easeOutBack = (x)=>{
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const col = (hex)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](hex);
/** Frieren palette: muted, soft, slightly desaturated. Gold for basic magic, ember orange for fire, pale blue for lightning, mint for barrier/flight. */ const C = {
    paleGold: col('#fff1c9'),
    gold: col('#f3d98f'),
    goldDeep: col('#c99a45'),
    fireHot: col('#fff0b8'),
    fire: col('#ff9a3c'),
    ember: col('#7a1d08'),
    smokeA: col('#4a3b33'),
    smokeB: col('#1b1513'),
    dust: col('#9a8a74'),
    dustB: col('#6a5d4e'),
    debris: col('#3a2b1f'),
    bolt: col('#f4fbff'),
    boltGlow: col('#86c3ee'),
    barrier: col('#a8e3d2'),
    barrierHot: col('#eaf8e2'),
    mana: col('#bfeedd'),
    petalW: col('#fff6f2'),
    petalP: col('#f7c8d6'),
    petalB: col('#c4defa')
};
/* ------------------------------------------------------------------ *
 *  GLSL
 * ------------------------------------------------------------------ */ const GLSL_SRGB = `vec3 toSRGB(vec3 c){return pow(max(c,vec3(0.0)),vec3(1.0/2.2));}`;
const GLSL_NOISE = `
float hash13(vec3 p){p=fract(p*.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}
float vnoise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
return mix(mix(mix(hash13(i),hash13(i+vec3(1,0,0)),f.x),mix(hash13(i+vec3(0,1,0)),hash13(i+vec3(1,1,0)),f.x),f.y),
mix(mix(hash13(i+vec3(0,0,1)),hash13(i+vec3(1,0,1)),f.x),mix(hash13(i+vec3(0,1,1)),hash13(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*vnoise(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s;}`;
const PARTICLE_VS = `
attribute vec3 aColor; attribute vec4 aParams; uniform float uScale; varying vec3 vColor; varying vec4 vParams;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;
gl_PointSize=clamp(aParams.x*uScale/max(-mv.z,.1),0.0,300.0);vColor=aColor;vParams=aParams;}`;
// kind: 0 soft glow, 1 four-point spark, 2 petal, 3 soft disc (smoke / debris)
const PARTICLE_FS = `
${GLSL_SRGB}
varying vec3 vColor; varying vec4 vParams;
void main(){
  vec2 p=gl_PointCoord*2.0-1.0; float c=cos(vParams.z),s=sin(vParams.z); p=vec2(c*p.x-s*p.y,s*p.x+c*p.y);
  float r=length(p); float k=vParams.w; float a;
  if(k<.5){a=pow(max(1.0-r,0.0),2.0)+exp(-r*r*14.0)*.5;}
  else if(k<1.5){float arm=max(0.,1.-abs(p.x)*10.)*max(0.,1.-abs(p.y))+max(0.,1.-abs(p.y)*10.)*max(0.,1.-abs(p.x));a=arm+exp(-r*r*20.)*.9;a*=1.-smoothstep(.85,1.,r);}
  else if(k<2.5){float w=.62*(1.-p.x*p.x)*(.7+.3*(p.x*.5+.5));float d=abs(p.y);a=(1.-smoothstep(w-.16,w,d))*step(abs(p.x),1.0);a*=.78+.22*(1.-d/max(w,.01));a*=1.-.3*(1.-smoothstep(.0,.08,d));}
  else{a=1.-smoothstep(.25,1.,r);}
  if(a<.003)discard;
  gl_FragColor=vec4(toSRGB(vColor),clamp(a,0.,1.)*vParams.y);
}`;
const LANCE_VS = `varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=-mv.xyz;gl_Position=projectionMatrix*mv;}`;
const LANCE_FS = `${GLSL_SRGB}
uniform float uTime; uniform float uGain; uniform vec3 uA; uniform vec3 uB; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main(){
  float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),1.5);
  float sp=.5+.5*sin(vUv.x*6.2831853*3.+vUv.y*26.-uTime*30.);
  float tp=sin(vUv.y*3.14159);
  vec3 c=mix(uA,uB,clamp(f*1.2,0.,1.))*(1.+sp*.35);
  float a=(.5+.5*(1.-f))*(.6+.4*sp)*(.35+.65*tp)*uGain;
  gl_FragColor=vec4(toSRGB(c*1.25),clamp(a,0.,1.));
}`;
const FRESNEL_VS = LANCE_VS;
const FRESNEL_FS = `${GLSL_SRGB}
uniform vec3 uColor; uniform float uPower; uniform float uGain; uniform float uAlpha; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),uPower);
gl_FragColor=vec4(toSRGB(uColor*(.4+f*1.6)*uGain),clamp((f+.04)*uAlpha,0.,1.));}`;
const FIRE_VS = `${GLSL_NOISE}
uniform float uTime; uniform float uSeed; varying vec3 vP; varying vec3 vN; varying vec3 vV;
void main(){
  float n=fbm(position*1.8+vec3(uSeed,uTime*2.0,uSeed*.7));
  vec3 p=position*(1.0+(n-.5)*.55);
  vP=position;vec4 mv=modelViewMatrix*vec4(p,1.);vN=normalize(normalMatrix*normal);vV=-mv.xyz;gl_Position=projectionMatrix*mv;
}`;
const FIRE_FS = `${GLSL_NOISE}${GLSL_SRGB}
uniform float uT; uniform float uTime; uniform float uSeed; varying vec3 vP; varying vec3 vN; varying vec3 vV;
void main(){
  float n=fbm(vP*2.6+vec3(uSeed,-uTime*3.0,uSeed));
  float rim=pow(1.-abs(dot(normalize(vN),normalize(vV))),1.6);
  float heat=clamp(n*1.15+(1.-rim)*.35-uT*.95,0.,1.);
  vec3 c=mix(vec3(.35,.05,.02),vec3(1.,.42,.08),smoothstep(.1,.45,heat));
  c=mix(c,vec3(1.,.82,.4),smoothstep(.45,.8,heat));
  c=mix(c,vec3(1.,.97,.85),smoothstep(.8,1.,heat));
  float a=smoothstep(.0,.25,heat+(1.-uT)*.25-.1)*(1.-smoothstep(.55,1.,uT))*(.55+.45*rim);
  gl_FragColor=vec4(toSRGB(c*1.35),clamp(a,0.,1.));
}`;
const SHIELD_VS = `varying vec2 vUv; varying vec3 vW; varying vec3 vNv; varying vec3 vVv;
void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vec4 mv=viewMatrix*w;vNv=normalize(normalMatrix*normal);vVv=-mv.xyz;gl_Position=projectionMatrix*mv;}`;
const SHIELD_FS = `${GLSL_SRGB}
uniform float uTime; uniform float uFlash; uniform float uAlpha; uniform float uHitT; uniform vec3 uHit; uniform vec3 uColA; uniform vec3 uColB;
varying vec2 vUv; varying vec3 vW; varying vec3 vNv; varying vec3 vVv;
void main(){
  vec2 p=(vUv-.5)*2.;
  float h=max(abs(p.y),abs(p.y)*.5+abs(p.x)*.866025)/.866025;
  float inside=1.-smoothstep(.93,1.,h);
  float border=smoothstep(.74,.95,h)*inside;
  float rim=pow(1.-abs(dot(normalize(vNv),normalize(vVv))),2.);
  float rings=.5+.5*sin(h*22.-uTime*1.4);
  float scan=.5+.5*sin(vW.y*18.-uTime*2.4);
  float d=distance(vW,uHit);
  float wave=exp(-pow((d-uHitT*2.6)*3.2,2.))*(1.-uHitT);
  float a=(.09+border*.55+rim*.18+scan*.04+rings*.025*(1.-border)+uFlash*.5+wave*.9)*inside*uAlpha;
  vec3 c=mix(uColA,uColB,clamp(border*.7+uFlash*.8+wave+rim*.3,0.,1.));
  gl_FragColor=vec4(toSRGB(c),clamp(a,0.,1.));
}`;
/* ------------------------------------------------------------------ *
 *  Procedural textures: Frieren-style magic circles + soft glow
 * ------------------------------------------------------------------ */ function sigilTexture(style, seed) {
    const S = 1024, h = S / 2, cv = document.createElement('canvas');
    cv.width = cv.height = S;
    const g = cv.getContext('2d');
    g.translate(h, h);
    g.strokeStyle = '#fff';
    g.fillStyle = '#fff';
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.shadowColor = '#fff';
    g.shadowBlur = 9;
    let s = seed >>> 0;
    const rnd = ()=>(s = Math.imul(s, 1664525) + 1013904223 >>> 0) / 4294967296;
    const ring = (r, w)=>{
        g.lineWidth = w;
        g.beginPath();
        g.arc(0, 0, r, 0, TAU);
        g.stroke();
    };
    const poly = (r, n, rot, w, step = 1)=>{
        g.lineWidth = w;
        g.beginPath();
        for(let i = 0; i < n; i++){
            const a = rot + i * step / n * TAU;
            if (i) g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            else g.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        g.closePath();
        g.stroke();
    };
    const ticks = (r0, r1, n, w)=>{
        g.lineWidth = w;
        g.beginPath();
        for(let i = 0; i < n; i++){
            const a = i / n * TAU, c = Math.cos(a), sn = Math.sin(a);
            g.moveTo(c * r0, sn * r0);
            g.lineTo(c * r1, sn * r1);
        }
        g.stroke();
    };
    /** Pseudo-glyphs: random short polylines inside a band — reads as an unknown runic script. */ const runes = (r0, r1, n, w)=>{
        g.lineWidth = w;
        const len = r1 - r0, bw = (r0 + r1) / 2 * TAU / n * .32;
        for(let i = 0; i < n; i++){
            g.save();
            g.rotate(i / n * TAU);
            g.beginPath();
            g.moveTo(r0 + rnd() * len, (rnd() - .5) * 2 * bw);
            const k = 3 + Math.floor(rnd() * 3);
            for(let j = 0; j < k; j++)g.lineTo(r0 + rnd() * len, (rnd() - .5) * 2 * bw);
            g.stroke();
            if (rnd() > .5) {
                g.beginPath();
                g.arc(r0 + rnd() * len, (rnd() - .5) * 2 * bw, 3, 0, TAU);
                g.fill();
            }
            g.restore();
        }
    };
    if (style === 'rune') {
        ring(488, 6);
        ring(470, 2);
        ticks(436, 466, 96, 2);
        ring(430, 3);
        runes(372, 422, 44, 3);
        ring(364, 3);
        poly(356, 3, -Math.PI / 2, 4);
        poly(356, 3, Math.PI / 2, 4);
        for(let i = 0; i < 6; i++){
            const a = -Math.PI / 2 + i * Math.PI / 3;
            g.lineWidth = 3;
            g.beginPath();
            g.arc(Math.cos(a) * 356, Math.sin(a) * 356, 16, 0, TAU);
            g.stroke();
        }
        ring(262, 4);
        poly(262, 6, 0, 3);
        runes(190, 250, 28, 3);
        ring(182, 3);
        poly(182, 5, -Math.PI / 2, 3, 2);
        ring(70, 5);
    } else if (style === 'sun') {
        ring(488, 5);
        g.lineWidth = 3;
        for(let i = 0; i < 36; i++){
            const a = i / 36 * TAU, w = .05;
            g.beginPath();
            g.moveTo(Math.cos(a - w) * 436, Math.sin(a - w) * 436);
            g.lineTo(Math.cos(a) * 486, Math.sin(a) * 486);
            g.lineTo(Math.cos(a + w) * 436, Math.sin(a + w) * 436);
            g.stroke();
        }
        ring(430, 4);
        runes(372, 422, 40, 3);
        ring(364, 3);
        poly(350, 8, -Math.PI / 2, 3, 3);
        poly(350, 8, -Math.PI / 2, 2);
        ring(250, 4);
        for(let i = 0; i < 16; i++){
            const a = i / 16 * TAU, w = .09;
            g.lineWidth = 3;
            g.beginPath();
            g.moveTo(Math.cos(a - w) * 204, Math.sin(a - w) * 204);
            g.lineTo(Math.cos(a) * 246, Math.sin(a) * 246);
            g.lineTo(Math.cos(a + w) * 204, Math.sin(a + w) * 204);
            g.stroke();
        }
        ring(190, 3);
        ticks(70, 190, 12, 2);
        ring(70, 5);
        g.beginPath();
        g.arc(0, 0, 24, 0, TAU);
        g.fill();
    } else if (style === 'arc') {
        ring(488, 6);
        ring(470, 2);
        for(let i = 0; i < 12; i++){
            g.save();
            g.rotate(i / 12 * TAU);
            g.lineWidth = 4;
            g.beginPath();
            g.moveTo(404, 0);
            let x = 404;
            [
                -1,
                1,
                -1,
                1,
                -1
            ].forEach((d)=>{
                x += 14;
                g.lineTo(x, d * 18);
            });
            g.lineTo(x + 14, 0);
            g.stroke();
            g.restore();
        }
        ring(396, 3);
        poly(386, 3, -Math.PI / 2, 4);
        poly(386, 3, Math.PI / 2, 4);
        ring(300, 3);
        poly(300, 4, Math.PI / 4, 3);
        poly(300, 4, 0, 3);
        runes(220, 280, 24, 3);
        ring(212, 4);
        ticks(120, 205, 24, 2);
        ring(110, 3);
        poly(110, 3, -Math.PI / 2, 3);
        ring(34, 5);
    } else {
        // wind: Frieren's flower-field motif
        ring(488, 5);
        runes(430, 478, 48, 3);
        ring(422, 3);
        for(let i = 0; i < 8; i++){
            g.save();
            g.rotate(i / 8 * TAU);
            g.lineWidth = 4;
            g.beginPath();
            g.moveTo(96, 0);
            g.quadraticCurveTo(250, -150, 410, 0);
            g.quadraticCurveTo(250, 150, 96, 0);
            g.stroke();
            g.lineWidth = 2;
            g.beginPath();
            g.moveTo(130, 0);
            g.lineTo(380, 0);
            g.stroke();
            g.restore();
        }
        for(let i = 0; i < 8; i++){
            g.save();
            g.rotate((i + .5) / 8 * TAU);
            g.lineWidth = 3;
            g.beginPath();
            g.moveTo(96, 0);
            g.quadraticCurveTo(190, -70, 290, 0);
            g.quadraticCurveTo(190, 70, 96, 0);
            g.stroke();
            g.restore();
        }
        ring(96, 5);
        ring(70, 2);
        poly(60, 6, 0, 3);
        ring(22, 4);
    }
    const t = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](cv);
    t.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    t.anisotropy = 8;
    return t;
}
function glowTexture() {
    const S = 128, cv = document.createElement('canvas');
    cv.width = cv.height = S;
    const g = cv.getContext('2d'), gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(.25, 'rgba(255,255,255,.55)');
    gr.addColorStop(.55, 'rgba(255,255,255,.14)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, S, S);
    const t = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](cv);
    t.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    return t;
}
const INNER = {
    rune: 'arc',
    sun: 'rune',
    arc: 'rune',
    wind: 'rune'
};
/** Disposes geometry/material of an object tree, skipping anything flagged userData.keep (shared resources). */ function disposeTree(o) {
    o.traverse((c)=>{
        const m = c;
        if (m.geometry && !(c instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sprite"]) && !m.geometry.userData.keep) m.geometry.dispose();
        const mat = m.material;
        if (mat) (Array.isArray(mat) ? mat : [
            mat
        ]).forEach((x)=>{
            if (!x.userData.keep) x.dispose();
        });
    });
}
const PS = 23;
class Particles {
    cap;
    points;
    d;
    n;
    pos;
    colA;
    par;
    uniforms;
    constructor(cap, additive){
        this.cap = cap;
        this.n = 0;
        this.uniforms = {
            uScale: {
                value: 780
            }
        };
        this.d = new Float32Array(cap * PS);
        this.pos = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferAttribute"](new Float32Array(cap * 3), 3).setUsage(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicDrawUsage"]);
        this.colA = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferAttribute"](new Float32Array(cap * 3), 3).setUsage(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicDrawUsage"]);
        this.par = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferAttribute"](new Float32Array(cap * 4), 4).setUsage(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicDrawUsage"]);
        const geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
        geo.setAttribute('position', this.pos);
        geo.setAttribute('aColor', this.colA);
        geo.setAttribute('aParams', this.par);
        geo.setDrawRange(0, 0);
        const mat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
            uniforms: this.uniforms,
            vertexShader: PARTICLE_VS,
            fragmentShader: PARTICLE_FS,
            transparent: true,
            depthWrite: false,
            blending: additive ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NormalBlending"]
        });
        this.points = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Points"](geo, mat);
        this.points.frustumCulled = false;
        this.points.renderOrder = additive ? 10 : 9;
    }
    setScale(v) {
        this.uniforms.uScale.value = v;
    }
    emit(x, y, z, o) {
        if (this.n >= this.cap) return;
        const d = this.d, i = this.n++ * PS, c1 = o.c1 ?? o.c0;
        d[i] = x;
        d[i + 1] = y;
        d[i + 2] = z;
        d[i + 3] = o.vx ?? 0;
        d[i + 4] = o.vy ?? 0;
        d[i + 5] = o.vz ?? 0;
        d[i + 6] = 0;
        d[i + 7] = o.life;
        d[i + 8] = o.s0;
        d[i + 9] = o.s1;
        d[i + 10] = o.c0.r;
        d[i + 11] = o.c0.g;
        d[i + 12] = o.c0.b;
        d[i + 13] = c1.r;
        d[i + 14] = c1.g;
        d[i + 15] = c1.b;
        d[i + 16] = o.rot ?? Math.random() * TAU;
        d[i + 17] = o.rotV ?? 0;
        d[i + 18] = o.kind ?? 0;
        d[i + 19] = o.drag ?? 0;
        d[i + 20] = o.grav ?? 0;
        d[i + 21] = o.a ?? 1;
        d[i + 22] = o.sway ?? 0;
    }
    update(dt) {
        const d = this.d, P = this.pos.array, K = this.colA.array, Q = this.par.array;
        let i = 0;
        while(i < this.n){
            const o = i * PS, age = d[o + 6] += dt, life = d[o + 7];
            if (age >= life) {
                this.n--;
                const last = this.n * PS;
                if (o !== last) d.copyWithin(o, last, last + PS);
                continue;
            }
            if (d[o + 22]) {
                const ph = age * 4 + d[o + 17] * 3.7;
                d[o + 3] += Math.cos(ph) * d[o + 22] * dt;
                d[o + 5] += Math.sin(ph) * d[o + 22] * dt;
            }
            const k = Math.exp(-d[o + 19] * dt);
            d[o + 3] *= k;
            d[o + 4] = d[o + 4] * k - d[o + 20] * dt;
            d[o + 5] *= k;
            d[o] += d[o + 3] * dt;
            d[o + 1] += d[o + 4] * dt;
            d[o + 2] += d[o + 5] * dt;
            d[o + 16] += d[o + 17] * dt;
            const t = age / life, j = i * 3, q = i * 4, f = 1 - t;
            P[j] = d[o];
            P[j + 1] = d[o + 1];
            P[j + 2] = d[o + 2];
            K[j] = d[o + 10] + (d[o + 13] - d[o + 10]) * t;
            K[j + 1] = d[o + 11] + (d[o + 14] - d[o + 11]) * t;
            K[j + 2] = d[o + 12] + (d[o + 15] - d[o + 12]) * t;
            Q[q] = d[o + 8] + (d[o + 9] - d[o + 8]) * t;
            Q[q + 1] = d[o + 21] * Math.min(1, t * 14) * f * Math.sqrt(f);
            Q[q + 2] = d[o + 16];
            Q[q + 3] = d[o + 18];
            i++;
        }
        this.pos.needsUpdate = this.colA.needsUpdate = this.par.needsUpdate = true;
        this.points.geometry.setDrawRange(0, this.n);
    }
    dispose() {
        this.points.removeFromParent();
        this.points.geometry.dispose();
        this.points.material.dispose();
    }
}
class MagicSystem {
    scene;
    player;
    combat;
    blockers;
    progression;
    onConfirmedHit;
    mana;
    maxMana;
    flying;
    shieldActive;
    shieldTime;
    blocks;
    /** 0..1 camera-shake request raised by big impacts (already attenuated by distance to the player). Decays on its own; read it from your camera rig. */ shake;
    root;
    fx;
    soft;
    lights;
    projectiles;
    effects;
    cooldowns;
    tex;
    geo;
    // shield
    shieldRoot;
    shieldPanels;
    shieldFlash;
    shieldAge;
    shieldHit;
    shieldHitT;
    shieldBack;
    shieldGround;
    // flight aura
    aura;
    gyro;
    auraT;
    auraFloor;
    auraRings;
    lastPos;
    vel;
    acc;
    petalAcc;
    // scratch
    collisionRay;
    box;
    tA;
    tB;
    tC;
    tN;
    constructor(scene, player, combat, blockers, progression, onConfirmedHit = ()=>{}){
        this.scene = scene;
        this.player = player;
        this.combat = combat;
        this.blockers = blockers;
        this.progression = progression;
        this.onConfirmedHit = onConfirmedHit;
        this.mana = 1000;
        this.maxMana = 1000;
        this.flying = false;
        this.shieldActive = false;
        this.shieldTime = 0;
        this.blocks = 0;
        this.shake = 0;
        this.root = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        this.fx = new Particles(2600, true); // additive: glows, sparks, embers
        this.soft = new Particles(900, false); // normal blending: smoke, petals, debris, dust
        this.lights = [];
        this.projectiles = [];
        this.effects = [];
        this.cooldowns = {
            zoltraak: 0,
            vollzanbel: 0,
            judradjim: 0,
            shield: 0,
            flight: 0
        };
        this.geo = {
            plane: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](2, 2),
            ring: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RingGeometry"](.86, 1, 72),
            sphere: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IcosahedronGeometry"](1, 4),
            torus: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](1, .012, 6, 72),
            lance: MagicSystem.lanceGeometry(),
            lanceRing: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](.26, .012, 6, 40),
            gyro: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](.7, .02, 8, 64)
        };
        this.shieldRoot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        this.shieldPanels = [];
        this.shieldFlash = 0;
        this.shieldAge = 0;
        this.shieldHit = {
            value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, -999, 0)
        };
        this.shieldHitT = {
            value: 1
        };
        this.aura = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        this.gyro = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        this.auraT = 0;
        this.auraRings = [];
        this.lastPos = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.vel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.acc = 0;
        this.petalAcc = 0;
        this.collisionRay = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Raycaster"]();
        this.box = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Box3"]();
        this.tA = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.tB = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.tC = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.tN = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        Object.values(this.geo).forEach((g)=>{
            g.userData.keep = true;
        });
        this.tex = {
            rune: sigilTexture('rune', 11),
            sun: sigilTexture('sun', 23),
            arc: sigilTexture('arc', 37),
            wind: sigilTexture('wind', 51),
            glow: glowTexture()
        };
        this.root.name = 'spell-effects';
        scene.add(this.root);
        this.root.add(this.fx.points, this.soft.points);
        for(let i = 0; i < LIGHT_SLOTS; i++){
            const light = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"]('#ffffff', 0, 10, 2);
            this.root.add(light);
            this.lights.push({
                light,
                age: 0,
                life: 1,
                peak: 0,
                active: false,
                held: false
            });
        }
        this.lastPos.copy(player.position);
        this.buildShield();
        this.buildAura();
    }
    cooldown(id) {
        return this.cooldowns[id];
    }
    /** Optional: tell the system the drawing-buffer height (px, including pixel ratio) and camera FOV so particle sizes stay physically consistent. */ setViewport(heightPx, fovDeg) {
        const s = heightPx / (2 * Math.tan(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].degToRad(fovDeg) / 2));
        this.fx.setScale(s);
        this.soft.setScale(s);
    }
    /** Optional: call once after creating the system so every spell shader is compiled up-front (no hitch on the first cast). */ prewarm(renderer, camera) {
        const holder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        holder.position.set(0, -9999, 0);
        const mats = [
            this.fireMaterial(),
            this.fresnelMaterial(C.fire, 2, 1, 1),
            this.lanceMaterial(C.paleGold, C.gold, 1),
            this.basic(C.gold, 1, this.tex.rune)
        ];
        mats.forEach((m)=>holder.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.sphere, m)));
        holder.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sprite"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpriteMaterial"]({
            map: this.tex.glow,
            blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"]
        })));
        this.scene.add(holder);
        renderer.compile(this.scene, camera);
        this.scene.remove(holder);
        mats.forEach((m)=>m.dispose());
    }
    cast(id, origin, direction, target) {
        const manaCost = this.progression.manaCost(COST[id]);
        if (this.cooldowns[id] > 0 || this.mana < manaCost) return false;
        this.mana -= manaCost;
        this.cooldowns[id] = COOLDOWN[id];
        const dir = direction.clone().normalize();
        if (id === 'shield') {
            this.shieldActive = true;
            this.shieldTime = 6;
            this.shieldAge = 0;
            this.shieldRoot.visible = true;
            this.shieldFlash = .45;
            this.shieldCastFx();
            return true;
        }
        if (id === 'flight') {
            this.flying = !this.flying;
            this.flightBurst(this.flying);
            return true;
        }
        if (id === 'judradjim') {
            const size = this.progression.sizeMultiplier();
            this.lightningFx(origin, target, size);
            if (this.combat.damageAt(target, 4.4 * size, 46 * this.progression.damageMultiplier()) > 0) this.onConfirmedHit();
            return true;
        }
        const kind = id;
        this.spawnProjectile(kind, origin, dir, target);
        this.muzzleFx(kind, origin, dir);
        return true;
    }
    blockProjectile(from, to) {
        if (!this.shieldActive || this.mana <= 0) return false;
        const center = this.shieldRoot.getWorldPosition(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]()), size = this.progression.sizeMultiplier();
        const segment = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line3"](from, to), closest = segment.closestPointToPoint(center, true, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]());
        if (closest.distanceTo(center) > 1.38 * size) return false;
        this.mana = Math.max(0, this.mana - 6);
        this.shieldTime = Math.max(0, this.shieldTime - .65);
        this.shieldFlash = .5;
        this.blocks++;
        // ripple travels across the hex panels from the point of impact
        const n = closest.clone().sub(center);
        if (n.lengthSq() < 1e-4) n.copy(from).sub(center);
        n.normalize();
        const hit = center.clone().addScaledVector(n, 1.25 * size);
        this.shieldHit.value.copy(hit);
        this.shieldHitT.value = 0;
        this.shock(hit, n, C.barrierHot, 1.1 * size, .38);
        this.flash(hit, C.barrierHot, 1.6 * size, .18);
        for(let i = 0; i < 16; i++){
            const v = this.hemi(n, 1, this.tA), sp = rr(2.5, 7);
            this.fx.emit(hit.x, hit.y, hit.z, {
                vx: v.x * sp,
                vy: v.y * sp,
                vz: v.z * sp,
                life: rr(.35, .75),
                s0: rr(.2, .34),
                s1: .02,
                c0: C.barrierHot,
                c1: C.barrier,
                kind: 1,
                drag: 2.2,
                grav: 2
            });
        }
        this.flashLight(hit, C.barrier, 5, .3, 6);
        this.shake = Math.max(this.shake, .16);
        return true;
    }
    update(delta, elapsed) {
        this.mana = Math.min(this.maxMana, this.mana + delta * (this.flying ? 1.2 : 4.2));
        for (const id of Object.keys(this.cooldowns))this.cooldowns[id] = Math.max(0, this.cooldowns[id] - delta);
        if (this.flying) {
            this.mana -= delta * 8;
            if (this.mana <= 0) {
                this.mana = 0;
                this.flying = false;
                this.flightBurst(false);
            }
        }
        if (this.shieldActive) {
            this.mana -= delta * 2.4;
            this.shieldTime -= delta;
        }
        if (this.shieldActive && (this.shieldTime <= 0 || this.mana <= 0)) {
            const broke = this.mana <= 0;
            this.shieldActive = false;
            this.shieldBreakFx(broke);
        }
        const dt = Math.min(delta, .05);
        this.updateShield(delta, elapsed);
        this.updateAura(delta, elapsed);
        this.updateProjectiles(delta, elapsed);
        for(let i = this.effects.length - 1; i >= 0; i--){
            const e = this.effects[i];
            e.age += dt;
            const t = Math.min(1, e.age / e.life);
            e.step(t, dt);
            if (t >= 1) {
                e.object.removeFromParent();
                disposeTree(e.object);
                this.effects.splice(i, 1);
            }
        }
        for (const s of this.lights){
            if (!s.active || s.held) continue;
            s.age += dt;
            const t = s.age / s.life;
            if (t >= 1) {
                s.active = false;
                s.light.intensity = 0;
            } else s.light.intensity = s.peak * (1 - t) * (1 - t);
        }
        this.fx.update(dt);
        this.soft.update(dt);
        this.shake = Math.max(0, this.shake - delta * 2.2);
    }
    dispose() {
        this.projectiles.forEach((p)=>{
            p.object.removeFromParent();
            disposeTree(p.object);
        });
        this.projectiles = [];
        this.effects.forEach((e)=>{
            e.object.removeFromParent();
            disposeTree(e.object);
        });
        this.effects = [];
        this.root.removeFromParent();
        this.shieldRoot.removeFromParent();
        this.aura.removeFromParent();
        disposeTree(this.shieldRoot);
        disposeTree(this.aura);
        this.fx.dispose();
        this.soft.dispose();
        this.lights.forEach((s)=>s.light.dispose());
        Object.values(this.geo).forEach((g)=>g.dispose());
        Object.values(this.tex).forEach((t)=>t.dispose());
    }
    /* ---------------------------------------------------------------- *
   *  Building blocks
   * ---------------------------------------------------------------- */ static lanceGeometry() {
        const prof = [
            [
                0,
                -1.1
            ],
            [
                .05,
                -.95
            ],
            [
                .09,
                -.5
            ],
            [
                .1,
                .1
            ],
            [
                .085,
                .7
            ],
            [
                .04,
                1.1
            ],
            [
                0,
                1.5
            ]
        ].map(([x, y])=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](x, y));
        const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LatheGeometry"](prof, 20);
        g.rotateX(Math.PI / 2);
        return g;
    }
    basic(color, opacity = 1, map = null) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color,
            map,
            transparent: true,
            opacity,
            depthWrite: false,
            side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"],
            blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"],
            toneMapped: false
        });
    }
    lanceMaterial(a, b, gain) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
            transparent: true,
            depthWrite: false,
            blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"],
            vertexShader: LANCE_VS,
            fragmentShader: LANCE_FS,
            uniforms: {
                uTime: {
                    value: 0
                },
                uGain: {
                    value: gain
                },
                uA: {
                    value: a.clone()
                },
                uB: {
                    value: b.clone()
                }
            }
        });
    }
    fresnelMaterial(color, power, gain, alpha) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
            transparent: true,
            depthWrite: false,
            blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"],
            vertexShader: FRESNEL_VS,
            fragmentShader: FRESNEL_FS,
            uniforms: {
                uColor: {
                    value: color.clone()
                },
                uPower: {
                    value: power
                },
                uGain: {
                    value: gain
                },
                uAlpha: {
                    value: alpha
                }
            }
        });
    }
    fireMaterial() {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
            transparent: true,
            depthWrite: false,
            blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"],
            vertexShader: FIRE_VS,
            fragmentShader: FIRE_FS,
            uniforms: {
                uT: {
                    value: 0
                },
                uTime: {
                    value: 0
                },
                uSeed: {
                    value: Math.random() * 40
                }
            }
        });
    }
    addEffect(object, life, step = ()=>{}) {
        this.root.add(object);
        this.effects.push({
            object,
            age: 0,
            life,
            step
        });
        step(0, 0);
    }
    /** Random unit vector in the hemisphere around n. spread 1 = full hemisphere, 0 = straight along n. */ hemi(n, spread, out) {
        out.set(rr(-1, 1), rr(-1, 1), rr(-1, 1));
        if (out.lengthSq() < 1e-4) out.set(0, 1, 0);
        out.normalize();
        const d = out.dot(n);
        if (d < 0) out.addScaledVector(n, -2 * d);
        return out.lerp(n, 1 - spread).normalize();
    }
    flashLight(pos, color, peak, life, dist, held = false) {
        let slot = this.lights.find((s)=>!s.active);
        if (!slot) slot = this.lights.filter((s)=>!s.held).sort((a, b)=>b.age / b.life - a.age / a.life)[0];
        if (!slot) return null;
        slot.active = true;
        slot.held = held;
        slot.age = 0;
        slot.life = life;
        slot.peak = peak * LIGHT_GAIN;
        slot.light.color.copy(color);
        slot.light.distance = dist;
        slot.light.position.copy(pos);
        slot.light.intensity = slot.peak;
        return slot;
    }
    releaseLight(s) {
        if (s) {
            s.active = false;
            s.held = false;
            s.light.intensity = 0;
        }
    }
    addShake(at, amount, range = 28) {
        this.shake = Math.max(this.shake, clamp01(1 - at.distanceTo(this.player.position) / range) * amount);
    }
    /** Soft additive billboard flash. */ flash(pos, color, size, life) {
        const s = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sprite"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpriteMaterial"]({
            map: this.tex.glow,
            color,
            transparent: true,
            blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"],
            depthWrite: false,
            toneMapped: false
        }));
        s.position.copy(pos);
        this.addEffect(s, life, (t)=>{
            s.scale.setScalar(Math.max(.01, size * (.4 + .9 * easeOutCubic(t))));
            s.material.opacity = (1 - t) * (1 - t);
        });
    }
    /** Expanding flat ring oriented along a surface normal. */ shock(pos, normal, color, radius, life) {
        const mat = this.basic(color, .9), m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.ring, mat);
        m.position.copy(pos).addScaledVector(normal, .06);
        m.quaternion.setFromUnitVectors(FWD, normal);
        this.addEffect(m, life, (t)=>{
            m.scale.setScalar(Math.max(.01, radius * (.15 + .85 * easeOutCubic(t))));
            mat.opacity = (1 - t) * (1 - t) * .9;
        });
    }
    /** Fresnel shell that expands and fades (shock dome). */ dome(pos, color, radius, life, power = 2.4) {
        const mat = this.fresnelMaterial(color, power, 1.2, 1), m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.sphere, mat);
        m.position.copy(pos);
        this.addEffect(m, life, (t)=>{
            m.scale.setScalar(Math.max(.01, radius * (.15 + .85 * easeOutCubic(t))));
            mat.uniforms.uAlpha.value = (1 - t) * (1 - t);
        });
    }
    /** Layered, counter-rotating magic circle that blooms in, holds and fades — the signature Frieren casting visual. */ sigil(pos, normal, style, color, radius, life, o = {}) {
        const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        g.position.copy(pos);
        g.quaternion.setFromUnitVectors(FWD, normal);
        const a = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.plane, this.basic(color, 0, this.tex[style])), b = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.plane, this.basic(C.paleGold, 0, this.tex[INNER[style]]));
        b.position.z = .01;
        g.add(a, b);
        const spin = o.spin ?? 1.2, grow = o.grow ?? .12, hold = o.hold ?? .3;
        this.addEffect(g, life, (t)=>{
            const s = radius * easeOutBack(clamp01(t * life / .2)) * (1 + grow * t);
            a.scale.setScalar(Math.max(.001, s));
            b.scale.setScalar(Math.max(.001, s * .62));
            a.rotation.z = t * life * spin;
            b.rotation.z = -t * life * spin * 1.7;
            const fade = t < hold ? 1 : 1 - Math.pow((t - hold) / (1 - hold), 1.6), appear = clamp01(t * life / .12);
            a.material.opacity = fade * appear;
            b.material.opacity = fade * appear * .75;
        });
    }
    /* ---------------------------------------------------------------- *
   *  Zoltraak / Vollzanbel projectiles
   * ---------------------------------------------------------------- */ spawnProjectile(kind, origin, dir, target) {
        const fire = kind === 'vollzanbel', size = this.progression.sizeMultiplier(), speed = fire ? 13 : 34;
        const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
        g.name = kind;
        g.position.copy(origin).addScaledVector(dir, .5);
        g.quaternion.setFromUnitVectors(FWD, dir);
        g.scale.setScalar(size);
        const halo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sprite"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpriteMaterial"]({
            map: this.tex.glow,
            color: fire ? C.fire : C.gold,
            transparent: true,
            opacity: fire ? .6 : .55,
            blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"],
            depthWrite: false,
            toneMapped: false
        }));
        halo.scale.setScalar(fire ? 3.6 : 1.8);
        const p = {
            object: g,
            dir: dir.clone(),
            velocity: dir.clone().multiplyScalar(speed),
            speed,
            age: 0,
            kind,
            target: target.clone(),
            light: null,
            times: [],
            rings: [],
            spins: [],
            halo,
            damage: (at, radius, amount)=>{
                const s = this.progression.sizeMultiplier();
                if (this.combat.damageAt(at, radius * s, amount * this.progression.damageMultiplier()) > 0) this.onConfirmedHit();
            }
        };
        if (!fire) {
            // Zoltraak: a piercing spiral lance wrapped in a pale-gold shell, shedding mana rings behind it
            const core = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.lance, this.lanceMaterial(C.bolt, C.gold, 1)), shell = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.lance, this.lanceMaterial(C.gold, C.goldDeep, .45));
            shell.scale.set(2.2, 2.2, 1.12);
            p.times.push(core.material.uniforms.uTime, shell.material.uniforms.uTime);
            g.add(shell, core, halo);
            for(let k = 0; k < 3; k++){
                const mat = this.basic(C.paleGold, 0), mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.lanceRing, mat);
                g.add(mesh);
                p.rings.push({
                    mesh,
                    mat
                });
            }
            p.light = this.flashLight(g.position, C.gold, 4.5, 1, 7, true);
        } else {
            // Vollzanbel: roiling fire core + fresnel plasma shell, flanked by counter-rotating sun sigils
            const fm = this.fireMaterial();
            fm.uniforms.uT.value = .08;
            p.times.push(fm.uniforms.uTime);
            const core = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.sphere, fm);
            core.scale.set(.36, .36, .55);
            const shell = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.sphere, this.fresnelMaterial(C.fire, 2, 1.1, .85));
            shell.scale.set(.62, .62, .95);
            const front = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.plane, this.basic(C.fire, .9, this.tex.sun));
            front.position.z = .95;
            front.scale.setScalar(.6);
            const back = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.plane, this.basic(C.gold, .7, this.tex.rune));
            back.position.z = -.7;
            back.scale.setScalar(.95);
            const gyro = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"](), gr = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.gyro, this.basic(C.fireHot, .8));
            gr.rotation.x = 1.15;
            gyro.add(gr);
            g.add(shell, core, front, back, gyro, halo);
            p.spins.push({
                obj: front,
                rate: 4
            }, {
                obj: back,
                rate: -2.6
            }, {
                obj: gyro,
                rate: 4.5
            });
            p.light = this.flashLight(g.position, C.fire, 7, 1, 11, true);
        }
        this.root.add(g);
        this.projectiles.push(p);
    }
    muzzleFx(kind, origin, dir) {
        const fire = kind === 'vollzanbel', size = this.progression.sizeMultiplier(), c = this.tC.copy(origin).addScaledVector(dir, 1);
        this.sigil(c, dir, fire ? 'sun' : 'rune', fire ? C.fire : C.paleGold, (fire ? 1.5 : .78) * size, fire ? .8 : .5, {
            spin: fire ? 1.6 : 2.4
        });
        this.flash(c, fire ? C.fireHot : C.paleGold, (fire ? 2.6 : 1.1) * size, fire ? .22 : .14);
        for(let i = 0; i < (fire ? 22 : 10); i++){
            const v = this.tB.copy(dir).add(this.tA.set(rr(-1, 1), rr(-1, 1), rr(-1, 1)).multiplyScalar(.35)).normalize(), sp = fire ? rr(3, 9) : rr(5, 12);
            this.fx.emit(c.x, c.y, c.z, {
                vx: v.x * sp,
                vy: v.y * sp,
                vz: v.z * sp,
                life: rr(.25, .6),
                s0: rr(.2, .36),
                s1: .02,
                c0: fire ? C.fireHot : C.paleGold,
                c1: fire ? C.fire : C.gold,
                kind: 1,
                drag: 2.4,
                grav: fire ? 2 : 0
            });
        }
        if (fire) this.shake = Math.max(this.shake, .12);
    }
    updateProjectiles(delta, elapsed) {
        for(let i = this.projectiles.length - 1; i >= 0; i--){
            const p = this.projectiles[i], pos = p.object.position, prev = this.tA.copy(pos), size = this.progression.sizeMultiplier();
            p.age += delta;
            pos.addScaledVector(p.velocity, delta);
            this.collisionRay.set(prev, p.dir);
            this.collisionRay.near = 0;
            this.collisionRay.far = p.speed * delta + .12;
            const obstacle = this.collisionRay.intersectObjects(this.blockers, true)[0];
            if (obstacle) pos.copy(obstacle.point);
            const ground = pos.y < (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(pos.x, pos.z) + .15;
            const targetHit = pos.distanceTo(p.target) < Math.max(.35, p.speed * delta);
            const enemyHit = this.combat.targets.some((target)=>{
                if (!target.visible) return false;
                target.updateMatrixWorld();
                return this.box.setFromObject(target).expandByScalar(.42).containsPoint(pos);
            });
            this.animateProjectile(p, prev, delta, elapsed);
            if (obstacle || enemyHit || targetHit || ground || p.age > (p.kind === 'vollzanbel' ? 2.5 : 1.35)) {
                const n = this.tN.set(0, 1, 0);
                if (ground) pos.y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(pos.x, pos.z) + .05;
                else {
                    if (obstacle?.face) n.copy(obstacle.face.normal).transformDirection(obstacle.object.matrixWorld);
                    else n.copy(p.dir).negate();
                    if (n.dot(p.dir) > 0) n.negate();
                }
                const fire = p.kind === 'vollzanbel', radius = fire ? 4.6 : .9;
                p.damage(pos, radius, fire ? 58 : 34);
                if (fire) this.fireExplosion(pos.clone(), n.clone(), radius * size);
                else this.zoltraakImpact(pos.clone(), n.clone(), size);
                p.object.removeFromParent();
                disposeTree(p.object);
                this.releaseLight(p.light);
                this.projectiles.splice(i, 1);
            }
        }
    }
    animateProjectile(p, from, delta, elapsed) {
        const pos = p.object.position, size = this.progression.sizeMultiplier(), fire = p.kind === 'vollzanbel';
        p.times.forEach((u)=>{
            u.value = elapsed;
        });
        p.spins.forEach((s)=>{
            s.obj.rotation.z += s.rate * delta;
        });
        p.rings.forEach((r, k)=>{
            const ph = (p.age * 2.2 + k / 3) % 1;
            r.mesh.position.z = .9 - ph * 2.5;
            r.mesh.scale.setScalar(.7 + ph * 1.1);
            r.mat.opacity = Math.min(1, ph * 8) * (1 - ph) * .9;
        });
        p.halo.material.opacity = (fire ? .6 : .55) * (.85 + .15 * Math.sin(elapsed * 40 + p.age * 9));
        if (p.light) {
            p.light.light.position.copy(pos);
            p.light.light.intensity = p.light.peak * (1 + .18 * Math.sin(elapsed * 31));
        }
        const dist = from.distanceTo(pos), spacing = (fire ? .16 : .11) * size, n = Math.min(24, Math.max(1, Math.ceil(dist / spacing)));
        for(let k = 1; k <= n; k++){
            const u = k / n, x = from.x + (pos.x - from.x) * u, y = from.y + (pos.y - from.y) * u, z = from.z + (pos.z - from.z) * u;
            if (!fire) {
                this.fx.emit(x, y, z, {
                    life: .34,
                    s0: .3 * size,
                    s1: .02,
                    c0: C.paleGold,
                    c1: C.gold,
                    a: .85
                });
                if (Math.random() < .12) this.fx.emit(x, y, z, {
                    vx: rr(-.8, .8),
                    vy: rr(-.8, .8),
                    vz: rr(-.8, .8),
                    life: rr(.3, .55),
                    s0: .22 * size,
                    s1: .02,
                    c0: C.paleGold,
                    kind: 1,
                    drag: 2
                });
            } else {
                this.fx.emit(x, y, z, {
                    vx: rr(-.5, .5),
                    vy: rr(.2, 1.2),
                    vz: rr(-.5, .5),
                    life: rr(.45, .8),
                    s0: rr(.5, .8) * size,
                    s1: .05,
                    c0: C.fire,
                    c1: C.ember,
                    a: .65,
                    drag: .6
                });
                if (Math.random() < .4) this.fx.emit(x, y, z, {
                    vx: rr(-1.6, 1.6),
                    vy: rr(0, 1.5),
                    vz: rr(-1.6, 1.6),
                    life: rr(.4, .9),
                    s0: .22 * size,
                    s1: .02,
                    c0: C.fireHot,
                    c1: C.fire,
                    kind: 1,
                    grav: 3
                });
                if (Math.random() < .3) this.soft.emit(x, y, z, {
                    vx: rr(-.3, .3),
                    vy: rr(.4, 1.1),
                    vz: rr(-.3, .3),
                    life: rr(1, 1.7),
                    s0: .4 * size,
                    s1: 1.5 * size,
                    c0: C.smokeA,
                    c1: C.smokeB,
                    a: .35,
                    kind: 3,
                    drag: .5
                });
            }
        }
    }
    zoltraakImpact(pos, n, size) {
        this.flash(pos, C.paleGold, 1.8 * size, .16);
        this.shock(pos, n, C.paleGold, 1.5 * size, .38);
        for(let i = 0; i < 22; i++){
            const v = this.hemi(n, 1, this.tA), sp = rr(4, 11);
            this.fx.emit(pos.x, pos.y, pos.z, {
                vx: v.x * sp,
                vy: v.y * sp,
                vz: v.z * sp,
                life: rr(.35, .7),
                s0: rr(.22, .4) * size,
                s1: .02,
                c0: C.paleGold,
                c1: C.gold,
                kind: 1,
                drag: 2,
                grav: 4
            });
        }
        for(let i = 0; i < 8; i++)this.fx.emit(pos.x, pos.y, pos.z, {
            vx: rr(-1, 1),
            vy: rr(.5, 2),
            vz: rr(-1, 1),
            life: .35,
            s0: .5 * size,
            s1: 0,
            c0: C.gold,
            a: .8
        });
        this.flashLight(this.tB.copy(pos).addScaledVector(n, .6), C.gold, 7, .3, 6);
        this.addShake(pos, .1, 14);
    }
    fireExplosion(pos, n, R) {
        const k = R / 4.6, lift = n.clone().multiplyScalar(R * .28);
        // volumetric fire lobes (noise-driven shader, dissolve over time)
        const ball = (off, size, delay, dur, rise)=>{
            const mat = this.fireMaterial(), m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.sphere, mat);
            m.position.copy(pos).add(off);
            const y0 = m.position.y, life = delay + dur;
            this.addEffect(m, life, (t)=>{
                const u = clamp01((t * life - delay) / dur);
                m.visible = u > 0;
                mat.uniforms.uT.value = u;
                mat.uniforms.uTime.value = t * life;
                m.scale.setScalar(Math.max(.01, size * (.35 + .65 * easeOutCubic(u))));
                m.position.y = y0 + rise * easeOutCubic(u);
            });
        };
        ball(lift, R * .62, 0, .75, R * .2);
        ball(lift.clone().addScaledVector(UP, R * .35), R * .42, .07, .85, R * .55);
        for(let i = 0; i < 2; i++){
            const a = Math.random() * TAU;
            ball(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](Math.cos(a) * R * .4, R * .12, Math.sin(a) * R * .4), R * .3, rr(0, .1), .6, R * .25);
        }
        // shock dome + rings + scorched sigil
        this.dome(this.tA.copy(pos).addScaledVector(n, R * .2), C.fire, R * 1.05, .45, 2.2);
        this.shock(pos, n, C.fireHot, R * 1.05, .55);
        this.shock(pos, n, C.fire, R * .7, .4);
        if (n.y > .6) this.sigil(this.tA.copy(pos).addScaledVector(n, .05), n, 'sun', C.fire, R * .9, 1.8, {
            spin: .5,
            grow: .06,
            hold: .35
        });
        this.flash(this.tA.copy(pos).addScaledVector(n, R * .15), C.fireHot, R * 2.6, .22);
        // particles
        const v = this.tB;
        for(let i = 0; i < 70; i++){
            this.hemi(n, .95, v);
            const sp = rr(3, 11) * Math.max(.6, k);
            this.fx.emit(pos.x, pos.y + .2, pos.z, {
                vx: v.x * sp,
                vy: v.y * sp + 2,
                vz: v.z * sp,
                life: rr(.9, 1.9),
                s0: rr(.18, .4),
                s1: .02,
                c0: C.fireHot,
                c1: C.ember,
                a: .9,
                drag: 1.1,
                grav: Math.random() < .5 ? -1.2 : 4.5
            });
        }
        for(let i = 0; i < 36; i++){
            this.hemi(n, 1, v);
            const sp = rr(8, 18) * Math.max(.6, k);
            this.fx.emit(pos.x, pos.y + .1, pos.z, {
                vx: v.x * sp,
                vy: v.y * sp,
                vz: v.z * sp,
                life: rr(.45, 1),
                s0: rr(.25, .45),
                s1: .02,
                c0: C.fireHot,
                c1: C.fire,
                kind: 1,
                drag: .5,
                grav: 12
            });
        }
        for(let i = 0; i < 16; i++){
            this.hemi(n, .7, v);
            this.soft.emit(pos.x + rr(-.4, .4) * R * .5, pos.y + R * .15, pos.z + rr(-.4, .4) * R * .5, {
                vx: v.x * 2,
                vy: rr(1, 3),
                vz: v.z * 2,
                life: rr(1.6, 2.8),
                s0: R * .18,
                s1: R * .55,
                c0: C.smokeA,
                c1: C.smokeB,
                a: .5,
                kind: 3,
                drag: 1.2
            });
        }
        for(let i = 0; i < 18; i++){
            this.hemi(n, .8, v);
            const sp = rr(5, 13);
            this.soft.emit(pos.x, pos.y + .1, pos.z, {
                vx: v.x * sp,
                vy: v.y * sp,
                vz: v.z * sp,
                life: rr(.7, 1.3),
                s0: rr(.1, .2),
                s1: .06,
                c0: C.debris,
                kind: 3,
                grav: 16,
                a: .95
            });
        }
        if (n.y > .6) for(let i = 0; i < 14; i++){
            const a = Math.random() * TAU, sp = rr(3, 7) * Math.max(.7, k);
            this.soft.emit(pos.x, pos.y + .15, pos.z, {
                vx: Math.cos(a) * sp,
                vy: rr(.2, .8),
                vz: Math.sin(a) * sp,
                life: rr(1.2, 1.8),
                s0: R * .2,
                s1: R * .6,
                c0: C.dust,
                c1: C.dustB,
                a: .35,
                kind: 3,
                drag: 1.6
            });
        }
        this.flashLight(this.tA.copy(pos).addScaledVector(n, 1.2), C.fire, 34, .7, R * 3.4);
        this.addShake(pos, .85);
    }
    /* ---------------------------------------------------------------- *
   *  Judradjim — lightning
   * ---------------------------------------------------------------- */ jag(a, b, gens, amp) {
        let pts = [
            a.clone(),
            b.clone()
        ];
        for(let g = 0; g < gens; g++){
            const next = [
                pts[0]
            ];
            for(let i = 0; i < pts.length - 1; i++){
                const m = pts[i].clone().add(pts[i + 1]).multiplyScalar(.5);
                m.x += (Math.random() - .5) * amp;
                m.y += (Math.random() - .5) * amp;
                m.z += (Math.random() - .5) * amp;
                next.push(m, pts[i + 1]);
            }
            pts = next;
            amp *= .55;
        }
        return pts;
    }
    lightningFx(from, to, size) {
        const R = 4.4 * size, dir = to.clone().sub(from), len = dir.length();
        dir.normalize();
        this.sigil(from.clone().addScaledVector(dir, .9), dir, 'arc', C.boltGlow, .85 * Math.max(1, size * .8), .5, {
            spin: 2.4
        });
        const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"](), bolts = [];
        const addBolt = (pts, radius, color, opacity)=>{
            const curve = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CatmullRomCurve3"](pts, false, 'chordal'), mat = this.basic(color, opacity);
            g.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TubeGeometry"](curve, pts.length * 2, radius, 5, false), mat));
            bolts.push({
                mat,
                base: opacity
            });
        };
        // arc from the caster's hand + branches
        const main = this.jag(from, to, 5, len * .12);
        addBolt(main, .05 * size, C.bolt, 1);
        addBolt(main, .16 * size, C.boltGlow, .35);
        for(let i = 0; i < 5; i++){
            const a = main[3 + Math.floor(Math.random() * (main.length - 6))], d = dir.clone().add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](rr(-.5, .5), rr(-.5, .5), rr(-.5, .5)).multiplyScalar(1.8)).normalize();
            addBolt(this.jag(a, a.clone().addScaledVector(d, rr(1, 3.5) * size), 3, .5 * size), .02 * size, C.bolt, .85);
        }
        // thunder strike from above the target
        const top = to.clone().add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](rr(-1.5, 1.5), 24, rr(-1.5, 1.5))), sky = this.jag(top, to, 6, 3.2);
        addBolt(sky, .11 * size, C.bolt, 1);
        addBolt(sky, .42 * size, C.boltGlow, .3);
        for(let i = 0; i < 3; i++){
            const a = sky[8 + Math.floor(Math.random() * (sky.length - 16))];
            addBolt(this.jag(a, a.clone().add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](rr(-3, 3), rr(-4, -1), rr(-3, 3))), 3, .8), .03 * size, C.bolt, .8);
        }
        // arcs crawling along the terrain through the whole damage radius
        for(let i = 0; i < 8; i++){
            const a = i / 8 * TAU + Math.random() * .6, rad = R * rr(.55, 1), pts = [];
            for(let s = 0; s <= 9; s++){
                const u = s / 9, x = to.x + Math.cos(a) * rad * u + rr(-.25, .25) * u, z = to.z + Math.sin(a) * rad * u + rr(-.25, .25) * u;
                pts.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(x, z) + .1 + Math.random() * .08, z));
            }
            addBolt(pts, .022 * size, C.bolt, .9);
        }
        this.addEffect(g, .5, (t)=>{
            const f = t < .1 ? 1 : Math.random() < .55 ? 1 : .25 + Math.random() * .4, fade = t < .35 ? 1 : 1 - (t - .35) / .65;
            bolts.forEach((b)=>{
                b.mat.opacity = b.base * f * fade;
            });
        });
        // impact: flash, damage-radius sigil, shock, dome, sparks, thunder light
        this.flash(to, C.bolt, R * 1.1, .24);
        this.sigil(this.tA.copy(to).addScaledVector(UP, .07), UP, 'arc', C.boltGlow, R, 1, {
            spin: 1.1,
            grow: .05,
            hold: .4
        });
        this.shock(to, UP, C.bolt, R, .45);
        this.shock(to, UP, C.boltGlow, R * .55, .3);
        this.dome(this.tA.copy(to).addScaledVector(UP, .3), C.boltGlow, R * .55, .3, 2);
        const v = this.tB;
        for(let i = 0; i < 36; i++){
            this.hemi(UP, 1, v);
            const sp = rr(4, 12);
            this.fx.emit(to.x, to.y + .1, to.z, {
                vx: v.x * sp,
                vy: v.y * sp,
                vz: v.z * sp,
                life: rr(.5, 1),
                s0: rr(.22, .4),
                s1: .02,
                c0: C.bolt,
                c1: C.boltGlow,
                kind: 1,
                drag: 1.2,
                grav: 12
            });
        }
        for(let i = 0; i < 16; i++)this.fx.emit(to.x + rr(-1, 1), to.y + .2, to.z + rr(-1, 1), {
            vx: rr(-.5, .5),
            vy: rr(1, 3),
            vz: rr(-.5, .5),
            life: rr(1, 1.6),
            s0: rr(.2, .4),
            s1: 0,
            c0: C.boltGlow,
            a: .7,
            drag: .5
        });
        for(let i = 0; i < 6; i++)this.soft.emit(to.x + rr(-.8, .8), to.y + .1, to.z + rr(-.8, .8), {
            vy: rr(.6, 1.6),
            life: rr(1.2, 2),
            s0: .5,
            s1: 1.4,
            c0: C.dust,
            c1: C.dustB,
            a: .25,
            kind: 3,
            drag: .8
        });
        this.flashLight(this.tA.copy(to).addScaledVector(UP, 2.2), C.boltGlow, 28, .35, R * 3.2);
        this.addShake(to, .55);
    }
    /* ---------------------------------------------------------------- *
   *  Hex Aegis — barrier
   * ---------------------------------------------------------------- */ buildShield() {
        this.shieldRoot.name = 'hex-aegis';
        this.player.add(this.shieldRoot);
        this.shieldRoot.position.set(0, 1.28, .72);
        const R = .49, step = Math.sqrt(3) * R * 1.07, panelGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleGeometry"](R, 6);
        for(let i = 0; i < 7; i++){
            const mat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
                transparent: true,
                depthWrite: false,
                side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"],
                blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"],
                vertexShader: SHIELD_VS,
                fragmentShader: SHIELD_FS,
                uniforms: {
                    uTime: {
                        value: 0
                    },
                    uFlash: {
                        value: 0
                    },
                    uAlpha: {
                        value: 0
                    },
                    uHitT: this.shieldHitT,
                    uHit: this.shieldHit,
                    uColA: {
                        value: C.barrier.clone()
                    },
                    uColB: {
                        value: C.barrierHot.clone()
                    }
                }
            });
            const a = Math.PI / 6 + (i - 1) * Math.PI / 3, x = i ? Math.cos(a) * step : 0, y = i ? Math.sin(a) * step : 0;
            const panel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](panelGeo, mat);
            panel.position.set(x, y, -(x * x + y * y) * .16);
            panel.rotation.set(-y * .22, x * .22, 0);
            this.shieldRoot.add(panel);
            this.shieldPanels.push(panel);
        }
        this.shieldBack = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.plane, this.basic(C.barrier, 0, this.tex.rune));
        this.shieldBack.position.z = -.12;
        this.shieldBack.scale.setScalar(1.55);
        this.shieldRoot.add(this.shieldBack);
        this.shieldGround = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.plane, this.basic(C.barrier, 0, this.tex.rune));
        this.shieldGround.rotation.x = -Math.PI / 2;
        this.shieldGround.position.y = .06;
        this.shieldGround.scale.setScalar(1.5);
        this.player.add(this.shieldGround);
        this.shieldRoot.visible = false;
    }
    updateShield(delta, elapsed) {
        if (!this.shieldActive) {
            this.shieldRoot.visible = false;
            this.shieldGround.material.opacity = 0;
            return;
        }
        this.shieldAge += delta;
        const size = this.progression.sizeMultiplier();
        this.shieldRoot.visible = true;
        this.shieldRoot.scale.setScalar(size * (.8 + .2 * easeOutBack(clamp01(this.shieldAge / .32))));
        this.shieldRoot.rotation.y = Math.sin(elapsed * 1.1) * .055;
        this.shieldFlash = Math.max(0, this.shieldFlash - delta * 2.4);
        if (this.shieldHitT.value < 1) this.shieldHitT.value = Math.min(1, this.shieldHitT.value + delta * 1.6);
        const fade = clamp01(this.shieldTime / .7) * (this.shieldTime < 1.2 ? .8 + .2 * Math.sin(elapsed * 38) : 1);
        this.shieldPanels.forEach((panel, i)=>{
            const u = panel.material.uniforms, appear = easeOutCubic(clamp01((this.shieldAge - (i ? .06 : 0)) / .24));
            u.uTime.value = elapsed + i * .22;
            u.uFlash.value = Math.max(0, this.shieldFlash + Math.sin(elapsed * 2.4 + i) * .015);
            u.uAlpha.value = appear * fade;
        });
        this.shieldBack.material.opacity = .3 * fade * clamp01(this.shieldAge / .4);
        this.shieldBack.rotation.z = elapsed * .35;
        this.shieldGround.material.opacity = .45 * fade * clamp01(this.shieldAge / .4);
        this.shieldGround.rotation.z = -elapsed * .5;
    }
    shieldCastFx() {
        const c = this.shieldRoot.getWorldPosition(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]()), n = this.shieldRoot.getWorldDirection(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]());
        this.sigil(c.clone().addScaledVector(n, .25), n, 'rune', C.barrier, 1.7, .7, {
            spin: 1.4,
            grow: .2
        });
        this.flash(c, C.barrierHot, 3, .3);
        this.flashLight(c, C.barrier, 8, .5, 8);
        const g = this.player.position, gy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(g.x, g.z) + .08;
        this.shock(this.tA.set(g.x, gy, g.z), UP, C.barrier, 2.1, .5);
    }
    shieldBreakFx(broke) {
        const c = this.shieldRoot.getWorldPosition(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]()), n = broke ? 26 : 12;
        for(let i = 0; i < n; i++){
            const a = Math.random() * TAU, r = rr(.2, 1.2), sp = rr(2, broke ? 6 : 3);
            this.fx.emit(c.x + Math.cos(a) * r, c.y + rr(-.8, .8), c.z + Math.sin(a) * r, {
                vx: Math.cos(a) * sp,
                vy: rr(-1, 2),
                vz: Math.sin(a) * sp,
                life: rr(.5, 1),
                s0: rr(.2, .36),
                s1: .02,
                c0: C.barrierHot,
                c1: C.barrier,
                kind: 1,
                drag: 1.8,
                grav: 2
            });
        }
        if (broke) {
            this.flash(c, C.barrierHot, 3.2, .25);
            this.shake = Math.max(this.shake, .2);
        }
    }
    /* ---------------------------------------------------------------- *
   *  Flight — petals, wind sigil, orbiting mana rings
   * ---------------------------------------------------------------- */ buildAura() {
        this.aura.name = 'flight-aura';
        this.player.add(this.aura);
        this.aura.visible = false;
        this.auraFloor = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.plane, this.basic(C.mana, 0, this.tex.wind));
        this.auraFloor.rotation.x = -Math.PI / 2;
        this.auraFloor.position.y = .05;
        this.auraFloor.scale.setScalar(1.25);
        this.gyro.position.y = 1.15;
        this.aura.add(this.auraFloor, this.gyro);
        for(let i = 0; i < 2; i++){
            const ring = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.gyro, this.basic(i ? C.petalB : C.mana, 0));
            ring.scale.setScalar(1.3 - i * .1);
            i ? ring.rotation.z = 1.1 : ring.rotation.x = 1.1;
            this.gyro.add(ring);
            this.auraRings.push(ring);
        }
    }
    updateAura(delta, elapsed) {
        this.auraT += ((this.flying ? 1 : 0) - this.auraT) * Math.min(1, delta * 5);
        if (!this.flying && this.auraT < .004) this.auraT = 0;
        this.aura.visible = this.auraT > .01;
        if (this.aura.visible) {
            this.auraFloor.material.opacity = this.auraT * .55;
            this.auraFloor.rotation.z = elapsed * .8;
            this.gyro.rotation.y = elapsed * 1.1;
            this.gyro.rotation.x = Math.sin(elapsed * .7) * .25;
            this.auraRings.forEach((r)=>{
                r.material.opacity = this.auraT * .6;
            });
        }
        const p = this.player.position;
        this.vel.copy(p).sub(this.lastPos).divideScalar(Math.max(delta, 1e-3));
        if (this.vel.lengthSq() > 900) this.vel.setLength(30);
        this.lastPos.copy(p);
        if (!this.flying) {
            this.acc = 0;
            this.petalAcc = 0;
            return;
        }
        this.acc += delta;
        this.petalAcc += delta;
        let n = 0;
        while(this.acc > .02 && n++ < 5){
            this.acc -= .02;
            const a = Math.random() * TAU, r = rr(.25, .75);
            this.fx.emit(p.x + Math.cos(a) * r, p.y + rr(.1, 1.9), p.z + Math.sin(a) * r, {
                vx: -this.vel.x * .25 + rr(-.3, .3),
                vy: rr(.1, .6),
                vz: -this.vel.z * .25 + rr(-.3, .3),
                life: rr(.8, 1.4),
                s0: rr(.14, .26),
                s1: .01,
                c0: Math.random() < .5 ? C.mana : C.paleGold,
                c1: C.barrier,
                a: .7,
                drag: .8
            });
        }
        if (this.acc > .1) this.acc = 0;
        n = 0;
        while(this.petalAcc > .12 && n++ < 3){
            this.petalAcc -= .12;
            const a = Math.random() * TAU, r = rr(.3, 1);
            this.soft.emit(p.x + Math.cos(a) * r, p.y + rr(.4, 1.8), p.z + Math.sin(a) * r, {
                vx: -this.vel.x * .3,
                vy: rr(-.2, .4),
                vz: -this.vel.z * .3,
                life: rr(2, 3.2),
                s0: rr(.14, .22),
                s1: rr(.1, .16),
                c0: [
                    C.petalW,
                    C.petalP,
                    C.petalB
                ][Math.floor(Math.random() * 3)],
                kind: 2,
                a: .95,
                drag: 1,
                grav: .4,
                rotV: rr(-4, 4),
                sway: rr(.4, 1.1)
            });
        }
        if (this.petalAcc > .5) this.petalAcc = 0;
    }
    flightBurst(entering) {
        const p = this.player.position, gy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(p.x, p.z) + .08;
        this.sigil(this.tA.set(p.x, gy, p.z), UP, 'wind', C.mana, 2.2, 1.1, {
            spin: 1.5,
            grow: .3
        });
        for(let k = 0; k < 2; k++){
            const mat = this.basic(k ? C.petalB : C.mana, .8), ring = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](this.geo.torus, mat), delay = k * .1, dur = .6;
            ring.rotation.x = Math.PI / 2;
            this.addEffect(ring, delay + dur, (t)=>{
                const u = clamp01((t * (delay + dur) - delay) / dur), e = easeOutCubic(u);
                ring.visible = u > 0 && u < 1;
                ring.position.set(p.x, p.y + (entering ? e : 1 - e) * 2.4, p.z);
                ring.scale.setScalar(entering ? 1.1 - e * .4 : .7 + e * .5);
                mat.opacity = Math.sin(u * Math.PI) * .85;
            });
        }
        for(let i = 0; i < 54; i++){
            const u = i / 54, a = u * TAU * 3 + Math.random() * .3, r = rr(.45, 1) * (entering ? 1 : .8), tx = -Math.sin(a), tz = Math.cos(a), py = p.y + (entering ? u * .6 : u * 2.2);
            this.fx.emit(p.x + Math.cos(a) * r, py, p.z + Math.sin(a) * r, {
                vx: tx * 3.2,
                vy: entering ? rr(2.5, 5.5) : rr(-1.5, .2),
                vz: tz * 3.2,
                life: rr(.7, 1.3),
                s0: rr(.18, .34),
                s1: .02,
                c0: C.mana,
                c1: C.barrier,
                a: .8,
                drag: 1.5
            });
        }
        for(let i = 0; i < 32; i++){
            const a = Math.random() * TAU, r = rr(.4, 1.3), tx = -Math.sin(a), tz = Math.cos(a), cl = [
                C.petalW,
                C.petalP,
                C.petalB
            ][i % 3];
            this.soft.emit(p.x + Math.cos(a) * r, p.y + (entering ? rr(0, .5) : rr(.3, 2)), p.z + Math.sin(a) * r, {
                vx: tx * rr(1.5, 3.5),
                vy: entering ? rr(1.6, 4.2) : rr(-.4, .6),
                vz: tz * rr(1.5, 3.5),
                life: rr(1.8, 3),
                s0: rr(.14, .22),
                s1: rr(.1, .16),
                c0: cl,
                kind: 2,
                a: .95,
                drag: 1.2,
                grav: entering ? .5 : 1.1,
                rotV: rr(-5, 5),
                sway: rr(.5, 1.4)
            });
        }
        this.flashLight(this.tB.set(p.x, p.y + 1, p.z), C.mana, 8, .5, 9);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/progression.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LOOT_INFO",
    ()=>LOOT_INFO,
    "MAX_RANK",
    ()=>MAX_RANK,
    "PlayerProgression",
    ()=>PlayerProgression,
    "UPGRADE_INFO",
    ()=>UPGRADE_INFO
]);
const LOOT_INFO = {
    wolfPelt: {
        name: 'Pele de lobo',
        rarity: 'Incomum',
        source: 'Lobos'
    },
    banditToken: {
        name: 'Ficha de bandido',
        rarity: 'Incomum',
        source: 'Bandidos'
    },
    demonAsh: {
        name: 'Cinza demoníaca',
        rarity: 'Incomum',
        source: 'Demônios'
    },
    moonFang: {
        name: 'Presa lunar',
        rarity: 'Raro',
        source: 'Lobos'
    },
    ancientSigil: {
        name: 'Selo ancestral',
        rarity: 'Raro',
        source: 'Bandidos'
    },
    demonHeart: {
        name: 'Coração demoníaco',
        rarity: 'Épico',
        source: 'Demônios'
    }
};
const MAX_RANK = 5;
class PlayerProgression {
    level = 1;
    experience = 0;
    nextLevelXp = 100;
    skillPoints = 0;
    ranks = {
        damage: 0,
        size: 0,
        efficiency: 0
    };
    inventory = {
        echoFragment: 0,
        sentinelCore: 0,
        wolfPelt: 0,
        banditToken: 0,
        demonAsh: 0,
        moonFang: 0,
        ancientSigil: 0,
        demonHeart: 0
    };
    recordSentinelDefeat() {
        this.recordExperience(50);
        this.inventory.echoFragment += 1;
        this.inventory.sentinelCore += 1;
    }
    recordExperience(amount) {
        this.experience += amount;
        while(this.experience >= this.nextLevelXp){
            this.experience -= this.nextLevelXp;
            this.level += 1;
            this.skillPoints += 1;
            this.nextLevelXp = 100 + (this.level - 1) * 50;
        }
    }
    addItem(item) {
        this.inventory[item] += 1;
    }
    upgrade(id) {
        if (this.skillPoints < 1 || this.ranks[id] >= MAX_RANK) return false;
        this.skillPoints -= 1;
        this.ranks[id] += 1;
        return true;
    }
    damageMultiplier() {
        return 1 + this.ranks.damage * .15;
    }
    sizeMultiplier() {
        return 1 + this.ranks.size * .14;
    }
    manaCost(baseCost) {
        return Math.max(1, Math.ceil(baseCost * (1 - this.ranks.efficiency * .1)));
    }
    snapshot() {
        return {
            level: this.level,
            experience: this.experience,
            nextLevelXp: this.nextLevelXp,
            skillPoints: this.skillPoints,
            ranks: {
                ...this.ranks
            },
            inventory: {
                ...this.inventory
            }
        };
    }
}
const UPGRADE_INFO = {
    damage: {
        title: 'Potência arcana',
        description: '+15% de dano por nível em todas as magias.'
    },
    size: {
        title: 'Ampliação',
        description: '+14% no tamanho e na área dos efeitos.'
    },
    efficiency: {
        title: 'Eficiência de mana',
        description: '−10% no custo de mana por nível.'
    }
};
;
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
    verticalSpeed;
    direction;
    desired;
    dodgeVelocity;
    dodgeTimer;
    radius;
    constructor(root, colliders){
        this.root = root;
        this.colliders = colliders;
        this.velocity = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.grounded = true;
        this.verticalSpeed = 0;
        this.direction = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.desired = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.dodgeVelocity = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.dodgeTimer = 0;
        this.radius = .62;
    }
    reset() {
        this.velocity.set(0, 0, 0);
        this.verticalSpeed = 0;
        this.grounded = true;
        this.dodgeTimer = 0;
        this.dodgeVelocity.set(0, 0, 0);
    }
    dodge(facingYaw, side) {
        const angle = side === 0 ? facingYaw + Math.PI : facingYaw + (side > 0 ? Math.PI / 2 : -Math.PI / 2);
        this.dodgeVelocity.set(Math.sin(angle) * 11, 0, Math.cos(angle) * 11);
        this.dodgeTimer = .24;
    }
    update(delta, moveForward, moveSide, sprint, jump, facingYaw, flight = false, verticalInput = 0, cameraPitch = 0) {
        const dt = Math.min(delta, .05);
        const inputLength = Math.hypot(moveForward, moveSide);
        const speed = flight ? sprint ? 13 : 8 : sprint ? 8.2 : 5.4;
        let moving = inputLength > .01;
        if (inputLength > 0) {
            const forwardX = -Math.sin(facingYaw);
            const forwardZ = -Math.cos(facingYaw);
            const rightX = Math.cos(facingYaw);
            const rightZ = -Math.sin(facingYaw);
            this.direction.set(forwardX * moveForward + rightX * moveSide, 0, forwardZ * moveForward + rightZ * moveSide).normalize();
        } else this.direction.set(0, 0, 0);
        if (flight) {
            const forwardLift = -moveForward * Math.sin(cameraPitch) * (sprint ? 7.6 : 5.2);
            this.desired.set(this.direction.x * speed, verticalInput * speed + forwardLift, this.direction.z * speed);
            this.velocity.lerp(this.desired, 1 - Math.exp(-dt * 5));
            this.root.position.addScaledVector(this.velocity, dt);
            this.root.position.y = Math.max((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(this.root.position.x, this.root.position.z) + .2, this.root.position.y);
            this.verticalSpeed = this.velocity.y;
            this.grounded = this.root.position.y <= (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(this.root.position.x, this.root.position.z) + .21;
            return moving;
        }
        if (jump && this.grounded) {
            this.verticalSpeed = 8.2;
            this.grounded = false;
        }
        this.verticalSpeed -= 22 * dt;
        const acceleration = moving ? 14 : 18;
        this.velocity.x = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(this.velocity.x, this.direction.x * speed, acceleration, dt);
        this.velocity.z = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(this.velocity.z, this.direction.z * speed, acceleration, dt);
        if (this.dodgeTimer > 0) {
            this.dodgeTimer = Math.max(0, this.dodgeTimer - dt);
            this.velocity.x = this.dodgeVelocity.x;
            this.velocity.z = this.dodgeVelocity.z;
            moving = true;
        }
        this.root.position.x += this.velocity.x * dt;
        this.root.position.z += this.velocity.z * dt;
        for (const collider of this.colliders){
            const dx = this.root.position.x - collider.x;
            const dz = this.root.position.z - collider.z;
            const minDistance = this.radius + collider.radius;
            const distanceSq = dx * dx + dz * dz;
            if (distanceSq < minDistance * minDistance) {
                const distance = Math.sqrt(distanceSq) || .001;
                this.root.position.x = collider.x + dx / distance * minDistance;
                this.root.position.z = collider.z + dz / distance * minDistance;
            }
        }
        this.root.position.y += this.verticalSpeed * dt;
        const ground = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(this.root.position.x, this.root.position.z);
        if (this.root.position.y <= ground) {
            this.root.position.y = ground;
            this.verticalSpeed = 0;
            this.grounded = true;
        } else this.grounded = false;
        return moving;
    }
}
class ThirdPersonCamera {
    camera;
    parts;
    yaw;
    pitch;
    distance;
    aimRange;
    sensitivity;
    targetHeight;
    shoulderOffset;
    // --- Shift Lock framing ---
    // Camera sits to the RIGHT of the hero; the reticle stays at screen center.
    shiftLockShoulderOffset;
    // Where the hero appears on screen, as a fraction of the half-viewport
    // (-1 = left/bottom edge, 0 = center, 1 = right/top edge).
    lockedScreenX;
    lockedScreenY;
    lockBlendSharpness;
    minPitch;
    maxPitch;
    followSharpness;
    collisionReleaseSharpness;
    collisionApproachSharpness;
    minimumCollisionDistance;
    collisionPadding;
    minimumCameraHeight;
    // Collision raycast runs at ~30 Hz instead of every frame.
    collisionInterval;
    currentDistance;
    collisionDistance;
    cachedHitDistance;
    collisionTimer;
    lockBlend;
    shiftLocked;
    raycaster;
    target;
    offset;
    desired;
    look;
    right;
    forward;
    up;
    rayDirection;
    screenCenter;
    collisionHits;
    aimHits;
    aimScratch;
    collisionObjects;
    aimObjects;
    constructor(camera, parts){
        this.camera = camera;
        this.parts = parts;
        this.yaw = 0;
        this.pitch = .19;
        this.distance = 9.2;
        this.aimRange = 40;
        this.sensitivity = .0032;
        this.targetHeight = 1.68;
        this.shoulderOffset = .9;
        this.shiftLockShoulderOffset = 3.2;
        this.lockedScreenX = -.58;
        this.lockedScreenY = -.5;
        this.lockBlendSharpness = 9;
        this.minPitch = -.12;
        this.maxPitch = .72;
        this.followSharpness = 12;
        this.collisionReleaseSharpness = 7;
        this.collisionApproachSharpness = 18;
        this.minimumCollisionDistance = 3.8;
        this.collisionPadding = .36;
        this.minimumCameraHeight = .85;
        this.collisionInterval = 1 / 30;
        this.currentDistance = 9.2;
        this.collisionDistance = 9.2;
        this.cachedHitDistance = Infinity;
        this.collisionTimer = Infinity; // forces a raycast on the first frame
        this.lockBlend = 0;
        this.shiftLocked = false;
        this.raycaster = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Raycaster"]();
        this.target = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.offset = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.desired = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.look = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.right = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.forward = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.up = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.rayDirection = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        this.screenCenter = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](0, 0);
        this.collisionHits = [];
        this.aimHits = [];
        this.aimScratch = [];
        // Forest meshes use a local camera fade; letting their instanced bounds
        // collapse the orbit distance causes the near-first-person camera snap.
        this.collisionObjects = parts.blockers.filter((o)=>o.name !== 'forest-trunks' && o.name !== 'field-stones');
        this.aimObjects = [
            ...parts.blockers,
            parts.ground
        ];
    }
    setShiftLock(enabled) {
        this.shiftLocked = enabled;
    }
    rotate(dx, dy) {
        this.yaw -= dx * this.sensitivity;
        this.yaw = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].euclideanModulo(this.yaw + Math.PI, Math.PI * 2) - Math.PI;
        this.pitch = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(this.pitch + dy * this.sensitivity, this.minPitch, this.maxPitch);
    }
    zoom(delta) {
        this.distance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(this.distance + delta * .008, 5, 14);
    }
    update(root, delta) {
        // Smooth 0..1 blend so toggling Shift Lock glides instead of snapping.
        const blend = this.lockBlend = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(this.lockBlend, this.shiftLocked ? 1 : 0, this.lockBlendSharpness, delta);
        this.target.set(root.position.x, root.position.y + this.targetHeight, root.position.z);
        this.right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
        const horizontal = Math.cos(this.pitch) * this.distance;
        this.offset.set(Math.sin(this.yaw) * horizontal, Math.sin(this.pitch) * this.distance + .3, Math.cos(this.yaw) * horizontal);
        this.offset.addScaledVector(this.right, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(this.shoulderOffset, this.shiftLockShoulderOffset, blend));
        const fullDistance = this.offset.length();
        // --- Collision (throttled; result is cached between checks) ---
        this.collisionTimer += delta;
        if (this.collisionTimer >= this.collisionInterval) {
            this.collisionTimer = 0;
            this.rayDirection.copy(this.offset).divideScalar(fullDistance);
            this.raycaster.near = .1;
            this.raycaster.far = fullDistance;
            this.raycaster.set(this.target, this.rayDirection);
            this.collisionHits.length = 0;
            this.raycaster.intersectObjects(this.collisionObjects, true, this.collisionHits);
            this.cachedHitDistance = this.collisionHits.length ? this.collisionHits[0].distance : Infinity;
        }
        const requestedDistance = this.cachedHitDistance < fullDistance - .2 ? Math.max(this.minimumCollisionDistance, this.cachedHitDistance - this.collisionPadding) : fullDistance;
        if (requestedDistance < this.collisionDistance) this.collisionDistance = requestedDistance;
        else this.collisionDistance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(this.collisionDistance, requestedDistance, this.collisionReleaseSharpness, delta);
        this.currentDistance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].damp(this.currentDistance, this.collisionDistance, this.collisionApproachSharpness, delta);
        this.desired.copy(this.offset).setLength(this.currentDistance).add(this.target);
        this.desired.y = Math.max(this.desired.y, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terrainHeight"])(this.desired.x, this.desired.z) + this.minimumCameraHeight);
        this.camera.position.lerp(this.desired, 1 - Math.exp(-delta * this.followSharpness));
        // --- Look point ---
        // Normal mode: tiny shoulder bias. Locked: aim the camera ahead/right/above the hero
        // so the hero lands in the lower-left of the screen and the reticle stays centered.
        this.look.copy(this.target).addScaledVector(this.right, .12 * (1 - blend));
        if (blend > .001) {
            const d = this.camera.position.distanceTo(this.target);
            this.forward.copy(this.target).sub(this.camera.position).normalize();
            this.up.crossVectors(this.right, this.forward).normalize();
            const halfH = Math.tan(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].degToRad(this.camera.fov * .5)) * d;
            const halfW = halfH * this.camera.aspect;
            this.look.addScaledVector(this.right, -this.lockedScreenX * halfW * blend);
            this.look.addScaledVector(this.up, -this.lockedScreenY * halfH * blend);
        }
        this.camera.lookAt(this.look);
    }
    getAimPoint(out, extraTargets = []) {
        this.camera.updateMatrixWorld();
        for(let i = 0; i < extraTargets.length; i++)extraTargets[i].updateWorldMatrix(true, false);
        let targets = this.aimObjects;
        if (extraTargets.length) {
            // Reuse one scratch array instead of allocating every call.
            this.aimScratch.length = 0;
            for (const o of this.aimObjects)this.aimScratch.push(o);
            for (const o of extraTargets)this.aimScratch.push(o);
            targets = this.aimScratch;
        }
        this.raycaster.setFromCamera(this.screenCenter, this.camera);
        this.raycaster.near = .1;
        this.raycaster.far = this.aimRange;
        this.aimHits.length = 0;
        this.raycaster.intersectObjects(targets, true, this.aimHits);
        for(let i = 0; i < this.aimHits.length; i++){
            const hit = this.aimHits[i];
            const isLocallyFaded = hit.object.name === 'forest-trunks' || hit.object.name === 'field-stones';
            if (isLocallyFaded && hit.distance < 4.6) continue;
            return out.copy(hit.point);
        }
        this.raycaster.ray.at(this.aimRange, out);
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
    "CLEARINGS",
    ()=>CLEARINGS,
    "POND",
    ()=>POND,
    "STREAM",
    ()=>STREAM,
    "STREAM_BANK",
    ()=>STREAM_BANK,
    "TIME",
    ()=>TIME,
    "WATER_Y",
    ()=>WATER_Y,
    "createWorld",
    ()=>createWorld,
    "fbm",
    ()=>fbm,
    "glowTexture",
    ()=>glowTexture,
    "h3",
    ()=>h3,
    "inClearing",
    ()=>inClearing,
    "nearPath",
    ()=>nearPath,
    "patch",
    ()=>patch,
    "pathX",
    ()=>pathX,
    "pondDist",
    ()=>pondDist,
    "seeded",
    ()=>seeded,
    "setWorldQuality",
    ()=>setWorldQuality,
    "stoneify",
    ()=>stoneify,
    "streamDist",
    ()=>streamDist,
    "streamInfo",
    ()=>streamInfo,
    "terrainHeight",
    ()=>terrainHeight,
    "updateDayCycle",
    ()=>updateDayCycle,
    "updateWorld",
    ()=>updateWorld,
    "vnoise",
    ()=>vnoise
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './world-props'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const { smoothstep, lerp } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"];
const TIME = {
    value: 0
}; // uniform compartilhado: vento, água, céu, brilho
const temp = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Object3D"]();
const tmpColor = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]();
const tmpV = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
const POND = {
    x: -24,
    z: 16,
    r: 9
};
const WATER_Y = -.3;
const FOLIAGE = [
    '#4d7356',
    '#66855e',
    '#82956a',
    '#506c64',
    '#758b58'
];
const PINES = [
    '#2f5440',
    '#3a6249',
    '#2b4c3d',
    '#42694e'
];
const GRASS = [
    '#7aa254',
    '#8cb060',
    '#6a9648',
    '#98b462',
    '#82a65a'
];
const BLOOMS = [
    '#f2e3a0',
    '#e59a94',
    '#f0efe0',
    '#b9a6e0',
    '#f6c86a'
];
const BIRCH = [
    '#8fa860',
    '#a2b56a',
    '#7f9c55'
];
const ROCKS = [
    '#8a8b7e',
    '#7b7d72',
    '#9a968a',
    '#6f7768',
    '#847a6a'
];
function seeded(n) {
    const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return v - Math.floor(v);
}
function h3(x, y, z, s) {
    const v = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + s) * 43758.5453;
    return v - Math.floor(v);
}
function vnoise(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    const a = seeded(ix + iy * 57), b = seeded(ix + 1 + iy * 57), c = seeded(ix + (iy + 1) * 57), d = seeded(ix + 1 + (iy + 1) * 57);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, oct = 4) {
    let s = 0, a = .5;
    for(let i = 0; i < oct; i++){
        s += vnoise(x, y) * a;
        x = x * 2.03 + 17;
        y = y * 2.03 + 9;
        a *= .5;
    }
    return s;
}
function pathX(z) {
    const t = (10 - z) / 31;
    return Math.sin(t * Math.PI * 1.15) * 1.5;
}
function nearPath(x, z, pad) {
    return z > -22 - pad && z < 11 + pad && Math.abs(x - pathX(z)) < 1.7 + pad;
}
function pondDist(x, z) {
    return Math.hypot(x - POND.x, z - POND.z);
}
/* riacho que desce das montanhas a oeste até o lago */ const STREAM_KEYS = [
    [
        -104,
        -64
    ],
    [
        -86,
        -52
    ],
    [
        -72,
        -40
    ],
    [
        -61,
        -27
    ],
    [
        -53,
        -15
    ],
    [
        -45,
        -4
    ],
    [
        -38,
        5
    ],
    [
        -31,
        11
    ],
    [
        -26,
        15
    ]
];
const STREAM = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SplineCurve"](STREAM_KEYS.map(([x, z])=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](x, z))).getSpacedPoints(110);
const STREAM_BANK = (()=>{
    const out = [];
    let prev = Infinity;
    for (const p of STREAM){
        prev = Math.min(prev, baseHeight(p.x, p.y) * .6 + .2);
        out.push(Math.max(prev, WATER_Y + .42));
    }
    return out;
})();
const streamHit = {
    d: Infinity,
    bank: 0,
    i: 0
};
function streamInfo(x, z) {
    streamHit.d = Infinity;
    if (x > -12 || z > 32 || z < -80) return streamHit;
    let best = Infinity, bi = 0, bt = 0;
    for(let i = 0; i < STREAM.length - 1; i++){
        const a = STREAM[i], b = STREAM[i + 1], abx = b.x - a.x, abz = b.y - a.y;
        const t = Math.max(0, Math.min(1, ((x - a.x) * abx + (z - a.y) * abz) / (abx * abx + abz * abz)));
        const dx = x - a.x - abx * t, dz = z - a.y - abz * t, d = dx * dx + dz * dz;
        if (d < best) {
            best = d;
            bi = i;
            bt = t;
        }
    }
    streamHit.d = Math.sqrt(best);
    streamHit.i = bi + bt;
    streamHit.bank = lerp(STREAM_BANK[bi], STREAM_BANK[bi + 1], bt);
    return streamHit;
}
function streamDist(x, z) {
    return streamInfo(x, z).d;
}
const CLEARINGS = [
    {
        x: 19,
        z: 0,
        r: 9.5
    },
    {
        x: -19,
        z: -45,
        r: 7
    },
    {
        x: 42,
        z: -46,
        r: 7.5
    },
    {
        x: 3,
        z: 8.5,
        r: 1.6
    }
];
function inClearing(x, z, pad = 0) {
    return CLEARINGS.some((c)=>Math.hypot(x - c.x, z - c.z) < c.r + pad);
}
function baseHeight(x, z) {
    const meadowFade = smoothstep(Math.hypot(x * .72, z + 1) - 12, 0, 24);
    const edge = 1 - smoothstep(Math.hypot(x, z), 92, 124);
    const broad = Math.max(0, fbm(x * .021 + 4.3, z * .021 - 2.7) - .36) * 13;
    const detail = (fbm(x * .11 + 19, z * .11 + 7, 3) - .5) * .7;
    return (broad + detail) * meadowFade * edge;
}
function terrainHeight(x, z) {
    let h = baseHeight(x, z);
    const st = streamInfo(x, z);
    if (st.d < 16) {
        h = lerp(h, st.bank, 1 - smoothstep(st.d, 3.4, 16)); // vale suave até a margem
        h -= (1 - smoothstep(st.d, 1, 3.7)) * .95; // leito
    }
    for (const c of CLEARINGS){
        const k = 1 - smoothstep(Math.hypot(x - c.x, z - c.z), c.r * .55, c.r * 1.2);
        if (k > 0) h = lerp(h, h * .25 + .05, k);
    }
    const p = 1 - smoothstep(pondDist(x, z), POND.r * .45, POND.r * 1.7);
    return lerp(h, -1.05, p * p * (3 - 2 * p));
}
function stoneify(g, amp, color, moss = 0) {
    g.computeBoundingBox();
    const top = g.boundingBox.max.y, span = Math.max(.01, top - g.boundingBox.min.y);
    const p = g.attributes.position;
    const col = new Float32Array(p.count * 3);
    const base = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](color), mossC = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#6d8a49'), c = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]();
    for(let i = 0; i < p.count; i++){
        const ox = p.getX(i), oy = p.getY(i), oz = p.getZ(i);
        p.setXYZ(i, ox + (h3(ox, oy, oz, 1) - .5) * amp, oy + (h3(ox, oy, oz, 2) - .5) * amp, oz + (h3(ox, oy, oz, 3) - .5) * amp);
        c.copy(base).multiplyScalar(.7 + vnoise(ox * 2.1 + oz * 1.3, oy * 2.4 + ox) * .55);
        if (moss) c.lerp(mossC, smoothstep(oy, top - span * .35, top) * moss);
        col[i * 3] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferAttribute"](col, 3));
    return g;
}
function makeGrassGeometry(blades) {
    const pos = [], col = [], idx = [];
    for(let b = 0; b < blades; b++){
        const a = seeded(b * 7 + 1) * 6.283, d = .02 + seeded(b * 3 + 2) * .17;
        const ox = Math.cos(a) * d, oz = Math.sin(a) * d, dir = seeded(b * 5 + 3) * 6.283;
        const h = .3 + seeded(b * 11 + 4) * .34, w = .03 + seeded(b + 9) * .016, lean = .04 + seeded(b * 13 + 5) * .13;
        const cx = Math.cos(dir), cz = Math.sin(dir), s = pos.length / 3;
        pos.push(ox - cz * w, 0, oz + cx * w, ox + cz * w, 0, oz - cx * w, ox + cx * lean, h, oz + cz * lean);
        col.push(.4, .45, .35, .4, .45, .35, 1.05, 1.05, .8);
        idx.push(s, s + 1, s + 2, s, s + 2, s + 1); // as duas faces, sem depender de DoubleSide
    }
    const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    g.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](pos, 3));
    g.setAttribute('color', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](col, 3));
    g.setAttribute('normal', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](pos.map((_, i)=>i % 3 === 1 ? 1 : 0), 3)); // normal para cima = luz suave
    g.setIndex(idx);
    return g;
}
function makeWings(span, chord) {
    const pos = [], idx = [];
    [
        -1,
        1
    ].forEach((s, k)=>{
        const o = k * 4;
        pos.push(0, 0, chord * .4, s * span, 0, chord * .1, s * span * .9, 0, -chord * .55, 0, 0, -chord * .35);
        idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
    });
    const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    g.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](pos, 3));
    g.setIndex(idx);
    return g;
}
function makeMountainRing(radius, maxH, seed, rows) {
    const seg = 200, vertices = [], colors = [], indices = [];
    const cols = rows.map((r)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](r)), fr = [
        0,
        .5,
        .8,
        1
    ];
    for(let i = 0; i <= seg; i++){
        const a = i / seg * Math.PI * 2;
        const ridge = 1 - Math.abs(fbm(Math.cos(a) * 3.7 + seed * 11, Math.sin(a) * 3.7 + seed * 7) * 2 - 1);
        const jag = Math.sin(a * 61 + seed) * .5 + Math.sin(a * 137 + seed * 2) * .3;
        const peak = 6 + Math.pow(ridge, 1.8) * maxH + jag * maxH * .05;
        for(let r = 0; r < 4; r++){
            vertices.push(Math.cos(a) * radius, -8 + (peak + 8) * fr[r], Math.sin(a) * radius);
            colors.push(cols[r].r, cols[r].g, cols[r].b);
            if (i < seg && r < 3) {
                const q = i * 4 + r;
                indices.push(q, q + 4, q + 1, q + 1, q + 4, q + 5);
            }
        }
    }
    const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    g.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](vertices, 3));
    g.setAttribute('color', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](colors, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](g, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        vertexColors: true,
        roughness: 1,
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
    }));
    m.name = 'distant-mountain-ridge';
    return m;
}
function makeRibbon(points, widths, material, center, edge) {
    const vertices = [], colors = [], indices = [];
    const cc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](center), ec = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](edge);
    points.forEach((point, i)=>{
        const before = points[Math.max(0, i - 1)], after = points[Math.min(points.length - 1, i + 1)];
        const t = after.clone().sub(before).normalize();
        const w = widths[i] * (.88 + vnoise(i * .7, 3) * .24) / 2;
        const side = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-t.z, 0, t.x).multiplyScalar(w);
        [
            point.clone().add(side),
            point.clone(),
            point.clone().sub(side)
        ].forEach((v, k)=>{
            vertices.push(v.x, terrainHeight(v.x, v.z) + .08, v.z);
            const c = k === 1 ? cc : ec;
            colors.push(c.r, c.g, c.b);
        });
        if (i < points.length - 1) {
            const q = i * 3;
            indices.push(q, q + 3, q + 1, q + 1, q + 3, q + 4, q + 1, q + 4, q + 2, q + 2, q + 4, q + 5);
        }
    });
    const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    g.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](vertices, 3));
    g.setAttribute('color', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](colors, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](g, material);
}
function glowTexture() {
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(.25, 'rgba(255,255,255,.55)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    const t = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
    t.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    return t;
}
function patch(material, key, o = {}) {
    const fade = !!o.fade;
    if (fade) material.alphaHash = true;
    material.onBeforeCompile = (shader)=>{
        shader.uniforms.uTime = TIME;
        const sway = o.sway ? `float sw = sin(uTime * 1.1 + ip.x * .23 + ip.z * .19);
      float bend = max(position.y + ${o.sway[1].toFixed(2)}, 0.0);
      transformed.x += sw * ${o.sway[0].toFixed(3)} * bend;
      transformed.z += sw * ${(o.sway[0] * .5).toFixed(3)} * bend;` : '';
        shader.vertexShader = `uniform float uTime;\n${fade ? 'varying vec3 vFadePos;\n' : ''}${shader.vertexShader}`.replace('#include <begin_vertex>', `#include <begin_vertex>
      vec3 ip = vec3(0.0); mat4 im = mat4(1.0);
      #ifdef USE_INSTANCING
      im = instanceMatrix; ip = instanceMatrix[3].xyz;
      #endif
      ${sway}
      ${fade ? 'vFadePos = (modelMatrix * im * vec4(transformed, 1.0)).xyz;' : ''}`);
        if (fade) shader.fragmentShader = `varying vec3 vFadePos;\n${shader.fragmentShader}`.replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.a *= smoothstep(1.4, 4.6, distance(vFadePos, cameraPosition));');
    };
    material.customProgramCacheKey = ()=>key;
    return material;
}
function flapMaterial(speed, amp, key) {
    const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
    });
    m.onBeforeCompile = (shader)=>{
        shader.uniforms.uTime = TIME;
        shader.vertexShader = `uniform float uTime;\n${shader.vertexShader}`.replace('#include <begin_vertex>', `#include <begin_vertex>
      float fl = sin(uTime * ${speed.toFixed(1)} + float(gl_InstanceID) * 2.7);
      transformed.y += abs(position.x) * fl * ${amp.toFixed(2)};
      transformed.x *= 1.0 - 0.22 * abs(fl);`);
    };
    m.customProgramCacheKey = ()=>key;
    return m;
}
/* ───────────── monumento ───────────── */ function makeLandmark(scene, stoneMat, colliders, blockers) {
    const group = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    group.name = 'hero-marker';
    group.position.set(0, terrainHeight(0, -12), -12);
    const add = (g, y, color, amp = .06, moss = 0)=>{
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](stoneify(g, amp, color, moss), stoneMat);
        m.position.y = y;
        m.castShadow = m.receiveShadow = true;
        group.add(m);
        return m;
    };
    add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](2.9, 3.1, .35, 12, 2), .17, '#6b7168', .08, .5);
    add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](2.4, 2.7, .28, 12, 2), .49, '#8c8c7c', .07, .4);
    add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](1.8, 2.05, .24, 12, 2), .75, '#a5a28d', .05, .3);
    const shaftGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](1.15, 3.6, .7, 3, 8, 2);
    const sp = shaftGeo.attributes.position;
    for(let i = 0; i < sp.count; i++){
        const k = 1 - (sp.getY(i) + 1.8) / 3.6 * .22;
        sp.setX(i, sp.getX(i) * k);
        sp.setZ(i, sp.getZ(i) * k);
    }
    const shaft = add(shaftGeo, 2.67, '#aaa58f', .05, .35);
    shaft.rotation.z = -.04;
    add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](1.42, .18, .82, 3, 1, 2), 4.55, '#6f766b', .04);
    const crown = add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](.82, .8, 4, 1, false), 5.04, '#aaa58f', .03);
    crown.rotation.y = Math.PI / 4;
    const gold = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#d8c38e',
        roughness: .4,
        metalness: .45,
        emissive: '#685532',
        emissiveIntensity: .25
    });
    const medallion = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](.31, .05, 10, 36), gold);
    medallion.position.set(0, 3.0, .38);
    group.add(medallion);
    const inset = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OctahedronGeometry"](.15, 0), gold);
    inset.position.set(0, 3.0, .43);
    group.add(inset);
    const glyphMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#16322d',
        emissive: '#6ff0d0',
        emissiveIntensity: .8,
        roughness: .5
    });
    [
        [
            0,
            2.2,
            .05,
            .5
        ],
        [
            -.22,
            3.65,
            .26,
            .05
        ],
        [
            .22,
            3.65,
            .26,
            .05
        ],
        [
            0,
            3.8,
            .05,
            .36
        ],
        [
            -.26,
            1.95,
            .24,
            .05
        ],
        [
            .26,
            1.95,
            .24,
            .05
        ]
    ].forEach(([x, y, w, h])=>{
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](w, h, .02), glyphMaterial);
        m.position.set(x, y, .355);
        group.add(m);
    });
    const rune = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    rune.name = 'marker-rune';
    rune.position.set(0, 3.0, .6);
    for(let i = 0; i < 5; i++){
        const f = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.04, 8, 6), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#bffff0'
        }));
        const a = i / 5 * Math.PI * 2;
        f.position.set(Math.cos(a) * .68, Math.sin(a) * .54, 0);
        rune.add(f);
    }
    group.add(rune);
    const crystalMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#bff4e6',
        emissive: '#5fe0c4',
        emissiveIntensity: 1,
        roughness: .15,
        metalness: .1,
        transparent: true,
        opacity: .93,
        flatShading: true
    });
    const crystal = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OctahedronGeometry"](.34, 0), crystalMaterial);
    crystal.scale.set(1, 1.8, 1);
    crystal.position.y = 6.5;
    crystal.castShadow = true;
    group.add(crystal);
    const crystalLight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"]('#7fead0', 1.1, 11, 2);
    crystal.add(crystalLight);
    const orbit = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    orbit.position.y = 6.5;
    for(let i = 0; i < 3; i++){
        const s = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OctahedronGeometry"](.1, 0), crystalMaterial);
        const a = i / 3 * Math.PI * 2;
        s.position.set(Math.cos(a) * .85, Math.sin(a * 2) * .2, Math.sin(a) * .85);
        orbit.add(s);
    }
    group.add(orbit);
    const ringMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
        color: '#7ad8c0',
        transparent: true,
        opacity: .18,
        blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"],
        depthWrite: false,
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
    });
    const ring = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RingGeometry"](3.15, 3.95, 56), ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = .06;
    group.add(ring);
    const stoneLight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"]('#d9c78e', .65, 9, 2);
    stoneLight.position.set(0, 2.8, 1.5);
    group.add(stoneLight);
    // círculo de pedras erguidas (abre passagem para a trilha)
    for(let k = 0; k < 9; k++){
        const a = k / 9 * Math.PI * 2 + .3;
        if (Math.abs(Math.cos(a)) < .3) continue;
        const x = Math.cos(a) * 7, z = -12 + Math.sin(a) * 7, hgt = 1.7 + seeded(k + 40) * 1.2;
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](stoneify(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](.75, hgt, .55, 2, 4, 2), .12, '#8e8e80', .5), stoneMat);
        m.position.set(x, terrainHeight(x, z) + hgt / 2 - .1, z);
        m.rotation.set((seeded(k + 70) - .5) * .12, seeded(k + 80) * 3, (seeded(k + 90) - .5) * .14);
        m.castShadow = m.receiveShadow = true;
        scene.add(m);
        blockers.push(m);
        colliders.push({
            x,
            z,
            radius: .5
        });
    }
    scene.add(group);
    return {
        group,
        rune,
        crystal,
        orbit,
        crystalMaterial,
        glyphMaterial,
        ringMaterial,
        stoneLight
    };
}
function createWorld(scene) {
    const blockers = [];
    const colliders = [];
    const scalable = [];
    const keepMax = (m)=>{
        m.userData.maxInstances = m.count;
        m.frustumCulled = false;
        scalable.push(m);
        return m;
    };
    const stoneMat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        vertexColors: true,
        roughness: .93,
        flatShading: true
    });
    // terreno com cor por altura / inclinação / margem do lago
    const gg = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](260, 260, 180, 180);
    const gp = gg.attributes.position;
    for(let i = 0; i < gp.count; i++)gp.setZ(i, terrainHeight(gp.getX(i), -gp.getY(i)));
    gg.computeVertexNormals();
    const gn = gg.attributes.normal, gc = new Float32Array(gp.count * 3);
    const C = {
        lush: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#6f9552'),
        dark: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#4f7440'),
        dry: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#a3a366'),
        rock: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#85836f'),
        sand: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#b9a97e'),
        mud: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#665641')
    };
    const col = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]();
    for(let i = 0; i < gp.count; i++){
        const x = gp.getX(i), z = -gp.getY(i), h = gp.getZ(i), dp = pondDist(x, z), slope = 1 - gn.getZ(i);
        col.copy(C.lush).lerp(C.dark, smoothstep(fbm(x * .045, z * .045), .35, .6)).lerp(C.dry, smoothstep(vnoise(x * .35, z * .35), .5, .95) * .45 + smoothstep(h, 2.2, 5.5) * .35).lerp(C.rock, smoothstep(slope, .05, .2) * .85).lerp(C.sand, smoothstep(dp, POND.r * .6, POND.r) * (1 - smoothstep(dp, POND.r * 1.15, POND.r * 1.6)) * .8).lerp(C.mud, (1 - smoothstep(dp, POND.r * .3, POND.r * .95)) * .85);
        gc[i * 3] = col.r;
        gc[i * 3 + 1] = col.g;
        gc[i * 3 + 2] = col.b;
    }
    gg.setAttribute('color', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferAttribute"](gc, 3));
    const groundMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        vertexColors: true,
        roughness: .97
    });
    groundMaterial.onBeforeCompile = (shader)=>{
        shader.vertexShader = `varying vec3 vMeadowPosition;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\nvMeadowPosition = (modelMatrix * vec4(position, 1.0)).xyz;');
        shader.fragmentShader = `varying vec3 vMeadowPosition;\n${shader.fragmentShader}`.replace('#include <color_fragment>', `#include <color_fragment>
      float broad = sin(vMeadowPosition.x * .19 + sin(vMeadowPosition.z * .13)) * cos(vMeadowPosition.z * .16);
      float fine = sin(vMeadowPosition.x * 2.7 + vMeadowPosition.z * 1.9) * cos(vMeadowPosition.z * 2.4 - vMeadowPosition.x * .7);
      float grain = fract(sin(dot(floor(vMeadowPosition.xz * 12.0), vec2(12.9898, 78.233))) * 43758.5453);
      diffuseColor.rgb *= 0.95 + broad * .05 + fine * .02 + grain * .07;`);
    };
    groundMaterial.customProgramCacheKey = ()=>'aurora-meadow-v3';
    const ground = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](gg, groundMaterial);
    ground.name = 'ground';
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const far = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleGeometry"](300, 48), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#667a52',
        roughness: 1
    }));
    far.rotation.x = -Math.PI / 2;
    far.position.y = -.15;
    scene.add(far);
    // céu: gradiente, nuvens animadas, estrelas e brilho do sol
    const skyMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BackSide"],
        depthWrite: false,
        fog: false,
        uniforms: {
            uDaylight: {
                value: .18
            },
            uDusk: {
                value: 1
            },
            uTime: TIME,
            uSunDir: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 1, 0)
            }
        },
        vertexShader: `varying vec3 vDir; void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vDir = wp.xyz - cameraPosition; gl_Position = projectionMatrix * viewMatrix * wp; }`,
        fragmentShader: `uniform float uDaylight; uniform float uDusk; uniform float uTime; uniform vec3 uSunDir; varying vec3 vDir;
      float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1.,0.)),f.x),mix(hs(i+vec2(0.,1.)),hs(i+vec2(1.,1.)),f.x),f.y);}
      float fb(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=ns(p)*a;p=p*2.03+7.3;a*=.5;}return s;}
      void main(){
        vec3 d = normalize(vDir);
        float h = smoothstep(-.28, .78, d.y);
        vec3 horizon = mix(mix(vec3(.09,.13,.2), vec3(.82,.57,.48), uDusk), vec3(.62,.76,.83), uDaylight);
        vec3 zenith = mix(vec3(.05,.08,.16), vec3(.3,.52,.68), uDaylight);
        vec3 col = mix(horizon, zenith, pow(h, .72));
        float sd = max(dot(d, uSunDir), 0.);
        col += vec3(1.,.72,.45) * (pow(sd,48.)*.55 + pow(sd,6.)*.18) * (.25 + uDusk*.75) * smoothstep(-.2,.1,uSunDir.y);
        float cm = smoothstep(0., .22, d.y);
        vec2 uv = d.xz / (max(d.y, 0.) + .18) * 1.15 + vec2(uTime*.012, uTime*.005);
        float c = smoothstep(.46, .8, fb(uv)) * cm;
        vec3 q = floor(d * 160.);
        float r = fract(sin(dot(q, vec3(12.9898,78.233,37.719))) * 43758.5453);
        float star = step(.9972, r) * (1.-uDaylight) * smoothstep(.02,.3,d.y) * (.6 + .4*sin(uTime*2. + r*90.));
        col += vec3(star) * (1. - c);
        vec3 cl = mix(vec3(.2,.24,.34), vec3(1.), uDaylight);
        cl = mix(cl, vec3(1.,.7,.55), uDusk*.55);
        float shade = smoothstep(.45, .95, fb(uv*1.7 + 3.1));
        vec3 cc = cl * (1. - shade*.28) + vec3(1.,.8,.6) * pow(sd,5.) * .25 * uDaylight;
        gl_FragColor = vec4(mix(col, cc, c*.9), 1.);
      }`
    });
    const skyDome = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](220, 40, 24), skyMaterial);
    skyDome.name = 'atmosphere-sky-dome';
    skyDome.frustumCulled = false;
    skyDome.renderOrder = -1000;
    scene.add(skyDome);
    const sunDisc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](2.7, 24, 16), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
        color: '#ffe0ad',
        fog: false
    }));
    sunDisc.name = 'soft-sun-disc';
    scene.add(sunDisc);
    const moon = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](2.1, 24, 16), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
        color: '#dfe6f2',
        fog: false
    }));
    moon.name = 'moon';
    scene.add(moon);
    scene.add(makeMountainRing(150, 26, 1, [
        '#2f4a3a',
        '#43604a',
        '#66756c',
        '#8b9794'
    ]), makeMountainRing(174, 36, 2, [
        '#425c52',
        '#587068',
        '#7b8b88',
        '#a2b0b2'
    ]), makeMountainRing(198, 46, 3, [
        '#586f6c',
        '#6e8582',
        '#92a2a2',
        '#c4d0d4'
    ]));
    // lago animado
    const waterMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#3f6f7d',
        roughness: .06,
        metalness: .15,
        transparent: true,
        opacity: .85
    });
    waterMaterial.onBeforeCompile = (shader)=>{
        shader.uniforms.uTime = TIME;
        shader.uniforms.uPond = {
            value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](POND.x, POND.z, 15)
        };
        shader.vertexShader = `varying vec3 vWPos;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        shader.fragmentShader = `uniform float uTime; uniform vec3 uPond; varying vec3 vWPos;\n${shader.fragmentShader}`.replace('#include <color_fragment>', `#include <color_fragment>
        float rr = length(vWPos.xz - uPond.xy) / uPond.z;
        diffuseColor.rgb = mix(vec3(.04,.16,.2), vec3(.22,.48,.46), smoothstep(0., .75, rr));
        diffuseColor.a *= (1. - smoothstep(.6, .98, rr)) * .8 + .12;`).replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        vec2 wp = vWPos.xz;
        float w1 = sin(wp.x*1.7 + uTime*1.3) * cos(wp.y*1.3 - uTime*.9);
        float w2 = sin(wp.x*4.1 - uTime*2.1 + wp.y*2.3) * .5;
        normal = normalize(normal + (viewMatrix * vec4(w1*.05 + w2*.03, 0., (w1+w2)*.04, 0.)).xyz);`);
    };
    waterMaterial.customProgramCacheKey = ()=>'aurora-water-v1';
    const water = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleGeometry"](15, 56), waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.set(POND.x, WATER_Y, POND.z);
    water.renderOrder = 2;
    scene.add(water);
    const padGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleGeometry"](.4, 12, .3, 5.7);
    padGeo.rotateX(-Math.PI / 2);
    const pads = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](padGeo, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#4f7f46',
        roughness: .7,
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
    }), 18);
    for(let i = 0; i < 18; i++){
        const a = seeded(i + 5100) * 6.28, d = Math.sqrt(seeded(i + 5200)) * POND.r * .85;
        temp.position.set(POND.x + Math.cos(a) * d, WATER_Y + .02, POND.z + Math.sin(a) * d);
        temp.rotation.set(0, seeded(i + 5300) * 6.28, 0);
        temp.scale.setScalar(.7 + seeded(i + 5400));
        temp.updateMatrix();
        pads.setMatrixAt(i, temp.matrix);
    }
    pads.receiveShadow = true;
    scene.add(pads);
    // árvores: folhosas (copas orgânicas) e pinheiros, balançando ao vento
    const trunkGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](.16, .3, 1, 8, 4);
    const tp = trunkGeo.attributes.position;
    for(let i = 0; i < tp.count; i++){
        const x = tp.getX(i), y = tp.getY(i), z = tp.getZ(i), f = (y < -.3 ? 1 + (-.3 - y) * 1.4 : 1) * (1 + (h3(x, y, z, 5) - .5) * .12);
        tp.setXYZ(i, x * f, y, z * f);
    }
    trunkGeo.computeVertexNormals();
    const leafGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](1, 10, 8);
    const lp = leafGeo.attributes.position;
    for(let i = 0; i < lp.count; i++){
        const x = lp.getX(i), y = lp.getY(i), z = lp.getZ(i);
        const k = 1 + (Math.sin(x * 3.1 + y * 2.3) * Math.sin(z * 3.7 + x * 1.9) * .5 + Math.sin(y * 5.3 + z * 4.1) * .25) * .22;
        lp.setXYZ(i, x * k, y * k, z * k);
    }
    leafGeo.computeVertexNormals();
    const pineGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](1, 1.5, 10, 2);
    const pp = pineGeo.attributes.position;
    for(let i = 0; i < pp.count; i++){
        const x = pp.getX(i), y = pp.getY(i), z = pp.getZ(i), k = 1 + Math.sin(Math.atan2(z, x) * 7 + y * 4) * .07;
        pp.setXYZ(i, x * k, y, z * k);
    }
    pineGeo.computeVertexNormals();
    const MAXT = 170;
    const trunks = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](trunkGeo, patch(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#ffffff',
        roughness: .95
    }), 'aurora-trunk-v2', {
        fade: true
    }), MAXT);
    const crowns = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](leafGeo, patch(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#ffffff',
        roughness: .92
    }), 'aurora-leaf-v2', {
        fade: true,
        sway: [
            .045,
            1
        ]
    }), MAXT * 6);
    const tiers = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](pineGeo, patch(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#ffffff',
        roughness: .94
    }), 'aurora-pine-v2', {
        fade: true,
        sway: [
            .03,
            .75
        ]
    }), MAXT * 4);
    const crownShapes = [
        [
            0,
            3.15,
            0,
            1.24
        ],
        [
            -.73,
            3.46,
            .13,
            .91
        ],
        [
            .73,
            3.53,
            -.13,
            .92
        ],
        [
            -.3,
            4.1,
            .1,
            .78
        ],
        [
            .42,
            4.18,
            -.12,
            .8
        ],
        [
            .05,
            4.72,
            0,
            .56
        ]
    ];
    const tierShapes = [
        [
            2.1,
            1.35,
            1.35
        ],
        [
            3.0,
            1.1,
            1.1
        ],
        [
            3.8,
            .85,
            .9
        ],
        [
            4.6,
            .6,
            .75
        ]
    ];
    let nt = 0, nc = 0, np = 0;
    for(let i = 0; i < 480 && nt < MAXT; i++){
        const a = seeded(i + 3) * Math.PI * 2, rad = 16 + seeded(i + 90) * 54;
        const x = Math.cos(a) * rad, z = Math.sin(a) * rad;
        if (Math.abs(x) < 12 && z > -22 && z < 12) continue;
        if (pondDist(x, z) < POND.r * 1.9 || inClearing(x, z, 2) || streamDist(x, z) < 4.5) continue;
        if (fbm(x * .045 + 9, z * .045 + 3) < .42 && seeded(i + 2000) > .18) continue;
        const y = terrainHeight(x, z), sc = .78 + seeded(i + 14) * .74, pine = y > 1.4 || seeded(i + 700) > .58;
        const birch = !pine && seeded(i + 1300) > .7, tw = sc * (pine ? .8 : birch ? .62 : 1);
        temp.position.set(x, y + 2.05 * sc, z);
        temp.scale.set(tw, 4.1 * sc, tw);
        temp.rotation.set(0, seeded(i + 500) * Math.PI, 0);
        temp.updateMatrix();
        trunks.setMatrixAt(nt, temp.matrix);
        trunks.setColorAt(nt, tmpColor.set(birch ? '#d8d2c2' : pine ? '#5a4232' : '#6e5038').offsetHSL(0, 0, (seeded(i + 60) - .5) * .07));
        if (pine) {
            tierShapes.forEach(([ty, r, hs], k)=>{
                temp.position.set(x, y + ty * sc, z);
                temp.scale.set(r * sc, hs * sc, r * sc);
                temp.rotation.set(0, seeded(i + k * 31) * 6.28, 0);
                temp.updateMatrix();
                tiers.setMatrixAt(np, temp.matrix);
                tiers.setColorAt(np++, tmpColor.set(PINES[(i + k) % PINES.length]).offsetHSL(0, 0, k * .014 + (seeded(i + 9) - .5) * .03));
            });
        } else {
            crownShapes.forEach(([ox, oy, oz, size], layer)=>{
                const s = size * sc;
                temp.position.set(x + ox * sc, y + oy * sc, z + oz * sc);
                temp.scale.set(s, s * 1.16, s * .94);
                temp.rotation.set(0, seeded(i + layer * 19) * 6.28, 0);
                temp.updateMatrix();
                crowns.setMatrixAt(nc, temp.matrix);
                crowns.setColorAt(nc++, tmpColor.set(birch ? BIRCH[(i + layer) % BIRCH.length] : FOLIAGE[(i + layer) % FOLIAGE.length]).offsetHSL((seeded(i + 4) - .5) * .02, 0, layer * .012 + (seeded(i + layer) - .5) * .04));
            });
        }
        colliders.push({
            x,
            z,
            radius: .64 * sc
        });
        nt++;
    }
    trunks.count = nt;
    crowns.count = nc;
    tiers.count = np;
    [
        trunks,
        crowns,
        tiers
    ].forEach((m, i)=>{
        m.castShadow = m.receiveShadow = true;
        m.name = [
            'forest-trunks',
            'canopy-broadleaf',
            'canopy-pine'
        ][i];
        m.instanceMatrix.needsUpdate = true;
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
        scene.add(m);
    });
    blockers.push(trunks);
    // pedras, margem do lago e arbustos
    const rockMat = patch(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        vertexColors: true,
        roughness: .97,
        flatShading: true
    }), 'aurora-rock-v2', {
        fade: true
    });
    const rocks = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](stoneify(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IcosahedronGeometry"](1, 1), .3, '#ffffff', .55), rockMat, 100);
    rocks.castShadow = rocks.receiveShadow = true;
    rocks.name = 'field-stones';
    let nr = 0;
    const placeRock = (x, z, size, seed)=>{
        temp.position.set(x, terrainHeight(x, z) + size * .38, z);
        temp.scale.set(size, size * .68, size * .82);
        temp.rotation.set(.1, seeded(seed) * 6, .13);
        temp.updateMatrix();
        rocks.setMatrixAt(nr, temp.matrix);
        rocks.setColorAt(nr++, tmpColor.set(ROCKS[seed % ROCKS.length]));
        colliders.push({
            x,
            z,
            radius: size * .85
        });
    };
    for(let i = 0; i < 70; i++){
        const x = (seeded(300 + i) - .5) * 100, z = (seeded(500 + i) - .5) * 92;
        if (Math.abs(x) < 6 && z > -18 && z < 7 || pondDist(x, z) < POND.r * 1.0 || inClearing(x, z, 1) || streamDist(x, z) < 3.5) continue;
        placeRock(x, z, .32 + seeded(700 + i) * .9, 900 + i);
    }
    for(let i = 0; i < 24; i++){
        const a = seeded(i + 5500) * 6.28, d = POND.r * (1.0 + seeded(i + 5600) * .35);
        placeRock(POND.x + Math.cos(a) * d, POND.z + Math.sin(a) * d, .25 + seeded(i + 5700) * .5, 6000 + i);
    }
    rocks.count = nr;
    rocks.instanceMatrix.needsUpdate = true;
    if (rocks.instanceColor) rocks.instanceColor.needsUpdate = true;
    scene.add(rocks);
    blockers.push(rocks);
    const bushGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](1, 9, 7);
    const bp = bushGeo.attributes.position;
    for(let i = 0; i < bp.count; i++){
        const x = bp.getX(i), y = bp.getY(i), z = bp.getZ(i), k = 1 + (h3(x, y, z, 7) - .5) * .35;
        bp.setXYZ(i, x * k, y * k, z * k);
    }
    bushGeo.computeVertexNormals();
    const bushes = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](bushGeo, patch(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#ffffff',
        roughness: .95
    }), 'aurora-bush-v1', {
        fade: true,
        sway: [
            .03,
            1
        ]
    }), 80);
    let nb = 0;
    for(let i = 0; i < 80; i++){
        const x = (seeded(7000 + i) - .5) * 110, z = (seeded(7100 + i) - .5) * 100;
        if (Math.abs(x) < 8 && z > -22 && z < 12 || pondDist(x, z) < POND.r * 1.2 || terrainHeight(x, z) > 3 || inClearing(x, z, .5) || streamDist(x, z) < 3.5) continue;
        const s = .45 + seeded(7200 + i) * .65;
        temp.position.set(x, terrainHeight(x, z) + s * .35, z);
        temp.scale.set(s * 1.2, s * .8, s);
        temp.rotation.set(0, seeded(7300 + i) * 6.28, 0);
        temp.updateMatrix();
        bushes.setMatrixAt(nb, temp.matrix);
        bushes.setColorAt(nb++, tmpColor.set(FOLIAGE[i % 5]).offsetHSL(0, .02, -.05 + seeded(i + 7400) * .06));
    }
    bushes.count = nb;
    bushes.castShadow = bushes.receiveShadow = true;
    bushes.instanceMatrix.needsUpdate = true;
    if (bushes.instanceColor) bushes.instanceColor.needsUpdate = true;
    scene.add(bushes);
    // grama (vento) e juncos do lago
    const grassMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshLambertMaterial"]({
        vertexColors: true
    });
    grassMaterial.onBeforeCompile = (shader)=>{
        shader.uniforms.uTime = TIME;
        shader.vertexShader = `uniform float uTime;\n${shader.vertexShader}`.replace('#include <begin_vertex>', `#include <begin_vertex>
      float gp = instanceMatrix[3].x * .17 + instanceMatrix[3].z * .11;
      float gw = sin(uTime * 1.7 + gp + position.y * 2.0) * .11 + sin(uTime * 3.1 + gp * 2.3) * .035;
      transformed.x += gw * position.y;
      transformed.z += cos(uTime * 1.3 + gp) * .06 * position.y;`);
    };
    grassMaterial.customProgramCacheKey = ()=>'aurora-grass-v3';
    const grassGeo = makeGrassGeometry(7);
    const grass = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](grassGeo, grassMaterial, 6000);
    grass.name = 'wind-grass';
    grass.receiveShadow = true;
    let ng = 0;
    for(let i = 0; i < 6000; i++){
        const a = seeded(1200 + i) * 6.283, d = Math.sqrt(seeded(1600 + i)) * 44, x = Math.cos(a) * d, z = Math.sin(a) * d - 4;
        if (nearPath(x, z, .5) || Math.hypot(x, z + 12) < 3.6 || pondDist(x, z) < POND.r * 1.15 || streamDist(x, z) < 2.6 || inClearing(x, z, -2.5)) continue;
        const s = .62 + seeded(1900 + i) * .8;
        temp.position.set(x, terrainHeight(x, z), z);
        temp.scale.set(s, s * (.8 + seeded(i + 2) * .6), s);
        temp.rotation.set(0, seeded(2200 + i) * Math.PI, 0);
        temp.updateMatrix();
        grass.setMatrixAt(ng, temp.matrix);
        grass.setColorAt(ng++, tmpColor.set(GRASS[i % GRASS.length]).offsetHSL(0, 0, (seeded(i + 33) - .5) * .06));
    }
    grass.count = ng;
    grass.instanceMatrix.needsUpdate = true;
    if (grass.instanceColor) grass.instanceColor.needsUpdate = true;
    keepMax(grass);
    scene.add(grass);
    const reeds = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](grassGeo, grassMaterial, 260);
    let nrd = 0;
    for(let i = 0; i < 260; i++){
        const a = seeded(i + 8000) * 6.283, d = POND.r * (.9 + seeded(i + 8100) * .5), x = POND.x + Math.cos(a) * d, z = POND.z + Math.sin(a) * d, y = terrainHeight(x, z);
        if (y < -.7 || y > .5) continue;
        temp.position.set(x, y, z);
        temp.scale.set(1.3, 2.4 + seeded(i + 8200) * 1.1, 1.3);
        temp.rotation.set(0, seeded(i + 8300) * 6.28, 0);
        temp.updateMatrix();
        reeds.setMatrixAt(nrd, temp.matrix);
        reeds.setColorAt(nrd++, tmpColor.set('#8a9a5a').offsetHSL(0, 0, (seeded(i) - .5) * .1));
    }
    reeds.count = nrd;
    reeds.instanceMatrix.needsUpdate = true;
    if (reeds.instanceColor) reeds.instanceColor.needsUpdate = true;
    keepMax(reeds);
    scene.add(reeds);
    // flores (haste + botão)
    const stems = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](.008, .014, .32, 4), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshLambertMaterial"]({
        color: '#5d8a3c'
    }), 260);
    const heads = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IcosahedronGeometry"](.06, 1), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshLambertMaterial"]({
        color: '#ffffff'
    }), 260);
    let nf = 0;
    for(let j = 0; j < 260; j++){
        const x = (seeded(2500 + j) - .5) * 40, z = (seeded(2700 + j) - .5) * 40;
        if (nearPath(x, z, .6) || Math.hypot(x, z + 12) < 3.6 || pondDist(x, z) < POND.r * 1.15) continue;
        const s = .7 + seeded(2900 + j) * .8, y = terrainHeight(x, z);
        temp.rotation.set((seeded(j + 1) - .5) * .25, 0, (seeded(j + 2) - .5) * .25);
        temp.position.set(x, y + .16 * s, z);
        temp.scale.setScalar(s);
        temp.updateMatrix();
        stems.setMatrixAt(nf, temp.matrix);
        temp.position.set(x, y + .33 * s, z);
        temp.scale.set(s, s * .65, s);
        temp.updateMatrix();
        heads.setMatrixAt(nf, temp.matrix);
        heads.setColorAt(nf++, tmpColor.set(BLOOMS[j % BLOOMS.length]));
    }
    [
        stems,
        heads
    ].forEach((m)=>{
        m.count = nf;
        m.instanceMatrix.needsUpdate = true;
        keepMax(m);
        scene.add(m);
    });
    if (heads.instanceColor) heads.instanceColor.needsUpdate = true;
    // trilha com bordas suaves e seixos
    const pathPoints = [], widths = [];
    for(let i = 0; i <= 64; i++){
        const t = i / 64, z = 10 - t * 31;
        pathPoints.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](pathX(z), 0, z));
        widths.push(3.2 + Math.sin(t * Math.PI) * .45);
    }
    const pathMat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        vertexColors: true,
        roughness: 1,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2
    });
    const path = makeRibbon(pathPoints, widths, pathMat, '#9c8a66', '#7f8a5c');
    path.name = 'waystone-trail';
    path.receiveShadow = true;
    scene.add(path);
    const pebbles = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](stoneify(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IcosahedronGeometry"](.12, 0), .05, '#ffffff'), rockMat.clone(), 110);
    pebbles.material.alphaHash = false;
    pebbles.castShadow = pebbles.receiveShadow = true;
    for(let i = 0; i < 110; i++){
        const t = seeded(i + 9000), z = 10 - t * 31, x = pathX(z) + (seeded(i + 9100) > .5 ? 1 : -1) * (1.55 + seeded(i + 9200) * .5), s = .6 + seeded(i + 9300) * 1.2;
        temp.position.set(x, terrainHeight(x, z) + .04, z);
        temp.scale.set(s, s * .6, s);
        temp.rotation.set(0, seeded(i + 9400) * 6, 0);
        temp.updateMatrix();
        pebbles.setMatrixAt(i, temp.matrix);
        pebbles.setColorAt(i, tmpColor.set(ROCKS[i % 5]));
    }
    scene.add(pebbles);
    // ruína: pilares em tambores de pedra, lintel caído e blocos soltos
    const ruin = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    ruin.name = 'fallen-arch';
    ruin.position.set(-12, terrainHeight(-12, -21), -21);
    const block = (w, h, d, x, y, z, rx, ry, rz, moss = .3)=>{
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](stoneify(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](w, h, d, Math.max(2, Math.round(w * 2)), Math.max(2, Math.round(h * 2)), 2), .1, '#8a8c7e', moss), stoneMat);
        m.position.set(x, y, z);
        m.rotation.set(rx, ry, rz);
        m.castShadow = m.receiveShadow = true;
        ruin.add(m);
    };
    for(let k = 0; k < 4; k++)block(.7, .85, .7, -1.6 + (seeded(k) - .5) * .06, .43 + k * .85, 0, 0, k * .4, -.02 * k, .2 + k * .1);
    for(let k = 0; k < 2; k++)block(.7, .85, .7, 1.6, .43 + k * .85, 0, 0, k * .7, .03 * k, .3);
    block(.75, .5, .75, 1.65, 1.95, .1, .15, .5, .35, .5);
    block(4.2, .55, .85, .2, 2.65, 0, 0, 0, -.5, .5);
    block(1.7, .4, .65, 2.8, .2, 1.4, 0, .3, .1);
    block(.7, .7, .7, -2.6, .35, 1.2, 0, .6, 0);
    block(1.3, .25, 1.1, 0, .12, 1.8, 0, .2, 0, .5);
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
    // vagalumes / poeira luminosa
    const motePositions = [];
    for(let i = 0; i < 140; i++){
        const x = (seeded(3200 + i) - .5) * 64, z = (seeded(3600 + i) - .5) * 64;
        motePositions.push(x, terrainHeight(x, z) + .6 + seeded(3400 + i) * 4.5, z);
    }
    const moteGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    moteGeometry.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](motePositions, 3));
    const moteMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointsMaterial"]({
        color: '#f3e4a8',
        size: .3,
        map: glowTexture(),
        transparent: true,
        opacity: .4,
        depthWrite: false,
        blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"],
        sizeAttenuation: true
    });
    moteMaterial.onBeforeCompile = (shader)=>{
        shader.uniforms.uTime = TIME;
        shader.vertexShader = `uniform float uTime;\n${shader.vertexShader}`.replace('#include <begin_vertex>', `#include <begin_vertex>
      transformed.x += sin(uTime * .4 + position.y * 3.0) * .6;
      transformed.y += sin(uTime * .65 + position.x * .29 + position.z * .2) * .25;
      transformed.z += cos(uTime * .33 + position.x * .7) * .6;`);
    };
    moteMaterial.customProgramCacheKey = ()=>'aurora-motes-v2';
    const motes = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Points"](moteGeometry, moteMaterial);
    motes.name = 'windborne-echoes';
    motes.frustumCulled = false;
    motes.userData.max = 140;
    scene.add(motes);
    // borboletas e pássaros (instanciados, asas batendo no shader)
    const NB = 26, bData = [];
    const butterflies = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](makeWings(.11, .12), flapMaterial(17, 1.1, 'aurora-flap-b'), NB);
    const bCol = [
        '#f39a4c',
        '#f6f0d8',
        '#79a8e8',
        '#f2d44d',
        '#d986c4'
    ];
    for(let i = 0; i < NB; i++){
        bData.push({
            cx: (seeded(4000 + i) - .5) * 40,
            cz: (seeded(4100 + i) - .5) * 36 - 4,
            sp: .7 + seeded(4200 + i) * .8,
            ph: seeded(4300 + i) * 6.28,
            sc: .8 + seeded(4400 + i) * .6,
            rad: 2 + seeded(4500 + i) * 3,
            alt: .6 + seeded(4600 + i) * 1.2
        });
        butterflies.setColorAt(i, tmpColor.set(bCol[i % 5]));
    }
    keepMax(butterflies);
    scene.add(butterflies);
    const NBD = 9, dData = [];
    const birds = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedMesh"](makeWings(.9, .28), flapMaterial(6.5, .5, 'aurora-flap-d'), NBD);
    for(let i = 0; i < NBD; i++){
        dData.push({
            cx: (seeded(4700 + i) - .5) * 30,
            cz: -20 + (seeded(4800 + i) - .5) * 30,
            sp: (.06 + seeded(4900 + i) * .05) * (i % 2 ? 1 : -1),
            ph: seeded(5000 + i) * 6.28,
            sc: .9 + seeded(5050 + i) * .5,
            rad: 38 + seeded(5100 + i) * 30,
            alt: 28 + seeded(5150 + i) * 12
        });
        birds.setColorAt(i, tmpColor.set('#2b3036'));
    }
    keepMax(birds);
    scene.add(birds);
    const L = makeLandmark(scene, stoneMat, colliders, blockers);
    blockers.push(L.group);
    colliders.push({
        x: 0,
        z: -12,
        radius: 3
    });
    const props = createProps(scene, stoneMat, colliders, blockers);
    props.scalable.forEach(keepMax);
    const env = {
        grass,
        grassMaterial,
        bloomMeshes: [
            heads,
            stems
        ],
        moteMaterial,
        motes,
        skyMaterial,
        sunDisc,
        moon,
        scalable,
        butterflies,
        birds,
        butterflyData: bData,
        birdData: dData,
        crystal: L.crystal,
        crystalBase: 6.5,
        orbit: L.orbit,
        crystalMaterial: L.crystalMaterial,
        glyphMaterial: L.glyphMaterial,
        ringMaterial: L.ringMaterial,
        stoneLight: L.stoneLight,
        glow: 1,
        props
    };
    scene.userData.environment = env;
    moveFliers(env, 0);
    return {
        ground,
        blockers,
        colliders,
        rune: L.rune
    };
}
function moveFliers(env, t) {
    const b = env.butterflies;
    for(let i = 0; i < b.count; i++){
        const f = env.butterflyData[i], u = t * .35 * f.sp + f.ph, v = t * .27 * f.sp + f.ph * 1.3;
        const x = f.cx + Math.sin(u) * f.rad, z = f.cz + Math.cos(v) * f.rad;
        temp.position.set(x, terrainHeight(x, z) + f.alt + Math.sin(t * 1.7 + f.ph) * .35, z);
        temp.rotation.set(0, Math.atan2(Math.cos(u) * .35 * f.sp, -Math.sin(v) * .27 * f.sp), 0);
        temp.scale.setScalar(f.sc);
        temp.updateMatrix();
        b.setMatrixAt(i, temp.matrix);
    }
    b.instanceMatrix.needsUpdate = true;
    const d = env.birds;
    for(let i = 0; i < d.count; i++){
        const f = env.birdData[i], a = f.ph + t * f.sp;
        temp.position.set(f.cx + Math.cos(a) * f.rad, f.alt + Math.sin(t * .5 + f.ph) * 1.5, f.cz + Math.sin(a) * f.rad);
        temp.rotation.set(0, f.sp > 0 ? -a : Math.PI - a, f.sp > 0 ? .3 : -.3);
        temp.scale.setScalar(f.sc);
        temp.updateMatrix();
        d.setMatrixAt(i, temp.matrix);
    }
    d.instanceMatrix.needsUpdate = true;
}
function setWorldQuality(scene, quality) {
    const env = scene.userData.environment;
    if (!env) return;
    const f = quality === 'Baixa' ? .35 : quality === 'Média' ? .68 : 1;
    for (const m of env.scalable)m.count = Math.max(1, Math.floor(m.userData.maxInstances * f));
    env.motes.geometry.setDrawRange(0, Math.floor(env.motes.userData.max * f));
    env.props.quality = f;
}
function updateWorld(parts, time) {
    TIME.value = time;
    const env = parts.ground.parent?.userData.environment;
    parts.rune.rotation.z = Math.sin(time * .7) * .06;
    parts.rune.children.forEach((c, i)=>c.scale.setScalar(.85 + Math.sin(time * 2.2 + i * 1.3) * .3));
    if (!env) return;
    env.crystal.position.y = env.crystalBase + Math.sin(time * 1.1) * .2;
    env.crystal.rotation.y = time * .7;
    env.orbit.position.y = env.crystal.position.y;
    env.orbit.rotation.y = -time * .9;
    const pulse = .8 + Math.sin(time * 1.6) * .25;
    env.crystalMaterial.emissiveIntensity = .5 + env.glow * .6 * pulse;
    env.glyphMaterial.emissiveIntensity = env.glow * pulse;
    env.ringMaterial.opacity = (.06 + .1 * env.glow) * (.8 + Math.sin(time * 1.2) * .2);
    moveFliers(env, time);
    updateProps(env.props, time, Math.min(1, Math.max(0, (env.glow - .45) / 1.7)));
}
/* ───────────── ciclo dia/noite ───────────── */ const cycleSky = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]();
const cycleDawn = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#e6ac91');
const cycleDay = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#9fb9c4');
const cycleNight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#263346');
const cycleSunset = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#f6b690');
const cycleSkyColor = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#a9c4d4');
const cycleGroundDay = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#687451');
const cycleFogDay = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#a1ad99');
function updateDayCycle(scene, sun, sky, time) {
    const phase = time / 240 * Math.PI * 2;
    const sunArc = Math.sin(phase);
    const daylight = smoothstep(sunArc, -.08, .42);
    const dusk = Math.max(0, 1 - Math.abs(sunArc) * 3.2);
    sun.position.set(Math.cos(phase) * 46, 14 + sunArc * 43, Math.sin(phase * .5) * 19);
    sun.intensity = .16 + daylight * 2.72;
    sun.color.set('#fff0d9').lerp(cycleSunset, dusk * .55);
    sky.intensity = .52 + daylight * 1.45;
    sky.color.copy(cycleSkyColor).lerp(cycleDawn, dusk * .42);
    sky.groundColor.set('#26303d').lerp(cycleGroundDay, daylight * .62);
    cycleSky.copy(cycleNight).lerp(cycleDawn, Math.max(dusk, .06)).lerp(cycleDay, daylight);
    if (scene.background instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]) scene.background.copy(cycleSky);
    if (scene.fog instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FogExp2"]) {
        if (scene.userData.fogBase === undefined) scene.userData.fogBase = scene.fog.density;
        scene.fog.color.copy(cycleSky).lerp(cycleFogDay, daylight * .24);
        scene.fog.density = scene.userData.fogBase * (1 + dusk * .5); // névoa mais densa no amanhecer/entardecer
    }
    const env = scene.userData.environment;
    if (env) {
        tmpV.copy(sun.position).normalize();
        env.skyMaterial.uniforms.uDaylight.value = daylight;
        env.skyMaterial.uniforms.uDusk.value = dusk;
        env.skyMaterial.uniforms.uSunDir.value.copy(tmpV);
        env.sunDisc.position.copy(tmpV).multiplyScalar(168);
        env.sunDisc.visible = sunArc > -.1;
        env.moon.position.copy(tmpV).multiplyScalar(-168);
        env.moon.visible = sunArc < .1;
        env.glow = .45 + (1 - daylight) * 1.7;
        env.stoneLight.intensity = .4 + (1 - daylight) * 1.8;
        env.moteMaterial.opacity = .25 + (1 - daylight) * .7;
        env.butterflies.visible = daylight > .2;
        env.birds.visible = daylight > .15;
    }
    const hour = Math.floor((time / 240 * 24 + 6) % 24);
    return {
        label: `${String(hour).padStart(2, '0')}:00`,
        daylight
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=src_components_game_14zeks1f7rqw0._.js.map