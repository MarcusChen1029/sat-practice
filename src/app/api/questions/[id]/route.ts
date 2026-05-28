import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toPublicQuestion, toRevealedQuestion } from "@/lib/reveal";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const url = new URL(req.url);
  const reveal = url.searchParams.get("reveal") === "1";
  const row = await prisma.question.findUnique({
    where: { id: params.id },
    include: { choices: true, attempts: { take: 1 } },
  });
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  const hasAttempt = row.attempts.length > 0;
  if (reveal || hasAttempt) {
    return NextResponse.json(toRevealedQuestion(row as any));
  }
  return NextResponse.json(toPublicQuestion(row as any));
}
