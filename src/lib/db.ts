/**
 * src/lib/db.ts
 * PrismaClient singleton — Prisma 7
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import path from "path";

function createPrismaClient(): PrismaClient {
    return new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
