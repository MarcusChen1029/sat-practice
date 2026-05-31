import clsx from "clsx";

type Accent = "indigo" | "emerald" | "amber" | "rose" | "slate";

const accentText: Record<Accent, string> = {
  indigo: "text-oxblood",
  emerald: "text-olive",
  amber: "text-marigold",
  rose: "text-terracotta",
  slate: "text-ink-2",
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
    <div className="paper-card px-6 py-5">
      <div className="text-[12px] font-bold uppercase tracking-wide text-ink-3">
        {label}
      </div>
      <div className={clsx("mt-2 num text-[40px] font-bold leading-none", accentText[accent])}>
        {value}
      </div>
    </div>
  );
}
