"use client";
import clsx from "clsx";
import type { RevealedQuestion } from "@/lib/types";

export function RationalePanel({ q, chosen }: { q: RevealedQuestion; chosen: string }) {
  const isCorrect = chosen === q.correctChoice;
  return (
    <div className="paper-card mt-6 overflow-hidden">
      {/* Verdict banner */}
      <div className={clsx(
        "flex items-center gap-3 px-6 py-4",
        isCorrect ? "bg-[#eef7f1]" : "bg-[#fdf0ef]",
      )}>
        <span className={clsx(
          "inline-flex h-8 w-8 items-center justify-center rounded-full text-[16px] font-bold text-white",
          isCorrect ? "bg-olive" : "bg-terracotta",
        )}>
          {isCorrect ? "✓" : "✕"}
        </span>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className={clsx("text-[18px] font-bold", isCorrect ? "text-olive-2" : "text-terracotta")}>
            {isCorrect ? "Correct" : "Incorrect"}
          </span>
          <span className="text-[14px] text-ink-2">
            Correct answer:{" "}
            <span className="font-bold text-ink">{q.correctChoice}</span>
            {chosen && !isCorrect && (
              <>
                <span className="mx-1.5 text-ink-3">·</span>
                You chose <span className="font-bold text-terracotta">{chosen}</span>
              </>
            )}
          </span>
        </div>
      </div>

      <div className="px-6 py-6">
        <section>
          <div className="kicker">Why {q.correctChoice} is correct</div>
          <p className="mt-2 whitespace-pre-line text-[15.5px] leading-[1.65] text-ink">
            {q.rationale}
          </p>
        </section>

        <div className="my-6 rule-line" />

        <div className="text-[12px] font-bold uppercase tracking-wide text-ink-3">
          Per-choice notes
        </div>
        <ul className="mt-4 space-y-4">
          {q.choices.map((c) => {
            const isThisCorrect = c.letter === q.correctChoice;
            return (
              <li key={c.letter} className="flex gap-3.5">
                <span className={clsx(
                  "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-bold",
                  isThisCorrect
                    ? "border-olive bg-olive text-white"
                    : "border-rule bg-white text-ink-2",
                )}>
                  {c.letter}
                </span>
                <span className="flex-1 whitespace-pre-line text-[14.5px] leading-[1.6] text-ink-2">
                  {c.rationale ?? "(no per-choice explanation)"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
