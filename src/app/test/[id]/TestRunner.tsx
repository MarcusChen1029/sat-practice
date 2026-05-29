"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QuestionCard } from "@/components/QuestionCard";
import { ChoiceButton } from "@/components/ChoiceButton";
import type { PublicQuestion } from "@/lib/types";

export function TestRunner({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [ids, setIds] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [question, setQuestion] = useState<PublicQuestion | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [remaining, setRemaining] = useState<number>(0);
  const [startedAt, setStartedAt] = useState<number>(Date.now());

  useEffect(() => {
    fetch(`/api/tests/${sessionId}`).then(r => r.json()).then(s => {
      setIds(JSON.parse(s.questionIds));
      setRemaining(s.remainingSec);
    });
  }, [sessionId]);

  useEffect(() => {
    const id = ids[idx];
    if (!id) return;
    fetch(`/api/questions/${id}`).then(r => r.json()).then(setQuestion);
    setStartedAt(Date.now());
  }, [ids, idx]);

  useEffect(() => {
    if (remaining <= 0) return;
    const t = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [remaining]);

  const finish = useCallback(async () => {
    await fetch(`/api/tests/${sessionId}/finish`, { method: "POST" });
    router.push(`/test/${sessionId}/results`);
  }, [sessionId, router]);

  useEffect(() => { if (remaining === 0 && ids.length > 0) finish(); }, [remaining, ids.length, finish]);

  async function recordAnswer(letter: string) {
    if (!question) return;
    setAnswers(a => ({ ...a, [question.id]: letter }));
    await fetch("/api/attempts", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({
        questionId: question.id, chosen: letter,
        timeSpentMs: Date.now() - startedAt, mode: "test", testId: sessionId,
      }),
    });
  }

  function toggleFlag() {
    if (!question) return;
    const s = new Set(flagged);
    s.has(question.id) ? s.delete(question.id) : s.add(question.id);
    setFlagged(s);
  }

  const mm = Math.floor(remaining / 60).toString().padStart(2, "0");
  const ss = (remaining % 60).toString().padStart(2, "0");

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="font-mono text-xl">{mm}:{ss}</div>
        <button onClick={finish} className="rounded bg-red-600 px-3 py-1 text-sm text-white">Submit test</button>
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr,180px]">
        <section>
          {question && (
            <>
              <QuestionCard q={question}>
                {question.choices.map(c => (
                  <ChoiceButton key={c.letter} letter={c.letter} text={c.text}
                    state={answers[question.id] === c.letter ? "selected" : "idle"}
                    onClick={() => recordAnswer(c.letter)} />
                ))}
              </QuestionCard>
              <div className="mt-4 flex gap-3">
                <button disabled={idx === 0} onClick={() => setIdx(idx - 1)} className="rounded border px-3 py-1 disabled:opacity-40">&#8592; Prev</button>
                <button onClick={toggleFlag} className="rounded border px-3 py-1">
                  {flagged.has(question.id) ? "Unflag" : "Mark for review"}
                </button>
                <button disabled={idx >= ids.length - 1} onClick={() => setIdx(idx + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Next &#8594;</button>
              </div>
            </>
          )}
        </section>
        <aside>
          <div className="grid grid-cols-5 gap-1">
            {ids.map((qid, i) => (
              <button key={qid} onClick={() => setIdx(i)}
                className={
                  "rounded border px-2 py-1 text-sm " +
                  (i === idx ? "ring-2 ring-blue-500 " : "") +
                  (answers[qid] ? "bg-blue-100 dark:bg-blue-900 " : "") +
                  (flagged.has(qid) ? "border-yellow-500 " : "")
                }>
                {i + 1}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
