"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { YoutubeTranscript } from "youtube-transcript";

async function getData(concatenatedText) {
  const apiKey = "AIzaSyD04N0MbHkFRfDX1wHgtHwtmBT0LW4efLs";
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(
    "take this input and generate a more detailed notes for exam preparetion including all the necessary toics, heading, subheadings, key pointt and defferences and all the content" +
      concatenatedText
  );
  return result.response.text();
}

export async function youtubeSummarizer(inputText) {
  const transcript = await YoutubeTranscript.fetchTranscript(inputText);
  const concatenatedText = transcript.map((item) => item.text).join(" ");
  //   const result = ApiResponse[0]
  const result = await getData(concatenatedText);
  return result;
}
