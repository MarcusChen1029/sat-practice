"use client";
import { useState } from "react";

export function AdminClient() {
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  async function runIngest(file: File) {
    setBusy(true);
    setLog(l => [...l, `Uploading ${file.name}...`]);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/ingest", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    setLog(l => [...l, JSON.stringify(data, null, 2)]);
    setBusy(false);
  }

  return (
    <>
      <section className="rounded border p-4">
        <h2 className="font-semibold">Import questions from PDF</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Uploads the PDF and re-runs the local chunker + ingest. Note that subagent extraction is offline-only;
          this re-loads any existing question.json files under data/work/.
        </p>
        <input type="file" accept="application/pdf" onChange={e => e.target.files?.[0] && runIngest(e.target.files[0])} disabled={busy} className="mt-2" />
        <pre className="mt-3 max-h-64 overflow-auto rounded bg-neutral-100 p-3 text-xs dark:bg-neutral-900">
          {log.join("\n")}
        </pre>
      </section>
    </>
  );
}
