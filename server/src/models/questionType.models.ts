import mongoose from "mongoose";
import Quiz from "./quiz.models";

const MultipleChoiceQuestion = Quiz.discriminator(
  "multiple-choice",
  new mongoose.Schema({
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
  })
);

const TrueFalseQuestion = Quiz.discriminator(
  "true-false",
  new mongoose.Schema({
    correctAnswer: {
      type: String,
      enum: ["true", "false"],
      required: true,
    },
  })
);

const FillInTheBlankQuestion = Quiz.discriminator(
  "fill-in-the-blank",
  new mongoose.Schema({
    correctAnswer: { type: String, required: true },
  })
);

const TheoryQuestion = Quiz.discriminator(
  "theory",
  new mongoose.Schema({
    correctAnswer: String, // Optional for theory questions
  })
);

export {
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  FillInTheBlankQuestion,
  TheoryQuestion,
};
