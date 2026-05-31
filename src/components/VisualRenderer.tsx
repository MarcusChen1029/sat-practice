"use client";
import {
  Bar, BarChart, Line, LineChart, CartesianGrid, Legend,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { VisualData, VisualChart, VisualTable } from "@/lib/types";

/* Bluebook palette for chart series */
const SERIES_COLORS = ["#2853c6", "#157347", "#b45309", "#6b21a8", "#d92d20"];

export function VisualRenderer({ data }: { data: VisualData }) {
  if (data.kind === "table") return <TableVisual data={data} />;
  return <ChartVisual data={data} />;
}

function TableVisual({ data }: { data: VisualTable }) {
  return (
    <figure className="my-5 overflow-hidden rounded-lg border border-rule bg-white">
      {data.title && (
        <figcaption className="border-b border-rule bg-paper-2 px-4 py-2.5 text-center text-[14px] font-bold text-ink">
          {data.title}
        </figcaption>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[14.5px]">
          <thead>
            <tr className="border-b border-rule bg-paper-2">
              {data.columns.map((c, i) => (
                <th
                  key={i}
                  className="px-4 py-2.5 text-left text-[12px] font-bold uppercase tracking-wide text-ink-2"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr
                key={ri}
                className="border-b border-rule last:border-0 odd:bg-paper-2/50"
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={
                      ci === 0
                        ? "px-4 py-2.5 font-semibold text-ink"
                        : "px-4 py-2.5 num text-ink-2"
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.note && (
        <div className="border-t border-rule px-4 py-2 text-[12px] text-ink-3">
          {data.note}
        </div>
      )}
    </figure>
  );
}

function ChartVisual({ data }: { data: VisualChart }) {
  // Pivot categories + series into recharts row objects
  const rows = data.categories.map((cat, i) => {
    const row: Record<string, string | number | null> = { category: cat };
    for (const s of data.series) row[s.name] = s.values[i] ?? null;
    return row;
  });

  const axisTick = { fontSize: 11, fill: "#4b515b", fontFamily: "Public Sans" };

  return (
    <figure className="my-5 rounded-lg border border-rule bg-white px-3 pt-4 pb-3">
      {data.title && (
        <figcaption className="mb-3 px-2 text-center text-[15px] font-bold leading-snug text-ink">
          {data.title}
        </figcaption>
      )}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {data.kind === "bar" ? (
            <BarChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 18 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(28,26,22,0.12)" vertical={false} />
              <XAxis
                dataKey="category"
                tick={axisTick}
                axisLine={{ stroke: "#cdd3dc" }}
                tickLine={false}
                label={data.xLabel ? { value: data.xLabel, position: "insideBottom", offset: -10, fontSize: 11, fill: "#4b515b", fontFamily: "Public Sans" } : undefined}
              />
              <YAxis
                tick={axisTick}
                axisLine={false}
                tickLine={false}
                label={data.yLabel ? { value: data.yLabel, angle: -90, position: "insideLeft", fontSize: 11, fill: "#4a463c", fontFamily: "Public Sans", style: { textAnchor: "middle" } } : undefined}
              />
              <Tooltip cursor={{ fill: "rgba(40,83,198,0.07)" }} contentStyle={tooltipStyle} />
              {data.series.length > 1 && <Legend wrapperStyle={legendStyle} />}
              {data.series.map((s, i) => (
                <Bar key={s.name} dataKey={s.name} fill={SERIES_COLORS[i % SERIES_COLORS.length]} radius={[2, 2, 0, 0]} />
              ))}
            </BarChart>
          ) : (
            <LineChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 18 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(28,26,22,0.12)" vertical={false} />
              <XAxis
                dataKey="category"
                tick={axisTick}
                axisLine={{ stroke: "#cdd3dc" }}
                tickLine={false}
                label={data.xLabel ? { value: data.xLabel, position: "insideBottom", offset: -10, fontSize: 11, fill: "#4b515b", fontFamily: "Public Sans" } : undefined}
              />
              <YAxis
                tick={axisTick}
                axisLine={false}
                tickLine={false}
                label={data.yLabel ? { value: data.yLabel, angle: -90, position: "insideLeft", fontSize: 11, fill: "#4a463c", fontFamily: "Public Sans", style: { textAnchor: "middle" } } : undefined}
              />
              <Tooltip cursor={{ stroke: "rgba(40,83,198,0.25)" }} contentStyle={tooltipStyle} />
              {data.series.length > 1 && <Legend wrapperStyle={legendStyle} />}
              {data.series.map((s, i) => (
                <Line
                  key={s.name}
                  type="monotone"
                  dataKey={s.name}
                  stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: SERIES_COLORS[i % SERIES_COLORS.length] }}
                  connectNulls
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      {data.note && (
        <div className="mt-1 px-2 text-[12px] text-ink-3">
          {data.note}
        </div>
      )}
    </figure>
  );
}

const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid #cdd3dc",
  borderRadius: 8,
  boxShadow: "0 4px 12px -4px rgba(16,24,40,0.15)",
  fontSize: 12,
  fontFamily: "Public Sans, sans-serif",
} as const;

const legendStyle = {
  fontSize: 12,
  fontFamily: "Public Sans, sans-serif",
};
