import React, { useState, useRef } from "react";
import axios from "axios";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";



interface FileUploadProps {
  onUploadSuccess: (questions: []) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        // generatePreview(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setError("Invalid file type. Please upload a PDF or PPTX file.");
        setFile(null);
        setPreview(null);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    return validTypes.includes(file.type);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/generate-quiz",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onUploadSuccess(response.data.questions);
    } catch (error) {
      setError("Error uploading file. Please try again.");
    }
  };

  return (
    <div>
      <input
        type="file"
        title="Upload learning material"
        placeholder="Upload learning material"
        accept=".pdf,.pptx"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      {preview && ""}
      {error && <div className="error">{error}</div>}
      <button type="submit" onClick={handleUpload} disabled={!file}>
        {" "}
        Upload and Generate Quiz
      </button>
    </div>
  );
};

export default FileUpload;
