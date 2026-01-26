import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import LoginHistory from '@/backend/models/LoginHistory';
import { requireAdmin } from '@/backend/lib/auth';

/**
 * Get Login History API Endpoint (Admin Only)
 * 
 * GET /api/auth/login-history
 * Query params: ?limit=50&offset=0
 * 
 * Returns: { success: true, data: { logins: [], total: number } }
 */
async function handler(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Get login history, sorted by most recent first
    const logins = await LoginHistory.find()
      .sort({ loginAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    // Get total count
    const total = await LoginHistory.countDocuments();

    // Format the response
    const formattedLogins = logins.map(login => ({
      id: login._id.toString(),
      userId: login.userId.toString(),
      username: login.username,
      email: login.email,
      role: login.role,
      loginAt: login.loginAt,
      ipAddress: login.ipAddress,
      userAgent: login.userAgent,
      createdAt: login.createdAt,
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          logins: formattedLogins,
          total,
          limit,
          offset,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get login history error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch login history',
        message: 'An error occurred while fetching login history.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(handler);
