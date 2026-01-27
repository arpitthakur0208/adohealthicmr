import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    // Verify user still exists (database connection will be handled by mongoose)
    // Note: This assumes the database is already connected, which is done in route handlers
    try {
      const user = await User.findById(payload.userId);
      if (!user) {
        return null;
      }
    } catch (dbError) {
      // If database is not connected, just return the payload (token is valid)
      // The route handler will handle database connection
      console.warn('Database not connected in getCurrentUser, skipping user verification:', dbError);
    }

    return payload;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export function requireAuth(
  handler: (req: NextRequest, user: JWTPayload, context?: any) => Promise<Response>
) {
  return async (req: NextRequest, context?: any) => {
    // Connect to database first
    const connectDB = (await import('@/lib/db')).default;
    await connectDB();
    
    const user = await getCurrentUser(req);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return handler(req, user, context);
  };
}

export function requireAdmin(
  handler: (req: NextRequest, user: JWTPayload, context?: any) => Promise<Response>
) {
  return async (req: NextRequest, context?: any) => {
    // Connect to database first
    const connectDB = (await import('@/lib/db')).default;
    await connectDB();
    
    const user = await getCurrentUser(req);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (user.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return handler(req, user, context);
  };
}
