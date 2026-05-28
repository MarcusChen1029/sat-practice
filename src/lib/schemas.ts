import { z } from "zod";

export const ChoiceLetterSchema = z.enum(["A", "B", "C", "D"]);

export const IngestChoiceSchema = z.object({
  letter: ChoiceLetterSchema,
  text: z.string().min(1),
  rationale: z.string().nullable().optional(),
});

export const IngestQuestionSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{6,12}$/i, "id must be hex-ish from PDF"),
  assessment: z.string(),
  test: z.string(),
  domain: z.string(),
  skill: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  stimulus: z.string(),
  prompt: z.string(),
  choices: z.array(IngestChoiceSchema).length(4),
  correctChoice: ChoiceLetterSchema,
  rationale: z.string(),
  hasVisual: z.boolean(),
  visualType: z.enum(["image", "table", "image+data"]).nullable().optional(),
  visualBbox: z.tuple([z.number(), z.number(), z.number(), z.number()]).nullable().optional(),
  visualData: z.unknown().nullable().optional(),
  sourcePage: z.number().int().positive(),
});
export type IngestQuestion = z.infer<typeof IngestQuestionSchema>;

export const AttemptInputSchema = z.object({
  questionId: z.string(),
  chosen: ChoiceLetterSchema,
  timeSpentMs: z.number().int().nonnegative(),
  mode: z.enum(["practice", "test"]),
  testId: z.string().optional(),
});

export const ListFiltersSchema = z.object({
  test: z.string().optional(),
  domain: z.string().optional(),
  skill: z.string().optional(),
  difficulty: z.string().optional(),
  status: z.enum(["unseen", "wrong", "bookmarked", "all"]).default("all"),
  limit: z.coerce.number().int().positive().max(200).default(50),
  cursor: z.string().optional(),
});

export const CreateTestSchema = z.object({
  test: z.string().optional(),
  domain: z.string().optional(),
  difficulty: z.string().optional(),
  count: z.number().int().min(1).max(100),
  durationSec: z.number().int().min(60),
});
