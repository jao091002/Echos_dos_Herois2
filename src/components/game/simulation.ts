import * as THREE from 'three';
import { terrainHeight, type WorldCollider, type WorldParts } from './world';

export class PlayerMotor {
  readonly velocity = new THREE.Vector3();
  grounded = true;
  verticalSpeed = 0;

  private readonly direction = new THREE.Vector3();
  private readonly desired = new THREE.Vector3();
  private readonly dodgeVelocity = new THREE.Vector3();
  private dodgeTimer = 0;
  private dodgeCooldown = 0;
  private readonly radius = .62;
  // sensação de controle: tolerância de pulo ("coyote time"), pulo armazenado e altura variável
  private coyote = 0;
  private jumpBuffer = 0;
  private jumpWasHeld = false;
  private jumpCut = false;
  static readonly DODGE_TIME = .3;

  /** Multiplicador de velocidade (ex.: andar devagar enquanto carrega/dispara magia). */
  speedScale = 1;
  /** Multiplicador da velocidade vertical no voo (subir/descer). */
  verticalScale = 1;
  /** Velocidade de queda (m/s, positiva) no último toque no chão; o jogo consome (dano de queda, câmera) e zera. */
  landingSpeed = 0;
  /** Inclinação do chão sob o herói (0 plano … 1 vertical), para animação/som. */
  slope = 0;
  private readonly slopeN = new THREE.Vector3();
  /** Normal do terreno por diferenças finitas. */
  private groundNormal(x: number, z: number, out: THREE.Vector3) {
    const e = .6;
    return out.set(terrainHeight(x - e, z) - terrainHeight(x + e, z), 2 * e, terrainHeight(x, z - e) - terrainHeight(x, z + e)).normalize();
  }
  constructor(private root: THREE.Group, private colliders: WorldCollider[]) {}

  reset() {
    this.velocity.set(0, 0, 0);
    this.verticalSpeed = 0;
    this.grounded = true;
    this.dodgeTimer = 0;
    this.dodgeCooldown = 0;
    this.dodgeVelocity.set(0, 0, 0);
  }

  get dodging() { return this.dodgeTimer > 0; }

  /** Esquiva na direção do input (relativa à câmera); sem input = passo para trás. Retorna false em recarga. */
  dodge(cameraYaw: number, forward: number, side: number, vertical = 0) {
    if (this.dodgeCooldown > 0 || this.dodgeTimer > 0) return false;
    let x = -Math.sin(cameraYaw) * forward + Math.cos(cameraYaw) * side, z = -Math.cos(cameraYaw) * forward - Math.sin(cameraYaw) * side;
    if (Math.hypot(x, z) < .01) { x = Math.sin(cameraYaw); z = Math.cos(cameraYaw); }
    const l = Math.hypot(x, z);
    this.dodgeVelocity.set(x / l * 14, vertical * 9, z / l * 14);
    this.dodgeTimer = PlayerMotor.DODGE_TIME; this.dodgeCooldown = .55;
    return true;
  }

