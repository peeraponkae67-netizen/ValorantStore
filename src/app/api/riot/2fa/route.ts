import { NextResponse } from 'next/server';
import { verifyRiot2FA } from '@/lib/riot';
import { Region } from '@/types/valorant';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, cookies, region = 'ap' } = body;

    if (!code || !cookies) {
      return NextResponse.json(
        { success: false, error: '2FA code and session cookies are required.' },
        { status: 400 }
      );
    }

    const result = await verifyRiot2FA(code, cookies, region as Region);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error during 2FA verification.' },
      { status: 500 }
    );
  }
}
