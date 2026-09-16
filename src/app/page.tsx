'use client';

import React, { useState, useEffect } from 'react';
import { DailyStoreData, RiotSession, SkinOffer, Region, SavedAccount, FeaturedBundleData } from '@/types/valorant';
import { Navbar } from '@/components/Navbar';
import { DailyStoreBanner } from '@/components/DailyStoreBanner';
import { SkinCard } from '@/components/SkinCard';
import { SkinModal } from '@/components/SkinModal';
import { DiscordEmbedView } from '@/components/DiscordEmbedView';
import { NightMarket } from '@/components/NightMarket';
import { FeaturedBundle } from '@/components/FeaturedBundle';
import { BundleModal } from '@/components/BundleModal';
import { WishlistModal } from '@/components/WishlistModal';
import { LoginModal } from '@/components/LoginModal';
import { ProfileModal } from '@/components/ProfileModal';
import { AccountSwitcherModal } from '@/components/AccountSwitcherModal';
import { ShareStoreModal } from '@/components/ShareStoreModal';
import {
  getSavedAccounts,
  saveAccount,
  removeAccount,
  getCurrentAccountPuuid,
  setCurrentAccountPuuid,
  updateAccountStoreCache,
} from '@/lib/accountStorage';
import { DEMO_ROTATION_SKINS } from '@/lib/constants';
import { Sparkles, Moon, Layers, ShieldCheck, Flame, Camera } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

