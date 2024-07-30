import React from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import { QuizQuestion } from "../services/quizService";
import axios from "axios";

const GenerateQuiz: React.FC = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = async (generatedQuestions: QuizQuestion[]) => {
    const saveQuiz = window.confirm("Do you want to save this quiz for later?");

    if (saveQuiz) {
      const quizName = prompt("Enter a name for this quiz:");
      if (quizName) {
        await saveQuizToBackend(quizName, generatedQuestions);
      }
    }

    const playNow = window.confirm("Do you want to play this quiz now?");
    if (playNow) {
      navigate("/quiz", { state: { questions: generatedQuestions } });
    } else {
      navigate("/");
    }
  };

  const saveQuizToBackend = async (name: string, questions: QuizQuestion[]) => {
    try {
      await axios.post("/api/save-quiz", { name, questions });
      alert("Quiz saved successfully!");
    } catch (error) {
      console.error("Failed to save quiz:", error);
      alert("Failed to save quiz. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Generate a Quiz</h2>
      <FileUpload onQuizGenerated={handleUploadSuccess} />
    </div>
  );
};

export default GenerateQuiz;
