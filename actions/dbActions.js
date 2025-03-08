"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFileUploadStatus(fileId) {
    if (!fileId) {
        return { error: 'File ID is required', statusCode: 400 };
    }
    
    try {
        const file = await prisma.file.findUnique({
            where: { id: fileId },
        });

        if (!file) {
            return { error: 'File not found', statusCode: 404 };
        }

        return { status: file.uploadStatus, statusCode: 200 };
    } catch (error) {
        return { error: 'Internal server error', statusCode: 500 };
    }
}


export async function deleteFile(fileId) {
    try {
      if (!fileId) throw new Error("File ID is required");
  
      await prisma.file.delete({ where: { id: fileId } });
  
      revalidatePath("/dashboard"); // Refresh dashboard to reflect changes (optional)
      return { success: true, message: "File deleted successfully" };
    } catch (error) {
      console.error("Error deleting file:", error);
      return { success: false, message: "Failed to delete file" };
    }
  }
