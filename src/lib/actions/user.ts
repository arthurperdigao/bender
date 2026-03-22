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
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, streak: true, lastActivityAt: true, elementoNato: true }
        });

        if (user) {
            const now = new Date();
            const last = user.lastActivityAt ? new Date(user.lastActivityAt) : null;
            
            let updatedStreak = user.streak;
            const isToday = last && last.toDateString() === now.toDateString();
            
            if (!isToday) {
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                const isYesterday = last && last.toDateString() === yesterday.toDateString();

                if (isYesterday) {
                    updatedStreak += 1;
                } else {
                    updatedStreak = 1;
                }

                await (prisma.user as any).update({
                    where: { id: session.user.id },
                    data: { streak: updatedStreak, lastActivityAt: now }
                });
            }
        }

        const userStats = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true, nome: true, sobrenome: true, email: true,
                idade: true, cidade: true, createdAt: true,
                elementoNato: true, subbending: true, bio: true,
                paiShoScore: true, pergaminhosScore: true,
                totalXp: true, level: true, streak: true,
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

export async function saveElemento(elemento: string, subbending?: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Não logado" };

    try {
        // Verifica se já tem elemento definido — não permite sobrescrever
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { elementoNato: true },
        });

        if (user?.elementoNato) {
            return { success: false, error: "Seu elemento espiritual já foi selado." };
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                elementoNato: elemento,
                subbending: subbending || null,
            },
        });

        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "UPDATE_PROFILE",
                success: true,
                details: JSON.stringify({ field: "elementoNato", value: elemento }),
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Erro ao salvar elemento:", error);
        return { success: false, error: "Falha ao salvar o elemento." };
    }
}


export async function saveSubbending(subbending: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Não logado" };

    try {
        // Verifica se já tem subbending definido (não permite refazer)
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { subbending: true },
        });

        if (user?.subbending) {
            return { success: false, error: "Seu caminho espiritual já foi revelado." };
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { subbending },
        });

        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "UPDATE_PROFILE",
                success: true,
                details: JSON.stringify({ field: "subbending", value: subbending }),
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Erro ao salvar subbending:", error);
        return { success: false, error: "Falha ao salvar sua jornada." };
    }
}

export async function saveTriviaScore(score: number) {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { elementoNato: true }
        });

        // Vantagem de Não-Dobrador: Eles ganham 2x XP em conhecimento (Trivia)
        const multiplier = (!user?.elementoNato || user.elementoNato === 'none') ? 2 : 1;
        const finalScore = score * multiplier;

        await prisma.user.update({
            where: { id: session.user.id },
            data: { 
                pergaminhosScore: { increment: finalScore },
                totalXp: { increment: finalScore }
            },
        });
        return { success: true, gained: finalScore };
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
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { elementoNato: true }
        });

        // Vantagem de Não-Dobrador: Eles ganham +50% XP em Pai Sho (Estratégia)
        const multiplier = (!user?.elementoNato || user.elementoNato === 'none') ? 1.5 : 1;
        const baseXP = xpEarned ?? (difficulty === 'easy' ? 20 : difficulty === 'medium' ? 40 : difficulty === 'hard' ? 70 : 120);
        const finalXP = Math.round(baseXP * multiplier);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataToUpdate: any = {
            paiShoScore: { increment: finalXP },
            totalXp: { increment: finalXP }
        };

        if (difficulty === 'easy') dataToUpdate.paiShoWinsEasy = { increment: 1 };
        if (difficulty === 'medium') dataToUpdate.paiShoWinsMedium = { increment: 1 };
        if (difficulty === 'hard') dataToUpdate.paiShoWinsHard = { increment: 1 };
        if (difficulty === 'master') dataToUpdate.paiShoWinsMaster = { increment: 1 };

        await prisma.user.update({
            where: { id: session.user.id },
            data: dataToUpdate,
        });

        return { success: true, gained: finalXP };
    } catch (error) {
        console.error("Erro ao salvar vitoria pai sho:", error);
        return { success: false };
    }
}

export async function savePaiShoLoss(difficulty: 'easy' | 'medium' | 'hard' | 'master') {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { elementoNato: true, totalXp: true, paiShoScore: true }
        });

        // Vantagem de Não-Dobrador: Perdem 50% menos XP por derrota (resiliência)
        const lossMultiplier = (!user?.elementoNato || user.elementoNato === 'none') ? 0.5 : 1;
        const baseLoss = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 12 : difficulty === 'hard' ? 25 : 50;
        const finalLoss = Math.round(baseLoss * lossMultiplier);

        // Garante que não fique negativo
        const newTotalXp = Math.max(0, (user?.totalXp || 0) - finalLoss);
        const newPaiShoScore = Math.max(0, (user?.paiShoScore || 0) - finalLoss);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { 
                totalXp: newTotalXp,
                paiShoScore: newPaiShoScore
            },
        });

        return { success: true, lost: finalLoss };
    } catch (error) {
        console.error("Erro ao salvar derrota pai sho:", error);
        return { success: false };
    }
}

/**
 * Busca o ranking global das Quatro Nações.
 * Agrega o XP total de todos os membros e identifica o líder atual.
 */
export async function getNationsRanking() {
    try {
        const nations = ["water", "earth", "fire", "air"];
        const rankings = await Promise.all(nations.map(async (nation) => {
            const stats = await prisma.user.aggregate({
                where: { elementoNato: nation },
                _sum: { totalXp: true, paiShoScore: true, pergaminhosScore: true },
                _count: { id: true }
            });

            const topPlayer = await prisma.user.findFirst({
                where: { elementoNato: nation },
                orderBy: { totalXp: 'desc' },
                select: { nome: true, sobrenome: true, totalXp: true }
            });

            return {
                id: nation,
                totalXp: (stats._sum.totalXp || 0) + (stats._sum.paiShoScore || 0) + (stats._sum.pergaminhosScore || 0),
                members: stats._count.id || 0,
                topPlayer: topPlayer ? `${topPlayer.nome} ${topPlayer.sobrenome}` : "---"
            };
        }));

        // Retorna ordenado pelo XP total acumulado da nação
        return rankings.sort((a, b) => b.totalXp - a.totalXp);
    } catch (error) {
        console.error("Erro ao buscar ranking das nações:", error);
        return [];
    }
}
