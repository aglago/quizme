import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Medal,
  Award,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  quizzesTaken: number;
}

const ITEMS_PER_PAGE = 10;

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "month" | "week">("all");

  useEffect(() => {
    // Fetch leaderboard data here
    // For now, we'll use mock data
    const mockData: LeaderboardEntry[] = Array.from({ length: 50 }, (_, i) => ({
      rank: i + 1,
      username: `User${i + 1}`,
      score: Math.floor(Math.random() * 10000),
      quizzesTaken: Math.floor(Math.random() * 100),
    }));
    setLeaderboardData(mockData);
  }, [filter]); // Refetch when filter changes

  const pageCount = Math.ceil(leaderboardData.length / ITEMS_PER_PAGE);
  const currentData = leaderboardData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-400" />;
    if (rank === 2) return <Medal className="text-gray-400" />;
    if (rank === 3) return <Award className="text-orange-400" />;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Leaderboard
      </h1>

      <div className="mb-6 flex justify-end">
        <div className="relative inline-block">
          <select
            name="criteria"
            title="criteria"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "month" | "week")
            }
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <Filter size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Score</th>
              <th className="px-4 py-2 text-left">Quizzes Taken</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {currentData.map((entry) => (
                <motion.tr
                  key={entry.rank}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="px-4 py-2 flex items-center">
                    {getRankIcon(entry.rank)}
                    <span className="ml-2">{entry.rank}</span>
                  </td>
                  <td className="px-4 py-2">{entry.username}</td>
                  <td className="px-4 py-2">{entry.score.toLocaleString()}</td>
                  <td className="px-4 py-2">{entry.quizzesTaken}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {pageCount}
        </span>
        <button
          onClick={() =>
            setCurrentPage((page) => Math.min(pageCount, page + 1))
          }
          disabled={currentPage === pageCount}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
