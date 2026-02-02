import { NextRequest, NextResponse } from 'next/server';
import { getVideoById, updateVideo, deleteVideo } from '@/lib/store';
import { requireAdmin } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';

function parseParams(
  params: Promise<{ id: string }> | { id: string },
  searchParams: URLSearchParams
): { videoId: number; moduleIdNum: number; videoType: string } | null {
  const moduleId = searchParams.get('moduleId');
  const videoType = searchParams.get('videoType');
  if (!moduleId || !videoType) return null;
  const videoId = parseInt(typeof params === 'object' && 'id' in params ? params.id : '');
  const moduleIdNum = parseInt(moduleId);
  if (isNaN(videoId) || isNaN(moduleIdNum)) return null;
  if (!['english', 'punjabi', 'hindi', 'activity'].includes(videoType)) return null;
  return { videoId, moduleIdNum, videoType };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { searchParams } = new URL(request.url);
    const p = parseParams(resolvedParams, searchParams);
    if (!p) {
      return NextResponse.json(
        { error: 'moduleId and videoType query parameters are required and must be valid' },
        { status: 400 }
      );
    }
    const video = getVideoById(p.moduleIdNum, p.videoType, p.videoId);
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video', details: error instanceof Error ? error.message : 'Unknown error' },
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
    const p = parseParams(resolvedParams, searchParams);
    if (!p) {
      return NextResponse.json(
        { error: 'moduleId and videoType query parameters are required and must be valid' },
        { status: 400 }
      );
    }
    const { preview, fileName, fileSize, fileUrl } = await request.json();
    const updatedVideo = updateVideo(p.moduleIdNum, p.videoType, p.videoId, {
      preview,
      fileName,
      fileSize,
      fileUrl,
    });
    if (!updatedVideo) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
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

export const DELETE = requireAdmin(async (
  request: NextRequest,
  user,
  context: { params: Promise<{ id: string }> | { id: string } }
) => {
  try {
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const { searchParams } = new URL(request.url);
    const p = parseParams(resolvedParams, searchParams);
    if (!p) {
      return NextResponse.json(
        { error: 'moduleId and videoType query parameters are required and must be valid' },
        { status: 400 }
      );
    }
    const ok = deleteVideo(p.moduleIdNum, p.videoType, p.videoId);
    if (!ok) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});
