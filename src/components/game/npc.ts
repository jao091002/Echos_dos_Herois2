import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { registerSpecGloss, retargetModel, type Retarget } from './rig-retarget';
import { terrainHeight, type WorldCollider } from './world';

/* ============================================================================
 *  NPC que dá missões (Aldren, pastor dos Campos da Aurora)
 *
 *  Corpo: o mesmo modelo civil dos bandidos (perso.glb), com as cores originais e um cajado de pastor,
 *  encaixado num rig procedural simples via retargetModel (mesmo método da heroína e dos bandidos).
 *  Sem o modelo, fica um corpo procedural de cápsulas (mesmo padrão de fallback do resto do jogo).
 *
 *  Animação procedural com molas amortecidas (sem cortes entre poses):
 *   - parado: respiração, troca de peso entre as pernas, olhar e tronco acompanhando o jogador;
 *     vira o corpo com passinhos quando o jogador sai do campo de visão;
 *   - gestos: aceno (jogador chegando), fala (diálogo aberto), apontar a mata (missão aceita),
 *     comemoração (missão entregue) e aceno de cabeça (fim da conversa).
 *  Marcador sobre a cabeça: "!" dourado (missão disponível), "?" cinza (em andamento), "?" dourado (pronta).
 *  Nenhuma luz nova (a contagem de PointLights fica constante); materiais básicos e baratos.
 * ========================================================================== */

export type QuestStage = 'available' | 'active' | 'ready' | 'done';
export type NpcGesture = 'wave' | 'point' | 'cheer' | 'nod';

const { clamp, lerp, euclideanModulo } = THREE.MathUtils;
const { sin, cos, abs, max, min, PI } = Math;
const TAU = PI * 2;
const wrap = (a: number) => euclideanModulo(a + PI, TAU) - PI;
/** Envelope: sobe de a até b, segura, desce de c até d (suave nas pontas). */
const env = (u: number, a: number, b: number, c: number, d: number) => {
  const s = (x: number) => x * x * (3 - 2 * x);
  return u < a || u > d ? 0 : u < b ? s((u - a) / (b - a)) : u <= c ? 1 : s(1 - (u - c) / (d - c));
};

const JOINTS = ['pelvis', 'chest', 'head', 'armL', 'elbowL', 'wristL', 'armR', 'elbowR', 'wristR', 'hipL', 'kneeL', 'ankleL', 'hipR', 'kneeR', 'ankleR'] as const;
type JName = (typeof JOINTS)[number];
type Chan = { node: THREE.Object3D; v: THREE.Vector3; vel: THREE.Vector3; t: THREE.Vector3 };

const PELVIS_Y = 1.1, THIGH = 0.48, SHIN = 0.52;
const GESTURE_DUR: Record<NpcGesture, number> = { wave: 2.1, point: 2.2, cheer: 2.4, nod: 1.0 };

export class QuestGiver {
  readonly root = new THREE.Group();
  readonly name = 'Aldren';
  readonly position: THREE.Vector3;
  private readonly J = {} as Record<JName, Chan>;
  private readonly fallback: THREE.Mesh[] = [];
  private readonly crook = new THREE.Group();
  private readonly marker = new THREE.Group();
  private readonly bang = new THREE.Group();
  private readonly ask = new THREE.Group();
  private readonly markerMat = new THREE.MeshBasicMaterial({ color: '#ffd36a', toneMapped: false });
  private readonly markerGlow = new THREE.MeshBasicMaterial({ color: '#ffd36a', transparent: true, opacity: 0.22, depthWrite: false, toneMapped: false });
  private retarget: Retarget | null = null;
  private model: THREE.Object3D | null = null;
  private handBone: THREE.Object3D | null = null;
  private disposed = false;
  private yaw: number;
  private targetYaw: number;
  private readonly homeYaw: number;
  private turnVel = 0;
  private shufflePhase = 0;
  private lookYaw = 0;
  private lookPitch = 0;
  private gesture: NpcGesture | null = null;
  private gestureT = 0;
  private pointYaw = 0;
  private talking = false;
  private talkBlend = 0;
  private waveCooldown = 0;
  private wasNear = false;
  private awayTime = 0;
  private stage: QuestStage = 'available';
  private readonly tmp = new THREE.Vector3();
  private readonly tmpQ = new THREE.Quaternion();
  private readonly tmpQ2 = new THREE.Quaternion();

