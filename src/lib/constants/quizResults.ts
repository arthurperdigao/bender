/**
 * src/lib/constants/quizResults.ts
 * Define os metadados de cada arquétipo.
 * A lógica das perguntas (quizQuestions.ts) usará as chaves daqui.
 */
import { ArchetypeID } from '@/lib/types/avatar';

interface ArchetypeDetails {
  id: ArchetypeID;
  title: string;
  description: string;
  nation: 'Water' | 'Earth' | 'Fire' | 'Air' | 'RepublicCity';
  sigilImage: string; // Caminho para a imagem do sigilo (ex: /assets/images/ui/sigil_metal_clan.png)
  lottieAnimation?: string; // Caminho para a animação de revelação
}

// Mapeia cada ID de Arquétipo aos seus detalhes
export const ARCHETYPE_DETAILS: Record<ArchetypeID, ArchetypeDetails> = {
  // Água
  WATER_TRIBE_NORTH_HEALER: {
    id: 'WATER_TRIBE_NORTH_HEALER',
    title: 'Curandeiro da Tribo do Norte',
    description: 'Sua força reside na conexão espiritual e na capacidade de proteger e curar.',
    nation: 'Water',
    sigilImage: '/assets/images/ui/sigil_water_north.png',
  },
  WATER_TRIBE_SOUTH_WARRIOR: {
    id: 'WATER_TRIBE_SOUTH_WARRIOR',
    title: 'Guerreiro da Tribo do Sul',
    description: 'Adaptável e resiliente, você enfrenta a tempestade de frente e protege sua comunidade.',
    nation: 'Water',
    sigilImage: '/assets/images/ui/sigil_water_south.png',
  },
  
  // Terra
  EARTH_KINGDOM_BA_SING_SE: {
    id: 'EARTH_KINGDOM_BA_SING_SE',
    title: 'Cidadão de Ba Sing Se',
    description: 'Você valoriza a estabilidade, a ordem e a resiliência. A paciência é sua maior virtude.',
    nation: 'Earth',
    sigilImage: '/assets/images/ui/sigil_earth_kingdom.png',
  },
  EARTH_KINGDOM_KYOSHI_WARRIOR: {
    id: 'EARTH_KINGDOM_KYOSHI_WARRIOR',
    title: 'Guerreiro Kyoshi',
    description: 'Dedicado à tradição, justiça e precisão. Sua disciplina é sua arma.',
    nation: 'Earth',
    sigilImage: '/assets/images/ui/sigil_kyoshi.png',
  },
  EARTH_KINGDOM_METAL_CLAN: {
    id: 'EARTH_KINGDOM_METAL_CLAN',
    title: 'Membro do Clã do Metal',
    description: 'Inovador e progressista, você vê o potencial oculto no mundo e o molda à sua vontade.',
    nation: 'Earth',
    sigilImage: '/assets/images/ui/sigil_metal_clan.png',
  },

  // Fogo
  FIRE_NATION_CAPITAL_ELITE: {
    id: 'FIRE_NATION_CAPITAL_ELITE',
    title: 'Elite da Nação do Fogo',
    description: 'Ambicioso, determinado e com uma vontade inabalável. Você busca seu destino com paixão.',
    nation: 'Fire',
    sigilImage: '/assets/images/ui/sigil_fire_nation.png',
  },
  FIRE_NATION_SUN_WARRIOR: {
    id: 'FIRE_NATION_SUN_WARRIOR',
    title: 'Guerreiro do Sol',
    description: 'Você entende que o fogo não é destruição, mas vida e energia. Sua visão é espiritual.',
    nation: 'Fire',
    sigilImage: '/assets/images/ui/sigil_sun_warrior.png',
  },

  // Ar
  AIR_NOMAD_EASTERN_TEMPLE: {
    id: 'AIR_NOMAD_EASTERN_TEMPLE',
    title: 'Nômade do Templo do Ar do Leste',
    description: 'Desapegado e livre, você busca a iluminação espiritual e a harmonia com o mundo.',
    nation: 'Air',
    sigilImage: '/assets/images/ui/sigil_air_nomad.png',
  },
  AIR_NOMAD_ACOLYTE: {
    id: 'AIR_NOMAD_ACOLYTE',
    title: 'Acólito do Ar',
    description: 'Você abraça a mudança, adaptando as antigas tradições para ajudar a construir um novo futuro.',
    nation: 'Air',
    sigilImage: '/assets/images/ui/sigil_air_acolyte.png',
  },
  
  // Não-Dobrador
  NON_BENDER_MECHANIST: {
    id: 'NON_BENDER_MECHANIST',
    title: 'O Mecanista',
    description: 'Sua mente é sua maior ferramenta. Você cria soluções onde a dobra não pode alcançar.',
    nation: 'RepublicCity',
    sigilImage: '/assets/images/ui/sigil_mechanist.png',
  },
};