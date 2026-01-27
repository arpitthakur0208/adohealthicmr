import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Question from '@/backend/models/Question';
import { requireAdmin } from '@/backend/lib/auth';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

// GET all questions (optionally filtered by moduleId)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    let query = {};
    if (moduleId) {
      const moduleIdNum = parseInt(moduleId);
      if (!isNaN(moduleIdNum)) {
        query = { moduleId: moduleIdNum };
      }
    }

    const questions = await Question.find(query).sort({ moduleId: 1, id: 1 });
    
    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST create new question (Admin only)
export const POST = requireAdmin(async (request: NextRequest, user) => {
  try {

    const { id, moduleId, question, options, correctAnswer } = await request.json();

    if (!id || !moduleId || !question || !options || !Array.isArray(options)) {
      return NextResponse.json(
        { error: 'All fields (id, moduleId, question, options) are required' },
        { status: 400 }
      );
    }

    if (options.length < 2) {
      return NextResponse.json(
        { error: 'Question must have at least 2 options' },
        { status: 400 }
      );
    }

    // Check if question with this ID and moduleId already exists
    const existingQuestion = await Question.findOne({ id, moduleId });
    if (existingQuestion) {
      return NextResponse.json(
        { error: `Question with ID ${id} already exists for module ${moduleId}` },
        { status: 400 }
      );
    }

    const newQuestion = await Question.create({
      id,
      moduleId,
      question,
      options,
      correctAnswer,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Question created successfully',
        question: newQuestion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});
