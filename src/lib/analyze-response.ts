/**
 * Parse /api/analyze responses (handles non-JSON Vercel 413 bodies).
 */

import type { AnalysisContext } from "@/types/analysis-context";
import type { PlantReport } from "@/types/plant-report";

function friendlyAnalyzeError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("bad gateway") || lower.includes("502")) {
    return "AI service was briefly unavailable. Please try again in a few seconds.";
  }
  if (lower.includes("timeout") || lower.includes("timed out")) {
    return "Analysis took too long. Try again with fewer or smaller photos.";
  }
  return message;
}

export type AnalyzeSuccess = {
  ok: true;
  report: PlantReport;
  analysisContext?: AnalysisContext;
};

export type AnalyzeFailure = {
  ok: false;
  error: string;
};

export async function parseAnalyzeResponse(
  res: Response,
): Promise<AnalyzeSuccess | AnalyzeFailure> {
  const text = await res.text();

  if (!res.ok) {
    if (res.status === 413) {
      return {
        ok: false,
        error:
          "Photos are too large for upload. Use fewer or smaller images (under ~3 MB total).",
      };
    }

    try {
      const json = JSON.parse(text) as { error?: string };
      const message = json.error ?? `Analysis failed (${res.status}).`;
      return {
        ok: false,
        error: friendlyAnalyzeError(message),
      };
    } catch {
      const snippet = text.trim().slice(0, 80);
      return {
        ok: false,
        error: snippet || `Analysis failed (${res.status}).`,
      };
    }
  }

  try {
    const json = JSON.parse(text) as {
      report?: PlantReport;
      analysisContext?: AnalysisContext;
      error?: string;
    };

    if (!json.report) {
      return {
        ok: false,
        error: json.error ?? "Analysis returned no report.",
      };
    }

    return {
      ok: true,
      report: json.report,
      analysisContext: json.analysisContext,
    };
  } catch {
    return {
      ok: false,
      error: "Invalid response from server.",
    };
  }
}
