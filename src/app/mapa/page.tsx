import { Metadata } from 'next';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'O Mundo Avatar | Plataforma',
  description: 'Explore o mapa múndi interativo das Quatro Nações.',
};

export default function MapPage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#161a25] relative">
      <InteractiveMap />

      {/* Botão Voltar para Home / Perfil */}
      <div className="absolute top-8 right-8 z-50">
        <Link 
          href="/"
          className="px-6 py-3 bg-[#fbf4e6] text-[#2c1e16] font-bold uppercase tracking-widest text-sm rounded shadow-lg border-2 border-[#d4c4a8] hover:bg-[#991b1b] hover:text-[#fbf4e6] transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Sair do Mapa
        </Link>
      </div>
    </main>
  );
}
