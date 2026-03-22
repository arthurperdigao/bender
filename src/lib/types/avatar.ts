/**
 * src/lib/types/avatar.ts
 * 
 * Tipos centrais do sistema de quiz "O Chamado Espiritual"
 */

// ─── Resultados do Quiz ───
// Cada resultado representa um arquétipo único no universo Avatar
export type ResultID =
  // ── ÁGUA ──
  | 'WATER_HEALER'          // Curandeiro — técnica sagrada de cura
  | 'WATER_BLOODBENDER'     // Dobra de Sangue — sub-dobra rara e proibida
  | 'WATER_PLANTBENDER'     // Dobra de Planta — controla a água nas plantas
  | 'WATER_MASTER'          // Mestre das Marés — dominador puro sem sub-dobra
  | 'WATER_WARRIOR'         // Guerreiro da Tribo da Água — combate físico e dobra
  // ── TERRA ──
  | 'EARTH_METALBENDER'     // Dobra de Metal — sub-dobra criada por Toph
  | 'EARTH_LAVABENDER'      // Dobra de Lava — sub-dobra de fogo dentro da terra
  | 'EARTH_SANDBENDER'      // Dobra de Areia — estilo fluido e raro
  | 'EARTH_MASTER'          // Pilar Inabalável — dominador puro sem sub-dobra
  | 'EARTH_GUARDIAN'        // Guardião do Reino da Terra — focado em defesa
  // ── FOGO ──
  | 'FIRE_LIGHTNING'        // Dobra de Relâmpago — sub-dobra de precisão fria
  | 'FIRE_COMBUSTION'       // Dobra de Combustão — sub-dobra mental e destrutiva
  | 'FIRE_SUN_WARRIOR'      // Corrente do Sol — filosofia ancestral do fogo como vida
  | 'FIRE_MASTER'           // Chama Eterna — dominador puro sem sub-dobra
  // ── AR ──
  | 'AIR_FLIGHT'            // Voo Espiritual — conquista rarísima (como Zaheer)
  | 'AIR_SPIRITUAL'         // Projeção Espiritual — como Jinora, conexão com espíritos
  | 'AIR_NOMAD'             // Nômade Espiritual — caminho tradicional de desapego
  | 'AIR_MASTER'            // Corrente Livre — dominador puro sem sub-dobra
  | 'AIR_ACOLYTE'           // Acólito do Ar — segue os preceitos sem necessariamente dobrar
  // ── NÃO-DOBRADOR ──
  | 'NON_BENDER_LEADER'     // Estrategista — como Sokka
  | 'NON_BENDER_KYOSHI'     // Guerreiro de Kyoshi — disciplina e proteção
  | 'NON_BENDER_CHI_BLOCKER' // Bloqueador de Chi — como Ty Lee
  | 'NON_BENDER_ENGINEER';  // Engenheiro — como Asami e o Mecanista

// ─── Score do Quiz ───
export type ScoreObject = Partial<Record<ResultID, number>>;

// ─── Opção de pergunta ───
export interface QuizQuestionOption {
  id: string;
  text: string;
  scores: ScoreObject;
}

// ─── Pergunta do Quiz ───
export interface QuizQuestion {
  id: string;
  type: 'narrative' | 'choice';
  prompt: string;
  sceneDescription?: string; // Descrição do cenário para ambientação
  options?: QuizQuestionOption[];
}

// ─── Conteúdo visual do resultado ───
export interface ResultContent {
  title: string;
  subtitle: string;
  description: string;
  element: 'water' | 'earth' | 'fire' | 'air' | 'none';
  colors: {
    primary: string;    // Cor principal do glow
    secondary: string;  // Cor de fundo
    accent: string;     // Cor de destaque
  };
  icon: string;         // Emoji/ícone
  quote: string;        // Frase icônica
}

// ─── Tipos legados (para compatibilidade) ───
export type ArchetypeID =
  | 'WATER_TRIBE_NORTH_HEALER' | 'WATER_TRIBE_SOUTH_WARRIOR'
  | 'EARTH_KINGDOM_BA_SING_SE' | 'EARTH_KINGDOM_KYOSHI_WARRIOR' | 'EARTH_KINGDOM_METAL_CLAN'
  | 'FIRE_NATION_CAPITAL_ELITE' | 'FIRE_NATION_SUN_WARRIOR'
  | 'AIR_NOMAD_EASTERN_TEMPLE' | 'AIR_NOMAD_ACOLYTE'
  | 'NON_BENDER_MECHANIST';

export type WeightedAffinities = Partial<Record<ArchetypeID, number>>;

export interface QuizOption {
  id: string;
  text: string;
  sfxOnSelect?: string;
  affinities: WeightedAffinities;
}

export interface QuizStep {
  id: string;
  type: 'narrative' | 'choice';
  prompt: string;
  options?: QuizOption[];
}

export interface TravelerProfile {
  id: string;
  archetype: ArchetypeID | null;
  nation: 'Water' | 'Earth' | 'Fire' | 'Air' | 'RepublicCity';
}