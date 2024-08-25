import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QuizGenerator from "../components/QuizGenerator";
import {
  QuizPreferences,
  QuizQuestion,
  saveQuizToBackend,
} from "../services/quizService";
import QuizGeneratedModal from "@/components/QuizGeneratedModal";
import { toast } from "@/components/ui/use-toast";

const GenerateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>(
    []
  );
  const [preferences, setPreferences] = useState<QuizPreferences>({
    questionCount: 10,
    questionTypes: ["multiple-choice"],
    difficultyLevel: "medium",
  });
  const [quizName, setQuizName] = useState("");

  const handleUploadSuccess = (
    questions: QuizQuestion[],
    prefs: QuizPreferences
  ) => {
    setGeneratedQuestions(questions);
    setPreferences(prefs);
    setIsDialogOpen(true);
  };

  const handleSaveLater = async () => {
    if (quizName.trim() === "") {
      toast({
        title: "Name cannot be empty",
        description:
          "Please enter a name for this quiz",
        variant: "info",
      });
      return;
    }
    const played = false;
    await saveQuizToBackend(quizName, preferences, generatedQuestions, played);
    setIsDialogOpen(false);
    navigate("/dashboard");
  };

  const handlePlayNow = () => {
    setIsDialogOpen(false);
    navigate("/quiz", { state: { questions: generatedQuestions } });
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <QuizGenerator onQuizGenerated={handleUploadSuccess} />

      {isDialogOpen &&
        (<QuizGeneratedModal
          onClose={handleClose}
          quizName={quizName}
          setQuizName={setQuizName}
          handleSaveLater={handleSaveLater}
          handlePlayNow={handlePlayNow}
        />)}
    </motion.div>
  );
};

export default GenerateQuiz;
