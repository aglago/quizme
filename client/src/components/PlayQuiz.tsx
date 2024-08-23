import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuizInterface from "./QuizInterface";
import { api, Quiz, QuizResults } from "../services/quizService";
import { Loader } from "lucide-react";

const PlayQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quiz/unplayed-quizzes/quiz/${id}`);
        setQuiz(response.data);
      } catch (err) {
        setError("Failed to fetch quiz. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleQuizComplete = async (results: QuizResults) => {
    try {
      await api.post(`/quiz/unplayed-quizzes/quiz/${id}/complete`, { results });
    } catch (err) {
      console.error("Failed to save quiz results:", err);
      setError("Failed to save quiz results. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Quiz Found
          </h2>
          <p className="text-gray-700 mb-4">
            Sorry, we couldn't find the quiz you're looking for.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-50 py-6 px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center">
            {quiz.name}
          </h2>
        </div>
        <div className="p-6">
          <QuizInterface
            questions={quiz.questions}
            onComplete={handleQuizComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayQuiz;
