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
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Quiz Preferences</h3>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1" htmlFor="questionCount">
          Number of Questions:
        </label>
        <input
          type="number"
          id="questionCount"
          name="questionCount"
          value={preferences.questionCount}
          onChange={onPreferenceChange}
          min="1"
          max="50"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1" htmlFor="questionTypes">
          Question Type:
        </label>
        <select
          id="questionTypes"
          name="questionTypes"
          value={preferences.questionTypes[0]}
          onChange={onPreferenceChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true-false">True or False</option>
          <option value="fill-in-the-blank">Fill in the Blank</option>
          <option value="theory">Theory</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1" htmlFor="difficultyLevel">
          Difficulty Level:
        </label>
        <select
          id="difficultyLevel"
          name="difficultyLevel"
          value={preferences.difficultyLevel}
          onChange={onPreferenceChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>
  );
};

export default QuizPreferencesForm;
