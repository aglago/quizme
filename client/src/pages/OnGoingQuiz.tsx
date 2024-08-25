import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import QuizInterface from "../components/QuizInterface";
import {
  QuizQuestion,
  QuizResults,
  saveQuizToBackend,
} from "../services/quizService";
import { useQuizPreferences } from "@/hooks/useQuizPreferences";
import QuizCompleteModal from "../components/QuizCompleteModal"; // Import the modal

const OngoingQuiz: React.FC = () => {
  const location = useLocation();
  const questions = location.state?.questions as QuizQuestion[];
  const { quizPreferences } = useQuizPreferences();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);

  const handleQuizComplete = async (results: QuizResults) => {
    setQuizResults(results);
    setIsModalOpen(true); // Open the modal when quiz is complete
  };

  const handleSaveQuiz = (quizName: string, save: boolean) => {
    if (save && quizResults) {
      const played = true;
      saveQuizToBackend(
        quizName,
        quizPreferences,
        questions,
        played,
        quizResults
      );
    }
    setIsModalOpen(false);
  };

  if (!questions) {
    return <div>No quiz questions found. Please generate a quiz first.</div>;
  }

  return (
    <div>
      <QuizInterface questions={questions} onComplete={handleQuizComplete} />

      {isModalOpen && (
        <QuizCompleteModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveQuiz}
        />
      )}
    </div>
  );
};

export default OngoingQuiz;
