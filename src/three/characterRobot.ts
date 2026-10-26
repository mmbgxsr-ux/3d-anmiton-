import * as THREE from 'three';

/**
 * Procedural 3D Cartoon Character: "روبي" (Roby 3000)
 * A sleek, high-tech metallic blue robot companion with floating magnetic head,
 * digital LED visor eyes, glowing chest reactor, animated arms, and homework scanner.
 */
export class CharacterRobot {
  public group: THREE.Group;

  // Nodes for animation
  public hoverGroup: THREE.Group;
  public headGroup: THREE.Group;
  public visorMesh: THREE.Mesh;
  public leftArmGroup: THREE.Group;
  public rightArmGroup: THREE.Group;
  public antennaOrb: THREE.Mesh;
  public chestCore: THREE.Mesh;
  public scannerBeamGroup: THREE.Group;
  public scannerLight: THREE.SpotLight;
  public shadowMesh: THREE.Mesh;

  // Materials & Procedural Canvas Texture for LED Eyes
  private eyeCanvas: HTMLCanvasElement;
  private eyeCtx: CanvasRenderingContext2D;
  private eyeTexture: THREE.CanvasTexture;
  private robotMetallicMat: THREE.MeshStandardMaterial;
  private robotAccentMat: THREE.MeshStandardMaterial;
  private glowCyanMat: THREE.MeshBasicMaterial;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Roby_Robot';

