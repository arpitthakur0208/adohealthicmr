import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Module from '@/backend/models/Module';
import { requireAdmin } from '@/backend/lib/auth';

// GET all modules
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const modules = await Module.find().sort({ id: 1 });
    
    return NextResponse.json({
      success: true,
      modules,
    });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch modules', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST create new module (Admin only)
export const POST = requireAdmin(async (request: NextRequest, user) => {
  try {

    const { id, title, description, color } = await request.json();

    if (!id || !title || !description || !color) {
      return NextResponse.json(
        { error: 'All fields (id, title, description, color) are required' },
        { status: 400 }
      );
    }

    // Check if module with this ID already exists
    const existingModule = await Module.findOne({ id });
    if (existingModule) {
      return NextResponse.json(
        { error: `Module with ID ${id} already exists` },
        { status: 400 }
      );
    }

    const newModule = await Module.create({
      id,
      title,
      description,
      color,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Module created successfully',
        module: newModule,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: 'Failed to create module', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});
