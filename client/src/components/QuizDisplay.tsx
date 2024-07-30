import React, { useState, useEffect } from "react";
import { QuizQuestion } from "../services/quizService";

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
    if (!isAnswerSubmitted) return "";
    if (isCorrectAnswer(option)) return "bg-green-200";
    if (option === userAnswer) return "bg-red-200";
    return "";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{question.question}</h3>
      {question.type === "multiple-choice" && (
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`p-2 rounded ${getOptionClasses(option)}`}
            >
              <input
                type="radio"
                id={`option-${index}`}
                name="multiple-choice"
                value={option}
                onChange={handleAnswerChange}
                checked={selectedAnswer === option}
                disabled={isAnswerSubmitted}
                className="mr-2"
              />
              <label htmlFor={`option-${index}`} className="select-none">
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
      {question.type === "true-false" && (
        <div className="space-y-2">
          {["true", "false"].map((option) => (
            <div
              key={option}
              className={`p-2 rounded ${getOptionClasses(option)}`}
            >
              <input
                type="radio"
                id={option}
                name="true-false"
                value={option}
                onChange={handleAnswerChange}
                checked={selectedAnswer === option}
                disabled={isAnswerSubmitted}
                className="mr-2"
              />
              <label htmlFor={option} className="select-none">
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            </div>
          ))}
        </div>
      )}
      {question.type === "fill-in-the-blank" && (
        <div>
          <input
            title="fill-in-the-blank answer"
            type="text"
            onChange={handleAnswerChange}
            value={selectedAnswer}
            disabled={isAnswerSubmitted}
            className={`w-full p-2 border rounded ${
              isAnswerSubmitted ? getOptionClasses(selectedAnswer) : ""
            }`}
          />
        </div>
      )}
      {question.type === "theory" && (
        <div>
          <textarea
            title="theory answer"
            onChange={handleAnswerChange}
            value={selectedAnswer}
            disabled={isAnswerSubmitted}
            className="w-full p-2 border rounded resize-y"
            rows={4}
          />
        </div>
      )}
      {!isAnswerSubmitted && (
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      )}
    </div>
  );
};
