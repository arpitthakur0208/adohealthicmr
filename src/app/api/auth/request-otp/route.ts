import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import User from '@/backend/models/User';
import OTP from '@/backend/models/OTP';
import { sendOTPEmail } from '@/backend/lib/email';

/**
 * Request OTP API Endpoint
 * 
 * POST /api/auth/request-otp
 * Body: { email: string, username: string }
 * 
 * Returns: { success: true, message: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          message: 'Unable to connect to database. Please check your MongoDB connection.',
        },
        { status: 500 }
      );
    }

    const { email, username } = await request.json();

    // Validation - must provide both email and username
    if (!email || !username) {
      return NextResponse.json(
        { 
          error: 'Email and username are required',
          message: 'Please provide both your email address and username'
        },
        { status: 400 }
      );
    }

    // Find user by both email and username to ensure they match
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      username: username.trim()
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { 
          success: true,
          message: 'If an account exists with this email and username, an OTP has been sent.'
        },
        { status: 200 }
      );
    }

    // Get user's email
    const userEmail = user.email.toLowerCase().trim();

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email: userEmail });

    // Create new OTP record
    await OTP.create({
      email: userEmail,
      otp: otpCode,
      expiresAt: expiresAt,
    });

    // Send OTP email
    const emailSent = await sendOTPEmail({
      to: userEmail,
      otp: otpCode,
    });

    // Check if email service is configured
    const web3formsAccessKey = process.env.WEB3FORMS_ACCESS_KEY;
    const isEmailConfigured = web3formsAccessKey && 
                              web3formsAccessKey !== 'YOUR_ACCESS_KEY_HERE' && 
                              web3formsAccessKey !== 'your-web3forms-access-key-here';

    if (!emailSent && isEmailConfigured) {
      console.error('\n❌ Failed to send OTP email to:', userEmail);
      console.error('📧 OTP Code (for manual testing):', otpCode);
      console.error('⚠️  Check Web3Forms configuration or consider using a different email service.\n');
      // Still return success to not reveal if email service failed, but log for debugging
    } else if (!isEmailConfigured) {
      console.log('\n=== OTP CODE (Email service not configured) ===');
      console.log('📧 Email:', userEmail);
      console.log('🔑 OTP Code:', otpCode);
      console.log('===============================================');
      console.log('⚠️  To enable email sending:');
      console.log('1. Go to https://web3forms.com');
      console.log('2. Get your free access key');
      console.log('3. Add WEB3FORMS_ACCESS_KEY=your_key_here to .env.local');
      console.log('4. Restart your development server (Ctrl+C then npm run dev)');
      console.log('\n💡 For now, use the OTP code shown above to login.\n');
    }

    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists with this email/username, an OTP has been sent to your email.',
        ...(process.env.NODE_ENV === 'development' && !isEmailConfigured && {
          debug: {
            otp: otpCode,
            note: 'Email service not configured. Check server console for OTP code.',
          },
        }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Request OTP error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to request OTP', 
        message: 'An error occurred while requesting OTP. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
