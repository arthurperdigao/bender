/**
 * src/lib/types/lore.ts
 *
 * Define o Schema de Dados para a Biblioteca de Wan Shi Tong.
 */

// A Era define o contexto principal do lore
export type AvatarEra = 'Korra' | 'Aang' | 'Roku' | 'Kyoshi' | 'Wan';

// Tipo base para qualquer entrada na biblioteca (Personagem, Local, etc.)
export interface LoreEntry {
  slug: string; // O ID de rota (ex: "aang", "ba-sing-se")
  title: string; // O nome (ex: "Avatar Aang")
  summary: string; // Descrição curta para o LoreCard
  mainImage: string; // Caminho da imagem (ex: /assets/images/lore/aang_portrait.jpg)
  content: string; // O conteúdo principal (HTML ou Markdown a ser parseado)
  nation: 'Nação do Fogo' | 'Reino da Terra' | 'Tribo da Água' | 'Nômades do Ar' | 'República Unida';
  era: AvatarEra[]; // Eras em que a entrada é relevante
  tags: string[]; // (ex: "Dobra de Ar", "Avatar", "Equipe Avatar")
}

// Schema para Personagens
export interface Character extends LoreEntry {
  type: 'character';
  element: ('Fogo' | 'Ar' | 'Água' | 'Terra' | 'Nenhum')[];
  allies: string[]; // Array de 'slugs' de outros personagens
  enemies: string[]; // Array de 'slugs' de outros personagens
  firstAppearance: string; // (ex: "Livro 1, Ep. 1")
}

// Schema para Locais
export interface Location extends LoreEntry {
  type: 'location';
  mapUrl?: string; // URL para uma imagem de mapa local (opcional)
  mapCoordinates?: [number, number]; // Coordenadas [lat, long] para o InteractiveMap
}

// Schema para Eventos da Linha do Tempo
export interface TimelineEvent {
  id: string;
  date: string; // (ex: "99 AG", "171 DG")
  title: string;
  description: string;
  era: AvatarEra;
  image?: string; // Imagem associada ao evento
}