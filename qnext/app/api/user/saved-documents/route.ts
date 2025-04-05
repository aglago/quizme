import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import connectDB from '@/app/lib/db/connection';
import User, { IUser } from '@/app/lib/db/models/User';
import DocumentModel, { IDocument } from '@/app/lib/db/models/Document';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Document as DocumentType, ApiResponse } from '@/app/types';

interface IPopulatedUser extends Omit<IUser, 'savedDocuments'> {
  savedDocuments: IDocument[];
}

export async function GET(): Promise<NextResponse<ApiResponse<DocumentType[]>>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized', status: 401 }, { status: 401 });
    }

    await connectDB();

    // Find the user and populate their savedDocuments
    const user = await User.findById(session.user.id).populate({
      path: 'savedDocuments',
      model: DocumentModel,
    }) as unknown as IPopulatedUser;

    if (!user) {
      return NextResponse.json({ error: 'User not found', status: 404 }, { status: 404 });
    }

    // Map the saved documents to the desired format
    const savedDocuments = user.savedDocuments.map((doc): DocumentType => ({
      _id: (doc._id as mongoose.Types.ObjectId).toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      description: doc.description,
      fileUrl: doc.fileUrl,
      fileType: doc.fileType,
      uploadDate: doc.uploadDate.toString(),
      tags: doc.tags,
      isPublic: doc.isPublic,
      isSaved: true,
      highlights: doc.highlights,
      extractedText: doc.extractedText,
    }));

    return NextResponse.json({ data: savedDocuments, status: 200 }, { status: 200 });
  } catch (error) {
    console.error('Error fetching saved documents:', error);
    return NextResponse.json({ error: 'Internal Server Error', status: 500 }, { status: 500 });
  }
}