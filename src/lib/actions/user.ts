/**
 * src/lib/actions/user.ts
 * Server Actions para buscar/atualizar dados do usuário no banco.
 */
"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function getUserStats() {
    const session = await auth();

    // Se não estiver logado, não tem acesso aos dados.
    if (!session?.user?.id) {
        return null;
    }

    try {
        const userStats = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                nome: true,
                sobrenome: true,
                email: true,
                idade: true,
                cidade: true,
                createdAt: true,
                elementoNato: true,
                paiShoScore: true,
                paiShoWinsEasy: true,
                paiShoWinsMedium: true,
                paiShoWinsHard: true,
                paiShoWinsMaster: true,
                pergaminhosScore: true,
            },
        });

        return userStats;
    } catch (error) {
        console.error("Erro ao buscar estatísticas do usuário:", error);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════
// RECUPERADOS / RE-IMPLEMENTADOS (DELETADOS ACIDENTALMENTE)
// ═══════════════════════════════════════════════════════════

export async function saveElemento(elemento: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Não logado" };

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { elementoNato: elemento },
        });
        return { success: true };
    } catch (error) {
        console.error("Erro ao salvar elemento:", error);
        return { success: false, error: "Falha ao salvar o elemento." };
    }
}

export async function saveTriviaScore(score: number) {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { pergaminhosScore: { increment: score } },
        });
        return { success: true };
    } catch (error) {
        console.error("Erro ao salvar pontuação de trivia:", error);
        return { success: false };
    }
}

export async function getPaiShoStats() {
    const session = await auth();
    if (!session?.user?.id) return null;

    try {
        const stats = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                paiShoScore: true,
                paiShoWinsEasy: true,
                paiShoWinsMedium: true,
                paiShoWinsHard: true,
                paiShoWinsMaster: true,
            },
        });
        if (!stats) return null;

        return {
            easy: stats.paiShoWinsEasy,
            medium: stats.paiShoWinsMedium,
            hard: stats.paiShoWinsHard,
            master: stats.paiShoWinsMaster,
            total: stats.paiShoScore,
        };
    } catch (error) {
        console.error("Erro ao buscar estatisticas pai sho:", error);
        return null;
    }
}

export async function savePaiShoWin(difficulty: 'easy' | 'medium' | 'hard' | 'master', xpEarned?: number) {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    try {
        const xp = xpEarned ?? (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : difficulty === 'hard' ? 30 : 50);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataToUpdate: any = {
            paiShoScore: { increment: xp }
        };

        if (difficulty === 'easy') dataToUpdate.paiShoWinsEasy = { increment: 1 };
        if (difficulty === 'medium') dataToUpdate.paiShoWinsMedium = { increment: 1 };
        if (difficulty === 'hard') dataToUpdate.paiShoWinsHard = { increment: 1 };
        if (difficulty === 'master') dataToUpdate.paiShoWinsMaster = { increment: 1 };

        await prisma.user.update({
            where: { id: session.user.id },
            data: dataToUpdate,
        });

        return { success: true };
    } catch (error) {
        console.error("Erro ao salvar vitoria pai sho:", error);
        return { success: false };
    }
}
