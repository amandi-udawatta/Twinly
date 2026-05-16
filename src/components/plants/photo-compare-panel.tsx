"use client";

import { useState } from "react";

import { ErrorBanner, LoadingState } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { PhotoComparisonResult } from "@/types/photo-comparison";
import type { AppAppearance } from "@/components/dashboard/dashboard-theme";
import {
  dashboardBody,
  dashboardCtaPrimary,
  dashboardMuted,
  dashboardPanel,
  dashboardPanelTitle,
  twinlyInlineCard,
  twinlyLabel,
  twinlySelect,
} from "@/components/dashboard/dashboard-theme";
import { cn } from "@/lib/utils";

export interface CheckinOption {
  id: string;
  label: string;
}

interface PhotoComparePanelProps {
  plantId: string;
  checkins: CheckinOption[];
  appearance?: AppAppearance;
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

export function PhotoComparePanel({
  plantId,
  checkins,
  appearance = "default",
}: PhotoComparePanelProps) {
  const isTwinly = appearance === "twinly";
  const [beforeId, setBeforeId] = useState(checkins.length > 1 ? checkins[1].id : "");
  const [afterId, setAfterId] = useState(checkins[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PhotoComparisonResult | null>(null);

  if (checkins.length < 2) {
    return (
      <p
        className={cn(
          "font-poppins text-sm",
          isTwinly ? dashboardMuted : "text-muted-foreground",
        )}
      >
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
    <section
      className={
        isTwinly
          ? dashboardPanel
          : "rounded-xl border border-border bg-card p-4"
      }
    >
      <h3
        className={
          isTwinly
            ? cn(dashboardPanelTitle, "text-base sm:text-lg")
            : "font-medium"
        }
      >
        Compare check-ins
      </h3>
      <p
        className={cn(
          "mt-1 font-poppins text-sm",
          isTwinly ? dashboardMuted : "text-muted-foreground",
        )}
      >
        Gemini on Vertex AI compares two photos from different visits.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="before-checkin" className={isTwinly ? twinlyLabel : undefined}>
            Earlier
          </Label>
          <select
            id="before-checkin"
            value={beforeId}
            onChange={(e) => setBeforeId(e.target.value)}
            disabled={loading}
            className={
              isTwinly
                ? twinlySelect
                : "w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            }
          >
            {checkins.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="after-checkin" className={isTwinly ? twinlyLabel : undefined}>
            Later
          </Label>
          <select
            id="after-checkin"
            value={afterId}
            onChange={(e) => setAfterId(e.target.value)}
            disabled={loading}
            className={
              isTwinly
                ? twinlySelect
                : "w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            }
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
        className={cn("mt-4", isTwinly && dashboardCtaPrimary)}
        onClick={runCompare}
        disabled={loading || beforeId === afterId}
      >
        Compare with Gemini
      </Button>

      {beforeId === afterId ? (
        <p
          className={cn(
            "mt-2 font-poppins text-xs",
            isTwinly ? dashboardMuted : "text-muted-foreground",
          )}
        >
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
        <div
          className={cn(
            "mt-4 space-y-3 p-4 font-poppins text-sm",
            isTwinly ? twinlyInlineCard : "rounded-lg border border-border bg-muted/30",
          )}
        >
          <p>
            <span className="font-medium">Overall: </span>
            <span
              className={cn(
                "capitalize",
                isTwinly
                  ? result.healthDelta === "improved"
                    ? "text-[#57B55D]"
                    : result.healthDelta === "declined"
                      ? "text-red-400"
                      : "text-white/70"
                  : DELTA_STYLE[result.healthDelta],
              )}
            >
              {DELTA_LABEL[result.healthDelta]}
            </span>
          </p>
          <p className={cn("leading-relaxed", isTwinly ? dashboardBody : "text-muted-foreground")}>
            {result.summary}
          </p>
          {result.visibleChanges.length > 0 ? (
            <ul
              className={cn(
                "list-inside list-disc space-y-1",
                isTwinly ? dashboardMuted : "text-muted-foreground",
              )}
            >
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
