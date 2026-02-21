/**
 * src/lib/data/quizResultContent.ts
 *
 * Conteúdo visual e narrativo para cada resultado do quiz.
 * Cada arquétipo tem cores, ícone, citação e descrição únicos.
 */
import { ResultID, ResultContent } from '@/lib/types/avatar';

export const quizResultContent: Record<ResultID, ResultContent> = {
  // ═══════════════════════════════════════
  // ÁGUA
  // ═══════════════════════════════════════
  WATER_HEALER: {
    title: 'Curandeiro Espiritual',
    subtitle: 'Tribo da Água',
    description: 'Você enxerga a energia que flui em todas as coisas vivas. Sua força não está no combate, mas na conexão e na restauração. Como Katara descobriu nas águas do Oásis do Espírito, sua dobra é um dom sagrado — a capacidade de curar feridas que nenhuma arma pode alcançar.',
    element: 'water',
    colors: { primary: '#00d4ff', secondary: '#0a1628', accent: '#7dd3fc' },
    icon: '💧',
    quote: '"A água é o elemento da mudança. Ela se adapta, flui e cura."',
  },
  WATER_WARRIOR: {
    title: 'Guerreiro do Gelo',
    subtitle: 'Tribo da Água do Sul',
    description: 'Resiliente, adaptável e ferozmente protetor. Você usa a água não apenas para curar, mas para dominar. Como Pakku e os mestres do Polo Norte, você transforma gelo em armadura e neve em tempestade. Sua força vem da lua e sua vontade é inabalável como uma geleira.',
    element: 'water',
    colors: { primary: '#38bdf8', secondary: '#0c1e3a', accent: '#bae6fd' },
    icon: '🧊',
    quote: '"A maré não pede permissão. Ela simplesmente avança."',
  },
  WATER_BLOODBENDER: {
    title: 'Mestre da Vontade',
    subtitle: 'Dobra de Sangue',
    description: 'Você entende o controle em seu nível mais fundamental. Uma habilidade temida e proibida, mas nascida da mais pura necessidade. Como Hama, você aprendeu que dentro de cada ser vivo existe água — e portanto, existe controle. Seu poder é absoluto, mas seu caminho é solitário.',
    element: 'water',
    colors: { primary: '#dc2626', secondary: '#1a0a0a', accent: '#fca5a5' },
    icon: '🩸',
    quote: '"O verdadeiro poder não está nos punhos. Está no sangue."',
  },

  // ═══════════════════════════════════════
  // TERRA
  // ═══════════════════════════════════════
  EARTH_GUARDIAN: {
    title: 'Guardião Inabalável',
    subtitle: 'Reino da Terra',
    description: 'Você é a montanha que não se move. Paciente, resiliente e leal, você acredita que a verdadeira força está em resistir, não em atacar. Como os muros de Ba Sing Se que protegeram milhões por séculos, você é o escudo que nunca quebra.',
    element: 'earth',
    colors: { primary: '#22c55e', secondary: '#0a1f0a', accent: '#86efac' },
    icon: '🪨',
    quote: '"Seja a rocha contra a qual a maré se quebra."',
  },
  EARTH_METALBENDER: {
    title: 'Dobrador de Metal',
    subtitle: 'Clã de Zaofu',
    description: 'Inflexível e inovador. Onde outros veem terra, você vê metal. Onde outros veem impossibilidade, você vê potencial. Como Toph Beifong — que inventou uma arte inteiramente nova — você recusa os limites que o mundo impõe e forja seu próprio caminho.',
    element: 'earth',
    colors: { primary: '#a3a3a3', secondary: '#171717', accent: '#e5e5e5' },
    icon: '⛓️',
    quote: '"Não existe metal que eu não possa dobrar. Não existe barreira que me detenha."',
  },
  EARTH_LAVABENDER: {
    title: 'Dobrador de Lava',
    subtitle: 'Poder Primordial',
    description: 'Você carrega o fogo da terra dentro de si. Raro e devastador, a Dobra de Lava é a ponte entre a estabilidade da terra e a fúria do fogo. Como Bolin descobriu em seu momento de maior necessidade, seu poder surge quando a paixão encontra a determinação.',
    element: 'earth',
    colors: { primary: '#f97316', secondary: '#1c0a00', accent: '#fdba74' },
    icon: '🌋',
    quote: '"A terra não é apenas pedra. É fogo adormecido, esperando despertar."',
  },

  // ═══════════════════════════════════════
  // FOGO
  // ═══════════════════════════════════════
  FIRE_LIGHTNING: {
    title: 'O Relâmpago Frio',
    subtitle: 'Nação do Fogo',
    description: 'Sua dobra não é sobre raiva. É sobre separação perfeita — yin e yang, positivo e negativo. No instante em que outros hesitam, você age com a precisão de um raio. Como Azula em seu auge, ou Iroh em sua sabedoria, você comanda a energia mais pura.',
    element: 'fire',
    colors: { primary: '#a78bfa', secondary: '#1a0a2e', accent: '#c4b5fd' },
    icon: '⚡',
    quote: '"O relâmpago não hesita. Ele simplesmente é."',
  },
  FIRE_SUN_WARRIOR: {
    title: 'Guerreiro do Sol',
    subtitle: 'Os Mestres Originais',
    description: 'Você aprendeu com os dragões. Para você, o fogo não é destruição — é vida, energia e verdade. Como Zuko e Aang descobriram diante de Ran e Shaw, a verdadeira Dobra de Fogo não nasce da raiva, mas da beleza e da conexão com a vida.',
    element: 'fire',
    colors: { primary: '#f59e0b', secondary: '#1a1000', accent: '#fcd34d' },
    icon: '☀️',
    quote: '"O fogo é vida, não destruição. Essa é a lição dos mestres."',
  },
  FIRE_COMBUSTION: {
    title: 'Combustão',
    subtitle: 'Poder Concentrado',
    description: 'Um poder raro e devastador. Você não dobra o fogo com as mãos — você o projeta com a mente. Como o Homem Combustão e P\'Li, seu foco é absoluto e seu poder é concentrado em um único ponto de destruição. Poucos compreendem; todos temem.',
    element: 'fire',
    colors: { primary: '#ef4444', secondary: '#1a0000', accent: '#fca5a5' },
    icon: '💥',
    quote: '"Um pensamento. Um ponto. Uma explosão. É tudo que preciso."',
  },

  // ═══════════════════════════════════════
  // AR
  // ═══════════════════════════════════════
  AIR_NOMAD: {
    title: 'Nômade Espiritual',
    subtitle: 'Templos do Ar',
    description: 'Desapegado do mundo material, você busca a iluminação. Como Aang e o Guru Pathik, você entende que a verdadeira liberdade está em soltar — soltar a raiva, o medo, a vergonha. O ar é o elemento da liberdade, e ninguém é mais livre que você.',
    element: 'air',
    colors: { primary: '#fbbf24', secondary: '#1a1400', accent: '#fde68a' },
    icon: '🌬️',
    quote: '"Quando você se liberta das coisas terrenas, entra no vazio."',
  },
  AIR_ACOLYTE: {
    title: 'Acólito do Ar',
    subtitle: 'Nova Geração',
    description: 'Você pode não ter nascido Nômade do Ar, mas escolheu seu caminho. Como os Acólitos que reconstruíram a cultura após o genocídio, você honra o passado enquanto constrói o futuro. Sua força está na adaptação e na comunidade.',
    element: 'air',
    colors: { primary: '#fb923c', secondary: '#1a0e00', accent: '#fed7aa' },
    icon: '🍃',
    quote: '"Não é preciso nascer livre. Basta escolher ser livre."',
  },

  // ═══════════════════════════════════════
  // NÃO-DOBRADORES
  // ═══════════════════════════════════════
  NON_BENDER_LEADER: {
    title: 'O Estrategista',
    subtitle: 'Líder Natural',
    description: 'Dobra? Quem precisa de dobra? Como Sokka, você prova que a mente é a arma mais poderosa do mundo. Planejamento, humor, liderança e coragem — você compensa a falta de poderes com genialidade tática e um coração inabalável. Todo grupo precisa de alguém como você.',
    element: 'none',
    colors: { primary: '#06b6d4', secondary: '#0a1a20', accent: '#67e8f9' },
    icon: '🗡️',
    quote: '"Eu sou o cara do plano. E o plano é incrível."',
  },
  NON_BENDER_KYOSHI: {
    title: 'Guerreiro de Kyoshi',
    subtitle: 'Ilha de Kyoshi',
    description: 'Disciplina, precisão e justiça. Pintado com as cores de guerra e armado com o leque da Avatar Kyoshi, você é uma protetora dedicada. Como Suki e suas guerreiras, sua força não vem da dobra, mas do treinamento implacável e da lealdade absoluta.',
    element: 'none',
    colors: { primary: '#059669', secondary: '#0a1a14', accent: '#6ee7b7' },
    icon: '🪭',
    quote: '"Não subestime uma guerreira por não ser dobradora."',
  },
  NON_BENDER_CHI_BLOCKER: {
    title: 'Mestre de Chi-Blocking',
    subtitle: 'Igualista',
    description: 'Você encontrou a arte de neutralizar dobradores com as próprias mãos. Como Ty Lee, cuja velocidade e precisão a tornavam mais temida que muitos dobradores, ou como os Igualistas de Amon, você prova que o chi é a verdadeira fonte de poder — e você sabe como desligá-lo.',
    element: 'none',
    colors: { primary: '#e879f9', secondary: '#1a0a1e', accent: '#f0abfc' },
    icon: '👊',
    quote: '"Eu não preciso dobrar. Preciso apenas tocar."',
  },
  NON_BENDER_ENGINEER: {
    title: 'O Engenheiro',
    subtitle: 'Indústrias Futuro',
    description: 'O mundo está mudando. Aeronaves, mechas, rádio, carros — a era da tecnologia chegou. Como Asami Sato e o Mecanista, sua mente inventa o futuro. Você é a prova viva de que engenhosidade supera qualquer dobra, e que o progresso é imparável.',
    element: 'none',
    colors: { primary: '#8b5cf6', secondary: '#0f0a1e', accent: '#c4b5fd' },
    icon: '⚙️',
    quote: '"O futuro não será construído com dobra. Será construído com engenhosidade."',
  },
};