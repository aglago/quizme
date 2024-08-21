import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/quizService";

const Header: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);
  const closeProfileMenu = () => setProfileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate("/");
      closeProfileMenu();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
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
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="animate-pulse h-8 w-32 bg-white bg-opacity-30 rounded"></div>
        </div>
      </header>
    );
  }

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

        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="hidden md:inline-block hover:text-blue-200 transition duration-300"
              >
                Home
              </Link>
              <Link
                to="/generate-quiz"
                className="hidden md:inline-block hover:text-blue-200 transition duration-300"
              >
                Generate Quiz
              </Link>
              <Link
                to="/my-quizzes"
                className="hidden md:inline-block hover:text-blue-200 transition duration-300"
              >
                My Quizzes
              </Link>
              <div className="relative hidden md:block" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 text-white focus:outline-none transition duration-300 hover:text-blue-200"
                  aria-label="Toggle profile menu"
                  aria-expanded={profileMenuOpen}
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
                  </svg>
                  <span>Profile</span>
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50 overflow-hidden transition-all duration-300 ease-in-out">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-blue-100 transition duration-300"
                      onClick={closeProfileMenu}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 hover:bg-blue-100 transition duration-300"
                      onClick={closeProfileMenu}
                    >
                      Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-red-100 transition duration-300"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              {/* Mobile Menu Button (only for logged-in users) */}
              <button
                type="button"
                className="md:hidden transition duration-300 hover:text-blue-200 focus:outline-none"
                onClick={toggleMenu}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
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
                className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Menu (only for logged-in users) */}
      {isLoggedIn && (
        <div
          ref={menuRef}
          className={`md:hidden absolute top-full left-0 right-0 bg-blue-600 bg-opacity-95 backdrop-filter backdrop-blur-sm transition-all duration-300 ease-in-out ${
            menuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <nav className="flex flex-col items-center py-4 space-y-4">
            <Link
              to="/dashboard"
              className="hover:text-blue-200 transition duration-300"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/generate-quiz"
              className="hover:text-blue-200 transition duration-300"
              onClick={toggleMenu}
            >
              Generate Quiz
            </Link>
            <Link
              to="/my-quizzes"
              className="hover:text-blue-200 transition duration-300"
              onClick={toggleMenu}
            >
              My Quizzes
            </Link>
            <Link
              to="/profile"
              className="hover:text-blue-200 transition duration-300"
              onClick={toggleMenu}
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className="hover:text-blue-200 transition duration-300"
              onClick={toggleMenu}
            >
              Settings
            </Link>
            <button
              type="button"
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="text-red-300 hover:text-red-100 transition duration-300"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
