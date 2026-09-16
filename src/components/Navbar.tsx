'use client';

import React from 'react';
import Image from 'next/image';
import { DailyStoreData } from '@/types/valorant';
import { VALORANT_CURRENCIES } from '@/lib/constants';
import { LogOut, RefreshCw, Bookmark, ExternalLink, Users } from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';

interface NavbarProps {
  storeData: DailyStoreData | null;
  activeView: 'grid' | 'discord';
  setActiveView: (view: 'grid' | 'discord') => void;
  onOpenWishlist: () => void;
  onOpenProfile?: () => void;
  onOpenAccountSwitcher?: () => void;
  savedAccountCount?: number;
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  storeData,
  activeView,
  setActiveView,
  onOpenWishlist,
  onOpenProfile,
  onOpenAccountSwitcher,
  savedAccountCount,
  onRefresh,
  onLogout,
  isRefreshing,
}) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#23303d] bg-[#0b1015]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 flex-shrink-0">
            <Image src="/logo.jpg" alt="Valorant Logo" fill priority className="object-cover rounded-full" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-xl font-extrabold tracking-wider uppercase text-white font-mono truncate">
                {t.navbar.title.split(' ')[0]} <span className="text-[#ff4655]">{t.navbar.title.split(' ')[1]}</span>
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-[#1f2e3d] text-[#8b978f] rounded">
                {t.navbar.version}
              </span>
            </div>
            <a
              href="https://www.instagram.com/peerap0nn_/"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] sm:text-xs text-[#8b978f] hover:text-[#ff4655] flex items-center gap-1 transition-colors group truncate"
              title="Created by @peerap0nn_"
            >
              <span className="truncate">{t.navbar.basedOn}</span>
              <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1.5 sm:gap-4 flex-shrink-0">
          {storeData && (
            <div className="flex items-center gap-1.5 sm:gap-4">
              {/* Wallet Balances — desktop only */}
              <div className="hidden md:flex items-center gap-4 bg-[#111a22] border border-[#23303d] px-3.5 py-1.5 rounded-lg">
                <div className="flex items-center gap-1.5" title="Valorant Points">
                  <img src={VALORANT_CURRENCIES.VP.icon} alt="VP" className="w-5 h-5 object-contain" />
                  <span className="text-sm font-bold text-white tracking-wide">
                    {storeData.wallet.vp.toLocaleString()}
                  </span>
                </div>
                <div className="w-[1px] h-4 bg-[#23303d]" />
                <div className="flex items-center gap-1.5" title="Radianite Points">
                  <img src={VALORANT_CURRENCIES.RAD.icon} alt="Radianite" className="w-4 h-4 object-contain" />
                  <span className="text-sm font-bold text-[#f1b82d] tracking-wide">
                    {storeData.wallet.rad.toLocaleString()}
                  </span>
                </div>
                <div className="w-[1px] h-4 bg-[#23303d]" />
                <div className="flex items-center gap-1.5" title="Kingdom Credits">
                  <img src={VALORANT_CURRENCIES.KC.icon} alt="Kingdom Credits" className="w-4 h-4 object-contain" />
                  <span className="text-sm font-bold text-[#b5c7d8] tracking-wide">
                    {storeData.wallet.kc.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={onOpenWishlist}
                  className="p-2 bg-[#111a22] hover:bg-[#192733] border border-[#23303d] text-[#ece8e1] rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                  title="รายการที่อยากได้"
                >
                  <Bookmark className="w-4 h-4 text-[#ff4655]" />
                  <span className="hidden xl:inline">Wishlist</span>
                </button>

                <button
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className={`p-2 bg-[#111a22] hover:bg-[#192733] border border-[#23303d] text-[#ece8e1] rounded-lg transition-colors ${
                    isRefreshing ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  title="รีเฟรชร้านค้า"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#ff4655]' : ''}`} />
                </button>

                {onOpenAccountSwitcher && (
                  <button
                    onClick={onOpenAccountSwitcher}
                    className="p-2 bg-[#111a22] hover:bg-[#192733] border border-[#23303d] text-[#ece8e1] rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                    title="สลับบัญชี"
                  >
                    <Users className="w-4 h-4 text-[#00e5ff]" />
                    <span className="hidden xl:inline">บัญชี</span>
                    {typeof savedAccountCount === 'number' && savedAccountCount > 1 && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-[#ff4655] text-white font-bold rounded-full leading-none">
                        {savedAccountCount}
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Player Profile & Logout */}
              <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 sm:border-l sm:border-[#23303d]">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5 rounded-xl hover:bg-[#192733] border border-transparent hover:border-[#23303d] transition-all group text-left cursor-pointer"
                  title="ดูโปรไฟล์และประวัติการเล่น"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#1f2e3d] overflow-hidden border border-[#23303d] group-hover:border-[#ff4655]/60 transition-colors">
                      <img
                        src={storeData.player.playerCard}
                        alt={storeData.player.name}
                        className="w-full h-full object-cover scale-150"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://media.valorant-api.com/playercards/1711d20d-4b1c-c64a-14be-d4ae58a457c6/displayicon.png';
                        }}
                      />
                    </div>
                    {storeData.mmr?.currentTier && storeData.mmr.currentTier > 2 ? (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0b1015] border border-[#23303d] flex items-center justify-center p-0.5 shadow-md z-10">
                        <img
                          src={`https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${storeData.mmr.currentTier}/largeicon.png`}
                          alt="Rank"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white tracking-wide group-hover:text-[#ff4655] transition-colors">
                        {storeData.player.name}
                      </span>
                      <span className="text-xs text-[#8b978f] font-mono">
                        #{storeData.player.tag}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#8b978f]">
                      <span className="uppercase font-semibold text-[#ff4655]">
                        {storeData.player.region}
                      </span>
                      <span>•</span>
                      <span>Lvl {storeData.player.level}</span>
                      {storeData.isDemo && (
                        <span className="text-[10px] px-1 py-0.5 bg-amber-500/20 text-amber-300 rounded font-semibold">
                          DEMO
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={onLogout}
                  className="p-1.5 sm:p-2 hover:bg-[#ff4655]/10 hover:text-[#ff4655] text-[#8b978f] rounded-lg transition-colors"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
