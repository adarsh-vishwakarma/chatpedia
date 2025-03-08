const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
import { TaskType } from "@google/generative-ai";

export const genAi = new GoogleGenerativeAIEmbeddings({
          apiKey: "AIzaSyD04N0MbHkFRfDX1wHgtHwtmBT0LW4efLs",
          model: "text-embedding-004", // 768 dimensions
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        });