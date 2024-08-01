import React from "react";
import { QuizPreferences } from "../services/quizService";

interface QuizPreferencesFormProps {
  preferences: QuizPreferences;
  onPreferenceChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const QuizPreferencesForm: React.FC<QuizPreferencesFormProps> = ({
  preferences,
  onPreferenceChange,
}) => {
  return (
    <div className="quiz-preferences">
      <label>
        Questions:
        <input
          type="number"
          name="questionCount"
          value={preferences.questionCount}
          onChange={onPreferenceChange}
          min="1"
          max="50"
        />
      </label>
      <label>
        Type:
        <select
          name="questionTypes"
          value={preferences.questionTypes[0]}
          onChange={onPreferenceChange}
        >
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true-false">True or False</option>
          <option value="fill-in-the-blank">Fill in the Blank</option>
          <option value="theory">Theory</option>
          <option value="mixed">Mixed</option>
        </select>
      </label>
      <label>
        Difficulty:
        <select
          name="difficultyLevel"
          value={preferences.difficultyLevel}
          onChange={onPreferenceChange}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
    </div>
  );
};

export default QuizPreferencesForm;
