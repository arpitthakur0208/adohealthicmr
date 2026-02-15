import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { uploadVideo, CloudinaryVideoUploadResult } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

// Note: page-level `config` is deprecated for route handlers in newer Next.js versions.
// If you need to set a body size limit or other route segment config, move it to
// a route segment config file as documented by Next.js.

export const POST = requireAdmin(async (request: NextRequest, user) => {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File | null;
    const moduleId = formData.get('moduleId') as string | null;
    const videoType = formData.get('videoType') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!moduleId || !videoType) {
      return NextResponse.json(
        { error: 'moduleId and videoType are required' },
        { status: 400 }
      );
    }

    // Validate videoType
    if (!['english', 'punjabi', 'hindi', 'activity'].includes(videoType)) {
      return NextResponse.json(
        { error: 'Invalid video type. Must be: english, punjabi, hindi, or activity' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const folder = `adohealthicmr/videos/${moduleId}/${videoType}`;
    const result: CloudinaryVideoUploadResult = await uploadVideo(base64, folder);

    return NextResponse.json({
      success: true,
      message: 'Video uploaded successfully',
      video: {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        duration: result.duration,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
      },
      moduleId: parseInt(moduleId),
      videoType,
    });
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload video', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
});
