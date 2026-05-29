"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/practice", label: "Practice" },
  { href: "/test", label: "Timed Test" },
  { href: "/review", label: "Review" },
];

export function NavBar() {
  const pathname = usePathname() ?? "/";
  return (
    <nav className="glass sticky top-0 z-40 border-b border-slate-200/70 dark:border-slate-800/70">
      <div className="mx-auto flex max-w-6xl items-center gap-1 px-6 py-3">
        <Link href="/" className="mr-4 flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm shadow-indigo-600/30">
            S
          </span>
          <span className="text-slate-900 dark:text-slate-100">SAT Practice</span>
        </Link>
        {links.map((l) => {
          const active = pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                active
                  ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
              )}
            >
              {l.label}
            </Link>
          );
        })}
        <Link
          href="/admin"
          className={clsx(
            "ml-auto rounded-lg px-3 py-1.5 text-sm font-medium transition",
            pathname.startsWith("/admin")
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
          )}
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}
