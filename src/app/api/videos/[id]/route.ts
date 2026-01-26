import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Video from '@/backend/models/Video';
import { requireAdmin } from '@/backend/lib/auth';

// GET single video by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const videoType = searchParams.get('videoType');

    if (!moduleId || !videoType) {
      return NextResponse.json(
        { error: 'moduleId and videoType query parameters are required' },
        { status: 400 }
      );
    }

    const videoId = parseInt(params.id);
    const moduleIdNum = parseInt(moduleId);

    if (isNaN(videoId) || isNaN(moduleIdNum)) {
      return NextResponse.json(
        { error: 'Invalid video ID or module ID' },
        { status: 400 }
      );
    }

    if (!['english', 'punjabi', 'hindi', 'activity'].includes(videoType)) {
      return NextResponse.json(
        { error: 'Invalid video type' },
        { status: 400 }
      );
    }

    const video = await Video.findOne({ moduleId: moduleIdNum, videoType, videoId })
      .populate('uploadedBy', 'username');

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      video,
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT update video (Admin only)
export const PUT = requireAdmin(async (
  request: NextRequest,
  user,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const videoType = searchParams.get('videoType');

    if (!moduleId || !videoType) {
      return NextResponse.json(
        { error: 'moduleId and videoType query parameters are required' },
        { status: 400 }
      );
    }

    const videoId = parseInt(params.id);
    const moduleIdNum = parseInt(moduleId);

    if (isNaN(videoId) || isNaN(moduleIdNum)) {
      return NextResponse.json(
        { error: 'Invalid video ID or module ID' },
        { status: 400 }
      );
    }

    const { preview, fileName, fileSize, fileUrl } = await request.json();

    const updatedVideo = await Video.findOneAndUpdate(
      { moduleId: moduleIdNum, videoType, videoId },
      { preview, fileName, fileSize, fileUrl },
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'username');

    if (!updatedVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Video updated successfully',
      video: updatedVideo,
    });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});

// DELETE video (Admin only)
export const DELETE = requireAdmin(async (
  request: NextRequest,
  user,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const videoType = searchParams.get('videoType');

    if (!moduleId || !videoType) {
      return NextResponse.json(
        { error: 'moduleId and videoType query parameters are required' },
        { status: 400 }
      );
    }

    const videoId = parseInt(params.id);
    const moduleIdNum = parseInt(moduleId);

    if (isNaN(videoId) || isNaN(moduleIdNum)) {
      return NextResponse.json(
        { error: 'Invalid video ID or module ID' },
        { status: 400 }
      );
    }

    const video = await Video.findOneAndDelete({ moduleId: moduleIdNum, videoType, videoId });
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});
