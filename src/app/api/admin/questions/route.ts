import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { IngestQuestionSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const parsed = IngestQuestionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const d = parsed.data;
  const q = await prisma.question.upsert({
    where: { id: d.id },
    create: {
      id: d.id, assessment: d.assessment, test: d.test, domain: d.domain, skill: d.skill,
      difficulty: d.difficulty, stimulus: d.stimulus, prompt: d.prompt,
      correctChoice: d.correctChoice, rationale: d.rationale,
      hasVisual: d.hasVisual,
      visualType: d.visualType ?? null,
      visualData: d.visualData != null ? JSON.stringify(d.visualData) : null,
      sourcePage: d.sourcePage,
      choices: { create: d.choices.map(c => ({ letter: c.letter, text: c.text, rationale: c.rationale ?? null })) },
    },
    update: {
      assessment: d.assessment, test: d.test, domain: d.domain, skill: d.skill,
      difficulty: d.difficulty, stimulus: d.stimulus, prompt: d.prompt,
      correctChoice: d.correctChoice, rationale: d.rationale,
      hasVisual: d.hasVisual,
      visualType: d.visualType ?? null,
      visualData: d.visualData != null ? JSON.stringify(d.visualData) : null,
      sourcePage: d.sourcePage,
    },
  });
  return NextResponse.json(q);
}
