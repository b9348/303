
export class AudioManager {
  private static instance: AudioManager;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmNodes: AudioScheduledSourceNode[] = [];
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public async init() {
    if (this.isInitialized) return;

    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    if (this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.4; // Default volume
      this.isInitialized = true;
    }
  }

  public async resume() {
    if (this.ctx?.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : 0.4, 
        this.ctx!.currentTime, 
        0.1
      );
    }
    return this.isMuted;
  }

  // --- Sound Synthesis Methods ---

  // 1. Background Ambience (The "Hum" of the building)
  public playAmbience(type: 'normal' | 'danger' | 'safe') {
    if (!this.ctx || !this.masterGain) return;
    this.stopBGM();

    const now = this.ctx.currentTime;
    
    // Base Drone (Brown Noise-ish)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Configuration based on mood
    if (type === 'danger') {
      osc1.frequency.value = 50; // Low rumble
      osc2.frequency.value = 55; // Binaural beat dissonance
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      filter.frequency.value = 200;
      gain.gain.value = 0.15;
    } else if (type === 'safe') {
      osc1.frequency.value = 110;
      osc2.frequency.value = 111;
      osc1.type = 'sine';
      osc2.type = 'sine';
      filter.frequency.value = 400;
      gain.gain.value = 0.05;
    } else {
      // Normal: The CRT TV Hum
      osc1.frequency.value = 60; // Electrical hum
      osc2.frequency.value = 120;
      osc1.type = 'sawtooth';
      osc2.type = 'sine';
      filter.frequency.value = 150;
      gain.gain.value = 0.08;
    }

    filter.type = 'lowpass';
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);

    // Fade in
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(type === 'danger' ? 0.2 : 0.08, now + 2);

    this.bgmNodes.push(osc1, osc2);
  }

  public stopBGM() {
    if (!this.ctx) return;
    this.bgmNodes.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.bgmNodes = [];
  }

  // 2. Typewriter / Text Reveal Sound
  public playTypeSound() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    // A very short, high frequency click (like a Geiger counter or old HDD)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Randomize pitch slightly for realism
    osc.frequency.setValueAtTime(800 + Math.random() * 400, this.ctx.currentTime); 
    osc.type = 'square';
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // 3. UI Interaction (Hover/Click)
  public playClick(type: 'hover' | 'select' = 'select') {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    if (type === 'hover') {
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.05);
    } else {
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);
      osc.type = 'triangle';
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    }

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // 4. Special FX
  public playSFX(effect: 'glitch' | 'shake' | 'flicker' | 'heartbeat') {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    if (effect === 'glitch') {
      // White noise burst
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      
      noise.connect(gain);
      gain.connect(this.masterGain);
      noise.start();
    } 
    else if (effect === 'heartbeat') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(40, now);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(now + 0.3);
    }
    else if (effect === 'shake') {
       // Low rumble
       const osc = this.ctx.createOscillator();
       const gain = this.ctx.createGain();
       osc.type = 'sawtooth';
       osc.frequency.setValueAtTime(30, now);
       osc.frequency.linearRampToValueAtTime(10, now + 0.5);
       
       gain.gain.setValueAtTime(0.3, now);
       gain.gain.linearRampToValueAtTime(0, now + 0.5);

       osc.connect(gain);
       gain.connect(this.masterGain);
       osc.start();
       osc.stop(now + 0.6);
    }
  }
}
