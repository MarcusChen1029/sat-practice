import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "./route";
import { resetDb, seedQuestion } from "@/test/fixtures";

describe("POST /api/attempts", () => {
  beforeEach(async () => {
    await resetDb();
    await seedQuestion("eee555", { correctChoice: "C" });
  });

  it("returns isCorrect=true and full rationale when correct answer chosen", async () => {
    const req = new Request("http://x/api/attempts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ questionId: "eee555", chosen: "C", timeSpentMs: 5000, mode: "practice" }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(body.isCorrect).toBe(true);
    expect(body.question.rationale).toBe("rationale eee555");
    expect(body.question.correctChoice).toBe("C");
  });

  it("returns isCorrect=false when wrong answer chosen", async () => {
    const req = new Request("http://x/api/attempts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ questionId: "eee555", chosen: "A", timeSpentMs: 5000, mode: "practice" }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(body.isCorrect).toBe(false);
  });

  it("returns 400 on invalid body", async () => {
    const req = new Request("http://x/api/attempts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ questionId: "eee555", chosen: "Z" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
