import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { Readable } from 'stream';
import fs from 'fs';
import os from 'os';
import path from 'path';
import Busboy from 'busboy';
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
    '-crf',
    '28',
    '-preset',
    'fast',
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
    // Create a temp dir so we can stream the upload to disk (avoids Next's formData buffering limits).
    tmpDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), 'adohealthicmr-video-upload-'),
    );

    const fields: Record<string, string | undefined> = {};
    let inputFileName: string | undefined;
    let inputFileMime: string | undefined;
    let inputFileBytes = 0;
    let fileTooLarge = false;

    const uploadParseResult = await new Promise<{
      moduleId?: string;
      videoType?: string;
      folder?: string;
    }>((resolve, reject) => {
      const headers = Object.fromEntries(request.headers.entries());
      const bb = Busboy({
        headers,
        limits: {
          fileSize: MAX_UPLOAD_BYTES,
          files: 1,
        },
      });

      bb.on('field', (name, value) => {
        fields[name] = typeof value === 'string' ? value : undefined;
      });

      bb.on('file', (fieldname, fileStream, filename, _encoding, mimetype) => {
        if (fieldname !== 'file') {
          // Drain unexpected file fields
          fileStream.resume();
          return;
        }

        inputFileName = filename;
        inputFileMime = mimetype;

        if (!isLikelyVideo(filename, mimetype)) {
          fileStream.resume();
          reject(new Error('Invalid file type. Expected `video/*`.'));
          return;
        }

        const inputExt = path.extname(filename) || '';
        inputPath = path.join(tmpDir!, `input${inputExt}`);

        const out = fs.createWriteStream(inputPath);
        let localBytes = 0;

        fileStream.on('data', (chunk) => {
          localBytes += chunk.length;
        });

        out.on('error', reject);
        fileStream.on('error', reject);

        fileStream.pipe(out);

        out.on('finish', () => {
          inputFileBytes = localBytes;
        });
      });

      // busboy emits 'limit' when a limit is hit (like fileSize)
      bb.on('limit', () => {
        fileTooLarge = true;
        reject(
          new Error(
            `File too large. Maximum allowed size is ${(MAX_UPLOAD_BYTES / (1024 * 1024)).toFixed(0)}MB.`,
          ),
        );
      });

      bb.on('error', reject);
      bb.on('finish', () => {
        resolve({
          moduleId: fields.moduleId,
          videoType: fields.videoType,
          folder: fields.folder,
        });
      });

      // Pipe request stream into busboy
      const readable = Readable.fromWeb(request.body as any);
      readable.pipe(bb);
    });

    if (!inputPath || !inputFileName) {
      return NextResponse.json(
        { success: false, error: 'Missing `file` field.' },
        { status: 400 },
      );
    }

    if (fileTooLarge || inputFileBytes > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum allowed size is ${(MAX_UPLOAD_BYTES / (1024 * 1024)).toFixed(0)}MB.`,
        },
        { status: 413 },
      );
    }

    const folder =
      safeToString(uploadParseResult.folder) ||
      safeToString(fields.cloudinaryFolder) ||
      safeToString(fields.moduleId) ||
      'adohealthicmr/videos';

    const moduleId = safeToString(uploadParseResult.moduleId);
    const videoType = safeToString(uploadParseResult.videoType);

    const computedFolder =
      folder === safeToString(fields.moduleId)
        ? `adohealthicmr/videos/${moduleId || 'unknown'}/${videoType || 'video'}`
        : folder;

    // 1) Generate a new filename with .mp4
    outputPath = path.join(tmpDir, `output_${Date.now()}.mp4`);

    // 2) Compress/convert BEFORE upload
    await runFfmpegConvert(inputPath, outputPath);

    // 3) Upload ONLY the converted file to Cloudinary using chunked upload
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        outputPath as string,
        {
          folder: computedFolder,
          resource_type: 'video',
          format: 'mp4',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
    });

    const secure_url: string = uploadResult?.secure_url || uploadResult?.url;
    const public_id: string = uploadResult?.public_id;
    const bytes: number = uploadResult?.bytes || inputFileBytes;

    return NextResponse.json({
      success: true,
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
      fileName: inputFileName,
      fileSize: bytes,
      videoId: Date.now(),
    });
  } catch (error: any) {
    console.error('[cloudinary-upload] Error:', error);

    const msg = error?.message || '';
    const statusCode = error?.http_code || error?.status || error?.statusCode;
    const isTooLarge =
      statusCode === 413 ||
      error?.code === 'LIMIT_FILE_SIZE' ||
      msg.toLowerCase().includes('file too large') ||
      msg.toLowerCase().includes('request entity too large') ||
      msg.toLowerCase().includes('payload too large');

    if (isTooLarge) {
      return NextResponse.json(
        { success: false, error: msg || 'File too large' },
        { status: 413 },
      );
    }
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

