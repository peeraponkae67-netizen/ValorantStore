'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Flame, ShieldAlert, ArrowRight } from 'lucide-react';

interface DailyStoreBannerProps {
  playerName: string;
  playerTag: string;
  initialSecondsRemaining: number;
  resetTimestamp: number;
}

export const DailyStoreBanner: React.FC<DailyStoreBannerProps> = ({
  playerName,
  playerTag,
  initialSecondsRemaining,
  resetTimestamp,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  }>({
    hours: Math.floor(initialSecondsRemaining / 3600),
    minutes: Math.floor((initialSecondsRemaining % 3600) / 60),
    seconds: initialSecondsRemaining % 60,
    totalSeconds: initialSecondsRemaining,
  });

  useEffect(() => {
    // Tick every second based on resetTimestamp or countdown
    const timer = setInterval(() => {
      const now = Date.now();
      const diffInSec = Math.max(0, Math.floor((resetTimestamp - now) / 1000));

      const hours = Math.floor(diffInSec / 3600);
      const minutes = Math.floor((diffInSec % 3600) / 60);
      const seconds = diffInSec % 60;

      setTimeLeft({
        hours,
        minutes,
        seconds,
        totalSeconds: diffInSec,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resetTimestamp]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#0F1923] via-[#15222E] to-[#0F1923] border-y sm:border sm:rounded-2xl border-[#23303d] p-6 sm:p-8 shadow-2xl mb-8">
      {/* Background ambient accents & watermarks */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-[#ff4655]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-[#009587]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none text-9xl font-black italic tracking-tighter text-white font-mono">
        ROTATION
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Daily Store For {Name} Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ff4655]/15 text-[#ff4655] text-xs font-bold uppercase tracking-widest border border-[#ff4655]/30">
              <span className="w-2 h-2 rounded-full bg-[#ff4655] animate-pulse" />
              Live 24h Rotation
            </span>
            <span className="text-xs text-[#8b978f] uppercase font-mono tracking-wider">
              Item Storefront v2
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase font-mono">
              Daily Store For <span className="text-[#ff4655] underline decoration-[#ff4655]/40 decoration-4 underline-offset-8">{playerName}</span>
            </h2>
            <span className="text-lg text-[#8b978f] font-mono font-semibold">
              #{playerTag}
            </span>
          </div>

          <p className="text-sm text-[#8b978f] max-w-xl">
            Offers refresh automatically once per day. All skins purchased in your store are permanently added to your Riot Games Valorant collection.
          </p>
        </div>

        {/* Right Side: Remaining Countdown Clock */}
        <div className="flex flex-col sm:items-end">
          <span className="text-xs uppercase font-bold tracking-widest text-[#8b978f] mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#ff4655]" />
            Time Remaining
          </span>

          <div className="flex items-center gap-2 bg-[#0b1015]/80 border border-[#23303d] px-4 py-2.5 rounded-xl shadow-inner font-mono">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-wider">
                {pad(timeLeft.hours)}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#8b978f]">HRS</span>
            </div>
            <span className="text-2xl font-bold text-[#ff4655] animate-pulse -mt-3">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-wider">
                {pad(timeLeft.minutes)}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#8b978f]">MIN</span>
            </div>
            <span className="text-2xl font-bold text-[#ff4655] animate-pulse -mt-3">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-[#ff4655] tracking-wider">
                {pad(timeLeft.seconds)}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#ff4655]/80">SEC</span>
            </div>
          </div>

          <div className="text-[11px] text-[#8b978f] mt-1.5 font-mono">
            Next reset at 07:00 AM WIB (00:00 UTC)
          </div>
        </div>
      </div>
    </div>
  );
};
