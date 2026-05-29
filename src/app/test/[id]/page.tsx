import { NavBar } from "@/components/NavBar";
import { TestRunner } from "./TestRunner";

export default function TestRunPage({ params }: { params: { id: string } }) {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl p-6">
        <TestRunner sessionId={params.id} />
      </main>
    </>
  );
}
