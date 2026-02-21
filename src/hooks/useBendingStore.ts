/**
 * src/hooks/useBendingStore.ts
 *
 * O cérebro do jogo de ritmo de Dobra, usando Zustand.
 * Controla o tempo, a pontuação e o estado do jogo.
 */
import { create } from 'zustand';

// Local BendingForm type (use this if your project doesn't resolve the '@/...' alias).
// Adjust fields to match your actual shape or replace this with a correct relative import.
type BendingForm = {
  id: string;
  name?: string;
  // optional sequence of steps for the rhythm/game
  steps?: { time: number; action: string }[];
};

interface BendingState {
  currentForm: BendingForm | null;
  gameState: 'pending' | 'playing' | 'finished';
  score: number;
  combo: number;
  currentTime: number; // O "relógio" principal do jogo, em segundos
}

interface BendingActions {
  loadForm: (form: BendingForm) => void;
  startGame: () => void;
  updateTime: (time: number) => void;
  registerHit: (precision: number) => void; // precisão de 0.0 a 1.0
  registerMiss: () => void;
  endGame: () => void;
  resetGame: () => void;
}

const initialState: BendingState = {
  currentForm: null,
  gameState: 'pending',
  score: 0,
  combo: 0,
  currentTime: 0,
};

export const useBendingStore = create<BendingState & BendingActions>((set, get) => ({
  ...initialState,

  loadForm: (form) => {
    set({ ...initialState, currentForm: form });
  },

  startGame: () => {
    if (get().currentForm) {
      set({ gameState: 'playing', currentTime: 0, score: 0, combo: 0 });
    }
  },

  // Chamado pelo loop de jogo (requestAnimationFrame)
  updateTime: (time) => {
    set({ currentTime: time });
  },

  registerHit: (precision) => {
    const baseScore = 100;
    const comboBonus = get().combo * 10;
    const precisionBonus = Math.floor(baseScore * precision);

    set((state) => ({
      score: state.score + baseScore + comboBonus + precisionBonus,
      combo: state.combo + 1,
    }));
  },

  registerMiss: () => {
    set({ combo: 0 });
  },

  endGame: () => {
    set({ gameState: 'finished' });
  },
  
  resetGame: () => {
    set(initialState);
  },
}));