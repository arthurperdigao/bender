/**
 * src/app/quiz/subbending/page.tsx
 *
 * "O Chamado Profundo" — Quiz de Sub-bending
 *
 * COMPORTAMENTO:
 * - Sem subbending → mostra o quiz completo (uma vez por perfil)
 * - Com subbending → mostra o "Grimório da Essência" (identidade revelada)
 * - Sem elemento   → instrui a fazer o quiz do elemento primeiro
 */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useSubbendingStore } from '@/lib/stores/useSubbendingStore';
import { subbendingQuestionsMap } from '@/lib/data/subbendingQuestions';
import { QuizQuestionOption, ResultID } from '@/lib/types/avatar';
import { calculateFinalResult } from '@/lib/utils/calculateResult';
import { quizResultContent } from '@/lib/data/quizResultContent';
import { saveSubbending, getUserStats } from '@/lib/actions/user';

// ═══════════════════════════════════════════════════════
// TEMAS POR ELEMENTO
// ═══════════════════════════════════════════════════════
const ELEMENT_THEME: Record<string, { color: string; glow: string; particle: string; name: string; icon: string }> = {
    water: { color: '#38bdf8', glow: 'rgba(56,189,248,0.3)', particle: '#38bdf8', name: 'Água', icon: '💧' },
    earth: { color: '#22c55e', glow: 'rgba(34,197,94,0.3)', particle: '#22c55e', name: 'Terra', icon: '⛰️' },
    fire: { color: '#f97316', glow: 'rgba(249,115,22,0.3)', particle: '#f97316', name: 'Fogo', icon: '🔥' },
    air: { color: '#fbbf24', glow: 'rgba(251,191,36,0.3)', particle: '#fbbf24', name: 'Ar', icon: '🌪️' },
    none: { color: '#a78bfa', glow: 'rgba(167,139,250,0.3)', particle: '#a78bfa', name: 'Espírito Livre', icon: '☯' },
};

// ═══════════════════════════════════════════════════════
// PARTÍCULAS
// ═══════════════════════════════════════════════════════
const Particles = ({ color }: { color: string }) => {
    const particles = useMemo(() =>
        Array.from({ length: 25 }, (_, i) => ({
            id: i, x: Math.random() * 100, y: Math.random() * 100,
            size: Math.random() * 3 + 1, duration: Math.random() * 12 + 8,
            delay: Math.random() * 4, opacity: Math.random() * 0.35 + 0.08,
        })), []);
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map((p) => (
                <motion.div key={p.id} className="absolute rounded-full"
                    style={{ left: `${p.x}%`, width: p.size, height: p.size, backgroundColor: color, opacity: p.opacity }}
                    animate={{ y: [`${p.y}vh`, `${p.y - 25}vh`, `${p.y}vh`], opacity: [p.opacity, p.opacity * 2.2, p.opacity] }}
                    transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }} />
            ))}
        </div>
    );
};