  update(delta: number, moveForward: number, moveSide: number, sprint: boolean, jump: boolean, facingYaw: number, flight = false, verticalInput = 0, cameraPitch = 0) {
    const dt = Math.min(delta, .05);
    const inputLength = Math.hypot(moveForward, moveSide);
    const speed = (flight ? (sprint ? 13 : 8) : (sprint ? 8.2 : 5.4)) * this.speedScale;
    let moving = inputLength > .01;

    if (inputLength > 0) {
      const forwardX = -Math.sin(facingYaw);
      const forwardZ = -Math.cos(facingYaw);
      const rightX = Math.cos(facingYaw);
      const rightZ = -Math.sin(facingYaw);
      this.direction.set(forwardX * moveForward + rightX * moveSide, 0, forwardZ * moveForward + rightZ * moveSide).normalize();
    } else this.direction.set(0, 0, 0);

    if (flight) {
      // voo: segue a inclinação da câmera ao avançar, acelera com inércia, freia mais rápido, sobe/desce com Espaço/Ctrl
      const forwardLift = -moveForward * Math.sin(cameraPitch) * speed * .95;
      const vertical = verticalInput * speed * .8 * this.verticalScale + forwardLift;
      this.desired.set(this.direction.x * speed, vertical, this.direction.z * speed);
      const accelerating = this.desired.lengthSq() > this.velocity.lengthSq();
      const rate = this.dodgeTimer > 0 ? 0 : accelerating ? 4.2 : moving || verticalInput ? 6.5 : 3.2; // parar = desliza e flutua
      this.velocity.lerp(this.desired, 1 - Math.exp(-dt * rate));
      if (this.dodgeTimer > 0) {
        this.dodgeTimer = Math.max(0, this.dodgeTimer - dt);
        const k = .5 + .9 * (this.dodgeTimer / PlayerMotor.DODGE_TIME);
        this.velocity.set(this.dodgeVelocity.x * k, this.dodgeVelocity.y * k, this.dodgeVelocity.z * k);
        moving = true;
      }
      this.dodgeCooldown = Math.max(0, this.dodgeCooldown - dt);
      this.root.position.addScaledVector(this.velocity, dt);
      const ground = terrainHeight(this.root.position.x, this.root.position.z);
      // perto do chão ainda colide com árvores, pedras e construções (antes atravessava tudo voando)
      if (this.root.position.y - ground < 5.5) for (const collider of this.colliders) {
        const dx = this.root.position.x - collider.x, dz = this.root.position.z - collider.z, min = this.radius + collider.radius, d2 = dx * dx + dz * dz;
        if (d2 < min * min) {
          const d = Math.sqrt(d2) || .001, nx = dx / d, nz = dz / d;
          this.root.position.x = collider.x + nx * min; this.root.position.z = collider.z + nz * min;
          const into = this.velocity.x * nx + this.velocity.z * nz;
          if (into < 0) { this.velocity.x -= nx * into; this.velocity.z -= nz * into; }
        }
      }
      if (this.root.position.y < ground + .2) { this.root.position.y = ground + .2; if (this.velocity.y < 0) this.velocity.y = 0; }
      if (this.root.position.y > ground + 60) { this.root.position.y = ground + 60; if (this.velocity.y > 0) this.velocity.y = 0; }
      this.verticalSpeed = this.velocity.y;
      this.grounded = this.root.position.y <= ground + .21;
      return moving || Math.abs(this.velocity.y) > .5;
    }

    // pulo: aceita o aperto até 0,13 s antes de tocar o chão e até 0,12 s depois de sair da borda
    const pressed = jump && !this.jumpWasHeld; this.jumpWasHeld = jump;
    this.jumpBuffer = pressed ? .13 : Math.max(0, this.jumpBuffer - dt);
    this.coyote = this.grounded ? .12 : Math.max(0, this.coyote - dt);
    this.dodgeCooldown = Math.max(0, this.dodgeCooldown - dt);
    if (this.jumpBuffer > 0 && this.coyote > 0) {
      this.verticalSpeed = 8.6; this.grounded = false; this.coyote = 0; this.jumpBuffer = 0; this.jumpCut = false;
    }
    // soltar o botão cedo corta a subida (pulo curto); a queda é mais pesada que a subida
    if (!jump && this.verticalSpeed > 2 && !this.jumpCut && !this.grounded) { this.verticalSpeed *= .5; this.jumpCut = true; }
    this.verticalSpeed -= (this.verticalSpeed > 0 ? 22 : 31) * dt;
    this.verticalSpeed = Math.max(this.verticalSpeed, -38);

    // aceleração: rápida no chão, inversão de direção ainda mais rápida (troca de lado em combate), controle no ar
    const tx = this.direction.x * speed, tz = this.direction.z * speed;
    const reversing = moving && this.velocity.x * tx + this.velocity.z * tz < 0;
    // inércia: o corpo tem peso (arranca e freia em ~0,2 s, mais rápido ao inverter em combate)
    const acceleration = !this.grounded ? 6 : reversing ? 26 : moving ? 15 : 17;
    let ttx = tx, ttz = tz;
    // encostas: subir é mais lento; rampas muito íngremes (>~40°) fazem escorregar
    if (this.grounded) {
      const n = this.groundNormal(this.root.position.x, this.root.position.z, this.slopeN);
      this.slope = 1 - n.y;
      const uphill = -(n.x * ttx + n.z * ttz) / Math.max(speed, 1e-3); // >0 = andando morro acima
      if (uphill > 0) { const k = 1 - Math.min(.45, uphill * this.slope * 2.2); ttx *= k; ttz *= k; }
      if (n.y < .76) { const slide = (0.76 - n.y) * 40; ttx += n.x * slide; ttz += n.z * slide; }
    } else this.slope = 0;
    this.velocity.x = THREE.MathUtils.damp(this.velocity.x, ttx, acceleration, dt);
    this.velocity.z = THREE.MathUtils.damp(this.velocity.z, ttz, acceleration, dt);

    if (this.dodgeTimer > 0) {
      this.dodgeTimer = Math.max(0, this.dodgeTimer - dt);
      const k = .45 + .55 * (this.dodgeTimer / PlayerMotor.DODGE_TIME); // arranque forte que desacelera
      this.velocity.x = this.dodgeVelocity.x * k;
      this.velocity.z = this.dodgeVelocity.z * k;
      moving = true;
    }

    // sub-passos + duas passadas de colisão: desliza pelos obstáculos sem atravessar nem travar
    const steps = Math.max(1, Math.ceil(Math.hypot(this.velocity.x, this.velocity.z) * dt / .25));
    for (let st = 0; st < steps; st++) {
      this.root.position.x += this.velocity.x * dt / steps;
      this.root.position.z += this.velocity.z * dt / steps;
      for (let pass = 0; pass < 2; pass++) for (const collider of this.colliders) {
        const dx = this.root.position.x - collider.x;
        const dz = this.root.position.z - collider.z;
        const minDistance = this.radius + collider.radius;
        const distanceSq = dx * dx + dz * dz;
        if (distanceSq < minDistance * minDistance) {
          const distance = Math.sqrt(distanceSq) || .001, nx = dx / distance, nz = dz / distance;
          this.root.position.x = collider.x + nx * minDistance;
          this.root.position.z = collider.z + nz * minDistance;
          const into = this.velocity.x * nx + this.velocity.z * nz; // tira só a parte que empurra contra o obstáculo
          if (into < 0) { this.velocity.x -= nx * into; this.velocity.z -= nz * into; }
        }
      }
    }

    this.root.position.y += this.verticalSpeed * dt;
    // desce rampas sem "quicar": se estava no chão e o solo está logo abaixo, gruda nele
    const below = terrainHeight(this.root.position.x, this.root.position.z);
    if (this.grounded && this.verticalSpeed <= 0 && this.root.position.y - below < .35) this.root.position.y = below;
    const ground = terrainHeight(this.root.position.x, this.root.position.z);
    if (this.root.position.y <= ground) {
      this.root.position.y = ground;
      if (!this.grounded && this.verticalSpeed < -4) this.landingSpeed = -this.verticalSpeed;
      this.verticalSpeed = 0;
      this.grounded = true;
    } else this.grounded = false;
    return moving;
  }
}

