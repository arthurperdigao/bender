/**
 * src/auth.config.ts
 * Configuração LEVE do NextAuth — sem imports de Node.js nativo (Prisma, bcrypt).
 * Usada pelo Middleware (Edge Runtime) e como base para auth.ts completo.
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET || "super-secret-avatar-key-12345",
    pages: {
        signIn: "/login",
        error: "/login",
    },
    // Sem providers aqui — eles são adicionados no auth.ts completo
    providers: [],
    callbacks: {
        // Redirecionar usuários logados que tentam acessar /login ou /cadastro
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const rotasProtegidas = ["/arena", "/quiz", "/perfil"];
            const estaEmRotaProtegida = rotasProtegidas.some((rota) =>
                nextUrl.pathname.startsWith(rota)
            );

            if (estaEmRotaProtegida) {
                if (isLoggedIn) return true;
                return false; // Redireciona para /login
            }

            return true;
        },
    },
};
