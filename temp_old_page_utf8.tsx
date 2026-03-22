/**
 * src/app/page.tsx
 *
 * Portal Avatar ÔÇö Mapa Vivo
 * O mapa respira e reage sutilmente ao mouse. 
 * Ilumina├º├úo ambiente adaptativa dependendo do elemento focado, sem exageros.
 */
'use client';

import React, { useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import UserDashboardWidget from '@/components/dashboard/UserDashboardWidget';

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// PALETA TERROSA E IMAGENS ├ëPICAS
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
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
  water: '/assets/nation_water_1771657146908.png',
  earth: '/assets/nation_earth_1771657163486.png',
  fire: '/assets/nation_fire_1771657181321.png',
  air: '/assets/nation_air_1771657196619.png',
};

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// TUI & LA ÔÇö PEIXES KOI DIN├éMICOS
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
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
      {/* C├¡rculo sutil expandindo e contraindo como respira├º├úo */}
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


// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// AS 4 RUNAS DOS ELEMENTOS (AVATAR)
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const ElementalRunes = ({ activeElement, mouseX, mouseY }: any) => {
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

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// PART├ìCULAS ELEMENTAIS ANIMADAS (Atmosfera Viva)
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
const ElementalParticles = () => {
  // Gera part├¡culas pre-comutadas para performance com posi├º├Áes pseudo-aleat├│rias
  const particles = useMemo(() => {
    // Reduzimos um pouco a quantia para compensar o detalhamento visual
    return Array.from({ length: 45 }).map((_, i) => {
      const type = i % 4; // 0: Fire, 1: Water, 2: Air, 3: Earth
      return {
        id: i,
        type,
        x: Math.random() * 100, // %
        y: Math.random() * 100, // %
        // AUMENTADO - tamanho base maior
        size: Math.random() * (type === 3 ? 12 : 8) + 4,
        duration: Math.random() * 8 + (type === 2 ? 3 : 7), // Ar ├® mais r├ípido
        delay: Math.random() * 4,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {particles.map((p: any) => {
        // --- 0: FOGO (Brasas quentes distorcidas pelo calor) ---
        if (p.type === 0) {
          return (
            <motion.div key={p.id} className="absolute"
              style={{
                left: `${p.x}%`,
                width: p.size,
                height: p.size * (1 + Math.random()), // Um pouco el├¡ptica pelo vento ascendente
                backgroundColor: Math.random() > 0.5 ? '#ff8b42' : '#ff4224', // Mistura laranjas e vermelhos
                borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', // Forma org├ónica de fuligem
                filter: 'drop-shadow(0px 0px 8px rgba(255, 66, 36, 1)) blur(0px)', // BEM vis├¡vel
                opacity: 1 // N├úo come├ºa transparente
              }}
              animate={{
                y: [`${p.y}vh`, `${p.y - 30}vh`, `${p.y - 70}vh`],
                x: [`${p.x}%`, `${p.x + (Math.random() * 8 - 4)}%`, `${p.x + (Math.random() * 12 - 6)}%`],
                opacity: [0, 1, 0], // Vai at├® 1
                scale: [1, Math.random() * 2 + 1, 0.5] // Brasa engorda logo antes de sumir
              }}
              transition={{ duration: p.duration * 0.8, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
            />
          );
        }

        // --- 1: ├üGUA (Got├¡culas de orvalho, formato lagrima) ---
        if (p.type === 1) {
          return (
            <motion.div key={p.id} className="absolute"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size * 1.5, // Mais comprido para parecer Gota
                // Est├®tica de gota estilo vidro MUITO MAIS CLARA
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,1), rgba(138, 196, 226, 0.8))',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                filter: 'drop-shadow(0px 6px 6px rgba(90, 158, 196, 0.9))',
                opacity: 0.9 // Come├ºa forte
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
                width: p.size * 35, // Fio BEM longo
                height: Math.max(2, p.size / 2), // Mais gordinho para n├úo sumir no fundo
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)', // Branc├úo mais forte
                filter: 'blur(2px)', // Menos blur pra ficar n├¡tido
                transform: `rotate(${Math.random() * 25 - 12}deg)` // Diagonal maior
              }}
              animate={{ x: ['-30vw', '130vw'], opacity: [0, 0.7, 0] }} // Muito mais opaco e viaja mais longe
              transition={{ duration: p.duration * 0.35, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          );
        }

        // --- 3: TERRA (Detritos poligonais r├║sticos que flutuam densos) ---
        if (p.type === 3) {
          // Gera├º├úo de formas variadas pro detrito de terra (Losangos, pol├¡gonos irregulares)
          const shapes = [
            'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', // Trapezoid
            'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', // Pentagon
            'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' // Diamond
          ];
          const shape = shapes[Math.floor(Math.random() * shapes.length)];
          const color = Math.random() > 0.5 ? '#6a5a40' : '#8a775c'; // Dois tons de barro/terra

          return (
            <motion.div key={p.id} className="absolute"
              style={{
                left: `${p.x}%`,
                width: p.size * 1.5, // Nacos BEM grand├Áes
                height: p.size * 1.5,
                backgroundColor: color,
                clipPath: shape,
                opacity: 0.9, // Bem vis├¡vel
                filter: 'drop-shadow(3px 4px 4px rgba(0,0,0,0.8))' // Sombra r├¡gida super escura
              }}
              animate={{
                y: [`${p.y - 15}vh`, `${p.y + 45}vh`], // Caindo bem longe
                x: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`],
                rotate: [0, Math.random() > 0.5 ? 720 : -720], // Gira mto mais pra mostrar a textura de pedra
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

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// HERO SECTION INTERATIVA ÔÇö ESTILO AVATAR STUDIOS OFFICIAL
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const EpicHeroSection = ({ activeElement, setActiveElement, mouseX, mouseY }: any) => {
  const { data: session, status } = useSession();

  const scrollToQuiz = () => {
    window.location.href = '/quiz';
  };

  const scrollToModules = () => {
    document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Parallax super sutil para dar profundidade atmosf├®rica
  const bgX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-15, 15]);
  const bgY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-15, 15]);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center p-8 text-center overflow-hidden bg-[#161a25]">

      {/* ­ƒîƒ FUNDO CINEMATOGR├üFICO EM LOOP (ESTILO AVATAR STUDIOS) ­ƒîƒ */}
      <motion.div
        className="absolute inset-[-50px] z-0 pointer-events-none"
        style={{ x: bgX, y: bgY }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/hero_spirit_world_1771657132063.png"
          alt="Avatar Epic Scenery"
          className="w-full h-full object-cover opacity-60"
        />
        {/* Overlay Azul Marinho Profundo exato do Avatar Studios -> rgb(36, 42, 60) misturado com preto */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161a25] via-[#242a3c]/70 to-[#161a25]/90" />
      </motion.div>

      {/* Part├¡culas Elementais sutis no Background */}
      <ElementalParticles />

      {/* T├¡tulo e Logo (Com inspira├º├úo clara na caligrafia 'Spirit Wilds') */}
      <motion.div className="relative z-10 flex flex-col items-center justify-center mt-12"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>

        <h2 className="mb-2 text-sm md:text-md uppercase tracking-[0.6em] font-bold text-gray-400"
          style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          Nickelodeon
        </h2>

        <h1 className="mb-8 text-6xl md:text-8xl font-black tracking-tight text-white uppercase"
          style={{
            fontFamily: 'var(--font-cinzel), serif',
            textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)',
            letterSpacing: '0.05em'
          }}>
          Avatar <br />
          <span className="text-4xl md:text-6xl text-[#dcb670] tracking-widest block mt-4" style={{ textShadow: '0 4px 15px rgba(220, 182, 112, 0.4)' }}>
            Studios
          </span>
        </h1>

        {/* Os 4 Elementos Alinhados Horizontalmente (Estilo site oficial) */}
        <div className="flex items-center justify-center gap-8 md:gap-16 mb-16 mt-4">
          <div className="text-4xl hover:scale-125 transition-transform duration-300 cursor-pointer drop-shadow-[0_0_15px_rgba(90,158,196,0.8)] filter grayscale hover:grayscale-0">­ƒîè</div>
          <div className="text-4xl hover:scale-125 transition-transform duration-300 cursor-pointer drop-shadow-[0_0_15px_rgba(160,184,76,0.8)] filter grayscale hover:grayscale-0">Ôø░´©Å</div>
          <div className="text-4xl hover:scale-125 transition-transform duration-300 cursor-pointer drop-shadow-[0_0_15px_rgba(255,106,66,0.8)] filter grayscale hover:grayscale-0">­ƒöÑ</div>
          <div className="text-4xl hover:scale-125 transition-transform duration-300 cursor-pointer drop-shadow-[0_0_15px_rgba(242,197,106,0.8)] filter grayscale hover:grayscale-0">­ƒî¬´©Å</div>
        </div>

        {/* CONDI├ç├âO: Logado mostra Dashboard / N├úo logado mostra Bot├úo */}
        {status === 'loading' ? (
          <div className="h-40 w-full max-w-2xl mx-auto rounded-xl bg-white/5 animate-pulse mt-8" />
        ) : session?.user ? (
          <div className="w-full mt-4 mb-16 relative z-20">
            <UserDashboardWidget />
          </div>
        ) : (
          <>
            {/* CTA Principal - "Take the Bending Quiz" em Dourado Pergaminho */}
            <motion.button
              onClick={scrollToQuiz}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-12 py-5 text-sm md:text-lg font-bold tracking-[0.2em] uppercase transition-all duration-300 text-[#161a25] shadow-[0_0_40px_rgba(220,182,112,0.3)] hover:shadow-[0_0_60px_rgba(220,182,112,0.6)]"
              style={{
                backgroundColor: '#dcb670', // Cor de pergaminho/dourado
                fontFamily: 'var(--font-cinzel), serif',
                clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)', // Simula borda decorativa asi├ítica
                border: 'none'
              }}>
              Descubra Seu Elemento
            </motion.button>

            {/* Sub Bot├úo "Explore More" est├®tico */}
            <div className="mt-8 text-gray-400 text-xs tracking-widest uppercase mb-16 cursor-pointer hover:text-white transition-colors" onClick={scrollToModules}>
              Explorar o Universo
            </div>
          </>
        )}

      </motion.div>

      {/* Indicador de Scroll no canto inferior esquerdo */}
      <div className="absolute bottom-8 left-8 flex flex-col items-center gap-2 opacity-60">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white transform -rotate-90 origin-bottom mb-8">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-white"
        />
      </div>

    </section>
  );
};

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// M├ôDULOS ÔÇö Cards Fotogr├íficos Emoldurados
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
interface EpicModuleCard {
  title: string; subtitle: string; description: string;
  image: string; href: string; element: string;
}

const EPIC_MODULES: EpicModuleCard[] = [
  {
    title: 'O Chamado Espiritual', subtitle: 'Teste de Afinidade', element: 'none',
    description: 'Responda a perguntas comportamentais profundas para descobrir a qual das Quatro Na├º├Áes o seu esp├¡rito realmente pertence.',
    image: '/assets/hero_spirit_world_1771657132063.png',
    href: '/quiz',
  },
  {
    title: 'Pai Sho', subtitle: 'Jogo de Tabuleiro', element: 'earth',
    description: 'Jogue online o milenar jogo de mesa da Ordem do L├│tus Branco. Alinhe os l├│tus de pedra contra a Intelig├¬ncia Artificial e comprove sua maestria.',
    image: '/assets/nation_earth_1771657163486.png',
    href: '/arena/pai-sho',
  },
  {
    title: 'Pergaminhos Antigos', subtitle: 'Simulador Interativo', element: 'water',
    description: 'Um ambiente interativo de treino. Estude visualmente o fluxo da ├ígua, terra, fogo e ar praticando na tela as exatas posturas marciais das dobras.',
    image: '/assets/nation_water_1771657146908.png',
    href: '/arena/bending-practice',
  },
  {
    title: 'Pergaminhos de Wan Shi Tong', subtitle: 'Trivia de Esfor├ºo (Quiz)', element: 'fire',
    description: 'Um segundo teste, mas focado puramente em conhecimentos! Apenas os f├ús mais hardcore conseguir├úo gabaritar este Quiz de 48 quest├Áes de alt├¡ssima dificuldade.',
    image: '/assets/nation_fire_1771657181321.png',
    href: '/arena/trivia',
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EpicModulesSection = ({ setActiveElement }: any) => (
  <section id="modules" className="relative py-32 px-6 md:px-12 bg-[#161a25]">
    {/* Fundo Atmosf├®rico Dark */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#161a25] via-[#1d2232] to-[#161a25] opacity-50 z-0" />

    <motion.div className="text-center mb-24 relative z-10"
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
      <h2 className="text-sm uppercase tracking-[0.6em] mb-4 text-[#dcb670] font-bold" style={{ fontFamily: 'var(--font-cinzel), serif', textShadow: '0 0 10px rgba(220,182,112,0.3)' }}>Os Arquivos Secretos</h2>
      <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
        Jornada do Conhecimento
      </h3>
      <div className="mx-auto w-16 h-[2px] mt-8 bg-[#dcb670] shadow-[0_0_15px_rgba(220,182,112,0.5)]"></div>
    </motion.div>

    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
      {EPIC_MODULES.map((mod, i) => (
        <motion.div key={mod.href}
          onHoverStart={() => setActiveElement(mod.element)}
          onHoverEnd={() => setActiveElement('none')}
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.8 }}>
          <Link href={mod.href} className="group block h-full">
            <div className="relative flex flex-col h-full rounded-xl overflow-hidden bg-[#1d2232]/80 backdrop-blur-sm transition-all duration-[0.8s] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:-translate-y-2 border border-white/5 hover:border-[#dcb670]/30 group-hover:bg-[#242a3c]">

              <div className="relative h-72 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d2232] via-transparent to-transparent z-10 group-hover:from-transparent transition-all duration-700" />
                <div className="absolute inset-0 bg-[#000]/40 group-hover:bg-transparent transition-colors duration-700 z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mod.image} alt={mod.title} className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-[1.5s] ease-out filter brightness-75 group-hover:brightness-100" />
              </div>

              <div className="p-10 flex-1 flex flex-col justify-between border-t border-white/5 transition-colors duration-500 relative z-20 -mt-10 bg-gradient-to-b from-transparent to-[#1d2232] group-hover:to-[#242a3c]">
                <div>
                  <div className="text-xs uppercase tracking-[0.4em] font-bold mb-3 text-[#dcb670] group-hover:text-white transition-colors duration-500">
                    {mod.subtitle}
                  </div>
                  <h4 className="text-3xl font-bold mb-5 text-white tracking-wide" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    {mod.title}
                  </h4>
                  <p className="text-base leading-relaxed text-gray-400">
                    {mod.description}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm uppercase tracking-widest text-[#dcb670] font-bold group-hover:text-white transition-colors duration-300">
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">Explorar M├│dulo</span>
                  <span className="transform group-hover:translate-x-4 transition-transform duration-300">ÔåÆ</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// GALERIA DAS NA├ç├òES ÔÇö GRANDIOSA
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
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
    name: 'Tribo da ├ügua', id: 'water', philosophy: '"A ├ígua ├® o elemento da mudan├ºa."', image: NATION_IMAGES.water,
    lore: {
      culture: 'Isolada nos polos glaciais do Norte e do Sul, a Tribo da ├ügua reflete as adversidades do ambiente impiedoso onde habita. A Tribo do Norte ├® uma sociedade patriarcal estratificada (onde originalmente as mulheres eram proibidas de combater e focadas apenas na cura), blindada por pared├Áes de gelo colossais em Agna Qel\'a.\n\nJ├í a Tribo do Sul, desolada por sucessivos e brutais ataques da Na├º├úo do Fogo, viu seus guerreiros partirem e seus dobradores serem exterminados. Separadamente no cora├º├úo do Reino da Terra, jaz a rudimentar Tribo do P├óntano Nebuloso, que mant├®m sua ancestral cren├ºa animista de que todas as coisas do ecossistema est├úo conectadas pela mesma rede de ra├¡zes subterr├óneas (Banyan-Grove Tree). Esteticamente, seu povo ├® fortemente inspirado nas indument├írias inu├¡tes, i├║piques e nas comunidades nativo-norte-americanas.',
      bending: 'Os primeiros dobradores de ├ígua n├úo aprenderam com bestas animais (como os outros), mas observando fascinados como os Esp├¡ritos Originais da Lua (Tui - o impulso) e do Oceano (La - a tra├º├úo) moviam as mar├®s atrav├®s de um ritmo suave, percutor e gravitacional, representado pela Carpa Koi Branca e Preta.\n\nBaseada fisicamente na arte milenar do Tai Chi Chuan de Yang e Chen, as formas da dobra fluem cont├¡nuas; o lutador raramente para os ataques inimigos; ele os redireciona circularmente, aproveitando a for├ºa contra o agressor at├® a mar├® se voltar para esmag├í-lo de forma impiedosa.\n\nSub-dobras not├íveis: Sangue (Bloodbending, descoberta pela prisioneira Hama para controlar o corpo humano atrav├®s dos fluidos corporais nas noites de Lua Cheia, posteriormente banida mas infamemente dominada pela m├ífia de Yakone), Cura (redirecionamento de chi por meio de ├ígua benta para selar ferimentos) e Esp├¡ritos (Spiritbending, originada no Norte e aperfei├ºoada por Unalaq, uma t├®cnica espiritual que harmoniza ou subverte entidades do Mundo Espiritual).',
      comics: 'A s├®rie e as HQs mergulham profundo na evolu├º├úo desta na├º├úo e a cis├úo de suas tribos irm├ús.\n\nNa trilogia can├┤nica "Norte e Sul" (North and South), vemos Hakoda sendo estabelecido como o primeiro grande Cacique Chefe do Polo Sul unificado. Durante seu governo provis├│rio, somos arremessados num dilema de modernidade: acompanhamos a Tribo do Sul passando por um colossal projeto de expans├úo urbana e industrializa├º├úo em massa financiado e liderado secretamente pelo Norte (atrav├®s da arquiteta Malina). Essa brusca ocidentaliza├º├úo e a intromiss├úo cultural geram protestos e rachaduras extremas. Um ex├®rcito de nacionalistas conservadores do Sul liderados por Gilak atua em violentos atentados para destruir as m├íquinas.\n\nAs consequ├¬ncias dessa interfer├¬ncia estrangeira e desse protecionismo xenof├│bico pavimentaram os alicerces definitivos da hist├│rica Guerra Civil da Tribo da ├ügua, um conflito religioso-governamental visto intensamente v├írias d├®cadas depois na Lenda de Korra, onde os sulistas, encabe├ºados por Tonraq (pai de Korra), cortam la├ºos com o corrupto l├¡der ├Ünalaq do Norte para declarar plena, absoluta e permanente independ├¬ncia do Sul.'
    }
  },
  {
    name: 'Reino da Terra', id: 'earth', philosophy: '"A terra ├® o elemento da subst├óncia."', image: NATION_IMAGES.earth,
    lore: {
      culture: 'O maior, mais populoso e fragmentado continente geogr├ífico do Mundo de Avatar. De um lado representa um orgulhoso e robusto imp├®rio pautado pela pura resili├¬ncia. De outro, uma vastid├úo de terras dilaceradas por um governo central mon├írquico absolutista corrupto ou inefetivo, contendo dezenas de prov├¡ncias semi-dependentes.\n\nO imp├®rio concentra-se ao redor da quase impenetr├ível capital Ba Sing Se, "a cidade inalcan├º├ível". Nela, encontramos uma aristocracia brutalmente estratificada em an├®is murados segregacionais, governada secretamente pelas sombras do Minist├®rio da Cultura e pelo seu cruel l├¡der Long Feng ÔÇö que comanda a Dai Li, pol├¡cia secreta de elite capaz de lavagem cerebral sist├¬mica no subterr├óneo (Lago Laogai) para ocultar do inocente Rei Kuei que h├í d├®cadas vigora a brutal "guerra do lado de fora". O continente tamb├®m abriga Omashu regida pelo g├¬nio centen├írio exc├¬ntrico Rei Bumi, desertos abrasadores como Si Wong, a m├¡tica Ilha das Guerreiras Kyoshi e pr├│speras inova├º├Áes aut├┤nomas como a redoma de metal Zaofu do Cl├ú Beifong. Inspirada fortemente na hist├│ria da China Imperial (Dinastias Qing e Ming).',
      bending: 'O dom├¡nio sobre a rocha det├®m sua g├¬nese nos lend├írios primeiros amantes Oma e Shu (que fundaram Omashu), mas tecnicamente foi forjado pela humanidade copiando o viver cego e subterr├óneo das tit├ónicas Toupeiras-Texugo nas cavernas sombrias. O Avatar e a jovem matriarca do metal, Toph Beifong, s├úo os mestres absolutos que compreendem a ess├¬ncia milenar da terra: o "Jing Neutro". Trata-se de uma coragem pautada em brutal e estoica paci├¬ncia.\n\nUm dobrador de terra ├® moldado focado no estilo de Kung-fu Hung Gar (Postura Cavalo): fincando os p├®s com a firmeza de uma montanha inabal├ível absorto a receber duros ataques para apenas, na exat├¡ssima e ├¡nfima fra├º├úo de milissegundo favor├ível, contra-atacar explodindo uma avassaladora for├ºa geom├®trica.\n\nSub-dobras formid├íveis nasceram disto: Dobra de Metal (Metalbending, onde se dobra os min├║sculos res├¡duos minerais impuros encrustados dentro das grossas ligas de a├ºo ou meteoritos), a aterrorizante Dobra de Magma/Lava (Lavabending, raras muta├º├Áes termodin├ómicas geol├│gicas inatas apenas em benders extremos como o letal Ghazan e, posteriormente, Bolin) e o refinado e quase cego Senso S├¡smico ÔÇö que atua vibrando passos a quil├┤metros convertidos por radar como o pol├¡grafo humano de mentiras infal├¡vel.',
      comics: 'As complexas HQs atestam que o encerramento b├®lico na era de Aang estava a cent├¡metros de se desolar numa reca├¡da de guerra civil.\n\nNa formid├ível prequela em tirinhas de "A Promessa" (The Promise), exploramos detalhadamente os primeiros meses do complexo "Movimento de Restaura├º├úo da Harmonia". O rec├®m-recobrado e agora assertivo Rei Kuei da Terra, exige com nacionalismo febril que a coliga├º├úo de Zuko repatrie obrigatoriamente cidad├úos e desmonte da noite para o dia a secular presen├ºa vulc├ónica de invasores em seu territ├│rio em cidades historicamente invadidas como Yu Dao. Contudo, em Yu Dao, um colossal choque inter-relacional transparece: Aang descobre horrorizado um gigantesco cadinho racial. Fogo e Terra convivendo, casando em neg├│cios pr├│speros com proles nativas miscigenadas amparadas na multiculturalidade por longas e cont├¡nuas quatro gera├º├Áes inteiras de paz local.\n\nO desfecho choca: a Equipe Avatar confronta amargamente preceitos da pureza ideol├│gica percebendo ser imposs├¡vel ser moralista ou "extirpar pacificamente o impuro" das fronteiras terrestres, decidindo formar um acordo conjunto inominado para a auto-determina├º├úo e governo aut├┤nomo. Tal semente floresce, tornando as Col├┤nias no alicerce neutro da grande Na├º├úo da Rep├║blica Unida fundada pelas Leis do Avatar (que 70 anos depois, ├® o principal polo do Avatar Korra).'
    }
  },
  {
    name: 'Na├º├úo do Fogo', id: 'fire', philosophy: '"O fogo ├® o elemento do poder."', image: NATION_IMAGES.fire,
    lore: {
      culture: 'Outrora uma comunidade fervorosa e altamente espiritual guiada pelo sublime senso de uni├úo existencial ao redor do sol vivificador dos deuses primitivos (como reclusa Tribo Guerreira do Sol), a Na├º├úo do Fogo sofreu um sequestro filos├│fico macabro liderado pela megalomania letal da Linhagem do ditador Sozin. Numa era pioneiramente favorecida pela revolu├º├úo industrial naval b├®lica a carv├úo-mineral ardente (tanques sobre esteiras blindadas Tundra e engenharia a├®rea de cruzadores War Ballons inspirados no Ocidente industrial imperialista Gr├ú-Bretanha/Alemanha), instilou-se um projeto totalit├írio global sustentado na ideologiza├º├úo nacionalista da excel├¬ncia cultural prussiana e japonesa do expansionismo asi├ítico de Meiji.\n\nSeu arquip├®lago insular majestoso espalha-se predominantemente no t├│rrido meridiano equatorial com topografia de cordilheiras cobertas em lava fervente, contendo metr├│poles majestosas encravadas dentro de caldeiras e montanhas vulc├ónicas nativas (Como a letal Pris├úo de Rocha Fervente). Com suas honras distorcidas que priorizam a ordem ditatorial sobre os la├ºos parentais de sangue sagrado, ela instucionalizou em sua corte os impiedosos e impenetr├íveis julgamentos dos temidos duelos letais fratricidas, conhecidos pelos desfigurados de fogo como Agni Kai.',
      bending: 'Singular e brutal! Por instinto biol├│gico sagrado da cria├º├úo, a disciplina ├¡gnea exime do dobrador a depend├¬ncia externa elemental dos c├®us mortais: o pr├│prio ser humano cria e gera o seu combust├¡vel e o seu chamas letal internamente via correntes solares. Mas a real e espl├¬ndida ilumina├º├úo original ensinada s├®culos antes pelo voo dos Reis Drag├Áes Ran e Shao nas civilizadas chamas m├¡sticas fora sepultada atrav├®s das mentiras por ditadores. No auge sangrento da Guerra exaustiva Ozai instigou os monges guerreiros a n├úo respirarem luz c├│smica espiritual, mas alimentarem o calor usando a opressiva escurid├úo corrosiva puramente forjada de Rancor cont├¡nuo, Vingan├ºas dolorosas incontrol├íveis e ├ôdio focado sem sentimentos de miseric├│rdia e raiva desgovernada como os chackras geradores marciais de energia.\n\nConceitualmente sua agressividade irrefre├ível com passos vertiginosos amplos com acrobacias flamejantes velozes foi retirada inteiramente do mort├¡fero milenar estilo do vibrante Kung Fu Wushu e do estilo Shaolin do Norte Chin├¬s.\n\nSuas devastadoras e colossais variantes marciais exclusivas de Sub-dobras raras de linhagem pura: A Gera├º├úo Din├ómica de Raios Letal (Lightning Generation, tamb├®m chamada filosoficamente do sangrento "Fogo com seu Sangue-Frio" que estritamente condensa severas tempestades dos p├│los energ├®ticos corporais do yin-yang do duplo p├│lo em uma fuzilaria fatal a frio ÔÇö amplamente usada mais tarde em Usinas modernas por Mako e nas f├íbricas tecnol├│gicas em Cidade Rep├║blica) e o estranho fen├┤meno brutal indestrut├¡vel telecin├®tico chamado misticamente por Combust├úo Sincr├┤nica V├ícuo: raios destrutivos telepatas invis├¡veis explosivos deflagrados em alvos perfeitamente milim├®tricos pelo despertar ocular letal de chakras no terceiro olho das testas tatuadas de mercen├írios anarquistas impag├íveis como o insens├¡vel Sparky Sparky Boom Man ou da perversa monja aprisionada P\'Li.',
      comics: 'As imensas sequ├¬ncias ilustradas can├┤nicas sob a dinastia do rec├®m-empossado Lorde do Fogo Zuko se prop├Áem n├úo apenas como rito de apura├º├úo ideol├│gica pac├¡fica, como nos tr├ígicos mist├®rios psicol├│gicos que as s├®ries de inf├óncia n├úo abarcam de forma profunda.\n\nOs leais f├ús ganham de forma completa a continua├º├úo ├®pica familiar nas cruciais tramas HQs "A Busca" (The Search), revelando a exata resolu├º├úo lacunar de toda inf├óncia banida de Zuko: o desfecho chocante sumi├ºo na calada das tramas golpistas por Ursa. O desespero arrasta o monarca na desola├º├úo para apelar at├® em tr├®gua alian├ºada de favores com sua esquizofr├¬nica e paran├│ica e mort├¡fera jovem irm├ú Azula e um asilo para o resgate tortuoso embrenhados entre matagais amaldi├ºoados de perigosas quimeras bestiais de rosto de deuses de feiti├ºaria e Lobos-Esfinge onde repousava as ru├¡nas escondidas esquecidas do Esp├¡rito Anci├úo A M├úe dos Rostos (The Mother of Faces). Nos pesares m├ígicos de Ursa foi feito pactos mentais m├ígicos absolutos nas mem├│rias em seu subconsciente em abdica├º├úo da tortura impiedosa vivida de humilha├º├úo conjugal tr├ígica imposta pelos arranjos sangrentos a Azulon na calada noturna do Pal├ício para enfim exilar-se protegendo o afeto e sucess├úo da vida desamparada fr├ígil do inocente pr├¡ncipe primog├¬nito e sobreviver as cicatrizes apagando no amn├®sia dos passados.'
    }
  },
  {
    name: 'N├┤mades do Ar', id: 'air', philosophy: '"O ar ├® o elemento da liberdade."', image: NATION_IMAGES.air,
    lore: {
      culture: 'No antigo ecossistema geopol├¡tico pante├úo da terra milenar a etnia aben├ºoada N├┤made representava ativamente o irrefut├ível e absoluto z├¬nite incontest├ível iluminado da pacificidade. Tratavam-se historicamente nas altas estratosferas cota da vida o mais ut├│pico monote├¡smo biol├│gico isolacionado do relevo, de onde estritamente todos absolutamente, de todos mil nascituros provindos da casta sem excess├úo ou desajuste carnal a falharem detinham a b├¬n├º├úo original m├ígica nos pulsos de dominar espiritualmente os fluidos glaciais respirados dos C├®us celestes na aurora do voo ÔÇö virtude divina biomicranica gerada puramente nas entranhas na forte liga├º├úo do ├¬xtase de desapego e purezas das emo├º├Áes m├¡sticas dos r├║sticos.\n\nCom uma divis├úo geogr├ífica arquitet├┤nica esbelta esculpidas reclusamente invertidas e long├¡nquas da gan├óncia pecadora civil, foram edificadas em abismos picos rochosos quatro sant├¡ssimos templos catedrais segregados abadia ao compasso cardinal da geografia. Nestes vivia suas sev├¡cias pautadas a um forte e reverente estoicismo severo veganista (as irm├ús femininas monges de roupas aladas para abadias do Leste Oriental/Oeste). Nas caracter├¡sticas nativas com os fofos mam├¡feros herb├¡voros simbi├│ticos amig├íveis celestes os Bis├Áes dos ventos, cujos mestres seniores desenhavam ritualisticamente ao passar prova├º├Áes longas dolorosamente de maturidade em setas marcadoras da tatuagem glifal azul na epiderme imitando o animal. A fonte antropol├│gica inspiracional reverencial da cultura reflete uma singela ode e adora├º├úo pacifista as pacatas seitas de vida frugal e meditacionismo compassivo ascese dos pac├¡ficos povos distantes orientais monges calvos do Tibete Hindu/Budista.',
      bending: 'Evadir com esquivas acrob├íticas pac├¡ficas milim├®tricas para estressar agressores n├úo se igualando no confronto de danos impetuosos anulando impasses agressivos carnais mortais em seu fluxo natural cont├¡nuo intoc├ível gracioso e inesgot├ível.\n\nAs artes t├®cnicas ventosas graciosas flu├¡das ensinadas divinamente a do├ºura mon├ística foi doada das manadas divinas de imensos fi├®is bovinos celestes felpudos de caudas pesadas chamadas Bis├Áes Voadores. Semelhante filosoficamente de t├íticas de batalha evasivas esquivas na leveza veloz extrema coreografadas das escolas antigas orientais reias dos movimentos marciais mortais sem contraofensiva letal estilo paKua Chang - Baguazhang, de que uma investida hostil contundente r├¡gida com arestas ├® contornadas com o passo voador que usa um vasto circular rotacional do corpo do guerreiro n├┤made para varrer sem dor os joelhos e sugar e drenar nas frestas v├ícuas invis├¡veis dos furac├Áes o baque ou furor do sangue violento oponente com redemoinhos exatos cegantes dissipando atrito de socos atordoados pelo v├ícuo de pulm├úo denso sufocante num redemoinho.\n\nM├¡ticos subdobradores celestes das eras mortas s├úo escassos pela heresia em sua pureza das leis humanas morais. Desbloqueio Supremo O Voo da Leveza Extrema e Transcend├¬ncia Desprendida Flutuante: Descobrimento recitado misticamente nas montanhas em c├ónticos pelos monges arcanos da poema est├ítico de Guru Laghima para anular sem truques mec├ónicos parafisicos terrestres a tra├º├úo planet├íria letal: "Solte suas cordas terrenas. Entre no Vazio... Esvazie, e transforme a ventania sua subst├óncia"  Atingindo dolorosas mortes sentimentais e v├¡nculos irremedi├íveis em suas conex├Áes profundas dos apegos familiares inabal├íveis para tornar ao imaterial al├ºado impunemente, destravado em Korra no desolador cl├¡max com do assassino e perigoso terrorista e l├¡der anarquistas m├¡stico cego mortal liberto da pris├úo chamado L├│tus Vermelho mestre fan├ítico Zaheer livre do L├│tus.',
      comics: 'Ao transcorrer sombrio do ├írduo laborioso renascimento do povo dos abismos nevosos ap├│s s├®culos do tenebroso exterm├¡nio de cinza vulc├ónica promovida por Senhor Fogo de Cometas no repensamento nost├ílgico transi├º├úo ao industrial nas HQ de Avatar nas cr├┤nicas dram├íticas complexas profundas socioreligiosas da Trilogia "A Fenda" (The Rift):\n\nO leitor defronta de perto a sufocante amarga dor passional psicol├│gica fobia avassaladora e desesperan├ºosa ansiedade saudosista reacion├íria que adoeceu melancolicamente as mentes tenras do inocente ├║ltimo detentor garoto menino milenar curador arquivista folcl├│rico dos mortos do planeta. A sua amargurada recusa de mudar. Aang quer homenagear seu desespero religioso celebrando intactamente como seus falecidos tios milenares imortais no grandioso, arcaico e perigoso ritual lit├║rgico cerimonial ancestral banquete feriado e dan├ºante da Deusa Feroz grandiosa de poder celestial, O dia em rito e Festival da antiga Monja Yangchen. Infelizmente a amargura ressoa pois os seus bosques intoc├íveis divinos sagrados florestais aben├ºoados pelo pante├úo estavam desprovidas, destro├ºadas de ferro desmatadas ou esvaziados escavados as entranhas sujas nos leitos pelos po├ºos fedorentos trituradores por imensas gan├óncias, jazidas ind├║strias petroleiras cru├®is pioneiras predat├│rias imensas escava├º├Áes de min├®rios corporativas rob├│ticas.\n\nAang reage relutante pela revolta e ├│dio incontrol├ível renegando a crueldade da imensa civiliza├º├úo polu├¡da maquinada humana ferrenho conflitando no moral teol├│gico no choque de aceitar o inexor├ível e veloz brutalidade em avan├ºo de modernidade e sua conservacionista utopia passadista ecol├│gica pacata de monges sagrados, compreendendo ao lutar colis├úo dos ci├║mes da saudades contra o doloroso dever de crescer ao novo.'
    }
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EpicNationsSection = ({ setActiveElement }: any) => {
  const [selectedNation, setSelectedNation] = useState<EpicNationData | null>(null);

  return (
    <>
      <section className="relative w-full overflow-hidden bg-[#161a25]">
        <div className="w-full grid mx-auto grid-cols-1 md:grid-cols-4 h-full md:h-[700px]">
          {EPIC_NATIONS.map((nation, i) => (
            <motion.div key={nation.name} className="relative group overflow-hidden h-[400px] md:h-full cursor-pointer border-r border-[#ffffff05] last:border-0"
              onHoverStart={() => setActiveElement(nation.id)}
              onHoverEnd={() => setActiveElement('none')}
              onClick={() => setSelectedNation(nation)}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 1 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={nation.image} alt={nation.name}
                className="absolute inset-0 w-full h-full object-cover transform scale-[1.05] group-hover:scale-100 transition-transform duration-[2s] ease-out brightness-50 contrast-[1.1] grayscale-[20%] group-hover:grayscale-0 group-hover:brightness-90" />

              {/* Overlays cinematogr├íficos Dark Blue */}
              <div className="absolute inset-0 bg-[#0d0f16]/60 group-hover:bg-[#0d0f16]/20 transition-colors duration-[1s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f16] via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-1000" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-[1px] h-16 bg-[#dcb670] mb-8 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-bottom shadow-[0_0_10px_rgba(220,182,112,0.8)]" />

                <h4 className="text-3xl lg:text-4xl font-black tracking-[0.2em] mb-4 uppercase transition-transform duration-700 group-hover:-translate-y-3"
                  style={{ fontFamily: 'var(--font-cinzel), serif', textShadow: '0 4px 20px rgba(0,0,0,1)' }}>
                  {nation.name}
                </h4>

                <p className="text-lg italic max-w-[220px] transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[0.8s] delay-100 text-gray-300 drop-shadow-[0_2px_8px_rgba(0,0,0,1)] font-lora">
                  {nation.philosophy}
                  <br />
                  <span className="text-xs uppercase tracking-[0.4em] font-bold text-[#dcb670] not-italic mt-6 block opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-300">Explorar Lore Expandida</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MODAL DETALHADO DA NA├ç├âO LORE (HQs e S├®rie) */}
      <AnimatePresence>
        {selectedNation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-[#0d0f16]/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setSelectedNation(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#161a25] border border-white/10 rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.8)] custom-scrollbar"
              initial={{ y: 50, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Imersivo do Modal */}
              <div className="relative h-64 md:h-80 w-full overflow-hidden shrink-0">
                <motion.img
                  src={selectedNation.image}
                  alt={selectedNation.name}
                  className="w-full h-full object-cover brightness-75 scale-105"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161a25] via-[#161a25]/40 to-transparent" />
                <button
                  className="absolute top-6 right-6 text-white/50 hover:text-[#dcb670] transform hover:scale-110 transition-all z-10"
                  onClick={() => setSelectedNation(null)}
                >
                  <span className="text-4xl leading-none font-thin">&times;</span>
                </button>
                <div className="absolute bottom-6 left-8 md:left-12">
                  <h3 className="text-4xl md:text-5xl tracking-[0.1em] font-bold text-white mb-2 uppercase" style={{ fontFamily: 'var(--font-cinzel), serif', textShadow: '0 4px 20px rgba(0,0,0,1)' }}>
                    {selectedNation.name}
                  </h3>
                  <div className="text-[#dcb670] text-sm uppercase tracking-[0.4em] font-bold">
                    Arquivos Secretos Ô£ª Base Original & HQs
                  </div>
                </div>
              </div>

              {/* Corpo de Texto das Lores */}
              <div className="p-8 md:p-12 space-y-12 relative text-gray-300">
                {/* Linha Fina Direcional Decorativa */}
                <div className="absolute top-12 bottom-12 left-8 md:left-12 w-[1px] bg-gradient-to-b from-[#dcb670]/50 via-white/10 to-transparent" />

                <div className="relative pl-8 md:pl-10">
                  <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-[#dcb670] shadow-[0_0_10px_rgba(220,182,112,0.8)]" />
                  <h5 className="text-xs uppercase tracking-[0.3em] text-[#dcb670] mb-3 font-bold">Cultura e Sociedade</h5>
                  <p className="text-base md:text-lg leading-relaxed font-lora opacity-90 whitespace-pre-line">{selectedNation.lore.culture}</p>
                </div>

                <div className="relative pl-8 md:pl-10">
                  <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-[#dcb670] shadow-[0_0_10px_rgba(220,182,112,0.8)]" />
                  <h5 className="text-xs uppercase tracking-[0.3em] text-[#dcb670] mb-3 font-bold">T├®cnica e Filosofia (O Dom├¡nio)</h5>
                  <p className="text-base md:text-lg leading-relaxed font-lora opacity-90 whitespace-pre-line">
                    <span className="italic block mb-6 px-4 border-l-2 border-[#dcb670]/40 text-[#dcb670]/80">&quot;{selectedNation.philosophy}&quot;</span>
                    {selectedNation.lore.bending}
                  </p>
                </div>

                <div className="relative pl-8 md:pl-10">
                  <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-[#dcb670] shadow-[0_0_10px_rgba(220,182,112,0.8)]" />
                  <h5 className="text-xs uppercase tracking-[0.3em] text-[#dcb670] mb-3 font-bold">Eventos Can├┤nicos In├®ditos (HQs Oficiais e Korra)</h5>
                  <div className="p-6 md:p-8 bg-[#1d2232]/50 border border-white/5 rounded-lg shadow-inner">
                    <p className="text-base md:text-lg leading-relaxed font-lora opacity-90 whitespace-pre-line text-[#e2d5b8]">{selectedNation.lore.comics}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// FOOTER ÔÇö Pergaminho Final
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
const EpicFooter = () => (
  <footer className="relative py-24 px-6 text-center overflow-hidden bg-[#0d0f16] border-t border-white/5">
    {/* Decora├º├úo sutil de fundo */}
    <div className="absolute inset-0 flex justify-center items-center opacity-5 pointer-events-none">
      <span className="text-[300px]" style={{ fontFamily: 'var(--font-cinzel), serif' }}>A</span>
    </div>

    <motion.div className="mb-12 w-16 h-16 mx-auto opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-pointer"
      animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
      {/* Usando TuiAndLa com cor branca super discreta */}
      <TuiAndLaInk size={64} activeElement="water" />
    </motion.div>

    <h2 className="text-2xl md:text-3xl font-black mb-8 text-white uppercase tracking-widest" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
      &quot;A sabedoria vem n├úo do poder,<br className="hidden md:block" /> mas da compreens├úo.&quot;
    </h2>

    <div className="w-8 h-[2px] mx-auto bg-[#dcb670] mb-8 shadow-[0_0_10px_rgba(220,182,112,0.6)]"></div>

    <div className="text-xs md:text-sm space-y-3 opacity-50 text-gray-300 uppercase tracking-[0.2em]">
      <p>Um projeto dedicado ao Universo das Quatro Na├º├Áes.</p>
      <p>Bending The Elements Since 2005.</p>
    </div>

    <div className="mt-16 text-[10px] text-gray-600 tracking-widest uppercase">
      ┬® {new Date().getFullYear()} Avatar V-Platform. All Rights Reserved.
    </div>
  </footer>
);

// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
// COMPONENTE PRINCIPAL (Rastreando o Mouse Global)
// ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
export default function EpicHomePage() {
  const [activeElement, setActiveElement] = useState('none');

  // Rastreamento suave do mouse
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 500);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden font-lora" onMouseMove={handleMouseMove}>
      <Navbar />
      <EpicHeroSection activeElement={activeElement} setActiveElement={setActiveElement} mouseX={smoothX} mouseY={smoothY} />
      <EpicModulesSection setActiveElement={setActiveElement} />
      <EpicNationsSection setActiveElement={setActiveElement} />
      <EpicFooter />
    </main>
  );
}
