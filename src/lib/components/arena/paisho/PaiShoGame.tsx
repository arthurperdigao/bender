'use client';
import { usePaiShoStore } from '../../../../hooks/usePaiShoStore';
import React, { useEffect } from 'react';

const PaiShoBoard: React.FC = () => {
  return (
    <div className="w-96 h-64 bg-green-100 flex items-center justify-center">
      PaiSho board
    </div>
  );
};

type Owner = 'ai' | 'player';
const PlayerTileTray: React.FC<{ owner: Owner }> = ({ owner }) => {
  return (
    <div className="w-40 h-24 bg-gray-100 flex items-center justify-center">
      {owner} tray
    </div>
  );
};

export const PaiShoGame = () => {
  const { gameState, setupGame } = usePaiShoStore();
  
  useEffect(() => {
    if (gameState === 'pending') {
      setupGame();
    }
  }, [gameState, setupGame]);

  return (
    <div className="flex items-center gap-8">
      <PlayerTileTray owner="ai" />
      <PaiShoBoard />
      <PlayerTileTray owner="player" />
    </div>
  );
};