import { prisma } from "@/lib/db";

export async function resetDb() {
  await prisma.attempt.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.testSession.deleteMany();
  await prisma.choice.deleteMany();
  await prisma.question.deleteMany();
}

export async function seedQuestion(id: string, overrides: Partial<{
  test: string; domain: string; skill: string; difficulty: string;
  correctChoice: "A" | "B" | "C" | "D";
}> = {}) {
  return prisma.question.create({
    data: {
      id,
      assessment: "SAT",
      test: overrides.test ?? "Reading and Writing",
      domain: overrides.domain ?? "Information and Ideas",
      skill: overrides.skill ?? "Command of Evidence",
      difficulty: overrides.difficulty ?? "Medium",
      stimulus: `stim ${id}`,
      prompt: `prompt ${id}`,
      correctChoice: overrides.correctChoice ?? "C",
      rationale: `rationale ${id}`,
      hasVisual: false,
      sourcePage: 1,
      choices: {
        create: (["A", "B", "C", "D"] as const).map(letter => ({
          letter,
          text: `${letter} text`,
          rationale: `${letter} rationale`,
        })),
      },
    },
  });
}
