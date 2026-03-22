'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { AVATAR_COMICS } from '@/lib/data/comicsData';
import Link from 'next/link';

export default function ComicReaderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const comic = AVATAR_COMICS.find(c => c.id === id);

  useEffect(() => {
    if (!comic) {
      router.push('/biblioteca');
    }
  }, [comic, router]);

  if (!comic) return null;

  const totalPages = comic.pages.length > 0 ? comic.pages.length : 1;
  const currentImageUrl = comic.pages[currentPage] || comic.cover;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white pt-24 pb-12 flex flex-col items-center">
      {/* Header do Leitor */}
      <div className="w-full max-w-5xl px-6 flex justify-between items-center mb-8 bg-[#1a120b]/50 p-4 rounded-xl border border-[#dcb670]/10 backdrop-blur-sm">
        <Link href="/biblioteca" className="text-sm font-bold text-[#dcb670] hover:text-white transition-colors flex items-center gap-2">
          <span>←</span>
          <span>Voltar para Biblioteca</span>
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            {comic.title}
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Página {currentPage + 1} de {totalPages}</p>
        </div>
        <div className="flex gap-4">
           {/* Placeholder para controles extras como zoom/fullscreen */}
           <div className="w-10"></div>
        </div>
      </div>

      {/* Área do Leitor */}
      <div className="relative w-full max-w-4xl px-4 flex-1 flex flex-col items-center">
        <div className="relative w-full bg-[#1a120b] rounded-lg shadow-2xl border border-white/5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={currentImageUrl} 
                alt={`Página ${currentPage + 1}`}
                className="max-h-[85vh] w-auto h-auto object-contain shadow-2xl"
                onLoad={() => setIsLoading(false)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Áreas de Clique para Navegação (Invisíveis) */}
          <div className="absolute inset-y-0 left-0 w-1/4 cursor-w-resize" onClick={prevPage}></div>
          <div className="absolute inset-y-0 right-0 w-1/4 cursor-e-resize" onClick={nextPage}></div>
        </div>

        {/* Controles de Navegação */}
        <div className="mt-8 flex items-center gap-8">
          <button 
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`w-14 h-14 rounded-full flex items-center justify-center border border-[#dcb670]/20 transition-all ${currentPage === 0 ? 'opacity-20 bg-gray-800' : 'bg-[#1a120b] hover:bg-[#dcb670] hover:text-black hover:scale-110 active:scale-95'}`}
          >
            ←
          </button>
          
          <div className="bg-[#1a120b] px-6 py-3 rounded-full border border-white/5 text-sm font-medium">
            {currentPage + 1} / {totalPages}
          </div>

          <button 
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={`w-14 h-14 rounded-full flex items-center justify-center border border-[#dcb670]/20 transition-all ${currentPage === totalPages - 1 ? 'opacity-20 bg-gray-800' : 'bg-[#1a120b] hover:bg-[#dcb670] hover:text-black hover:scale-110 active:scale-95'}`}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
