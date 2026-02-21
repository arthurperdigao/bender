/**
 * src/lib/types/bendingForms.ts
 *
 * Define o schema para uma "Forma de Dobra", que é uma fase
 * ou "música" do nosso jogo de ritmo.
 */

// Um "beat" ou evento de ritmo dentro da forma.
export interface RhythmBeat {
  id: string; // ID único para a chave React
  time: number; // Em segundos, ex: 1.5 (quando o beat deve ser atingido)
  
  // Para 'drag-point', esta é a posição no caminho SVG (de 0.0 a 1.0)
  // Para 'tap' ou 'hold', é a posição na tela {x, y} (de 0.0 a 1.0)
  position: number | { x: number; y: number };
  
  type: 'tap' | 'drag-point' | 'hold';
  duration?: number; // Duração em segundos para 'hold'
}

// Uma Forma de Dobra completa (uma fase do jogo)
export interface BendingForm {
  id: string;
  title: string; // Ex: "A Forma da Maré Puxante"
  element: 'water' | 'fire' | 'earth' | 'air';
  musicUrl: string; // Ex: /assets/sounds/music/water_meditation.mp3
  
  // O caminho SVG que o orbe seguirá (para Dobra de Água)
  // Ex: "M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"
  svgPath: string;
  
  beats: RhythmBeat[]; // Array de todos os eventos de ritmo
  difficulty: 'easy' | 'medium' | 'hard';
}