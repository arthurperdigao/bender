/**
 * src/app/arena/arcade/flappy-appa/page.tsx
 *
 * Flappy Appa — Mini-game viciante estilo Flappy Bird.
 */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Configurações do Jogo
const GRAVITY = 0.45;
const JUMP_STRENGTH = -7;
const PIPE_SPEED = 3.5;
const PIPE_SPAWN_RATE = 1800; // ms
const BIRD_SIZE = 40;
const PIPE_WIDTH = 60;
const PIPE_GAP = 220;

interface PipeData {
  id: number;
  x: number;
  topHeight: number;
  passed: boolean;
}

export default function FlappyAppaPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [birdY, setBirdY] = useState(300);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<PipeData[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const lastPipeTimeRef = useRef<number>(0);

  // Carregar HighScore
  useEffect(() => {
    const saved = localStorage.getItem('flappy-appa-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Loop do Jogo
  const update = useCallback((time: number) => {
    if (gameOver || !gameStarted) return;

    setBirdY((y) => {
      const newY = y + birdVelocity;
      // Colisão com teto ou chão
      if (newY < 0 || newY > 560) {
        setGameOver(true);
        return y;
      }
      return newY;
    });

    setBirdVelocity((v) => v + GRAVITY);

    // Gerar canos
    if (time - lastPipeTimeRef.current > PIPE_SPAWN_RATE) {
      const minHeight = 50;
      const maxHeight = 350;
      const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      
      setPipes((prev) => [
        ...prev,
        { id: Date.now(), x: 800, topHeight, passed: false },
      ]);
      lastPipeTimeRef.current = time;
    }

    // Mover canos e verificar colisões
    setPipes((prev) => {
      const newPipes = prev
        .map((p) => ({ ...p, x: p.x - PIPE_SPEED }))
        .filter((p) => p.x + PIPE_WIDTH > -100);

      // Verificar pontuação e colisão
      newPipes.forEach((p) => {
        // Pontuação
        if (!p.passed && p.x < 100) {
          p.passed = true;
          setScore((s) => s + 1);
        }

        // Colisão (Bird está em x=100)
        const birdX = 100;
        const birdTop = birdY;
        const birdBottom = birdY + BIRD_SIZE;
        const birdRight = birdX + BIRD_SIZE;

        if (
          birdRight > p.x &&
          birdX < p.x + PIPE_WIDTH &&
          (birdTop < p.topHeight || birdBottom > p.topHeight + PIPE_GAP)
        ) {
          setGameOver(true);
        }
      });

      return newPipes;
    });

    requestRef.current = requestAnimationFrame(update);
  }, [birdVelocity, birdY, gameOver, gameStarted]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameStarted, gameOver, update]);

  // Controles
  const jump = useCallback(() => {
    if (gameOver) return;
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }
    setBirdVelocity(JUMP_STRENGTH);
  }, [gameOver, gameStarted]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') jump();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [jump]);

  // Game Over handling
  useEffect(() => {
    if (gameOver) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('flappy-appa-highscore', score.toString());
      }
    }
  }, [gameOver, score, highScore]);

  const reset = () => {
    setBirdY(300);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  return (
    <main className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-6 select-none overflow-hidden">
      <div 
        ref={containerRef}
        onClick={jump}
        className="relative w-full max-w-[800px] h-[600px] bg-sky-900/20 border-4 border-white/10 rounded-3xl overflow-hidden cursor-pointer"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #1e3a8a30, #00000060)',
        }}
      >
        {/* Fundo Decorativo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-20 text-9xl">☁️</div>
          <div className="absolute top-60 right-40 text-8xl">☁️</div>
          <div className="absolute bottom-20 left-1/2 text-9xl">☁️</div>
        </div>

        {/* HUD */}
        <div className="absolute top-8 left-8 z-50 flex items-center gap-6">
          <Link 
            href="/arena/arcade" 
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-[#dcb670] transition-all rounded-full border border-white/20 group/back pointer-events-auto"
          >
            <span className="text-white group-hover/back:text-black transition-colors text-xl">←</span>
          </Link>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1">Pontuação</p>
            <p className="text-4xl font-black text-white">{score}</p>
          </div>
        </div>
        <div className="absolute top-8 right-8 z-50 text-right">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#dcb670]/50 mb-1">Recorde</p>
          <p className="text-2xl font-black text-[#dcb670]">{highScore}</p>
        </div>

        {/* Appa (Bird) */}
        <motion.div 
          className="absolute left-[100px] z-40 text-5xl"
          style={{ top: birdY, width: BIRD_SIZE, height: BIRD_SIZE }}
          animate={{ rotate: birdVelocity * 3 }}
        >
          🦬
        </motion.div>

        {/* Canos (Pilares) */}
        {pipes.map((p) => (
          <React.Fragment key={p.id}>
            {/* Cano Superior */}
            <div 
              className="absolute bg-gradient-to-b from-stone-800 to-stone-700 border-x-2 border-b-4 border-white/10"
              style={{ left: p.x, top: 0, width: PIPE_WIDTH, height: p.topHeight, borderRadius: '0 0 8px 8px' }}
            />
            {/* Cano Inferior */}
            <div 
              className="absolute bg-gradient-to-t from-stone-800 to-stone-700 border-x-2 border-t-4 border-white/10"
              style={{ left: p.x, top: p.topHeight + PIPE_GAP, width: PIPE_WIDTH, height: 600 - (p.topHeight + PIPE_GAP), borderRadius: '8px 8px 0 0' }}
            />
          </React.Fragment>
        ))}

        {/* Telas de Estado */}
        <AnimatePresence>
          {!gameStarted && !gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8"
            >
              <h2 className="text-5xl font-black text-[#dcb670] mb-4" style={{ fontFamily: 'var(--font-cinzel)' }}>Flappy Appa</h2>
              <p className="text-white/70 italic mb-8 max-w-md">Ajude o Appa a voar pelos Pilares de Pedra do Reino da Terra!</p>
              <div className="flex flex-col items-center gap-4">
                <p className="text-white font-bold animate-bounce tracking-widest uppercase text-xs">Pressione ESPAÇO ou CLIQUE para começar</p>
                <div className="flex gap-4">
                  <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] text-white/50 border border-white/10 uppercase">Espaço = Voar</div>
                  <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] text-white/50 border border-white/10 uppercase">Mouse = Voar</div>
                </div>
              </div>
            </motion.div>
          )}

          {gameOver && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 z-50 bg-red-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
            >
              <h2 className="text-6xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-cinzel)' }}>GAME OVER</h2>
              <p className="text-[#dcb670] font-bold text-xl mb-8 uppercase tracking-widest">O Voo foi Interrompido</p>
              
              <div className="bg-black/40 p-6 rounded-2xl border border-white/10 mb-8 min-w-[200px]">
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Pontuação Final</p>
                <p className="text-5xl font-black text-white mb-4">{score}</p>
                {score >= highScore && score > 0 && (
                  <p className="text-yellow-400 font-bold text-[10px] uppercase tracking-widest">✨ NOVO RECORDE! ✨</p>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  className="px-8 py-4 bg-[#dcb670] text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all shadow-xl"
                >
                  Tentar Novamente
                </button>
                <Link href="/arena/arcade">
                  <button className="px-8 py-4 bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-full border border-white/20 hover:bg-white/20 transition-all">
                    Sair
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
