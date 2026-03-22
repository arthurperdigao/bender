/**
 * src/components/dashboard/UserDashboardWidget.tsx
 * Widget de Perfil Reformulado — Estilo HUD Premium (Avatar Chronicles)
 */
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUserStats } from "@/lib/actions/user";
import Link from "next/link";
import { quizResultContent } from "@/lib/data/quizResultContent";

type UserStats = {
    nome: string;
    sobrenome: string;
    elementoNato: string | null;
    subbending: string | null;
    bio: string | null;
    paiShoScore: number;
    paiShoWinsEasy: number;
    paiShoWinsMedium: number;
    paiShoWinsHard: number;
    paiShoWinsMaster: number;
    pergaminhosScore: number;
    totalXp: number;
    streak: number;
} | null;

// Cores vibrantes para cada elemento
const ELEMENT_THEMES: Record<string, { glow: string; text: string; icon: string; accent: string; label: string }> = {
    water: { glow: "rgba(0, 184, 255, 0.3)", text: "#66e0ff", icon: "🌊", accent: "#00b8ff", label: "Tribo da Água" },
    earth: { glow: "rgba(0, 255, 37, 0.2)", text: "#a3ffb4", icon: "⛰️", accent: "#009e25", label: "Reino da Terra" },
    fire: { glow: "rgba(255, 72, 0, 0.3)", text: "#ff9966", icon: "🔥", accent: "#ff4800", label: "Nação do Fogo" },
    air: { glow: "rgba(255, 153, 0, 0.3)", text: "#ffcc66", icon: "🌪️", accent: "#ff9900", label: "Nômade do Ar" },
    none: { glow: "rgba(224, 220, 209, 0.2)", text: "#e0dcd1", icon: "☯", accent: "#a792ff", label: "Viajante" },
};

