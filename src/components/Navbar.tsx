/**
 * src/components/Navbar.tsx
 * Navbar flutuante com estado de sessão do NextAuth v5
 * Mostra: nome do usuário + elemento + botão de Sair / ou botões de Entrar e Cadastrar
 */
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";

// Mapeamento de elementos para emojis e cores
const ELEMENT_MAP: Record<string, { emoji: string; color: string; label: string }> = {
    water: { emoji: "🌊", color: "#5a9ec4", label: "Água" },
    earth: { emoji: "⛰️", color: "#8fa04a", label: "Terra" },
    fire: { emoji: "🔥", color: "#cc4a2e", label: "Fogo" },
    air: { emoji: "🌪️", color: "#daa54e", label: "Ar" },
};

export default function Navbar() {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";

    // Nome do usuário (usa 'nome' customizado ou o 'name' padrão)
    const nome = (session?.user as Record<string, unknown> | undefined)?.nome as string
        ?? session?.user?.name?.split(" ")[0]
        ?? null;

    const elementoNato = (session?.user as Record<string, unknown> | undefined)?.elementoNato as string | null;
    const elementoInfo = elementoNato ? ELEMENT_MAP[elementoNato] : null;

    return (
        <motion.nav
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
            style={{
                background: "linear-gradient(to bottom, rgba(13,15,22,0.95), rgba(13,15,22,0))",
            }}
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
                <span className="text-xl group-hover:scale-110 transition-transform duration-300">☯</span>
                <span
                    className="text-sm font-bold tracking-[0.2em] uppercase text-white/80 group-hover:text-white transition-colors"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                    Portal
                </span>
            </Link>

            {/* Área da sessão */}
            <div className="flex items-center gap-3">
                {isLoading ? (
                    // Skeleton loader enquanto carrega a sessão
                    <div className="flex gap-2">
                        <div className="h-8 w-20 rounded-full bg-white/10 animate-pulse" />
                        <div className="h-8 w-16 rounded-full bg-white/10 animate-pulse" />
                    </div>
                ) : session?.user ? (
                    // LOGADO — mostra nome, elemento e botão de sair
                    <div className="flex items-center gap-4">
                        {/* Info do usuário — clicável leva ao perfil */}
                        <Link href="/perfil">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300"
                                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                            >
                                {/* Elemento (se tiver) */}
                                {elementoInfo && (
                                    <span className="text-sm" title={`Elemento: ${elementoInfo.label}`}>
                                        {elementoInfo.emoji}
                                    </span>
                                )}
                                {/* Nome */}
                                <span
                                    className="text-sm font-semibold"
                                    style={{ color: elementoInfo?.color ?? "#dcb670", fontFamily: "var(--font-cinzel), serif" }}
                                >
                                    {nome ?? "Viajante"}
                                </span>
                            </motion.div>
                        </Link>

                        {/* Botão Sair */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300"
                            style={{
                                fontFamily: "var(--font-cinzel), serif",
                                background: "rgba(255,255,255,0.07)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                color: "rgba(255,255,255,0.7)",
                            }}
                            onMouseEnter={(e) => {
                                (e.target as HTMLButtonElement).style.background = "rgba(200,50,50,0.3)";
                                (e.target as HTMLButtonElement).style.borderColor = "rgba(200,50,50,0.6)";
                                (e.target as HTMLButtonElement).style.color = "#ff9999";
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
                                (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
                                (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)";
                            }}
                        >
                            Sair
                        </motion.button>
                    </div>
                ) : (
                    // NÃO LOGADO — mostra botões de Entrar e Cadastrar
                    <div className="flex items-center gap-2">
                        <Link href="/login">
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
                                style={{
                                    fontFamily: "var(--font-cinzel), serif",
                                    background: "rgba(255,255,255,0.07)",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    color: "rgba(255,255,255,0.7)",
                                }}
                            >
                                Entrar
                            </motion.span>
                        </Link>
                        <Link href="/cadastro">
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer"
                                style={{
                                    fontFamily: "var(--font-cinzel), serif",
                                    background: "linear-gradient(135deg, #dcb670, #a07030)",
                                    border: "1px solid #dcb67060",
                                    color: "#161a25",
                                }}
                            >
                                Cadastrar
                            </motion.span>
                        </Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
}