function sanitizeStoreOffers(store: DailyStoreData): DailyStoreData {
  if (!store || !store.offers) return store;
  const cleanedOffers = store.offers.map((offer) => {
    if (offer.displayIcon && offer.displayIcon.includes('7122d78b-4e60-eb4d-5f65-738d7c1ce9ae')) {
      return {
        ...offer,
        displayIcon:
          offer.chromas?.[0]?.displayIcon ||
          offer.chromas?.[0]?.fullRender ||
          offer.levels?.[0]?.displayIcon ||
          'https://media.valorant-api.com/weaponskinchromas/df1786b2-4f3d-f207-b92c-0780f4dffb79/displayicon.png',
      };
    }
    return offer;
  });
  return { ...store, offers: cleanedOffers };
}

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

  // Profile modal state
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Share store modal state
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Bundle collection modal state
  const [isBundleOpen, setIsBundleOpen] = useState<boolean>(false);
  const [selectedBundle, setSelectedBundle] = useState<FeaturedBundleData | null>(null);

  // Multi-account states
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState<boolean>(false);
  const [isAddingNewAccount, setIsAddingNewAccount] = useState<boolean>(false);

  // Load wishlist, accounts, and session from localStorage on mount
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
      const accs = getSavedAccounts();
      setSavedAccounts(accs);

      const currentPuuid = getCurrentAccountPuuid();
      if (currentPuuid && accs.length > 0) {
        const activeAcc = accs.find((a) => a.puuid === currentPuuid);
        if (activeAcc) {
          setSession(activeAcc.session);
          if (activeAcc.cachedStore && activeAcc.cachedStore.resetTimestamp > Date.now()) {
            setStoreData(sanitizeStoreOffers(activeAcc.cachedStore));
          }
          fetchStorefront(activeAcc.session, false);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load accounts from storage', e);
    }

    try {
      const savedStore = localStorage.getItem('vlr_store_data');
      if (savedStore) {
        const parsed = JSON.parse(savedStore);
        if (parsed?.resetTimestamp && Date.now() < parsed.resetTimestamp) {
          const cleaned = sanitizeStoreOffers(parsed);
          setStoreData(cleaned);
          localStorage.setItem('vlr_store_data', JSON.stringify(cleaned));
        }
      }
    } catch (e) {
      console.warn('Failed to load cached store', e);
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
        try {
          localStorage.setItem('vlr_store_data', JSON.stringify(data.store));
        } catch (e) {
          console.warn('Failed to cache store', e);
        }

        // Save / update in saved accounts list if authenticated
        if (currentSession && !isDemo) {
          const acc: SavedAccount = {
            puuid: currentSession.puuid,
            gameName: data.store.player.name,
            tagLine: data.store.player.tag,
            region: currentSession.region,
            level: data.store.player.level,
            playerCard: data.store.player.playerCard,
            session: currentSession,
            cachedStore: data.store,
            lastActive: Date.now(),
          };
          saveAccount(acc);
          setSavedAccounts(getSavedAccounts());
        }

        // Check and trigger Discord Webhook if wishlist matches
        checkAndTriggerWebhook(data.store);
      } else {
        setStoreError(data.error || 'Failed to retrieve storefront from Riot API.');
        // If token is expired, clear the stored session but do not wipe storeData if today's store is already cached
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

  // Check and trigger Discord Webhook notification if wishlisted skins appear
  const checkAndTriggerWebhook = async (store: DailyStoreData) => {
    try {
      const enabled = localStorage.getItem('vlr_discord_webhook_enabled') === 'true';
      const webhookUrl = localStorage.getItem('vlr_discord_webhook');
      if (!enabled || !webhookUrl) return;

      const savedWishlist = localStorage.getItem('vlr_wishlist');
      const currentWishlist: SkinOffer[] = savedWishlist ? JSON.parse(savedWishlist) : [];
      if (currentWishlist.length === 0) return;

      const matched = store.offers.filter((offer) =>
        currentWishlist.some((w) => w.uuid === offer.uuid)
      );
      if (matched.length === 0) return;

      // Ensure we notify only once per day per player to avoid spamming
      const todayKey = `vlr_webhook_notified_${store.player.name}_${new Date().toISOString().slice(0, 10)}`;
      if (localStorage.getItem(todayKey)) return;

      const res = await fetch('/api/discord/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl,
          matchedSkins: matched,
          player: store.player,
          resetTimestamp: store.resetTimestamp,
        }),
      });

      if (res.ok) {
        localStorage.setItem(todayKey, 'true');
      }
    } catch (e) {
      console.warn('Webhook auto-notify check failed', e);
    }
  };

  const handleLoginSuccess = (
    newSession: RiotSession | null,
    isDemo: boolean,
    demoConfig?: { name: string; tag: string; region: Region }
  ) => {
    setSession(newSession);
    setIsAddingNewAccount(false);
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
    localStorage.removeItem('vlr_store_data');
  };

  // Multi-Account Handlers
  const handleSelectAccount = (account: SavedAccount) => {
    setSession(account.session);
    setCurrentAccountPuuid(account.puuid);
    setIsAddingNewAccount(false);
    if (account.cachedStore && account.cachedStore.resetTimestamp > Date.now()) {
      setStoreData(account.cachedStore);
    }
    fetchStorefront(account.session, false);
    setIsAccountSwitcherOpen(false);
  };

  const handleAddNewAccount = () => {
    setIsAccountSwitcherOpen(false);
    setIsAddingNewAccount(true);
  };

  const handleDeleteAccount = (puuid: string) => {
    const remaining = removeAccount(puuid);
    setSavedAccounts(remaining);
    if (session?.puuid === puuid) {
      if (remaining.length > 0) {
        handleSelectAccount(remaining[0]);
      } else {
        handleLogout();
      }
    }
  };

  const storeSkinUuids = storeData ? storeData.offers.map((s) => s.uuid) : [];
  const currentBundles: FeaturedBundleData[] =
    storeData?.featuredBundles && storeData.featuredBundles.length > 0
      ? storeData.featuredBundles
      : storeData?.featuredBundle
      ? [storeData.featuredBundle]
      : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#080c10] text-[#ece8e1] selection:bg-[#ff4655] selection:text-white">
      {/* Navigation Header */}
      <Navbar
        storeData={storeData}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAccountSwitcher={() => setIsAccountSwitcherOpen(true)}
        savedAccountCount={savedAccounts.length}
        onRefresh={handleRefresh}
        onLogout={handleLogout}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!storeData || isAddingNewAccount ? (
          /* Login Screen / Account Selection */
          <LoginModal
            onLoginSuccess={handleLoginSuccess}
            isLoading={isLoading}
            externalError={storeError}
            savedAccounts={savedAccounts}
            onSelectAccount={handleSelectAccount}
            onDeleteAccount={handleDeleteAccount}
            isAddingNewAccount={isAddingNewAccount}
            onToggleAddNewAccount={setIsAddingNewAccount}
          />
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
            <div className="flex items-center justify-between border-b border-[#23303d] pb-4 mb-8 gap-2">
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

                {currentBundles.length > 0 && (
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
                    {currentBundles.length > 1 && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-[#0b1015] text-[#f1b82d] font-bold rounded-full font-mono">
                        {currentBundles.length}
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Share Store Card Button */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsShareOpen(true)}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#14202c] hover:bg-[#ff4655] text-white border border-[#23303d] hover:border-[#ff4655] transition-all shadow-sm group"
                  title="บันทึกรูปภาพร้านค้าเพื่อแชร์ / Export Store Card"
                >
                  <Camera className="w-4 h-4 text-[#ff4655] group-hover:text-white transition-colors flex-shrink-0" />
                  <span className="hidden sm:inline">แชร์ร้านค้า</span>
                  <span className="sm:hidden">แชร์</span>
                </button>
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

                {/* Additional Sections below the main store (all active bundles) */}
                {currentBundles.length > 0 && (
                  <div className="space-y-6">
                    {currentBundles.map((b) => (
                      <FeaturedBundle
                        key={b.uuid}
                        bundle={b}
                        onViewCollection={() => {
                          setSelectedBundle(b);
                          setIsBundleOpen(true);
                        }}
                      />
                    ))}
                  </div>
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

            {activeSection === 'bundle' && currentBundles.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm uppercase font-black tracking-widest text-[#8b978f] font-mono">
                    เซ็ตแนะนำทั้งหมด ({currentBundles.length} เซ็ต / Featured Bundles)
                  </h3>
                </div>
                {currentBundles.map((b) => (
                  <FeaturedBundle
                    key={b.uuid}
                    bundle={b}
                    onViewCollection={() => {
                      setSelectedBundle(b);
                      setIsBundleOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Wishlist & Notifications Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToWishlist={handleAddToWishlist}
        storeSkinUuids={storeSkinUuids}
        player={
          storeData
            ? {
                name: storeData.player.name,
                tag: storeData.player.tag,
                region: storeData.player.region,
              }
            : undefined
        }
      />

      {/* Profile & Stats Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        storeData={storeData}
      />

      {/* Account Switcher Modal */}
      <AccountSwitcherModal
        isOpen={isAccountSwitcherOpen}
        onClose={() => setIsAccountSwitcherOpen(false)}
        accounts={savedAccounts}
        currentPuuid={session?.puuid || getCurrentAccountPuuid()}
        onSelectAccount={handleSelectAccount}
        onAddNewAccount={handleAddNewAccount}
        onDeleteAccount={handleDeleteAccount}
      />

      {/* Featured Bundle Modal */}
      <BundleModal
        isOpen={isBundleOpen}
        onClose={() => setIsBundleOpen(false)}
        bundle={selectedBundle || currentBundles[0] || null}
        onInspectSkin={(s) => setInspectingSkin(s)}
      />

      {/* Skin Inspection Modal (stacks on top of BundleModal when inspecting bundle items) */}
      <SkinModal
        skin={inspectingSkin}
        onClose={() => setInspectingSkin(null)}
        isWishlisted={
          inspectingSkin ? wishlist.some((w) => w.uuid === inspectingSkin.uuid) : false
        }
        onToggleWishlist={handleToggleWishlist}
        userVp={storeData?.wallet.vp || 5000}
      />

      {/* Share Store Image Modal */}
      <ShareStoreModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        storeData={storeData}
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
