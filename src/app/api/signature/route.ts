import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getCloudinaryServerEnv } from '@/lib/cloudinary-env';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Legacy endpoint — same env + signing logic as /api/cloudinary-signature
export async function POST(req: NextRequest) {
  const env = getCloudinaryServerEnv();

  if (!env.ok) {
    console.error('[api/signature] Missing env vars', {
      missingVars: env.missingVars,
    });

    return NextResponse.json(
      {
        ok: false,
        error: 'Cloudinary env variables missing',
        message:
          'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local (project root) and restart.',
        env: env.envStatus,
        missingVars: env.missingVars,
      },
      { status: 503 },
    );
  }

  const { cloudName, apiKey, apiSecret } = env;

  try {
    const body = await req.json().catch(() => ({}));
    const folder =
      typeof body?.folder === 'string' && body.folder.trim().length > 0
        ? body.folder
        : 'adohealthicmr/videos';

    const resource_type = 'video';
    const format = 'mp4';
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const paramsToSign = { timestamp, folder, resource_type, format };

    console.log('[api/signature] Generating signature', {
      cloudName,
      apiKeyPrefix: apiKey.slice(0, 6) + '...',
      folder,
      timestamp,
      paramsKeys: Object.keys(paramsToSign),
    });

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return NextResponse.json({
      ok: true,
      timestamp,
      signature,
      cloudName,
      apiKey,
      folder,
    });
  } catch (error: unknown) {
    console.error('[api/signature] Error generating signature', error);
    return NextResponse.json(
      {
        error: 'Failed to generate signature',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
