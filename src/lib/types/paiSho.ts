/**
 * src/lib/types/paiSho.ts
 *
 * Define o schema de dados para o jogo de Pai Sho.
 */

// Os nomes canônicos das peças
export type TileName =
  | 'White Lotus' | 'White Dragon' | 'Orchid' | 'Rose'
  | 'Chrysanthemum' | 'Rhododendron' | 'Jasmine' | 'Lily'
  | 'White Jade' | 'Boat' | 'Wheel' | 'Knotweed';

// O dono de uma peça
export type TileOwner = 'player' | 'ai';

// Uma peça individual de Pai Sho
export interface PaiShoTile {
  id: string; // ID único, ex: "player_lotus_1"
  name: TileName;
  owner: TileOwner;
  position: { x: number; y: number } | 'off-board';
}

// Um "quadrado" ou interseção no tabuleiro
export interface BoardSquare {
  x: number;
  y: number;
  isPlayable: boolean; // É um ponto de interseção válido?
  tileId: PaiShoTile['id'] | null; // ID da peça que está aqui
}

// O estado completo do tabuleiro
export type BoardState = BoardSquare[][];