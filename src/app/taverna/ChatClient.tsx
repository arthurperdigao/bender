"use client";

import React, { useState, useEffect, useRef } from "react";
import { sendChatMessage, getRecentMessages } from "@/lib/actions/chat";

interface ChatMessage {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    nome: string;
    avatar: string | null;
    elementoNato: string | null;
    level?: number;
  };
}

export default function ChatClient({ 
  initialMessages, 
  userNacao, 
  userId 
}: { 
  initialMessages: ChatMessage[]; 
  userNacao: string;
  userId: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const freshMessages = await getRecentMessages(userNacao);
      setMessages(freshMessages as any);
    }, 3000); // Polling every 3s
    return () => clearInterval(interval);
  }, [userNacao]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const res = await sendChatMessage(newMessage, userNacao);
      if (res.success) {
        setNewMessage("");
        const fetchUpdated = await getRecentMessages(userNacao);
        setMessages(fetchUpdated as any);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-[70vh] max-h-[800px] w-full bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative z-10">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-black/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <h2 className="text-white font-bold tracking-widest text-lg" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Taverna da Nação: <span className="text-[#dcb670] capitalize">{userNacao || "Visitante"}</span>
          </h2>
        </div>
        <span className="text-xs text-white/50">{messages.length} mensagens criptografadas</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/40 italic">
            O salão está silencioso. Seja o primeiro a falar!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user.id === userId;
            const isMaster = (msg.user.level || 1) >= 5;
            
            const TRANSLATE_NATION: Record<string, string> = { 
              fire: "Fogo", water: "Água", earth: "Terra", air: "Ar", none: "Neutro" 
            };
            const msgOrigin = msg.user.elementoNato ? (TRANSLATE_NATION[msg.user.elementoNato] || msg.user.elementoNato) : "Neutro";
            
            return (
              <div key={msg.id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-10 h-10 flex-shrink-0 rounded-full bg-[#1a120b] border ${isMaster ? 'border-[#dcb670] shadow-[0_0_10px_#dcb670]' : 'border-white/20'} overflow-hidden flex items-center justify-center relative`}>
                    {msg.user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={msg.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className={`font-bold ${isMaster ? 'text-[#dcb670]' : 'text-white/60'}`}>{msg.user.nome.charAt(0)}</span>
                    )}
                  </div>
                  <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={`text-xs font-bold ${isMaster ? 'text-[#dcb670] drop-shadow-[0_0_8px_#dcb670] uppercase' : 'text-white/80'}`}>
                        {msg.user.nome} {isMaster && '🏵️'}
                        {msgOrigin && msgOrigin !== userNacao && msgOrigin !== "Neutro" && (
                          <span className="ml-2 text-[9px] uppercase tracking-widest text-[#a792ff] border border-[#a792ff]/30 bg-[#a792ff]/10 px-1.5 py-0.5 rounded-md">
                            Visitante d{msgOrigin === "Água" || msgOrigin === "Terra" ? "a Nação da " : "a Nação do "}{msgOrigin}
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-white/40">{formatTime(msg.createdAt)}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-[#dcb670] text-black rounded-tr-none" : "bg-white/10 text-white rounded-tl-none border border-white/5"} ${isMaster && !isMe ? 'border-[#dcb670]/30 shadow-[0_0_15px_rgba(220,182,112,0.1)]' : ''}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-black/60 border-t border-white/10">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
            placeholder={`Escreva para a Nação ${userNacao ? "d" + (userNacao === "Água" || userNacao === "Terra" ? "a" : "o") + " " + userNacao : ""}...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#dcb670]/50 transition-colors"
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="bg-[#dcb670] text-black font-bold h-11 px-6 rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-[#dcb670]"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
