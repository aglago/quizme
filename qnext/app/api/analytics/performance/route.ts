// app/api/analytics/performance/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/app/lib/db/connection';
import Performance from '@/app/lib/db/models/Performance';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get or create performance data for the user
    let performance = await Performance.findOne({ userId: new mongoose.Types.ObjectId(session.user.id) });
    
    if (!performance) {
      performance = new Performance({ userId: new mongoose.Types.ObjectId(session.user.id) });
      await performance.save();
    }

    // Format the performance data for the response
    const formattedPerformance = {
      _id: (performance._id as mongoose.Types.ObjectId).toString(),
      userId: performance.userId.toString(),
      quizResults: performance.quizResults.map(result => ({
        quizId: result.quizId.toString(),
        date: result.date.toISOString(),
        score: result.score,
        timeSpent: result.timeSpent,
        questionResults: result.questionResults.map(q => ({
          questionId: q.questionId,
          correct: q.correct,
          timeSpent: q.timeSpent,
        })),
      })),
      topicMastery: performance.topicMastery.map(topic => ({
        topic: topic.topic,
        strength: topic.strength,
        lastPracticed: topic.lastPracticed.toISOString(),
      })),
      studyTime: {
        daily: performance.studyTime.daily.map(day => ({
          date: day.date.toISOString(),
          minutes: day.minutes,
        })),
        totalHours: performance.studyTime.totalHours,
      },
    };

    return NextResponse.json({ data: formattedPerformance, status: 200 });
  } catch (error) {
    console.error('Error fetching performance data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}