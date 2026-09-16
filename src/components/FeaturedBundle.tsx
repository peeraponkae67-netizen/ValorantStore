'use client';

import React, { useState, useEffect } from 'react';
import { FeaturedBundleData } from '@/types/valorant';
import { VALORANT_CURRENCIES } from '@/lib/constants';
import { Sparkles, Layers, ShieldCheck, Clock } from 'lucide-react';

interface FeaturedBundleProps {
  bundle: FeaturedBundleData;
  onViewCollection?: () => void;
}

export const FeaturedBundle: React.FC<FeaturedBundleProps> = ({ bundle, onViewCollection }) => {
  const discount = Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100);
  const [diffInSec, setDiffInSec] = useState<number>(bundle.remainingDuration || 0);

  useEffect(() => {
    setDiffInSec(bundle.remainingDuration || 0);
    const timer = setInterval(() => {
      setDiffInSec((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [bundle.remainingDuration]);

  const days = Math.floor(diffInSec / 86400);
  const hours = Math.floor((diffInSec % 86400) / 3600);
  const minutes = Math.floor((diffInSec % 3600) / 60);
  const seconds = diffInSec % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="my-6 relative overflow-hidden rounded-2xl border border-[#23303d] bg-gradient-to-r from-[#0F1923] via-[#14222f] to-[#0F1923] p-6 sm:p-8 shadow-2xl">
      {/* Background Banner Image */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 opacity-25 pointer-events-none overflow-hidden">
        <img
          src={bundle.displayIcon}
          alt={bundle.displayName}
          className="w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1923] via-[#0F1923]/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-[#f1b82d]/20 text-[#f1b82d] text-xs font-bold uppercase tracking-wider border border-[#f1b82d]/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Featured Bundle
          </span>
          {discount > 0 && (
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Save {discount}%
            </span>
          )}
          {diffInSec > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0b1015]/80 border border-[#23303d] text-xs font-mono font-bold text-[#f1b82d]">
              <Clock className="w-3.5 h-3.5 text-[#ff4655] animate-pulse" />
              <span className="text-[#8b978f] hidden sm:inline">เหลือเวลา:</span>
              <span className="text-white">
                {days > 0 ? `${days} วัน ` : ''}{pad(hours)}:{pad(minutes)}:{pad(seconds)}
              </span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-mono">
            {bundle.displayName}
          </h3>
          <p className="text-xs text-[#8b978f] mt-1">
            Complete collection bundle featuring exclusive weapon skins, gun buddies, player cards, and custom finishers.
          </p>
        </div>

        {/* Bundle Items Mini Thumbnails */}
        <div className="flex items-center gap-2 pt-2">
          {bundle.items.slice(0, 4).map((item, idx) => (
            <div
              key={item.uuid || idx}
              className="w-14 h-10 bg-[#0b1015]/80 border border-[#23303d] rounded-lg flex items-center justify-center p-1"
              title={item.displayName}
            >
              <img
                src={item.displayIcon}
                alt={item.displayName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
          <span className="text-xs font-bold text-[#8b978f] pl-1 font-mono">+ Cards & Buddy</span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 bg-[#0b1015]/90 px-4 py-2 rounded-xl border border-[#23303d]">
            <img
              src={VALORANT_CURRENCIES.VP.icon}
              alt="VP"
              className="w-5 h-5 object-contain"
            />
            <span className="text-lg font-black text-white font-mono">
              {bundle.price.toLocaleString()}
            </span>
            <span className="text-xs text-[#8b978f] line-through font-mono pl-1">
              {bundle.originalPrice.toLocaleString()} VP
            </span>
          </div>

          <button
            type="button"
            onClick={onViewCollection}
            className="btn-valorant px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-transform"
          >
            View Collection
          </button>
        </div>
      </div>
    </div>
  );
};
