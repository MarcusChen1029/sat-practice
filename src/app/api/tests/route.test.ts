import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "./route";
import { POST as finishPost } from "./[id]/finish/route";
import { resetDb, seedQuestion } from "@/test/fixtures";
import { prisma } from "@/lib/db";

describe("Test sessions", () => {
  beforeEach(async () => {
    await resetDb();
    for (const id of ["q1aaa", "q2bbb", "q3ccc"]) await seedQuestion(id);
  });

  it("POST creates a session with the requested question count", async () => {
    const req = new Request("http://x/api/tests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ count: 2, durationSec: 600 }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(body.status).toBe("active");
    const ids = JSON.parse(body.questionIds);
    expect(ids).toHaveLength(2);
  });

  it("finish marks session as finished and returns per-question results", async () => {
    const session = await prisma.testSession.create({
      data: { durationSec: 600, questionIds: JSON.stringify(["q1aaa", "q2bbb"]), status: "active" },
    });
    await prisma.attempt.create({
      data: { questionId: "q1aaa", chosen: "C", isCorrect: true, timeSpentMs: 1000, mode: "test", testId: session.id },
    });
    const res = await finishPost(new Request("http://x"), { params: { id: session.id } });
    const body = await res.json();
    expect(body.status).toBe("finished");
    expect(body.results).toHaveLength(2);
  });
});
