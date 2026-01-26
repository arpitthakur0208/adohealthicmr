import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import User from '@/backend/models/User';
import OTP from '@/backend/models/OTP';
import LoginHistory from '@/backend/models/LoginHistory';
import { generateToken } from '@/backend/lib/auth';
import { getRolePermissions, isValidRole } from '@/backend/lib/roles';

/**
 * Verify OTP API Endpoint
 * 
 * POST /api/auth/verify-otp
 * Body: { email: string, username: string, otp: string }
 * 
 * Returns: { success: true, message: string, user: { id, username, email, role } }
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

    const { email, username, otp } = await request.json();

    // Validation
    if (!otp) {
      return NextResponse.json(
        { 
          error: 'OTP is required',
          message: 'Please provide the OTP sent to your email'
        },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { 
          error: 'Invalid credentials',
          message: 'Invalid email/username or OTP'
        },
        { status: 401 }
      );
    }

    // Get user's email
    const userEmail = user.email.toLowerCase().trim();

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      email: userEmail,
      otp: otp.trim(),
      expiresAt: { $gt: new Date() }, // Not expired
    });

    if (!otpRecord) {
      return NextResponse.json(
        { 
          error: 'Invalid or expired OTP',
          message: 'The OTP you entered is invalid or has expired. Please request a new one.'
        },
        { status: 401 }
      );
    }

    // Delete the used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Validate role (must be 'admin' or 'user')
    if (!isValidRole(user.role)) {
      return NextResponse.json(
        { 
          error: 'Invalid user role',
          message: 'User has an invalid role. Contact administrator.'
        },
        { status: 403 }
      );
    }

    // Get role-specific permissions
    const permissions = getRolePermissions(user.role);

    // Generate JWT token with user information
    let token: string;
    try {
      token = generateToken({
        userId: user._id.toString(),
        username: user.username,
        role: user.role,
      });
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return NextResponse.json(
        { 
          error: 'Token generation failed',
          message: 'An error occurred while generating authentication token.',
          details: tokenError instanceof Error ? tokenError.message : 'Unknown token error'
        },
        { status: 500 }
      );
    }

    // Determine role-specific message
    const roleMessage = user.role === 'admin' 
      ? 'Admin login successful' 
      : 'User login successful';

    // Create response with user data and permissions
    const response = NextResponse.json(
      {
        success: true,
        message: roleMessage,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role, // 'admin' or 'user'
        },
        permissions: {
          ...permissions,
          isAdmin: user.role === 'admin',
          isUser: user.role === 'user',
        },
      },
      { status: 200 }
    );

    // Set HTTP-only cookie for security
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Save login history (don't block response if this fails)
    try {
      const ipAddress = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';

      await LoginHistory.create({
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        loginAt: new Date(),
        ipAddress: ipAddress.split(',')[0].trim(), // Get first IP if multiple
        userAgent: userAgent.substring(0, 500), // Limit length
      });
    } catch (historyError) {
      // Log error but don't fail the login
      console.error('Error saving login history:', historyError);
    }

    return response;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to verify OTP', 
        message: 'An error occurred during OTP verification. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
