import { Region, RiotSession, DailyStoreData, SkinOffer, SkinTier } from '@/types/valorant';
import { REGION_SHARDS, TIERS, DEFAULT_TIER, DEMO_ROTATION_SKINS, DEMO_NIGHT_MARKET_SKINS } from './constants';

const CLIENT_PLATFORM =
  'ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9';

const RIOT_CLIENT_USER_AGENT =
  'RiotClient/60.0.6.4770705.4749685 rso-auth (Windows;10;;Professional, x64)';

// Cache Valorant API skin catalogue to avoid repeated calls
let cachedSkinsMap: Map<string, any> | null = null;
let cachedTiersMap: Map<string, SkinTier> | null = null;

export async function fetchValorantApiCatalog() {
  if (cachedSkinsMap && cachedTiersMap) {
    return { skins: cachedSkinsMap, tiers: cachedTiersMap };
  }

  try {
    const [skinsRes, tiersRes] = await Promise.all([
      fetch('https://valorant-api.com/v1/weapons/skins', { next: { revalidate: 3600 } }),
      fetch('https://valorant-api.com/v1/contenttiers', { next: { revalidate: 3600 } }),
    ]);

    const skinsJson = await skinsRes.json();
    const tiersJson = await tiersRes.json();

    const tiersMap = new Map<string, SkinTier>();
    if (tiersJson?.data) {
      for (const t of tiersJson.data) {
        tiersMap.set(t.uuid, {
          uuid: t.uuid,
          name: t.devName || 'Skin',
          color: '#' + (t.highlightColor || 'FFFFFF').slice(0, 6),
          highlightColor: `rgba(${parseInt(t.highlightColor?.slice(0, 2) || 'FF', 16)}, ${parseInt(
            t.highlightColor?.slice(2, 4) || 'FF',
            16
          )}, ${parseInt(t.highlightColor?.slice(4, 6) || 'FF', 16)}, 0.25)`,
          icon: t.displayIcon,
        });
      }
    }

    const skinsMap = new Map<string, any>();
    if (skinsJson?.data) {
      for (const skin of skinsJson.data) {
        skinsMap.set(skin.uuid, skin);
        // Also map level uuids
        if (skin.levels) {
          for (const lvl of skin.levels) {
            skinsMap.set(lvl.uuid, skin);
          }
        }
      }
    }

    cachedSkinsMap = skinsMap;
    cachedTiersMap = tiersMap;
    return { skins: skinsMap, tiers: tiersMap };
  } catch (error) {
    console.warn('Failed to fetch Valorant API catalog, using local tier definitions', error);
    return {
      skins: new Map<string, any>(),
      tiers: new Map(Object.entries(TIERS)),
    };
  }
}

/**
 * Authenticates user credentials with Riot auth API
 */
export async function authenticateRiotUser(
  username: string,
  password: string,
  region: Region = 'ap'
): Promise<
  | { success: true; session: RiotSession }
  | { success: false; multifactor: true; cookies: string }
  | { success: false; error: string }
> {
  try {
    // Step 1: Initialize cookies with auth request
    const initRes = await fetch('https://auth.riotgames.com/api/v1/authorization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': RIOT_CLIENT_USER_AGENT,
      },
      body: JSON.stringify({
        client_id: 'play-valorant-web-prod',
        nonce: '1',
        redirect_uri: 'https://playvalorant.com/opt_in',
        response_type: 'token id_token',
        scope: 'account openid',
      }),
    });

    const initCookies = initRes.headers.get('set-cookie') || '';

    // Step 2: Submit username and password
    const authRes = await fetch('https://auth.riotgames.com/api/v1/authorization', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': RIOT_CLIENT_USER_AGENT,
        Cookie: initCookies,
      },
      body: JSON.stringify({
        type: 'auth',
        username,
        password,
        remember: true,
        language: 'en_US',
      }),
    });

    const authCookies = authRes.headers.get('set-cookie') || initCookies;
    const authData = await authRes.json();

    if (authData.type === 'multifactor') {
      return {
        success: false,
        multifactor: true,
        cookies: authCookies,
      };
    }

    if (authData.type === 'response' && authData.response?.parameters?.uri) {
      const uri = authData.response.parameters.uri;
      const accessTokenMatch = uri.match(/access_token=([^&]+)/);
      const idTokenMatch = uri.match(/id_token=([^&]+)/);

      if (!accessTokenMatch) {
        return { success: false, error: 'Could not extract access token from Riot response.' };
      }

      const accessToken = accessTokenMatch[1];
      const session = await completeRiotSession(accessToken, region);
      return { success: true, session };
    }

    if (authData.error) {
      return {
        success: false,
        error:
          authData.error === 'auth_failure'
            ? 'Invalid Riot username or password.'
            : `Riot authentication error: ${authData.error}`,
      };
    }

    return { success: false, error: 'Unexpected response from Riot Games authentication server.' };
  } catch (err: any) {
    console.error('Riot Auth Request Error:', err);
    return {
      success: false,
      error:
        err?.message ||
        'Unable to connect to Riot Authentication servers. If blocked by Cloudflare, please use Token or Demo login.',
    };
  }
}

