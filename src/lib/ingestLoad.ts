import { prisma } from "@/lib/db";
import type { IngestQuestion } from "@/lib/schemas";

export async function upsertIngestQuestion(d: IngestQuestion, visualImagePath: string | null) {
  return prisma.question.upsert({
    where: { id: d.id },
    create: {
      id: d.id, assessment: d.assessment, test: d.test, domain: d.domain, skill: d.skill,
      difficulty: d.difficulty, stimulus: d.stimulus, prompt: d.prompt,
      correctChoice: d.correctChoice, rationale: d.rationale,
      hasVisual: d.hasVisual, visualType: d.visualType ?? null, visualImagePath,
      visualData: d.visualData != null ? JSON.stringify(d.visualData) : null,
      sourcePage: d.sourcePage,
      choices: { create: d.choices.map(c => ({ letter: c.letter, text: c.text, rationale: c.rationale ?? null })) },
    },
    update: {
      assessment: d.assessment, test: d.test, domain: d.domain, skill: d.skill,
      difficulty: d.difficulty, stimulus: d.stimulus, prompt: d.prompt,
      correctChoice: d.correctChoice, rationale: d.rationale,
      hasVisual: d.hasVisual, visualType: d.visualType ?? null, visualImagePath,
      visualData: d.visualData != null ? JSON.stringify(d.visualData) : null,
      sourcePage: d.sourcePage,
    },
  });
}
