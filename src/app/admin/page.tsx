import { NavBar } from "@/components/NavBar";
import { AdminClient } from "./AdminClient";

export default function AdminPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Admin</h1>
        <AdminClient />
      </main>
    </>
  );
}
