/**
 * src/lib/actions/auth.ts
 * Server Actions para cadastro e login
 */
"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

// ---------- CADASTRO ----------
export type RegisterResult =
    | { success: true }
    | { success: false; error: string };

export async function registerUser(formData: FormData): Promise<RegisterResult> {
    const nome = formData.get("nome") as string;
    const sobrenome = formData.get("sobrenome") as string;
    const idadeStr = formData.get("idade") as string;
    const cidade = formData.get("cidade") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validações básicas
    if (!nome || !sobrenome || !idadeStr || !cidade || !email || !password) {
        return { success: false, error: "Todos os campos são obrigatórios." };
    }

    const idade = parseInt(idadeStr);
    if (isNaN(idade) || idade < 1 || idade > 120) {
        return { success: false, error: "Idade inválida." };
    }

    if (password.length < 6) {
        return { success: false, error: "A senha deve ter pelo menos 6 caracteres." };
    }

    // Verificar se email já existe
    const usuarioExistente = await prisma.user.findUnique({
        where: { email },
    });

    if (usuarioExistente) {
        return { success: false, error: "Este email já está cadastrado." };
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário
    await prisma.user.create({
        data: {
            nome,
            sobrenome,
            idade,
            cidade,
            email,
            hashedPassword,
        },
    });

    return { success: true };
}

// ---------- LOGIN ----------
export type LoginResult =
    | { success: true }
    | { success: false; error: string };

export async function loginUser(formData: FormData): Promise<LoginResult> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, error: "Email e senha são obrigatórios." };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/", // NextAuth v5 prop for redirect
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, error: "Email ou senha incorretos." };
                default:
                    return { success: false, error: "Erro ao fazer login. Tente novamente." };
            }
        }
        // NextAuth v5 throws a NEXT_REDIRECT error here which we MUST re-throw
        // for Next.js to handle the redirect and cookie setting correctly.
        throw error;
    }

    return { success: true };
}
