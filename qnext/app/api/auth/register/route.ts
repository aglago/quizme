// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/connection';
import User from '@/app/lib/db/models/User';
import mongoose from 'mongoose';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { firstName, lastName, email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.createUser({
      email,
      password,
      firstName,
      lastName,
    });

    // Return success without sensitive information
    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user._id as mongoose.Types.ObjectId).toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user account' },
      { status: 500 }
    );
  }
}