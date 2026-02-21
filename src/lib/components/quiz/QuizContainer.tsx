/**
 * src/components/quiz/QuizContainer.tsx
 *
 * O Maestro. Renderiza o estado atual da jornada:
 * 'pending'  -> <StartScreen />
 * 'active'   -> <NarrativeStep />
 * 'finished' -> <ResultScreen />
 */
'use client';

import React from 'react';
import { useQuizStore } from '@/lib/stores/useQuizStore';
import { StartScreen } from './StartScreen';
import { NarrativeStep } from './NarrativeStep';
import { ResultScreen } from './ResultScreen';
// TODO: Implementar useSoundManager quando os assets de áudio estiverem prontos
const UseSoundManager = () => { };

export const QuizContainer = () => {
  const quizState = useQuizStore((state) => state.quizState);

  // Montamos o Gerenciador de Som AQUI.
  // Ele ficará ativo apenas durante o quiz.
  UseSoundManager();

  // Função para renderizar o ato atual
  const renderCurrentState = () => {
    switch (quizState) {
      case 'active':
        return <NarrativeStep />;
      case 'finished':
        return <ResultScreen />;
      case 'pending':
      default:
        return <StartScreen />;
    }
  };

  return (
    <div className="quiz-container">
      {/* A animação de transição entre os estados (ex: Start -> Active) 
        será controlada dentro de cada componente filho 
        para máximo controle cinematográfico.
      */}
      {renderCurrentState()}
    </div>
  );
};