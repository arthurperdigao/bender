/**
 * src/lib/ai/paiShoAI.ts
 *
 * Contém a lógica para o oponente controlado pelo computador.
 */
import { BoardState, PaiShoTile } from '../types/paiSho';
import { isValidMove } from '../utils/paiShoLogic';

type AiMove = { tileId: string; x: number; y: number };

export const calculateAiMove = (
  boardState: BoardState,
  aiTiles: PaiShoTile[]
): AiMove | null => {
  
  // Lógica da "AI Boba" (Fase 1)
  const playableTiles = aiTiles.filter(t => t.position === 'off-board'); // Simplificação: só joga peças novas
  if (playableTiles.length === 0) return null;

  const randomTile = playableTiles[Math.floor(Math.random() * playableTiles.length)];
  
  const possibleMoves: {x: number, y: number}[] = [];
  boardState.forEach(row => {
      row.forEach(square => {
          if (isValidMove(boardState, randomTile, square.x, square.y)) {
              possibleMoves.push({ x: square.x, y: square.y });
          }
      });
  });

  if (possibleMoves.length === 0) return null;

  const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

  return {
    tileId: randomTile.id,
    x: randomMove.x,
    y: randomMove.y,
  };

  // TODO: Implementar um algoritmo Minimax básico para uma IA de
  // dificuldade 'Média' no futuro.
};