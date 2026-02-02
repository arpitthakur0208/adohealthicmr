import { NextRequest, NextResponse } from 'next/server';
import { getQuestions, createQuestion } from '@/lib/store';
import { requireAdmin } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const moduleIdNum = moduleId ? parseInt(moduleId) : undefined;
    const questions = getQuestions(isNaN(moduleIdNum as number) ? undefined : moduleIdNum);
    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const POST = requireAdmin(async (request: NextRequest) => {
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
    const newQuestion = createQuestion({ id, moduleId, question, options, correctAnswer });
    return NextResponse.json(
      { success: true, message: 'Question created successfully', question: newQuestion },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('already exists')) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question', details: message },
      { status: 500 }
    );
  }
});
