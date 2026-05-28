import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CreateTestSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const parsed = CreateTestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const where: Record<string, unknown> = {};
  if (parsed.data.test) where.test = parsed.data.test;
  if (parsed.data.domain) where.domain = parsed.data.domain;
  if (parsed.data.difficulty) where.difficulty = parsed.data.difficulty;

  const matching = await prisma.question.findMany({ where, select: { id: true } });
  const shuffled = matching.map(m => m.id).sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, parsed.data.count);
  if (picked.length < parsed.data.count) {
    return NextResponse.json({ error: `Only ${picked.length} questions match the filter` }, { status: 400 });
  }
  const session = await prisma.testSession.create({
    data: {
      durationSec: parsed.data.durationSec,
      questionIds: JSON.stringify(picked),
      status: "active",
    },
  });
  return NextResponse.json(session);
}
