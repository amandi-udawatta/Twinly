import { redirect } from "next/navigation";

import { CheckinForm } from "@/components/checkins/checkin-form";
import { PageShell } from "@/components/layout/page-shell";
import { CheckinWeatherStrip } from "@/components/weather/checkin-weather-strip";
import { LocationWeatherBanner } from "@/components/weather/location-weather-banner";
import {
  getCheckinsWithPhotos,
  getLatestAnalysisForPlant,
  getPlantById,
  getUserWeatherContext,
} from "@/lib/data/plants";
import { getSessionUser } from "@/lib/auth/get-user";

interface CheckinPageProps {
  params: Promise<{ id: string }>;
}

export default async function CheckinPage({ params }: CheckinPageProps) {
  const { id } = await params;
  const user = await getSessionUser();

  if (!user) {
    redirect(`/auth?next=${encodeURIComponent(`/plants/${id}/checkin`)}`);
  }

  const [plant, weatherContext, checkins, latestAnalysis] = await Promise.all([
    getPlantById(id, user.id),
    getUserWeatherContext(user.id),
    getCheckinsWithPhotos(id),
    getLatestAnalysisForPlant(id),
  ]);

  if (!plant) {
    redirect("/plants");
  }

  const plantName = plant.nickname || plant.species || "Your plant";

  const recentContext = (() => {
    const last = checkins[0];
    if (!last?.created_at) return null;

    const lastDate = new Date(last.created_at);
    const daysAgo = Math.floor(
      (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const daysLabel =
      daysAgo === 0
        ? "today"
        : daysAgo === 1
          ? "1 day ago"
          : `${daysAgo} days ago`;

    const score = latestAnalysis?.health_score;
    if (typeof score === "number") {
      return `Last check-in was ${daysLabel} • Previous Health Score: ${Math.round(score)}`;
    }
    return `Last check-in was ${daysLabel}`;
  })();

  return (
    <PageShell
      title="Daily check-in"
      description="Upload fresh photos for an AI health analysis."
    >
      <LocationWeatherBanner show={!weatherContext.locationCity} />
      <div className="mx-auto max-w-xl space-y-6">
        <CheckinWeatherStrip
          weather={weatherContext.weather}
          error={weatherContext.error}
        />
        <CheckinForm
          plantId={plant.id}
          plantName={plantName}
          recentContext={recentContext}
        />
      </div>
    </PageShell>
  );
}
