/**
 * src/lib/stores/useQuizStore.ts
 *
 * Store Zustand para o estado do quiz "O Chamado Espiritual".
 */
import { create } from 'zustand';
import { ScoreObject } from '@/lib/types/avatar';
import { quizQuestions } from '@/lib/data/quizQuestions';

type QuizState = 'pending' | 'active' | 'finished';

interface QuizStoreState {
  currentQuestionIndex: number;
  answers: ScoreObject[];
  quizState: QuizState;
}

interface QuizStoreActions {
  startQuiz: () => void;
  selectAnswer: (scores: ScoreObject) => void;
  resetQuiz: () => void;
}

const initialState: QuizStoreState = {
  currentQuestionIndex: 0,
  answers: [],
  quizState: 'pending',
};

export const useQuizStore = create<QuizStoreState & QuizStoreActions>((set, get) => ({
  ...initialState,

  startQuiz: () => {
    set({ quizState: 'active', currentQuestionIndex: 0, answers: [] });
  },

  selectAnswer: (scores) => {
    const { answers, currentQuestionIndex } = get();
    const newAnswers = [...answers, scores];
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= quizQuestions.length) {
      set({ answers: newAnswers, quizState: 'finished' });
    } else {
      set({ answers: newAnswers, currentQuestionIndex: nextIndex });
    }
  },

  resetQuiz: () => {
    set(initialState);
  },
}));