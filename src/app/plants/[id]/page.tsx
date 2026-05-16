import Image from "next/image";
import { redirect } from "next/navigation";

import { ChangesSinceCard } from "@/components/checkins/changes-since-card";
import { InsightCard } from "@/components/checkins/insight-card";
import { RecommendationsCard } from "@/components/checkins/recommendations-card";
import { HealthScoreRing } from "@/components/plants/health-score-ring";
import { HealthTimelineChart } from "@/components/plants/health-timeline-chart";
import { InterventionsPanel } from "@/components/plants/interventions-panel";
import { PhotoComparePanel } from "@/components/plants/photo-compare-panel";
import {
  dashboardBody,
  dashboardCard,
  dashboardMuted,
  dashboardPanel,
  dashboardPanelTitle,
  twinlyListRow,
  twinlyPageTitlePoppins,
} from "@/components/dashboard/dashboard-theme";
import { PlantGallery } from "@/components/plants/plant-gallery";
import { PlantFloatingCheckin } from "@/components/plants/plant-floating-checkin";
import { PlantSettingsMenu } from "@/components/plants/plant-settings-menu";
import { PlantPageTabs } from "@/components/plants/plant-page-tabs";
import { QrDisplay } from "@/components/plants/qr-display";
import { LocationWeatherBanner } from "@/components/weather/location-weather-banner";
import { PageShell } from "@/components/layout/page-shell";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { WeatherSummaryPanel } from "@/components/dashboard/weather-summary-panel";
import { UpcomingRisksCard } from "@/components/plants/upcoming-risks-card";
import {
  getCheckinsWithPhotos,
  getLatestAnalysisForPlant,
  getPlantAnalysisHistory,
  getPlantById,
  getUserWeatherContext,
  parseInsights,
} from "@/lib/data/plants";
import { formatPlantAge } from "@/lib/plant-age";
import { getInterventionsForPlant } from "@/lib/data/interventions";
import { parseRecommendations } from "@/lib/plant-report-display";
import { formatWeatherCompact, parseWeatherSnapshot } from "@/lib/weather-display";
import { getSessionUser } from "@/lib/auth/get-user";