export class ThirdPersonCamera {
  yaw = 0;
  pitch = .19;
  distance = 9.2;
  aimRange = 40;
  sensitivity = .0032;
  targetHeight = 1.68;
  shoulderOffset = .9;

  // --- Shift Lock framing ---
  // Camera sits to the RIGHT of the hero; the reticle stays at screen center.
  shiftLockShoulderOffset = 3.2;
  // Where the hero appears on screen, as a fraction of the half-viewport
  // (-1 = left/bottom edge, 0 = center, 1 = right/top edge).
  lockedScreenX = -.58;
  lockedScreenY = -.5;
  lockBlendSharpness = 9;

  /** 0..1: aproxima a câmera e fecha o FOV para mirar (carregando/disparando o Zoltraak). */
  aim = 0;
  /** 0..1 de tremor pedido pelas magias. */
  shake = 0;
  /** Assistência de mira: cone (rad) em que a mira "puxa" para o inimigo mais perto do centro. 0 desliga. */
  aimAssistCone = .07;
  /** true quando o último getAimPoint travou em um inimigo. */
  aimLocked = false;
  baseFov = 49;

  /** Ponto de mira na tela em coordenadas normalizadas (0,0 = centro). No modo mouse livre segue o cursor. */
  readonly aimNdc = new THREE.Vector2(0, 0);

  minPitch = -.42;
  maxPitch = .72;
  followSharpness = 15;
  collisionReleaseSharpness = 7;
  collisionApproachSharpness = 18;
  minimumCollisionDistance = 3.8;
  collisionPadding = .36;
  minimumCameraHeight = .85;
  // Collision raycast runs at ~30 Hz instead of every frame.
  collisionInterval = 1 / 30;

