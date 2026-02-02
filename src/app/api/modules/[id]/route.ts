import { NextRequest, NextResponse } from 'next/server';
import { getModuleById, updateModule, deleteModule } from '@/lib/store';
import { requireAdmin, getCurrentUser } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const moduleId = parseInt(resolvedParams.id);
    if (isNaN(moduleId)) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 });
    }
    const moduleData = getModuleById(moduleId);
    if (!moduleData) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, module: moduleData });
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const moduleId = parseInt(resolvedParams.id);
    if (isNaN(moduleId)) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 });
    }
    const { title, description, color } = await request.json();
    const updatedModule = updateModule(moduleId, { title, description, color });
    if (!updatedModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: 'Module updated successfully',
      module: updatedModule,
    });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json(
      { error: 'Failed to update module', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const moduleId = parseInt(resolvedParams.id);
    if (isNaN(moduleId)) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 });
    }
    const ok = deleteModule(moduleId);
    if (!ok) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json(
      { error: 'Failed to delete module', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
