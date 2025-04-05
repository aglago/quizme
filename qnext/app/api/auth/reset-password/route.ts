// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/connection';
import User from '@/app/lib/db/models/User';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Reset the password
    const success = await User.resetPassword(token, password);

    if (!success) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Password has been reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}