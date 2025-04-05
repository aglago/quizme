// app/components/study-planner/StudyPlanForm.tsx
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Document } from '@/app/types';

// Define form schema with Zod
const studyPlanSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  targetDate: z.string().min(1, 'Target date is required'),
  documents: z.array(z.string()).min(1, 'At least one document is required'),
  sessions: z.array(z.object({
    date: z.string().min(1, 'Session date is required'),
    duration: z.number().min(5, 'Minimum duration is 5 minutes').max(480, 'Maximum duration is 8 hours'),
    topics: z.string().optional(),
    activities: z.array(z.object({
      type: z.enum(['quiz', 'reading', 'flashcards', 'notes']),
      duration: z.number().min(5, 'Minimum duration is 5 minutes'),
    })).optional(),
  })).min(1, 'At least one session is required'),
});

// Infer TypeScript type from the schema
type StudyPlanFormValues = z.infer<typeof studyPlanSchema>;

// interface SessionFormValues {
//   date: string;
//   duration: number;
//   topics?: string;
//   activities?: Array<{
//     type: 'quiz' | 'reading' | 'flashcards' | 'notes';
//     duration: number;
//   }>;
// }

interface StudyPlanFormProps {
  documents: Document[];
  onSubmit: (values: StudyPlanFormValues) => Promise<void>;
}

export default function StudyPlanForm({ documents, onSubmit }: StudyPlanFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { register, control, handleSubmit, formState: { errors } } = useForm<StudyPlanFormValues>({
    resolver: zodResolver(studyPlanSchema),
    defaultValues: {
      title: '',
      targetDate: new Date().toISOString().split('T')[0],
      documents: [],
      sessions: [
        {
          date: new Date().toISOString().split('T')[0],
          duration: 60,
          topics: '',
          activities: [
            {
              type: 'reading',
              duration: 30,
            },
            {
              type: 'quiz',
              duration: 30,
            },
          ],
        },
      ],
    },
  });

  const { fields: sessionFields, append: appendSession, remove: removeSession } = useFieldArray({
    control,
    name: 'sessions',
  });

  const handleFormSubmit: SubmitHandler<StudyPlanFormValues> = async (data) => {
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

  const addSession = () => {
    appendSession({
      date: new Date().toISOString().split('T')[0],
      duration: 60,
      topics: '',
      activities: [
        {
          type: 'reading',
          duration: 30,
        },
      ],
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Create Study Plan</h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Plan Title
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
          <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-1">
            Target Completion Date
          </label>
          <input
            id="targetDate"
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('targetDate')}
          />
          {errors.targetDate && (
            <p className="mt-1 text-sm text-red-600">{errors.targetDate.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Documents
          </label>
          <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
            {documents.map((doc) => (
              <div key={doc._id} className="flex items-center py-1">
                <input
                  id={`document-${doc._id}`}
                  type="checkbox"
                  value={doc._id}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('documents')}
                />
                <label htmlFor={`document-${doc._id}`} className="ml-2 block text-sm text-gray-700">
                  {doc.title}
                </label>
              </div>
            ))}
          </div>
          {errors.documents && (
            <p className="mt-1 text-sm text-red-600">{errors.documents.message}</p>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium">Study Sessions</h3>
            <button
              type="button"
              onClick={addSession}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm"
            >
              Add Session
            </button>
          </div>
          
          {sessionFields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 rounded-md mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium">Session {index + 1}</h4>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeSession(index)}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label htmlFor={`sessions.${index}.date`} className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    id={`sessions.${index}.date`}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register(`sessions.${index}.date`)}
                  />
                  {errors.sessions?.[index]?.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.sessions[index]?.date?.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor={`sessions.${index}.duration`} className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    id={`sessions.${index}.duration`}
                    type="number"
                    min="5"
                    max="480"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register(`sessions.${index}.duration`, { valueAsNumber: true })}
                  />
                  {errors.sessions?.[index]?.duration && (
                    <p className="mt-1 text-sm text-red-600">{errors.sessions[index]?.duration?.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor={`sessions.${index}.topics`} className="block text-sm font-medium text-gray-700 mb-1">
                  Topics (comma separated, optional)
                </label>
                <input
                  id={`sessions.${index}.topics`}
                  type="text"
                  placeholder="e.g., Chapter 1, Introduction, Key concepts"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register(`sessions.${index}.topics`)}
                />
              </div>
            </div>
          ))}
          
          {errors.sessions && (
            <p className="mt-1 text-sm text-red-600">{errors.sessions.message}</p>
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
          {loading ? 'Creating Study Plan...' : 'Create Study Plan'}
        </button>
      </form>
    </div>
  );
}