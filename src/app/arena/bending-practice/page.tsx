/**
 * src/app/arena/bending-practice/page.tsx
 *
 * Prática de Dobra — Jogo de Ritmo com identidade ÚNICA por elemento
 *
 * EASTER EGGS DE FÃ:
 * 🌊 Água: Lua de Yue brilha no fundo (quanto mais combo, mais cheia).
 *          Em combo 5+, acerto vira Dobra de Sangue (texto vermelho).
 *          Citações de Katara, Pakku, Hama.
 *          "+Push and Pull" nos acertos (referência a Tui e La).
 *
 * 🪨 Terra: "Sentido Sísmico" — ondas saem do chão a cada acerto (como Toph).
 *          Em combo 5+, fragmentos de METAL aparecem no alvo (Metalbending unlock).
 *          Citações de Toph, Bumi, Badgermoles.
 *          "EU SOU A MAIOR DOBRADORA DE TERRA DO MUNDO" se score alto.
 *
 * 🔥 Fogo: Acertos perfeitos piscam AZUL (referência à Azula).
 *          Em combo 5+, raios (Lightning) cruzam a tela.
 *          Cometa de Sozin: tela fica mais intensa conforme progresso.
 *          Citações de Iroh, Zuko, Azula, Jeong Jeong.
 *
 * 🌬️ Ar: As setas de tattoo dos Nômades do Ar brilham no fundo.
 *          Appa passa voando sutilmente na tela em combos altos.
 *          Guru Laghima quote: "Solte suas ligações terrenas".
 *          Em combo 5+, levitação (ícone flutua mais alto).
 */
'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ═══════════════════════════════════════
// TIPOS E CONSTANTES
// ═══════════════════════════════════════
type Element = 'water' | 'earth' | 'fire' | 'air';
type HitResult = 'perfect' | 'good' | 'miss' | null;
type GamePhase = 'menu' | 'playing' | 'results';

interface Beat {
  id: number;
  targetTime: number;
  hit: HitResult;
}

interface ElementTheme {
  name: string;
  icon: string;
  primary: string;
  secondary: string;
  accent: string;
  bgGradient: string;
  styleName: string;
  move: string;
  hitWord: string;
  perfectWord: string;
  // Fan-specific
  quotes: string[];          // Citações icônicas que aparecem durante o jogo
  comboUnlock: string;       // O que desbloqueia em combo alto
  comboUnlockName: string;
  masterTitle: string;       // Título se score perfeito
  loreHint: string;          // Dica de lore no menu
}

const ELEMENTS: Record<Element, ElementTheme> = {
  water: {
    name: 'Água', icon: '🌊', primary: '#38bdf8', secondary: '#0c4a6e', accent: '#7dd3fc',
    bgGradient: 'radial-gradient(ellipse at 50% 80%, #0c2d48 0%, #030a15 60%, #000 100%)',
    styleName: 'Tai Chi Chuan',
    move: 'Fluxo da Maré', hitWord: 'Empurra!', perfectWord: '✨ Puxa!',
    quotes: [
      '"Água é o elemento da mudança." — Iroh',
      '"Eu não tive que fazer nada. A Lua me deu poder." — Katara',
      '"Existem dois peixes no Oásis... Tui e La. Empurra e Puxa." — Koh',
      '"Meu nome é Hama, e eu sou a última dobradora de água do Sul."',
      '"Meu primeiro mestre foi a lua." — Katara',
    ],
    comboUnlock: 'bloodbend', comboUnlockName: 'Dobra de Sangue',
    masterTitle: 'Mestre de Sangue', loreHint: 'A lua cheia guarda segredos...',
  },
  earth: {
    name: 'Terra', icon: '🪨', primary: '#22c55e', secondary: '#14532d', accent: '#86efac',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #1a2e0a 0%, #0a0f05 60%, #000 100%)',
    styleName: 'Hung Gar Kung Fu',
    move: 'Impacto Sísmico', hitWord: 'Firme!', perfectWord: '💎 Sismo!',
    quotes: [
      '"EU SOU A MAIOR DOBRADORA DE TERRA DO MUNDO!" — Toph',
      '"O verdadeiro segredo é ouvir e esperar." — Rei Bumi',
      '"Texugos-toupeira foram os primeiros dobradores." — Toph',
      '"Não é só força. É estar conectado à terra." — Sud',
      '"Qual das opções? Lutei contra você com a minha cara." — Toph',
    ],
    comboUnlock: 'metalbend', comboUnlockName: 'Dobra de Metal',
    masterTitle: 'Metalbender', loreHint: 'Toph inventou algo novo...',
  },
  fire: {
    name: 'Fogo', icon: '🔥', primary: '#f97316', secondary: '#7c2d12', accent: '#fdba74',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #2a1000 0%, #0f0500 60%, #000 100%)',
    styleName: 'Shaolin do Norte',
    move: 'Explosão Solar', hitWord: 'Chama!', perfectWord: '⚡ Relâmpago!',
    quotes: [
      '"No mundo dos dobradores de fogo, o mais forte governa." — Azula',
      '"Você precisa encontrar o verdadeiro significado do fogo." — Guerreiros do Sol',
      '"O fogo é vida, não apenas destruição." — Iroh',
      '"Meu pai me deu uma última chance." — Zuko',
      '"Quase perfeito. Quase não é bom o suficiente." — Azula',
    ],
    comboUnlock: 'lightning', comboUnlockName: 'Dobra de Relâmpago',
    masterTitle: 'Dragão do Oeste', loreHint: 'Azula dominava chama azul...',
  },
  air: {
    name: 'Ar', icon: '🌬️', primary: '#fbbf24', secondary: '#713f12', accent: '#fde68a',
    bgGradient: 'radial-gradient(ellipse at 50% 0%, #1a1400 0%, #0a0800 60%, #000 100%)',
    styleName: 'Ba Gua Zhang',
    move: 'Vórtex Espiral', hitWord: 'Brisa!', perfectWord: '🍃 Vórtex!',
    quotes: [
      '"Solte suas ligações terrenas. Entre no vazio." — Guru Laghima',
      '"Os Nômades do Ar destacavam o espírito." — Gyatso',
      '"Quando chegar a hora, você saberá." — Monge Gyatso',
      '"A chave da dobra de ar é a flexibilidade." — Tenzin',
      '"Instinto é uma mentira contada por um medroso." — Zaheer',
    ],
    comboUnlock: 'flight', comboUnlockName: 'Voo Sem Peso',
    masterTitle: 'Guru Laghima', loreHint: 'Zaheer alcançou o voo...',
  },
};

