import axios from "axios";

export interface QuizPreferences {
  questionCount: number;
  questionTypes: ("multiple-choice" | "fill-in-the-blank" | "essay")[];
  difficultyLevel: "easy" | "medium" | "hard";
}

export interface QuizQuestion {
  question: string;
  type: "multiple-choice" | "fill-in-the-blank" | "essay";
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
}

export const generateQuiz = async (
  text: string,
  preferences: QuizPreferences
): Promise<QuizQuestion[]> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/generate-quiz",
      {
        text,
        preferences,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    return [];
  }
};
