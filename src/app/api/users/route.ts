import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import User from '@/backend/models/User';
import { requireAdmin } from '@/backend/lib/auth';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

// GET all users (Admin only)
export const GET = requireAdmin(async (request: NextRequest, user) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    let query: any = {};
    if (role && (role === 'admin' || role === 'user')) {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});
