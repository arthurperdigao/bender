/**
 * src/app/arena/trivia/page.tsx
 *
 * Trivia Avatar — Quiz de conhecimento do universo Avatar
 * Com seleção de dificuldade, feedback visual e tela de resultados.
 */
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { allTriviaQuestions } from '@/lib/types/triviaQuestions';
import { TriviaQuestion } from '@/lib/types/trivia';
import { saveTriviaScore } from '@/lib/actions/user';

type Difficulty = 'easy' | 'medium' | 'hard';
type GamePhase = 'menu' | 'playing' | 'feedback' | 'results';

const DIFFICULTY_INFO: Record<Difficulty, { label: string; icon: string; color: string; desc: string }> = {
    easy: { label: 'Fácil', icon: '🌱', color: '#22c55e', desc: 'Para novatos no mundo Avatar' },
    medium: { label: 'Médio', icon: '⚔️', color: '#fbbf24', desc: 'Para fãs dedicados' },
    hard: { label: 'Difícil', icon: '🔥', color: '#ef4444', desc: 'Para mestres do lore' },
};

// ═══════════════════════════════════════
// PARTÍCULAS
// ═══════════════════════════════════════
const Particles = ({ color = '#a792ff' }: { color?: string }) => {
    const parts = useMemo(() =>
        Array.from({ length: 15 }, (_, i) => ({
            id: i, x: Math.random() * 100, y: Math.random() * 100,
            size: Math.random() * 3 + 1, dur: Math.random() * 12 + 8,
            delay: Math.random() * 4, opacity: Math.random() * 0.2 + 0.05,
        })), []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {parts.map(p => (
                <motion.div key={p.id} className="absolute rounded-full"
                    style={{ left: `${p.x}%`, width: p.size, height: p.size, backgroundColor: color, opacity: p.opacity, boxShadow: `0 0 ${p.size * 3}px ${color}` }}
                    animate={{ y: [`${p.y}vh`, `${p.y - 20}vh`, `${p.y}vh`], opacity: [p.opacity, p.opacity * 2, p.opacity] }}
                    transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' as const }}
                />
            ))}
        </div>
    );
};

// ═══════════════════════════════════════
// TELA DE MENU
// ═══════════════════════════════════════
const MenuScreen = ({ onSelect }: { onSelect: (d: Difficulty) => void }) => (
    <motion.div className="flex flex-col items-center justify-center text-center relative z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

        <motion.div className="text-7xl mb-6"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 80, delay: 0.2 }}>
            📜
        </motion.div>

        <motion.h1 className="mb-3 text-4xl md:text-5xl font-bold"
            style={{ background: 'linear-gradient(135deg, #a792ff 0%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(167,146,255,0.3))' }}
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            Trivia Avatar
        </motion.h1>

        <motion.p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-40"
            initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.6 }}>
            Teste seu conhecimento
        </motion.p>

        <motion.p className="mb-10 max-w-sm text-sm italic opacity-50"
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.8 }}>
            &ldquo;O conhecimento verdadeiro é saber a extensão da própria ignorância.&rdquo;
        </motion.p>

        <div className="flex flex-col gap-3 w-full max-w-sm mb-10">
            {(Object.entries(DIFFICULTY_INFO) as [Difficulty, typeof DIFFICULTY_INFO.easy][]).map(([key, info], i) => (
                <motion.button key={key}
                    className="group relative flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    onClick={() => onSelect(key)}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.1 }}
                    whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ boxShadow: `inset 0 0 20px ${info.color}10, 0 0 15px ${info.color}08` }} />
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/10 group-hover:transition-colors duration-500"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                        <div className="text-sm font-semibold" style={{ color: info.color }}>{info.label}</div>
                        <div className="text-xs opacity-40">{info.desc}</div>
                    </div>
                </motion.button>
            ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 1.5 }}>
            <Link href="/" className="text-xs opacity-60 hover:opacity-100 transition-opacity">← Voltar ao Portal</Link>
        </motion.div>
    </motion.div>
);

