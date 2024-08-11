import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/quizService";

const Header: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close menus when clicking outside
  const closeMenus = () => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  return (
    <header className="bg-blue-600 text-white py-4 shadow-lg relative">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl md:text-3xl font-bold">
          Quiz Generator
        </Link>

        {/* Desktop Navigation for Signed Out Users */}
        {!isLoggedIn && (
          <nav className="hidden md:flex space-x-4">
            <Link to="/login" className="hover:underline hover:text-blue-300">
              Login
            </Link>
            <Link
              to="/register"
              className="hover:underline hover:text-blue-300"
            >
              Register
            </Link>
          </nav>
        )}

        {/* Desktop Navigation for Signed In Users */}
        {isLoggedIn && (
          <>
            <nav className="hidden md:flex flex-row space-x-4">
              <Link to="/" className="hover:underline hover:text-blue-300">
                Home
              </Link>
              <Link
                to="/generate-quiz"
                className="hover:underline hover:text-blue-300"
              >
                Generate Quiz
              </Link>
              <Link
                to="/my-quizzes"
                className="hover:underline hover:text-blue-300"
              >
                My Quizzes
              </Link>
            </nav>
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="text-white focus:outline-none"
                aria-label="Toggle profile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A8.003 8.003 0 0112 16c1.77 0 3.4.57 4.879 1.533M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 2a10 10 0 00-6.363 17.804A10 10 0 1012 2z"
                  />
                </svg>
              </button>
              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-blue-100"
                    onClick={closeMenus}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-blue-100"
                    onClick={closeMenus}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Mobile Menu Button */}
        <button
          className="text-white md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav
            className="md:hidden flex flex-col items-start mt-4 md:mt-0 space-y-2"
            onClick={closeMenus}
          >
            {isLoggedIn ? (
              <>
                <Link to="/" className="hover:underline hover:text-blue-300">
                  Home
                </Link>
                <Link
                  to="/generate-quiz"
                  className="hover:underline hover:text-blue-300"
                >
                  Generate Quiz
                </Link>
                <Link
                  to="/my-quizzes"
                  className="hover:underline hover:text-blue-300"
                >
                  My Quizzes
                </Link>
                <Link
                  to="/profile"
                  className="hover:underline hover:text-blue-300"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="hover:underline hover:text-blue-300"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left hover:underline hover:text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:underline hover:text-blue-300"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hover:underline hover:text-blue-300"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
