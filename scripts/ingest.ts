/* Orchestrator: scans data/work/q-XXX-<id>/question.json (produced by subagents)
   and loads each into the DB. Visuals are rendered client-side from structured
   visualData (tables / charts) — no source images are embedded, so answer text
   that may appear beside a figure on the PDF page can never leak. */
import { promises as fs } from "node:fs";
import path from "node:path";
import { IngestQuestionSchema } from "../src/lib/schemas";
import { upsertIngestQuestion } from "../src/lib/ingestLoad";

const ROOT = path.resolve(__dirname, "..");
const WORK = path.join(ROOT, "data", "work");
const REPORT = path.join(WORK, "ingest-report.md");

async function main() {
  const entries = (await fs.readdir(WORK, { withFileTypes: true }))
    .filter(d => d.isDirectory() && d.name.startsWith("q-"))
    .map(d => path.join(WORK, d.name));

  const lines: string[] = ["# Ingest report", ""];
  let ok = 0, skipped = 0, failed = 0;

  for (const dir of entries) {
    const jsonPath = path.join(dir, "question.json");
    try {
      const exists = await fs.stat(jsonPath).then(() => true).catch(() => false);
      if (!exists) { skipped++; lines.push(`- ${path.basename(dir)}: SKIP - no question.json`); continue; }
      const raw = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
      const parsed = IngestQuestionSchema.safeParse(raw);
      if (!parsed.success) { failed++; lines.push(`- ${path.basename(dir)}: FAIL - schema: ${JSON.stringify(parsed.error.flatten())}`); continue; }

      // Visuals are rendered from visualData; never embed source images.
      if (parsed.data.hasVisual && parsed.data.visualData == null) {
        lines.push(`  - ${parsed.data.id}: WARN hasVisual but no visualData (figure will be blank)`);
      }

      await upsertIngestQuestion(parsed.data, null);
      ok++; lines.push(`- ${path.basename(dir)}: OK (${parsed.data.id})`);
    } catch (e: any) {
      failed++; lines.push(`- ${path.basename(dir)}: ERROR - ${e?.message ?? e}`);
    }
  }

  lines.push("", `**Summary:** ${ok} ok, ${skipped} skipped, ${failed} failed`);
  await fs.writeFile(REPORT, lines.join("\n"), "utf-8");
  console.log(`Done. ok=${ok} skipped=${skipped} failed=${failed}. Report at ${REPORT}`);
}

main().catch(err => { console.error(err); process.exit(1); });
