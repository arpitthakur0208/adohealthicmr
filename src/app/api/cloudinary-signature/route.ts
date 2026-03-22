import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getCloudinaryServerEnv } from '@/lib/cloudinary-env';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Debug: which env vars are present (booleans only — never expose secrets).
 */
export async function GET() {
  const { ok, envStatus } = getCloudinaryServerEnv();

  return NextResponse.json({
    ok,
    env: {
      cloudName: envStatus.cloudName,
      apiKey: envStatus.apiKey,
      apiSecret: envStatus.apiSecret,
    },
  });
}

export async function POST(req: NextRequest) {
  const env = getCloudinaryServerEnv();

  if (!env.ok) {
    console.error('[cloudinary-signature] Missing env vars', {
      missingVars: env.missingVars,
      envStatus: env.envStatus,
    });

    return NextResponse.json(
      {
        error: 'Cloudinary config missing on server',
        message:
          'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local (project root) and restart the dev server.',
        missing: env.missing,
        missingVars: env.missingVars,
      },
      { status: 500 },
    );
  }

  const { cloudName, apiKey, apiSecret } = env;

  try {
    const body = await req.json().catch(() => ({}));
    const folder =
      typeof body?.folder === 'string' && body.folder.trim().length > 0
        ? body.folder.trim()
        : 'adohealthicmr/videos';

    const resource_type = 'video';
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const paramsToSign = { timestamp, folder, resource_type };

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    console.log('[cloudinary-signature] Generating signature', {
      cloudName,
      apiKeyPrefix: apiKey.slice(0, 6) + '...',
      folder,
      timestamp,
      paramsKeys: Object.keys(paramsToSign),
    });

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return NextResponse.json({
      timestamp,
      signature,
      apiKey,
      cloudName,
      folder,
    });
  } catch (error: unknown) {
    console.error('[cloudinary-signature] Error generating signature', error);
    return NextResponse.json(
      {
        error: 'Failed to generate Cloudinary upload signature',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
