'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface NationData {
  element: string;
  score: number;
  percentage: number;
}

export const UserBalancaWidget = ({ userElement }: { userElement: string | null }) => {
  const [rankings, setRankings] = useState<NationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRanking() {
      try {
        const res = await fetch('/api/ranking/nations');
        const data = await res.json();
        if (data.success) {
          setRankings(data.rankings);
        }
      } catch (error) {
        console.error("Erro ao puxar ranking no widget:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRanking();
  }, []);

  if (!userElement) {
    return (
      <div className="p-6 mb-10 rounded-2xl bg-white/5 border border-white/10 text-center text-sm opacity-60 w-full max-w-3xl mx-auto">
        Descubra seu elemento no Quiz para participar d&apos;A Balança do Mundo.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 mb-10 rounded-2xl bg-white/5 border border-white/10 text-center text-sm opacity-60 w-full max-w-3xl mx-auto animate-pulse flex items-center justify-center">
        Buscando registos espirituais...
      </div>
    );
  }

  // Normaliza o elemento caso venha do banco com acento
  const userNato = userElement === 'ÁGUA' ? 'AGUA' : userElement.toUpperCase();
  const position = rankings.findIndex(r => r.element === userNato) + 1;
  const nationData = rankings.find(r => r.element === userNato);
  const leading = position === 1;

  let highlightColor = 'text-yellow-400';
  if (position === 2) highlightColor = 'text-gray-300';
  if (position === 3) highlightColor = 'text-orange-400';
  if (position === 4) highlightColor = 'text-red-400';

  return (
    <Link href="/balanca" className="block w-full mb-10 decoration-transparent">
      <motion.div 
        className="p-6 rounded-2xl relative overflow-hidden group border border-[#d4c4a8]/20 bg-[#161a25]/60 hover:bg-[#161a25]/90 transition-colors backdrop-blur-md shadow-2xl"
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Glow de liderança */}
        {leading && (
          <div className="absolute inset-0 bg-yellow-500/10 opacity-50 blur-xl group-hover:opacity-100 transition-opacity pointer-events-none" />
        )}
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xs uppercase tracking-widest text-[#d4c4a8] mb-2 font-bold" style={{ fontFamily: "var(--font-cinzel), serif" }}>
              A Balança do Mundo ⚖️
            </h3>
            {position > 0 ? (
              <p className="text-sm md:text-base text-gray-300 leading-relaxed font-serif">
                A sua nação assumiu o <span className={`${highlightColor} font-bold text-lg`}>{position}º lugar</span> no ranking global de Harmonia, contribuindo com <span className="text-white font-bold">{nationData?.score.toLocaleString()}</span> XP.
              </p>
            ) : (
              <p className="text-sm text-gray-300">
                Sua nação ainda não acumulou pontos no ranking global.
              </p>
            )}
            
            <p className="text-xs text-gray-500 italic mt-2">
              {leading ? "Vocês lideram o mundo! Continue jogando Pai Sho ou Trivia para manter a paz." : "Eles precisam da sua chama para restaurar o equilíbrio! Jogue títulos na Arena para ajudar."}
            </p>
          </div>

          <div className="shrink-0">
            <div className="bg-[#0f111a] px-6 py-3 rounded-full border border-yellow-600/50 whitespace-nowrap text-xs text-yellow-500 uppercase tracking-widest font-bold group-hover:bg-yellow-600 group-hover:text-black group-hover:shadow-[0_0_15px_rgba(202,138,4,0.6)] transition-all duration-300 w-full text-center">
              Ver Ranking Global →
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
