import React, { useState, useEffect } from "react";
import { api, Quiz } from "@/services/quizService";

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
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto rounded-lg">
      <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4">
        My Quizzes
      </h2>
      {quizzes.length === 0 ? (
        <p className="text-center text-gray-700">
          You haven't created any quizzes yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li
              key={quiz._id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {quiz.name}
              </h3>
              <p className="text-sm text-gray-600">
                Created on: {new Date(quiz.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Number of questions: {quiz.questions.length}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserQuizzes;
