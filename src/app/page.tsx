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
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <header className="relative mb-10">
          <div className="flex items-baseline justify-between border-b border-rule pb-3">
            <span className="kicker">Dashboard</span>
            <span className="text-[13px] font-semibold text-ink-3">
              {today}
            </span>
          </div>
          <h1 className="mt-6 text-[40px] font-bold leading-tight tracking-tight text-ink sm:text-[52px]">
            Welcome back
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-2">
            Pick up where you left off, sit a timed mock, or revisit the
            questions that tripped you up. Explanations stay hidden until you
            commit to an answer.
          </p>
        </header>

        {/* Stats */}
        <section>
          <div className="mb-3">
            <div className="kicker">At a glance</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatChip label="Attempted" value={stats?.totalAttempts ?? 0} accent="indigo" />
            <StatChip label="Correct" value={stats?.correctAttempts ?? 0} accent="emerald" />
            <StatChip label="Accuracy" value={`${accuracy}%`} accent={accuracy >= 70 ? "emerald" : accuracy >= 40 ? "amber" : "rose"} />
          </div>
        </section>

        <HomeClient stats={stats} />
      </main>
    </>
  );
}
