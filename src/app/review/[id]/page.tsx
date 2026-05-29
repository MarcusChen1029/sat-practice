import { NavBar } from "@/components/NavBar";
import { prisma } from "@/lib/db";
import { toRevealedQuestion } from "@/lib/reveal";
import { RationalePanel } from "@/components/RationalePanel";

export default async function ReviewDetail({ params }: { params: { id: string } }) {
  const q = await prisma.question.findUnique({
    where: { id: params.id },
    include: { choices: true, attempts: { take: 1, orderBy: { createdAt: "desc" } } },
  });
  if (!q) return <main className="p-6">Not found.</main>;
  const rev = toRevealedQuestion(q as any);
  const last = q.attempts[0];
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl p-6">
        <p className="whitespace-pre-line font-serif text-lg">{q.stimulus}</p>
        <p className="mt-4 font-medium">{q.prompt}</p>
        <RationalePanel q={rev} chosen={last?.chosen ?? ""} />
      </main>
    </>
  );
}
