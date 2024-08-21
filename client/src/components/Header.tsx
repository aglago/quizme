import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Header: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  if (isLoading) {
    return <header>Loading...</header>;
  }

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 shadow-lg relative">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          QuizMe
        </Link>

        <nav className="hidden md:flex space-x-4">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">Home</Link>
              <Link to="/generate-quiz">Generate Quiz</Link>
              <Link to="/my-quizzes">My Quizzes</Link>
              <Link to="/profile">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign Up</Link>
            </>
          )}
        </nav>

        {isLoggedIn && (
          <button
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}
      </div>

      {isLoggedIn && menuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col items-center py-4 space-y-4">
            <Link to="/dashboard" onClick={toggleMenu}>
              Dashboard
            </Link>
            <Link to="/generate-quiz" onClick={toggleMenu}>
              Generate Quiz
            </Link>
            <Link to="/my-quizzes" onClick={toggleMenu}>
              My Quizzes
            </Link>
            <Link to="/profile" onClick={toggleMenu}>
              Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
