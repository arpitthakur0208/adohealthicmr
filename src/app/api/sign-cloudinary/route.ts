import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getCloudinaryServerEnv } from '@/lib/cloudinary-env';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const env = getCloudinaryServerEnv();

  if (!env.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Cloudinary env variables missing',
        env: env.envStatus,
        missingVars: env.missingVars,
      },
      { status: 503 },
    );
  }

  const { cloudName, apiKey, apiSecret } = env;

  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const { paramsToSign } = await request.json();

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return NextResponse.json({ ok: true, signature });
  } catch (error) {
    console.error('[sign-cloudinary] SIGN ERROR:', error);
    return NextResponse.json({ ok: false, error: 'Signature failed' }, { status: 500 });
  }
}
