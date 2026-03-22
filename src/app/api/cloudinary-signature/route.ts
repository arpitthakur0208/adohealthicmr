import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ✅ Clean env reader (NO fallback, NO bugs)
function readCloudinaryEnv() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    apiKey: process.env.CLOUDINARY_API_KEY?.trim(),
    apiSecret: process.env.CLOUDINARY_API_SECRET?.trim(),
  };
}

// ✅ Debug endpoint (safe)
export async function GET() {
  const { cloudName, apiKey, apiSecret } = readCloudinaryEnv();

  return NextResponse.json({
    ok: !!(cloudName && apiKey && apiSecret),
    env: {
      cloudName: !!cloudName,
      apiKey: !!apiKey,
      apiSecret: !!apiSecret,
    },
  });
}

// ✅ Signature generator
export async function POST(req: NextRequest) {
  const { cloudName, apiKey, apiSecret } = readCloudinaryEnv();

  // 🔴 Validation
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Cloudinary env variables missing',
        env: {
          cloudName: !!cloudName,
          apiKey: !!apiKey,
          apiSecret: !!apiSecret,
        },
      },
      { status: 500 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));

    const folder =
      typeof body?.folder === 'string' && body.folder.trim()
        ? body.folder.trim()
        : 'adohealthicmr/videos';

    // Must match upload FormData exactly (only signed params: timestamp + folder).
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      timestamp,
      folder,
    };

    // ✅ Cloudinary config
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );

    return NextResponse.json({
      ok: true,
      signature,
      timestamp,
      cloudName,
      apiKey,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to generate signature',
        details: error.message,
      },
      { status: 500 }
    );
  }
}