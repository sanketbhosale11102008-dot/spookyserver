/**
 * Web Speech API Ghost Host Text-to-Speech Engine
 * Provides adjustable pitch, rate, voice selection, word-boundary callbacks,
 * and atmospheric eerie presets.
 */

export interface GhostVoicePreset {
  id: string;
  name: string;
  pitch: number;
  rate: number;
  samplePhrase: string;
  preferredVoiceLang?: string;
  description: string;
  ambientSound: 'wind' | 'creak' | 'toll' | 'heartbeat' | 'thunder';
}

export const GHOST_VOICE_PRESETS: GhostVoicePreset[] = [
  {
    id: 'ancient_crypt',
    name: 'Ancient Crypt',
    pitch: 0.25,
    rate: 0.68,
    samplePhrase: 'From beneath the cold granite slabs, the ancient dead stir and awaken.',
    description: 'Subterranean sub-bass resonance echoing through catacomb corridors.',
    ambientSound: 'toll',
  },
  {
    id: 'shrieking_banshee',
    name: 'Shrieking Banshee',
    pitch: 1.65,
    rate: 1.15,
    samplePhrase: 'Heed the blood-moon omen! The shroud is woven and the grave stands open!',
    description: 'Piercing supernatural cadence delivering frantic horror urgency.',
    ambientSound: 'wind',
  },
  {
    id: 'gravelly_gravedigger',
    name: 'Gravelly Grave-Digger',
    pitch: 0.52,
    rate: 0.82,
    samplePhrase: 'Six feet of damp sod is all that separates your warm breath from the eternal dark.',
    description: 'Gritty, measured baritone worn down by years digging haunted soil.',
    ambientSound: 'creak',
  },
  {
    id: 'crypt_keeper',
    name: 'The Cryptkeeper',
    pitch: 0.45,
    rate: 0.82,
    samplePhrase: 'Welcome, boils and ghouls, to another terrifying chapter.',
    description: 'Classic gravelly horror host tone that builds psychological dread.',
    ambientSound: 'heartbeat',
  },
  {
    id: 'whispering_phantom',
    name: 'Whispering Phantom',
    pitch: 0.7,
    rate: 0.75,
    samplePhrase: 'Do you hear them tapping against the wallpaper when the candle dies?',
    description: 'Eerie, breathy cadence like spectral breath against your ear.',
    ambientSound: 'wind',
  },
  {
    id: 'victorian_specter',
    name: 'Victorian Specter',
    pitch: 0.9,
    rate: 0.9,
    samplePhrase: 'Curiosity has led you into chambers from which no gentleman departs alive.',
    description: 'Refined 19th-century academic tone delivered with bone-chilling poise.',
    ambientSound: 'toll',
  },
];

export class GhostSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private onVoicesChangedCallbacks: Array<(voices: SpeechSynthesisVoice[]) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    this.onVoicesChangedCallbacks.forEach((cb) => cb(this.voices));
  }

  public subscribeVoices(cb: (voices: SpeechSynthesisVoice[]) => void) {
    this.onVoicesChangedCallbacks.push(cb);
    if (this.voices.length > 0) {
      cb(this.voices);
    }
    return () => {
      this.onVoicesChangedCallbacks = this.onVoicesChangedCallbacks.filter((c) => c !== cb);
    };
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public speak(
    text: string,
    options: {
      pitch: number;
      rate: number;
      volume?: number;
      voiceURI?: string;
      onBoundary?: (charIndex: number, length: number) => void;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
    }
  ) {
    if (!this.synth) return;
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = Math.max(0.1, Math.min(2, options.pitch));
    utterance.rate = Math.max(0.2, Math.min(2, options.rate));
    utterance.volume = options.volume !== undefined ? options.volume : 1;

    if (options.voiceURI) {
      const matched = this.voices.find((v) => v.voiceURI === options.voiceURI);
      if (matched) utterance.voice = matched;
    } else {
      // Default to best natural English voice available
      const preferred = this.voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('George'))
      );
      if (preferred) utterance.voice = preferred;
    }

    if (options.onBoundary) {
      utterance.onboundary = (e) => {
        options.onBoundary?.(e.charIndex, (e as SpeechSynthesisEvent).charLength || 5);
      };
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      options.onError?.(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!this.synth && this.synth.speaking;
  }

  public isPaused(): boolean {
    return !!this.synth && this.synth.paused;
  }
}

export const ghostSpeech = new GhostSpeechEngine();
