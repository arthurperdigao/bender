/**
 * src/lib/constants/quizQuestions.ts
 * O coração do Módulo 1. A jornada narrativa do Viajante.
 * A pontuação (afinidades) é ponderada, refletindo a complexidade do mundo Avatar.
 */
import { QuizStep } from '@/lib/types/avatar';

export const quizData: QuizStep[] = [
  // --- PASSO 1: A ABERTURA (Narrativa) ---
  {
    id: 'q1_intro',
    type: 'narrative',
    prompt: 'Você acorda em um campo de Lótus sob um céu crepuscular. Uma voz calma ecoa: "O mundo está em desequilíbrio. O caminho à frente é incerto, mas é o seu caminho."',
    // Nenhum 'options', o QuizContainer apenas mostrará 'Continuar...'
  },

  // --- PASSO 2: O CONFLITO IMEDIATO (Escolha Situacional) ---
  {
    id: 'q2_storm',
    type: 'choice',
    prompt: 'Uma tempestade violenta se forma no horizonte, ameaçando uma pequena vila abaixo. O que você faz?',
    options: [
      {
        id: 'q2_opt1',
        text: 'Confrontar a tempestade. Dispersá-la com força direta.',
        sfxOnSelect: 'air_whoosh.mp3',
        affinities: {
          FIRE_NATION_CAPITAL_ELITE: +3, // Ação direta, poder
          AIR_NOMAD_ACOLYTE: +1,         // Ação, mas menos agressivo
          EARTH_KINGDOM_BA_SING_SE: -2,  // Imprudente
        },
      },
      {
        id: 'q2_opt2',
        text: 'Erguer defesas. Proteger a vila primeiro, resistir à tempestade.',
        sfxOnSelect: 'earth_rumble.mp3',
        affinities: {
          EARTH_KINGDOM_BA_SING_SE: +3,    // Estabilidade, proteção
          EARTH_KINGDOM_KYOSHI_WARRIOR: +2, // Defesa, ordem
          AIR_NOMAD_EASTERN_TEMPLE: -2,   // Apego material
        },
      },
      {
        id: 'q2_opt3',
        text: 'Redirecionar o perigo. Guiar a tempestade para um vale desabitado.',
        sfxOnSelect: 'water_swoosh.mp3',
        affinities: {
          WATER_TRIBE_NORTH_HEALER: +3,   // Harmonia, fluxo
          FIRE_NATION_SUN_WARRIOR: +1,    // Entendimento da natureza
          FIRE_NATION_CAPITAL_ELITE: -1,  // Indireto demais
        },
      },
      {
        id: 'q2_opt4',
        text: 'Buscar a causa. Tentar entender a origem espiritual da tempestade.',
        sfxOnSelect: 'chime_spiritual.mp3', // (Precisaremos deste SFX)
        affinities: {
          AIR_NOMAD_EASTERN_TEMPLE: +3,   // Espiritualidade, desapego
          FIRE_NATION_SUN_WARRIOR: +2,    // Conexão com a origem
          NON_BENDER_MECHANIST: -2,       // Não pragmático
        },
      },
    ],
  },

  // --- PASSO 3: O CONFLITO FILOSÓFICO (Escolha de Conhecimento) ---
  {
    id: 'q3_lore',
    type: 'choice',
    prompt: 'Você encontra uma biblioteca antiga. Um espírito do conhecimento oferece um pergaminho, mas avisa: "Este conhecimento pode trazer grande progresso ou grande destruição." O que você busca?',
    options: [
      {
        id: 'q3_opt1',
        text: 'O pergaminho da Inovação. Para construir um futuro melhor.',
        affinities: {
          NON_BENDER_MECHANIST: +3,       // Progresso, tecnologia
          EARTH_KINGDOM_METAL_CLAN: +3,   // Inovação, futuro
          AIR_NOMAD_EASTERN_TEMPLE: -2, // Mundano
        },
      },
      {
        id: 'q3_opt2',
        text: 'O pergaminho da Ordem. Para proteger as tradições e a sociedade.',
        affinities: {
          EARTH_KINGDOM_KYOSHI_WARRIOR: +3, // Tradição, ordem
          EARTH_KINGDOM_BA_SING_SE: +2,   // Estrutura
          FIRE_NATION_CAPITAL_ELITE: +1,  // Controle
        },
      },
      {
        id: 'q3_opt3',
        text: 'O pergaminho da Harmonia. Para curar as divisões do mundo.',
        affinities: {
          WATER_TRIBE_NORTH_HEALER: +3,   // Cura, conexão
          AIR_NOMAD_ACOLYTE: +2,          // Reconstrução, comunidade
          WATER_TRIBE_SOUTH_WARRIOR: +1,  // Comunidade
        },
      },
      {
        id: 'q3_opt4',
        text: 'O pergaminho da Verdade. Para entender a natureza fundamental do espírito.',
        affinities: {
          FIRE_NATION_SUN_WARRIOR: +3,    // Verdade primordial
          AIR_NOMAD_EASTERN_TEMPLE: +2,   // Iluminação
          EARTH_KINGDOM_METAL_CLAN: -2,   // Abstrato demais
        },
      },
    ],
  },

  // --- PASSO 4: A JORNADA INTERNA (Narrativa) ---
  {
    id: 'q4_path',
    type: 'narrative',
    prompt: 'A voz retorna: "O caminho não é sobre o destino, mas sobre a jornada. Sua motivação mais profunda o guiará."',
  },

  // --- PASSO 5: O PILAR PESSOAL (Escolha Filosófica) ---
  {
    id: 'q5_drive',
    type: 'choice',
    prompt: 'O que é mais importante para você?',
    options: [
      {
        id: 'q5_opt1',
        text: 'Vontade. (A capacidade de impor sua visão ao mundo.)',
        affinities: {
          FIRE_NATION_CAPITAL_ELITE: +3,
          EARTH_KINGDOM_METAL_CLAN: +2,
          WATER_TRIBE_SOUTH_WARRIOR: +1,
        },
      },
      {
        id: 'q5_opt2',
        text: 'Liberdade. (O direito de ser desimpedido, espiritual e fisicamente.)',
        affinities: {
          AIR_NOMAD_EASTERN_TEMPLE: +3,
          AIR_NOMAD_ACOLYTE: +2,
          WATER_TRIBE_SOUTH_WARRIOR: +1,
        },
      },
      {
        id: 'q5_opt3',
        text: 'Conexão. (A ligação entre todas as coisas: família, espíritos, natureza.)',
        affinities: {
          WATER_TRIBE_NORTH_HEALER: +3,
          FIRE_NATION_SUN_WARRIOR: +2,
          AIR_NOMAD_ACOLYTE: +1,
        },
      },
      {
        id: 'q5_opt4',
        text: 'Legado. (O que você constrói e deixa para trás; a estrutura que perdura.)',
        affinities: {
          EARTH_KINGDOM_BA_SING_SE: +3,
          EARTH_KINGDOM_KYOSHI_WARRIOR: +2,
          NON_BENDER_MECHANIST: +1,
        },
      },
    ],
  },
];