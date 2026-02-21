/**
 * src/components/quiz/ChoiceStep.tsx
 * Renderiza uma pergunta de múltipla escolha.
 */
'use client';

import React from 'react';
import { QuizQuestion } from '@/lib/types/avatar';
import { OptionButton } from './OptionButton';
import { motion } from 'framer-motion';

interface Props {
  question: QuizQuestion;
}

export const ChoiceStep = ({ question }: Props) => {
  return (
    <div className="flex max-w-4xl flex-col items-center">
      <motion.h2
        className="mb-10 text-center text-4xl font-bold text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {question.prompt}
      </motion.h2>

      {/* Renderiza as opções em um grid temático */}
      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5, staggerChildren: 0.1 }}
      >
        {question.options?.map((option) => (
          <OptionButton key={option.id} option={option} />
        ))}
      </motion.div>
    </div>
  );
};