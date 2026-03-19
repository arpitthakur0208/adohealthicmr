import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST() {
  try {
    const timestamp = Math.floor(Date.now() / 1000);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // 🚨 Debug log (IMPORTANT)
    console.log("ENV CHECK:", {
      cloudName,
      apiKey,
      apiSecret: apiSecret ? "FOUND" : "MISSING"
    });

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Missing environment variables" },
        { status: 500 }
      );
    }

    const signature = crypto
      .createHash('sha1')
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest('hex');

    return NextResponse.json({
      timestamp,
      signature,
      apiKey,
      cloudName,
    });

  } catch (error) {
    console.error("SIGNATURE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate Cloudinary signature" },
      { status: 500 }
    );
  }
}