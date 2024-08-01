import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GenerateQuiz from "./pages/GenerateQuiz";
import OngoingQuiz from "./pages/OnGoingQuiz";
import { QuizPreferencesProvider } from "./contexts/QuizPreferencesContext";
import PlayQuiz from "./components/PlayQuiz";

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
            <Route path="/quiz/:id" element={<PlayQuiz />} />
          </Routes>
        </div>
      </Router>
    </QuizPreferencesProvider>
  );
};

export default App;
