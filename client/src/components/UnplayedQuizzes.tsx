import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/quizService";
import { motion } from "framer-motion";
import { Play, AlertCircle, Loader } from "lucide-react";

interface Quiz {
  _id: string;
  name: string;
  preferences: {
    questionCount: number;
    difficultyLevel: string;
  };
}

const UnplayedQuizzes: React.FC = () => {
  const [unplayedQuizzes, setUnplayedQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnplayedQuizzes = async () => {
      try {
        const response = await api.get("/quiz/unplayed-quizzes");
        setUnplayedQuizzes(response.data);
      } catch (error) {
        console.error("Failed to fetch unplayed quizzes:", error);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnplayedQuizzes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg">
        <AlertCircle className="inline-block mr-2" />
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 p-6 bg-white rounded-xl shadow-sm"
    >
      {unplayedQuizzes.length === 0 ? (
        <p className="text-gray-600 text-center">
          No unplayed quizzes available.
        </p>
      ) : (
        <ul className="space-y-4">
          {unplayedQuizzes.map((quiz) => (
            <motion.li
              key={quiz._id}
              whileHover={{ scale: 1.02 }}
              className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <h4 className="font-bold text-lg text-gray-800">{quiz.name}</h4>
              <p className="text-gray-600">
                Questions: {quiz.preferences.questionCount}
              </p>
              <p className="text-gray-600 capitalize">
                Difficulty: {quiz.preferences.difficultyLevel}
              </p>
              <Link
                to={`/quiz/${quiz._id}`}
                className="mt-3 inline-flex items-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300"
              >
                <Play className="mr-2" size={16} />
                Play Now
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default UnplayedQuizzes;
