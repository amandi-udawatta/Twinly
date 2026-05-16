import type { AppAppearance } from "@/components/dashboard/dashboard-theme";
import {
  dashboardBody,
  dashboardMuted,
  twinlyInlineCard,
} from "@/components/dashboard/dashboard-theme";
import { formatUpcomingRisks } from "@/lib/plant-report-display";
import { cn } from "@/lib/utils";

interface UpcomingRisksCardProps {
  upcomingRisks?: unknown;
  appearance?: AppAppearance;
}

export function UpcomingRisksCard({
  upcomingRisks,
  appearance = "default",
}: UpcomingRisksCardProps) {
  const text = formatUpcomingRisks(upcomingRisks);
  const hasRisk = Boolean(text);
  const isTwinly = appearance === "twinly";

  return (
    <div
      className={
        isTwinly
          ? twinlyInlineCard
          : "rounded-lg border border-border bg-card p-4"
      }
    >
      <p
        className={
          isTwinly
            ? "font-poppins font-semibold text-[#57B55D]"
            : "font-medium"
        }
      >
        Upcoming risks
      </p>
      <p
        className={cn(
          "mt-2 font-poppins text-sm",
          hasRisk
            ? isTwinly
              ? dashboardBody
              : "text-muted-foreground"
            : isTwinly
              ? cn(dashboardMuted, "italic")
              : "italic text-muted-foreground",
        )}
      >
        {hasRisk
          ? text
          : "No immediate risks detected based on current weather and health trajectory."}
      </p>
    </div>
  );
}
