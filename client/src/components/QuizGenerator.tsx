import React, { useState, useRef } from "react";
import axios from "axios";
import { generateQuiz } from "../services/quizService";
import { QuizPreferences, QuizQuestion } from "../services/quizService";
import { useQuizPreferences } from "@/hooks/useQuizPreferences";

interface QuizGeneratorProps {
  onQuizGenerated: (questions: QuizQuestion[], preferences: QuizPreferences) => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onQuizGenerated}) => {
  const [textInput, setTextInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { quizPreferences, setQuizPreferences } = useQuizPreferences();

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
        const uploadResponse = await axios.post(
          "http://localhost:3000/api/quiz/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
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
    <div className="quiz-generator">
      <div className="input-area">
        <textarea
          name="text for quiz generation"
          value={textInput}
          onChange={handleTextInputChange}
          placeholder="Enter text for quiz generation or attach a file"
        />
        <div className="file-upload">
          <input
            type="file"
            title="Upload file..."
            name="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.pdf,.docx"
            className="hidden"
          />
          <button type="submit" onClick={() => fileInputRef.current?.click()}>
            {file ? "File attached" : "Attach file"}
          </button>
        </div>
      </div>

      <div className="quiz-preferences">
        <label>
          Questions:
          <input
            type="number"
            name="questionCount"
            value={quizPreferences.questionCount}
            onChange={handlePreferenceChange}
            min="1"
            max="50"
          />
        </label>
        <label>
          Type:
          <select
            name="questionTypes"
            value={quizPreferences.questionTypes[0]}
            onChange={handlePreferenceChange}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True or False</option>
            <option value="fill-in-the-blank">Fill in the Blank</option>
            <option value="theory">Theory</option>
            <option value="mixed">Mixed</option>
          </select>
        </label>
        <label>
          Difficulty:
          <select
            name="difficultyLevel"
            value={quizPreferences.difficultyLevel}
            onChange={handlePreferenceChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>

      <button type="submit" onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? "Generating Quiz..." : "Generate Quiz"}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default QuizGenerator;
