import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["multiple-choice", "true-false", "fill-in-the-blank", "theory"],
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    options: [String], // For multiple-choice questions
    correctAnswer: String, // For all types except theory
  },
  { discriminatorKey: "type" }
);

export default QuestionSchema;
