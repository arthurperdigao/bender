'use client';
import { TileOwner } from '../../../types/paiSho';
import { usePaiShoStore } from '../../../../hooks/usePaiShoStore';
import React from 'react';
import { PaiShoTile } from './PaiShoTile';

export const PlayerTileTray = ({ owner }: { owner: TileOwner }) => {
  const tiles = usePaiShoStore(s => Object.values(s.tiles));
  const playerTiles = tiles.filter(t => t.owner === owner && t.position === 'off-board');

  return (
    <div className="flex flex-col gap-2 p-4 bg-black/30 rounded-lg">
      <h3 className="text-center">{owner === 'player' ? 'Suas Peças' : 'Oponente'}</h3>
      {playerTiles.map(tile => (
        <React.Fragment key={tile.id}>
          <PaiShoTile tile={tile} />
        </React.Fragment>
      ))}
    </div>
  );
};