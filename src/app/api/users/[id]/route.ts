import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import User from '@/backend/models/User';
import { requireAdmin, getCurrentUser } from '@/backend/lib/auth';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

// GET single user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Users can only view their own profile, admins can view any profile
    const userId = params.id;
    if (currentUser.role !== 'admin' && currentUser.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - You can only view your own profile' },
        { status: 403 }
      );
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT update user (Admin only, or user updating their own profile)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = params.id;
    const { username, email, role, password } = await request.json();

    // Users can only update their own profile (except role), admins can update any profile
    if (currentUser.role !== 'admin' && currentUser.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - You can only update your own profile' },
        { status: 403 }
      );
    }

    // Only admins can change roles
    if (role && currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can change user roles' },
        { status: 403 }
      );
    }

    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role && currentUser.role === 'admin') updateData.role = role;
    if (password) updateData.password = password;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE user (Admin only)
export const DELETE = requireAdmin(async (
  request: NextRequest,
  user,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    const userId = params.id;

    // Prevent admin from deleting themselves
    if (user.userId === userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});
