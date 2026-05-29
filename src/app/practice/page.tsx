import { NavBar } from "@/components/NavBar";
import { PracticeClient } from "./PracticeClient";

export default function PracticePage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Practice</h1>
        <PracticeClient />
      </main>
    </>
  );
}
