import { NavBar } from "@/components/NavBar";
import { AdminClient } from "./AdminClient";

export default function AdminPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Admin</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage the question bank and re-run the PDF ingest pipeline.
          </p>
        </header>
        <AdminClient />
      </main>
    </>
  );
}
