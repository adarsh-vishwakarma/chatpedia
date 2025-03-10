"use client"; // Ensure this is a client component

import React, { useState } from "react";
import UploadBtn from "./UploadBtn";
import Link from "next/link";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
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
      alert(response.message); // Show error if deletion fails
    }

    setDeletingFileId(null); // Reset loading state
  };

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>
        <UploadBtn />
      </div>

      {files && files.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link href={`/dashboard/${file.id}`} className="flex flex-col gap-2">
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">{file.name}</h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    mocked
                  </div>

                  {/* Delete Button */}
                  <Button
                    onClick={() => handleDeleteFile(file.id)}
                    size="sm"
                    className="w-full"
                    variant="destructive"
                    disabled={deletingFileId === file.id} // Disable button while deleting
                  >
                    {deletingFileId === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
