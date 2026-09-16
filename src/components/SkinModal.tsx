'use client';

import React, { useState, useEffect } from 'react';
import { SkinOffer } from '@/types/valorant';
import { VALORANT_CURRENCIES } from '@/lib/constants';
import { calculateVpTopup, THAILAND_VP_PACKS } from '@/lib/vpCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Bookmark, Volume2, Sparkles, Check, ShoppingBag, CreditCard, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
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
  const [showPacks, setShowPacks] = useState<boolean>(false);

  useEffect(() => {
    setSelectedChromaIdx(0);
    setShowPacks(false);
  }, [skin?.uuid]);

  if (!skin) return null;

  const chromas = skin.chromas || [];
  const levels = skin.levels || [];
  const tier = skin.tier || { name: 'Standard', color: '#F1B82D', icon: '', highlightColor: '' };
  const tierColor = tier.color || '#F1B82D';

  const currentChroma = chromas[selectedChromaIdx] || chromas[0] || null;
  const rawImage =
    currentChroma?.fullRender ||
    currentChroma?.displayIcon ||
    skin.displayIcon;
  const currentImage =
    rawImage && !rawImage.includes('7122d78b-4e60-eb4d-5f65-738d7c1ce9ae')
      ? rawImage
      : chromas?.[0]?.displayIcon ||
        chromas?.[0]?.fullRender ||
        levels?.[0]?.displayIcon ||
        'https://media.valorant-api.com/weaponskinchromas/df1786b2-4f3d-f207-b92c-0780f4dffb79/displayicon.png';

  const skinPrice = skin.price || 0;
  const userBalance = userVp ?? 0;
  const canAfford = userBalance >= skinPrice;
  const vpCalc = calculateVpTopup(skinPrice, userBalance);

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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0F1923] border border-[#23303d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header bar with tier color */}
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: tierColor, boxShadow: `0 0 16px ${tierColor}` }}
        />

        {/* Modal Top Nav */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23303d] bg-[#0b1015]/60">
          <div className="flex items-center gap-3">
            {tier.icon && (
              <img
                src={tier.icon}
                alt={tier.name}
                className="w-6 h-6 object-contain"
                style={{ filter: `drop-shadow(0 0 6px ${tierColor})` }}
              />
            )}
            <div>
              <span
                className="text-xs font-bold uppercase tracking-widest font-mono"
                style={{ color: tierColor }}
              >
                {tier.name} Edition
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
          {chromas.length > 1 && (
            <div>
              <h4 className="text-xs uppercase font-bold tracking-widest text-[#8b978f] mb-3">
                Color Variants ({chromas.length})
              </h4>
              <div className="flex flex-wrap gap-3">
                {chromas.map((chroma, idx) => (
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
                    <span>
                      {(chroma.displayName || '').replace(skin.displayName || '', '').trim() || 'Default'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Skin Levels Tracker */}
          {levels.length > 0 && (
            <div>
              <h4 className="text-xs uppercase font-bold tracking-widest text-[#8b978f] mb-3">
                Upgrade Progression ({levels.length} Levels)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {levels.map((lvl, idx) => (
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

          {/* VP to THB Top-up Calculator Section */}
          <div className="bg-[#121b24] border border-[#23303d] rounded-xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#ff4655]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  คำนวณการเติมเงิน (VP to THB Calculator)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowPacks((prev) => !prev)}
                className="text-[11px] font-mono text-[#8b978f] hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>ตารางเรทเงินไทย (THB)</span>
                {showPacks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {vpCalc.isEnough ? (
              <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold">VP ของคุณเพียงพอ!</span> คุณมี {userBalance.toLocaleString()} VP (หลังซื้อจะเหลือ{' '}
                  <span className="font-mono font-bold">{Math.max(0, userBalance - skinPrice).toLocaleString()} VP</span>)
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#ff4655]/10 border border-[#ff4655]/30 rounded-xl">
                  <div>
                    <div className="text-xs text-[#8b978f]">
                      ยอด VP คงเหลือ: <span className="font-mono font-bold text-white">{userBalance.toLocaleString()} VP</span>
                    </div>
                    <div className="text-sm font-bold text-[#ff4655] mt-0.5">
                      ขาดอีก <span className="font-mono">{vpCalc.missingVp.toLocaleString()} VP</span> จึงจะซื้อสกินนี้ได้
                    </div>
                  </div>

                  {vpCalc.recommendedPack && (
                    <div className="sm:text-right bg-[#0b1015]/80 p-2.5 rounded-lg border border-[#2a3848]">
                      <div className="text-[11px] text-[#8b978f] uppercase font-mono">แนะนำแพ็กเกจเติมเงิน</div>
                      <div className="text-base font-extrabold text-[#f1b82d] font-mono">
                        {vpCalc.recommendedPack.thb.toLocaleString()} THB
                        <span className="text-xs text-white/80 font-normal ml-1.5">
                          (+{vpCalc.recommendedPack.vp.toLocaleString()} VP)
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                        หลังซื้อจะเหลือ {vpCalc.recommendedPack.remainingAfterPurchase.toLocaleString()} VP
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Expandable Rate Table */}
            {showPacks && (
              <div className="pt-2 border-t border-[#23303d] animate-in fade-in duration-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {THAILAND_VP_PACKS.map((pack) => (
                    <div
                      key={pack.thb}
                      className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                        !vpCalc.isEnough && vpCalc.recommendedPack?.thb === pack.thb
                          ? 'bg-[#ff4655]/15 border-[#ff4655] text-white ring-1 ring-[#ff4655]'
                          : 'bg-[#0d151c] border-[#1e2a36] text-[#8b978f]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white font-mono">{pack.thb} ฿</span>
                        {pack.bonus && (
                          <span className="text-[9px] px-1 py-0.5 bg-[#f1b82d]/20 text-[#f1b82d] font-bold rounded">
                            {pack.bonus}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono font-semibold text-[#ece8e1] mt-1">
                        {pack.vp.toLocaleString()} VP
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
                  {skinPrice > 0 ? skinPrice.toLocaleString() : 'Bundle Item'}
                </span>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-[#23303d]" />

            <div>
              <span className="text-[11px] text-[#8b978f] uppercase font-mono">Your Balance</span>
              <div className="text-sm font-bold text-[#8b978f] font-mono">
                {userBalance.toLocaleString()} VP
              </div>
            </div>

            {!vpCalc.isEnough && (
              <>
                <div className="h-8 w-[1px] bg-[#23303d] hidden sm:block" />
                <div className="hidden sm:block">
                  <span className="text-[11px] text-[#ff4655] uppercase font-mono font-bold">Needs Top-up</span>
                  <div className="text-xs font-mono text-[#ff4655]">
                    ~{vpCalc.recommendedPack?.thb.toLocaleString()} THB
                  </div>
                </div>
              </>
            )}
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
