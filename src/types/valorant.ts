export type Region = 'na' | 'eu' | 'ap' | 'kr' | 'latam' | 'br';

export interface SkinTier {
  uuid: string;
  name: string;
  color: string;
  icon: string;
  highlightColor: string;
}

export interface SkinChroma {
  uuid: string;
  displayName: string;
  displayIcon: string | null;
  fullRender: string | null;
  swatch: string | null;
  streamedVideo: string | null;
}

export interface SkinLevel {
  uuid: string;
  displayName: string;
  levelItem: string | null;
  streamedVideo: string | null;
}

export interface SkinOffer {
  uuid: string;
  displayName: string;
  displayIcon: string;
  tier: SkinTier;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  weaponType?: string;
  chromas: SkinChroma[];
  levels: SkinLevel[];
  wallpaper?: string | null;
}

export interface ValorantWallet {
  vp: number; // Valorant Points
  rad: number; // Radianite Points
  kc: number; // Kingdom Credits
}

export interface NightMarketData {
  isActive: boolean;
  remainingDuration: number;
  offers: SkinOffer[];
}

export interface FeaturedBundleData {
  uuid: string;
  displayName: string;
  displayIcon: string;
  price: number;
  originalPrice: number;
  remainingDuration: number;
  items: SkinOffer[];
}

export interface DailyStoreData {
  player: {
    name: string;
    tag: string;
    region: Region;
    level: number;
    playerCard: string;
    accountTitle?: string;
  };
  remainingDuration: number; // seconds
  resetTimestamp: number; // epoch ms
  offers: SkinOffer[];
  wallet: ValorantWallet;
  nightMarket?: NightMarketData | null;
  featuredBundle?: FeaturedBundleData | null;
  isDemo?: boolean;
}

export interface RiotSession {
  puuid: string;
  gameName: string;
  tagLine: string;
  region: Region;
  shard: string;
  accessToken: string;
  entitlementsToken: string;
  expiresAt: number;
}
