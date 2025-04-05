// app/lib/db/models/Document.ts
import mongoose, { Document as MongoDocument, Model } from 'mongoose';
import { Highlight } from '@/app/types';

export interface IDocument extends MongoDocument {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  uploadDate: Date;
  tags: string[];
  isPublic: boolean;
  highlights: Highlight[];
  extractedText?: string;
}

const HighlightSchema = new mongoose.Schema({
  pageNumber: {
    type: Number,
    required: true,
  },
  position: {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  color: {
    type: String,
    required: true,
    default: '#FFEB3B',
  },
  note: String,
});

const DocumentSchema = new mongoose.Schema<IDocument>({
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
  description: {
    type: String,
    default: '',
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'docx', 'doc', 'txt'],
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  highlights: {
    type: [HighlightSchema],
    default: [],
  },
  extractedText: String,
});

// Add text index for search functionality
DocumentSchema.index({ title: 'text', description: 'text', extractedText: 'text' });

// Ensure model is only registered once
const Document: Model<IDocument> = mongoose.models.Document as Model<IDocument> || 
  mongoose.model<IDocument>('Document', DocumentSchema);

export default Document;