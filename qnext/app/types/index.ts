// app/types/index.ts

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  lastLogin?: string;
  preferences: {
    darkMode: boolean;
    notifications: boolean;
    studyReminders: boolean;
  };
  subscription: {
    plan: string;
    startDate?: string;
    endDate?: string;
  };
  bio?: string;
  savedDocuments: string[];
}

export interface Document {
  _id: string;
  userId: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  uploadDate: string;
  tags: string[];
  isPublic: boolean;
  highlights?: Highlight[];
  extractedText?: string;
  isSaved?: boolean;
}

export interface Highlight {
  pageNumber: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  color: string;
  note?: string;
}

export interface Question {
  questionId: string;
  questionText: string;
  questionType: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | number | boolean;
  difficulty: number;
  topic?: string;
}

export interface Quiz {
  _id: string;
  userId: string;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  questions: Question[];
}

export interface QuizResult {
  quizId: string;
  date: string;
  score: number;
  timeSpent: number;
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  timeSpent: number;
}

export interface TopicMastery {
  topic: string;
  strength: number;
  lastPracticed: string;
}

export interface StudyTime {
  daily: DailyStudyTime[];
  totalHours: number;
}

export interface DailyStudyTime {
  date: string;
  minutes: number;
}

export interface StudyPlan {
  _id: string;
  userId: string;
  title: string;
  targetDate: string;
  createdAt: string;
  documents: string[];
  sessions: StudySession[];
  progress: number;
}

export interface StudySession {
  date: string;
  duration: number;
  topics: string[];
  completed: boolean;
  activities: StudyActivity[];
}

export interface StudyActivity {
  type: 'quiz' | 'reading' | 'flashcards' | 'notes';
  resourceId: string;
  duration: number;
  completed: boolean;
}

export interface Performance {
  _id: string;
  userId: string;
  quizResults: QuizResult[];
  topicMastery: TopicMastery[];
  studyTime: StudyTime;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export type FileType = 'pdf' | 'docx' | 'doc' | 'txt';
