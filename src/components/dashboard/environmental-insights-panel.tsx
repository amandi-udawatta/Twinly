import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import {
  dashboardBody,
  dashboardCard,
  dashboardMuted,
} from "@/components/dashboard/dashboard-theme";
import type { EnvironmentalInsight } from "@/lib/data/plants";
import { cn } from "@/lib/utils";

interface EnvironmentalInsightsPanelProps {
  insights: EnvironmentalInsight[];
}

export function EnvironmentalInsightsPanel({
  insights,
}: EnvironmentalInsightsPanelProps) {
  return (
    <DashboardPanel
      title="Environmental insights"
      description="Recent weather-related notes from your latest check-ins."
    >
      {insights.length === 0 ? (
        <p className={dashboardMuted}>
          Complete check-ins to see how weather affects your plants.
        </p>
      ) : (
        <ul className="space-y-3">
          {insights.map((item) => (
            <li key={item.id} className={cn(dashboardCard, "p-4")}>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-poppins font-medium text-[#57B55D]">
                  {item.plantName}
                </span>
                <span className={dashboardMuted}>
                  {new Date(item.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <p className={cn(dashboardBody, "mt-2")}>{item.text}</p>
            </li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  );
}
