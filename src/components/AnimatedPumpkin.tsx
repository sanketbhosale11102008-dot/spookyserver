import React from 'react';
import { spookyAudio } from '../utils/soundEffects';

interface AnimatedPumpkinProps {
  size?: number;
  fearLevel?: number;
  interactive?: boolean;
  className?: string;
  tooltip?: string;
}

export const AnimatedPumpkin: React.FC<AnimatedPumpkinProps> = ({
  size = 56,
  fearLevel = 5,
  interactive = true,
  className = '',
  tooltip,
}) => {
  const isHighFear = fearLevel >= 8;

  const handleClick = () => {
    if (!interactive) return;
    if (isHighFear) {
      spookyAudio.playJumpScare();
    } else {
      spookyAudio.playTollBell();
    }
  };

  return (
    <div
      onClick={handleClick}
      title={tooltip || (interactive ? 'Click to awaken the Jack-o\'-lantern' : undefined)}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 ${
        isHighFear ? 'animate-pumpkin-chatter' : 'animate-pumpkin-float'
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full drop-shadow-md ${isHighFear ? 'filter drop-shadow-[0_0_18px_#ef4444]' : 'animate-pumpkin-flicker'}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pumpkin Stem */}
        <path
          d="M48 10 C50 3, 56 2, 59 7 C60 11, 55 16, 52 18"
          stroke="#15803d"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Pumpkin Body segments */}
        <ellipse cx="50" cy="56" rx="42" ry="36" fill={isHighFear ? '#ea580c' : '#f97316'} />
        <ellipse cx="50" cy="56" rx="30" ry="36" fill={isHighFear ? '#c2410c' : '#ea580c'} />
        <ellipse cx="50" cy="56" rx="16" ry="36" fill={isHighFear ? '#9a3412' : '#c2410c'} />

        {/* Carved Glowing Eyes (Flickering Candle Core) */}
        <polygon
          points="28,42 38,36 36,49"
          fill={isHighFear ? '#fef08a' : '#fef08a'}
          className="animate-candle-pulse"
        />
        <polygon
          points="72,42 62,36 64,49"
          fill={isHighFear ? '#fef08a' : '#fef08a'}
          className="animate-candle-pulse"
        />

        {/* Carved Glowing Nose */}
        <polygon
          points="50,47 45,54 55,54"
          fill={isHighFear ? '#fef08a' : '#fef08a'}
        />

        {/* Carved Sinister Tooth Grin */}
        {isHighFear ? (
          // Jagged unhinged terror grin
          <path
            d="M24 64 Q50 86 76 64 Q68 76 50 78 Q32 76 24 64 Z 
               M32 67 L34 74 L38 68 M44 70 L46 76 L50 71 M56 71 L58 76 L62 69 M68 67 L66 73"
            fill="#fef08a"
            stroke="#7f1d1d"
            strokeWidth="1.5"
            className="animate-candle-pulse"
          />
        ) : (
          // Classic eerie grin
          <path
            d="M26 63 C34 76, 66 76, 74 63 C66 71, 34 71, 26 63 Z"
            fill="#fef08a"
            stroke="#9a3412"
            strokeWidth="1.5"
            className="animate-candle-pulse"
          />
        )}
      </svg>
      {/* Subtle flame aura */}
      <div className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300 ${isHighFear ? 'bg-red-500/20 blur-md' : 'bg-orange-500/15 blur-sm'}`} />
    </div>
  );
};
