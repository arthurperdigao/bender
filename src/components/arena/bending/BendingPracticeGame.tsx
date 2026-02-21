/**
 * src/components/arena/bending/BendingPracticeGame.tsx
 *
 * O contêiner principal do jogo. Controla o áudio e o game loop.
 */
'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useBendingStore } from '../../../hooks/useBendingStore';
import { allBendingForms } from '../../../lib/data/bendingForms';
import { Howl } from 'howler';

const BendingScoreUI: React.FC = () => {
  return (
    <div className="bending-score-ui">
      {/* Placeholder BendingScoreUI - implementação mínima local */}
      <p>Pontuação: 0</p>
    </div>
  );
};

const BendingFormDisplay: React.FC = () => {
  return (
    <div className="bending-form-display">
      {/* Placeholder component for BendingFormDisplay */}
      <p>Forma de dobra carregada</p>
    </div>
  );
};

export const BendingPracticeGame = () => {
  const { gameState, loadForm, startGame, updateTime, endGame } = useBendingStore();
  const audioRef = useRef<Howl | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // O Game Loop
  const gameLoop = useCallback(() => {
    if (audioRef.current && audioRef.current.playing()) {
      const currentTime = audioRef.current.seek() as number;
      updateTime(currentTime);
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [updateTime]);

  // Efeito para carregar e tocar a música
  useEffect(() => {
    if (gameState === 'playing' && audioRef.current) {
      audioRef.current.play();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      // Cleanup: Para o loop quando o componente desmontar
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, gameLoop]);
  
  // Função para iniciar o jogo
  const handleStart = () => {
    const form = allBendingForms[0]; // Carrega a primeira forma (exemplo)
    loadForm(form);
    
    audioRef.current = new Howl({
      src: [form.musicUrl],
      onload: () => {
        startGame();
      },
      onend: () => {
        endGame();
      }
    });
  };

  if (gameState === 'pending') {
    return <button onClick={handleStart} className="game-button">Iniciar Prática de Dobra de Água</button>
  }

  return (
    <div className="relative w-[80vw] h-[80vh]">
      <BendingScoreUI />
      <BendingFormDisplay />
      {gameState === 'finished' && <div className="results-overlay">Fim!</div>}
    </div>
  );
};