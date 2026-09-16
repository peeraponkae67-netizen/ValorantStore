'use client';

import React from 'react';
import { DailyStoreData } from '@/types/valorant';
import { VALORANT_CURRENCIES, getCompetitiveTierName } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Trophy, History, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeData: DailyStoreData | null;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  storeData,
}) => {
  const { language } = useLanguage();

  if (!isOpen || !storeData) return null;

  const { player, wallet, mmr, matchHistory } = storeData;

  const getTierIcon = (tier: number) => {
    return `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${tier}/largeicon.png`;
  };

  const getMovementIcon = (movement: string, earned: number) => {
    if (movement === 'INCREASE' || movement === 'PROMOTED' || earned > 0) {
      return <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00ffcc]" />;
    }
    if (movement === 'DECREASE' || movement === 'DEMOTED' || earned < 0) {
      return <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff4655]" />;
    }
    return <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8b978f]" />;
  };

  const getMovementColor = (earned: number) => {
    if (earned > 0) return 'text-[#00ffcc]';
    if (earned < 0) return 'text-[#ff4655]';
    return 'text-[#8b978f]';
  };

  const texts = {
    en: {
      profileTitle: 'PLAYER PROFILE',
      currentRank: 'CURRENT RANK',
      rr: 'RR',
      lastGame: '(Last Game)',
      matchHistory: 'MATCH HISTORY',
      noData: 'No competitive match data available',
      level: 'Level',
      wallet: 'WALLET BALANCE',
    },
    th: {
      profileTitle: 'โปรไฟล์ผู้เล่น',
      currentRank: 'แรงค์ปัจจุบัน',
      rr: 'RR',
      lastGame: '(เกมล่าสุด)',
      matchHistory: 'ประวัติการเล่นล่าสุด',
      noData: 'ไม่พบข้อมูลประวัติการแข่งแรงค์',
      level: 'เลเวล',
      wallet: 'ยอดเงินในกระเป๋า',
    },
  };

  const str = texts[language as 'en' | 'th'] || texts['en'];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl sm:max-w-2xl bg-[#0F1923] border border-[#23303d] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Player Card styling */}
        <div className="relative border-b border-[#23303d] bg-gradient-to-r from-[#111a22] to-[#0b1015] p-4 sm:p-6 overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-48 sm:w-60 h-48 sm:h-60 bg-[#ff4655]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-[#8b978f] hover:text-white bg-[#0b1015]/60 hover:bg-[#192733] border border-[#23303d] rounded-lg transition-colors z-10"
            title="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Player Info Row */}
          <div className="flex items-center gap-3 sm:gap-5 relative z-0 pr-8 sm:pr-0">
            <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-[#1f2e3d] overflow-hidden border-2 border-[#ff4655]/40 shadow-[0_0_15px_rgba(255,70,85,0.2)] flex-shrink-0">
              <img
                src={player.playerCard}
                alt={player.name}
                className="w-full h-full object-cover scale-150"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://media.valorant-api.com/playercards/1711d20d-4b1c-c64a-14be-d4ae58a457c6/displayicon.png';
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-wide truncate font-mono">
                  {player.name}
                </h2>
                <span className="text-xs sm:text-sm font-bold text-[#8b978f] font-mono">
                  #{player.tag}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2.5 mt-1 sm:mt-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-black uppercase bg-[#ff4655]/20 text-[#ff4655] border border-[#ff4655]/30 tracking-wider">
                  {player.region}
                </span>
                <span className="text-[10px] sm:text-xs text-[#8b978f] font-medium bg-[#111a22] border border-[#23303d] px-2 py-0.5 rounded">
                  {str.level} {player.level}
                </span>
                {storeData.isDemo && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                    DEMO
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Wallet summary — horizontal row on mobile, grid on desktop */}
          <div className="flex gap-2 mt-3.5 sm:mt-5 pt-3 sm:pt-4 border-t border-[#23303d]/60">
            {/* VP */}
            <div className="flex-1 flex items-center gap-2 bg-[#0b1015]/70 border border-[#23303d] px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl min-w-0">
              <img src={VALORANT_CURRENCIES.VP.icon} alt="VP" className="w-4 h-4 sm:w-5 sm:h-5 object-contain flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-black text-white font-mono leading-tight truncate">
                  {wallet.vp.toLocaleString()}
                </div>
                <div className="text-[9px] sm:text-[10px] text-[#8b978f] font-semibold tracking-wider leading-none mt-0.5">VP</div>
              </div>
            </div>

            {/* RAD */}
            <div className="flex-1 flex items-center gap-2 bg-[#0b1015]/70 border border-[#23303d] px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl min-w-0">
              <img src={VALORANT_CURRENCIES.RAD.icon} alt="RAD" className="w-4 h-4 sm:w-5 sm:h-5 object-contain flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-black text-[#f1b82d] font-mono leading-tight truncate">
                  {wallet.rad.toLocaleString()}
                </div>
                <div className="text-[9px] sm:text-[10px] text-[#8b978f] font-semibold tracking-wider leading-none mt-0.5">RAD</div>
              </div>
            </div>

            {/* KC */}
            <div className="flex-1 flex items-center gap-2 bg-[#0b1015]/70 border border-[#23303d] px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl min-w-0">
              <img src={VALORANT_CURRENCIES.KC.icon} alt="KC" className="w-4 h-4 sm:w-5 sm:h-5 object-contain flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-black text-[#b5c7d8] font-mono leading-tight truncate">
                  {wallet.kc.toLocaleString()}
                </div>
                <div className="text-[9px] sm:text-[10px] text-[#8b978f] font-semibold tracking-wider leading-none mt-0.5">KC</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 custom-scrollbar">
          {/* Current Rank Card - Horizontal on both mobile & desktop */}
          {mmr ? (
            <div className="bg-[#111a22] border border-[#23303d] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-lg relative overflow-hidden flex items-center gap-3.5 sm:gap-6">
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center">
                <img
                  src={getTierIcon(mmr.currentTier)}
                  alt={mmr.currentTierName}
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-[#8b978f] mb-0.5 sm:mb-1 flex items-center gap-1.5">
                  <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff4655]" />
                  <span>{str.currentRank}</span>
                </div>
                <div className="text-base sm:text-2xl font-black text-white font-mono tracking-wide truncate">
                  {mmr.currentTierName || 'UNRANKED'}
                </div>
                <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono leading-none">
                    {mmr.rankingInTier}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#8b978f]">{str.rr}</span>
                  {mmr.mmrChangeToLastGame !== 0 && (
                    <div
                      className={`text-xs sm:text-sm font-bold flex items-center gap-1 ${getMovementColor(
                        mmr.mmrChangeToLastGame
                      )}`}
                    >
                      {mmr.mmrChangeToLastGame > 0 ? '+' : ''}
                      {mmr.mmrChangeToLastGame} {str.rr}{' '}
                      <span className="text-[10px] sm:text-xs font-normal opacity-80">{str.lastGame}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* Match History Section */}
          <div>
            <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
              <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff4655]" />
              <h3 className="text-[11px] sm:text-xs uppercase font-bold tracking-widest text-[#8b978f]">
                {str.matchHistory}
              </h3>
            </div>

            {matchHistory && matchHistory.length > 0 ? (
              <div className="space-y-2 sm:space-y-2.5">
                {matchHistory.map((match, idx) => (
                  <div
                    key={`${match.matchId}-${idx}`}
                    className="flex items-center justify-between p-2.5 sm:p-3.5 rounded-xl bg-[#111a22] border border-[#1e2c3a] hover:border-[#2a3c4f] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                      <img
                        src={getTierIcon(match.tierAfterUpdate)}
                        alt="Tier"
                        className="w-8 h-8 sm:w-9 sm:h-9 object-contain flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-white font-mono truncate">
                          {match.tierAfterUpdate > 0
                            ? `${getCompetitiveTierName(match.tierAfterUpdate)} • ${match.rankedRatingAfterUpdate} RR`
                            : `${match.rankedRatingAfterUpdate} RR`}
                        </div>
                        <div className="text-[10px] sm:text-xs text-[#8b978f] truncate">
                          {new Date(match.matchStartTime).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                      <div
                        className={`flex items-center gap-1 font-bold text-xs sm:text-sm font-mono whitespace-nowrap ${getMovementColor(
                          match.rankedRatingEarned
                        )}`}
                      >
                        {getMovementIcon(match.competitiveMovement, match.rankedRatingEarned)}
                        <span>
                          {match.rankedRatingEarned > 0 ? '+' : ''}
                          {match.rankedRatingEarned} RR
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 sm:p-8 text-center text-xs sm:text-sm text-[#8b978f] bg-[#111a22]/60 rounded-xl border border-[#23303d]">
                {str.noData}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
