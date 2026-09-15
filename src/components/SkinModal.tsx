'use client';

import React, { useState } from 'react';
import { SkinOffer } from '@/types/valorant';
import { VALORANT_CURRENCIES } from '@/lib/constants';
import { X, Bookmark, Volume2, Sparkles, Check, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SkinModalProps {
  skin: SkinOffer | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (skin: SkinOffer) => void;
  userVp: number;
}

export const SkinModal: React.FC<SkinModalProps> = ({
  skin,
  onClose,
  isWishlisted,
  onToggleWishlist,
  userVp,
}) => {
  const [selectedChromaIdx, setSelectedChromaIdx] = useState<number>(0);
  const [purchased, setPurchased] = useState<boolean>(false);

  if (!skin) return null;

  const currentChroma = skin.chromas[selectedChromaIdx] || null;
  const currentImage =
    currentChroma?.fullRender ||
    currentChroma?.displayIcon ||
    skin.displayIcon;

  const tierColor = skin.tier.color || '#F1B82D';
  const canAfford = userVp >= skin.price;

  const handleSimulatePurchase = () => {
    setPurchased(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4655', '#f1b82d', '#009587', '#ece8e1'],
    });
    setTimeout(() => {
      setPurchased(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0F1923] border border-[#23303d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header bar with tier color */}
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: tierColor, boxShadow: `0 0 16px ${tierColor}` }}
        />

        {/* Modal Top Nav */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23303d] bg-[#0b1015]/60">
          <div className="flex items-center gap-3">
            {skin.tier.icon && (
              <img
                src={skin.tier.icon}
                alt={skin.tier.name}
                className="w-6 h-6 object-contain"
                style={{ filter: `drop-shadow(0 0 6px ${tierColor})` }}
              />
            )}
            <div>
              <span
                className="text-xs font-bold uppercase tracking-widest font-mono"
                style={{ color: tierColor }}
              >
                {skin.tier.name} Edition
              </span>
              <h2 className="text-xl font-black text-white uppercase tracking-wide">
                {skin.displayName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(skin)}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isWishlisted
                  ? 'bg-[#ff4655] border-[#ff4655] text-white'
                  : 'bg-[#15222E] border-[#23303d] text-[#8b978f] hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#8b978f] hover:text-white bg-[#15222E] hover:bg-[#1f2e3d] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Central Weapon Cinema Stage */}
          <div className="relative w-full h-64 sm:h-80 bg-gradient-to-b from-[#15222E]/40 to-[#0B1015]/80 border border-[#1e2d3d] rounded-xl flex items-center justify-center p-8 overflow-hidden group">
            {/* Background stage glow */}
            <div
              className="absolute inset-0 opacity-15 blur-3xl"
              style={{ backgroundColor: tierColor }}
            />

            <img
              src={currentImage}
              alt={skin.displayName}
              className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)] transition-all duration-500 scale-110 group-hover:scale-115"
              onError={(e) => {
                e.currentTarget.src =
                  'https://media.valorant-api.com/weaponskins/d8d5d7a1-4d81-8560-54bc-0692ab40f69b/displayicon.png';
              }}
            />

            {/* Active Chroma Label */}
            {currentChroma && (
              <div className="absolute bottom-3 left-4 text-xs font-mono text-[#8b978f] bg-[#0b1015]/80 px-2.5 py-1 rounded border border-[#23303d]">
                Chroma: <span className="text-white font-bold">{currentChroma.displayName}</span>
              </div>
            )}
          </div>

          {/* Chroma Variant Selector */}
          {skin.chromas.length > 1 && (
            <div>
              <h4 className="text-xs uppercase font-bold tracking-widest text-[#8b978f] mb-3">
                Color Variants ({skin.chromas.length})
              </h4>
              <div className="flex flex-wrap gap-3">
                {skin.chromas.map((chroma, idx) => (
                  <button
                    key={chroma.uuid || idx}
                    onClick={() => setSelectedChromaIdx(idx)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      selectedChromaIdx === idx
                        ? 'border-[#ff4655] bg-[#ff4655]/10 text-white ring-1 ring-[#ff4655]'
                        : 'border-[#23303d] bg-[#14202c] text-[#8b978f] hover:border-[#3d5064] hover:text-white'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 bg-cover bg-center"
                      style={{
                        backgroundColor: idx === 0 ? tierColor : '#2b3947',
                        backgroundImage: chroma.swatch ? `url(${chroma.swatch})` : undefined,
                      }}
                    />
                    <span>{chroma.displayName.replace(skin.displayName, '').trim() || 'Default'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Skin Levels Tracker */}
          {skin.levels.length > 0 && (
            <div>
              <h4 className="text-xs uppercase font-bold tracking-widest text-[#8b978f] mb-3">
                Upgrade Progression ({skin.levels.length} Levels)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {skin.levels.map((lvl, idx) => (
                  <div
                    key={lvl.uuid || idx}
                    className="bg-[#14202c] border border-[#23303d] p-3 rounded-xl flex flex-col justify-between text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5 gap-2 overflow-hidden">
                      <span className="font-bold text-[#ff4655] font-mono whitespace-nowrap">LEVEL {idx + 1}</span>
                      {lvl.levelItem && (
                        <span 
                          className="text-[10px] px-1.5 py-0.5 bg-[#1f2e3d] text-[#8b978f] rounded font-semibold uppercase truncate"
                          title={lvl.levelItem.replace(/EEquippableSkinLevelItem::/i, '')}
                        >
                          {lvl.levelItem.replace(/EEquippableSkinLevelItem::/i, '')}
                        </span>
                      )}
                    </div>
                    <span className="text-[#ece8e1] font-medium leading-snug">
                      {lvl.displayName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Purchase & Details */}
        <div className="px-6 py-4 bg-[#0b1015] border-t border-[#23303d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[11px] text-[#8b978f] uppercase font-mono">Cost</span>
              <div className="flex items-center gap-1.5">
                <img
                  src={VALORANT_CURRENCIES.VP.icon}
                  alt="VP"
                  className="w-5 h-5 object-contain"
                />
                <span className="text-xl font-extrabold text-white font-mono">
                  {skin.price.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-[#23303d]" />

            <div>
              <span className="text-[11px] text-[#8b978f] uppercase font-mono">Your Balance</span>
              <div className="text-sm font-bold text-[#8b978f] font-mono">
                {userVp.toLocaleString()} VP
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulatePurchase}
              className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all ${
                purchased
                  ? 'bg-emerald-600 text-white'
                  : 'btn-valorant'
              }`}
            >
              {purchased ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Purchased to Inventory!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Simulate Purchase</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
