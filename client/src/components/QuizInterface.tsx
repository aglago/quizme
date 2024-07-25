import React, { useState } from "react";
import { QuizQuestion, QuizResults } from "../services/quizService";

interface Props {
  questions: QuizQuestion[];
}

const QuizInterface: React.FC<Props> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);

  const handleAnswer = (answer: string) => {
    setUserAnswers([...userAnswers, answer]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const correctAnswers = questions.filter(
      (q, i) => q.correctAnswer === userAnswers[i]
    ).length;
    setResults({
      totalQuestions: questions.length,
      correctAnswers,
      percentage: (correctAnswers / questions.length) * 100,
    });
    setQuizCompleted(true);
  };

  if (quizCompleted && results) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>
          Score: {results.correctAnswers} / {results.totalQuestions}
        </p>
        <p>Percentage: {results.percentage.toFixed(2)}%</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2>
        Question {currentQuestionIndex + 1} of {questions.length}
      </h2>
      <p>{currentQuestion.question}</p>
      {/* Render answer options based on question type */}
      <p>Explanation: {currentQuestion.explanation}</p>
    </div>
  );
};

export default QuizInterface;
