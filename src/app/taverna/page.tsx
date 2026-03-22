import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getRecentMessages } from "@/lib/actions/chat";
import ChatClient from "./ChatClient";
import Link from 'next/link';
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Taverna | Portal Avatar",
  description: "Chat exclusivo da sua Nação",
};

export default async function TavernaPage(props: any) {
  const searchParams = await props.searchParams;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  let rawElemento = (session.user as any).elementoNato || "Neutro";
  
  const TRANSLATE_NATION: Record<string, string> = { 
    fire: "Fogo", water: "Água", earth: "Terra", air: "Ar", none: "Neutro" 
  };
  let userNacao = TRANSLATE_NATION[rawElemento] || rawElemento;

  // Lógica de Diplomacia: Override the nation if user is visiting and is Level 5+ (10000+ XP)
  if (searchParams?.visit) {
    const dbUser = await prisma.user.findUnique({ 
      where: { id: session.user.id },
      select: { totalXp: true } 
    });
    
    if (dbUser && dbUser.totalXp >= 10000) {
      userNacao = searchParams.visit;
    }
  }

  const initialMessages = await getRecentMessages(userNacao);

  // Definir cor e efeitos baseados na nação
  let glowColor = "bg-[#a792ff]"; // Default
  let bgColor = "from-[#0b0e14] to-[#1a120b]";

  switch(userNacao.toLowerCase()) {
    case "fogo":
      glowColor = "bg-red-600";
      bgColor = "from-[#2b0a0a] to-[#0b0e14]";
      break;
    case "água":
    case "agua":
      glowColor = "bg-blue-500";
      bgColor = "from-[#001736] to-[#0b0e14]"; // Azul escuro
      break;
    case "terra":
      glowColor = "bg-green-600";
      bgColor = "from-[#0f1f10] to-[#0b0e14]";
      break;
    case "ar":
      glowColor = "bg-yellow-400";
      bgColor = "from-[#292200] to-[#0b0e14]";
      break;
  }

  return (
    <main className={`min-h-screen bg-gradient-to-b ${bgColor} pt-32 pb-20 px-6 md:px-12 relative overflow-hidden`}>
      {/* Elementos Decorativos */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className={`absolute top-[-10%] ${userNacao.toLowerCase()==='fogo' ? 'right' : 'left'}-[-10%] w-[40%] h-[50%] ${glowColor} filter blur-[150px] rounded-full`}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
        <div className="w-full flex justify-start mb-8">
          <Link href="/" className="text-sm font-bold text-[#dcb670] hover:text-white transition-colors flex items-center gap-2 bg-[#1a120b]/50 px-5 py-2.5 rounded-full border border-[#dcb670]/20 backdrop-blur-sm">
            <span>←</span>
            <span>Voltar ao Mapa</span>
          </Link>
        </div>

        <header className="mb-12 text-center">
          <h1 
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-[0.2em] mb-4"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            A <span className="text-[#dcb670]">Taverna</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Bem-vindo ao ponto de encontro secreto. Apenas os membros da sua nação conseguem decifrar as mensagens escritas nestas paredes. Cuidado com espiões.
          </p>
          <div className="w-24 h-[2px] bg-[#dcb670] mx-auto mt-6 opacity-30"></div>
        </header>

        <ChatClient 
          initialMessages={initialMessages as any} 
          userNacao={userNacao} 
          userId={session.user.id!} 
        />
      </div>
    </main>
  );
}
