/**
 * src/lib/data/quizResultContent.ts
 *
 * Conteúdo visual e narrativo para cada resultado do quiz.
 * Estrutura: sub-dobras canônicas + estilos/filosofias + mestre puro por elemento.
 */
import { ResultID, ResultContent } from '@/lib/types/avatar';

export const quizResultContent: Record<ResultID, ResultContent> = {

  // ════════════════════════════════════════════════════
  // ÁGUA
  // ════════════════════════════════════════════════════

  WATER_HEALER: {
    title: 'Curandeiro Espiritual',
    subtitle: 'Técnica Sagrada da Água',
    description: 'Você enxerga a energia que flui em todas as coisas vivas. Sua força não está no combate — está na conexão e na restauração. Como Katara descobriu nas águas do Oásis do Espírito, sua dobra é um dom sagrado. Você toca a ferida e a água obedece, costurando o que foi partido. É uma arte que poucos dominam e ninguém esquece.',
    element: 'water',
    colors: { primary: '#00d4ff', secondary: '#0a1628', accent: '#7dd3fc' },
    icon: '💧',
    quote: '"A água cura o que a guerra quebra — e isso vale mais do que qualquer vitória."',
  },

  WATER_BLOODBENDER: {
    title: 'Mestre da Vontade',
    subtitle: 'Dobra de Sangue',
    description: 'Uma habilidade temida, proibida — e rarísima. A Dobra de Sangue não nasce da raiva, mas da compreensão profunda: toda vida carrega água, e portanto, pode ser tocada. Como Hama sobreviveu ao impossível e criou algo que ninguém mais ousou imaginar. Seu poder é absoluto, mas o peso que carrega, também.',
    element: 'water',
    colors: { primary: '#dc2626', secondary: '#1a0a0a', accent: '#fca5a5' },
    icon: '🩸',
    quote: '"O verdadeiro controle não está nos punhos. Está no fluxo que você sente antes de qualquer movimento."',
  },

  WATER_PLANTBENDER: {
    title: 'Guardião das Raízes',
    subtitle: 'Dobra de Planta',
    description: 'Onde outros veem folhas e galhos, você sente o fluxo invisível de água que sustenta cada ser vivo. A Dobra de Planta é uma extensão da percepção — você alcança a vida onde quer que ela esteja. Como os dobradores que guiavam florestas por campos de batalha, você move o mundo natural com a mesma naturalidade que move o oceano.',
    element: 'water',
    colors: { primary: '#4ade80', secondary: '#0a1a0a', accent: '#bbf7d0' },
    icon: '🌿',
    quote: '"A floresta não luta. Ela simplesmente cresce — e nada a detém."',
  },

  WATER_MASTER: {
    title: 'Mestre das Marés',
    subtitle: 'Dominador Puro da Água',
    description: 'Nenhuma sub-dobra define você — porque você domina a água em sua forma mais completa. Gelo, vapor, ondas, correntes — cada estado é uma linguagem que você fala com fluência absoluta. Como os Grandes Mestres do Polo Norte, sua força não precisa de especialização. Você já é a maré em si.',
    element: 'water',
    colors: { primary: '#38bdf8', secondary: '#0c1e3a', accent: '#bae6fd' },
    icon: '🌊',
    quote: '"A água não escolhe uma forma. Ela preenche todas elas."',
  },

  WATER_WARRIOR: {
    title: 'Guerreiro das Ondas',
    subtitle: 'Combatente da Tribo da Água',
    description: 'Você combina a fluidez da dobra com a bravura do combate físico. Como Hakoda e os guerreiros do Sul, sua força vem da resiliência e da capacidade de se adaptar a qualquer tempestade.',
    element: 'water',
    colors: { primary: '#1e40af', secondary: '#0f172a', accent: '#60a5fa' },
    icon: '🗡️',
    quote: '"O oceano é vasto, mas nós somos o que o move."',
  },

  // ════════════════════════════════════════════════════
  // TERRA
  // ════════════════════════════════════════════════════

  EARTH_METALBENDER: {
    title: 'Dobrador de Metal',
    subtitle: 'Sub-dobra de Metal — Clã de Zaofu',
    description: 'Onde outros veem pedra refinada, você sente terra — e portanto, vida. Toph Beifong inventou uma arte inteiramente nova ao recusar o que era considerado impossível. Você segue esse legado: cada superfície metálica é uma extensão do seu corpo. Você não dobra o metal. Você o convence.',
    element: 'earth',
    colors: { primary: '#a3a3a3', secondary: '#171717', accent: '#e5e5e5' },
    icon: '⛓️',
    quote: '"Impossível é apenas uma palavra que os outros ainda acreditam."',
  },

  EARTH_LAVABENDER: {
    title: 'Dobrador de Lava',
    subtitle: 'Sub-dobra de Lava — Poder Primordial',
    description: 'Você desperta o fogo adormecido dentro da terra. A Dobra de Lava é a ponte entre dois mundos — a solidez da terra e a fúria do fogo. Rarísima e devastadora, ela surge em dobrados que sentem o pulso do planeta em vez da superfície. Como Bolin descobriu no calor do momento, seu poder nasce quando paixão encontra determinação.',
    element: 'earth',
    colors: { primary: '#f97316', secondary: '#1c0a00', accent: '#fdba74' },
    icon: '🌋',
    quote: '"A terra não é apenas pedra. É fogo adormecido — esperando quem saiba despertar."',
  },

  EARTH_SANDBENDER: {
    title: 'Mestre das Areias',
    subtitle: 'Estilo de Areia — Os Povos do Deserto',
    description: 'Onde a terra se recusa a ser sólida, você prospera. A Dobra de Areia exige uma sensibilidade diferente — não a resistência da rocha, mas a fluidez de quem entende que a terra também pode fluir. Os povos do Deserto da Terra dominaram esse estilo por necessidade. Você o domina por natureza.',
    element: 'earth',
    colors: { primary: '#d97706', secondary: '#1a1000', accent: '#fcd34d' },
    icon: '🏜️',
    quote: '"A areia não resiste ao vento. Ela dança com ele — e molda desertos."',
  },

  EARTH_MASTER: {
    title: 'Pilar Inabalável',
    subtitle: 'Dominador Puro da Terra',
    description: 'Nenhuma sub-dobra te define — porque você é a terra em seu estado mais completo. Pedra, cristal, solo, rocha viva — cada forma obedece. Você não precisou inventar uma nova arte. Você dominou a que existe com uma profundidade que poucos alcançam. Como os Grandes Mestres de Ba Sing Se, sua força está na fundação, não no ornamento.',
    element: 'earth',
    colors: { primary: '#22c55e', secondary: '#0a1f0a', accent: '#86efac' },
    icon: '⛰️',
    quote: '"Seja a rocha. Não a rocha que quebra — a rocha sobre a qual tudo se apoia."',
  },

  EARTH_GUARDIAN: {
    title: 'Guardião de Ferro',
    subtitle: 'Protetor do Reino da Terra',
    description: 'Sua força é a defesa absoluta. Você não ataca até que seja necessário, mas quando o faz, é com a solidez de uma montanha. Como os guardas de elite de Ba Sing Se, você é o porto seguro em tempos de caos.',
    element: 'earth',
    colors: { primary: '#166534', secondary: '#064e3b', accent: '#4ade80' },
    icon: '🛡️',
    quote: '"Nada move quem tem a terra sob os pés."',
  },

  // ════════════════════════════════════════════════════
  // FOGO
  // ════════════════════════════════════════════════════

  FIRE_LIGHTNING: {
    title: 'Dobrador de Relâmpago',
    subtitle: 'Sub-dobra de Relâmpago — Nação do Fogo',
    description: 'Sua dobra não nasce da raiva — nasce da separação perfeita. Yin e yang divididos, energia lançada no instante de maior clareza. Como Azula no auge de seu controle, ou Iroh que canalizou o raio de volta ao mundo — você atua com a precisão de quem entendeu que o caos também tem uma geometria. E você a domina.',
    element: 'fire',
    colors: { primary: '#a78bfa', secondary: '#1a0a2e', accent: '#c4b5fd' },
    icon: '⚡',
    quote: '"O relâmpago não pensa. Ele simplesmente encontra o caminho de menor resistência."',
  },

  FIRE_COMBUSTION: {
    title: 'Mestre da Combustão',
    subtitle: 'Sub-dobra de Combustão — Poder Mental',
    description: 'Você não dobra o fogo com as mãos — você o projeta com a mente. Um poder rarísimo e devastador que exige foco total. Como o Homem Combustão e P\'Li, sua força está concentrada em um único ponto de energia absoluta. Um movimento errado e o poder se volta contra você. Mas quando é certo — nada sobrevive.',
    element: 'fire',
    colors: { primary: '#ef4444', secondary: '#1a0000', accent: '#fca5a5' },
    icon: '💥',
    quote: '"Não preciso de movimento. Preciso apenas de foco."',
  },

  FIRE_SUN_WARRIOR: {
    title: 'Guerreiro do Sol',
    subtitle: 'Filosofia Ancestral — Os Mestres Originais',
    description: 'Você aprendeu o que os dragões ensinam: o fogo não é destruição — é vida, energia, verdade. Antes da Nação do Fogo transformar essa arte em arma, havia dobadores que dançavam com a chama como se ela fosse um ser vivo. Como Zuko e Aang descobriram diante de Ran e Shaw, você vê o fogo como os primeiros o viram. Isso te torna mais raro do que qualquer sub-dobrador.',
    element: 'fire',
    colors: { primary: '#f59e0b', secondary: '#1a1000', accent: '#fcd34d' },
    icon: '☀️',
    quote: '"O fogo que destrói e o fogo que aquece saem da mesma chama. A diferença está em quem dobra."',
  },

  FIRE_MASTER: {
    title: 'Chama Eterna',
    subtitle: 'Dominador Puro do Fogo',
    description: 'Nenhuma sub-dobra te define — porque você é o fogo em sua forma mais completa e disciplinada. Chamas, calor, explosão controlada, defesa e ataque — você transita por tudo com maestria. Como os grandes generais da Nação do Fogo que não precisavam de relâmpago para dominar qualquer campo de batalha. Você é a chama que não se apaga.',
    element: 'fire',
    colors: { primary: '#f97316', secondary: '#1c0800', accent: '#fed7aa' },
    icon: '🔥',
    quote: '"Não preciso de um poder especial. Preciso apenas de vontade — e nunca me faltou."',
  },

  // ════════════════════════════════════════════════════
  // AR
  // ════════════════════════════════════════════════════

  AIR_FLIGHT: {
    title: 'Liberdade Absoluta',
    subtitle: 'Voo Espiritual — Conquista Rarísima',
    description: 'Alcançado apenas por quem abriu mão de todas as amarras terrenas — Zaheer atingiu o voo no momento em que libertou o que mais amava. Não é uma técnica. É um estado de ser. Você compreende que a gravidade é uma escolha, e o ar não conhece limites. Pouquíssimos na história chegaram aqui. Você é um deles.',
    element: 'air',
    colors: { primary: '#e0f2fe', secondary: '#0c1a2e', accent: '#bae6fd' },
    icon: '🕊️',
    quote: '"A mente que não se apega a nada — não pode ser contida por nada."',
  },

  AIR_SPIRITUAL: {
    title: 'Projeção Espiritual',
    subtitle: 'Conexão com o Mundo dos Espíritos',
    description: 'Como Jinora, cuja sensibilidade espiritual superava dobadores três vezes mais velhos, você sente o véu entre os mundos como algo fino e permeável. Sua dobra vai além do ar — toca o espírito. Você pode guiar, sentir e projetar sua essência para além do corpo físico. É uma habilidade que não se treina. Ela te escolhe.',
    element: 'air',
    colors: { primary: '#c4b5fd', secondary: '#1a0a2e', accent: '#ddd6fe' },
    icon: '👁️',
    quote: '"O corpo é apenas onde o espírito descansa. Eu vou muito além disso."',
  },

  AIR_NOMAD: {
    title: 'Nômade Espiritual',
    subtitle: 'Caminho Tradicional dos Templos do Ar',
    description: 'Desapegado do mundo material, você busca a iluminação. Como Aang e o Guru Pathik ensinaram — a verdadeira liberdade está em soltar. Soltar a raiva, o medo, o apego. O ar te pertence porque você não pertence a nada. E nessa paradoxal leveza, você carrega o peso do mundo com graça que poucos compreendem.',
    element: 'air',
    colors: { primary: '#fbbf24', secondary: '#1a1400', accent: '#fde68a' },
    icon: '🌬️',
    quote: '"Quando você se liberta das coisas terrenas, entra no vazio — e no vazio, tudo é possível."',
  },

  AIR_MASTER: {
    title: 'Corrente Livre',
    subtitle: 'Dominador Puro do Ar',
    description: 'Nenhuma especialização te define — porque você domina o ar em toda a sua expressão. Velocidade, ilusão, defesa perfeita, mobilidade absoluta — você é o dobador que ninguém consegue atingir e que vai e vem como o vento. Como os grandes Mestres Nômades de antes da guerra, sua arte é completa por si só.',
    element: 'air',
    colors: { primary: '#d4d4d4', secondary: '#111111', accent: '#f5f5f5' },
    icon: '🌪️',
    quote: '"O vento não precisa de forma. Ele simplesmente está em todo lugar ao mesmo tempo."',
  },

  AIR_ACOLYTE: {
    title: 'Acólito do Ar',
    subtitle: 'Seguidor dos Preceitos Nômades',
    description: 'Você pode não dobrar o ar fisicamente, mas sua alma é tão leve quanto o vento. Você vive pelos ensinamentos de paz e liberdade, preservando a cultura nômade para as próximas gerações. Como os Acólitos do Ar que ajudaram Aang a reconstruir seu povo.',
    element: 'air',
    colors: { primary: '#fcd34d', secondary: '#451a03', accent: '#fef3c7' },
    icon: '🙏',
    quote: '"A paz é uma escolha que fazemos a cada respiração."',
  },

  // ════════════════════════════════════════════════════
  // NÃO-DOBRADOR
  // ════════════════════════════════════════════════════

  NON_BENDER_LEADER: {
    title: 'O Estrategista',
    subtitle: 'Líder Natural',
    description: 'Dobra? Quem precisa de dobra? Como Sokka, você prova que a mente é a arma mais poderosa do mundo. Planejamento, humor, liderança e coragem — você compensa toda desvantagem com genialidade tática e um coração inabalável. Todo grupo precisa de alguém como você. Sem você, os dobadores mais poderosos falhariam.',
    element: 'none',
    colors: { primary: '#06b6d4', secondary: '#0a1a20', accent: '#67e8f9' },
    icon: '🗡️',
    quote: '"Eu sou o cara do plano. E o plano é sempre incrível."',
  },

  NON_BENDER_KYOSHI: {
    title: 'Guerreiro de Kyoshi',
    subtitle: 'Ilha de Kyoshi — Disciplina e Proteção',
    description: 'Pintada com as cores de guerra e armada com o leque da Avatar Kyoshi, você é uma protetora dedicada. Disciplina, precisão e justiça — não como ideias abstratas, mas como práticas diárias. Como Suki e suas guerreiras, sua força vem de um treinamento sem fim e de uma lealdade que nunca quebra.',
    element: 'none',
    colors: { primary: '#059669', secondary: '#0a1a14', accent: '#6ee7b7' },
    icon: '🪭',
    quote: '"Não subestime quem não dobra. Subestimar é o primeiro erro — e geralmente o último."',
  },

  NON_BENDER_CHI_BLOCKER: {
    title: 'Bloqueador de Chi',
    subtitle: 'Arte do Bloqueio — Neutralizador de Dobradores',
    description: 'Você encontrou a arte de neutralizar dobradores com as próprias mãos. Como Ty Lee, cuja velocidade e precisão a tornavam mais temida que muitos dobadores, você conhece o mapa do chi humano melhor do que qualquer médico. Um toque no lugar certo — e o poder mais formidável se apaga. Isso te torna temido por todos.',
    element: 'none',
    colors: { primary: '#e879f9', secondary: '#1a0a1e', accent: '#f0abfc' },
    icon: '👊',
    quote: '"Eu não preciso dobrar. Preciso apenas saber onde tocar."',
  },

  NON_BENDER_ENGINEER: {
    title: 'O Engenheiro',
    subtitle: 'Indústrias Futuro — Mente que Cria Mundos',
    description: 'O mundo está mudando. Aeronaves, mechas, rádio, carros — a era da tecnologia chegou e você está na vanguarda. Como Asami Sato e o Mecanista, sua mente inventa o futuro enquanto o presente ainda está tentando entender o passado. Você é a prova viva de que engenhosidade supera qualquer dobra — porque um dobrador não pode criar o que você cria.',
    element: 'none',
    colors: { primary: '#8b5cf6', secondary: '#0f0a1e', accent: '#c4b5fd' },
    icon: '⚙️',
    quote: '"O futuro não será construído com dobra. Será construído com engenhosidade."',
  },
};