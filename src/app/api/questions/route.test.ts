import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "./route";
import { resetDb, seedQuestion } from "@/test/fixtures";

describe("GET /api/questions", () => {
  beforeEach(async () => {
    await resetDb();
    await seedQuestion("aaa111", { test: "Math" });
    await seedQuestion("bbb222", { test: "Reading and Writing" });
  });

  it("returns all questions when no filter", async () => {
    const req = new Request("http://x/api/questions");
    const res = await GET(req);
    const body = await res.json();
    expect(body.items).toHaveLength(2);
  });

  it("filters by test param", async () => {
    const req = new Request("http://x/api/questions?test=Math");
    const res = await GET(req);
    const body = await res.json();
    expect(body.items).toHaveLength(1);
    expect(body.items[0].id).toBe("aaa111");
  });

  it("never returns rationale or correctChoice in list", async () => {
    const req = new Request("http://x/api/questions");
    const res = await GET(req);
    const body = await res.json();
    for (const item of body.items) {
      expect(item.rationale).toBeUndefined();
      expect(item.correctChoice).toBeUndefined();
    }
  });
});
