import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ListFiltersSchema } from "@/lib/schemas";
import { buildQuestionWhere } from "@/lib/filters";
import { toPublicQuestion } from "@/lib/reveal";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = ListFiltersSchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const where = buildQuestionWhere(parsed.data);
  const rows = await prisma.question.findMany({
    where,
    include: { choices: true },
    orderBy: { id: "asc" },
    take: parsed.data.limit,
  });
  return NextResponse.json({
    items: rows.map(r => {
      const pub = toPublicQuestion(r as any);
      const { choices, ...rest } = pub;
      return rest;
    }),
  });
}