  private currentDistance = 9.2;
  private collisionDistance = 9.2;
  private cachedHitDistance = Infinity;
  private collisionTimer = Infinity; // forces a raycast on the first frame
  private lockBlend = 0;
  private shiftLocked = false;
  private aimBlend = 0;
  private smoothY = NaN;
  private shakeTime = 0;
  /* ---- realismo: o jogo informa a velocidade (0..1 da corrida, voo) e impactos */
  /** Velocidade normalizada do herói (0 parado, 1 corrida); o jogo atualiza a cada quadro. */
  speed01 = 0;
  /** Voando (FOV mais aberto). */
  flying = false;
  /** Câmera cinemática (cutscene): quando não nula, substitui a câmera de terceira pessoa com transição suave. */
  cinematic: { pos: THREE.Vector3; look: THREE.Vector3 } | null = null;
  private cineBlend = 0;
  private readonly cinePos = new THREE.Vector3();
  private readonly cineLook = new THREE.Vector3();
  private bobPhase = 0;
  private roll = 0;
  private lastYaw = 0;
  /** Afundamento de aterrissagem (mola amortecida). */
  private dip = 0;
  private dipVel = 0;
  /** Impacto de aterrissagem/queda: força 0..1 (afunda a câmera e treme). */
  impact(strength: number) { this.dipVel -= 2.6 * Math.min(1, strength); this.shake = Math.max(this.shake, .5 * strength); }
  private readonly tmpV = new THREE.Vector3();
  private readonly tmpDir = new THREE.Vector3();
  private readonly losRay = new THREE.Raycaster();
  private readonly losHits: THREE.Intersection[] = [];

  private readonly raycaster = new THREE.Raycaster();
  private readonly target = new THREE.Vector3();
  private readonly offset = new THREE.Vector3();
  private readonly desired = new THREE.Vector3();
  private readonly look = new THREE.Vector3();
  private readonly right = new THREE.Vector3();
  private readonly forward = new THREE.Vector3();
  private readonly up = new THREE.Vector3();
  private readonly rayDirection = new THREE.Vector3();
  private readonly screenCenter = new THREE.Vector2(0, 0);
  private readonly collisionHits: THREE.Intersection[] = [];
  private readonly aimHits: THREE.Intersection[] = [];
  private readonly aimScratch: THREE.Object3D[] = [];
  private readonly collisionObjects: THREE.Object3D[];
  private readonly aimObjects: THREE.Object3D[];

  constructor(private camera: THREE.PerspectiveCamera, private parts: WorldParts) {
    // Forest meshes use a local camera fade; letting their instanced bounds
    // collapse the orbit distance causes the near-first-person camera snap.
    this.collisionObjects = parts.blockers.filter(o => o.name !== 'forest-trunks' && o.name !== 'field-stones');
    this.aimObjects = [...parts.blockers, parts.ground];
  }

  setShiftLock(enabled: boolean) { this.shiftLocked = enabled; }

  /** Gira a câmera suavemente para olhar na direção (x, z) a partir do herói (alvo travado). */
  turnToward(dx: number, dz: number, delta: number, sharpness = 7) {
    if (Math.hypot(dx, dz) < .01) return;
    const want = Math.atan2(-dx, -dz), diff = THREE.MathUtils.euclideanModulo(want - this.yaw + Math.PI, Math.PI * 2) - Math.PI;
    this.yaw = THREE.MathUtils.euclideanModulo(this.yaw + diff * (1 - Math.exp(-delta * sharpness)) + Math.PI, Math.PI * 2) - Math.PI;
  }

  rotate(dx: number, dy: number) {
    this.yaw -= dx * this.sensitivity;
    this.yaw = THREE.MathUtils.euclideanModulo(this.yaw + Math.PI, Math.PI * 2) - Math.PI;
    this.pitch = THREE.MathUtils.clamp(this.pitch + dy * this.sensitivity, this.minPitch, this.maxPitch);
  }

  zoom(delta: number) {
    this.distance = THREE.MathUtils.clamp(this.distance + delta * .008, 5, 14);
  }

