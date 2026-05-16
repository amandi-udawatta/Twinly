import { cn } from "@/lib/utils";

interface ChangesSinceCardProps {
  summary: string | null | undefined;
  /** Current score minus previous check-in score; omit on first check-in. */
  scoreDelta?: number | null;
}

export function ChangesSinceCard({ summary, scoreDelta }: ChangesSinceCardProps) {
  const text = summary?.trim();
  const hasDelta = scoreDelta !== null && scoreDelta !== undefined;

  if (!text && !hasDelta) return null;

  const deltaLabel =
    hasDelta && scoreDelta !== 0
      ? scoreDelta > 0
        ? `+${scoreDelta}`
        : `${scoreDelta}`
      : hasDelta
        ? "0"
        : null;

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-medium">Changes since last scan</h3>
        {deltaLabel !== null ? (
          <span
            className={cn(
              "rounded-md px-2.5 py-0.5 text-sm font-semibold tabular-nums",
              scoreDelta! > 0 && "bg-primary/15 text-primary",
              scoreDelta! < 0 && "bg-destructive/15 text-destructive",
              scoreDelta === 0 && "bg-muted text-muted-foreground",
            )}
            aria-label={`Health score change ${deltaLabel} points`}
          >
            {deltaLabel}
            <span className="ml-1 font-normal text-muted-foreground">pts</span>
          </span>
        ) : null}
      </div>
      {text ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
      ) : hasDelta ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Health score compared to your previous check-in.
        </p>
      ) : null}
    </section>
  );
}
