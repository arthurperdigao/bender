/**
 * src/lib/data/lore/characters.ts
 *
 * "Pergaminho" de dados para a entidade Personagem.
 * Segue a interface 'Character' de 'src/lib/types/lore.ts'.
 */

import { Character } from '@/lib/types/lore';

export const characterData: Character[] = [
  {
    type: 'character',
    slug: 'aang',
    title: 'Avatar Aang',
    summary: 'O relutante herói e Avatar que encerrou a Guerra dos Cem Anos.',
    mainImage: '/assets/images/lore/aang_portrait.jpg',
    content: `
      <p>Aang era um Nômade do Ar nascido em 12 AG...</p>
      <p>Ele é conhecido por sua natureza pacifista e seu domínio de todos os quatro elementos...</p>
    `, // (Conteúdo pode ser HTML ou Markdown)
    nation: 'Nômades do Ar',
    era: ['Aang', 'Korra'],
    tags: ['Avatar', 'Dobra de Ar', 'Equipe Avatar', 'Dobra de Energia'],
    element: ['Ar', 'Água', 'Terra', 'Fogo'],
    allies: ['katara', 'sokka', 'toph', 'zuko', 'suki'],
    enemies: ['ozai', 'azula', 'zhao'],
    firstAppearance: 'Livro 1, Ep. 1: O Garoto no Iceberg',
  },
  {
    type: 'character',
    slug: 'korra',
    title: 'Avatar Korra',
    summary: 'A impetuosa Avatar da Tribo da Água do Sul que reconectou os mundos.',
    mainImage: '/assets/images/lore/korra_portrait.jpg',
    content: `
      <p>Korra, da Tribo da Água do Sul, foi a Avatar que sucedeu Aang...</p>
      <p>Sua jornada foi marcada por desafios que redefiniram o papel do Avatar...</p>
    `,
    nation: 'Tribo da Água',
    era: ['Korra'],
    tags: ['Avatar', 'Dobra de Água', 'Equipe Avatar', 'Mundo Espiritual'],
    element: ['Água', 'Terra', 'Fogo', 'Ar'],
    allies: ['mako', 'bolin', 'asami', 'tenzin'],
    enemies: ['amon', 'unalaq', 'zaheer', 'kuvira'],
    firstAppearance: 'Livro 1, Ep. 1: Bem-vinda à Cidade República',
  },
  {
    type: 'character',
    slug: 'toph-beifong',
    title: 'Toph Beifong',
    summary: 'A maior Dobradora de Terra de todos os tempos e a inventora da Dobra de Metal.',
    mainImage: '/assets/images/lore/toph_portrait.jpg',
    content: `
      <p>Cega de nascença, Toph Beifong aprendeu a "ver" através da Dobra de Terra...</p>
      <p>Ela revolucionou o mundo ao inventar a Dobra de Metal...</p>
    `,
    nation: 'Reino da Terra',
    era: ['Aang', 'Korra'],
    tags: ['Dobra de Terra', 'Dobra de Metal', 'Equipe Avatar', 'Polícia de Cidade República'],
    element: ['Terra'],
    allies: ['aang', 'katara', 'sokka', 'lin', 'suyin'],
    enemies: ['ozai', 'azula'],
    firstAppearance: 'Livro 2, Ep. 6: A Bandida Cega',
  },
];