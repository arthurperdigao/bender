export interface MapLocation {
  id: string;
  name: string;
  nation: 'water' | 'earth' | 'fire' | 'air';
  description: string;
  x: number; // Percentual da esquerda (0 a 100)
  y: number; // Percentual do topo (0 a 100)
  link?: string;
}

// Coordenadas calibradas MANUALMENTE pelo usuário via modo de arrastar (UI Drag & Drop)
export const MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'ba-sing-se',
    name: 'Ba Sing Se',
    nation: 'earth',
    description: 'A capital impenetrável do Reino da Terra, cercada por anéis gigantes e segredos sombrios protegidos pela Dai Li.',
    x: 76.2,
    y: 33.5,
  },
  {
    id: 'omashu',
    name: 'Omashu',
    nation: 'earth',
    description: 'A cidade montanhosa de Omashu, famosa por seu sistema de entregas radical e seu excêntrico Rei Bumi.',
    x: 65.3,
    y: 58,
  },
  {
    id: 'fire-nation-capital',
    name: 'Capital da Nação do Fogo',
    nation: 'fire',
    description: 'Construída na caldeira de um vulcão adormecido, é o centro do poder industrial e militar do Senhor do Fogo.',
    x: 22,
    y: 51,
  },
  {
    id: 'northern-water-tribe',
    name: 'Tribo da Água do Norte',
    nation: 'water',
    description: 'Uma metrópole de gelo majestosa e espiritual, oculta nas vastidões congeladas do pólo norte.',
    x: 52.7,
    y: 16.5,
  },
  {
    id: 'southern-water-tribe',
    name: 'Tribo da Água do Sul',
    nation: 'water',
    description: 'Um povo guerreiro e resistente que reconstrói suas vilas na dura tundra Antártica.',
    x: 47.2,
    y: 92.4,
  },
  {
    id: 'northern-air-temple',
    name: 'Templo do Ar do Norte',
    nation: 'air',
    description: 'Situado nos picos inatingíveis das montanhas, conhecido por ter sido adaptado com tecnologia a vapor.',
    x: 27.8,
    y: 27,
  },
  {
    id: 'southern-air-temple',
    name: 'Templo do Ar do Sul',
    nation: 'air',
    description: 'O antigo lar do Avatar Aang, empoleirado nas remotas Montanhas Patola.',
    x: 34.6,
    y: 76.6,
  },
  {
    id: 'western-air-temple',
    name: 'Templo do Ar do Oeste',
    nation: 'air',
    description: 'Uma maravilha arquitetônica esculpida de cabeça para baixo nas falésias de um grande desfiladeiro.',
    x: 7.6,
    y: 55.7,
  },
  {
    id: 'eastern-air-temple',
    name: 'Templo do Ar do Leste',
    nation: 'air',
    description: 'Um dos santuários espirituais dos Nômades do Ar, onde Guru Pathik aguardou o Avatar.',
    x: 92.4,
    y: 51.3,
  },
  {
    id: 'kyoshi-island',
    name: 'Ilha Kyoshi',
    nation: 'earth',
    description: 'Uma ilha isolada no Mar de Oitocentos, lar das formidáveis Guerreiras Kyoshi e do gigante Unagi.',
    x: 53.1,
    y: 72,
  },
  {
    id: 'beifong-estate',
    name: 'Propriedade Beifong',
    nation: 'earth',
    description: 'A colossal mansão da Família Biefong na cidade de Gaoling, lar da Mestre Toph.',
    x: 66.8,
    y: 75.3,
  },
  {
    id: 'wan-shi-tong-library',
    name: 'Biblioteca de Wan Shi Tong',
    nation: 'earth',
    description: 'Uma biblioteca espiritual imensa enterrada sob as areias do Deserto de Si Wong.',
    x: 73.9,
    y: 54,
  }
];
