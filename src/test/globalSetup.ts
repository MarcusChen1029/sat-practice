import { promises as fs } from "node:fs";
import path from "node:path";

/* Give the test suite its own SQLite file so it can reset/seed freely without
   ever touching prisma/dev.db (the real question bank). We seed the schema by
   copying the dev.db file once before any tests run. */
export async function setup() {
  const prismaDir = path.resolve(__dirname, "..", "..", "prisma");
  const dev = path.join(prismaDir, "dev.db");
  const test = path.join(prismaDir, "test.db");
  await fs.copyFile(dev, test);
}

export async function teardown() {
  const test = path.resolve(__dirname, "..", "..", "prisma", "test.db");
  await fs.rm(test, { force: true });
  await fs.rm(`${test}-journal`, { force: true });
}
