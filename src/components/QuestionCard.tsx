"use client";
import clsx from "clsx";
import type { PublicQuestion } from "@/lib/types";
import { VisualRenderer } from "./VisualRenderer";

const difficultyColor: Record<string, string> = {
  Easy: "text-olive",
  Medium: "text-marigold",
  Hard: "text-terracotta",
};

export function QuestionCard({ q, children }: { q: PublicQuestion; children: React.ReactNode }) {
  return (
    <article className="paper-card overflow-hidden">
      {/* Header strip */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-rule bg-paper-2 px-5 py-3">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-ink-2">
          <span>{q.domain}</span>
          <span className="text-ink-3">·</span>
          <span className="font-normal text-ink-3">{q.skill}</span>
        </div>
        <span className={clsx("text-[12px] font-bold uppercase tracking-wide", difficultyColor[q.difficulty] ?? "text-ink-2")}>
          {q.difficulty}
        </span>
      </div>

      {/* Split: passage (left) | question + choices (right) */}
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="px-6 py-7 lg:border-r lg:border-rule">
          {q.hasVisual && q.visualData && <VisualRenderer data={q.visualData} />}
          <p className="whitespace-pre-line text-[17px] leading-[1.7] text-ink">
            {q.stimulus}
          </p>
        </div>

        <div className="px-6 py-7">
          <p className="text-[17px] font-semibold leading-snug text-ink">
            {q.prompt}
          </p>
          <div className="mt-5 space-y-3">{children}</div>
        </div>
      </div>
    </article>
  );
}
