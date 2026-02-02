import { NextResponse } from 'next/server';
import { getStoreStatus } from '@/lib/store';
import { getUserByUsername, getUsersCount } from '@/lib/pg-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = getStoreStatus();
    const adminUser = await getUserByUsername('adohealthicmr');
    const totalUsers = await getUsersCount();
    return NextResponse.json({
      status: 'healthy',
      database: 'postgres',
      store: 'in-memory',
      adminUserExists: !!adminUser,
      totalUsers,
      modules: status.modules,
      questions: status.questions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
