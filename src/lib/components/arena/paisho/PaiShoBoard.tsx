'use client';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Tile = { id: string;[key: string]: any };
type Square = { x: number; y: number; tileId?: string | null };
type Store = {
  boardState: Square[][];
  tiles: Record<string, Tile>;
  placeTile: (x: number, y: number) => void;
};

const store: Store = {
  boardState: Array.from({ length: 17 }, (_, y) =>
    Array.from({ length: 17 }, (_, x) => ({ x, y, tileId: undefined }))
  ),
  tiles: {},
  placeTile(x: number, y: number) {
    const sq = store.boardState[y]?.[x];
    if (sq) sq.tileId = 'tile-1';
  },
};

export const usePaiShoStore = <T,>(selector: (s: Store) => T): T => selector(store);
import React from 'react';
const TileComponent: React.FC<{ tile?: { id?: string } | undefined }> = ({ tile }) => {
  return (
    <div className="w-10 h-10 bg-amber-200 rounded flex items-center justify-center text-xs">
      {tile?.id ?? '◻︎'}
    </div>
  );
};

export const PaiShoBoard = () => {
  const boardState = usePaiShoStore(s => s.boardState);
  const tiles = usePaiShoStore(s => s.tiles);
  const placeTile = usePaiShoStore(s => s.placeTile);

  return (
    <div
      className="grid grid-cols-17 bg-amber-700 border-8 border-amber-900"
      // REGRA DE OURO: O tabuleiro deve ter textura de madeira nobre.
      style={{ backgroundImage: 'url(/assets/images/games/paisho_board_texture.jpg)' }}
    >
      {boardState.map(row =>
        row.map(square => (
          <div
            key={`${square.x}-${square.y}`}
            className="w-12 h-12 border border-black/20 flex justify-center items-center"
            onClick={() => placeTile(square.x, square.y)}
          >
            {square.tileId && <TileComponent tile={tiles[square.tileId]} />}
          </div>
        ))
      )}
    </div>
  );
};