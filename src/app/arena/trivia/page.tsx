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
import { saveTriviaScore, getUserStats } from '@/lib/actions/user';

type Difficulty = 'easy' | 'medium' | 'hard';
type GamePhase = 'menu' | 'playing' | 'feedback' | 'results';

const DIFFICULTY_INFO: Record<Difficulty, { label: string; icon: string; color: string; desc: string }> = {
    easy: { label: 'Fácil', icon: '🌱', color: '#22c55e', desc: 'Para novatos no mundo Avatar' },
    medium: { label: 'Médio', icon: '⚔️', color: '#fbbf24', desc: 'Para fãs dedicados' },
    hard: { label: 'Difícil', icon: '🔥', color: '#ef4444', desc: 'Para mestres do lore' },
};

const ELEMENT_THEMES: Record<string, { bgTop: string; bgBottom: string; accent: string; icon: string; title: string; xpName: string; quote: string }> = {
    water: { bgTop: '#0a192f', bgBottom: '#020c1b', accent: '#5a9ec4', icon: '🌊', title: 'Oásis Espiritual', xpName: 'Fluxo de Chi', quote: 'A água é o elemento da mudança. As pessoas da Tribo da Água são capazes de se adaptar a muitas coisas.' },
    earth: { bgTop: '#1a2e1a', bgBottom: '#0a140a', accent: '#8fa04a', icon: '⛰️', title: 'Cavernas de Cristal', xpName: 'Resiliência', quote: 'A terra é o elemento da substância. As pessoas do Reino da Terra são diversas e fortes, persistentes e duradouras.' },
    fire: { bgTop: '#3a0f0f', bgBottom: '#1a0505', accent: '#cc4a2e', icon: '🔥', title: 'Guerreiros do Sol', xpName: 'Fogo Interior', quote: 'O fogo é o elemento do poder. As pessoas da Nação do Fogo têm o desejo e a vontade, e a energia para alcançar o que desejam.' },
    air: { bgTop: '#2f271a', bgBottom: '#1a140a', accent: '#daa54e', icon: '🌪️', title: 'Templo do Ar', xpName: 'Liberdade', quote: 'O ar é o elemento da liberdade. O Povo do Ar se desprendia dos problemas mundanos e encontrou paz e liberdade.' },
    none: { bgTop: '#1a182d', bgBottom: '#0a0a14', accent: '#a792ff', icon: '🦉', title: 'Biblioteca Ancestral', xpName: 'Favor de Wan Shi Tong', quote: 'O conhecimento verdadeiro é saber a extensão da própria ignorância.' },
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
const MenuScreen = ({ onSelect, theme }: { onSelect: (d: Difficulty) => void; theme: typeof ELEMENT_THEMES['none'] }) => (
    <motion.div className="flex flex-col items-center justify-center text-center relative z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

        <motion.div className="text-7xl mb-6 drop-shadow-2xl"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 80, delay: 0.2 }}>
            {theme.icon}
        </motion.div>

        <motion.h1 className="mb-3 text-4xl md:text-5xl font-bold font-serif uppercase tracking-widest"
            style={{ color: theme.accent, filter: `drop-shadow(0 0 20px ${theme.accent}50)` }}
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            {theme.title}
        </motion.h1>

        <motion.p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-60 text-white"
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.6 }}>
            A Sabedoria do seu Elemento
        </motion.p>

        <motion.p className="mb-10 max-w-md text-sm italic opacity-50 px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.8 }}>
            &ldquo;{theme.quote}&rdquo;
        </motion.p>

        <div className="flex flex-col gap-3 w-full max-w-sm mb-10">
            {(Object.entries(DIFFICULTY_INFO) as [Difficulty, typeof DIFFICULTY_INFO.easy][]).map(([key, info], i) => (
                <motion.button key={key}
                    className="group relative flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 backdrop-blur-md"
                    style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${theme.accent}30` }}
                    onClick={() => onSelect(key)}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.1 }}
                    whileHover={{ x: 4, background: 'rgba(0,0,0,0.6)', borderColor: `${theme.accent}80` }} whileTap={{ scale: 0.98 }}>
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ boxShadow: `inset 0 0 20px ${info.color}20, 0 0 15px ${theme.accent}20` }} />
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] opacity-50 group-hover:opacity-100 transition-all duration-500"
                        style={{ backgroundColor: theme.accent }} />
                    <span className="text-2xl drop-shadow-md">{info.icon}</span>
                    <div>
                        <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: info.color }}>{info.label}</div>
                        <div className="text-xs text-gray-400">{info.desc}</div>
                    </div>
                </motion.button>
            ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.5 }}>
            <Link href="/" className="text-xs text-white hover:text-white hover:opacity-100 transition-opacity uppercase tracking-widest">← Voltar ao Portal</Link>
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
    score, total, onRestart, onMenu, scoreSaved, theme
}: {
    score: number; total: number;
    onRestart: () => void; onMenu: () => void; scoreSaved: boolean; theme: typeof ELEMENT_THEMES['none'];
}) => {
    const percentage = Math.round((score / total) * 100);

    const getRank = () => {
        if (percentage === 100) return { title: 'Lenda Viva', emoji: '🌟', quote: 'A profunda conexão espiritual brilha em você.' };
        if (percentage >= 80) return { title: 'Sábio da Tribo', emoji: theme.icon, quote: '"O verdadeiro poder vem da compreensão mútua."' };
        if (percentage >= 60) return { title: 'Estudante Focado', emoji: '📖', quote: 'Sua jornada está indo muito bem.' };
        if (percentage >= 40) return { title: 'Aprendiz Curioso', emoji: '🌱', quote: 'Há muito para descobrir nos quatro cantos do mundo.' };
        return { title: 'Ainda em Treinamento', emoji: '🧘', quote: '"É hora de você olhar para dentro e começar a fazer as grandes perguntas!"' };
    };

    const rank = getRank();

    return (
        <motion.div className="flex flex-col items-center justify-center text-center relative z-10 max-w-md backdrop-blur-xl bg-black/40 p-10 rounded-3xl border"
            style={{ borderColor: `${theme.accent}30`, boxShadow: `0 20px 50px -20px ${theme.accent}20` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            <motion.div className="text-7xl mb-4 drop-shadow-xl"
                initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 80, delay: 0.3 }}>
                {rank.emoji}
            </motion.div>

            <motion.h2 className="text-3xl font-bold mb-2 uppercase tracking-widest font-serif" style={{ color: theme.accent }}
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                {rank.title}
            </motion.h2>

            <motion.p className="text-sm italic opacity-70 mb-8 text-gray-300"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.7 }}>
                {rank.quote}
            </motion.p>

            <motion.div className="flex items-center gap-6 mb-8 bg-black/40 px-8 py-4 rounded-2xl border border-white/5"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <div className="text-center">
                    <div className="text-5xl font-black" style={{ color: theme.accent }}>{score}</div>
                    <div className="text-[10px] uppercase tracking-widest text-[#dcb670] mt-1">{theme.xpName}</div>
                </div>
                <div className="w-px h-16 bg-white/10" />
                <div className="text-center">
                    <div className="text-4xl font-bold" style={{ color: percentage >= 70 ? '#22c55e' : percentage >= 40 ? '#fbbf24' : '#ef4444' }}>{percentage}%</div>
                    <div className="text-xs opacity-50 uppercase tracking-widest mt-1 text-white">Domínio</div>
                </div>
            </motion.div>

            <motion.div className="flex gap-4 w-full"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                <button onClick={onRestart} className="flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg transition-transform hover:-translate-y-1"
                    style={{ background: theme.accent, color: '#000' }}>
                    Tentar Novamente
                </button>
                <button onClick={onMenu} className="flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-widest border border-white/10 text-gray-300 hover:bg-white/5 transition-colors">
                    Voltar ao Templo
                </button>
            </motion.div>

            <motion.div className="mt-8 flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.5 }}>
                {scoreSaved && (
                    <span className="text-xs text-[#8fa04a] font-bold tracking-wider">✓ {theme.xpName} ABSORVIDO NO SEU ESPÍRITO</span>
                )}
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
    const [userElement, setUserElement] = useState<string>('none');

    React.useEffect(() => {
        getUserStats().then(stats => {
            if (stats?.elementoNato && ELEMENT_THEMES[stats.elementoNato]) {
                setUserElement(stats.elementoNato);
            }
        }).catch(err => console.error(err));
    }, []);

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
    const theme = ELEMENT_THEMES[userElement] || ELEMENT_THEMES['none'];

    return (
        <main className="flex min-h-screen w-full items-center justify-center p-4 relative overflow-hidden transition-colors duration-1000"
            style={{ background: phase === 'menu' ? `radial-gradient(ellipse at 50% 30%, ${theme.bgTop} 0%, ${theme.bgBottom} 100%)` : `radial-gradient(ellipse at 50% 30%, #1a1520 0%, #0a0a14 100%)` }}>

            <Particles color={phase === 'menu' ? theme.accent : diffInfo.color} />

            {/* Navegação Flutuante no Topo */}
            <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-start pointer-events-none">
                <Link href="/" className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-black/40 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md">
                    ← Portal
                </Link>
                {phase === 'menu' && (
                    <div className="flex flex-col items-end gap-1">
                        <div className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-black/40 border border-white/10 backdrop-blur-md" style={{ color: theme.accent }}>
                            {theme.icon} Conectado: {theme.title}
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {phase === 'menu' && (
                    <motion.div key="menu" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                        <MenuScreen onSelect={handleSelect} theme={theme} />
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
                        <ResultsScreen score={results.score} total={results.total}
                            scoreSaved={Boolean(results.score > 0)}
                            theme={theme}
                            onRestart={() => handleSelect(difficulty)} onMenu={() => setPhase('menu')} />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
