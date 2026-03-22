/**
 * src/app/page.tsx
 *
 * Portal Avatar — Mapa Vivo
 * O mapa respira e reage sutilmente ao mouse. 
 * Iluminação ambiente adaptativa dependendo do elemento focado, sem exageros.
 */
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import UserDashboardWidget from '@/components/dashboard/UserDashboardWidget';
import NationLeaderboard from '@/components/ranking/NationLeaderboard';

// ═══════════════════════════════════════════════════════════
// PALETA TERROSA E IMAGENS ÉPICAS
// ═══════════════════════════════════════════════════════════
const ANCIENT_COLORS = {
  ink: '#2a2016',
  inkLight: '#4a3d2e',
  paper: '#f4ecd8',
  paperDark: '#e6dec1',
  gold: '#a67c00',
  redSeal: '#9a2a2a',
};

// Cores de luz para cada elemento (usadas no glow interativo)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ELEMENT_LIGHTS: Record<string, string> = {
  none: 'transparent',
  water: 'radial-gradient(circle at 50% 50%, rgba(90, 158, 196, 0.15) 0%, transparent 60%)',
  earth: 'radial-gradient(circle at 50% 50%, rgba(143, 160, 74, 0.15) 0%, transparent 60%)',
  fire: 'radial-gradient(circle at 50% 50%, rgba(204, 74, 46, 0.15) 0%, transparent 60%)',
  air: 'radial-gradient(circle at 50% 50%, rgba(218, 165, 78, 0.15) 0%, transparent 60%)',
};

const NATION_IMAGES = {
  water: '/assets/nation_water_epic.png',
  earth: '/assets/nation_earth_1771657163486.png',
  fire: '/assets/nation_fire_1771657181321.png',
  air: '/assets/nation_air_1771657196619.png',
};

