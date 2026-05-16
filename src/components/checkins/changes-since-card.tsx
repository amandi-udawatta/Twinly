import type { AppAppearance } from "@/components/dashboard/dashboard-theme";
import {
  dashboardBody,
  dashboardMuted,
  dashboardPanel,
  dashboardPanelTitle,
} from "@/components/dashboard/dashboard-theme";
import { cn } from "@/lib/utils";

interface ChangesSinceCardProps {
  summary: string | null | undefined;
  /** Current score minus previous check-in score; omit on first check-in. */
  scoreDelta?: number | null;
  appearance?: AppAppearance;
}

export function ChangesSinceCard({
  summary,
  scoreDelta,
  appearance = "default",
}: ChangesSinceCardProps) {
  const text = summary?.trim();
  const hasDelta = scoreDelta !== null && scoreDelta !== undefined;
  const isTwinly = appearance === "twinly";

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
    <section
      className={
        isTwinly
          ? dashboardPanel
          : "rounded-lg border border-border bg-card p-4"
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <h3
          className={
            isTwinly
              ? cn(dashboardPanelTitle, "text-base sm:text-lg")
              : "font-medium"
          }
        >
          Changes since last scan
        </h3>
        {deltaLabel !== null ? (
          <span
            className={cn(
              "rounded-md px-2.5 py-0.5 font-poppins text-sm font-semibold tabular-nums",
              isTwinly
                ? scoreDelta! > 0 && "bg-[#57B55D]/15 text-[#57B55D]"
                : scoreDelta! > 0 && "bg-primary/15 text-primary",
              isTwinly
                ? scoreDelta! < 0 && "bg-red-500/15 text-red-400"
                : scoreDelta! < 0 && "bg-destructive/15 text-destructive",
              isTwinly
                ? scoreDelta === 0 && "bg-white/10 text-white/50"
                : scoreDelta === 0 && "bg-muted text-muted-foreground",
            )}
            aria-label={`Health score change ${deltaLabel} points`}
          >
            {deltaLabel}
            <span
              className={cn(
                "ml-1 font-normal",
                isTwinly ? "text-white/50" : "text-muted-foreground",
              )}
            >
              pts
            </span>
          </span>
        ) : null}
      </div>
      {text ? (
        <p
          className={cn(
            "mt-2 text-sm leading-relaxed",
            isTwinly ? dashboardBody : "text-muted-foreground",
          )}
        >
          {text}
        </p>
      ) : hasDelta ? (
        <p className={cn("mt-2 text-sm", isTwinly ? dashboardMuted : "text-muted-foreground")}>
          Health score compared to your previous check-in.
        </p>
      ) : null}
    </section>
  );
}
