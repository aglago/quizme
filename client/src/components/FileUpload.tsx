import React, { useState, useRef } from "react";
import axios from "axios";
import { generateQuiz } from "../services/quizService";
import { QuizPreferences, QuizQuestion } from "../services/quizService";

interface FileUploadProps {
  onQuizGenerated: (questions: QuizQuestion[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onQuizGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [quizPreferences, setQuizPreferences] = useState<QuizPreferences>({
    questionCount: 10,
    questionTypes: ["multiple-choice"],
    difficultyLevel: "medium",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload file and extract text
      const uploadResponse = await axios.post(
        "http://localhost:3000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const extractedText = uploadResponse.data;      

      // Generate quiz using the extracted text
      const questions = await generateQuiz(extractedText, quizPreferences);
      console.log(questions);

      onQuizGenerated(questions);
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading file or generating quiz:", error);
      setError("Failed to upload file or generate quiz. Please try again.");
      setIsUploading(false);
    }
  };

  const handlePreferenceChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setQuizPreferences((prev) => ({
      ...prev,
      [name]: name === "questionCount" ? parseInt(value, 10) : value,
    }));
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        name="file"
        title="Upload file..."
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt,.pdf,.docx"
        className="hidden"
      />
      <button type="submit" onClick={() => fileInputRef.current?.click()}>
        Select File
      </button>
      {fileName && <p>Selected file: {fileName}</p>}

      <div className="quiz-preferences">
        <label>
          Number of Questions:
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
          Question Type:
          <select
            name="questionTypes"
            value={quizPreferences.questionTypes[0]}
            onChange={handlePreferenceChange}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="fill-in-the-blank">Fill in the Blank</option>
            <option value="essay">Essay</option>
            <option value="mixed">Mixed</option>
          </select>
        </label>
        <label>
          Difficulty Level:
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

      <button
        type="submit"
        onClick={handleUpload}
        disabled={!file || isUploading}
      >
        {isUploading ? "Generating Quiz..." : "Upload and Generate Quiz"}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default FileUpload;
