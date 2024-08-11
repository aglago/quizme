import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GenerateQuiz from "./pages/GenerateQuiz";
import OngoingQuiz from "./pages/OnGoingQuiz";
import { QuizPreferencesProvider } from "./contexts/QuizPreferencesContext";
import PlayQuiz from "./components/PlayQuiz";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import UserQuizzes from "./components/UserQuizzes";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <QuizPreferencesProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/generate-quiz" element={<GenerateQuiz />} />
            <Route path="/quiz" element={<OngoingQuiz />} />
            <Route path="/quiz/:id" element={<PlayQuiz />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/my-quizzes" element={<UserQuizzes />} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </QuizPreferencesProvider>
  );
};

export default App;
