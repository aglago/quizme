import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-blue-500 to-purple-600 min-h-screen text-white">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">Learn, Quiz, Excel</h2>
          <p className="text-xl mb-8">
            Create and take quizzes on any topic. Boost your knowledge and have
            fun!
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300"
          >
            Get Started
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Create Quizzes</h3>
            <p>
              Easily create custom quizzes on any topic. Perfect for educators,
              students, and curious minds.
            </p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Take Quizzes</h3>
            <p>
              Challenge yourself with a wide variety of quizzes. Learn new
              things and test your knowledge.
            </p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Track Progress</h3>
            <p>
              Monitor your improvement over time. See your scores and identify
              areas for growth.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-3xl font-semibold mb-4">
            Ready to start quizzing?
          </h3>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300"
          >
            Sign Up Now
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
