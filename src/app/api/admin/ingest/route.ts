import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no file" }, { status: 400 });
  const root = process.cwd();
  const dest = path.join(root, "data", "source.pdf");
  await writeFile(dest, Buffer.from(await file.arrayBuffer()));

  // Re-chunk and re-load. NOTE: subagent extraction of question.json is offline-only;
  // this endpoint only re-chunks and re-loads existing question.json files.
  const chunk = spawnSync("python", [path.join(root, "scripts", "chunk_pdf.py")], { encoding: "utf-8" });
  const ingest = spawnSync("npx", ["tsx", path.join(root, "scripts", "ingest.ts")], { encoding: "utf-8", shell: true });

  return NextResponse.json({
    chunkOutput: chunk.stdout, chunkErr: chunk.stderr,
    ingestOutput: ingest.stdout, ingestErr: ingest.stderr,
  });
}
