import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "./route";
import { resetDb, seedQuestion } from "@/test/fixtures";
import { prisma } from "@/lib/db";

describe("GET /api/questions/:id", () => {
  beforeEach(async () => {
    await resetDb();
    await seedQuestion("ddd444");
  });

  it("hides rationale and correctChoice when no attempt exists", async () => {
    const res = await GET(new Request("http://x/api/questions/ddd444"), { params: { id: "ddd444" } });
    const body = await res.json();
    expect(body.rationale).toBeUndefined();
    expect(body.correctChoice).toBeUndefined();
    for (const c of body.choices) expect(c.rationale).toBeUndefined();
  });

  it("reveals rationale when an attempt exists", async () => {
    await prisma.attempt.create({
      data: { questionId: "ddd444", chosen: "A", isCorrect: false, timeSpentMs: 1000, mode: "practice" },
    });
    const res = await GET(new Request("http://x/api/questions/ddd444"), { params: { id: "ddd444" } });
    const body = await res.json();
    expect(body.rationale).toBe("rationale ddd444");
    expect(body.correctChoice).toBe("C");
  });

  it("reveals rationale when ?reveal=1 (for review)", async () => {
    const res = await GET(new Request("http://x/api/questions/ddd444?reveal=1"), { params: { id: "ddd444" } });
    const body = await res.json();
    expect(body.rationale).toBe("rationale ddd444");
  });

  it("returns 404 for unknown id", async () => {
    const res = await GET(new Request("http://x/api/questions/missing"), { params: { id: "missing" } });
    expect(res.status).toBe(404);
  });
});
