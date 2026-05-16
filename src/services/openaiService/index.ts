/**
 * OpenAI text generation — prediction narratives, recommendations, formatting.
 * Vision and longitudinal reasoning stay in geminiService (Vertex AI).
 */

import OpenAI from "openai";

import { normalizePlantReport } from "@/lib/plant-report-scores";
import type { PlantReport, RawPlantReport } from "@/types/plant-report";

export type OpenAITextModel = "gpt-4o" | "gpt-4o-mini";

let cachedClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (cachedClient) {
    return cachedClient;
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "OpenAI is not configured. Set OPENAI_API_KEY in .env.local.",
    );
  }

  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}

export interface CompleteJsonOptions {
  model?: OpenAITextModel;
  systemPrompt?: string;
}

/**
 * General-purpose JSON completion for text-only tasks.
 */
export async function completeJson<T>(
  userPrompt: string,
  options: CompleteJsonOptions = {},
): Promise<T> {
  const client = getOpenAIClient();
  const model = options.model ?? "gpt-4o-mini";

  const response = await client.chat.completions.create({
    model,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          options.systemPrompt ??
          "You are Twinly's plant care assistant. Respond with valid JSON only.",
      },
      { role: "user", content: userPrompt },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("Empty response from OpenAI.");
  }

  return JSON.parse(text) as T;
}

const PLANT_REPORT_FORMAT_PROMPT = `Expand the raw Vertex AI plant health report into the final PlantReport JSON for home gardeners.

Rules:
- Keep healthScore, healthTrend, urgencyScore, and changesSinceLastScan from the raw report.
- Expand rawPredictionContext into prediction.next14Days (friendly, readable paragraph).
- Generate prediction.upcomingRisks from the raw context.
- Expand weatherImpactRaw into weatherImpact (one clear display string).
- Generate recommendations (max 5 strings, plain language, actionable).
- Lightly polish insight title, detail, and action fields for readability; keep category, severity, and confidence.
- Limit insights to at most 5 items.

Return JSON with exactly these keys:
healthScore, healthTrend, insights, recommendations, prediction, urgencyScore, changesSinceLastScan, weatherImpact`;

/**
 * PRD §4.5 — Downstream pass: raw Vertex report → final PlantReport.
 */
export async function formatPlantReportFromRaw(
  raw: RawPlantReport,
  model: OpenAITextModel = "gpt-4o-mini",
): Promise<PlantReport> {
  const formatted = await completeJson<PlantReport>(
    `${PLANT_REPORT_FORMAT_PROMPT}\n\nRaw report:\n${JSON.stringify(raw)}`,
    {
      model,
      systemPrompt:
        "You format Twinly plant health reports for home gardeners. Output valid JSON matching the PlantReport schema exactly.",
    },
  );

  return normalizePlantReport({
    ...formatted,
    healthScore: raw.healthScore,
    healthTrend: raw.healthTrend,
    urgencyScore: raw.urgencyScore,
    changesSinceLastScan: raw.changesSinceLastScan,
    insights: formatted.insights.slice(0, 5),
    recommendations: formatted.recommendations.slice(0, 5),
  });
}
