// app/components/quiz/QuizForm.tsx
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Document } from '@/app/types';

// Define form schema with Zod
const quizSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  documentId: z.string().min(1, 'Document is required'),
  numQuestions: z.number().min(1).max(50),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  questionTypes: z.array(z.enum(['multiple-choice', 'true-false', 'short-answer'])).min(1),
});

// Infer TypeScript type from the schema
type QuizFormValues = z.infer<typeof quizSchema>;

interface QuizFormProps {
  documents: Document[];
  onSubmit: (values: QuizFormValues) => Promise<void>;
}

export default function QuizForm({ documents, onSubmit }: QuizFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      documentId: '',
      numQuestions: 10,
      difficulty: 'medium',
      questionTypes: ['multiple-choice'],
    },
  });

  const handleFormSubmit: SubmitHandler<QuizFormValues> = async (data) => {
    try {
      setLoading(true);
      setError(null);
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Create Quiz</h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Quiz Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('title')}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('description')}
          />
        </div>
        
        <div>
          <label htmlFor="documentId" className="block text-sm font-medium text-gray-700 mb-1">
            Select Document
          </label>
          <select
            id="documentId"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('documentId')}
          >
            <option value="">Select a document</option>
            {documents.map((doc) => (
              <option key={doc._id} value={doc._id}>{doc.title}</option>
            ))}
          </select>
          {errors.documentId && (
            <p className="mt-1 text-sm text-red-600">{errors.documentId.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Questions
          </label>
          <input
            id="numQuestions"
            type="number"
            min="1"
            max="50"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('numQuestions', { valueAsNumber: true })}
          />
          {errors.numQuestions && (
            <p className="mt-1 text-sm text-red-600">{errors.numQuestions.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            id="difficulty"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('difficulty')}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Types
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="multiple-choice"
                type="checkbox"
                value="multiple-choice"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                {...register('questionTypes')}
              />
              <label htmlFor="multiple-choice" className="ml-2 block text-sm text-gray-700">
                Multiple Choice
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="true-false"
                type="checkbox"
                value="true-false"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                {...register('questionTypes')}
              />
              <label htmlFor="true-false" className="ml-2 block text-sm text-gray-700">
                True/False
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="short-answer"
                type="checkbox"
                value="short-answer"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                {...register('questionTypes')}
              />
              <label htmlFor="short-answer" className="ml-2 block text-sm text-gray-700">
                Short Answer
              </label>
            </div>
          </div>
          {errors.questionTypes && (
            <p className="mt-1 text-sm text-red-600">Select at least one question type</p>
          )}
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Creating Quiz...' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
}