// ═══════════════════════════════════════════════════════
// GRIMÓRIO DA ESSÊNCIA — Tela para quem já revelou
// ═══════════════════════════════════════════════════════
const GrimorioScreen = ({ subbendingId }: { subbendingId: string }) => {
    const content = quizResultContent[subbendingId as ResultID];
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 400);
        return () => clearTimeout(t);
    }, []);

    if (!content) return null;
    const { colors } = content;

    return (
        <motion.div
            className="flex min-h-screen flex-col items-center justify-center p-8 text-center relative z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
        >
            {/* Glow de fundo */}
            <motion.div className="absolute pointer-events-none"
                style={{ width: 600, height: 600, background: `radial-gradient(circle, ${colors.primary}18 0%, transparent 70%)`, filter: 'blur(60px)' }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />

            {/* Selo animado */}
            <motion.div className="relative mb-8"
                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 1.4, type: 'spring', stiffness: 60, damping: 12 }}>

                {/* Anéis orbitais */}
                {[0, 1].map((i) => (
                    <motion.div key={i} className="absolute rounded-full border"
                        style={{
                            width: 170 + i * 40, height: 170 + i * 40,
                            top: -(i * 20), left: -(i * 20),
                            borderColor: `${colors.primary}${i === 0 ? '40' : '20'}`,
                        }}
                        animate={{ rotate: i === 0 ? 360 : -360 }}
                        transition={{ duration: 20 + i * 10, repeat: Infinity, ease: 'linear' }} />
                ))}

                <div className="relative w-[170px] h-[170px] rounded-full flex items-center justify-center"
                    style={{
                        background: `radial-gradient(circle, ${colors.primary}30 0%, ${colors.secondary} 70%)`,
                        border: `2px solid ${colors.primary}50`,
                        boxShadow: `0 0 60px ${colors.primary}35, inset 0 0 30px ${colors.primary}15`,
                    }}>
                    <span className="text-7xl select-none">{content.icon}</span>
                </div>
            </motion.div>

            {/* Badge "Grimório da Essência" */}
            <motion.div className="mb-4 px-5 py-1.5 rounded-full border text-[10px] uppercase tracking-[0.4em] font-bold"
                style={{ borderColor: `${colors.primary}30`, color: colors.accent, backgroundColor: `${colors.primary}10` }}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -10 }}
                transition={{ delay: 0.4 }}>
                ✦ Grimório da Essência ✦
            </motion.div>

            {/* Subtítulo */}
            <motion.p className="mb-2 text-xs uppercase tracking-[0.3em]"
                style={{ color: colors.accent, opacity: 0.6 }}
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.6 }}>
                {content.subtitle}
            </motion.p>

            {/* Título */}
            <motion.h1 className="mb-6 text-4xl md:text-5xl font-bold"
                style={{ color: colors.primary, textShadow: `0 0 40px ${colors.primary}50`, fontFamily: 'var(--font-cinzel), serif' }}
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
                {content.title}
            </motion.h1>

            {/* Divisor */}
            <motion.div className="w-20 h-px mb-8 mx-auto" style={{ backgroundColor: colors.primary, opacity: 0.3 }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8 }} />

            {/* Citação */}
            <motion.p className="mb-8 max-w-md text-lg italic leading-relaxed font-lora"
                style={{ color: colors.accent, opacity: 0.75 }}
                initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 0.75 }} transition={{ delay: 0.8, duration: 1 }}>
                {content.quote}
            </motion.p>

            {/* Descrição */}
            <motion.p className="mb-12 max-w-lg text-sm leading-relaxed text-gray-400 font-lora"
                initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1, duration: 1 }}>
                {content.description}
            </motion.p>

            {/* Nota de selamento */}
            <motion.div className="mb-10 px-6 py-3 rounded-lg border border-white/5 bg-white/3 text-xs text-white/30 max-w-sm"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                🔒 Esta essência foi selada no seu perfil e não pode ser alterada. Sua jornada é única.
            </motion.div>

            {/* Ações */}
            <motion.div className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                <Link href="/perfil"
                    className="px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                    style={{ border: `1px solid ${colors.primary}50`, color: colors.primary, background: `${colors.primary}12` }}>
                    Ver meu Perfil →
                </Link>
                <Link href="/"
                    className="px-8 py-3 rounded-xl text-sm border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-300">
                    Retornar ao Portal
                </Link>
            </motion.div>
        </motion.div>
    );
};

