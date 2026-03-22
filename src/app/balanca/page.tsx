'use client';

import NationLeaderboard from '@/components/ranking/NationLeaderboard';
import Navbar from '@/components/Navbar';

export default function BalancaMundoPage() {
  return (
    <div className="min-h-screen text-white relative">
      <Navbar />
      
      {/* Background épico estático + gradiente temático */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#0f111a] via-[#1a1c2e] to-[#0f111a] pointer-events-none" 
      />
      
      <main className="pt-32 pb-40 relative z-10 flex flex-col items-center min-h-screen">
        
        {/* Lente flare mágica no topo */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-64 bg-yellow-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <header className="text-center mb-0 max-w-3xl px-4">
          <h1 
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-100 to-yellow-600 drop-shadow-[0_0_20px_rgba(250,204,21,0.2)] mb-6" 
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            A Balança do Mundo
          </h1>
          <p className="text-[#d4c4a8] text-lg font-serif leading-relaxed font-light">
            Testemunhe a jornada das Quatro Nações. Cada aprendizado, cada vitória no Pai Sho e sabedoria descoberta contribui para a harmonia global. A nação mais diligente lidera o equilíbrio.
          </p>
        </header>

        <div className="w-full">
          <NationLeaderboard />
        </div>

      </main>
    </div>
  );
}
