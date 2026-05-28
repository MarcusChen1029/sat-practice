import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "./route";
import { DELETE } from "./[id]/route";
import { resetDb, seedQuestion } from "@/test/fixtures";
import { prisma } from "@/lib/db";

describe("Bookmarks API", () => {
  beforeEach(async () => {
    await resetDb();
    await seedQuestion("fff666");
  });

  it("POST creates a bookmark", async () => {
    const req = new Request("http://x/api/bookmarks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ questionId: "fff666" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const found = await prisma.bookmark.findUnique({ where: { questionId: "fff666" } });
    expect(found).not.toBeNull();
  });

  it("DELETE removes a bookmark", async () => {
    await prisma.bookmark.create({ data: { questionId: "fff666" } });
    const res = await DELETE(new Request("http://x"), { params: { id: "fff666" } });
    expect(res.status).toBe(200);
    const found = await prisma.bookmark.findUnique({ where: { questionId: "fff666" } });
    expect(found).toBeNull();
  });
});