// ═══════════════════════════════════════
// TELA DO JOGO
// ═══════════════════════════════════════
const GameScreen = ({
    questions, difficulty, onFinish,
}: {
    questions: TriviaQuestion[]; difficulty: Difficulty;
    onFinish: (score: number, answers: boolean[]) => void;
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answerHistory, setAnswerHistory] = useState<boolean[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const question = questions[currentIndex];
    const diffInfo = DIFFICULTY_INFO[difficulty];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleAnswer = useCallback((index: number) => {
        if (showFeedback) return;

        setSelectedAnswer(index);
        setShowFeedback(true);
        const isCorrect = index === question.correctAnswerIndex;

        const newScore = isCorrect ? score + 1 : score;
        const newHistory = [...answerHistory, isCorrect];

        setTimeout(() => {
            const nextIndex = currentIndex + 1;
            if (nextIndex >= questions.length) {
                onFinish(newScore, newHistory);
            } else {
                setCurrentIndex(nextIndex);
                setScore(newScore);
                setAnswerHistory(newHistory);
                setSelectedAnswer(null);
                setShowFeedback(false);
            }
        }, 1500);
    }, [showFeedback, question, score, answerHistory, currentIndex, questions, onFinish]);

    return (
        <motion.div className="flex flex-col items-center justify-center relative z-10 w-full max-w-lg mx-auto px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Progresso */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <div className="h-[2px]" style={{
                    width: `${progress}%`, background: diffInfo.color,
                    boxShadow: `0 0 10px ${diffInfo.color}50`, transition: 'width 0.3s',
                }} />
            </div>

            <div className="fixed top-6 right-6 z-50 text-right">
                <div className="text-xs opacity-40">Pontuação</div>
                <div className="text-xl font-bold" style={{ color: diffInfo.color }}>{score}/{questions.length}</div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={currentIndex}
                    className="flex flex-col items-center w-full"
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}>

                    {/* Número da pergunta */}
                    <div className="mb-2 text-xs uppercase tracking-[0.2em] opacity-30">
                        Pergunta {currentIndex + 1} de {questions.length}
                    </div>

                    {/* Pergunta */}
                    <h2 className="mb-8 text-center text-xl md:text-2xl font-medium leading-relaxed">
                        {question.question}
                    </h2>

                    {/* Opções */}
                    <div className="w-full space-y-3">
                        {question.options.map((option, i) => {
                            const isSelected = selectedAnswer === i;
                            const isCorrect = i === question.correctAnswerIndex;
                            const showResult = showFeedback;

                            let borderColor = 'rgba(255,255,255,0.06)';
                            let bgColor = 'rgba(255,255,255,0.03)';
                            let textColor = 'rgba(255,255,255,0.8)';

                            if (showResult) {
                                if (isCorrect) {
                                    borderColor = '#22c55e60';
                                    bgColor = 'rgba(34,197,94,0.1)';
                                    textColor = '#86efac';
                                } else if (isSelected && !isCorrect) {
                                    borderColor = '#ef444460';
                                    bgColor = 'rgba(239,68,68,0.1)';
                                    textColor = '#fca5a5';
                                } else {
                                    textColor = 'rgba(255,255,255,0.3)';
                                }
                            }

                            return (
                                <motion.button key={i}
                                    className="group relative w-full p-4 rounded-xl text-left text-base transition-all duration-300"
                                    style={{ background: bgColor, border: `1px solid ${borderColor}`, color: textColor }}
                                    onClick={() => handleAnswer(i)}
                                    disabled={showFeedback}
                                    whileHover={!showFeedback ? { x: 4 } : {}}
                                    whileTap={!showFeedback ? { scale: 0.98 } : {}}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}>
                                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/10 group-hover:bg-white/20 transition-colors duration-300"
                                        style={showResult && isCorrect ? { backgroundColor: '#22c55e' } : {}} />
                                    <span className="pl-3">{option}</span>
                                    {showResult && isCorrect && <span className="absolute right-4 top-1/2 -translate-y-1/2">✓</span>}
                                    {showResult && isSelected && !isCorrect && <span className="absolute right-4 top-1/2 -translate-y-1/2">✗</span>}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

// ═══════════════════════════════════════
// TELA DE RESULTADOS
// ═══════════════════════════════════════
const ResultsScreen = ({
    score, total, difficulty, onRestart, onMenu, scoreSaved,
}: {
    score: number; total: number; difficulty: Difficulty;
    onRestart: () => void; onMenu: () => void; scoreSaved: boolean;
}) => {
    const percentage = Math.round((score / total) * 100);
    const diffInfo = DIFFICULTY_INFO[difficulty];

    const getRank = () => {
        if (percentage === 100) return { title: 'Mestre do Lore!', emoji: '👑', quote: 'Wan Shi Tong ficaria orgulhoso.' };
        if (percentage >= 80) return { title: 'Membro do Lótus Branco', emoji: '🪷', quote: '"O verdadeiro poder vem do conhecimento."' };
        if (percentage >= 60) return { title: 'Visitante da Biblioteca', emoji: '📚', quote: 'Bom conhecimento, continue estudando!' };
        if (percentage >= 40) return { title: 'Aprendiz Curioso', emoji: '🌱', quote: 'Há muito mais para descobrir.' };
        return { title: 'Precisa assistir de novo!', emoji: '📺', quote: '"Meu Cactus Juice! É a coisa mais gostosa!"' };
    };

    const rank = getRank();

    return (
        <motion.div className="flex flex-col items-center justify-center text-center relative z-10 max-w-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            <motion.div className="text-7xl mb-4"
                initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 80, delay: 0.3 }}>
                {rank.emoji}
            </motion.div>

            <motion.h2 className="text-3xl font-bold mb-2" style={{ color: diffInfo.color }}
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                {rank.title}
            </motion.h2>

            <motion.p className="text-sm italic opacity-50 mb-8"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.7 }}>
                {rank.quote}
            </motion.p>

            <motion.div className="flex items-center gap-6 mb-8"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <div className="text-center">
                    <div className="text-4xl font-bold" style={{ color: diffInfo.color }}>{score}</div>
                    <div className="text-xs opacity-40">de {total}</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="text-center">
                    <div className="text-4xl font-bold" style={{ color: percentage >= 70 ? '#22c55e' : percentage >= 40 ? '#fbbf24' : '#ef4444' }}>{percentage}%</div>
                    <div className="text-xs opacity-40">acertos</div>
                </div>
            </motion.div>

            <motion.div className="flex gap-3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                <button onClick={onRestart} className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ border: `1px solid ${diffInfo.color}50`, color: diffInfo.color, background: `${diffInfo.color}10` }}>
                    Jogar Novamente
                </button>
                <button onClick={onMenu} className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-white/40 hover:text-white/60 transition-all">
                    Trocar Dificuldade
                </button>
            </motion.div>

            <motion.div className="mt-8 flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 1.5 }}>
                {scoreSaved && (
                    <span className="text-xs text-green-400 opacity-80">✓ Pontuação salva no seu perfil! <Link href="/perfil" className="underline">Ver perfil</Link></span>
                )}
                <Link href="/" className="text-xs opacity-60 hover:opacity-100 transition-opacity">← Voltar ao Portal</Link>
            </motion.div>
        </motion.div>
    );
};

