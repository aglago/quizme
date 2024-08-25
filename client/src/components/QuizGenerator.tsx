import React, { useState, useRef, useEffect } from "react";
import { api, generateQuiz } from "../services/quizService";
import { QuizPreferences, QuizQuestion } from "../services/quizService";
import { useQuizPreferences } from "@/hooks/useQuizPreferences";
import QuizPreferencesForm from "./QuizPreferences";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Upload, Play, AlertCircle, Loader } from "lucide-react";
import { toast } from "./ui/use-toast";

interface QuizGeneratorProps {
  onQuizGenerated: (
    questions: QuizQuestion[],
    preferences: QuizPreferences
  ) => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onQuizGenerated }) => {
  const [textInput, setTextInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { quizPreferences, setQuizPreferences } = useQuizPreferences();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await api.get("/auth/check-auth", { withCredentials: true });
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const handleTextInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextInput(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!textInput && !file) {
      setTextInput("general knowledge");
    }

    setIsGenerating(true);
    setError(null);

    try {
      let content = textInput;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse = await api.post("/quiz/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        content = uploadResponse.data;
      }

      const questions = await generateQuiz(content, quizPreferences);
      if (questions.length <= 0) toast({
        title: "Error",
        description: "An erro occurred while generating, please try again",
        variant: "error",
      });
      else if (questions.length > 0) onQuizGenerated(questions, quizPreferences);
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreferenceChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setQuizPreferences((prev) => ({
      ...prev,
      [name]:
        name === "questionCount"
          ? parseInt(value, 10)
          : name === "questionTypes"
          ? [value]
          : value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">
        Generate a New Quiz
      </h1>
      <div className="mb-6">
        <textarea
          name="text for quiz generation"
          value={textInput}
          onChange={handleTextInputChange}
          placeholder="Enter text for quiz generation or attach a file"
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          rows={6}
        />
        <div className="flex items-center mt-4">
          <input
            type="file"
            title="Upload file..."
            name="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.pdf,.docx,.pptx"
            className="hidden"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out flex items-center"
          >
            {file ? <FileText className="mr-2" /> : <Upload className="mr-2" />}
            {file ? file.name : "Attach file"}
          </motion.button>
        </div>
      </div>

      <QuizPreferencesForm
        preferences={quizPreferences}
        onPreferenceChange={handlePreferenceChange}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        className="mt-6 py-3 px-6 bg-green-500 text-white font-semibold rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition duration-300 ease-in-out flex items-center justify-center"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
            Generating Quiz...
          </>
        ) : (
          <>
            <Play className="mr-2" />
            Generate Quiz
          </>
        )}
      </motion.button>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-red-600 flex items-center"
        >
          <AlertCircle className="mr-2" />
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default QuizGenerator;
