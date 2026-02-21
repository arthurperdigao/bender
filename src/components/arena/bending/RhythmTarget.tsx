/**
 * src/components/arena/bending/RhythmTarget.tsx
 *
 * Renderiza um único alvo de ritmo. Controla sua aparição e interação.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useBendingStore } from '../../../hooks/useBendingStore';

type BeatPosition = { x: number; y: number } | 'drag-point';
interface RhythmBeat {
  time: number;
  position?: BeatPosition;
}

interface Props {
  beat: RhythmBeat;
  svgPath: string; // Para posicionar o alvo no caminho
}

export const RhythmTarget = ({ beat }: Props) => {
  const { currentTime, registerHit, registerMiss } = useBendingStore();

  // Lógica para determinar se o alvo deve estar visível
  const APPEAR_TIME_BEFORE = 2.0; // Aparece 2s antes
  const DISAPPEAR_TIME_AFTER = 0.5; // Desaparece 0.5s depois

  const isVisible = currentTime >= beat.time - APPEAR_TIME_BEFORE &&
    currentTime <= beat.time + DISAPPEAR_TIME_AFTER;

  if (!isVisible) return null;

  // TODO: Lógica para calcular a posição (x, y) a partir do svgPath e beat.position
  // Por ora, usaremos uma posição de placeholder se não for 'drag-point'.
  const position = typeof beat.position === 'object'
    ? { x: beat.position.x * 400, y: beat.position.y * 400 }
    : { x: 100, y: 100 }; // Placeholder

  const handleDrag = () => {
    // TODO: Lógica para verificar a precisão do drag
    // Ex: Math.abs(currentTime - beat.time)
    const precision = 1 - Math.min(1, Math.abs(currentTime - beat.time) / 0.5);
    if (precision > 0.3) { // Limite de acerto
      registerHit(precision);
    } else {
      registerMiss();
    }
  }

  return (
    <motion.g
      onDrag={handleDrag} // TODO: Implementar onDrag para a forma de água
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* O "orbe" visual */}
      <circle
        cx={position.x}
        cy={position.y}
        r="20"
        fill="rgba(255, 255, 255, 0.5)"
        stroke="white"
        strokeWidth="2"
      />
      {/* Anel de timing que encolhe */}
      <circle
        cx={position.x}
        cy={position.y}
        r="40"
        fill="none"
        stroke="white"
        strokeWidth="2"
      // TODO: Animar o 'r' de 40 para 20 conforme currentTime se aproxima de beat.time
      />
    </motion.g>
  );
};