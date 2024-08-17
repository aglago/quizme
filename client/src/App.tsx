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
import Profile from "./components/Profile";
import Settings from "./components/Settings";

const App: React.FC = () => {
  return (
    <QuizPreferencesProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/generate-quiz" element={<GenerateQuiz />} />
              <Route path="/quiz" element={<OngoingQuiz />} />
              <Route path="/quiz/:id" element={<PlayQuiz />} />
              <Route path="/my-quizzes" element={<UserQuizzes />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
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
