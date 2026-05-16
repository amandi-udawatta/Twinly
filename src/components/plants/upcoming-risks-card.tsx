import { formatUpcomingRisks } from "@/lib/plant-report-display";

interface UpcomingRisksCardProps {
  upcomingRisks?: unknown;
}

export function UpcomingRisksCard({ upcomingRisks }: UpcomingRisksCardProps) {
  const text = formatUpcomingRisks(upcomingRisks);
  const hasRisk = Boolean(text);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="font-medium">Upcoming risks</p>
      <p
        className={
          hasRisk
            ? "mt-2 text-sm text-muted-foreground"
            : "mt-2 text-sm italic text-muted-foreground"
        }
      >
        {hasRisk
          ? text
          : "No immediate risks detected based on current weather and health trajectory."}
      </p>
    </div>
  );
}
