/**
 * src/app/arena/pai-sho/page.tsx
 *
 * Pai Sho — Jogo do Lótus Branco
 * Com seleção de adversários temáticos do Avatar e IA com 3 níveis de dificuldade.
 */
'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getPaiShoStats, savePaiShoWin } from '@/lib/actions/user';

// ═══════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════
type Owner = 'player' | 'ai' | null;
type GamePhase = 'menu' | 'opponent_select' | 'playing' | 'game_over';
type Difficulty = 'easy' | 'medium' | 'hard' | 'master';

interface Cell {
  row: number;
  col: number;
  owner: Owner;
  isPlayable: boolean;
}

// ═══════════════════════════════════════════════════
// ADVERSÁRIOS — Personagens do Avatar
// ═══════════════════════════════════════════════════
interface Opponent {
  id: string;
  name: string;
  title: string;
  emoji: string;
  element: string;
  difficulty: Difficulty;
  color: string;
  glow: string;
  bgGradient: string;
  quote: string;
  description: string;
  flower: string;   // emoji que o adversário usa como peça
  aiDelay: number;  // delay da IA em ms (mais lento = parece "pensar" mais)
}

const OPPONENTS: Opponent[] = [
  {
    id: 'zuko',
    name: 'Príncipe Zuko',
    title: 'Lorde do Fogo — Nação do Fogo',
    emoji: '🔥',
    element: 'Fogo',
    difficulty: 'easy',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.3)',
    bgGradient: 'from-orange-950/40 to-transparent',
    quote: '"Eu devo restaurar minha honra—e vencer você no Pai Sho."',
    description: 'Impulsivo e determinado. Ataca sem pensar muito. Ideal para aprender as regras.',
    flower: '🌺',
    aiDelay: 800,
  },
  {
    id: 'toph',
    name: 'Toph Beifong',
    title: 'A Maior Dobradora do Mundo',
    emoji: '⛰️',
    element: 'Terra',
    difficulty: 'medium',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.3)',
    bgGradient: 'from-green-950/40 to-transparent',
    quote: '"Eu sou a melhor do mundo. Mesmo no Pai Sho."',
    description: 'Estrategista sólida e implacável. Pensa dois passos à frente.',
    flower: '🌿',
    aiDelay: 1200,
  },
  {
    id: 'azula',
    name: 'Princesa Azula',
    title: 'Dobradora de Raios',
    emoji: '⚡',
    element: 'Fogo Azul',
    difficulty: 'medium',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.3)',
    bgGradient: 'from-blue-950/40 to-transparent',
    quote: '"A perfeição é o mínimo que exijo de mim mesma — e de você."',
    description: 'Precisa e calculista. Explora qualquer fraqueza que você deixar.',
    flower: '💠',
    aiDelay: 1000,
  },
  {
    id: 'wan_shi_tong',
    name: 'Wan Shi Tong',
    title: 'Guardião da Biblioteca Espiritual',
    emoji: '🦅',
    element: 'Espírito',
    difficulty: 'hard',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.3)',
    bgGradient: 'from-violet-950/40 to-transparent',
    quote: '"Possuo dez mil anos de conhecimento. Você é apenas uma curiosidade."',
    description: 'Onisciente e impiedoso. Raramente erra. Apenas para jogadores experientes.',
    flower: '🪶',
    aiDelay: 900,
  },
  {
    id: 'iroh',
    name: 'Tio Iroh',
    title: 'Grão-Mestre do Lótus Branco',
    emoji: '🍵',
    element: 'Fogo / Espírito',
    difficulty: 'master',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.4)',
    bgGradient: 'from-amber-950/40 to-transparent',
    quote: '"O Pai Sho não é apenas um jogo. É uma forma de enxergar o mundo."',
    description: 'O lendário Grão-Mestre do Lótus Branco. Jogador de Pai Sho mais temido do mundo. Apenas para mestres absolutos.',
    flower: '🍂',
    aiDelay: 2000,
  },
];

const DIFFICULTY_INFO: Record<Difficulty, { label: string; color: string; stars: string }> = {
  easy: { label: 'Fácil', color: '#22c55e', stars: '★☆☆☆' },
  medium: { label: 'Médio', color: '#fbbf24', stars: '★★☆☆' },
  hard: { label: 'Difícil', color: '#ef4444', stars: '★★★☆' },
  master: { label: 'Mestre', color: '#fbbf24', stars: '★★★★' },
};

