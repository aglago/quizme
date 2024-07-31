import React from "react";
import { useLocation } from "react-router-dom";
import QuizInterface from "./QuizInterface";
import {
  QuizQuestion,
  QuizResults,
  saveQuizToBackend,
} from "../services/quizService";
import { useQuizPreferences } from "@/hooks/useQuizPreferences";

const OngoingQuiz: React.FC = () => {
  const location = useLocation();
  const questions = location.state?.questions as QuizQuestion[];
  const { quizPreferences } = useQuizPreferences();

  const handleQuizComplete = async (results: QuizResults) => {
    const played = true;
    const quizName =
      prompt("Enter a name to save this quiz with:") || "Generated Questions";
    saveQuizToBackend(quizName, quizPreferences, questions, played, results);
  };

  if (!questions) {
    return <div>No quiz questions found. Please generate a quiz first.</div>;
  }

  return (
    <QuizInterface questions={questions} onComplete={handleQuizComplete} />
  );
};

export default OngoingQuiz;
