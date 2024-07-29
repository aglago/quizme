export interface QuizPreferences {
  questionCount: number;
  questionTypes: QuestionType[];
  difficultyLevel: "easy" | "medium" | "hard";
}

export type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "fill-in-the-blank"
  | "theory"
  | "mixed";

export interface BaseQuestion {
  question: string;
  type: QuestionType;
  explanation: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: string[];
  correctAnswer: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "true-false";
  correctAnswer: "true" | "false";
}

export interface FillInTheBlankQuestion extends BaseQuestion {
  type: "fill-in-the-blank";
  correctAnswer: string;
}

export interface TheoryQuestion extends BaseQuestion {
  type: "theory";
  correctAnswer?: string;
}

export type QuizQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillInTheBlankQuestion
  | TheoryQuestion;

export interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
}