// ═══════════════════════════════════════════════════
// LÓGICA DO JOGO
// ═══════════════════════════════════════════════════
const BOARD_SIZE = 7;
const PIECES_PER_PLAYER = 6;
const CENTER = Math.floor(BOARD_SIZE / 2);

function isPlayableCell(row: number, col: number): boolean {
  const dist = Math.abs(row - CENTER) + Math.abs(col - CENTER);
  return dist <= CENTER;
}

function createEmptyBoard(): Cell[][] {
  const board: Cell[][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      row.push({ row: r, col: c, owner: null, isPlayable: isPlayableCell(r, c) });
    }
    board.push(row);
  }
  return board;
}

function checkWinCondition(board: Cell[][], owner: 'player' | 'ai'): boolean {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c].owner !== owner) continue;
      for (const [dr, dc] of dirs) {
        let count = 1;
        for (let step = 1; step < 3; step++) {
          const nr = r + dr * step;
          const nc = c + dc * step;
          if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc].owner === owner) {
            count++;
          } else break;
        }
        if (count >= 3) return true;
      }
    }
  }
  return false;
}

// ─── NOVA IA: Heurística avançada com pontuação por linha potencial ───────────
//
// Pontuação de um owner em uma célula, analisando todas as 4 direções:
//   +10000  vitória imediata (3 em linha)
//   +500    ameaça de 2 em linha com ponta aberta (vai fechar na próxima)
//   +80     2 em linha sem espaço livre atrás (ameaça fraca)
//   +15     1 peça con 2 extremidades abertas (potencial futuro)
//   +5      centralidade (distância ao centro do tabuleiro)
function scorePosition(board: Cell[][], row: number, col: number, owner: 'player' | 'ai'): number {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  let score = 0;

  board[row][col].owner = owner;

  for (const [dr, dc] of dirs) {
    let line = 1;
    let open = 0;

    // Frente
    for (let s = 1; s <= 2; s++) {
      const nr = row + dr * s;
      const nc = col + dc * s;
      if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
        if (board[nr][nc].owner === owner) line++;
        else {
          if (board[nr][nc].owner === null && board[nr][nc].isPlayable) open++;
          break;
        }
      }
    }
    // Trás
    for (let s = 1; s <= 2; s++) {
      const nr = row - dr * s;
      const nc = col - dc * s;
      if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
        if (board[nr][nc].owner === owner) line++;
        else {
          if (board[nr][nc].owner === null && board[nr][nc].isPlayable) open++;
          break;
        }
      }
    }

    if (line >= 3) score += 10000;               // vitória / bloqueio imediato
    else if (line === 2 && open >= 1) score += 500;  // ameaça forte
    else if (line === 2) score += 80;            // ameaça sem espaço
    else if (line === 1 && open >= 2) score += 15;   // potencial futuro
  }

  // Bônus de centralidade
  const dist = Math.abs(row - CENTER) + Math.abs(col - CENTER);
  score += Math.max(0, (CENTER - dist) * 5);

  board[row][col].owner = null;
  return score;
}

// Conta quantas ameaças de vitória iminente um owner teria SE jogasse em (row,col)
// (para detectar forks — posições que criam 2 ameaças ao mesmo tempo)
function countThreats(board: Cell[][], row: number, col: number, owner: 'player' | 'ai'): number {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  let threats = 0;
  board[row][col].owner = owner;

  for (const [dr, dc] of dirs) {
    let line = 1;
    let open = 0;
    for (let s = 1; s <= 2; s++) {
      const nr = row + dr * s; const nc = col + dc * s;
      if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
        if (board[nr][nc].owner === owner) line++;
        else { if (board[nr][nc].owner === null && board[nr][nc].isPlayable) open++; break; }
      }
    }
    for (let s = 1; s <= 2; s++) {
      const nr = row - dr * s; const nc = col - dc * s;
      if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
        if (board[nr][nc].owner === owner) line++;
        else { if (board[nr][nc].owner === null && board[nr][nc].isPlayable) open++; break; }
      }
    }
    if (line >= 2 && open >= 1) threats++;
  }

  board[row][col].owner = null;
  return threats;
}

