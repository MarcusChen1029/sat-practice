import { describe, it, expect } from "vitest";
import { isCorrect } from "./scoring";

describe("isCorrect", () => {
  it("returns true when chosen matches correctChoice", () => {
    expect(isCorrect("C", "C")).toBe(true);
  });
  it("returns false when chosen does not match", () => {
    expect(isCorrect("A", "C")).toBe(false);
  });
  it("is case-sensitive (DB stores uppercase letters)", () => {
    expect(isCorrect("c" as any, "C")).toBe(false);
  });
});