interface PlantPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlantPage({ params }: PlantPageProps) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/auth");

  const plant = await getPlantById(id, user.id);
  if (!plant) redirect("/plants");

  const [latestAnalysis, history, checkins, weatherContext, interventions] =
    await Promise.all([
      getLatestAnalysisForPlant(id),
      getPlantAnalysisHistory(id),
      getCheckinsWithPhotos(id),
      getUserWeatherContext(user.id),
      getInterventionsForPlant(id),
    ]);

  const weatherByCheckinId = new Map(
    checkins.map((c) => [c.id, parseWeatherSnapshot(c.weather_snapshot)]),
  );

  const insights = latestAnalysis
    ? parseInsights(latestAnalysis.insights).slice(0, 5)
    : [];

  const recommendations = latestAnalysis
    ? parseRecommendations(latestAnalysis.recommendations)
    : [];

  const chartData = history.map((h) => ({
    id: h.id,
    date: new Date(h.created_at).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    score: h.health_score,
  }));

  const galleryItems = checkins
    .filter((c) => c.photo_urls?.length)
    .map((c) => ({
      id: c.id,
      date: new Date(c.created_at).toLocaleDateString(undefined, {
        dateStyle: "medium",
      }),
      urls: c.photo_urls,
    }));

  const prediction = latestAnalysis?.prediction as
    | { next14Days?: string; upcomingRisks?: string }
    | null
    | undefined;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const displayName = plant.nickname || plant.species || "Your plant";
  const ageLabel = formatPlantAge(plant.approximate_age, plant.created_at);

  const compareOptions = checkins
    .filter((c) => c.photo_urls?.length)
    .map((c) => ({
      id: c.id,
      label: new Date(c.created_at).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    }));

  const lastCheckinLabel = latestAnalysis?.created_at
    ? new Date(latestAnalysis.created_at).toLocaleDateString(undefined, {
        dateStyle: "medium",
      })
    : null;

  const scoreDelta =
    latestAnalysis && history.length >= 2
      ? latestAnalysis.health_score - history[history.length - 2].health_score
      : null;

  return (
    <PageShell variant="twinly">
      <LocationWeatherBanner show={!weatherContext.locationCity} variant="twinly" />
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-6">
          <div
            className={cn(
              "relative h-28 w-28 shrink-0 overflow-hidden rounded-xl",
              dashboardCard,
            )}
          >
            {plant.image_url ? (
              <Image
                src={plant.image_url}
                alt={displayName}
                fill
                className="object-cover"
                sizes="112px"
                priority
              />
            ) : (
              <div className={cn("flex h-full items-center justify-center font-poppins text-xs", dashboardMuted)}>
                No photo
              </div>
            )}
          </div>
          <div>
            <h1 className={twinlyPageTitlePoppins}>{displayName}</h1>
            <p className={cn("font-poppins capitalize", dashboardMuted)}>{plant.species}</p>
            {ageLabel ? (
              <p className={cn("mt-1 font-poppins text-sm", dashboardMuted)}>
                Age: {ageLabel}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 sm:items-end">
          {latestAnalysis ? (
            <HealthScoreRing score={latestAnalysis.health_score} appearance="twinly" />
          ) : (
            <p className={cn("font-poppins text-sm", dashboardMuted)}>No health score yet</p>
          )}
          <PlantSettingsMenu
            plant={{
              id: plant.id,
              nickname: plant.nickname,
              image_url: plant.image_url,
            }}
            displayName={displayName}
            checkinCount={checkins.length}
          />
        </div>
      </div>

      <div className="pb-28">
      <PlantPageTabs>
        <TabsContent value="analysis" className="space-y-4">
          <ChangesSinceCard
            summary={latestAnalysis?.changes_summary}
            scoreDelta={scoreDelta}
            appearance="twinly"
          />
          {insights.length === 0 ? (
            <p className={dashboardMuted}>Complete a check-in to see AI insights.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {insights.map((insight, i) => (
                <InsightCard
                  key={`${insight.title}-${i}`}
                  insight={insight}
                  index={i}
                  appearance="twinly"
                />
              ))}
            </div>
          )}
          <RecommendationsCard recommendations={recommendations} appearance="twinly" />
          {latestAnalysis?.weather_impact ? (
            <div className={cn(dashboardPanel, "font-poppins text-sm")}>
              <p className={dashboardPanelTitle}>Weather impact</p>
              <p className={cn("mt-2", dashboardBody)}>{latestAnalysis.weather_impact}</p>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="history">
          <HealthTimelineChart data={chartData} appearance="twinly" />
          <h3 className={cn(dashboardPanelTitle, "mt-2 text-base sm:text-lg")}>
            Check-in history
          </h3>
          <ul className="mt-4 space-y-3">
            {history
              .slice()
              .reverse()
              .map((h) => {
                const snapshot = weatherByCheckinId.get(h.checkin_id);
                return (
                  <li
                    key={h.id}
                    className={twinlyListRow}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-1">
                      <span className="shrink-0 text-white/90">{h.created_at.slice(0, 10)}</span>
                      <span className="shrink-0 font-medium text-[#57B55D]">
                        Score {h.health_score}
                      </span>
                      <span className={cn("shrink-0 capitalize", dashboardMuted)}>
                        {h.health_trend}
                      </span>
                    </div>
                    {h.changes_summary ? (
                      <p className={cn("mt-2", dashboardBody)}>{h.changes_summary}</p>
                    ) : null}
                    {snapshot ? (
                      <p className={cn("mt-2 font-poppins text-xs", dashboardMuted)}>
                        Weather at check-in: {formatWeatherCompact(snapshot)}
                      </p>
                    ) : null}
                  </li>
                );
              })}
          </ul>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <PhotoComparePanel
            plantId={id}
            checkins={compareOptions}
            appearance="twinly"
          />
          <PlantGallery items={galleryItems} appearance="twinly" />
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <p className={dashboardMuted}>
            Live forecast from WeatherAPI (refreshes about every 30 minutes).
            Plant outlook below is from your last check-in
            {lastCheckinLabel ? ` on ${lastCheckinLabel}` : ""}.
          </p>
          <WeatherSummaryPanel
            appearance="twinly"
            title="Live forecast (WeatherAPI)"
            weather={weatherContext.weather}
            error={weatherContext.error}
            forecastDays={7}
            forecastLayout="pills"
          />
          {prediction ? (
            <div className="space-y-3">
              <h3 className={cn(dashboardPanelTitle, "text-lg")}>
                AI plant outlook (Gemini)
              </h3>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className={cn(dashboardPanel, "font-poppins text-sm")}>
                  <p className="font-semibold text-[#57B55D]">Next 14 days</p>
                  <p className={cn("mt-2", dashboardBody)}>{prediction.next14Days}</p>
                </div>
                <UpcomingRisksCard
                  upcomingRisks={prediction.upcomingRisks}
                  appearance="twinly"
                />
              </div>
            </div>
          ) : (
            <p className={dashboardMuted}>
              AI plant outlook appears after your first check-in. Live forecast
              above uses your saved city.
            </p>
          )}
        </TabsContent>

        <TabsContent value="care">
          <InterventionsPanel
            plantId={id}
            interventions={interventions}
            appearance="twinly"
          />
        </TabsContent>

        <TabsContent value="qr">
          <QrDisplay plantId={id} appUrl={appUrl} appearance="twinly" />
        </TabsContent>
      </PlantPageTabs>
      <PlantFloatingCheckin plantId={id} appearance="twinly" />
      </div>
    </PageShell>
  );
}
