"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { youtubeSummarizer } from "@/actions/youtube";
import ReactMarkdown from "react-markdown";

const YoutubeSummary = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!inputText.trim()) return; // Prevent empty input search

    setLoading(true);
    try {
      const result = await youtubeSummarizer(inputText);
      setSummary(result);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary("Failed to fetch summary. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white p-5">
      {/* Background Decorations */}
      <div className="absolute w-[80vw] max-w-[600px] h-[30vh] top-10 left-10 rounded-full bg-yellow-300 opacity-10 blur-2xl" />
      <div className="absolute w-[60vw] max-w-[400px] h-[20vh] bottom-10 right-10 rounded-full bg-orange-500 opacity-20 blur-2xl" />

      {/* Title Section */}
      <div className="text-center px-4 w-full max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            YouTube Video
          </span>{" "}
          Summary Powered By
          <br />
          <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent px-3 py-1 rounded text-3xl sm:text-4xl md:text-5xl lg:text-6xl inline-block">
            Gemini
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">
          One click to obtain YouTube video summaries and summary outlines.
        </p>

        {/* Input and Button */}
        <div className="relative mt-8 flex flex-col items-center gap-4 w-full max-w-lg left-1/2 right-1/2 transform -translate-x-1/2">
          <input
            type="text"
            placeholder="Enter YouTube URL"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="p-3 sm:p-4 text-base sm:text-lg md:text-xl border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          />
          <Button
            onClick={handleSearch}
            className="bg-orange-500 w-28 sm:w-32 md:w-40 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl rounded-full hover:bg-orange-700 hover:cursor-pointer flex items-center gap-3"
            disabled={loading}
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                <Search className="w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8" />{" "}
                Search
              </>
            )}
          </Button>
        </div>

        {/* Summary Output */}
        {summary && (
          <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md w-full max-w-3xl text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Summary</h2>
            <ReactMarkdown
              className="prose prose-gray"
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-2xl font-bold mt-6 mb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-semibold mt-5 mb-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-medium mt-4 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => <p className="mt-2" {...props} />,
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        )}

        {/* Footer */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 flex items-center justify-center gap-2">
          <span className="text-lg sm:text-xl md:text-2xl">🏆</span> 2025
          Chrome's Favorites
        </p>
      </div>
    </div>
  );
};

export default YoutubeSummary;