/**
 * Verify 2FA multifactor code
 */
export async function verifyRiot2FA(
  code: string,
  cookies: string,
  region: Region = 'ap'
): Promise<{ success: true; session: RiotSession } | { success: false; error: string }> {
  try {
    const res = await fetch('https://auth.riotgames.com/api/v1/authorization', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': RIOT_CLIENT_USER_AGENT,
        Cookie: cookies,
      },
      body: JSON.stringify({
        type: 'multifactor',
        code,
        rememberDevice: true,
      }),
    });

    const data = await res.json();
    if (data.type === 'response' && data.response?.parameters?.uri) {
      const uri = data.response.parameters.uri;
      const accessTokenMatch = uri.match(/access_token=([^&]+)/);
      if (!accessTokenMatch) {
        return { success: false, error: 'Invalid 2FA code or expired token.' };
      }
      const accessToken = accessTokenMatch[1];
      const session = await completeRiotSession(accessToken, region);
      return { success: true, session };
    }

    return { success: false, error: data.error || '2FA code verification failed. Please try again.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error communicating with Riot 2FA service.' };
  }
}

/**
 * Given access token, fetches entitlements token, user info and creates full RiotSession
 */
export async function completeRiotSession(accessToken: string, region: Region): Promise<RiotSession> {
  // 1. Entitlements Token (must include body: '{}')
  const entRes = await fetch('https://entitlements.auth.riotgames.com/api/token/v1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': RIOT_CLIENT_USER_AGENT,
    },
    body: '{}',
  });
  
  if (!entRes.ok) {
    const err = await entRes.text().catch(() => '');
    throw new Error(`Failed to get entitlements token (${entRes.status}): ${err}`);
  }
  
  const entData = await entRes.json();
  const entitlementsToken = entData.entitlements_token;

  if (!entitlementsToken) {
    throw new Error('Entitlements token is missing from Riot API response.');
  }

  // 2. User Info
  const userRes = await fetch('https://auth.riotgames.com/userinfo', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': RIOT_CLIENT_USER_AGENT,
    },
  });
  
  if (!userRes.ok) {
    const err = await userRes.text().catch(() => '');
    throw new Error(`Failed to get userinfo (${userRes.status}): ${err}`);
  }
  
  const userData = await userRes.json();

  const puuid = userData.sub || userData.puuid || '';
  if (!puuid) {
    throw new Error('PUUID is missing from userinfo response.');
  }

  const gameName = userData.acct?.game_name || userData.game_name || 'Player';
  const tagLine = userData.acct?.tag_line || userData.tag_line || region.toUpperCase();

  const shard = REGION_SHARDS[region]?.shard || 'na';

  return {
    puuid,
    gameName,
    tagLine,
    region,
    shard,
    accessToken,
    entitlementsToken,
    expiresAt: Date.now() + 3600 * 1000,
  };
}

/**
 * Fetches player storefront, wallet, and returns DailyStoreData
 */
