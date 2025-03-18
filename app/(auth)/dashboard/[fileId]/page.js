import ChatWrapper from "@/components/ChatWrapper";
import PdfRender from "@/components/PdfRender";
import { NEXT_AUTH } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import React from "react";

const page = async ({ params }) => {
  const session = await getServerSession(NEXT_AUTH);

  const fileId = await params;
  const file = await prisma.file.findFirst({
    where: {
      id: fileId.fileId,
      userId: session.user.id,
    },
  });

  console.log(file);
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] mx-5">
    {/* PDF Viewer - Takes full width on small screens, half on large screens */}
    <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-hidden">
      <PdfRender url={file.url} />
    </div>

    {/* Chat Wrapper - Takes full width below PDF on small screens, half on large screens */}
    <div className="w-full lg:w-1/2 h-1/2 lg:h-full border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto">
      <ChatWrapper fileId={fileId.fileId} />
    </div>
  </div>
  );
};

export default page;
