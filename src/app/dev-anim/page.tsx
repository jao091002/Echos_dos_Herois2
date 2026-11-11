'use client';
// ROTA TEMPORÁRIA de verificação visual das animações (remover antes do commit)
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CombatSystem } from '@/components/game/combat';
import { terrainHeight } from '@/components/game/world';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function DevAnim() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const kind = q.get('kind') ?? 'wolf', mode = q.get('mode') ?? 'idle', tiles = +(q.get('tiles') ?? 6), every = +(q.get('every') ?? .1);
    const view = q.get('view') ?? 'side', warm = +(q.get('warm') ?? 2), dist = +(q.get('dist') ?? (kind === 'wolf' ? 3.2 : 4.2));
    const W = 1500, H = 420;
    const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    r.setSize(W, H); r.autoClear = false; host.current!.appendChild(r.domElement);
    const scene = new THREE.Scene(); scene.background = new THREE.Color('#9fb0b4');
    scene.add(new THREE.HemisphereLight('#ffffff', '#556', 2.2));
    const sun = new THREE.DirectionalLight('#fff', 2.4); sun.position.set(3, 6, 4); scene.add(sun);
    const combat = new CombatSystem(scene) as any;
    const grid = new THREE.GridHelper(8, 32, '#334', '#667'); scene.add(grid);
    const cam = new THREE.PerspectiveCamera(30, (W / tiles) / H, .05, 100);
    let elapsed = 0;
    const player = new THREE.Vector3();
    const ready = () => combat.mobs.filter((m: any) => m.kind === kind).every((m: any) => kind === 'bandit' ? m.rig.retarget : m.rig.modelMesh || q.get('proc'));
    const timer = setInterval(() => {
      if (!ready()) return;
      clearInterval(timer);
      const mobs = combat.mobs as any[], mob = mobs.find(m => m.kind === kind);
      if (q.get('leg') && mob.rig.modelMesh) {
        const g = mob.rig.modelMesh.geometry, uv = g.attributes.uv, pos = g.attributes.position, map = mob.rig.modelMesh.material.map;
        const cv = document.createElement('canvas'); cv.width = 512; cv.height = 512; const ctx = cv.getContext('2d')!; ctx.drawImage(map.image, 0, 0, 512, 512); const px = ctx.getImageData(0, 0, 512, 512).data;
        const out: string[] = [];
        for (let y = 1.1; y > 0; y -= .06) for (const sd of [-1, 1]) {
          let sx = 0, sz = 0, n = 0, z0 = 9, z1 = -9;
          for (let k = 0; k < pos.count; k++) {
            const X = pos.getX(k) * sd, Y = pos.getY(k), Z = pos.getZ(k); if (Math.abs(Y - y) > .02 || X < 0 || X > .17 || Z < -.2 || Z > .25) continue;
            const u = uv.getX(k) - Math.floor(uv.getX(k)), v = uv.getY(k) - Math.floor(uv.getY(k)), o = (Math.floor(v * 511) * 512 + Math.floor(u * 511)) * 4;
            const r = px[o] / 255, gg = px[o + 1] / 255, b = px[o + 2] / 255;
            if (r > .05 && r > gg * 1.6 && r > b * 1.15) continue; // vestido
            sx += X; sz += Z; n++; z0 = Math.min(z0, Z); z1 = Math.max(z1, Z);
          }
          out.push(`y${y.toFixed(2)} s${sd} n${n} c(${(sx / n * sd).toFixed(3)},${(sz / n).toFixed(3)}) z[${z0.toFixed(2)},${z1.toFixed(2)}]`);
        }
        console.log(out.join('\n'));
      }
      if (q.get('arm') && mob.rig.modelMesh) {
        // eixo do braço medido pela luva (vértices escuros e pouco saturados com x > 0,2), fatia por fatia
        const g = mob.rig.modelMesh.geometry, uv = g.attributes.uv, pos = g.attributes.position, map = mob.rig.modelMesh.material.map;
        const cv = document.createElement('canvas'); cv.width = 512; cv.height = 512; const ctx = cv.getContext('2d')!; ctx.drawImage(map.image, 0, 0, 512, 512); const px = ctx.getImageData(0, 0, 512, 512).data;
        const out: string[] = [];
        for (let y = 1.66; y > .9; y -= .04) {
          let sx = 0, sz = 0, n = 0, x0 = 9, x1 = -9, z0 = 9, z1 = -9;
          for (let k = 0; k < pos.count; k++) {
            const X = pos.getX(k), Y = pos.getY(k), Z = pos.getZ(k); if (Math.abs(Y - y) > .02 || X < .2) continue;
            const u = uv.getX(k) - Math.floor(uv.getX(k)), v = uv.getY(k) - Math.floor(uv.getY(k)), o = (Math.floor(v * 511) * 512 + Math.floor(u * 511)) * 4;
            const r = px[o] / 255, gg = px[o + 1] / 255, b = px[o + 2] / 255, mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
            const glove = mx < .38 && mx - mn < .08, skin = r > .6 && gg > .5 && r - b < .25;
            if (!glove && !skin) continue;
            sx += X; sz += Z; n++; x0 = Math.min(x0, X); x1 = Math.max(x1, X); z0 = Math.min(z0, Z); z1 = Math.max(z1, Z);
          }
          out.push(`y${y.toFixed(2)} n${n} c(${(sx / n).toFixed(3)},${(sz / n).toFixed(3)}) x[${x0.toFixed(2)},${x1.toFixed(2)}] z[${z0.toFixed(2)},${z1.toFixed(2)}]`);
        }
        console.log(out.join('\n'));
      }
      if (q.get('weights') && mob.rig.modelMesh) {
        // cor = osso dominante (vermelho mão, laranja antebraço, amarelo braço, azul pelve, ciano tronco, branco cabeça, roxo pernas, verde saia)
        const g = mob.rig.modelMesh.geometry.clone(), si = g.attributes.skinIndex, sw = g.attributes.skinWeight, col = new Float32Array(si.count * 3);
        const pal = (b: number) => kind === 'demon'
          ? (b === 5 || b === 8 ? [1, 0, 0] : b === 4 || b === 7 ? [1, .5, 0] : b === 3 || b === 6 ? [1, 1, 0] : b === 0 ? [0, 0, 1] : b === 1 ? [0, 1, 1] : b === 2 ? [1, 1, 1] : b >= 15 ? [0, .8, 0] : [.6, 0, .8])
          : (b === 0 ? [0, 0, 1] : b === 1 ? [0, 1, 1] : b === 2 ? [1, 1, 0] : b === 3 ? [1, 1, 1] : b === 4 ? [1, 0, 0] : b <= 7 ? [0, .8, 0] : [(b % 3) / 2, 0, .8]);
        for (let k = 0; k < si.count; k++) { let best = 0, bw = -1; for (let j = 0; j < 4; j++) if (sw.getComponent(k, j) > bw) { bw = sw.getComponent(k, j); best = si.getComponent(k, j); } const c = pal(best); col.set(c, k * 3); }
        g.setAttribute('color', new THREE.BufferAttribute(col, 3));
        mob.rig.modelMesh.geometry = g; mob.rig.modelMesh.material = new THREE.MeshLambertMaterial({ vertexColors: true });
      }
      for (const m of mobs) if (m !== mob) { m.health = 0; m.respawnTimer = 1e9; m.deathAge = 10; m.root.visible = false; }
      const dt = 1 / 60, step = (t: number) => {
        elapsed += dt;
        const p = mob.root.position, yaw = mob.root.rotation.y, fx = Math.sin(yaw), fz = Math.cos(yaw);
        if (mode === 'idle') { player.set(p.x + fx * 40, p.y, p.z + fz * 40); }
        else if (mode === 'chase') { player.set(p.x + fx * 14, p.y, p.z + fz * 14); mob.attackTimer = 5; }
        else if (mode === 'trot') { player.set(p.x + fx * 4.4, p.y, p.z + fz * 4.4); mob.attackTimer = 5; mob.strafeTimer = 5; }
        else if (mode === 'walk') { player.set(p.x + fx * 6, p.y, p.z + fz * 6); mob.attackTimer = 5; }
        else if (mode === 'attack') { if (t < .05) player.set(p.x + fx * 1.3, p.y, p.z + fz * 1.3); if (mob.attack == null && t > warm - .3) mob.attackTimer = 0; else if (t < warm - .3) mob.attackTimer = 5; }
        else if (mode === 'death') { player.set(p.x + fx * 40, p.y, p.z + fz * 40); if (Math.abs(t - warm) < dt / 2 && mob.health > 0) combat.applyHit(mob, new THREE.Vector3(p.x + fz * 1, p.y + .8, p.z - fx * 1), 99999, 1); }
        else if (mode === 'hit') { player.set(p.x + fx * 40, p.y, p.z + fz * 40); if (Math.abs(t - warm) < dt / 2) combat.applyHit(mob, new THREE.Vector3(p.x + fz * 1, p.y + .8, p.z - fx * 1), 20, 1); }
        if (mode === 'idle') mob.aggro = false;
        combat.health = 100;
        combat.update(dt, elapsed, player, () => false);
      };
      let t = 0;
      while (t < warm) { step(t); t += dt; }
      for (let i = 0; i < tiles; i++) {
        const target = warm + i * every;
        while (t < target) { step(t); t += dt; }
        const p = mob.root.position, yaw = mob.root.rotation.y;
        grid.position.set(p.x, terrainHeight(p.x, p.z) + .002, p.z);
        const side = view === 'side' ? 1 : 0, front = view === 'front' ? 1 : view === 'three' ? .7 : 0;
        const rx = Math.cos(yaw), rz = -Math.sin(yaw), fx = Math.sin(yaw), fz = Math.cos(yaw);
        const h = q.get('h') ? +q.get('h')! : kind === 'wolf' ? .55 : 1.15;
        cam.position.set(p.x + (rx * side + fx * front + (view === 'three' ? rx * .7 : 0)) * dist, p.y + h + .25, p.z + (rz * side + fz * front + (view === 'three' ? rz * .7 : 0)) * dist);
        cam.lookAt(p.x, p.y + h, p.z);
        if (q.get('dbgc') && i === 0) {
          // amostras de cor dos vértices presos às mãos (para afinar a separação luva × vestido)
          const g = mob.rig.modelMesh.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, uv = g.attributes.uv, pos = g.attributes.position;
          const map = mob.rig.modelMesh.material.map, cv = document.createElement('canvas'); cv.width = 256; cv.height = 256;
          const ctx = cv.getContext('2d')!; ctx.drawImage(map.image, 0, 0, 256, 256); const px = ctx.getImageData(0, 0, 256, 256).data;
          const hist = new Map<string, number>(); let n = 0;
          for (let k = 0; k < si.count; k++) {
            let hw = 0; for (let j = 0; j < 4; j++) { const b = si.getComponent(k, j); if (b === 4 || b === 5 || b === 7 || b === 8) hw += sw.getComponent(k, j); }
            if (hw < .2 || pos.getY(k) > 1.3) continue; n++;
            const u = uv.getX(k) - Math.floor(uv.getX(k)), v = uv.getY(k) - Math.floor(uv.getY(k)), o = (Math.floor(v * 255) * 256 + Math.floor(u * 255)) * 4;
            const key = `${(px[o] / 255).toFixed(1)},${(px[o + 1] / 255).toFixed(1)},${(px[o + 2] / 255).toFixed(1)}`; hist.set(key, (hist.get(key) ?? 0) + 1);
          }
          console.log('hand verts', n, [...hist.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14).map(e => e.join(':')).join('  '));
        }
        if (q.get('dbg')) {
          const v = new THREE.Vector3(), f = (o: THREE.Object3D) => { o.getWorldPosition(v); mob.root.worldToLocal(v); return `${v.x.toFixed(2)},${v.y.toFixed(2)},${v.z.toFixed(2)}`; };
          const leg = mob.rig.legs[0];
          console.log(`tile ${i} speed ${mob.speed.toFixed(2)} pelvis ${f(mob.rig.pelvis)} hip ${f(leg.hip)} knee ${f(leg.knee)} ankle ${f(leg.ankle)} hy ${leg.hy.toFixed(2)} hz ${leg.hz.toFixed(2)} l ${leg.l1},${leg.l2} footY ${leg.footY} footZ ${leg.footZ} rotx ${leg.hip.rotation.x.toFixed(2)} ${leg.knee.rotation.x.toFixed(2)}`);
        }
        const w = W / tiles; r.setViewport(i * w, 0, w, H); r.setScissor(i * w, 0, w, H); r.setScissorTest(true);
        r.clear(); r.render(scene, cam);
      }
      document.title = 'done';
    }, 100);
    return () => { clearInterval(timer); r.dispose(); r.domElement.remove(); combat.dispose(); };
  }, []);
  return <div ref={host} />;
}
