/**
 * src/components/quiz/OptionButton.tsx
 *
 * O "Selo Elemental". Um botão temático que dispara a
 * lógica de pontuação e o som de clique.
 */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { QuizQuestionOption } from '@/lib/types/avatar';
import { useQuizStore } from '@/lib/stores/useQuizStore';

// TODO: Implementar useSoundManager quando os assets de áudio estiverem prontos
const useSoundManager = () => ({ playStoneClick: () => { } });

interface Props {
  option: QuizQuestionOption;
  isNarrativeButton?: boolean; // Para o botão "Continuar"
}

export const OptionButton = ({ option, isNarrativeButton = false }: Props) => {
  const selectAnswer = useQuizStore((state) => state.selectAnswer);

  // Usamos o hook, mas apenas para a *função* de tocar o clique
  const { playStoneClick } = useSoundManager();

  const handleClick = () => {
    // 1. Tocar o som do clique
    playStoneClick();

    // 2. Chamar a ação do store (que avançará o índice)
    selectAnswer(option.scores);
  };

  return (
    <motion.button
      onClick={handleClick}

      /**
       * ESTILIZAÇÃO TEMÁTICA (Regra de Ouro) - via Tailwind/CSS
       *
       * .option-button {
       * // Base: Textura de pedra ou pergaminho
       * background-image: url('/assets/images/ui/stone_texture.png');
       * border: 2px solid #5a4a3a; // Cor de borda de terra
       * box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
       *
       * // Fonte: Temática, cor de pergaminho
       * font-family: 'Herculanum', serif;
       * color: #dcd1b9;
       * text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
       *
       * // Transição suave
       * transition: all 0.2s ease-out;
       * }
       *
       * .option-button:hover {
       * // Hover: Brilho sutil (como um glifo elemental)
       * border-color: #f7b64a; // Cor dourada
       * box-shadow: 0 0 15px rgba(247, 182, 74, 0.5), 
       * 0 4px 8px rgba(0, 0, 0, 0.6);
       * transform: translateY(-2px); // Leve levitação
       * }
       */
      className={`
        w-full p-5 text-left text-lg
        bg-black/40 border-2 border-gray-500/50 backdrop-blur-sm
        text-gray-100 shadow-lg
        transition-all duration-200 ease-out
        hover:border-amber-300 hover:shadow-amber-300/20 hover:shadow-xl hover:-translate-y-1
        ${isNarrativeButton ? 'text-center text-amber-300' : ''}
      `}

      // Animação de clique (Regra de Ouro)
      whileTap={{ scale: 0.97, y: 2 }}
    >
      {option.text}
    </motion.button>
  );
};