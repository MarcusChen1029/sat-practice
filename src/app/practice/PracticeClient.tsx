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

const TEST_OPTIONS = ["Reading and Writing", "Math"];
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const STATUS_OPTIONS: { value: FilterState["status"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unseen", label: "Unseen" },
  { value: "wrong", label: "Wrong" },
  { value: "bookmarked", label: "Bookmarked" },
];

export function PracticeClient() {
  const [filters, setFilters] = useState<FilterState>({ test: "", domain: "", skill: "", difficulty: "", status: "all" });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [list, setList] = useState<PublicQuestion[]>([]);
  const [cursor, setCursor] = useState(0);
  const [question, setQuestion] = useState<PublicQuestion | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState<RevealedQuestion | null>(null);
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [bookmarked, setBookmarked] = useState(false);

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
      setChosen(null); setSubmitted(false); setRevealed(null); setBookmarked(false);
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
  function prev() {
    if (cursor > 0) setCursor(cursor - 1);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!question) return;
      if (!submitted && /^[abcd]$/i.test(e.key)) setChosen(e.key.toUpperCase());
      else if (!submitted && e.key === "Enter" && chosen) submit();
      else if (submitted && e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const progressPct = list.length > 0 ? Math.round(((cursor + 1) / list.length) * 100) : 0;
  const activeFilterCount =
    (filters.test ? 1 : 0) +
    (filters.difficulty ? 1 : 0) +
    (filters.status !== "all" ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* ── Top filter bar (no longer blocking) ────────────── */}
      <div className="paper-card-flat overflow-hidden">
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3 transition hover:bg-paper-2/50"
        >
          <span className="flex items-center gap-3">
            <span className="kicker">Filters</span>
            {activeFilterCount > 0 && (
              <span className="font-mono text-[10.5px] text-ink-2">
                {activeFilterCount} active
              </span>
            )}
          </span>
          <span className="flex items-center gap-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
            <span className="num text-ink">
              {list.length > 0 ? `${cursor + 1} / ${list.length}` : "0 / 0"}
            </span>
            <span className="text-ink-2">{filtersOpen ? "− Close" : "+ Open"}</span>
          </span>
        </button>

        {filtersOpen && (
          <div className="space-y-4 border-t border-ink/15 px-5 py-4">
            <FilterRow label="Test">
              <FilterChip
                active={filters.test === ""}
                onClick={() => setFilters({ ...filters, test: "" })}
              >Any</FilterChip>
              {TEST_OPTIONS.map((t) => (
                <FilterChip
                  key={t}
                  active={filters.test === t}
                  onClick={() => setFilters({ ...filters, test: t })}
                >{t}</FilterChip>
              ))}
            </FilterRow>
            <FilterRow label="Difficulty">
              <FilterChip
                active={filters.difficulty === ""}
                onClick={() => setFilters({ ...filters, difficulty: "" })}
              >Any</FilterChip>
              {DIFFICULTY_OPTIONS.map((d) => (
                <FilterChip
                  key={d}
                  active={filters.difficulty === d}
                  onClick={() => setFilters({ ...filters, difficulty: d })}
                >{d}</FilterChip>
              ))}
            </FilterRow>
            <FilterRow label="Status">
              {STATUS_OPTIONS.map((s) => (
                <FilterChip
                  key={s.value}
                  active={filters.status === s.value}
                  onClick={() => setFilters({ ...filters, status: s.value })}
                >{s.label}</FilterChip>
              ))}
            </FilterRow>
          </div>
        )}

        {/* Progress strip — always visible */}
        <div className="h-[4px] w-full bg-paper-3">
          <div
            className="h-full bg-oxblood transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── Question / state ────────────────────────────── */}
      {!question ? (
        <div className="paper-card-flat flex h-64 items-center justify-center">
          <p className="text-[15px] text-ink-3">
            {list.length === 0 ? "No questions match these filters." : "Loading…"}
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

          {/* Action bar */}
          <div className="flex flex-wrap items-center gap-3">
            {!submitted ? (
              <button onClick={submit} disabled={!chosen} className="btn-primary">
                Submit answer
              </button>
            ) : (
              <button onClick={next} className="btn-primary" disabled={cursor + 1 >= list.length}>
                Next →
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
                  setBookmarked(true);
                }}
                className="btn-ghost"
                disabled={bookmarked}
              >
                {bookmarked ? "✓ Bookmarked" : "☆ Bookmark"}
              </button>
            )}
            <div className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
              <span className="kbd">A</span><span className="kbd">B</span><span className="kbd">C</span><span className="kbd">D</span>{" "}
              choose ·{" "}
              <span className="kbd">↵</span> submit ·{" "}
              <span className="kbd">→</span> next
            </div>
          </div>

          {revealed && <RationalePanel q={revealed} chosen={chosen ?? ""} />}
        </>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 w-20 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
        {label}
      </span>
      {children}
    </div>
  );
}

function FilterChip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="filter-chip" data-active={active}>
      {children}
    </button>
  );
}
