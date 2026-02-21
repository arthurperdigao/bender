/**
 * src/app/quiz/page.tsx
 *
 * "O Chamado Espiritual" — Quiz Imersivo Cinematográfico
 * Experiência tipo Pottermore para o universo Avatar
 */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useQuizStore } from '@/lib/stores/useQuizStore';
import { quizQuestions } from '@/lib/data/quizQuestions';
import { QuizQuestionOption } from '@/lib/types/avatar';
import { calculateFinalResult } from '@/lib/utils/calculateResult';
import { quizResultContent } from '@/lib/data/quizResultContent';
import { saveElemento } from '@/lib/actions/user';

// ═══════════════════════════════════════════════════════════
// PARTÍCULAS ANIMADAS — Efeito de fundo dinâmico
// ═══════════════════════════════════════════════════════════
const Particles = ({ count = 30, color = '#a792ff' }: { count?: number; color?: string }) => {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.1,
    })), [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
          }}
          animate={{
            y: [
              `${p.y}vh`,
              `${p.y - 30 - Math.random() * 20}vh`,
              `${p.y}vh`,
            ],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TELA DE INÍCIO — Portal Espiritual
// ═══════════════════════════════════════════════════════════
const StartScreen = ({ onStart }: { onStart: () => void }) => {
  const [glowPulse, setGlowPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setGlowPulse((p) => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center p-8 text-center relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {/* Anéis concêntricos animados */}
      <div className="relative mb-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: 120 + i * 40,
              height: 120 + i * 40,
              top: -(i * 20),
              left: -(i * 20),
              borderColor: `rgba(220, 182, 112, ${0.4 - i * 0.1})`,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 30 + i * 15, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        <motion.div
          className="relative w-[120px] h-[120px] rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, rgba(220,182,112,0.15) 0%, transparent 70%)',
            boxShadow: glowPulse
              ? '0 0 50px rgba(220,182,112,0.5), inset 0 0 20px rgba(220,182,112,0.2)'
              : '0 0 20px rgba(220,182,112,0.2), inset 0 0 10px rgba(220,182,112,0.1)',
            transition: 'box-shadow 2s ease-in-out',
          }}
        >
          <span className="text-6xl select-none opacity-80" style={{ filter: 'drop-shadow(0 0 10px rgba(220,182,112,0.8))' }}>☯</span>
        </motion.div>
      </div>

      <motion.h2 className="mb-2 text-xs md:text-sm uppercase tracking-[0.6em] font-bold text-[#dcb670]"
        style={{ fontFamily: 'var(--font-cinzel), serif' }}
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}>
        Portal Espiritual
      </motion.h2>

      <motion.h1
        className="mb-6 text-5xl md:text-7xl font-black tracking-tight text-white uppercase"
        style={{
          fontFamily: 'var(--font-cinzel), serif',
          textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(220,182,112,0.4)',
        }}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.2 }}
      >
        O Chamado <br className="md:hidden" /> Interior
      </motion.h1>

      <div className="mx-auto w-16 h-[1px] mb-8 bg-[#dcb670] opacity-50 shadow-[0_0_10px_rgba(220,182,112,0.8)]"></div>

      <motion.p
        className="mb-12 max-w-lg text-lg italic opacity-80 leading-relaxed text-gray-300 font-lora"
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        &ldquo;O mundo está em desequilíbrio. O caminho à frente é incerto,
        mas o poder de moldar o destino reside dentro de você.&rdquo;
      </motion.p>

      {/* Botão de início Estilo Pergaminho Dourado */}
      <motion.button
        className="relative px-12 py-4 text-sm md:text-md uppercase tracking-[0.2em] font-bold text-[#161a25] shadow-[0_0_40px_rgba(220,182,112,0.2)] hover:shadow-[0_0_60px_rgba(220,182,112,0.5)] transition-shadow duration-500"
        style={{
          backgroundColor: '#dcb670',
          fontFamily: 'var(--font-cinzel), serif',
          clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)',
          border: 'none'
        }}
        onClick={onStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        Iniciar Provação
      </motion.button>

      {/* Links Secundários */}
      <motion.div
        className="mt-20 flex flex-wrap justify-center gap-6 md:gap-12 text-xs uppercase tracking-[0.2em] opacity-50 font-bold text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.5 }}
      >
        <Link href="/arena/bending-practice" className="hover:text-[#dcb670] hover:opacity-100 transition-colors duration-300">
          Arena de Dobra
        </Link>
        <Link href="/arena/pai-sho" className="hover:text-[#a0b84c] hover:opacity-100 transition-colors duration-300">
          Pai Sho
        </Link>
        <Link href="/arena/trivia" className="hover:text-[#f2c56a] hover:opacity-100 transition-colors duration-300">
          Arquivos
        </Link>
      </motion.div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════
// BOTÃO DE OPÇÃO — Com efeito elemental
// ═══════════════════════════════════════════════════════════
const OptionButton = ({
  option,
  onSelect,
  index,
  isNarrative = false,
}: {
  option: QuizQuestionOption;
  onSelect: () => void;
  index: number;
  isNarrative?: boolean;
}) => (
  <motion.button
    onClick={onSelect}
    className={`
      group relative w-full p-6 text-left text-base md:text-lg rounded-lg overflow-hidden
      border border-white/5 bg-white/5 backdrop-blur-md
      transition-all duration-500 flex items-center
      ${isNarrative
        ? 'justify-center italic text-[#dcb670] hover:text-white glow-text'
        : 'text-gray-300 hover:text-white'}
    `}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 + index * 0.12, duration: 0.5 }}
    whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.1)' }}
    whileTap={{ scale: 0.98 }}
  >
    {/* Glow Dourado Interno Oculto, Revelado no Hover */}
    <div
      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        boxShadow: 'inset 0 0 40px rgba(220,182,112,0.15)',
        border: '1px solid rgba(220,182,112,0.3)',
      }}
    />

    {/* Marcador lateral dourado animado */}
    {!isNarrative && (
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-white/20 group-hover:bg-[#dcb670] transition-colors duration-500 shadow-[0_0_10px_rgba(220,182,112,0)] group-hover:shadow-[0_0_15px_rgba(220,182,112,0.8)]"
      />
    )}

    <span className="relative z-10 block pl-3">{option.text}</span>
  </motion.button>
);

