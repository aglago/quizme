import React from "react";
import { QuizPreferences } from "../services/quizService";
import { motion } from "framer-motion";
import { List, BarChart3 } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <div className="space-y-6">
        <div>
          <label
            className="block text-gray-700 mb-2 font-medium"
            htmlFor="questionCount"
          >
            <List className="inline mr-2" /> Number of Questions:
          </label>
          <input
            type="number"
            id="questionCount"
            name="questionCount"
            value={preferences.questionCount}
            onChange={onPreferenceChange}
            min="1"
            max="50"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>

        <div>
          <label
            className="block text-gray-700 mb-2 font-medium"
            htmlFor="questionTypes"
          >
            <List className="inline mr-2" /> Question Type:
          </label>
          <select
            id="questionTypes"
            name="questionTypes"
            value={preferences.questionTypes[0]}
            onChange={onPreferenceChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True or False</option>
            <option value="fill-in-the-blank">Fill in the Blank</option>
            <option value="theory">Theory</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div>
          <label
            className="block text-gray-700 mb-2 font-medium"
            htmlFor="difficultyLevel"
          >
            <BarChart3 className="inline mr-2" /> Difficulty Level:
          </label>
          <select
            id="difficultyLevel"
            name="difficultyLevel"
            value={preferences.difficultyLevel}
            onChange={onPreferenceChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizPreferencesForm;
