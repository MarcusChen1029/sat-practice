import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AttemptInputSchema } from "@/lib/schemas";
import { isCorrect } from "@/lib/scoring";
import { toRevealedQuestion } from "@/lib/reveal";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = AttemptInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const q = await prisma.question.findUnique({
    where: { id: parsed.data.questionId },
    include: { choices: true },
  });
  if (!q) return NextResponse.json({ error: "question not found" }, { status: 404 });

  const correct = isCorrect(parsed.data.chosen, q.correctChoice as any);
  await prisma.attempt.create({
    data: {
      questionId: q.id,
      chosen: parsed.data.chosen,
      isCorrect: correct,
      timeSpentMs: parsed.data.timeSpentMs,
      mode: parsed.data.mode,
      testId: parsed.data.testId,
    },
  });

  return NextResponse.json({
    isCorrect: correct,
    question: toRevealedQuestion(q as any),
  });
}
