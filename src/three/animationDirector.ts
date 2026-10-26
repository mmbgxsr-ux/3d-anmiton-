import * as THREE from 'three';
import { DIALOGUE_SCRIPT } from '../data/storyScript';
import { soundEngine } from '../audio/soundEngine';

export interface EvaluatedSceneState {
  currentSceneId: number;
  // Zizo
  zizo: {
    headTiltX: number;
    headTiltY: number;
    headTiltZ: number;
    leftArmAngle: number;
    rightArmAngle: number;
    mouthOpen: number;
    eyebrowRaise: number;
    eyesBlink: number;
    sweatDrop: boolean;
    pencilDropped: boolean;
  };
  // Roby
  roby: {
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
  };
  // Camera
  camera: {
    posX: number;
    posY: number;
    posZ: number;
    targetX: number;
    targetY: number;
    targetZ: number;
    fov: number;
  };
}

export class AnimationDirector {
  private lastTriggeredDialogueId: string | null = null;
  private lastTriggeredFx: string | null = null;

  /**
   * Evaluate exact character and camera states at time t (0.0 to 30.0s)
   */
  public evaluate(time: number, lipsyncMultiplier: number = 1.0): EvaluatedSceneState {
    const t = Math.max(0, Math.min(30, time));

    // Determine current scene
    let currentSceneId = 1;
    if (t >= 20) {
      currentSceneId = 3;
    } else if (t >= 10) {
      currentSceneId = 2;
    }

    // Default character states
    let zizoHeadTiltX = 0;
    let zizoHeadTiltY = 0;
    let zizoHeadTiltZ = 0;
    let zizoLeftArm = 0.5;
    let zizoRightArm = 0.6;
    let zizoMouth = 0;
    let zizoEyebrow = 0;
    let zizoBlink = 0;
    let zizoSweat = false;
    let zizoPencilDrop = false;

    // Roby defaults
    let robyVisible = false;
    let robyX = 0.55;
    let robyY = 0.72;
    let robyZ = -0.05;
    let robyRotX = 0;
    let robyRotY = -0.5;
    let robyRotZ = 0;
    let robyHeadTiltY = -0.3;
    let robyLeftArm = 0.2;
    let robyRightArm = 0.2;
    let robyScanner = false;
    let robyEye: 'happy' | 'neutral' | 'scanning' | 'question' | 'wink' | 'blink' = 'happy';

    // Camera defaults
    let camX = 0;
    let camY = 1.35;
    let camZ = 1.75;
    let targetX = 0;
    let targetY = 1.0;
    let targetZ = 0.15;
    let fov = 42;

    // Periodic natural eye blinks (every ~3.5s)
    const naturalBlink = Math.sin(t * 1.8) > 0.95 ? 1 : 0;
    zizoBlink = naturalBlink;

    // Find active dialogue line to drive lipsync
    const activeDialogue = DIALOGUE_SCRIPT.find(d => t >= d.startTime && t <= d.endTime);
    if (activeDialogue) {
      // Audio speech & mouth sync
      const progress = (t - activeDialogue.startTime) / (activeDialogue.endTime - activeDialogue.startTime);
      // Oscillate mouth realistically
      const syllabicMouth = Math.abs(Math.sin(progress * Math.PI * 18)) * 0.8 + 0.15;
      const computedMouth = Math.max(syllabicMouth, soundEngine.currentLipsyncValue) * lipsyncMultiplier;

      if (activeDialogue.speaker === 'zizo') {
        zizoMouth = computedMouth;
      } else {
        robyEye = (Math.sin(t * 4) > 0.8) ? 'happy' : 'neutral';
        // Roby slight head bounce when speaking
        robyHeadTiltY += Math.sin(t * 12) * 0.08;
      }
    }

    // =========================================================================
    // SCENE 1: (0.0s - 10.0s) "الزهق والملل" - Egyptian boy bored of math homework
    // =========================================================================
    if (t < 10) {
      robyVisible = false;

      // Cinematic camera: slow tracking shot pushing in on tired Zizo
      const s1Prog = t / 10;
      camX = THREE.MathUtils.lerp(-0.4, 0.15, s1Prog);
      camY = THREE.MathUtils.lerp(1.45, 1.28, s1Prog);
      camZ = THREE.MathUtils.lerp(2.2, 1.55, s1Prog);
      targetX = THREE.MathUtils.lerp(-0.05, 0.02, s1Prog);
      targetY = 1.05;
      targetZ = 0.2;
      fov = 40;

      if (t < 4.8) {
        // Dialogue 1: Complaining about math homework
        zizoHeadTiltX = 0.35 + Math.sin(t * 2) * 0.05;
        zizoHeadTiltY = -0.15 + Math.cos(t * 1.5) * 0.08;
        zizoHeadTiltZ = 0.2;
        // Resting head on left hand
        zizoLeftArm = 1.6;
        zizoRightArm = 0.8 + Math.sin(t * 3) * 0.15; // Tapping pencil
        zizoEyebrow = -0.6; // Bored / annoyed frown
      } else if (t < 6.8) {
        // Yawning & stretching
        const yawnP = (t - 4.8) / 2.0;
        zizoHeadTiltX = -0.25 * Math.sin(yawnP * Math.PI);
        zizoHeadTiltY = 0;
        zizoLeftArm = 1.2 - yawnP * 0.4;
        zizoRightArm = 1.2 - yawnP * 0.4;
        zizoMouth = Math.sin(yawnP * Math.PI) * 0.95;
        zizoBlink = 1; // Eyes closed in yawn
        zizoEyebrow = -0.2;
      } else {
        // Dialogue 2: "دماغي ساحت.. نفسي في معجزة!"
        zizoHeadTiltX = 0.4;
        zizoHeadTiltY = 0.12 + Math.sin(t * 2) * 0.04;
        zizoHeadTiltZ = -0.18;
        zizoLeftArm = 1.7; // Slumped on cheek
        zizoRightArm = 0.9;
        zizoEyebrow = -0.8;
      }
    }

    // =========================================================================
    // SCENE 2: (10.0s - 20.0s) "ظهور المنقذ الأزرق" - Roby the smart robot arrives
    // =========================================================================
    else if (t < 20) {
      robyVisible = true;
      const s2Prog = (t - 10) / 10;

      // Spawn animation (10.0s - 10.8s)
      if (t < 10.8) {
        const spawnP = (t - 10) / 0.8;
        robyY = THREE.MathUtils.lerp(1.4, 0.76, spawnP);
        robyRotY = (1 - spawnP) * Math.PI * 4;
        robyEye = 'blink';
      } else {
        robyY = 0.76;
        robyRotY = -0.65;
        robyEye = 'happy';
      }

      // Camera choreography: dynamic two-shot showing both characters
      camX = THREE.MathUtils.lerp(0.35, 0.25, s2Prog);
      camY = THREE.MathUtils.lerp(1.3, 1.25, s2Prog);
      camZ = THREE.MathUtils.lerp(1.8, 1.45, s2Prog);
      targetX = 0.12;
      targetY = 1.05;
      targetZ = 0.1;
      fov = 44;

      if (t < 15.6) {
        // Roby speaks: "مساء الجمال يا بطل! أنا الروبوت شاطر 3000..."
        robyLeftArm = -0.6 + Math.sin(t * 8) * 0.4; // Enthusiastic robotic wave!
        robyRightArm = 0.2;
        robyHeadTiltY = -0.55 + Math.sin(t * 3) * 0.1;
        robyEye = 'happy';

        // Zizo reacts in amazement: jumps up, eyes wide, mouth open
        const reactP = Math.min(1, (t - 10.2) / 0.8);
        zizoHeadTiltX = THREE.MathUtils.lerp(0.35, -0.05, reactP);
        zizoHeadTiltY = THREE.MathUtils.lerp(-0.15, 0.55, reactP); // Turns to look at robot!
        zizoHeadTiltZ = 0;
        zizoLeftArm = THREE.MathUtils.lerp(1.6, 0.4, reactP);
        zizoRightArm = THREE.MathUtils.lerp(0.8, 0.5, reactP);
        zizoEyebrow = 0.9; // Highly raised in surprise
        zizoBlink = 0;
      } else {
        // Zizo speaks: "بجد والله؟! طب والنبي إلحقني يا باشا..."
        zizoHeadTiltY = 0.5;
        zizoHeadTiltX = 0.05 + Math.sin(t * 4) * 0.05;
        zizoLeftArm = 0.6 + Math.sin(t * 5) * 0.2;
        zizoRightArm = 0.8 + Math.cos(t * 5) * 0.2;
        zizoEyebrow = 0.7;

        // Roby listening politely, nodding
        robyLeftArm = 0.1;
        robyRightArm = 0.1;
        robyHeadTiltY = -0.6 + Math.sin(t * 3) * 0.05;
        robyEye = 'neutral';
      }
    }

    // =========================================================================
    // SCENE 3: (20.0s - 30.0s) "القفلة الكوميدية" - The funny homework punchline!
    // =========================================================================
    else {
      robyVisible = true;
      const s3Prog = (t - 20) / 10;

      if (t < 23.0) {
        // 1. Roby scanning the homework notebook with laser beam!
        camX = 0.2;
        camY = 1.22;
        camZ = 1.35;
        targetX = 0.1;
        targetY = 0.95;
        targetZ = 0.15;
        fov = 42;

        robyX = 0.35;
        robyY = 0.72;
        robyZ = 0.1;
        robyRotX = 0.35; // Leaning forward over notebook
        robyRotY = -0.8;
        robyScanner = true;
        robyEye = 'scanning';
        robyLeftArm = 0.6;
        robyRightArm = 0.6;

        // Zizo watches in high anticipation
        zizoHeadTiltX = 0.2;
        zizoHeadTiltY = 0.45;
        zizoEyebrow = 0.5;
        zizoLeftArm = 0.4;
        zizoRightArm = 0.5;
      } else if (t < 26.2) {
        // 2. Roby finishes scan, turns to Zizo with cute playful challenge:
        // "المسألة بتقول: واحد زائد واحد كام؟ وريني شطارتك بقى وحلها أنت!"
        camX = 0.15;
        camY = 1.25;
        camZ = 1.3;
        targetX = 0.08;
        targetY = 1.02;
        targetZ = 0.1;
        fov = 40;

        robyX = 0.48;
        robyY = 0.8;
        robyRotX = 0;
        robyRotY = -0.7;
        robyScanner = false;
        robyEye = (t > 24.5) ? 'wink' : 'happy';
        robyLeftArm = -0.3 + Math.sin(t * 6) * 0.15;
        robyRightArm = -0.3 + Math.cos(t * 6) * 0.15;

        // Zizo processing the unexpected question
        zizoHeadTiltY = 0.48;
        zizoHeadTiltX = 0.05;
        zizoEyebrow = 0.2;
      } else {
        // 3. THE COMEDIC PUNCHLINE! (26.2s - 30.0s)
        // Zizo: "نعـــــم؟! ما لو كنت عارف ما كنتش ندهتلك يا فالح!!"

        // Comedic crash zoom & slight dynamic shake on punchline!
        const shake = (t < 28.5) ? (Math.random() - 0.5) * 0.025 : 0;
        camX = 0.02 + shake;
        camY = 1.2 + shake;
        camZ = 1.05; // Dramatic close-up on Zizo!
        targetX = 0.0 + shake * 0.5;
        targetY = 1.22;
        targetZ = 0.45;
        fov = 36;

        // Zizo in utter comical shock!
        zizoHeadTiltX = -0.15 + Math.sin(t * 14) * 0.05;
        zizoHeadTiltY = (t < 28.5) ? (Math.sin(t * 16) * 0.15) : 0.35;
        zizoHeadTiltZ = 0.1;
        zizoEyebrow = 1.0; // Shot through the roof
        zizoSweat = true;  // Anime comic sweat drop runs down temple
        zizoPencilDrop = true; // Drops pencil in shock

        // Hands on head / dramatic comedy gesture
        zizoLeftArm = 2.1;
        zizoRightArm = 2.1;

        // Roby innocent shrug & question mark eyes at ending
        robyX = 0.42;
        robyY = 0.78;
        robyRotY = -0.3; // Looking at audience
        robyScanner = false;
        robyEye = 'question';
        robyLeftArm = 0.5; // Shrugging
        robyRightArm = 0.5;
        robyHeadTiltY = Math.sin(t * 2) * 0.2;
      }
    }

    return {
      currentSceneId,
      zizo: {
        headTiltX: zizoHeadTiltX,
        headTiltY: zizoHeadTiltY,
        headTiltZ: zizoHeadTiltZ,
        leftArmAngle: zizoLeftArm,
        rightArmAngle: zizoRightArm,
        mouthOpen: zizoMouth,
        eyebrowRaise: zizoEyebrow,
        eyesBlink: zizoBlink,
        sweatDrop: zizoSweat,
        pencilDropped: zizoPencilDrop,
      },
      roby: {
        visible: robyVisible,
        posX: robyX,
        posY: robyY,
        posZ: robyZ,
        rotX: robyRotX,
        rotY: robyRotY,
        rotZ: robyRotZ,
        headTiltY: robyHeadTiltY,
        leftArmAngle: robyLeftArm,
        rightArmAngle: robyRightArm,
        scannerActive: robyScanner,
        eyePattern: robyEye,
      },
      camera: {
        posX: camX,
        posY: camY,
        posZ: camZ,
        targetX,
        targetY,
        targetZ,
        fov,
      },
    };
  }

  /**
   * Check and trigger audio events (dialogue & sound fx) at time t
   */
  public triggerAudioEvents(currentTime: number, isPlaying: boolean) {
    if (!isPlaying) return;

    // Check dialogue line triggers
    for (const line of DIALOGUE_SCRIPT) {
      if (currentTime >= line.startTime && currentTime <= line.endTime) {
        if (this.lastTriggeredDialogueId !== line.id) {
          this.lastTriggeredDialogueId = line.id;
          soundEngine.speakDialogue(line.speaker, line.textAr);
        }
        break;
      }
    }

    // Check sound fx cues
    for (const line of DIALOGUE_SCRIPT) {
      if (line.soundFxCue && Math.abs(currentTime - line.startTime) < 0.15) {
        const cueKey = `${line.id}_${line.soundFxCue}`;
        if (this.lastTriggeredFx !== cueKey) {
          this.lastTriggeredFx = cueKey;
          soundEngine.playSoundFx(line.soundFxCue);
        }
      }
    }
  }

  public resetTriggers() {
    this.lastTriggeredDialogueId = null;
    this.lastTriggeredFx = null;
    soundEngine.stopSpeaking();
  }
}
