import type { PublicQuestion, RevealedQuestion, ChoiceLetter, VisualData } from "./types";

type DbChoice = {
  letter: string;
  text: string;
  rationale: string | null;
};

type DbQuestion = {
  id: string;
  assessment: string;
  test: string;
  domain: string;
  skill: string;
  difficulty: string;
  stimulus: string;
  prompt: string;
  correctChoice: string;
  rationale: string;
  hasVisual: boolean;
  visualType: string | null;
  visualImagePath: string | null;
  visualData: string | null;
  sourcePage: number;
  choices: DbChoice[];
};

function parseVisualData(raw: string | null): VisualData | null {
  if (raw == null) return null;
  try { return JSON.parse(raw) as VisualData; } catch { return null; }
}

function sortChoices(choices: DbChoice[]): DbChoice[] {
  const order = ["A", "B", "C", "D"];
  return [...choices].sort((a, b) => order.indexOf(a.letter) - order.indexOf(b.letter));
}

export function toPublicQuestion(q: DbQuestion): PublicQuestion {
  return {
    id: q.id,
    assessment: q.assessment,
    test: q.test,
    domain: q.domain,
    skill: q.skill,
    difficulty: q.difficulty,
    stimulus: q.stimulus,
    prompt: q.prompt,
    hasVisual: q.hasVisual,
    visualType: q.visualType,
    visualImagePath: q.visualImagePath,
    visualData: parseVisualData(q.visualData),
    sourcePage: q.sourcePage,
    choices: sortChoices(q.choices).map(c => ({
      letter: c.letter as ChoiceLetter,
      text: c.text,
    })),
  };
}

export function toRevealedQuestion(q: DbQuestion): RevealedQuestion {
  return {
    ...toPublicQuestion(q),
    correctChoice: q.correctChoice as ChoiceLetter,
    rationale: q.rationale,
    choices: sortChoices(q.choices).map(c => ({
      letter: c.letter as ChoiceLetter,
      text: c.text,
      rationale: c.rationale,
    })),
  };
}
