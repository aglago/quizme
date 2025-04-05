// app/dashboard/documents/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Document } from "@/app/types";
import DocumentUploadForm from "@/app/components/sections/forms/DocumentUploadForm";
import DocumentList from "@/app/components/sections/document-viewer/DocumentList";

const DocumentsPage = () => {
  const [selectedTab, setSelectedTab] = useState("personal");
  const [publicFilter, setPublicFilter] = useState(""); // For filtering public documents
  const [personalDocuments, setPersonalDocuments] = useState<Document[]>([]);
  const [publicDocuments, setPublicDocuments] = useState<Document[]>([]);
  const [savedDocuments, setSavedDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonalDocuments = async () => {
      try {
        const response = await fetch("/api/documents");
        if (!response.ok) {
          throw new Error("Failed to fetch personal documents");
        }
        const data = await response.json();
        setPersonalDocuments(data.data || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    const fetchPublicDocuments = async () => {
      try {
        const response = await fetch(
          `/api/documents/public?filter=${publicFilter}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch public documents");
        }
        const data = await response.json();
        setPublicDocuments(data.data || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    const fetchSavedDocuments = async () => {
      try {
        const response = await fetch("/api/user/saved-documents");
        if (!response.ok) {
          throw new Error("Failed to fetch saved documents");
        }
        const data = await response.json();
        setSavedDocuments(data.data || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchPersonalDocuments();
    fetchPublicDocuments();
    fetchSavedDocuments();
  }, [publicFilter]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Document Library</h1>
      {error && (
        <div className="mb-4 text-red-600 bg-red-100 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <button
          className={`px-4 py-2 rounded-md ${
            selectedTab === "personal"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setSelectedTab("personal")}
        >
          Personal Library
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            selectedTab === "public"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setSelectedTab("public")}
        >
          Public Library
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            selectedTab === "saved"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setSelectedTab("saved")}
        >
          Saved Documents
        </button>
      </div>

      {selectedTab === "personal" && (
        <div>
          <DocumentUploadForm />
          <DocumentList documents={personalDocuments} isPublic={false} />
        </div>
      )}

      {selectedTab === "public" && (
        <div>
          <div className="mb-4">
            <label
              htmlFor="publicFilter"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Filter by:
            </label>
            <select
              id="publicFilter"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setPublicFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="book">Books</option>
              <option value="past question">Past Questions</option>
              <option value="handout">Handouts</option>
              <option value="slides">Slides</option>
            </select>
          </div>
          <DocumentList documents={publicDocuments} isPublic={true} />
        </div>
      )}

      {selectedTab === "saved" && (
        <div>
          <h2>Saved Documents</h2>
          <DocumentList documents={savedDocuments} isPublic={true} />
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
