"use client";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function HomeClient({ stats }: { stats: any }) {
  const domainData = (stats?.byDomain ?? []).map((d: any) => ({
    name: d.domain, accuracy: d.total > 0 ? Math.round((Number(d.correct) / Number(d.total)) * 100) : 0,
  }));
  return (
    <>
      <div className="mt-6 flex gap-3">
        <Link href="/practice" className="rounded bg-blue-600 px-4 py-2 font-medium text-white">Start practice</Link>
        <Link href="/test" className="rounded bg-neutral-800 px-4 py-2 font-medium text-white dark:bg-neutral-200 dark:text-neutral-900">Start timed test</Link>
        <Link href="/review" className="rounded border px-4 py-2">Review</Link>
      </div>
      {domainData.length > 0 && (
        <div className="mt-8 h-64 rounded border bg-white p-4 dark:bg-neutral-900">
          <h2 className="mb-3 text-sm font-semibold">Accuracy by domain</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={domainData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
