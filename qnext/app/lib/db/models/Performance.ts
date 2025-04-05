// app/lib/db/models/Performance.ts
import mongoose, { Document as MongoDocument, Model } from 'mongoose';

export interface IPerformance extends MongoDocument {
  userId: mongoose.Types.ObjectId;
  quizResults: Array<{
    quizId: mongoose.Types.ObjectId;
    date: Date;
    score: number;
    timeSpent: number;
    questionResults: Array<{
      questionId: string;
      correct: boolean;
      timeSpent: number;
    }>;
  }>;
  topicMastery: Array<{
    topic: string;
    strength: number;
    lastPracticed: Date;
  }>;
  studyTime: {
    daily: Array<{
      date: Date;
      minutes: number;
    }>;
    totalHours: number;
  };
}

const QuestionResultSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  correct: {
    type: Boolean,
    required: true,
  },
  timeSpent: {
    type: Number,
    required: true,
    min: 0,
  },
});

const QuizResultSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  timeSpent: {
    type: Number,
    required: true,
    min: 0,
  },
  questionResults: {
    type: [QuestionResultSchema],
    required: true,
  },
});

const TopicMasterySchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  strength: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  lastPracticed: {
    type: Date,
    default: Date.now,
  },
});

const DailyStudyTimeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  minutes: {
    type: Number,
    required: true,
    min: 0,
  },
});

const PerformanceSchema = new mongoose.Schema<IPerformance>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  quizResults: {
    type: [QuizResultSchema],
    default: [],
  },
  topicMastery: {
    type: [TopicMasterySchema],
    default: [],
  },
  studyTime: {
    daily: {
      type: [DailyStudyTimeSchema],
      default: [],
    },
    totalHours: {
      type: Number,
      default: 0,
    },
  },
});

// Create indexes for better query performance
PerformanceSchema.index({ userId: 1 });
PerformanceSchema.index({ 'quizResults.date': -1 });
PerformanceSchema.index({ 'studyTime.daily.date': -1 });

// Pre-save hook to update totalHours
PerformanceSchema.pre('save', function(next) {
  if (this.isModified('studyTime.daily')) {
    const totalMinutes = this.studyTime.daily.reduce((total, day) => {
      return total + day.minutes;
    }, 0);
    
    this.studyTime.totalHours = Number((totalMinutes / 60).toFixed(1));
  }
  
  next();
});

// Ensure model is only registered once
const Performance: Model<IPerformance> = mongoose.models.Performance as Model<IPerformance> || 
  mongoose.model<IPerformance>('Performance', PerformanceSchema);

export default Performance;