// app/components/forms/DocumentUploadForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileType } from '@/app/types';

// Define form schema with Zod
const documentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  tags: z.string().optional(),
  isPublic: z.boolean(),
});

// Infer TypeScript type from the schema
type DocumentFormValues = z.infer<typeof documentSchema>;

// Define props type
interface DocumentUploadFormProps {
  onSuccess?: () => void;
}

// Define API response type
interface UploadResponse {
  fileUrl: string;
  fileType: FileType;
  error?: string;
}

// Define document creation response
interface CreateDocumentResponse {
  data?: {
    _id: string;
    title: string;
    fileUrl: string;
  };
  error?: string;
  status: number;
}

export default function DocumentUploadForm({ onSuccess }: DocumentUploadFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fix the type issue by explicitly typing the form with DocumentFormValues
  const { register, handleSubmit, formState: { errors } } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      isPublic: false,
    },
  });

  // Make sure the onSubmit handler matches the DocumentFormValues type
  const onSubmit: SubmitHandler<DocumentFormValues> = async (data) => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to S3 or your storage service
      const uploadResponse = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const { fileUrl, fileType, error: uploadError }: UploadResponse = await uploadResponse.json();
      
      if (uploadError) {
        throw new Error(uploadError);
      }

      // Create document in database
      const documentResponse = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description || '',
          fileUrl,
          fileType,
          tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
          isPublic: data.isPublic,
        }),
      });

      if (!documentResponse.ok) {
        throw new Error('Failed to create document');
      }

      const createResult: CreateDocumentResponse = await documentResponse.json();
      
      if (createResult.error) {
        throw new Error(createResult.error);
      }

      // Reset form and state
      setFile(null);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Refresh documents list
      router.refresh();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
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
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            Document File (PDF, DOCX, TXT)
          </label>
          <input
            id="file"
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {file && (
            <p className="mt-1 text-sm text-green-600">Selected: {file.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma separated, optional)
          </label>
          <input
            id="tags"
            type="text"
            placeholder="e.g., study, math, biology"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('tags')}
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="isPublic"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            {...register('isPublic')}
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
            Make document public
          </label>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={uploading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </div>
  );
}