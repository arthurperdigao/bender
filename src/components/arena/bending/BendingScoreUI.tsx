/**
 * src/components/arena/bending/BendingScoreUI.tsx
 *
 * Exibe a pontuação e o combo com uma estética imersiva.
 */
import React from 'react';
type BendingState = { score: number; combo: number };
const defaultBendingState: BendingState = { score: 0, combo: 0 };
const useBendingStore = <T,>(selector: (s: BendingState) => T): T => {

  const [state] = React.useState<BendingState>(defaultBendingState);
  return selector(state);
};

export const BendingScoreUI = () => {
  const score = useBendingStore((state) => state.score);
  const combo = useBendingStore((state) => state.combo);

  return (
    <div className="absolute top-4 left-4 text-white p-4 rounded-lg bg-black/30 backdrop-blur-sm">
      {/* REGRA DE OURO (Estilização):
        Isto é um "Medidor de Chi".
        - A pontuação deve usar uma fonte que lembre pinceladas.
        - O combo, quando > 0, deve ter um brilho elemental (azul para água).
      */}
      <div className="text-3xl font-bold">Pontos: {score}</div>
      {combo > 1 && (
        <div 
          className="text-2xl font-bold mt-2"
          style={{ textShadow: '0 0 15px #87CEEB' }} // Brilho azul
        >
          Combo: x{combo}
        </div>
      )}
    </div>
  );
};