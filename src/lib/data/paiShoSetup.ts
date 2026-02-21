/**
 * src/lib/data/paiShoSetup.ts
 *
 * Define o estado inicial do tabuleiro e das peças.
 */
import { BoardState, PaiShoTile } from '@/lib/types/paiSho';

// Define as dimensões do tabuleiro (ex: 17x17 grid)
const BOARD_SIZE = 17;

// Cria um tabuleiro vazio com pontos jogáveis
export const createInitialBoardState = (): BoardState => {
  return Array.from({ length: BOARD_SIZE }, (_, y) =>
    Array.from({ length: BOARD_SIZE }, (_, x) => ({
      x,
      y,
      // TODO: Adicionar a lógica real para pontos jogáveis do Pai Sho
      isPlayable: true, // Simplificação: todos os pontos são jogáveis por agora
      tileId: null,
    }))
  );
};

// Cria o conjunto inicial de peças para um jogador
const createPlayerTileSet = (owner: 'player' | 'ai'): PaiShoTile[] => {
  return [
    { id: `${owner}_lotus_1`, name: 'White Lotus', owner, position: 'off-board' },
    { id: `${owner}_orchid_1`, name: 'Orchid', owner, position: 'off-board' },
    { id: `${owner}_rose_1`, name: 'Rose', owner, position: 'off-board' },
    // ... Adicionar o resto das peças iniciais aqui
  ];
};

export const initialBoardState: BoardState = createInitialBoardState();

export const initialTileSet: { [id: string]: PaiShoTile } = {
  ...createPlayerTileSet('player').reduce((acc, tile) => ({ ...acc, [tile.id]: tile }), {}),
  ...createPlayerTileSet('ai').reduce((acc, tile) => ({ ...acc, [tile.id]: tile }), {}),
};