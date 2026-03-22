/**
 * src/app/arena/arcade/nomad-jump/page.tsx
 *
 * Salto do Nômade — Jogo de escalada infinita estilo Doodle Jump.
 */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Configurações
const GRAVITY = 0.35;
const JUMP_POWER = -13;
const PLATFORM_COUNT = 12;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;

interface Platform {
  id: number;
  x: number;
  y: number;
  width: number;
  type: 'normal' | 'moving' | 'breaking';
  direction: number;
}

export default function NomadJumpPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  
  const [gameState, setGameState] = useState<{
    player: { x: number; y: number; vx: number; vy: number };
    platforms: Platform[];
    cameraY: number;
    score: number;
  }>({
    player: { x: 185, y: 560, vx: 0, vy: -10 },
    platforms: [],
    cameraY: 0,
    score: 0
  });

  const requestRef = useRef<number>(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const saved = localStorage.getItem('nomad-jump-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const createPlatform = (y: number, id: number): Platform => {
    const types: ('normal' | 'moving' | 'breaking')[] = ['normal', 'normal', 'normal', 'moving', 'breaking'];
    return {
      id,
      x: Math.random() * (CANVAS_WIDTH - 60),
      y,
      width: 60,
      type: types[Math.floor(Math.random() * types.length)],
      direction: Math.random() > 0.5 ? 1 : -1,
    };
  };

  const initGame = () => {
    const initialPlatforms: Platform[] = [];
    for (let i = 0; i < PLATFORM_COUNT; i++) {
      initialPlatforms.push(createPlatform(600 - i * 80, i));
    }
    initialPlatforms[0] = { ...initialPlatforms[0], x: 170, y: 580, type: 'normal' };
    
    setGameState({
      player: { x: 185, y: 550, vx: 0, vy: JUMP_POWER },
      platforms: initialPlatforms,
      cameraY: 0,
      score: 0
    });
    setGameOver(false);
    setGameStarted(true);
  };

  const update = useCallback(() => {
    if (gameOver || !gameStarted) return;

    setGameState(prev => {
      let { player, platforms, cameraY, score } = prev;
      let nx = player.x;
      let ny = player.y;
      let nvx = player.vx;
      let nvy = player.vy + GRAVITY;

      // Movimento lateral
      if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) { nvx = -6; }
      else if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) { nvx = 6; }
      else { nvx *= 0.8; }

      nx += nvx;
      ny += nvy;

      // Wrap-around
      if (nx < -30) nx = CANVAS_WIDTH;
      if (nx > CANVAS_WIDTH) nx = -30;

      // Colisões com plataformas (apenas quando caindo)
      if (nvy > 0) {
        for (let plat of platforms) {
          if (ny + 40 > plat.y && ny + 40 < plat.y + 20 && nx + 35 > plat.x && nx < plat.x + plat.width) {
            nvy = JUMP_POWER;
            if (plat.type === 'breaking') {
              plat.y = 2000;
            }
            break;
          }
        }
      }

      // Câmera segue o jogador para cima
      if (ny < cameraY + 250) {
        cameraY = ny - 250;
      }

      // Movimento das plataformas móveis e reciclagem
      let maxPlatformY = platforms.length > 0 ? Math.min(...platforms.map(p => p.y)) : 0;
      const newPlatforms = platforms.map(plat => {
        let p = { ...plat };
        if (p.type === 'moving') {
          p.x += p.direction * 2;
          if (p.x < 0 || p.x > CANVAS_WIDTH - p.width) p.direction *= -1;
        }
        
        if (p.y > cameraY + CANVAS_HEIGHT) {
          score = Math.max(score, Math.floor(Math.abs(cameraY) / 10));
          return createPlatform(maxPlatformY - 80, Date.now() + Math.random());
        }
        return p;
      });

      if (ny > cameraY + CANVAS_HEIGHT + 100) {
        setGameOver(true);
      }

      return { player: { x: nx, y: ny, vx: nvx, vy: nvy }, platforms: newPlatforms, cameraY, score };
    });

    requestRef.current = requestAnimationFrame(update);
  }, [gameOver, gameStarted]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameStarted, gameOver, update]);

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => { keysRef.current[e.code] = true; };
    const handleUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameStarted || gameOver) return;
      const rect = document.getElementById('game-container')?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        setGameState(prev => ({
          ...prev,
          player: { ...prev.player, x: Math.max(-20, Math.min(CANVAS_WIDTH - 20, mouseX - 20)) }
        }));
      }
    };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameOver && gameState.score > highScore) {
      setHighScore(gameState.score);
      localStorage.setItem('nomad-jump-highscore', gameState.score.toString());
    }
  }, [gameOver, gameState.score, highScore]);

  return (
    <main className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-6 select-none overflow-hidden font-lora">
      <div 
        id="game-container"
        className="relative w-full max-w-[400px] h-[600px] bg-sky-950/20 border-4 border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm"
        style={{ backgroundImage: 'linear-gradient(to bottom, #1e3a8a30, #00000040)' }}
      >
        {/* Sky Background Parallax */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{ transform: `translateY(${-gameState.cameraY * 0.2}px)` }}
        >
          <div className="absolute top-[200px] left-10 text-8xl">☁️</div>
          <div className="absolute top-[800px] right-10 text-9xl">☁️</div>
          <div className="absolute top-[1400px] left-20 text-7xl">☁️</div>
        </div>

        {/* HUD */}
        <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
          <Link 
            href="/arena/arcade" 
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-[#fbbf24] transition-all rounded-full border border-white/20 group/back cursor-pointer"
          >
            <span className="text-white group-hover/back:text-black transition-colors text-xl">←</span>
          </Link>
          <div className="text-white/60">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Altitude</p>
            <p className="text-3xl font-black text-white">{gameState.score} <span className="text-xs text-white/30 tracking-normal">M</span></p>
          </div>
        </div>

        {/* World Layer */}
        <div className="absolute inset-0" style={{ transform: `translateY(${-gameState.cameraY}px)` }}>
          {/* Platforms */}
          {gameState.platforms.map((p) => (
            <div 
              key={p.id}
              className={`absolute rounded-full border border-white/10 shadow-lg transition-colors
                ${p.type === 'normal' ? 'bg-white/40' : p.type === 'moving' ? 'bg-yellow-400/40 border-yellow-200/20' : 'bg-red-400/40 border-red-200/20 opacity-80'}`}
              style={{ left: p.x, top: p.y, width: p.width, height: 12 }}
            >
              {p.type === 'moving' && <div className="absolute inset-0 animate-pulse bg-yellow-200/20 rounded-full" />}
            </div>
          ))}

          {/* Player (Nomad) */}
          <motion.div 
            className="absolute text-5xl flex items-center justify-center"
            style={{ left: gameState.player.x, top: gameState.player.y, width: 40, height: 40 }}
            animate={{ scale: gameState.player.vy < 0 ? [1, 1.1, 1] : 1 }}
          >
            🌬️
          </motion.div>
        </div>

        {/* Wind Effects */}
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute w-px h-20 bg-gradient-to-t from-white/10 to-transparent"
              style={{ left: `${20 + i * 30}%`, top: '-10%' }}
              animate={{ y: ['0%', '700%'], opacity: [0, 0.4, 0] }}
              transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Telas de Estado */}
        <AnimatePresence>
          {!gameStarted && !gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
            >
              <h2 className="text-5xl font-black text-[#fbbf24] mb-4" style={{ fontFamily: 'var(--font-cinzel)' }}>Salto do Nômade</h2>
              <p className="text-white/60 italic mb-8 max-w-xs leading-relaxed uppercase tracking-widest text-[10px]">
                As setas do seu destino apontam para cima. Use as teclas A/D ou setas para guiar o vento.
              </p>
              <button 
                onClick={initGame}
                className="px-10 py-5 bg-[#fbbf24] text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all shadow-2xl active:scale-95"
              >
                Elevar Espírito
              </button>
            </motion.div>
          )}

          {gameOver && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 z-50 bg-[#0b0e14]/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8"
            >
              <h2 className="text-5xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-cinzel)' }}>QUEDA</h2>
              <p className="text-white/40 italic mb-10 uppercase tracking-widest text-[10px]">Sua jornada física cessou aqui</p>
              
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mb-8 w-full max-w-[200px]">
                <p className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Altitude</p>
                <p className="text-5xl font-black text-white mb-2">{gameState.score}</p>
                {gameState.score >= highScore && gameState.score > 0 && (
                  <p className="text-yellow-400 font-bold text-[8px] uppercase tracking-widest">✨ NOVO APOGEU! ✨</p>
                )}
              </div>

              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={initGame}
                  className="px-8 py-4 bg-[#fbbf24] text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all shadow-xl"
                >
                  Tentar Novamente
                </button>
                <Link href="/arena/arcade">
                  <button className="px-8 py-4 bg-white/5 text-white/50 font-bold uppercase tracking-widest text-[10px] rounded-full border border-white/10 hover:bg-white/10 transition-all">
                    Voltar ao Arcade
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
