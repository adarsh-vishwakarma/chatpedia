"use server";

import { genAi } from "@/lib/geminiAi";
import { pc } from "@/lib/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";

async function chatAi(concatenatedText, query) {
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
    `{
        "role": "system",
        "content": "Use the following pieces of context (or previous conversation if needed) to answer the user's question in markdown format."
      },
      {
        "role": "user",
        "content": "For question: " + ${query} + " and with the given content as answer, please give an appropriate answer in text format. The answer content is " + ${concatenatedText} + ". \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.\n----------------\n"
      }`
      
  );
  return result.response.text()
}

export async function getQuestionAnswer(fileId, message) {
  const indexName = "chat-pedia";
  const genAi = new GoogleGenerativeAIEmbeddings({
    apiKey: "AIzaSyD04N0MbHkFRfDX1wHgtHwtmBT0LW4efLs",
    model: "text-embedding-004", // 768 dimensions
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
  });
  const index = pc.index(indexName);
  const queryEmbeddings = await genAi.embedDocuments([message]);
  const singleQueryEmbeddings = queryEmbeddings[0];
  const formattedQueryEmbeddings = {
    data: [
      {
        values: singleQueryEmbeddings, // Ensure the values are numbers
      },
    ],
  };
  const queryResponse = await index.namespace(fileId).query({
    topK: 3, // Number of closest matches to retrieve
    vector: formattedQueryEmbeddings.data[0].values, // Use the query embedding
    includeValues: false, // Don't include the actual values in the response
    includeMetadata: true, // Include metadata (the original text of each match)
  });

  const concatenatedText = queryResponse.matches
    .map((match) => match.metadata.text) // Extract 'text' from each match's metadata
    .join("\n");
  const result = await chatAi(concatenatedText, message);

  return result;
}
