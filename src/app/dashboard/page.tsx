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
      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardPanel
          title="Your garden this week"
          description="One snapshot per species — tap a card to open a plant."
          className="lg:col-span-2"
          contentClassName="mt-6"
        >
          <GardenSpeciesOverview summaries={speciesSummaries} />
        </DashboardPanel>
        <WeatherSummaryPanel
          appearance="twinly"
          weather={weatherContext.weather}
          error={weatherContext.error}
          forecastDays={7}
          forecastLayout="pills"
        />
        <div className="lg:col-span-3">
          <EnvironmentalInsightsPanel insights={environmentalInsights} />
        </div>
      </div>
    </PageShell>
  );
}
