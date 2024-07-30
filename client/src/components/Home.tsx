import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-4">Welcome to Quiz Generator</h2>
      <Link
        to="/generate"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Generate a Quiz
      </Link>
      {/* Add other options here */}
    </div>
  );
};

export default Home;