  constructor(scene: THREE.Scene, x: number, z: number, yaw: number, colliders: WorldCollider[], private pointTarget = new THREE.Vector2(4, -30)) {
    this.yaw = this.targetYaw = this.homeYaw = yaw;
    this.root.name = 'npc-aldren';
    this.root.position.set(x, terrainHeight(x, z), z);
    this.root.rotation.y = yaw;
    this.position = this.root.position;
    colliders.push({ x, z, radius: 0.55 });
    this.buildRig();
    this.buildCrook();
    this.buildMarker();
    this.setStage('available');
    scene.add(this.root);
  }

  /* ------------------------------------------------------------------ construção */
  private buildRig() {
    const g = (parent: THREE.Object3D, name: JName, x: number, y: number, z: number) => {
      const n = new THREE.Group(); n.name = `npc-${name}`; n.position.set(x, y, z); parent.add(n);
      this.J[name] = { node: n, v: new THREE.Vector3(), vel: new THREE.Vector3(), t: new THREE.Vector3() };
      return n;
    };
    const pelvis = g(this.root, 'pelvis', 0, PELVIS_Y, 0);
    const chest = g(pelvis, 'chest', 0, 0.06, 0);
    const head = g(chest, 'head', 0, 0.74, 0.02);
    for (const side of [-1, 1] as const) {
      const S = side < 0 ? 'L' : 'R';
      const arm = g(chest, `arm${S}` as JName, side * 0.3, 0.56, 0);
      const elbow = g(arm, `elbow${S}` as JName, 0, -0.42, 0);
      g(elbow, `wrist${S}` as JName, 0, -0.4, 0);
      const hip = g(pelvis, `hip${S}` as JName, side * 0.2, -0.04, 0);
      const knee = g(hip, `knee${S}` as JName, 0, -THIGH, 0);
      g(knee, `ankle${S}` as JName, 0, -SHIN, 0);
    }
    // corpo procedural de reserva (túnica, calça, pele, barba) — some quando o modelo carrega
    const tunic = new THREE.MeshStandardMaterial({ color: '#7a5a3c', roughness: 0.9 });
    const pants = new THREE.MeshStandardMaterial({ color: '#4a4036', roughness: 0.95 });
    const skin = new THREE.MeshStandardMaterial({ color: '#d9ad8a', roughness: 0.8 });
    const beard = new THREE.MeshStandardMaterial({ color: '#c9c3b8', roughness: 1 });
    const add = (parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, y: number, z = 0) => {
      const m = new THREE.Mesh(geo, mat); m.position.set(0, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); this.fallback.push(m); return m;
    };
    add(chest, new THREE.CapsuleGeometry(0.26, 0.5, 4, 12), tunic, 0.34);
    add(pelvis, new THREE.CapsuleGeometry(0.24, 0.12, 4, 12), tunic, 0);
    add(head, new THREE.SphereGeometry(0.16, 16, 12), skin, 0.08);
    add(head, new THREE.SphereGeometry(0.12, 12, 8), beard, -0.02, 0.07).scale.set(1, 1.2, 0.7);
    for (const S of ['L', 'R'] as const) {
      add(this.J[`arm${S}`].node, new THREE.CapsuleGeometry(0.07, 0.3, 4, 8), tunic, -0.2);
      add(this.J[`elbow${S}`].node, new THREE.CapsuleGeometry(0.06, 0.28, 4, 8), tunic, -0.2);
      add(this.J[`wrist${S}`].node, new THREE.SphereGeometry(0.06, 8, 6), skin, -0.04);
      add(this.J[`hip${S}`].node, new THREE.CapsuleGeometry(0.09, 0.32, 4, 8), pants, -0.24);
      add(this.J[`knee${S}`].node, new THREE.CapsuleGeometry(0.075, 0.36, 4, 8), pants, -0.26);
      add(this.J[`ankle${S}`].node, new THREE.BoxGeometry(0.14, 0.1, 0.26), pants, -0.05, 0.06);
    }
  }

