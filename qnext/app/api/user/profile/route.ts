import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/app/lib/db/connection';
import User from '@/app/lib/db/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}


export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' , status: 401 });
    }

    await connectDB();

    // Fetch the user from the database
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' , status: 404 });
    }

    // Format the user data for the response
    const userData = {
      id: (user._id as mongoose.Types.ObjectId).toString(),
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      preferences: user.preferences,
      subscription: user.subscription,
    };

    return NextResponse.json({ data: { user: userData }, status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data: UpdateProfileRequest = await req.json();

    await connectDB();

    const updatedUser = await User.updateProfile(session.user.id, data);

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (updatedUser._id as mongoose.Types.ObjectId).toString(),
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}