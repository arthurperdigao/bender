/**
 * src/lib/types/trivia.ts
 *
 * Define o schema para as perguntas do Quiz de Trivia.
 */
export interface TriviaQuestion {
  id?: string;
  question: string;
  options: [string, string, string, string];
  correctAnswerIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  loreReference?: string; // Opcional: "Livro 1: Fogo, Ep. 16"
}