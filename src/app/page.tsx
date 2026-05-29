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
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatChip label="Attempted" value={stats?.totalAttempts ?? 0} />
          <StatChip label="Correct" value={stats?.correctAttempts ?? 0} />
          <StatChip label="Accuracy" value={`${Math.round((stats?.overallAccuracy ?? 0) * 100)}%`} />
        </div>
        <HomeClient stats={stats} />
      </main>
    </>
  );
}
