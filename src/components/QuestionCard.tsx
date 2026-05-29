"use client";
import Image from "next/image";
import clsx from "clsx";
import type { PublicQuestion } from "@/lib/types";

const difficultyColor: Record<string, string> = {
  Easy: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-900",
  Hard: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-900",
};

export function QuestionCard({ q, children }: { q: PublicQuestion; children: React.ReactNode }) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 sm:p-8 dark:bg-slate-900/70 dark:ring-slate-800">
      <div className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="chip bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-900">
          {q.test}
        </span>
        <span className="chip bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-900">
          {q.domain}
        </span>
        <span className="chip bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:ring-teal-900">
          {q.skill}
        </span>
        <span
          className={clsx(
            "chip",
            difficultyColor[q.difficulty] ??
              "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
          )}
        >
          {q.difficulty}
        </span>
      </div>
      {q.hasVisual && q.visualImagePath && (
        <div className="my-5 overflow-hidden rounded-xl ring-1 ring-slate-200 dark:ring-slate-800">
          <Image
            src={q.visualImagePath}
            alt="Question visual"
            width={800}
            height={460}
            className="h-auto w-full"
          />
        </div>
      )}
      <p className="whitespace-pre-line font-serif text-[17px] leading-[1.8] text-slate-800 dark:text-slate-100">
        {q.stimulus}
      </p>
      <p className="mt-6 text-[15px] font-semibold text-slate-900 dark:text-slate-50">{q.prompt}</p>
      <div className="mt-5 space-y-2.5">{children}</div>
    </article>
  );
}
