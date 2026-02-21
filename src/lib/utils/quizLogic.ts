/**
 * src/lib/utils/quizLogic.ts
 * Contém o algoritmo para calcular o resultado final do quiz.
 */
import { WeightedAffinities, ArchetypeID } from '@/lib/types/avatar';

/**
 * Calcula o arquétipo dominante com base nas pontuações acumuladas.
 *
 * @param scores Um objeto (Record) onde a chave é um ArchetypeID
 * e o valor é a pontuação acumulada.
 * @returns O ArchetypeID com a maior pontuação.
 */
export const calculateResult = (scores: WeightedAffinities): ArchetypeID => {
  let maxScore = -Infinity;

  // Usamos um 'fallback' caso o score esteja vazio.
  // Isso garante que sempre retornamos um arquétipo válido.
  let bestMatch: ArchetypeID = 'AIR_NOMAD_ACOLYTE'; // Um padrão neutro

  // 1. Verifica se 'scores' não está vazio
  const scoreKeys = Object.keys(scores) as ArchetypeID[];
  if (scoreKeys.length === 0) {
    console.warn('Cálculo de resultado chamado com pontuação vazia.');
    return bestMatch;
  }

  // 2. Itera sobre todas as pontuações para encontrar a mais alta
  for (const archetypeId of scoreKeys) {
    const currentScore = scores[archetypeId] || 0;

    if (currentScore > maxScore) {
      maxScore = currentScore;
      bestMatch = archetypeId;
    }
  }

  /*
   * LÓGICA DE DESEMPATE (Opcional - Fase 3):
   * Se quisermos uma lógica mais complexa (ex: se Fogo e Ar empatarem,
   * verificar o segundo maior ponto para pender), poderíamos adicioná-la aqui.
   * Por enquanto, o primeiro a atingir o 'maxScore' vence, o que é robusto.
   */

  console.log(`Resultado calculado: ${bestMatch} com score ${maxScore}`);
  return bestMatch;
};