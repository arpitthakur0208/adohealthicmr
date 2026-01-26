import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Video from '@/backend/models/Video';
import { requireAuth, requireAdmin } from '@/backend/lib/auth';

// GET all videos (optionally filtered by moduleId and videoType)
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const videoType = searchParams.get('videoType');

    let query: any = {};
    if (moduleId) {
      const moduleIdNum = parseInt(moduleId);
      if (!isNaN(moduleIdNum)) {
        query.moduleId = moduleIdNum;
      }
    }
    if (videoType && ['english', 'punjabi', 'hindi', 'activity'].includes(videoType)) {
      query.videoType = videoType;
    }

    const videos = await Video.find(query)
      .populate('uploadedBy', 'username')
      .sort({ moduleId: 1, videoType: 1, videoId: 1 });

    return NextResponse.json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});

// POST create new video (Admin only)
export const POST = requireAdmin(async (request: NextRequest, user) => {
  try {
    await connectDB();

    const { moduleId, videoType, videoId, preview, fileName, fileSize, fileUrl } = await request.json();

    if (!moduleId || !videoType || videoId === undefined || !preview || !fileName || fileSize === undefined) {
      return NextResponse.json(
        { error: 'All fields (moduleId, videoType, videoId, preview, fileName, fileSize) are required' },
        { status: 400 }
      );
    }

    if (!['english', 'punjabi', 'hindi', 'activity'].includes(videoType)) {
      return NextResponse.json(
        { error: 'Invalid video type. Must be: english, punjabi, hindi, or activity' },
        { status: 400 }
      );
    }

    // Check if video with this ID already exists
    const existingVideo = await Video.findOne({ moduleId, videoType, videoId });
    if (existingVideo) {
      return NextResponse.json(
        { error: `Video with ID ${videoId} already exists for module ${moduleId} (${videoType})` },
        { status: 400 }
      );
    }

    const newVideo = await Video.create({
      moduleId,
      videoType,
      videoId,
      preview,
      fileName,
      fileSize,
      fileUrl,
      uploadedBy: user.userId,
    });

    await newVideo.populate('uploadedBy', 'username');

    return NextResponse.json(
      {
        success: true,
        message: 'Video created successfully',
        video: newVideo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});
