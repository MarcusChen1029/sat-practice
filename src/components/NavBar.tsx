import Link from "next/link";

export function NavBar() {
  return (
    <nav className="border-b border-neutral-200 bg-white px-6 py-3 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-5xl items-center gap-6">
        <Link href="/" className="font-semibold">SAT Practice</Link>
        <Link href="/practice" className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">Practice</Link>
        <Link href="/test" className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">Timed Test</Link>
        <Link href="/review" className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">Review</Link>
        <Link href="/admin" className="ml-auto text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">Admin</Link>
      </div>
    </nav>
  );
}
