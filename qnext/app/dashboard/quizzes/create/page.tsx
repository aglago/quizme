// app/dashboard/quizzes/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Document } from '@/app/types';
import QuizForm from '@/app/components/sections/quiz/QuizForm';

const CreateQuizPage = () => {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/documents');
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        const data = await response.json();
        setDocuments(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch(`/api/documents/${values.documentId}/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create quiz');
      }

      // Redirect to the new quiz page
      const quizData = await response.json();
      router.push(`/dashboard/quizzes/${quizData._id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create Quiz</h1>

      {loading && <p>Loading documents...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <QuizForm documents={documents} onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default CreateQuizPage;