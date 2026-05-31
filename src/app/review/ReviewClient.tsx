"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Item = { id: string; stimulus: string; domain: string; skill: string; difficulty: string };

export function ReviewClient() {
  const [tab, setTab] = useState<"wrong" | "bookmarked">("wrong");
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch(`/api/questions?status=${tab}&limit=100`).then(r => r.json()).then(d => setItems(d.items));
  }, [tab]);

  return (
    <>
      <div className="mb-5 flex gap-2">
        <button onClick={() => setTab("wrong")} className="filter-chip" data-active={tab === "wrong"}>Wrong</button>
        <button onClick={() => setTab("bookmarked")} className="filter-chip" data-active={tab === "bookmarked"}>Bookmarked</button>
      </div>
      <ul className="space-y-3">
        {items.length === 0 && <li className="text-[15px] text-ink-3">Nothing here yet.</li>}
        {items.map(it => (
          <li key={it.id} className="paper-card-flat transition hover:border-oxblood">
            <Link href={`/review/${it.id}`} className="block px-5 py-4">
              <div className="text-[12px] font-bold uppercase tracking-wide text-ink-3">{it.domain} &bull; {it.skill} &bull; {it.difficulty}</div>
              <div className="line-clamp-2 mt-1.5 text-[15px] text-ink">{it.stimulus}</div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
