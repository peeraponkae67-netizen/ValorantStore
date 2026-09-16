export interface VpPack {
  thb: number;
  vp: number;
  bonus?: string;
}

export const THAILAND_VP_PACKS: VpPack[] = [
  { thb: 150, vp: 475 },
  { thb: 300, vp: 1000 },
  { thb: 500, vp: 1700 },
  { thb: 1000, vp: 3450, bonus: '+200 VP' },
  { thb: 1500, vp: 5250, bonus: '+500 VP' },
  { thb: 2000, vp: 7000, bonus: '+650 VP' },
  { thb: 3000, vp: 10600, bonus: '+1,100 VP' },
];

export interface VpCalculationResult {
  isEnough: boolean;
  currentVp: number;
  priceVp: number;
  missingVp: number;
  recommendedPack: {
    thb: number;
    vp: number;
    remainingAfterPurchase: number;
  } | null;
}

/**
 * Calculate missing VP and find the best Thai Baht top-up pack
 */
export function calculateVpTopup(priceVp: number, currentVp: number): VpCalculationResult {
  if (currentVp >= priceVp) {
    return {
      isEnough: true,
      currentVp,
      priceVp,
      missingVp: 0,
      recommendedPack: null,
    };
  }

  const missingVp = priceVp - currentVp;

  // Find the smallest single pack that covers the missing VP
  const singlePack = THAILAND_VP_PACKS.find((p) => p.vp >= missingVp);

  if (singlePack) {
    return {
      isEnough: false,
      currentVp,
      priceVp,
      missingVp,
      recommendedPack: {
        thb: singlePack.thb,
        vp: singlePack.vp,
        remainingAfterPurchase: currentVp + singlePack.vp - priceVp,
      },
    };
  }

  // If missing more than the largest single pack (3,000 THB = 10,600 VP)
  // Calculate multiple 3,000 THB packs + remainder
  const largest = THAILAND_VP_PACKS[THAILAND_VP_PACKS.length - 1];
  const count = Math.ceil(missingVp / largest.vp);
  const totalVp = count * largest.vp;

  return {
    isEnough: false,
    currentVp,
    priceVp,
    missingVp,
    recommendedPack: {
      thb: count * largest.thb,
      vp: totalVp,
      remainingAfterPurchase: currentVp + totalVp - priceVp,
    },
  };
}
