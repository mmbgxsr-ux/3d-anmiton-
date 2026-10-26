export type AspectRatio = '16:9' | '9:16';

export type CameraViewMode = 'cinematic' | 'orbit' | 'zizo' | 'roby' | 'wide';

export interface DialogueLine {
  id: string;
  speaker: 'zizo' | 'roby';
  speakerNameAr: string;
  textAr: string;
  phoneticEg: string;
  textEn: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  expression: 'bored' | 'yawn' | 'curious' | 'happy' | 'thinking' | 'shocked' | 'confused';
  soundFxCue?: string;
}

export interface SceneMeta {
  id: number;
  titleAr: string;
  titleEn: string;
  startTime: number;
  endTime: number;
  duration: number;
  descriptionAr: string;
  mood: string;
}

export interface AnimationKeyframeState {
  // Zizo transforms & expressions
  zizo: {
    posX: number;
    posY: number;
    posZ: number;
    rotX: number;
    rotY: number;
    rotZ: number;
    headTiltX: number;
    headTiltY: number;
    leftArmAngle: number;
    rightArmAngle: number;
    mouthOpen: number; // 0 (closed) to 1 (wide open)
    eyebrowRaise: number; // -1 (furrowed/frown) to +1 (surprised)
    eyesBlink: number; // 0 (open) to 1 (closed)
    expression: 'slumped' | 'sigh' | 'excited' | 'stunned';
  };
  // Roby transforms & expressions
  roby: {
    visible: boolean;
    posX: number;
    posY: number;
    posZ: number;
    rotX: number;
    rotY: number;
    rotZ: number;
    hoverFloat: number;
    antennaGlow: number;
    eyePattern: 'neutral' | 'happy' | 'blink' | 'scanning' | 'question' | 'wink';
    scannerActive: boolean;
    leftArmAngle: number;
    rightArmAngle: number;
    mouthBeep: number;
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
