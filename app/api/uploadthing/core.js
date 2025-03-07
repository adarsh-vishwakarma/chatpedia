import { NEXT_AUTH } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define the file route for pdfUpload
  pdfUpload: f({
    pdf: {
      maxFileSize: "4MB",  // Max size for file
      maxFileCount: 1,     // Max number of files
    },
  }).middleware(async({req})=>{
    const session = getServerSession(NEXT_AUTH);
    if(!session ) throw new Error('Unauthorized')
      return {userId : (await session).user.id}
  })
  
  .onUploadComplete(async ({ metadata, file }) => {
    const isFileExist = await prisma.file.findFirst({
      where: {
        key: file.key,
      },
    })
  
    if (isFileExist) return
  
    const createdFile = await prisma.file.create({
      data: {
        key: file.key,
        name: file.name,
        userId: metadata.userId,
        url: `https://utfs.io/f/${file.key}`,
        uploadStatus: 'PROCESSING',
      },
    })
    // Send response to the client-side
    console.log(createdFile)
    return { uploadedBy: metadata.userId };
  }),
};

export default ourFileRouter;
