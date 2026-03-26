/**
 * Direct Cloudinary video upload from the browser using an unsigned upload preset.
 * FormData fields sent to Cloudinary: `file`, `upload_preset` only.
 * Configure preset `video_upload_preset` (unsigned) in the Cloudinary console.
 */

export interface UploadProgress {
  stage: 'compressing' | 'uploading' | 'complete';
  progress: number; // 0-100
  message: string;
  compressedSize?: number;
  originalSize?: number;
  uploadedBytes?: number;
  totalBytes?: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  compress?: boolean; // Whether to compress before upload
  quality?: number; // Compression quality 0.1-1.0 (default: 0.6)
  maxRetries?: number; // Number of retry attempts for failed chunks (default: 3)
}

function requireCloudinaryCloudName(): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ?? '';
  if (!cloudName) {
    throw new Error(
      'Cloudinary cloud name is undefined. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local and restart the dev server.',
    );
  }
  return cloudName;
}

function getUploadPresetOrEmpty(): string {
  return process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() ?? '';
}

/**
 * Unsigned direct video upload (browser only). Uses NEXT_PUBLIC_* env vars only.
 */
export function performUnsignedVideoUploadXhr(
  file: File,
  options: {
    onProgress?: (p: UploadProgress, compressionExtras: { originalSize: number; compressedSize: number }) => void;
    compressionInfo?: { originalSize: number; compressedSize: number };
  } = {},
): Promise<Record<string, unknown>> {
  const cloudName = requireCloudinaryCloudName();
  const uploadPreset = getUploadPresetOrEmpty();
  if (!uploadPreset) {
    throw new Error(
      'Upload preset is missing. Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local and restart the dev server.',
    );
  }

  console.log("ENV CHECK:", {
    cloud: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  });

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
  const compressionInfo = options.compressionInfo ?? { originalSize: file.size, compressedSize: file.size };

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const startTime = Date.now();
    let lastProgress = 0;

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        const uploadedMB = (event.loaded / (1024 * 1024)).toFixed(2);
        const totalMB = (event.total / (1024 * 1024)).toFixed(2);
        options.onProgress?.(
          {
            stage: 'uploading',
            progress,
            message: `Uploading to Cloudinary... ${progress}% (${uploadedMB}MB / ${totalMB}MB)`,
            ...compressionInfo,
            uploadedBytes: event.loaded,
            totalBytes: event.total,
          },
          compressionInfo,
        );
        if (progress - lastProgress >= 5 || progress === 100) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          const speed =
            event.loaded > 0 ? ((event.loaded / (1024 * 1024)) / parseFloat(elapsed)).toFixed(2) : '0';
          console.log(
            `📤 [Cloudinary Direct Upload] Progress: ${progress}% (${uploadedMB}MB / ${totalMB}MB) - ${elapsed}s - ${speed}MB/s`,
          );
          lastProgress = progress;
        }
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as Record<string, unknown>);
        } catch {
          reject(new Error('Failed to parse Cloudinary response'));
        }
        return;
      }
      try {
        const errorResponse = JSON.parse(xhr.responseText) as { error?: { message?: string } };
        const errorMessage = errorResponse.error?.message ?? `Upload failed with status ${xhr.status}`;
        if (xhr.status === 413) {
          reject(
            new Error(
              'File too large (413). Reduce file size or raise preset limits in Cloudinary.',
            ),
          );
        } else if (xhr.status === 401) {
          reject(new Error(`Unauthorized: ${errorMessage}`));
        } else if (xhr.status === 400) {
          reject(new Error(`Bad request: ${errorMessage}`));
        } else {
          reject(new Error(`Upload failed (${xhr.status}): ${errorMessage}`));
        }
      } catch {
        if (xhr.status === 0) {
          reject(
            new Error(
              'CORS or network error. In Cloudinary: Settings → Security → Allowed CORS origins — add http://localhost:3000 and your production URL.',
            ),
          );
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(
        new Error(
          'Network error during Cloudinary upload. Check connection and CORS settings.',
        ),
      );
    });
    xhr.addEventListener('abort', () => reject(new Error('Upload was cancelled')));
    xhr.addEventListener('timeout', () =>
      reject(new Error('Upload timed out. Try a smaller file or a faster connection.')),
    );
    xhr.timeout = 600000;
    xhr.open('POST', uploadUrl);
    xhr.send(formData);
  });
}

