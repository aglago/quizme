import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, PlayCircle, BookOpen, Award, Loader } from "lucide-react";
import UnplayedQuizzes from "@/components/UnplayedQuizzes";
import { useAuth } from "@/hooks/useAuth";

const Dashboard: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-10"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-gray-800">
        Welcome to Quizme
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8 text-center">
        Create, play, and manage your quizzes with ease!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/generate-quiz"
            className="flex flex-col items-center justify-center bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
          >
            <PlusCircle size={48} className="mb-4" />
            <span className="text-xl font-semibold">Generate a Quiz</span>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/my-quizzes"
            className="flex flex-col items-center justify-center bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
          >
            <PlayCircle size={48} className="mb-4" />
            <span className="text-xl font-semibold">Play My Quizzes</span>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/leaderboard"
            className="flex flex-col items-center justify-center bg-purple-500 text-white p-6 rounded-lg shadow-lg hover:bg-purple-600 transition duration-300"
          >
            <Award size={48} className="mb-4" />
            <span className="text-xl font-semibold">Leaderboard</span>
          </Link>
        </motion.div>
      </div>

      {isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <BookOpen className="mr-2" /> Unplayed Quizzes
          </h2>
          <UnplayedQuizzes />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
