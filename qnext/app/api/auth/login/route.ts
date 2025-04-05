// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/connection';
import User from '@/app/lib/db/models/User';
import mongoose from 'mongoose';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by credentials (this uses our custom User model method)
    const user = await User.findByCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Record login time
    await User.recordLogin((user._id as mongoose.Types.ObjectId).toString());

    // Prepare user data for response (without sensitive info)
    const userData = {
      id: (user._id as mongoose.Types.ObjectId).toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      preferences: user.preferences,
      subscription: {
        plan: user.subscription.plan,
      },
    };

    // NextAuth will handle the actual session creation and JWT,
    // but we can return user data for client-side use if needed
    return NextResponse.json(
      {
        success: true,
        user: userData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}