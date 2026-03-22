import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';
export const runtime = "nodejs";

export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return NextResponse.json({
    ok: !!cloudName && !!apiKey && !!apiSecret,
    env: {
      cloudName: cloudName ? "OK" : "MISSING",
      key: apiKey ? "OK" : "MISSING",
      secret: apiSecret ? "OK" : "MISSING",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Only server-side env access here (safe).
    // Cloud name is used by both frontend and backend; some setups only provide the NEXT_PUBLIC_* variant.
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Debug env loading (masked) to verify server has access to required variables.
    console.log('[cloudinary-signature] env check', {
      cloud: process.env.CLOUDINARY_CLOUD_NAME,
      key: apiKey ? "OK" : "MISSING",
      secret: apiSecret ? "OK" : "MISSING",
    });

    if (!cloudName || !apiKey || !apiSecret) {
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

    const body = await req.json().catch(() => ({}));
    const folder =
      typeof body?.folder === 'string' && body.folder.trim().length > 0
        ? body.folder.trim()
        : 'adohealthicmr/videos';

    const resource_type = 'video';
    const timestamp = Math.floor(Date.now() / 1000).toString(); // Cloudinary expects seconds

    // Sign params must match exactly what the client sends in FormData.
    const paramsToSign = { timestamp, folder, resource_type };

    // Configure Cloudinary (useful for utils consistency; doesn't leak secrets to client).
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

