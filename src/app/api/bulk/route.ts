import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Module from '@/backend/models/Module';
import Question from '@/backend/models/Question';
import Video from '@/backend/models/Video';
import { requireAdmin } from '@/backend/lib/auth';

/**
 * Bulk operations API (Admin only)
 * Supports bulk create, update, and delete operations
 */
export const POST = requireAdmin(async (request: NextRequest, user) => {
  try {
    await connectDB();

    const { operation, resource, data } = await request.json();

    if (!operation || !resource) {
      return NextResponse.json(
        { error: 'Operation and resource are required' },
        { status: 400 }
      );
    }

    let result: any = {};

    switch (resource) {
      case 'modules':
        if (operation === 'create' && Array.isArray(data)) {
          const createdModules = await Promise.all(
            data.map((module: any) =>
              Module.findOneAndUpdate(
                { id: module.id },
                {
                  id: module.id,
                  title: module.title,
                  description: module.description,
                  color: module.color,
                },
                { upsert: true, new: true }
              )
            )
          );
          result = { created: createdModules.length, modules: createdModules };
        } else if (operation === 'delete' && Array.isArray(data)) {
          const deleted = await Module.deleteMany({ id: { $in: data } });
          result = { deleted: deleted.deletedCount };
        }
        break;

      case 'questions':
        if (operation === 'create' && Array.isArray(data)) {
          const createdQuestions = await Promise.all(
            data.map((question: any) =>
              Question.findOneAndUpdate(
                { id: question.id, moduleId: question.moduleId },
                {
                  id: question.id,
                  moduleId: question.moduleId,
                  question: question.question,
                  options: question.options,
                  correctAnswer: question.correctAnswer,
                },
                { upsert: true, new: true }
              )
            )
          );
          result = { created: createdQuestions.length, questions: createdQuestions };
        } else if (operation === 'update' && Array.isArray(data)) {
          const updatedQuestions = await Promise.all(
            data.map((question: any) =>
              Question.findOneAndUpdate(
                { id: question.id, moduleId: question.moduleId },
                {
                  question: question.question,
                  options: question.options,
                  correctAnswer: question.correctAnswer,
                },
                { new: true }
              )
            )
          );
          result = { updated: updatedQuestions.length, questions: updatedQuestions };
        } else if (operation === 'delete' && Array.isArray(data)) {
          // data should be array of { id, moduleId }
          const deleted = await Promise.all(
            data.map((item: any) =>
              Question.deleteOne({ id: item.id, moduleId: item.moduleId })
            )
          );
          result = { deleted: deleted.reduce((sum, d) => sum + (d.deletedCount || 0), 0) };
        }
        break;

      case 'videos':
        if (operation === 'create' && Array.isArray(data)) {
          const createdVideos = await Promise.all(
            data.map((video: any) =>
              Video.findOneAndUpdate(
                { moduleId: video.moduleId, videoType: video.videoType, videoId: video.videoId },
                {
                  moduleId: video.moduleId,
                  videoType: video.videoType,
                  videoId: video.videoId,
                  preview: video.preview,
                  fileName: video.fileName,
                  fileSize: video.fileSize,
                  fileUrl: video.fileUrl,
                  uploadedBy: user.userId,
                },
                { upsert: true, new: true }
              )
            )
          );
          result = { created: createdVideos.length, videos: createdVideos };
        } else if (operation === 'delete' && Array.isArray(data)) {
          // data should be array of { moduleId, videoType, videoId }
          const deleted = await Promise.all(
            data.map((item: any) =>
              Video.deleteOne({
                moduleId: item.moduleId,
                videoType: item.videoType,
                videoId: item.videoId,
              })
            )
          );
          result = { deleted: deleted.reduce((sum, d) => sum + (d.deletedCount || 0), 0) };
        }
        break;

      default:
        return NextResponse.json(
          { error: `Invalid resource: ${resource}. Supported: modules, questions, videos` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Bulk ${operation} operation completed`,
      result,
    });
  } catch (error) {
    console.error('Error performing bulk operation:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk operation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});
