import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import { QuizQuestion } from "../services/quizService";
import axios from "axios";
import { QuizActionDialog } from "./QuizActionDialog";

const GenerateQuiz: React.FC = () => {
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>(
    []
  );

  const handleUploadSuccess = (questions: QuizQuestion[]) => {
    setGeneratedQuestions(questions);
    setIsDialogOpen(true);
  };

  const handleSaveLater = async () => {
    const quizName = prompt("Enter a name for this quiz:");
    if (quizName) {
      await saveQuizToBackend(quizName, generatedQuestions);
      alert("Quiz saved successfully!");
    }
    setIsDialogOpen(false);
    navigate("/");
  };

  const handlePlayNow = () => {
    setIsDialogOpen(false);
    navigate("/quiz", { state: { questions: generatedQuestions } });
  };

  const saveQuizToBackend = async (name: string, questions: QuizQuestion[]) => {
    try {
      await axios.post("/api/save-quiz", { name, questions });
      alert("Quiz saved successfully!");
      return true;
    } catch (error) {
      console.error("Failed to save quiz:", error);
      alert("Failed to save quiz. Please try again.");
      return false;
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Generate a Quiz</h2>
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
