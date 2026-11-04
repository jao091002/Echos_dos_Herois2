(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/game/Game.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Game
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function makeTree(scene, x, z, scale, variant) {
    const group = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    group.position.set(x, 0, z);
    group.scale.setScalar(scale);
    const trunk = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](.2, .34, 3.3, 7), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#72533b',
        roughness: 1
    }));
    trunk.position.y = 1.65;
    group.add(trunk);
    const colors = [
        '#527354',
        '#66815d',
        '#879064',
        '#516961'
    ];
    for(let i = 0; i < 3; i++){
        const crown = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IcosahedronGeometry"](1.35 - i * .19, 1), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            color: colors[(variant + i) % colors.length],
            roughness: .94,
            flatShading: true
        }));
        crown.position.set(i % 2 ? .3 : -.25, 3.1 + i * .67, (i - 1) * .13);
        crown.scale.set(1.05, 1.05, .94);
        crown.castShadow = true;
        group.add(crown);
    }
    scene.add(group);
}
function makeRock(scene, x, z, scale, color = '#777d71') {
    const rock = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DodecahedronGeometry"](scale, 0), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color,
        roughness: .92,
        flatShading: true
    }));
    rock.position.set(x, scale * .47, z);
    rock.rotation.set(.2, Math.random() * 2, .16);
    rock.scale.y = .65;
    rock.castShadow = true;
    rock.receiveShadow = true;
    scene.add(rock);
}
function makeFlower(scene, x, z, color) {
    const stem = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](.018, .028, .28, 5), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#718b58'
    }));
    stem.position.set(x, .14, z);
    const bloom = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.075, 7, 6), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
        color
    }));
    bloom.position.set(x, .31, z);
    scene.add(stem, bloom);
}
function buildWorld(scene) {
    const ground = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](360, 360, 90, 90), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#7b896a',
        roughness: 1
    }));
    ground.name = 'ground';
    ground.rotation.x = -Math.PI / 2;
    const pos = ground.geometry.attributes.position;
    for(let i = 0; i < pos.count; i++){
        const x = pos.getX(i), y = pos.getY(i);
        const hill = Math.max(0, Math.sin(x * .036 + 1.2) * Math.cos(y * .029) + Math.sin(y * .052) * .28);
        pos.setZ(i, hill * 3.2 + Math.sin(x * .09) * Math.cos(y * .07) * .26);
    }
    ground.geometry.computeVertexNormals();
    ground.receiveShadow = true;
    scene.add(ground);
    // The central meadow stays open for traversal; tree clusters create natural edges and sightlines.
    const rng = (n)=>{
        const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
        return v - Math.floor(v);
    };
    for(let i = 0; i < 148; i++){
        const angle = rng(i + 3) * Math.PI * 2;
        const radius = 17 + rng(i + 90) * 54;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        if (Math.abs(x) < 13 && Math.abs(z) < 15) continue;
        makeTree(scene, x, z, .72 + rng(i + 14) * .72, i % 4);
    }
    for(let i = 0; i < 58; i++){
        const x = (rng(i + 200) - .5) * 95, z = (rng(i + 340) - .5) * 92;
        makeRock(scene, x, z, .32 + rng(i + 470) * .95, i % 3 === 0 ? '#817f73' : '#6d796b');
    }
    for(let i = 0; i < 175; i++){
        const x = (rng(i + 880) - .5) * 32, z = (rng(i + 970) - .5) * 28;
        if (Math.abs(x) > 5 || Math.abs(z) > 4) makeFlower(scene, x, z, i % 5 ? '#e2c99a' : '#d6a7a0');
    }
    // A quiet, ancient waystone: a readable landmark and a promise of the world beyond.
    const stone = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    stone.position.set(0, 0, -11);
    const pillar = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](1.35, 3.7, .85), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#9a9781',
        roughness: .85
    }));
    pillar.position.y = 1.85;
    pillar.rotation.z = -.045;
    pillar.castShadow = true;
    const cap = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](1.04, .76, 4), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#777a6d',
        roughness: 1
    }));
    cap.position.y = 4.03;
    cap.rotation.y = Math.PI / 4;
    const glyph = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](.25, .035, 8, 24), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
        color: '#dbc990'
    }));
    glyph.position.set(0, 2.45, .45);
    stone.add(pillar, cap, glyph);
    scene.add(stone);
    const path = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](5.3, 25), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#9b8b6c',
        roughness: 1
    }));
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, .025, 2);
    scene.add(path);
}
function buildHero(scene) {
    const hero = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    const body = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    hero.add(body);
    const cloth = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#536b71',
        roughness: .8,
        flatShading: true
    });
    const pale = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#d6c9a9',
        roughness: .9
    });
    const dark = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#393e42',
        roughness: .86
    });
    const skin = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#e6c5a8',
        roughness: .8
    });
    const torso = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.4, .67, 4, 8), cloth);
    torso.position.y = 1.35;
    torso.castShadow = true;
    body.add(torso);
    const coat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](.63, 1.1, 7, 1, true), pale);
    coat.position.set(0, .91, 0);
    coat.rotation.x = Math.PI;
    coat.castShadow = true;
    body.add(coat);
    const head = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.31, 12, 10), skin);
    head.position.y = 2.12;
    head.castShadow = true;
    body.add(head);
    const hair = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.34, 10, 8, 0, Math.PI * 2, 0, Math.PI * .63), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#c3c5b7',
        roughness: .8
    }));
    hair.position.set(0, 2.23, -.035);
    body.add(hair);
    const hat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](.57, .82, 9), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#6a6558',
        roughness: .85
    }));
    hat.position.y = 2.75;
    hat.rotation.z = -.08;
    hat.castShadow = true;
    body.add(hat);
    const brim = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](.55, .55, .08, 12), dark);
    brim.position.y = 2.42;
    body.add(brim);
    const legs = [];
    const arms = [];
    for (const side of [
        -1,
        1
    ]){
        const leg = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.13, .52, 3, 6), dark);
        leg.position.set(side * .19, .43, 0);
        leg.castShadow = true;
        body.add(leg);
        legs.push(leg);
        const arm = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CapsuleGeometry"](.105, .51, 3, 6), cloth);
        arm.position.set(side * .48, 1.38, 0);
        arm.castShadow = true;
        body.add(arm);
        arms.push(arm);
    }
    const staff = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](.035, .055, 2.25, 7), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: '#755c43',
        roughness: .9
    }));
    staff.position.set(.66, 1.02, .05);
    staff.rotation.z = -.045;
    body.add(staff);
    const orb = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IcosahedronGeometry"](.15, 1), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
        color: '#e4d6a8'
    }));
    orb.position.set(.66, 2.2, .05);
    body.add(orb);
    const aura = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"]('#d6c99a', 1.1, 4);
    aura.position.copy(orb.position);
    body.add(aura);
    hero.userData = {
        body,
        legs,
        arms,
        orb
    };
    hero.position.set(0, 0, 2);
    scene.add(hero);
    return hero;
}
function Game() {
    _s();
    const hostRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        area: 'Campos da Aurora',
        discovered: 0
    });
    const [hint, setHint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [nearLandmark, setNearLandmark] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [muted, setMuted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [help, setHelp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [questOpen, setQuestOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const uiOpenRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    uiOpenRef.current = help || questOpen;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Game.useEffect": ()=>{
            const host = hostRef.current;
            if (!host) return;
            const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"]();
            scene.background = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#9ba998');
            scene.fog = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FogExp2"]('#a7ad97', .0095);
            const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"](48, 1, .1, 600);
            const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
                antialias: true,
                powerPreference: 'high-performance'
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PCFSoftShadowMap"];
            renderer.outputColorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
            renderer.toneMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACESFilmicToneMapping"];
            renderer.toneMappingExposure = 1.08;
            host.appendChild(renderer.domElement);
            scene.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HemisphereLight"]('#e6e9d9', '#525b4c', 2.1));
            const sun = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"]('#ffedc9', 2.8);
            sun.position.set(-34, 52, 24);
            sun.castShadow = true;
            sun.shadow.mapSize.set(1536, 1536);
            sun.shadow.camera.left = -65;
            sun.shadow.camera.right = 65;
            sun.shadow.camera.top = 65;
            sun.shadow.camera.bottom = -65;
            scene.add(sun);
            const fill = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"]('#c3d1db', .75);
            fill.position.set(25, 20, -35);
            scene.add(fill);
            buildWorld(scene);
            const hero = buildHero(scene);
            const ground = scene.getObjectByName('ground');
            const raycaster = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Raycaster"]();
            let velocityY = 0;
            let isGrounded = false;
            const GRAVITY = -30;
            const JUMP_SPEED = 10;
            const keys = new Set();
            let yaw = 0, pitch = .17, dragging = false, previousX = 0, previousY = 0, elapsed = 0, discovered = false, isNearLandmark = false, cameraDistance = 9.5;
            const target = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 1.2, 0);
            const cameraOffset = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
            const clock = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Clock"]();
            let hintTimer;
            const showHint = {
                "Game.useEffect.showHint": (message)=>{
                    setHint(message);
                    if (hintTimer) clearTimeout(hintTimer);
                    hintTimer = setTimeout({
                        "Game.useEffect.showHint": ()=>setHint('')
                    }["Game.useEffect.showHint"], 3600);
                }
            }["Game.useEffect.showHint"];
            const onKeyDown = {
                "Game.useEffect.onKeyDown": (e)=>{
                    const k = e.key.toLowerCase();
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
                        'e'
                    ].includes(k)) e.preventDefault();
                    if (e.repeat && [
                        'h',
                        'j',
                        'e',
                        ' '
                    ].includes(k)) return;
                    keys.add(k);
                    if (k === 'h') setHelp({
                        "Game.useEffect.onKeyDown": (v)=>!v
                    }["Game.useEffect.onKeyDown"]);
                    if (k === 'j') setQuestOpen({
                        "Game.useEffect.onKeyDown": (v)=>!v
                    }["Game.useEffect.onKeyDown"]);
                    if (k === 'e' && isNearLandmark) {
                        if (!discovered) {
                            discovered = true;
                            setStatus({
                                area: 'Campos da Aurora',
                                discovered: 1
                            });
                            showHint('Voc\u00ea recordou o marco antigo.');
                        } else {
                            showHint('A pedra guarda um nome que o tempo j\u00e1 esqueceu.');
                        }
                    }
                    if (k === 'escape' && document.pointerLockElement === renderer.domElement) document.exitPointerLock();
                }
            }["Game.useEffect.onKeyDown"];
            const onKeyUp = {
                "Game.useEffect.onKeyUp": (e)=>keys.delete(e.key.toLowerCase())
            }["Game.useEffect.onKeyUp"];
            const onBlur = {
                "Game.useEffect.onBlur": ()=>keys.clear()
            }["Game.useEffect.onBlur"];
            const onMouseDown = {
                "Game.useEffect.onMouseDown": (e)=>{
                    if (e.button === 0) {
                        renderer.domElement.requestPointerLock();
                        dragging = true;
                        previousX = e.clientX;
                        previousY = e.clientY;
                    }
                }
            }["Game.useEffect.onMouseDown"];
            const onMouseMove = {
                "Game.useEffect.onMouseMove": (e)=>{
                    if (!dragging) return;
                    const dx = document.pointerLockElement === renderer.domElement ? e.movementX : e.clientX - previousX;
                    const dy = document.pointerLockElement === renderer.domElement ? e.movementY : e.clientY - previousY;
                    yaw -= dx * .004;
                    pitch = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(pitch + dy * .002, -.08, .7);
                    previousX = e.clientX;
                    previousY = e.clientY;
                }
            }["Game.useEffect.onMouseMove"];
            const onPointerLockChange = {
                "Game.useEffect.onPointerLockChange": ()=>{
                    dragging = document.pointerLockElement === renderer.domElement;
                }
            }["Game.useEffect.onPointerLockChange"];
            const onWheel = {
                "Game.useEffect.onWheel": (e)=>{
                    cameraDistance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(cameraDistance + e.deltaY * .008, 5, 15);
                }
            }["Game.useEffect.onWheel"];
            const onContextMenu = {
                "Game.useEffect.onContextMenu": (e)=>e.preventDefault()
            }["Game.useEffect.onContextMenu"];
            const onMouseUp = {
                "Game.useEffect.onMouseUp": ()=>dragging = false
            }["Game.useEffect.onMouseUp"];
            const onResize = {
                "Game.useEffect.onResize": ()=>{
                    const w = host.clientWidth, h = host.clientHeight;
                    if (!w || !h) return;
                    renderer.setSize(w, h, false);
                    camera.aspect = w / h;
                    camera.updateProjectionMatrix();
                }
            }["Game.useEffect.onResize"];
            onResize();
            window.addEventListener('resize', onResize);
            window.addEventListener('keydown', onKeyDown);
            window.addEventListener('keyup', onKeyUp);
            window.addEventListener('blur', onBlur);
            renderer.domElement.addEventListener('mousedown', onMouseDown);
            renderer.domElement.addEventListener('wheel', onWheel, {
                passive: true
            });
            renderer.domElement.addEventListener('contextmenu', onContextMenu);
            document.addEventListener('pointerlockchange', onPointerLockChange);
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            let frame = 0;
            const animate = {
                "Game.useEffect.animate": ()=>{
                    frame = requestAnimationFrame(animate);
                    const dt = Math.min(clock.getDelta(), .05);
                    elapsed += dt;
                    // Input handling
                    const forward = uiOpenRef.current ? 0 : (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0);
                    const side = uiOpenRef.current ? 0 : (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0);
                    const moving = forward !== 0 || side !== 0;
                    // Horizontal movement
                    if (moving) {
                        const direction = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](Math.sin(yaw), 0, Math.cos(yaw));
                        const right = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](direction.z, 0, -direction.x);
                        const move = direction.multiplyScalar(forward).add(right.multiplyScalar(side)).normalize();
                        const sprint = keys.has('shift') ? 1.72 : 1;
                        hero.position.addScaledVector(move, dt * 5 * sprint);
                        hero.position.x = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(hero.position.x, -105, 105);
                        hero.position.z = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(hero.position.z, -105, 105);
                        hero.rotation.y = Math.atan2(move.x, move.z);
                    }
                    // Jump handling
                    if (!uiOpenRef.current && keys.has(' ') && isGrounded) {
                        velocityY = JUMP_SPEED;
                        isGrounded = false;
                    }
                    // Gravity
                    velocityY += GRAVITY * dt;
                    hero.position.y += velocityY * dt;
                    // Ground raycast (ignore hero)
                    raycaster.set(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](hero.position.x, 50, hero.position.z), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, -1, 0));
                    const hits = raycaster.intersectObject(ground, false);
                    if (hits.length > 0) {
                        const groundY = hits[0].point.y;
                        if (hero.position.y < groundY) {
                            hero.position.y = groundY;
                            velocityY = 0;
                            isGrounded = true;
                        }
                    }
                    // Hero animation
                    const { body, legs, arms, orb } = hero.userData;
                    const stride = moving ? Math.sin(elapsed * (keys.has('shift') ? 15 : 10)) : 0;
                    body.position.y = moving ? Math.abs(Math.sin(elapsed * 10)) * .055 : Math.sin(elapsed * 1.45) * .018;
                    legs[0].rotation.x = stride * .48;
                    legs[1].rotation.x = -stride * .48;
                    arms[0].rotation.x = -stride * .25;
                    arms[1].rotation.x = stride * .25;
                    orb.scale.setScalar(.9 + Math.sin(elapsed * 1.8) * .08);
                    // Landmark handling
                    const dist = hero.position.distanceTo(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, -11));
                    const isNear = dist < 5;
                    if (isNear !== isNearLandmark) {
                        isNearLandmark = isNear;
                        setNearLandmark(isNear);
                    }
                    // Camera positioning with obstacle avoidance
                    target.set(hero.position.x, hero.position.y + 1.25, hero.position.z);
                    cameraOffset.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch) + .25, Math.cos(yaw) * Math.cos(pitch)).multiplyScalar(cameraDistance);
                    const desiredPos = target.clone().add(cameraOffset);
                    raycaster.set(target, cameraOffset.clone().normalize());
                    const camHits = raycaster.intersectObjects(scene.children, true).filter({
                        "Game.useEffect.animate.camHits": (hit)=>hit.object !== hero && hit.object !== ground
                    }["Game.useEffect.animate.camHits"]);
                    if (camHits.length > 0 && camHits[0].distance < cameraOffset.length()) {
                        const safeDist = Math.max(2.5, camHits[0].distance - 0.3);
                        camera.position.copy(target.clone().add(cameraOffset.clone().setLength(safeDist)));
                    } else {
                        camera.position.lerp(desiredPos, 1 - Math.pow(.001, dt));
                    }
                    camera.lookAt(target);
                    renderer.render(scene, camera);
                }
            }["Game.useEffect.animate"];
            animate();
            return ({
                "Game.useEffect": ()=>{
                    cancelAnimationFrame(frame);
                    if (hintTimer) clearTimeout(hintTimer);
                    window.removeEventListener('resize', onResize);
                    window.removeEventListener('keydown', onKeyDown);
                    window.removeEventListener('keyup', onKeyUp);
                    window.removeEventListener('blur', onBlur);
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('mouseup', onMouseUp);
                    document.removeEventListener('pointerlockchange', onPointerLockChange);
                    renderer.domElement.removeEventListener('mousedown', onMouseDown);
                    renderer.domElement.removeEventListener('wheel', onWheel);
                    renderer.domElement.removeEventListener('contextmenu', onContextMenu);
                    if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
                    renderer.dispose();
                    scene.traverse({
                        "Game.useEffect": (obj)=>{
                            if (obj instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"]) {
                                obj.geometry.dispose();
                                const mats = Array.isArray(obj.material) ? obj.material : [
                                    obj.material
                                ];
                                mats.forEach({
                                    "Game.useEffect": (m)=>m.dispose()
                                }["Game.useEffect"]);
                            }
                        }
                    }["Game.useEffect"]);
                    host.removeChild(renderer.domElement);
                }
            })["Game.useEffect"];
        }
    }["Game.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "game-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scene",
                ref: hostRef,
                "aria-label": "Mundo 3D explorável dos Campos da Aurora"
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 311,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "vignette"
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 312,
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
                                children: "✧"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 314,
                                columnNumber: 30
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "eyebrow",
                                        children: "UM MUNDO DEPOIS DO FIM"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 314,
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
                                                lineNumber: 314,
                                                columnNumber: 156
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 314,
                                        columnNumber: 123
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 314,
                                columnNumber: 65
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 314,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "region",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "region-dot"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 315,
                                columnNumber: 31
                            }, this),
                            status.area,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "region-sub",
                                children: "Oeste · Terras de Avel"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 315,
                                columnNumber: 75
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 315,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "top-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "icon-button",
                                onClick: ()=>setMuted((v)=>!v),
                                "aria-label": muted ? 'Ativar som' : 'Silenciar',
                                title: muted ? 'Ativar som' : 'Silenciar',
                                children: muted ? '◖' : '♫'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 316,
                                columnNumber: 36
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "icon-button",
                                onClick: ()=>setHelp((v)=>!v),
                                "aria-label": "Ajuda",
                                title: "Controles",
                                children: "?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 316,
                                columnNumber: 221
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 316,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 313,
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
                                lineNumber: 318,
                                columnNumber: 67
                            }, this),
                            " MEMÓRIA ESQUECIDA"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 318,
                        columnNumber: 37
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "O que permanece"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 318,
                        columnNumber: 127
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Encontre o antigo marco no coração do campo."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 318,
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
                            lineNumber: 318,
                            columnNumber: 234
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 318,
                        columnNumber: 202
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "quest-count",
                        children: [
                            status.discovered ? '1' : '0',
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "/ 1 marco descoberto"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 318,
                                columnNumber: 358
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 318,
                        columnNumber: 297
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 318,
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
                                lineNumber: 319,
                                columnNumber: 60
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "compass-needle",
                                children: "◆"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 319,
                                columnNumber: 96
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "compass-pin",
                                children: "✦"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 319,
                                columnNumber: 137
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "compass-s",
                                children: "S"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 319,
                                columnNumber: 175
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 319,
                        columnNumber: 30
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "compass-label",
                        children: "CAMPOS DA AURORA"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 319,
                        columnNumber: 217
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 319,
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
                            lineNumber: 320,
                            columnNumber: 63
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "player-meta",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Viajante"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 320,
                                    columnNumber: 125
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Errante das Terras de Avel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 320,
                                    columnNumber: 150
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 320,
                            columnNumber: 96
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "level",
                            children: "✦"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 320,
                            columnNumber: 195
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/Game.tsx",
                    lineNumber: 320,
                    columnNumber: 34
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 320,
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
                                lineNumber: 321,
                                columnNumber: 82
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Recordar o marco"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 321,
                                columnNumber: 115
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 321,
                        columnNumber: 53
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hotbar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hotkey",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot",
                                        children: "J"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 321,
                                        columnNumber: 199
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot-label",
                                        children: "Jornada"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 321,
                                        columnNumber: 230
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 321,
                                columnNumber: 175
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hotkey",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot",
                                        children: "H"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 321,
                                        columnNumber: 303
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "slot-label",
                                        children: "Ajuda"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/Game.tsx",
                                        lineNumber: 321,
                                        columnNumber: 334
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/Game.tsx",
                                lineNumber: 321,
                                columnNumber: 279
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 321,
                        columnNumber: 151
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 321,
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
                                lineNumber: 322,
                                columnNumber: 63
                            }, this),
                            " AMANHECER"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 322,
                        columnNumber: 35
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "weather",
                        children: "PRÓLOGO · CAMPOS DA AURORA"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 322,
                        columnNumber: 93
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 322,
                columnNumber: 5
            }, this),
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "toast",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "✧"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 323,
                        columnNumber: 37
                    }, this),
                    hint
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 323,
                columnNumber: 14
            }, this),
            help && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-backdrop",
                onClick: ()=>setHelp(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "modal-close",
                            onClick: ()=>setHelp(false),
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 324,
                            columnNumber: 135
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "modal-kicker",
                            children: "CAMINHOS DO VIAJANTE"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 324,
                            columnNumber: 208
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "Um passo de cada vez."
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 324,
                            columnNumber: 266
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Os caminhos ainda estão quietos. Explore o campo e encontre as memórias que resistiram ao tempo."
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 324,
                            columnNumber: 296
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
                                            lineNumber: 324,
                                            columnNumber: 435
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                            children: "A"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 324,
                                            columnNumber: 447
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                            children: "S"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 324,
                                            columnNumber: 459
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                            children: "D"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 324,
                                            columnNumber: 471
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Mover"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 324,
                                            columnNumber: 483
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 324,
                                    columnNumber: 430
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                            children: "Mouse"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 324,
                                            columnNumber: 512
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Olhar ao redor"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 324,
                                            columnNumber: 528
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 324,
                                    columnNumber: 507
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                            children: "Shift"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 324,
                                            columnNumber: 566
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Correr"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 324,
                                            columnNumber: 582
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 324,
                                    columnNumber: 561
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                            children: "E"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 324,
                                            columnNumber: 612
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Recordar junto ao marco"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 324,
                                            columnNumber: 624
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 324,
                                    columnNumber: 607
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                            children: "J"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 324,
                                            columnNumber: 671
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Jornada"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 324,
                                            columnNumber: 683
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 324,
                                    columnNumber: 666
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                            children: "H"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 324,
                                            columnNumber: 714
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Controles"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/Game.tsx",
                                            lineNumber: 324,
                                            columnNumber: 726
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 324,
                                    columnNumber: 709
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 324,
                            columnNumber: 399
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "continue",
                            onClick: ()=>setHelp(false),
                            children: [
                                "CONTINUAR A JORNADA ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "→"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 324,
                                    columnNumber: 840
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 324,
                            columnNumber: 760
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/Game.tsx",
                    lineNumber: 324,
                    columnNumber: 77
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 324,
                columnNumber: 14
            }, this),
            questOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-backdrop",
                onClick: ()=>setQuestOpen(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal quest-modal",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "modal-close",
                            onClick: ()=>setQuestOpen(false),
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 325,
                            columnNumber: 157
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "modal-kicker",
                            children: "DIÁRIO DE VIAGEM · 01"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 325,
                            columnNumber: 235
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "O que permanece"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 325,
                            columnNumber: 294
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Quase mil anos se passaram desde a queda de Valkhor. A relva tomou os velhos caminhos, e os nomes dos heróis já não são lembrados."
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 325,
                            columnNumber: 318
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Um marco de pedra repousa ao norte, coberto de musgo. Talvez ainda guarde uma lembrança."
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 325,
                            columnNumber: 455
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "quest-objective",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "✦"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Game.tsx",
                                    lineNumber: 325,
                                    columnNumber: 583
                                }, this),
                                status.discovered ? 'Marco antigo descoberto' : 'Encontre o antigo marco'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/Game.tsx",
                            lineNumber: 325,
                            columnNumber: 550
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/Game.tsx",
                    lineNumber: 325,
                    columnNumber: 87
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 325,
                columnNumber: 19
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "build-stamp",
                children: [
                    "PRÓLOGO ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "·"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Game.tsx",
                        lineNumber: 326,
                        columnNumber: 42
                    }, this),
                    " VERSÃO 0.1"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Game.tsx",
                lineNumber: 326,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/Game.tsx",
        lineNumber: 310,
        columnNumber: 10
    }, this);
}
_s(Game, "5S8piv11w+3M2SqR/Q8M2i+tGDQ=");
_c = Game;
var _c;
__turbopack_context__.k.register(_c, "Game");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_game_Game_tsx_19x04e-nq0y93._.js.map