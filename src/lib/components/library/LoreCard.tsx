/**
 * src/components/library/LoreCard.tsx
 *
 * Um cartão que exibe uma entrada de lore (personagem, local).
 * Deve parecer um pergaminho enrolado ou uma placa de pedra.
 */
import Link from 'next/link';
import Image from 'next/image';

type LoreType = 'character' | 'location';

interface LoreEntry {
  type: LoreType;
  slug: string;
  title: string;
  summary?: string;
  mainImage: string;
}

interface Props {
  // Recebe qualquer tipo que estenda a entrada base
  entry: LoreEntry;
}

export const LoreCard = ({ entry }: Props) => {
  // A URL base dependerá do tipo, mas podemos inferir
  const href = `/biblioteca/${entry.type === 'character' ? 'personagens' : 'locais'}/${entry.slug}`;

  return (
    <Link href={href} className="lore-card-link">
      {/*
        REGRA DE OURO (Estilização):
        Este <div> não é um <div>. É um pergaminho.
        
        .lore-card {
          // Fundo: Textura de papel de arroz ou pergaminho antigo
          background-image: url('/assets/images/ui/parchment_texture.jpg');
          background-size: cover;
          
          // Bordas: Simular bordas de pergaminho (talvez com border-image)
          border: 10px solid transparent;
          border-image-source: url('/assets/images/ui/scroll_border.png');
          border-image-slice: 20;
          border-image-repeat: round;
          
          // Sombra: Sutil, para parecer que está flutuando sobre a mesa
          box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.5);
          transition: all 0.3s ease-in-out;
        }

        .lore-card:hover {
          // Brilho sutil ou leve levantada (como em Gwent)
          transform: translateY(-5px) scale(1.03);
          box-shadow: 0 0 20px rgba(210, 180, 140, 0.7); // Brilho cor de pergaminho
        }
      */}
      <div className="lore-card p-4 rounded-lg">
        <Image
          src={entry.mainImage}
          alt={entry.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
          // TODO: Aplicar um filtro 'sepia' ou 'duotone' para
          // parecer uma pintura a tinta (sumi-e)
        />
        <h3 className="mt-4 text-2xl font-bold">
          {/* TODO: Aplicar fonte de pincel (ex: 'Herculanum') */}
          {entry.title}
        </h3>
        <p className="mt-2 text-sm italic">{entry.summary}</p>
      </div>
    </Link>
  );
};