import { NEXT_AUTH } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { createUploadthing } from "uploadthing/next";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define the file route for pdfUpload
  pdfUpload: f({
    pdf: {
      maxFileSize: "16MB", // Max size for file
      maxFileCount: 1, // Max number of files
    },
  })
    .middleware(async ({ req }) => {
      const session = getServerSession(NEXT_AUTH);
      if (!session) throw new Error("Unauthorized");
      return { userId: (await session).user.id };
    })

    .onUploadComplete(async ({ metadata, file }) => {
      const isFileExist = await prisma.file.findFirst({
        where: {
          key: file.key,
        },
      });

      if (isFileExist) return;

      const createdFile = await prisma.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://utfs.io/f/${file.key}`,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        //Pinecone
        const pc = new Pinecone({
          apiKey:
            "pcsk_6oQFt5_U6VozAbHHnfnzAN91yo58Uyra1NMDhLV7yNcmfGzWd2ExXy6Kuo4BTd6cz5qedF",
        });
        const indexName = "chat-pedia";
        const response = await fetch(`https://utfs.io/f/${file.key}`);
        const data = await response.blob();
        const loader = new WebPDFLoader(data);
        const docs = await loader.load();
        let pdfTextContent = "";
        docs.forEach((doc) => {
          pdfTextContent = pdfTextContent + doc.pageContent + "";
        });

        //langchain text splitter
        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 2000,
          chunkOverlap: 200,
        });

        // creating text array
        const output = await splitter.createDocuments([pdfTextContent]);

        const splitterList = output.map((item) => item.pageContent);

        const genAi = new GoogleGenerativeAIEmbeddings({
          apiKey: "AIzaSyD04N0MbHkFRfDX1wHgtHwtmBT0LW4efLs",
          model: "text-embedding-004", // 768 dimensions
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        });

        // converting into vector
        const embeddings = await genAi.embedDocuments(splitterList);
        //updating the vector in key value pair
        const formattedEmbeddings = embeddings.map((embedding) => ({
          values: embedding,
        }));

        //making it store it
        const vectors = splitterList.map((text, i) => ({
          id: `vec1${i + 1}`, // Generate an ID for each vector, e.g., 'vec1', 'vec2', 'vec3'
          values: formattedEmbeddings[i].values, // Get the corresponding embedding values
          metadata: { text: splitterList[i] }, // Store the original text as metadata
        }));
        const index = pc.index(indexName);
        await index.namespace(createdFile.id).upsert(vectors);
        await prisma.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: createdFile.id,
          },
        });
      } catch (error) {
        await prisma.file.update({
          data: {
            uploadStatus: "FAILED",
          },
          where: {
            id: createdFile.id,
          },
        });
      }

      return { uploadedBy: metadata.userId };
    }),
};

export default ourFileRouter;








