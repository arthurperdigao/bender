/**
 * src/components/arena/trivia/useTriviaStore.ts
 *
 * Store Zustand para o jogo de Trivia.
 * Gerencia o estado do jogo, perguntas e pontuação.
 */
import { create } from 'zustand';
import { TriviaQuestion } from '@/lib/types/trivia';
import { allTriviaQuestions } from '@/lib/types/triviaQuestions';

type TriviaGameState = 'setup' | 'playing' | 'finished';
type Difficulty = 'easy' | 'medium' | 'hard';

interface TriviaState {
    gameState: TriviaGameState;
    questions: TriviaQuestion[];
    currentQuestionIndex: number;
    score: number;
    selectedDifficulty: Difficulty | null;
}

interface TriviaActions {
    loadGame: (difficulty: Difficulty) => void;
    answerQuestion: (answerIndex: number) => void;
    resetGame: () => void;
}

const initialState: TriviaState = {
    gameState: 'setup',
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    selectedDifficulty: null,
};

export const useTriviaStore = create<TriviaState & TriviaActions>((set, get) => ({
    ...initialState,

    loadGame: (difficulty) => {
        const filtered = allTriviaQuestions.filter((q) => q.difficulty === difficulty);
        set({
            gameState: 'playing',
            questions: filtered,
            currentQuestionIndex: 0,
            score: 0,
            selectedDifficulty: difficulty,
        });
    },

    answerQuestion: (answerIndex) => {
        const { questions, currentQuestionIndex, score } = get();
        const currentQuestion = questions[currentQuestionIndex];

        const isCorrect = currentQuestion?.correctAnswerIndex === answerIndex;
        const newScore = isCorrect ? score + 1 : score;
        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex >= questions.length) {
            set({ score: newScore, gameState: 'finished' });
        } else {
            set({ score: newScore, currentQuestionIndex: nextIndex });
        }
    },

    resetGame: () => {
        set(initialState);
    },
}));
