import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ChangesSinceCard } from "@/components/checkins/changes-since-card";
import { InsightCard } from "@/components/checkins/insight-card";
import { RecommendationsCard } from "@/components/checkins/recommendations-card";
import { HealthScoreRing } from "@/components/plants/health-score-ring";
import { HealthTimelineChart } from "@/components/plants/health-timeline-chart";
import { InterventionsPanel } from "@/components/plants/interventions-panel";
import { PhotoComparePanel } from "@/components/plants/photo-compare-panel";
import { PlantGallery } from "@/components/plants/plant-gallery";
import { QrDisplay } from "@/components/plants/qr-display";
import { LocationWeatherBanner } from "@/components/weather/location-weather-banner";
import { PageShell } from "@/components/layout/page-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
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
import { formatAgeDays } from "@/lib/plant-age";
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
  const ageLabel = formatAgeDays(plant.approximate_age);

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

  return (
    <PageShell>
      <LocationWeatherBanner show={!weatherContext.locationCity} />
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-6">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
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
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No photo
              </div>
            )}
          </div>
          <div>
            <h1 className="font-heading text-3xl font-semibold">{displayName}</h1>
            <p className="text-muted-foreground capitalize">{plant.species}</p>
            {ageLabel ? (
              <p className="mt-1 text-sm text-muted-foreground">{ageLabel} old</p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 sm:items-end">
          {latestAnalysis ? (
            <HealthScoreRing score={latestAnalysis.health_score} />
          ) : (
            <p className="text-sm text-muted-foreground">No health score yet</p>
          )}
          <Link
            href={`/plants/${id}/checkin`}
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Check in
          </Link>
        </div>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analysis">Today&apos;s analysis</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="care">Care log</TabsTrigger>
          <TabsTrigger value="qr">QR code</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
          <ChangesSinceCard summary={latestAnalysis?.changes_summary} />
          {insights.length === 0 ? (
            <p className="text-muted-foreground">
              Complete a check-in to see AI insights.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {insights.map((insight, i) => (
                <InsightCard key={`${insight.title}-${i}`} insight={insight} index={i} />
              ))}
            </div>
          )}
          <RecommendationsCard recommendations={recommendations} />
          {latestAnalysis?.weather_impact ? (
            <div className="rounded-lg border border-border bg-card p-4 text-sm">
              <p className="font-medium">Weather impact</p>
              <p className="mt-1 text-muted-foreground">
                {latestAnalysis.weather_impact}
              </p>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="history">
          <HealthTimelineChart data={chartData} />
          <ul className="mt-6 space-y-2">
            {history
              .slice()
              .reverse()
              .map((h) => {
                const snapshot = weatherByCheckinId.get(h.checkin_id);
                return (
                  <li
                    key={h.id}
                    className="rounded-lg border border-border px-4 py-3 text-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span>{h.created_at.slice(0, 10)}</span>
                      <span className="font-medium">Score {h.health_score}</span>
                      <span className="capitalize text-muted-foreground">
                        {h.health_trend}
                      </span>
                    </div>
                    {h.changes_summary ? (
                      <p className="mt-2 text-muted-foreground">
                        {h.changes_summary}
                      </p>
                    ) : null}
                    {snapshot ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Weather at check-in: {formatWeatherCompact(snapshot)}
                      </p>
                    ) : null}
                  </li>
                );
              })}
          </ul>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <PhotoComparePanel plantId={id} checkins={compareOptions} />
          <PlantGallery items={galleryItems} />
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Live forecast from WeatherAPI (refreshes about every 30 minutes).
            Plant outlook below is from your last check-in
            {lastCheckinLabel ? ` on ${lastCheckinLabel}` : ""}.
          </p>
          <WeatherSummaryPanel
            title="Live forecast (WeatherAPI)"
            weather={weatherContext.weather}
            error={weatherContext.error}
            forecastDays={7}
            forecastLayout="pills"
          />
          {prediction ? (
            <div className="space-y-3">
              <h3 className="font-heading text-lg font-semibold">
                AI plant outlook (Gemini)
              </h3>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="font-medium">Next 14 days</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {prediction.next14Days}
                  </p>
                </div>
                <UpcomingRisksCard upcomingRisks={prediction.upcomingRisks} />
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              AI plant outlook appears after your first check-in. Live forecast
              above uses your saved city.
            </p>
          )}
        </TabsContent>

        <TabsContent value="care">
          <InterventionsPanel plantId={id} interventions={interventions} />
        </TabsContent>

        <TabsContent value="qr">
          <QrDisplay plantId={id} appUrl={appUrl} />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
