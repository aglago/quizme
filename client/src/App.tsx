import React, { useEffect, useState } from "react";
import FileUpload from "./FileUpload";

const App: React.FC = () => {
  interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
  }

  const [questions, setQuestions] = useState<Question[]>([]);

  const handleUploadSuccess = (generatedQuestions: []) => {
    setQuestions(generatedQuestions);

    // You can do additional things here, like navigating to a quiz page
  };

  useEffect(() => { 
    console.log(questions);
  }, [questions]);

  return (
    <div className="App">
      <h1>Quiz Generator</h1>
      <FileUpload onUploadSuccess={handleUploadSuccess} />
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
