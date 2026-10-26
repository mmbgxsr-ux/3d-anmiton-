import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EgyptianRoom } from './egyptianRoom';
import { CharacterBoy } from './characterBoy';
import { CharacterRobot } from './characterRobot';
import { AnimationDirector, EvaluatedSceneState } from './animationDirector';
import { CameraViewMode } from '../types';

// Pre-allocated scratch objects for zero GC per frame
const _camPos = new THREE.Vector3();
const _camTarget = new THREE.Vector3();

export class SceneManager {
  private container: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private isSoftwareGl: boolean;

  // Scene entities
  public room: EgyptianRoom;
  public boy: CharacterBoy;
  public robot: CharacterRobot;
  public director: AnimationDirector;

  // Sparkle particle burst for Roby's teleport
  private sparkleParticles: THREE.Points;
  private sparklePositions: Float32Array;

  // Camera animation & damping state
  private currentCamPos = new THREE.Vector3(0, 1.35, 1.75);
  private currentCamTarget = new THREE.Vector3(0, 1.0, 0.15);
  public cameraMode: CameraViewMode = 'cinematic';

  // Manual orbit controls state
  private isDragging = false;
  private orbitSpherical = { radius: 1.8, phi: Math.PI * 0.35, theta: 0 };
  private prevMouse = { x: 0, y: 0 };

  // Loop & timing
  private frameId: number = 0;
  private clock = new THREE.Clock();
  public currentTime = 0;
  public isPlaying = true;
  public playbackSpeed = 1.0;
  public onTimeUpdate?: (time: number, sceneId: number) => void;

  constructor(container: HTMLDivElement) {
    this.container = container;

    // 1. Detect software WebGL per Three.js directives
    this.isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Renderer configuration
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    // 3. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090d16);
    this.scene.fog = new THREE.FogExp2(0x090d16, 0.08);

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    this.camera.position.copy(this.currentCamPos);
    this.camera.lookAt(this.currentCamTarget);

    // 4. Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting Rig (Key, Fill, Rim)
    // Key Light: Warm amber directional light
    const keyLight = new THREE.DirectionalLight(0xfff1e6, 3.2);
    keyLight.position.set(2.5, 3.8, 2.5);
    keyLight.castShadow = !this.isSoftwareGl;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 10;
    keyLight.shadow.camera.left = -2.2;
    keyLight.shadow.camera.right = 2.2;
    keyLight.shadow.camera.top = 2.2;
    keyLight.shadow.camera.bottom = -2.2;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    this.scene.add(keyLight);

    // Fill Light: Cool sky hemisphere light
    const fillLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 0.95);
    this.scene.add(fillLight);

    // Rim Light: Cool blue backlight highlighting character silhouettes
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(-2.5, 2.8, -2.0);
    this.scene.add(rimLight);

    // 6. Instantiate 3D Subjects
    this.room = new EgyptianRoom();
    this.boy = new CharacterBoy();
    this.robot = new CharacterRobot();
    this.director = new AnimationDirector();

    this.scene.add(this.room.group);
    this.scene.add(this.boy.group);
    this.scene.add(this.robot.group);

    // 7. Teleport Magic Particles
    const particleCount = 120;
    const pGeo = new THREE.BufferGeometry();
    this.sparklePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      this.sparklePositions[i * 3] = (Math.random() - 0.5) * 0.8;
      this.sparklePositions[i * 3 + 1] = Math.random() * 0.8;
      this.sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(this.sparklePositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.sparkleParticles = new THREE.Points(pGeo, pMat);
    this.sparkleParticles.position.set(0.45, 0.9, -0.05);
    this.scene.add(this.sparkleParticles);

    // Bind event handlers
    this.initInteractionHandlers();
    this.onResize();
    window.addEventListener('resize', this.onResize);

    // Start render loop
    this.startLoop();
  }

