/**
 * src/components/arena/trivia/TriviaResults.tsx
 *
 * Mostra a pontuação final e o botão para jogar novamente.
 */
import React, { useState } from 'react';

type TriviaState = {
  score: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: any[];
  resetGame: () => void;
};

const defaultState: TriviaState = { score: 0, questions: [], resetGame: () => { } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useTriviaStore = (selector: (s: TriviaState) => any) => {
  const [state] = useState<TriviaState>(defaultState);
  // Return selected slice (works like a simple selector-based hook)
  return selector(state);
};

export const TriviaResults = () => {
  const score = useTriviaStore((state) => state.score);
  const totalQuestions = useTriviaStore((state) => state.questions.length);
  const resetGame = useTriviaStore((state) => state.resetGame);

  // Lógica para um título divertido
  const getTitle = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) return "Mestre do Lore!";
    if (percentage >= 70) return "Membro do Lótus Branco";
    if (percentage >= 40) return "Visitante da Biblioteca";
    return "Precisa estudar mais!";
  };

  return (
    <div className="text-center">
      <h2 className="text-5xl font-bold mb-4">{getTitle()}</h2>
      <p className="text-3xl mb-8">
        Você acertou {score} de {totalQuestions} perguntas!
      </p>

      {/* TODO: Adicionar revisão das respostas aqui */}

      <button onClick={resetGame} className="game-button text-2xl">
        Jogar Novamente
      </button>
    </div>
  );
};