"use client";
import type { RevealedQuestion } from "@/lib/types";

export function RationalePanel({ q, chosen }: { q: RevealedQuestion; chosen: string }) {
  return (
    <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm font-semibold text-neutral-500">Correct answer:</span>
        <span className="text-lg font-bold text-green-600">{q.correctChoice}</span>
        {chosen && chosen !== q.correctChoice && (
          <span className="ml-3 text-sm text-red-600">You chose: {chosen}</span>
        )}
      </div>
      <h3 className="text-base font-semibold">Why {q.correctChoice} is correct</h3>
      <p className="mt-1 whitespace-pre-line text-neutral-700 dark:text-neutral-300">{q.rationale}</p>
      <h3 className="mt-4 text-base font-semibold">Per-choice explanations</h3>
      <ul className="mt-2 space-y-2">
        {q.choices.map(c => (
          <li key={c.letter} className="text-sm">
            <span className="font-semibold">{c.letter}.</span>{" "}
            <span className="whitespace-pre-line text-neutral-700 dark:text-neutral-300">{c.rationale ?? "(no per-choice explanation)"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
