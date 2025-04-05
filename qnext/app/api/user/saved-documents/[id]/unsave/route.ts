// app/api/documents/[id]/unsave/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import connectDB from '@/app/lib/db/connection';
import User from '@/app/lib/db/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documentId = params.id;

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 });
    }

    await connectDB();

    // Unsave the document from the user's saved documents
    const user = await User.unsaveDocument(session.user.id, documentId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Document unsaved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error unsaving document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}