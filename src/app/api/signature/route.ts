import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Legacy endpoint kept for backward compatibility.
// If anything still calls /api/signature, it will now behave consistently with /api/cloudinary-signature.
export async function POST(req: NextRequest) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('[cloudinary-signature (legacy)] Missing env vars', {
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

    const resource_type = 'video';
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const paramsToSign = { timestamp, folder, resource_type };

    // Debug logging only (no secrets)
    console.log('[cloudinary-signature (legacy)] Generating signature', {
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
      timestamp,
      signature,
      cloudName,
      apiKey,
      folder,
    });
  } catch (error: unknown) {
    console.error('[cloudinary-signature (legacy)] Error generating signature', error);
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}