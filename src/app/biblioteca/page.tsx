'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AVATAR_COMICS } from '@/lib/data/comicsData';
import { AVATAR_BOOKS } from '@/lib/data/booksData';

export default function BibliotecaPage() {
  return (
    <main className="min-h-screen bg-[#0b0e14] pt-32 pb-20 px-6 md:px-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#a792ff] filter blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#dcb670] filter blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <Link href="/" className="text-sm font-bold text-[#dcb670] hover:text-white transition-colors flex items-center gap-2 bg-[#1a120b]/50 px-5 py-2.5 rounded-full border border-[#dcb670]/20 backdrop-blur-sm">
            <span>←</span>
            <span>Voltar ao Menu Principal</span>
          </Link>
          
          <a 
            href="https://www.youtube.com/@mundoavatarcombr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-bold text-white/70 hover:text-[#dcb670] transition-colors border border-[#dcb670]/20 px-5 py-2.5 rounded-full flex items-center gap-2 bg-[#1a120b]/80 backdrop-blur-sm shadow-lg hover:shadow-[#dcb670]/20"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            Créditos: Canal Mundo Avatar
          </a>
        </div>
        
        <header className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-[0.2em] mb-4"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            Biblioteca de <span className="text-[#dcb670]">Pergaminhos</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Explore as histórias e lendas que moldaram o mundo de Avatar. 
            Mergulhe nas HQs oficiais e descubra o que aconteceu entre as eras.
          </motion.p>
          <div className="w-24 h-[2px] bg-[#dcb670] mx-auto mt-8 opacity-50"></div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {AVATAR_COMICS.map((comic, i) => (
            <motion.div
              key={comic.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Link href={`/biblioteca/${comic.id}`} className="block">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-[#dcb670]/20 group-hover:shadow-3xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={comic.cover} 
                    alt={comic.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay Gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  
                  {/* Detalhes da Capa */}
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h2 className="text-white font-bold text-lg leading-tight mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      {comic.title}
                    </h2>
                    <p className="text-[#dcb670] text-xs uppercase tracking-widest font-bold">
                      {comic.subtitle}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Ler Agora</span>
                      <span>→</span>
                    </div>
                  </div>

                  {/* Efeito de Brilho na Bordas */}
                  <div className="absolute inset-0 border border-white/5 group-hover:border-[#dcb670]/30 transition-colors"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <header className="mb-12 mt-24 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-white uppercase tracking-[0.2em] mb-4"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            Saga <span className="text-[#dcb670]">Literária</span>
          </motion.h2>
          <div className="w-24 h-[2px] bg-[#dcb670] mx-auto mt-4 opacity-50"></div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {AVATAR_BOOKS.map((book, i) => (
             <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Link href={`/biblioteca/livros/${book.id}`} className="block">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-[#dcb670]/20 group-hover:shadow-3xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={book.cover} 
                    alt={book.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay Gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  
                  {/* Detalhes da Capa */}
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h2 className="text-white font-bold text-lg leading-tight mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      {book.title}
                    </h2>
                    <p className="text-[#dcb670] text-xs uppercase tracking-widest font-bold">
                      {book.subtitle}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Ler PDF</span>
                      <span>→</span>
                    </div>
                  </div>

                  {/* Efeito de Brilho na Bordas */}
                  <div className="absolute inset-0 border border-white/5 group-hover:border-[#dcb670]/30 transition-colors"></div>
                  <div className="absolute top-2 right-2 bg-[#dcb670] text-black text-[10px] font-bold px-2 py-1 rounded">LIVRO</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
