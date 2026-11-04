(()=>{"use strict";module.exports = [
"[project]/src/components/game/Game.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Game
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$EffectComposer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/postprocessing/EffectComposer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$RenderPass$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/postprocessing/RenderPass.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$UnrealBloomPass$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$OutputPass$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/postprocessing/OutputPass.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/audio.ts [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './combat'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$hero$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/hero.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$magic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/magic.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$simulation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/simulation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world.ts [app-ssr] (ecmascript)");
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
;
function Game() {
    const hostRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rendererRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cameraRigRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const qualityTargetsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const progressionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const uiOpenRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const modalFlagsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        help: false,
        quest: false,
        inventory: false,
        skills: false
    });
    const castSpellRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(()=>{});
    const castAbilityRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(()=>{});
    const interactRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(()=>{});
    const attackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(()=>{});
    const dodgeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(()=>{});
    const compassNeedleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const compassPinRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const touchKnobRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const touchPointerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const touchMoveRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        forward: 0,
        side: 0
    });
    const touchSprintRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const touchJumpRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        area: 'Campos da Aurora',
        discovered: 0
    });
    const [hint, setHint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [nearLandmark, setNearLandmark] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [muted, setMuted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [dayLabel, setDayLabel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('06:00');
    const [help, setHelp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [questOpen, setQuestOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [inventoryOpen, setInventoryOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [skillsOpen, setSkillsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [paused, setPaused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [quality, setQuality] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('Média');
    const [sensitivity, setSensitivity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(5);
    const [gameError, setGameError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [combatHud, setCombatHud] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        mana: 100,
        health: 100,
        alive: 3,
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
    const [progressionHud, setProgressionHud] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
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
            sentinelCore: 0
        }
    });
    uiOpenRef.current = help || questOpen || inventoryOpen || skillsOpen || paused;
    modalFlagsRef.current = {
        help,
        quest: questOpen,
        inventory: inventoryOpen,
        skills: skillsOpen
    };
    const releaseMouse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (typeof document !== 'undefined' && document.pointerLockElement) document.exitPointerLock();
    }, []);
    const toggleHelp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        releaseMouse();
        setHelp((value)=>!value);
        setQuestOpen(false);
        setInventoryOpen(false);
        setSkillsOpen(false);
    }, [
        releaseMouse
    ]);
    const toggleQuest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        releaseMouse();
        setQuestOpen((value)=>!value);
        setHelp(false);
        setInventoryOpen(false);
        setSkillsOpen(false);
    }, [
        releaseMouse
    ]);
    const toggleInventory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        releaseMouse();
        setInventoryOpen((value)=>!value);
        setSkillsOpen(false);
        setHelp(false);
        setQuestOpen(false);
    }, [
        releaseMouse
    ]);
    const toggleSkills = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        releaseMouse();
        setSkillsOpen((value)=>!value);
        setInventoryOpen(false);
        setHelp(false);
        setQuestOpen(false);
    }, [
        releaseMouse
    ]);
    const toggleMute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setMuted((value)=>{
            audioRef.current?.setMuted(!value);
            return !value;
        });
    }, []);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const host = hostRef.current;
        if (!host) return;
        let renderer;
        try {
            renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
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
        renderer.shadowMap.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PCFSoftShadowMap"];
        renderer.outputColorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
        renderer.toneMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ACESFilmicToneMapping"];
        renderer.toneMappingExposure = 1.05;
        renderer.domElement.setAttribute('aria-label', 'Explorar os Campos da Aurora. WASD move, clique e arraste para olhar.');
        renderer.domElement.tabIndex = 0;
        host.appendChild(renderer.domElement);
        const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Scene"]();
        scene.background = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#a8b7a7');
        scene.fog = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FogExp2"]('#a9b6a4', .0062);
        const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PerspectiveCamera"](49, 1, .1, 320);
        const sky = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HemisphereLight"]('#f0f0dc', '#52614d', 2.05);
        scene.add(sky);
        const sun = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectionalLight"]('#ffebca', 3.05);
        sun.position.set(-34, 48, 22);
        sun.castShadow = true;
        sun.shadow.mapSize.set(quality === 'Alta' ? 2048 : 1024, quality === 'Alta' ? 2048 : 1024);
        sun.shadow.camera.left = -48;
        sun.shadow.camera.right = 48;
        sun.shadow.camera.top = 48;
        sun.shadow.camera.bottom = -48;
        sun.shadow.bias = -.00035;
        scene.add(sun);
        const fill = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectionalLight"]('#c5d7da', .72);
        fill.position.set(25, 22, -32);
        scene.add(fill);
        const composer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$EffectComposer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EffectComposer"](renderer);
        composer.addPass(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$RenderPass$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RenderPass"](scene, camera));
        const bloom = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$UnrealBloomPass$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UnrealBloomPass"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector2"](1, 1), quality === 'Alta' ? .48 : .3, .26, .84);
        composer.addPass(bloom);
        composer.addPass(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$postprocessing$2f$OutputPass$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OutputPass"]());
        const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createWorld"])(scene);
        qualityTargetsRef.current = {
            scene,
            sun,
            composer,
            bloom
        };
        const hero = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$hero$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHero"])(scene);
        hero.root.rotation.y = Math.PI;
        hero.root.userData.facing = Math.PI;
        const motor = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$simulation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlayerMotor"](hero.root, world.colliders);
        const cameraRig = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$simulation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThirdPersonCamera"](camera, world);
        cameraRigRef.current = cameraRig;
        camera.position.set(0, 3.95, 9.5);
        camera.lookAt(0, 1.5, 2);
        const progression = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlayerProgression"]();
        progressionRef.current = progression;
        const combat = new CombatSystem(scene, ()=>progression.recordSentinelDefeat());
        const magic = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$magic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MagicSystem"](scene, hero.root, combat, world.blockers, progression);
        const ambient = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AmbientAudio"]();
        audioRef.current = ambient;
        const keys = new Set();
        const spellOrigin = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        const spellAim = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        const spellDirection = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        let elapsed = 0, isNearMarker = false, markerRemembered = false, castUntil = 0, attackUntil = 0, dodgeUntil = 0, hitUntil = 0, landUntil = 0, lastHealth = combat.health, hudTick = 0, cycleTick = 0;
        let dragging = false, previousX = 0, previousY = 0;
        let hintTimer;
        const showHint = (message)=>{
            setHint(message);
            if (hintTimer) clearTimeout(hintTimer);
            hintTimer = setTimeout(()=>setHint(''), 3100);
        };
        const castAbility = (spell)=>{
            if (uiOpenRef.current || combat.health <= 0) return;
            ambient.start();
            hero.spellPoint.getWorldPosition(spellOrigin);
            cameraRig.getAimPoint(spellAim, combat.targets);
            spellDirection.copy(spellAim).sub(spellOrigin).normalize();
            if (magic.cast(spell, spellOrigin, spellDirection, spellAim)) {
                castUntil = elapsed + .48;
                ambient.playCast();
            }
        };
        const castSpell = ()=>castAbility('zoltraak');
        const performAttack = ()=>{
            if (uiOpenRef.current || combat.health <= 0) return;
            const facing = hero.root.userData.facing ?? hero.root.rotation.y;
            const target = hero.root.position.clone().add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](Math.sin(facing), 0, Math.cos(facing)).multiplyScalar(2.15));
            target.y += 1.2;
            combat.damageAt(target, 1.25, 30);
            attackUntil = elapsed + .38;
            ambient.start();
            ambient.playCast();
        };
        attackRef.current = performAttack;
        dodgeRef.current = ()=>{
            if (!uiOpenRef.current && combat.health > 0) {
                const side = Number(keys.has('d')) - Number(keys.has('a'));
                motor.dodge(cameraRig.yaw, side);
                dodgeUntil = elapsed + .42;
            }
        };
        castSpellRef.current = castSpell;
        castAbilityRef.current = castAbility;
        const interactMarker = ()=>{
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
        };
        interactRef.current = interactMarker;
        const onKeyDown = (event)=>{
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
                } else setPaused((value)=>!value);
                return;
            }
            if (key === 'h') {
                releaseMouse();
                setHelp((value)=>!value);
                return;
            }
            if (key === 'j') {
                releaseMouse();
                setQuestOpen((value)=>!value);
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
                'shift',
                'control',
                'v'
            ].includes(key)) {
                ambient.start();
                keys.add(key);
            }
        };
        const onKeyUp = (event)=>keys.delete(event.key.toLowerCase());
        const onBlur = ()=>{
            keys.clear();
            setPaused(true);
        };
        const onVisibility = ()=>{
            if (document.visibilityState === 'hidden') {
                keys.clear();
                setPaused(true);
            }
        };
        const onPointerLock = ()=>{
            dragging = document.pointerLockElement === renderer.domElement;
        };
        const onPointerDown = (event)=>{
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
                if (lockRequest && typeof lockRequest.catch === 'function') lockRequest.catch(()=>{
                    dragging = true;
                });
                dragging = true;
            } else dragging = true;
            previousX = event.clientX;
            previousY = event.clientY;
        };
        const onPointerMove = (event)=>{
            if (!dragging || uiOpenRef.current) return;
            const locked = document.pointerLockElement === renderer.domElement;
            cameraRig.rotate(locked ? event.movementX : event.clientX - previousX, locked ? event.movementY : event.clientY - previousY);
            previousX = event.clientX;
            previousY = event.clientY;
        };
        const onPointerUp = ()=>{
            if (document.pointerLockElement !== renderer.domElement) dragging = false;
        };
        const onWheel = (event)=>cameraRig.zoom(event.deltaY);
        const onContext = (event)=>event.preventDefault();
        const resize = ()=>{
            const width = host.clientWidth, height = host.clientHeight;
            if (!width || !height) return;
            renderer.setSize(width, height, false);
            composer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
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
        const animate = ()=>{
            frame = requestAnimationFrame(animate);
            const delta = Math.min(.05, clock.getDelta());
            if (!uiOpenRef.current) {
                elapsed += delta;
                const wasGrounded = motor.grounded;
                const forward = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0) + touchMoveRef.current.forward;
                const side = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0) + touchMoveRef.current.side;
                const moving = combat.health > 0 && motor.update(delta, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(forward, -1, 1), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(side, -1, 1), keys.has('shift') || touchSprintRef.current, keys.has(' ') || touchJumpRef.current, cameraRig.yaw, magic.flying, Number(keys.has(' ') || touchJumpRef.current) - Number(keys.has('control')), cameraRig.pitch);
                if (!wasGrounded && motor.grounded) landUntil = elapsed + .34;
                touchJumpRef.current = false;
                if (combat.health < lastHealth) hitUntil = elapsed + .28;
                lastHealth = combat.health;
                const pose = combat.health <= 0 ? 'defeat' : elapsed < hitUntil ? 'hit' : elapsed < castUntil ? 'cast' : elapsed < attackUntil ? 'attack' : elapsed < dodgeUntil ? 'dodge' : elapsed < landUntil ? 'land' : keys.has('v') ? 'guard' : magic.flying ? 'fly' : !motor.grounded ? motor.verticalSpeed < -1 ? 'fall' : 'jump' : moving ? keys.has('shift') ? 'run' : 'walk' : 'idle';
                hero.update(elapsed, delta, pose, Math.hypot(motor.velocity.x, motor.velocity.z));
                magic.update(delta, elapsed);
                combat.update(delta, elapsed, hero.root.position, (from, to)=>magic.blockProjectile(from, to));
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateWorld"])(world, elapsed);
                cycleTick += delta;
                if (cycleTick >= 1) {
                    cycleTick = 0;
                    const cycle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDayCycle"])(scene, sun, sky, elapsed);
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
            if (compassNeedleRef.current) compassNeedleRef.current.style.transform = `rotate(${-cameraRig.yaw}rad)`;
            if (compassPinRef.current) {
                const markerAngle = Math.atan2(-hero.root.position.x, -(hero.root.position.z + 12)) - cameraRig.yaw;
                compassPinRef.current.style.left = `${42 + Math.sin(markerAngle) * 14}px`;
                compassPinRef.current.style.top = `${42 - Math.cos(markerAngle) * 14}px`;
            }
            composer.render();
        };
        const clock = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Clock"]();
        animate();
        return ()=>{
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
            castSpellRef.current = ()=>{};
            castAbilityRef.current = ()=>{};
            interactRef.current = ()=>{};
            attackRef.current = ()=>{};
            dodgeRef.current = ()=>{};
            const geometries = new Set(), materials = new Set(), textures = new Set(scene.userData.gameTextures ?? []);
            scene.traverse((object)=>{
                if (object instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"] || object instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"] || object instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Points"]) {
                    geometries.add(object.geometry);
                    const list = Array.isArray(object.material) ? object.material : [
                        object.material
                    ];
                    list.forEach((material)=>materials.add(material));
                }
            });
            geometries.forEach((geometry)=>geometry.dispose());
            materials.forEach((material)=>material.dispose());
            textures.forEach((texture)=>texture.dispose());
            renderer.dispose();
            if (host.contains(renderer.domElement)) host.removeChild(renderer.domElement);
        };
    }, [
        releaseMouse
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setWorldQuality"])(targets.scene, quality);
        }
    }, [
        quality
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (cameraRigRef.current) cameraRigRef.current.sensitivity = .0008 + sensitivity * .0005;
    }, [
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
    const spellButton = (spell, key, label)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            className: `hotkey ${combatHud.cooldowns[spell] > 0 ? 'on-cooldown' : ''}`,
            title: `${label} · ${combatHud.cooldowns[spell] > 0 ? `recarga ${combatHud.cooldowns[spell].toFixed(1)} s` : 'pronto'}`,
            onClick: ()=>castAbilityRef.current(spell),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "slot",
                    children: key
                }, void 0, false, {
                    fileName: "[project]/src/components/game/Game.tsx",
                    lineNumber: 353,
                    columnNumber: 322
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "slot-label",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/src/components/game/Game.tsx",
                    lineNumber: 353,
                    columnNumber: 357
                }, this),
                combatHud.cooldowns[spell] > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                    className: "cooldown-label",
                    children: [
                        combatHud.cooldowns[spell].toFixed(1),
                        "s"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/Game.tsx",
                    lineNumber: 353,
                    columnNumber: 435
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/Game.tsx",
            lineNumber: 353,
            columnNumber: 71
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "game-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scene",
                ref: hostRef,
                "aria-label": "Mundo 3D explorável dos Campos da Aurora"
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 356,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "vignette"
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 357,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "aim-reticle",
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "aim-core"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 358,
                        columnNumber: 53
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "aim-tick aim-top"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 358,
                        columnNumber: 82
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "aim-tick aim-right"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 358,
                        columnNumber: 116
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "aim-tick aim-bottom"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 358,
                        columnNumber: 152
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "aim-tick aim-left"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 358,
                        columnNumber: 189
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 358,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "topbar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "brand",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "brand-mark",
                                children: "✦"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 360,
                                columnNumber: 30
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "eyebrow",
                                        children: "UM MUNDO DEPOIS DO FIM"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 360,
                                        columnNumber: 70
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "brand-name",
                                        children: [
                                            "ECOS ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "DA ERA DOS HERÓIS"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 360,
                                                columnNumber: 156
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 360,
                                        columnNumber: 123
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 360,
                                columnNumber: 65
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 360,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "region",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "region-dot"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 361,
                                columnNumber: 31
                            }, this),
                            status.area,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "region-sub",
                                children: "Oeste · Terras de Avel"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 361,
                                columnNumber: 75
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 361,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "top-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "icon-button",
                                onClick: toggleMute,
                                "aria-label": muted ? 'Ativar som' : 'Silenciar',
                                title: muted ? 'Ativar som' : 'Silenciar',
                                children: muted ? '◖' : '♫'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 362,
                                columnNumber: 36
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "icon-button",
                                onClick: toggleInventory,
                                "aria-label": "Inventário",
                                title: "Inventário (E)",
                                children: "E"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 362,
                                columnNumber: 208
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "icon-button",
                                onClick: toggleSkills,
                                "aria-label": "Árvore de habilidades",
                                title: "Habilidades (,)",
                                children: ","
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 362,
                                columnNumber: 323
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "icon-button",
                                onClick: toggleHelp,
                                "aria-label": "Ajuda",
                                title: "Controles",
                                children: "?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 362,
                                columnNumber: 447
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 362,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 359,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "quest-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "quest-kicker",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "tiny-star",
                                children: "✦"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 364,
                                columnNumber: 67
                            }, this),
                            " MEMÓRIA ESQUECIDA"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 364,
                        columnNumber: 37
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "O Que Permanece"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 364,
                        columnNumber: 127
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Encontre o Marco do Herói e desperte o Eco que repousa nas pedras."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 364,
                        columnNumber: 151
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "quest-progress",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                width: `${status.discovered * 100}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 364,
                            columnNumber: 256
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 364,
                        columnNumber: 224
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "quest-count",
                        children: [
                            status.discovered ? '1' : '0',
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "/ 1 memória encontrada"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 364,
                                columnNumber: 380
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 364,
                        columnNumber: 319
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 364,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "compass",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "compass-ring",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "compass-n",
                                children: "N"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 365,
                                columnNumber: 60
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                ref: compassNeedleRef,
                                className: "compass-needle",
                                children: "◆"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 365,
                                columnNumber: 96
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                ref: compassPinRef,
                                className: "compass-pin",
                                children: "✦"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 365,
                                columnNumber: 160
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "compass-s",
                                children: "S"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 365,
                                columnNumber: 218
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 365,
                        columnNumber: 30
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "compass-label",
                        children: "CAMPOS DA AURORA"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 365,
                        columnNumber: 260
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 365,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "touch-controls",
                "aria-label": "Controles de toque",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "touch-stick",
                        role: "application",
                        "aria-label": "Direcional de movimento",
                        onPointerDown: onTouchStickDown,
                        onPointerMove: onTouchStickMove,
                        onPointerUp: onTouchStickUp,
                        onPointerCancel: onTouchStickUp,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "touch-stick-n",
                                children: "N"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 367,
                                columnNumber: 220
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                ref: touchKnobRef,
                                className: "touch-knob"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 367,
                                columnNumber: 260
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 367,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "touch-actions",
                        children: [
                            nearLandmark && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action touch-interact",
                                onClick: ()=>interactRef.current(),
                                children: "Eco · G"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 369,
                                columnNumber: 26
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: toggleInventory,
                                children: "Inventário"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 370,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: toggleSkills,
                                children: "Habilidades"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 371,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>attackRef.current(),
                                children: "Atacar"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 372,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>dodgeRef.current(),
                                children: "Esquiva"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 373,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>castSpellRef.current(),
                                children: "Zoltraak"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 374,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>castAbilityRef.current('vollzanbel'),
                                children: "Fogo"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 375,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>castAbilityRef.current('judradjim'),
                                children: "Raio"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 376,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>castAbilityRef.current('shield'),
                                children: "Escudo"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 377,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>castAbilityRef.current('flight'),
                                children: "Voo"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 378,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                lineNumber: 379,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                lineNumber: 380,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "touch-action",
                                onClick: ()=>setPaused(true),
                                children: "Menu"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 381,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 368,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 366,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bottom-left",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "player-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "portrait",
                                children: "✧"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 384,
                                columnNumber: 63
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "player-meta",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Chamado"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 384,
                                        columnNumber: 125
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Errante das Terras de Avel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 384,
                                        columnNumber: 149
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "resource-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "VIDA"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 384,
                                                columnNumber: 218
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "resource-track",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "health-fill",
                                                    style: {
                                                        width: `${combatHud.health}%`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 267
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 384,
                                                columnNumber: 235
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: combatHud.health
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 384,
                                                columnNumber: 344
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 384,
                                        columnNumber: 188
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "resource-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "MANA"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 384,
                                                columnNumber: 405
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "resource-track",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "mana-fill",
                                                    style: {
                                                        width: `${combatHud.mana}%`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 454
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 384,
                                                columnNumber: 422
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: combatHud.mana
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 384,
                                                columnNumber: 527
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 384,
                                        columnNumber: 375
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "xp-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "NV ",
                                                    progressionHud.level
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 384,
                                                columnNumber: 580
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "resource-track",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    style: {
                                                        width: `${Math.min(100, progressionHud.experience / progressionHud.nextLevelXp * 100)}%`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 650
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 384,
                                                columnNumber: 618
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: [
                                                    progressionHud.experience,
                                                    "/",
                                                    progressionHud.nextLevelXp
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/Game.tsx",
                                                lineNumber: 384,
                                                columnNumber: 762
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 384,
                                        columnNumber: 556
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 384,
                                columnNumber: 96
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "level",
                                children: [
                                    progressionHud.skillPoints,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        children: " pontos"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 384,
                                        columnNumber: 888
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 384,
                                columnNumber: 837
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 384,
                        columnNumber: 34
                    }, this),
                    (combatHud.shield || combatHud.flying) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "active-magic",
                        children: [
                            combatHud.shield ? 'ESCUDO ATIVO' : 'VOO ATIVO',
                            combatHud.blocks > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    " · ",
                                    combatHud.blocks,
                                    " bloqueios"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 384,
                                columnNumber: 1069
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 384,
                        columnNumber: 965
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 384,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bottom-center",
                children: [
                    nearLandmark && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "interaction",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "keycap",
                                children: "G"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 385,
                                columnNumber: 82
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Ouvir o Eco do marco"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 385,
                                columnNumber: 115
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 385,
                        columnNumber: 53
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hotbar",
                        children: [
                            spellButton('zoltraak', 'Q', 'Zoltraak'),
                            spellButton('vollzanbel', '1', 'Vollzanbel'),
                            spellButton('judradjim', '2', 'Judradjim'),
                            spellButton('shield', 'F', 'Escudo'),
                            spellButton('flight', 'R', 'Voo'),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "hotkey",
                                onClick: toggleQuest,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot",
                                        children: "J"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 385,
                                        columnNumber: 433
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot-label",
                                        children: "Jornada"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 385,
                                        columnNumber: 464
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 385,
                                columnNumber: 384
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "hotkey",
                                onClick: toggleHelp,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot",
                                        children: "H"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 385,
                                        columnNumber: 564
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot-label",
                                        children: "Ajuda"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 385,
                                        columnNumber: 595
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 385,
                                columnNumber: 516
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 385,
                        columnNumber: 155
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 385,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bottom-right",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "world-time",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "◷"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 386,
                                columnNumber: 63
                            }, this),
                            " ",
                            dayLabel
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 386,
                        columnNumber: 35
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "weather",
                        children: "CAMPOS DA AURORA"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 386,
                        columnNumber: 94
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 386,
                columnNumber: 5
            }, this),
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "toast",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "✦"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 387,
                        columnNumber: 37
                    }, this),
                    hint
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 387,
                columnNumber: 14
            }, this),
            gameError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "game-error",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "O mundo não pôde ser carregado"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 388,
                        columnNumber: 47
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: gameError
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 388,
                        columnNumber: 94
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.location.reload(),
                        children: "Tentar novamente"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 388,
                        columnNumber: 118
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 388,
                columnNumber: 19
            }, this),
            (help || questOpen || inventoryOpen || skillsOpen || paused) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-backdrop",
                onClick: closeMenus,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `modal ${inventoryOpen || skillsOpen ? 'progression-modal' : ''}`,
                    role: "dialog",
                    "aria-modal": "true",
                    onClick: (event)=>event.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "modal-close",
                            onClick: closeMenus,
                            "aria-label": "Fechar",
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 390,
                            columnNumber: 7
                        }, this),
                        paused ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "modal-kicker",
                                    children: "CAMPOS DA AURORA"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 391,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "A jornada repousa."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 391,
                                    columnNumber: 73
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "O Eco ainda aguarda. Ajuste a qualidade ou retome a exploração."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 391,
                                    columnNumber: 100
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "quality-select",
                                    children: [
                                        "Qualidade gráfica",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: quality,
                                            onChange: (event)=>setQuality(event.target.value),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Baixa"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 307
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Média"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 329
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Alta"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 351
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 391,
                                            columnNumber: 221
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 391,
                                    columnNumber: 170
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "quality-select sensitivity-control",
                                    children: [
                                        "Sensibilidade do mouse",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "range",
                                            min: "1",
                                            max: "10",
                                            value: sensitivity,
                                            onChange: (event)=>setSensitivity(Number(event.target.value))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 391,
                                            columnNumber: 465
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: sensitivity
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 391,
                                            columnNumber: 587
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 391,
                                    columnNumber: 389
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "continue",
                                    onClick: closeMenus,
                                    children: [
                                        "RETOMAR A JORNADA ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 391,
                                            columnNumber: 689
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 391,
                                    columnNumber: 621
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 391,
                            columnNumber: 17
                        }, this) : help ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "modal-kicker",
                                    children: "CAMINHOS DO VIAJANTE"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 392,
                                    columnNumber: 20
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Um passo de cada vez."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 392,
                                    columnNumber: 78
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Enfrente os Ecos hostis. A mira central indica o alvo e a mana se recupera gradualmente."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 392,
                                    columnNumber: 108
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "controls-grid",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "W"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 239
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "A"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 251
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "S"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 263
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "D"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 275
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Mover"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 287
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 234
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Mouse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 316
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Olhar ao redor"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 332
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 311
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Roda"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 370
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Zoom da câmera"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 385
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 365
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Shift"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 423
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Correr / voar rápido"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 439
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 418
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Espaço"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 483
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Pular / subir voando"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 500
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 478
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Ctrl"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 544
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Descer voando"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 559
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 539
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Q / Clique esq."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 596
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Zoltraak · 10 mana"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 622
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 591
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "1"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 664
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Vollzanbel · 34 mana"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 676
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 659
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 720
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Judradjim · 27 mana"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 732
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 715
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "F"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 775
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Escudo · 20 mana + manutenção"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 787
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 770
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "R"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 840
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Voo · 12 mana + manutenção"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 852
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 835
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Clique dir."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 902
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Ataque com o cajado"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 924
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 897
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "X"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 967
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Esquiva"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 979
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 962
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "V"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 1010
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Postura defensiva"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 1022
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 1005
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "E"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 1063
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Abrir inventário"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 1075
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 1058
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: ","
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 1115
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Árvore de habilidades"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 1127
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 1110
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "G"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 1172
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Ouvir o Marco"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 1184
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 1167
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "J"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 1221
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Diário de viagem"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 1233
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 1216
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "Esc"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 1273
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Pausar e liberar cursor"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 1287
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 1268
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 392,
                                    columnNumber: 203
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "continue",
                                    onClick: closeMenus,
                                    children: [
                                        "CONTINUAR A JORNADA ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 392,
                                            columnNumber: 1405
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 392,
                                    columnNumber: 1335
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 392,
                            columnNumber: 18
                        }, this) : inventoryOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "modal-kicker",
                                    children: "PERTENCES DO VIAJANTE"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 393,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Inventário"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 393,
                                    columnNumber: 88
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Materiais recolhidos ao dissipar os Ecos hostis."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 393,
                                    columnNumber: 107
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inventory-grid",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: "inventory-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "item-glyph",
                                                    children: "✧"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 230
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Fragmento de Eco"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/Game.tsx",
                                                            lineNumber: 393,
                                                            columnNumber: 272
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            children: "Resíduo de energia arcana"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/Game.tsx",
                                                            lineNumber: 393,
                                                            columnNumber: 305
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 267
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: progressionHud.inventory.echoFragment
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 351
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 393,
                                            columnNumber: 194
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: "inventory-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "item-glyph",
                                                    children: "◇"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 443
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Núcleo de sentinela"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/Game.tsx",
                                                            lineNumber: 393,
                                                            columnNumber: 485
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            children: "Material deixado pelos Ecos"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/Game.tsx",
                                                            lineNumber: 393,
                                                            columnNumber: 521
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 480
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: progressionHud.inventory.sentinelCore
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 569
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 393,
                                            columnNumber: 407
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 393,
                                    columnNumber: 162
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inventory-footer",
                                    children: [
                                        "Nível ",
                                        progressionHud.level,
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "·"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 393,
                                            columnNumber: 694
                                        }, this),
                                        " ",
                                        progressionHud.experience,
                                        "/",
                                        progressionHud.nextLevelXp,
                                        " XP ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "·"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 393,
                                            columnNumber: 769
                                        }, this),
                                        " ",
                                        progressionHud.skillPoints,
                                        " pontos de habilidade"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 393,
                                    columnNumber: 631
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "continue",
                                    onClick: closeMenus,
                                    children: [
                                        "VOLTAR À JORNADA ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 393,
                                            columnNumber: 906
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 393,
                                    columnNumber: 839
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 393,
                            columnNumber: 27
                        }, this) : skillsOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "modal-kicker",
                                    children: [
                                        "TALENTOS DO ECO · NÍVEL ",
                                        progressionHud.level
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 394,
                                    columnNumber: 26
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Árvore de habilidades"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 394,
                                    columnNumber: 110
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "Derrote Ecos para ganhar XP. Cada nível concede 1 ponto; melhorias podem chegar ao nível ",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_RANK"],
                                        "."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 394,
                                    columnNumber: 140
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "skill-points",
                                    children: [
                                        "PONTOS DISPONÍVEIS ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: progressionHud.skillPoints
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 394,
                                            columnNumber: 296
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 394,
                                    columnNumber: 247
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "upgrade-grid",
                                    children: [
                                        'damage',
                                        'size',
                                        'efficiency'
                                    ].map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: "upgrade-card",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "upgrade-heading",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: id === 'damage' ? '✦' : id === 'size' ? '⬡' : '◌'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/Game.tsx",
                                                            lineNumber: 394,
                                                            columnNumber: 514
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPGRADE_INFO"][id].title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                                    lineNumber: 394,
                                                                    columnNumber: 583
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                    children: [
                                                                        "NÍVEL ",
                                                                        progressionHud.ranks[id],
                                                                        " / ",
                                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_RANK"]
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                                    lineNumber: 394,
                                                                    columnNumber: 624
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/game/Game.tsx",
                                                            lineNumber: 394,
                                                            columnNumber: 578
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 481
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UPGRADE_INFO"][id].description
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 696
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rank-track",
                                                    children: Array.from({
                                                        length: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_RANK"]
                                                    }, (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: index < progressionHud.ranks[id] ? 'filled' : ''
                                                        }, index, false, {
                                                            fileName: "[project]/src/components/game/Game.tsx",
                                                            lineNumber: 394,
                                                            columnNumber: 809
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 733
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "upgrade-button",
                                                    disabled: !progressionHud.skillPoints || progressionHud.ranks[id] >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_RANK"],
                                                    onClick: ()=>purchaseUpgrade(id),
                                                    children: progressionHud.ranks[id] >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_RANK"] ? 'NÍVEL MÁXIMO' : 'MELHORAR · 1 PONTO'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/Game.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 895
                                                }, this)
                                            ]
                                        }, id, true, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 394,
                                            columnNumber: 438
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 394,
                                    columnNumber: 347
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "continue",
                                    onClick: closeMenus,
                                    children: [
                                        "VOLTAR À JORNADA ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 394,
                                            columnNumber: 1217
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 394,
                                    columnNumber: 1150
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 394,
                            columnNumber: 24
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "modal-kicker",
                                    children: "DIÁRIO DE VIAGEM · 01"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 395,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "O Que Permanece"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 395,
                                    columnNumber: 72
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Quase mil anos se passaram desde a derrota de Valkhor. A relva tomou os velhos caminhos, e os nomes dos heróis já não são lembrados."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 395,
                                    columnNumber: 96
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Um marco de pedra repousa além do prado, coberto de musgo. Talvez ainda guarde uma lembrança."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 395,
                                    columnNumber: 235
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "quest-objective",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "✦"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 395,
                                            columnNumber: 368
                                        }, this),
                                        status.discovered ? 'Memória do Marco do Herói despertada' : 'Encontre o Marco do Herói nos campos'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 395,
                                    columnNumber: 335
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 395,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/Game.tsx",
                    lineNumber: 389,
                    columnNumber: 123
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 389,
                columnNumber: 70
            }, this),
            paused && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pause-stamp",
                children: "PAUSADO"
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 397,
                columnNumber: 16
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "build-stamp",
                children: [
                    "PRÓLOGO ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "·"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 398,
                        columnNumber: 42
                    }, this),
                    " PROTÓTIPO 0.2"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 398,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/Game.tsx",
        lineNumber: 355,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/game/audio.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
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
}),
"[project]/src/components/game/hero.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createHero",
    ()=>createHero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
;
function mesh(geometry, material, parent, position = [
    0,
    0,
    0
]) {
    const object = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geometry, material);
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
    return mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CapsuleGeometry"](radius, length, 5, 10), material, parent, position);
}
function smoothAngle(current, target, amount) {
    const difference = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].euclideanModulo(target - current + Math.PI, Math.PI * 2) - Math.PI;
    return current + difference * amount;
}
function createHero(scene) {
    const root = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    root.name = 'called-wanderer';
    const body = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    body.name = 'provisional-articulated-rig';
    root.add(body);
    const toonRamp = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTexture"](new Uint8Array([
        22,
        86,
        158,
        232
    ]), 4, 1, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RedFormat"]);
    toonRamp.magFilter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NearestFilter"];
    toonRamp.minFilter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NearestFilter"];
    toonRamp.generateMipmaps = false;
    toonRamp.needsUpdate = true;
    const toon = (color)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshToonMaterial"]({
            color,
            gradientMap: toonRamp
        });
    scene.userData.gameTextures = [
        ...scene.userData.gameTextures ?? [],
        toonRamp
    ];
    const cloth = toon('#42616a');
    const coat = toon('#dad1b7');
    const coatShadow = toon('#a5a18c');
    const leather = toon('#544337');
    const metal = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#b99d67',
        roughness: .43,
        metalness: .42
    });
    const skin = toon('#edc9a9');
    const hair = toon('#e4e1d3');
    const hairShade = toon('#aeb9b5');
    const eye = toon('#6f998e');
    const glow = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshToonMaterial"]({
        color: '#f2dca5',
        emissive: '#b58a3f',
        emissiveIntensity: 1.2,
        gradientMap: toonRamp
    });
    const torso = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.38, .62, 7, 14), cloth, body, [
        0,
        1.43,
        0
    ]);
    torso.scale.set(1, 1, .78);
    const mantle = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LatheGeometry"]([
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector2"](.54, .12),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector2"](.58, .22),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector2"](.49, .5),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector2"](.39, .82),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector2"](.4, 1.13),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector2"](.53, 1.43),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector2"](.45, 1.58),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector2"](.28, 1.65)
    ], 16), coat);
    mantle.position.set(0, .25, -.035);
    mantle.castShadow = true;
    mantle.receiveShadow = true;
    body.add(mantle);
    for (const side of [
        -1,
        1
    ]){
        const seamCurve = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CatmullRomCurve3"]([
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](side * .15, 1.82, -.31),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](side * .2, 1.35, -.48),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](side * .26, .85, -.51),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](side * .45, .38, -.57)
        ]);
        mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TubeGeometry"](seamCurve, 18, .012, 5, false), coatShadow, body);
    }
    const mantlePanel = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"](), coatShadow, body);
    const panelShape = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Shape"]();
    panelShape.moveTo(-.09, 1.38);
    panelShape.lineTo(.3, 1.42);
    panelShape.lineTo(.44, .12);
    panelShape.lineTo(.16, .04);
    panelShape.closePath();
    mantlePanel.geometry.dispose();
    mantlePanel.geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShapeGeometry"](panelShape, 1);
    mantlePanel.position.set(.04, .25, .37);
    const collar = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](.39, .095, 9, 20, Math.PI), coat, body, [
        0,
        2.02,
        0
    ]);
    collar.rotation.z = Math.PI;
    const scarf = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](.36, .1, 8, 24), cloth, body, [
        0,
        1.89,
        .015
    ]);
    scarf.rotation.x = Math.PI / 2;
    const head = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    head.position.set(0, 2.13, .015);
    body.add(head);
    const face = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](.31, 20, 18), skin, head, [
        0,
        .04,
        .015
    ]);
    face.scale.set(.92, 1.08, .83);
    for (const side of [
        -1,
        1
    ]){
        const ear = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](.09, 12, 10), skin, head, [
            side * .29,
            .045,
            -.005
        ]);
        ear.scale.set(.55, 1.18, .68);
        const eyeWhite = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](.052, 10, 10), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#f7f0df'
        }), head, [
            side * .112,
            .065,
            .268
        ]);
        eyeWhite.scale.set(1.15, .82, .45);
        mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](.028, 10, 8), eye, head, [
            side * .112,
            .065,
            .29
        ]);
        const brow = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.018, .075, 2, 6), hairShade, head, [
            side * .11,
            .145,
            .25
        ]);
        brow.rotation.z = side * -.12;
        brow.rotation.y = side * -.08;
    }
    mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](.025, 9, 7), skin, head, [
        0,
        -.025,
        .277
    ]);
    const fringe = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](.31, 18, 12, 0, Math.PI * 2, 0, Math.PI * .62), hair, head, [
        0,
        .17,
        -.018
    ]);
    fringe.scale.set(1.1, 1.05, 1);
    for(let i = 0; i < 7; i++){
        const side = i % 2 ? 1 : -1;
        const lock = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.065, .2 + i % 3 * .035, 4, 8), i % 3 === 0 ? hairShade : hair, head, [
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
    const circlet = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](.255, .028, 7, 24, Math.PI), metal, head, [
        0,
        .27,
        .005
    ]);
    circlet.rotation.z = Math.PI;
    const circletGem = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OctahedronGeometry"](.065, 0), glow, head, [
        0,
        .48,
        .015
    ]);
    circletGem.scale.set(.76, 1.28, .62);
    const hips = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    hips.position.set(0, .73, 0);
    body.add(hips);
    const legs = [];
    for (const side of [
        -1,
        1
    ]){
        const thigh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
        thigh.name = side < 0 ? 'leg-left' : 'leg-right';
        thigh.position.set(side * .19, 0, 0);
        hips.add(thigh);
        legs.push(thigh);
        capsule(leather, .13, .33, thigh, [
            0,
            -.31,
            0
        ]);
        const shin = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
        shin.position.set(0, -.57, 0);
        thigh.add(shin);
        capsule(coatShadow, .12, .3, shin, [
            0,
            -.22,
            0
        ]);
        const boot = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.14, .2, 4, 9), leather, shin, [
            0,
            -.49,
            .075
        ]);
        boot.rotation.x = Math.PI / 2;
        const bootTrim = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](.122, .025, 6, 12), metal, shin, [
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
        const shoulder = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](.2, 12, 10), coatShadow, body, [
            side * .43,
            1.79,
            0
        ]);
        shoulder.scale.set(1.06, .74, .83);
        const arm = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
        arm.name = side < 0 ? 'arm-left' : 'arm-right';
        arm.position.set(side * .46, 1.78, .01);
        body.add(arm);
        arms.push(arm);
        capsule(cloth, .115, .31, arm, [
            0,
            -.25,
            0
        ]);
        const cuff = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](.12, .024, 6, 12), metal, arm, [
            0,
            -.48,
            0
        ]);
        capsule(coat, .095, .26, arm, [
            0,
            -.64,
            0
        ]);
        mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](.11, 10, 8), leather, arm, [
            0,
            -.84,
            .025
        ]);
        cuff.position.y = -.48;
    }
    const belt = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](.35, .055, 8, 24), leather, body, [
        0,
        .99,
        0
    ]);
    belt.rotation.x = Math.PI / 2;
    const clasp = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](.16, .14, .055), metal, body, [
        0,
        .99,
        .36
    ]);
    const satchel = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](.24, .27, .13), leather, body, [
        -.42,
        1.05,
        .04
    ]);
    satchel.rotation.z = -.14;
    const strap = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.025, .72, 4, 7), leather, body, [
        -.22,
        1.48,
        -.06
    ]);
    strap.rotation.z = -.32;
    strap.rotation.x = -.2;
    const staff = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    staff.name = 'heirloom-staff';
    staff.position.set(.52, .67, .15);
    staff.rotation.z = -.11;
    body.add(staff);
    const wood = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#644b35',
        roughness: .83
    });
    const shaft = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](.038, .065, 2.2, 9), wood, staff, [
        0,
        .66,
        0
    ]);
    const grip = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.07, .2, 4, 8), leather, staff, [
        0,
        .48,
        .02
    ]);
    for(let i = 0; i < 3; i++){
        const wrap = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](.055, .018, 6, 10), metal, staff, [
            0,
            .35 + i * .12,
            0
        ]);
        wrap.rotation.x = Math.PI / 2;
    }
    const headRing = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](.15, .035, 8, 18), metal, staff, [
        0,
        1.87,
        0
    ]);
    headRing.rotation.x = Math.PI / 2;
    const focus = mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IcosahedronGeometry"](.115, 1), glow, staff, [
        0,
        1.87,
        0
    ]);
    const spellPoint = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Object3D"]();
    spellPoint.position.set(0, 1.91, .04);
    staff.add(spellPoint);
    const aura = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PointLight"]('#efdba9', .85, 4, 2);
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
    const mixer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimationMixer"](root);
    const keyTimes = new Float32Array([
        0,
        .25,
        .5,
        .75,
        1
    ]);
    const makeTrack = (target, property, values)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NumberKeyframeTrack"](`${target}.${property}`, keyTimes, values);
    const clips = new Map();
    const clipData = {
        idle: {
            duration: 1,
            tracks: [
                makeTrack('provisional-articulated-rig', 'position[y]', [
                    0,
                    .018,
                    .035,
                    .018,
                    0
                ]),
                makeTrack('arm-left', 'rotation[x]', [
                    -.025,
                    -.04,
                    -.025,
                    -.01,
                    -.025
                ]),
                makeTrack('arm-right', 'rotation[x]', [
                    -.025,
                    -.01,
                    -.025,
                    -.04,
                    -.025
                ])
            ]
        },
        walk: {
            duration: .78,
            tracks: [
                makeTrack('leg-left', 'rotation[x]', [
                    .38,
                    0,
                    -.38,
                    0,
                    .38
                ]),
                makeTrack('leg-right', 'rotation[x]', [
                    -.38,
                    0,
                    .38,
                    0,
                    -.38
                ]),
                makeTrack('arm-left', 'rotation[x]', [
                    -.19,
                    0,
                    .19,
                    0,
                    -.19
                ]),
                makeTrack('arm-right', 'rotation[x]', [
                    .19,
                    0,
                    -.19,
                    0,
                    .19
                ]),
                makeTrack('provisional-articulated-rig', 'position[y]', [
                    .015,
                    .055,
                    .015,
                    .055,
                    .015
                ])
            ]
        },
        run: {
            duration: .52,
            tracks: [
                makeTrack('leg-left', 'rotation[x]', [
                    .62,
                    0,
                    -.62,
                    0,
                    .62
                ]),
                makeTrack('leg-right', 'rotation[x]', [
                    -.62,
                    0,
                    .62,
                    0,
                    -.62
                ]),
                makeTrack('arm-left', 'rotation[x]', [
                    -.34,
                    0,
                    .34,
                    0,
                    -.34
                ]),
                makeTrack('arm-right', 'rotation[x]', [
                    .34,
                    0,
                    -.34,
                    0,
                    .34
                ]),
                makeTrack('provisional-articulated-rig', 'position[y]', [
                    .025,
                    .11,
                    .025,
                    .11,
                    .025
                ]),
                makeTrack('provisional-articulated-rig', 'rotation[z]', [
                    -.025,
                    0,
                    .025,
                    0,
                    -.025
                ])
            ]
        },
        jump: {
            duration: .48,
            loop: false,
            tracks: [
                makeTrack('leg-left', 'rotation[x]', [
                    -.24,
                    -.35,
                    -.26,
                    -.2,
                    -.2
                ]),
                makeTrack('leg-right', 'rotation[x]', [
                    -.24,
                    -.18,
                    -.25,
                    -.22,
                    -.2
                ]),
                makeTrack('arm-left', 'rotation[x]', [
                    -.2,
                    -.55,
                    -.48,
                    -.5,
                    -.5
                ]),
                makeTrack('arm-right', 'rotation[x]', [
                    -.2,
                    -.55,
                    -.48,
                    -.5,
                    -.5
                ]),
                makeTrack('provisional-articulated-rig', 'position[y]', [
                    0,
                    .12,
                    .13,
                    .08,
                    .05
                ])
            ]
        },
        fall: {
            duration: 1,
            tracks: [
                makeTrack('leg-left', 'rotation[x]', [
                    -.2,
                    -.18,
                    -.22,
                    -.18,
                    -.2
                ]),
                makeTrack('leg-right', 'rotation[x]', [
                    -.2,
                    -.22,
                    -.18,
                    -.22,
                    -.2
                ]),
                makeTrack('arm-left', 'rotation[x]', [
                    -.25,
                    -.2,
                    -.25,
                    -.2,
                    -.25
                ]),
                makeTrack('arm-right', 'rotation[x]', [
                    -.25,
                    -.2,
                    -.25,
                    -.2,
                    -.25
                ]),
                makeTrack('provisional-articulated-rig', 'rotation[z]', [
                    .04,
                    .025,
                    .04,
                    .025,
                    .04
                ])
            ]
        },
        land: {
            duration: .42,
            loop: false,
            tracks: [
                makeTrack('leg-left', 'rotation[x]', [
                    -.28,
                    -.48,
                    -.24,
                    0,
                    0
                ]),
                makeTrack('leg-right', 'rotation[x]', [
                    -.28,
                    -.42,
                    -.2,
                    0,
                    0
                ]),
                makeTrack('provisional-articulated-rig', 'position[y]', [
                    .04,
                    -.1,
                    -.03,
                    0,
                    0
                ])
            ]
        },
        attack: {
            duration: .36,
            loop: false,
            tracks: [
                makeTrack('arm-left', 'rotation[x]', [
                    -.1,
                    -.78,
                    -.46,
                    -.08,
                    -.08
                ]),
                makeTrack('arm-right', 'rotation[x]', [
                    -.1,
                    -.92,
                    -.35,
                    -.08,
                    -.08
                ]),
                makeTrack('provisional-articulated-rig', 'rotation[z]', [
                    0,
                    -.08,
                    .12,
                    0,
                    0
                ])
            ]
        },
        dodge: {
            duration: .42,
            loop: false,
            tracks: [
                makeTrack('leg-left', 'rotation[x]', [
                    -.12,
                    -.65,
                    -.3,
                    0,
                    0
                ]),
                makeTrack('leg-right', 'rotation[x]', [
                    -.12,
                    .3,
                    .6,
                    0,
                    0
                ]),
                makeTrack('arm-left', 'rotation[x]', [
                    -.1,
                    -.35,
                    -.5,
                    -.1,
                    -.1
                ]),
                makeTrack('arm-right', 'rotation[x]', [
                    -.1,
                    -.5,
                    -.35,
                    -.1,
                    -.1
                ]),
                makeTrack('provisional-articulated-rig', 'rotation[z]', [
                    0,
                    -.3,
                    .25,
                    0,
                    0
                ])
            ]
        },
        guard: {
            duration: 1,
            tracks: [
                makeTrack('arm-left', 'rotation[x]', [
                    -.5,
                    -.52,
                    -.5,
                    -.48,
                    -.5
                ]),
                makeTrack('arm-right', 'rotation[x]', [
                    -.65,
                    -.68,
                    -.65,
                    -.63,
                    -.65
                ])
            ]
        },
        cast: {
            duration: .58,
            loop: false,
            tracks: [
                makeTrack('arm-left', 'rotation[x]', [
                    -.14,
                    -.55,
                    -.58,
                    -.52,
                    -.5
                ]),
                makeTrack('arm-right', 'rotation[x]', [
                    -.14,
                    -.72,
                    -.78,
                    -.65,
                    -.6
                ]),
                makeTrack('provisional-articulated-rig', 'rotation[z]', [
                    0,
                    .05,
                    .055,
                    .025,
                    0
                ])
            ]
        },
        hit: {
            duration: .28,
            loop: false,
            tracks: [
                makeTrack('arm-left', 'rotation[x]', [
                    0,
                    .32,
                    .18,
                    0,
                    0
                ]),
                makeTrack('arm-right', 'rotation[x]', [
                    0,
                    .32,
                    .18,
                    0,
                    0
                ]),
                makeTrack('provisional-articulated-rig', 'rotation[z]', [
                    0,
                    .12,
                    -.06,
                    0,
                    0
                ])
            ]
        },
        defeat: {
            duration: 1.2,
            loop: false,
            tracks: [
                makeTrack('leg-left', 'rotation[x]', [
                    0,
                    .14,
                    .56,
                    1.1,
                    1.25
                ]),
                makeTrack('leg-right', 'rotation[x]', [
                    0,
                    .16,
                    .42,
                    .8,
                    .9
                ]),
                makeTrack('provisional-articulated-rig', 'rotation[z]', [
                    0,
                    .08,
                    .28,
                    1.05,
                    1.3
                ]),
                makeTrack('provisional-articulated-rig', 'position[y]', [
                    0,
                    -.08,
                    -.32,
                    -.66,
                    -.72
                ])
            ]
        },
        fly: {
            duration: 1,
            tracks: [
                makeTrack('leg-left', 'rotation[x]', [
                    -.18,
                    -.2,
                    -.18,
                    -.16,
                    -.18
                ]),
                makeTrack('leg-right', 'rotation[x]', [
                    -.18,
                    -.16,
                    -.18,
                    -.2,
                    -.18
                ]),
                makeTrack('arm-left', 'rotation[x]', [
                    -.9,
                    -.86,
                    -.9,
                    -.94,
                    -.9
                ]),
                makeTrack('arm-right', 'rotation[x]', [
                    -.9,
                    -.94,
                    -.9,
                    -.86,
                    -.9
                ]),
                makeTrack('provisional-articulated-rig', 'position[y]', [
                    .06,
                    .1,
                    .14,
                    .1,
                    .06
                ]),
                makeTrack('provisional-articulated-rig', 'rotation[z]', [
                    -.02,
                    0,
                    .02,
                    0,
                    -.02
                ])
            ]
        }
    };
    for (const pose of Object.keys(clipData)){
        const data = clipData[pose];
        for (const track of data.tracks)track.times = Float32Array.from(track.times, (value)=>value * data.duration);
        const action = mixer.clipAction(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimationClip"](`hero-${pose}`, data.duration, data.tracks));
        action.setLoop(data.loop === false ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoopOnce"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoopRepeat"], data.loop === false ? 1 : Infinity);
        action.clampWhenFinished = data.loop === false;
        clips.set(pose, action);
    }
    let activePose = 'idle';
    let activeAction = clips.get(activePose);
    activeAction.play();
    return {
        root,
        spellPoint,
        update (time, delta, pose, speed = 0) {
            if (pose !== activePose) {
                const next = clips.get(pose);
                activeAction.fadeOut(.16);
                next.reset().fadeIn(.16).play();
                activeAction = next;
                activePose = pose;
            }
            if (pose === 'walk') activeAction.timeScale = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(speed / 4.1, .58, 1.32);
            else if (pose === 'run') activeAction.timeScale = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(speed / 7.1, .72, 1.25);
            else activeAction.timeScale = 1;
            mixer.update(delta);
            root.rotation.y = smoothAngle(root.rotation.y, root.userData.facing ?? root.rotation.y, 1 - Math.exp(-delta * 13));
            focus.scale.setScalar(.93 + Math.sin(time * 1.8) * .08);
        }
    };
}
}),
"[project]/src/components/game/magic.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MagicSystem",
    ()=>MagicSystem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world.ts [app-ssr] (ecmascript)");
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
class MagicSystem {
    scene;
    player;
    combat;
    blockers;
    progression;
    mana;
    maxMana;
    flying;
    shieldActive;
    shieldTime;
    blocks;
    root;
    projectiles;
    effects;
    cooldowns;
    shieldRoot;
    shieldPanels;
    shieldFlash;
    basicMat;
    fireMat;
    trailMat;
    fireTrailMat;
    temp;
    collisionRay;
    constructor(scene, player, combat, blockers, progression){
        this.scene = scene;
        this.player = player;
        this.combat = combat;
        this.blockers = blockers;
        this.progression = progression;
        this.mana = 100;
        this.maxMana = 100;
        this.flying = false;
        this.shieldActive = false;
        this.shieldTime = 0;
        this.blocks = 0;
        this.root = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
        this.projectiles = [];
        this.effects = [];
        this.cooldowns = {
            zoltraak: 0,
            vollzanbel: 0,
            judradjim: 0,
            shield: 0,
            flight: 0
        };
        this.shieldRoot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
        this.shieldPanels = [];
        this.shieldFlash = 0;
        this.basicMat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#f3e5b8'
        });
        this.fireMat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#ff9a52'
        });
        this.trailMat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LineBasicMaterial"]({
            color: '#d9d8b3',
            transparent: true,
            opacity: .68
        });
        this.fireTrailMat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LineBasicMaterial"]({
            color: '#e78c53',
            transparent: true,
            opacity: .55
        });
        this.temp = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Object3D"]();
        this.collisionRay = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Raycaster"]();
        this.root.name = 'spell-effects';
        scene.add(this.root);
        this.shieldRoot.name = 'hex-aegis';
        this.player.add(this.shieldRoot);
        this.shieldRoot.position.set(0, 1.28, .72);
        const panelGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CircleGeometry"](.49, 6);
        panelGeo.rotateZ(Math.PI / 6);
        for(let i = 0; i < 7; i++){
            const mat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
                transparent: true,
                depthWrite: false,
                side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"],
                uniforms: {
                    uTime: {
                        value: 0
                    },
                    uFlash: {
                        value: 0
                    }
                },
                vertexShader: `varying vec2 vUv; varying vec3 vNormalView; void main(){vUv=uv;vNormalView=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
                fragmentShader: `uniform float uTime; uniform float uFlash; varying vec2 vUv; varying vec3 vNormalView; void main(){float edge=1.0-smoothstep(.84,.98,length((vUv-.5)*2.0));float scan=.5+.5*sin(vUv.y*34.0-uTime*2.2);float rim=pow(1.0-abs(vNormalView.z),2.0);float alpha=(.12+edge*.17+rim*.16+scan*.035+uFlash*.48)*edge;vec3 base=mix(vec3(.45,.67,.62),vec3(.88,.91,.76),uFlash*.7+rim*.25);gl_FragColor=vec4(base,alpha);}`
            });
            const panel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](panelGeo, mat);
            panel.position.set((i % 3 - 1) * .74, (Math.floor(i / 3) - 1) * .72, 0);
            panel.rotation.y = Math.PI;
            this.shieldRoot.add(panel);
            this.shieldPanels.push(panel);
            const edge = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EdgesGeometry"](panelGeo), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LineBasicMaterial"]({
                color: '#c3d7bc',
                transparent: true,
                opacity: .7
            }));
            panel.add(edge);
        }
        this.shieldRoot.visible = false;
    }
    cooldown(id) {
        return this.cooldowns[id];
    }
    cast(id, origin, direction, target) {
        const manaCost = this.progression.manaCost(COST[id]);
        if (this.cooldowns[id] > 0 || this.mana < manaCost) return false;
        this.mana -= manaCost;
        this.cooldowns[id] = COOLDOWN[id];
        if (id === 'shield') {
            this.shieldActive = true;
            this.shieldTime = 6;
            this.shieldRoot.visible = true;
            this.shieldFlash = .45;
            return true;
        }
        if (id === 'flight') {
            this.flying = !this.flying;
            this.flightEffect(this.player.position);
            return true;
        }
        if (id === 'judradjim') {
            const size = this.progression.sizeMultiplier();
            this.lightning(origin, target, size);
            this.combat.damageAt(target, 4.4 * size, 46 * this.progression.damageMultiplier());
            return true;
        }
        const kind = id;
        const group = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
        group.name = kind;
        const fire = kind === 'vollzanbel';
        const core = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IcosahedronGeometry"](fire ? .28 : .16, 2), fire ? this.fireMat : this.basicMat);
        core.scale.set(.82, .82, fire ? 1.5 : 1.8);
        group.add(core);
        const ring = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](fire ? .36 : .23, fire ? .04 : .025, 8, 24), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: fire ? '#ffb05c' : '#d6c27e',
            transparent: true,
            opacity: .72
        }));
        group.add(ring);
        group.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PointLight"](fire ? '#ff8039' : '#ead7a2', fire ? 1.8 : 1.2, fire ? 6 : 4, 2));
        group.position.copy(origin).addScaledVector(direction, .5);
        group.quaternion.setFromUnitVectors(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0, 0, 1), direction.clone().normalize());
        group.scale.setScalar(this.progression.sizeMultiplier());
        this.root.add(group);
        const points = Array.from({
            length: 9
        }, ()=>group.position.clone());
        const geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]().setFromPoints(points);
        const trail = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"](geometry, fire ? this.fireTrailMat : this.trailMat);
        this.root.add(trail);
        this.projectiles.push({
            object: group,
            trail,
            points,
            velocity: direction.clone().normalize().multiplyScalar(fire ? 13 : 34),
            age: 0,
            kind,
            target: target.clone(),
            damage: (p, radius, amount)=>{
                const size = this.progression.sizeMultiplier();
                this.combat.damageAt(p, radius * size, amount * this.progression.damageMultiplier());
            }
        });
        this.flightEffect(origin);
        return true;
    }
    blockProjectile(from, to) {
        if (!this.shieldActive || this.mana <= 0) return false;
        const center = this.shieldRoot.getWorldPosition(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]());
        const segment = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line3"](from, to);
        const closest = segment.closestPointToPoint(center, true, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]());
        if (closest.distanceTo(center) > 1.38 * this.progression.sizeMultiplier()) return false;
        this.mana = Math.max(0, this.mana - 6);
        this.shieldTime = Math.max(0, this.shieldTime - .65);
        this.shieldFlash = .5;
        this.blocks++;
        this.impact(center, '#c7dfce', 1.6);
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
                this.flightEffect(this.player.position);
            }
        }
        if (this.shieldActive) {
            this.mana -= delta * 2.4;
            this.shieldTime -= delta;
            this.shieldRoot.visible = true;
            this.shieldRoot.scale.setScalar(this.progression.sizeMultiplier());
            this.shieldRoot.rotation.y = Math.sin(elapsed * 1.1) * .055;
        }
        if (this.shieldActive && (this.shieldTime <= 0 || this.mana <= 0)) {
            this.shieldActive = false;
            this.shieldRoot.visible = false;
        }
        this.shieldFlash = Math.max(0, this.shieldFlash - delta * 2.4);
        this.shieldPanels.forEach((panel, i)=>{
            panel.material.uniforms.uTime.value = elapsed + i * .22;
            panel.material.uniforms.uFlash.value = Math.max(0, this.shieldFlash + Math.sin(elapsed * 2.4 + i) * .015);
        });
        for(let i = this.projectiles.length - 1; i >= 0; i--){
            const p = this.projectiles[i], previous = p.object.position.clone();
            p.age += delta;
            p.object.position.addScaledVector(p.velocity, delta);
            p.object.rotation.z += delta * 3;
            this.collisionRay.set(previous, p.velocity.clone().normalize());
            this.collisionRay.near = 0;
            this.collisionRay.far = p.velocity.length() * delta + .12;
            const obstacle = this.collisionRay.intersectObjects(this.blockers, true)[0];
            if (obstacle) p.object.position.copy(obstacle.point);
            p.points.pop();
            p.points.unshift(p.object.position.clone());
            const attr = p.trail.geometry.attributes.position;
            p.points.forEach((v, j)=>attr.setXYZ(j, v.x, v.y, v.z));
            attr.needsUpdate = true;
            p.trail.geometry.computeBoundingSphere();
            const targetHit = p.object.position.distanceTo(p.target) < Math.max(.35, p.velocity.length() * delta);
            const enemyHit = this.combat.targets.some((target)=>{
                if (!target.visible) return false;
                target.updateMatrixWorld();
                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Box3"]().setFromObject(target).expandByScalar(.42).containsPoint(p.object.position);
            });
            const ground = p.object.position.y < (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["terrainHeight"])(p.object.position.x, p.object.position.z) + .15;
            if (obstacle || enemyHit || targetHit || ground || p.age > (p.kind === 'vollzanbel' ? 2.5 : 1.35)) {
                const radius = p.kind === 'vollzanbel' ? 4.6 : .9;
                p.damage(p.object.position, radius, p.kind === 'vollzanbel' ? 58 : 34);
                this.impact(p.object.position, p.kind === 'vollzanbel' ? '#f28e4e' : '#eee1b5', p.kind === 'vollzanbel' ? 4.3 : 1.45);
                p.object.removeFromParent();
                p.trail.removeFromParent();
                p.object.traverse((o)=>{
                    if (o instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"]) {
                        o.geometry.dispose();
                        if (o.material !== this.basicMat && o.material !== this.fireMat) o.material.dispose();
                    }
                });
                p.trail.geometry.dispose();
                this.projectiles.splice(i, 1);
            }
        }
        for(let i = this.effects.length - 1; i >= 0; i--){
            const e = this.effects[i];
            e.age += delta;
            const t = Math.min(1, e.age / e.life);
            if (e.ring) {
                e.ring.scale.setScalar(.4 + t * 3);
                e.ring.material.opacity = (1 - t) * .78;
            }
            if (e.light) e.light.intensity = (1 - t) * 2.5;
            e.sparks?.forEach(({ mesh, velocity })=>{
                mesh.position.addScaledVector(velocity, delta);
                mesh.scale.setScalar(Math.max(.02, 1 - t));
            });
            if (t >= 1) {
                e.object.removeFromParent();
                e.object.traverse((o)=>{
                    if (o instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"] || o instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"]) {
                        o.geometry.dispose();
                        if (Array.isArray(o.material)) o.material.forEach((m)=>m.dispose());
                        else o.material.dispose();
                    }
                });
                this.effects.splice(i, 1);
            }
        }
    }
    dispose() {
        this.root.removeFromParent();
        this.shieldRoot.removeFromParent();
        this.projectiles.forEach((p)=>{
            p.trail.geometry.dispose();
        });
        this.effects.forEach((e)=>e.object.removeFromParent());
        this.basicMat.dispose();
        this.fireMat.dispose();
        this.trailMat.dispose();
        this.fireTrailMat.dispose();
    }
    impact(pos, color, radius) {
        const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
        g.position.copy(pos);
        this.root.add(g);
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color,
            transparent: true,
            opacity: .8,
            side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"],
            depthWrite: false
        });
        const ring = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](.65, .035, 7, 32), m);
        ring.rotation.x = -Math.PI / 2;
        g.add(ring);
        g.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PointLight"](color, 2.5, radius * 2));
        const geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OctahedronGeometry"](.075, 0), pm = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color
        }), sparks = [];
        for(let i = 0; i < 12; i++){
            const particle = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo, pm);
            const a = i / 12 * Math.PI * 2;
            particle.position.set(Math.cos(a) * .5, .12 + i % 3 * .1, Math.sin(a) * .5);
            g.add(particle);
            sparks.push({
                mesh: particle,
                velocity: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](Math.cos(a), .4 + i % 3 * .25, Math.sin(a)).multiplyScalar(2.1 + i % 4 * .25)
            });
        }
        this.effects.push({
            object: g,
            age: 0,
            life: .52,
            ring,
            light: g.children.find((o)=>o instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PointLight"]),
            sparks
        });
    }
    lightning(from, to, size = 1) {
        const points = [
            from.clone()
        ];
        const delta = to.clone().sub(from);
        for(let i = 1; i < 10; i++)points.push(from.clone().addScaledVector(delta, i / 10).add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]((Math.random() - .5) * .7 * size, (Math.random() - .5) * .6 * size, (Math.random() - .5) * .7 * size)));
        points.push(to.clone());
        const line = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]().setFromPoints(points), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LineBasicMaterial"]({
            color: '#d6dfc6',
            transparent: true,
            opacity: .95
        }));
        this.root.add(line);
        const light = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PointLight"]('#cbdca9', 2.2, 9 * size);
        light.position.copy(to);
        this.root.add(light);
        this.effects.push({
            object: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"](),
            age: 0,
            life: .26
        });
        this.root.add(this.effects[this.effects.length - 1].object);
        this.effects[this.effects.length - 1].object.add(line, light);
        this.impact(to, '#d8e0c1', 3 * size);
    }
    flightEffect(position) {
        const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
        g.position.copy(position);
        this.root.add(g);
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#c9d8b0',
            transparent: true,
            opacity: .65,
            side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
        });
        const ring = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](.62, .025, 7, 28), m);
        ring.rotation.x = Math.PI / 2;
        g.add(ring);
        this.effects.push({
            object: g,
            age: 0,
            life: .5,
            ring
        });
    }
}
}),
"[project]/src/components/game/progression.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAX_RANK",
    ()=>MAX_RANK,
    "PlayerProgression",
    ()=>PlayerProgression,
    "UPGRADE_INFO",
    ()=>UPGRADE_INFO
]);
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
        sentinelCore: 0
    };
    recordSentinelDefeat() {
        this.experience += 50;
        this.inventory.echoFragment += 1;
        this.inventory.sentinelCore += 1;
        while(this.experience >= this.nextLevelXp){
            this.experience -= this.nextLevelXp;
            this.level += 1;
            this.skillPoints += 1;
            this.nextLevelXp = 100 + (this.level - 1) * 50;
        }
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
}),
"[project]/src/components/game/simulation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PlayerMotor",
    ()=>PlayerMotor,
    "ThirdPersonCamera",
    ()=>ThirdPersonCamera
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world.ts [app-ssr] (ecmascript)");
;
;
class PlayerMotor {
    root;
    colliders;
    velocity;
    grounded;
    dodgeVelocity;
    verticalVelocity;
    constructor(root, colliders){
        this.root = root;
        this.colliders = colliders;
        this.velocity = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        this.grounded = false;
        this.dodgeVelocity = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        this.verticalVelocity = 0;
    }
    get verticalSpeed() {
        return this.verticalVelocity;
    }
    dodge(facingYaw, side = 0) {
        const forward = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](-Math.sin(facingYaw), 0, -Math.cos(facingYaw));
        const right = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](Math.cos(facingYaw), 0, -Math.sin(facingYaw));
        this.dodgeVelocity.copy(forward).multiplyScalar(side < 0 ? -1 : 1);
        if (Math.abs(side) > .35) this.dodgeVelocity.copy(right).multiplyScalar(Math.sign(side));
        this.dodgeVelocity.multiplyScalar(8.5);
    }
    update(delta, moveForward, moveSide, sprint, jump, facingYaw, flight = false, verticalInput = 0, cameraPitch = 0) {
        const inputLength = Math.hypot(moveForward, moveSide);
        let desiredX = 0, desiredZ = 0;
        if (inputLength > 0) {
            const fX = -Math.sin(facingYaw), fZ = -Math.cos(facingYaw);
            const rX = Math.cos(facingYaw), rZ = -Math.sin(facingYaw);
            desiredX = (fX * moveForward + rX * moveSide) / inputLength;
            desiredZ = (fZ * moveForward + rZ * moveSide) / inputLength;
            const speed = flight ? sprint ? 7.6 : 5.2 : sprint ? 7.4 : 4.35;
            desiredX *= speed;
            desiredZ *= speed;
        }
        const response = inputLength > 0 ? 16 : 20;
        this.velocity.x = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].damp(this.velocity.x, desiredX, response, delta);
        this.velocity.z = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].damp(this.velocity.z, desiredZ, response, delta);
        this.dodgeVelocity.multiplyScalar(Math.exp(-delta * 8));
        const movementX = this.velocity.x + this.dodgeVelocity.x, movementZ = this.velocity.z + this.dodgeVelocity.z;
        const steps = Math.max(1, Math.ceil(Math.hypot(movementX, movementZ) * delta / .22));
        const stepDelta = delta / steps;
        for(let step = 0; step < steps; step++){
            let x = this.root.position.x + movementX * stepDelta;
            let z = this.root.position.z + movementZ * stepDelta;
            x = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(x, -105, 105);
            z = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(z, -105, 105);
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
        const surfaceY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["terrainHeight"])(this.root.position.x, this.root.position.z);
        if (flight) {
            const forwardLift = -moveForward * Math.sin(cameraPitch) * (sprint ? 7.6 : 5.2);
            this.verticalVelocity = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].damp(this.verticalVelocity, verticalInput * 4.4 + forwardLift, 8, delta);
            this.root.position.y = Math.max(surfaceY + .12, this.root.position.y + this.verticalVelocity * delta);
            this.grounded = false;
        } else if (this.root.position.y <= surfaceY + .06 && this.verticalVelocity <= 0) {
            this.root.position.y = surfaceY;
            this.verticalVelocity = 0;
            this.grounded = true;
        } else this.grounded = false;
        if (!flight && jump && this.grounded) {
            this.verticalVelocity = 9.4;
            this.grounded = false;
        }
        if (!flight) {
            this.verticalVelocity -= 26 * delta;
            this.root.position.y += this.verticalVelocity * delta;
        }
        if (!flight && this.root.position.y <= surfaceY) {
            this.root.position.y = surfaceY;
            this.verticalVelocity = 0;
            this.grounded = true;
        }
        if (inputLength > 0 && Math.hypot(this.velocity.x, this.velocity.z) > .2) {
            const facing = Math.atan2(this.velocity.x, this.velocity.z);
            this.root.userData.facing = facing;
        }
        return inputLength > 0 && Math.hypot(this.velocity.x, this.velocity.z) > .35 || this.dodgeVelocity.length() > .8;
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
        this.raycaster = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Raycaster"]();
        this.target = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        this.offset = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        this.desired = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        this.look = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        this.collisionDistance = 7.4;
        this.collisionObjects = parts.blockers;
    }
    rotate(dx, dy) {
        this.yaw -= dx * this.sensitivity;
        this.pitch = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(this.pitch + dy * this.sensitivity, -.12, .72);
    }
    zoom(delta) {
        this.distance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(this.distance + delta * .008, 3.4, 13.5);
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
        else this.collisionDistance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].damp(this.collisionDistance, requestedDistance, 7, delta);
        this.currentDistance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].damp(this.currentDistance, this.collisionDistance, 18, delta);
        this.look.copy(this.target).add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](-Math.sin(this.yaw) * 12, 1.05, -Math.cos(this.yaw) * 12));
        this.desired.copy(this.offset).setLength(this.currentDistance).add(this.target);
        this.desired.y = Math.max(this.desired.y, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["terrainHeight"])(this.desired.x, this.desired.z) + .85);
        this.camera.position.lerp(this.desired, 1 - Math.exp(-delta * 12));
        this.camera.lookAt(this.look);
    }
    getAimPoint(out, extraTargets = []) {
        this.camera.updateMatrixWorld();
        this.raycaster.setFromCamera(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector2"](0, 0), this.camera);
        this.raycaster.near = .1;
        this.raycaster.far = 30;
        const hit = this.raycaster.intersectObjects([
            ...this.parts.blockers,
            this.parts.ground,
            ...extraTargets
        ], true)[0];
        if (hit) out.copy(hit.point);
        else this.raycaster.ray.at(30, out);
        return out;
    }
}
}),
"[project]/src/components/game/world.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createWorld",
    ()=>createWorld,
    "setWorldQuality",
    ()=>setWorldQuality,
    "terrainHeight",
    ()=>terrainHeight,
    "updateDayCycle",
    ()=>updateDayCycle,
    "updateWorld",
    ()=>updateWorld
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
;
const COLORS = [
    '#4d7356',
    '#66855e',
    '#82956a',
    '#506c64',
    '#758b58'
];
const GRASS_COLORS = [
    '#c2da98',
    '#d4d39a',
    '#b2d2a2',
    '#d3d7a1',
    '#b8d08a'
];
const temp = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Object3D"]();
function seeded(n) {
    const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
}
function terrainHeight(x, z) {
    const meadowFade = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(Math.hypot(x * .72, z + 1) - 12, 0, 24);
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
        const side = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](-tangent.z, 0, tangent.x).multiplyScalar(widths[index] / 2);
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
    const geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    geometry.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geometry, material);
}
function makeDistantRidge(z, height, color, phase) {
    const vertices = [], indices = [];
    const segments = 100;
    for(let i = 0; i <= segments; i++){
        const x = -150 + i / segments * 300;
        const peak = 5 + Math.max(0, Math.sin(x * .047 + phase) * .56 + Math.sin(x * .103 - phase * 1.7) * .28 + Math.sin(x * .021) * .16) * height;
        vertices.push(x, -8, z, x, peak, z);
        if (i < segments) {
            const n = i * 2;
            indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
        }
    }
    const geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    geometry.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const material = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color,
        roughness: 1,
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"],
        flatShading: true
    });
    const ridge = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geometry, material);
    ridge.name = 'distant-mountain-ridge';
    ridge.receiveShadow = true;
    return ridge;
}
function makeLandmark(scene) {
    const group = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    group.name = 'hero-marker';
    group.position.set(0, terrainHeight(0, -12), -12);
    const stone = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#aaa58f',
        roughness: .88
    });
    const shadowStone = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#696f66',
        roughness: .94
    });
    const gold = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#d8c38e',
        roughness: .46,
        metalness: .28,
        emissive: '#685532',
        emissiveIntensity: .18
    });
    const base = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](2.1, 2.32, .42, 12), shadowStone);
    base.position.y = .2;
    base.receiveShadow = true;
    group.add(base);
    const step = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](1.7, 1.9, .2, 12), stone);
    step.position.y = .49;
    step.castShadow = true;
    group.add(step);
    const shaft = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](1.15, 3.5, .65), stone);
    shaft.position.set(0, 2.32, 0);
    shaft.rotation.z = -.045;
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    group.add(shaft);
    const bevel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](1.42, .16, .82), shadowStone);
    bevel.position.y = 4.05;
    bevel.castShadow = true;
    group.add(bevel);
    const crown = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConeGeometry"](.82, .72, 4), stone);
    crown.position.y = 4.47;
    crown.rotation.y = Math.PI / 4;
    crown.castShadow = true;
    group.add(crown);
    const medallion = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](.31, .045, 10, 36), gold);
    medallion.position.set(0, 2.55, .36);
    group.add(medallion);
    const inset = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OctahedronGeometry"](.15, 0), gold);
    inset.position.set(0, 2.55, .42);
    group.add(inset);
    const rune = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    rune.name = 'marker-rune';
    rune.position.set(0, 2.55, .58);
    for(let i = 0; i < 5; i++){
        const fleck = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](.035, 8, 6), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color: '#f4dfaa'
        }));
        const a = i / 5 * Math.PI * 2;
        fleck.position.set(Math.cos(a) * .68, Math.sin(a) * .54, 0);
        rune.add(fleck);
    }
    group.add(rune);
    const stoneLight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PointLight"]('#d9c78e', .65, 8, 2);
    stoneLight.position.set(0, 2.8, 1.3);
    group.add(stoneLight);
    scene.add(group);
    return {
        group,
        rune
    };
}
function createWorld(scene) {
    const groundGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](260, 260, 150, 150);
    const positions = groundGeometry.attributes.position;
    for(let i = 0; i < positions.count; i++){
        const x = positions.getX(i), z = -positions.getY(i);
        positions.setZ(i, terrainHeight(x, z));
    }
    groundGeometry.computeVertexNormals();
    const groundMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#819171',
        roughness: .96,
        metalness: 0
    });
    groundMaterial.onBeforeCompile = (shader)=>{
        shader.vertexShader = `varying vec3 vMeadowPosition;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\nvMeadowPosition = (modelMatrix * vec4(position, 1.0)).xyz;');
        shader.fragmentShader = `varying vec3 vMeadowPosition;\n${shader.fragmentShader}`.replace('#include <color_fragment>', `#include <color_fragment>
      float broad = sin(vMeadowPosition.x * .19 + sin(vMeadowPosition.z * .13)) * cos(vMeadowPosition.z * .16);
      float fine = sin(vMeadowPosition.x * 2.7 + vMeadowPosition.z * 1.9) * cos(vMeadowPosition.z * 2.4 - vMeadowPosition.x * .7);
      float mineral = smoothstep(.72, .96, sin(vMeadowPosition.x * .41) * cos(vMeadowPosition.z * .37));
      diffuseColor.rgb *= 0.96 + broad * .055 + fine * .018;
      diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(.77, .79, .69), mineral * .14);`);
        groundMaterial.customProgramCacheKey = ()=>'aurora-pbr-meadow-v2';
    };
    const ground = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](groundGeometry, groundMaterial);
    ground.name = 'ground';
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const skyMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BackSide"],
        depthWrite: false,
        fog: false,
        uniforms: {
            uDaylight: {
                value: .18
            },
            uDusk: {
                value: 1
            }
        },
        vertexShader: `varying float vSkyHeight; void main(){vSkyHeight=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
        fragmentShader: `uniform float uDaylight;uniform float uDusk;varying float vSkyHeight;void main(){float h=smoothstep(-.28,.78,vSkyHeight);vec3 night=vec3(.09,.13,.2);vec3 dawn=vec3(.82,.57,.48);vec3 day=vec3(.57,.72,.79);vec3 horizon=mix(night,dawn,uDusk);horizon=mix(horizon,day,uDaylight);vec3 zenith=mix(vec3(.12,.18,.27),vec3(.39,.58,.69),uDaylight);gl_FragColor=vec4(mix(horizon,zenith,pow(h,.72)),1.0);}`
    });
    const skyDome = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](220, 40, 24), skyMaterial);
    skyDome.name = 'atmosphere-sky-dome';
    skyDome.frustumCulled = false;
    skyDome.renderOrder = -1000;
    scene.add(skyDome);
    const sunDisc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](2.7, 24, 16), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
        color: '#ffe0ad',
        fog: false
    }));
    sunDisc.name = 'soft-sun-disc';
    scene.add(sunDisc);
    scene.add(makeDistantRidge(-132, 24, '#697b78', .6), makeDistantRidge(-154, 32, '#72817f', 2.1), makeDistantRidge(-177, 39, '#7c8984', 4.3));
    const blockers = [];
    const colliders = [];
    const trunkGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](.18, .32, 1, 9, 1);
    const leafGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](1, 14, 11);
    const trunkMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#74543a',
        roughness: .94
    });
    const leafMaterials = COLORS.map((color)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            color,
            roughness: .94
        }));
    const trunkCount = 96;
    const trunks = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InstancedMesh"](trunkGeometry, trunkMaterial, trunkCount);
    trunks.castShadow = true;
    trunks.receiveShadow = true;
    trunks.name = 'forest-trunks';
    const canopies = leafMaterials.map((material, index)=>{
        const mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InstancedMesh"](leafGeometry, material, trunkCount * 6);
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
    const rockGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DodecahedronGeometry"](1, 1);
    const rockMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#838477',
        roughness: .97,
        flatShading: true
    });
    const rocks = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InstancedMesh"](rockGeometry, rockMaterial, 46);
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
    const grassGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
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
    grassGeometry.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](grassVertices, 3));
    grassGeometry.setIndex(grassIndices);
    grassGeometry.computeVertexNormals();
    const grassMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
        color: '#ffffff',
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
    });
    grassMaterial.onBeforeCompile = (shader)=>{
        shader.uniforms.uWindTime = {
            value: 0
        };
        shader.vertexShader = `uniform float uWindTime;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.x += sin(uWindTime + instanceMatrix[3].x * 0.17 + position.y * 2.0) * 0.12 * position.y;');
        grassMaterial.userData.windUniform = shader.uniforms.uWindTime;
    };
    grassMaterial.customProgramCacheKey = ()=>'aurora-grass-wind-v1';
    const grass = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InstancedMesh"](grassGeometry, grassMaterial, 2800);
    grass.name = 'wind-grass';
    grass.castShadow = false;
    grass.receiveShadow = true;
    let grassCount = 0;
    for(let i = 0; i < 2800; i++){
        const x = (seeded(1200 + i) - .5) * 44, z = (seeded(1600 + i) - .5) * 40;
        if (Math.abs(x) < 3.2 && z > -17 && z < 7 || Math.hypot(x, z + 12) < 2.8) continue;
        const scale = .62 + seeded(1900 + i) * .78;
        temp.position.set(x, terrainHeight(x, z), z);
        temp.scale.set(scale, scale, scale);
        temp.rotation.y = seeded(2200 + i) * Math.PI;
        temp.updateMatrix();
        grass.setMatrixAt(grassCount, temp.matrix);
        grass.setColorAt(grassCount, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"](GRASS_COLORS[i % GRASS_COLORS.length]));
        grassCount++;
    }
    grass.count = grassCount;
    grass.userData.maxInstances = grassCount;
    grass.instanceMatrix.needsUpdate = true;
    if (grass.instanceColor) grass.instanceColor.needsUpdate = true;
    scene.add(grass);
    const motePositions = [];
    for(let i = 0; i < 74; i++)motePositions.push((seeded(3200 + i) - .5) * 54, 1.2 + seeded(3400 + i) * 4.2, (seeded(3600 + i) - .5) * 54);
    const moteGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    moteGeometry.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](motePositions, 3));
    const moteMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PointsMaterial"]({
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
    const motes = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Points"](moteGeometry, moteMaterial);
    motes.name = 'windborne-echoes';
    scene.add(motes);
    const flowerGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](.055, 7, 6);
    const flowerMaterials = [
        '#e8d7a6',
        '#d89f98',
        '#e4e0c6'
    ].map((color)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            color
        }));
    const flowers = flowerMaterials.map((material, i)=>{
        const mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InstancedMesh"](flowerGeometry, material, 130);
        mesh.name = `meadow-blooms-${i}`;
        let count = 0;
        for(let j = 0; j < 130; j++){
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
    const pathMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#a59471',
        roughness: 1,
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
    });
    const pathPoints = [];
    const widths = [];
    for(let i = 0; i <= 30; i++){
        const t = i / 30;
        const z = 10 - t * 31;
        const x = Math.sin(t * Math.PI * 1.15) * 1.5;
        pathPoints.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](x, 0, z));
        widths.push(3.2 + Math.sin(t * Math.PI) * .45);
    }
    const path = makeRibbon(pathPoints, widths, pathMaterial);
    path.name = 'waystone-trail';
    path.receiveShadow = true;
    scene.add(path);
    const ruin = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    ruin.name = 'fallen-arch';
    ruin.position.set(-12, terrainHeight(-12, -21), -21);
    const ruinStone = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#888b7c',
        roughness: .92
    });
    const left = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](.65, 3.4, .7), ruinStone);
    left.position.set(-1.6, 1.7, 0);
    left.rotation.z = -.08;
    left.castShadow = true;
    ruin.add(left);
    const right = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](.65, 2.3, .7), ruinStone);
    right.position.set(1.6, 1.15, 0);
    right.rotation.z = .12;
    right.castShadow = true;
    ruin.add(right);
    const lintel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](4.1, .55, .8), ruinStone);
    lintel.position.set(0, 3.35, 0);
    lintel.rotation.z = .045;
    lintel.castShadow = true;
    ruin.add(lintel);
    const fallen = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](1.7, .4, .65), ruinStone);
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
        bloomMeshes: flowers,
        skyMaterial,
        sunDisc
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
const cycleSky = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]();
const cycleDawn = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#e6ac91');
const cycleDay = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#9fb9c4');
const cycleNight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#263346');
const cycleSunset = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#f6b690');
const cycleSkyColor = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#a9c4d4');
const cycleGroundDay = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#687451');
const cycleFogDay = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#a1ad99');
function updateDayCycle(scene, sun, sky, time) {
    const phase = time / 240 * Math.PI * 2;
    const sunArc = Math.sin(phase);
    const daylight = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(sunArc, -.08, .42);
    const dusk = Math.max(0, 1 - Math.abs(sunArc) * 3.2);
    sun.position.set(Math.cos(phase) * 46, 14 + sunArc * 43, Math.sin(phase * .5) * 19);
    sun.intensity = .16 + daylight * 2.72;
    sun.color.set('#fff0d9').lerp(cycleSunset, dusk * .55);
    sky.intensity = .52 + daylight * 1.45;
    sky.color.copy(cycleSkyColor).lerp(cycleDawn, dusk * .42);
    sky.groundColor.set('#26303d').lerp(cycleGroundDay, daylight * .62);
    cycleSky.copy(cycleNight).lerp(cycleDawn, Math.max(dusk, .06)).lerp(cycleDay, daylight);
    if (scene.background instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]) scene.background.copy(cycleSky);
    if (scene.fog instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FogExp2"]) scene.fog.color.copy(cycleSky).lerp(cycleFogDay, daylight * .24);
    const environment = scene.userData.environment;
    const skyUniforms = environment?.skyMaterial?.uniforms;
    if (skyUniforms) {
        skyUniforms.uDaylight.value = daylight;
        skyUniforms.uDusk.value = dusk;
    }
    const sunDisc = environment?.sunDisc;
    if (sunDisc) {
        sunDisc.position.copy(sun.position).normalize().multiplyScalar(168);
        sunDisc.visible = sunArc > -.1;
    }
    const hour = Math.floor((time / 240 * 24 + 6) % 24);
    return {
        label: `${String(hour).padStart(2, '0')}:00`,
        daylight
    };
}
}),
];})()

//# sourceMappingURL=src_components_game_1cuaus4xrh-87._.js.map