"use client";

import Image from "next/image";
import Link from "next/link";

import { SpeciesSummaryText } from "@/components/dashboard/species-summary-text";
import type { SpeciesGardenSummary } from "@/lib/data/plants";
import { cn } from "@/lib/utils";

function healthTone(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score > 70) return "text-primary";
  if (score >= 50) return "text-amber-500";
  return "text-destructive";
}

interface GardenSpeciesOverviewProps {
  summaries: SpeciesGardenSummary[];
}

export function GardenSpeciesOverview({ summaries }: GardenSpeciesOverviewProps) {
  if (summaries.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Register plants to see a weekly overview by species.
      </p>
    );
  }

  return (
    <div>
      <ul className="flex w-max flex-nowrap gap-4">
        {summaries.map((item) => (
          <li
            key={item.speciesKey}
            className="w-72 min-w-[18rem] max-w-[18rem] shrink-0 snap-start"
          >
            <article className="flex h-full min-h-[22rem] flex-col overflow-hidden rounded-xl border border-border bg-[#0D0D0D]/40">
              <Link
                href={`/plants/${item.primaryPlantId}`}
                className="group block transition-colors hover:opacity-95"
              >
                <div className="relative aspect-[16/10] bg-muted">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.species}
                      fill
                      className="object-cover transition-transform group-hover:scale-[1.02]"
                      sizes="288px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No photo yet
                    </div>
                  )}
                  <span className="absolute left-2 top-2 rounded-md bg-background/80 px-2 py-0.5 text-xs font-medium capitalize backdrop-blur-sm">
                    {item.plantCount} plant{item.plantCount === 1 ? "" : "s"}
                  </span>
                </div>
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <Link
                  href={`/plants/${item.primaryPlantId}`}
                  className="font-heading text-lg font-semibold capitalize hover:text-primary"
                >
                  {item.species}
                </Link>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  This week
                </p>
                <p
                  className={cn(
                    "mt-1 text-sm font-semibold",
                    healthTone(item.avgHealthThisWeek),
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
