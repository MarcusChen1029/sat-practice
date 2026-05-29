import { NavBar } from "@/components/NavBar";
import { prisma } from "@/lib/db";
import { toRevealedQuestion } from "@/lib/reveal";
import { RationalePanel } from "@/components/RationalePanel";

export default async function TestResultsPage({ params }: { params: { id: string } }) {
  const session = await prisma.testSession.findUnique({ where: { id: params.id } });
  if (!session) return <main className="p-6">Not found.</main>;
  const ids: string[] = JSON.parse(session.questionIds);
  const questions = await prisma.question.findMany({
    where: { id: { in: ids } },
    include: { choices: true, attempts: { where: { testId: session.id } } },
  });
  const correctCount = questions.filter(q => q.attempts[0]?.isCorrect).length;

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold">Results</h1>
        <p className="mt-2 text-lg">Score: <strong>{correctCount}</strong> / {questions.length}</p>
        <div className="mt-6 space-y-8">
          {questions.map(q => {
            const rev = toRevealedQuestion(q as any);
            const attempt = q.attempts[0];
            return (
              <div key={q.id} className="border-t pt-4">
                <p className="font-serif">{q.stimulus}</p>
                <p className="mt-2 font-medium">{q.prompt}</p>
                <RationalePanel q={rev} chosen={attempt?.chosen ?? ""} />
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
