import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/quizService";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogOut, Settings, User } from "lucide-react";

const Header: React.FC = () => {
  const { isLoggedIn, isLoading, setIsLoggedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="animate-pulse h-8 w-32 bg-white bg-opacity-30 rounded"></div>
        </div>
      </header>
    );
  }

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate("/");
      setMenuOpen(false);
      setProfileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 shadow-lg relative">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold transition duration-300 hover:text-blue-200 flex items-center"
        >
          <svg
            className="w-8 h-8 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          QuizMe
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-blue-200 transition duration-300"
              >
                Dashboard
              </Link>
              <Link
                to="/generate-quiz"
                className="hover:text-blue-200 transition duration-300"
              >
                Generate Quiz
              </Link>
              <Link
                to="/my-quizzes"
                className="hover:text-blue-200 transition duration-300"
              >
                My Quizzes
              </Link>
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center hover:text-blue-200 transition duration-300"
                >
                  Profile
                  <ChevronDown size={20} className="ml-1" />
                </button>
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <User size={18} className="inline mr-2" /> Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Settings size={18} className="inline mr-2" /> Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut size={18} className="inline mr-2" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-200 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-500 px-4 py-2 rounded-full hover:bg-blue-100 transition duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <nav className="flex flex-col items-center py-4 space-y-4">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={toggleMenu}
                    className="hover:text-blue-200 transition duration-300"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/generate-quiz"
                    onClick={toggleMenu}
                    className="hover:text-blue-200 transition duration-300"
                  >
                    Generate Quiz
                  </Link>
                  <Link
                    to="/my-quizzes"
                    onClick={toggleMenu}
                    className="hover:text-blue-200 transition duration-300"
                  >
                    My Quizzes
                  </Link>
                  <Link
                    to="/profile"
                    onClick={toggleMenu}
                    className="hover:text-blue-200 transition duration-300"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={toggleMenu}
                    className="hover:text-blue-200 transition duration-300"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-300 hover:text-red-100 transition duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="hover:text-blue-200 transition duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMenu}
                    className="bg-white text-blue-500 px-4 py-1 rounded-full hover:bg-blue-100 transition duration-300"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
