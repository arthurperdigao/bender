/**
 * src/app/layout.tsx
 * Este é o arquivo principal do Next.js
 */
import type { Metadata } from 'next';
import { Cinzel, Lora } from 'next/font/google';
import SessionWrapper from '@/components/SessionWrapper';
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
  title: 'Portal das Quatro Nações',
  description: 'Sua jornada no mundo de Avatar começa aqui.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={`${cinzel.variable} ${lora.variable}`}>
      <body className="font-lora text-gray-800 bg-[#f4ecd8] antialiased">
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}