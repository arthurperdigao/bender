/**
 * src/components/dashboard/UserDashboardWidget.tsx
 * Widget de Perfil do usuário logado exibido na Home Page
 */
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUserStats } from "@/lib/actions/user";
import Link from "next/link";

type UserStats = {
    nome: string;
    sobrenome: string;
    elementoNato: string | null;
    paiShoScore: number;
    paiShoWinsEasy: number;
    paiShoWinsMedium: number;
    paiShoWinsHard: number;
    paiShoWinsMaster: number;
    pergaminhosScore: number;
} | null;

// Design elements para cada Tribo/Domínio
const ELEMENT_THEMES: Record<string, { bg: string; text: string; icon: string; border: string; label: string }> = {
    water: { bg: "rgba(90, 158, 196, 0.15)", text: "#5a9ec4", icon: "🌊", border: "rgba(90, 158, 196, 0.4)", label: "Tribo da Água" },
    earth: { bg: "rgba(143, 160, 74, 0.15)", text: "#8fa04a", icon: "⛰️", border: "rgba(143, 160, 74, 0.4)", label: "Reino da Terra" },
    fire: { bg: "rgba(204, 74, 46, 0.15)", text: "#cc4a2e", icon: "🔥", border: "rgba(204, 74, 46, 0.4)", label: "Nação do Fogo" },
    air: { bg: "rgba(218, 165, 78, 0.15)", text: "#daa54e", icon: "🌪️", border: "rgba(218, 165, 78, 0.4)", label: "Nômade do Ar" },
    none: { bg: "rgba(255, 255, 255, 0.05)", text: "#dcb670", icon: "☯", border: "rgba(220, 182, 112, 0.3)", label: "Viajante do Mundo" },
};

export default function UserDashboardWidget() {
    const [stats, setStats] = useState<UserStats>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            const data = await getUserStats();
            setStats(data);
            setLoading(false);
        }
        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            </div>
        );
    }

    if (!stats) return null;

    const theme = ELEMENT_THEMES[stats.elementoNato || "none"];
    const totalPaiShoWins = stats.paiShoWinsEasy + stats.paiShoWinsMedium + stats.paiShoWinsHard + stats.paiShoWinsMaster;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden backdrop-blur-md relative"
            style={{
                background: "linear-gradient(135deg, rgba(29,34,50,0.8), rgba(22,26,37,0.95))",
                border: `1px solid ${theme.border}`,
                boxShadow: `0 10px 40px -10px ${theme.border}`,
            }}
        >
            {/* Brilho do elemento no topo/fundo */}
            <div
                className="absolute inset-0 top-0 left-0 w-full h-32 opacity-30"
                style={{ background: `linear-gradient(to bottom, ${theme.bg}, transparent)` }}
            />

            <div className="relative p-6 md:p-8">
                {/* Header: Saudação e Elemento */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div className="text-center md:text-left">
                        <p className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-1">
                            Bem-vindo de volta,
                        </p>
                        <h3
                            className="text-3xl font-bold uppercase tracking-widest text-[#f4ecd8]"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            {stats.nome} {stats.sobrenome}
                        </h3>
                    </div>

                    <div
                        className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10"
                        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                    >
                        <span className="text-2xl drop-shadow-md">{theme.icon}</span>
                        <span
                            className="text-sm font-semibold tracking-wider uppercase"
                            style={{ color: theme.text }}
                        >
                            {theme.label}
                        </span>
                    </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                {/* Score Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Pai Sho Card */}
                    <div className="bg-[#10131c]/60 border border-white/5 rounded-xl p-5 hover:bg-[#161a25]/80 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xl">🎴</span>
                            <h4 className="text-sm font-bold tracking-widest uppercase text-[#dcb670]">Pai Sho</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-baseline">
                                <span className="text-gray-400 text-xs uppercase tracking-wider">Grau de Lótus (XP)</span>
                                <span className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                                    {stats.paiShoScore.toLocaleString()}
                                </span>
                            </div>
                            {/* Vitórias Detalhadas por Dificuldade */}
                            <div className="border-t border-white/10 pt-3 space-y-2 mt-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500 uppercase tracking-wider">Aprendiz <span className="opacity-50">(10 XP)</span></span>
                                    <span className="font-bold text-gray-300">{stats.paiShoWinsEasy} vitórias</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-[#5a9ec4] uppercase tracking-wider">Experiente <span className="opacity-50">(20 XP)</span></span>
                                    <span className="font-bold text-[#5a9ec4]">{stats.paiShoWinsMedium} vitórias</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-[#a0b84c] uppercase tracking-wider">Mestre <span className="opacity-50">(30 XP)</span></span>
                                    <span className="font-bold text-[#a0b84c]">{stats.paiShoWinsHard} vitórias</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-[#c4832a] uppercase tracking-wider flex items-center gap-1">
                                        Lótus Branca <span>(50 XP)</span>
                                    </span>
                                    <span className="font-bold text-[#c4832a] drop-shadow-md">{stats.paiShoWinsMaster} vitórias</span>
                                </div>
                            </div>

                            {/* Total Geral de Vitórias */}
                            <div className="flex justify-between items-baseline pt-2 border-t border-white/5">
                                <span className="text-gray-400 text-[10px] uppercase tracking-widest">Total de Partidas Ganhas</span>
                                <span className="text-sm font-bold text-white/80">
                                    {totalPaiShoWins}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pergaminhos / Trivia Card */}
                    <div className="bg-[#10131c]/60 border border-white/5 rounded-xl p-5 hover:bg-[#161a25]/80 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xl">📜</span>
                            <h4 className="text-sm font-bold tracking-widest uppercase text-[#dcb670]">Conhecimento</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-baseline">
                                <span className="text-gray-400 text-xs uppercase tracking-wider">Pontos Wan Shi Tong</span>
                                <span className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                                    {stats.pergaminhosScore.toLocaleString()}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-2 bg-white/5 p-2 rounded">
                                Jogue a trivia para acumular os pontos do conhecimento do Avatar.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-white/5">
                    <Link href="/perfil">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white transition-all"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                            }}
                        >
                            Ver Perfil Completo
                        </motion.button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
