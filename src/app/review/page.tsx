import { NavBar } from "@/components/NavBar";
import { ReviewClient } from "./ReviewClient";

export default function ReviewPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Review</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Every attempt you've made, with rationales unlocked.
          </p>
        </header>
        <ReviewClient />
      </main>
    </>
  );
}
