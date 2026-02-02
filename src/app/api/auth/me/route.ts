import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/backend/lib/auth';
import { getUserByUsername } from '@/lib/pg-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const payload = await getCurrentUser(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // OTP users: userId is otp:email, no store record
    if (payload.userId.startsWith('otp:')) {
      return NextResponse.json({
        success: true,
        user: { id: payload.userId, username: payload.username, email: payload.userId.replace('otp:', ''), role: payload.role },
      });
    }

    const user = await getUserByUsername(payload.username);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json({ error: 'Failed to get user information' }, { status: 500 });
  }
}
