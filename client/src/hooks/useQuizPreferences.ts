import { QuizPreferencesContext } from "@/contexts/QuizPreferencesContext";
import { useContext } from "react";

export const useQuizPreferences = () => {
  const context = useContext(QuizPreferencesContext);
  if (!context) {
    throw new Error(
      "useQuizPreferences must be used within a QuizPreferencesProvider"
    );
  }
  return context;
};
