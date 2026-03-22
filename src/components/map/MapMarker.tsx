'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { MapLocation } from '@/lib/data/mapLocations';

// Cores baseadas na nação
const NATION_COLORS = {
  water: '#2563eb', // Azul
  earth: '#16a34a', // Verde
  fire: '#dc2626',  // Vermelho
  air: '#fcd34d'    // Amarelo
};

interface MapMarkerProps {
  location: MapLocation;
}

export const MapMarker = ({ location }: MapMarkerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const color = NATION_COLORS[location.nation];

  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
      style={{ left: `${location.x}%`, top: `${location.y}%` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pino Principal */}
      <motion.div 
        className="relative w-8 h-8 rounded-full border-2 border-[#f4ebd8] flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.8)]"
        style={{ backgroundColor: color }}
        whileHover={{ scale: 1.2 }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="w-2 h-2 rounded-full bg-white opacity-80" />
        {/* Efeito de pulso */}
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: color }}
        />
      </motion.div>

      {/* Legenda Estilo Cartografia (Fixa) */}
      <div 
        className="absolute top-10 left-1/2 -translate-x-1/2 w-max pointer-events-none transition-opacity duration-300"
        style={{
          color: '#f4ebd8',
          textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.8)',
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: '0.8rem', // Bem delicado
          fontWeight: 'bold',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          opacity: isHovered ? 0 : 0.9 // Esconde a legenda base quando o tooltip grande abre
        }}
      >
        {location.name}
      </div>

      {/* Tooltip (Pergaminho) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute left-1/2 bottom-full mb-4 w-64 -translate-x-1/2 pointer-events-none"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="p-4 rounded border-2 shadow-2xl relative"
              style={{
                backgroundColor: '#fbf4e6',
                borderColor: '#d4c4a8',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")'
              }}
            >
              {/* Seta do Tooltip */}
              <div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-b-2 border-r-2"
                style={{
                  backgroundColor: '#fbf4e6',
                  borderColor: '#d4c4a8',
                  backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")'
                }}
              />
              
              <h4 className="text-[#2c1e16] font-bold uppercase tracking-widest text-sm mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                {location.name}
              </h4>
              <div className="w-12 h-[1px] bg-[#991b1b] mb-2" />
              <p className="text-[#5c4a3e] text-xs leading-relaxed font-serif">
                {location.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
