import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Module from '@/backend/models/Module';
import Question from '@/backend/models/Question';
import Answer from '@/backend/models/Answer';
import User from '@/backend/models/User';
import Video from '@/backend/models/Video';
import { requireAuth } from '@/backend/lib/auth';

// GET statistics (Authenticated users)
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    let moduleFilter: any = {};
    if (moduleId) {
      const moduleIdNum = parseInt(moduleId);
      if (!isNaN(moduleIdNum)) {
        moduleFilter.moduleId = moduleIdNum;
      }
    }

    // Get counts
    const totalModules = await Module.countDocuments();
    const totalQuestions = await Question.countDocuments(moduleFilter);
    const totalUsers = await User.countDocuments();
    const totalVideos = await Video.countDocuments(moduleFilter);

    // Get answer statistics
    let answerStats: any = {};
    if (user.role === 'admin') {
      // Admins can see all answer statistics
      const totalAnswers = await Answer.countDocuments(moduleFilter);
      const correctAnswers = await Answer.countDocuments({ ...moduleFilter, isCorrect: true });
      const uniqueUsersAnswered = await Answer.distinct('userId', moduleFilter);
      
      answerStats = {
        totalAnswers,
        correctAnswers,
        incorrectAnswers: totalAnswers - correctAnswers,
        accuracyRate: totalAnswers > 0 ? ((correctAnswers / totalAnswers) * 100).toFixed(2) : 0,
        uniqueUsersAnswered: uniqueUsersAnswered.length,
      };
    } else {
      // Regular users can only see their own statistics
      const userAnswers = await Answer.find({ userId: user.userId, ...moduleFilter });
      const totalAnswers = userAnswers.length;
      const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
      
      answerStats = {
        totalAnswers,
        correctAnswers,
        incorrectAnswers: totalAnswers - correctAnswers,
        accuracyRate: totalAnswers > 0 ? ((correctAnswers / totalAnswers) * 100).toFixed(2) : 0,
      };
    }

    // Get module-specific statistics
    const moduleStats = await Module.find().sort({ id: 1 });
    const moduleDetails = await Promise.all(
      moduleStats.map(async (module) => {
        const questionsCount = await Question.countDocuments({ moduleId: module.id });
        const videosCount = await Video.countDocuments({ moduleId: module.id });
        
        let moduleAnswerStats: any = {};
        if (user.role === 'admin') {
          const moduleAnswers = await Answer.countDocuments({ moduleId: module.id });
          const moduleCorrectAnswers = await Answer.countDocuments({ moduleId: module.id, isCorrect: true });
          moduleAnswerStats = {
            totalAnswers: moduleAnswers,
            correctAnswers: moduleCorrectAnswers,
            accuracyRate: moduleAnswers > 0 ? ((moduleCorrectAnswers / moduleAnswers) * 100).toFixed(2) : 0,
          };
        } else {
          const userModuleAnswers = await Answer.find({ userId: user.userId, moduleId: module.id });
          const moduleAnswers = userModuleAnswers.length;
          const moduleCorrectAnswers = userModuleAnswers.filter(a => a.isCorrect).length;
          moduleAnswerStats = {
            totalAnswers: moduleAnswers,
            correctAnswers: moduleCorrectAnswers,
            accuracyRate: moduleAnswers > 0 ? ((moduleCorrectAnswers / moduleAnswers) * 100).toFixed(2) : 0,
          };
        }

        return {
          moduleId: module.id,
          moduleTitle: module.title,
          questionsCount,
          videosCount,
          ...moduleAnswerStats,
        };
      })
    );

    return NextResponse.json({
      success: true,
      statistics: {
        overview: {
          totalModules,
          totalQuestions,
          totalUsers: user.role === 'admin' ? totalUsers : undefined,
          totalVideos,
        },
        answers: answerStats,
        modules: moduleDetails,
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});
