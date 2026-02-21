/**
 * src/lib/utils/calculateResult.ts
 *
 * Algoritmo para agregar pontuações e determinar o arquétipo final.
 */
import { ScoreObject, ResultID } from '@/lib/types/avatar';
import { quizResultContent } from '@/lib/data/quizResultContent';

export function calculateFinalResult(answers: ScoreObject[]): ResultID {
  const totalScores: Record<string, number> = {};

  // Inicializa todos os resultados possíveis com 0
  const allResults = Object.keys(quizResultContent) as ResultID[];
  allResults.forEach((id) => { totalScores[id] = 0; });

  // Agrega as pontuações de cada resposta
  for (const answer of answers) {
    for (const [resultId, score] of Object.entries(answer)) {
      if (totalScores.hasOwnProperty(resultId)) {
        totalScores[resultId] += score ?? 0;
      }
    }
  }

  // Encontra a maior pontuação
  let maxScore = -Infinity;
  let winner: ResultID = 'AIR_NOMAD';

  for (const resultId of allResults) {
    if (totalScores[resultId] > maxScore) {
      maxScore = totalScores[resultId];
      winner = resultId;
    }
  }

  return winner;
}