// IA principal — usa os scores acima, calibrada por dificuldade
function calculateAiMove(board: Cell[][], difficulty: Difficulty): { row: number; col: number } | null {
  const empty = board.flat().filter(c => c.isPlayable && c.owner === null);
  if (empty.length === 0) return null;

  // Chance de jogada aleatória por dificuldade
  const randomChance: Record<Difficulty, number> = { easy: 0.35, medium: 0.10, hard: 0.02, master: 0 };
  if (Math.random() < randomChance[difficulty]) {
    return empty[Math.floor(Math.random() * empty.length)];
  }

  // Quanto a IA valoriza ataque vs defesa por dificuldade
  // master/hard atacam mais; easy é mais reativo
  const aggression: Record<Difficulty, number> = { easy: 0.7, medium: 1.0, hard: 1.3, master: 1.6 };
  const agg = aggression[difficulty];

  let bestScore = -Infinity;
  let bestMove = empty[0];

  for (const cell of empty) {
    const offScore = scorePosition(board, cell.row, cell.col, 'ai');
    const defScore = scorePosition(board, cell.row, cell.col, 'player');

    // Bônus de fork: se criar 2+ ameaças ao mesmo tempo na jogada ofensiva
    const forkBonus = countThreats(board, cell.row, cell.col, 'ai') >= 2 ? 800 * agg : 0;
    // Penalidade se o jogador teria fork sem bloqueio aqui
    const forkBlock = countThreats(board, cell.row, cell.col, 'player') >= 2 ? 700 : 0;

    const combined = offScore * agg + defScore + forkBonus + forkBlock;

    // Ruído proporcional à dificuldade (easy = muito ruído)
    const noise: Record<Difficulty, number> = { easy: 300, medium: 80, hard: 20, master: 0 };
    const finalScore = combined + Math.random() * noise[difficulty];

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestMove = cell;
    }
  }

  return bestMove;
}

