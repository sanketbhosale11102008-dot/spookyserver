import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { spookyAudio } from '../utils/soundEffects';

interface HalloweenHeaderProps {
  onNavClick: (sectionId: string) => void;
  activeSection: string;
}

export const HalloweenHeader: React.FC<HalloweenHeaderProps> = ({
  onNavClick,
  activeSection,
}) => {
  const [isMuted, setIsMuted] = React.useState<boolean>(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    spookyAudio.setMuted(next);
    if (!next) spookyAudio.playHeartbeat(75);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0712]/90 backdrop-blur-md border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#story-forge"
          onClick={(e) => {
            e.preventDefault();
            onNavClick('story-forge');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-orange-400 transition-colors whitespace-nowrap shrink-0 font-cinzel"
        >
          Spooky Story Forge
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <button
            onClick={() => onNavClick('story-forge')}
            className={`hover:text-orange-400 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'story-forge' ? 'text-orange-400 underline underline-offset-8 decoration-orange-500' : ''
            }`}
          >
            Story Forge
          </button>
          <button
            onClick={() => onNavClick('game-3d')}
            className={`hover:text-orange-400 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'game-3d' ? 'text-orange-400 underline underline-offset-8 decoration-orange-500' : ''
            }`}
          >
            3D Game
          </button>
          <button
            onClick={() => onNavClick('music-studio')}
            className={`hover:text-orange-400 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'music-studio' ? 'text-orange-400 underline underline-offset-8 decoration-orange-500' : ''
            }`}
          >
            Halloween Music
          </button>
          <button
            onClick={() => onNavClick('spooky-tools')}
            className={`hover:text-orange-400 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'spooky-tools' ? 'text-orange-400 underline underline-offset-8 decoration-orange-500' : ''
            }`}
          >
            Halloween Suite
          </button>
          <button
            onClick={() => onNavClick('python-engine')}
            className={`hover:text-orange-400 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'python-engine' ? 'text-orange-400 underline underline-offset-8 decoration-orange-500' : ''
            }`}
          >
            Python Engine
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSound}
            className="px-4 py-2 text-xs font-semibold text-black bg-orange-500 rounded-lg hover:bg-orange-400 active:scale-95 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-md shadow-orange-500/20"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isMuted ? 'Unmute Audio' : 'Spooky Audio ON'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
