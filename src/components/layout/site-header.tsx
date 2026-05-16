import Link from "next/link";

import { UserMenu } from "@/components/layout/user-menu";
import { getSessionUser } from "@/lib/auth/get-user";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinkClass = cn(
  buttonVariants({ variant: "ghost", size: "sm" }),
  "text-muted-foreground hover:text-foreground",
);

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-[#0D0D0D]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        {user ? <UserMenu /> : <div className="w-9" aria-hidden />}
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-foreground"
        >
          Twinly
        </Link>
        <div className="flex-1" />
        {user ? (
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/" className={navLinkClass}>
              Home
            </Link>
            <Link href="/dashboard" className={navLinkClass}>
              Dashboard
            </Link>
            <Link href="/plants" className={navLinkClass}>
              My Plants
            </Link>
          </nav>
        ) : (
          <Link href="/auth" className={cn(buttonVariants({ size: "sm" }))}>
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