export async function getPlayerStorefront(session: RiotSession): Promise<DailyStoreData> {
  const { puuid, accessToken, entitlementsToken, region, gameName, tagLine } = session;
  const shard = session.shard || (region ? REGION_SHARDS[region]?.shard : undefined) || 'ap';

  // Get Client Version
  let clientVersion = 'release-13.05-shipping-11-5350494';
  try {
    const vRes = await fetch('https://valorant-api.com/v1/version');
    const vJson = await vRes.json();
    if (vJson?.data?.riotClientVersion) {
      clientVersion = vJson.data.riotClientVersion;
    }
  } catch {
    // default release
  }

  const pvpHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'X-Riot-Entitlements-JWT': entitlementsToken,
    'X-Riot-ClientVersion': clientVersion,
    'X-Riot-ClientPlatform': CLIENT_PLATFORM,
  };

  const SHARDS = ['na', 'eu', 'ap', 'kr'];

  let storeRes: Response | null = null;
  let walletRes: Response | null = null;
  
  const sUrl = `https://pd.${shard}.a.pvp.net/store/v3/storefront/${puuid}`;
  const wUrl = `https://pd.${shard}.a.pvp.net/store/v1/wallet/${puuid}`;
  
  try {
    const [s, w] = await Promise.all([
      fetch(sUrl, { method: 'POST', headers: pvpHeaders, body: '{}', cache: 'no-store' }),
      fetch(wUrl, { headers: pvpHeaders, cache: 'no-store' }).catch(() => null),
    ]);
    
    if (!s.ok) {
      const errText = await s.text().catch(() => '');
      throw new Error(`Shard ${shard} failed with ${s.status}: ${errText}`);
    }
    
    storeRes = s;
    walletRes = w;
  } catch (err: any) {
    throw new Error(`Riot API rejected the request for player ${gameName}#${tagLine}. Details: ${err.message}`);
  }

  const { skins: skinsCatalog, tiers: tiersCatalog } = await fetchValorantApiCatalog();

  let storeJson: any = null;
  let walletJson: any = null;

  if (storeRes && storeRes.ok) {
    storeJson = await storeRes.json();
  } 

  if (walletRes && walletRes.ok) {
    walletJson = await walletRes.json();
  }

  // Parse Wallet
  const vpBalance = walletJson?.Balances?.['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741'] ?? 4350;
  const radBalance = walletJson?.Balances?.['e59aa87c-4cbf-517a-5983-6e81511be9b7'] ?? 160;
  const kcBalance = walletJson?.Balances?.['d9d89525-4450-4e37-ab5e-77373e2e4f39'] ?? 7200;

  // If Riot API fails or returned empty storefront, do not fallback to demo. Throw error.
  if (!storeJson || !storeJson.SkinsPanelLayout) {
    throw new Error('Could not retrieve storefront data from Riot API. Please check if your token is valid or try again.');
  }

  // Parse Daily Single Item Offers
  const itemUuids: string[] = storeJson.SkinsPanelLayout.SingleItemOffers || [];
  const remainingSeconds: number =
    storeJson.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds || 0;

  const offers: SkinOffer[] = itemUuids.map((skinUuid) => {
    const catalogItem = skinsCatalog.get(skinUuid);
    const tierUuid = catalogItem?.contentTierUuid;
    const tier = (tierUuid && (tiersCatalog.get(tierUuid) || TIERS[tierUuid])) || DEFAULT_TIER;

    // Approximate VP price from tier since single item offers don't include price explicitly sometimes
    let price = 1775;
    if (tier.name === 'Select') price = 875;
    else if (tier.name === 'Deluxe') price = 1275;
    else if (tier.name === 'Premium') price = 1775;
    else if (tier.name === 'Exclusive') price = 2175;
    else if (tier.name === 'Ultra') price = 2475;

    // We can also get exact price from storeJson.SkinsPanelLayout.SingleItemStoreOffers if available,
    // but typically we can rely on tier. We'll check if SingleItemStoreOffers has it:
    const storeOfferInfo = storeJson.SkinsPanelLayout.SingleItemStoreOffers?.find((o: any) => o.OfferID === skinUuid);
    if (storeOfferInfo && storeOfferInfo.Cost) {
      price = storeOfferInfo.Cost[Object.keys(storeOfferInfo.Cost)[0]] || price;
    }

    return {
      uuid: skinUuid,
      displayName: catalogItem?.displayName || 'Valorant Weapon Skin',
      displayIcon:
        catalogItem?.displayIcon ||
        catalogItem?.levels?.[0]?.displayIcon ||
        'https://media.valorant-api.com/weaponskins/d8d5d7a1-4d81-8560-54bc-0692ab40f69b/displayicon.png',
      tier,
      price,
      weaponType: catalogItem?.displayName?.split(' ')?.[1] || 'Weapon',
      chromas:
        catalogItem?.chromas?.map((c: any) => ({
          uuid: c.uuid,
          displayName: c.displayName,
          displayIcon: c.displayIcon,
          fullRender: c.fullRender,
          swatch: c.swatch,
          streamedVideo: c.streamedVideo,
        })) || [],
      levels:
        catalogItem?.levels?.map((l: any) => ({
          uuid: l.uuid,
          displayName: l.displayName,
          levelItem: l.levelItem,
          streamedVideo: l.streamedVideo,
        })) || [],
      wallpaper: catalogItem?.wallpaper || null,
    };
  });

  // Parse Night Market
  let nightMarket = null;
  if (storeJson.BonusStore && storeJson.BonusStore.BonusStoreOffers) {
    const nmOffers = storeJson.BonusStore.BonusStoreOffers;
    const nmRemainingSeconds = storeJson.BonusStore.BonusStoreRemainingDurationInSeconds || 0;
    
    nightMarket = {
      isActive: true,
      remainingDuration: nmRemainingSeconds,
      offers: nmOffers.map((offer: any) => {
        const reward = offer.Offer.Rewards[0];
        const skinUuid = reward.ItemID;
        const catalogItem = skinsCatalog.get(skinUuid);
        const tierUuid = catalogItem?.contentTierUuid;
        const tier = (tierUuid && (tiersCatalog.get(tierUuid) || TIERS[tierUuid])) || DEFAULT_TIER;
        
        return {
          uuid: skinUuid,
          displayName: catalogItem?.displayName || 'Unknown Skin',
          displayIcon: catalogItem?.displayIcon || catalogItem?.levels?.[0]?.displayIcon || 'https://media.valorant-api.com/weaponskins/d8d5d7a1-4d81-8560-54bc-0692ab40f69b/displayicon.png',
          tier,
          price: offer.DiscountCosts?.[Object.keys(offer.DiscountCosts)[0]] || 0,
          originalPrice: offer.Offer.Cost?.[Object.keys(offer.Offer.Cost)[0]] || 0,
          discountPercent: offer.DiscountPercent || 0,
          weaponType: catalogItem?.displayName?.split(' ')?.[1] || 'Weapon',
          chromas: catalogItem?.chromas?.map((c: any) => ({
            uuid: c.uuid,
            displayName: c.displayName,
            displayIcon: c.displayIcon,
            fullRender: c.fullRender,
            swatch: c.swatch,
            streamedVideo: c.streamedVideo,
          })) || [],
          levels: catalogItem?.levels?.map((l: any) => ({
            uuid: l.uuid,
            displayName: l.displayName,
            levelItem: l.levelItem,
            streamedVideo: l.streamedVideo,
          })) || [],
          wallpaper: catalogItem?.wallpaper || null,
        };
      })
    };
  }

  // Parse Featured Bundle
  let featuredBundle = null;
  if (storeJson.FeaturedBundle && storeJson.FeaturedBundle.Bundles && storeJson.FeaturedBundle.Bundles.length > 0) {
    const mainBundle = storeJson.FeaturedBundle.Bundles[0];
    const bundleUuid = mainBundle.DataAssetID;
    const bundleRemainingSeconds = storeJson.FeaturedBundle.BundleRemainingDurationInSeconds || 0;
    
    let bundleDisplayName = 'Featured Bundle';
    let bundleDisplayIcon = 'https://media.valorant-api.com/bundles/69d9b2be-4439-0785-780b-ba8951053683/displayicon.png';
    
    try {
      const bRes = await fetch(`https://valorant-api.com/v1/bundles/${bundleUuid}`);
      if (bRes.ok) {
        const bJson = await bRes.json();
        if (bJson?.data) {
          bundleDisplayName = bJson.data.displayName || bundleDisplayName;
          bundleDisplayIcon = bJson.data.displayIcon || bJson.data.displayIcon2 || bundleDisplayIcon;
        }
      }
    } catch(e) {
      // ignore
    }
    
    let totalPrice = 0;
    let originalTotalPrice = 0;
    const items: SkinOffer[] = [];
    
    if (mainBundle.Items) {
      for (const item of mainBundle.Items) {
        const itemPrice = item.DiscountedPrice || 0;
        const basePrice = item.BasePrice || 0;
        totalPrice += itemPrice;
        originalTotalPrice += basePrice;
        
        const reward = item.Item;
        // Weapon skins have ItemTypeID e7c63390-eda7-46e0-bb7a-a6abdacd2433
        if (reward && reward.ItemTypeID === 'e7c63390-eda7-46e0-bb7a-a6abdacd2433') { 
          const skinUuid = reward.ItemID;
          const catalogItem = skinsCatalog.get(skinUuid);
          if (catalogItem) {
            const tierUuid = catalogItem.contentTierUuid;
            const tier = (tierUuid && (tiersCatalog.get(tierUuid) || TIERS[tierUuid])) || DEFAULT_TIER;
            items.push({
              uuid: skinUuid,
              displayName: catalogItem.displayName || 'Unknown Skin',
              displayIcon: catalogItem.displayIcon || catalogItem.levels?.[0]?.displayIcon || '',
              tier,
              price: itemPrice,
              originalPrice: basePrice,
              discountPercent: item.DiscountPercent || 0,
              weaponType: catalogItem.displayName?.split(' ')?.[1] || 'Weapon',
              chromas: catalogItem.chromas?.map((c: any) => ({
                uuid: c.uuid,
                displayName: c.displayName,
                displayIcon: c.displayIcon,
                fullRender: c.fullRender,
                swatch: c.swatch,
                streamedVideo: c.streamedVideo,
              })) || [],
              levels: catalogItem.levels?.map((l: any) => ({
                uuid: l.uuid,
                displayName: l.displayName,
                levelItem: l.levelItem,
                streamedVideo: l.streamedVideo,
              })) || [],
              wallpaper: catalogItem.wallpaper || null,
            });
          }
        }
      }
    }

    featuredBundle = {
      uuid: bundleUuid,
      displayName: bundleDisplayName,
      displayIcon: bundleDisplayIcon,
      price: totalPrice,
      originalPrice: originalTotalPrice,
      remainingDuration: bundleRemainingSeconds,
      items: items,
    };
  }

  return {
    player: {
      name: gameName,
      tag: tagLine,
      region,
      level: 0,
      playerCard: 'https://media.valorant-api.com/playercards/1711d20d-4b1c-c64a-14be-d4ae58a457c6/displayicon.png',
      accountTitle: '',
    },
    remainingDuration: remainingSeconds,
    resetTimestamp: Date.now() + remainingSeconds * 1000,
    offers,
    wallet: {
      vp: vpBalance,
      rad: radBalance,
      kc: kcBalance,
    },
    nightMarket,
    featuredBundle,
    isDemo: false,
  };
}

