import React, { useState, useEffect } from "react";
import { QuizQuestion, QuizResults } from "../services/quizService";
import { QuestionDisplay } from "./QuizDisplay";
import axios from "axios";

interface Props {
  questions: QuizQuestion[];
}

interface UserAnswer {
  answer: string;
  score?: number;
  explanation?: string;
  isGrading?: boolean;
}

const QuizInterface: React.FC<Props> = ({ questions }) => {
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
      // Start grading process asynchronously
      gradeTheoryAnswer(currentQuestionIndex, answer);
    }

    setUserAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
    setAnswerSubmitted(true);
    setCurrentAnswer(answer);
  };

  const gradeTheoryAnswer = async (questionIndex: number, answer: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/grade-theory",
        {
          userAnswer: answer,
          correctAnswer: questions[questionIndex].correctAnswer,
          explanation: questions[questionIndex].explanation,
        }
      );

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
        {userAnswers.map((answer, index) => (
          <div key={index}>
            <h3>Question {index + 1}</h3>
            <p>Your answer: {answer.answer}</p>
            {questions[index].type === "theory" &&
              (answer.isGrading ? (
                <p>Grading in progress...</p>
              ) : answer.score !== undefined ? (
                <p>Score: {answer.score}</p>
              ) : (
                <p>
                  Grading failed. Please check your connection and try again.
                </p>
              ))}
            <p>Correct answer: {questions[index].correctAnswer}</p>
            <p>Explanation: {questions[index].explanation}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2>
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
            <div>
              <p>Explanation: {currentQuestion.explanation}</p>
              <button onClick={handleNext}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizInterface;
