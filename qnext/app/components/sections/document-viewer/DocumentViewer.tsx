// app/components/document-viewer/DocumentViewer.tsx
'use client';

import { useState } from 'react';
import { Document as DocumentType, Highlight } from '@/app/types';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentViewerProps {
  document: DocumentType;
  onAddHighlight?: (highlight: Omit<Highlight, 'pageNumber'> & { pageNumber: number }) => Promise<void>;
  onRemoveHighlight?: (highlightId: string) => Promise<void>;
}

interface PdfDocumentInfo {
  numPages: number;
}

export default function DocumentViewer({ 
  document, 
  onAddHighlight,
//   onRemoveHighlight 
}: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isAddingHighlight, setIsAddingHighlight] = useState<boolean>(false);
  const [highlightColor, setHighlightColor] = useState<string>('#FFEB3B');
  const [note, setNote] = useState<string>('');

  const onDocumentLoadSuccess = ({ numPages }: PdfDocumentInfo) => {
    setNumPages(numPages);
  };

  const handlePreviousPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.6));
  };

  const handleAddHighlight = async (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingHighlight || !onAddHighlight) return;

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scale;
    const y = (event.clientY - rect.top) / scale;

    const highlight: Omit<Highlight, 'pageNumber'> & { pageNumber: number } = {
      pageNumber,
      position: {
        x,
        y,
        width: 100,
        height: 20,
      },
      color: highlightColor,
      note,
    };

    await onAddHighlight(highlight);
    setIsAddingHighlight(false);
    setNote('');
  };

  const renderHighlights = () => {
    if (!document.highlights) return null;

    const pageHighlights = document.highlights.filter(h => h.pageNumber === pageNumber);

    return pageHighlights.map((highlight, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: highlight.position.x * scale,
          top: highlight.position.y * scale,
          width: highlight.position.width * scale,
          height: highlight.position.height * scale,
          backgroundColor: highlight.color + '80', // Add transparency
          cursor: 'pointer',
        }}
        title={highlight.note || 'Highlight'}
      />
    ));
  };

  if (document.fileType !== 'pdf') {
    return (
      <div className="p-4 border rounded-lg">
        <p>Preview not available for this file type. <a href={document.fileUrl} download className="text-blue-600 hover:underline">Download file</a></p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 p-2 bg-gray-100 rounded-lg">
        <div className="flex space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-white border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 bg-white border rounded-md disabled:opacity-50"
          >
            Next
          </button>
          <span className="px-3 py-1">
            Page {pageNumber} of {numPages}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleZoomOut}
            className="px-3 py-1 bg-white border rounded-md"
          >
            -
          </button>
          <span className="px-3 py-1">{Math.round(scale * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="px-3 py-1 bg-white border rounded-md"
          >
            +
          </button>
        </div>
        {onAddHighlight && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsAddingHighlight(!isAddingHighlight)}
              className={`px-3 py-1 border rounded-md ${
                isAddingHighlight ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              {isAddingHighlight ? 'Cancel' : 'Add Highlight'}
            </button>
            {isAddingHighlight && (
              <input
                type="color"
                value={highlightColor}
                onChange={(e) => setHighlightColor(e.target.value)}
                className="w-8 h-8 border rounded"
              />
            )}
          </div>
        )}
      </div>

      {isAddingHighlight && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 mb-2">
            Click on the document to add a highlight. You can add a note to the highlight below:
          </p>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      )}

      <div className="flex-1 overflow-auto relative" onClick={handleAddHighlight}>
        <Document
          file={document.fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="text-center py-8">Loading document...</div>}
          error={<div className="text-center py-8 text-red-600">Failed to load document</div>}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
          {renderHighlights()}
        </Document>
      </div>
    </div>
  );
}