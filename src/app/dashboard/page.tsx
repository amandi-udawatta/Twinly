import { redirect } from "next/navigation";

import { EnvironmentalInsightsPanel } from "@/components/dashboard/environmental-insights-panel";
import { WeatherSummaryPanel } from "@/components/dashboard/weather-summary-panel";
import { HealthTimelineChart } from "@/components/plants/health-timeline-chart";
import { PageShell } from "@/components/layout/page-shell";
import {
  getGardenHealthTimeline,
  getRecentEnvironmentalInsights,
  getUserLocationCity,
} from "@/lib/data/plants";
import { getSessionUser } from "@/lib/auth/get-user";
import { fetchWeatherForCity } from "@/services/weatherService";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth");

  const [gardenTimeline, environmentalInsights, locationCity] =
    await Promise.all([
      getGardenHealthTimeline(user.id),
      getRecentEnvironmentalInsights(user.id),
      getUserLocationCity(user.id),
    ]);

  let weather = null;
  let weatherError: string | null = null;

  if (locationCity) {
    try {
      weather = await fetchWeatherForCity(locationCity);
    } catch (err) {
      weatherError =
        err instanceof Error
          ? err.message
          : "Weather data is unavailable right now.";
    }
  }

  return (
    <PageShell
      title="Dashboard"
      description="Garden-wide health trends, weather, and environmental context."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold">
            Garden health history
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Average health score across all plants over time.
          </p>
          <div className="mt-6">
            <HealthTimelineChart data={gardenTimeline} />
          </div>
        </section>
        <WeatherSummaryPanel weather={weather} error={weatherError} />
        <div className="lg:col-span-3">
          <EnvironmentalInsightsPanel insights={environmentalInsights} />
        </div>
      </div>
    </PageShell>
  );
}
