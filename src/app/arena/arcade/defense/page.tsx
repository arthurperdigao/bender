/**
 * src/app/arena/arcade/defense/page.tsx
 *
 * Defesa da Ordem — Jogo de reflexo e cliques rápidos.
 */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Configurações
const INITIAL_SPEED = 1.2;
const SPEED_INCREMENT = 0.05;
const SPAWN_RATE = 1500; // ms
const MAX_LIVES = 8;

interface Projectile {
  id: number;
  x: number;
  y: number;
  type: 'fire' | 'earth' | 'water' | 'air';
  size: number;
  speed: number;
}

export default function DefensePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [difficulty, setDifficulty] = useState(INITIAL_SPEED);

  const requestRef = useRef<number>(0);
  const lastSpawnTimeRef = useRef<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('defense-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const spawnProjectile = useCallback((time: number) => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 80 + 10; // 10% a 90%
    const types: ('fire' | 'earth' | 'water' | 'air')[] = ['fire', 'earth', 'water', 'air'];
    const type = types[Math.floor(Math.random() * types.length)];
    const size = 40 + Math.random() * 30;
    
    setProjectiles(prev => [...prev, { id, x, y: -10, type, size, speed: difficulty }]);
    lastSpawnTimeRef.current = time;
  }, [difficulty]);

  const update = useCallback((time: number) => {
    if (gameOver || !gameStarted) return;

    // Spawn gradual
    if (time - lastSpawnTimeRef.current > Math.max(300, SPAWN_RATE - score * 5)) {
      spawnProjectile(time);
    }

    setProjectiles(prev => {
      const moved = prev.map(p => ({ ...p, y: p.y + p.speed }));
      
      // Colisão com o fundo
      const escaped = moved.filter(p => p.y > 100);
      if (escaped.length > 0) {
        setLives(l => {
          const newLives = l - escaped.length;
          if (newLives <= 0) setGameOver(true);
          return Math.max(0, newLives);
        });
      }

      return moved.filter(p => p.y <= 100);
    });

    // Aumentar dificuldade
    if (score > 0 && score % 10 === 0) {
      setDifficulty(d => d + SPEED_INCREMENT / 100);
    }

    requestRef.current = requestAnimationFrame(update);
  }, [gameOver, gameStarted, score, spawnProjectile]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameStarted, gameOver, update]);

  const handleDeflect = (id: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (gameOver) return;
    setProjectiles(prev => prev.filter(p => p.id !== id));
    setScore(s => s + 1);
  };

  const resetGame = () => {
    setProjectiles([]);
    setScore(0);
    setLives(MAX_LIVES);
    setDifficulty(INITIAL_SPEED);
    setGameOver(false);
    setGameStarted(false);
  };

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('defense-highscore', score.toString());
    }
  }, [gameOver, score, highScore]);

  return (
    <main className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-6 select-none overflow-hidden font-lora">
      <div className="relative w-full max-w-[600px] h-[800px] bg-white/[0.02] border-4 border-white/5 rounded-[40px] overflow-hidden backdrop-blur-sm cursor-crosshair shadow-2xl">
        {/* Sky Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 via-transparent to-black/40 pointer-events-none" />

        {/* HUD Superior */}
        <header className="absolute top-8 left-0 right-0 px-8 flex justify-between items-center z-50 pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
            <Link 
              href="/arena/arcade" 
              className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-[#dcb670] transition-all rounded-full border border-white/10 group/back"
            >
              <span className="text-white group-hover/back:text-black transition-colors text-xl">←</span>
            </Link>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">Defesas</p>
              <p className="text-4xl font-black text-white">{score}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <span key={i} className={`text-xl transition-opacity duration-300 ${i < lives ? 'opacity-100' : 'opacity-20 '}`}>
                🏮
              </span>
            ))}
          </div>
        </header>

        {/* Projectiles Layer */}
        <div className="absolute inset-0 z-40">
          {projectiles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onMouseDown={(e) => handleDeflect(p.id, e)}
              onTouchStart={(e) => handleDeflect(p.id, e)}
              className="absolute cursor-pointer group flex items-center justify-center"
              style={{ 
                left: `${p.x}%`, 
                top: `${p.y}%`, 
                width: p.size, 
                height: p.size,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Glow */}
              <div 
                className={`absolute inset-0 blur-xl opacity-40 group-hover:opacity-80 transition-opacity rounded-full
                  ${p.type === 'fire' ? 'bg-orange-600' : p.type === 'earth' ? 'bg-green-800' : p.type === 'water' ? 'bg-blue-600' : 'bg-yellow-200'}`}
              />
              <span className="text-3xl relative z-10 drop-shadow-lg">
                {p.type === 'fire' ? '☄️' : p.type === 'earth' ? '🪨' : p.type === 'water' ? '🌊' : '🌪️'}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Overlay do Chão (Defesa) */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#dcb670]/20 to-transparent border-t border-[#dcb670]/30 z-30" />

        {/* Telas de Estado */}
        <AnimatePresence>
          {!gameStarted && !gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-12"
            >
              <h2 className="text-5xl font-black text-[#dcb670] mb-6" style={{ fontFamily: 'var(--font-cinzel)' }}>Defesa da Ordem</h2>
              <p className="text-white/60 italic mb-12 max-w-sm leading-relaxed uppercase tracking-widest text-xs">
                Ataques da Nação do Fogo estão vindo do céu! Clique neles para neutralizar as dobras antes que atinjam o templo.
              </p>
              <button 
                onClick={() => setGameStarted(true)}
                className="px-12 py-5 bg-[#dcb670] text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all shadow-2xl active:scale-95"
              >
                Assumir Posto de Defesa
              </button>
            </motion.div>
          )}

          {gameOver && (
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 z-50 bg-red-950/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-12"
            >
              <h1 className="text-6xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-cinzel)' }}>DERROTA</h1>
              <p className="text-[#dcb670] font-bold text-xs mb-12 uppercase tracking-[0.5em]">O templo foi atingido</p>
              
              <div className="bg-black/30 p-8 rounded-3xl border border-white/5 mb-12 min-w-[240px]">
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2 font-bold">Total de Defesas</p>
                <p className="text-6xl font-black text-white mb-6 leading-none">{score}</p>
                <div className="h-px bg-white/10 mb-4" />
                <p className="text-[10px] uppercase tracking-widest text-[#dcb670]/60">Melhor Histórico: {highScore}</p>
              </div>

              <div className="flex flex-col gap-4 w-full max-w-xs">
                <button 
                  onClick={resetGame}
                  className="px-8 py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-[#dcb670] transition-all shadow-xl"
                >
                  Tentar Novamente
                </button>
                <Link href="/arena/arcade">
                  <button className="px-8 py-5 bg-white/5 text-white/50 font-bold uppercase tracking-widest text-[10px] rounded-full border border-white/10 hover:bg-white/10 transition-all">
                    Abandonar Arena
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="m-0" />
      </div>
    </main>
  );
}
