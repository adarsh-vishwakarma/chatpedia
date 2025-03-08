import Dashboard from "@/components/Dashboard"; // ✅ Use correct case

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
      <Dashboard files={files} />
    </>
  );
};

export default page;
