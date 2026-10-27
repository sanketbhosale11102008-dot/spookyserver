/**
 * Web Audio API synthesizer for Halloween spooky sound effects.
 * 100% client-side, zero external audio assets required, guaranteed zero 404s.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private isDronePlaying: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isDronePlaying) {
      this.stopAtmosphere();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Double thump heartbeat
  public playHeartbeat(bpm: number = 72) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const beatInterval = 60 / bpm;

      // Sub-bass thump 1
      this.createHeartThump(now, 70, 42, 0.14);
      // Sub-bass thump 2 (slightly softer, 0.22s after)
      this.createHeartThump(now + 0.22, 65, 38, 0.11);
    } catch {
      // AudioContext policy fallback
    }
  }

  private createHeartThump(time: number, startFreq: number, endFreq: number, duration: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + duration);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Ominous Church Bell / Death Toll
  public playTollBell() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Fundamental and metallic dissonant harmonics
      const freqs = [110, 110 * 1.414, 110 * 2.76, 110 * 3.98];
      const gains = [0.45, 0.25, 0.15, 0.08];

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(gains[i], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.5);
      });
    } catch {
      // AudioContext policy fallback
    }
  }

  // Ghostly Wind Howl
  public playEerieWind() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const bufferSize = ctx.sampleRate * 2.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink/Brown noise generation
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.18;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 4.0;
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 1.2);
      filter.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 2.5);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // AudioContext policy fallback
    }
  }

  // Jump Scare Stinger
  public playJumpScare() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Harsh dissonant cluster
      const screech = ctx.createOscillator();
      const screechGain = ctx.createGain();
      screech.type = 'sawtooth';
      screech.frequency.setValueAtTime(1420, now);
      screech.frequency.linearRampToValueAtTime(880, now + 0.4);

      screechGain.gain.setValueAtTime(0.5, now);
      screechGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      screech.connect(screechGain);
      screechGain.connect(ctx.destination);
      screech.start(now);
      screech.stop(now + 0.6);

      // Deep sub impact
      this.createHeartThump(now, 120, 30, 0.8);
    } catch {
      // AudioContext policy fallback
    }
  }

  // Creaking Door Sound
  public playDoorCreak() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 1.2);

      lfo.frequency.setValueAtTime(18, now);
      lfoGain.gain.setValueAtTime(40, now);

      lfo.connect(osc.frequency);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      lfo.start(now);
      osc.start(now);
      lfo.stop(now + 1.2);
      osc.stop(now + 1.2);
    } catch {
      // AudioContext policy fallback
    }
  }

  // Thunder Crack & Rumble
  public playThunder() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 2.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 1.8);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // AudioContext policy fallback
    }
  }

  // Continuous Eerie Drone Pad
  public toggleAtmosphere(): boolean {
    if (this.isDronePlaying) {
      this.stopAtmosphere();
      return false;
    } else {
      this.startAtmosphere();
      return true;
    }
  }

  public startAtmosphere() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      this.droneOsc1 = ctx.createOscillator();
      this.droneOsc2 = ctx.createOscillator();
      this.droneGain = ctx.createGain();

      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55, now); // A1 note

      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(55.8, now); // subtle beating tone

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, now);

      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.linearRampToValueAtTime(0.12, now + 2);

      this.droneOsc1.connect(filter);
      this.droneOsc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(ctx.destination);

      this.droneOsc1.start(now);
      this.droneOsc2.start(now);
      this.isDronePlaying = true;
    } catch {
      this.isDronePlaying = false;
    }
  }

  public stopAtmosphere() {
    if (this.droneGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.droneGain.gain.linearRampToValueAtTime(0.001, now + 0.8);
        setTimeout(() => {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
          this.droneGain?.disconnect();
          this.droneOsc1 = null;
          this.droneOsc2 = null;
          this.droneGain = null;
        }, 900);
      } catch {
        // cleanup safe
      }
    }
    this.isDronePlaying = false;
  }

  public getAtmosphereStatus(): boolean {
    return this.isDronePlaying;
  }
}

export const spookyAudio = new SoundSynthesizer();
