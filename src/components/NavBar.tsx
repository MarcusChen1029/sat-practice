"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/practice", label: "Practice" },
  { href: "/test", label: "Timed" },
  { href: "/review", label: "Review" },
  { href: "/admin", label: "Admin" },
];

export function NavBar() {
  const pathname = usePathname() ?? "/";
  return (
    <nav className="sticky top-0 z-40 border-b border-rule bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-oxblood text-[13px] font-bold text-white">
            S
          </span>
          <span className="text-[15px] font-bold tracking-tight text-ink">
            SAT Practice
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  "rounded-md px-3 py-1.5 text-[14px] font-semibold transition",
                  active
                    ? "bg-paper-2 text-oxblood"
                    : "text-ink-2 hover:bg-paper-2 hover:text-ink",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
