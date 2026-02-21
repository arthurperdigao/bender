/**
 * src/lib/data/bendingForms.ts
 *
 * Contém os dados para as Fases do jogo de ritmo.
 * Começamos com uma forma fácil de Dobra de Água.
 */
import { BendingForm } from '@/lib/types/bendingForms';

export const allBendingForms: BendingForm[] = [
  {
    id: 'water_form_01',
    title: 'A Forma da Maré Puxante',
    element: 'water',
    musicUrl: '/assets/sounds/music/water_meditation.mp3',
    // Um caminho SVG simples em forma de 'S' para o teste.
    svgPath: 'M 50 200 C 150 50, 250 350, 350 200',
    difficulty: 'easy',
    beats: [
      // Pontos de verificação ao longo do caminho de arrastar
      { id: 'wb_01_01', time: 2.5, position: 0.1, type: 'drag-point' },
      { id: 'wb_01_02', time: 3.2, position: 0.25, type: 'drag-point' },
      { id: 'wb_01_03', time: 4.0, position: 0.4, type: 'drag-point' },
      { id: 'wb_01_04', time: 5.1, position: 0.6, type: 'drag-point' },
      { id: 'wb_01_05', time: 6.0, position: 0.75, type: 'drag-point' },
      { id: 'wb_01_06', time: 7.0, position: 0.9, type: 'drag-point' },
      { id: 'wb_01_07', time: 7.8, position: 1.0, type: 'drag-point' },
    ],
  },
  // TODO: Adicionar formas para Fogo (com 'tap') e Terra (com 'hold')
];