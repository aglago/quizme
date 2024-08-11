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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>My Quizzes</h2>
      {quizzes.length === 0 ? (
        <p>You haven't created any quizzes yet.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz._id}>
              <h3>{quiz.name}</h3>
              {/* <p>Created on: {new Date(quiz.createdAt).toLocaleDateString()}</p> */}
              <p>Number of questions: {quiz.questions.length}</p>
              {/* Add more details or a link to view/edit the quiz */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserQuizzes;
