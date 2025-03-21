"use client"; // Ensure this is a client component

import React, { useState } from "react";
import UploadBtn from "./UploadBtn";
import Link from "next/link";
import { Eye, Plus, Trash, Loader2, MessageSquare, Ghost } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { deleteFile } from "@/actions/dbActions";

const Dashboard = ({ files: initialFiles }) => {
  const [files, setFiles] = useState(initialFiles); // Local state to manage files
  const [deletingFileId, setDeletingFileId] = useState(null); // Track file being deleted

  //  Function to handle file deletion
  const handleDeleteFile = async (fileId) => {
    if (!fileId) return;

    setDeletingFileId(fileId); // Show loading state
    const response = await deleteFile(fileId); // Call server action

    if (response.success) {
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId)); // Remove file from UI
    } else {
      alert(response.message);
    }

    setDeletingFileId(null);
  };

  return (
    <main className="mx-10 max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>
        {/* <UploadBtn /> */}
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">
          My Documents...
        </h2>
        {files && files.length !== 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <li className="border-2 border-orange-400 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-orange-600 cursor-pointer hover:bg-orange-50">
              {/* <Plus className="h-8 w-8" /> */}
              <UploadBtn />
              <p className="mt-2">Add a new document</p>
            </li>

            {files
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((file) => (
                <div
                  key={file.id}
                  className="bg-white shadow-md rounded-lg p-4 border border-gray-300 flex flex-col items-center"
                >
                  {/* File Name */}
                  <div className="w-full border border-orange-400 rounded p-2 text-center font-semibold text-zinc-900 truncate">
                    {file.name}
                  </div>

                  {/* Date */}
                  <div className="w-full border border-orange-300 rounded p-2 text-center mt-2 text-sm text-zinc-600">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </div>

                  {/* Mocked */}
                  <div className="w-full border flex items-center justify-center border-orange-300 rounded p-2 text-center mt-2 text-sm text-zinc-600">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Mocked
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-4">
                    {/* Eye Button - Redirects */}
                    <Link
                      href={`/dashboard/${file.id}`}
                      className="bg-orange-500 p-2 rounded-full text-white hover:bg-orange-600 transition"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>

                    {/* Delete Button */}

                    <Button
                      onClick={() => handleDeleteFile(file.id)}
                      size="sm"
                      className="bg-red-500 p-3 rounded-full text-white hover:bg-red-600 transition"
                      disabled={deletingFileId === file.id}
                    >
                      {deletingFileId === file.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash className="h-5 w-6" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
          </ul>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-2">
            <Ghost className="h-8 w-8 text-zinc-800" />
            <h3 className="font-semibold text-xl">Pretty empty around here</h3>
            <p>Let&apos;s upload your first PDF.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;

// <div key={file.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-300 flex flex-col items-center">
//               <div className="w-full border border-orange-400 rounded p-2 text-center font-semibold text-zinc-900 truncate">
//                 {file.name}
//               </div>
//               <div className="w-full border border-orange-300 rounded p-2 text-center mt-2 text-sm text-zinc-600">
//                 {file.size}
//               </div>

//               {/* Eye Icon for Preview */}
//               <button className="mt-4 bg-orange-500 p-2 rounded-full text-white hover:bg-orange-600 transition">
//                 <Eye className="h-5 w-5" />
//               </button>
//             </div>
