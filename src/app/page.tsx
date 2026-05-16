import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSessionUser } from "@/lib/auth/get-user";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <PageShell>
      <section className="flex min-h-[50vh] flex-col items-center justify-center gap-6 py-16 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Twinly
        </p>
        <h1 className="font-heading max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
          Your plant&apos;s digital twin
        </h1>
        <p className="max-w-lg text-muted-foreground">
          Landing hub — build out your story here later.
        </p>
        {user ? (
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }))}>
              Dashboard
            </Link>
            <Link
              href="/plants"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              My Plants
            </Link>
          </div>
        ) : (
          <Link href="/auth" className={cn(buttonVariants({ size: "lg" }))}>
            Get started
          </Link>
        )}
      </section>
    </PageShell>
  );
}
