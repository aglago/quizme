// app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/app/lib/db/connection';
import Document from '@/app/lib/db/models/Document';
import { authOptions } from '../auth/[...nextauth]/route';
import { Document as DocumentType, ApiResponse } from '@/app/types';
import mongoose from 'mongoose';

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<DocumentType[]>>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Unauthorized', 
        status: 401 
      }, { status: 401 });
    }
    
    await connectDB();
    
    const documents = await Document.find({ 
      userId: new mongoose.Types.ObjectId(session.user.id) 
    });
    
    return NextResponse.json({ 
      data: documents.map((doc: Document) => ({
        _id: doc._id.toString(),
        userId: doc.userId.toString(),
        title: doc.title,
        description: doc.description,
        fileUrl: doc.fileUrl,
        fileType: doc.fileType,
        uploadDate: doc.uploadDate.toISOString(),
        tags: doc.tags,
        isPublic: doc.isPublic,
        highlights: doc.highlights,
        extractedText: doc.extractedText,
      })),
      status: 200 
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      status: 500 
    }, { status: 500 });
  }
}

interface CreateDocumentRequest {
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  tags?: string[];
  isPublic?: boolean;
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<DocumentType>>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Unauthorized', 
        status: 401 
      }, { status: 401 });
    }
    
    const data: CreateDocumentRequest = await req.json();
    
    // Validate required fields
    if (!data.title || !data.fileUrl || !data.fileType) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        status: 400 
      }, { status: 400 });
    }
    
    await connectDB();
    
    const newDocument = new Document({
      userId: new mongoose.Types.ObjectId(session.user.id),
      title: data.title,
      description: data.description || '',
      fileUrl: data.fileUrl,
      fileType: data.fileType,
      uploadDate: new Date(),
      tags: data.tags || [],
      isPublic: data.isPublic || false,
      highlights: [],
    });
    
    await newDocument.save();
    
    return NextResponse.json({ 
      data: {
        _id: newDocument._id.toString(),
        userId: newDocument.userId.toString(),
        title: newDocument.title,
        description: newDocument.description,
        fileUrl: newDocument.fileUrl,
        fileType: newDocument.fileType,
        uploadDate: newDocument.uploadDate.toISOString(),
        tags: newDocument.tags,
        isPublic: newDocument.isPublic,
        highlights: newDocument.highlights,
        extractedText: newDocument.extractedText,
      },
      status: 201 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      status: 500 
    }, { status: 500 });
  }
}