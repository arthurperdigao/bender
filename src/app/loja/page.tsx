/**
 * src/app/loja/page.tsx
 * 
 * Bazar de Omashu — Loja Premium de Colecionáveis.
 */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products, Product } from '@/lib/data/productsData';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

const CATEGORIES = ['Todos', 'Action Figures', 'Colecionáveis', 'Acessórios', 'Vestuário'];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, setIsOpen } = useCart();

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#0b0e14] text-white pt-24 pb-20 font-lora">
      {/* Back Button */}
      <div className="absolute top-32 left-8 z-30">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-[#dcb670] transition-colors group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          Portal
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-[400px] w-full overflow-hidden flex items-center justify-center mb-12">
        <Image 
          src="/assets/arcade-hero.png" 
          alt="Bazar de Omashu" 
          fill 
          className="object-cover opacity-30 grayscale blur-[2px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent" />
        
        <div className="relative z-10 text-center px-6">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-[0.2em] mb-4 text-[#dcb670] font-cinzel"
          >
            Bazar de Omashu
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl italic opacity-60 tracking-widest max-w-2xl mx-auto"
          >
            Relíquias raras e artefatos de todas as quatro nações. Onde a excelência encontra a dobragem.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-16 px-4 py-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl sticky top-24 z-20">
          <div className="flex gap-2 p-1 bg-black/20 rounded-2xl border border-white/5 overflow-x-auto w-full md:w-auto no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-[#dcb670] text-black shadow-lg' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Procurar relíquias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-[#dcb670]/50 transition-colors"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="group h-full"
              >
                <div className="bg-white/[0.03] border border-white/5 rounded-[32px] overflow-hidden flex flex-col h-full hover:bg-white/[0.05] hover:border-[#dcb670]/30 transition-all duration-500 backdrop-blur-sm shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-black/20">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <p className="text-[10px] font-black text-[#dcb670] uppercase">R$ {product.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-[#dcb670] font-bold">{product.category}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500 text-[10px]">★</span>
                          <span className="text-[9px] text-white/40">{product.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tighter leading-tight group-hover:text-white transition-colors font-cinzel">{product.name}</h3>
                      <p className="text-sm text-white/40 line-clamp-2 italic mb-6 leading-relaxed">{product.description}</p>
                    </div>

                    <div className="flex gap-3 pt-6 border-t border-white/5 mt-auto">
                      <button 
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#dcb670] transition-all active:scale-95"
                      >
                        Comprar
                      </button>
                      <Link 
                        href={`/loja/${product.id}`}
                        className="w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all group/btn"
                      >
                        <span className="group-hover/btn:scale-125 transition-transform">👁️</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-40 text-center opacity-30">
            <h2 className="text-3xl font-cinzel uppercase tracking-[0.3em]">Nenhuma relíquia encontrada</h2>
            <p className="mt-4 italic">Tente mudar sua busca ou o elemento desejado.</p>
          </div>
        )}
      </div>

      {/* Floating Cart (Mobile Friendly) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-[#dcb670] rounded-full flex items-center justify-center text-black text-2xl shadow-2xl z-40 md:hidden"
      >
        <span className="relative">
          🛒
          <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#dcb670]">
            {filteredProducts.length}
          </span>
        </span>
      </motion.button>
    </main>
  );
}
