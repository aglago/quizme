import React from "react";
import { Link } from "react-router-dom";
import UnplayedQuizzes from "@/components/UnplayedQuizzes";
import { useAuth } from "@/hooks/useAuth";

const Dashboard: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center py-10 px-4">
      <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center">
        Welcome to Quizme
      </h2>
      <p className="text-base md:text-lg text-gray-700 mb-4 text-center">
        Create, play, and manage your quizzes with ease!
      </p>
      <Link
        to="/generate-quiz"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md mb-8"
      >
        Generate a Quiz
      </Link>
      {isLoggedIn && (
        <div className="w-full max-w-2xl">
          <UnplayedQuizzes />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
