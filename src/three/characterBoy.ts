import * as THREE from 'three';

/**
 * Procedural 3D Cartoon Character: "زيزو" (Zizo)
 * An Egyptian young schoolboy with stylized cartoon anatomy, expressive face,
 * hoodie, hair tufts, and articulated limbs for animated dialogue and comic expressions.
 */
export class CharacterBoy {
  public group: THREE.Group;

  // Hierarchical node pivots for animation
  public headGroup: THREE.Group;
  public faceGroup: THREE.Group;
  public leftEyebrow: THREE.Mesh;
  public rightEyebrow: THREE.Mesh;
  public leftEyelid: THREE.Mesh;
  public rightEyelid: THREE.Mesh;
  public mouthMesh: THREE.Mesh;
  public teethMesh: THREE.Mesh;
  public torsoGroup: THREE.Group;
  public leftArmGroup: THREE.Group;
  public rightArmGroup: THREE.Group;
  public leftForearmGroup: THREE.Group;
  public rightForearmGroup: THREE.Group;
  public pencilMesh: THREE.Mesh;
  public sweatDropMesh: THREE.Mesh; // Comic sweat drop for scene 3 punchline

  // Materials for reuse & state changes
  private skinMaterial: THREE.MeshStandardMaterial;
  private hairMaterial: THREE.MeshStandardMaterial;
  private hoodieMaterial: THREE.MeshStandardMaterial;
  private eyeMaterial: THREE.MeshStandardMaterial;
  private pupilMaterial: THREE.MeshStandardMaterial;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Zizo_Boy';

