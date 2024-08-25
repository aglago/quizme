import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
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
import NotFound from "./components/NotFound";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./components/Leaderboard";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();


const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <QuizPreferencesProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<LandingPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/generate-quiz" element={<GenerateQuiz />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/quiz" element={<OngoingQuiz />} />
                <Route path="/quiz/:id" element={<PlayQuiz />} />
                <Route path="/my-quizzes" element={<UserQuizzes />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate replace to="/404" />} />
          </Routes>
        </Router>
      </QuizPreferencesProvider>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;
