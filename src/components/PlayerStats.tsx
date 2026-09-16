'use client';

import React from 'react';
import { PlayerMMR, MatchHistoryItem } from '@/types/valorant';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCompetitiveTierName } from '@/lib/constants';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PlayerStatsProps {
  mmr?: PlayerMMR | null;
  matchHistory?: MatchHistoryItem[];
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ mmr, matchHistory }) => {
  const { language } = useLanguage();

  if (!mmr && (!matchHistory || matchHistory.length === 0)) {
    return null;
  }

  const getTierIcon = (tier: number) => {
    return `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${tier}/largeicon.png`;
  };

  const getMovementIcon = (movement: string, earned: number) => {
    if (movement === 'INCREASE' || movement === 'PROMOTED' || earned > 0) {
      return <TrendingUp className="w-4 h-4 text-[#00ffcc]" />;
    }
    if (movement === 'DECREASE' || movement === 'DEMOTED' || earned < 0) {
      return <TrendingDown className="w-4 h-4 text-[#ff4655]" />;
    }
    return <Minus className="w-4 h-4 text-[#8b978f]" />;
  };

  const getMovementColor = (earned: number) => {
    if (earned > 0) return 'text-[#00ffcc]';
    if (earned < 0) return 'text-[#ff4655]';
    return 'text-[#8b978f]';
  };

  const texts = {
    en: {
      currentRank: 'CURRENT RANK',
      rating: 'RANK RATING',
      recentMatches: 'RECENT MATCHES',
      rr: 'RR',
      lastGame: '(Last Game)'
    },
    th: {
      currentRank: 'แรงค์ปัจจุบัน',
      rating: 'คะแนนแร้งค์',
      recentMatches: 'ประวัติล่าสุด',
      rr: 'RR',
      lastGame: '(เกมล่าสุด)'
    }
  };

  const str = texts[language as 'en' | 'th'] || texts['en'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Current Rank Card */}
      {mmr && (
        <div className="md:col-span-1 bg-[#111a22] border border-[#23303d] rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#ff4655]/5 rounded-full blur-2xl pointer-events-none" />
          
          <h3 className="text-xs uppercase font-bold tracking-widest text-[#8b978f] mb-4">
            {str.currentRank}
          </h3>
          
          <div className="relative w-28 h-28 mb-3">
            <img 
              src={getTierIcon(mmr.currentTier)} 
              alt={mmr.currentTierName}
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-black text-white font-mono">{mmr.rankingInTier}</span>
            <span className="text-sm text-[#8b978f] font-bold mt-1">{str.rr}</span>
          </div>
          
          {mmr.mmrChangeToLastGame !== 0 && (
            <div className={`text-sm font-bold flex items-center gap-1 mt-1 ${getMovementColor(mmr.mmrChangeToLastGame)}`}>
              {mmr.mmrChangeToLastGame > 0 ? '+' : ''}{mmr.mmrChangeToLastGame} {str.rr} <span className="text-xs font-normal opacity-80">{str.lastGame}</span>
            </div>
          )}
        </div>
      )}

      {/* Match History List */}
      {matchHistory && matchHistory.length > 0 && (
        <div className="md:col-span-2 bg-[#111a22] border border-[#23303d] rounded-2xl p-6 shadow-xl">
          <h3 className="text-xs uppercase font-bold tracking-widest text-[#8b978f] mb-5">
            {str.recentMatches}
          </h3>
          
          <div className="space-y-3">
            {matchHistory.map((match, idx) => (
              <div 
                key={`${match.matchId}-${idx}`}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0b1015] border border-[#192733] hover:border-[#23303d] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={getTierIcon(match.tierAfterUpdate)} 
                    alt="Tier"
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <div className="text-sm font-bold text-white font-mono">
                      {match.tierAfterUpdate > 0
                        ? `${getCompetitiveTierName(match.tierAfterUpdate)} • ${match.rankedRatingAfterUpdate} RR`
                        : `${match.rankedRatingAfterUpdate} RR`}
                    </div>
                    <div className="text-xs text-[#8b978f]">
                      {new Date(match.matchStartTime).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 font-bold text-sm ${getMovementColor(match.rankedRatingEarned)}`}>
                    {getMovementIcon(match.competitiveMovement, match.rankedRatingEarned)}
                    {match.rankedRatingEarned > 0 ? '+' : ''}{match.rankedRatingEarned}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
