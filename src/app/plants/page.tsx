import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import {
  dashboardCtaPrimary,
  dashboardEmptyPanel,
  dashboardMuted,
} from "@/components/dashboard/dashboard-theme";
import { PlantsFloatingActions } from "@/components/plants/plants-floating-actions";
import { PlantsGrid } from "@/components/plants/plants-grid";
import { PageShell } from "@/components/layout/page-shell";
import { LocationWeatherBanner } from "@/components/weather/location-weather-banner";
import { getPlantsForUser, getUserLocationCity } from "@/lib/data/plants";
import { getSessionUser } from "@/lib/auth/get-user";
import { parseSpeciesSearchParam, plantSpeciesKey } from "@/lib/plant-species";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PlantsPageProps {
  searchParams: Promise<{ species?: string }>;
}

export default async function PlantsPage({ searchParams }: PlantsPageProps) {
  const user = await getSessionUser();
  if (!user) redirect("/auth");

  const { species: speciesParam } = await searchParams;
  const speciesKey = parseSpeciesSearchParam(speciesParam);

  const [plants, locationCity] = await Promise.all([
    getPlantsForUser(user.id),
    getUserLocationCity(user.id),
  ]);

  const sorted = [...plants].sort((a, b) => {
    const ua = a.latest_urgency_score ?? 0;
    const ub = b.latest_urgency_score ?? 0;
    if (ub !== ua) return ub - ua;
    const ta = a.last_checkin_at ? new Date(a.last_checkin_at).getTime() : 0;
    const tb = b.last_checkin_at ? new Date(b.last_checkin_at).getTime() : 0;
    return ta - tb;
  });

  const needsAttention = sorted.some((p) => (p.latest_urgency_score ?? 0) > 7);

  const speciesLabel = speciesKey
    ? sorted.find((p) => plantSpeciesKey(p.species) === speciesKey)?.species?.trim() ??
      speciesKey
    : null;

  return (
    <PageShell
      variant="twinly"
      title="My Plants"
      description={
        speciesLabel
          ? `Plants in your garden — ${speciesLabel}.`
          : "Your garden at a glance — search, filter, and open any plant."
      }
    >
      <LocationWeatherBanner show={!locationCity} variant="twinly" />

      {needsAttention ? (
        <p
          role="status"
          className="mb-6 rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 font-poppins text-sm text-amber-200"
        >
          One or more plants may need attention soon.
        </p>
      ) : null}

      {sorted.length === 0 ? (
        <div className={dashboardEmptyPanel}>
          <p className="font-poppins text-lg font-semibold text-white">
            No plants yet
          </p>
          <p className={cn("mt-2 max-w-sm", dashboardMuted)}>
            Register your first plant to start its digital twin.
          </p>
          <Link href="/plants/new" className={cn(dashboardCtaPrimary, "mt-6")}>
            Register a plant
          </Link>
        </div>
      ) : (
        <div className="pb-28">
          <Suspense
            fallback={
              <p className={cn("py-12 text-center font-poppins text-sm", dashboardMuted)}>
                Loading plants…
              </p>
            }
          >
            <PlantsGrid plants={sorted} appearance="twinly" />
          </Suspense>
          <PlantsFloatingActions
            appearance="twinly"
            plants={sorted.map((p) => ({
              id: p.id,
              nickname: p.nickname,
              species: p.species,
            }))}
          />
        </div>
      )}
    </PageShell>
  );
}
