import clsx from "clsx";

type Accent = "indigo" | "emerald" | "amber" | "rose" | "slate";

const accentRing: Record<Accent, string> = {
  indigo: "ring-indigo-200/60 dark:ring-indigo-900/40",
  emerald: "ring-emerald-200/60 dark:ring-emerald-900/40",
  amber: "ring-amber-200/60 dark:ring-amber-900/40",
  rose: "ring-rose-200/60 dark:ring-rose-900/40",
  slate: "ring-slate-200/70 dark:ring-slate-800",
};

const accentStripe: Record<Accent, string> = {
  indigo: "from-indigo-500 to-violet-500",
  emerald: "from-emerald-500 to-teal-500",
  amber: "from-amber-500 to-orange-500",
  rose: "from-rose-500 to-pink-500",
  slate: "from-slate-400 to-slate-500",
};

const accentText: Record<Accent, string> = {
  indigo: "text-indigo-600 dark:text-indigo-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  amber: "text-amber-600 dark:text-amber-400",
  rose: "text-rose-600 dark:text-rose-400",
  slate: "text-slate-700 dark:text-slate-300",
};

export function StatChip({
  label,
  value,
  accent = "slate",
}: {
  label: string;
  value: string | number;
  accent?: Accent;
}) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 transition hover:shadow-md dark:bg-slate-900/70",
        accentRing[accent],
      )}
    >
      <div
        className={clsx(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          accentStripe[accent],
        )}
        aria-hidden
      />
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className={clsx("mt-2 text-3xl font-bold tracking-tight tabular-nums", accentText[accent])}>
        {value}
      </div>
    </div>
  );
}
