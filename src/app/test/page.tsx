import { NavBar } from "@/components/NavBar";
import { TestSetup } from "./TestSetup";

export default function TestPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Timed test</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Build a random mock test, run it under the clock, and review your results.
          </p>
        </header>
        <TestSetup />
      </main>
    </>
  );
}
