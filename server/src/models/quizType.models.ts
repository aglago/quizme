export type QuestionType = "multiple-choice" | "fill-in-the-blank" | "essay" | "mixed";

export interface QuizPreferences {
  questionCount: number;
  questionTypes: QuestionType[];
  difficultyLevel: "easy" | "medium" | "hard";
}

export interface QuizQuestion {
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
}
