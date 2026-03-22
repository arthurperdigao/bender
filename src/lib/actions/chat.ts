"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Retorna as últimas 100 mensagens ativas de uma nação específica
 */
export async function getRecentMessages(nacao: string) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: {
        nacao: nacao,
      },
      take: 100, // Hard cap na leitura
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            avatar: true,
            elementoNato: true,
            subbending: true,
            level: true, // Adicionado level
          },
        },
      },
    });

    // Invertemos para a ordem cronológica (mais antigas em cima, mais novas embaixo)
    return messages.reverse();
  } catch (error) {
    console.error("Erro ao carregar mensagens do chat:", error);
    return [];
  }
}

/**
 * Envia uma mensagem e executa a Auto-Limpeza de performance
 */
export async function sendChatMessage(content: string, nacao: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Não autenticado.");
    }

    if (!content || content.trim().length === 0) {
      throw new Error("Mensagem vazia.");
    }

    let finalNacao = (session.user as any).elementoNato || "Neutro";
    
    // Se a nação alvo for diferente da nação natal do usuário, verifica se ele tem o Passe Diplomático (Level 5+)
    if (nacao && nacao !== finalNacao) {
      const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { totalXp: true }});
      if (dbUser && dbUser.totalXp >= 10000) {
        finalNacao = nacao; // Permitido pelo Passe Diplomático
      }
    }

    // 1. Inserir a nova mensagem
    const newMessage = await prisma.chatMessage.create({
      data: {
        content: content.trim().substring(0, 500), // Limite de 500 caracteres
        userId: session.user.id,
        nacao: finalNacao,
      },
    });

    // 2. Lógica de AUTO-LIMPEZA (Retém apenas as 100 mais recentes por nação)
    // Buscamos a 100a mensagem mais recente para pegar a data de corte
    const pagedMessages = await prisma.chatMessage.findMany({
      where: { nacao: nacao },
      orderBy: { createdAt: "desc" },
      skip: 100,
      take: 1,
      select: { createdAt: true },
    });

    if (pagedMessages.length > 0) {
      const cutoffDate = pagedMessages[0].createdAt;
      // Deleta qualquer mensagem criada na mesma data ou antes da 100ª
      await prisma.chatMessage.deleteMany({
        where: {
          nacao: nacao,
          createdAt: {
            lte: cutoffDate,
          },
        },
      });
    }

    revalidatePath("/taverna");
    return { success: true, message: newMessage };
  } catch (error: any) {
    console.error("Erro ao enviar mensagem:", error);
    return { success: false, error: error.message };
  }
}