// ═══════════════════════════════════════════════════════
// TELA DE INÍCIO DO QUIZ
// ═══════════════════════════════════════════════════════
const StartScreen = ({ element, onStart }: { element: string; onStart: () => void }) => {
    const theme = ELEMENT_THEME[element] ?? ELEMENT_THEME.none;
    return (
        <motion.div className="flex min-h-screen flex-col items-center justify-center p-8 text-center relative z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
            <div className="relative mb-10">
                {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="absolute rounded-full border"
                        style={{ width: 110 + i * 38, height: 110 + i * 38, top: -(i * 19), left: -(i * 19), borderColor: `${theme.color}${40 - i * 10}` }}
                        animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                        transition={{ duration: 28 + i * 12, repeat: Infinity, ease: 'linear' }} />
                ))}
                <motion.div className="relative w-[110px] h-[110px] rounded-full flex items-center justify-center"
                    style={{ background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)` }}
                    animate={{ boxShadow: [`0 0 30px ${theme.glow}`, `0 0 70px ${theme.glow}`, `0 0 30px ${theme.glow}`] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                    <span className="text-5xl">{theme.icon}</span>
                </motion.div>
            </div>

            <motion.p className="text-xs uppercase tracking-[0.5em] font-bold mb-2"
                style={{ color: theme.color, fontFamily: 'var(--font-cinzel), serif' }}
                initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                O Chamado Profundo — {theme.name}
            </motion.p>

            <motion.h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6"
                style={{ fontFamily: 'var(--font-cinzel), serif', textShadow: `0 4px 20px ${theme.glow}` }}
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}>
                Qual é sua <br className="md:hidden" />
                <span style={{ color: theme.color }}>Verdade</span>?
            </motion.h1>

            <div className="mx-auto w-16 h-px mb-8 opacity-50" style={{ backgroundColor: theme.color }} />

            <motion.p className="mb-12 max-w-lg text-base italic opacity-70 leading-relaxed text-gray-300 font-lora"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.9, duration: 1 }}>
                &ldquo;Dentro de todo elemento existe uma especialização — um caminho único que só você pode trilhar.
                O espírito revelará qual é o seu.&rdquo;
            </motion.p>

            <motion.button
                className="relative px-12 py-4 text-sm uppercase tracking-[0.2em] font-bold text-[#0d0f16]"
                style={{ backgroundColor: theme.color, fontFamily: 'var(--font-cinzel), serif', clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)', boxShadow: `0 0 40px ${theme.glow}` }}
                onClick={onStart}
                whileHover={{ scale: 1.06, boxShadow: `0 0 70px ${theme.glow}` }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
                Iniciar Revelação
            </motion.button>
        </motion.div>
    );
};

// ═══════════════════════════════════════════════════════
// BOTÃO DE OPÇÃO
// ═══════════════════════════════════════════════════════
const OptionButton = ({ option, onSelect, index, elementColor, isNarrative = false }:
    { option: QuizQuestionOption; onSelect: () => void; index: number; elementColor: string; isNarrative?: boolean }) => (
    <motion.button
        onClick={onSelect}
        className={`group relative w-full p-5 text-left rounded-lg overflow-hidden border border-white/5 bg-white/5 backdrop-blur-md transition-all duration-400 flex items-center ${isNarrative ? 'justify-center italic text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'}`}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35 + index * 0.1, duration: 0.45 }}
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ boxShadow: `inset 0 0 35px ${elementColor}20`, border: `1px solid ${elementColor}40` }} />
        {!isNarrative && (
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-white/15 group-hover:transition-colors duration-400"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = elementColor)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')} />
        )}
        <span className="relative z-10 block pl-3 text-sm md:text-base leading-relaxed">{option.text}</span>
    </motion.button>
);

// ═══════════════════════════════════════════════════════
// TELA DE PERGUNTAS
// ═══════════════════════════════════════════════════════
const QuestionScreen = ({ element }: { element: string }) => {
    const { currentQuestionIndex, selectAnswer, questions } = useSubbendingStore();
    const question = questions[currentQuestionIndex];
    const [isTransitioning, setIsTransitioning] = useState(false);
    const theme = ELEMENT_THEME[element] ?? ELEMENT_THEME.none;

    const handleSelect = useCallback((scores: QuizQuestionOption['scores']) => {
        setIsTransitioning(true);
        setTimeout(() => { selectAnswer(scores); setIsTransitioning(false); }, 550);
    }, [selectAnswer]);

    if (!question) return null;
    const total = questions.length;
    const progress = ((currentQuestionIndex + 1) / total) * 100;

    return (
        <motion.div className="flex min-h-screen w-full flex-col items-center justify-center p-6 md:p-8 relative z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-white/5">
                <motion.div className="h-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${theme.color})`, boxShadow: `0 0 12px ${theme.color}` }}
                    initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.7, ease: 'easeOut' }} />
            </div>
            <div className="fixed top-5 right-5 text-xs opacity-40 uppercase tracking-[0.3em] font-bold z-50"
                style={{ color: theme.color }}>{currentQuestionIndex + 1}/{total}</div>

            <AnimatePresence mode="wait">
                <motion.div key={currentQuestionIndex} className="flex max-w-2xl flex-col items-center w-full"
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? -18 : 0 }}
                    exit={{ opacity: 0, y: -35 }} transition={{ duration: 0.55 }}>
                    {question.type === 'narrative' ? (
                        <div className="mb-8 text-xs uppercase tracking-[0.5em] font-bold opacity-70"
                            style={{ color: theme.color, fontFamily: 'var(--font-cinzel), serif' }}>✦ O Espírito Guia ✦</div>
                    ) : <div className="h-6 mb-8" />}

                    <motion.h2 className={`mb-10 text-center leading-relaxed text-white ${question.type === 'narrative' ? 'text-xl md:text-2xl italic font-lora text-gray-300' : 'text-2xl md:text-3xl font-bold'}`}
                        style={question.type !== 'narrative' ? { fontFamily: 'var(--font-cinzel), serif' } : {}}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.55 }}>
                        {question.type === 'narrative' ? <span>&ldquo;{question.prompt}&rdquo;</span> : question.prompt}
                    </motion.h2>

                    <div className="w-full space-y-3">
                        {question.type === 'choice' ? (
                            question.options?.map((opt, i) => (
                                <OptionButton key={opt.id} option={opt} index={i} elementColor={theme.color}
                                    onSelect={() => handleSelect(opt.scores)} />
                            ))
                        ) : (
                            <OptionButton option={{ id: 'continue', text: 'O espírito me chama... Continuar.', scores: {} }}
                                index={0} elementColor={theme.color}
                                onSelect={() => handleSelect({})} isNarrative />
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

// ═══════════════════════════════════════════════════════
// TELA DE RESULTADO (primeira vez)
// ═══════════════════════════════════════════════════════
const ResultScreen = ({ element }: { element: string }) => {
    const { answers, resetQuiz } = useSubbendingStore();
    const resultId = useMemo(() => calculateFinalResult(answers), [answers]);
    const content = quizResultContent[resultId];
    const [revealed, setRevealed] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'already_revealed' | 'no_session'>('idle');
    const { data: session } = useSession();
    const theme = ELEMENT_THEME[element] ?? ELEMENT_THEME.none;

    useEffect(() => {
        const t = setTimeout(() => setRevealed(true), 2200);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!revealed || !content) return;
        if (!session?.user) { setSaveStatus('no_session'); return; }
        setSaveStatus('saving');
        saveSubbending(resultId).then((res) => {
            if (res.success) setSaveStatus('saved');
            else if (res.error === 'Seu caminho espiritual já foi revelado.') setSaveStatus('already_revealed');
            else setSaveStatus('idle');
        });
    }, [revealed, content, session, resultId]);

    if (!content) return null;
    const { colors } = content;

    return (
        <motion.div className="flex min-h-screen flex-col items-center justify-center p-8 text-center relative z-10 overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <motion.div className="absolute"
                style={{ width: 550, height: 550, background: `radial-gradient(circle, ${colors.primary}25 0%, transparent 70%)`, filter: 'blur(55px)' }}
                animate={{ scale: revealed ? [1, 1.4, 1.15] : 0, opacity: revealed ? 0.9 : 0 }}
                transition={{ duration: 2.2, ease: 'easeOut' }} />

            <AnimatePresence>
                {!revealed && (
                    <motion.div className="flex flex-col items-center" exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }}>
                        <motion.div className="w-20 h-20 rounded-full border-2 flex items-center justify-center"
                            style={{ borderColor: theme.color, boxShadow: `0 0 35px ${theme.glow}` }}
                            animate={{ scale: [1, 1.18, 1], boxShadow: [`0 0 35px ${theme.glow}`, `0 0 70px ${theme.glow}`, `0 0 35px ${theme.glow}`] }}
                            transition={{ duration: 1.4, repeat: Infinity }}>
                            <span className="text-3xl">{theme.icon}</span>
                        </motion.div>
                        <motion.p className="mt-5 text-sm opacity-45 italic"
                            animate={{ opacity: [0.3, 0.65, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
                            O espírito está revelando seu caminho...
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {revealed && (
                <>
                    <motion.div className="relative mb-8"
                        initial={{ scale: 0, rotate: -160 }} animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 75, damping: 11, duration: 1.4 }}>
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center"
                            style={{ background: `radial-gradient(circle, ${colors.primary}35 0%, ${colors.secondary} 70%)`, border: `2px solid ${colors.primary}65`, boxShadow: `0 0 55px ${colors.primary}45, inset 0 0 25px ${colors.primary}20` }}>
                            <span className="text-6xl md:text-7xl select-none">{content.icon}</span>
                        </div>
                    </motion.div>

                    <motion.p className="mb-2 text-xs uppercase tracking-[0.3em]" style={{ color: colors.accent, opacity: 0.55 }}
                        initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} transition={{ delay: 0.4 }}>
                        {content.subtitle}
                    </motion.p>

                    <motion.h1 className="mb-5 text-3xl md:text-5xl font-bold" style={{ color: colors.primary, textShadow: `0 0 30px ${colors.primary}55`, fontFamily: 'var(--font-cinzel), serif' }}
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}>
                        {content.title}
                    </motion.h1>

                    <motion.p className="mb-7 max-w-md text-sm italic leading-relaxed font-lora" style={{ color: colors.accent, opacity: 0.65 }}
                        initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 0.65 }} transition={{ delay: 0.75, duration: 0.9 }}>
                        {content.quote}
                    </motion.p>

                    <motion.p className="mb-10 max-w-lg text-sm leading-relaxed opacity-55 text-gray-300 font-lora"
                        initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 0.55 }} transition={{ delay: 1.1, duration: 0.9 }}>
                        {content.description}
                    </motion.p>

                    <motion.div className="flex flex-col sm:flex-row gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                        <Link href="/perfil" className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                            style={{ border: `1px solid ${colors.primary}50`, color: colors.primary, background: `${colors.primary}12` }}>
                            Ver meu Perfil →
                        </Link>
                        <Link href="/" className="px-6 py-3 rounded-xl text-sm border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-300">
                            Retornar ao Portal
                        </Link>
                    </motion.div>

                    <motion.div className="mt-8 text-xs text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
                        {saveStatus === 'saving' && <span style={{ color: colors.accent, opacity: 0.55 }}>🌀 Selando seu caminho espiritual...</span>}
                        {saveStatus === 'saved' && <span style={{ color: colors.primary }}>✦ Essência selada no seu perfil!</span>}
                        {saveStatus === 'no_session' && <span style={{ color: 'rgba(255,255,255,0.3)' }}>Faça <Link href="/login" style={{ textDecoration: 'underline' }}>login</Link> para salvar sua jornada.</span>}
                    </motion.div>
                </>
            )}
        </motion.div>
    );
};

