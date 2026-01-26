import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Module from '@/backend/models/Module';
import { requireAdmin } from '@/backend/lib/auth';

// GET single module by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();

    // Handle both Promise and direct params (for Next.js 14+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const moduleId = parseInt(resolvedParams.id);
    if (isNaN(moduleId)) {
      return NextResponse.json(
        { error: 'Invalid module ID' },
        { status: 400 }
      );
    }

    const moduleData = await Module.findOne({ id: moduleId });
    if (!moduleData) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      module: moduleData,
    });
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT update module (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Check authentication first
  const connectDB = (await import('@/backend/lib/db')).default;
  await connectDB();
  
  const { getCurrentUser } = await import('@/backend/lib/auth');
  const user = await getCurrentUser(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }

  try {
    // Handle both Promise and direct params (for Next.js 14+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const moduleId = parseInt(resolvedParams.id);
    
    if (isNaN(moduleId)) {
      return NextResponse.json(
        { error: 'Invalid module ID' },
        { status: 400 }
      );
    }

    const { title, description, color } = await request.json();

    const updatedModule = await Module.findOneAndUpdate(
      { id: moduleId },
      { title, description, color },
      { new: true, runValidators: true }
    );

    if (!updatedModule) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
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

// DELETE module (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Check authentication first
  const connectDB = (await import('@/backend/lib/db')).default;
  await connectDB();
  
  const { getCurrentUser } = await import('@/backend/lib/auth');
  const user = await getCurrentUser(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }

  try {
    // Handle both Promise and direct params (for Next.js 14+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const moduleId = parseInt(resolvedParams.id);
    
    if (isNaN(moduleId)) {
      return NextResponse.json(
        { error: 'Invalid module ID' },
        { status: 400 }
      );
    }

    const deletedModule = await Module.findOneAndDelete({ id: moduleId });
    if (!deletedModule) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Module deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json(
      { error: 'Failed to delete module', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
