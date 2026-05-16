import type { AppAppearance } from "@/components/dashboard/dashboard-theme";
import {
  dashboardBody,
  dashboardPanel,
  dashboardPanelTitle,
} from "@/components/dashboard/dashboard-theme";
import { cn } from "@/lib/utils";

interface RecommendationsCardProps {
  recommendations: string[];
  appearance?: AppAppearance;
}

export function RecommendationsCard({
  recommendations,
  appearance = "default",
}: RecommendationsCardProps) {
  if (recommendations.length === 0) return null;

  const isTwinly = appearance === "twinly";

  return (
    <section
      className={
        isTwinly
          ? dashboardPanel
          : "rounded-lg border border-border bg-card p-4"
      }
    >
      <h3
        className={
          isTwinly
            ? cn(dashboardPanelTitle, "text-base sm:text-lg")
            : "font-medium"
        }
      >
        Recommendations
      </h3>
      <ul
        className={cn(
          "mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed",
          isTwinly ? dashboardBody : "text-muted-foreground",
        )}
      >
        {recommendations.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
