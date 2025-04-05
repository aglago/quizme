// app/lib/db/models/Quiz.ts
import mongoose, { Document as MongoDocument, Model } from 'mongoose';
import { Question as QuestionType } from '@/app/types';

export interface IQuiz extends MongoDocument {
  userId: mongoose.Types.ObjectId;
  documentId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  createdAt: Date;
  questions: QuestionType[];
}

const QuestionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    required: true,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
  },
  options: {
    type: [String],
    default: [],
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  difficulty: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 3,
  },
  topic: String,
});

const QuizSchema = new mongoose.Schema<IQuiz>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  questions: {
    type: [QuestionSchema],
    required: true,
    validate: {
      validator: function(questions: QuestionType[]) {
        return questions.length > 0;
      },
      message: 'Quiz must have at least one question',
    },
  },
});

// Create indexes for better query performance
QuizSchema.index({ userId: 1, createdAt: -1 });
QuizSchema.index({ documentId: 1 });
QuizSchema.index({ title: 'text', description: 'text' });

// Ensure model is only registered once
const Quiz: Model<IQuiz> = mongoose.models.Quiz as Model<IQuiz> || 
  mongoose.model<IQuiz>('Quiz', QuizSchema);

export default Quiz;