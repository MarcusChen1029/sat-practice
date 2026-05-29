"use client";
import clsx from "clsx";

type State = "idle" | "selected" | "correct" | "wrong" | "revealed-correct";

export function ChoiceButton({
  letter, text, state, onClick, disabled,
}: {
  letter: string;
  text: string;
  state: State;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const showCheck = state === "correct" || state === "revealed-correct";
  const showCross = state === "wrong";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "group flex w-full items-start gap-3 rounded-xl border bg-white px-4 py-3.5 text-left transition dark:bg-slate-900/50",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
        state === "idle" && "border-slate-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-sm dark:border-slate-700 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/40",
        state === "selected" && "border-indigo-500 bg-indigo-50 shadow-sm shadow-indigo-500/10 ring-1 ring-indigo-500/30 dark:bg-indigo-950/60",
        state === "correct" && "border-emerald-500 bg-emerald-50 shadow-sm ring-1 ring-emerald-500/30 dark:bg-emerald-950/60",
        state === "wrong" && "border-rose-500 bg-rose-50 shadow-sm ring-1 ring-rose-500/30 dark:bg-rose-950/60",
        state === "revealed-correct" && "border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500/30 dark:bg-emerald-950/40",
        disabled && "cursor-not-allowed",
        !disabled && "cursor-pointer",
      )}
    >
      <span
        className={clsx(
          "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition",
          state === "idle" && "bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300",
          state === "selected" && "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30",
          (state === "correct" || state === "revealed-correct") && "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30",
          state === "wrong" && "bg-rose-600 text-white shadow-sm shadow-rose-600/30",
        )}
      >
        {showCheck ? "✓" : showCross ? "✕" : letter}
      </span>
      <span className="flex-1 pt-0.5 text-[15px] leading-relaxed text-slate-800 dark:text-slate-100">{text}</span>
    </button>
  );
}
