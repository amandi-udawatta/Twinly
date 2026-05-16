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
import { cn } from "@/lib/utils";

interface CheckinFormProps {
  plantId: string;
  plantName: string;
  recentContext?: string | null;
}

export function CheckinForm({
  plantId,
  plantName,
  recentContext,
}: CheckinFormProps) {
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
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Health score</p>
          <p className="font-heading text-4xl font-semibold text-primary">
            {Math.round(report.healthScore)}
          </p>
          <p className="mt-1 capitalize text-muted-foreground">
            Trend: {report.healthTrend}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Analyzed with Gemini on Google Cloud Vertex AI
          </p>
        </div>
        {analysisContext ? (
          <AnalysisContextPanel context={analysisContext} />
        ) : null}
        <ChangesSinceCard summary={report.changesSinceLastScan} />
        <div className="grid gap-4 md:grid-cols-2">
          {report.insights.map((insight, i) => (
            <InsightCard key={`${insight.title}-${i}`} insight={insight} index={i} />
          ))}
        </div>
        <RecommendationsCard recommendations={report.recommendations} />
        <Link
          href={`/plants/${plantId}`}
          className={cn(buttonVariants({ size: "lg" }))}
        >
          View plant dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <p className="text-sm text-muted-foreground">
        Checking in: <span className="text-foreground">{plantName}</span>
      </p>
      {recentContext ? (
        <p className="text-xs text-muted-foreground">{recentContext}</p>
      ) : null}
      <PhotoDropzone
        maxFiles={4}
        onFilesChange={setFiles}
        disabled={loading}
        label="Drop up to 4 photos (different angles)"
      />
      <div className="space-y-2">
        <Label htmlFor="note">Note (optional)</Label>
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
          className="w-full"
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
