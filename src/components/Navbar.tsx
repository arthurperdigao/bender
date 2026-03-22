/**
 * src/components/Navbar.tsx
 * Navbar flutuante com estado de sessão do NextAuth v5
 * Mostra: nome do usuário + elemento + botão de Sair / ou botões de Entrar e Cadastrar
 */
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WaterIcon, EarthIcon, FireIcon, AirIcon } from "./ui/ElementalIcons";

// Mapeamento de elementos para emojis e cores
const ELEMENT_MAP: Record<string, { Icon: React.FC<{ size?: number }>; color: string; label: string }> = {
    water: { Icon: WaterIcon, color: "#5a9ec4", label: "Água" },
    earth: { Icon: EarthIcon, color: "#8fa04a", label: "Terra" },
    fire: { Icon: FireIcon, color: "#cc4a2e", label: "Fogo" },
    air: { Icon: AirIcon, color: "#daa54e", label: "Ar" },
};

import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const { data: session, status } = useSession();
    const { totalItems, setIsOpen } = useCart();
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
            {/* Logo — Marca Premium */}
            <Link href="/" className="flex items-center gap-4 group">
                <div className="relative">
                    <span className="text-2xl group-hover:rotate-180 transition-transform duration-700 block drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">☯</span>
                    <motion.div 
                        animate={{ opacity: [0.2, 0.5, 0.2] }} 
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-white blur-xl rounded-full -z-10" 
                    />
                </div>
                <div className="flex flex-col leading-none">
                    <span
                        className="text-lg font-black tracking-[0.15em] uppercase text-white drop-shadow-sm"
                        style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                        Portal
                    </span>
                    <span
                        className="text-[0.6rem] font-bold tracking-[0.4em] uppercase text-[#dcb670]"
                        style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                        Avatar
                    </span>
                </div>
            </Link>
            
            {/* Menu Central (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
                <Link href="/" className="text-xs uppercase tracking-widest font-bold text-white/70 hover:text-[#dcb670] transition-colors">Início</Link>
                <Link href="/biblioteca" className="text-xs uppercase tracking-widest font-bold text-white/70 hover:text-[#dcb670] transition-colors">Biblioteca</Link>
                <Link href="/mapa" className="text-xs uppercase tracking-widest font-bold text-white/70 hover:text-[#dcb670] transition-colors">Mapa</Link>
                <Link href="/loja" className="text-xs uppercase tracking-widest font-bold text-white/70 hover:text-[#dcb670] transition-colors">Loja</Link>
            </div>

            {/* Área da sessão */}
            <div className="flex items-center gap-6">
                {/* Carrinho (Icone Premium) */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="relative p-2 group"
                >
                    <span className="text-xl group-hover:text-[#dcb670] transition-colors">🛒</span>
                    {totalItems > 0 && (
                        <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#dcb670]"
                        >
                            {totalItems}
                        </motion.span>
                    )}
                </motion.button>

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
                                    <span className="flex items-center" title={`Elemento: ${elementoInfo.label}`}>
                                        <elementoInfo.Icon size={18} />
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
