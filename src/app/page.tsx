import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <PageShell>
      <section className="flex flex-col gap-8 py-12 sm:py-20">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Plant digital twin
        </p>
        <h1 className="font-heading max-w-3xl text-4xl leading-tight sm:text-5xl">
          Give your plant its own digital twin.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Twinly remembers your plants over time — photos, check-ins, weather,
          and AI health insights that get smarter with every visit.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/auth" className={cn(buttonVariants({ size: "lg" }))}>
            Get started
          </Link>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            View dashboard
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
