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

  const getOptionStyle = (option: string) => {
    if (!isAnswerSubmitted) return {};
    if (isCorrectAnswer(option)) return { backgroundColor: "lightgreen" };
    if (option === userAnswer) return { backgroundColor: "lightcoral" };
    return {};
  };

  return (
    <div>
      <h3>{question.question}</h3>
      {question.type === "multiple-choice" && (
        <div>
          {question.options.map((option, index) => (
            <div key={index} style={getOptionStyle(option)}>
              <input
                type="radio"
                id={`option-${index}`}
                name="multiple-choice"
                value={option}
                onChange={handleAnswerChange}
                checked={selectedAnswer === option}
                disabled={isAnswerSubmitted}
              />
              <label htmlFor={`option-${index}`}>{option}</label>
            </div>
          ))}
        </div>
      )}
      {question.type === "true-false" && (
        <div>
          {["true", "false"].map((option) => (
            <div key={option} style={getOptionStyle(option)}>
              <input
                type="radio"
                id={option}
                name="true-false"
                value={option}
                onChange={handleAnswerChange}
                checked={selectedAnswer === option}
                disabled={isAnswerSubmitted}
              />
              <label htmlFor={option}>
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
            style={isAnswerSubmitted ? getOptionStyle(selectedAnswer) : {}}
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
          />
        </div>
      )}
      {!isAnswerSubmitted && <button onClick={handleSubmit}>Submit</button>}
    </div>
  );
};
