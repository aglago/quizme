// app/dashboard/page.tsx
import { Suspense } from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { Document, StudyPlan, Quiz } from '@/app/types';
import connectDB from '@/app/lib/db/connection';
import DocumentModel from '@/app/lib/db/models/Document';
import StudyPlanModel from '@/app/lib/db/models/StudyPlan';
import QuizModel from '@/app/lib/db/models/Quiz';
import mongoose from 'mongoose';

async function getDocuments(userId: string): Promise<Document[]> {
  await connectDB();
  
  const documents = await DocumentModel.find({ userId })
    .sort({ uploadDate: -1 })
    .limit(5);
  
  return documents.map(doc => ({
    _id: (doc._id as mongoose.Types.ObjectId).toString(),
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
}

async function getStudyPlans(userId: string): Promise<StudyPlan[]> {
  await connectDB();
  
  const studyPlans = await StudyPlanModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(3);
  
  return studyPlans.map(plan => ({
    _id: (plan._id as mongoose.Types.ObjectId).toString(),
    userId: plan.userId.toString(),
    title: plan.title,
    targetDate: plan.targetDate.toISOString(),
    createdAt: plan.createdAt.toISOString(),
    documents: plan.documents.map(id => id.toString()),
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
}

async function getQuizzes(userId: string): Promise<Quiz[]> {
  await connectDB();
  
  const quizzes = await QuizModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5);
  
  return quizzes.map(quiz => ({
    _id: (quiz._id as mongoose.Types.ObjectId).toString(),
    userId: quiz.userId.toString(),
    documentId: quiz.documentId.toString(),
    title: quiz.title,
    description: quiz.description,
    createdAt: quiz.createdAt.toISOString(),
    questions: quiz.questions.map(q => ({
      questionId: q.questionId.toString(),
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
      topic: q.topic,
    })),
  }));
}

// interface DashboardData {
//   documents: Document[];
//   studyPlans: StudyPlan[];
//   quizzes: Quiz[];
// }

async function DashboardContent() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/login');
  }
  
  const userId = session.user.id;
  
  // Fetch data in parallel
  const [documents, studyPlans, quizzes] = await Promise.all([
    getDocuments(userId),
    getStudyPlans(userId),
    getQuizzes(userId),
  ]);
  
  // Get today's study sessions
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = studyPlans.flatMap(plan => 
    plan.sessions.filter(session => 
      session.date.split('T')[0] === today && !session.completed
    )
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Today's Study Plan */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Today&apos;s Study Plan</h2>
          {todaySessions.length > 0 ? (
            <div className="space-y-4">
              {todaySessions.map((session, index) => (
                <div key={index} className="p-3 border border-blue-100 rounded-md bg-blue-50">
                  <p className="font-medium">{
                    studyPlans.find(plan => 
                      plan.sessions.some(s => 
                        s.date === session.date && s.duration === session.duration
                      )
                    )?.title || 'Study Session'
                  }</p>
                  <p className="text-sm text-gray-600">Duration: {session.duration} minutes</p>
                  {session.topics && (
                    <p className="text-sm text-gray-600">Topics: {session.topics}</p>
                  )}
                  <Link 
                    href={`/dashboard/study-plans/${
                      studyPlans.find(plan => 
                        plan.sessions.some(s => 
                          s.date === session.date && s.duration === session.duration
                        )
                      )?._id
                    }`}
                    className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                  >
                    Start Session
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No study sessions scheduled for today.</p>
              <Link 
                href="/dashboard/study-plans/create"
                className="mt-2 inline-block text-sm text-blue-600 hover:underline"
              >
                Create a Study Plan
              </Link>
            </div>
          )}
        </div>
        
        {/* Recent Documents */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Documents</h2>
            <Link 
              href="/dashboard/documents"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          
          {documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map(doc => (
                <Link 
                  key={doc._id}
                  href={`/dashboard/documents/${doc._id}`}
                  className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <p className="font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No documents uploaded yet.</p>
              <Link 
                href="/dashboard/documents/upload"
                className="mt-2 inline-block text-sm text-blue-600 hover:underline"
              >
                Upload a Document
              </Link>
            </div>
          )}
        </div>
        
        {/* Quick Access */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/dashboard/documents/upload"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <span className="text-3xl mb-2">📄</span>
              <span className="text-sm font-medium">Upload Document</span>
            </Link>
            <Link 
              href="/dashboard/quizzes/create"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <span className="text-3xl mb-2">❓</span>
              <span className="text-sm font-medium">Create Quiz</span>
            </Link>
            <Link 
              href="/dashboard/study-plans/create"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <span className="text-3xl mb-2">📅</span>
              <span className="text-sm font-medium">Study Plan</span>
            </Link>
            <Link 
              href="/dashboard/focus"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <span className="text-3xl mb-2">🎯</span>
              <span className="text-sm font-medium">Focus Mode</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent Quizzes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Quizzes</h2>
          <Link 
            href="/dashboard/quizzes"
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>
        
        {quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map(quiz => (
              <Link 
                key={quiz._id}
                href={`/dashboard/quizzes/${quiz._id}`}
                className="block p-4 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <p className="font-medium truncate">{quiz.title}</p>
                <p className="text-sm text-gray-600">
                  {quiz.questions.length} questions
                </p>
                <p className="text-xs text-gray-500">
                  Created on {new Date(quiz.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white rounded-lg shadow">
            <p className="text-gray-500">No quizzes created yet.</p>
            <Link 
              href="/dashboard/quizzes/create"
              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
            >
              Create Your First Quiz
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}