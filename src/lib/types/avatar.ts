/**
 * src/lib/types/avatar.ts
 * 
 * Tipos centrais do sistema de quiz "O Chamado Espiritual"
 */

// ─── Resultados do Quiz ───
// Cada resultado representa um arquétipo único no universo Avatar
export type ResultID =
  // Dobradores de Água
  | 'WATER_HEALER'          // Curandeiro — foco em cura espiritual
  | 'WATER_WARRIOR'         // Guerreiro do Gelo — combate e resiliência
  | 'WATER_BLOODBENDER'     // Mestre da Vontade — controle absoluto (raro)
  // Dobradores de Terra
  | 'EARTH_GUARDIAN'        // Guardião de Ba Sing Se — estabilidade
  | 'EARTH_METALBENDER'     // Dobrador de Metal — inovação (Zaofu)
  | 'EARTH_LAVABENDER'      // Dobrador de Lava — poder bruto e adaptação
  // Dobradores de Fogo
  | 'FIRE_LIGHTNING'        // Relâmpago — precisão e controle frio
  | 'FIRE_SUN_WARRIOR'      // Guerreiro do Sol — fogo como vida, não destruição
  | 'FIRE_COMBUSTION'       // Combustão — poder concentrado e destrutivo
  // Dobradores de Ar
  | 'AIR_NOMAD'             // Nômade Espiritual — desapego e liberdade
  | 'AIR_ACOLYTE'           // Acólito — reconstrução e comunidade
  // Não-Dobradores (igualmente épicos)
  | 'NON_BENDER_LEADER'     // Líder/Estrategista — como Sokka
  | 'NON_BENDER_KYOSHI'     // Guerreiro de Kyoshi — disciplina e proteção
  | 'NON_BENDER_CHI_BLOCKER' // Chi-Blocker — como Ty Lee
  | 'NON_BENDER_ENGINEER';  // Engenheiro/Inventor — como o Mecanista

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