export default function UserDashboardWidget() {
    const [stats, setStats] = useState<UserStats>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            const data = await getUserStats();
            setStats(data as UserStats);
            setLoading(false);
        }
        loadStats();
    }, []);

    if (loading || !stats) return (
        <div className="flex items-center justify-center p-12 h-64">
            <div className="w-12 h-12 rounded-full border-2 border-[#dcb670]/30 border-t-[#dcb670] animate-spin" />
        </div>
    );

    const theme = ELEMENT_THEMES[stats.elementoNato || "none"];
    const isNone = stats.elementoNato === 'none' || !stats.elementoNato;
    
    // 🧬 ALGORITMO DE PROGRESSÃO ÉPICA (MASTERY PATH) 🧬
    const totalXp = stats.totalXp || 0;
    let rankTitle = "Vendedor de Repolhos 🥬";
    let currentLevel = 1;
    let nextThreshold = 100;
    
    if (totalXp >= 50000) { rankTitle = "Mestre Lendário 🐉"; currentLevel = 6; nextThreshold = 100000; }
    else if (totalXp >= 10000) { rankTitle = "Lótus Branca (Sênior) 🏵️"; currentLevel = 5; nextThreshold = 50000; }
    else if (totalXp >= 2500) { rankTitle = "Guardião da Paz 🏯"; currentLevel = 4; nextThreshold = 10000; }
    else if (totalXp >= 500) { rankTitle = "Recruta da Nação 🥋"; currentLevel = 3; nextThreshold = 2500; }
    else if (totalXp >= 100) { rankTitle = "Viajante Errante 🏹"; currentLevel = 2; nextThreshold = 500; }
    else { rankTitle = "Vendedor de Repolhos 🥬"; currentLevel = 1; nextThreshold = 100; }

    const progressToNext = Math.min((totalXp / nextThreshold) * 100, 100);
    const totalWins = (stats.paiShoWinsEasy || 0) + (stats.paiShoWinsMedium || 0) + (stats.paiShoWinsHard || 0) + (stats.paiShoWinsMaster || 0);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultData = stats.subbending ? (quizResultContent as any)[stats.subbending] : null;

    return (
        <div className="relative w-full max-w-6xl mx-auto py-12 px-4">
            
            {/* 🛸 CABEÇALHO DE PERFIL — MINIMAL & PRO */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row items-center md:items-start justify-between bg-white/[0.03] border border-white/5 backdrop-blur-2xl p-8 rounded-3xl mb-8 shadow-2xl"
            >
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Element Icon Badge */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#dcb670]/20 to-transparent border border-[#dcb670]/30 shadow-[0_0_20px_rgba(220,182,112,0.15)] flex items-center justify-center text-4xl">
                        {theme.icon}
                    </div>
                    {/* User Info */}
                    <div className="text-center md:text-left mt-4 md:mt-0">
                        <h2 className="text-3xl font-black uppercase tracking-widest text-white mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>
                            {stats.nome} <span className="text-white/40">{stats.sobrenome}</span>
                        </h2>
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                            <span className="text-[10px] uppercase tracking-widest text-[#dcb670] font-bold bg-[#dcb670]/10 px-3 py-1 rounded-full border border-[#dcb670]/20">
                                Grao {currentLevel} • {rankTitle.split(' ')[0]}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-white/50">
                                {theme.label}
                            </span>
                            {(stats.streak || 0) > 0 && (
                                <span className="text-[10px] uppercase tracking-widest text-orange-400 flex items-center gap-1 font-bold bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/20">
                                    🔥 {stats.streak} Dias Foco
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Level XP Quick View */}
                <div className="mt-8 md:mt-2 text-center md:text-right">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Experiência Total</p>
                    <p className="text-3xl font-black text-white tracking-wider">{totalXp.toLocaleString('pt-BR')} <span className="text-xs text-[#dcb670]">XP</span></p>
                    <p className="text-[10px] text-white/50 mt-1 uppercase tracking-widest">Nível {currentLevel}</p>
                </div>
            </motion.div>

            {/* 📊 GRID DE ESTATÍSTICAS E AÇÕES RÁPIDAS (3 COLUNAS LIMPAS) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {/* 1. Atividades e Comunidade */}
                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl flex flex-col justify-between">
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6">Comunidade (Chat)</h4>
                        <div className="space-y-4">
                            {/* Acesso Nativo */}
                            <Link href="/taverna" className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-[#dcb670]/10 border border-white/5 hover:border-[#dcb670]/30 transition-all group">
                                <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
                                <div>
                                    <p className="text-[11px] font-bold text-white uppercase tracking-wider">Chat: {theme.label}</p>
                                    <p className="text-[9px] uppercase tracking-widest text-[#dcb670] mt-1">Sala de Mensagens</p>
                                </div>
                            </Link>

                            {/* Passe Diplomático Minimalista */}
                            {currentLevel >= 5 ? (
                                <div className="p-4 rounded-2xl bg-purple-900/10 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
                                    <p className="text-[9px] uppercase font-bold text-purple-400 tracking-widest text-center opacity-80 mb-1">Passe Diplomático</p>
                                    <p className="text-[8px] text-center text-white/40 mb-3 px-1 uppercase tracking-widest leading-relaxed">Chats de outras Nações</p>
                                    <div className="flex justify-between gap-2">
                                        <Link href="/taverna?visit=Fogo" className="flex-1 text-center py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 hover:scale-110 transition-all border border-white/5 hover:border-purple-500/30 font-bold" title="Chat Global do Fogo">🔥</Link>
                                        <Link href="/taverna?visit=Água" className="flex-1 text-center py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 hover:scale-110 transition-all border border-white/5 hover:border-purple-500/30 font-bold" title="Chat Global da Água">🌊</Link>
                                        <Link href="/taverna?visit=Terra" className="flex-1 text-center py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 hover:scale-110 transition-all border border-white/5 hover:border-purple-500/30 font-bold" title="Chat Global da Terra">⛰️</Link>
                                        <Link href="/taverna?visit=Ar" className="flex-1 text-center py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 hover:scale-110 transition-all border border-white/5 hover:border-purple-500/30 font-bold" title="Chat Global de Ar">🌪️</Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-2xl bg-black/20 border border-white/5 opacity-50 grayscale select-none">
                                    <p className="text-[9px] uppercase font-bold text-white/40 tracking-widest mb-1 text-center">Passe Diplomático 🔒</p>
                                    <p className="text-[8px] text-center text-white/30 uppercase tracking-widest leading-relaxed">Nível 5: Libera os Chats de outras nações</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Desempenho Pai Sho */}
                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl flex flex-col justify-between">
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6">Jogos (Arena Pai Sho)</h4>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-4xl font-black text-white">{totalWins}</p>
                                <p className="text-[9px] uppercase tracking-widest text-white/50 mt-2">Vitórias Totais</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl text-[#dcb670]">🎴</div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[9px] text-[#dcb670] uppercase tracking-widest mb-2 font-bold">
                            <span>Progresso</span>
                            <span>{Math.round(progressToNext)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progressToNext}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-[#dcb670]/50 to-[#dcb670] shadow-[0_0_10px_rgba(220,182,112,0.3)]"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Sabedoria Ancestral */}
                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl flex flex-col justify-between">
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6">Biblioteca (HQs e Livros)</h4>
                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl text-[#a792ff]">📚</div>
                            <div>
                                <p className="text-3xl font-black text-white">{stats.pergaminhosScore}</p>
                                <p className="text-[9px] uppercase tracking-widest text-white/50 mt-1">Obras Lidas</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-end">
                        {currentLevel >= 5 && (
                            <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#dcb670]/20 to-transparent border border-[#dcb670]/30 flex items-center gap-4 shadow-[0_0_15px_rgba(220,182,112,0.1)] group cursor-default">
                                <span className="text-2xl drop-shadow-[0_0_8px_#dcb670] group-hover:animate-spin transition-all">🏵️</span>
                                <div>
                                    <p className="text-[10px] font-bold text-[#dcb670] uppercase tracking-widest leading-tight">Lótus Branca Ativa</p>
                                    <p className="text-[8px] uppercase tracking-widest text-[#dcb670]/60 mt-1">Habilita Aura no Chat</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* 🚀 BOTÕES DE AÇÃO INFERIORES */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4 mt-8"
            >
                <Link href="/arena/adventure">
                    <button className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 text-white font-black text-[10px] tracking-[0.2em] uppercase hover:from-purple-800 hover:to-indigo-800 transition-all backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:scale-105 active:scale-95">
                        ✦ Iniciar Jornada (RPG)
                    </button>
                </Link>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                        {stats.subbending ? (
                           (quizResultContent as any)[stats.subbending.toUpperCase()]?.subtitle.toLowerCase().includes('dobra') 
                           ? "Sub-Dobra Ativa" 
                           : "Especialização Ativa"
                        ) : "Caminho Espiritual"}
                    </span>
                    <Link href="/quiz/subbending">
                        <button className="px-10 py-5 rounded-full bg-white/5 border border-white/10 text-[#dcb670] font-black text-xs md:text-sm tracking-[0.1em] uppercase hover:bg-white/10 transition-all backdrop-blur-md hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(220,182,112,0.1)]">
                            {stats.subbending ? (
                                (quizResultContent as any)[stats.subbending.toUpperCase()]?.title || stats.subbending
                            ) : "Escolher Especialização"}
                        </button>
                    </Link>
                </div>
                <Link href="/arena/arcade">
                    <button className="px-8 py-4 rounded-full bg-[#dcb670] border border-[#dcb670] text-black font-black text-[10px] tracking-[0.2em] uppercase hover:bg-white hover:border-white transition-all shadow-[0_0_20px_rgba(220,182,112,0.2)] hover:scale-105 active:scale-95">
                        Expandir Domínio (Arcade)
                    </button>
                </Link>
            </motion.div>
        </div>
    );
}