  private initInteractionHandlers() {
    const el = this.renderer.domElement;

    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMouse.x = e.clientX;
      this.prevMouse.y = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevMouse.x;
      const dy = e.clientY - this.prevMouse.y;
      this.prevMouse.x = e.clientX;
      this.prevMouse.y = e.clientY;

      if (this.cameraMode === 'orbit') {
        this.orbitSpherical.theta -= dx * 0.008;
        this.orbitSpherical.phi = Math.max(0.1, Math.min(Math.PI * 0.48, this.orbitSpherical.phi + dy * 0.008));
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    el.addEventListener('wheel', (e) => {
      if (this.cameraMode === 'orbit') {
        e.preventDefault();
        this.orbitSpherical.radius = Math.max(0.8, Math.min(4.5, this.orbitSpherical.radius + e.deltaY * 0.002));
      }
    }, { passive: false });

    // Touch support for mobile / tablets
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMouse.x = e.touches[0].clientX;
        this.prevMouse.y = e.touches[0].clientY;
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - this.prevMouse.x;
      const dy = e.touches[0].clientY - this.prevMouse.y;
      this.prevMouse.x = e.touches[0].clientX;
      this.prevMouse.y = e.touches[0].clientY;

      if (this.cameraMode === 'orbit') {
        this.orbitSpherical.theta -= dx * 0.008;
        this.orbitSpherical.phi = Math.max(0.1, Math.min(Math.PI * 0.48, this.orbitSpherical.phi + dy * 0.008));
      }
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  public onResize = () => {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public seek(seconds: number) {
    this.currentTime = Math.max(0, Math.min(30, seconds));
    this.director.resetTriggers();
    this.updateSceneState(0);
  }

  public play() {
    this.isPlaying = true;
    this.clock.start();
  }

  public pause() {
    this.isPlaying = false;
    this.director.resetTriggers();
  }

  public restart() {
    this.seek(0);
    this.play();
  }

  public setSpeed(speed: number) {
    this.playbackSpeed = speed;
  }

  public setCameraMode(mode: CameraViewMode) {
    this.cameraMode = mode;
  }

  private updateSceneState(dt: number) {
    if (this.isPlaying) {
      this.currentTime += dt * this.playbackSpeed;
      if (this.currentTime >= 30) {
        this.currentTime = 30;
        this.isPlaying = false;
      }
    }

    // Trigger dialogue speech & SFX
    this.director.triggerAudioEvents(this.currentTime, this.isPlaying);

    // Evaluate pose from animation director
    const state: EvaluatedSceneState = this.director.evaluate(this.currentTime);

    // Update characters
    this.boy.updatePose(this.currentTime, {
      headTiltX: state.zizo.headTiltX,
      headTiltY: state.zizo.headTiltY,
      headTiltZ: state.zizo.headTiltZ,
      leftArmAngle: state.zizo.leftArmAngle,
      rightArmAngle: state.zizo.rightArmAngle,
      mouthOpen: state.zizo.mouthOpen,
      eyebrowRaise: state.zizo.eyebrowRaise,
      eyesBlink: state.zizo.eyesBlink,
      sweatDrop: state.zizo.sweatDrop,
      pencilDropped: state.zizo.pencilDropped,
    });

    this.robot.updatePose(this.currentTime, {
      visible: state.roby.visible,
      posX: state.roby.posX,
      posY: state.roby.posY,
      posZ: state.roby.posZ,
      rotX: state.roby.rotX,
      rotY: state.roby.rotY,
      rotZ: state.roby.rotZ,
      headTiltY: state.roby.headTiltY,
      leftArmAngle: state.roby.leftArmAngle,
      rightArmAngle: state.roby.rightArmAngle,
      scannerActive: state.roby.scannerActive,
      eyePattern: state.roby.eyePattern,
    });

    // Animate sparkle particles during teleport (10.0s - 11.5s)
    const pMat = this.sparkleParticles.material as THREE.PointsMaterial;
    if (this.currentTime >= 10.0 && this.currentTime <= 11.6) {
      const p = (this.currentTime - 10.0) / 1.6;
      pMat.opacity = Math.sin(p * Math.PI);
      this.sparkleParticles.rotation.y += dt * 5;
    } else {
      pMat.opacity = 0;
    }

    // Camera Director logic & smoothing
    let targetCamPos = _camPos;
    let targetLookAt = _camTarget;
    let targetFov = 42;

    if (this.cameraMode === 'cinematic') {
      targetCamPos.set(state.camera.posX, state.camera.posY, state.camera.posZ);
      targetLookAt.set(state.camera.targetX, state.camera.targetY, state.camera.targetZ);
      targetFov = state.camera.fov;
    } else if (this.cameraMode === 'zizo') {
      targetCamPos.set(0.05, 1.25, 1.15);
      targetLookAt.set(0, 1.25, 0.45);
      targetFov = 38;
    } else if (this.cameraMode === 'roby') {
      targetCamPos.set(0.55, 1.2, 0.85);
      targetLookAt.set(0.45, 1.15, 0.0);
      targetFov = 36;
    } else if (this.cameraMode === 'wide') {
      targetCamPos.set(0, 1.8, 2.8);
      targetLookAt.set(0, 1.0, 0);
      targetFov = 48;
    } else if (this.cameraMode === 'orbit') {
      const { radius, phi, theta } = this.orbitSpherical;
      targetCamPos.set(
        radius * Math.sin(phi) * Math.sin(theta),
        1.1 + radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );
      targetLookAt.set(0, 1.0, 0.2);
      targetFov = 42;
    }

    // Exponential damping (1 - Math.exp(-k * dt)) per skill directives
    const dampFactor = 1 - Math.exp(-6 * dt);
    this.currentCamPos.lerp(targetCamPos, dampFactor);
    this.currentCamTarget.lerp(targetLookAt, dampFactor);

    this.camera.position.copy(this.currentCamPos);
    this.camera.lookAt(this.currentCamTarget);
    if (Math.abs(this.camera.fov - targetFov) > 0.1) {
      this.camera.fov += (targetFov - this.camera.fov) * dampFactor;
      this.camera.updateProjectionMatrix();
    }

    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.currentTime, state.currentSceneId);
    }
  }

  private startLoop() {
    const tick = () => {
      const dt = Math.min(this.clock.getDelta(), 0.1);
      this.updateSceneState(dt);
      this.renderer.render(this.scene, this.camera);
      this.frameId = requestAnimationFrame(tick);
    };
    this.frameId = requestAnimationFrame(tick);
  }

  public dispose() {
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onResize);
    this.director.resetTriggers();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
