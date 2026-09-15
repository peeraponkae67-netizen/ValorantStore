'use client';

import React, { useState } from 'react';
import { NightMarketData, SkinOffer } from '@/types/valorant';
import { VALORANT_CURRENCIES } from '@/lib/constants';
import { Moon, Sparkles, Tag, Eye } from 'lucide-react';

interface NightMarketProps {
  nightMarket: NightMarketData;
  onInspectSkin: (skin: SkinOffer) => void;
}

export const NightMarket: React.FC<NightMarketProps> = ({
  nightMarket,
  onInspectSkin,
}) => {
  // Track which cards are flipped (revealed)
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const revealAll = () => {
    const all: Record<number, boolean> = {};
    nightMarket.offers.forEach((_, idx) => {
      all[idx] = true;
    });
    setFlippedCards(all);
  };

  return (
    <div className="my-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0c131a] via-[#101b26] to-[#0c131a] border border-[#23303d] shadow-2xl relative overflow-hidden">
      {/* Night Market glowing accents */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#ff4655]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
              <Moon className="w-3.5 h-3.5" />
              Bonus Store
            </span>
            <span className="text-xs text-[#8b978f] uppercase font-mono">
              Limited Time Deals
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-mono tracking-tight">
            NIGHT <span className="text-indigo-400">MARKET</span>
          </h3>
          <p className="text-xs text-[#8b978f]">
            Click any card to reveal your custom discounted weapon offer!
          </p>
        </div>

        <button
          onClick={revealAll}
          className="px-4 py-2 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 text-indigo-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors self-start sm:self-auto"
        >
          Reveal All Deals
        </button>
      </div>

      {/* 6 Night Market Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {nightMarket.offers.map((skin, idx) => {
          const isFlipped = flippedCards[idx];
          const tierColor = skin.tier.color || '#5A9FE2';

          return (
            <div
              key={skin.uuid || idx}
              onClick={() => toggleFlip(idx)}
              className="h-56 cursor-pointer perspective-1000 select-none group"
            >
              <div
                className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front of card (Unopened mystery state) */}
                <div className="absolute inset-0 backface-hidden bg-[#121c27] border-2 border-indigo-500/30 hover:border-indigo-400/60 rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-lg transition-all group-hover:scale-[1.02]">
                  <div className="w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mb-3">
                    <Moon className="w-7 h-7 text-indigo-300 animate-pulse" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest text-indigo-200 font-mono">
                    NIGHT MARKET
                  </span>
                  <span className="text-[11px] text-[#8b978f] mt-1 font-mono">
                    CLICK TO REVEAL
                  </span>
                </div>

                {/* Back of card (Revealed skin offer) */}
                <div
                  className="absolute inset-0 backface-hidden rotate-y-180 bg-[#0F1923] border border-[#23303d] rounded-xl p-4 flex flex-col justify-between shadow-xl"
                  style={{ borderTopColor: tierColor, borderTopWidth: '4px' }}
                >
                  {/* Top info & discount badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider font-mono"
                      style={{ color: tierColor }}
                    >
                      {skin.tier.name}
                    </span>

                    {skin.discountPercent && (
                      <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black px-2 py-0.5 rounded font-mono">
                        <Tag className="w-3 h-3" />
                        -{skin.discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Weapon Render */}
                  <div className="my-1 flex items-center justify-center h-24">
                    <img
                      src={skin.displayIcon}
                      alt={skin.displayName}
                      className="max-h-full max-w-[90%] object-contain filter drop-shadow-md"
                    />
                  </div>

                  {/* Footer: Name & Discounted Price */}
                  <div className="pt-2 border-t border-[#1e2d3d] flex items-center justify-between">
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="text-xs font-bold text-white uppercase truncate">
                        {skin.displayName}
                      </h4>
                      {skin.originalPrice && (
                        <span className="text-[10px] text-[#8b978f] line-through font-mono">
                          {skin.originalPrice.toLocaleString()} VP
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 bg-[#14202c] px-2.5 py-1 rounded border border-[#23303d]">
                      <img
                        src={VALORANT_CURRENCIES.VP.icon}
                        alt="VP"
                        className="w-3.5 h-3.5 object-contain"
                      />
                      <span className="text-xs font-black text-emerald-400 font-mono">
                        {skin.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
