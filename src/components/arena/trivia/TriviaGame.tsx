/**
 * src/components/arena/trivia/TriviaGame.tsx
 *
 * Componente principal que orquestra o fluxo do jogo de Trivia.
 */
'use client';

import React from 'react';
import { useTriviaStore } from './useTriviaStore';
import { TriviaQuestion } from '@/lib/types/trivia';

export const TriviaResults: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto text-center">
      <h2 className="text-3xl mb-4">Resultados</h2>
      <p>Obrigado por jogar! O resumo do jogo aparecerá aqui.</p>
    </div>
  );
};

const TriviaQuestionDisplay: React.FC<{ question?: TriviaQuestion }> = ({ question }) => {
  if (!question) return <div>Carregando...</div>;
  return (
    <div className="max-w-xl mx-auto">
      <h3 className="text-2xl mb-4">{question.question}</h3>
      <ul className="grid gap-2">
        {question.options.map((a, i) => (
          <li key={i} className="p-2 border rounded">{a}</li>
        ))}
      </ul>
    </div>
  );
};

// Um componente simples para a tela de setup
const TriviaSetup = () => {
  const loadGame = useTriviaStore(s => s.loadGame);
  return (
    <div className="text-center">
      <h2 className="text-4xl mb-8">Escolha a Dificuldade</h2>
      <div className="flex gap-4 justify-center">
        <button onClick={() => loadGame('easy')} className="game-button">Fácil</button>
        <button onClick={() => loadGame('medium')} className="game-button">Médio</button>
        <button onClick={() => loadGame('hard')} className="game-button">Difícil</button>
      </div>
    </div>
  )
}

export const TriviaGame = () => {
  const gameState = useTriviaStore((state) => state.gameState);
  const questions = useTriviaStore((state) => state.questions);
  const currentQuestionIndex = useTriviaStore((state) => state.currentQuestionIndex);

  if (gameState === 'playing') {
    const currentQuestion = questions[currentQuestionIndex];
    return <TriviaQuestionDisplay question={currentQuestion} />;
  }

  if (gameState === 'finished') {
    return <TriviaResults />;
  }

  return <TriviaSetup />;
};