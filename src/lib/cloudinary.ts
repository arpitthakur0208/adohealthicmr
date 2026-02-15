import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  resource_type: string;
}

export interface CloudinaryVideoUploadResult extends CloudinaryUploadResult {
  duration?: number;
  playback_url?: string;
}

/**
 * Upload an image to Cloudinary
 */
export async function uploadImage(
  file: Buffer | string,
  folder: string = 'adohealthicmr'
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: 'image' as const,
    };

    if (typeof file === 'string' && file.startsWith('data:')) {
      // Base64 string
      cloudinary.uploader.upload(file, uploadOptions, (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result as CloudinaryUploadResult);
        }
      });
    } else if (Buffer.isBuffer(file)) {
      // Buffer
      cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result as CloudinaryUploadResult);
        }
      }).end(file);
    } else {
      reject(new Error('Invalid file format. Expected base64 string or Buffer.'));
    }
  });
}

/**
 * Upload a video to Cloudinary
 */
export async function uploadVideo(
  file: Buffer | string,
  folder: string = 'adohealthicmr/videos'
): Promise<CloudinaryVideoUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: 'video' as const,
      chunk_size: 6000000, // 6MB chunks for large video uploads
      eager: [
        { streaming_profile: 'hd', format: 'm3u8' }
      ],
    };

    if (typeof file === 'string' && file.startsWith('data:')) {
      // Base64 string
      cloudinary.uploader.upload(file, uploadOptions, (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result as CloudinaryVideoUploadResult);
        }
      });
    } else if (Buffer.isBuffer(file)) {
      // Buffer
      cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result as CloudinaryVideoUploadResult);
        }
      }).end(file);
    } else {
      reject(new Error('Invalid file format. Expected base64 string or Buffer.'));
    }
  });
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFile(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Get a optimized URL for images
 */
export function getOptimizedImageUrl(publicId: string, width?: number, height?: number): string {
  const transformations: string[] = ['f_auto', 'q_auto'];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  
  return cloudinary.url(publicId, {
    transformation: [transformations.join(',')],
    secure: true,
  });
}

/**
 * Get video thumbnail URL
 */
export function getVideoThumbnail(publicId: string, width: number = 640, height: number = 360): string {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [
      { width, height, crop: 'fill' },
      { format: 'jpg' }
    ],
    secure: true,
  });
}

export default cloudinary;