    // Materials per Three.js PBR directives
    this.robotMetallicMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Vibrant sci-fi metallic blue
      metalness: 0.85,
      roughness: 0.18,
    });

    this.robotAccentMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Crisp white ceramic / aerospace trim
      metalness: 0.2,
      roughness: 0.35,
    });

    this.glowCyanMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    // Master hover group (floats and bobs smoothly)
    this.hoverGroup = new THREE.Group();
    this.group.add(this.hoverGroup);

    // Main Torso / Chassis
    const torsoGeo = new THREE.SphereGeometry(0.2, 24, 20);
    torsoGeo.scale(1, 1.15, 0.95);
    const torsoMesh = new THREE.Mesh(torsoGeo, this.robotMetallicMat);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    this.hoverGroup.add(torsoMesh);

    // White Chest Plate / Trim
    const chestPlateGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.18, 16);
    const chestPlate = new THREE.Mesh(chestPlateGeo, this.robotAccentMat);
    chestPlate.position.set(0, 0.02, 0.06);
    chestPlate.rotation.x = 0.2;
    this.hoverGroup.add(chestPlate);

    // Glowing Chest Core / Energy Reactor
    const coreGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00c8e0,
      emissiveIntensity: 1.5,
      roughness: 0.1,
    });
    this.chestCore = new THREE.Mesh(coreGeo, coreMat);
    this.chestCore.position.set(0, 0.04, 0.15);
    this.chestCore.rotation.x = Math.PI * 0.45;
    this.hoverGroup.add(this.chestCore);

    // Hover Thruster Bell / Base
    const thrusterGeo = new THREE.ConeGeometry(0.12, 0.1, 16);
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.2,
    });
    const thrusterMesh = new THREE.Mesh(thrusterGeo, darkMetalMat);
    thrusterMesh.position.set(0, -0.22, 0);
    this.hoverGroup.add(thrusterMesh);

    // Thruster Blue Glow Ring
    const ringGeo = new THREE.TorusGeometry(0.09, 0.015, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const thrustRing = new THREE.Mesh(ringGeo, ringMat);
    thrustRing.rotation.x = Math.PI * 0.5;
    thrustRing.position.set(0, -0.26, 0);
    this.hoverGroup.add(thrustRing);

    // Floating Magnetic Head Group
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.32, 0);

    // Head Shell (Pill / rounded cube shape)
    const headGeo = new THREE.SphereGeometry(0.18, 24, 20);
    headGeo.scale(1.15, 1, 1.05);
    const headMesh = new THREE.Mesh(headGeo, this.robotMetallicMat);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Head Top Antenna
    const stalkGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.14, 8);
    const stalkMesh = new THREE.Mesh(stalkGeo, darkMetalMat);
    stalkMesh.position.set(0, 0.22, 0);
    this.headGroup.add(stalkMesh);

    const orbGeo = new THREE.SphereGeometry(0.035, 16, 16);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xf97316,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });
    this.antennaOrb = new THREE.Mesh(orbGeo, orbMat);
    this.antennaOrb.position.set(0, 0.3, 0);
    this.headGroup.add(this.antennaOrb);

    // Procedural Dynamic Eye Texture on Visor
    this.eyeCanvas = document.createElement('canvas');
    this.eyeCanvas.width = 512;
    this.eyeCanvas.height = 256;
    this.eyeCtx = this.eyeCanvas.getContext('2d')!;
    this.eyeTexture = new THREE.CanvasTexture(this.eyeCanvas);
    this.eyeTexture.colorSpace = THREE.SRGBColorSpace;
    this.drawVisorEyes('happy');

    // Dark Visor Face Screen
    const visorGeo = new THREE.SphereGeometry(0.17, 24, 16, 0, Math.PI, 0, Math.PI * 0.65);
    visorGeo.scale(1.08, 0.85, 0.98);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x050b14,
      metalness: 0.3,
      roughness: 0.1,
      map: this.eyeTexture,
      emissive: 0xffffff,
      emissiveMap: this.eyeTexture,
      emissiveIntensity: 1.4,
    });
    this.visorMesh = new THREE.Mesh(visorGeo, visorMat);
    this.visorMesh.rotation.y = -Math.PI * 0.5;
    this.visorMesh.position.set(0, 0.02, 0.06);
    this.headGroup.add(this.visorMesh);

    this.hoverGroup.add(this.headGroup);

    // Floating Magnetic Arms
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.25, 0.08, 0);
    this.leftArmGroup.add(this.createRobotArmMesh());
    this.hoverGroup.add(this.leftArmGroup);

    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.25, 0.08, 0);
    this.rightArmGroup.scale.x = -1; // Mirror for right arm
    this.rightArmGroup.add(this.createRobotArmMesh());
    this.hoverGroup.add(this.rightArmGroup);

    // Holographic Scanner Beam (Projects onto the notebook in scene 3!)
    this.scannerBeamGroup = new THREE.Group();
    this.scannerBeamGroup.position.set(0, -0.05, 0.1);

    const beamConeGeo = new THREE.ConeGeometry(0.35, 0.8, 16, 1, true);
    const beamConeMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const beamCone = new THREE.Mesh(beamConeGeo, beamConeMat);
    beamCone.position.set(0, -0.4, 0.35);
    beamCone.rotation.x = Math.PI * 0.7;
    this.scannerBeamGroup.add(beamCone);

    this.scannerLight = new THREE.SpotLight(0x00ffff, 4, 2, Math.PI * 0.3, 0.5);
    this.scannerLight.position.set(0, 0, 0);
    this.scannerLight.target.position.set(0, -0.8, 0.5);
    this.scannerBeamGroup.add(this.scannerLight);
    this.scannerBeamGroup.add(this.scannerLight.target);
    this.scannerBeamGroup.visible = false;
    this.hoverGroup.add(this.scannerBeamGroup);

    // Soft Radial Hover Shadow on the desk
    const shadowGeo = new THREE.PlaneGeometry(0.45, 0.45);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0,0,0,0.45)');
    grad.addColorStop(0.6, 'rgba(0,0,0,0.18)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.rotation.x = -Math.PI * 0.5;
    this.shadowMesh.position.set(0, 0.81, 0); // Sits on desk surface
    this.group.add(this.shadowMesh);

    // Initial position
    this.group.position.set(0.45, 0.82, -0.05);
  }

  private createRobotArmMesh(): THREE.Group {
    const arm = new THREE.Group();

    // Floating magnetic joint sphere
    const jointGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const joint = new THREE.Mesh(jointGeo, this.robotAccentMat);
    arm.add(joint);

    // Upper arm
    const upperGeo = new THREE.CylinderGeometry(0.025, 0.02, 0.14, 12);
    const upper = new THREE.Mesh(upperGeo, this.robotMetallicMat);
    upper.position.set(0, -0.08, 0);
    arm.add(upper);

    // Clamp Hand (Cute 2-prong claw)
    const clampBaseGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.03, 12);
    const clampBase = new THREE.Mesh(clampBaseGeo, this.robotAccentMat);
    clampBase.position.set(0, -0.17, 0);
    arm.add(clampBase);

    const fingerGeo = new THREE.BoxGeometry(0.015, 0.04, 0.015);
    const finger1 = new THREE.Mesh(fingerGeo, this.glowCyanMat);
    finger1.position.set(0.02, -0.2, 0);
    const finger2 = new THREE.Mesh(fingerGeo, this.glowCyanMat);
    finger2.position.set(-0.02, -0.2, 0);
    arm.add(finger1, finger2);

    return arm;
  }

  /**
   * Draw Expressive LED Screen Eyes on procedural canvas texture
   */
  public drawVisorEyes(pattern: 'happy' | 'neutral' | 'scanning' | 'question' | 'wink' | 'blink') {
    const ctx = this.eyeCtx;
    ctx.clearRect(0, 0, 512, 256);

    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = '#00f5ff';
    ctx.fillStyle = '#00f5ff';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 18;

    const leftX = 170;
    const rightX = 342;
    const cy = 128;

    if (pattern === 'happy') {
      // Cheerful curved arcs (^ ^)
      ctx.beginPath();
      ctx.arc(leftX, cy + 20, 45, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(rightX, cy + 20, 45, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    } else if (pattern === 'neutral') {
      // Big friendly oval eyes
      ctx.beginPath();
      ctx.ellipse(leftX, cy, 32, 48, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(rightX, cy, 32, 48, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (pattern === 'question') {
      // Comedic question mark eye (? ?)
      ctx.font = 'bold 96px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', leftX, cy);
      ctx.fillText('?', rightX, cy);
    } else if (pattern === 'wink') {
      // Left eye open, right eye winking
      ctx.beginPath();
      ctx.ellipse(leftX, cy, 34, 48, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(rightX, cy + 15, 40, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
    } else if (pattern === 'scanning') {
      // High-tech scanning bar
      ctx.fillStyle = '#00f5ff';
      ctx.fillRect(100, cy - 10, 312, 20);
      ctx.fillRect(leftX - 30, cy - 35, 60, 70);
      ctx.fillRect(rightX - 30, cy - 35, 60, 70);
    } else if (pattern === 'blink') {
      // Closed horizontal slit
      ctx.beginPath();
      ctx.moveTo(leftX - 35, cy);
      ctx.lineTo(leftX + 35, cy);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rightX - 35, cy);
      ctx.lineTo(rightX + 35, cy);
      ctx.stroke();
    }

    this.eyeTexture.needsUpdate = true;
  }

  /**
   * Update Roby's hovering, head gestures, and animation state
   */
  public updatePose(
    t: number,
    state: {
      visible: boolean;
      posX: number;
      posY: number;
      posZ: number;
      rotX: number;
      rotY: number;
      rotZ: number;
      headTiltY: number;
      leftArmAngle: number;
      rightArmAngle: number;
      scannerActive: boolean;
      eyePattern: 'happy' | 'neutral' | 'scanning' | 'question' | 'wink' | 'blink';
    }
  ) {
    this.group.visible = state.visible;
    if (!state.visible) return;

    // Hover floating sine wave
    const hoverOffset = Math.sin(t * 3.5) * 0.04;
    this.hoverGroup.position.y = 0.35 + hoverOffset;
    this.hoverGroup.rotation.z = Math.sin(t * 2.8) * 0.05;

    // Translation & overall rotation
    this.group.position.set(state.posX, state.posY, state.posZ);
    this.group.rotation.set(state.rotX, state.rotY, state.rotZ);

    // Head rotation
    this.headGroup.rotation.y = state.headTiltY + Math.sin(t * 2.0) * 0.04;
    this.headGroup.rotation.x = Math.sin(t * 1.8) * 0.03;

    // Arms
    this.leftArmGroup.rotation.x = state.leftArmAngle;
    this.rightArmGroup.rotation.x = state.rightArmAngle;

    // Antenna pulse
    const orbMat = this.antennaOrb.material as THREE.MeshStandardMaterial;
    orbMat.emissiveIntensity = 1.0 + Math.sin(t * 6) * 0.6;

    // Scanner
    this.scannerBeamGroup.visible = state.scannerActive;
    if (state.scannerActive) {
      this.scannerLight.intensity = 4 + Math.sin(t * 12) * 1.5;
    }

    // Shadow scale with hover
    const shadowScale = 1.0 - hoverOffset * 2.0;
    this.shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
    this.shadowMesh.position.set(0, 0.01 - hoverOffset, 0);
  }
}
