import { NavBar } from "@/components/NavBar";
import { PracticeClient } from "./PracticeClient";

export default function PracticePage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Practice</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Filter the bank, answer at your own pace, and reveal explanations once you submit.
          </p>
        </header>
        <PracticeClient />
      </main>
    </>
  );
}
