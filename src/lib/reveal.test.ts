import { describe, it, expect } from "vitest";
import { toPublicQuestion, toRevealedQuestion } from "./reveal";

const dbRow = {
  id: "abc123",
  assessment: "SAT",
  test: "Reading and Writing",
  domain: "D",
  skill: "S",
  difficulty: "Medium",
  stimulus: "stim",
  prompt: "prompt",
  correctChoice: "C",
  rationale: "FULL_RATIONALE",
  hasVisual: false,
  visualType: null,
  visualImagePath: null,
  visualData: null,
  sourcePage: 1,
  createdAt: new Date(),
  choices: [
    { id: 1, questionId: "abc123", letter: "A", text: "a", rationale: "ra" },
    { id: 2, questionId: "abc123", letter: "B", text: "b", rationale: "rb" },
    { id: 3, questionId: "abc123", letter: "C", text: "c", rationale: "rc" },
    { id: 4, questionId: "abc123", letter: "D", text: "d", rationale: "rd" },
  ],
};

describe("toPublicQuestion", () => {
  it("strips correctChoice, rationale, and per-choice rationale", () => {
    const pub = toPublicQuestion(dbRow as any);
    expect((pub as any).correctChoice).toBeUndefined();
    expect((pub as any).rationale).toBeUndefined();
    for (const c of pub.choices) {
      expect((c as any).rationale).toBeUndefined();
    }
  });

  it("keeps stimulus, prompt, and choice letters/text", () => {
    const pub = toPublicQuestion(dbRow as any);
    expect(pub.stimulus).toBe("stim");
    expect(pub.choices.map(c => c.letter)).toEqual(["A", "B", "C", "D"]);
    expect(pub.choices[0].text).toBe("a");
  });
});

describe("toRevealedQuestion", () => {
  it("includes correctChoice, rationale, and per-choice rationale", () => {
    const rev = toRevealedQuestion(dbRow as any);
    expect(rev.correctChoice).toBe("C");
    expect(rev.rationale).toBe("FULL_RATIONALE");
    expect(rev.choices[0].rationale).toBe("ra");
  });
});
