import { NextRequest, NextResponse } from 'next/server';
import { getAnswers, upsertAnswer, getQuestionById } from '@/lib/store';
import { getCurrentUser, requireAuth } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const userIdParam = searchParams.get('userId');
    const queryUserId = user.role === 'admin' && userIdParam ? userIdParam : user.userId;
    const moduleIdNum = moduleId ? parseInt(moduleId) : undefined;
    const answers = getAnswers(queryUserId, isNaN(moduleIdNum as number) ? undefined : moduleIdNum);
    return NextResponse.json({ success: true, answers });
  } catch (error) {
    console.error('Error fetching answers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch answers', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const { moduleId, questionId, answer } = await request.json();
    if (!moduleId || !questionId || answer === undefined) {
      return NextResponse.json(
        { error: 'moduleId, questionId, and answer are required' },
        { status: 400 }
      );
    }
    const question = getQuestionById(questionId, moduleId);
    let isCorrect: boolean | undefined;
    if (question && question.correctAnswer !== undefined) {
      if (typeof answer === 'number') {
        isCorrect = answer === question.correctAnswer;
      } else if (typeof answer === 'string') {
        isCorrect = answer === question.options[question.correctAnswer];
      }
    }
    const record = upsertAnswer({
      userId: user.userId,
      moduleId,
      questionId,
      answer: String(answer),
      isCorrect,
    });
    return NextResponse.json(
      { success: true, message: 'Answer submitted successfully', answer: record },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});
