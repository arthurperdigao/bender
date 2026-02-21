'use client';
type PaiShoTile = {
  id: string;
  name: string;
};
import { usePaiShoStore } from '../../../../hooks/usePaiShoStore';
import React from 'react';
import { motion } from 'framer-motion';

export const PaiShoTileComponent = ({ tile }: { tile: PaiShoTile }) => {
  const selectTile = usePaiShoStore(s => s.selectTile);
  const selectedTileId = usePaiShoStore(s => s.selectedTileId);
  const isSelected = tile.id === selectedTileId;

  return (
    <motion.div
      className={`w-10 h-10 rounded-full cursor-pointer flex justify-center items-center shadow-lg ${isSelected ? 'ring-4 ring-yellow-300' : ''}`}
      onClick={() => selectTile(tile.id)}
      // REGRA DE OURO: A peça deve parecer madeira esculpida.
      style={{ backgroundImage: 'url(/assets/images/games/wood_tile_texture.png)'}}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* TODO: Usar um ícone SVG para cada tipo de peça (ex: White Lotus) */}
      <span className="text-xs">{tile.name.substring(0,2)}</span>
    </motion.div>
  );
};

// Renomeando para evitar conflito de nome com o tipo
export { PaiShoTileComponent as PaiShoTile };