/* Orchestrator: scans data/work/q-XXX-<id>/question.json (produced by subagents)
   and loads each into the DB. Crops visuals if visualBbox is present. */
import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { IngestQuestionSchema } from "../src/lib/schemas";
import { upsertIngestQuestion } from "../src/lib/ingestLoad";

const ROOT = path.resolve(__dirname, "..");
const WORK = path.join(ROOT, "data", "work");
const IMG_DIR = path.join(ROOT, "public", "images", "q");
const REPORT = path.join(WORK, "ingest-report.md");

async function main() {
  await fs.mkdir(IMG_DIR, { recursive: true });
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

      let visualImagePath: string | null = null;
      if (parsed.data.hasVisual && parsed.data.visualBbox) {
        const dst = path.join(IMG_DIR, `${parsed.data.id}.png`);
        const src = path.join(dir, "question.png");
        const r = spawnSync("python", [path.join(ROOT, "scripts", "crop_image.py"), JSON.stringify({ src, dst, bbox: parsed.data.visualBbox })]);
        if (r.status === 0) visualImagePath = `/images/q/${parsed.data.id}.png`;
        else lines.push(`  - crop failed: ${r.stderr?.toString()}`);
      } else if (parsed.data.hasVisual) {
        // No bbox provided but visual exists - use the full question PNG so user at least sees something
        const dst = path.join(IMG_DIR, `${parsed.data.id}.png`);
        const src = path.join(dir, "question.png");
        try {
          await fs.copyFile(src, dst);
          visualImagePath = `/images/q/${parsed.data.id}.png`;
        } catch { /* no PNG available */ }
      }

      await upsertIngestQuestion(parsed.data, visualImagePath);
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
