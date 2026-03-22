/**
 * src/components/shop/CartDrawer.tsx
 * 
 * Drawer lateral do carrinho com visual premium.
 */
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0b0e14] border-l border-white/10 shadow-2xl z-[101] flex flex-col font-lora"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest text-[#dcb670] font-cinzel">Seu Carrinho</h2>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">{totalItems} itens selecionados</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors text-2xl">×</button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-10">
                  <span className="text-6xl mb-4">🛒</span>
                  <p className="text-sm uppercase tracking-widest leading-relaxed">Seu carrinho está vazio como o Deserto Si Wong.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1 group-hover:text-[#dcb670] transition-colors">{item.name}</h4>
                      <p className="text-[10px] text-white/40 mb-3">{item.category}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg border border-white/5 px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="hover:text-[#dcb670] transition-colors">-</button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="hover:text-[#dcb670] transition-colors">+</button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-[#dcb670]">R$ {(item.price * item.quantity).toFixed(2)}</p>
                          <button onClick={() => removeFromCart(item.id)} className="text-[8px] uppercase tracking-widest text-red-400 hover:text-red-300 mt-1">Remover</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout Footer */}
            {cart.length > 0 && (
              <div className="p-8 bg-white/[0.02] border-t border-white/5 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Total Estimado</span>
                  <span className="text-2xl font-black text-white font-cinzel">R$ {totalPrice.toFixed(2)}</span>
                </div>
                <button className="w-full py-5 bg-[#dcb670] text-black font-black uppercase text-xs tracking-[0.3em] rounded-full hover:bg-white transition-all shadow-[0_10px_30px_rgba(220,182,112,0.2)]">
                  Finalizar Pedido
                </button>
                <p className="text-[8px] text-center text-white/20 uppercase tracking-[0.1em]">Pagamento Seguro via Moedas de Ouro da Nação do Fogo</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
