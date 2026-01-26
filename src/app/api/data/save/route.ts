import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Module from '@/backend/models/Module';
import Question from '@/backend/models/Question';
import { requireAdmin } from '@/backend/lib/auth';

// This route maintains backward compatibility with the old file-based system
// It saves data from the old JSON format to the database
export const POST = requireAdmin(async (request: NextRequest, user) => {
  try {

    const data = await request.json();

    // Validate data structure
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Save modules
    if (data.modules && Array.isArray(data.modules)) {
      for (const moduleData of data.modules) {
        await Module.findOneAndUpdate(
          { id: moduleData.id },
          {
            id: moduleData.id,
            title: moduleData.title,
            description: moduleData.description,
            color: moduleData.color,
          },
          { upsert: true, new: true }
        );
      }
    }

    // Save questions
    if (data.questions && typeof data.questions === 'object') {
      for (const [moduleIdStr, questions] of Object.entries(data.questions)) {
        const moduleId = parseInt(moduleIdStr);
        if (!isNaN(moduleId) && Array.isArray(questions)) {
          for (const questionData of questions) {
            await Question.findOneAndUpdate(
              { id: questionData.id, moduleId },
              {
                id: questionData.id,
                moduleId,
                question: questionData.question,
                options: questionData.options,
                correctAnswer: questionData.correctAnswer,
              },
              { upsert: true, new: true }
            );
          }
        }
      }
    }

    // Note: Answers are not migrated here as they're user-specific
    // Use the /api/answers endpoint for user answers

    return NextResponse.json({
      success: true,
      message: 'Data saved successfully to database',
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { error: 'Failed to save data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});
