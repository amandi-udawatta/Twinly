interface ChangesSinceCardProps {
  summary: string | null | undefined;
}

export function ChangesSinceCard({ summary }: ChangesSinceCardProps) {
  const text = summary?.trim();
  if (!text) return null;

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h3 className="font-medium">Changes since last scan</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </section>
  );
}
