import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Read Cloudinary env from process.env (server-only). Secrets must not use NEXT_PUBLIC_. */
function readCloudinaryEnv() {
  const cloudName =
    (process.env.CLOUDINARY_CLOUD_NAME || '').trim() ||
    (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '').trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();
  return { cloudName, apiKey, apiSecret };
}

function missingVarNames(cloudName: string, apiKey: string, apiSecret: string): string[] {
  const missing: string[] = [];
  if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
  if (!apiKey) missing.push('CLOUDINARY_API_KEY');
  if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');
  return missing;
}

/**
 * Debug: which env vars are present (booleans only — never expose secrets).
 */
export async function GET() {
  const { cloudName, apiKey, apiSecret } = readCloudinaryEnv();
  const ok = !!(cloudName && apiKey && apiSecret);

  return NextResponse.json({
    ok,
    env: {
      cloudName: !!cloudName,
      apiKey: !!apiKey,
      apiSecret: !!apiSecret,
    },
  });
}

export async function POST(req: NextRequest) {
  const { cloudName, apiKey, apiSecret } = readCloudinaryEnv();

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('[cloudinary-signature] Missing env vars', {
      hasCloudName: !!cloudName,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
    });

    return NextResponse.json(
      {
        ok: false,
        error: 'Cloudinary env variables missing',
        message:
          'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local (project root, next to package.json) and restart the dev server.',
        env: {
          cloudName: !!cloudName,
          apiKey: !!apiKey,
          apiSecret: !!apiSecret,
        },
        missingVars: missingVarNames(cloudName, apiKey, apiSecret),
      },
      { status: 503 },
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const folder =
      typeof body?.folder === 'string' && body.folder.trim().length > 0
        ? body.folder.trim()
        : 'adohealthicmr/videos';

    const resource_type = 'video';
    // Must match every non-file param the client sends to Cloudinary (otherwise signature is invalid).
    const format = 'mp4';
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const paramsToSign = { timestamp, folder, resource_type, format };

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

    // cloudName / apiKey are the resolved values used for signing (from CLOUDINARY_* env).
    return NextResponse.json({
      ok: true,
      signature,
      timestamp,
      cloudName,
      apiKey,
      folder,
    });
  } catch (error: unknown) {
    console.error('[cloudinary-signature] Error generating signature', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to generate Cloudinary upload signature',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
