// app/components/document-viewer/DocumentList.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Document, ApiResponse } from '@/app/types';

interface DocumentListProps {
  documents: Document[];
  isPublic?: boolean; // Indicate if it's a public list
}

export default function DocumentList({ documents, isPublic }: DocumentListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = Array.from(new Set(
    (documents || []).flatMap(doc => doc.tags) // Use || [] to default to empty array
  )).filter(Boolean);

  // Filter documents based on search query and selected tag
  const filteredDocuments = (documents || []).filter(doc => { // Use || [] here too
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === null || 
      doc.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data: ApiResponse<null> = await response.json();
        throw new Error(data.error || 'Failed to delete document');
      }
      
      // Refresh the page
      router.refresh();
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

  const handleSave = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/documents/${id}/save`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data: ApiResponse<null> = await response.json();
        throw new Error(data.error || 'Failed to save document');
      }
      
      // Refresh the page
      router.refresh();
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

  const handleUnsave = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/documents/${id}/unsave`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data: ApiResponse<null> = await response.json();
        throw new Error(data.error || 'Failed to unsave document');
      }
      
      // Refresh the page
      router.refresh();
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

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No documents to display.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <select
            value={selectedTag || ''}
            onChange={(e) => setSelectedTag(e.target.value || null)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map(doc => (
          <div key={doc._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2 truncate">{doc.title}</h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{doc.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {doc.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 mb-4">
                Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
              </p>
              
              <div className="flex space-x-2">
                <Link
                  href={`/dashboard/documents/${doc._id}`}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md text-center"
                >
                  View
                </Link>
                {!isPublic && (
                <button
                    onClick={() => handleDelete(doc._id)}
                    className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
                  >
                    Delete
                  </button>
                )}
                {isPublic && doc.isSaved ? (
                  <button
                    onClick={() => handleUnsave(doc._id)}
                    className="py-2 px-3 bg-yellow-500 hover:bg-yellow-700 text-white text-sm font-medium rounded-md"
                  >
                    Unsave
                  </button>
                ) : isPublic ? (
                  <button
                    onClick={() => handleSave(doc._id)}
                    className="py-2 px-3 bg-green-500 hover:bg-green-700 text-white text-sm font-medium rounded-md"
                  >
                    Save
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}