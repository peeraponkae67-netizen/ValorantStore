import { NextResponse } from 'next/server';
import { completeRiotSession } from '@/lib/riot';
import { Region } from '@/types/valorant';

export const preferredRegion = ['sin1'];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accessToken, region = 'ap' } = body;

    if (
      !accessToken ||
      typeof accessToken !== 'string' ||
      !accessToken.trim().startsWith('ey') ||
      accessToken.includes(' ') ||
      accessToken.includes('\n')
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'รูปแบบโทเค็นไม่ถูกต้อง กรุณาล็อกอินบนหน้าเว็บ Riot แล้วคัดลอกลิงก์ทั้งหมดที่ขึ้นต้นด้วย https://playvalorant.com/opt_in#access_token=...',
        },
        { status: 400 }
      );
    }

    const session = await completeRiotSession(accessToken.trim(), region as Region);
    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to initialize session from token.' },
      { status: 500 }
    );
  }
}
