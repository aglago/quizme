import React, { useState, useEffect } from "react";
import { api, Quiz } from "@/services/quizService";
import { motion } from "framer-motion";
import { Play, AlertCircle, Loader, Calendar, Hash, Award } from "lucide-react";

const UserQuizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get("/quiz/user-quizzes", {
          withCredentials: true,
        });
        setQuizzes(response.data);
      } catch (err) {
        setError("Failed to fetch quizzes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
      className="p-6 max-w-3xl mx-auto bg-white rounded-xl"
    >
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
        My Quizzes
      </h2>
      {quizzes.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          You haven't created any quizzes yet.
        </p>
      ) : (
        <ul className="space-y-6">
          {quizzes.map((quiz, index) => (
            <motion.li
              key={quiz._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {quiz.name}
              </h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <Calendar className="mr-2" size={18} />
                  Created on: {new Date(quiz.createdAt).toLocaleDateString()}
                </p>
                <p className="flex items-center">
                  <Hash className="mr-2" size={18} />
                  Number of questions: {quiz.questions.length}
                </p>
                <p className="flex items-center">
                  <Award className="mr-2" size={18} />
                  Best Score:{" "}
                  {quiz.bestScore
                    ? `${Math.round(quiz.bestScore)}%`
                    : "No score yet"}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = `/quiz/${quiz._id}`)}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                <Play className="mr-2" size={18} />
                Play Again
              </motion.button>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default UserQuizzes;
