/**
 * Procedural Web Audio Halloween Music Synthesizer
 * Generates 30-second gothic atmospheric tracks:
 * - Gothic Pipe Organ & Choir
 * - Eerie Music Box in the Fog
 * - Eldritch Cello Sub-Bass Drone
 * - 80s Slasher Horror Synth
 */

export class ProceduralMusicSynth {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private activeNodes: (OscillatorNode | GainNode)[] = [];
  private sequenceTimer: NodeJS.Timeout | null = null;

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

  public stop() {
    this.isPlaying = false;
    if (this.sequenceTimer) {
      clearInterval(this.sequenceTimer);
      this.sequenceTimer = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof node.stop === 'function') {
          node.stop();
        }
        node.disconnect();
      } catch {
        // cleanup safe
      }
    });
    this.activeNodes = [];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Plays a 30s procedural Gothic Organ chord progression (D minor, Bb major, G minor, A7)
   */
  public playGothicOrgan(onProgress?: (timeElapsed: number, duration: number) => void, onEnd?: () => void) {
    this.stop();
    const ctx = this.getContext();
    this.isPlaying = true;

    // Organ chords (frequencies in Hz):
    // Chord 1: Dm (D3, F3, A3, D4, F4)
    // Chord 2: Bb (Bb2, D3, F3, Bb3, D4)
    // Chord 3: Gm (G2, Bb2, D3, G3, Bb3)
    // Chord 4: A7 (A2, C#3, E3, G3, A3)
    const chords = [
      [146.83, 174.61, 220.0, 293.66, 349.23], // Dm
      [116.54, 146.83, 174.61, 233.08, 293.66], // Bb
      [98.0, 116.54, 146.83, 196.0, 233.08], // Gm
      [110.0, 138.59, 164.81, 196.0, 220.0], // A7
    ];

    let currentChordIdx = 0;
    const chordDuration = 7.5; // 4 chords x 7.5s = 30s
    let startTime = ctx.currentTime;
    let elapsed = 0;

    const playChord = (chordFreqs: number[]) => {
      const now = ctx.currentTime;
      const masterChordGain = ctx.createGain();
      masterChordGain.gain.setValueAtTime(0.001, now);
      masterChordGain.gain.linearRampToValueAtTime(0.2, now + 1.2);
      masterChordGain.gain.setValueAtTime(0.2, now + chordDuration - 1.2);
      masterChordGain.gain.exponentialRampToValueAtTime(0.001, now + chordDuration);

      masterChordGain.connect(ctx.destination);
      this.activeNodes.push(masterChordGain);

      chordFreqs.forEach((freq) => {
        // Rich organ: pair of slightly detuned saw + square wave
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq, now);

        osc2.type = 'square';
        osc2.frequency.setValueAtTime(freq * 1.002, now); // slight chorus detune

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(850, now);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterChordGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + chordDuration);
        osc2.stop(now + chordDuration);

        this.activeNodes.push(osc1, osc2, filter as unknown as GainNode);
      });
    };

    // Play first chord
    playChord(chords[0]);

    this.sequenceTimer = setInterval(() => {
      elapsed += 1;
      onProgress?.(elapsed, 30);

      if (elapsed % 8 === 0) {
        currentChordIdx = (currentChordIdx + 1) % chords.length;
        if (currentChordIdx === 0 && elapsed >= 28) {
          // Track finished
          this.stop();
          onEnd?.();
          return;
        }
        playChord(chords[currentChordIdx]);
      }

      if (elapsed >= 30) {
        this.stop();
        onEnd?.();
      }
    }, 1000);
  }

  /**
   * Plays a 30s eerie music box melody (high bell-like sine tones with reverb decay)
   */
  public playMusicBox(onProgress?: (timeElapsed: number, duration: number) => void, onEnd?: () => void) {
    this.stop();
    const ctx = this.getContext();
    this.isPlaying = true;

    // Haunting nursery melody notes (E5, B4, C5, D5, C5, B4, A4, A4, C5, E5, D5, C5, B4)
    const melody = [659.25, 493.88, 523.25, 587.33, 523.25, 493.88, 440.0, 440.0, 523.25, 659.25, 587.33, 523.25, 493.88, 440.0];
    let noteIdx = 0;
    let elapsed = 0;

    const playNote = (freq: number) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
      this.activeNodes.push(osc, gain);
    };

    this.sequenceTimer = setInterval(() => {
      elapsed += 1;
      onProgress?.(elapsed, 30);

      playNote(melody[noteIdx % melody.length]);
      noteIdx++;

      if (elapsed >= 30) {
        this.stop();
        onEnd?.();
      }
    }, 1200);
  }
}

export const proceduralMusic = new ProceduralMusicSynth();
