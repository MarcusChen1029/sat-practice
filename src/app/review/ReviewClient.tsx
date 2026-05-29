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
      <div className="mb-4 flex gap-2">
        <button onClick={() => setTab("wrong")} className={"rounded px-3 py-1 " + (tab === "wrong" ? "bg-blue-600 text-white" : "border")}>Wrong</button>
        <button onClick={() => setTab("bookmarked")} className={"rounded px-3 py-1 " + (tab === "bookmarked" ? "bg-blue-600 text-white" : "border")}>Bookmarked</button>
      </div>
      <ul className="space-y-2">
        {items.length === 0 && <li className="text-neutral-500">Nothing here yet.</li>}
        {items.map(it => (
          <li key={it.id} className="rounded border p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800">
            <Link href={`/review/${it.id}`} className="block">
              <div className="text-xs text-neutral-500">{it.domain} &bull; {it.skill} &bull; {it.difficulty}</div>
              <div className="line-clamp-2 mt-1 font-serif">{it.stimulus}</div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
