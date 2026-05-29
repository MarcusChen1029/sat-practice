"use client";
import Image from "next/image";
import type { PublicQuestion } from "@/lib/types";

export function QuestionCard({ q, children }: { q: PublicQuestion; children: React.ReactNode }) {
  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">{q.test}</span>
        <span className="rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">{q.domain}</span>
        <span className="rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">{q.skill}</span>
        <span className="rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">{q.difficulty}</span>
      </div>
      {q.hasVisual && q.visualImagePath && (
        <div className="my-4">
          <Image src={q.visualImagePath} alt="Question visual" width={700} height={400} className="rounded border" />
        </div>
      )}
      <p className="whitespace-pre-line font-serif text-lg leading-relaxed">{q.stimulus}</p>
      <p className="mt-4 font-medium">{q.prompt}</p>
      <div className="mt-5 space-y-2">{children}</div>
    </article>
  );
}
