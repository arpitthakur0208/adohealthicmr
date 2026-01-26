import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Answer from '@/backend/models/Answer';
import Question from '@/backend/models/Question';
import { getCurrentUser, requireAuth } from '@/backend/lib/auth';

// GET all answers (optionally filtered by userId, moduleId)
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const userId = searchParams.get('userId');

    // Non-admins can only see their own answers
    const queryUserId = user.role === 'admin' && userId ? userId : user.userId;

    let query: any = { userId: queryUserId };
    if (moduleId) {
      const moduleIdNum = parseInt(moduleId);
      if (!isNaN(moduleIdNum)) {
        query.moduleId = moduleIdNum;
      }
    }

    const answers = await Answer.find(query)
      .populate('userId', 'username')
      .sort({ moduleId: 1, questionId: 1 });

    return NextResponse.json({
      success: true,
      answers,
    });
  } catch (error) {
    console.error('Error fetching answers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch answers', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});

// POST submit answer
export const POST = requireAuth(async (request: NextRequest, user) => {
  try {

    const { moduleId, questionId, answer } = await request.json();

    if (!moduleId || !questionId || answer === undefined) {
      return NextResponse.json(
        { error: 'moduleId, questionId, and answer are required' },
        { status: 400 }
      );
    }

    // Get the question to check if answer is correct
    const question = await Question.findOne({ id: questionId, moduleId });
    let isCorrect: boolean | undefined;

    if (question && question.correctAnswer !== undefined) {
      // Compare answer with correct answer
      // Assuming answer is the index (0-based) or the option text
      if (typeof answer === 'number') {
        isCorrect = answer === question.correctAnswer;
      } else if (typeof answer === 'string') {
        // If answer is a string, compare with the option at correctAnswer index
        isCorrect = answer === question.options[question.correctAnswer];
      }
    }

    // Upsert answer (update if exists, create if not)
    const userAnswer = await Answer.findOneAndUpdate(
      {
        userId: user.userId,
        moduleId,
        questionId,
      },
      {
        userId: user.userId,
        moduleId,
        questionId,
        answer: String(answer),
        isCorrect,
        submittedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Answer submitted successfully',
        answer: userAnswer,
      },
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
