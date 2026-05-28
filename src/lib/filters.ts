import type { z } from "zod";
import type { ListFiltersSchema } from "./schemas";

type Filters = z.infer<typeof ListFiltersSchema>;

export function buildQuestionWhere(f: Filters): Record<string, unknown> {
  const where: Record<string, unknown> = {};
  if (f.test) where.test = f.test;
  if (f.domain) where.domain = f.domain;
  if (f.skill) where.skill = f.skill;
  if (f.difficulty) where.difficulty = f.difficulty;
  if (f.status === "bookmarked") where.bookmark = { isNot: null };
  else if (f.status === "unseen") where.attempts = { none: {} };
  else if (f.status === "wrong") where.attempts = { some: { isCorrect: false } };
  return where;
}
