import { NavBar } from "@/components/NavBar";
import { ReviewClient } from "./ReviewClient";

export default function ReviewPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Review</h1>
        <ReviewClient />
      </main>
    </>
  );
}
