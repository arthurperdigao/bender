/**
 * src/app/loja/[id]/page.tsx
 * 
 * Página de Detalhes do Produto.
 */
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { products } from '@/lib/data/productsData';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-cinzel mb-8 uppercase tracking-widest opacity-30">Relíquia Perdida</h1>
        <Link href="/loja" className="bg-[#dcb670] px-8 py-3 rounded-full text-black font-black uppercase tracking-widest text-xs">Voltar ao Bazar</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0e14] text-white pt-32 pb-20 font-lora">
      {/* Back Button */}
      <div className="absolute top-32 left-8 z-30">
        <Link 
          href="/loja" 
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-[#dcb670] transition-colors group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          Bazar
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Gallery Sticky Wrapper */}
          <div className="relative">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="sticky top-32 aspect-square rounded-[40px] overflow-hidden border border-white/10 bg-white/[0.02] shadow-2xl"
            >
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className="object-cover"
                priority
              />
            </motion.div>
          </div>

          {/* Details Content */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col"
          >
            <div className="mb-10">
              <nav className="flex gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30 mb-6 font-bold">
                <Link href="/loja" className="hover:text-white transition-colors">Bazar</Link>
                <span>/</span>
                <span className="text-[#dcb670]">{product.category}</span>
              </nav>
              
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4 font-cinzel leading-none">{product.name}</h1>
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xl ${i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-white/20'}`}>★</span>
                  ))}
                  <span className="text-sm opacity-40 ml-2">({product.reviews} avaliações)</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <p className="text-green-400 text-xs font-black uppercase tracking-widest">{product.stock > 0 ? '✓ Em Estoque' : '✗ Indisponível'}</p>
              </div>

              <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[32px] mb-10">
                <p className="text-3xl font-black text-[#dcb670] mb-2 font-cinzel">R$ {product.price.toFixed(2)}</p>
                <p className="text-xs text-white/40 italic">Ou em 10x sem juros de R$ {(product.price / 10).toFixed(2)}</p>
              </div>

              <p className="text-lg leading-relaxed text-white/60 mb-12 italic border-l-2 border-[#dcb670]/30 pl-8">{product.description}</p>
            </div>

            {/* Features List */}
            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-[0.3em] font-black text-white/40 mb-6">Especificações da Relíquia</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <span className="text-[#dcb670] text-lg">✦</span>
                    <span className="text-sm font-bold opacity-80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-full hover:bg-[#dcb670] transition-all shadow-[0_20px_40px_rgba(0,0,0,0.3)] active:scale-95"
              >
                Adicionar ao Carrinho
              </button>
              <button className="flex-1 py-6 border-2 border-white/10 text-white font-black uppercase tracking-[0.3em] rounded-full hover:bg-white/5 transition-all active:scale-95">
                Salvar na Lista
              </button>
            </div>
          </motion.div>
        </div>

        {/* Similar Items (Future addition) */}
        <section className="mt-32 pt-20 border-t border-white/5">
          <h2 className="text-2xl font-cinzel uppercase tracking-[0.2em] mb-12">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 opacity-40 grayscale pointer-events-none">
            {/* ... simplified placeholders ... */}
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white/5 aspect-square rounded-[32px] border border-white/5" />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
