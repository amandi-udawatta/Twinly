import {
  dashboardPageDescription,
  dashboardPageTitle,
  dashboardShell,
} from "@/components/dashboard/dashboard-theme";
import { SiteHeader } from "@/components/layout/site-header";
import { lostTumbler, poppins } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  /** Matches landing page dark glass aesthetic (dashboard). */
  variant?: "default" | "twinly";
}

export async function PageShell({
  children,
  title,
  description,
  variant = "default",
}: PageShellProps) {
  const isTwinly = variant === "twinly";

  return (
    <div
      className={cn(
        isTwinly
          ? cn(lostTumbler.variable, poppins.variable, dashboardShell)
          : "min-h-screen bg-background text-foreground",
      )}
    >
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-6">
        {(title || description) && (
          <header className="mb-8 space-y-3">
            {title ? (
              <h1
                className={
                  isTwinly
                    ? dashboardPageTitle
                    : "font-heading text-3xl font-semibold tracking-tight"
                }
              >
                {title}
              </h1>
            ) : null}
            {description ? (
              <p
                className={
                  isTwinly
                    ? dashboardPageDescription
                    : "max-w-2xl text-muted-foreground"
                }
              >
                {description}
              </p>
            ) : null}
          </header>
        )}
        {children}
      </main>
    </div>
  );
}
