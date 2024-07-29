import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import QuizInterface from "./components/QuizInterface";
import { QuizQuestion } from "./services/quizService";

const App: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleUploadSuccess = (generatedQuestions: QuizQuestion[]) => {
    setQuestions(generatedQuestions);
    setQuizStarted(true);
  };

  return (
    <div className="App">
      <h1>Quiz Generator</h1>
      {!quizStarted ? (
        <FileUpload onQuizGenerated={handleUploadSuccess} />
      ) : (
        <QuizInterface questions={questions} />
      )}
    </div>
  );
};

export default App;
