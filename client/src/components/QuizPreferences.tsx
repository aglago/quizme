import React, { useState, useEffect } from "react";
import { QuizPreferences } from "../services/quizService";
import { motion, AnimatePresence } from "framer-motion";
import { List, BarChart3, AlertCircle } from "lucide-react";

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
  const [showMessage, setShowMessage] = useState(false);
  const MAX_QUESTIONS = 20;

  const handleQuestionCountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    if (value > MAX_QUESTIONS) {
      setShowMessage(true);
      // Use setTimeout to allow the user to see the entered value briefly before correction
      setTimeout(() => {
        onPreferenceChange({
          ...event,
          target: { ...event.target, value: MAX_QUESTIONS.toString() },
        } as React.ChangeEvent<HTMLInputElement>);
      }, 200);
    } else {
      setShowMessage(false);
      onPreferenceChange(event);
    }
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

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
            onChange={handleQuestionCountChange}
            min="1"
            max={MAX_QUESTIONS}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <AnimatePresence>
            {showMessage && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-yellow-600 text-sm mt-2 flex items-center"
              >
                <AlertCircle className="inline mr-1" size={16} />
                You can only generate up to {MAX_QUESTIONS} questions for now.
              </motion.p>
            )}
          </AnimatePresence>
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
