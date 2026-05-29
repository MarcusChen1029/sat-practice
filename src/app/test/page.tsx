import { NavBar } from "@/components/NavBar";
import { TestSetup } from "./TestSetup";

export default function TestPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Timed Test</h1>
        <TestSetup />
      </main>
    </>
  );
}
