import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/QuizGenerator";
import {
  QuizPreferences,
  QuizQuestion,
  saveQuizToBackend,
} from "../services/quizService";
import { QuizActionDialog } from "../components/QuizActionDialog";

const GenerateQuiz: React.FC = () => {
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>(
    []
  );
  const [preferences, setPreferences] = useState<QuizPreferences>({
    questionCount: 10,
    questionTypes: ["multiple-choice", "fill-in-the-blank"],
    difficultyLevel: "easy",
  });

  const handleUploadSuccess = (
    questions: QuizQuestion[],
    preferences: QuizPreferences
  ) => {
    setGeneratedQuestions(questions);
    setPreferences(preferences);
    setIsDialogOpen(true);
  };

  const handleSaveLater = async () => {
    const played = false;

    const quizName = prompt("Enter a name to save this quiz with:");
    if (quizName) {
      await saveQuizToBackend(
        quizName,
        preferences,
        generatedQuestions,
        played
      );
    }
    setIsDialogOpen(false);
    navigate("/");
  };

  const handlePlayNow = () => {
    setIsDialogOpen(false);
    navigate("/quiz", { state: { questions: generatedQuestions } });
  };

  return (
    <div>
      <FileUpload onQuizGenerated={handleUploadSuccess} />
      <QuizActionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSaveLater={handleSaveLater}
        onPlayNow={handlePlayNow}
      />
    </div>
  );
};

export default GenerateQuiz;
