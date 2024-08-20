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
    return <header>Loading...</header>;
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 shadow-lg relative">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold transition duration-300 hover:text-blue-200"
        >
          Quiz Generator
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {isLoggedIn ? (
            <>
              <Link
                to="/"
                className="hover:text-blue-200 transition duration-300"
              >
                Home
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
                  type="button"
                  onClick={toggleProfileMenu}
                  className="text-white focus:outline-none transition duration-300 hover:text-blue-200"
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
                className="hover:text-blue-200 transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="text-white md:hidden transition duration-300 hover:text-blue-200"
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
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="md:hidden absolute top-full left-0 right-0 bg-blue-600 bg-opacity-95 backdrop-filter backdrop-blur-sm transition-all duration-300 ease-in-out"
        >
          <nav className="flex flex-col items-center py-4 space-y-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/"
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
                  className="hover:text-blue-200 transition duration-300"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hover:text-blue-200 transition duration-300"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
