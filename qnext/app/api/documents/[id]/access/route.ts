// app/api/documents/[id]/access/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/app/lib/db/connection';
import Document from '@/app/lib/db/models/Document';
import { getSignedUrl } from '@/app/lib/firebase/admin';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
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
    
    // Find the document
    const doc = await Document.findOne({
      _id: new mongoose.Types.ObjectId(documentId),
      $or: [
        { userId: new mongoose.Types.ObjectId(session.user.id) },
        { isPublic: true }
      ]
    });
    
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    // Get a signed URL for the file (temporary access)
    const signedUrl = await getSignedUrl(doc.fileUrl);
    
    return NextResponse.json({ 
      url: signedUrl,
      expiresIn: 900 // 15 minutes in seconds
    });
  } catch (error) {
    console.error('Error generating document access URL:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}