// ═══════════════════════════════════════════════════════
// TELA SEM ELEMENTO
// ═══════════════════════════════════════════════════════
const NoElementScreen = () => (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
        <span className="text-5xl mb-6">☯</span>
        <h2 className="text-2xl font-bold uppercase tracking-widest text-[#dcb670] mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Elemento Não Descoberto
        </h2>
        <p className="text-gray-400 text-sm mb-8 max-w-sm">
            Antes de descobrir sua especialização, você precisa completar o Quiz Espiritual e descobrir seu elemento nato.
        </p>
        <Link href="/quiz" className="px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-[#161a25] transition-all"
            style={{ background: 'linear-gradient(135deg, #dcb670, #a07030)' }}>
            Descobrir meu Elemento →
        </Link>
    </div>
);

// ═══════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════════
export default function SubbendingQuizPage() {
    const { quizState, startQuiz, initQuiz, element } = useSubbendingStore();
    const [userElement, setUserElement] = useState<string | null>(null);
    const [existingSubbending, setExistingSubbending] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        async function loadData() {
            if (!session?.user) { setLoading(false); return; }
            const stats = await getUserStats();
            const el = stats?.elementoNato ?? null;
            const sub = stats?.subbending ?? null;
            setUserElement(el);
            setExistingSubbending(sub);

            // Só inicializa o quiz se ainda não tem subbending
            if (el && !sub) {
                const questions = subbendingQuestionsMap[el] ?? subbendingQuestionsMap['none'];
                initQuiz(el, questions);
            }
            setLoading(false);
        }
        loadData();
    }, [session, initQuiz]);

    const currentElement = element ?? userElement ?? 'none';
    const theme = ELEMENT_THEME[currentElement] ?? ELEMENT_THEME.none;

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center" style={{ background: '#0d0f16' }}>
                <motion.div className="w-12 h-12 rounded-full border-2 border-[#dcb670]/30 border-t-[#dcb670]"
                    animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
            </main>
        );
    }

    const bgGlow = theme.glow.replace('0.3', '0.06');

    return (
        <main className="min-h-screen relative overflow-hidden"
            style={{ background: `radial-gradient(circle at 50% 0%, ${bgGlow} 0%, #0d0f16 60%, #000 100%)` }}>
            <Particles color={theme.particle} />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0d0f16] via-transparent to-[#0d0f16] opacity-50 pointer-events-none" />

            <Link href="/"
                className="fixed top-5 left-5 z-50 flex items-center gap-2 px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-bold bg-white/5 border border-white/8 text-white/40 hover:text-white/80 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                ← Portal
            </Link>

            {/* Sem elemento → instrui a fazer o quiz */}
            {!userElement && !loading && <NoElementScreen />}

            {/* Tem subbending → mostra o Grimório da Essência */}
            {userElement && existingSubbending && (
                <GrimorioScreen subbendingId={existingSubbending} />
            )}

            {/* Tem elemento mas sem subbending → quiz */}
            {userElement && !existingSubbending && (
                <AnimatePresence mode="wait">
                    {quizState === 'pending' && (
                        <motion.div key="start" exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
                            <StartScreen element={currentElement} onStart={startQuiz} />
                        </motion.div>
                    )}
                    {quizState === 'active' && (
                        <motion.div key="quiz" exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="min-h-screen pt-20">
                            <QuestionScreen element={currentElement} />
                        </motion.div>
                    )}
                    {quizState === 'finished' && (
                        <motion.div key="result" exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
                            <ResultScreen element={currentElement} />
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </main>
    );
}
