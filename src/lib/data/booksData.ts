export interface Book {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  pdfUrl: string;
}

export const AVATAR_BOOKS: Book[] = [
  {
    id: 'a-ascensao-de-kyoshi',
    title: 'A Ascensão de Kyoshi',
    subtitle: 'O Primeiro Livro de Kyoshi',
    cover: '/livros/capa-kyoshi.png',
    pdfUrl: '/livros/A-Ascensao-de-Kyoshi.pdf'
  }
];
