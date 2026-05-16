import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { InsightCard } from "@/components/checkins/insight-card";
import { HealthScoreRing } from "@/components/plants/health-score-ring";
import { HealthTimelineChart } from "@/components/plants/health-timeline-chart";
import { PlantGallery } from "@/components/plants/plant-gallery";
import { QrDisplay } from "@/components/plants/qr-display";
import { PageShell } from "@/components/layout/page-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getCheckinsWithPhotos,
  getLatestAnalysisForPlant,
  getPlantAnalysisHistory,
  getPlantById,
  parseInsights,
} from "@/lib/data/plants";
import { formatAgeDays } from "@/lib/plant-age";
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

  const [latestAnalysis, history, checkins] = await Promise.all([
    getLatestAnalysisForPlant(id),
    getPlantAnalysisHistory(id),
    getCheckinsWithPhotos(id),
  ]);

  const insights = latestAnalysis
    ? parseInsights(latestAnalysis.insights).slice(0, 5)
    : [];

  const chartData = history.map((h) => ({
    date: h.created_at.slice(0, 10),
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

  return (
    <PageShell>
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
          <TabsTrigger value="qr">QR code</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
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
              .map((h) => (
                <li
                  key={h.id}
                  className="flex justify-between rounded-lg border border-border px-4 py-2 text-sm"
                >
                  <span>{h.created_at.slice(0, 10)}</span>
                  <span className="font-medium">Score {h.health_score}</span>
                  <span className="capitalize text-muted-foreground">
                    {h.health_trend}
                  </span>
                </li>
              ))}
          </ul>
        </TabsContent>

        <TabsContent value="gallery">
          <PlantGallery items={galleryItems} />
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          {prediction ? (
            <>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="font-medium">Next 14 days</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {prediction.next14Days}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="font-medium">Upcoming risks</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {prediction.upcomingRisks}
                </p>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">
              Predictions appear after your first check-in analysis.
            </p>
          )}
        </TabsContent>

        <TabsContent value="qr">
          <QrDisplay plantId={id} appUrl={appUrl} />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
