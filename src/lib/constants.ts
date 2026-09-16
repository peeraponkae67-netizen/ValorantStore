import { SkinTier, Region } from '@/types/valorant';

export const REGION_SHARDS: Record<Region, { shard: string; name: string }> = {
  na: { shard: 'na', name: 'North America' },
  eu: { shard: 'eu', name: 'Europe' },
  ap: { shard: 'ap', name: 'Asia Pacific' },
  kr: { shard: 'kr', name: 'Korea' },
  latam: { shard: 'na', name: 'Latin America' },
  br: { shard: 'na', name: 'Brazil' },
};

export const VALORANT_CURRENCIES = {
  VP: {
    id: '85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741',
    name: 'Valorant Points',
    icon: 'https://media.valorant-api.com/currencies/85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741/largeicon.png',
  },
  RAD: {
    id: 'e59aa87c-4cbf-517a-5983-6e81511be9b7',
    name: 'Radianite Points',
    icon: 'https://media.valorant-api.com/currencies/e59aa87c-4cbf-517a-5983-6e81511be9b7/displayicon.png',
  },
  KC: {
    id: '85ca954a-41f2-ce94-9b45-8ca3dd39a00d',
    name: 'Kingdom Credits',
    icon: 'https://media.valorant-api.com/currencies/85ca954a-41f2-ce94-9b45-8ca3dd39a00d/displayicon.png',
  },
};

export const TIERS: Record<string, SkinTier> = {
  '0cebb8be-46d7-c12a-d306-e9907bfc5a25': {
    uuid: '0cebb8be-46d7-c12a-d306-e9907bfc5a25',
    name: 'Deluxe',
    color: '#009587',
    highlightColor: 'rgba(0, 149, 135, 0.25)',
    icon: 'https://media.valorant-api.com/contenttiers/0cebb8be-46d7-c12a-d306-e9907bfc5a25/displayicon.png',
  },
  'e046854e-406c-37f4-6607-19a9ba8426fc': {
    uuid: 'e046854e-406c-37f4-6607-19a9ba8426fc',
    name: 'Exclusive',
    color: '#F1B82D',
    highlightColor: 'rgba(241, 184, 45, 0.25)',
    icon: 'https://media.valorant-api.com/contenttiers/e046854e-406c-37f4-6607-19a9ba8426fc/displayicon.png',
  },
  '60bca009-4182-7998-dee7-b8a2558dc369': {
    uuid: '60bca009-4182-7998-dee7-b8a2558dc369',
    name: 'Premium',
    color: '#D1548D',
    highlightColor: 'rgba(209, 84, 141, 0.25)',
    icon: 'https://media.valorant-api.com/contenttiers/60bca009-4182-7998-dee7-b8a2558dc369/displayicon.png',
  },
  '12683d76-48d7-84a3-4e09-6985794f0445': {
    uuid: '12683d76-48d7-84a3-4e09-6985794f0445',
    name: 'Select',
    color: '#5A9FE2',
    highlightColor: 'rgba(90, 159, 226, 0.25)',
    icon: 'https://media.valorant-api.com/contenttiers/12683d76-48d7-84a3-4e09-6985794f0445/displayicon.png',
  },
  '411e4a55-4e59-7757-41f0-86a53f101bb5': {
    uuid: '411e4a55-4e59-7757-41f0-86a53f101bb5',
    name: 'Ultra',
    color: '#FA7B1E',
    highlightColor: 'rgba(250, 123, 30, 0.25)',
    icon: 'https://media.valorant-api.com/contenttiers/411e4a55-4e59-7757-41f0-86a53f101bb5/displayicon.png',
  },
};

export const DEFAULT_TIER: SkinTier = {
  uuid: '12683d76-48d7-84a3-4e09-6985794f0445',
  name: 'Select',
  color: '#5A9FE2',
  highlightColor: 'rgba(90, 159, 226, 0.25)',
  icon: 'https://media.valorant-api.com/contenttiers/12683d76-48d7-84a3-4e09-6985794f0445/displayicon.png',
};

