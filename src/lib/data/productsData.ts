/**
 * src/lib/data/productsData.ts
 * 
 * Catálogo de produtos premium do Bazar de Omashu.
 */

export interface Product {
  id: string;
  name: string;
  category: 'Action Figures' | 'Colecionáveis' | 'Acessórios' | 'Vestuário';
  price: number;
  description: string;
  features: string[];
  image: string;
  rating: number;
  reviews: number;
  stock: number;
}

export const products: Product[] = [
  {
    id: 'aang-avatar-state',
    name: 'Statue Aang: Estado Avatar (Edição de Luxo)',
    category: 'Action Figures',
    price: 1299.90,
    description: 'Capture a essência do poder supremo com esta estátua de colecionador. Com iluminação LED nos olhos e setas, e elementos translúcidos que flutuam ao redor do Avatar.',
    features: ['Iluminação LED Integrada', 'Pintura feita à mão', 'Escala 1/6', 'Base temática de pedra'],
    image: '/assets/shop/aang-figure.png',
    rating: 4.9,
    reviews: 124,
    stock: 15
  },
  {
    id: 'blue-spirit-mask',
    name: 'Máscara do Espírito Azul (Réplica Premium)',
    category: 'Colecionáveis',
    price: 450.00,
    description: 'Uma réplica fiel em escala real da máscara usada pelo lendário Espírito Azul. Feita de poliresina de alta densidade com acabamento que simula madeira e metal envelhecido.',
    features: ['Escala Real 1:1', 'Suporte de exibição incluso', 'Textura realista', 'Edição Limitada'],
    image: '/assets/shop/blue-spirit-mask.png',
    rating: 5.0,
    reviews: 86,
    stock: 20
  },
  {
    id: 'elemental-keychains',
    name: 'Conjunto de Chaveiros Elementais (Relíquias do Lótus)',
    category: 'Acessórios',
    price: 89.90,
    description: 'Leve o poder das quatro nações com você. Chaveiros em metal fundido com o símbolo de cada elemento cravado em pedras que brilham sob a luz.',
    features: ['Metal de alta durabilidade', 'Acabamento em ouro e prata velha', 'Conjunto com as 4 Nações', 'Design Exclusivo'],
    image: '/assets/shop/keychains.png',
    rating: 4.7,
    reviews: 245,
    stock: 100
  },
  {
    id: 'appa-plush-giant',
    name: 'Pelúcia Gigante Appa (6 Patas de Puro Conforto)',
    category: 'Colecionáveis',
    price: 320.00,
    description: 'O companheiro de viagem perfeito. Uma pelúcia de 80cm feita com materiais ultra-macios e detalhes bordados de alta qualidade.',
    features: ['80cm de comprimento', 'Material hipoalergênico', 'Detalhes bordados', 'Extremamente macio'],
    image: '/assets/shop/appa-plush.png',
    rating: 4.8,
    reviews: 512,
    stock: 45
  }
];
