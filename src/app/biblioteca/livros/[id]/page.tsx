'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AVATAR_BOOKS } from '@/lib/data/booksData';
import Link from 'next/link';

export default function BookReaderPage() {
  const { id } = useParams();
  const router = useRouter();

  const book = AVATAR_BOOKS.find(b => b.id === id);

  useEffect(() => {
    if (!book) {
      router.push('/biblioteca');
    }
  }, [book, router]);

  if (!book) return null;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white pt-24 pb-12 flex flex-col items-center">
      {/* Header do Leitor */}
      <div className="w-full max-w-6xl px-6 flex justify-between items-center mb-8 bg-[#1a120b]/50 p-4 rounded-xl border border-[#dcb670]/10 backdrop-blur-sm">
        <Link href="/biblioteca" className="text-sm font-bold text-[#dcb670] hover:text-white transition-colors flex items-center gap-2">
          <span>←</span>
          <span>Voltar para Biblioteca</span>
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            {book.title}
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{book.subtitle}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
           <a 
             href="https://www.youtube.com/@mundoavatarcombr" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-[10px] text-white/50 hover:text-[#dcb670] transition-colors border border-white/10 hover:border-[#dcb670]/50 px-3 py-1.5 rounded-full flex items-center gap-2 bg-black/20"
           >
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
             Créditos: Canal Mundo Avatar
           </a>
        </div>
      </div>

      {/* Visor do PDF */}
      <div className="relative w-full max-w-6xl px-4 flex-1 flex flex-col items-center">
        <div className="w-full h-[80vh] bg-[#1a120b] rounded-lg shadow-2xl border border-[#dcb670]/20 overflow-hidden">
          <iframe 
            src={`${book.pdfUrl}#toolbar=0&navpanes=0`} 
            className="w-full h-full border-0" 
            title={book.title}
          />
        </div>
      </div>
    </div>
  );
}
