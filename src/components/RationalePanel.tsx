"use client";
import clsx from "clsx";
import type { RevealedQuestion } from "@/lib/types";

export function RationalePanel({ q, chosen }: { q: RevealedQuestion; chosen: string }) {
  const isCorrect = chosen === q.correctChoice;
  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/70 dark:ring-slate-800">
      <div
        className={clsx(
          "flex items-center gap-3 border-b px-6 py-4",
          isCorrect
            ? "border-emerald-200 bg-gradient-to-r from-emerald-50 via-emerald-50/60 to-transparent dark:border-emerald-900/60 dark:from-emerald-950/50"
            : "border-rose-200 bg-gradient-to-r from-rose-50 via-rose-50/60 to-transparent dark:border-rose-900/60 dark:from-rose-950/50",
        )}
      >
        <span
          className={clsx(
            "inline-flex h-9 w-9 items-center justify-center rounded-full text-base font-bold text-white shadow-sm",
            isCorrect ? "bg-emerald-600 shadow-emerald-600/30" : "bg-rose-600 shadow-rose-600/30",
          )}
        >
          {isCorrect ? "✓" : "✕"}
        </span>
        <div className="flex-1">
          <div
            className={clsx(
              "text-sm font-semibold",
              isCorrect ? "text-emerald-800 dark:text-emerald-300" : "text-rose-800 dark:text-rose-300",
            )}
          >
            {isCorrect ? "Correct" : "Not quite"}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Correct answer is{" "}
            <span className="font-bold text-slate-900 dark:text-slate-100">{q.correctChoice}</span>
            {chosen && !isCorrect && (
              <>
                {" · you chose "}
                <span className="font-bold text-rose-700 dark:text-rose-400">{chosen}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-6 px-6 py-5">
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Why {q.correctChoice} is correct
          </h3>
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
            {q.rationale}
          </p>
        </section>
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Per-choice explanations
          </h3>
          <ul className="space-y-3">
            {q.choices.map((c) => {
              const isThisCorrect = c.letter === q.correctChoice;
              return (
                <li
                  key={c.letter}
                  className={clsx(
                    "flex gap-3 rounded-xl border p-3",
                    isThisCorrect
                      ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/30"
                      : "border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40",
                  )}
                >
                  <span
                    className={clsx(
                      "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      isThisCorrect
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
                    )}
                  >
                    {c.letter}
                  </span>
                  <span className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {c.rationale ?? "(no per-choice explanation)"}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
