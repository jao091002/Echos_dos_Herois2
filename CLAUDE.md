# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Ecos da Era dos Heróis" is a browser-based 3D fantasy action RPG built with Next.js 16 (App Router), React 19 and Three.js 0.177. All UI text, identifiers in data tables and code comments are in **Brazilian Portuguese**. Keep new UI strings and comments in Portuguese.

See [AGENTS.md](AGENTS.md): this Next.js version has breaking changes compared with older releases. Read the relevant guide in `node_modules/next/dist/docs/` before touching Next-specific code (routing, metadata, config).

## Commands

- `npm run dev`: dev server
- `npm run build`: production build (also runs type checking)
- `npm run server`: multiplayer relay server (`server/relay.mjs`, WebSocket, port 3210 or `PORT`)
- `npx tsc --noEmit`: type check only

The project has no linter and no test suite.

## Architecture

The Next.js layer is thin. `src/app/page.tsx` renders only `<Game />`. All of the game lives in `src/components/game/`.

**`Game.tsx` is the orchestrator.** One large `useEffect` builds the renderer, scene, lights, an `EffectComposer` (bloom), the world and every subsystem. It runs the `requestAnimationFrame` loop and tears everything down on unmount (it disposes all geometries, materials and textures found in the scene, plus `scene.userData.gameTextures`). The rest of the component is the React HUD and menus (title, pause, inventory, skill tree, journal), styled by `src/app/game-ui.css`.

The game loop and React are bridged by refs, not by state:
- React state is mirrored into refs every render (`uiOpenRef`, `titleRef`, `qualityRef`, `modalFlagsRef`…) so the loop reads current values without re-subscribing.
- Actions triggered from the UI (cast, attack, dodge, interact) are exposed by the effect as callback refs (`castAbilityRef`, `zoltraakRef`, `attackRef`…). These are reset to no-ops on cleanup.
- Per-frame HUD elements (reticle, charge bar, compass, FPS, shield bar) are mutated directly through DOM refs. The React HUD (`combatHud`, `progressionHud`) is updated about every 0.12 s, and only when a `JSON.stringify` key changes.
- The loop has two modes: the title screen (a camera orbits the landmark while the world keeps simulating) and gameplay.

**Subsystems** (plain TS classes or factories that take the `THREE.Scene`):
- `world.ts` + `world-props.ts`: procedural terrain, path, stream, pond, clearings, props and the day/night cycle. `terrainHeight(x, z)` is the shared ground query used by every other module. `TIME` is a shared shader uniform. `patch()` injects wind sway and fade into materials. Colliders are circles (`WorldCollider`), and `blockers` are meshes used for line-of-sight and camera collision.
- `simulation.ts`: `PlayerMotor` (movement, jump, flight, collision) and `ThirdPersonCamera` (orbit, shift lock, aim).
- `hero.ts`: `createHero()` returns a procedural rig with poses (`HeroPose`). `attachBody()` later fits a skinned GLB onto it.
- `combat.ts`: `CombatSystem` handles mobs (wolf, bandit, demon), AI, player health and loot drops. It reports XP and loot through callbacks passed in from `Game.tsx`.
- `magic.ts`: `MagicSystem` handles the spells (`zoltraak` charge beam, `vollzanbel`, `judradjim`, `shield`, `flight`), mana and cooldowns. It hits mobs through `CombatSystem` and scales its effects with `PlayerProgression`.
- `progression.ts`: XP and levels, the inventory, and the skill tree data (`SKILL_NODES` and branches) that drives stats.
- `audio.ts`: `AmbientAudio`, procedural Web Audio ambience and `sfx(name)`.
- `rig-retarget.ts`: retargets Mixamo or Biped skeletons onto the procedural joint rigs. It also adds a loader plugin for legacy spec-gloss glTF materials (Sketchfab exports).

**Models (`public/models/*.glb`) are optional enhancements.** Every model is loaded asynchronously and falls back to procedural geometry when it is missing or fails to load. The hero is the plain `Xbot.glb` (`attachBody(gltf, { plain: true })`, colors from the character creator), falling back to the procedural body. Classes (Maga, Guerreiro, Clérigo) live in `classes.ts`: weapon, base health/resist, basic attack and the 5-slot ability bar (Q, 1, 2, F, R); their abilities are `SpellId`s in `magic.ts`. Wolves use `wolf.glb`, demons `aura.glb` (decimated on load) and bandits `perso.glb` (retargeted). Keep this fallback pattern and check the `disposed` flag in load callbacks.

**Multiplayer and save:**
- `server/relay.mjs` is a dumb room relay (max 4 per room, stamps `from`). The first player in a room is the host. It has its own `server/package.json` and `Dockerfile`, plus `render.yaml` at the root, so it can be deployed on its own. Vercel can't host it because it has no persistent WebSockets. It serves `GET /health` and `GET /rooms` (public rooms), and reads the env vars `PORT`, `ALLOWED_ORIGINS` and `MAX_CONNECTIONS`.
- The game's official server comes from `NEXT_PUBLIC_MP_SERVER` (a `wss://` URL, set in Vercel). Without it, the default is `ws://<host>:3210`.
- `net.ts` (`NetClient`) is the browser side. `CombatSystem.netRole` is `solo`, `host` or `client`. The host simulates mobs, targets the nearest player and broadcasts `snapshot()` at 10 Hz. Clients run `updatePuppet` and send damage to the host (`onHitRequest`). Loot is per client (each one runs `defeat()` locally).
- `remote-players.ts` keeps a fixed pool of 3 remote avatars created at startup. Never create heroes at runtime, because each one has a PointLight.
- The party lives in `Game.tsx` (`pinv`/`pacc`/`pst`/`pleave` messages). Cura em Grupo and Despertar reach party members.
- `save.ts` stores the save in localStorage (`ecos.save.v1`) and can export/import it as .json. Autosave runs every 30 s and on `beforeunload`.

**Performance invariants (each one caused multi-second hitches when broken):**
- The visible PointLight count must stay constant. Three.js bakes the light count into the shader key, so adding a light or hiding its parent recompiles every lit material. Reuse the fixed pools: drop lights and mob fill lights in `combat.ts`, the 4 light slots in `magic.ts`.
- Precompile against the composer render target (`composer.readBuffer`), not the canvas. Three.js compiles a different shader variant for render targets (tone mapping and color space).
- Spell effect materials come from the factories or the pool in `magic.ts` (`pooled`/`retire`, `pSprite`/`pBasic`). Never call `dispose()` on them directly, because that deletes the compiled program and the next cast recompiles it.
- Keep fast-changing HUD state in `hudStore` (`useSyncExternalStore`), not in `Game` state.
- F3 opens the perf panel (`perf-monitor.ts`). In dev, `window.__ecos` exposes benchmark hooks (`start`, `teleport`, `cast`, `hurt`, `recharge`, `perf.report()`).

**Performance knobs:** a quality setting (`Baixa`/`Média`/`Alta`, applied through `setWorldQuality`), dynamic resolution driven by an EMA of frame time, manual shadow-map updates (every 2nd frame below `Alta`), and frame delta clamped to 0.05 s.
