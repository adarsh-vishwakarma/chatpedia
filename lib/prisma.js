// Incorrect: This will cause Prisma to be bundled for client-side, causing issues.
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