  update(root: THREE.Group, delta: number) {
    // Smooth 0..1 blend so toggling Shift Lock glides instead of snapping.
    const blend = this.lockBlend = THREE.MathUtils.damp(this.lockBlend, this.shiftLocked ? 1 : 0, this.lockBlendSharpness, delta);

    const aim = this.aimBlend = THREE.MathUtils.damp(this.aimBlend, this.aim, 10, delta);
    // altura do alvo suavizada: pulos não sacodem a câmera, quedas longas ainda acompanham
    const rootY = root.position.y;
    if (Number.isNaN(this.smoothY) || Math.abs(rootY - this.smoothY) > 4) this.smoothY = rootY;
    else this.smoothY = THREE.MathUtils.damp(this.smoothY, rootY, rootY < this.smoothY ? 14 : 7, delta);
    this.target.set(root.position.x, this.smoothY + this.targetHeight, root.position.z);
    this.right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    const dist = this.distance * (1 - .38 * aim);
    const horizontal = Math.cos(this.pitch) * dist;
    this.offset.set(Math.sin(this.yaw) * horizontal, Math.sin(this.pitch) * dist + .3, Math.cos(this.yaw) * horizontal);
    this.offset.addScaledVector(this.right, THREE.MathUtils.lerp(this.shoulderOffset, this.shiftLockShoulderOffset, blend));
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
    const requestedDistance = this.cachedHitDistance < fullDistance - .2
      ? Math.max(this.minimumCollisionDistance, this.cachedHitDistance - this.collisionPadding)
      : fullDistance;
    if (requestedDistance < this.collisionDistance) this.collisionDistance = requestedDistance;
    else this.collisionDistance = THREE.MathUtils.damp(this.collisionDistance, requestedDistance, this.collisionReleaseSharpness, delta);
    this.currentDistance = THREE.MathUtils.damp(this.currentDistance, this.collisionDistance, this.collisionApproachSharpness, delta);

    this.desired.copy(this.offset).setLength(this.currentDistance).add(this.target);
    // balanço de passada (sutil, só no chão) e afundamento de aterrissagem com mola amortecida
    const sp = this.flying ? 0 : this.speed01;
    this.bobPhase += delta * (6 + 5 * sp) * (sp > .05 ? 1 : 0);
    const bob = Math.sin(this.bobPhase * 2) * .045 * sp * (1 - aim);
    this.dipVel += (-this.dip * 90 - this.dipVel * 14) * delta; this.dip += this.dipVel * delta;
    this.desired.y += bob + this.dip * .35;
    this.desired.y = Math.max(this.desired.y, terrainHeight(this.desired.x, this.desired.z) + this.minimumCameraHeight);
    this.camera.position.lerp(this.desired, 1 - Math.exp(-delta * this.followSharpness));

    // --- Look point ---
    // Normal mode: tiny shoulder bias. Locked: aim the camera ahead/right/above the hero
    // so the hero lands in the lower-left of the screen and the reticle stays centered.
    this.look.copy(this.target).addScaledVector(this.right, .12 * (1 - blend));
    if (blend > .001) {
      const d = this.camera.position.distanceTo(this.target);
      this.forward.copy(this.target).sub(this.camera.position).normalize();
      this.up.crossVectors(this.right, this.forward).normalize();
      const halfH = Math.tan(THREE.MathUtils.degToRad(this.camera.fov * .5)) * d;
      const halfW = halfH * this.camera.aspect;
      this.look.addScaledVector(this.right, -this.lockedScreenX * halfW * blend);
      this.look.addScaledVector(this.up, -this.lockedScreenY * halfH * blend);
    }
    this.look.y += this.dip * .2;
    // cutscene: mistura suave entre a câmera de jogo e o plano cinemático
    this.cineBlend = THREE.MathUtils.damp(this.cineBlend, this.cinematic ? 1 : 0, 3.2, delta);
    if (this.cinematic) { this.cinePos.copy(this.cinematic.pos); this.cineLook.copy(this.cinematic.look); }
    if (this.cineBlend > .001) {
      const k = this.cineBlend * this.cineBlend * (3 - 2 * this.cineBlend);
      this.camera.position.lerp(this.cinePos, k); this.look.lerp(this.cineLook, k);
    }
    this.camera.lookAt(this.look);
    // inclinação (roll) leve ao girar a câmera em velocidade
    let dyaw = this.yaw - this.lastYaw; this.lastYaw = this.yaw;
    dyaw = THREE.MathUtils.euclideanModulo(dyaw + Math.PI, Math.PI * 2) - Math.PI;
    const rollTarget = THREE.MathUtils.clamp(-dyaw / Math.max(delta, 1e-3) * .012 * (.3 + sp), -.05, .05) * (1 - this.cineBlend);
    this.roll = THREE.MathUtils.damp(this.roll, rollTarget, 6, delta);
    if (Math.abs(this.roll) > 1e-4) this.camera.rotateZ(this.roll);

    // FOV: fecha ao mirar, abre com a velocidade (corrida/voo); tremor curto e amortecido
    const fov = this.baseFov - 7 * aim + (this.flying ? 9 : 5) * sp * (1 - aim);
    if (Math.abs(this.camera.fov - fov) > .01) { this.camera.fov = THREE.MathUtils.damp(this.camera.fov, fov, 7, delta); this.camera.updateProjectionMatrix(); }
    if (this.shake > .001) {
      this.shakeTime += delta;
      const a = this.shake * this.shake * .05, t = this.shakeTime * 38;
      this.camera.rotateX(Math.sin(t) * a); this.camera.rotateY(Math.sin(t * 1.31 + 1.7) * a * .8); this.camera.rotateZ(Math.sin(t * .77) * a * .5);
    }
  }

