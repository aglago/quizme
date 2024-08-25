import React, { useState, useEffect } from "react";
import { QuizQuestion } from "../services/quizService";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

interface QuestionDisplayProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  isAnswerSubmitted: boolean;
  userAnswer: string | null;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onAnswer,
  isAnswerSubmitted,
  userAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  useEffect(() => {
    setSelectedAnswer("");
  }, [question]);

  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedAnswer(event.target.value);
  };

  const handleSubmit = () => {
    onAnswer(selectedAnswer);
  };

  const isCorrectAnswer = (option: string) => {
    return (
      option.toLowerCase() === String(question.correctAnswer).toLowerCase()
    );
  };

  const getOptionClasses = (option: string) => {
    if (!isAnswerSubmitted) return "bg-white hover:bg-gray-100";
    if (isCorrectAnswer(option)) return "bg-green-100 border-green-500";
    if (option === userAnswer) return "bg-red-100 border-red-500";
    return "bg-gray-100";
  };

  const renderOptions = (options: string[]) => {
    return options.map((option, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={`p-3 rounded-lg border-2 ${getOptionClasses(
          option
        )} transition-all duration-300 ease-in-out`}
      >
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            id={`option-${index}`}
            name="answer"
            value={option}
            onChange={handleAnswerChange}
            checked={selectedAnswer === option}
            disabled={isAnswerSubmitted}
            className="form-radio h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700 select-none">{option}</span>
          {isAnswerSubmitted && isCorrectAnswer(option) && (
            <CheckCircle className="text-green-500 ml-auto" size={20} />
          )}
          {isAnswerSubmitted &&
            option === userAnswer &&
            !isCorrectAnswer(option) && (
              <XCircle className="text-red-500 ml-auto" size={20} />
            )}
        </label>
      </motion.div>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-white p-6 rounded-xl shadow-lg"
    >
      <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4">
        {question.question}
      </h3>

      {question.type === "multiple-choice" && (
        <div className="space-y-3">{renderOptions(question.options)}</div>
      )}

      {question.type === "true-false" && (
        <div className="space-y-3">{renderOptions(["True", "False"])}</div>
      )}

      {question.type === "fill-in-the-blank" && (
        <input
          title="fill-in-the-blank answer"
          type="text"
          onChange={handleAnswerChange}
          value={selectedAnswer}
          disabled={isAnswerSubmitted}
          className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 ${
            isAnswerSubmitted
              ? getOptionClasses(selectedAnswer)
              : "border-gray-300"
          }`}
          placeholder="Type your answer here..."
        />
      )}

      {question.type === "theory" && (
        <textarea
          title="theory answer"
          onChange={handleAnswerChange}
          value={selectedAnswer}
          disabled={isAnswerSubmitted}
          className="w-full p-3 border-2 border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
          rows={4}
          placeholder="Type your answer here..."
        />
      )}

      {!isAnswerSubmitted && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="px-6 py-3 bg-gradient-to-b from-blue-500 to-purple-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold shadow-md"
          disabled={!selectedAnswer}
        >
          Submit Answer
        </motion.button>
      )}
    </motion.div>
  );
};
