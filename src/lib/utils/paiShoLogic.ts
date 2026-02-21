/**
 * src/lib/utils/paiShoLogic.ts
 *
 * Contém a lógica de regras do jogo, como validação
 * de movimentos e condições de vitória.
 */
import { BoardState, PaiShoTile } from '@/lib/types/paiSho';

export const isValidMove = (
  boardState: BoardState,
  tile: PaiShoTile,
  targetX: number,
  targetY: number
): boolean => {
  // TODO: Implementar regras de movimento para cada tipo de peça.
  // Ex: Lótus Branco só pode ser colocado em um portão.
  // Ex: Orquídea só pode se mover 3 casas em linha reta.

  // Regra simples por agora: pode mover para qualquer espaço vazio.
  return boardState[targetY][targetX].tileId === null;
};

export const checkForWinner = (): 'player' | 'ai' | null => {
  // TODO: Implementar condição de vitória.
  // Ex: Checar se um jogador formou uma "harmonia" (combinação
  // específica de peças) no centro do tabuleiro.

  return null; // Ninguém ganhou ainda
};