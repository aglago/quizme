// app/api/quizzes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import connectDB from '@/app/lib/db/connection';
import Quiz from '@/app/lib/db/models/Quiz';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Quiz as QuizType, ApiResponse } from '@/app/types';

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<QuizType[]>>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const quizzes = await Quiz.find({ userId: new mongoose.Types.ObjectId(session.user.id) });

    const formattedQuizzes = quizzes.map(quiz => ({
      _id: quiz._id.toString(),
      userId: quiz.userId.toString(),
      documentId: quiz.documentId.toString(),
      title: quiz.title,
      description: quiz.description,
      createdAt: quiz.createdAt.toISOString(),
      questions: quiz.questions.map(q => ({
        questionId: q.questionId,
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        topic: q.topic || '',
      })),
    }));

    return NextResponse.json({ data: formattedQuizzes, status: 200 });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}