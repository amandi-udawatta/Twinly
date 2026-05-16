import { SiteHeader } from "@/components/layout/site-header";

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export async function PageShell({
  children,
  title,
  description,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-6">
        {(title || description) && (
          <header className="mb-8 space-y-2">
            {title ? (
              <h1 className="font-heading text-3xl font-semibold tracking-tight">
                {title}
              </h1>
            ) : null}
            {description ? (
              <p className="max-w-2xl text-muted-foreground">{description}</p>
            ) : null}
          </header>
        )}
        {children}
      </main>
    </div>
  );
}