// ═══════════════════════════════════════════════════════════
// TELA DE PERGUNTAS — Transições cinematográficas
// ═══════════════════════════════════════════════════════════
const QuestionScreen = () => {
  const { currentQuestionIndex, selectAnswer } = useQuizStore();
  const question = quizQuestions[currentQuestionIndex];
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = useCallback((scores: QuizQuestionOption['scores']) => {
    setIsTransitioning(true);
    setTimeout(() => {
      selectAnswer(scores);
      setIsTransitioning(false);
    }, 600);
  }, [selectAnswer]);

  if (!question) return null;

  const totalQuestions = quizQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <motion.div
      className="flex min-h-screen w-full flex-col items-center justify-center p-6 md:p-8 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Barra de progresso */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          className="h-[3px]"
          style={{
            background: 'linear-gradient(90deg, #161a25, #dcb670)',
            boxShadow: '0 0 15px rgba(220,182,112,0.8)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' as const }}
        />
      </div>

      {/* Indicador de progresso (dots) */}
      <div className="fixed top-6 right-6 flex items-center gap-2 z-50">
        <span className="text-xs opacity-50 uppercase tracking-[0.3em] font-bold text-[#dcb670]">
          Visão {currentQuestionIndex + 1}/{totalQuestions}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          className="flex max-w-2xl flex-col items-center w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? -20 : 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6 }}
        >
          {/* Tipo de pergunta */}
          {question.type === 'narrative' ? (
            <motion.div
              className="mb-8 text-xs uppercase tracking-[0.5em] font-bold text-[#dcb670] opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✦ O Espírito Guia ✦
            </motion.div>
          ) : (
            <div className="h-6 mb-8" />
          )}

          {/* Texto da pergunta */}
          <motion.h2
            className={`mb-12 text-center leading-relaxed text-white ${question.type === 'narrative'
              ? 'text-2xl md:text-3xl italic font-lora text-gray-300'
              : 'text-3xl md:text-4xl font-bold'
              }`}
            style={question.type !== 'narrative' ? { fontFamily: 'var(--font-cinzel), serif', textShadow: '0 4px 15px rgba(0,0,0,0.5)' } : {}}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {question.type === 'narrative' ? (
              <span>&ldquo;{question.prompt}&rdquo;</span>
            ) : (
              question.prompt
            )}
          </motion.h2>

          {/* Opções */}
          <div className="w-full space-y-3">
            {question.type === 'choice' ? (
              question.options?.map((option, i) => (
                <OptionButton
                  key={option.id}
                  option={option}
                  index={i}
                  onSelect={() => handleSelect(option.scores)}
                />
              ))
            ) : (
              <OptionButton
                option={{ id: 'continue', text: 'Continuar...', scores: {} }}
                index={0}
                onSelect={() => handleSelect({})}
                isNarrative={true}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════
// TELA DE RESULTADO — Revelação Cinematográfica
// ═══════════════════════════════════════════════════════════
const ResultScreen = () => {
  const { answers, resetQuiz } = useQuizStore();
  const resultId = useMemo(() => calculateFinalResult(answers), [answers]);
  const content = quizResultContent[resultId];
  const [revealed, setRevealed] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'already_sealed' | 'no_session'>('idle');
  const { data: session } = useSession();

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Tenta salvar o elemento automaticamente quando a revelação acontece
  useEffect(() => {
    if (!revealed || !content) return;
    if (!session?.user) {
      setSaveStatus('no_session');
      return;
    }
    setSaveStatus('saving');
    saveElemento(content.element).then((result) => {
      if (result.success) {
        setSaveStatus('saved');
      } else if (result.error === 'Seu elemento espiritual já foi selado.') {
        setSaveStatus('already_sealed');
      } else {
        setSaveStatus('idle');
      }
    });
  }, [revealed, content, session]);

  if (!content) return null;

  const { colors } = content;

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center p-8 text-center relative z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Glow central do resultado */}
      <motion.div
        className="absolute"
        style={{
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
        animate={{
          scale: revealed ? [1, 1.3, 1.1] : 0,
          opacity: revealed ? 0.8 : 0,
        }}
        transition={{ duration: 2, ease: 'easeOut' as const }}
      />

      {/* Fase 1: Concentração — antes da revelação */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            className="flex flex-col items-center"
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-24 h-24 rounded-full border-2 flex items-center justify-center"
              style={{
                borderColor: colors.primary,
                boxShadow: `0 0 40px ${colors.primary}80`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  `0 0 40px ${colors.primary}40`,
                  `0 0 80px ${colors.primary}80`,
                  `0 0 40px ${colors.primary}40`,
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-4xl">{content.icon}</span>
            </motion.div>
            <motion.p
              className="mt-6 text-sm opacity-50 italic"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Os espíritos estão falando...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fase 2: Revelação */}
      {revealed && (
        <>
          {/* Ícone grande com explosão de glow */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 12, duration: 1.5 }}
          >
            <div
              className="w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle, ${colors.primary}30 0%, ${colors.secondary} 70%)`,
                border: `2px solid ${colors.primary}60`,
                boxShadow: `0 0 60px ${colors.primary}40, inset 0 0 30px ${colors.primary}20`,
              }}
            >
              <span className="text-7xl md:text-8xl select-none">{content.icon}</span>
            </div>
          </motion.div>

          {/* Subtítulo do elemento */}
          <motion.div
            className="mb-3 text-xs uppercase tracking-[0.3em]"
            style={{ color: colors.accent, opacity: 0.6 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
          >
            {content.subtitle}
          </motion.div>

          {/* Título do resultado */}
          <motion.h1
            className="mb-6 text-4xl md:text-6xl font-bold"
            style={{
              color: colors.primary,
              textShadow: `0 0 30px ${colors.primary}60`,
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            {content.title}
          </motion.h1>

          {/* Citação */}
          <motion.p
            className="mb-8 max-w-md text-base italic leading-relaxed"
            style={{ color: colors.accent, opacity: 0.7 }}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 0.7 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {content.quote}
          </motion.p>

          {/* Descrição detalhada */}
          <motion.p
            className="mb-12 max-w-lg text-sm leading-relaxed opacity-60"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 0.6 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            {content.description}
          </motion.p>

          {/* Ações */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <button
              onClick={resetQuiz}
              className="px-6 py-3 rounded-xl text-sm border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-300"
            >
              Refazer Quiz
            </button>
            <Link
              href="/arena/bending-practice"
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                border: `1px solid ${colors.primary}50`,
                color: colors.primary,
                background: `${colors.primary}10`,
              }}
            >
              Ir para a Arena →
            </Link>
          </motion.div>

          {/* Status do save do elemento */}
          <motion.div
            className="mt-8 text-xs text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
          >
            {saveStatus === 'saving' && (
              <span style={{ color: colors.accent, opacity: 0.6 }}>🌀 Selando seu espírito no Portal...</span>
            )}
            {saveStatus === 'saved' && (
              <span style={{ color: colors.primary }}>✦ Elemento selado no seu perfil! Acesse <Link href="/perfil" style={{ textDecoration: 'underline' }}>seu perfil</Link>.</span>
            )}
            {saveStatus === 'already_sealed' && (
              <span style={{ color: colors.accent, opacity: 0.5 }}>Seu Selo Espiritual já estava definido.</span>
            )}
            {saveStatus === 'no_session' && (
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>Faça <Link href="/login" style={{ textDecoration: 'underline' }}>login</Link> para salvar seu elemento.</span>
            )}
          </motion.div>

          {/* Info de elemento */}
          <motion.div
            className="mt-16 text-xs opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 2.5 }}
          >
            {content.element !== 'none'
              ? `Elemento: ${content.element.charAt(0).toUpperCase() + content.element.slice(1)}`
              : 'Não-Dobrador — A mente é a arma suprema'
            }
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════════════
export default function QuizPage() {
  const { quizState, startQuiz } = useQuizStore();

  // Cor das partículas muda conforme o estado (Ouro Pergaminho ou Fogo no fim)
  const particleColor = quizState === 'finished' ? '#ff6a42' : '#dcb670';

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 0%, #161a25 0%, #0d0f16 70%, #000000 100%)',
      }}
    >
      <Particles color={particleColor} count={60} />

      {/* Decoração Atmosférica no fundo */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#161a25] via-transparent to-[#0d0f16] opacity-60 pointer-events-none" />

      {/* Botão Home flutuante com estética Dark/Dourada */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-bold
          bg-[#161a25]/60 border border-white/5 text-[#dcb670]/80 shadow-lg backdrop-blur-md
          hover:text-[#dcb670] hover:bg-[#242a3c]/80 hover:border-[#dcb670]/30 hover:scale-105
          transition-all duration-300"
      >
        ← Retornar
      </Link>

      <AnimatePresence mode="wait">
        {quizState === 'pending' && (
          <motion.div key="start" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <StartScreen onStart={startQuiz} />
          </motion.div>
        )}
        {quizState === 'active' && (
          <motion.div key="quiz" exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="min-h-screen pt-20">
            <QuestionScreen />
          </motion.div>
        )}
        {quizState === 'finished' && (
          <motion.div key="result" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <ResultScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}