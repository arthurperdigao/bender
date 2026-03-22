/**
 * src/app/layout.tsx
 * Este é o arquivo principal do Next.js
 */
import type { Metadata } from 'next';
import { Cinzel, Lora } from 'next/font/google';
import SessionWrapper from '@/components/SessionWrapper';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/shop/CartDrawer';
import './globals.css';

// Fontes para o tema Épico/Pergaminho
const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '600', '700', '900']
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic']
});

export const metadata: Metadata = {
  title: 'Portal Avatar',
  description: 'Sua jornada no mundo de Avatar começa aqui.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={`${cinzel.variable} ${lora.variable}`}>
      <body className="font-lora text-white bg-[#0b0e14] antialiased">
        <SessionWrapper>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}