// Verified working weapon skin renders from valorant-api.com (HTTP 200 OK)
export const DEMO_ROTATION_SKINS = [
  {
    uuid: 'd8d5d7a1-4d81-8560-54bc-0692ab40f69b',
    displayName: 'Kuronami Vandal',
    displayIcon: 'https://media.valorant-api.com/weaponskins/d8d5d7a1-4d81-8560-54bc-0692ab40f69b/displayicon.png',
    tier: TIERS['e046854e-406c-37f4-6607-19a9ba8426fc'], // Exclusive
    price: 2375,
    weaponType: 'Vandal',
    chromas: [
      {
        uuid: '447a164f-4d64-4e3f-67db-cf8b1ca65a44',
        displayName: 'Kuronami Vandal (Default)',
        displayIcon: 'https://media.valorant-api.com/weaponskins/d8d5d7a1-4d81-8560-54bc-0692ab40f69b/displayicon.png',
        fullRender: 'https://media.valorant-api.com/weaponskins/d8d5d7a1-4d81-8560-54bc-0692ab40f69b/displayicon.png',
        swatch: 'https://media.valorant-api.com/weaponskinchromas/f34f323e-436f-b883-9b88-1296bc8e72dc/swatch.png',
        streamedVideo: null,
      },
      {
        uuid: 'd8c83a15-46b0-f4ca-6a5d-b0a34b2259eb',
        displayName: 'Kuronami Vandal (Purple)',
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/0989f660-496a-0d85-f5b6-7ebaf6420e6f/fullrender.png',
        fullRender: 'https://media.valorant-api.com/weaponskinchromas/0989f660-496a-0d85-f5b6-7ebaf6420e6f/fullrender.png',
        swatch: 'https://media.valorant-api.com/weaponskinchromas/0989f660-496a-0d85-f5b6-7ebaf6420e6f/swatch.png',
        streamedVideo: null,
      },
      {
        uuid: '716a495b-43ad-a42e-1313-ecbb1626f294',
        displayName: 'Kuronami Vandal (White)',
        displayIcon: 'https://media.valorant-api.com/weaponskinchromas/31aa67ef-493f-c962-d278-f7b5fa33f2b6/fullrender.png',
        fullRender: 'https://media.valorant-api.com/weaponskinchromas/31aa67ef-493f-c962-d278-f7b5fa33f2b6/fullrender.png',
        swatch: 'https://media.valorant-api.com/weaponskinchromas/31aa67ef-493f-c962-d278-f7b5fa33f2b6/swatch.png',
        streamedVideo: null,
      },
    ],
    levels: [
      { uuid: '1', displayName: 'Level 1: Base Model', levelItem: null, streamedVideo: null },
      { uuid: '2', displayName: 'Level 2: Custom Muzzle Flash & Sound', levelItem: 'VFX', streamedVideo: null },
      { uuid: '3', displayName: 'Level 3: Custom Reload Animation', levelItem: 'Animations', streamedVideo: null },
      { uuid: '4', displayName: 'Level 4: Finisher & Rain Weather Storm', levelItem: 'Finisher', streamedVideo: null },
    ],
  },
  {
    uuid: 'aecab890-43b7-d719-06bc-9295e3d116dc',
    displayName: 'Reaver Operator',
    displayIcon: 'https://media.valorant-api.com/weaponskins/aecab890-43b7-d719-06bc-9295e3d116dc/displayicon.png',
    tier: TIERS['60bca009-4182-7998-dee7-b8a2558dc369'], // Premium
    price: 1775,
    weaponType: 'Operator',
    chromas: [
      {
        uuid: 'c3bb2ea0-4fc7-3f9d-7db0-a38f322ca2ff',
        displayName: 'Reaver Operator (Default)',
        displayIcon: 'https://media.valorant-api.com/weaponskins/aecab890-43b7-d719-06bc-9295e3d116dc/displayicon.png',
        fullRender: 'https://media.valorant-api.com/weaponskins/aecab890-43b7-d719-06bc-9295e3d116dc/displayicon.png',
        swatch: 'https://media.valorant-api.com/weaponskinchromas/632fe236-47b7-5730-811c-bc8f9dc1fb59/swatch.png',
        streamedVideo: null,
      },
    ],
    levels: [
      { uuid: '1', displayName: 'Level 1: Base Model', levelItem: null, streamedVideo: null },
      { uuid: '2', displayName: 'Level 2: Dark VFX & Firing Audio', levelItem: 'VFX', streamedVideo: null },
      { uuid: '3', displayName: 'Level 3: Telekinesis Reload Animation', levelItem: 'Animations', streamedVideo: null },
      { uuid: '4', displayName: 'Level 4: Underworld Bell Finisher', levelItem: 'Finisher', streamedVideo: null },
    ],
  },
  {
    uuid: 'b9ee2457-481c-6776-3f5b-0ca8e8f90c89',
    displayName: 'Prime Vandal',
    displayIcon: 'https://media.valorant-api.com/weaponskins/b9ee2457-481c-6776-3f5b-0ca8e8f90c89/displayicon.png',
    tier: TIERS['60bca009-4182-7998-dee7-b8a2558dc369'], // Premium
    price: 1775,
    weaponType: 'Vandal',
    chromas: [
      {
        uuid: '4b00c436-419b-c56a-115f-5ca07b0c3ff4',
        displayName: 'Prime Vandal (Default)',
        displayIcon: 'https://media.valorant-api.com/weaponskins/b9ee2457-481c-6776-3f5b-0ca8e8f90c89/displayicon.png',
        fullRender: 'https://media.valorant-api.com/weaponskins/b9ee2457-481c-6776-3f5b-0ca8e8f90c89/displayicon.png',
        swatch: 'https://media.valorant-api.com/weaponskinchromas/b801de55-460d-a342-9904-ddbe05b768a4/swatch.png',
        streamedVideo: null,
      },
    ],
    levels: [
      { uuid: '1', displayName: 'Level 1: Base Model', levelItem: null, streamedVideo: null },
      { uuid: '2', displayName: 'Level 2: Custom Laser VFX', levelItem: 'VFX', streamedVideo: null },
      { uuid: '3', displayName: 'Level 3: Energy Core Reload', levelItem: 'Animations', streamedVideo: null },
      { uuid: '4', displayName: 'Level 4: Radiant Wolf Finisher', levelItem: 'Finisher', streamedVideo: null },
    ],
  },
  {
    uuid: 'a9890917-41ea-eb55-47e7-ee990a87fa4e',
    displayName: 'Sovereign Ghost',
    displayIcon: 'https://media.valorant-api.com/weaponskins/a9890917-41ea-eb55-47e7-ee990a87fa4e/displayicon.png',
    tier: TIERS['60bca009-4182-7998-dee7-b8a2558dc369'], // Premium
    price: 1775,
    weaponType: 'Ghost',
    chromas: [
      {
        uuid: '780c85ee-4e5c-0c62-817a-5690554c25eb',
        displayName: 'Sovereign Ghost',
        displayIcon: 'https://media.valorant-api.com/weaponskins/a9890917-41ea-eb55-47e7-ee990a87fa4e/displayicon.png',
        fullRender: 'https://media.valorant-api.com/weaponskins/a9890917-41ea-eb55-47e7-ee990a87fa4e/displayicon.png',
        swatch: null,
        streamedVideo: null,
      },
    ],
    levels: [
      { uuid: '1', displayName: 'Level 1: Base Model', levelItem: null, streamedVideo: null },
      { uuid: '2', displayName: 'Level 2: Sacred Light VFX', levelItem: 'VFX', streamedVideo: null },
      { uuid: '3', displayName: 'Level 3: Custom Inspect & Animation', levelItem: 'Animations', streamedVideo: null },
      { uuid: '4', displayName: 'Level 4: Celestial Sword Finisher', levelItem: 'Finisher', streamedVideo: null },
    ],
  },
];

