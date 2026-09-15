'use client';

import React from 'react';
import Image from 'next/image';
import { DailyStoreData } from '@/types/valorant';
import { VALORANT_CURRENCIES } from '@/lib/constants';
import { LogOut, RefreshCw, Bookmark, LayoutGrid, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  storeData: DailyStoreData | null;
  activeView: 'grid' | 'discord';
  setActiveView: (view: 'grid' | 'discord') => void;
  onOpenWishlist: () => void;
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  storeData,
  activeView,
  setActiveView,
  onOpenWishlist,
  onRefresh,
  onLogout,
  isRefreshing,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#23303d] bg-[#0b1015]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Bot Reference */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 bg-[#ff4655] vlr-cut text-white font-black text-xl shadow-[0_0_15px_rgba(255,70,85,0.4)]">
            <span>V</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-wider uppercase text-white font-mono">
                VALORANT <span className="text-[#ff4655]">STORE</span>
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-[#1f2e3d] text-[#8b978f] rounded">
                v3.6.0 Web
              </span>
            </div>
            <a
              href="https://github.com/staciax/valorant-discord-bot/tree/master"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#8b978f] hover:text-[#ff4655] flex items-center gap-1 transition-colors group"
              title="Inspired by staciax/valorant-discord-bot"
            >
              <span>based on staciax/valorant-discord-bot</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Right Section: User & Wallet or Controls */}
        {storeData && (
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Wallet Balances */}
            <div className="hidden md:flex items-center gap-4 bg-[#111a22] border border-[#23303d] px-3.5 py-1.5 rounded-lg">
              {/* VP */}
              <div className="flex items-center gap-1.5" title="Valorant Points">
                <img
                  src={VALORANT_CURRENCIES.VP.icon}
                  alt="VP"
                  className="w-5 h-5 object-contain"
                />
                <span className="text-sm font-bold text-white tracking-wide">
                  {storeData.wallet.vp.toLocaleString()}
                </span>
              </div>
              <div className="w-[1px] h-4 bg-[#23303d]" />
              {/* Radianite */}
              <div className="flex items-center gap-1.5" title="Radianite Points">
                <img
                  src={VALORANT_CURRENCIES.RAD.icon}
                  alt="Radianite"
                  className="w-4 h-4 object-contain"
                />
                <span className="text-sm font-bold text-[#f1b82d] tracking-wide">
                  {storeData.wallet.rad.toLocaleString()}
                </span>
              </div>
              <div className="w-[1px] h-4 bg-[#23303d]" />
              {/* Kingdom Credits */}
              <div className="flex items-center gap-1.5" title="Kingdom Credits">
                <img
                  src={VALORANT_CURRENCIES.KC.icon}
                  alt="Kingdom Credits"
                  className="w-4 h-4 object-contain"
                />
                <span className="text-sm font-bold text-[#b5c7d8] tracking-wide">
                  {storeData.wallet.kc.toLocaleString()}
                </span>
              </div>
            </div>

            {/* View Mode Switcher (Grid vs Discord Bot Embed) */}
            <div className="hidden lg:flex items-center bg-[#111a22] p-1 border border-[#23303d] rounded-lg">
              <button
                onClick={() => setActiveView('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeView === 'grid'
                    ? 'bg-[#ff4655] text-white shadow-sm'
                    : 'text-[#8b978f] hover:text-white'
                }`}
                title="Cinematic Weapon Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setActiveView('discord')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeView === 'discord'
                    ? 'bg-[#5865F2] text-white shadow-sm'
                    : 'text-[#8b978f] hover:text-white'
                }`}
                title="Giorgio Discord Bot Embed Mode"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Discord</span>
              </button>
            </div>

            {/* Action Buttons: Wishlist & Refresh */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenWishlist}
                className="p-2 bg-[#111a22] hover:bg-[#192733] border border-[#23303d] text-[#ece8e1] rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                title="Wishlist & Skin Notifications"
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
                title="Refresh Store"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#ff4655]' : ''}`} />
              </button>
            </div>

            {/* Player Profile & Logout */}
            <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-[#23303d]">
              <div className="relative w-9 h-9 rounded bg-[#1f2e3d] overflow-hidden border border-[#23303d] flex-shrink-0">
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
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white tracking-wide">
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
                    <span className="text-[10px] px-1 py-0.2 bg-amber-500/20 text-amber-300 rounded font-semibold">
                      DEMO
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 hover:bg-[#ff4655]/10 hover:text-[#ff4655] text-[#8b978f] rounded-lg transition-colors"
                title="Log out / Switch account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
