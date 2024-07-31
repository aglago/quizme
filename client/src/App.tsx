import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import GenerateQuiz from "./components/GenerateQuiz";
import OngoingQuiz from "./components/OnGoingQuiz";
import { QuizPreferencesProvider } from "./contexts/QuizPreferencesContext";

const App: React.FC = () => {
  return (
    <QuizPreferencesProvider>
      <Router>
        <div className="App">
          <h1 className="text-3xl font-bold text-center my-4">
            Quiz Generator
          </h1>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<GenerateQuiz />} />
            <Route path="/quiz" element={<OngoingQuiz />} />
          </Routes>
        </div>
      </Router>
    </QuizPreferencesProvider>
  );
};

export default App;
