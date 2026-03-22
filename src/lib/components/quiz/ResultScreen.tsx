/**
 * src/components/quiz/ResultScreen.tsx
 *
 * A Revelação Cinematográfica.
 * Calcula o resultado, toca o Lottie e revela a identidade.
 */
'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react'; // Importa a biblioteca Lottie
import { useQuizStore } from '@/lib/stores/useQuizStore';
import { calculateFinalResult } from '@/lib/utils/calculateResult';
import { quizResultContent } from '@/lib/data/quizResultContent';
import { ResultID } from '@/lib/types/avatar';
import Link from 'next/link';

// Variantes de animação para a revelação (fade-in majestoso)
const revealParentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.8, // Orquestra a entrada dos filhos
    },
  },
};

const revealChildVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' as const } },
};

export const ResultScreen = () => {
  const answers = useQuizStore((state) => state.answers);

  // 1. Calcular o resultado (usando useMemo para performance)
  const resultId: ResultID = useMemo(
    () => calculateFinalResult(answers),
    [answers]
  );

  // 2. Buscar o conteúdo do resultado
  const content = quizResultContent[resultId];

  if (!content) {
    return <div>Calculando seu espírito...</div>;
  }

  // 3. Renderização Cinematográfica
  return (
    <motion.div
      className="flex h-screen w-full flex-col items-center justify-center p-8 text-center bg-[#0b0e14]"
      variants={revealParentVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 3.1. A Animação Lottie */}
      <motion.div variants={revealChildVariants}>
        <Lottie
          animationData={null} // TODO: Carregar o JSON do asset
          loop={true}
          autoplay={true}
          style={{ width: 300, height: 300, marginBottom: '2rem' }}
        />
      </motion.div>

      {/* 3.2. O Título */}
      <motion.h1
        className="mb-4 text-5xl font-bold"
        // TODO: Estilizar com a cor da nação (ex: text-red-500)
        style={{ color: 'var(--color-primary)' }} // (Assumindo CSS vars)
        variants={revealChildVariants}
      >
        {content.title}
      </motion.h1>

      {/* 3.3. A Descrição */}
      <motion.p
        className="mb-10 max-w-lg text-xl italic"
        variants={revealChildVariants}
      >
        {content.description}
      </motion.p>

      {/* 3.4. Próximo Passo */}
      <motion.div variants={revealChildVariants}>
        <Link
          href="/library" // (Próximo Módulo)
          className="rounded-sm border-2 border-amber-200/50 bg-black/30 px-6 py-3 text-xl text-amber-100 shadow-lg shadow-black/50 backdrop-blur-sm"
        // (Estilização de botão temático)
        >
          Ir para a Biblioteca de Wan Shi Tong
        </Link>
      </motion.div>
    </motion.div>
  );
};