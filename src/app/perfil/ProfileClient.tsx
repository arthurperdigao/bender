/**
 * src/app/perfil/ProfileClient.tsx
 *
 * Componente visual da página de perfil — tema Avatar épico
 */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { UserBalancaWidget } from "@/components/dashboard/UserBalancaWidget";

// Mapeamento de elementos para visuais
const ELEMENT_VISUAL: Record<string, {
    emoji: string; label: string; subtitle: string;
    color: string; glow: string; bg: string;
    nation: string; quote: string;
}> = {
    water: {
        emoji: "💧", label: "Água", subtitle: "Tribo da Água",
        color: "#38bdf8", glow: "rgba(56,189,248,0.25)", bg: "rgba(56,189,248,0.04)",
        nation: "water", quote: "\"A água é o elemento da mudança.\"",
    },
    earth: {
        emoji: "⛰️", label: "Terra", subtitle: "Reino da Terra",
        color: "#22c55e", glow: "rgba(34,197,94,0.25)", bg: "rgba(34,197,94,0.04)",
        nation: "earth", quote: "\"A terra é o elemento da substância.\"",
    },
    fire: {
        emoji: "🔥", label: "Fogo", subtitle: "Nação do Fogo",
        color: "#f97316", glow: "rgba(249,115,22,0.25)", bg: "rgba(249,115,22,0.04)",
        nation: "fire", quote: "\"O fogo é o elemento do poder.\"",
    },
    air: {
        emoji: "🌪️", label: "Ar", subtitle: "Nômades do Ar",
        color: "#fbbf24", glow: "rgba(251,191,36,0.25)", bg: "rgba(251,191,36,0.04)",
        nation: "air", quote: "\"O ar é o elemento da liberdade.\"",
    },
};

// Troféus do Pai Sho por dificuldade
const PAI_SHO_TROPHIES = [
    { key: "paiShoWinsEasy", label: "Fácil", stars: "★☆☆☆", icon: "🔥", color: "#22c55e", opponent: "Zuko" },
    { key: "paiShoWinsMedium", label: "Médio", stars: "★★☆☆", icon: "⛰️", color: "#fbbf24", opponent: "Toph / Azula" },
    { key: "paiShoWinsHard", label: "Difícil", stars: "★★★☆", icon: "🦅", color: "#ef4444", opponent: "Wan Shi Tong" },
    { key: "paiShoWinsMaster", label: "Mestre", stars: "★★★★", icon: "🍵", color: "#fbbf24", opponent: "Iroh" },
] as const;

interface Profile {
    id?: string;
    nome: string;
    sobrenome: string;
    idade?: number;
    cidade?: string;
    email?: string;
    elementoNato: string | null;
    paiShoScore: number;
    paiShoWinsEasy: number;
    paiShoWinsMedium: number;
    paiShoWinsHard: number;
    paiShoWinsMaster: number;
    pergaminhosScore: number;
    createdAt?: Date;
}

// Cartão de estatística simples
const StatCard = ({ label, value, color, icon }: {
    label: string; value: string | number; color: string; icon: string;
}) => (
    <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className="flex flex-col items-center gap-2 p-6 rounded-2xl"
        style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
        }}
    >
        <span className="text-3xl">{icon}</span>
        <span className="text-2xl font-bold" style={{ color, fontFamily: "var(--font-cinzel), serif" }}>
            {value}
        </span>
        <span className="text-xs uppercase tracking-widest opacity-40 text-center">{label}</span>
    </motion.div>
);