async function performSignedVideoUploadXhr(
  file: File,
  options: {
    onProgress?: (p: UploadProgress, compressionExtras: { originalSize: number; compressedSize: number }) => void;
    compressionInfo?: { originalSize: number; compressedSize: number };
  } = {},
): Promise<Record<string, unknown>> {
  const cloudName = requireCloudinaryCloudName();
  const compressionInfo = options.compressionInfo ?? { originalSize: file.size, compressedSize: file.size };
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

  const signatureResponse = await fetch('/api/signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder: 'adohealthicmr/videos' }),
  });

  if (!signatureResponse.ok) {
    throw new Error('Could not generate Cloudinary signature from server.');
  }

  const signatureData = (await signatureResponse.json()) as {
    timestamp?: number;
    signature?: string;
    apiKey?: string;
    folder?: string;
  };

  if (!signatureData.timestamp || !signatureData.signature || !signatureData.apiKey) {
    throw new Error('Cloudinary signature response is incomplete.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', String(signatureData.apiKey));
  formData.append('timestamp', String(signatureData.timestamp));
  formData.append('signature', String(signatureData.signature));
  if (signatureData.folder) {
    formData.append('folder', signatureData.folder);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const startTime = Date.now();
    let lastProgress = 0;

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        const uploadedMB = (event.loaded / (1024 * 1024)).toFixed(2);
        const totalMB = (event.total / (1024 * 1024)).toFixed(2);
        options.onProgress?.(
          {
            stage: 'uploading',
            progress,
            message: `Uploading to Cloudinary... ${progress}% (${uploadedMB}MB / ${totalMB}MB)`,
            ...compressionInfo,
            uploadedBytes: event.loaded,
            totalBytes: event.total,
          },
          compressionInfo,
        );
        if (progress - lastProgress >= 5 || progress === 100) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          const speed =
            event.loaded > 0 ? ((event.loaded / (1024 * 1024)) / parseFloat(elapsed)).toFixed(2) : '0';
          console.log(
            `📤 [Cloudinary Signed Upload] Progress: ${progress}% (${uploadedMB}MB / ${totalMB}MB) - ${elapsed}s - ${speed}MB/s`,
          );
          lastProgress = progress;
        }
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as Record<string, unknown>);
        } catch {
          reject(new Error('Failed to parse Cloudinary response'));
        }
        return;
      }
      try {
        const errorResponse = JSON.parse(xhr.responseText) as { error?: { message?: string } };
        reject(new Error(errorResponse.error?.message ?? `Upload failed with status ${xhr.status}`));
      } catch {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () =>
      reject(new Error('Network error during Cloudinary upload. Check connection and CORS settings.')),
    );
    xhr.addEventListener('abort', () => reject(new Error('Upload was cancelled')));
    xhr.addEventListener('timeout', () =>
      reject(new Error('Upload timed out. Try a smaller file or a faster connection.')),
    );
    xhr.timeout = 600000;
    xhr.open('POST', uploadUrl);
    xhr.send(formData);
  });
}

/**
 * Compress video using browser's MediaRecorder API
 * Processes video in chunks to prevent memory issues
 */
