import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuizInterface from "./QuizInterface";
import { QuizQuestion, QuizResults } from "../services/quizService";
import axios from "axios";

const OngoingQuiz: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questions = location.state?.questions as QuizQuestion[];

  const handleQuizComplete = async (results: QuizResults) => {
    // Save quiz to history
    try {
      await axios.post("/api/save-quiz-history", { questions, results });
    } catch (error) {
      console.error("Failed to save quiz history:", error);
    }

    const saveQuiz = window.confirm(
      "Do you want to save this quiz to play again later?"
    );

    if (saveQuiz) {
      const quizName = prompt("Enter a name for this quiz:");
      if (quizName) {
        try {
          await axios.post("/api/save-quiz", { name: quizName, questions });
          alert("Quiz saved successfully!");
        } catch (error) {
          console.error("Failed to save quiz:", error);
          alert("Failed to save quiz. Please try again.");
        }
      }
    }

    navigate("/");
  };

  if (!questions) {
    return <div>No quiz questions found. Please generate a quiz first.</div>;
  }

  return (
    <QuizInterface questions={questions} onComplete={handleQuizComplete} />
  );
};

export default OngoingQuiz;
