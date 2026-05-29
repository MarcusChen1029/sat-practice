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

  return (
    <div className="grid gap-6 md:grid-cols-[200px,1fr]">
      <aside className="space-y-3">
        <label className="block text-sm">Test
          <select className="mt-1 w-full rounded border px-2 py-1 dark:bg-neutral-900" value={filters.test} onChange={e => setFilters({ ...filters, test: e.target.value })}>
            <option value="">Any</option>
            <option>Reading and Writing</option>
            <option>Math</option>
          </select>
        </label>
        <label className="block text-sm">Difficulty
          <select className="mt-1 w-full rounded border px-2 py-1 dark:bg-neutral-900" value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value })}>
            <option value="">Any</option><option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
        </label>
        <label className="block text-sm">Status
          <select className="mt-1 w-full rounded border px-2 py-1 dark:bg-neutral-900" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value as FilterState["status"] })}>
            <option value="all">All</option><option value="unseen">Unseen</option><option value="wrong">Wrong</option><option value="bookmarked">Bookmarked</option>
          </select>
        </label>
        <div className="text-xs text-neutral-500">{list.length === 0 ? "No questions match" : `${cursor + 1} / ${list.length}`}</div>
      </aside>
      <section>
        {!question ? (
          <p className="text-neutral-500">{list.length === 0 ? "No questions match filters." : "Loading..."}</p>
        ) : (
          <>
            <QuestionCard q={question}>
              {question.choices.map(c => {
                const isCorrectChoice = revealed?.correctChoice === c.letter;
                let state: "idle" | "selected" | "correct" | "wrong" | "revealed-correct" = "idle";
                if (!submitted && chosen === c.letter) state = "selected";
                else if (submitted && chosen === c.letter) state = isCorrectChoice ? "correct" : "wrong";
                else if (submitted && isCorrectChoice) state = "revealed-correct";
                return (
                  <ChoiceButton
                    key={c.letter} letter={c.letter} text={c.text} state={state}
                    onClick={() => !submitted && setChosen(c.letter)}
                    disabled={submitted}
                  />
                );
              })}
            </QuestionCard>
            <div className="mt-4 flex gap-3">
              {!submitted ? (
                <button onClick={submit} disabled={!chosen}
                  className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-40">
                  Submit
                </button>
              ) : (
                <button onClick={next} className="rounded bg-neutral-800 px-4 py-2 font-medium text-white dark:bg-neutral-200 dark:text-neutral-900">
                  Next question →
                </button>
              )}
              {submitted && question && (
                <button onClick={async () => {
                  await fetch("/api/bookmarks", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ questionId: question.id }) });
                }} className="rounded border px-4 py-2">Bookmark</button>
              )}
            </div>
            {revealed && <RationalePanel q={revealed} chosen={chosen ?? ""} />}
          </>
        )}
      </section>
    </div>
  );
}