    // Materials
    this.skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfa375, // Warm Egyptian skin tone
      roughness: 0.65,
      metalness: 0.05,
    });

    this.hairMaterial = new THREE.MeshStandardMaterial({
      color: 0x221510, // Dark brown wavy Egyptian hair
      roughness: 0.85,
      metalness: 0.1,
    });

    this.hoodieMaterial = new THREE.MeshStandardMaterial({
      color: 0xe65100, // Vibrant friendly orange hoodie
      roughness: 0.8,
      metalness: 0.05,
    });

    this.eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xfdfdfd,
      roughness: 0.2,
      metalness: 0.1,
    });

    this.pupilMaterial = new THREE.MeshStandardMaterial({
      color: 0x1b130e,
      roughness: 0.1,
      metalness: 0.8,
    });

    // Torso & Chair assembly
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.set(0, 0.95, 0);

    // Hoodie Body (Rounded trapezoid feel)
    const hoodieGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.52, 16);
    const hoodieMesh = new THREE.Mesh(hoodieGeo, this.hoodieMaterial);
    hoodieMesh.castShadow = true;
    hoodieMesh.receiveShadow = true;
    this.torsoGroup.add(hoodieMesh);

    // Hoodie Pocket (Accent detail)
    const pocketGeo = new THREE.BoxGeometry(0.28, 0.14, 0.08);
    const pocketMat = new THREE.MeshStandardMaterial({
      color: 0xd84315,
      roughness: 0.85,
    });
    const pocketMesh = new THREE.Mesh(pocketGeo, pocketMat);
    pocketMesh.position.set(0, -0.1, 0.14);
    pocketMesh.rotation.x = -0.1;
    this.torsoGroup.add(pocketMesh);

    // Hoodie Drawstrings
    const stringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const stringGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.18, 8);
    const leftString = new THREE.Mesh(stringGeo, stringMat);
    leftString.position.set(-0.06, 0.12, 0.22);
    leftString.rotation.z = 0.1;
    const rightString = new THREE.Mesh(stringGeo, stringMat);
    rightString.position.set(0.06, 0.12, 0.22);
    rightString.rotation.z = -0.1;
    this.torsoGroup.add(leftString, rightString);

    // Head Group
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.35, 0.02);

    // Head Base
    const headGeo = new THREE.SphereGeometry(0.24, 24, 20);
    headGeo.scale(1, 1.1, 0.95);
    const headMesh = new THREE.Mesh(headGeo, this.skinMaterial);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Rosy Cheeks
    const cheekMat = new THREE.MeshStandardMaterial({
      color: 0xeb7c70,
      roughness: 0.7,
      transparent: true,
      opacity: 0.45,
    });
    const cheekGeo = new THREE.SphereGeometry(0.045, 12, 10);
    cheekGeo.scale(1, 0.6, 0.5);
    const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
    leftCheek.position.set(-0.14, -0.04, 0.18);
    const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
    rightCheek.position.set(0.14, -0.04, 0.18);
    this.headGroup.add(leftCheek, rightCheek);

    // Cute Egyptian boy nose
    const noseGeo = new THREE.ConeGeometry(0.035, 0.06, 12);
    const noseMesh = new THREE.Mesh(noseGeo, this.skinMaterial);
    noseMesh.rotation.x = Math.PI * 0.45;
    noseMesh.position.set(0, 0, 0.23);
    this.headGroup.add(noseMesh);

    // Ears
    const earGeo = new THREE.SphereGeometry(0.06, 12, 12);
    earGeo.scale(0.3, 0.8, 0.6);
    const leftEar = new THREE.Mesh(earGeo, this.skinMaterial);
    leftEar.position.set(-0.24, 0, 0);
    const rightEar = new THREE.Mesh(earGeo, this.skinMaterial);
    rightEar.position.set(0.24, 0, 0);
    this.headGroup.add(leftEar, rightEar);

    // Hair Assembly (Volumetric curly locks)
    const hairGroup = new THREE.Group();
    const hairBaseGeo = new THREE.SphereGeometry(0.26, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const hairBase = new THREE.Mesh(hairBaseGeo, this.hairMaterial);
    hairBase.position.set(0, 0.06, -0.02);
    hairGroup.add(hairBase);

    // Front Hair Tufts (Characteristic Egyptian schoolboy bangs)
    const tuftGeo = new THREE.ConeGeometry(0.06, 0.14, 8);
    const tuft1 = new THREE.Mesh(tuftGeo, this.hairMaterial);
    tuft1.position.set(-0.08, 0.22, 0.18);
    tuft1.rotation.set(-0.4, 0.2, -0.5);

    const tuft2 = new THREE.Mesh(tuftGeo, this.hairMaterial);
    tuft2.position.set(0.04, 0.24, 0.19);
    tuft2.rotation.set(-0.5, -0.1, 0.3);

    const tuft3 = new THREE.Mesh(tuftGeo, this.hairMaterial);
    tuft3.position.set(-0.16, 0.18, 0.15);
    tuft3.rotation.set(-0.3, 0.4, -0.8);

    const tuft4 = new THREE.Mesh(tuftGeo, this.hairMaterial);
    tuft4.position.set(0.14, 0.19, 0.15);
    tuft4.rotation.set(-0.3, -0.3, 0.6);

    hairGroup.add(tuft1, tuft2, tuft3, tuft4);
    this.headGroup.add(hairGroup);

    // Face Details Group
    this.faceGroup = new THREE.Group();
    this.faceGroup.position.set(0, 0, 0.18);

    // Left Eye
    const eyeGeo = new THREE.SphereGeometry(0.065, 16, 16);
    eyeGeo.scale(0.85, 1, 0.5);
    const leftEyeWhite = new THREE.Mesh(eyeGeo, this.eyeMaterial);
    leftEyeWhite.position.set(-0.09, 0.04, 0.04);
    const leftPupilGeo = new THREE.SphereGeometry(0.032, 12, 12);
    leftPupilGeo.scale(1, 1, 0.2);
    const leftPupil = new THREE.Mesh(leftPupilGeo, this.pupilMaterial);
    leftPupil.position.set(-0.09, 0.04, 0.07);

    // Right Eye
    const rightEyeWhite = new THREE.Mesh(eyeGeo, this.eyeMaterial);
    rightEyeWhite.position.set(0.09, 0.04, 0.04);
    const rightPupil = new THREE.Mesh(leftPupilGeo, this.pupilMaterial);
    rightPupil.position.set(0.09, 0.04, 0.07);

    // Pupil catchlights (shiny cartoon sparkle)
    const glintGeo = new THREE.SphereGeometry(0.009, 8, 8);
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const leftGlint = new THREE.Mesh(glintGeo, glintMat);
    leftGlint.position.set(-0.08, 0.055, 0.075);
    const rightGlint = new THREE.Mesh(glintGeo, glintMat);
    rightGlint.position.set(0.1, 0.055, 0.075);

    // Eyelids (for blinking animation)
    const eyelidGeo = new THREE.SphereGeometry(0.07, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
    eyelidGeo.scale(0.88, 1.02, 0.55);
    this.leftEyelid = new THREE.Mesh(eyelidGeo, this.skinMaterial);
    this.leftEyelid.position.set(-0.09, 0.05, 0.04);
    this.leftEyelid.rotation.x = -Math.PI * 0.5; // Initially open
    this.rightEyelid = new THREE.Mesh(eyelidGeo, this.skinMaterial);
    this.rightEyelid.position.set(0.09, 0.05, 0.04);
    this.rightEyelid.rotation.x = -Math.PI * 0.5;

    // Eyebrows
    const browGeo = new THREE.BoxGeometry(0.09, 0.02, 0.025);
    const browMat = new THREE.MeshStandardMaterial({ color: 0x1a0f0a, roughness: 0.9 });
    this.leftEyebrow = new THREE.Mesh(browGeo, browMat);
    this.leftEyebrow.position.set(-0.09, 0.12, 0.06);
    this.leftEyebrow.rotation.z = -0.05;

    this.rightEyebrow = new THREE.Mesh(browGeo, browMat);
    this.rightEyebrow.position.set(0.09, 0.12, 0.06);
    this.rightEyebrow.rotation.z = 0.05;

    // Animated Lipsync Mouth
    const mouthCavityGeo = new THREE.SphereGeometry(0.05, 16, 12);
    mouthCavityGeo.scale(1.2, 0.8, 0.6);
    const mouthMat = new THREE.MeshStandardMaterial({
      color: 0x4a1111,
      roughness: 0.5,
    });
    this.mouthMesh = new THREE.Mesh(mouthCavityGeo, mouthMat);
    this.mouthMesh.position.set(0, -0.11, 0.03);
    this.mouthMesh.scale.set(0.8, 0.2, 0.5); // Closed smiling mouth by default

    // Teeth bar
    const teethGeo = new THREE.BoxGeometry(0.06, 0.015, 0.02);
    const teethMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    this.teethMesh = new THREE.Mesh(teethGeo, teethMat);
    this.teethMesh.position.set(0, 0.015, 0.01);
    this.mouthMesh.add(this.teethMesh);

    this.faceGroup.add(
      leftEyeWhite,
      leftPupil,
      leftGlint,
      this.leftEyelid,
      rightEyeWhite,
      rightPupil,
      rightGlint,
      this.rightEyelid,
      this.leftEyebrow,
      this.rightEyebrow,
      this.mouthMesh
    );
    this.headGroup.add(this.faceGroup);

    // Comic Sweat Drop (Hidden until shocked scene 3 punchline!)
    const dropGeo = new THREE.ConeGeometry(0.04, 0.12, 12);
    const dropMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    this.sweatDropMesh = new THREE.Mesh(dropGeo, dropMat);
    this.sweatDropMesh.rotation.z = Math.PI;
    this.sweatDropMesh.position.set(0.24, 0.12, 0.12);
    this.sweatDropMesh.visible = false;
    this.headGroup.add(this.sweatDropMesh);

    this.torsoGroup.add(this.headGroup);

    // Left Arm Hierarchy
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.24, 0.16, 0);
    const leftShoulderGeo = new THREE.SphereGeometry(0.07, 12, 12);
    const leftShoulder = new THREE.Mesh(leftShoulderGeo, this.hoodieMaterial);
    this.leftArmGroup.add(leftShoulder);

    const leftUpperArmGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.22, 12);
    const leftUpperArm = new THREE.Mesh(leftUpperArmGeo, this.hoodieMaterial);
    leftUpperArm.position.set(0, -0.11, 0);
    this.leftArmGroup.add(leftUpperArm);

    this.leftForearmGroup = new THREE.Group();
    this.leftForearmGroup.position.set(0, -0.22, 0);
    const leftForearmGeo = new THREE.CylinderGeometry(0.05, 0.045, 0.2, 12);
    const leftForearm = new THREE.Mesh(leftForearmGeo, this.hoodieMaterial);
    leftForearm.position.set(0, -0.1, 0);
    this.leftForearmGroup.add(leftForearm);

    const leftHandGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const leftHand = new THREE.Mesh(leftHandGeo, this.skinMaterial);
    leftHand.position.set(0, -0.21, 0);
    this.leftForearmGroup.add(leftHand);

    this.leftArmGroup.add(this.leftForearmGroup);
    this.torsoGroup.add(this.leftArmGroup);

    // Right Arm Hierarchy (Writing / gesturing arm)
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.24, 0.16, 0);
    const rightShoulder = new THREE.Mesh(leftShoulderGeo, this.hoodieMaterial);
    this.rightArmGroup.add(rightShoulder);

    const rightUpperArm = new THREE.Mesh(leftUpperArmGeo, this.hoodieMaterial);
    rightUpperArm.position.set(0, -0.11, 0);
    this.rightArmGroup.add(rightUpperArm);

    this.rightForearmGroup = new THREE.Group();
    this.rightForearmGroup.position.set(0, -0.22, 0);
    const rightForearm = new THREE.Mesh(leftForearmGeo, this.hoodieMaterial);
    rightForearm.position.set(0, -0.1, 0);
    this.rightForearmGroup.add(rightForearm);

    const rightHand = new THREE.Mesh(leftHandGeo, this.skinMaterial);
    rightHand.position.set(0, -0.21, 0);
    this.rightForearmGroup.add(rightHand);

    // Yellow Pencil in right hand
    const pencilGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.16, 8);
    const pencilMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    this.pencilMesh = new THREE.Mesh(pencilGeo, pencilMat);
    this.pencilMesh.position.set(0.03, -0.2, 0.04);
    this.pencilMesh.rotation.set(0.4, 0, 0.6);
    this.rightForearmGroup.add(this.pencilMesh);

    this.rightArmGroup.add(this.rightForearmGroup);
    this.torsoGroup.add(this.rightArmGroup);

    // Ergonomic Desk Chair (Egyptian study room swivel chair)
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0, 0, 0);

    const cushionGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 20);
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.1,
    });
    const seatCushion = new THREE.Mesh(cushionGeo, cushionMat);
    seatCushion.position.set(0, 0.58, 0.04);
    seatCushion.castShadow = true;
    chairGroup.add(seatCushion);

    // Chair Backrest
    const backGeo = new THREE.BoxGeometry(0.44, 0.45, 0.06);
    const chairBack = new THREE.Mesh(backGeo, cushionMat);
    chairBack.position.set(0, 0.95, -0.22);
    chairBack.rotation.x = -0.05;
    chairBack.castShadow = true;
    chairGroup.add(chairBack);

    // Chair stem & base
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.9,
      roughness: 0.15,
    });
    const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.55, 12);
    const stem = new THREE.Mesh(stemGeo, chromeMat);
    stem.position.set(0, 0.28, 0);
    chairGroup.add(stem);

    // Swivel star legs
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const legGeo = new THREE.BoxGeometry(0.04, 0.03, 0.28);
      const leg = new THREE.Mesh(legGeo, chromeMat);
      leg.position.set(Math.sin(angle) * 0.15, 0.04, Math.cos(angle) * 0.15);
      leg.rotation.y = angle;
      chairGroup.add(leg);
    }

    // Boy's Denim Pants / Legs sitting on chair
    const denimMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Classic blue jeans
      roughness: 0.8,
    });
    const thighGeo = new THREE.CylinderGeometry(0.085, 0.08, 0.38, 12);
    const leftThigh = new THREE.Mesh(thighGeo, denimMat);
    leftThigh.position.set(-0.12, 0.6, 0.18);
    leftThigh.rotation.x = Math.PI * 0.48;

    const rightThigh = new THREE.Mesh(thighGeo, denimMat);
    rightThigh.position.set(0.12, 0.6, 0.18);
    rightThigh.rotation.x = Math.PI * 0.48;

    // Shin / Lower legs
    const shinGeo = new THREE.CylinderGeometry(0.075, 0.07, 0.35, 12);
    const leftShin = new THREE.Mesh(shinGeo, denimMat);
    leftShin.position.set(-0.12, 0.35, 0.34);

    const rightShin = new THREE.Mesh(shinGeo, denimMat);
    rightShin.position.set(0.12, 0.35, 0.34);

    // Red Sneakers
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
    const shoeGeo = new THREE.BoxGeometry(0.09, 0.07, 0.16);
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(-0.12, 0.18, 0.38);

    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0.12, 0.18, 0.38);

    this.group.add(chairGroup, leftThigh, rightThigh, leftShin, rightShin, leftShoe, rightShoe, this.torsoGroup);

    // Initial pose: Sitting at desk
    this.group.position.set(0, 0, 0.55);
  }

  /**
   * Update Zizo's animated transforms, mouth lipsync, and facial expressions
   */
  public updatePose(
    t: number,
    state: {
      headTiltX: number;
      headTiltY: number;
      headTiltZ?: number;
      leftArmAngle: number;
      rightArmAngle: number;
      mouthOpen: number;
      eyebrowRaise: number;
      eyesBlink: number;
      sweatDrop: boolean;
      pencilDropped: boolean;
    }
  ) {
    // Subtle idle breathing motion
    const breath = Math.sin(t * 2.2) * 0.015;
    this.torsoGroup.position.y = 0.95 + breath;

    // Head rotation
    this.headGroup.rotation.x = state.headTiltX;
    this.headGroup.rotation.y = state.headTiltY;
    this.headGroup.rotation.z = (state.headTiltZ || 0) + Math.sin(t * 1.5) * 0.01;

    // Arm gestures
    this.leftArmGroup.rotation.x = state.leftArmAngle;
    this.rightArmGroup.rotation.x = state.rightArmAngle;

    // Eyebrows
    this.leftEyebrow.position.y = 0.12 + state.eyebrowRaise * 0.035;
    this.rightEyebrow.position.y = 0.12 + state.eyebrowRaise * 0.035;
    this.leftEyebrow.rotation.z = -0.05 + state.eyebrowRaise * 0.1;
    this.rightEyebrow.rotation.z = 0.05 - state.eyebrowRaise * 0.1;

    // Eyelids (Blink)
    const eyelidAngle = -Math.PI * 0.5 + state.eyesBlink * (Math.PI * 0.5);
    this.leftEyelid.rotation.x = eyelidAngle;
    this.rightEyelid.rotation.x = eyelidAngle;

    // Mouth Lipsync
    const open = Math.max(0.1, state.mouthOpen);
    this.mouthMesh.scale.set(0.8 + open * 0.4, 0.15 + open * 0.75, 0.5 + open * 0.3);

    // Comic sweat drop
    this.sweatDropMesh.visible = state.sweatDrop;
    if (state.sweatDrop) {
      this.sweatDropMesh.position.y = 0.12 - (t * 0.8 % 0.15);
    }

    // Pencil drop comic animation
    if (state.pencilDropped) {
      this.pencilMesh.position.set(0.1, -0.35, 0.2);
      this.pencilMesh.rotation.set(1.5, 0.2, 0.4);
    } else {
      this.pencilMesh.position.set(0.03, -0.2, 0.04);
      this.pencilMesh.rotation.set(0.4, 0, 0.6);
    }
  }
}
