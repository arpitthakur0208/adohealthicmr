import { NextRequest, NextResponse } from 'next/server';
import { getModules, createModule } from '@/lib/store';
import { requireAdmin } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const modules = getModules();
    return NextResponse.json({ success: true, modules });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json({ error: 'Failed to fetch modules', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const { id, title, description, color } = await request.json();
    if (!id || !title || !description || !color) {
      return NextResponse.json({ error: 'All fields (id, title, description, color) are required' }, { status: 400 });
    }
    const newModule = createModule({ id, title, description, color });
    return NextResponse.json({ success: true, message: 'Module created successfully', module: newModule }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('already exists')) return NextResponse.json({ error: message }, { status: 400 });
    console.error('Error creating module:', error);
    return NextResponse.json({ error: 'Failed to create module', details: message }, { status: 500 });
  }
});
