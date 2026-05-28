import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toRevealedQuestion } from "@/lib/reveal";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const s = await prisma.testSession.update({
    where: { id: params.id },
    data: { status: "finished", finishedAt: new Date() },
  });
  const ids: string[] = JSON.parse(s.questionIds);
  const questions = await prisma.question.findMany({
    where: { id: { in: ids } },
    include: { choices: true, attempts: { where: { testId: s.id } } },
  });
  const results = questions.map(q => ({
    question: toRevealedQuestion(q as any),
    attempt: q.attempts[0] ?? null,
  }));
  return NextResponse.json({ status: s.status, results });
}
