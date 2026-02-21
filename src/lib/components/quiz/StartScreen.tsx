/**
 * src/components/quiz/StartScreen.tsx
 * A tela de início imersiva.
 */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/stores/useQuizStore';

export const StartScreen = () => {
  const startQuiz = useQuizStore((state) => state.startQuiz);
  // const playSfx = useAudioStore((state) => state.playSfx); // (Para o som)

  const handleStart = () => {
    // playSfx('scroll_open'); // Toca o som de início
    startQuiz();
  };

  return (
    <motion.div
      className="flex h-screen flex-col items-center justify-center p-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      // Fundo temático (ex: Mundo Espiritual)
      style={{ backgroundImage: 'url(/assets/images/ui/spiritual_mist_bg.png)' }}
    >
      <motion.h1
        className="mb-4 text-5xl font-bold"
        // TODO: Aplicar a fonte temática (Herculanum) via globals.css
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        O Chamado Espiritual
      </motion.h1>

      <motion.p
        className="mb-10 max-w-lg text-xl italic"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 1 }}
      >
        &quot;O mundo está em desequilíbrio. O caminho à frente é incerto,
        mas é o seu caminho.&quot;
      </motion.p>

      <motion.button
        className="rounded-sm border-2 border-amber-200/50 bg-black/30 px-8 py-4 text-2xl text-amber-100 shadow-lg shadow-black/50 backdrop-blur-sm"
        // TODO: Estilizar como um 'selo' ou 'pergaminho' (ver OptionButton)
        onClick={handleStart}
        whileHover={{
          scale: 1.05,
          boxShadow: '0 0 20px rgba(253, 230, 138, 0.5)',
          textShadow: '0 0 10px rgba(253, 230, 138, 0.7)',
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        Iniciar sua Jornada
      </motion.button>
    </motion.div>
  );
};