export default function ProfileClient({ profile }: { profile: Profile }) {
    const el = profile.elementoNato ? ELEMENT_VISUAL[profile.elementoNato] : null;
    const joinDate = new Date(profile.createdAt || Date.now()).toLocaleDateString("pt-BR", {
        year: "numeric", month: "long", day: "numeric",
    });

    const totalPaiShoWins = profile.paiShoScore;
    const hasPaiShoWins = totalPaiShoWins > 0;

    return (
        <main
            className="min-h-screen relative overflow-hidden font-lora"
            style={{ background: "radial-gradient(ellipse at 50% 0%, #161a25 0%, #0a0b10 100%)" }}
        >
            {/* Glow do elemento no fundo */}
            {el && (
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${el.glow} 0%, transparent 70%)`,
                    }}
                />
            )}

            {/* Back button */}
            <Link
                href="/"
                className="fixed top-5 left-5 z-50 flex items-center gap-2 px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-bold
          bg-white/5 border border-white/8 text-white/40
          hover:text-white/80 hover:bg-white/10 hover:border-white/15
          transition-all duration-300 backdrop-blur-sm"
                style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
                ← Portal
            </Link>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-24">

                {/* ── CABEÇALHO DO PERFIL ── */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    {/* Avatar / Emblema do elemento */}
                    <motion.div
                        className="w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center relative"
                        style={{
                            background: el
                                ? `radial-gradient(circle, ${el.bg} 0%, rgba(255,255,255,0.02) 100%)`
                                : "rgba(255,255,255,0.03)",
                            border: el ? `2px solid ${el.color}40` : "2px solid rgba(255,255,255,0.08)",
                            boxShadow: el ? `0 0 40px ${el.glow}` : "none",
                        }}
                        animate={{ boxShadow: el ? [`0 0 20px ${el.glow}`, `0 0 50px ${el.glow}`, `0 0 20px ${el.glow}`] : [] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <span className="text-5xl">
                            {el ? el.emoji : "☯"}
                        </span>
                    </motion.div>

                    {/* Nome */}
                    <h1
                        className="text-3xl md:text-4xl font-black uppercase tracking-widest text-white mb-2"
                        style={{ fontFamily: "var(--font-cinzel), serif", textShadow: el ? `0 0 20px ${el.glow}` : "none" }}
                    >
                        {profile.nome} {profile.sobrenome}
                    </h1>

                    {/* Subtítulo do elemento */}
                    {el ? (
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] font-bold mb-1" style={{ color: el.color }}>
                                {el.subtitle}
                            </p>
                            <p className="text-xs italic opacity-40 text-gray-300">{el.quote}</p>
                        </div>
                    ) : (
                        <p className="text-sm opacity-40 uppercase tracking-widest">
                            Elemento não descoberto — <Link href="/quiz" className="text-[#dcb670] hover:opacity-80">Ir ao Quiz</Link>
                        </p>
                    )}
                </motion.div>

                {/* ── INFORMAÇÕES PESSOAIS ── */}
                <motion.div
                    className="mb-10 p-8 rounded-2xl"
                    style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <h2
                        className="text-xs uppercase tracking-[0.4em] mb-6 opacity-40 font-bold"
                        style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                        Registros do Portal
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        {[
                            { label: "Email", value: profile.email },
                            { label: "Idade", value: `${profile.idade} anos` },
                            { label: "Cidade", value: profile.cidade },
                            { label: "Membro desde", value: joinDate },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <div className="text-xs uppercase tracking-widest opacity-30 mb-1">{label}</div>
                                <div className="text-white/80">{value}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── BALANÇA DO MUNDO WIDGET ── */}
                <UserBalancaWidget userElement={profile.elementoNato} />

                {/* ── PONTUAÇÕES GERAIS ── */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <h2
                        className="text-xs uppercase tracking-[0.4em] mb-6 opacity-40 font-bold text-center"
                        style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                        Desempenho Pessoal
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            label="Pergaminhos (Trivia)"
                            value={profile.pergaminhosScore}
                            color="#fbbf24"
                            icon="📜"
                        />
                        <StatCard
                            label={`Pai Sho — ${totalPaiShoWins} vitória${totalPaiShoWins !== 1 ? "s" : ""}`}
                            value={totalPaiShoWins}
                            color="#22c55e"
                            icon="🪷"
                        />
                    </div>
                </motion.div>

                {/* ── TROFÉUS PAI SHO ── */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.8 }}
                >
                    <h2
                        className="text-xs uppercase tracking-[0.4em] mb-2 opacity-40 font-bold text-center"
                        style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                        Troféus do Lótus Branco — Pai Sho
                    </h2>
                    <p className="text-xs opacity-25 text-center mb-6 italic">
                        Vitórias acumuladas por dificuldade
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {PAI_SHO_TROPHIES.map((trophy, i) => {
                            const wins = profile[trophy.key as keyof Profile] as number;
                            const unlocked = wins > 0;

                            return (
                                <motion.div
                                    key={trophy.key}
                                    className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center"
                                    style={{
                                        background: unlocked ? `${trophy.color}10` : "rgba(255,255,255,0.02)",
                                        border: unlocked ? `1px solid ${trophy.color}35` : "1px solid rgba(255,255,255,0.05)",
                                        boxShadow: unlocked ? `0 0 20px ${trophy.color}15` : "none",
                                        filter: unlocked ? "none" : "grayscale(1) opacity(0.35)",
                                    }}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + i * 0.08 }}
                                    whileHover={unlocked ? { y: -4, scale: 1.04 } : {}}
                                >
                                    {/* Emoji do adversário */}
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                                        style={{
                                            background: unlocked ? `${trophy.color}18` : "rgba(255,255,255,0.04)",
                                            border: `1px solid ${unlocked ? trophy.color + "40" : "rgba(255,255,255,0.08)"}`,
                                        }}
                                    >
                                        {trophy.icon}
                                    </div>

                                    {/* Nível */}
                                    <div className="text-xs font-bold" style={{ color: unlocked ? trophy.color : "rgba(255,255,255,0.3)", fontFamily: "var(--font-cinzel), serif" }}>
                                        {trophy.label}
                                    </div>
                                    <div className="text-xs opacity-40">{trophy.stars}</div>
                                    <div className="text-xs opacity-30 mb-1">{trophy.opponent}</div>

                                    {/* Contagem de vitórias */}
                                    {unlocked ? (
                                        <div className="mt-1 px-3 py-1 rounded-full text-xs font-bold"
                                            style={{ background: `${trophy.color}20`, color: trophy.color, border: `1px solid ${trophy.color}30` }}>
                                            🏆 {wins} vitória{wins !== 1 ? "s" : ""}
                                        </div>
                                    ) : (
                                        <div className="text-xs opacity-20 mt-1">🔒 Bloqueado</div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {!hasPaiShoWins && (
                        <p className="text-center text-xs opacity-30 mt-4 italic">
                            Jogue Pai Sho para desbloquear seus troféus →{" "}
                            <Link href="/arena/pai-sho" className="text-[#22c55e] hover:opacity-80">Jogar agora</Link>
                        </p>
                    )}
                </motion.div>

                {/* ── AÇÕES ── */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    <Link
                        href="/mapa"
                        className="flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-center transition-all duration-300 hover:scale-105"
                        style={{
                            background: "linear-gradient(135deg, #2c1e16, #4a3d34)",
                            border: "1px solid #dcb670",
                            color: "#e6dec1",
                            fontFamily: "var(--font-cinzel), serif",
                            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                            boxShadow: "0 0 15px rgba(220,182,112,0.3)"
                        }}
                    >
                        🗺️ Explorar Mapa
                    </Link>
                    {!profile.elementoNato && (
                        <Link
                            href="/quiz"
                            className="flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-center transition-all duration-300"
                            style={{
                                background: "linear-gradient(135deg, #dcb670, #a07030)",
                                color: "#161a25",
                                fontFamily: "var(--font-cinzel), serif",
                            }}
                        >
                            ✦ Descobrir Elemento
                        </Link>
                    )}
                    <Link
                        href="/arena/trivia"
                        className="flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-center transition-all duration-300"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#fbbf24",
                            fontFamily: "var(--font-cinzel), serif",
                        }}
                    >
                        📜 Jogar Trivia
                    </Link>
                    <Link
                        href="/arena/pai-sho"
                        className="flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-center transition-all duration-300"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#22c55e",
                            fontFamily: "var(--font-cinzel), serif",
                        }}
                    >
                        🪷 Pai Sho
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            color: "rgba(255,255,255,0.3)",
                            fontFamily: "var(--font-cinzel), serif",
                        }}
                    >
                        Sair
                    </button>
                </motion.div>
            </div>
        </main>
    );
}
