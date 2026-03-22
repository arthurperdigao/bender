/**
 * src/components/ranking/NationLeaderboard.tsx
 * Componente de Ranking Global das Nações — Estilo HUD Premium.
 */
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getNationsRanking } from "@/lib/actions/user";

type NationRank = {
    id: string;
    totalXp: number;
    members: number;
    topPlayer: string;
};

const NATION_DETAILS: Record<string, { label: string; icon: string; color: string; bg: string }> = {
    water: { label: "Tribo da Água", icon: "🌊", color: "#66e0ff", bg: "rgba(0, 184, 255, 0.1)" },
    earth: { label: "Reino da Terra", icon: "⛰️", color: "#a3ffb4", bg: "rgba(0, 255, 37, 0.05)" },
    fire: { label: "Nação do Fogo", icon: "🔥", color: "#ff9966", bg: "rgba(255, 72, 0, 0.1)" },
    air: { label: "Nômades do Ar", icon: "🌪️", color: "#ffcc66", bg: "rgba(255, 153, 0, 0.1)" },
};

export default function NationLeaderboard() {
    const [rankings, setRankings] = useState<NationRank[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRankings() {
            const data = await getNationsRanking();
            setRankings(data as NationRank[]);
            setLoading(false);
        }
        loadRankings();
    }, []);

    if (loading) return null;

    // XP máximo para a barra (proporcional ao líder)
    const maxXP = rankings.length > 0 ? rankings[0].totalXp : 1000;

    return (
        <section className="w-full max-w-6xl mx-auto py-24 px-4 relative">
            
            {/* Título da Seção */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-xs font-bold tracking-[0.8em] uppercase text-[#dcb670] mb-4" 
                    style={{ fontFamily: "var(--font-cinzel)" }}>
                    Equilíbrio de Poder
                </h2>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest" 
                    style={{ fontFamily: "var(--font-cinzel)" }}>
                    Salão das Lendas
                </h3>
                <div className="mx-auto w-24 h-[1px] bg-gradient-to-r from-transparent via-[#dcb670] to-transparent mt-8" />
            </motion.div>

            {/* Grid de Ranking */}
            <div className="space-y-6">
                {rankings.map((rank, index) => {
                    const info = NATION_DETAILS[rank.id] || { label: "Desconhecido", icon: "❓", color: "#white", bg: "transparent" };
                    const progress = (rank.totalXp / maxXP) * 100;

                    return (
                        <motion.div
                            key={rank.id}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group p-1"
                        >
                            {/* Card Background */}
                            <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 rounded-2xl bg-[#0a101a]/60 backdrop-blur-xl border border-white/5 transition-all duration-500 group-hover:border-[#dcb670]/30">
                                
                                {/* Rank Number & Icon */}
                                <div className="flex items-center gap-6 md:w-1/4">
                                    <span className="text-4xl font-black text-white/10" style={{ fontFamily: "var(--font-cinzel)" }}>
                                        0{index + 1}
                                    </span>
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border border-white/10 bg-white/5 shadow-xl">
                                        {info.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-lg font-bold text-white tracking-widest uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                                            {info.label}
                                        </h4>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                            {rank.members} Dobradores
                                        </p>
                                    </div>
                                </div>

                                {/* XP Progress Bar */}
                                <div className="flex-1 w-full order-3 md:order-2">
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Poder Elemental</p>
                                        <p className="text-sm font-black text-white">{rank.totalXp.toLocaleString()} <span className="opacity-40 text-[10px]">XP</span></p>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${progress}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full rounded-full"
                                            style={{ background: `linear-gradient(90deg, ${info.color}dd, ${info.color})`, boxShadow: `0 0 15px ${info.color}44` }}
                                        />
                                    </div>
                                </div>

                                {/* Leader / Top Player */}
                                <div className="md:w-1/4 text-center md:text-right order-2 md:order-3">
                                    <p className="text-[10px] text-[#dcb670] uppercase tracking-widest font-bold mb-1">Mestre Atual</p>
                                    <p className="text-sm font-black text-white uppercase tracking-widest" style={{ fontFamily: "var(--font-cinzel)" }}>
                                        {rank.topPlayer}
                                    </p>
                                </div>

                                {/* Glow Decorativo de Fundo */}
                                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[40px] rounded-full pointer-events-none" 
                                     style={{ background: info.bg }} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom Note */}
            <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-center mt-12 text-white/20 text-[10px] uppercase tracking-[0.4em] font-bold"
            >
                * O equilíbrio é mantido pelas ações de cada membro.
            </motion.p>
        </section>
    );
}
