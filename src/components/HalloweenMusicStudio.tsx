import React, { useState, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  Square,
  Volume2,
  Radio,
} from 'lucide-react';
import { proceduralMusic } from '../utils/proceduralMusic';
import { spookyAudio } from '../utils/soundEffects';

interface MusicPreset {
  id: string;
  name: string;
  type: 'organ' | 'musicbox';
  description: string;
  duration: string;
}

const MUSIC_PRESETS: MusicPreset[] = [
  {
    id: 'gothic_organ',
    name: 'Gothic Cathedral Organ',
    type: 'organ',
    description: 'Dramatic Bach-inspired pipe organ in D minor with deep pedal bass, distant bell tolls, and dark gothic counterpoint.',
    duration: 'Full Atmospheric Track',
  },
  {
    id: 'eerie_box',
    name: 'Twisted Music Box in Fog',
    type: 'musicbox',
    description: 'Chilling, fragile music box melody with vinyl record crackle, eerie reverb, and creeping psychological dread.',
    duration: 'Full Atmospheric Track',
  },
];

export const HalloweenMusicStudio: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>(MUSIC_PRESETS[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(30);
  const [trackTitle, setTrackTitle] = useState<string>('Gothic Cathedral Organ');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSelectPreset = (preset: MusicPreset) => {
    setSelectedPreset(preset.id);
    setTrackTitle(preset.name);
    spookyAudio.playHeartbeat(75);
    if (isPlaying) {
      proceduralMusic.stop();
      startProceduralPlay(preset.id);
    }
  };

  const startProceduralPlay = (presetId?: string) => {
    setIsPlaying(true);
    setTimeElapsed(0);
    const idToPlay = presetId || selectedPreset;
    const preset = MUSIC_PRESETS.find((p) => p.id === idToPlay);

    if (preset?.type === 'musicbox') {
      proceduralMusic.playMusicBox(
        (t, dur) => {
          setTimeElapsed(t);
          setTotalDuration(dur);
        },
        () => setIsPlaying(false)
      );
    } else {
      proceduralMusic.playGothicOrgan(
        (t, dur) => {
          setTimeElapsed(t);
          setTotalDuration(dur);
        },
        () => setIsPlaying(false)
      );
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      handleStop();
    } else {
      startProceduralPlay();
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setTimeElapsed(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    proceduralMusic.stop();
  };

  return (
    <div className="p-6 rounded-3xl bg-[#0f0a1c] border border-orange-500/30 shadow-2xl my-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white font-cinzel">Halloween Music</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950/60 text-orange-300 border border-orange-500/30">
                Atmospheric Soundtracks
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Gothic pipe organ and haunting twisted music box audio
            </p>
          </div>
        </div>

        {/* Quick Play CTA */}
        <button
          onClick={handlePlayPause}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Music</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Play {trackTitle}</span>
            </>
          )}
        </button>
      </div>

      {/* Track Selection Cards (Only Gothic Organ & Twisted Music Box) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {MUSIC_PRESETS.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          const isThisPlaying = isPlaying && isSelected;

          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-4 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-orange-500/15 border-orange-500 text-white font-bold shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/50'
                  : 'bg-[#150e26] border-purple-500/20 text-zinc-300 hover:bg-[#1e1436] hover:text-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold font-cinzel text-orange-200">{preset.name}</span>
                  {isThisPlaying && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 animate-pulse">
                      Playing
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{preset.description}</p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-orange-400 font-mono mt-3 pt-2 border-t border-purple-900/30">
                <span>Format: Web Audio Synthesis</span>
                <span>{preset.duration}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Music Player Bar */}
      <div className="p-4 rounded-2xl bg-[#090611] border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayPause}
            className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-400 text-black flex items-center justify-center transition-all shadow-md shadow-orange-500/20 active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          <button
            onClick={handleStop}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Stop"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>

          <div>
            <h4 className="text-sm font-bold text-white font-cinzel">{trackTitle}</h4>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="text-orange-400 tabular-nums">00:{timeElapsed.toString().padStart(2, '0')}</span>
              <span>/</span>
              <span className="tabular-nums">00:{totalDuration.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Waveform Preview */}
        <div className="flex-1 max-w-md mx-2">
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
              style={{ width: `${(timeElapsed / totalDuration) * 100}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400 font-mono">
            <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'text-orange-400 animate-pulse' : ''}`} />
            <span>{isPlaying ? 'Playing Track...' : 'Track Ready'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
