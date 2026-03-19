import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function getSignatureSha1(params: Record<string, string>, apiSecret: string) {
  const sortedKeys = Object.keys(params).sort();
  const unsigned = sortedKeys
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  return crypto.createHash('sha1').update(`${unsigned}${apiSecret}`).digest('hex');
}

export async function POST(req: NextRequest) {
  // Only server-side env access here (safe).
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    // Server-side logs only (no secrets in response)
    console.error('[cloudinary-signature] Missing env vars', {
      hasCloudName: !!cloudName,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
    });

    return NextResponse.json(
      {
        error: 'Cloudinary config missing on server',
        missing: {
          CLOUDINARY_CLOUD_NAME: !cloudName,
          CLOUDINARY_API_KEY: !apiKey,
          CLOUDINARY_API_SECRET: !apiSecret,
        },
      },
      { status: 500 },
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const folder =
      typeof body?.folder === 'string' && body.folder.trim().length > 0
        ? body.folder
        : 'adohealthicmr/videos';

    const timestamp = Math.round(Date.now() / 1000).toString();

    // Cloudinary signed upload signature inputs.
    // NOTE: This matches the params used by Cloudinary for signed uploads.
    const params: Record<string, string> = {
      timestamp,
      folder,
      resource_type: 'video',
    };

    // Debug logging (no secrets)
    console.log('[cloudinary-signature] Generating signature', {
      cloudName,
      apiKeyPrefix: apiKey.slice(0, 6) + '...',
      folder,
      timestamp,
      paramsKeys: Object.keys(params),
    });

    const signature = getSignatureSha1(params, apiSecret);

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
      { error: 'Failed to generate signature' },
      { status: 500 },
    );
  }
}

