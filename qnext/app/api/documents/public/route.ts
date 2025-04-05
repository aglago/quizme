// app/api/documents/public/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/connection';
import Document from '@/app/lib/db/models/Document';
import { Document as DocumentType, ApiResponse } from '@/app/types';

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<DocumentType[]>>> {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || '';

    await connectDB();

    let query: any = { isPublic: true };
    if (filter) {
      query.tags = filter;
    }

    const documents = await Document.find(query);

    const formattedDocuments = documents.map(doc => ({
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      description: doc.description,
      fileUrl: doc.fileUrl,
      fileType: doc.fileType,
      uploadDate: doc.uploadDate.toISOString(),
      tags: doc.tags,
      isPublic: doc.isPublic,
      highlights: doc.highlights || [],
      extractedText: doc.extractedText,
    }));

    return NextResponse.json({ data: formattedDocuments, status: 200 });
  } catch (error) {
    console.error('Error fetching public documents:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}