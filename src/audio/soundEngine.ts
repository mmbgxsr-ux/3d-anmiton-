/**
 * Audio Engine: Web Audio API procedural sound synthesizer + Web Speech API Egyptian voice
 * Zero external mp3 dependencies (100% reliable, zero 404s).
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private soundVolume: number = 0.8;
  private voiceVolume: number = 0.9;
  private speechSynth: SpeechSynthesis | null = null;
  private arabicVoices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  public currentLipsyncValue: number = 0; // 0 to 1
  private lipsyncInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
      if ('speechSynthesis' in window) {
        this.speechSynth = window.speechSynthesis;
        this.loadVoices();
        if (this.speechSynth.onvoiceschanged !== undefined) {
          this.speechSynth.onvoiceschanged = () => this.loadVoices();
        }
      }
    }
  }

  private loadVoices() {
    if (!this.speechSynth) return;
    const voices = this.speechSynth.getVoices();
    this.arabicVoices = voices.filter(v => v.lang.startsWith('ar'));
  }

  public initAudioContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.speechSynth) {
      this.speechSynth.cancel();
      this.currentLipsyncValue = 0;
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public setVolume(sound: number, voice: number) {
    this.soundVolume = sound;
    this.voiceVolume = voice;
  }

  // Speak dialogue line in Egyptian Arabic with synchronized lipsync
  public speakDialogue(
    speaker: 'zizo' | 'roby',
    textAr: string,
    onWord?: () => void,
    onEnd?: () => void
  ) {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return;
    }

    this.initAudioContext();

    // Check if browser has speech synthesis
    if (this.speechSynth) {
      this.speechSynth.cancel();
      const utterance = new SpeechSynthesisUtterance(textAr);

      // Select voice if available
      if (this.arabicVoices.length > 0) {
        // Look for Egyptian voice or first Arabic
        const egVoice = this.arabicVoices.find(v => v.lang.includes('EG')) || this.arabicVoices[0];
        utterance.voice = egVoice;
        utterance.lang = egVoice.lang;
      } else {
        utterance.lang = 'ar-EG';
      }

      if (speaker === 'zizo') {
        utterance.pitch = 1.35; // Young Egyptian boy tone
        utterance.rate = 1.05;
      } else {
        utterance.pitch = 1.8;  // Smart cute robot tone
        utterance.rate = 1.15;
      }

      utterance.volume = this.voiceVolume;

      // Animate lipsync
      let toggle = false;
      const startLipsync = () => {
        if (this.lipsyncInterval) clearInterval(this.lipsyncInterval);
        this.lipsyncInterval = window.setInterval(() => {
          toggle = !toggle;
          this.currentLipsyncValue = toggle ? 0.85 : 0.25;
          if (speaker === 'roby') {
            this.playProceduralBeepChirp(600 + Math.random() * 800, 0.04);
          }
        }, 120);
      };

      utterance.onstart = () => {
        startLipsync();
      };

      utterance.onboundary = () => {
        this.currentLipsyncValue = 0.95;
        if (onWord) onWord();
      };

      utterance.onend = () => {
        if (this.lipsyncInterval) clearInterval(this.lipsyncInterval);
        this.currentLipsyncValue = 0;
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        if (this.lipsyncInterval) clearInterval(this.lipsyncInterval);
        this.currentLipsyncValue = 0;
        this.currentUtterance = null;
        // Fallback to procedural cartoon chatter
        this.playProceduralSpeech(speaker, textAr.length);
      };

      this.currentUtterance = utterance;
      try {
        this.speechSynth.speak(utterance);
      } catch {
        this.playProceduralSpeech(speaker, textAr.length);
      }
    } else {
      // Fallback procedural speech synth
      this.playProceduralSpeech(speaker, textAr.length);
    }
  }

  public stopSpeaking() {
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
    if (this.lipsyncInterval) {
      clearInterval(this.lipsyncInterval);
      this.lipsyncInterval = null;
    }
    this.currentLipsyncValue = 0;
  }

  /**
   * Procedural cartoon syllables fallback (like cartoon vocalizations)
   */
  private playProceduralSpeech(speaker: 'zizo' | 'roby', lengthChars: number) {
    if (!this.ctx || this.isMuted) return;
    const syllables = Math.max(4, Math.min(14, Math.floor(lengthChars / 3)));
    const durationPerSyllable = 0.16;

    for (let i = 0; i < syllables; i++) {
      setTimeout(() => {
        if (this.isMuted) return;
        this.currentLipsyncValue = i % 2 === 0 ? 0.9 : 0.2;
        if (speaker === 'zizo') {
          // Boy vocal inflection (vowel formant simulation)
          this.playBoySyllable(240 + Math.sin(i * 0.8) * 60, durationPerSyllable);
        } else {
          // Cute robot chirps
          this.playProceduralBeepChirp(700 + Math.cos(i) * 350, durationPerSyllable * 0.7);
        }
      }, i * durationPerSyllable * 1000);
    }

    setTimeout(() => {
      this.currentLipsyncValue = 0;
    }, syllables * durationPerSyllable * 1000 + 100);
  }

  private playBoySyllable(freq: number, dur: number) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.9, this.ctx.currentTime + dur);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.Q.setValueAtTime(4, this.ctx.currentTime);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2 * this.voiceVolume, this.ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }

  private playProceduralBeepChirp(freq: number, dur: number) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.3, this.ctx.currentTime + dur);

    gain.gain.setValueAtTime(0.12 * this.soundVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }

  // Sound Effects Triggers
  public playSoundFx(cue: string) {
    if (!this.ctx || this.isMuted) return;
    this.initAudioContext();

    switch (cue) {
      case 'clock_tick':
        this.playClockTick();
        break;
      case 'sigh':
        this.playSigh();
        break;
      case 'teleport_sparkle':
        this.playTeleportSparkle();
        break;
      case 'cheer':
        this.playCheerChime();
        break;
      case 'laser_scan':
        this.playLaserScan();
        break;
      case 'robot_chuckle':
        this.playRobotChuckle();
        break;
      case 'comic_fail':
        this.playComicFailWah();
        break;
      case 'boing':
        this.playBoing();
        break;
      default:
        break;
    }
  }

  private playClockTick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.15 * this.soundVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  private playSigh() {
    if (!this.ctx) return;
    // Filtered pink noise sigh
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18 * this.soundVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  private playTeleportSparkle() {
    if (!this.ctx) return;
    // Ascending arpeggio with high resonance
    const freqs = [350, 520, 680, 880, 1100, 1400, 1800, 2200];
    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime + idx * 0.05);
      gain.gain.setValueAtTime(0.2 * this.soundVolume, this.ctx!.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.05 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.05);
      osc.stop(this.ctx!.currentTime + idx * 0.05 + 0.26);
    });
  }

  private playCheerChime() {
    if (!this.ctx) return;
    const freqs = [440, 554, 659, 880];
    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.18 * this.soundVolume, this.ctx!.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.36);
    });
  }

  private playLaserScan() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 1.2);

    lfo.frequency.setValueAtTime(25, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(0.15 * this.soundVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    lfo.start();
    osc.start();
    lfo.stop(this.ctx.currentTime + 1.2);
    osc.stop(this.ctx.currentTime + 1.2);
  }

  private playRobotChuckle() {
    if (!this.ctx) return;
    const pitches = [700, 850, 700, 950, 1100];
    pitches.forEach((p, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(p, this.ctx!.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.08 * this.soundVolume, this.ctx!.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.06 + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.06);
      osc.stop(this.ctx!.currentTime + idx * 0.06 + 0.09);
    });
  }

  // Classic cartoon "Wah-wah-wah-waaaah" comedic fail
  private playComicFailWah() {
    if (!this.ctx) return;
    const notes = [
      { f: 370, start: 0, dur: 0.35 },     // F#4
      { f: 350, start: 0.38, dur: 0.35 },  // F4
      { f: 330, start: 0.76, dur: 0.35 },  // E4
      { f: 290, start: 1.15, dur: 0.85 }   // D4 (sliding down)
    ];

    notes.forEach((n) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.f, this.ctx!.currentTime + n.start);
      if (n.dur > 0.5) {
        osc.frequency.exponentialRampToValueAtTime(n.f * 0.75, this.ctx!.currentTime + n.start + n.dur);
      }

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, this.ctx!.currentTime + n.start);
      filter.Q.setValueAtTime(6, this.ctx!.currentTime + n.start);

      gain.gain.setValueAtTime(0.24 * this.soundVolume, this.ctx!.currentTime + n.start);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + n.start + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + n.start);
      osc.stop(this.ctx!.currentTime + n.start + n.dur);
    });

    // Also trigger comic boing at punchline
    setTimeout(() => {
      this.playBoing();
    }, 1200);
  }

  public playBoing() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.25 * this.soundVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.36);
  }
}

export const soundEngine = new SoundEngine();
