"use client";

import { useMemo, useState } from "react";

import { PlantCard } from "@/components/dashboard/plant-card";
import type { PlantWithLatestAnalysis } from "@/lib/data/plants";
import { Input } from "@/components/ui/input";
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
}

export function PlantsGrid({ plants }: PlantsGridProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PlantFilter>("all");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return plants.filter((plant) => {
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
  }, [plants, query, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="search"
          placeholder="Search by name or plant type…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-md bg-card"
          aria-label="Search plants"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                filter === item.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <p className="text-lg font-medium">No plants match</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Try another search or filter, or register a new plant.
          </p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((plant) => (
            <li key={plant.id}>
              <PlantCard plant={plant} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
