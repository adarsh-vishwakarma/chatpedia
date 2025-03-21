"use client";
import React, { useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { getQuestionAnswer } from "@/actions/pineconeDb";

const ChatInput = ({ fileId, setMessages }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleMessageSend = async () => {
    if (!message.trim()) return;

    const userMessage = { text: message, isUserMessage: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setMessage(""); 
    
    try {
      // Call API to get the AI response
      const results = await getQuestionAnswer(fileId, message);
console.log(results)
if (results) {
  const aiMessage = { text: results, isUserMessage: false };
  
  // Append AI response
  setMessages((prevMessages) => [...prevMessages, aiMessage]);
}
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                rows={1}
                ref={textareaRef}
                maxRows={4}
                autoFocus
                onChange={handleInputChange}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleMessageSend();
                  }
                }}
                placeholder="Enter your question..."
                className="resize-none pr-12 text-base py-3 bg-white border border-gray-300 rounded-md"
              />

              <Button
                className="absolute bottom-3.5 right-[8px] bg-orange-500 hover:bg-orange-700 hover:cursor-pointer"
                onClick={handleMessageSend}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
