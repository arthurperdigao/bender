/**
 * src/middleware.ts
 * Protege rotas privadas — usa auth do authConfig (Edge Runtime safe, sem Prisma)
 * Importa NextAuth diretamente com authConfig para evitar imports de Node.js nativo
 */
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Cria uma instância leve do NextAuth só para o middleware (sem Credentials/Prisma)
export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
