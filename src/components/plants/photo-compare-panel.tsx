"use client";

import { useState } from "react";

import { ErrorBanner, LoadingState } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { PhotoComparisonResult } from "@/types/photo-comparison";
import { cn } from "@/lib/utils";

export interface CheckinOption {
  id: string;
  label: string;
}

interface PhotoComparePanelProps {
  plantId: string;
  checkins: CheckinOption[];
}

const DELTA_LABEL: Record<PhotoComparisonResult["healthDelta"], string> = {
  improved: "Improved",
  unchanged: "Unchanged",
  declined: "Declined",
  unclear: "Unclear",
};

const DELTA_STYLE: Record<PhotoComparisonResult["healthDelta"], string> = {
  improved: "text-primary",
  unchanged: "text-muted-foreground",
  declined: "text-destructive",
  unclear: "text-amber-500",
};

export function PhotoComparePanel({ plantId, checkins }: PhotoComparePanelProps) {
  const [beforeId, setBeforeId] = useState(checkins.length > 1 ? checkins[1].id : "");
  const [afterId, setAfterId] = useState(checkins[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PhotoComparisonResult | null>(null);

  if (checkins.length < 2) {
    return (
      <p className="text-sm text-muted-foreground">
        Complete at least two check-ins with photos to compare growth over time.
      </p>
    );
  }

  const runCompare = async () => {
    if (!beforeId || !afterId) {
      setError("Select both check-ins.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/compare-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plantId,
          beforeCheckinId: beforeId,
          afterCheckinId: afterId,
        }),
      });

      const json = (await res.json()) as
        | { comparison: PhotoComparisonResult }
        | { error: string };

      if (!res.ok) {
        setError("error" in json ? json.error : "Comparison failed.");
        return;
      }

      setResult("comparison" in json ? json.comparison : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Comparison failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h3 className="font-medium">Compare check-ins</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Gemini on Vertex AI compares two photos from different visits.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="before-checkin">Earlier</Label>
          <select
            id="before-checkin"
            value={beforeId}
            onChange={(e) => setBeforeId(e.target.value)}
            disabled={loading}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            {checkins.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="after-checkin">Later</Label>
          <select
            id="after-checkin"
            value={afterId}
            onChange={(e) => setAfterId(e.target.value)}
            disabled={loading}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            {checkins.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button
        type="button"
        className="mt-4"
        onClick={runCompare}
        disabled={loading || beforeId === afterId}
      >
        Compare with Gemini
      </Button>

      {beforeId === afterId ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Select two different dates.
        </p>
      ) : null}

      {error ? (
        <div className="mt-4">
          <ErrorBanner message={error} />
        </div>
      ) : null}
      {loading ? (
        <LoadingState message="Gemini is comparing your photos…" />
      ) : null}

      {result ? (
        <div className="mt-4 space-y-3 rounded-lg border border-border bg-muted/30 p-4 text-sm">
          <p>
            <span className="font-medium">Overall: </span>
            <span className={cn("capitalize", DELTA_STYLE[result.healthDelta])}>
              {DELTA_LABEL[result.healthDelta]}
            </span>
          </p>
          <p className="leading-relaxed text-muted-foreground">{result.summary}</p>
          {result.visibleChanges.length > 0 ? (
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              {result.visibleChanges.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
