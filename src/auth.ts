/**
 * src/auth.ts
 * Configuração COMPLETA do NextAuth v5 — com Credentials Provider e Prisma
 * NÃO deve ser importado pelo middleware (Edge Runtime)
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { authConfig } from "@/auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "Credenciais",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user) return null;

                const senhaCorreta = await bcrypt.compare(
                    credentials.password as string,
                    user.hashedPassword
                );

                if (!senhaCorreta) {
                    await prisma.auditLog.create({
                        data: {
                            action: "LOGIN",
                            success: false,
                            details: JSON.stringify({ email: credentials.email, reason: "Invalid password" }),
                        },
                    }).catch(console.error);
                    return null;
                }

                // Atualizar lastLoginAt e gerar AuditLog de sucesso
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLoginAt: new Date() },
                }).catch(console.error);

                await prisma.auditLog.create({
                    data: {
                        userId: user.id,
                        action: "LOGIN",
                        success: true,
                        details: JSON.stringify({ email: user.email }),
                    },
                }).catch(console.error);

                return {
                    id: user.id,
                    email: user.email,
                    name: `${user.nome} ${user.sobrenome}`,
                    nome: user.nome,
                    sobrenome: user.sobrenome,
                    elementoNato: user.elementoNato,
                };
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.nome = (user as { nome?: string }).nome ?? "";
                token.sobrenome = (user as { sobrenome?: string }).sobrenome ?? "";
                token.elementoNato =
                    (user as { elementoNato?: string | null }).elementoNato ?? null;
                console.log("JWT callback triggered, adding user data:", user);
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                (session.user as unknown as Record<string, unknown>).nome = token.nome;
                (session.user as unknown as Record<string, unknown>).sobrenome = token.sobrenome;
                (session.user as unknown as Record<string, unknown>).elementoNato = token.elementoNato;
            }
            return session;
        },
    },
});
