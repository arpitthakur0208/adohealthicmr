import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Question from '@/backend/models/Question';
import { requireAdmin } from '@/backend/lib/auth';

// GET single question by ID and moduleId
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (!moduleId) {
      return NextResponse.json(
        { error: 'moduleId query parameter is required' },
        { status: 400 }
      );
    }

    const questionId = parseInt(params.id);
    const moduleIdNum = parseInt(moduleId);

    if (isNaN(questionId) || isNaN(moduleIdNum)) {
      return NextResponse.json(
        { error: 'Invalid question ID or module ID' },
        { status: 400 }
      );
    }

    const question = await Question.findOne({ id: questionId, moduleId: moduleIdNum });
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      question,
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT update question (Admin only)
export const PUT = requireAdmin(async (
  request: NextRequest,
  user,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (!moduleId) {
      return NextResponse.json(
        { error: 'moduleId query parameter is required' },
        { status: 400 }
      );
    }

    const questionId = parseInt(params.id);
    const moduleIdNum = parseInt(moduleId);

    if (isNaN(questionId) || isNaN(moduleIdNum)) {
      return NextResponse.json(
        { error: 'Invalid question ID or module ID' },
        { status: 400 }
      );
    }

    const { question, options, correctAnswer } = await request.json();

    if (options && Array.isArray(options) && options.length < 2) {
      return NextResponse.json(
        { error: 'Question must have at least 2 options' },
        { status: 400 }
      );
    }

    const updatedQuestion = await Question.findOneAndUpdate(
      { id: questionId, moduleId: moduleIdNum },
      { question, options, correctAnswer },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Question updated successfully',
      question: updatedQuestion,
    });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: 'Failed to update question', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});

// DELETE question (Admin only)
export const DELETE = requireAdmin(async (
  request: NextRequest,
  user,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (!moduleId) {
      return NextResponse.json(
        { error: 'moduleId query parameter is required' },
        { status: 400 }
      );
    }

    const questionId = parseInt(params.id);
    const moduleIdNum = parseInt(moduleId);

    if (isNaN(questionId) || isNaN(moduleIdNum)) {
      return NextResponse.json(
        { error: 'Invalid question ID or module ID' },
        { status: 400 }
      );
    }

    const question = await Question.findOneAndDelete({ id: questionId, moduleId: moduleIdNum });
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});
