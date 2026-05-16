import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plants/new", label: "Add Plant" },
  { href: "/auth", label: "Sign In" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-heading text-lg font-semibold tracking-tight">
          Twinly
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
