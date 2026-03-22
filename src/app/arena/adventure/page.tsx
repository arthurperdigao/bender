/**
 * src/app/arena/adventure/page.tsx
 *
 * "A Jornada do Destino" — Experiência Narrativa Imersiva.
 * Uma aventura interativa no universo Avatar.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAdventureStore } from '@/lib/stores/useAdventureStore';
import { adventureData, AdventureScene } from '@/lib/data/adventureData';

// ═══════════════════════════════════════════════════════════
// COMPONENTES AUXILIARES
// ═══════════════════════════════════════════════════════════

import Image from 'next/image';

const Background = ({ src }: { src: string }) => (
    <motion.div
        key={src}
        className="fixed inset-0 z-0"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
    >
        <Image src={src} alt="Cenário" fill className="object-cover brightness-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0f16]/40 to-[#0d0f16]" />
    </motion.div>
);

interface AdventureChoice {
    text: string;
    nextSceneId: string;
    elementPoints?: Record<string, number>;
}

const DialogueBox = ({ text, choices, onChoice }: { text: string; choices: AdventureChoice[]; onChoice: (choice: AdventureChoice) => void }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        let i = 0;
        setDisplayedText('');
        setComplete(false);
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text.charAt(i));
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                setComplete(true);
            }
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return (
        <motion.div
            className="relative z-10 w-full max-w-4xl bg-[#161a25]/80 backdrop-blur-md border border-white/10 rounded-xl p-8 md:p-12 shadow-2xl overflow-hidden mt-auto mb-12"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
        >
            {/* Decoração Pergaminho */}
            <div className="absolute top-0 left-0 w-2 h-full bg-[#dcb670]/20" />
            <div className="absolute top-0 right-0 w-2 h-full bg-[#dcb670]/20" />

            <p className="text-lg md:text-xl leading-relaxed text-gray-200 font-lora mb-8 italic">
                &ldquo;{displayedText}&rdquo;
            </p>

            {complete && (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {choices.map((choice, i) => (
                        <button
                            key={i}
                            onClick={() => onChoice(choice)}
                            className="px-6 py-4 text-left rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-[#dcb670] hover:border-[#dcb670]/40 hover:bg-white/10 transition-all duration-300 group flex items-center gap-3"
                        >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">✦</span>
                            {choice.text}
                        </button>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

// ═══════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function AdventurePage() {
    const { currentSceneId, setScene, addPoints, resetAdventure } = useAdventureStore();
    const scene: AdventureScene = adventureData[currentSceneId];

    useEffect(() => {
        // Garantir que começamos do início ao montar para evitar estados quebrados
        resetAdventure();
    }, []);

    useEffect(() => {
        if (currentSceneId === 'exit') {
            window.location.href = '/';
        }
    }, [currentSceneId]);

    if (!scene) return null;

    const handleChoice = (choice: AdventureChoice) => {
        if (choice.nextSceneId === 'exit') {
            window.location.href = '/';
            return;
        }
        if (choice.elementPoints) {
            addPoints(choice.elementPoints);
        }
        setScene(choice.nextSceneId);
    };

    return (
        <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 bg-[#000]">
            <AnimatePresence mode="wait">
                <Background key={scene.background} src={scene.background} />
            </AnimatePresence>

            {/* Botão de retorno discreto */}
            <Link
                href="/"
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-bold
          bg-[#161a25]/60 border border-white/5 text-[#dcb670]/80 shadow-lg backdrop-blur-md
          hover:text-[#dcb670] hover:bg-[#242a3c]/80 hover:border-[#dcb670]/30 hover:scale-105
          transition-all duration-300"
            >
                ← Abandonar Jornada
            </Link>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSceneId}
                    className="w-full flex flex-col items-center h-full flex-1 pt-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Personagem (se houver e não for a tela final) */}
                    {scene.character && currentSceneId !== 'end_demo' && (
                        <motion.div
                            key={scene.character.name}
                            className={`absolute bottom-[30%] z-10 w-64 md:w-[400px] flex flex-col items-center pointer-events-none`}
                            initial={{ x: 50, opacity: 0, scale: 0.9 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            <div className="px-4 py-1.5 bg-[#dcb670] text-[#161a25] font-black uppercase tracking-[0.2em] text-[10px] rounded-full mb-4 shadow-xl border border-white/20">
                                {scene.character.name}
                            </div>

                            {scene.character.image ? (
                                <div className="relative group">
                                    <motion.div
                                        className="absolute inset-0 bg-[#dcb670]/20 blur-3xl rounded-full"
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                    />
                                    <Image
                                        src={scene.character.image}
                                        alt={scene.character.name}
                                        width={400}
                                        height={600}
                                        className="relative w-full h-auto drop-shadow-[0_0_30px_rgba(220,182,112,0.3)]"
                                        style={{
                                            maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                                            WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-80 bg-gradient-to-t from-white/10 to-transparent rounded-t-full border-t border-white/20 flex items-center justify-center text-4xl">
                                    ✨
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* TELA DE "EM BREVE" COM IMPACTO */}
                    {currentSceneId === 'end_demo' ? (
                        <motion.div 
                            className="relative z-20 flex flex-col items-center justify-center text-center p-8 mt-12 mb-auto"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                        >
                            <motion.div 
                                className="mb-6 px-6 py-2 rounded-full border border-[#dcb670]/30 bg-[#dcb670]/10 text-[#dcb670] text-[10px] font-bold uppercase tracking-[0.4em]"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                Demo Concluída
                            </motion.div>
                            
                            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-[0.2em] mb-4 drop-shadow-2xl" style={{ fontFamily: 'var(--font-cinzel)' }}>
                                Em Breve
                            </h2>
                            <h3 className="text-xl md:text-2xl font-bold text-[#dcb670] uppercase tracking-[0.5em] mb-12 opacity-80" style={{ fontFamily: 'var(--font-cinzel)' }}>
                                Versão Completa
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                                <button
                                    onClick={() => resetAdventure()}
                                    className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all rounded-xl"
                                >
                                    Refazer Jornada
                                </button>
                                <Link href="/" className="w-full">
                                    <button className="w-full px-10 py-5 bg-[#dcb670] text-black font-black text-xs uppercase tracking-widest hover:bg-white transition-all rounded-xl shadow-[0_0_30px_rgba(220,182,112,0.3)]">
                                        Voltar ao Portal
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <DialogueBox
                            text={scene.text}
                            choices={scene.choices}
                            onChoice={handleChoice}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Efeito Atmosférico (Partículas sutis) */}
            <div className="fixed inset-0 pointer-events-none z-[1] opacity-30">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-20" />
            </div>
        </main>
    );
}
