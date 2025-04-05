// app/dashboard/study-plans/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudyPlan } from '@/app/types';

const StudyPlansPage = () => {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudyPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/study-plans');
        if (!response.ok) {
          throw new Error('Failed to fetch study plans');
        }
        const data = await response.json();
        setStudyPlans(data);
    } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudyPlans();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Study Plans</h1>
      
      <div className="flex justify-between items-center mb-4">
        <Link href="/dashboard/study-plans/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create New Study Plan
        </Link>
      </div>

      {loading && <p>Loading study plans...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && studyPlans.length === 0 && <p>No study plans found. Create one!</p>}

      {!loading && !error && studyPlans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studyPlans.map((plan) => (
            <div key={plan._id} className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>
              <p className="text-gray-600">Target Date: {new Date(plan.targetDate).toLocaleDateString()}</p>
              <p className="text-gray-600">Created at: {new Date(plan.createdAt).toLocaleDateString()}</p>
              <Link href={`/dashboard/study-plans/${plan._id}`} className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                View Study Plan
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyPlansPage;