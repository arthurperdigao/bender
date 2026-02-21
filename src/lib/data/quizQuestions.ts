/**
 * src/lib/data/quizQuestions.ts
 *
 * As 10 perguntas do "Chamado Espiritual".
 * Cada cenário é situacional/filosófico, fiel ao universo Avatar.
 * O sistema de pontuação ponderada distribui pontos para múltiplos arquétipos.
 */
import { QuizQuestion, ScoreObject } from '@/lib/types/avatar';

const s = (scores: ScoreObject): ScoreObject => scores;

export const quizQuestions: QuizQuestion[] = [
  // ── 1. ABERTURA NARRATIVA ──
  {
    id: 'q1',
    type: 'narrative',
    prompt: 'Você acorda em um campo de flores de lótus sob um céu crepuscular. Uma voz antiga ecoa pela névoa: "O mundo está em desequilíbrio, viajante. O caminho à frente é incerto... mas é o seu caminho."',
    sceneDescription: 'spiritual',
  },

  // ── 2. O CONFLITO IMEDIATO ──
  {
    id: 'q2',
    type: 'choice',
    prompt: 'Uma vila está sendo atacada por saqueadores. Os moradores gritam por socorro. O que você faz?',
    sceneDescription: 'village',
    options: [
      {
        id: 'q2_a',
        text: 'Confronto direto — atacar os saqueadores com tudo que tenho.',
        scores: s({
          FIRE_LIGHTNING: 8, FIRE_COMBUSTION: 6, EARTH_LAVABENDER: 4,
          WATER_WARRIOR: 3, AIR_NOMAD: -5,
        }),
      },
      {
        id: 'q2_b',
        text: 'Proteger os civis — erguer defesas e evacuar as pessoas primeiro.',
        scores: s({
          EARTH_GUARDIAN: 8, NON_BENDER_KYOSHI: 6, WATER_HEALER: 4,
          NON_BENDER_LEADER: 3, FIRE_COMBUSTION: -3,
        }),
      },
      {
        id: 'q2_c',
        text: 'Criar uma distração — desviar a atenção dos inimigos com astúcia.',
        scores: s({
          NON_BENDER_LEADER: 8, NON_BENDER_CHI_BLOCKER: 6, AIR_ACOLYTE: 4,
          NON_BENDER_ENGINEER: 3, EARTH_GUARDIAN: -2,
        }),
      },
      {
        id: 'q2_d',
        text: 'Buscar a raiz do problema — por que estão atacando? Talvez haja outra solução.',
        scores: s({
          AIR_NOMAD: 8, WATER_HEALER: 5, FIRE_SUN_WARRIOR: 4,
          NON_BENDER_ENGINEER: 2, FIRE_COMBUSTION: -5,
        }),
      },
    ],
  },

  // ── 3. O ESPÍRITO SOMBRIO ──
  {
    id: 'q3',
    type: 'choice',
    prompt: 'Um espírito sombrio bloqueia seu caminho. Seus olhos brilham na escuridão. Ele pergunta: "O que você mais valoriza, viajante?"',
    sceneDescription: 'spirit',
    options: [
      {
        id: 'q3_a',
        text: 'Poder. A capacidade de mudar o mundo com minhas próprias mãos.',
        scores: s({
          FIRE_LIGHTNING: 6, FIRE_COMBUSTION: 8, EARTH_LAVABENDER: 5,
          WATER_BLOODBENDER: 6, AIR_NOMAD: -8,
        }),
      },
      {
        id: 'q3_b',
        text: 'Liberdade. O direito de não ser preso por ninguém nem nada.',
        scores: s({
          AIR_NOMAD: 8, AIR_ACOLYTE: 5, NON_BENDER_CHI_BLOCKER: 4,
          WATER_WARRIOR: 2, EARTH_GUARDIAN: -4,
        }),
      },
      {
        id: 'q3_c',
        text: 'Equilíbrio. Harmonia entre todas as coisas — pessoas, espíritos, nações.',
        scores: s({
          WATER_HEALER: 7, FIRE_SUN_WARRIOR: 6, AIR_ACOLYTE: 4,
          EARTH_GUARDIAN: 3, FIRE_COMBUSTION: -5,
        }),
      },
      {
        id: 'q3_d',
        text: 'Comunidade. Minha família, meus amigos — protegê-los é tudo.',
        scores: s({
          NON_BENDER_LEADER: 7, NON_BENDER_KYOSHI: 6, EARTH_GUARDIAN: 5,
          WATER_WARRIOR: 4, AIR_NOMAD: -3,
        }),
      },
    ],
  },

  // ── 4. NARRATIVA — A BIBLIOTECA ──
  {
    id: 'q4',
    type: 'narrative',
    prompt: 'Você chega a uma biblioteca escondida. Não a de Wan Shi Tong, mas uma mais antiga. Pergaminhos em idiomas perdidos cobrem as paredes de cristal. O conhecimento de eras inteiras pulsa ao seu redor.',
    sceneDescription: 'library',
  },

  // ── 5. A FERRAMENTA ──
  {
    id: 'q5',
    type: 'choice',
    prompt: 'Para restaurar o equilíbrio do mundo, qual ferramenta você considera mais essencial?',
    sceneDescription: 'spiritual',
    options: [
      {
        id: 'q5_a',
        text: 'Precisão. Ação disciplinada, no momento exato.',
        scores: s({
          NON_BENDER_KYOSHI: 8, FIRE_LIGHTNING: 6, NON_BENDER_CHI_BLOCKER: 5,
          EARTH_METALBENDER: 3,
        }),
      },
      {
        id: 'q5_b',
        text: 'Adaptação. A capacidade de fluir e mudar com cada desafio.',
        scores: s({
          WATER_WARRIOR: 7, WATER_BLOODBENDER: 4, AIR_ACOLYTE: 5,
          NON_BENDER_LEADER: 3,
        }),
      },
      {
        id: 'q5_c',
        text: 'Inovação. Criar soluções que ninguém sequer imaginou.',
        scores: s({
          NON_BENDER_ENGINEER: 8, EARTH_METALBENDER: 7, EARTH_LAVABENDER: 3,
          EARTH_GUARDIAN: -3,
        }),
      },
      {
        id: 'q5_d',
        text: 'Compaixão. Entender a dor do outro antes de agir.',
        scores: s({
          WATER_HEALER: 8, AIR_NOMAD: 5, FIRE_SUN_WARRIOR: 5,
          FIRE_COMBUSTION: -5,
        }),
      },
    ],
  },

  // ── 6. O PÂNTANO ──
  {
    id: 'q6',
    type: 'choice',
    prompt: 'Você está encurralado em um pântano sombrio. Inimigos se aproximam de todos os lados. A névoa é espessa. O que você faz?',
    sceneDescription: 'swamp',
    options: [
      {
        id: 'q6_a',
        text: 'Atacar com força total. Abrir caminho pela força bruta.',
        scores: s({
          FIRE_COMBUSTION: 8, EARTH_LAVABENDER: 6, FIRE_LIGHTNING: 4,
          AIR_NOMAD: -5,
        }),
      },
      {
        id: 'q6_b',
        text: 'Usar o ambiente. Mover-se em silêncio, usar o pântano como cobertura.',
        scores: s({
          WATER_WARRIOR: 7, NON_BENDER_CHI_BLOCKER: 6, WATER_BLOODBENDER: 4,
          NON_BENDER_KYOSHI: 3,
        }),
      },
      {
        id: 'q6_c',
        text: 'Construir uma armadilha. Usar engenhosidade para virar o jogo.',
        scores: s({
          NON_BENDER_ENGINEER: 7, NON_BENDER_LEADER: 7, EARTH_METALBENDER: 3,
        }),
      },
      {
        id: 'q6_d',
        text: 'Conectar-se ao espírito do pântano. Pedir passagem segura.',
        scores: s({
          AIR_NOMAD: 7, FIRE_SUN_WARRIOR: 6, WATER_HEALER: 5,
          NON_BENDER_ENGINEER: -5,
        }),
      },
    ],
  },

  // ── 7. O SEGREDO ──
  {
    id: 'q7',
    type: 'choice',
    prompt: 'A biblioteca oferece um único segredo. Qual você escolhe desvendar?',
    sceneDescription: 'library',
    options: [
      {
        id: 'q7_a',
        text: 'A origem da Dobra de Energia — o poder dos Avatares.',
        scores: s({
          FIRE_SUN_WARRIOR: 8, AIR_NOMAD: 6, WATER_HEALER: 3,
        }),
      },
      {
        id: 'q7_b',
        text: 'Os projetos das máquinas de guerra da Nação do Fogo.',
        scores: s({
          NON_BENDER_ENGINEER: 8, NON_BENDER_LEADER: 4, EARTH_METALBENDER: 3,
        }),
      },
      {
        id: 'q7_c',
        text: 'As técnicas perdidas de combate proibido.',
        scores: s({
          WATER_BLOODBENDER: 7, FIRE_COMBUSTION: 5, NON_BENDER_CHI_BLOCKER: 6,
          AIR_NOMAD: -5,
        }),
      },
      {
        id: 'q7_d',
        text: 'A história das Guerreiras de Kyoshi e seu código de honra.',
        scores: s({
          NON_BENDER_KYOSHI: 8, EARTH_GUARDIAN: 5, NON_BENDER_LEADER: 2,
        }),
      },
    ],
  },

  // ── 8. NARRATIVA ──
  {
    id: 'q8',
    type: 'narrative',
    prompt: 'A voz retorna, mais profunda agora: "Sua jornada moldou quem você é. Mas a escolha final revelará quem você sempre foi."',
    sceneDescription: 'spirit',
  },

  // ── 9. A DECISÃO FINAL ──
  {
    id: 'q9',
    type: 'choice',
    prompt: 'Você alcança o Senhor do Fogo no dia do Cometa de Sozin. Ele está derrotado, mas vivo. O mundo espera sua decisão.',
    sceneDescription: 'comet',
    options: [
      {
        id: 'q9_a',
        text: 'Acabar com ele. É a única forma de garantir o fim da guerra.',
        scores: s({
          FIRE_COMBUSTION: 8, WATER_BLOODBENDER: 5, FIRE_LIGHTNING: 4,
          AIR_NOMAD: -10,
        }),
      },
      {
        id: 'q9_b',
        text: 'Tirar sua dobra. Uma solução definitiva sem violar meu espírito.',
        scores: s({
          AIR_NOMAD: 8, FIRE_SUN_WARRIOR: 6, WATER_HEALER: 4,
          NON_BENDER_LEADER: 2,
        }),
      },
      {
        id: 'q9_c',
        text: 'Prendê-lo. Deixar que o mundo julgue — a justiça é coletiva.',
        scores: s({
          EARTH_GUARDIAN: 7, NON_BENDER_KYOSHI: 6, NON_BENDER_LEADER: 5,
          WATER_WARRIOR: 3,
        }),
      },
    ],
  },

  // ── 10. A IDENTIDADE (pergunta mais ponderada) ──
  {
    id: 'q10',
    type: 'choice',
    prompt: 'Última pergunta. Qual verdade ressoa mais fundo em você?',
    sceneDescription: 'spiritual',
    options: [
      {
        id: 'q10_a',
        text: '"Eu sou meu poder e minha vontade."',
        scores: s({
          FIRE_LIGHTNING: 10, FIRE_COMBUSTION: 8, WATER_BLOODBENDER: 6,
          EARTH_LAVABENDER: 5,
        }),
      },
      {
        id: 'q10_b',
        text: '"Eu sou meu legado e minha disciplina."',
        scores: s({
          NON_BENDER_KYOSHI: 10, EARTH_GUARDIAN: 8, EARTH_METALBENDER: 4,
        }),
      },
      {
        id: 'q10_c',
        text: '"Eu sou minha conexão e minha compaixão."',
        scores: s({
          WATER_HEALER: 10, FIRE_SUN_WARRIOR: 6, AIR_ACOLYTE: 4,
        }),
      },
      {
        id: 'q10_d',
        text: '"Eu sou minha liberdade e meu espírito."',
        scores: s({
          AIR_NOMAD: 10, AIR_ACOLYTE: 6, WATER_WARRIOR: 2,
        }),
      },
      {
        id: 'q10_e',
        text: '"Eu sou minha mente e minha engenhosidade."',
        scores: s({
          NON_BENDER_LEADER: 10, NON_BENDER_ENGINEER: 8, NON_BENDER_CHI_BLOCKER: 4,
        }),
      },
      {
        id: 'q10_f',
        text: '"Eu sou minha resiliência e minha adaptabilidade."',
        scores: s({
          WATER_WARRIOR: 10, EARTH_LAVABENDER: 5, NON_BENDER_CHI_BLOCKER: 3,
        }),
      },
    ],
  },
];