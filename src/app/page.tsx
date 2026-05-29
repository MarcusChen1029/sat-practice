import { NavBar } from "@/components/NavBar";
import { StatChip } from "@/components/StatChip";
import { HomeClient } from "./HomeClient";

async function fetchStats() {
  try {
    const res = await fetch("http://localhost:3000/api/stats", { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const stats = await fetchStats();
  const accuracy = Math.round((stats?.overallAccuracy ?? 0) * 100);
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:ring-indigo-900">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Dashboard
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
            Welcome back.
          </h1>
          <p className="mt-2 max-w-xl text-base text-slate-600 dark:text-slate-400">
            Pick up where you left off, run a timed mock, or review your past attempts.
          </p>
        </header>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatChip label="Attempted" value={stats?.totalAttempts ?? 0} accent="indigo" />
          <StatChip label="Correct" value={stats?.correctAttempts ?? 0} accent="emerald" />
          <StatChip label="Accuracy" value={`${accuracy}%`} accent={accuracy >= 70 ? "emerald" : accuracy >= 40 ? "amber" : "rose"} />
        </div>
        <HomeClient stats={stats} />
      </main>
    </>
  );
}
