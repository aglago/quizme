// app/dashboard/quizzes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Quiz } from '@/app/types';

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/quizzes');
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }
        const data = await response.json();
        setQuizzes(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Quizzes</h1>
      
      <div className="flex justify-between items-center mb-4">
        <Link href="/dashboard/quizzes/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create New Quiz
        </Link>
      </div>

      {loading && <p>Loading quizzes...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && quizzes.length === 0 && <p>No quizzes found. Create one!</p>}

      {!loading && !error && quizzes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
              <p className="text-gray-600">Description: {quiz.description || 'No description'}</p>
              <p className="text-gray-600">Created at: {new Date(quiz.createdAt).toLocaleDateString()}</p>
              <Link href={`/dashboard/quizzes/${quiz._id}`} className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                View Quiz
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizzesPage;