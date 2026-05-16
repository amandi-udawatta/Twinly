import type { EnvironmentalInsight } from "@/lib/data/plants";

interface EnvironmentalInsightsPanelProps {
  insights: EnvironmentalInsight[];
}

export function EnvironmentalInsightsPanel({
  insights,
}: EnvironmentalInsightsPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-heading text-lg font-semibold">
        Environmental insights
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Recent weather-related notes from your latest check-ins.
      </p>
      {insights.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Complete check-ins to see how weather affects your plants.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {insights.map((item) => (
            <li
              key={`${item.plantName}-${item.date}`}
              className="rounded-lg border border-border/80 bg-[#0D0D0D]/50 p-4"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-primary">{item.plantName}</span>
                <span>{item.date}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
