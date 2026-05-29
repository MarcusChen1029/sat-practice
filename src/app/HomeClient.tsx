"use client";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function HomeClient({ stats }: { stats: any }) {
  const domainData = (stats?.byDomain ?? []).map((d: any) => ({
    name: d.domain,
    accuracy: d.total > 0 ? Math.round((Number(d.correct) / Number(d.total)) * 100) : 0,
  }));
  return (
    <>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/practice" className="btn-primary">
          <span>Start practice</span>
          <span aria-hidden>→</span>
        </Link>
        <Link href="/test" className="btn-secondary">
          Start timed test
        </Link>
        <Link href="/review" className="btn-ghost">
          Review history
        </Link>
      </div>
      {domainData.length > 0 ? (
        <div className="mt-10 card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Accuracy by domain
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">last 90 days · all attempts</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="accuracyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(148 163 184 / 0.25)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "rgb(100 116 139)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "rgb(100 116 139)" }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip
                  cursor={{ fill: "rgb(99 102 241 / 0.06)" }}
                  contentStyle={{
                    background: "white",
                    border: "1px solid rgb(226 232 240)",
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgb(0 0 0 / 0.05)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="accuracy" fill="url(#accuracyFill)" radius={[8, 8, 2, 2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="mt-10 card flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            ✦
          </div>
          <h3 className="text-base font-semibold tracking-tight">No data yet</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Once you finish a few questions, you'll see your accuracy broken down by domain here.
          </p>
        </div>
      )}
    </>
  );
}
