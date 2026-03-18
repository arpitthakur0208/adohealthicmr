import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import cloudinary from '@/lib/cloudinary';
import { requireAdmin } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_UPLOAD_BYTES = 500 * 1024 * 1024; // 500MB

function isLikelyVideo(fileName: string | undefined, mimeType: string | undefined) {
  if (mimeType?.startsWith('video/')) return true;
  const ext = fileName?.toLowerCase().split('.').pop();
  if (!ext) return false;
  return ['mp4', 'mov', 'm4v', 'mkv', 'webm', 'avi', '3gp', 'mpeg', 'mpg'].includes(ext);
}

function safeToString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return undefined;
}

function runFfmpegConvert(inputPath: string, outputPath: string): Promise<void> {
  const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
  // Required command (see user request):
  // ffmpeg -i input_file -c:v libx264 -pix_fmt yuv420p -c:a aac -movflags +faststart output.mp4
  const args = [
    '-y',
    '-i',
    inputPath,
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-movflags',
    '+faststart',
    outputPath,
  ];

  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args, { windowsHide: true });
    let stderr = '';
    let stdout = '';

    proc.stdout.on('data', (chunk) => {
      const s = chunk.toString();
      stdout += s;
      // ffmpeg writes a lot to stderr; still log stdout for debugging.
      if (s.trim()) console.log('[FFmpeg stdout]', s);
    });

    proc.stderr.on('data', (chunk) => {
      const s = chunk.toString();
      stderr += s;
      if (s.trim()) console.log('[FFmpeg stderr]', s);
    });

    proc.on('error', (err) => {
      const underlying = err instanceof Error ? err.message : String(err);
      const ffmpegPathEnv = process.env.FFMPEG_PATH || '(not set)';

      // ENOENT almost always means "ffmpeg binary missing" or "not on PATH".
      const code = (err as any)?.code;
      if (code === 'ENOENT') {
        reject(
          new Error(
            [
              'FFmpeg not found on the server (spawn ENOENT).',
              'Install FFmpeg and ensure it is available to the Next.js process.',
              'Quick checks:',
              ' - in PowerShell: where ffmpeg',
              ' - in PowerShell: ffmpeg -version',
              'If you installed it but it’s not in PATH, set env var FFMPEG_PATH to the full ffmpeg.exe path, then restart the dev server.',
              `FFMPEG_PATH=${ffmpegPathEnv}`,
              `Underlying error: ${underlying}`,
            ].join('\n'),
          ),
        );
      }

      reject(
        new Error(
          `Failed to start ffmpeg. Is ffmpeg installed and on PATH? Underlying error: ${underlying}`,
        ),
      );
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `FFmpeg conversion failed with exit code ${code}. Stderr:\n${stderr.slice(-12000)}`,
          ),
        );
      }
    });
  });
}

async function fileToBuffer(file: File) {
  // Reads the file into memory once, then writes to disk for FFmpeg.
  // We still use a strict MAX_UPLOAD_BYTES limit to reduce memory risk.
  const ab = await file.arrayBuffer();
  return Buffer.from(ab);
}

export const POST = requireAdmin(async (request: NextRequest) => {
  let tmpDir: string | undefined;
  let inputPath: string | undefined;
  let outputPath: string | undefined;

  try {
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, error: 'Expected multipart/form-data body.' },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'Missing `file` field.' },
        { status: 400 },
      );
    }

    if (!isLikelyVideo(file.name, file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Expected `video/*`.' },
        { status: 400 },
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        { success: false, error: 'Uploaded file is empty.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum allowed size is ${(MAX_UPLOAD_BYTES / (1024 * 1024)).toFixed(
            0,
          )}MB.`,
        },
        { status: 413 },
      );
    }

    const folder =
      safeToString(formData.get('folder')) ||
      safeToString(formData.get('cloudinaryFolder')) ||
      safeToString(formData.get('moduleId')) ||
      'adohealthicmr/videos';

    const moduleId = safeToString(formData.get('moduleId'));
    const videoType = safeToString(formData.get('videoType'));

    const computedFolder =
      folder === safeToString(formData.get('moduleId'))
        ? `adohealthicmr/videos/${moduleId || 'unknown'}/${videoType || 'video'}`
        : folder;

    tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'adohealthicmr-video-'));

    // Preserve extension for debugging; FFmpeg output is always output.mp4
    const inputExt = path.extname(file.name) || '';
    inputPath = path.join(tmpDir, `input${inputExt}`);
    outputPath = path.join(tmpDir, 'output.mp4');

    const buffer = await fileToBuffer(file);
    await fs.promises.writeFile(inputPath, buffer);

    // Convert to iOS-compatible MP4
    await runFfmpegConvert(inputPath, outputPath);

    // Upload only the processed output file to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        outputPath as string,
        {
          folder: computedFolder,
          resource_type: 'video',
          format: 'mp4',
          // Keep the converted mp4 as-is; we can still generate iOS-friendly eager formats if desired,
          // but the core is that the source is already H.264 + AAC.
          eager: [{ format: 'mp4', codec: 'h264' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
    });

    const secure_url: string = uploadResult?.secure_url || uploadResult?.url;
    const public_id: string = uploadResult?.public_id;
    const bytes: number = uploadResult?.bytes || file.size;

    return NextResponse.json({
      success: true,
      // Fields used by VideoUploader.jsx
      secure_url,
      public_id,
      bytes,
      format: uploadResult?.format,
      duration: uploadResult?.duration,
      width: uploadResult?.width,
      height: uploadResult?.height,
      // Fields used by older page.tsx pending-upload flow
      fileUrl: secure_url,
      previewUrl: secure_url ? secure_url.replace(/\.[^/.]+$/, '.jpg') : undefined,
      fileName: file.name,
      fileSize: bytes,
      videoId: Date.now(),
    });
  } catch (error: any) {
    console.error('[cloudinary-upload] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Upload failed',
      },
      { status: 500 },
    );
  } finally {
    // Cleanup temp files
    try {
      if (outputPath && fs.existsSync(outputPath)) await fs.promises.unlink(outputPath);
    } catch {
      // ignore
    }
    try {
      if (inputPath && fs.existsSync(inputPath)) await fs.promises.unlink(inputPath);
    } catch {
      // ignore
    }
    try {
      if (tmpDir && fs.existsSync(tmpDir)) {
        // Node 16+ supports rm({ recursive: true })
        await fs.promises.rm(tmpDir, { recursive: true, force: true });
      }
    } catch {
      // ignore
    }
  }
});

