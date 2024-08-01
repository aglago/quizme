import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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

  useEffect(() => {
    const fetchUnplayedQuizzes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/quiz/unplayed-quizzes"
        );
        setUnplayedQuizzes(response.data);
      } catch (error) {
        console.error("Failed to fetch unplayed quizzes:", error);
      }
    };

    fetchUnplayedQuizzes();
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-xl mb-4">Unplayed Quizzes</h3>
      {unplayedQuizzes.length === 0 ? (
        <p>No unplayed quizzes available.</p>
      ) : (
        <ul className="space-y-2">
          {unplayedQuizzes.map((quiz) => (
            <li key={quiz._id} className="border p-4 rounded">
              <h4 className="font-bold">{quiz.name}</h4>
              <p>Questions: {quiz.preferences.questionCount}</p>
              <p>Difficulty: {quiz.preferences.difficultyLevel}</p>
              <Link
                to={`/quiz/${quiz._id}`}
                className="mt-2 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
              >
                Play Now
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UnplayedQuizzes;
