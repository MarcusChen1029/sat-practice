import { NavBar } from "@/components/NavBar";
import { ReviewClient } from "./ReviewClient";

export default function ReviewPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-7">
          <div className="kicker">Review</div>
          <h1 className="mt-2 text-[32px] font-bold tracking-tight text-ink sm:text-[40px]">
            Your history
          </h1>
          <p className="mt-3 text-[16px] text-ink-2">
            Every attempt you've made, with rationales unlocked.
          </p>
        </header>
        <ReviewClient />
      </main>
    </>
  );
}
