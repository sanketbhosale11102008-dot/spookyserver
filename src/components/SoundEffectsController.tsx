import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Radio, Skull, Wind, Bell, Zap, DoorClosed } from 'lucide-react';
import { spookyAudio } from '../utils/soundEffects';

interface SoundEffectsControllerProps {
  compact?: boolean;
}

export const SoundEffectsController: React.FC<SoundEffectsControllerProps> = ({ compact = false }) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDroneOn, setIsDroneOn] = useState<boolean>(false);
  const [randomAmbientEnabled, setRandomAmbientEnabled] = useState<boolean>(true);
  const [lastSoundPlayed, setLastSoundPlayed] = useState<string>('Ready');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Random Ambient Sound Scheduler
  useEffect(() => {
    if (!randomAmbientEnabled || isMuted) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const scheduleNextRandomSound = () => {
      // Random delay between 20s and 45s
      const delayMs = Math.floor(Math.random() * (45000 - 20000 + 1)) + 20000;

      timerRef.current = setTimeout(() => {
        if (!isMuted && randomAmbientEnabled) {
          triggerRandomSound();
        }
        scheduleNextRandomSound();
      }, delayMs);
    };

    scheduleNextRandomSound();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [randomAmbientEnabled, isMuted]);

  const triggerRandomSound = () => {
    const sounds = [
      { name: 'Ominous Wind', action: () => spookyAudio.playEerieWind() },
      { name: 'Distance Bell Toll', action: () => spookyAudio.playTollBell() },
      { name: 'Creaking Door', action: () => spookyAudio.playDoorCreak() },
      { name: 'Far Thunder', action: () => spookyAudio.playThunder() },
      { name: 'Sub-bass Heartbeat', action: () => spookyAudio.playHeartbeat(65) },
    ];
    const picked = sounds[Math.floor(Math.random() * sounds.length)];
    picked.action();
    setLastSoundPlayed(picked.name);
    setTimeout(() => setLastSoundPlayed('Ready'), 3000);
  };

  const handleToggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    spookyAudio.setMuted(nextState);
    if (nextState && isDroneOn) {
      setIsDroneOn(false);
    }
  };

  const handleToggleDrone = () => {
    const active = spookyAudio.toggleAtmosphere();
    setIsDroneOn(active);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleMute}
          title={isMuted ? 'Unmute Halloween SFX' : 'Mute Halloween SFX'}
          className={`p-2 rounded-lg border transition-colors ${
            isMuted
              ? 'bg-zinc-800 border-zinc-700 text-zinc-500'
              : 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={handleToggleDrone}
          title="Toggle Dark Ambient Drone"
          className={`px-3 py-1.5 text-xs rounded-lg border flex items-center gap-1.5 transition-colors ${
            isDroneOn
              ? 'bg-purple-950/80 border-purple-500 text-purple-300 font-bold'
              : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-white'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${isDroneOn ? 'animate-pulse text-purple-400' : ''}`} />
          <span>Drone {isDroneOn ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-[#120d20] border border-purple-500/20 my-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-cinzel">Spooky Soundboard & Ambient FX</h4>
            <p className="text-xs text-zinc-400">Web Audio synthesized soundscape & random atmospheric cues</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          <span className="text-xs font-mono px-2 py-1 rounded bg-[#1c1430] border border-purple-500/30 text-purple-300">
            {lastSoundPlayed !== 'Ready' ? `🔊 ${lastSoundPlayed}` : '💤 Ambient Idle'}
          </span>

          <button
            onClick={() => setRandomAmbientEnabled(!randomAmbientEnabled)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
              randomAmbientEnabled
                ? 'bg-orange-950/60 border-orange-500/40 text-orange-300'
                : 'bg-zinc-800 border-zinc-700 text-zinc-500'
            }`}
          >
            Auto FX {randomAmbientEnabled ? 'ON (20-45s)' : 'PAUSED'}
          </button>

          <button
            onClick={handleToggleMute}
            className={`p-1.5 rounded-lg border transition-colors ${
              isMuted
                ? 'bg-red-950/40 border-red-500/40 text-red-400'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sound effect trigger buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        <button
          onClick={() => {
            spookyAudio.playHeartbeat(75);
            setLastSoundPlayed('Heartbeat');
          }}
          className="p-2.5 rounded-xl bg-[#19112a] hover:bg-[#23173d] border border-purple-500/20 text-xs text-zinc-200 flex flex-col items-center gap-1.5 transition-colors group"
        >
          <Skull className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          <span>Heartbeat</span>
        </button>

        <button
          onClick={() => {
            spookyAudio.playTollBell();
            setLastSoundPlayed('Bell Toll');
          }}
          className="p-2.5 rounded-xl bg-[#19112a] hover:bg-[#23173d] border border-purple-500/20 text-xs text-zinc-200 flex flex-col items-center gap-1.5 transition-colors group"
        >
          <Bell className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>Bell Toll</span>
        </button>

        <button
          onClick={() => {
            spookyAudio.playEerieWind();
            setLastSoundPlayed('Eerie Wind');
          }}
          className="p-2.5 rounded-xl bg-[#19112a] hover:bg-[#23173d] border border-purple-500/20 text-xs text-zinc-200 flex flex-col items-center gap-1.5 transition-colors group"
        >
          <Wind className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Wind Howl</span>
        </button>

        <button
          onClick={() => {
            spookyAudio.playDoorCreak();
            setLastSoundPlayed('Door Creak');
          }}
          className="p-2.5 rounded-xl bg-[#19112a] hover:bg-[#23173d] border border-purple-500/20 text-xs text-zinc-200 flex flex-col items-center gap-1.5 transition-colors group"
        >
          <DoorClosed className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
          <span>Door Creak</span>
        </button>

        <button
          onClick={() => {
            spookyAudio.playThunder();
            setLastSoundPlayed('Thunderclap');
          }}
          className="p-2.5 rounded-xl bg-[#19112a] hover:bg-[#23173d] border border-purple-500/20 text-xs text-zinc-200 flex flex-col items-center gap-1.5 transition-colors group"
        >
          <Zap className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
          <span>Thunderclap</span>
        </button>

        <button
          onClick={() => {
            spookyAudio.playJumpScare();
            setLastSoundPlayed('Jump Scare Stinger');
          }}
          className="p-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-xs text-red-200 flex flex-col items-center gap-1.5 transition-colors group"
        >
          <Sparkles className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          <span className="font-bold">Jump Scare!</span>
        </button>
      </div>
    </div>
  );
};