  /** Cajado de pastor (madeira com gancho) preso à mão esquerda. */
  private buildCrook() {
    const wood = new THREE.MeshStandardMaterial({ color: '#6b4a2e', roughness: 0.85 });
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, 1.9, 8), wood);
    shaft.position.y = -0.05; shaft.castShadow = true; this.crook.add(shaft);
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 6, 16, PI * 1.25), wood);
    hook.position.set(0.11, 0.9, 0); hook.rotation.z = -PI * 0.12; hook.castShadow = true; this.crook.add(hook);
    const wrap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.031, 0.031, 0.14, 8), new THREE.MeshStandardMaterial({ color: '#8c3b32', roughness: 0.9 }));
    wrap1.position.y = 0.02; this.crook.add(wrap1);
    this.J.wristL.node.add(this.crook);
    this.crook.position.set(0, -0.06, 0.03);
  }

  private buildMarker() {
    const m = this.markerMat;
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.03, 0.3, 10), m); bar.position.y = 0.06; this.bang.add(bar);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 8), m); dot.position.y = -0.17; this.bang.add(dot);
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.034, 8, 24, PI * 1.35), m); arc.position.y = 0.1; arc.rotation.z = -PI * 0.38; this.ask.add(arc);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.1, 8), m); stem.position.set(0, -0.04, 0); this.ask.add(stem);
    const dot2 = new THREE.Mesh(new THREE.SphereGeometry(0.046, 10, 8), m); dot2.position.y = -0.18; this.ask.add(dot2);
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 12), this.markerGlow);
    this.marker.add(this.bang, this.ask, glow);
    this.marker.position.set(0, 2.55, 0);
    this.root.add(this.marker);
  }

  /** Carrega o modelo glTF (assíncrono); sem ele, o corpo procedural continua. */
  load() {
    const loader = new GLTFLoader(); registerSpecGloss(loader);
    loader.load('/models/perso.glb', gltf => {
      if (this.disposed) return;
      const model = gltf.scene;
      model.traverse(o => {
        const m = o as THREE.Mesh; if (!m.isMesh) return;
        m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false;
        for (const mt of (Array.isArray(m.material) ? m.material : [m.material]) as THREE.MeshStandardMaterial[]) {
          if (mt.transparent) { mt.transparent = false; mt.alphaTest = 0.5; mt.opacity = 1; }
          mt.depthWrite = true;
          if ('metalness' in mt) { mt.metalness = Math.min(mt.metalness, 0.12); mt.roughness = Math.max(mt.roughness, 0.6); }
          mt.needsUpdate = true;
        }
      });
      const J = this.J;
      const rt = retargetModel(this.root, model, {
        pelvis: J.pelvis.node, chest: J.chest.node, head: J.head.node,
        armL: J.armL.node, elbowL: J.elbowL.node, wristL: J.wristL.node, armR: J.armR.node, elbowR: J.elbowR.node, wristR: J.wristR.node,
        hipL: J.hipL.node, kneeL: J.kneeL.node, ankleL: J.ankleL.node, hipR: J.hipR.node, kneeR: J.kneeR.node, ankleR: J.ankleR.node,
      }, THIGH + SHIN);
      if (!rt) return;
      this.retarget = rt; this.model = model;
      for (const m of this.fallback) m.visible = false;
      // mão do modelo no lado "L" do rig (-X): o cajado segue a mão real, não o pulso do rig
      this.root.updateMatrixWorld(true);
      const hands: THREE.Object3D[] = [];
      model.traverse(o => {
        if (!(o as THREE.Bone).isBone || !/(Left|Right)Hand(_\d+)?$/.test(o.name.replace(/^mixamorig[:_]?/, ''))) return;
        o.getWorldPosition(this.tmp); this.root.worldToLocal(this.tmp);
        if (this.tmp.x < 0) hands.push(o);
      });
      this.handBone = hands[0] ?? null;
      if (this.handBone) { this.J.wristL.node.remove(this.crook); this.root.add(this.crook); }
      rt.update();
    }, undefined, () => { /* mantém o corpo procedural */ });
  }

  dispose() { this.disposed = true; }

  setStage(stage: QuestStage) {
    this.stage = stage;
    this.bang.visible = stage === 'available';
    this.ask.visible = stage === 'active' || stage === 'ready';
    this.marker.visible = stage !== 'done';
    const c = stage === 'active' ? '#d4e2ee' : '#ffd36a';
    this.markerMat.color.set(c); this.markerGlow.color.set(c);
    this.markerGlow.opacity = stage === 'active' ? 0.14 : 0.22;
  }

  play(g: NpcGesture) {
    this.gesture = g; this.gestureT = 0;
    if (g === 'point') this.pointYaw = Math.atan2(this.pointTarget.x - this.root.position.x, this.pointTarget.y - this.root.position.z);
  }

  setTalking(on: boolean) { this.talking = on; if (!on) this.play('nod'); }

  /* ------------------------------------------------------------------ quadro */
  update(dt: number, time: number, player: THREE.Vector3) {
    const dx = player.x - this.root.position.x, dz = player.z - this.root.position.z, dist = Math.hypot(dx, dz);
    // longe da câmera do jogador: não anima (economia); o marcador continua girando via update barato
    if (dist > 70) { this.marker.rotation.y = time * 1.6; return; }
    dt = min(dt, 0.05);
    const toPlayer = Math.atan2(dx, dz);
    const near = dist < 9;

    // aceno quando o jogador chega perto com missão disponível/pronta
    this.waveCooldown -= dt;
    if (near && !this.wasNear && !this.talking && !this.gesture && this.waveCooldown <= 0 && (this.stage === 'available' || this.stage === 'ready')) { this.play('wave'); this.waveCooldown = 14; }
    this.wasNear = near;

    // direção do corpo: conversando/acenando encara o jogador; apontando encara a mata; sozinho volta à posição
    if (this.gesture === 'point') this.targetYaw = this.pointYaw;
    else if (this.talking || (near && abs(wrap(toPlayer - this.yaw)) > 0.85) || this.gesture === 'wave' || this.gesture === 'cheer') this.targetYaw = toPlayer;
    if (!near && !this.talking) { this.awayTime += dt; if (this.awayTime > 5) this.targetYaw = this.homeYaw; } else this.awayTime = 0;
    const prevYaw = this.yaw;
    this.yaw += wrap(this.targetYaw - this.yaw) * (1 - Math.exp(-dt * (this.talking ? 4 : 2.6)));
    this.root.rotation.y = this.yaw;
    this.turnVel = lerp(this.turnVel, wrap(this.yaw - prevYaw) / max(dt, 1e-4), 1 - Math.exp(-dt * 10));

    // olhar: cabeça segue o jogador (ou a mata ao apontar), dentro do limite do pescoço
    const lookAt = this.gesture === 'point' ? this.pointYaw : near || this.talking ? toPlayer : this.yaw + sin(time * 0.23) * 0.5;
    const ly = clamp(wrap(lookAt - this.yaw), -1.15, 1.15);
    const lp = near ? clamp(-Math.atan2((player.y + 1.5) - (this.root.position.y + 1.95), max(dist, 0.5)), -0.4, 0.4) : 0.05;
    this.lookYaw += (ly - this.lookYaw) * (1 - Math.exp(-dt * 5));
    this.lookPitch += (lp - this.lookPitch) * (1 - Math.exp(-dt * 4));
    this.talkBlend += ((this.talking ? 1 : 0) - this.talkBlend) * (1 - Math.exp(-dt * 4));

    this.pose(time, dt);
    this.integrate(dt);

    // marcador: gira e flutua
    this.marker.rotation.y = time * 1.6;
    this.marker.position.y = 2.55 + sin(time * 2.2) * 0.06;
    this.markerGlow.opacity = (this.stage === 'active' ? 0.12 : 0.2) + sin(time * 3.1) * 0.05;

    if (this.retarget) {
      this.retarget.update();
      if (this.handBone) {
        // cajado: posição da mão real do modelo, orientação do pulso do rig
        this.root.updateMatrixWorld(true);
        this.handBone.getWorldPosition(this.tmp); this.root.worldToLocal(this.tmp);
        this.crook.position.copy(this.tmp);
        this.J.wristL.node.getWorldQuaternion(this.tmpQ);
        this.root.getWorldQuaternion(this.tmpQ2).invert();
        this.crook.quaternion.copy(this.tmpQ2.multiply(this.tmpQ));
        this.crook.translateY(-0.02); this.crook.translateZ(0.03);
      }
    }
  }

  private set(n: JName, x = 0, y = 0, z = 0) { this.J[n].t.set(x, y, z); }
  private add(n: JName, x = 0, y = 0, z = 0) { const t = this.J[n].t; t.x += x; t.y += y; t.z += z; }

  /** Alvos de cada junta para este quadro (as molas fazem a transição). */
  private pose(t: number, dt: number) {
    const breath = sin(t * 1.9), shift = sin(t * 0.43), wL = max(0, shift), wR = max(0, -shift);
    // base: postura de velho pastor (levemente curvado), peso alternando entre as pernas
    this.set('pelvis', 0.03, shift * 0.04, shift * 0.03);
    this.set('chest', 0.08 + breath * 0.014, -shift * 0.03 + this.lookYaw * 0.3, -shift * 0.02);
    this.set('head', 0.04 + this.lookPitch - 0.06, this.lookYaw * 0.7, sin(t * 0.31) * 0.03);
    this.set('armL', -0.32 + breath * 0.01, 0, -0.12); this.set('elbowL', -0.55); this.set('wristL', 0.1);
    this.set('armR', 0.04 + breath * 0.012, 0, 0.1); this.set('elbowR', -0.22 - breath * 0.02); this.set('wristR', 0.05);
    this.set('hipL', -wR * 0.06, 0, -0.03 - wR * 0.02); this.set('kneeL', wR * 0.16 + 0.03);
    this.set('hipR', -wL * 0.06, 0, 0.03 + wL * 0.02); this.set('kneeR', wL * 0.16 + 0.03);
    let pelvisY = breath * 0.004 - (wL + wR) * 0.012, pelvisX = shift * 0.03;

    // passinhos ao girar o corpo (pés não deslizam no lugar)
    const turning = clamp(abs(this.turnVel) / 1.8, 0, 1);
    if (turning > 0.05) {
      this.shufflePhase += dt * 3.2;
      const q = this.shufflePhase * TAU, a = max(0, sin(q)), b = max(0, -sin(q));
      this.add('hipL', -a * 0.35 * turning); this.add('kneeL', a * 0.6 * turning);
      this.add('hipR', -b * 0.35 * turning); this.add('kneeR', b * 0.6 * turning);
      this.add('pelvis', 0, clamp(this.turnVel * 0.08, -0.25, 0.25));
    }

    // conversando: mão direita gesticula, cabeça acompanha a fala
    const k = this.talkBlend;
    if (k > 0.01) {
      this.add('armR', (-0.6 + sin(t * 1.7) * 0.22) * k, sin(t * 1.3) * 0.25 * k, 0.12 * k);
      this.add('elbowR', (-1.05 + sin(t * 2.3 + 1) * 0.3) * k);
      this.add('wristR', (-0.2 + sin(t * 2.9) * 0.25) * k);
      this.add('head', sin(t * 3.1) * 0.045 * k, 0, sin(t * 1.1) * 0.04 * k);
      this.add('chest', 0, sin(t * 0.9) * 0.06 * k);
      this.add('armL', -0.1 * k); // apoia-se no cajado
    }

    // gestos
    if (this.gesture) {
      this.gestureT += dt;
      const u = this.gestureT / GESTURE_DUR[this.gesture];
      if (this.gesture === 'wave') {
        const e = env(u, 0, 0.18, 0.78, 1), w = sin(this.gestureT * 9.5);
        this.add('armR', -2.35 * e, w * 0.5 * e, 0.45 * e);
        this.add('elbowR', -0.75 * e); this.add('wristR', w * 0.15 * e);
        this.add('chest', -0.04 * e, 0, -0.06 * e); this.add('head', -0.05 * e, 0, 0.08 * e);
        this.add('pelvis', 0, 0, 0.03 * e);
      } else if (this.gesture === 'point') {
        // vira para a mata, aponta com o braço estendido, olha de volta para o jogador no fim
        const e = env(u, 0.12, 0.32, 0.8, 1);
        this.add('armR', -1.45 * e, 0, 0.05 * e); this.add('elbowR', 0.2 * e); this.add('wristR', -0.1 * e);
        this.add('chest', -0.05 * e, 0, 0); this.add('head', -0.06 * e);
        this.add('hipR', -0.18 * e); this.add('kneeL', 0.12 * e); // meio passo à frente
      } else if (this.gesture === 'cheer') {
        // antecipação (agacha) -> braços ao alto com dois pulinhos -> relaxa
        const pre = env(u, 0, 0.08, 0.12, 0.2), e = env(u, 0.12, 0.25, 0.75, 1);
        const hop = max(0, sin((u - 0.2) * TAU * 2.2)) * env(u, 0.2, 0.25, 0.65, 0.75);
        this.add('armR', -2.7 * e, 0, 0.35 * e); this.add('elbowR', 0.1 * e - sin(t * 12) * 0.08 * e);
        this.add('armL', -2.4 * e, 0, -0.3 * e); this.add('elbowL', 0.25 * e);
        this.add('chest', -0.16 * e + 0.12 * pre); this.add('head', -0.18 * e);
        const crouch = pre * 0.35 + hop * -0.1;
        this.add('hipL', -crouch); this.add('hipR', -crouch); this.add('kneeL', crouch * 2); this.add('kneeR', crouch * 2);
        pelvisY += -pre * 0.09 + hop * 0.1;
      } else {
        const e = 1 - u;
        this.add('head', sin(u * TAU * 1.5) * 0.16 * e);
        this.add('chest', 0.03 * env(u, 0, 0.2, 0.6, 1));
      }
      if (u >= 1) this.gesture = null;
    }

    // pés planos no chão e pelve apoiada na perna mais esticada
    for (const S of ['L', 'R'] as const) { const h = this.J[`hip${S}`].t.x, kn = this.J[`knee${S}`].t.x; this.J[`ankle${S}`].t.x = -(h + kn); }
    const legH = (h: number, kn: number) => THIGH * cos(h) + SHIN * cos(h + kn);
    const drop = max(legH(this.J.hipL.t.x, this.J.kneeL.t.x), legH(this.J.hipR.t.x, this.J.kneeR.t.x)) - (THIGH + SHIN);
    this.J.pelvis.node.position.set(pelvisX, PELVIS_Y + drop + pelvisY, 0);
  }

  private integrate(dt: number) {
    const fast = this.gesture === 'wave' || this.gesture === 'cheer';
    const k = fast ? 150 : 95, c = 2 * 0.92 * Math.sqrt(k);
    const steps = dt > 1 / 90 ? 2 : 1, h = dt / steps;
    for (let s = 0; s < steps; s++) for (const n of JOINTS) {
      const j = this.J[n];
      j.vel.x += (k * (j.t.x - j.v.x) - c * j.vel.x) * h; j.v.x += j.vel.x * h;
      j.vel.y += (k * (j.t.y - j.v.y) - c * j.vel.y) * h; j.v.y += j.vel.y * h;
      j.vel.z += (k * (j.t.z - j.v.z) - c * j.vel.z) * h; j.v.z += j.vel.z * h;
    }
    for (const n of JOINTS) { const j = this.J[n]; j.node.rotation.set(j.v.x, j.v.y, j.v.z); }
  }
}
