/**
 * src/components/arena/bending/BendingFormDisplay.tsx
 *
 * O palco visual do jogo. Renderiza o caminho SVG e os alvos.
 */
import React from 'react';
import { useBendingStore } from '../../../hooks/useBendingStore';

/* Local fallback component to avoid missing module './RhythmTarget' — replace with the real component
   implementation when available. Keeps the same props shape used by BendingFormDisplay. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RhythmTarget: React.FC<{ beat: any }> = ({ beat }) => {
  // If beat provides coordinates, use them; otherwise render a simple placeholder at 0,0.
  const cx = (beat && typeof beat.x === 'number') ? beat.x : 0;
  const cy = (beat && typeof beat.y === 'number') ? beat.y : 0;
  const label = beat && (beat.label ?? beat.id);

  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="#FFD700" stroke="#333" strokeWidth={2} />
      {label && (
        <text x={cx} y={cy + 4} fontSize={10} textAnchor="middle" fill="#333">
          {label}
        </text>
      )}
    </g>
  );
};

export const BendingFormDisplay = () => {
  const form = useBendingStore((state) => state.currentForm);

  if (!form) return null;

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full absolute inset-0">
      {/* 1. O caminho a ser seguido (Regra de Ouro: parece tinta) */}
      <path
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        d={(form as any).svgPath ?? ''}
        fill="none"
        stroke="#87CEEB" // Azul céu
        strokeWidth="3"
        strokeDasharray="10 5" // Linha tracejada, etérea
        opacity="0.5"
      />

      {/* 2. Renderiza todos os 'beats' da forma */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {((form as any).beats || []).map((beat: any) => (
        <RhythmTarget key={beat.id} beat={beat} />
      ))}
    </svg>
  );
};