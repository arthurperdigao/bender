/**
 * src/app/arena/arcade/avatar-2048/page.tsx
 *
 * Avatar 2048 — Premium Edition (Final Fix).
 * Corrigindo sobreposição e animações de deslize.
 */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Configurações
const GRID_SIZE = 4;
const TILE_LEVELS: Record<number, { label: string, color: string, icon: string, textColor: string, glow?: string }> = {
  2: { label: 'Gelo', color: '#e0f2fe', icon: '❄️', textColor: '#0369a1' },
  4: { label: 'Água', color: '#bfdbfe', icon: '🌊', textColor: '#1e40af' },
  8: { label: 'Pântano', color: '#dcfce7', icon: '🌿', textColor: '#166534' },
  16: { label: 'Terra', color: '#fef3c7', icon: '⛰️', textColor: '#92400e' },
  32: { label: 'Metal', color: '#f1f5f9', icon: '⚙️', textColor: '#334155' },
  64: { label: 'Lava', color: '#fee2e2', icon: '🌋', textColor: '#991b1b' },
  128: { label: 'Fogo', color: '#ffedd5', icon: '🔥', textColor: '#9a3412' },
  256: { label: 'Raio', color: '#fef9c3', icon: '⚡', textColor: '#854d0e' },
  512: { label: 'Nuvem', color: '#f8fafc', icon: '☁️', textColor: '#475569' },
  1024: { label: 'Ar', color: '#ecfeff', icon: '🌬️', textColor: '#0e7490' },
  2048: { label: 'Avatar', color: '#ffffff', icon: '🌀', textColor: '#1e293b', glow: '0 0 25px rgba(255,255,255,1)' },
};

interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  mergedFrom?: number[];
}

