import { NextResponse } from 'next/server';
import { getPlayerStorefront, generateDemoStoreData } from '@/lib/riot';
import { RiotSession } from '@/types/valorant';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session, isDemo, demoName, demoTag, demoRegion } = body;

    if (isDemo) {
      const demoData = generateDemoStoreData(
        demoName || 'TenZ',
        demoTag || 'NA1',
        demoRegion || 'na'
      );
      return NextResponse.json({ success: true, store: demoData });
    }

    if (!session || !session.accessToken || !session.puuid) {
      return NextResponse.json(
        { success: false, error: 'Valid Riot session required.' },
        { status: 401 }
      );
    }

    const storeData = await getPlayerStorefront(session as RiotSession);
    return NextResponse.json({ success: true, store: storeData });
  } catch (error: any) {
    console.error('Storefront error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch store data.' },
      { status: 500 }
    );
  }
}
