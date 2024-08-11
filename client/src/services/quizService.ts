import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export interface QuizPreferences {
  questionCount: number;
  questionTypes: ("multiple-choice" | "fill-in-the-blank" | "essay")[];
  difficultyLevel: "easy" | "medium" | "hard";
}

export type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "fill-in-the-blank"
  | "theory";

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

export interface Quiz {
  _id: string;
  name: string;
  preferences: QuizPreferences;
  questions: QuizQuestion[];
  status: string;
  results: QuizResults;
  bastScore: number;
  createdAt: Date;
}

export const generateQuiz = async (
  text: string,
  preferences: QuizPreferences
): Promise<QuizQuestion[]> => {
  try {
    const response = await api.post("/quiz/generate-quiz", {
      text: text || "general knowledge",
      preferences,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    return [];
  }
};

export const saveQuizToBackend = async (
  name: string,
  preferences: QuizPreferences,
  questions: QuizQuestion[],
  played: boolean,
  results?: QuizResults
) => {
  try {
    await api.post("/quiz/save-quiz", {
      name,
      preferences,
      questions,
      played,
      results,
    });
    alert("Quiz saved successfully!");
  } catch (error) {
    console.error("Failed to save quiz:", error);
    alert("Failed to save quiz. Please try again.");
  }
};