// ═══════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════
export default function TriviaPage() {
    const [phase, setPhase] = useState<GamePhase>('menu');
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
    const [results, setResults] = useState({ score: 0, total: 0 });

    const handleSelect = useCallback((d: Difficulty) => {
        setDifficulty(d);
        const filtered = allTriviaQuestions.filter(q => q.difficulty === d);
        // Embaralha e pega 10 de 16 (rejogabilidade)
        const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
        setQuestions(shuffled);
        setPhase('playing');
    }, []);

    const handleFinish = useCallback((score: number) => {
        setResults({ score, total: questions.length });
        setPhase('results');
        // Salva a pontuação no banco de dados
        saveTriviaScore(score).catch(() => {
            // Falha silenciosa — usuário não logado ou erro de rede
        });
    }, [questions]);

    const diffInfo = DIFFICULTY_INFO[difficulty];

    return (
        <main className="flex min-h-screen w-full items-center justify-center p-4 relative overflow-hidden"
            style={{ background: phase === 'menu' ? 'radial-gradient(ellipse at 50% 30%, #1a182d 0%, #0a0a14 100%)' : 'radial-gradient(ellipse at 50% 30%, #1a1520 0%, #0a0a14 100%)' }}>

            <Particles color={phase === 'menu' ? '#a792ff' : diffInfo.color} />

            {/* Botão Home flutuante */}
            <Link
                href="/"
                className="fixed top-5 left-5 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-xs
                  bg-white/[0.05] border border-white/[0.08] text-white/40
                  hover:text-white/80 hover:bg-white/[0.1] hover:border-white/[0.15]
                  transition-all duration-300 backdrop-blur-sm"
            >
                ← Início
            </Link>

            <AnimatePresence mode="wait">
                {phase === 'menu' && (
                    <motion.div key="menu" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                        <MenuScreen onSelect={handleSelect} />
                    </motion.div>
                )}
                {phase === 'playing' && (
                    <motion.div key={`game-${difficulty}`} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                        <GameScreen questions={questions} difficulty={difficulty}
                            onFinish={(score) => handleFinish(score)} />
                    </motion.div>
                )}
                {phase === 'results' && (
                    <motion.div key="results" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                        <ResultsScreen score={results.score} total={results.total} difficulty={difficulty}
                            scoreSaved={true}
                            onRestart={() => handleSelect(difficulty)} onMenu={() => setPhase('menu')} />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
