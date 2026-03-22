import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  let db: ReturnType<typeof Database> | null = null;
  try {
    const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
    db = new Database(dbPath, { readonly: true });

    // Consulta totais de XP agrupados por elementoNato
    const rows = db.prepare(`
      SELECT elementoNato, SUM(totalXp) as totalScore
      FROM User
      WHERE elementoNato IS NOT NULL AND elementoNato != ''
      GROUP BY elementoNato
    `).all() as { elementoNato: string; totalScore: number }[];

    // Garante que todas as 4 nações estão representadas
    const nationMap: Record<string, number> = {
      FOGO: 0,
      AGUA: 0,
      TERRA: 0,
      AR: 0,
    };

    let totalGlobalXP = 0;

    for (const row of rows) {
      let key = row.elementoNato.toUpperCase();
      if (key === 'ÁGUA') key = 'AGUA';

      if (key in nationMap) {
        const xp = Number(row.totalScore) || 0;
        nationMap[key] += xp;
        totalGlobalXP += xp;
      }
    }

    // Formata e ordena do maior para o menor
    const rankings = Object.entries(nationMap)
      .map(([element, score]) => ({
        element,
        score,
        percentage: totalGlobalXP > 0
          ? parseFloat(((score / totalGlobalXP) * 100).toFixed(1))
          : 0,
      }))
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      totalGlobalXP,
      rankings,
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Erro no ranking das nações:', msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  } finally {
    db?.close();
  }
}
