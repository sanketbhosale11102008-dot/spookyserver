import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Square,
  Sparkles,
  Sliders,
  Ghost,
  Radio,
  Settings2,
} from 'lucide-react';
import { ghostSpeech, GHOST_VOICE_PRESETS, GhostVoicePreset } from '../utils/ghostSpeech';
import { spookyAudio } from '../utils/soundEffects';

interface GhostHostNarratorProps {
  storyText: string;
  storyTitle: string;
  onHighlightIndexChange?: (charIndex: number) => void;
  onNarrationStateChange?: (isNarrating: boolean) => void;
}

export const GhostHostNarrator: React.FC<GhostHostNarratorProps> = ({
  storyText,
  storyTitle,
  onHighlightIndexChange,
  onNarrationStateChange,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [pitch, setPitch] = useState<number>(0.55);
  const [rate, setRate] = useState<number>(0.85);
  const [selectedPreset, setSelectedPreset] = useState<string>('crypt_keeper');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [atmosphericDrones, setAtmosphericDrones] = useState<boolean>(true);

  // Subscribe to voices loaded by browser
  useEffect(() => {
    const unsubscribe = ghostSpeech.subscribeVoices((loadedVoices) => {
      setVoices(loadedVoices);
      if (loadedVoices.length > 0 && !selectedVoiceURI) {
        // Prefer natural / deep English voice
        const preferred = loadedVoices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('David'))
        ) || loadedVoices[0];
        if (preferred) setSelectedVoiceURI(preferred.voiceURI);
      }
    });

    return () => {
      unsubscribe();
      ghostSpeech.stop();
    };
  }, []);

  const handleApplyPreset = (preset: GhostVoicePreset) => {
    setSelectedPreset(preset.id);
    setPitch(preset.pitch);
    setRate(preset.rate);

    // Accompanying ambient audio cue matching the preset
    if (preset.ambientSound === 'creak') {
      spookyAudio.playDoorCreak();
    } else if (preset.ambientSound === 'toll') {
      spookyAudio.playTollBell();
    } else if (preset.ambientSound === 'wind') {
      spookyAudio.playEerieWind();
    } else if (preset.ambientSound === 'thunder') {
      spookyAudio.playThunder();
    } else {
      spookyAudio.playHeartbeat(75);
    }
  };

  const handleAudition = (e: React.MouseEvent, preset: GhostVoicePreset) => {
    e.stopPropagation();
    handleApplyPreset(preset);

    ghostSpeech.speak(preset.samplePhrase, {
      pitch: preset.pitch,
      rate: preset.rate,
      voiceURI: selectedVoiceURI,
      onEnd: () => {
        setIsPlaying(false);
      },
      onError: () => {
        setIsPlaying(false);
      },
    });
  };

  const handlePlay = () => {
    if (isPaused) {
      ghostSpeech.resume();
      setIsPaused(false);
      setIsPlaying(true);
      onNarrationStateChange?.(true);
      return;
    }

    if (!storyText.trim()) return;

    if (atmosphericDrones) {
      spookyAudio.playEerieWind();
    }

    setIsPlaying(true);
    setIsPaused(false);
    onNarrationStateChange?.(true);

    const fullNarrative = `${storyTitle}. ... ${storyText}`;

    ghostSpeech.speak(fullNarrative, {
      pitch,
      rate,
      voiceURI: selectedVoiceURI,
      onBoundary: (charIndex) => {
        onHighlightIndexChange?.(charIndex);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
        onNarrationStateChange?.(false);
        spookyAudio.playTollBell();
      },
      onError: () => {
        setIsPlaying(false);
        setIsPaused(false);
        onNarrationStateChange?.(false);
      },
    });
  };

  const handlePause = () => {
    ghostSpeech.pause();
    setIsPaused(true);
    onNarrationStateChange?.(false);
  };

  const handleStop = () => {
    ghostSpeech.stop();
    setIsPlaying(false);
    setIsPaused(false);
    onNarrationStateChange?.(false);
    onHighlightIndexChange?.(-1);
  };

  const getPitchLabel = (p: number) => {
    if (p <= 0.4) return 'Guttural Crypt (Ultra-Low)';
    if (p <= 0.7) return 'Deep Phantom (Spooky)';
    if (p <= 1.0) return 'Natural Voice';
    if (p <= 1.3) return 'Piercing Specter';
    return 'Banshee Shriek (High)';
  };

  const getRateLabel = (r: number) => {
    if (r <= 0.75) return 'Cemetery Crawl';
    if (r <= 0.95) return 'Measured Dread';
    if (r <= 1.1) return 'Standard Pace';
    return 'Frantic Panic';
  };

  return (
    <div className="p-5 rounded-2xl bg-[#140e24] border border-orange-500/30 my-4 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Ghost className="w-5 h-5 animate-ghost-float" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white font-cinzel">Ghost Host Narration Engine</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950/60 text-orange-300 border border-orange-500/30">
                Web Speech API
              </span>
            </div>
            <p className="text-xs text-zinc-400">Hear your scary story narrated aloud with adjustable demonic pitch & rate</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {!isPlaying || isPaused ? (
            <button
              onClick={handlePlay}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? 'Resume Tale' : 'Read Aloud'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40 transition-colors"
            title="Stop Narration"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2 rounded-xl border transition-colors ${
              showAdvanced ? 'bg-purple-950/80 border-purple-500 text-purple-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
            }`}
            title="Voice Tuning Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Ghost Voice Presets Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-mono text-orange-300 uppercase tracking-wider">
            Selectable Ghost Persona Presets:
          </label>
          <span className="text-[10px] text-zinc-400 font-mono">
            Click card to activate · Click "Audition" to preview voice
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {GHOST_VOICE_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-orange-500/15 border-orange-500 text-white shadow-lg shadow-orange-500/10'
                    : 'bg-[#18112b] border-purple-500/20 text-zinc-300 hover:bg-[#22163b] hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold font-cinzel text-sm text-orange-200">
                      {preset.name}
                    </span>
                    <button
                      onClick={(e) => handleAudition(e, preset)}
                      className="px-2 py-0.5 rounded-lg bg-orange-950/80 hover:bg-orange-900 border border-orange-500/40 text-[10px] font-mono text-orange-300 flex items-center gap-1 transition-colors"
                      title={`Audition ${preset.name} sample`}
                    >
                      <Volume2 className="w-3 h-3 text-orange-400" />
                      <span>Audition</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans leading-snug line-clamp-2">
                    {preset.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mt-2 pt-1.5 border-t border-purple-900/30">
                  <span>Pitch: {preset.pitch.toFixed(2)}</span>
                  <span>Speed: {preset.rate.toFixed(2)}x</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sliders: Pitch & Speed Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-purple-500/20">
        {/* Pitch Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-300">Ghost Pitch (0.2 – 1.8):</span>
            <span className="font-mono text-orange-400 font-bold">
              {pitch.toFixed(2)} ({getPitchLabel(pitch)})
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.8"
            step="0.05"
            value={pitch}
            onChange={(e) => {
              setPitch(parseFloat(e.target.value));
              setSelectedPreset('custom');
            }}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>0.2: Grave Deep</span>
            <span>1.0: Normal</span>
            <span>1.8: Banshee Wail</span>
          </div>
        </div>

        {/* Speed / Rate Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-300">Speech Speed (0.5x – 1.5x):</span>
            <span className="font-mono text-orange-400 font-bold">
              {rate.toFixed(2)}x ({getRateLabel(rate)})
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={rate}
            onChange={(e) => {
              setRate(parseFloat(e.target.value));
              setSelectedPreset('custom');
            }}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>0.5x: Unsettling Crawl</span>
            <span>1.0x: Standard</span>
            <span>1.5x: Panic Rush</span>
          </div>
        </div>
      </div>

      {/* Advanced Drawer: Voice Device & Atmosphere */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-purple-500/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Synthesizer Voice Device:</label>
            <select
              value={selectedVoiceURI}
              onChange={(e) => setSelectedVoiceURI(e.target.value)}
              className="w-full p-2 rounded-xl bg-[#1a122e] border border-purple-500/30 text-white focus:outline-none"
            >
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#1a122e] border border-purple-500/20">
            <div>
              <span className="text-zinc-200 font-medium block">Spooky Audio Intro</span>
              <span className="text-[11px] text-zinc-400">Play eerie wind cue when narration starts</span>
            </div>
            <button
              onClick={() => setAtmosphericDrones(!atmosphericDrones)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                atmosphericDrones ? 'bg-orange-500 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {atmosphericDrones ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {/* Live Narration Indicator */}
      {isPlaying && (
        <div className="mt-3 py-1.5 px-3 rounded-lg bg-orange-950/40 border border-orange-500/30 text-xs text-orange-300 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-orange-400" />
            <span>Ghost Host is reading aloud... Pitch: {pitch.toFixed(2)}, Rate: {rate.toFixed(2)}x</span>
          </div>
          <span className="font-mono text-[11px]">{getPitchLabel(pitch)}</span>
        </div>
      )}
    </div>
  );
};