// ═══════════════════════════════════════════════════
// PARTÍCULAS
// ═══════════════════════════════════════════════════
const Particles = ({ color = '#22c55e' }: { color?: string }) => {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 3 + 1, dur: Math.random() * 15 + 10,
      delay: Math.random() * 5, opacity: Math.random() * 0.3 + 0.05,
    })), []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, backgroundColor: color, opacity: p.opacity, boxShadow: `0 0 ${p.size * 3}px ${color}` }}
          animate={{ y: [`${p.y}vh`, `${p.y - 25}vh`, `${p.y}vh`], opacity: [p.opacity, p.opacity * 2, p.opacity] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' as const }}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════
// CÉLULA DO TABULEIRO
// ═══════════════════════════════════════════════════
const BoardCell = ({
  cell, onClick, isPlayerTurn, flower, opponentColor,
}: {
  cell: Cell; onClick: () => void; isPlayerTurn: boolean; flower: string | null; opponentColor: string;
}) => {
  if (!cell.isPlayable) return <div className="w-12 h-12 md:w-14 md:h-14" />;
  const isEmpty = cell.owner === null;
  const isPlayer = cell.owner === 'player';

  return (
    <motion.button
      className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-2xl md:text-3xl transition-all duration-300 ${isEmpty
        ? isPlayerTurn
          ? 'bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.1] cursor-pointer'
          : 'bg-white/[0.04] border border-white/[0.06] cursor-not-allowed'
        : isPlayer
          ? 'bg-emerald-900/30 border border-emerald-400/30 shadow-[0_0_12px_rgba(34,197,94,0.2)]'
          : 'border shadow-[0_0_12px_rgba(0,0,0,0.3)]'
        }`}
      style={!isEmpty && !isPlayer ? {
        backgroundColor: `${opponentColor}18`,
        borderColor: `${opponentColor}50`,
        boxShadow: `0 0 12px ${opponentColor}30`,
      } : {}}
      onClick={onClick}
      disabled={!isEmpty || !isPlayerTurn}
      whileHover={isEmpty && isPlayerTurn ? { scale: 1.1 } : {}}
      whileTap={isEmpty && isPlayerTurn ? { scale: 0.9 } : {}}
    >
      <AnimatePresence>
        {flower && (
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="select-none"
          >
            {flower}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// ═══════════════════════════════════════════════════
// TELA 1: MENU INICIAL
// ═══════════════════════════════════════════════════
const MenuScreen = ({ onSelectOpponent }: { onSelectOpponent: () => void }) => (
  <motion.div className="flex flex-col items-center justify-center text-center relative z-10"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>

    <motion.div className="mb-8 text-8xl"
      initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 12, delay: 0.2 }}>
      🪷
    </motion.div>

    <motion.h1 className="mb-3 text-5xl md:text-6xl font-bold"
      style={{
        background: 'linear-gradient(135deg, #22c55e 0%, #fbbf24 50%, #f97316 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 0 20px rgba(34,197,94,0.4))',
        fontFamily: 'var(--font-cinzel), serif',
      }}
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
      Pai Sho
    </motion.h1>

    <motion.p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-40"
      initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.7 }}>
      O Jogo do Lótus Branco
    </motion.p>

    <motion.p className="mb-10 max-w-sm text-sm italic opacity-50 leading-relaxed"
      initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.0 }}>
      &ldquo;O Pai Sho não é apenas um jogo. É um modo de vida.&rdquo; — Iroh
    </motion.p>

    <motion.div className="mb-6 max-w-sm text-xs opacity-30 leading-relaxed space-y-1"
      initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 1.3 }}>
      <p>🪷 Suas flores &nbsp;&nbsp;vs&nbsp;&nbsp; flores do adversário</p>
      <p>Alinhe 3 flores para vencer</p>
    </motion.div>

    <motion.button
      className="group relative px-10 py-4 text-lg font-semibold rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(251,191,36,0.1) 100%)',
        border: '1px solid rgba(34,197,94,0.3)', color: '#d1fae5',
        fontFamily: 'var(--font-cinzel), serif',
      }}
      onClick={onSelectOpponent}
      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle at center, rgba(34,197,94,0.15) 0%, transparent 70%)' }} />
      <span className="relative z-10">Escolher Adversário →</span>
    </motion.button>

    <motion.div className="mt-10" initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 2.0 }}>
      <Link href="/" className="text-xs opacity-60 hover:opacity-100 transition-opacity">← Voltar ao Portal</Link>
    </motion.div>
  </motion.div>
);

// ═══════════════════════════════════════════════════
// TELA 2: SELEÇÃO DE ADVERSÁRIO
// ═══════════════════════════════════════════════════
type PaiShoStats = { easy: number; medium: number; hard: number; master: number; total: number } | null;

const OpponentSelectScreen = ({
  onSelect, onBack, stats,
}: {
  onSelect: (opponent: Opponent) => void;
  onBack: () => void;
  stats: PaiShoStats;
}) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.div className="relative z-10 w-full max-w-3xl mx-auto px-4"
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5 }}>

      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2"
          style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          Escolha seu Adversário
        </h2>
        <p className="text-xs uppercase tracking-[0.3em] opacity-40">Selecione com quem irá jogar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {OPPONENTS.map((opp, i) => {
          const diffInfo = DIFFICULTY_INFO[opp.difficulty];
          const isHovered = hovered === opp.id;

          return (
            <motion.button
              key={opp.id}
              className="group relative flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-300 w-full overflow-hidden"
              style={{
                background: isHovered ? `${opp.color}12` : 'rgba(255,255,255,0.03)',
                border: isHovered ? `1px solid ${opp.color}50` : '1px solid rgba(255,255,255,0.07)',
                boxShadow: isHovered ? `0 0 30px ${opp.color}20` : 'none',
              }}
              onClick={() => onSelect(opp)}
              onMouseEnter={() => setHovered(opp.id)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Glow lateral de cor */}
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-300"
                style={{ backgroundColor: isHovered ? opp.color : 'transparent' }} />

              {/* Emoji / Avatar */}
              <div className="relative shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-3xl"
                style={{
                  background: `${opp.color}15`,
                  border: `1px solid ${opp.color}30`,
                  boxShadow: isHovered ? `0 0 20px ${opp.color}40` : 'none',
                }}>
                {opp.emoji}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-white text-base"
                    style={{ fontFamily: 'var(--font-cinzel), serif' }}>{opp.name}</span>
                </div>
                <div className="text-xs opacity-50 mb-2">{opp.title}</div>

                {/* Dificuldade + vitórias */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold" style={{ color: diffInfo.color }}>
                    {diffInfo.stars}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${diffInfo.color}15`, color: diffInfo.color, border: `1px solid ${diffInfo.color}30` }}>
                    {diffInfo.label}
                  </span>
                  {/* Vitórias contra este adversário (por dificuldade) */}
                  {stats && (() => {
                    const wins = stats[opp.difficulty as keyof typeof stats] as number;
                    return wins > 0 ? (
                      <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ backgroundColor: 'rgba(255,215,0,0.1)', color: '#fbbf24', border: '1px solid rgba(255,215,0,0.2)' }}>
                        🏆 {wins} vitória{wins !== 1 ? 's' : ''}
                      </span>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* Peça do adversário */}
              <div className="text-2xl shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                {opp.flower}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Descrição ao hover */}
      <AnimatePresence mode="wait">
        {hovered && (
          <motion.div
            key={hovered}
            className="mb-6 p-4 rounded-xl text-center"
            style={{
              background: `${OPPONENTS.find(o => o.id === hovered)?.color}0a`,
              border: `1px solid ${OPPONENTS.find(o => o.id === hovered)?.color}20`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm italic opacity-60 mb-1">
              {OPPONENTS.find(o => o.id === hovered)?.quote}
            </p>
            <p className="text-xs opacity-40">
              {OPPONENTS.find(o => o.id === hovered)?.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button onClick={onBack}
        className="text-xs opacity-40 hover:opacity-80 transition-opacity"
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}>
        ← Voltar
      </motion.button>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════
// TELA 3: JOGO
// ═══════════════════════════════════════════════════
interface GameStore {
  board: Cell[][];
  currentTurn: 'player' | 'ai';
  playerPieces: number;
  aiPieces: number;
  winner: Owner;
  message: string;
}

// Flores para o jogador
const PLAYER_FLOWERS = ['🪷', '🌸', '🌺', '🌼', '🌻', '💮'];
let playerFlowerIndex = 0;
let aiFlowerIndex = 0;
function getPlayerFlower() { return PLAYER_FLOWERS[playerFlowerIndex++ % PLAYER_FLOWERS.length]; }

// O adversário usa a flor dele
function getAiFlower(flower: string) { void aiFlowerIndex++; return flower; }

const GameScreen = ({
  store,
  opponent,
  onCellClick,
  onRestart,
  onMenu,
}: {
  store: GameStore;
  opponent: Opponent;
  onCellClick: (row: number, col: number) => void;
  onRestart: () => void;
  onMenu: () => void;
}) => {
  const { board, currentTurn, playerPieces, aiPieces, winner, message } = store;
  const isPlayerTurn = currentTurn === 'player';

  // flowerMap é reiniciado a cada novo gameKey (key força remontagem)
  const [flowerMap, setFlowerMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const newMap: Record<string, string> = { ...flowerMap };
    for (const row of board) {
      for (const cell of row) {
        const key = `${cell.row}-${cell.col}`;
        if (cell.owner && !newMap[key]) {
          newMap[key] = cell.owner === 'player'
            ? getPlayerFlower()
            : getAiFlower(opponent.flower);
        }
      }
    }
    setFlowerMap(newMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center relative z-10 w-full max-w-xl mx-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-6 px-4">
        {/* Jogador */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isPlayerTurn ? 'bg-emerald-900/30 border border-emerald-400/30' : 'opacity-40'
          }`}>
          <span className="text-xl">🪷</span>
          <div>
            <div className="text-xs opacity-60">Você</div>
            <div className="text-sm font-semibold text-emerald-300">{playerPieces} peças</div>
          </div>
        </div>

        {/* Status central */}
        <motion.div className="text-center px-4" key={message}
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs opacity-40 mb-1">Turno</div>
          <div className={`text-sm font-medium ${winner === 'player' ? 'text-emerald-400' : winner === 'ai' ? `text-[${opponent.color}]` : 'opacity-70'
            }`}
            style={winner === 'ai' ? { color: opponent.color } : {}}>
            {message}
          </div>
        </motion.div>

        {/* IA */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${currentTurn === 'ai' ? 'border' : 'opacity-40'
          }`}
          style={currentTurn === 'ai' ? {
            backgroundColor: `${opponent.color}18`,
            borderColor: `${opponent.color}50`,
          } : {}}>
          <div className="text-right">
            <div className="text-xs opacity-60">{opponent.name}</div>
            <div className="text-sm font-semibold" style={{ color: opponent.color }}>{aiPieces} peças</div>
          </div>
          <span className="text-xl">{opponent.emoji}</span>
        </div>
      </div>

      {/* Tabuleiro */}
      <motion.div className="relative p-4 rounded-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, rgba(0,0,0,0.3) 100%)',
          border: '1px solid rgba(34,197,94,0.1)',
          boxShadow: '0 0 40px rgba(34,197,94,0.05)',
        }}
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>

        <div className="flex flex-col items-center gap-1.5 relative z-10">
          {board.map((row, ri) => (
            <div key={ri} className="flex gap-1.5">
              {row.map((cell, ci) => (
                <BoardCell
                  key={`${ri}-${ci}`}
                  cell={cell}
                  onClick={() => onCellClick(ri, ci)}
                  isPlayerTurn={isPlayerTurn}
                  flower={flowerMap[`${ri}-${ci}`] || null}
                  opponentColor={opponent.color}
                />
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Fim de jogo */}
      <AnimatePresence>
        {winner !== undefined && winner !== null || (playerPieces === 0 && aiPieces === 0) ? (
          // Mostrar botões apenas se o jogo realmente terminou (winner foi setado)
          null
        ) : null}
      </AnimatePresence>

      {/* Ações — sempre mostra Desistir durante o jogo, e Jogar Novamente no fim */}
      <motion.div className="mt-6 flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {(winner !== null || playerPieces === 0) ? (
          <>
            <button onClick={onRestart}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{ border: '1px solid rgba(34,197,94,0.4)', color: '#86efac', background: 'rgba(34,197,94,0.08)' }}>
              Jogar Novamente
            </button>
            <button onClick={onMenu}
              className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-white/40 hover:text-white/60 transition-all">
              Trocar Adversário
            </button>
          </>
        ) : (
          <button onClick={onMenu}
            className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-white/30 hover:text-white/50 transition-all">
            Desistir
          </button>
        )}
      </motion.div>

      {/* Dica do adversário */}
      <motion.p className="mt-4 text-xs italic opacity-20 text-center max-w-xs"
        initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ delay: 1 }}>
        {opponent.quote}
      </motion.p>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════
export default function PaiShoPage() {
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [selectedOpponent, setSelectedOpponent] = useState<Opponent | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const [paiShoStats, setPaiShoStats] = useState<PaiShoStats>(null);

  // Busca estatísticas quando entra na tela de seleção
  useEffect(() => {
    if (phase === 'opponent_select') {
      getPaiShoStats().then(s => setPaiShoStats(s));
    }
  }, [phase]);

  const [store, setStore] = useState<GameStore>({
    board: createEmptyBoard(),
    currentTurn: 'player',
    playerPieces: PIECES_PER_PLAYER,
    aiPieces: PIECES_PER_PLAYER,
    winner: null,
    message: 'Sua vez — coloque uma flor',
  });

  const startGame = useCallback(() => {
    playerFlowerIndex = 0;
    aiFlowerIndex = 0;
    setStore({
      board: createEmptyBoard(),
      currentTurn: 'player',
      playerPieces: PIECES_PER_PLAYER,
      aiPieces: PIECES_PER_PLAYER,
      winner: null,
      message: 'Sua vez — coloque uma flor',
    });
    setGameKey(k => k + 1); // Força remontagem/reset do flowerMap no GameScreen
    setPhase('playing');
  }, []);

  const handleOpponentSelect = useCallback((opponent: Opponent) => {
    setSelectedOpponent(opponent);
    startGame();
  }, [startGame]);

  const handleRestart = useCallback(() => {
    if (selectedOpponent) startGame();
  }, [selectedOpponent, startGame]);

  const handleMenu = useCallback(() => {
    setPhase('opponent_select');
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    setStore(prev => {
      if (prev.currentTurn !== 'player') return prev;
      if (!prev.board[row][col].isPlayable || prev.board[row][col].owner !== null) return prev;
      if (prev.playerPieces <= 0) return prev;

      const newBoard = prev.board.map(r => r.map(c => ({ ...c })));
      newBoard[row][col].owner = 'player';
      const newPlayerPieces = prev.playerPieces - 1;

      if (checkWinCondition(newBoard, 'player')) {
        // Salva vitória no banco (silencioso se não logado)
        if (selectedOpponent) savePaiShoWin(selectedOpponent.difficulty).catch(() => { });
        return {
          ...prev, board: newBoard, playerPieces: newPlayerPieces,
          winner: 'player', message: '🎉 Você venceu! Parabéns, mestre!',
        };
      }

      if (prev.aiPieces <= 0) {
        return {
          ...prev, board: newBoard, playerPieces: newPlayerPieces,
          winner: 'player', message: 'Jogo encerrado!',
        };
      }

      return {
        ...prev, board: newBoard, playerPieces: newPlayerPieces,
        currentTurn: 'ai',
        message: `${selectedOpponent?.name ?? 'IA'} está pensando...`,
      };
    });
  }, [selectedOpponent]);

  // IA joga após delay
  useEffect(() => {
    if (store.currentTurn !== 'ai' || store.winner !== null) return;
    if (!selectedOpponent) return;

    const delay = selectedOpponent.aiDelay + Math.random() * 400;
    const timeout = setTimeout(() => {
      setStore(prev => {
        if (prev.currentTurn !== 'ai' || prev.winner !== null) return prev;

        const boardCopy = prev.board.map(r => r.map(c => ({ ...c })));
        const move = calculateAiMove(boardCopy, selectedOpponent.difficulty);

        if (!move) {
          return { ...prev, winner: 'player', message: `${selectedOpponent.name} não tem mais jogadas!` };
        }

        const newBoard = prev.board.map(r => r.map(c => ({ ...c })));
        newBoard[move.row][move.col].owner = 'ai';
        const newAiPieces = prev.aiPieces - 1;

        if (checkWinCondition(newBoard, 'ai')) {
          return {
            ...prev, board: newBoard, aiPieces: newAiPieces,
            winner: 'ai',
            message: `🏮 ${selectedOpponent.name} venceu! "${selectedOpponent.quote.slice(1, 40)}..."`,
          };
        }

        if (newAiPieces <= 0 && prev.playerPieces <= 0) {
          return {
            ...prev, board: newBoard, aiPieces: newAiPieces,
            winner: 'player', message: 'Empate! Uma partida digna do Lótus Branco.',
          };
        }

        return {
          ...prev, board: newBoard, aiPieces: newAiPieces,
          currentTurn: 'player', message: 'Sua vez — coloque uma flor',
        };
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [store.currentTurn, store.winner, selectedOpponent]);

  const particleColor = selectedOpponent?.color ?? '#22c55e';

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4 relative overflow-hidden"
      style={{ background: `radial-gradient(ellipse at 50% 30%, ${selectedOpponent ? selectedOpponent.color + '12' : '#0f1f0a'} 0%, #0a0a14 100%)` }}>

      <Particles color={particleColor} />

      {/* Botão Home */}
      <Link href="/"
        className="fixed top-5 left-5 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-xs
          bg-white/[0.05] border border-white/[0.08] text-white/40
          hover:text-white/80 hover:bg-white/[0.1]
          transition-all duration-300 backdrop-blur-sm">
        ← Início
      </Link>

      <AnimatePresence mode="wait">
        {phase === 'menu' && (
          <motion.div key="menu" exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            <MenuScreen onSelectOpponent={() => setPhase('opponent_select')} />
          </motion.div>
        )}

        {phase === 'opponent_select' && (
          <motion.div key="select" exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            <OpponentSelectScreen
              onSelect={handleOpponentSelect}
              onBack={() => setPhase('menu')}
              stats={paiShoStats}
            />
          </motion.div>
        )}

        {phase === 'playing' && selectedOpponent && (
          <motion.div key={`game-${gameKey}`} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="w-full flex justify-center">
            {/* key={gameKey} força remontagem do GameScreen a cada novo jogo — reseta flowerMap */}
            <GameScreen
              key={gameKey}
              store={store}
              opponent={selectedOpponent}
              onCellClick={handleCellClick}
              onRestart={handleRestart}
              onMenu={handleMenu}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}