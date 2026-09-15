import { NextResponse } from 'next/server';
import { completeRiotSession } from '@/lib/riot';
import { Region } from '@/types/valorant';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accessToken, region = 'ap' } = body;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Access token is required.' },
        { status: 400 }
      );
    }

    const session = await completeRiotSession(accessToken, region as Region);
    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to initialize session from token.' },
      { status: 500 }
    );
  }
}
