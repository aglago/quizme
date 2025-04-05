// app/api/user/saved-documents/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/app/lib/db/connection';
import User from '@/app/lib/db/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { log } from 'node:console';

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Find the user and populate their savedDocuments
    const user = await User.findById(session.user.id).populate({
      path: 'savedDocuments',
      model: 'Document',
      options: { strictPopulate: false }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }    

    // Map the saved documents to the desired format
    const savedDocuments = user.savedDocuments.map((doc: any) => ({
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      description: doc.description,
      fileUrl: doc.fileUrl,
      fileType: doc.fileType,
      uploadDate: doc.uploadDate.toString(),
      tags: doc.tags,
      isPublic: doc.isPublic,
      isSaved: true,
    }));

    return NextResponse.json({ data: savedDocuments, status: 200 });
  } catch (error) {
    console.error('Error fetching saved documents:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}