export default function Avatar2048Page() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const nextIdRef = useRef(1);

  useEffect(() => {
    const saved = localStorage.getItem('avatar-2048-highscore');
    if (saved) setHighScore(parseInt(saved));
    initGame();
  }, []);

  const getEmptyCells = (currentTiles: Tile[]) => {
    const occupied = new Set(currentTiles.map(t => `${t.row}-${t.col}`));
    const empty = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!occupied.has(`${r}-${c}`)) empty.push({ r, c });
      }
    }
    return empty;
  };

  const addTile = (currentTiles: Tile[]) => {
    const empty = getEmptyCells(currentTiles);
    if (empty.length === 0) return currentTiles;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    const newTile: Tile = {
      id: nextIdRef.current++,
      value: Math.random() < 0.9 ? 2 : 4,
      row: r,
      col: c
    };
    return [...currentTiles, newTile];
  };

  const initGame = () => {
    nextIdRef.current = 1;
    let newTiles = addTile([]);
    newTiles = addTile(newTiles);
    setTiles(newTiles);
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    setTiles(prevTiles => {
      let moved = false;
      let currentScoreIncrease = 0;
      let currentTiles = prevTiles.map(t => ({ ...t, mergedFrom: undefined }));
      let newTiles: Tile[] = [];

      const isVertical = direction === 'up' || direction === 'down';
      const isReverse = direction === 'right' || direction === 'down';

      for (let i = 0; i < GRID_SIZE; i++) {
        let lineTiles = currentTiles.filter(t => (isVertical ? t.col : t.row) === i);
        lineTiles.sort((a, b) => (isVertical ? a.row - b.row : a.col - b.col));
        if (isReverse) lineTiles.reverse();

        let mergedIds = new Set<number>();
        let targetPos = isReverse ? GRID_SIZE - 1 : 0;

        for (let j = 0; j < lineTiles.length; j++) {
          let t = lineTiles[j];
          let nextT = lineTiles[j + 1];

          if (nextT && t.value === nextT.value && !mergedIds.has(t.id) && !mergedIds.has(nextT.id)) {
            const newValue = t.value * 2;
            currentScoreIncrease += newValue;
            if (newValue === 2048) setWon(true);

            // Animate both tiles to the new position
            const targetTile: Tile = { 
              ...t, 
              value: newValue, 
              mergedFrom: [t.id, nextT.id],
              row: isVertical ? targetPos : t.row,
              col: isVertical ? t.col : targetPos
            };
            newTiles.push(targetTile);
            
            // Still needed for background slide if we wanted, but filter later
            mergedIds.add(t.id);
            mergedIds.add(nextT.id);
            j++; 
            moved = true;
          } else {
            const updatedTile = { ...t };
            if (isVertical) {
              if (updatedTile.row !== targetPos) moved = true;
              updatedTile.row = targetPos;
            } else {
              if (updatedTile.col !== targetPos) moved = true;
              updatedTile.col = targetPos;
            }
            newTiles.push(updatedTile);
          }
          targetPos = isReverse ? targetPos - 1 : targetPos + 1;
        }
      }

      if (moved) {
        setScore(s => s + currentScoreIncrease);
        let updatedWithNew = addTile(newTiles);
        if (getEmptyCells(updatedWithNew).length === 0 && !canMove(updatedWithNew)) setGameOver(true);
        return updatedWithNew;
      }
      return prevTiles;
    });
  }, [gameOver]);

  const canMove = (currentTiles: Tile[]) => {
    const grid: number[][] = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    currentTiles.forEach(t => grid[t.row][t.col] = t.value);
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === 0) return true;
        if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
        if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move('up');
      if (e.key === 'ArrowDown') move('down');
      if (e.key === 'ArrowLeft') move('left');
      if (e.key === 'ArrowRight') move('right');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  const touchStartRef = useRef<{ x: number, y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    touchStartRef.current = { x, y };
  };
  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStartRef.current) return;
    const x = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    const dx = x - touchStartRef.current.x;
    const dy = y - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) move(dx > 0 ? 'right' : 'left');
    } else {
      if (Math.abs(dy) > 30) move(dy > 0 ? 'down' : 'up');
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-6 select-none font-lora overflow-hidden">
      
      <div className="w-full max-w-sm flex justify-between items-center mb-8 relative">
        <div className="flex items-center gap-4">
          <Link 
            href="/arena/arcade" 
            className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-[#dcb670] transition-all rounded-full border border-white/10 group/back"
          >
            <span className="text-white group-hover/back:text-black transition-colors text-xl">←</span>
          </Link>
          <div>
            <h1 className="text-3xl font-black text-[#dcb670] font-cinzel leading-none">AVATAR <span className="text-white">2048</span></h1>
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold mt-1">Domínio Elemental</p>
          </div>
        </div>
        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-center min-w-[70px]">
          <p className="text-[7px] uppercase text-white/40 mb-1 leading-none">Score</p>
          <p className="text-xl font-black text-white leading-none">{score}</p>
        </div>
      </div>

      <div 
        className="relative w-full max-w-sm aspect-square bg-[#1a1c22] p-2 rounded-[24px] shadow-2xl border border-white/5 overflow-hidden"
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Static Grid */}
        <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full">
          {Array(16).fill(null).map((_, i) => (
            <div key={i} className="bg-white/[0.03] rounded-xl" />
          ))}
        </div>

        {/* Dynamic Tiles */}
        <div className="absolute inset-2 pointer-events-none">
          <AnimatePresence>
            {tiles.map(tile => {
              const config = TILE_LEVELS[tile.value] || { label: '?', color: '#fff', icon: '❓', textColor: '#000' };
              return (
                <motion.div
                  key={tile.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    left: `${tile.col * 25}%`,
                    top: `${tile.row * 25}%`,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 38,
                    mass: 1
                  }}
                  className="absolute p-1"
                  style={{ width: '25%', height: '25%' }}
                >
                  <motion.div 
                    className="w-full h-full rounded-xl flex flex-col items-center justify-center shadow-lg border border-white/20"
                    style={{ 
                      backgroundColor: config.color,
                      boxShadow: config.glow || 'none'
                    }}
                    animate={tile.mergedFrom ? { scale: [1, 1.12, 1] } : {}}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="text-2xl mb-0.5">{config.icon}</span>
                    <span 
                      className="text-[8px] font-black uppercase tracking-widest leading-none mt-1"
                      style={{ color: config.textColor }}
                    >
                      {config.label}
                    </span>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md rounded-[24px] flex flex-col items-center justify-center p-8 text-center"
            >
              <h2 className="text-3xl font-black text-white font-cinzel mb-4">FIM DO CICLO</h2>
              <button 
                onClick={initGame}
                className="px-10 py-4 bg-[#dcb670] text-black font-black uppercase text-[10px] rounded-full hover:bg-white transition-all shadow-2xl"
              >
                Tentar Outra Vida
              </button>
            </motion.div>
          )}
          {won && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl rounded-[24px] flex flex-col items-center justify-center p-8 text-center"
            >
              <h2 className="text-3xl font-black text-blue-900 font-cinzel mb-4">MESTRE AVATAR</h2>
              <button 
                onClick={() => setWon(false)}
                className="px-10 py-4 bg-blue-900 text-white font-black uppercase text-[10px] rounded-full hover:bg-black transition-all shadow-2xl"
              >
                Continuar a Lenda 🌀
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Fusion Guide */}
      <div className="w-full max-w-sm mt-10">
        <p className="text-[8px] uppercase tracking-[0.4em] text-white/20 text-center mb-4">Guia de Ascensão Elemental</p>
        <div className="flex justify-between items-center px-4">
          {Object.entries(TILE_LEVELS).slice(0, 6).map(([val, cfg], idx) => (
            <React.Fragment key={val}>
              <div className="flex flex-col items-center gap-1 group">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-sm filter grayscale group-hover:grayscale-0 transition-all border border-white/5">
                  {cfg.icon}
                </div>
              </div>
              {idx < 5 && <div className="text-white/10 text-[8px] animate-pulse">→</div>}
            </React.Fragment>
          ))}
          <div className="text-white/20 text-[10px] tracking-tighter">...</div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center">
        <button onClick={initGame} className="text-[10px] uppercase tracking-[0.4em] hover:text-white transition-colors">
          Reiniciar
        </button>
      </div>
    </main>
  );
}
