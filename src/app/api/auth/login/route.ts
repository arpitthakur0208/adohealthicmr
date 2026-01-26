import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import User from '@/backend/models/User';
import LoginHistory from '@/backend/models/LoginHistory';
import { generateToken } from '@/backend/lib/auth';
import { getRolePermissions, isValidRole } from '@/backend/lib/roles';

/**
 * Login API Endpoint
 * Supports two roles: 'admin' and 'user'
 * 
 * POST /api/auth/login
 * Body: { username: string, password: string }
 * 
 * Returns: { success: true, message: string, user: { id, username, email, role } }
 * Role can be: 'admin' or 'user'
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
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }

    const { username, password } = await request.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { 
          error: 'Username and password are required',
          message: 'Please provide both username and password'
        },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { 
          error: 'Invalid credentials',
          message: 'Username or password is incorrect'
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          error: 'Invalid credentials',
          message: 'Username or password is incorrect'
        },
        { status: 401 }
      );
    }

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
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to login', 
        message: 'An error occurred during login. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