const TOTAL_BEATS = 12;
const BEAT_INTERVAL = 1200;
const PERFECT_WINDOW = 80;
const GOOD_WINDOW = 200;
const COMBO_THRESHOLD = 5; // Combo para ativar habilidade especial

function generateBeats(): Beat[] {
  return Array.from({ length: TOTAL_BEATS }, (_, i) => ({
    id: i, targetTime: 3000 + i * BEAT_INTERVAL, hit: null,
  }));
}

// ═══════════════════════════════════════════════════
// 🌊 ÁGUA — Lua de Yue (cresce com combo) + Chuva
// ═══════════════════════════════════════════════════
const WaterAmbient = ({ combo, progress }: { combo: number; progress: number }) => {
  const moonPhase = Math.min(combo / 8, 1); // 0=crescente, 1=cheia
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Lua de Yue — cresce com combo */}
      <motion.div className="absolute"
        style={{
          right: '10%', top: '8%',
          width: 40 + moonPhase * 40, height: 40 + moonPhase * 40,
          borderRadius: '50%',
          background: `radial-gradient(circle at 40% 40%, #e0f0ff ${moonPhase * 100}%, rgba(200,220,255,0.1) 100%)`,
          boxShadow: `0 0 ${20 + moonPhase * 60}px rgba(200,220,255,${0.1 + moonPhase * 0.4}),
                      0 0 ${40 + moonPhase * 100}px rgba(120,180,255,${0.05 + moonPhase * 0.2})`,
          opacity: 0.3 + moonPhase * 0.7,
        }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      {/* Texto sutil "Yue" quando lua cheia */}
      {moonPhase >= 0.9 && (
        <motion.div className="absolute text-[10px] italic"
          style={{ right: '8%', top: `${16 + (moonPhase * 3)}%`, color: 'rgba(200,220,255,0.2)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.2 }}>
          Yue te observa...
        </motion.div>
      )}
      {/* Ondas de maré */}
      {[0, 1, 2, 3].map(i => (
        <motion.div key={i} className="absolute w-[200%] left-[-50%]"
          style={{
            bottom: `${i * 7}%`, height: '2px',
            background: `linear-gradient(90deg, transparent 0%, rgba(56,189,248,${0.06}) 30%, rgba(56,189,248,${0.12}) 50%, rgba(56,189,248,${0.06}) 70%, transparent 100%)`,
            filter: 'blur(1px)',
          }}
          animate={{ x: ['-20%', '20%', '-20%'] }}
          transition={{ duration: 5 + i * 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
        />
      ))}
      {/* Gotas — mais intensas conforme progresso */}
      {Array.from({ length: 6 + Math.floor(progress * 4) }, (_, i) => (
        <motion.div key={`drop-${i}`} className="absolute"
          style={{
            left: `${8 + i * 10}%`, width: 2, height: 8,
            background: `linear-gradient(to bottom, transparent, rgba(56,189,248,${0.3 + moonPhase * 0.3}))`,
          }}
          animate={{ y: ['-5vh', '105vh'], opacity: [0, 0.5, 0] }}
          transition={{ duration: 2.5 + Math.random() * 2, delay: i * 0.5, repeat: Infinity }}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════
// 🪨 TERRA — Sentido Sísmico (ondas do chão) + Rochas
// ═══════════════════════════════════════════════════
const EarthAmbient = ({ combo, lastHit }: { combo: number; lastHit: HitResult }) => {
  const showMetal = combo >= COMBO_THRESHOLD;
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Sentido Sísmico — ondas saem do chão a cada acerto */}
      <AnimatePresence>
        {lastHit && lastHit !== 'miss' && (
          <motion.div key={`seismic-${Date.now()}`} className="absolute bottom-0 left-0 right-0 flex justify-center"
            initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            {[0, 1, 2].map(i => (
              <motion.div key={i} className="absolute bottom-0"
                style={{
                  width: '100%', height: '4px',
                  background: `radial-gradient(ellipse at 50% 100%, ${showMetal ? 'rgba(190,190,190,0.5)' : 'rgba(34,197,94,0.4)'} 0%, transparent 60%)`,
                }}
                initial={{ scaleX: 0.1, opacity: 1, bottom: 0 }}
                animate={{ scaleX: 2, opacity: 0, bottom: `${(i + 1) * 8}%` }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pedras flutuantes */}
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div key={`rock-${i}`} className="absolute"
          style={{
            left: `${10 + i * 18}%`, bottom: `${5 + Math.random() * 12}%`,
            width: 6 + Math.random() * 8, height: 6 + Math.random() * 8,
            background: showMetal
              ? `linear-gradient(135deg, rgba(180,180,180,0.3), rgba(120,120,120,0.15))`
              : `rgba(34,197,94,${0.08 + Math.random() * 0.08})`,
            borderRadius: '2px', border: showMetal ? '1px solid rgba(200,200,200,0.2)' : 'none',
            transform: `rotate(${Math.random() * 45}deg)`,
          }}
          animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4 + Math.random() * 2, delay: i * 0.4, repeat: Infinity }}
        />
      ))}

      {/* Metal unlocked text */}
      {showMetal && (
        <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em]"
          style={{ color: 'rgba(200,200,200,0.3)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}>
          ⚙️ Dobra de Metal Ativada
        </motion.div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════
// 🔥 FOGO — Cometa de Sozin (tela fica mais intensa)
//           + Relâmpago em combo alto
// ═══════════════════════════════════════════════════
const FireAmbient = ({ combo, progress }: { combo: number; progress: number }) => {
  const cometIntensity = progress; // Quanto mais beats, mais intenso (como Cometa de Sozin)
  const showLightning = combo >= COMBO_THRESHOLD;
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Cometa de Sozin — brilho avermelhado cresce */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 0%, rgba(239,68,68,${cometIntensity * 0.08}) 0%, transparent 60%)`,
        transition: 'all 0.5s',
      }} />

      {/* Chamas */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div key={`flame-${i}`} className="absolute"
          style={{
            left: `${5 + i * 13}%`, bottom: '-2%',
            width: 18 + Math.random() * 16, height: 30 + Math.random() * 30 + cometIntensity * 20,
            background: `radial-gradient(ellipse at 50% 100%, rgba(249,115,22,${0.12 + cometIntensity * 0.08}) 0%, transparent 70%)`,
            borderRadius: '50% 50% 20% 20%', filter: 'blur(2px)',
          }}
          animate={{ scaleY: [1, 1.3, 0.9, 1.2, 1], opacity: [0.5, 0.8, 0.4, 0.7, 0.5] }}
          transition={{ duration: 1.2 + Math.random() * 0.5, repeat: Infinity }}
        />
      ))}

      {/* Faíscas */}
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div key={`spark-${i}`} className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`, bottom: '5%',
            width: 2, height: 2,
            backgroundColor: showLightning && Math.random() > 0.5 ? '#60a5fa' : '#f97316',
            boxShadow: `0 0 4px ${showLightning && Math.random() > 0.5 ? '#60a5fa' : '#f97316'}`,
          }}
          animate={{ y: [0, -(80 + Math.random() * 150)], x: [(Math.random() - 0.5) * 40], opacity: [0.7, 0] }}
          transition={{ duration: 1.5 + Math.random() * 1.5, delay: i * 0.25, repeat: Infinity }}
        />
      ))}

      {/* ⚡ Relâmpago — crack azul na tela em combo alto */}
      {showLightning && (
        <>
          <motion.div className="absolute" style={{
            left: `${30 + Math.random() * 40}%`, top: 0,
            width: '2px', height: '100%',
            background: 'linear-gradient(to bottom, rgba(96,165,250,0.4), transparent 30%, transparent 70%, rgba(96,165,250,0.2))',
            filter: 'blur(1px)',
          }}
            animate={{ opacity: [0, 0.6, 0], x: [-2, 2, -1] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 + Math.random() * 3 }}
          />
          <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em]"
            style={{ color: 'rgba(96,165,250,0.3)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}>
            ⚡ Dobra de Relâmpago
          </motion.div>
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════
// 🌬️ AR — Setas de tattoo brilhando + Appa voando
// ═══════════════════════════════════════════════════
const AirAmbient = ({ combo }: { combo: number }) => {
  const showFlight = combo >= COMBO_THRESHOLD;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Seta de tattoo dos Nômades do Ar — sutil no fundo */}
      <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: 0.03 + combo * 0.008 }}>
        <svg width="300" height="400" viewBox="0 0 100 140">
          <path d="M50 0 L50 100 M30 25 L50 0 L70 25"
            stroke={showFlight ? '#fbbf24' : 'rgba(251,191,36,0.5)'}
            strokeWidth="4" fill="none" strokeLinecap="round"
          />
          <circle cx="50" cy="115" r="12"
            stroke={showFlight ? '#fbbf24' : 'rgba(251,191,36,0.5)'}
            strokeWidth="3" fill="none"
          />
        </svg>
      </motion.div>

      {/* Espirais */}
      {[0, 1].map(i => (
        <motion.div key={i} className="absolute rounded-full"
          style={{
            left: `${20 + i * 50}%`, top: `${25 + i * 25}%`,
            width: 80 + i * 50, height: 80 + i * 50,
            border: `1px dashed rgba(251,191,36,${0.05})`,
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 15 + i * 5, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* Folhas 🍃 */}
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div key={`leaf-${i}`} className="absolute text-sm select-none"
          style={{ left: `${Math.random() * 100}%`, opacity: 0.12 }}
          animate={{
            y: ['-10vh', '110vh'],
            x: [0, Math.sin(i) * 60, Math.cos(i) * -40, 0],
            rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
          }}
          transition={{ duration: 8 + Math.random() * 6, delay: i * 1.2, repeat: Infinity }}>
          🍃
        </motion.div>
      ))}

      {/* 🦬 Appa passando — aparece em combo alto */}
      {showFlight && (
        <motion.div className="absolute text-3xl select-none"
          style={{ top: '15%', opacity: 0.15 }}
          animate={{ x: ['-10vw', '110vw'], y: [0, -20, 10, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity, repeatDelay: 8 }}>
          🦬
        </motion.div>
      )}

      {/* Guru Laghima reference */}
      {showFlight && (
        <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em]"
          style={{ color: 'rgba(251,191,36,0.3)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}>
          ☁️ Voo Sem Peso Alcançado
        </motion.div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════
// ALVOS CENTRAIS POR ELEMENTO
// ═══════════════════════════════════════

// 🌊 Água — Tui e La (Push and Pull)
const WaterTarget = ({ progress, size, combo }: { progress: number; size: number; combo: number }) => {
  const isBloodBend = combo >= COMBO_THRESHOLD;
  const ringColor = isBloodBend ? 'rgba(239,68,68,0.4)' : 'rgba(56,189,248,0.3)';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute inset-0 rounded-full"
          style={{ border: `${2 - i * 0.5}px solid ${ringColor}`, transform: `scale(${1 + i * 0.15})` }}
          animate={{ scale: [1 + i * 0.15, 1.05 + i * 0.15, 1 + i * 0.15] }}
          transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
        />
      ))}
      {progress > 0 && (
        <div className="absolute rounded-full"
          style={{
            inset: `${-(1 - progress) * 50}%`,
            border: `2px solid ${isBloodBend ? '#ef4444' : '#38bdf8'}`,
            boxShadow: `0 0 ${20 * progress}px ${isBloodBend ? 'rgba(239,68,68,0.5)' : 'rgba(56,189,248,0.5)'}`,
            opacity: 0.4 + progress * 0.6,
          }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div className="text-5xl select-none"
          animate={{ y: [0, -4, 0], rotate: isBloodBend ? [0, 5, -5, 0] : 0 }}
          transition={{ duration: 2, repeat: Infinity }}>
          {isBloodBend ? '🩸' : '💧'}
        </motion.div>
      </div>
    </div>
  );
};

// 🪨 Terra — Hexágono + Metal em combo alto
const EarthTarget = ({ progress, size, combo }: { progress: number; size: number; combo: number }) => {
  const isMetal = combo >= COMBO_THRESHOLD;
  const color = isMetal ? 'rgba(180,180,180,0.3)' : 'rgba(34,197,94,0.2)';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {[0, 1].map(i => (
        <motion.div key={i} className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: i === 0 ? 360 : -360 }}
          transition={{ duration: 20 + i * 10, repeat: Infinity, ease: 'linear' }}>
          <div style={{
            width: size - i * 20, height: size - i * 20,
            border: `2px solid ${color}`, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }} />
        </motion.div>
      ))}
      {progress > 0 && (
        <motion.div className="absolute"
          style={{
            inset: `${-(1 - progress) * 50}%`,
            border: `3px solid ${isMetal ? '#b0b0b0' : '#22c55e'}`,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            boxShadow: `0 0 ${25 * progress}px ${isMetal ? 'rgba(180,180,180,0.4)' : 'rgba(34,197,94,0.4)'}`,
            opacity: 0.3 + progress * 0.7,
          }}
          animate={progress > 0.85 ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.1, repeat: Infinity }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div className="text-5xl select-none"
          animate={progress > 0.8 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.15, repeat: Infinity }}>
          {isMetal ? '⚙️' : '💎'}
        </motion.div>
      </div>
    </div>
  );
};

// 🔥 Fogo — Acerto perfeito AZUL (Azula)
const FireTarget = ({ progress, size, combo }: { progress: number; size: number; combo: number }) => {
  const hasLightning = combo >= COMBO_THRESHOLD;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div className="absolute inset-0 rounded-full"
        style={{
          border: `2px solid ${hasLightning ? 'rgba(96,165,250,0.4)' : 'rgba(249,115,22,0.3)'}`,
          boxShadow: `inset 0 0 20px ${hasLightning ? 'rgba(96,165,250,0.1)' : 'rgba(249,115,22,0.1)'}`,
        }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      {progress > 0 && (
        <div className="absolute rounded-full"
          style={{
            inset: `${-(1 - progress) * 60}%`,
            background: `radial-gradient(circle, 
              ${hasLightning ? `rgba(96,165,250,${progress * 0.3})` : `rgba(249,115,22,${progress * 0.3})`} 0%, 
              transparent 70%)`,
            boxShadow: `0 0 ${30 * progress}px ${hasLightning ? 'rgba(96,165,250,0.4)' : 'rgba(249,115,22,0.4)'}`,
            filter: 'blur(2px)',
          }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div className="text-5xl select-none"
          animate={{ scale: [1, 1.15, 0.95, 1.1, 1], rotate: [0, 3, -3, 2, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}>
          {hasLightning ? '⚡' : '🔥'}
        </motion.div>
      </div>
    </div>
  );
};

// 🌬️ Ar — Espirais dashed + levitação em combo alto
const AirTarget = ({ progress, size, combo }: { progress: number; size: number; combo: number }) => {
  const isFlying = combo >= COMBO_THRESHOLD;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute inset-0 rounded-full"
          style={{
            border: `1px dashed rgba(251,191,36,${0.12 - i * 0.03})`,
            transform: `scale(${1 + i * 0.12})`,
          }}
          animate={{ rotate: (i % 2 === 0 ? 1 : -1) * 360 }}
          transition={{ duration: 6 + i * 3, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {progress > 0 && (
        <motion.div className="absolute rounded-full"
          style={{
            inset: `${-(1 - progress) * 50}%`,
            border: '1px dashed rgba(251,191,36,0.6)',
            boxShadow: `0 0 ${15 * progress}px rgba(251,191,36,${progress * 0.3})`,
            opacity: 0.3 + progress * 0.7,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div className="text-5xl select-none"
          animate={{
            rotate: [0, 360],
            y: isFlying ? [-10, -25, -10] : [0, -3, 0],
          }}
          transition={{ duration: isFlying ? 2 : 4, repeat: Infinity, ease: isFlying ? 'easeInOut' as const : 'linear' }}>
          {isFlying ? '☁️' : '🌀'}
        </motion.div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════
// HIT FEEDBACK — por elemento
// ═══════════════════════════════════════
const HitEffect = ({ result, element, combo }: { result: HitResult; element: Element; combo: number }) => {
  const theme = ELEMENTS[element];
  if (!result) return null;

  // Fan-specific hit words
  let word: string;
  let color: string;

  if (result === 'perfect') {
    // Fogo: Azula's blue fire reference on perfect
    if (element === 'fire' && combo >= COMBO_THRESHOLD) {
      word = '⚡ Raio Puro!';
      color = '#60a5fa'; // azul!
    } else if (element === 'water' && combo >= COMBO_THRESHOLD) {
      word = '🩸 Controle Total!';
      color = '#ef4444'; // red
    } else {
      word = theme.perfectWord;
      color = theme.primary;
    }
  } else if (result === 'good') {
    word = theme.hitWord;
    color = theme.accent;
  } else {
    word = element === 'earth' ? '"Essa nem a Toph erraria."' :
      element === 'fire' ? '"Quase não é bom o suficiente." — Azula' :
        element === 'water' ? '"A água escorregou..."' :
          '"O vento parou."';
    color = '#ef4444';
  }

  return (
    <motion.div className="text-center"
      initial={{ scale: result === 'perfect' ? 2 : 1.3, opacity: 0, y: -10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
      <div className="text-xl font-bold tracking-wider" style={{ color, textShadow: result !== 'miss' ? `0 0 20px ${color}` : 'none' }}>
        {word}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════
// CITAÇÃO ALEATÓRIA DURANTE O JOGO
// ═══════════════════════════════════════
const FloatingQuote = ({ element, triggerKey }: { element: Element; triggerKey: number }) => {
  const theme = ELEMENTS[element];
  const quote = useMemo(() => theme.quotes[triggerKey % theme.quotes.length], [theme, triggerKey]);

  if (triggerKey === 0 || triggerKey % 4 !== 0) return null; // Mostra a cada 4 acertos

  return (
    <motion.div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 max-w-sm text-center"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.25, y: 0 }}
      exit={{ opacity: 0 }} transition={{ duration: 1 }}>
      <div className="text-xs italic" style={{ color: theme.accent }}>{quote}</div>
    </motion.div>
  );
};

// ═══════════════════════════════════════
// TELA DE MENU
// ═══════════════════════════════════════
const MenuScreen = ({ onSelect }: { onSelect: (el: Element) => void }) => (
  <motion.div className="flex flex-col items-center justify-center text-center relative z-10"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

    <motion.h1 className="mb-3 text-4xl md:text-5xl font-bold"
      style={{ background: 'linear-gradient(135deg, #38bdf8, #f97316, #22c55e, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(56,189,248,0.3))' }}
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
      Prática de Dobra
    </motion.h1>

    <motion.p className="mb-10 text-sm italic opacity-40 max-w-xs"
      initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.6 }}>
      Cada elemento guarda segredos para os mais habilidosos...
    </motion.p>

    <div className="grid grid-cols-2 gap-4 mb-10 max-w-md">
      {(Object.entries(ELEMENTS) as [Element, ElementTheme][]).map(([key, el], i) => (
        <motion.button key={key}
          className="group relative p-5 rounded-xl text-center transition-all duration-300 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          onClick={() => onSelect(key)}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.1 }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ boxShadow: `inset 0 0 30px ${el.primary}20`, border: `1px solid ${el.primary}40` }} />
          <div className="text-3xl mb-2">{el.icon}</div>
          <div className="text-sm font-semibold" style={{ color: el.primary }}>{el.name}</div>
          <div className="text-[10px] opacity-25 mt-1">{el.styleName}</div>
          <div className="text-[9px] italic opacity-20 mt-2" style={{ color: el.accent }}>{el.loreHint}</div>
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
const GameScreen = ({ element, onFinish }: {
  element: Element;
  onFinish: (score: number, perfects: number, goods: number, misses: number, maxCombo: number) => void;
}) => {
  const theme = ELEMENTS[element];
  const [beats] = useState(generateBeats);
  const [currentBeatIndex, setCurrentBeatIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lastHit, setLastHit] = useState<HitResult>(null);
  const [hitKey, setHitKey] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [phase, setPhase] = useState<'countdown' | 'playing' | 'done'>('countdown');
  const [perfectCount, setPerfectCount] = useState(0);
  const startTimeRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) { setPhase('playing'); startTimeRef.current = performance.now(); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const loop = () => {
      const now = performance.now() - startTimeRef.current;
      setElapsed(now);
      const nextBeat = beats[currentBeatIndex];
      if (nextBeat && now > nextBeat.targetTime + GOOD_WINDOW + 100) {
        nextBeat.hit = 'miss'; setCurrentBeatIndex(i => i + 1); setCombo(0);
        setLastHit('miss'); setHitKey(k => k + 1);
      }
      if (currentBeatIndex >= beats.length) {
        setPhase('done');
        const p = beats.filter(b => b.hit === 'perfect').length;
        const g = beats.filter(b => b.hit === 'good').length;
        const m = beats.filter(b => b.hit === 'miss' || b.hit === null).length;
        onFinish(score, p, g, m, maxCombo);
        return;
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, currentBeatIndex, beats, onFinish, score, maxCombo]);

  const handleHit = useCallback(() => {
    if (phase !== 'playing') return;
    const now = performance.now() - startTimeRef.current;
    const beat = beats[currentBeatIndex];
    if (!beat) return;
    const diff = Math.abs(now - beat.targetTime);
    if (diff <= PERFECT_WINDOW) {
      beat.hit = 'perfect'; setScore(s => s + 100 * (1 + combo * 0.1));
      setCombo(c => { const nc = c + 1; setMaxCombo(m => Math.max(m, nc)); return nc; });
      setLastHit('perfect'); setPerfectCount(c => c + 1);
    } else if (diff <= GOOD_WINDOW) {
      beat.hit = 'good'; setScore(s => s + 50 * (1 + combo * 0.05));
      setCombo(c => { const nc = c + 1; setMaxCombo(m => Math.max(m, nc)); return nc; });
      setLastHit('good');
    } else {
      beat.hit = 'miss'; setCombo(0); setLastHit('miss');
    }
    setHitKey(k => k + 1); setCurrentBeatIndex(i => i + 1);
  }, [phase, beats, currentBeatIndex, combo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); handleHit(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleHit]);

  const currentBeat = beats[currentBeatIndex];
  const beatProgress = currentBeat
    ? Math.max(0, Math.min(1, 1 - (currentBeat.targetTime - elapsed) / 1500)) : 0;
  const gameProgress = currentBeatIndex / TOTAL_BEATS;

  // Render o ambient correto por elemento
  const renderAmbient = () => {
    switch (element) {
      case 'water': return <WaterAmbient combo={combo} progress={gameProgress} />;
      case 'earth': return <EarthAmbient combo={combo} lastHit={lastHit} />;
      case 'fire': return <FireAmbient combo={combo} progress={gameProgress} />;
      case 'air': return <AirAmbient combo={combo} />;
    }
  };

  // Render o target correto
  const renderTarget = () => {
    switch (element) {
      case 'water': return <WaterTarget progress={beatProgress} size={200} combo={combo} />;
      case 'earth': return <EarthTarget progress={beatProgress} size={200} combo={combo} />;
      case 'fire': return <FireTarget progress={beatProgress} size={200} combo={combo} />;
      case 'air': return <AirTarget progress={beatProgress} size={200} combo={combo} />;
    }
  };

  return (
    <motion.div className="flex flex-col items-center justify-center relative z-10 select-none"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {renderAmbient()}

      <AnimatePresence>
        {phase === 'countdown' && (
          <motion.div className="text-8xl font-bold" key={countdown}
            style={{ color: theme.primary, filter: `drop-shadow(0 0 30px ${theme.primary})` }}
            initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.5 }}>
            {countdown || 'Vai!'}
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 'playing' && (
        <>
          {/* HUD */}
          <div className="fixed top-6 left-20 z-50">
            <div className="text-[10px] uppercase tracking-widest opacity-30">{theme.move}</div>
            <div className="text-2xl font-bold" style={{ color: theme.primary }}>{Math.round(score)}</div>
          </div>
          <div className="fixed top-6 right-6 z-50 text-right">
            <div className="text-[10px] uppercase tracking-widest opacity-30">Combo</div>
            <div className="text-2xl font-bold" style={{ color: combo >= COMBO_THRESHOLD ? theme.primary : 'rgba(255,255,255,0.3)' }}>
              {combo}x
            </div>
            {combo >= COMBO_THRESHOLD && (
              <motion.div className="text-[9px] mt-1" style={{ color: theme.accent }}
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}>
                {theme.comboUnlockName}!
              </motion.div>
            )}
          </div>
          <div className="fixed top-0 left-0 right-0 z-50">
            <div className="h-[2px]" style={{
              width: `${gameProgress * 100}%`,
              background: combo >= COMBO_THRESHOLD
                ? (element === 'fire' ? '#60a5fa' : element === 'water' ? '#ef4444' : theme.primary)
                : theme.primary,
              boxShadow: `0 0 8px ${theme.primary}50`, transition: 'width 0.3s',
            }} />
          </div>

          <div onClick={handleHit} className="cursor-pointer">
            {renderTarget()}
          </div>

          <div className="h-16 mt-4 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <HitEffect key={hitKey} result={lastHit} element={element} combo={combo} />
            </AnimatePresence>
          </div>

          {/* Citação flutuante */}
          <AnimatePresence>
            <FloatingQuote element={element} triggerKey={perfectCount} />
          </AnimatePresence>

          <div className="mt-2 text-xs opacity-20 text-center">
            Clique ou <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50">Espaço</kbd> no ritmo
          </div>
        </>
      )}
    </motion.div>
  );
};

// ═══════════════════════════════════════
// RESULTADOS — Com títulos lore-specific
// ═══════════════════════════════════════
const ResultsScreen = ({ element, score, perfects, goods, misses, maxCombo, onRestart, onMenu }: {
  element: Element; score: number; perfects: number; goods: number; misses: number; maxCombo: number;
  onRestart: () => void; onMenu: () => void;
}) => {
  const theme = ELEMENTS[element];
  const total = perfects + goods + misses;
  const accuracy = total > 0 ? Math.round(((perfects + goods) / total) * 100) : 0;

  // Rank titles are lore-specific
  const getRank = () => {
    if (accuracy === 100) return { title: theme.masterTitle, emoji: '👑', desc: `Você dominou a ${theme.comboUnlockName}!` };
    const ranks: Record<Element, { high: string; mid: string; low: string }> = {
      water: { high: 'Mestre Pakku reconheceria você', mid: 'Katara no início do Livro 2', low: 'Sokka tentando dobrar' },
      earth: { high: 'Digno de Zaofu', mid: 'Guarda do Dai Li', low: 'Carvão de Rocha caindo na cabeça' },
      fire: { high: 'Guerreiro do Sol', mid: 'Cadete da Nação do Fogo', low: 'Zhao perdendo o controle' },
      air: { high: 'Nômade Mestre com Tatuagens', mid: 'Acólito do Ar devoto', low: 'Momo tentando dobrar' },
    };
    const r = ranks[element];
    if (accuracy >= 80) return { title: r.high, emoji: '⭐', desc: `Combo máximo: ${maxCombo}x` };
    if (accuracy >= 50) return { title: r.mid, emoji: '🌱', desc: 'Continue praticando!' };
    return { title: r.low, emoji: '😅', desc: 'A jornada é longa, jovem dobrador.' };
  };
  const rank = getRank();

  return (
    <motion.div className="flex flex-col items-center justify-center text-center relative z-10 max-w-md"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="text-6xl mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}>{rank.emoji}</motion.div>
      <motion.h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: theme.primary }}
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>{rank.title}</motion.h2>
      <motion.p className="text-sm opacity-40 mb-1" initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
        transition={{ delay: 0.7 }}>{rank.desc}</motion.p>
      <motion.p className="text-xs italic opacity-25 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 0.25 }}
        transition={{ delay: 0.9 }}>Dobra de {theme.name} — {theme.styleName}</motion.p>

      <motion.div className="w-full grid grid-cols-3 gap-3 mb-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        {[
          { label: 'Pontos', value: Math.round(score), color: theme.primary },
          { label: 'Precisão', value: `${accuracy}%`, color: accuracy >= 70 ? '#22c55e' : '#fbbf24' },
          { label: 'Max Combo', value: `${maxCombo}x`, color: maxCombo >= COMBO_THRESHOLD ? theme.primary : 'rgba(255,255,255,0.5)' },
          { label: '✨ Perfeitos', value: perfects, color: theme.primary },
          { label: '👍 Bons', value: goods, color: theme.accent },
          { label: '❌ Erros', value: misses, color: '#ef4444' },
        ].map((item, i) => (
          <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-[10px] opacity-40">{item.label}</div>
            <div className="text-lg font-bold" style={{ color: item.color }}>{item.value}</div>
          </div>
        ))}
      </motion.div>

      {/* Habilidade especial desbloqueada? */}
      {maxCombo >= COMBO_THRESHOLD && (
        <motion.div className="mb-6 px-4 py-2 rounded-lg text-xs text-center"
          style={{ background: `${theme.primary}10`, border: `1px solid ${theme.primary}30`, color: theme.accent }}
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.3 }}>
          🔓 {theme.comboUnlockName} desbloqueada durante a partida!
        </motion.div>
      )}

      <motion.div className="flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
        <button onClick={onRestart} className="px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ border: `1px solid ${theme.primary}50`, color: theme.primary, background: `${theme.primary}10` }}>
          Treinar Novamente
        </button>
        <button onClick={onMenu} className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-white/40 hover:text-white/60 transition-all">
          Trocar Elemento
        </button>
      </motion.div>
      <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 1.6 }}>
        <Link href="/" className="text-xs opacity-60 hover:opacity-100 transition-opacity">← Voltar ao Portal</Link>
      </motion.div>
    </motion.div>
  );
};

// ═══════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════
export default function BendingPracticePage() {
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [element, setElement] = useState<Element>('water');
  const [results, setResults] = useState({ score: 0, perfects: 0, goods: 0, misses: 0, maxCombo: 0 });

  const handleSelect = useCallback((el: Element) => { setElement(el); setPhase('playing'); }, []);
  const handleFinish = useCallback((score: number, perfects: number, goods: number, misses: number, maxCombo: number) => {
    setResults({ score, perfects, goods, misses, maxCombo }); setPhase('results');
  }, []);

  const theme = ELEMENTS[element];

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4 relative overflow-hidden"
      style={{ background: phase === 'menu' ? 'radial-gradient(ellipse at 50% 30%, #1a182d 0%, #0a0a14 100%)' : theme.bgGradient }}>
      <Link href="/"
        className="fixed top-5 left-5 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-xs
          bg-white/[0.05] border border-white/[0.08] text-white/40
          hover:text-white/80 hover:bg-white/[0.1] hover:border-white/[0.15]
          transition-all duration-300 backdrop-blur-sm">
        ← Início
      </Link>

      <AnimatePresence mode="wait">
        {phase === 'menu' && (
          <motion.div key="menu" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <MenuScreen onSelect={handleSelect} />
          </motion.div>
        )}
        {phase === 'playing' && (
          <motion.div key={`game-${element}`} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <GameScreen element={element} onFinish={handleFinish} />
          </motion.div>
        )}
        {phase === 'results' && (
          <motion.div key="results" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <ResultsScreen element={element} {...results}
              onRestart={() => setPhase('playing')} onMenu={() => setPhase('menu')} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}