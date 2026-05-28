import { describe, it, expect } from "vitest";
import { buildQuestionWhere } from "./filters";

describe("buildQuestionWhere", () => {
  it("returns empty object when no filters", () => {
    expect(buildQuestionWhere({ status: "all", limit: 50 })).toEqual({});
  });
  it("filters by test/domain/skill/difficulty", () => {
    const w = buildQuestionWhere({
      test: "Math", domain: "Algebra", skill: "Linear", difficulty: "Hard",
      status: "all", limit: 50,
    });
    expect(w).toEqual({ test: "Math", domain: "Algebra", skill: "Linear", difficulty: "Hard" });
  });
  it("filters by bookmarked status", () => {
    const w = buildQuestionWhere({ status: "bookmarked", limit: 50 });
    expect(w).toEqual({ bookmark: { isNot: null } });
  });
  it("filters by unseen status", () => {
    const w = buildQuestionWhere({ status: "unseen", limit: 50 });
    expect(w).toEqual({ attempts: { none: {} } });
  });
  it("filters by wrong status", () => {
    const w = buildQuestionWhere({ status: "wrong", limit: 50 });
    expect(w).toEqual({ attempts: { some: { isCorrect: false } } });
  });
});
