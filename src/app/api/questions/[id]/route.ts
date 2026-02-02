import { NextRequest, NextResponse } from 'next/server';
import { getQuestionById, updateQuestion, deleteQuestion } from '@/lib/store';
import { requireAdmin } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId query parameter is required' }, { status: 400 });
    }
    const questionId = parseInt(resolvedParams.id);
    const moduleIdNum = parseInt(moduleId);
    if (isNaN(questionId) || isNaN(moduleIdNum)) {
      return NextResponse.json({ error: 'Invalid question ID or module ID' }, { status: 400 });
    }
    const question = getQuestionById(questionId, moduleIdNum);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, question });
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const PUT = requireAdmin(async (
  request: NextRequest,
  user,
  context: { params: Promise<{ id: string }> | { id: string } }
) => {
  try {
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId query parameter is required' }, { status: 400 });
    }
    const questionId = parseInt(resolvedParams.id);
    const moduleIdNum = parseInt(moduleId);
    if (isNaN(questionId) || isNaN(moduleIdNum)) {
      return NextResponse.json({ error: 'Invalid question ID or module ID' }, { status: 400 });
    }
    const { question, options, correctAnswer } = await request.json();
    if (options && Array.isArray(options) && options.length < 2) {
      return NextResponse.json(
        { error: 'Question must have at least 2 options' },
        { status: 400 }
      );
    }
    const updatedQuestion = updateQuestion(questionId, moduleIdNum, { question, options, correctAnswer });
    if (!updatedQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
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

export const DELETE = requireAdmin(async (
  request: NextRequest,
  user,
  context: { params: Promise<{ id: string }> | { id: string } }
) => {
  try {
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId query parameter is required' }, { status: 400 });
    }
    const questionId = parseInt(resolvedParams.id);
    const moduleIdNum = parseInt(moduleId);
    if (isNaN(questionId) || isNaN(moduleIdNum)) {
      return NextResponse.json({ error: 'Invalid question ID or module ID' }, { status: 400 });
    }
    const ok = deleteQuestion(questionId, moduleIdNum);
    if (!ok) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});
