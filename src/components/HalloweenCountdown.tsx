import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar } from 'lucide-react';
import { AnimatedPumpkin } from './AnimatedPumpkin';

export const HalloweenCountdown: React.FC = () => {
  // Live Countdown to Halloween (Oct 31 Midnight)
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let targetYear = now.getFullYear();
      let halloween = new Date(targetYear, 9, 31, 23, 59, 59); // Oct 31

      // If already past Halloween this year, target next year
      if (now.getTime() > halloween.getTime()) {
        halloween = new Date(targetYear + 1, 9, 31, 23, 59, 59);
      }

      const diff = halloween.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-6">
      {/* Halloween Countdown Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#160f29] to-[#0e091a] border border-orange-500/30 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <AnimatedPumpkin size={44} fearLevel={6} interactive={false} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-cinzel">
                  Halloween Countdown
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950/80 border border-orange-500/40 text-orange-300">
                  OCT 31 MIDNIGHT
                </span>
              </div>
              <p className="text-xs text-orange-400/90 font-mono">
                The Witching Hour Approaches · Live Cemetery Clock
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-black/40 px-3.5 py-1.5 rounded-xl border border-purple-500/20">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>Target: October 31, 23:59:59</span>
          </div>
        </div>

        {/* Big Countdown Digits */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 sm:p-6 rounded-2xl bg-[#1b1233] border border-purple-500/25 shadow-lg group hover:border-orange-500/40 transition-colors">
            <span className="block text-4xl sm:text-5xl font-black font-mono text-orange-400 tabular-nums">
              {timeLeft.days.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-zinc-400 uppercase tracking-widest font-mono mt-1 block">
              Days Left
            </span>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl bg-[#1b1233] border border-purple-500/25 shadow-lg group hover:border-orange-500/40 transition-colors">
            <span className="block text-4xl sm:text-5xl font-black font-mono text-orange-400 tabular-nums">
              {timeLeft.hours.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-zinc-400 uppercase tracking-widest font-mono mt-1 block">
              Hours
            </span>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl bg-[#1b1233] border border-purple-500/25 shadow-lg group hover:border-orange-500/40 transition-colors">
            <span className="block text-4xl sm:text-5xl font-black font-mono text-orange-400 tabular-nums">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-zinc-400 uppercase tracking-widest font-mono mt-1 block">
              Minutes
            </span>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl bg-[#1b1233] border border-purple-500/25 shadow-lg group hover:border-orange-500/40 transition-colors">
            <span className="block text-4xl sm:text-5xl font-black font-mono text-orange-400 tabular-nums">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-zinc-400 uppercase tracking-widest font-mono mt-1 block">
              Seconds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
