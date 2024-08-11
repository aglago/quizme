import React, { useState, useRef, useEffect } from "react";
import { api, generateQuiz } from "../services/quizService";
import { QuizPreferences, QuizQuestion } from "../services/quizService";
import { useQuizPreferences } from "@/hooks/useQuizPreferences";
import QuizPreferencesForm from "./QuizPreferences";
import { useNavigate } from "react-router-dom";

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
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return null; // The navigate in useEffect will redirect, so we don't need to render anything here
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
      onQuizGenerated(questions, quizPreferences);
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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Generate Quiz</h2>

      <div className="mb-6">
        <textarea
          name="text for quiz generation"
          value={textInput}
          onChange={handleTextInputChange}
          placeholder="Enter text for quiz generation or attach a file"
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center mt-4">
          <input
            type="file"
            title="Upload file..."
            name="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.pdf,.docx"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {file ? "File attached" : "Attach file"}
          </button>
        </div>
      </div>

      <QuizPreferencesForm
        preferences={quizPreferences}
        onPreferenceChange={handlePreferenceChange}
      />

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        className="mt-6 py-2 px-6 bg-green-500 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
      >
        {isGenerating ? "Generating Quiz..." : "Generate Quiz"}
      </button>

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default QuizGenerator;
