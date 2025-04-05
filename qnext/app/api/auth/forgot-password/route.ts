// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/connection';
import User from '@/app/lib/db/models/User';
import { sendEmail } from '@/app/lib/utils/email';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate reset token
    const resetToken = await User.resetPasswordRequest(email);

    // For security, don't reveal if the email exists or not
    // Always return success regardless of whether the email was found

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    if (resetToken) {
      await sendEmail({
        to: email,
        subject: 'Reset your QuizMe password',
        text: `Please use the following link to reset your password: ${resetUrl}`,
        html: `<p>Please use the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      });
    }

    return NextResponse.json(
      { success: true, message: 'If an account with that email exists, a password reset link has been sent' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}