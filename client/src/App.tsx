import React, { useEffect, useState } from "react";
import FileUpload from "./components/FileUpload";
import { QuizQuestion } from "./services/quizService";

const App: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const handleUploadSuccess = (generatedQuestions: QuizQuestion[]) => {
    setQuestions(generatedQuestions);

    // You can do additional things here, like navigating to a quiz page
  };

  useEffect(() => { 
    console.log(questions);
  }, [questions]);

  return (
    <div className="App">
      <h1>Quiz Generator</h1>
      <FileUpload onQuizGenerated={handleUploadSuccess} />
      {questions.length > 0 && (
        <div>
          <h2>Generated Questions:</h2>
          {
            questions.map((question, index) => (
              <div key={index}>
                <h3>{question.question}</h3>
                <ul>
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex}>{option}</li>
                  ))}
                </ul>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default App;
