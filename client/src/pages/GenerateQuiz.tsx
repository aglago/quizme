import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Save } from "lucide-react";
import QuizGenerator from "../components/QuizGenerator";
import {
  QuizPreferences,
  QuizQuestion,
  saveQuizToBackend,
} from "../services/quizService";

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
      alert("Please enter a name for your quiz.");
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <QuizGenerator onQuizGenerated={handleUploadSuccess} />

      {isDialogOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              Quiz Generated Successfully!
            </h2>
            <p className="mb-4">
              What would you like to do with your new quiz?
            </p>
            <input
              type="text"
              placeholder="Enter quiz name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveLater}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Save className="mr-2" size={18} />
                Save for Later
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayNow}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Play className="mr-2" size={18} />
                Play Now
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GenerateQuiz;
