import React, { useState, useEffect } from "react";
import { api, QuizQuestion, QuizResults } from "../services/quizService";
import { QuestionDisplay } from "./QuizDisplay";

interface Props {
  questions: QuizQuestion[];
  onComplete: (results: QuizResults) => void;
}

interface UserAnswer {
  answer: string;
  score?: number;
  explanation?: string;
  isGrading?: boolean;
}

const QuizInterface: React.FC<Props> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    console.log("questions in quiz interface:", questions);
  }, [questions]);

  useEffect(() => {
    console.log("The current question", currentQuestion);
  }, [currentQuestion]);

  const handleAnswer = async (answer: string) => {
    const newAnswer: UserAnswer = { answer };

    if (currentQuestion.type === "theory") {
      newAnswer.isGrading = true;
      gradeTheoryAnswer(currentQuestionIndex, answer);
    }

    setUserAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
    setAnswerSubmitted(true);
    setCurrentAnswer(answer);
  };

  const gradeTheoryAnswer = async (questionIndex: number, answer: string) => {
    try {
      const response = await api.post("/quiz/grade-theory", {
        userAnswer: answer,
        correctAnswer: questions[questionIndex].correctAnswer,
        explanation: questions[questionIndex].explanation,
      });

      const { score, explanation } = response.data;

      setUserAnswers((prevAnswers) =>
        prevAnswers.map((ans, index) =>
          index === questionIndex
            ? { ...ans, score, explanation, isGrading: false }
            : ans
        )
      );
    } catch (error) {
      console.error("Failed to grade the theory answer:", error);
      setUserAnswers((prevAnswers) =>
        prevAnswers.map((ans, index) =>
          index === questionIndex
            ? { ...ans, isGrading: false, error: "Grading failed" }
            : ans
        )
      );
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setAnswerSubmitted(false);
      setCurrentAnswer(null);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const correctAnswers = questions.filter((q, i) => {
      const userAnswer = userAnswers[i];

      if (!userAnswer) return false;

      if (q.type === "theory") {
        return userAnswer.score !== undefined && userAnswer.score >= 5;
      } else {
        return (
          String(q.correctAnswer).toLowerCase() ===
          userAnswer.answer.toLowerCase()
        );
      }
    }).length;

    const results: QuizResults = {
      totalQuestions: questions.length,
      correctAnswers,
      percentage: (correctAnswers / questions.length) * 100,
    };

    setResults(results);
    setQuizCompleted(true);
    onComplete(results);
  };

  if (quizCompleted && results) {
    return (
      <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Quiz Completed</h2>
        <p className="text-lg">
          Score: {results.correctAnswers} / {results.totalQuestions}
        </p>
        <p className="text-lg">Percentage: {results.percentage.toFixed(2)}%</p>
        {userAnswers.map((answer, index) => (
          <div key={index} className="mt-4 p-4 border-t border-gray-200">
            <h3 className="text-xl font-medium">Question {index + 1}</h3>
            <p className="mt-2">Your answer: {answer.answer}</p>
            {questions[index].type === "theory" &&
              (answer.isGrading ? (
                <p className="text-blue-500 mt-2">Grading in progress...</p>
              ) : answer.score !== undefined ? (
                <p className="text-green-500 mt-2">Score: {answer.score}</p>
              ) : (
                <p className="text-red-500 mt-2">
                  Grading failed. Please check your connection and try again.
                </p>
              ))}
            <p className="mt-2">
              Correct answer: {questions[index].correctAnswer}
            </p>
            <p className="mt-2">Explanation: {questions[index].explanation}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        Question {currentQuestionIndex + 1} of {questions.length}
      </h2>
      {!quizCompleted && (
        <div>
          <QuestionDisplay
            key={currentQuestionIndex}
            question={currentQuestion}
            onAnswer={handleAnswer}
            isAnswerSubmitted={answerSubmitted}
            userAnswer={currentAnswer}
          />
          {answerSubmitted && (
            <div className="mt-4">
              <p className="text-gray-700 mb-2">
                Explanation: {currentQuestion.explanation}
              </p>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizInterface;
