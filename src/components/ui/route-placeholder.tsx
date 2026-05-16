import { PageShell } from "@/components/layout/page-shell";

interface RoutePlaceholderProps {
  title: string;
  description: string;
}

export function RoutePlaceholder({ title, description }: RoutePlaceholderProps) {
  return (
    <PageShell title={title} description={description}>
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-sm text-muted-foreground">
        Skeleton route — feature implementation comes next.
      </div>
    </PageShell>
  );
}
