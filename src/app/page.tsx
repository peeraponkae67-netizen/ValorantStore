'use client';

import React, { useState, useEffect } from 'react';
import { DailyStoreData, RiotSession, SkinOffer, Region } from '@/types/valorant';
import { Navbar } from '@/components/Navbar';
import { DailyStoreBanner } from '@/components/DailyStoreBanner';
import { SkinCard } from '@/components/SkinCard';
import { SkinModal } from '@/components/SkinModal';
import { DiscordEmbedView } from '@/components/DiscordEmbedView';
import { NightMarket } from '@/components/NightMarket';
import { FeaturedBundle } from '@/components/FeaturedBundle';
import { WishlistModal } from '@/components/WishlistModal';
import { LoginModal } from '@/components/LoginModal';
import { DEMO_ROTATION_SKINS } from '@/lib/constants';
import { Sparkles, Moon, Layers, ShieldCheck, Flame } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const [session, setSession] = useState<RiotSession | null>(null);
  const [storeData, setStoreData] = useState<DailyStoreData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [storeError, setStoreError] = useState<string>('');

  // Active view: 'grid' or 'discord'
  const [activeView, setActiveView] = useState<'grid' | 'discord'>('grid');

  // Active section tab: 'store' | 'nightmarket' | 'bundle'
  const [activeSection, setActiveSection] = useState<'store' | 'nightmarket' | 'bundle'>('store');

  const { t } = useLanguage();

  // Inspection modal
  const [inspectingSkin, setInspectingSkin] = useState<SkinOffer | null>(null);

  // Wishlist state
  const [wishlist, setWishlist] = useState<SkinOffer[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);

  // Load wishlist and session from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('vlr_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (e) {
      console.warn('Failed to load wishlist from storage', e);
    }

    try {
      const savedSession = localStorage.getItem('vlr_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setSession(parsed);
        fetchStorefront(parsed, false);
      }
    } catch (e) {
      console.warn('Failed to load session from storage', e);
    }
  }, []);

  // Save wishlist to localStorage
  const saveWishlist = (newList: SkinOffer[]) => {
    setWishlist(newList);
    try {
      localStorage.setItem('vlr_wishlist', JSON.stringify(newList));
    } catch (e) {
      console.warn('Failed to save wishlist to storage', e);
    }
  };

  const handleToggleWishlist = (skin: SkinOffer) => {
    if (wishlist.some((w) => w.uuid === skin.uuid)) {
      saveWishlist(wishlist.filter((w) => w.uuid !== skin.uuid));
    } else {
      saveWishlist([...wishlist, skin]);
    }
  };

  const handleRemoveFromWishlist = (uuid: string) => {
    saveWishlist(wishlist.filter((w) => w.uuid !== uuid));
  };

  const handleAddToWishlist = (skin: any) => {
    if (!wishlist.some((w) => w.uuid === skin.uuid)) {
      saveWishlist([
        ...wishlist,
        {
          uuid: skin.uuid,
          displayName: skin.displayName,
          displayIcon: skin.displayIcon,
          tier: skin.tier || { name: 'Select', color: '#5A9FE2', icon: '' },
          price: 1775,
          chromas: [],
          levels: [],
        },
      ]);
    }
  };

  // Fetch or reload storefront
  const fetchStorefront = async (
    currentSession: RiotSession | null,
    isDemo: boolean = false,
    demoConfig?: { name: string; tag: string; region: Region }
  ) => {
    setIsLoading(true);
    setStoreError('');
    try {
      const res = await fetch('/api/riot/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session: currentSession,
          isDemo,
          demoName: demoConfig?.name,
          demoTag: demoConfig?.tag,
          demoRegion: demoConfig?.region,
        }),
      });

      const data = await res.json();
      if (data.success && data.store) {
        setStoreData(data.store);
      } else {
        setStoreError(data.error || 'Failed to retrieve storefront from Riot API.');
        // If token is invalid or expired, clear the stored session
        if (data.error && (data.error.includes('expired') || data.error.includes('auth') || data.error.includes('403') || data.error.includes('400'))) {
          localStorage.removeItem('vlr_session');
          setSession(null);
        }
      }
    } catch (err) {
      console.error('Error fetching storefront:', err);
      setStoreError('Network error while retrieving storefront data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleLoginSuccess = (
    newSession: RiotSession | null,
    isDemo: boolean,
    demoConfig?: { name: string; tag: string; region: Region }
  ) => {
    setSession(newSession);
    if (newSession && !isDemo) {
      localStorage.setItem('vlr_session', JSON.stringify(newSession));
    }
    fetchStorefront(newSession, isDemo, demoConfig);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStorefront(session, false);
  };

  const handleLogout = () => {
    setSession(null);
    setStoreData(null);
    setStoreError('');
    localStorage.removeItem('vlr_session');
  };

  const storeSkinUuids = storeData ? storeData.offers.map((s) => s.uuid) : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#080c10] text-[#ece8e1] selection:bg-[#ff4655] selection:text-white">
      {/* Navigation Header */}
      <Navbar
        storeData={storeData}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onRefresh={handleRefresh}
        onLogout={handleLogout}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!storeData ? (
          /* Login Screen */
          <LoginModal onLoginSuccess={handleLoginSuccess} isLoading={isLoading} externalError={storeError} />
        ) : (
          /* Authenticated Daily Store View */
          <div>
            {/* 1. Daily Store For {Name} Remaining ... Banner */}
            <DailyStoreBanner
              playerName={storeData.player.name}
              playerTag={storeData.player.tag}
              initialSecondsRemaining={storeData.remainingDuration}
              resetTimestamp={storeData.resetTimestamp}
              wallet={storeData.wallet}
            />

            {/* Navigation Tabs for Features */}
            <div className="flex items-center justify-between border-b border-[#23303d] pb-4 mb-8">
              <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
                <button
                  onClick={() => setActiveSection('store')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all ${
                    activeSection === 'store'
                      ? 'bg-[#ff4655] text-white shadow-[0_0_15px_rgba(255,70,85,0.4)]'
                      : 'bg-[#111a22] text-[#8b978f] hover:text-white border border-[#23303d]'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  <span>{t.store.dailyRotation}</span>
                </button>

                {storeData.nightMarket && (
                  <button
                    onClick={() => setActiveSection('nightmarket')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all ${
                      activeSection === 'nightmarket'
                        ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                        : 'bg-[#111a22] text-[#8b978f] hover:text-white border border-[#23303d]'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>{t.store.nightMarket}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded font-mono">
                      6
                    </span>
                  </button>
                )}

                {storeData.featuredBundle && (
                  <button
                    onClick={() => setActiveSection('bundle')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all ${
                      activeSection === 'bundle'
                        ? 'bg-[#f1b82d] text-[#0b1015] shadow-[0_0_15px_rgba(241,184,45,0.4)]'
                        : 'bg-[#111a22] text-[#8b978f] hover:text-white border border-[#23303d]'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>{t.store.featuredBundle}</span>
                  </button>
                )}
              </div>

            </div>

            {/* Content Display based on active section */}
            {activeSection === 'store' && (
              <>
                {activeView === 'grid' ? (
                  /* Cinematic 4-Weapon Grid */
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-black tracking-widest text-[#8b978f]">
                          {t.store.todayOffers}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#8b978f]">
                        {t.store.clickToInspect}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                      {storeData.offers.map((skin) => (
                        <SkinCard
                          key={skin.uuid}
                          skin={skin}
                          onInspect={(s) => setInspectingSkin(s)}
                          isWishlisted={wishlist.some((w) => w.uuid === skin.uuid)}
                          onToggleWishlist={handleToggleWishlist}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Giorgio Discord Bot Embed Mode */
                  <DiscordEmbedView
                    storeData={storeData}
                    onInspectSkin={(s) => setInspectingSkin(s)}
                  />
                )}

                {/* Additional Sections below the main store */}
                {storeData.featuredBundle && (
                  <FeaturedBundle bundle={storeData.featuredBundle} />
                )}

                {storeData.nightMarket && (
                  <NightMarket
                    nightMarket={storeData.nightMarket}
                    onInspectSkin={(s) => setInspectingSkin(s)}
                  />
                )}
              </>
            )}

            {activeSection === 'nightmarket' && storeData.nightMarket && (
              <NightMarket
                nightMarket={storeData.nightMarket}
                onInspectSkin={(s) => setInspectingSkin(s)}
              />
            )}

            {activeSection === 'bundle' && storeData.featuredBundle && (
              <FeaturedBundle bundle={storeData.featuredBundle} />
            )}
          </div>
        )}
      </main>

      {/* Skin Inspection Modal */}
      <SkinModal
        skin={inspectingSkin}
        onClose={() => setInspectingSkin(null)}
        isWishlisted={
          inspectingSkin ? wishlist.some((w) => w.uuid === inspectingSkin.uuid) : false
        }
        onToggleWishlist={handleToggleWishlist}
        userVp={storeData?.wallet.vp || 5000}
      />

      {/* Wishlist & Notifications Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToWishlist={handleAddToWishlist}
        storeSkinUuids={storeSkinUuids}
      />

      {/* Footer */}
      <footer className="border-t border-[#1e2c3a] bg-[#070b0e] py-6 text-center text-xs text-[#8b978f] mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[#ff4655] font-bold">VALORANT STORE</span>
            <span>•</span>
            <span>Inspired by staciax/valorant-discord-bot</span>
          </div>

          <div className="text-[11px] text-[#5b6770] flex flex-col items-center sm:items-end">
            <span>Riot Games, VALORANT, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
