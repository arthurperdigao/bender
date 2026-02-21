/**
 * src/components/quiz/NarrativeStep.tsx
 *
 * Renderiza a pergunta atual (narrativa OU escolha).
 * Usa Framer Motion para animar a transição entre as perguntas.
 */
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/lib/stores/useQuizStore';
import { quizQuestions } from '@/lib/data/quizQuestions';
import { OptionButton } from './OptionButton';
import { QuizQuestionOption } from '@/lib/types/avatar';

// Animação "Desenrolar do Pergaminho"
const scrollVariants = {
  initial: { opacity: 0, y: 50 }, // Entra de baixo para cima, como se desenrolando
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 }, // Sai para cima
};

export const NarrativeStep = () => {
  const currentQuestionIndex = useQuizStore((s) => s.currentQuestionIndex);

  const question = quizQuestions[currentQuestionIndex];

  if (!question) {
    // Segurança: se as perguntas acabarem, o QuizContainer cuidará disso.
    return null;
  }

  if (!question) {
    // Segurança: se as perguntas acabarem, o QuizContainer cuidará disso.
    return null;
  }

  return (
    <div
      className="flex h-screen w-full items-center justify-center p-8"
      // Fundo gradiente temático
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #1a182d 0%, #0a0a14 100%)',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          // A 'key' é o segredo da animação. Mudar a key força o re-render.
          key={currentQuestionIndex}
          variants={scrollVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'spring' as const, stiffness: 200, damping: 25, duration: 0.5 }}
          className="flex max-w-4xl flex-col items-center"
        >
          {/* 1. O Texto da Pergunta */}
          <h2 className="mb-12 text-center text-4xl font-bold italic text-white shadow-black/50 text-shadow-lg">
            &quot;{question.prompt}&quot;
          </h2>

          {/* 2. As Opções (ou o botão 'Continuar') */}
          <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
            {question.type === 'choice' ? (
              // Mapeia as opções de escolha
              question.options?.map((option) => (
                <OptionButton key={option.id} option={option} />
              ))
            ) : (
              // Renderiza um único botão "Continuar" para narrativa
              <div className="md:col-span-2 md:flex md:justify-center">
                <OptionButton
                  option={{
                    id: 'continue',
                    text: 'Continuar...',
                    scores: {}, // Pontuação vazia
                  } as QuizQuestionOption}
                  isNarrativeButton={true} // Prop para estilização especial
                />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};