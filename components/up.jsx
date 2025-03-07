"use client";
import { useState } from "react";
import { UploadButton } from "@/lib/uploading";

export default function Home() {
  const [uploadStatus, setUploadStatus] = useState("");
  
  const handleUploadComplete = (res) => {
    setUploadStatus("Upload Completed! File URL: " + res.file.url);
  };

  const handleUploadError = (error) => {
    setUploadStatus("Upload Failed! Error: " + error.message);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-6">
      <h1 className="text-3xl font-semibold">Upload Your PDF</h1>
      
      <UploadButton
        endpoint="pdfUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
      
      {/* Display Upload Status */}
      <div className="mt-4">
        {uploadStatus && (
          <div
            className={`p-4 rounded-lg text-white ${uploadStatus.includes('Failed') ? 'bg-red-500' : 'bg-green-500'}`}
          >
            {uploadStatus}
          </div>
        )}
      </div>

      {/* Optionally, include a dropzone */}
      <div className="mt-6">
        <h2 className="text-xl font-medium">Or Drag and Drop Your PDF Here</h2>
        <UploadDropzone
          endpoint="pdfUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
      </div>
    </main>
  );
}
