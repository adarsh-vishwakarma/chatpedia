import Dashboard from "@/components/Dashboard"; // ✅ Use correct case
import Sidebar from "@/components/Sidebar";

import { NEXT_AUTH } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import React from "react";

const page = async () => {
  const session = await getServerSession(NEXT_AUTH);
  
  // console.log(session.user.id)
  const files = await prisma.file.findMany({
    where: {
      userId: session.user.id,
    },
  });
  // console.log(file)

  return (
    <>
     <div className="flex flex-1">
    <Sidebar />
    <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">

      <Dashboard files={files} />
    </main>
    </div>
    </>
  );
};

export default page;
