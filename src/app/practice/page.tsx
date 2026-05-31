import { NavBar } from "@/components/NavBar";
import { PracticeClient } from "./PracticeClient";

export default function PracticePage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-7">
          <div className="kicker">Practice</div>
          <h1 className="mt-2 text-[32px] font-bold leading-tight tracking-tight text-ink sm:text-[40px]">
            One question at a time
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-2">
            Filter the bank and work at your own pace. Explanations stay hidden until you submit.
          </p>
        </header>
        <PracticeClient />
      </main>
    </>
  );
}