/**
 * Creates realistic demo store data for testing & instant preview
 */
export function generateDemoStoreData(
  name: string = 'TenZ',
  tag: string = 'NA1',
  region: Region = 'na'
): DailyStoreData {
  // Remaining time ~14 hours, 28 minutes, 40 seconds
  const remainingDuration = 14 * 3600 + 28 * 60 + 40;

  return {
    player: {
      name,
      tag,
      region,
      level: 218,
      playerCard:
        'https://media.valorant-api.com/playercards/1711d20d-4b1c-c64a-14be-d4ae58a457c6/displayicon.png',
      accountTitle: 'Vanguard Vindicator',
    },
    remainingDuration,
    resetTimestamp: Date.now() + remainingDuration * 1000,
    offers: DEMO_ROTATION_SKINS,
    wallet: {
      vp: 5850,
      rad: 210,
      kc: 9000,
    },
    nightMarket: {
      isActive: true,
      remainingDuration: remainingDuration * 5,
      offers: DEMO_NIGHT_MARKET_SKINS,
    },
    featuredBundle: {
      uuid: 'demo-bundle-kuronami',
      displayName: 'KURONAMI // BUNDLE',
      displayIcon:
        'https://media.valorant-api.com/bundles/69d9b2be-4439-0785-780b-ba8951053683/displayicon.png',
      price: 9500,
      originalPrice: 13350,
      remainingDuration: remainingDuration * 3,
      items: DEMO_ROTATION_SKINS,
    },
    isDemo: true,
  };
}
