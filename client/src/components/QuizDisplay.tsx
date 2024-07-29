import React, { useState } from "react";
import { QuizQuestion } from "../services/quizService";

interface QuestionDisplayProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onAnswer,
}) => {
  const [userAnswer, setUserAnswer] = useState<string>("");

  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUserAnswer(event.target.value.toLowerCase());
  };

  const handleSubmit = () => {
    onAnswer(userAnswer);
  };

  return (
    <div>
      <h3>{question.question}</h3>
      {question.type === "multiple-choice" && (
        <div>
          {question.options.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                id={`option-${index}`}
                name="multiple-choice"
                value={option}
                onChange={handleAnswerChange}
              />
              <label htmlFor={`option-${index}`}>{option}</label>
            </div>
          ))}
        </div>
      )}
      {question.type === "true-false" && (
        <div>
          <div>
            <input
              type="radio"
              id="true"
              name="true-false"
              value="true"
              onChange={handleAnswerChange}
            />
            <label htmlFor="true">True</label>
          </div>
          <div>
            <input
              type="radio"
              id="false"
              name="true-false"
              value="false"
              onChange={handleAnswerChange}
            />
            <label htmlFor="false">False</label>
          </div>
        </div>
      )}
      {question.type === "fill-in-the-blank" && (
        <div>
          <input
            title="fill-in-the-blank answer"
            type="text"
            onChange={handleAnswerChange}
          />
        </div>
      )}
      {question.type === "theory" && (
        <div>
          <textarea title="theory answer" onChange={handleAnswerChange} />
        </div>
      )}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