async function compressVideoClient(
  file: File,
  options: { quality?: number } = {}
): Promise<{ blob: Blob; originalSize: number; compressedSize: number }> {
  const { quality = 0.6 } = options;
  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      try {
        // Calculate dimensions maintaining aspect ratio
        let width = video.videoWidth;
        let height = video.videoHeight;
        const aspectRatio = width / height;

        // Limit to 1280x720 for compression
        const maxWidth = 1280;
        const maxHeight = 720;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            width = maxWidth;
            height = Math.round(maxWidth / aspectRatio);
          } else {
            height = maxHeight;
            width = Math.round(maxHeight * aspectRatio);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // MediaRecorder processes video in chunks, preventing memory issues
        const stream = canvas.captureStream(30); // 30 fps
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: Math.round(quality * 2500000),
        });

        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          URL.revokeObjectURL(url);
          const compressedBlob = new Blob(chunks, { type: 'video/webm' });
          resolve({
            blob: compressedBlob,
            originalSize,
            compressedSize: compressedBlob.size,
          });
        };

        mediaRecorder.onerror = (error) => {
          URL.revokeObjectURL(url);
          reject(new Error(`Compression error: ${error}`));
        };

        video.play();
        mediaRecorder.start();

        const drawFrame = () => {
          if (video.ended || video.paused) {
            mediaRecorder.stop();
            return;
          }
          ctx.drawImage(video, 0, 0, width, height);
          requestAnimationFrame(drawFrame);
        };

        drawFrame();

        video.onended = () => {
          mediaRecorder.stop();
        };
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load video'));
    };

    video.load();
  });
}

/**
 * Upload video directly to Cloudinary with chunked upload support
 * 
 * Features:
 * - File size validation (max 500MB recommended)
 * - Chunked uploads handled automatically by Cloudinary
 * - Progress tracking with XMLHttpRequest
 * - CORS error handling
 * - Retry logic for failed uploads
 */
