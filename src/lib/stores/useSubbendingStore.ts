/**
 * src/lib/stores/useSubbendingStore.ts
 *
 * Store Zustand para o Quiz de Sub-bending — "O Chamado Profundo"
 * Funciona igual ao useQuizStore, mas recebe as perguntas dinamicamente
 * baseado no elementoNato do usuário.
 */
import { create } from 'zustand';
import { ScoreObject, QuizQuestion } from '@/lib/types/avatar';

type QuizState = 'pending' | 'active' | 'finished';

interface SubbendingStoreState {
    currentQuestionIndex: number;
    answers: ScoreObject[];
    quizState: QuizState;
    questions: QuizQuestion[];
    element: string | null;
}

interface SubbendingStoreActions {
    initQuiz: (element: string, questions: QuizQuestion[]) => void;
    startQuiz: () => void;
    selectAnswer: (scores: ScoreObject) => void;
    resetQuiz: () => void;
}

const initialState: SubbendingStoreState = {
    currentQuestionIndex: 0,
    answers: [],
    quizState: 'pending',
    questions: [],
    element: null,
};

export const useSubbendingStore = create<SubbendingStoreState & SubbendingStoreActions>((set, get) => ({
    ...initialState,

    initQuiz: (element, questions) => {
        set({ element, questions, currentQuestionIndex: 0, answers: [], quizState: 'pending' });
    },

    startQuiz: () => {
        set({ quizState: 'active', currentQuestionIndex: 0, answers: [] });
    },

    selectAnswer: (scores) => {
        const { answers, currentQuestionIndex, questions } = get();
        const newAnswers = [...answers, scores];
        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex >= questions.length) {
            set({ answers: newAnswers, quizState: 'finished' });
        } else {
            set({ answers: newAnswers, currentQuestionIndex: nextIndex });
        }
    },

    resetQuiz: () => {
        set(initialState);
    },
}));
