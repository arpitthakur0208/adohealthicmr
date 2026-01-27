import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import User from '@/backend/models/User';
import { generateToken } from '@/backend/lib/auth';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { username, password, email, role } = await request.json();

    // Validation
    if (!username || !password || !email) {
      return NextResponse.json(
        { error: 'Username, password, and email are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      username,
      password,
      email: email.toLowerCase().trim(),
      role: role || 'user',
    });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
