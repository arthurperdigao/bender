/**
 * src/app/arena/arcade/page.tsx
 *
 * Arcade Elemental — Hub de Mini-Games viciantes.
 */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const GAMES = [
  {
    id: 'flappy-appa',
    title: '🦬 Flappy Appa',
    description: 'Voe pelos céus e desvie de projéteis e montanhas.',
    href: '/arena/arcade/flappy-appa',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.2)',
  },
  {
    id: '2048',
    title: '🧩 Avatar 2048',
    description: 'Combine os elementos para alcançar o Estado Avatar.',
    href: '/arena/arcade/avatar-2048',
    color: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.2)',
  },
  {
    id: 'defense',
    title: '☄️ Defesa da Ordem',
    description: 'Destrua os ataques elementais antes que atinjam o chão.',
    href: '/arena/arcade/defense',
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.2)',
  },
  {
    id: 'nomad-jump',
    title: '🏔️ Salto do Nômade',
    description: 'Pule cada vez mais alto fugindo da Nação do Fogo.',
    href: '/arena/arcade/nomad-jump',
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.2)',
  },
];

export default function ArcadePage() {
  return (
    <main className="min-h-screen bg-[#0b0e14] text-white py-20 px-6 font-lora">
      {/* Estética de fundo */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[url('/assets/arcade-hero.png')] bg-cover bg-center grayscale blur-md scale-110" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')]" />
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-blue-900/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="relative text-center mb-16">
          <div className="flex justify-center mb-8">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/30 hover:text-[#dcb670] transition-colors group px-6 py-2 border border-white/5 bg-white/[0.02] rounded-full"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Voltar ao Portal Principal
            </Link>
          </div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-[0.2em] mb-4 text-[#dcb670]"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            Arcade Elemental
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl italic opacity-60 tracking-widest"
          >
            Supere seus limites em jogos de habilidade e reflexo.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {GAMES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Link href={game.href}>
                <div 
                  className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl hover:bg-white/[0.06] hover:border-[#dcb670]/30 transition-all duration-500 overflow-hidden h-full flex flex-col justify-end min-h-[280px]"
                  style={{ boxShadow: `0 10px 40px -10px rgba(0,0,0,0.5)` }}
                >
                  {/* Glow do elemento */}
                  <div 
                    className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                    style={{ backgroundColor: game.color }}
                  />

                  <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-3 text-white group-hover:text-[#dcb670] transition-colors" style={{ fontFamily: 'var(--font-cinzel)' }}>
                      {game.title}
                    </h3>
                    <p className="text-sm opacity-50 mb-6 group-hover:opacity-80 transition-opacity italic">
                      {game.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#dcb670]">
                      Jogar Agora ✦
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Removido o botão de baixo pois agora temos um melhor no topo */}
      </div>
    </main>
  );
}
