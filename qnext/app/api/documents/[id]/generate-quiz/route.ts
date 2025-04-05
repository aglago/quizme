// app/api/documents/[id]/generate-quiz/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import connectDB from '@/app/lib/db/connection';

import { generateQuestions } from '@/app/lib/ai/openai';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Question, Quiz as QuizType } from '@/app/types';
import Document from '@/app/lib/db/models/Document';
import Quiz from '@/app/lib/db/models/Quiz';

interface GenerateQuizRequest {
  title: string;
  description?: string;
  numQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes: Array<'multiple-choice' | 'true-false' | 'short-answer'>;
}

export async function POST(
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
    
    const data: GenerateQuizRequest = await req.json();
    
    // Validate required fields
    if (!data.title || !data.numQuestions || !data.difficulty || !data.questionTypes || data.questionTypes.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    await connectDB();
    
    // Find the document
    const document = await Document.findOne({
      _id: new mongoose.Types.ObjectId(documentId),
      userId: new mongoose.Types.ObjectId(session.user.id),
    });
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    // Check if document has extracted text
    if (!document.extractedText) {
      return NextResponse.json({ error: 'Document has no extracted text' }, { status: 400 });
    }
    
    // Generate questions using OpenAI
    const questions = await generateQuestions(document.extractedText, {
      numQuestions: data.numQuestions,
      difficulty: data.difficulty,
      questionTypes: data.questionTypes,
    });
    
    // Create quiz in database
    const quiz = new Quiz({
      userId: new mongoose.Types.ObjectId(session.user.id),
      documentId: new mongoose.Types.ObjectId(documentId),
      title: data.title,
      description: data.description || '',
      createdAt: new Date(),
      questions,
    });
    
    await quiz.save();
    
    // Format response
    const quizResponse: QuizType = {
      _id: (quiz._id as mongoose.Types.ObjectId).toString(),
      userId: quiz.userId.toString(),
      documentId: quiz.documentId.toString(),
      title: quiz.title,
      description: quiz.description,
      createdAt: quiz.createdAt.toISOString(),
      questions: quiz.questions.map((q: Question) => ({
        questionId: q.questionId,
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        topic: q.topic || '',
      })),
    };
    
    return NextResponse.json(quizResponse, { status: 201 });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}