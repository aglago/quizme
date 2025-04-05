// app/api/documents/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { uploadFile } from '@/app/lib/firebase/admin';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Allowed types: PDF, DOCX, DOC, TXT'
      }, { status: 400 });
    }
    
    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to Firebase Storage using Admin SDK
    const filePath = await uploadFile(
      session.user.id,
      fileBuffer,
      file.name,
      file.type
    );
    
    // Determine file type for database
    let fileType = 'pdf';
    if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      fileType = 'docx';
    } else if (file.name.endsWith('.txt')) {
      fileType = 'txt';
    }
    
    // Return the file path
    return NextResponse.json({ 
      filePath,
      fileType,
    }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}