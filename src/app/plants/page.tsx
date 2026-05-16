import Link from "next/link";
import { redirect } from "next/navigation";

import { PlantsFloatingActions } from "@/components/plants/plants-floating-actions";
import { PlantsGrid } from "@/components/plants/plants-grid";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LocationWeatherBanner } from "@/components/weather/location-weather-banner";
import { getPlantsForUser, getUserLocationCity } from "@/lib/data/plants";
import { getSessionUser } from "@/lib/auth/get-user";

export default async function PlantsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth");

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

  return (
    <PageShell
      title="My Plants"
      description="Your garden at a glance — search, filter, and open any plant."
    >
      <LocationWeatherBanner show={!locationCity} />

      {needsAttention ? (
        <p
          role="status"
          className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
        >
          One or more plants may need attention soon.
        </p>
      ) : null}

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <p className="text-lg font-medium">No plants yet</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Register your first plant to start its digital twin.
          </p>
          <Link
            href="/plants/new"
            className={cn(buttonVariants({ size: "lg" }), "mt-6")}
          >
            Register a plant
          </Link>
        </div>
      ) : (
        <div className="pb-28">
          <PlantsGrid plants={sorted} />
          <PlantsFloatingActions
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
