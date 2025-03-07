import ChatWrapper from "@/components/ChatWrapper";
import PdfRender from "@/components/PdfRender";
import { NEXT_AUTH } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import React from "react";

const page = async ({params}) => {
  const session = await getServerSession(NEXT_AUTH);
 
  const fileId =  await params
  const file = await prisma.file.findFirst({
    where: {
      id: fileId.fileId,
      userId: session.user.id,
    },
  })

console.log(file)
  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {/* Main area */}
            <PdfRender url={file.url}/>
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper />
        </div>
      </div>
    </div>
  );
};

export default page;
