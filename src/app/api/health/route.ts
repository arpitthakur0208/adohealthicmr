import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import User from '@/backend/models/User';

/**
 * Health check endpoint
 * GET /api/health
 * Returns database connection status and basic info
 */
export async function GET() {
  try {
    // Test database connection
    await connectDB();
    
    // Check if admin user exists
    const adminUser = await User.findOne({ username: 'adohealthicmr' });
    const userCount = await User.countDocuments();
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      adminUserExists: !!adminUser,
      totalUsers: userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
