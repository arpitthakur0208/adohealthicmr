import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Module from '@/backend/models/Module';
import Question from '@/backend/models/Question';

// This route maintains backward compatibility with the old file-based system
// It loads data from the database and formats it like the old JSON structure
export async function GET() {
  try {
    await connectDB();

    // Load modules
    const modules = await Module.find().sort({ id: 1 });
    
    // Load all questions grouped by moduleId
    const questions = await Question.find().sort({ moduleId: 1, id: 1 });
    
    // Format questions like the old structure: { "moduleId": [questions...] }
    const questionsByModule: { [key: string]: any[] } = {};
    questions.forEach((q) => {
      const moduleIdStr = String(q.moduleId);
      if (!questionsByModule[moduleIdStr]) {
        questionsByModule[moduleIdStr] = [];
      }
      questionsByModule[moduleIdStr].push({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      });
    });

    // Format modules to match old structure (without _id, __v, timestamps)
    const formattedModules = modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      color: m.color,
    }));

    return NextResponse.json({
      modules: formattedModules,
      questions: questionsByModule,
      answers: {}, // Answers are now stored separately per user
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error loading data:', error);
    // Return empty data structure on error (backward compatible)
    return NextResponse.json({
      modules: [],
      questions: {},
      answers: {},
      lastUpdated: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
