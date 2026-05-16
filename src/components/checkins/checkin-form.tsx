"use client";

/**
 * Check-in form: 1–4 photos, optional note, Gemini analysis, insight cards.
 */

import { useState } from "react";
import Link from "next/link";

import { PhotoDropzone } from "@/components/plants/photo-dropzone";
import { AnalysisContextPanel } from "@/components/checkins/analysis-context-panel";
import { ChangesSinceCard } from "@/components/checkins/changes-since-card";
import { InsightCard } from "@/components/checkins/insight-card";
import { RecommendationsCard } from "@/components/checkins/recommendations-card";
import { ErrorBanner, LoadingState } from "@/components/ui/feedback";
import type { AnalysisContext } from "@/types/analysis-context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PlantReport } from "@/types/plant-report";
import { buttonVariants } from "@/components/ui/button";
import type { AppAppearance } from "@/components/dashboard/dashboard-theme";
import {
  dashboardBody,
  dashboardCtaPrimary,
  dashboardMuted,
  dashboardPanel,
  dashboardPanelTitle,
  twinlyInlineCard,
  twinlyLabel,
} from "@/components/dashboard/dashboard-theme";
import { cn } from "@/lib/utils";

interface CheckinFormProps {
  plantId: string;
  plantName: string;
  recentContext?: string | null;
  appearance?: AppAppearance;
}

export function CheckinForm({
  plantId,
  plantName,
  recentContext,
  appearance = "default",
}: CheckinFormProps) {
  const isTwinly = appearance === "twinly";
  const [files, setFiles] = useState<File[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<PlantReport | null>(null);
  const [analysisContext, setAnalysisContext] = useState<AnalysisContext | null>(
    null,
  );

  const runAnalysis = async () => {
    if (files.length === 0) {
      setError("Add at least one photo.");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);
    setAnalysisContext(null);

    try {
      const formData = new FormData();
      formData.append("plantId", plantId);
      if (note.trim()) formData.append("userNote", note.trim());
      files.forEach((f) => formData.append("photos", f));

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const json = (await res.json()) as
        | { report: PlantReport; analysisContext?: AnalysisContext }
        | { error: string };

      if (!res.ok) {
        setError("error" in json ? json.error : "Analysis failed.");
        return;
      }

      if ("report" in json) {
        setReport(json.report);
        setAnalysisContext(json.analysisContext ?? null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  if (report) {
    return (
      <div className="space-y-8">
        <div
          className={
            isTwinly
              ? dashboardPanel
              : "rounded-xl border border-border bg-card p-6"
          }
        >
          <p className={cn("font-poppins text-sm", isTwinly ? dashboardMuted : "text-muted-foreground")}>
            Health score
          </p>
          <p
            className={cn(
              "font-poppins text-4xl font-semibold",
              isTwinly ? "text-[#57B55D]" : "font-heading text-primary",
            )}
          >
            {Math.round(report.healthScore)}
          </p>
          <p className={cn("mt-1 font-poppins capitalize", isTwinly ? dashboardMuted : "text-muted-foreground")}>
            Trend: {report.healthTrend}
          </p>
          <p className={cn("mt-3 font-poppins text-xs", isTwinly ? dashboardMuted : "text-muted-foreground")}>
            Analyzed with Gemini on Google Cloud Vertex AI
          </p>
        </div>
        {analysisContext ? (
          <AnalysisContextPanel context={analysisContext} appearance={appearance} />
        ) : null}
        <ChangesSinceCard summary={report.changesSinceLastScan} appearance={appearance} />
        <div className="grid gap-4 md:grid-cols-2">
          {report.insights.map((insight, i) => (
            <InsightCard
              key={`${insight.title}-${i}`}
              insight={insight}
              index={i}
              appearance={appearance}
            />
          ))}
        </div>
        <RecommendationsCard recommendations={report.recommendations} appearance={appearance} />
        <Link
          href={`/plants/${plantId}`}
          className={cn(
            isTwinly ? dashboardCtaPrimary : buttonVariants({ size: "lg" }),
          )}
        >
          View plant dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <p className={cn("font-poppins text-sm", isTwinly ? dashboardMuted : "text-muted-foreground")}>
        Checking in:{" "}
        <span className={isTwinly ? "text-white" : "text-foreground"}>{plantName}</span>
      </p>
      {recentContext ? (
        <p className={cn("font-poppins text-xs", isTwinly ? dashboardMuted : "text-muted-foreground")}>
          {recentContext}
        </p>
      ) : null}
      <PhotoDropzone
        maxFiles={4}
        onFilesChange={setFiles}
        disabled={loading}
        label="Drop up to 4 photos (different angles)"
        appearance={appearance}
      />
      <div className="space-y-2">
        <Label htmlFor="note" className={isTwinly ? twinlyLabel : undefined}>
          Note (optional)
        </Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. spots on lower leaves"
          rows={3}
          disabled={loading}
        />
      </div>
      {error ? <ErrorBanner message={error} /> : null}
      {loading ? (
        <LoadingState message="Gemini on Vertex AI is analyzing your photos, history, and weather…" />
      ) : (
        <Button
          type="button"
          className={cn("w-full", isTwinly && dashboardCtaPrimary)}
          size="lg"
          onClick={runAnalysis}
          disabled={files.length === 0}
        >
          Analyze plant
        </Button>
      )}
    </div>
  );
}