export async function uploadVideoDirect(
  file: File,
  _moduleId: number,
  _videoType: string,
  options: UploadOptions = {}
): Promise<{ success: boolean; video?: any; error?: string }> {
  const { onProgress, compress = false, quality = 0.6, maxRetries = 3 } = options;
  const fileSizeMB = file.size / 1024 / 1024;

  try {
    requireCloudinaryCloudName();
  } catch (configErr) {
    return {
      success: false,
      error: configErr instanceof Error ? configErr.message : 'Cloudinary configuration error',
    };
  }

  // ✅ Check file size (recommend under 500MB)
  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
  if (file.size > MAX_FILE_SIZE) {
    const errorMsg = `File too large! File size is ${fileSizeMB.toFixed(2)}MB. Maximum allowed size is 500MB. Please compress or split the file before uploading.`;
    console.error('[Cloudinary Direct Upload] ❌ File size validation failed:', {
      fileSize: `${fileSizeMB.toFixed(2)}MB`,
      maxSize: '500MB',
    });
    return {
      success: false,
      error: errorMsg,
    };
  }

  try {
    // Skip client-side compression - upload file directly as-is
    // Cloudinary will handle compression and optimization automatically
    let videoFile = file;
    let compressionInfo = { originalSize: file.size, compressedSize: file.size };

    // Compression is disabled by default - upload file directly
    if (compress && fileSizeMB < 500) {
      onProgress?.({
        stage: 'compressing',
        progress: 0,
        message: `Compressing video (${fileSizeMB.toFixed(2)}MB)...`,
        originalSize: file.size,
      });

      try {
        const compressed = await compressVideoClient(file, { quality });
        videoFile = new File([compressed.blob], file.name.replace(/\.[^/.]+$/, '.webm'), {
          type: 'video/webm',
        });
        compressionInfo = {
          originalSize: compressed.originalSize,
          compressedSize: compressed.compressedSize,
        };

        const reduction = ((1 - compressed.compressedSize / compressed.originalSize) * 100).toFixed(1);
        onProgress?.({
          stage: 'compressing',
          progress: 100,
          message: `Compression complete: ${reduction}% reduction`,
          ...compressionInfo,
        });
      } catch (compressionError) {
        console.warn('Compression failed, using original file:', compressionError);
        // Continue with original file
      }
    }

    onProgress?.({
      stage: 'uploading',
      progress: 0,
      message: 'Preparing direct upload to Cloudinary...',
      ...compressionInfo,
    });

    try {
      if (videoFile.size > 64 * 1024 * 1024) {
        console.log('[Cloudinary Direct Upload] Large file; Cloudinary may use chunked upload:', {
          fileSize: `${(videoFile.size / (1024 * 1024)).toFixed(2)}MB`,
        });
      }

      let result: Record<string, unknown> | null = null;
      let lastAttemptError: Error | null = null;
      const uploadPreset = getUploadPresetOrEmpty();
      const prefersSignedFlow = /signed/i.test(uploadPreset);

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            const waitMs = Math.pow(2, attempt) * 1000;
            onProgress?.({
              stage: 'uploading',
              progress: 0,
              message: `Upload failed, retrying in ${waitMs / 1000}s (${attempt + 1}/${maxRetries})...`,
              ...compressionInfo,
            });
            await new Promise((r) => setTimeout(r, waitMs));
          }

          if (prefersSignedFlow) {
            result = await performSignedVideoUploadXhr(videoFile, {
              compressionInfo,
              onProgress: (p, _ci) => onProgress?.(p),
            });
          } else {
            result = await performUnsignedVideoUploadXhr(videoFile, {
              compressionInfo,
              onProgress: (p, _ci) => onProgress?.(p),
            });
          }
          lastAttemptError = null;
          break;
        } catch (err) {
          lastAttemptError = err instanceof Error ? err : new Error(String(err));
          console.error(
            `[Cloudinary Direct Upload] Attempt ${attempt + 1}/${maxRetries} failed:`,
            lastAttemptError.message,
          );
          if (attempt === maxRetries - 1) {
            throw lastAttemptError;
          }
        }
      }

      if (!result) {
        throw lastAttemptError ?? new Error('Upload failed with no response');
      }

      onProgress?.({
        stage: 'complete',
        progress: 100,
        message: 'Upload complete!',
        ...compressionInfo,
        uploadedBytes: videoFile.size,
        totalBytes: videoFile.size,
      });

      console.log('[Cloudinary Direct Upload] ✓ Upload completed:', {
        publicId: result.public_id,
        preview: result.secure_url ? String(result.secure_url).slice(0, 80) : undefined,
      });

      return {
        success: true,
        video: {
          publicId: (result.public_id as string) || '',
          url: (result.url as string) || (result.secure_url as string) || '',
          secure_url: (result.secure_url as string) || (result.url as string) || '',
          format: result.format,
          duration: result.duration,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          fileName: file.name,
          fileSize: compressionInfo.compressedSize,
        },
      };
    } catch (error) {
      console.error('[Cloudinary Direct Upload] ❌ Upload error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Upload failed';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Handle specific error types
        if (errorMessage.includes('Cannot connect to server') || errorMessage.includes('ERR_CONNECTION_REFUSED')) {
          errorMessage = 'Server connection error: The development server is not running. Please start it with "npm run dev" and try again.';
        } else if (errorMessage.includes('CORS') || errorMessage.includes('Access-Control')) {
          errorMessage = 'CORS error: Please configure Cloudinary CORS settings to allow uploads from your domain.';
        } else if (errorMessage.toLowerCase().includes('cloud_name is disabled')) {
          errorMessage =
            'Cloudinary cloud is disabled or not verified. Open the Cloudinary console, verify your email, and ensure the account is active.';
        } else if (errorMessage.toLowerCase().includes('preset')) {
          errorMessage =
            'Cloudinary preset error. If your preset is signed, keep the *_signed name. If it is unsigned, set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to that unsigned preset name.';
        } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
          errorMessage = 'Network error: Please check your internet connection and ensure the server is running.';
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