export const DEMO_NIGHT_MARKET_SKINS = [
  {
    uuid: 'a3f8e1b3-4654-f3ea-15ba-9eb9fd6a0b0d',
    displayName: 'Magepunk Spectre',
    displayIcon: 'https://media.valorant-api.com/weaponskins/a3f8e1b3-4654-f3ea-15ba-9eb9fd6a0b0d/displayicon.png',
    tier: TIERS['60bca009-4182-7998-dee7-b8a2558dc369'],
    price: 1065,
    originalPrice: 1775,
    discountPercent: 40,
    weaponType: 'Spectre',
    chromas: [],
    levels: [],
  },
  {
    uuid: 'd67b929f-4431-61c0-286e-3ebf3d11c4af',
    displayName: 'Recon Phantom',
    displayIcon: 'https://media.valorant-api.com/weaponskins/d67b929f-4431-61c0-286e-3ebf3d11c4af/displayicon.png',
    tier: TIERS['60bca009-4182-7998-dee7-b8a2558dc369'],
    price: 1242,
    originalPrice: 1775,
    discountPercent: 30,
    weaponType: 'Phantom',
    chromas: [],
    levels: [],
  },
  {
    uuid: '83778c03-45a3-67a2-3c89-6b8598327d58',
    displayName: 'Ion Sheriff',
    displayIcon: 'https://media.valorant-api.com/weaponskins/83778c03-45a3-67a2-3c89-6b8598327d58/displayicon.png',
    tier: TIERS['60bca009-4182-7998-dee7-b8a2558dc369'],
    price: 1154,
    originalPrice: 1775,
    discountPercent: 35,
    weaponType: 'Sheriff',
    chromas: [],
    levels: [],
  },
  {
    uuid: '32b87592-45ad-c5a6-44ae-a9b844137c58',
    displayName: 'Wasteland Vandal',
    displayIcon: 'https://media.valorant-api.com/weaponskins/32b87592-45ad-c5a6-44ae-a9b844137c58/displayicon.png',
    tier: TIERS['0cebb8be-46d7-c12a-d306-e9907bfc5a25'],
    price: 760,
    originalPrice: 1275,
    discountPercent: 40,
    weaponType: 'Vandal',
    chromas: [],
    levels: [],
  },
  {
    uuid: '341ef273-43fb-7911-71e8-50adada4cee1',
    displayName: 'Infantry Operator',
    displayIcon: 'https://media.valorant-api.com/weaponskins/341ef273-43fb-7911-71e8-50adada4cee1/displayicon.png',
    tier: TIERS['12683d76-48d7-84a3-4e09-6985794f0445'],
    price: 520,
    originalPrice: 875,
    discountPercent: 41,
    weaponType: 'Operator',
    chromas: [],
    levels: [],
  },
];

export const COMPETITIVE_TIERS: Record<number, string> = {
  0: 'UNRANKED',
  1: 'Unused 1',
  2: 'Unused 2',
  3: 'IRON 1',
  4: 'IRON 2',
  5: 'IRON 3',
  6: 'BRONZE 1',
  7: 'BRONZE 2',
  8: 'BRONZE 3',
  9: 'SILVER 1',
  10: 'SILVER 2',
  11: 'SILVER 3',
  12: 'GOLD 1',
  13: 'GOLD 2',
  14: 'GOLD 3',
  15: 'PLATINUM 1',
  16: 'PLATINUM 2',
  17: 'PLATINUM 3',
  18: 'DIAMOND 1',
  19: 'DIAMOND 2',
  20: 'DIAMOND 3',
  21: 'ASCENDANT 1',
  22: 'ASCENDANT 2',
  23: 'ASCENDANT 3',
  24: 'IMMORTAL 1',
  25: 'IMMORTAL 2',
  26: 'IMMORTAL 3',
  27: 'RADIANT',
};

export function getCompetitiveTierName(tier: number): string {
  return COMPETITIVE_TIERS[tier] || (tier > 0 ? `RANK ${tier}` : 'UNRANKED');
}

