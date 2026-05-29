"use client";
import { useEffect, useState, useCallback } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import { ChoiceButton } from "@/components/ChoiceButton";
import { RationalePanel } from "@/components/RationalePanel";
import type { PublicQuestion, RevealedQuestion } from "@/lib/types";

type FilterState = {
  test: string; domain: string; skill: string; difficulty: string;
  status: "all" | "unseen" | "wrong" | "bookmarked";
};

export function PracticeClient() {
  const [filters, setFilters] = useState<FilterState>({ test: "", domain: "", skill: "", difficulty: "", status: "all" });
  const [list, setList] = useState<PublicQuestion[]>([]);
  const [cursor, setCursor] = useState(0);
  const [question, setQuestion] = useState<PublicQuestion | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState<RevealedQuestion | null>(null);
  const [startedAt, setStartedAt] = useState<number>(Date.now());

  const loadList = useCallback(async () => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) if (v && v !== "all") params.set(k, v);
    const res = await fetch(`/api/questions?${params}`);
    const data = await res.json();
    setList(data.items);
    setCursor(0);
  }, [filters]);

  useEffect(() => { loadList(); }, [loadList]);

  useEffect(() => {
    if (list.length === 0) { setQuestion(null); return; }
    const id = list[cursor]?.id;
    if (!id) return;
    fetch(`/api/questions/${id}`).then(r => r.json()).then(q => {
      setQuestion(q);
      setChosen(null); setSubmitted(false); setRevealed(null);
      setStartedAt(Date.now());
    });
  }, [list, cursor]);

  async function submit() {
    if (!question || !chosen) return;
    const res = await fetch("/api/attempts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        questionId: question.id, chosen, timeSpentMs: Date.now() - startedAt, mode: "practice",
      }),
    });
    const data = await res.json();
    setSubmitted(true);
    setRevealed(data.question);
  }

  function next() {
    if (cursor + 1 < list.length) setCursor(cursor + 1);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!question) return;
      if (!submitted && /^[abcd]$/i.test(e.key)) setChosen(e.key.toUpperCase());
      else if (!submitted && e.key === "Enter" && chosen) submit();
      else if (submitted && e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const progressPct = list.length > 0 ? Math.round(((cursor + 1) / list.length) * 100) : 0;
  const selectClass =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400";

  return (
    <div className="grid gap-6 md:grid-cols-[240px,1fr]">
      <aside className="space-y-5 self-start rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/70 dark:ring-slate-800">
        <div>
          <label className={labelClass}>Test</label>
          <select className={selectClass} value={filters.test} onChange={(e) => setFilters({ ...filters, test: e.target.value })}>
            <option value="">Any</option>
            <option>Reading and Writing</option>
            <option>Math</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Difficulty</label>
          <select className={selectClass} value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}>
            <option value="">Any</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={selectClass}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterState["status"] })}
          >
            <option value="all">All</option>
            <option value="unseen">Unseen</option>
            <option value="wrong">Wrong</option>
            <option value="bookmarked">Bookmarked</option>
          </select>
        </div>
        <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
          {list.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">No questions match</p>
          ) : (
            <>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Progress
                </span>
                <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  {cursor + 1} / {list.length}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </>
          )}
          <p className="mt-4 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            <kbd className="rounded border border-slate-300 bg-white px-1.5 font-mono text-[10px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">A-D</kbd>{" "}
            choose ·{" "}
            <kbd className="rounded border border-slate-300 bg-white px-1.5 font-mono text-[10px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">Enter</kbd>{" "}
            submit ·{" "}
            <kbd className="rounded border border-slate-300 bg-white px-1.5 font-mono text-[10px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">→</kbd>{" "}
            next
          </p>
        </div>
      </aside>
      <section>
        {!question ? (
          <div className="flex h-64 items-center justify-center rounded-2xl bg-white/50 ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {list.length === 0 ? "No questions match filters." : "Loading…"}
            </p>
          </div>
        ) : (
          <>
            <QuestionCard q={question}>
              {question.choices.map((c) => {
                const isCorrectChoice = revealed?.correctChoice === c.letter;
                let state: "idle" | "selected" | "correct" | "wrong" | "revealed-correct" = "idle";
                if (!submitted && chosen === c.letter) state = "selected";
                else if (submitted && chosen === c.letter) state = isCorrectChoice ? "correct" : "wrong";
                else if (submitted && isCorrectChoice) state = "revealed-correct";
                return (
                  <ChoiceButton
                    key={c.letter}
                    letter={c.letter}
                    text={c.text}
                    state={state}
                    onClick={() => !submitted && setChosen(c.letter)}
                    disabled={submitted}
                  />
                );
              })}
            </QuestionCard>
            <div className="mt-5 flex flex-wrap gap-3">
              {!submitted ? (
                <button onClick={submit} disabled={!chosen} className="btn-primary">
                  Submit answer
                </button>
              ) : (
                <button onClick={next} className="btn-secondary">
                  Next question <span aria-hidden>→</span>
                </button>
              )}
              {submitted && question && (
                <button
                  onClick={async () => {
                    await fetch("/api/bookmarks", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ questionId: question.id }),
                    });
                  }}
                  className="btn-ghost"
                >
                  ☆ Bookmark
                </button>
              )}
            </div>
            {revealed && <RationalePanel q={revealed} chosen={chosen ?? ""} />}
          </>
        )}
      </section>
    </div>
  );
}
