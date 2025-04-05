// app/lib/db/models/StudyPlan.ts
import mongoose, { Document as MongoDocument, Model } from 'mongoose';
import { StudySession, StudyActivity } from '@/app/types';

export interface IStudyPlan extends MongoDocument {
  userId: mongoose.Types.ObjectId;
  title: string;
  targetDate: Date;
  createdAt: Date;
  documents: mongoose.Types.ObjectId[];
  sessions: Array<StudySession & { 
    date: Date;
    activities: Array<StudyActivity & { resourceId: mongoose.Types.ObjectId }>;
  }>;
  progress: number;
}

const StudyActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['quiz', 'reading', 'flashcards', 'notes'],
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const StudySessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 5,
  },
  topics: [String],
  completed: {
    type: Boolean,
    default: false,
  },
  activities: {
    type: [StudyActivitySchema],
    default: [],
  },
});

const StudyPlanSchema = new mongoose.Schema<IStudyPlan>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  targetDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  documents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Document',
    required: true,
    validate: {
      validator: function(documents: mongoose.Types.ObjectId[]) {
        return documents.length > 0;
      },
      message: 'Study plan must include at least one document',
    },
  },
  sessions: {
    type: [StudySessionSchema],
    required: true,
    validate: {
      validator: function(sessions: StudySession[]) {
        return sessions.length > 0;
      },
      message: 'Study plan must include at least one session',
    },
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
});

// Create indexes for better query performance
StudyPlanSchema.index({ userId: 1, createdAt: -1 });
StudyPlanSchema.index({ 'sessions.date': 1 });

// Pre-save hook to calculate progress
StudyPlanSchema.pre('save', function(next) {
  if (this.isModified('sessions')) {
    const totalActivities = this.sessions.reduce((total, session) => {
      return total + session.activities.length;
    }, 0);
    
    if (totalActivities === 0) {
      this.progress = 0;
    } else {
      const completedActivities = this.sessions.reduce((count, session) => {
        return count + session.activities.filter(activity => activity.completed).length;
      }, 0);
      
      this.progress = Math.round((completedActivities / totalActivities) * 100);
    }
  }
  
  next();
});

// Ensure model is only registered once
const StudyPlan: Model<IStudyPlan> = mongoose.models.StudyPlan as Model<IStudyPlan> || 
  mongoose.model<IStudyPlan>('StudyPlan', StudyPlanSchema);

export default StudyPlan;