import { NextResponse } from 'next/server';
import { fetchValorantApiCatalog } from '@/lib/riot';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    const { skins, tiers } = await fetchValorantApiCatalog();

    const skinList: any[] = [];
    skins.forEach((skin) => {
      // Filter base skins only
      if (skin.displayName && !skin.displayName.includes('Standard') && !skin.displayName.includes('Random')) {
        if (!query || skin.displayName.toLowerCase().includes(query)) {
          skinList.push({
            uuid: skin.uuid,
            displayName: skin.displayName,
            displayIcon: skin.displayIcon || skin.levels?.[0]?.displayIcon,
            tier: skin.contentTierUuid ? tiers.get(skin.contentTierUuid) : null,
          });
        }
      }
    });

    // Sort by name and limit to top 40
    const results = skinList.slice(0, 40);

    return NextResponse.json({ success: true, skins: results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
