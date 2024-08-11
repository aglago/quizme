import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QuizInterface from "./QuizInterface";
import {
  api,
  Quiz,
  QuizResults,
} from "../services/quizService";



const PlayQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(
          `/quiz/unplayed-quizzes/quiz/${id}`
        );
        setQuiz(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch quiz");
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
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!quiz) return <div>No quiz found</div>;

  return (
    <div>
      <h2>{quiz.name}</h2>
      <QuizInterface
        questions={quiz.questions}
        onComplete={handleQuizComplete}
      />
    </div>
  );
};

export default PlayQuiz;
