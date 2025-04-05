// app/dashboard/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { QuizResult, TopicMastery } from '@/app/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceData {
  _id: string;
  userId: string;
  quizResults: QuizResult[];
  topicMastery: TopicMastery[];
  studyTime: {
    daily: { date: string; minutes: number }[];
    totalHours: number;
  };
}

const AnalyticsPage = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics/performance');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const data = await response.json();
        setPerformanceData(data.data || null);
    } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
       finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const studyTimeData = {
    labels: performanceData?.studyTime.daily.map(day => new Date(day.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Daily Study Time (minutes)',
        data: performanceData?.studyTime.daily.map(day => day.minutes) || [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Study Time',
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Analytics</h1>

      {loading && <p>Loading analytics data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && performanceData && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Study Time</h2>
          <div>
            {studyTimeData.labels.length > 0 ? (
              <Bar options={options} data={studyTimeData} />
            ) : (
              <p>No study time data available.</p>
            )}
          </div>
          <p>Total Study Time: {performanceData.studyTime.totalHours} hours</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;