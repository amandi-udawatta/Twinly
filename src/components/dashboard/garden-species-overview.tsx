"use client";

import Image from "next/image";
import Link from "next/link";

import {
  dashboardCard,
  dashboardHealthTone,
  dashboardMuted,
} from "@/components/dashboard/dashboard-theme";
import { SpeciesSummaryText } from "@/components/dashboard/species-summary-text";
import type { SpeciesGardenSummary } from "@/lib/data/plants";
import { cn } from "@/lib/utils";

interface GardenSpeciesOverviewProps {
  summaries: SpeciesGardenSummary[];
}

export function GardenSpeciesOverview({ summaries }: GardenSpeciesOverviewProps) {
  if (summaries.length === 0) {
    return (
      <p className={cn(dashboardMuted, "py-6 text-center")}>
        Register plants to see a weekly overview by species.
      </p>
    );
  }

  return (
    <div>
      <ul className="flex w-max flex-nowrap gap-4 overflow-x-auto pb-2">
        {summaries.map((item) => (
          <li
            key={item.speciesKey}
            className="w-72 min-w-[18rem] max-w-[18rem] shrink-0 snap-start"
          >
            <article className={cn(dashboardCard, "flex h-full min-h-[22rem] flex-col")}>
              <Link
                href={`/plants/${item.primaryPlantId}`}
                className="group block transition-opacity hover:opacity-95"
              >
                <div className="relative aspect-[16/10] bg-black/50">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.species}
                      fill
                      className="object-cover transition-transform group-hover:scale-[1.02]"
                      sizes="288px"
                    />
                  ) : (
                    <div className={cn(dashboardMuted, "flex h-full items-center justify-center text-sm")}>
                      No photo yet
                    </div>
                  )}
                  <span className="absolute left-2 top-2 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 font-poppins text-xs font-medium capitalize text-white backdrop-blur-sm">
                    {item.plantCount} plant{item.plantCount === 1 ? "" : "s"}
                  </span>
                </div>
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <Link
                  href={`/plants/${item.primaryPlantId}`}
                  className={cn(
                    "font-poppins text-lg font-semibold capitalize text-[#57B55D] transition-colors hover:text-[#6bc972]",
                  )}
                >
                  {item.species}
                </Link>
                <p className="mt-1 font-poppins text-xs font-medium uppercase tracking-wide text-white/50">
                  This week
                </p>
                <p
                  className={cn(
                    "mt-1 font-poppins text-sm font-semibold",
                    dashboardHealthTone(item.avgHealthThisWeek),
                  )}
                >
                  {item.avgHealthThisWeek !== null
                    ? `Avg health ${item.avgHealthThisWeek}`
                    : "No check-ins this week"}
                  {item.checkinsThisWeek > 0
                    ? ` · ${item.checkinsThisWeek} check-in${item.checkinsThisWeek === 1 ? "" : "s"}`
                    : null}
                </p>
                <SpeciesSummaryText summary={item.summary} />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
