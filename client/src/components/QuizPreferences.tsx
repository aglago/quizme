import React, { useState } from "react";
import { QuizPreferences } from "../services/quizService";

interface Props {
  onSubmit: (preferences: QuizPreferences) => void;
}

const QuizPreferencesForm: React.FC<Props> = ({ onSubmit }) => {
  const [preferences, setPreferences] = useState<QuizPreferences>({
    questionCount: 10,
    questionTypes: ["multiple-choice"],
    difficultyLevel: "medium",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Add form inputs for questionCount, questionTypes, and difficultyLevel */}
      <button type="submit">Generate Quiz</button>
    </form>
  );
};

export default QuizPreferencesForm;
