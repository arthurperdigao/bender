/**
 * src/lib/db.ts
 * Instância singleton do PrismaClient para uso em toda a aplicação
 * Prisma v7 + SQLite: usa better-sqlite3 driver adapter com { url }
 */
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

function createPrismaClient(): PrismaClient {
    const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");
    const adapter = new PrismaBetterSqlite3({ url: dbPath });

    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
