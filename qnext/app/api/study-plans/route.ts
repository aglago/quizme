// app/api/study-plans/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import connectDB from '@/app/lib/db/connection';
import StudyPlan from '@/app/lib/db/models/StudyPlan';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const studyPlans = await StudyPlan.find({ userId: new mongoose.Types.ObjectId(session.user.id) });

    const formattedStudyPlans = studyPlans.map(plan => ({
      _id: (plan._id as mongoose.Types.ObjectId).toString(),
      userId: plan.userId.toString(),
      title: plan.title,
      targetDate: plan.targetDate.toISOString(),
      createdAt: plan.createdAt.toISOString(),
      documents: plan.documents.map(doc => doc.toString()),
      sessions: plan.sessions.map(session => ({
        date: session.date.toISOString(),
        duration: session.duration,
        topics: session.topics,
        completed: session.completed,
        activities: session.activities.map(activity => ({
          type: activity.type,
          resourceId: activity.resourceId.toString(),
          duration: activity.duration,
          completed: activity.completed,
        })),
      })),
      progress: plan.progress,
    }));

    return NextResponse.json({ data: formattedStudyPlans, status: 200 });
  } catch (error) {
    console.error('Error fetching study plans:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}