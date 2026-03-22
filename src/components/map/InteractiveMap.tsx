'use client';

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { MAP_LOCATIONS } from '@/lib/data/mapLocations';
import { MapMarker } from './MapMarker';
import { UserMarker } from './UserMarker';

export const InteractiveMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const currentScale = scale.get();
      const newScale = Math.min(Math.max(0.5, currentScale - e.deltaY * 0.003), 3);
      scale.set(newScale);
    };
    const element = containerRef.current;
    if (element) element.addEventListener('wheel', handleWheel, { passive: false });
    return () => { if (element) element.removeEventListener('wheel', handleWheel); };
  }, [scale]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-[#161a25] cursor-grab active:cursor-grabbing"
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center origin-center"
        style={{ x, y, scale: springScale }}
        drag
        dragConstraints={{ left: -800, right: 800, top: -800, bottom: 800 }}
        dragElastic={0.05}
        dragMomentum={false}
      >
        <div style={{ position: 'relative', height: '100vh' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/images/avatar_world_map.png"
            alt="Mapa Múndi de Avatar"
            draggable="false"
            style={{
              height: '100%',
              width: 'auto',
              display: 'block',
              filter: 'saturate(0.85) contrast(1.1)',
              userSelect: 'none',
            }}
          />

          <div style={{ position: 'absolute', inset: 0 }}>
            {MAP_LOCATIONS.map((loc) => (
              <MapMarker key={loc.id} location={loc} />
            ))}
            <UserMarker />
          </div>
        </div>
      </motion.div>

      {/* Botões de zoom */}
      <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-2">
        <button 
          onClick={() => scale.set(Math.min(scale.get() + 0.4, 3))}
          className="w-12 h-12 bg-[#2c1e16] text-[#d4c4a8] rounded-full border-2 border-[#d4c4a8] hover:bg-[#991b1b] hover:text-white flex items-center justify-center font-bold text-xl shadow-lg transition-colors"
        >+</button>
        <button 
          onClick={() => scale.set(Math.max(scale.get() - 0.4, 0.5))}
          className="w-12 h-12 bg-[#2c1e16] text-[#d4c4a8] rounded-full border-2 border-[#d4c4a8] hover:bg-[#991b1b] hover:text-white flex items-center justify-center font-bold text-xl shadow-lg transition-colors"
        >-</button>
      </div>
    </div>
  );
};
