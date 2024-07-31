import React, { createContext, useState } from "react";
import { QuizPreferences } from "../services/quizService";

export const QuizPreferencesContext = createContext<
  | {
      quizPreferences: QuizPreferences;
      setQuizPreferences: React.Dispatch<React.SetStateAction<QuizPreferences>>;
    }
  | undefined
>(undefined);

export const QuizPreferencesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [quizPreferences, setQuizPreferences] = useState<QuizPreferences>({
    questionCount: 1,
    questionTypes: ["multiple-choice"],
    difficultyLevel: "medium",
  });

  return (
    <QuizPreferencesContext.Provider
      value={{ quizPreferences, setQuizPreferences }}
    >
      {children}
    </QuizPreferencesContext.Provider>
  );
};