// ═══════════════════════════════════════════════════════════
// TUI & LA — PEIXES KOI DINÂMICOS
// ═══════════════════════════════════════════════════════════
const TuiAndLaInk = ({ size = 200, activeElement = 'none' }: { size?: number, activeElement?: string }) => {
  // Cores adaptativas dos peixes de acordo com o hover
  const glowColors: Record<string, string> = {
    none: ANCIENT_COLORS.ink,
    water: '#5a9ec4',
    earth: '#8fa04a',
    fire: '#cc4a2e',
    air: '#daa54e',
  };
  const color = glowColors[activeElement] || ANCIENT_COLORS.ink;

  return (
    <svg width={size} height={size} viewBox="-120 -120 240 240" style={{ transition: 'all 1s ease' }}>
      {/* Círculo sutil expandindo e contraindo como respiração */}
      <motion.circle cx="0" cy="0" r="105"
        animate={{ scale: [1, 1.05, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        fill={color} stroke={color} strokeWidth="1" strokeOpacity="0.1" strokeDasharray="4 8" />

      <g transform="rotate(25)">
        {/* Tui */}
        <g>
          <path d="M 0 -80 A 80 80 0 0 1 0 80 A 40 40 0 0 0 0 0 A 40 40 0 0 1 0 -80 Z" fill={ANCIENT_COLORS.paper} stroke={color} strokeWidth="2" style={{ transition: 'stroke 1s ease' }} />
          <circle cx="16" cy="-40" r="8.5" fill={color} style={{ transition: 'fill 1s ease' }} />
          <circle cx="14" cy="-42" r="2.5" fill={ANCIENT_COLORS.paper} />
          <path d="M 72 -30 C 95 -40, 105 -15, 80 5 C 78 0, 75 -15, 72 -30 Z" fill={ANCIENT_COLORS.paper} stroke={color} strokeWidth="1.5" style={{ transition: 'stroke 1s ease' }} />
          <path d="M 0 80 C -15 100, 10 115, 20 95 C 25 80, 10 85, 0 80 Z" fill={ANCIENT_COLORS.paper} stroke={color} strokeWidth="1.5" style={{ transition: 'stroke 1s ease' }} />
        </g>
        {/* La */}
        <g>
          <path d="M 0 -80 A 80 80 0 0 0 0 80 A 40 40 0 0 0 0 0 A 40 40 0 0 1 0 -80 Z" fill={color} style={{ transition: 'fill 1s ease' }} />
          <circle cx="-16" cy="40" r="8.5" fill={ANCIENT_COLORS.paper} />
          <circle cx="-18" cy="38" r="2.5" fill={color} style={{ transition: 'fill 1s ease' }} />
          <path d="M -72 30 C -95 40, -105 15, -80 -5 C -78 0, -75 15, -72 30 Z" fill={color} style={{ transition: 'fill 1s ease' }} />
          <path d="M 0 -80 C 15 -100, -10 -115, -20 -95 C -25 -80, -10 -85, 0 -80 Z" fill={color} style={{ transition: 'fill 1s ease' }} />
        </g>
      </g>
    </svg>
  );
};


// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// AS 4 RUNAS DOS ELEMENTOS (AVATAR)
// ═══════════════════════════════════════════════════════════
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
interface ElementalRunesProps {
  activeElement: string;
  mouseX: any; // MotionValue
  mouseY: any; // MotionValue
}

const ElementalRunes = ({ activeElement, mouseX, mouseY }: ElementalRunesProps) => {
  // Parallax calculations para as runas
  const x1 = useTransform(mouseX, [0, 1000], [40, -40]);
  const y1 = useTransform(mouseY, [0, 1000], [40, -40]);

  const x2 = useTransform(mouseX, [0, 1000], [-30, 30]);
  const y2 = useTransform(mouseY, [0, 1000], [50, -50]);

  const x3 = useTransform(mouseX, [0, 1000], [60, -60]);
  const y3 = useTransform(mouseY, [0, 1000], [-40, 40]);

  const x4 = useTransform(mouseX, [0, 1000], [-50, 50]);
  const y4 = useTransform(mouseY, [0, 1000], [-30, 30]);

  const getRuneOpacity = (element: string) => {
    if (activeElement === 'none') return 0.15;
    return activeElement === element ? 0.6 : 0.05;
  };

  const waterPath = "M50,15 C45,25 35,40 35,55 C35,70 45,85 50,85 C55,85 65,70 65,55 C65,40 55,25 50,15 Z M42,50 C45,55 50,60 58,50 M44,65 C48,70 52,70 56,65";
  const earthPath = "M30,30 L70,30 L70,70 L30,70 Z M40,40 L60,40 L60,60 L40,60 Z M50,40 L50,60 M40,50 L60,50";
  const firePath = "M50,80 C30,80 35,50 50,20 C65,50 70,80 50,80 Z M42,70 C40,55 48,45 50,35 C52,45 60,55 58,70 Z";
  const airPath = "M50,20 C65,20 75,35 65,50 C55,65 30,50 50,40 C60,35 70,45 70,55 C70,70 45,85 45,70 C45,60 55,60 55,70";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.svg width="200" height="200" viewBox="0 0 100 100" className="absolute top-[15%] left-[10%] opacity-20"
        style={{ x: x1, y: y1, opacity: getRuneOpacity('water') }}
        animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}>
        <path d={waterPath} fill="none" stroke="#5a9ec4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="#5a9ec4" strokeWidth="1" strokeDasharray="5,5" />
      </motion.svg>

      <motion.svg width="250" height="250" viewBox="0 0 100 100" className="absolute bottom-[10%] left-[20%] opacity-20"
        style={{ x: x2, y: y2, opacity: getRuneOpacity('earth') }}
        animate={{ rotate: -360 }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}>
        <path d={earthPath} fill="none" stroke="#a0b84c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="5" y="5" width="90" height="90" fill="none" stroke="#a0b84c" strokeWidth="1" strokeDasharray="10,5" />
      </motion.svg>

      <motion.svg width="220" height="220" viewBox="0 0 100 100" className="absolute top-[20%] right-[15%] opacity-20"
        style={{ x: x3, y: y3, opacity: getRuneOpacity('fire') }}
        animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}>
        <path d={firePath} fill="none" stroke="#ff6a42" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="50,2 98,75 2,75" fill="none" stroke="#ff6a42" strokeWidth="1" strokeDasharray="8,4" />
      </motion.svg>

      <motion.svg width="280" height="280" viewBox="0 0 100 100" className="absolute bottom-[15%] right-[10%] opacity-20"
        style={{ x: x4, y: y4, opacity: getRuneOpacity('air') }}
        animate={{ rotate: -360 }} transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}>
        <path d={airPath} fill="none" stroke="#f2c56a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="48" fill="none" stroke="#f2c56a" strokeWidth="1" strokeDasharray="2,4" />
      </motion.svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PARTÍCULAS ELEMENTAIS ANIMADAS (Atmosfera Viva)
// ═══════════════════════════════════════════════════════════
const ElementalParticles = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Gera partículas pre-comutadas para performance com posições pseudo-aleatórias
  const particles = useMemo(() => {
    // Reduzimos um pouco a quantia para compensar o detalhamento visual
    return Array.from({ length: 30 }).map((_, i) => {
      const type = i % 4; // 0: Fire, 1: Water, 2: Air, 3: Earth
      const size = Math.random() * (type === 3 ? 12 : 8) + 4;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Armazenamos todos os valores aleatórios que eram chamados no render aqui
      return {
        id: i,
        type,
        x,
        y,
        size,
        duration: Math.random() * 8 + (type === 2 ? 3 : 7), // Ar é mais rápido
        delay: Math.random() * 4,
        // Específicos por tipo
        fireHeightMult: 1 + Math.random(),
        fireColor: Math.random() > 0.5 ? '#ff8b42' : '#ff4224',
        fireAnimX: [x, x + (Math.random() * 8 - 4), x + (Math.random() * 12 - 6)],
        fireAnimScale: [1, Math.random() * 2 + 1, 0.5],
        earthShapeIdx: Math.floor(Math.random() * 3), // 0, 1, 2
        earthColor: Math.random() > 0.5 ? '#6a5a40' : '#8a775c',
        earthAnimX: [x, x + (Math.random() * 10 - 5)],
        earthRotateDir: Math.random() > 0.5 ? 720 : -720,
        airRotate: Math.random() * 25 - 12
      };
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {particles.map((p) => {
        // --- 0: FOGO (Brasas quentes distorcidas pelo calor) ---
        if (p.type === 0) {
          return (
            <motion.div key={p.id} className="absolute"
              style={{
                left: `${p.x}%`,
                width: p.size,
                height: p.size * p.fireHeightMult, // Um pouco elíptica pelo vento ascendente
                backgroundColor: p.fireColor, // Mistura laranjas e vermelhos
                borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', // Forma orgânica de fuligem
                filter: 'drop-shadow(0px 0px 8px rgba(255, 66, 36, 1)) blur(0px)', // BEM visível
                opacity: 1 // Não começa transparente
              }}
              animate={{
                y: [`${p.y}vh`, `${p.y - 30}vh`, `${p.y - 70}vh`],
                x: p.fireAnimX.map((v: number) => `${v}%`),
                opacity: [0, 1, 0], // Vai até 1
                scale: p.fireAnimScale
              }}
              transition={{ duration: p.duration * 0.8, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
            />
          );
        }

        // --- 1: ÁGUA (Gotículas de orvalho, formato lagrima) ---
        if (p.type === 1) {
          return (
            <motion.div key={p.id} className="absolute"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size * 1.5, // Mais comprido para parecer Gota
                // Estética de gota estilo vidro MUITO MAIS CLARA
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,1), rgba(138, 196, 226, 0.8))',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                filter: 'drop-shadow(0px 6px 6px rgba(90, 158, 196, 0.9))',
                opacity: 0.9 // Começa forte
              }}
              animate={{
                y: [0, -25, 10, 0],
                x: [0, 8, -8, 0],
                opacity: [0, 0.9, 0], // Sobe para brilho intenso
                scale: [1, 1.2, 0.9, 1]
              }}
              transition={{ duration: p.duration + 4, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          );
        }

        // --- 2: AR (Rajadas sinuosas e longas, estilo 'Wisps' de vento) ---
        if (p.type === 2) {
          return (
            <motion.div key={p.id} className="absolute rounded-full"
              style={{
                top: `${p.y}%`,
                width: p.size * 50, // Ainda mais longo
                height: Math.max(1.5, p.size / 3), // Mais fino para elegância
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', // Opacidade BEM baixa (0.1)
                filter: 'blur(6px)', // Mais blur para suavizar as bordas
                transform: `rotate(${p.airRotate}deg)`
              }}
              animate={{ x: ['-40vw', '140vw'], opacity: [0, 0.3, 0] }} // Muito mais leve
              transition={{ duration: p.duration * 0.5, delay: p.delay, repeat: Infinity, ease: 'linear' }}
            />
          );
        }

        // --- 3: TERRA (Detritos poligonais rústicos que flutuam densos) ---
        if (p.type === 3) {
          // Geração de formas variadas pro detrito de terra (Losangos, polígonos irregulares)
          const shapes = [
            'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', // Trapezoid
            'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', // Pentagon
            'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' // Diamond
          ];
          const shape = shapes[p.earthShapeIdx];

          return (
            <motion.div key={p.id} className="absolute"
              style={{
                left: `${p.x}%`,
                width: p.size * 1.5, // Nacos BEM grandões
                height: p.size * 1.5,
                backgroundColor: p.earthColor,
                clipPath: shape,
                opacity: 0.9, // Bem visível
                filter: 'drop-shadow(3px 4px 4px rgba(0,0,0,0.8))' // Sombra rígida super escura
              }}
              animate={{
                y: [`${p.y - 15}vh`, `${p.y + 45}vh`], // Caindo bem longe
                x: p.earthAnimX.map((v: number) => `${v}%`),
                rotate: [0, p.earthRotateDir], // Gira mto mais pra mostrar a textura de pedra
                opacity: [0, 1, 0] // 100% opaco
              }}
              transition={{ duration: p.duration + 2, delay: p.delay, repeat: Infinity, ease: 'linear' }}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// HERO SECTION INTERATIVA — ESTILO AVATAR STUDIOS OFFICIAL
// ═══════════════════════════════════════════════════════════
const EpicHeroSection = ({ activeElement, setActiveElement, mouseX, mouseY }: any) => {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [bgIndex, setBgIndex] = useState(1);

  React.useEffect(() => {
    setMounted(true);
    setBgIndex(Math.random() > 0.5 ? 1 : 2);
  }, []);

  const scrollToQuiz = () => {
    window.location.href = '/quiz';
  };

  const scrollToModules = () => {
    document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Parallax super sutil para dar profundidade atmosférica
  // Fixamos valores iniciais estáveis para SSR
  const bgX = useTransform(mouseX, [0, 1200], [-15, 15]);
  const bgY = useTransform(mouseY, [0, 800], [-15, 15]);

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center p-8 text-center overflow-hidden"
      style={{
        backgroundColor: '#0a101a', // Azul Marinho Profundo (Spirit World)
        backgroundImage: 'radial-gradient(circle at center, rgba(46, 75, 115, 0.15) 0%, transparent 70%)'
      }}>

      {/* 🌟 FUNDO MINIMALISTA 4K (FOCO ATMOSFÉRICO — CLEAN & ZEN) 🌟 */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden"
        style={{ x: bgX, y: bgY }}
      >
        {/* ARTE DIGITAL ÚNICA — PINTURA DIGITAL EM 16:9 — SEM ESTICAR */}
        <motion.img 
          src="/assets/images/backgrounds/minimalist_spirit_4k.png" 
          alt="Spirit Wilds Horizon" 
          className="w-full h-full object-cover opacity-100 brightness-[1.05]"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Gradiente de Fusão — Para um olhar mais Sóbrio e Elegante */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a101a] via-transparent to-[#0a101a]/70 z-20" />

        {/* 🎬 CAMADA DE TEXTURA — RUÍDO CINEMATOGRÁFICO & PÁTINA (DISFARCE ORGÂNICO) 🎬 */}
        <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")',
            animation: 'noise-drift 8s steps(10) infinite'
          }} />
        <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.05] mix-blend-multiply"
          style={{
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
          }} />
      </motion.div>

      {/* Partículas Elementais sutis no Background — Menores e mais leves */}
      <ElementalParticles />

      {/* Título e Logo (Com inspiração clara na caligrafia 'Spirit Wilds') */}
      <motion.div className="relative z-30 flex flex-col items-center justify-center mt-12 w-full max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>

        <h2 className="mb-4 text-[0.6rem] md:text-xs uppercase tracking-[0.8em] font-bold text-[#dcb670] opacity-80"
          style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          Portal Avatar
        </h2>
        
        {/* Logo Customizada "Avatar: Legado Elemental" */}
        <div className="relative mb-6 flex flex-col items-center">
          <h1 className="text-7xl md:text-9xl font-black tracking-tight text-white uppercase leading-none whitespace-normal md:whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-cinzel), serif',
              textShadow: '0 0 40px rgba(255,255,255,0.25)',
              letterSpacing: '0.1em'
            }}>
            Avatar
          </h1>
          <div className="flex items-center justify-center gap-4 mt-2 w-full">
            <span className="h-px w-8 md:w-24 bg-gradient-to-r from-transparent to-[#dcb670]" />
            <span className="text-sm md:text-3xl font-bold tracking-[0.4em] uppercase text-[#dcb670] whitespace-nowrap"
              style={{ fontFamily: 'var(--font-cinzel), serif', textShadow: '0 0 15px rgba(220, 182, 112, 0.4)' }}>
              Legado Elemental
            </span>
            <span className="h-px w-8 md:w-24 bg-gradient-to-l from-transparent to-[#dcb670]" />
          </div>
        </div>

        {/* Os 4 Elementos Alinhados Horizontalmente (Estilo site oficial) */}
        <div className="flex items-center justify-center gap-8 md:gap-16 mb-16 mt-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-full border border-white/20 bg-white/5 text-3xl hover:scale-125 transition-all duration-300 cursor-pointer hover:border-[#5a9ec4] hover:shadow-[0_0_20px_rgba(90,158,196,0.5)]">🌊</div>
          <div className="flex items-center justify-center w-14 h-14 rounded-full border border-white/20 bg-white/5 text-3xl hover:scale-125 transition-all duration-300 cursor-pointer hover:border-[#8fa04a] hover:shadow-[0_0_20px_rgba(160,184,76,0.5)]">⛰️</div>
          <div className="flex items-center justify-center w-14 h-14 rounded-full border border-white/20 bg-white/5 text-3xl hover:scale-125 transition-all duration-300 cursor-pointer hover:border-[#cc4a2e] hover:shadow-[0_0_20px_rgba(255,106,66,0.5)]">🔥</div>
          <div className="flex items-center justify-center w-14 h-14 rounded-full border border-white/20 bg-white/5 text-3xl hover:scale-125 transition-all duration-300 cursor-pointer hover:border-[#81a1c1] hover:shadow-[0_0_20px_rgba(242,197,106,0.5)]">🫧</div>
        </div>

        {/* CONDIÇÃO: Logado mostra Dashboard / Não logado mostra Botão */}
        {!mounted || status === 'loading' ? (
          <div className="h-40 w-full max-w-2xl mx-auto rounded-xl bg-white/5 border border-white/10 animate-pulse mt-8" />
        ) : session?.user ? (
          <UserDashboardWidget />
        ) : (
          <>
            {/* CTA Principal - "Take the Bending Quiz" em Dourado Pergaminho */}
            <motion.button
              onClick={scrollToQuiz}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(220, 182, 112, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="relative px-12 py-5 text-sm md:text-lg font-bold tracking-[0.3em] uppercase transition-all duration-500 text-black shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              style={{
                background: "linear-gradient(135deg, #dcb670, #c4a160)",
                fontFamily: 'var(--font-cinzel), serif',
                clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)',
                border: 'none'
              }}>
              Descobrir Destino
            </motion.button>

            {/* Sub Botão "Explore More" estético */}
            <div className="mt-8 text-white/40 text-[10px] tracking-[0.4em] uppercase mb-16 cursor-pointer hover:text-[#dcb670] font-bold transition-all" onClick={scrollToModules}>
              Explorar Crônicas
            </div>
          </>
        )}

      </motion.div>

      {/* Indicador de Scroll no canto inferior esquerdo */}
      <div className="absolute bottom-8 left-8 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white transform -rotate-90 origin-bottom mb-8">Sabedoria</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-white"
        />
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════
// MÓDULOS — Cards Fotográficos Emoldurados
// ═══════════════════════════════════════════════════════════
interface EpicModuleCard {
  title: string; subtitle: string; description: string;
  image: string; href: string; element: string;
}

const EPIC_MODULES: EpicModuleCard[] = [
  {
    title: 'O Chamado Espiritual', subtitle: 'Teste de Afinidade', element: 'none',
    description: 'Responda a perguntas comportamentais profundas para descobrir a qual das Quatro Nações o seu espírito realmente pertence.',
    image: '/assets/adventure_destiny_epic.png',
    href: '/quiz',
  },
  {
    title: 'Pai Sho', subtitle: 'Jogo de Tabuleiro', element: 'earth',
    description: 'Jogue online o milenar jogo de mesa da Ordem do Lótus Branco. Alinhe os lótus de pedra contra a Inteligência Artificial e comprove sua maestria.',
    image: '/assets/images/pai_sho_spiritual.png',
    href: '/arena/pai-sho',
  },
  {
    title: 'Arcade Elemental', subtitle: 'Mini-Games Viciantes', element: 'water',
    description: 'Divirta-se com 4 jogos exclusivos: Flappy Appa, Avatar 2048, Defesa da Ordem e o Salto do Nômade. Supere seus limites e conquiste recordes.',
    image: '/assets/arcade-hero.png',
    href: '/arena/arcade',
  },
  {
    title: 'Pergaminhos de Wan Shi Tong', subtitle: 'Trivia de Esforço (Quiz)', element: 'fire',
    description: 'Um segundo teste, mas focado puramente em conhecimentos! Apenas os fãs mais hardcore conseguirão gabaritar este Quiz de 48 questões de altíssima dificuldade.',
    image: '/assets/images/wan_shi_tong_library.png',
    href: '/arena/trivia',
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EpicModulesSection = ({ setActiveElement }: any) => (
  <section id="modules" className="relative py-32 px-6 md:px-12 overflow-hidden"
    style={{
      backgroundColor: '#0b0e14', 
      backgroundImage: `
        radial-gradient(circle at 50% -20%, rgba(167, 146, 255, 0.08) 0%, transparent 60%),
        radial-gradient(circle at 50% 120%, rgba(220, 182, 112, 0.05) 0%, transparent 60%)
      `,
      boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(0, 0, 0, 0.5)' 
    }}>
    
    {/* Textura de Ruído Sutil (Overlay) */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
    </div>

    {/* Efeito de Vinheta (Vignette) */}
    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] opacity-60"></div>

    <motion.div className="text-center mb-24 relative z-10"
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
      <h2 className="text-xs uppercase tracking-[0.6em] mb-4 text-[#dcb670] font-bold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Os Arquivos Secretos</h2>
      <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
        Jornada do Conhecimento
      </h3>
      <div className="mx-auto w-16 h-[2px] mt-8 bg-[#dcb670]"></div>
    </motion.div>

    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
      {EPIC_MODULES.map((mod, i) => (
        <motion.div key={mod.href}
          onHoverStart={() => setActiveElement(mod.element)}
          onHoverEnd={() => setActiveElement('none')}
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.8 }}>
          <Link href={mod.href} className="group block h-full">
            <div className="relative flex flex-col h-full rounded-2xl transition-all duration-[0.8s] hover:-translate-y-2 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] bg-[#0a101a]/80 backdrop-blur-md"
              style={{
                border: `1px solid rgba(220, 182, 112, 0.1)`,
                boxShadow: `inset 0 0 60px rgba(0, 0, 0, 0.2)`,
              }}>

              {/* Contêiner da Imagem */}
              <div className="relative h-72 group-hover:h-[28rem] transition-[height] duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden border-b border-white/5 shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a101a] via-transparent to-transparent z-10 opacity-60 group-hover:opacity-20 transition-opacity duration-700" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mod.image} alt={mod.title} className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[1.5s] ease-out brightness-75 group-hover:brightness-100" />
              </div>

              {/* Contêiner de Texto */}
              <div className="p-10 flex-1 flex flex-col justify-between transition-all duration-700 relative z-20 group-hover:bg-white/5">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.5em] font-bold mb-3 text-[#dcb670]">
                    {mod.subtitle}
                  </div>
                  <h4 className="text-2xl font-bold mb-5 text-white tracking-widest uppercase" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    {mod.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-white/60 font-medium transition-all duration-700 group-hover:text-white/80">
                    {mod.description}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#dcb670] font-bold">
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">Explorar Destino</span>
                  <span className="transform group-hover:translate-x-4 transition-transform duration-300">→</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════
// GALERIA DAS NAÇÕES — GRANDIOSA
// ═══════════════════════════════════════════════════════════
interface EpicNationData {
  name: string; id: string; philosophy: string; image: string;
  lore: {
    culture: string;
    bending: string;
    comics: string;
  }
}

const EPIC_NATIONS: EpicNationData[] = [
  {
    name: 'Tribo da Água', id: 'water', philosophy: '"A água é o elemento da mudança."', image: NATION_IMAGES.water,
    lore: {
      culture: 'Isolada nos polos glaciais do Norte e do Sul, a Tribo da Água reflete as adversidades do ambiente impiedoso onde habita. A Tribo do Norte é uma sociedade patriarcal estratificada (onde originalmente as mulheres eram proibidas de combater e focadas apenas na cura), blindada por paredões de gelo colossais em Agna Qel\'a.\n\nJá a Tribo do Sul, desolada por sucessivos e brutais ataques da Nação do Fogo, viu seus guerreiros partirem e seus dobradores serem exterminados. Separadamente no coração do Reino da Terra, jaz a rudimentar Tribo do Pântano Nebuloso, que mantém sua ancestral crença animista de que todas as coisas do ecossistema estão conectadas pela mesma rede de raízes subterrâneas (Banyan-Grove Tree). Esteticamente, seu povo é fortemente inspirado nas indumentárias inuítes, iúpiques e nas comunidades nativo-norte-americanas.',
      bending: 'Os primeiros dobradores de água não aprenderam com bestas animais (como os outros), mas observando fascinados como os Espíritos Originais da Lua (Tui - o impulso) e do Oceano (La - a tração) moviam as marés através de um ritmo suave, percutor e gravitacional, representado pela Carpa Koi Branca e Preta.\n\nBaseada fisicamente na arte milenar do Tai Chi Chuan de Yang e Chen, as formas da dobra fluem contínuas; o lutador raramente para os ataques inimigos; ele os redireciona circularmente, aproveitando a força contra o agressor até a maré se voltar para esmagá-lo de forma impiedosa.\n\nSub-dobras notáveis: Sangue (Bloodbending, descoberta pela prisioneira Hama para controlar o corpo humano através dos fluidos corporais nas noites de Lua Cheia, posteriormente banida mas infamemente dominada pela máfia de Yakone), Cura (redirecionamento de chi por meio de água benta para selar ferimentos) e Espíritos (Spiritbending, originada no Norte e aperfeiçoada por Unalaq, uma técnica espiritual que harmoniza ou subverte entidades do Mundo Espiritual).',
      comics: 'A série e as HQs mergulham profundo na evolução desta nação e a cisão de suas tribos irmãs.\n\nNa trilogia canônica "Norte e Sul" (North and South), vemos Hakoda sendo estabelecido como o primeiro grande Cacique Chefe do Polo Sul unificado. Durante seu governo provisório, somos arremessados num dilema de modernidade: acompanhamos a Tribo do Sul passando por um colossal projeto de expansão urbana e industrialização em massa financiado e liderado secretamente pelo Norte (através da arquiteta Malina). Essa brusca ocidentalização e a intromissão cultural geram protestos e rachaduras extremas. Um exército de nacionalistas conservadores do Sul liderados por Gilak atua em violentos atentados para destruir as máquinas.\n\nAs consequências dessa interferência estrangeira e desse protecionismo xenofóbico pavimentaram os alicerces definitivos da histórica Guerra Civil da Tribo da Água, um conflito religioso-governamental visto intensamente várias décadas depois na Lenda de Korra, onde os sulistas, encabeçados por Tonraq (pai de Korra), cortam laços com o corrupto líder Únalaq do Norte para declarar plena, absoluta e permanente independência do Sul.'
    }
  },
  {
    name: 'Reino da Terra', id: 'earth', philosophy: '"A terra é o elemento da substância."', image: NATION_IMAGES.earth,
    lore: {
      culture: 'O maior, mais populoso e fragmentado continente geográfico do Mundo de Avatar. De um lado representa um orgulhoso e robusto império pautado pela pura resiliência. De outro, uma vastidão de terras dilaceradas por um governo central monárquico absolutista corrupto ou inefetivo, contendo dezenas de províncias semi-dependentes.\n\nO império concentra-se ao redor da quase impenetrável capital Ba Sing Se, "a cidade inalcançável". Nela, encontramos uma aristocracia brutalmente estratificada em anéis murados segregacionais, governada secretamente pelas sombras do Ministério da Cultura e pelo seu cruel líder Long Feng — que comanda a Dai Li, polícia secreta de elite capaz de lavagem cerebral sistêmica no subterrâneo (Lago Laogai) para ocultar do inocente Rei Kuei que há décadas vigora a brutal "guerra do lado de fora". O continente também abriga Omashu regida pelo gênio centenário excêntrico Rei Bumi, desertos abrasadores como Si Wong, a mítica Ilha das Guerreiras Kyoshi e prósperas inovações autônomas como a redoma de metal Zaofu do Clã Beifong. Inspirada fortemente na história da China Imperial (Dinastias Qing e Ming).',
      bending: 'O domínio sobre a rocha detém sua gênese nos lendários primeiros amantes Oma e Shu (que fundaram Omashu), mas tecnicamente foi forjado pela humanidade copiando o viver cego e subterrâneo das titânicas Toupeiras-Texugo nas cavernas sombrias. O Avatar e a jovem matriarca do metal, Toph Beifong, são os mestres absolutos que compreendem a essência milenar da terra: o "Jing Neutro". Trata-se de uma coragem pautada em brutal e estoica paciência.\n\nUm dobrador de terra é moldado focado no estilo de Kung-fu Hung Gar (Postura Cavalo): fincando os pés com a firmeza de uma montanha inabalável absorto a receber duros ataques para apenas, na exatíssima e ínfima fração de milissegundo favorável, contra-atacar explodindo uma avassaladora força geométrica.\n\nSub-dobras formidáveis nasceram disto: Dobra de Metal (Metalbending, onde se dobra os minúsculos resíduos minerais impuros encrustados dentro das grossas ligas de aço ou meteoritos), a aterrorizante Dobra de Magma/Lava (Lavabending, raras mutações termodinâmicas geológicas inatas apenas em benders extremos como o letal Ghazan e, posteriormente, Bolin) e o refinado e quase cego Senso Sísmico — que atua vibrando passos a quilômetros convertidos por radar como o polígrafo humano de mentiras infalível.',
      comics: 'As complexas HQs atestam que o encerramento bélico na era de Aang estava a centímetros de se desolar numa recaída de guerra civil.\n\nNa formidável prequela em tirinhas de "A Promessa" (The Promise), exploramos detalhadamente os primeiros meses do complexo "Movimento de Restauração da Harmonia". O recém-recobrado e agora assertivo Rei Kuei da Terra, exige com nacionalismo febril que a coligação de Zuko repatrie obrigatoriamente cidadãos e desmonte da noite para o dia a secular presença vulcânica de invasores em seu território em cidades historicamente invadidas como Yu Dao. Contudo, em Yu Dao, um colossal choque inter-relacional transparece: Aang descobre horrorizado um gigantesco cadinho racial. Fogo e Terra convivendo, casando em negócios prósperos com proles nativas miscigenadas amparadas na multiculturalidade por longas e contínuas quatro gerações inteiras de paz local.\n\nO desfecho choca: a Equipe Avatar confronta amargamente preceitos da pureza ideológica percebendo ser impossível ser moralista ou "extirpar pacificamente o impuro" das fronteiras terrestres, decidindo formar um acordo conjunto inominado para a auto-determinação e governo autônomo. Tal semente floresce, tornando as Colônias no alicerce neutro da grande Nação da República Unida fundada pelas Leis do Avatar (que 70 anos depois, é o principal polo do Avatar Korra).'
    }
  },
  {
    name: 'Nação do Fogo', id: 'fire', philosophy: '"O fogo é o elemento do poder."', image: NATION_IMAGES.fire,
    lore: {
      culture: 'Outrora uma comunidade fervorosa e altamente espiritual guiada pelo sublime senso de união existencial ao redor do sol vivificador dos deuses primitivos (como reclusa Tribo Guerreira do Sol), a Nação do Fogo sofreu um sequestro filosófico macabro liderado pela megalomania letal da Linhagem do ditador Sozin. Numa era pioneiramente favorecida pela revolução industrial naval bélica a carvão-mineral ardente (tanques sobre esteiras blindadas Tundra e engenharia aérea de cruzadores War Ballons inspirados no Ocidente industrial imperialista Grã-Bretanha/Alemanha), instilou-se um projeto totalitário global sustentado na ideologização nacionalista da excelência cultural prussiana e japonesa do expansionismo asiático de Meiji.\n\nSeu arquipélago insular majestoso espalha-se predominantemente no tórrido meridiano equatorial com topografia de cordilheiras cobertas em lava fervente, contendo metrópoles majestosas encravadas dentro de caldeiras e montanhas vulcânicas nativas (Como a letal Prisão de Rocha Fervente). Com suas honras distorcidas que priorizam a ordem ditatorial sobre os laços parentais de sangue sagrado, ela instucionalizou em sua corte os impiedosos e impenetráveis julgamentos dos temidos duelos letais fratricidas, conhecidos pelos desfigurados de fogo como Agni Kai.',
      bending: 'Singular e brutal! Por instinto biológico sagrado da criação, a disciplina ígnea exime do dobrador a dependência externa elemental dos céus mortais: o próprio ser humano cria e gera o seu combustível e o seu chamas letal internamente via correntes solares. Mas a real e esplêndida iluminação original ensinada séculos antes pelo voo dos Reis Dragões Ran e Shao nas civilizadas chamas místicas fora sepultada através das mentiras por ditadores. No auge sangrento da Guerra exaustiva Ozai instigou os monges guerreiros a não respirarem luz cósmica espiritual, mas alimentarem o calor usando a opressiva escuridão corrosiva puramente forjada de Rancor contínuo, Vinganças dolorosas incontroláveis e Ódio focado sem sentimentos de misericórdia e raiva desgovernada como os chackras geradores marciais de energia.\n\nConceitualmente sua agressividade irrefreável com passos vertiginosos amplos com acrobacias flamejantes velozes foi retirada inteiramente do mortífero milenar estilo do vibrante Kung Fu Wushu e do estilo Shaolin do Norte Chinês.\n\nSuas devastadoras e colossais variantes marciais exclusivas de Sub-dobras raras de linhagem pura: A Geração Dinâmica de Raios Letal (Lightning Generation, também chamada filosoficamente do sangrento "Fogo com seu Sangue-Frio" que estritamente condensa severas tempestades dos pólos energéticos corporais do yin-yang do duplo pólo em uma fuzilaria fatal a frio — amplamente usada mais tarde em Usinas modernas por Mako e nas fábricas tecnológicas em Cidade República) e o estranho fenômeno brutal indestrutível telecinético chamado misticamente por Combustão Sincrônica Vácuo: raios destrutivos telepatas invisíveis explosivos deflagrados em alvos perfeitamente milimétricos pelo despertar ocular letal de chakras no terceiro olho das testas tatuadas de mercenários anarquistas impagáveis como o insensível Sparky Sparky Boom Man ou da perversa monja aprisionada P\'Li.',
      comics: 'As imensas sequências ilustradas canônicas sob a dinastia do recém-empossado Lorde do Fogo Zuko se propõem não apenas como rito de apuração ideológica pacífica, como nos trágicos mistérios psicológicos que as séries de infância não abarcam de forma profunda.\n\nOs leais fãs ganham de forma completa a continuação épica familiar nas cruciais tramas HQs "A Busca" (The Search), revelando a exata resolução lacunar de toda infância banida de Zuko: o desfecho chocante sumiço na calada das tramas golpistas por Ursa. O desespero arrasta o monarca na desolação para apelar até em trégua aliançada de favores com sua esquizofrênica e paranóica e mortífera jovem irmã Azula e um asilo para o resgate tortuoso embrenhados entre matagais amaldiçoados de perigosas quimeras bestiais de rosto de deuses de feitiçaria e Lobos-Esfinge onde repousava as ruínas escondidas esquecidas do Espírito Ancião A Mãe dos Rostos (The Mother of Faces). Nos pesares mágicos de Ursa foi feito pactos mentais mágicos absolutos nas memórias em seu subconsciente em abdicação da tortura impiedosa vivida de humilhação conjugal trágica imposta pelos arranjos sangrentos a Azulon na calada noturna do Palácio para enfim exilar-se protegendo o afeto e sucessão da vida desamparada frágil do inocente príncipe primogênito e sobreviver as cicatrizes apagando no amnésia dos passados.'
    }
  },
  {
    name: 'Nômades do Ar', id: 'air', philosophy: '"O ar é o elemento da liberdade."', image: NATION_IMAGES.air,
    lore: {
      culture: 'No antigo ecossistema geopolítico panteão da terra milenar a etnia abençoada Nômade representava ativamente o irrefutável e absoluto zênite incontestável iluminado da pacificidade. Tratavam-se historicamente nas altas estratosferas cota da vida o mais utópico monoteísmo biológico isolacionado do relevo, de onde estritamente todos absolutamente, de todos mil nascituros provindos da casta sem excessão ou desajuste carnal a falharem detinham a bênção original mágica nos pulsos de dominar espiritualmente os fluidos glaciais respirados dos Céus celestes na aurora do voo — virtude divina biomicranica gerada puramente nas entranhas na forte ligação do êxtase de desapego e purezas das emoções místicas dos rústicos.\n\nCom uma divisão geográfica arquitetônica esbelta esculpidas reclusamente invertidas e longínquas da ganância pecadora civil, foram edificadas em abismos picos rochosos quatro santíssimos templos catedrais segregados abadia ao compasso cardinal da geografia. Nestes vivia suas sevícias pautadas a um forte e reverente estoicismo severo veganista (as irmãs femininas monges de roupas aladas para abadias do Leste Oriental/Oeste). Nas características nativas com os fofos mamíferos herbívoros simbióticos amigáveis celestes os Bisões dos ventos, cujos mestres seniores desenhavam ritualisticamente ao passar provações longas dolorosamente de maturidade em setas marcadoras da tatuagem glifal azul na epiderme imitando o animal. A fonte antropológica inspiracional reverencial da cultura reflete uma singela ode e adoração pacifista as pacatas seitas de vida frugal e meditacionismo compassivo ascese dos pacíficos povos distantes orientais monges calvos do Tibete Hindu/Budista.',
      bending: 'Evadir com esquivas acrobáticas pacíficas milimétricas para estressar agressores não se igualando no confronto de danos impetuosos anulando impasses agressivos carnais mortais em seu fluxo natural contínuo intocável gracioso e inesgotável.\n\nAs artes técnicas ventosas graciosas fluídas ensinadas divinamente a doçura monástica foi doada das manadas divinas de imensos fiéis bovinos celestes felpudos de caudas pesadas chamadas Bisões Voadores. Semelhante filosoficamente de táticas de batalha evasivas esquivas na leveza veloz extrema coreografadas das escolas antigas orientais reias dos movimentos marciais mortais sem contraofensiva letal estilo paKua Chang - Baguazhang, de que uma investida hostil contundente rígida com arestas é contornadas com o passo voador que usa um vasto circular rotacional do corpo do guerreiro nômade para varrer sem dor os joelhos e sugar e drenar nas frestas vácuas invisíveis dos furacões o baque ou furor do sangue violento oponente com redemoinhos exatos cegantes dissipando atrito de socos atordoados pelo vácuo de pulmão denso sufocante num redemoinho.\n\nMíticos subdobradores celestes das eras mortas são escassos pela heresia em sua pureza das leis humanas morais. Desbloqueio Supremo O Voo da Leveza Extrema e Transcendência Desprendida Flutuante: Descobrimento recitado misticamente nas montanhas em cânticos pelos monges arcanos da poema estático de Guru Laghima para anular sem truques mecânicos parafisicos terrestres a tração planetária letal: "Solte suas cordas terrenas. Entre no Vazio... Esvazie, e transforme a ventania sua substância"  Atingindo dolorosas mortes sentimentais e vínculos irremediáveis em suas conexões profundas dos apegos familiares inabaláveis para tornar ao imaterial alçado impunemente, destravado em Korra no desolador clímax com do assassino e perigoso terrorista e líder anarquistas místico cego mortal liberto da prisão chamado Lótus Vermelho mestre fanático Zaheer livre do Lótus.',
      comics: 'Ao transcorrer sombrio do árduo laborioso renascimento do povo dos abismos nevosos após séculos do tenebroso extermínio de cinza vulcânica promovida por Senhor Fogo de Cometas no repensamento nostálgico transição ao industrial nas HQ de Avatar nas crônicas dramáticas complexas profundas socioreligiosas da Trilogia "A Fenda" (The Rift):\n\nO leitor defronta de perto a sufocante amarga dor passional psicológica fobia avassaladora e desesperançosa ansiedade saudosista reacionária que adoeceu melancolicamente as mentes tenras do inocente último detentor garoto menino milenar curador arquivista folclórico dos mortos do planeta. A sua amargurada recusa de mudar. Aang quer homenagear seu desespero religioso celebrando intactamente como seus falecidos tios milenares imortais no grandioso, arcaico e perigoso ritual litúrgico cerimonial ancestral banquete feriado e dançante da Deusa Feroz grandiosa de poder celestial, O dia em rito e Festival da antiga Monja Yangchen. Infelizmente a amargura ressoa pois os seus bosques intocáveis divinos sagrados florestais abençoados pelo panteão estavam desprovidas, destroçadas de ferro desmatadas ou esvaziados escavados as entranhas sujas nos leitos pelos poços fedorentos trituradores por imensas ganâncias, jazidas indústrias petroleiras cruéis pioneiras predatórias imensas escavações de minérios corporativas robóticas.\n\nAang reage relutante pela revolta e ódio incontrolável renegando a crueldade da imensa civilização poluída maquinada humana ferrenho conflitando no moral teológico no choque de aceitar o inexorável e veloz brutalidade em avanço de modernidade e sua conservacionista utopia passadista ecológica pacata de monges sagrados, compreendendo ao lutar colisão dos ciúmes da saudades contra o doloroso dever de crescer ao novo.'
    }
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EpicNationsSection = ({ setActiveElement }: { setActiveElement: (el: string) => void }) => {
  const [selectedNation, setSelectedNation] = useState<EpicNationData | null>(null);

  // Fecha modal com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedNation(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <section className="relative w-full overflow-hidden" style={{ backgroundColor: '#0b0e14' }}>
        <div className="w-full grid mx-auto grid-cols-1 md:grid-cols-4 h-full md:h-[550px]">
          {EPIC_NATIONS.map((nation, i) => (
            <motion.div key={nation.name} className="relative group overflow-hidden h-[350px] md:h-full cursor-pointer border-r border-[#c2b29a]/20 last:border-0"
              onHoverStart={() => setActiveElement(nation.id)}
              onHoverEnd={() => setActiveElement('none')}
              onClick={() => setSelectedNation(nation)}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 1 }}>
              
              {/* Container da Imagem com Moldura de Pergaminho */}
              <div className="absolute inset-0 w-full h-full p-2 bg-[#1a120b]">
                <div className="relative w-full h-full overflow-hidden border-[10px] border-[#dcb670]/20 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={nation.image} alt={nation.name}
                    className="absolute inset-0 w-full h-full object-cover transform scale-[1.15] group-hover:scale-[1.25] transition-transform duration-[2s] ease-out brightness-75 contrast-[1.1] sepia-[0.2] group-hover:sepia-0 group-hover:brightness-110" />
                  
                  {/* Overlay de Textura de Papel para unificar as artes */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
                </div>
              </div>

              {/* Overlays cinematográficos Parchment */}
              <div className="absolute inset-0 bg-[#e6dec1]/20 group-hover:bg-[#e6dec1]/0 transition-colors duration-[1s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2c1e16] via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-1000" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-[1px] h-16 bg-[#dcb670] mb-8 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-bottom shadow-[0_0_10px_rgba(220,182,112,0.8)]" />

                <h4 className="text-3xl lg:text-4xl font-bold tracking-[0.2em] mb-4 uppercase transition-transform duration-700 group-hover:-translate-y-3"
                  style={{ fontFamily: 'var(--font-cinzel), serif', textShadow: '0 4px 15px rgba(0,0,0,0.8)' }}>
                  {nation.name}
                </h4>

                <p className="text-lg italic max-w-[220px] transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[0.8s] delay-100 text-gray-200 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] font-lora">
                  {nation.philosophy}
                  <br />
                  <span className="text-xs uppercase tracking-[0.4em] font-bold text-[#dcb670] not-italic mt-6 block opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-300">Explorar Livros</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MODAL DETALHADO DA NAÇÃO LORE (ESTILO PERGAMINHO E HQs) */}
      <AnimatePresence>
        {selectedNation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setSelectedNation(null)}
          >
            {/* Backdrop com desfoque e uma cor de textura leve */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <motion.div
              className="relative w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-[#c2b29a]/40 rounded"
              style={{
                backgroundColor: '#f4ebd8',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
              }}
              initial={{ y: 30, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-y-auto custom-scrollbar flex-1">
                {/* Header Imersivo do Modal - Reduzido o topo da imagem para não cobrir a imensidão */}
                <div className="relative h-48 md:h-64 shrink-0 border-b-2 border-[#c2b29a]/50">
                  <div className="absolute inset-0 bg-[#2c1e16]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedNation.image}
                      alt={selectedNation.name}
                      className="w-full h-full object-cover opacity-80 mix-blend-overlay grayscale-[30%] object-top"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#f4ebd8] via-[#f4ebd8]/40 to-transparent" />
                  
                  {/* Título sobre a imagem */}
                  <div className="absolute bottom-0 w-full text-center pb-8 pt-12 bg-gradient-to-t from-[#f4ebd8] to-transparent">
                    <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-[0.2em] text-[#2c1e16]"
                      style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      {selectedNation.name}
                    </h3>
                    <div className="w-24 h-[2px] bg-[#dcb670] mx-auto mt-4" />
                  </div>
                </div>

                {/* Conteúdo do Pergaminho */}
                <div className="p-8 md:p-16 pb-24 text-[#5c4a3e] max-w-4xl mx-auto flex flex-col gap-16">
                  
                  {/* Seção 1: Cultura & Filosofia */}
                  <div className="relative">
                    <h4 className="flex items-center justify-center gap-4 text-xl tracking-[0.3em] uppercase font-bold text-[#991b1b] mb-10 text-center" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      <span className="w-16 h-[1px] bg-[#991b1b]/40" />
                      Cultura & Etimologia
                      <span className="w-16 h-[1px] bg-[#991b1b]/40" />
                    </h4>
                    <div className="text-lg leading-relaxed font-serif text-[#4a3d34] space-y-6">
                      {selectedNation.lore.culture.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className={idx === 0 ? "first-letter:text-6xl first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:text-[#991b1b] first-letter:mt-[-4px]" : ""}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Seção 2: O Caminho da Dobra */}
                  <div className="relative">
                    <h4 className="flex items-center justify-center gap-4 text-xl tracking-[0.3em] uppercase font-bold text-[#991b1b] mb-10 text-center" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      <span className="w-16 h-[1px] bg-[#991b1b]/40" />
                      A Arte da Dobra
                      <span className="w-16 h-[1px] bg-[#991b1b]/40" />
                    </h4>
                    <div className="text-lg leading-relaxed font-serif text-[#4a3d34] space-y-6">
                      <div className="text-center italic text-xl text-[#991b1b] mb-10 px-8 opacity-90 font-medium">
                        &quot;{selectedNation.philosophy}&quot;
                      </div>
                      {selectedNation.lore.bending.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* Seção 3: Registros Canônicos */}
                  <div className="bg-[#e6dec1]/40 border border-[#c2b29a]/50 p-8 md:p-12 rounded-sm shadow-inner relative mt-4">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#f4ebd8] px-4 text-[#991b1b] font-bold tracking-widest text-[10px] md:text-xs uppercase shadow-sm border border-[#c2b29a]/40 whitespace-nowrap">
                      Registros Canônicos Oficiais
                    </div>
                    <h4 className="text-lg tracking-[0.2em] uppercase font-bold text-[#2c1e16] mb-6 text-center" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      Evolução Pós-Guerra (HQs)
                    </h4>
                    <div className="text-base md:text-lg leading-relaxed font-serif text-[#4a3d34] italic space-y-6">
                      {selectedNation.lore.comics.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Botão Flutuante de Fechar Estilo Pergaminho (Selo) */}
              <button
                onClick={() => setSelectedNation(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-[#2c1e16] text-[#e6dec1] flex items-center justify-center rounded-full hover:bg-[#991b1b] hover:text-white hover:scale-110 transition-all border-2 border-[#e6dec1] shadow-[0_4px_10px_rgba(0,0,0,0.3)] z-50 group"
                aria-label="Ignorar Período Histórico"
              >
                <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// FOOTER — Pergaminho Final
// ═══════════════════════════════════════════════════════════
const EpicFooter = () => (
  <footer className="relative py-24 px-6 text-center overflow-hidden bg-[#0a101a] border-t border-white/5">
    {/* Decoração sutil de fundo */}
    <div className="absolute inset-0 flex justify-center items-center opacity-[0.03] pointer-events-none">
      <span className="text-[300px] text-white" style={{ fontFamily: 'var(--font-cinzel), serif' }}>A</span>
    </div>

    <motion.div className="mb-12 w-16 h-16 mx-auto opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-pointer"
      animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
      <TuiAndLaInk size={64} activeElement="water" />
    </motion.div>

    <h2 className="text-2xl md:text-3xl font-black mb-8 text-white uppercase tracking-widest" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
      &quot;A sabedoria vem não do poder,<br className="hidden md:block" /> mas da compreensão.&quot;
    </h2>

    <div className="w-8 h-[2px] mx-auto bg-[#dcb670] mb-8"></div>

    <div className="text-[10px] md:text-xs space-y-3 text-white/40 uppercase tracking-[0.4em] font-bold">
      <p>Um projeto dedicado ao Universo das Quatro Nações.</p>
      <p>Bending The Elements Since 2005.</p>
    </div>

    <div className="mt-16 text-[9px] text-white/20 tracking-[0.5em] uppercase font-bold">
      © {new Date().getFullYear()} Avatar Chronicles. All Rights Reserved.
    </div>
  </footer>
);

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL (Rastreando o Mouse Global)
// ═══════════════════════════════════════════════════════════
export default function EpicHomePage() {
  const [activeElement, setActiveElement] = useState('none');

  // Rastreamento suave do mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    // Definimos posição central inicial apenas no cliente para evitar mismatch de hydration
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);
  }, [mouseX, mouseY]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden font-lora bg-[#0a101a]" 
      onMouseMove={handleMouseMove}>
      <Navbar />
      <EpicHeroSection activeElement={activeElement} setActiveElement={setActiveElement} mouseX={smoothX} mouseY={smoothY} />
      <NationLeaderboard />
      <EpicModulesSection setActiveElement={setActiveElement} />
      <EpicNationsSection setActiveElement={setActiveElement} />
      <EpicFooter />
    </main>
  );
}