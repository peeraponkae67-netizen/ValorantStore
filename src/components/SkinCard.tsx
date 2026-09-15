'use client';

import React from 'react';
import { SkinOffer } from '@/types/valorant';
import { VALORANT_CURRENCIES } from '@/lib/constants';
import { Eye, Bookmark, Sparkles, Check } from 'lucide-react';

interface SkinCardProps {
  skin: SkinOffer;
  onInspect: (skin: SkinOffer) => void;
  isWishlisted: boolean;
  onToggleWishlist: (skin: SkinOffer) => void;
}

export const SkinCard: React.FC<SkinCardProps> = ({
  skin,
  onInspect,
  isWishlisted,
  onToggleWishlist,
}) => {
  const tierColor = skin.tier.color || '#F1B82D';

  return (
    <div
      className="group relative flex flex-col justify-between bg-[#0F1923] border border-[#23303d] hover:border-[#384a5c] rounded-xl p-5 transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer"
      onClick={() => onInspect(skin)}
    >
      {/* Top tier color accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: tierColor, boxShadow: `0 0 12px ${tierColor}` }}
      />

      {/* Ambient background glow matching tier */}
      <div
        className="absolute -right-16 -top-16 w-44 h-44 rounded-full opacity-10 blur-3xl pointer-events-none group-hover:opacity-25 transition-opacity"
        style={{ backgroundColor: tierColor }}
      />

      {/* Header: Tier info & Wishlist toggle */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {skin.tier.icon && (
            <img
              src={skin.tier.icon}
              alt={skin.tier.name}
              className="w-5 h-5 object-contain"
              style={{ filter: `drop-shadow(0 0 4px ${tierColor})` }}
            />
          )}
          <span
            className="text-xs font-bold uppercase tracking-wider font-mono"
            style={{ color: tierColor }}
          >
            {skin.tier.name} Tier
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(skin);
          }}
          className={`p-1.5 rounded-lg border transition-all ${
            isWishlisted
              ? 'bg-[#ff4655] border-[#ff4655] text-white'
              : 'bg-[#15222E]/80 border-[#23303d] text-[#8b978f] hover:text-white hover:border-[#42586e]'
          }`}
          title={isWishlisted ? 'In your wishlist' : 'Add to wishlist'}
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      {/* Weapon Display Render */}
      <div className="relative z-10 my-6 py-4 flex items-center justify-center min-h-[160px]">
        <img
          src={skin.displayIcon}
          alt={skin.displayName}
          className="max-h-[130px] max-w-[95%] object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'https://media.valorant-api.com/weaponskins/d8d5d7a1-4d81-8560-54bc-0692ab40f69b/displayicon.png';
          }}
        />
      </div>

      {/* Footer: Name, Chromas preview, Price & Inspect */}
      <div className="relative z-10 pt-4 border-t border-[#1e2c3a]">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-base font-bold text-white uppercase tracking-wide group-hover:text-[#ff4655] transition-colors truncate">
            {skin.displayName}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-3 mt-3">
          {/* Chromas preview dots if any */}
          <div className="flex items-center gap-1.5">
            {skin.chromas.length > 1 ? (
              skin.chromas.slice(0, 4).map((c, idx) => (
                <div
                  key={c.uuid || idx}
                  className="w-3.5 h-3.5 rounded-full border border-white/20 bg-cover bg-center overflow-hidden"
                  style={{
                    backgroundColor: idx === 0 ? tierColor : '#2b3947',
                    backgroundImage: c.swatch ? `url(${c.swatch})` : undefined,
                  }}
                  title={c.displayName}
                />
              ))
            ) : (
              <span className="text-[11px] text-[#8b978f] uppercase font-mono">
                {skin.weaponType || 'Standard'}
              </span>
            )}
          </div>

          {/* Price with VP Icon */}
          <div className="flex items-center gap-1.5 bg-[#14202c] px-3 py-1.5 rounded-lg border border-[#23303d]">
            <img
              src={VALORANT_CURRENCIES.VP.icon}
              alt="VP"
              className="w-4 h-4 object-contain"
            />
            <span className="text-sm font-extrabold text-white tracking-wider font-mono">
              {skin.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Quick Inspect Button on Hover */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ff4655] pt-1">
          <Eye className="w-3.5 h-3.5" />
          <span>Inspect Skin</span>
        </div>
      </div>
    </div>
  );
};
