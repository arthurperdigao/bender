'use client';

import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { MAP_LOCATIONS } from '@/lib/data/mapLocations';
import Image from 'next/image';

export const UserMarker = () => {
  const { data: session } = useSession();

  if (!session?.user) return null;

  // Encontra a capital ou templo sede da Nação do Usuário
  // Por simplicidade, vinculamos:
  // Fogo -> Capital da Nação do Fogo
  // Ar -> Templo do Ar do Sul
  // Água -> Tribo da Água do Sul (se ele veio do quiz da tribo e escolheu sul, senão podemos usar um padrão)
  // Terra -> Ba Sing Se
  const elementId = (session.user as Record<string, unknown>)?.elementId;
  let homeLocationId = '';

  switch (elementId) {
    case 'fire': homeLocationId = 'fire-nation-capital'; break;
    case 'air': homeLocationId = 'southern-air-temple'; break;
    case 'water': homeLocationId = 'southern-water-tribe'; break;
    case 'earth': homeLocationId = 'ba-sing-se'; break;
    default: return null;
  }

  const location = MAP_LOCATIONS.find(loc => loc.id === homeLocationId);
  if (!location) return null;

  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
      style={{ left: `${location.x}%`, top: `${location.y}%` }}
    >
      <motion.div 
        className="relative flex flex-col items-center cursor-pointer"
        whileHover={{ scale: 1.1 }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', delay: 0.5, stiffness: 200, damping: 15 }}
      >
        <div className="bg-[#2c1e16] text-[#e6dec1] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded shadow-lg border border-[#d4c4a8] mb-2 whitespace-nowrap">
          Meu Lar
        </div>

        {/* Círculo do Avatar do Usuário */}
        <div className="w-12 h-12 rounded-full border-4 border-[#dcb670] shadow-[0_0_20px_rgba(220,182,112,0.8)] overflow-hidden bg-[#161a25] relative">
          {session.user.image ? (
            <Image src={session.user.image} alt="Meu Avatar" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#dcb670] font-bold">
              {session.user.name?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
        
        {/* Pino Base */}
        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-[#dcb670] mt-1" />
      </motion.div>
    </div>
  );
};
