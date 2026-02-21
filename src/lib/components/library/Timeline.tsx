/**
 * src/components/library/Timeline.tsx
 *
 * Renderiza uma linha do tempo vertical dos eventos da história.
 * Deve parecer um manuscrito antigo.
 */
import React from 'react';

type TimelineEvent = {
  id: string;
  date: string;
  era?: string;
  title: string;
  description?: string;
};

interface Props {
  events: TimelineEvent[];
}

export const Timeline = ({ events }: Props) => {
  return (
    <div className="timeline-container max-w-4xl mx-auto">
      {/*
        REGRA DE OURO (Estilização):
        Isto é um manuscrito vertical.
        
        .timeline-line {
          // A linha central não é uma linha. É uma pincelada de tinta (sumi-e)
          // ou uma costura de pergaminho.
          width: 3px;
          background-color: #3a2a1a; // Cor de tinta seca
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        
        .timeline-event-card {
          // Cada "cartão" é um pedaço de papiro anexado ao pergaminho principal.
          background-color: rgba(245, 235, 215, 0.1); // Fundo sutil
          border-right: 5px solid #a89a8e; // Borda de "papiro"
        }
      */}

      {/* A linha vertical central */}
      <div className="relative timeline-line ml-8 py-8">
        {events.map((event) => (
          <div key={event.id} className="timeline-event-item mb-12">

            {/* O Ponto/Glifo na linha */}
            <span className="absolute -left-3.5 flex items-center justify-center w-8 h-8 rounded-full">
              {/* TODO: Usar um ícone de Lótus ou um glifo da era (ex: Símbolo Ar para Aang) */}
              💠
            </span>

            <div className="timeline-event-card ml-12 p-4">
              <time className="text-lg font-semibold text-amber-300">
                {event.date} ({event.era})
              </time>
              <h4 className="text-xl font-bold mt-1">{event.title}</h4>
              <p className="mt-2">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};