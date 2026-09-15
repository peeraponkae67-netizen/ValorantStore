import { NextResponse } from 'next/server';
import { authenticateRiotUser } from '@/lib/riot';
import { Region } from '@/types/valorant';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, region = 'ap' } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const result = await authenticateRiotUser(username, password, region as Region);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
