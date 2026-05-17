import { redirect } from "next/navigation";

import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { EnvironmentalInsightsPanel } from "@/components/dashboard/environmental-insights-panel";
import { GardenSpeciesOverview } from "@/components/dashboard/garden-species-overview";
import { WeatherSummaryPanel } from "@/components/dashboard/weather-summary-panel";
import { PageShell } from "@/components/layout/page-shell";
import { LocationWeatherBanner } from "@/components/weather/location-weather-banner";
import {
  getGardenSpeciesSummaries,
  getRecentEnvironmentalInsights,
  getUserWeatherContext,
} from "@/lib/data/plants";
import { getSessionUser } from "@/lib/auth/get-user";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth");

  const [speciesSummaries, environmentalInsights, weatherContext] =
    await Promise.all([
      getGardenSpeciesSummaries(user.id),
      getRecentEnvironmentalInsights(user.id),
      getUserWeatherContext(user.id),
    ]);

  return (
    <PageShell
      variant="twinly"
      title="Dashboard"
      description="Garden-wide health trends, weather, and environmental context."
    >
      <LocationWeatherBanner
        show={!weatherContext.locationCity}
        variant="twinly"
      />
      <div className="flex flex-col gap-6">
        <DashboardPanel
          title="Your garden this week"
          description="One snapshot per species — tap a card to view plants of that type."
          className="min-w-0"
          contentClassName="min-w-0"
        >
          <GardenSpeciesOverview summaries={speciesSummaries} />
        </DashboardPanel>
        <WeatherSummaryPanel
          appearance="twinly"
          className="min-w-0"
          weather={weatherContext.weather}
          error={weatherContext.error}
          forecastDays={7}
          forecastLayout="pills"
        />
        <EnvironmentalInsightsPanel insights={environmentalInsights} />
      </div>
    </PageShell>
  );
}
