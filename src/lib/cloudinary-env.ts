/**
 * Server-only Cloudinary environment validation.
 * - Secrets must be CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET (never NEXT_PUBLIC_*).
 * - Cloud name: CLOUDINARY_CLOUD_NAME preferred; NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME optional fallback for legacy setups.
 */

export type CloudinaryEnvStatus = {
  cloudName: boolean;
  apiKey: boolean;
  apiSecret: boolean;
};

export function getCloudinaryServerEnv(): {
  ok: boolean;
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  missingVars: string[];
  envStatus: CloudinaryEnvStatus;
  /** Boolean map for API responses (backwards compatible) */
  missing: Record<string, boolean>;
} {
  const cloudName =
    (process.env.CLOUDINARY_CLOUD_NAME || '').trim() ||
    (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '').trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

  const missingVars: string[] = [];
  if (!cloudName) missingVars.push('CLOUDINARY_CLOUD_NAME');
  if (!apiKey) missingVars.push('CLOUDINARY_API_KEY');
  if (!apiSecret) missingVars.push('CLOUDINARY_API_SECRET');

  const envStatus: CloudinaryEnvStatus = {
    cloudName: !!cloudName,
    apiKey: !!apiKey,
    apiSecret: !!apiSecret,
  };

  const missing: Record<string, boolean> = {
    CLOUDINARY_CLOUD_NAME: !cloudName,
    CLOUDINARY_API_KEY: !apiKey,
    CLOUDINARY_API_SECRET: !apiSecret,
  };

  return {
    ok: missingVars.length === 0,
    cloudName,
    apiKey,
    apiSecret,
    missingVars,
    envStatus,
    missing,
  };
}
