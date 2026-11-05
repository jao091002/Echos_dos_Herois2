import * as THREE from 'three';
import type { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/*
 * Encaixe de um modelo esqueletal (glTF com esqueleto Mixamo ou Biped) em um rig procedural simples.
 * As juntas do rig (grupos Three.js que "penduram" em -Y e olham para +Z) ditam a rotação de cada osso do modelo:
 * o modelo é endireitado para a pose neutra, escalado pelo comprimento da perna e apoiado no rig.
 * Usado pelos inimigos humanoides (bandidos). Mesmo método do encaixe da heroína.
 */

export type RigJoints = {
  pelvis: THREE.Object3D; chest: THREE.Object3D; head: THREE.Object3D;
  armL: THREE.Object3D; elbowL: THREE.Object3D; wristL: THREE.Object3D;
  armR: THREE.Object3D; elbowR: THREE.Object3D; wristR: THREE.Object3D;
  hipL: THREE.Object3D; kneeL: THREE.Object3D; ankleL: THREE.Object3D;
  hipR: THREE.Object3D; kneeR: THREE.Object3D; ankleR: THREE.Object3D;
};
export type Retarget = { update: () => void; holder: THREE.Object3D };

const BIPED: Record<string, string> = {
  pelvis: 'Hips', spine: 'Spine', spine1: 'Spine1', spine2: 'Spine2', neck: 'Neck', head: 'Head',
  l_clavicle: 'LeftShoulder', l_upperarm: 'LeftArm', l_forearm: 'LeftForeArm', l_hand: 'LeftHand', l_thigh: 'LeftUpLeg', l_calf: 'LeftLeg', l_foot: 'LeftFoot', l_toe0: 'LeftToeBase',
  r_clavicle: 'RightShoulder', r_upperarm: 'RightArm', r_forearm: 'RightForeArm', r_hand: 'RightHand', r_thigh: 'RightUpLeg', r_calf: 'RightLeg', r_foot: 'RightFoot', r_toe0: 'RightToeBase',
};
const boneKey = (n: string) => { const k = n.replace(/^mixamorig[:_]?/, '').replace(/_\d+$/, ''), m = /^bip001_(.+)$/.exec(k); return m && BIPED[m[1]] ? BIPED[m[1]] : k; };

/** Materiais antigos "specular-glossiness" (exportações do Sketchfab): converte a textura difusa em mapa de cor. */
export function registerSpecGloss(loader: GLTFLoader) {
  loader.register(parser => ({
    name: 'KHR_materials_pbrSpecularGlossiness',
    getMaterialType: (index: number) => parser.json.materials?.[index]?.extensions?.KHR_materials_pbrSpecularGlossiness ? THREE.MeshStandardMaterial : null,
    extendMaterialParams: (index: number, params: Record<string, unknown>) => {
      const ext = parser.json.materials?.[index]?.extensions?.KHR_materials_pbrSpecularGlossiness;
      if (!ext) return Promise.resolve();
      if (ext.diffuseFactor) { params.color = new THREE.Color().setRGB(ext.diffuseFactor[0], ext.diffuseFactor[1], ext.diffuseFactor[2]); params.opacity = ext.diffuseFactor[3]; }
      params.roughness = 1 - (ext.glossinessFactor ?? 0.4) * 0.6; params.metalness = 0;
      return ext.diffuseTexture ? parser.assignTexture(params, 'map', ext.diffuseTexture, THREE.SRGBColorSpace) : Promise.resolve();
    },
  }));
}

type XNode = { bone: THREE.Object3D; rootQ: THREE.Quaternion | null; parentIdx: number; joint: THREE.Object3D | null; rest: THREE.Quaternion; Rc: THREE.Quaternion; D: THREE.Quaternion };

/**
 * frame: objeto cujo espaço local é o "espaço do corpo" (o root do inimigo); model: cena clonada do glTF;
 * legLen: comprimento da perna do rig (quadril→tornozelo) para escalar o modelo.
 */
export function retargetModel(frame: THREE.Object3D, model: THREE.Object3D, joints: RigJoints, legLen: number): Retarget | null {
  const holder = new THREE.Group(); holder.name = 'retarget-holder'; holder.add(model); frame.add(holder);
  const byName: Record<string, THREE.Bone> = {};
  model.traverse(o => { if ((o as THREE.Bone).isBone) { const k = boneKey(o.name); if (!byName[k]) byName[k] = o as THREE.Bone; } });
  for (const k of ['Hips', 'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase', 'RightToeBase', 'RightFoot', 'LeftArm', 'RightArm']) if (!byName[k]) { frame.remove(holder); return null; }
  const v = new THREE.Vector3();
  const local = (n: string) => { frame.updateWorldMatrix(true, true); return frame.worldToLocal(byName[n].getWorldPosition(v.clone())); };

  // frente do modelo = +Z (média dos dois pés), escala pela perna real
  const toeL = local('LeftToeBase').sub(local('LeftFoot')), toeR = local('RightToeBase').sub(local('RightFoot'));
  holder.rotation.y = -Math.atan2(toeL.x + toeR.x, toeL.z + toeR.z);
  const modelLeg = local('LeftUpLeg').distanceTo(local('LeftLeg')) + local('LeftLeg').distanceTo(local('LeftFoot'));
  holder.scale.setScalar(legLen / Math.max(0.01, modelLeg));
  holder.updateMatrixWorld(true);

  const leftIsNeg = local('LeftArm').x < 0, sideL = leftIsNeg ? 'Left' : 'Right', sideR = leftIsNeg ? 'Right' : 'Left';
  const MAP: Record<string, THREE.Object3D> = {
    Hips: joints.pelvis, Spine2: joints.chest, Head: joints.head,
    [`${sideL}Arm`]: joints.armL, [`${sideL}ForeArm`]: joints.elbowL, [`${sideL}Hand`]: joints.wristL,
    [`${sideR}Arm`]: joints.armR, [`${sideR}ForeArm`]: joints.elbowR, [`${sideR}Hand`]: joints.wristR,
    [`${sideL}UpLeg`]: joints.hipL, [`${sideL}Leg`]: joints.kneeL, [`${sideL}Foot`]: joints.ankleL,
    [`${sideR}UpLeg`]: joints.hipR, [`${sideR}Leg`]: joints.kneeR, [`${sideR}Foot`]: joints.ankleR,
  };

  frame.updateWorldMatrix(true, true);
  const frameQI = frame.getWorldQuaternion(new THREE.Quaternion()).invert();
  const wq = (o: THREE.Object3D) => frameQI.clone().multiply(o.getWorldQuaternion(new THREE.Quaternion()));
  const DOWN = new THREE.Vector3(0, -1, 0), UPV = new THREE.Vector3(0, 1, 0);
  const toward = (from: string, to: string, target: THREE.Vector3) => {
    if (!byName[from] || !byName[to]) return null;
    const d = local(to).sub(local(from)); if (d.lengthSq() < 1e-8) return null;
    return new THREE.Quaternion().setFromUnitVectors(d.normalize(), target);
  };
  const yawFix = (foot: string, toe: string) => {
    if (!byName[foot] || !byName[toe]) return null;
    const d = local(toe).sub(local(foot)); if (Math.hypot(d.x, d.z) < 1e-5) return null;
    return new THREE.Quaternion().setFromAxisAngle(UPV, -Math.atan2(d.x, d.z));
  };
  const straighten = (key: string): THREE.Quaternion | null => {
    switch (key) {
      case 'Hips': return toward('Hips', 'Spine', UPV);
      case 'Spine': return toward('Spine', 'Spine1', UPV) ?? toward('Spine', 'Spine2', UPV);
      case 'Spine1': return toward('Spine1', 'Spine2', UPV);
      case 'Spine2': return toward('Spine2', 'Neck', UPV);
      case 'Neck': return toward('Neck', 'Head', UPV);
      case 'LeftShoulder': return toward('LeftShoulder', 'LeftArm', new THREE.Vector3(Math.sign(local('LeftArm').x) || 1, 0, 0));
      case 'RightShoulder': return toward('RightShoulder', 'RightArm', new THREE.Vector3(Math.sign(local('RightArm').x) || -1, 0, 0));
      case 'LeftArm': return toward('LeftArm', 'LeftForeArm', DOWN);
      case 'LeftForeArm': return toward('LeftForeArm', 'LeftHand', DOWN);
      case 'RightArm': return toward('RightArm', 'RightForeArm', DOWN);
      case 'RightForeArm': return toward('RightForeArm', 'RightHand', DOWN);
      case 'LeftUpLeg': return toward('LeftUpLeg', 'LeftLeg', DOWN);
      case 'LeftLeg': return toward('LeftLeg', 'LeftFoot', DOWN);
      case 'RightUpLeg': return toward('RightUpLeg', 'RightLeg', DOWN);
      case 'RightLeg': return toward('RightLeg', 'RightFoot', DOWN);
      case 'LeftFoot': return yawFix('LeftFoot', 'LeftToeBase');
      case 'RightFoot': return yawFix('RightFoot', 'RightToeBase');
      default: return null;
    }
  };

  const nodes: XNode[] = [], idxOf = new Map<THREE.Object3D, number>(), oacc: THREE.Quaternion[] = [];
  model.traverse(o => {
    if (o === model || (o as THREE.Mesh).isMesh) return;
    const key = (o as THREE.Bone).isBone ? boneKey(o.name) : '', pIdx = idxOf.has(o.parent!) ? idxOf.get(o.parent!)! : -1;
    const own = straighten(key), acc = own ?? (pIdx >= 0 ? oacc[pIdx].clone() : new THREE.Quaternion());
    idxOf.set(o, nodes.length); oacc.push(acc);
    nodes.push({ bone: o, rootQ: pIdx < 0 ? wq(o.parent!) : null, parentIdx: pIdx, joint: MAP[key] ?? null, rest: acc.clone().multiply(wq(o)), Rc: new THREE.Quaternion(), D: new THREE.Quaternion() });
  });

  const qI = new THREE.Quaternion(), qx = new THREE.Quaternion(), e = new THREE.Euler();
  const pose = () => {
    for (const n of nodes) {
      const pR = n.parentIdx >= 0 ? nodes[n.parentIdx].Rc : qI.identity(), pD = n.parentIdx >= 0 ? nodes[n.parentIdx].D : n.rootQ!;
      if (n.joint) { const r = n.joint.rotation; e.set(r.x, r.y, r.z, r.order); qx.setFromEuler(e); } else qx.identity();
      n.Rc.copy(pR).multiply(qx); n.D.copy(n.Rc).multiply(n.rest);
      n.bone.quaternion.copy(pD).invert().multiply(n.D);
    }
  };

  // posição de repouso do quadril do modelo (com o holder na origem) e apoio da sola
  holder.position.set(0, 0, 0);
  const saved = [joints.pelvis, joints.chest, joints.head, joints.armL, joints.elbowL, joints.wristL, joints.armR, joints.elbowR, joints.wristR, joints.hipL, joints.kneeL, joints.ankleL, joints.hipR, joints.kneeR, joints.ankleR].map(j => j.rotation.clone());
  const all = [joints.pelvis, joints.chest, joints.head, joints.armL, joints.elbowL, joints.wristL, joints.armR, joints.elbowR, joints.wristR, joints.hipL, joints.kneeL, joints.ankleL, joints.hipR, joints.kneeR, joints.ankleR];
  all.forEach(j => j.rotation.set(0, 0, 0)); pose(); frame.updateWorldMatrix(true, true);
  const hipsAt = local('Hips');
  all.forEach((j, i) => j.rotation.copy(saved[i]));

  return {
    holder,
    update() {
      pose();
      // o quadril do modelo acompanha a pelve do rig (balanço, queda ao morrer, recuo nos golpes)
      holder.position.set(joints.pelvis.position.x - hipsAt.x, joints.pelvis.position.y - hipsAt.y, joints.pelvis.position.z - hipsAt.z);
    },
  };
}
