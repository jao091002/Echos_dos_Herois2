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
  private readonly radius = .62;

  constructor(private root: THREE.Group, private colliders: WorldCollider[]) {}

  reset() {
    this.velocity.set(0, 0, 0);
    this.verticalSpeed = 0;
    this.grounded = true;
    this.dodgeTimer = 0;
    this.dodgeVelocity.set(0, 0, 0);
  }

  dodge(facingYaw: number, side: number) {
    const angle = side === 0 ? facingYaw + Math.PI : facingYaw + (side > 0 ? Math.PI / 2 : -Math.PI / 2);
    this.dodgeVelocity.set(Math.sin(angle) * 11, 0, Math.cos(angle) * 11);
    this.dodgeTimer = .24;
  }

  update(delta: number, moveForward: number, moveSide: number, sprint: boolean, jump: boolean, facingYaw: number, flight = false, verticalInput = 0, cameraPitch = 0) {
    const dt = Math.min(delta, .05);
    const inputLength = Math.hypot(moveForward, moveSide);
    const speed = flight ? (sprint ? 13 : 8) : (sprint ? 8.2 : 5.4);
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
      this.root.position.y = Math.max(terrainHeight(this.root.position.x, this.root.position.z) + .2, this.root.position.y);
      this.verticalSpeed = this.velocity.y;
      this.grounded = this.root.position.y <= terrainHeight(this.root.position.x, this.root.position.z) + .21;
      return moving;
    }

    if (jump && this.grounded) {
      this.verticalSpeed = 8.2;
      this.grounded = false;
    }
    this.verticalSpeed -= 22 * dt;
    const acceleration = moving ? 14 : 18;
    this.velocity.x = THREE.MathUtils.damp(this.velocity.x, this.direction.x * speed, acceleration, dt);
    this.velocity.z = THREE.MathUtils.damp(this.velocity.z, this.direction.z * speed, acceleration, dt);

    if (this.dodgeTimer > 0) {
      this.dodgeTimer = Math.max(0, this.dodgeTimer - dt);
      this.velocity.x = this.dodgeVelocity.x;
      this.velocity.z = this.dodgeVelocity.z;
      moving = true;
    }

    this.root.position.x += this.velocity.x * dt;
    this.root.position.z += this.velocity.z * dt;
    for (const collider of this.colliders) {
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
    const ground = terrainHeight(this.root.position.x, this.root.position.z);
    if (this.root.position.y <= ground) {
      this.root.position.y = ground;
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

  minPitch = -.12;
  maxPitch = .72;
  followSharpness = 12;
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

    this.target.set(root.position.x, root.position.y + this.targetHeight, root.position.z);
    this.right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    const horizontal = Math.cos(this.pitch) * this.distance;
    this.offset.set(Math.sin(this.yaw) * horizontal, Math.sin(this.pitch) * this.distance + .3, Math.cos(this.yaw) * horizontal);
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
    this.camera.lookAt(this.look);
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

    this.raycaster.setFromCamera(this.screenCenter, this.camera);
    this.raycaster.near = .1;
    this.raycaster.far = this.aimRange;
    this.aimHits.length = 0;
    this.raycaster.intersectObjects(targets, true, this.aimHits);

    for (let i = 0; i < this.aimHits.length; i++) {
      const hit = this.aimHits[i];
      const isLocallyFaded = hit.object.name === 'forest-trunks' || hit.object.name === 'field-stones';
      if (isLocallyFaded && hit.distance < 4.6) continue;
      return out.copy(hit.point);
    }
    this.raycaster.ray.at(this.aimRange, out);
    return out;
  }
}
