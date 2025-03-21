import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { forwardRef } from "react";
import { Icons } from "./Icons";

const Message = forwardRef(({ message, previousMessage }, ref) => {
  const isUserMessage = message.isUserMessage;
  const isPreviousUserMessage = previousMessage?.isUserMessage;
  const isLoading = message.text === "loading"; // Check for loading state

  return (
    <div ref={ref} className="flex flex-col space-y-1">
      {/* AI Message (Appears ABOVE the user message) */}
      {!isUserMessage && (
        <div className="flex justify-start">
          <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg max-w-md shadow-md">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-4 w-40 bg-gray-400 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-400 rounded"></div>
              </div>
            ) : (
              <ReactMarkdown className="prose">{message.text}</ReactMarkdown>
            )}
            {!isLoading && (
              <div className="text-xs text-gray-500 mt-1 text-left">
                {format(new Date(), "HH:mm")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Message (Appears BELOW the AI message) */}
      {isUserMessage && (
        <div className="flex justify-end">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-lg max-w-md shadow-md">
            <ReactMarkdown className="prose text-zinc-50">{message.text}</ReactMarkdown>
            <div className="text-xs text-blue-300 mt-1 text-right">
              {format(new Date(), "HH:mm")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Message.displayName = "Message";

export default Message;
