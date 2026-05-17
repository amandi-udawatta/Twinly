"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import {
  dashboardEmptyPanel,
  dashboardFilterActive,
  dashboardFilterIdle,
  dashboardInput,
  dashboardMuted,
  twinlyLabel,
  twinlySelect,
} from "@/components/dashboard/dashboard-theme";
import { PlantCard } from "@/components/dashboard/plant-card";
import type { PlantWithLatestAnalysis } from "@/lib/data/plants";
import {
  buildSpeciesFilterOptions,
  parseSpeciesSearchParam,
  plantSpeciesKey,
} from "@/lib/plant-species";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type PlantFilter = "all" | "healthy" | "urgent" | "overdue";

const FILTERS: { id: PlantFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "healthy", label: "Healthy" },
  { id: "urgent", label: "Urgent" },
  { id: "overdue", label: "Overdue" },
];

function isOverdue(lastCheckIn: string | null): boolean {
  if (!lastCheckIn) return true;
  const days =
    (Date.now() - new Date(lastCheckIn).getTime()) / (1000 * 60 * 60 * 24);
  return days > 3;
}

interface PlantsGridProps {
  plants: PlantWithLatestAnalysis[];
  appearance?: "default" | "twinly";
}

export function PlantsGrid({ plants, appearance = "default" }: PlantsGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PlantFilter>("all");
  const isTwinly = appearance === "twinly";

  const speciesKey = parseSpeciesSearchParam(searchParams.get("species"));

  const speciesOptions = useMemo(
    () => buildSpeciesFilterOptions(plants),
    [plants],
  );

  const speciesLabel = useMemo(() => {
    if (!speciesKey) return null;
    return (
      speciesOptions.find((option) => option.key === speciesKey)?.label ??
      speciesKey
    );
  }, [speciesKey, speciesOptions]);

  const setSpeciesFilter = useCallback(
    (key: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (key) {
        params.set("species", key);
      } else {
        params.delete("species");
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return plants.filter((plant) => {
      if (speciesKey && plantSpeciesKey(plant.species) !== speciesKey) {
        return false;
      }

      const name = (plant.nickname || plant.species || "").toLowerCase();
      const species = (plant.species || "").toLowerCase();
      const matchesQuery =
        !normalizedQuery ||
        name.includes(normalizedQuery) ||
        species.includes(normalizedQuery);

      if (!matchesQuery) return false;

      const score = plant.latest_health_score;
      const urgency = plant.latest_urgency_score ?? 0;

      switch (filter) {
        case "healthy":
          return score !== null && score >= 70;
        case "urgent":
          return urgency > 7;
        case "overdue":
          return isOverdue(plant.last_checkin_at);
        default:
          return true;
      }
    });
  }, [plants, query, filter, speciesKey]);

  return (
    <div className="space-y-6">
      {speciesOptions.length > 0 ? (
        <div className="space-y-2">
          <p
            className={cn(
              "font-poppins text-xs font-medium uppercase tracking-wide",
              isTwinly ? dashboardMuted : "text-muted-foreground",
            )}
          >
            Filter by species
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSpeciesFilter(null)}
              className={cn(
                "rounded-full border px-3 py-1 font-poppins text-sm capitalize transition-colors",
                isTwinly
                  ? !speciesKey
                    ? dashboardFilterActive
                    : dashboardFilterIdle
                  : !speciesKey
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              All species
            </button>
            {speciesOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSpeciesFilter(option.key)}
                className={cn(
                  "rounded-full border px-3 py-1 font-poppins text-sm capitalize transition-colors",
                  isTwinly
                    ? speciesKey === option.key
                      ? dashboardFilterActive
                      : dashboardFilterIdle
                    : speciesKey === option.key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {speciesKey && speciesLabel ? (
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 font-poppins text-sm",
            isTwinly
              ? "border-[#57B55D]/40 bg-[#57B55D]/10 text-white"
              : "border-border bg-muted/50",
          )}
        >
          <span>
            Showing{" "}
            <span className="font-semibold capitalize text-[#57B55D]">
              {speciesLabel}
            </span>{" "}
            only ({filtered.length} plant{filtered.length === 1 ? "" : "s"})
          </span>
          <button
            type="button"
            onClick={() => setSpeciesFilter(null)}
            className={cn(
              "font-medium underline-offset-2 hover:underline",
              isTwinly ? "text-[#57B55D]" : "text-primary",
            )}
          >
            View all plants
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Input
          type="search"
          placeholder="Search by name or plant type…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={cn(
            "w-full sm:max-w-md",
            isTwinly ? dashboardInput : "bg-card",
          )}
          aria-label="Search plants"
        />
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[11rem]">
          <Label
            htmlFor="plant-status-filter"
            className={isTwinly ? twinlyLabel : undefined}
          >
            Status
          </Label>
          <select
            id="plant-status-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value as PlantFilter)}
            className={
              isTwinly
                ? twinlySelect
                : "w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            }
            aria-label="Filter by plant status"
          >
            {FILTERS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className={
            isTwinly
              ? dashboardEmptyPanel
              : "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center"
          }
        >
          <p
            className={
              isTwinly
                ? "font-poppins text-lg font-semibold text-white"
                : "text-lg font-medium"
            }
          >
            No plants match
          </p>
          <p
            className={cn(
              "mt-2 max-w-sm text-sm",
              isTwinly ? dashboardMuted : "text-muted-foreground",
            )}
          >
            {speciesKey
              ? "No plants for this species with the current search or status filters."
              : "Try another search or filter, or register a new plant."}
          </p>
          {speciesKey ? (
            <button
              type="button"
              onClick={() => setSpeciesFilter(null)}
              className={cn(
                "mt-4 font-poppins text-sm font-medium underline-offset-2 hover:underline",
                isTwinly ? "text-[#57B55D]" : "text-primary",
              )}
            >
              Clear species filter
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((plant) => (
            <li key={plant.id}>
              <PlantCard plant={plant} appearance={appearance} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
