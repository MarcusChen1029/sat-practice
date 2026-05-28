import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const totalAttempts = await prisma.attempt.count();
  const correctAttempts = await prisma.attempt.count({ where: { isCorrect: true } });
  const byTest = await prisma.$queryRawUnsafe<Array<{ test: string; total: bigint; correct: bigint }>>(
    `SELECT q.test as test, COUNT(*) as total, SUM(CASE WHEN a.isCorrect THEN 1 ELSE 0 END) as correct
     FROM Attempt a JOIN Question q ON q.id = a.questionId GROUP BY q.test`
  );
  const byDomain = await prisma.$queryRawUnsafe<Array<{ domain: string; total: bigint; correct: bigint }>>(
    `SELECT q.domain as domain, COUNT(*) as total, SUM(CASE WHEN a.isCorrect THEN 1 ELSE 0 END) as correct
     FROM Attempt a JOIN Question q ON q.id = a.questionId GROUP BY q.domain`
  );
  const byDifficulty = await prisma.$queryRawUnsafe<Array<{ difficulty: string; total: bigint; correct: bigint }>>(
    `SELECT q.difficulty as difficulty, COUNT(*) as total, SUM(CASE WHEN a.isCorrect THEN 1 ELSE 0 END) as correct
     FROM Attempt a JOIN Question q ON q.id = a.questionId GROUP BY q.difficulty`
  );

  function coerceRows<T extends { total: bigint; correct: bigint }>(
    rows: T[]
  ): Array<Omit<T, "total" | "correct"> & { total: number; correct: number }> {
    return rows.map(r => ({ ...r, total: Number(r.total), correct: Number(r.correct) }));
  }

  return NextResponse.json({
    totalAttempts,
    correctAttempts,
    overallAccuracy: totalAttempts > 0 ? correctAttempts / totalAttempts : 0,
    byTest: coerceRows(byTest),
    byDomain: coerceRows(byDomain),
    byDifficulty: coerceRows(byDifficulty),
  });
}
