/**
 * src/hooks/usePaiShoStore.ts
 *
 * O cérebro do jogo de Pai Sho, usando Zustand.
 * Gerencia o estado do tabuleiro, peças e turnos.
 */
import { create } from 'zustand';
import { BoardState, PaiShoTile, TileOwner } from '../lib/types/paiSho';
import { initialBoardState, initialTileSet } from '../lib/data/paiShoSetup';
// import { isValidMove } from '../lib/utils/paiShoLogic';
import { calculateAiMove } from '../lib/ai/paiShoAI';

interface PaiShoState {
  boardState: BoardState;
  tiles: { [id: string]: PaiShoTile };
  gameState: 'pending' | 'player_turn' | 'ai_turn' | 'game_over';
  currentPlayer: TileOwner;
  selectedTileId: string | null;
  winner: TileOwner | null;
}

interface PaiShoActions {
  setupGame: () => void;
  selectTile: (tileId: string) => void;
  placeTile: (x: number, y: number) => void;
  endPlayerTurn: () => void;
  runAiTurn: () => void;
  setWinner: (winner: TileOwner | null) => void;
}

const initialState: PaiShoState = {
  boardState: initialBoardState,
  tiles: initialTileSet,
  gameState: 'pending',
  currentPlayer: 'player',
  selectedTileId: null,
  winner: null,
};

export const usePaiShoStore = create<PaiShoState & PaiShoActions>((set, get) => ({
  ...initialState,

  setupGame: () => {
    set({ ...initialState, gameState: 'player_turn' });
  },

  selectTile: (tileId) => {
    const { tiles, currentPlayer, gameState } = get();
    const tile = tiles[tileId];
    if (gameState === `${currentPlayer}_turn` && tile.owner === currentPlayer) {
      set({ selectedTileId: tileId });
    }
  },

  placeTile: (x, y) => {
    const { selectedTileId, boardState, tiles } = get();
    if (!selectedTileId) return;

    const tile = tiles[selectedTileId];
    // TODO: Adicionar a lógica de regras aqui com 'isValidMove'
    // if (!isValidMove(boardState, tile, x, y)) {
    //   console.log("Movimento inválido");
    //   return;
    // }

    // Atualiza o estado da peça
    const newTiles = { ...tiles, [selectedTileId]: { ...tile, position: { x, y } } };

    // Atualiza o estado do tabuleiro
    const newBoardState = JSON.parse(JSON.stringify(boardState)); // Deep copy
    // Remove a peça da posição antiga (se houver)
    if (typeof tile.position !== 'string') {
      newBoardState[tile.position.y][tile.position.x].tileId = null;
    }
    newBoardState[y][x].tileId = selectedTileId;

    set({ tiles: newTiles, boardState: newBoardState, selectedTileId: null });

    // TODO: Adicionar checagem de vitória aqui com 'checkForWinner'

    if (get().currentPlayer === 'player') {
      get().endPlayerTurn();
    }
  },

  endPlayerTurn: () => {
    set({ currentPlayer: 'ai', gameState: 'ai_turn' });
    // Adiciona um pequeno delay para a IA "pensar"
    setTimeout(() => get().runAiTurn(), 1000);
  },

  runAiTurn: () => {
    const { boardState, tiles } = get();
    const aiTiles = Object.values(tiles).filter(t => t.owner === 'ai');

    const move = calculateAiMove(boardState, aiTiles);

    if (move) {
      // Simula a seleção e o movimento da IA
      set({ selectedTileId: move.tileId });
      get().placeTile(move.x, move.y);
    }

    set({ currentPlayer: 'player', gameState: 'player_turn' });
  },

  setWinner: (winner) => {
    set({ winner, gameState: 'game_over' });
  },
}));