  getAimPoint(out: THREE.Vector3, extraTargets: THREE.Object3D[] = []) {
    this.camera.updateMatrixWorld();
    for (let i = 0; i < extraTargets.length; i++) extraTargets[i].updateWorldMatrix(true, false);

    let targets = this.aimObjects;
    if (extraTargets.length) {
      // Reuse one scratch array instead of allocating every call.
      this.aimScratch.length = 0;
      for (const o of this.aimObjects) this.aimScratch.push(o);
      for (const o of extraTargets) this.aimScratch.push(o);
      targets = this.aimScratch;
    }

    this.raycaster.setFromCamera(this.aimNdc, this.camera);
    this.raycaster.near = .1;
    this.raycaster.far = this.aimRange;
    this.aimHits.length = 0;
    this.raycaster.intersectObjects(targets, true, this.aimHits);

    let hitDistance = this.aimRange, found = false;
    for (let i = 0; i < this.aimHits.length; i++) {
      const hit = this.aimHits[i];
      const isLocallyFaded = hit.object.name === 'forest-trunks' || hit.object.name === 'field-stones';
      if (isLocallyFaded && hit.distance < 4.6) continue;
      out.copy(hit.point); hitDistance = hit.distance; found = true;
      break;
    }
    if (!found) this.raycaster.ray.at(this.aimRange, out);

    // assistência de mira: inimigo visível num cone estreito em volta da mira (mais largo de perto)
    this.aimLocked = false;
    if (this.aimAssistCone > 0 && extraTargets.length) {
      const ray = this.raycaster.ray;
      let best: THREE.Object3D | null = null, bestScore = Infinity;
      for (const t of extraTargets) {
        if (!t.visible || (t.parent && !t.parent.visible)) continue;
        t.getWorldPosition(this.tmpV);
        const toT = this.tmpV.sub(ray.origin), d = toT.length();
        if (d < 1.5 || d > this.aimRange) continue;
        const ang = Math.acos(THREE.MathUtils.clamp(toT.dot(ray.direction) / d, -1, 1));
        const cone = this.aimAssistCone * (1 + 6 / d);
        if (ang < cone && ang / cone < bestScore) { bestScore = ang / cone; best = t; }
      }
      if (best) {
        best.getWorldPosition(this.tmpV);
        const d = this.tmpV.distanceTo(ray.origin);
        this.losRay.set(ray.origin, this.tmpDir.copy(this.tmpV).sub(ray.origin).normalize()); this.losRay.near = .1; this.losRay.far = Math.max(.2, d - .8);
        this.losHits.length = 0;
        this.losRay.intersectObjects(this.aimObjects, true, this.losHits);
        const blocked = this.losHits.some(h => !((h.object.name === 'forest-trunks' || h.object.name === 'field-stones') && h.distance < 4.6));
        if (!blocked && d <= hitDistance + 2) { out.copy(this.tmpV); this.aimLocked = true; }
      }
    }
    return out;
  }
}
