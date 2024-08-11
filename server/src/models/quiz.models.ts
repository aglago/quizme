import mongoose from "mongoose";
import QuestionSchema from "./question.models";

const QuizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  preferences: {
    questionCount: {
      type: Number,
      required: true,
    },
    questionTypes: [
      {
        type: String,
        enum: ["multiple-choice", "true-false", "fill-in-the-blank", "theory"],
      },
    ],
    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
  },
  questions: [QuestionSchema],
  status: {
    type: String,
    enum: ["unplayed", "played"],
    default: "unplayed",
  },
  results: [
    {
      playedAt: {
        type: Date,
        default: Date.now,
      },
      totalQuestions: {
        type: Number,
        required: true,
      },
      correctAnswers: {
        type: Number,
        required: true,
      },
      percentage: {
        type: Number,
        required: true,
      },
    },
  ],
  bestScore: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;
