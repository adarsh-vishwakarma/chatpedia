import React, { useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import Message from "./Message";

const Messages = ({ messages, loading }) => {
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {messages.length > 0 ? (
        <>
          {messages.map((message, i) => (
            <Message
              key={i}
              ref={i === messages.length - 1 ? lastMessageRef : null}
              message={message}
              previousMessage={messages[i - 1]}
            />
          ))}

          {/* Show Loading Skeleton when AI is responding */}
          {loading && <Message message={{ isUserMessage: false, text: "loading" }} />}
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <h3 className="font-semibold text-xl">You're all set!</h3>
          <p className="text-zinc-500 text-sm">Ask your first question to get started.</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
