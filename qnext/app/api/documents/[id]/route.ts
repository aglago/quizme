// app/api/documents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/app/lib/db/connection';
import Document from '@/app/lib/db/models/Document';
import { deleteFile } from '@/app/lib/firebase/admin';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

export async function DELETE(
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
    
    // Find the document (ensuring it belongs to the user)
    const doc = await Document.findOne({
      _id: new mongoose.Types.ObjectId(documentId),
      userId: new mongoose.Types.ObjectId(session.user.id)
    });
    
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    // Delete the file from Firebase Storage
    await deleteFile(doc.fileUrl);
    
    // Delete the document from the database
    await Document.deleteOne({ _id: new mongoose.Types.ObjectId(documentId) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}