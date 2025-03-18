"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ChatInput from "./ChatInput";
import { getFileUploadStatus } from "@/actions/dbActions";
import { Loader2 } from "lucide-react";
import Messages from "./Messages";

const ChatWrapper = ({ fileId }) => {
  console.log(fileId);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]); 
  useEffect(() => {
    const fetchFileStatus = async () => {
      setIsLoading(true); // Start loading

      try {
        const response = await getFileUploadStatus(fileId);

        if (response.statusCode !== 200) {
          throw new Error(response.error || "Failed to fetch file status");
        }

        setStatus(response.status);
      } catch (error) {
        console.error("Error fetching file status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (fileId) {
      fetchFileStatus();
    }
  }, [fileId]);

  if (isLoading)
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">Loading...</h3>
            <p className="text-zinc-500 text-sm">
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>

        {/* <ChatInput isDisabled /> */}
      </div>
    );

  if (status === "PROCESSING")
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">Processing PDF...</h3>
            <p className="text-zinc-500 text-sm">This won&apos;t take long.</p>
          </div>
        </div>

        {/* <ChatInput isDisabled /> */}
      </div>
    );

  if (status === "FAILED") {
    return <div>Too many pages in PDF.</div>;
  }

  return (
    <div className="relative min-h-full bg-zinc-50 flex flex-col">
    {/* Scrollable messages container */}
    <div className="flex-1 flex flex-col overflow-y-auto mb-[100px]">
  <Messages fileId={fileId} messages={messages} />
</div>


    {/* Chat Input - Fixed at Bottom */}
    <div className="sticky bottom-0 bg-zinc-50 border-t border-gray-200 p-2">
      <ChatInput fileId={fileId} setMessages={setMessages} />
    </div>
  </div>
  );
};

export default ChatWrapper;
