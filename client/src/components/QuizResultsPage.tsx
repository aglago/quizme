import React from "react";
import { motion } from "framer-motion";
import { Check, X, Clock, AlertTriangle } from "lucide-react";
import { QuizQuestion } from "@/services/quizService";

interface QuizResultsProps {
  quizCompleted: boolean;
  results: {
    correctAnswers: number;
    totalQuestions: number;
    percentage: number;
  } | null;
  userAnswers: Array<{
    answer: string;
    isGrading?: boolean;
    score?: number;
  }>;
  questions: QuizQuestion[];
}

const QuizResultsPage: React.FC<QuizResultsProps> = ({
  quizCompleted,
  results,
  userAnswers,
  questions,
}) => {
  if (!quizCompleted || !results) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto mt-2 p-6 bg-white shadow-xl rounded-xl border border-gray-200"
    >
      <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
        Quiz Results
      </h2>
      <div className="flex justify-around items-center mb-8 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
        <div className="text-center">
          <p className="text-l font-semibold">Score</p>
          <p className="text-xl font-bold">
            {results.correctAnswers} / {results.totalQuestions}
          </p>
        </div>
        <div className="text-center">
          <p className="text-l font-semibold">Percentage</p>
          <p className="text-xl font-bold">{results.percentage.toFixed(2)}%</p>
        </div>
      </div>

      {userAnswers.map((answer, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg shadow"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Question {index + 1}
          </h3>
          <div className="flex items-center mb-2">
            <p className="font-medium text-gray-700 mr-2">Your answer:</p>
            <p
              className={`${
                answer.answer === questions[index].correctAnswer
                  ? "text-green-600"
                  : "text-red-600"
              } font-semibold`}
            >
              {answer.answer}
            </p>
            {answer.answer === questions[index].correctAnswer ? (
              <Check className="text-green-600 ml-2" size={20} />
            ) : (
              <X className="text-red-600 ml-2" size={20} />
            )}
          </div>

          {questions[index].type === "theory" && (
            <div className="mb-2">
              {answer.isGrading ? (
                <p className="text-blue-500 flex items-center">
                  <Clock className="mr-2" size={16} /> Grading in progress...
                </p>
              ) : answer.score !== undefined ? (
                <p className="text-green-500 flex items-center">
                  <Check className="mr-2" size={16} /> Score: {answer.score}
                </p>
              ) : (
                <p className="text-red-500 flex items-center">
                  <AlertTriangle className="mr-2" size={16} /> Grading failed.
                  Please check your connection and try again.
                </p>
              )}
            </div>
          )}

          <div className="mt-2">
            <p className="font-medium text-gray-700">Correct answer:</p>
            <p className="text-green-600 font-semibold">
              {questions[index].correctAnswer}
            </p>
          </div>

          <div className="mt-2">
            <p className="font-medium text-gray-700">Explanation:</p>
            <p className="text-gray-600">{questions[index].explanation}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default QuizResultsPage;
