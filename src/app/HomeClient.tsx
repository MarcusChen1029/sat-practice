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
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/practice" className="btn-primary">
          Begin practice →
        </Link>
        <Link href="/test" className="btn-secondary">
          Sit a timed mock
        </Link>
        <Link href="/review" className="btn-ghost">
          Review history
        </Link>
      </div>

      {domainData.length > 0 ? (
        <div className="paper-card mt-12 px-7 pt-6 pb-7">
          <div className="flex items-baseline justify-between border-b border-rule pb-3">
            <div>
              <div className="kicker">Accuracy</div>
              <h2 className="mt-2 text-[22px] font-bold tracking-tight text-ink">
                By domain
              </h2>
            </div>
            <span className="text-[13px] font-semibold text-ink-3">
              all attempts
            </span>
          </div>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(27,27,31,0.10)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#4b515b", fontFamily: "Public Sans" }}
                  axisLine={{ stroke: "#cdd3dc" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#4b515b", fontFamily: "Public Sans" }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip
                  cursor={{ fill: "rgba(40,83,198,0.07)" }}
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #cdd3dc",
                    borderRadius: 8,
                    boxShadow: "0 4px 12px -4px rgba(16,24,40,0.15)",
                    fontSize: 12,
                    fontFamily: "Public Sans, sans-serif",
                  }}
                />
                <Bar dataKey="accuracy" fill="#2853c6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="paper-card mt-12 flex flex-col items-center justify-center px-8 py-16 text-center">
          <div className="kicker mx-auto">No data yet</div>
          <h3 className="mt-3 text-[24px] font-bold tracking-tight text-ink">
            Nothing charted yet.
          </h3>
          <p className="mt-3 max-w-sm text-ink-2">
            Finish a handful of questions and your accuracy will be charted here.
          </p>
        </div>
      )}
    </>
  );
}
