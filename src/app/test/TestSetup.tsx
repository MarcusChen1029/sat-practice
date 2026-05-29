"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TestSetup() {
  const router = useRouter();
  const [test, setTest] = useState("");
  const [count, setCount] = useState(10);
  const [durationMin, setDurationMin] = useState(15);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function start() {
    setBusy(true); setErr(null);
    const res = await fetch("/api/tests", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ test: test || undefined, count, durationSec: durationMin * 60 }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setErr(typeof data.error === "string" ? data.error : "Failed to start"); return; }
    router.push(`/test/${data.id}`);
  }

  return (
    <div className="space-y-4 rounded border p-6">
      <label className="block text-sm">Section
        <select value={test} onChange={e => setTest(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2 dark:bg-neutral-900">
          <option value="">Mixed</option>
          <option>Reading and Writing</option>
          <option>Math</option>
        </select>
      </label>
      <label className="block text-sm">Number of questions
        <input type="number" min={1} max={100} value={count} onChange={e => setCount(Number(e.target.value))}
          className="mt-1 block w-full rounded border px-3 py-2 dark:bg-neutral-900" />
      </label>
      <label className="block text-sm">Duration (minutes)
        <input type="number" min={1} max={180} value={durationMin} onChange={e => setDurationMin(Number(e.target.value))}
          className="mt-1 block w-full rounded border px-3 py-2 dark:bg-neutral-900" />
      </label>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button disabled={busy} onClick={start} className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-40">
        {busy ? "Starting..." : "Start test"}
      </button>
    </div>
  );
}
