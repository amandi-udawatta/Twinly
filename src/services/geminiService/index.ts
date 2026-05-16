/**
 * Vertex AI (Gemini 2.5 Flash) — vision-only workloads:
 * - Plant registration auto-fill from photo (PRD §4.3)
 * - Check-in multimodal 5-layer analysis (PRD §4.4)
 */

import { getVertexGenAIClient, VERTEX_GEMINI_MODEL } from "@/services/geminiService/client";
import {
  photoComparisonResponseSchema,
  rawPlantReportResponseSchema,
  speciesSuggestionResponseSchema,
} from "@/services/geminiService/schemas";
import type { PhotoComparisonResult } from "@/types/photo-comparison";
import type { RawPlantReport } from "@/types/plant-report";

export interface SpeciesSuggestion {
  species: string;
}

/** Fetch image bytes from a public URL for multimodal prompts. */
async function fetchImagePart(
  imageUrl: string,
): Promise<{ inlineData: { data: string; mimeType: string } }> {
  const res = await fetch(imageUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.statusText}`);
  }
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const mimeType = res.headers.get("content-type") ?? "image/jpeg";
  return { inlineData: { data: base64, mimeType } };
}

/**
 * Optional registration helper — suggest an everyday plant name from a photo.
 */
export async function suggestSpeciesFromImage(
  imageBase64: string,
  mimeType: string,
): Promise<SpeciesSuggestion> {
  const ai = getVertexGenAIClient();

  const prompt = `You help home gardeners name their plants. Look at this photo and return JSON only.
Return species as a simple everyday name a gardener would use — like "tomato", "chilli", "bell pepper", "basil", "monstera".
Use lowercase. No scientific/Latin names. One or two words max. If unsure, give your best guess.`;

  const response = await ai.models.generateContent({
    model: VERTEX_GEMINI_MODEL,
    contents: [
      prompt,
      { inlineData: { data: imageBase64, mimeType } },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: speciesSuggestionResponseSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Empty response from Vertex AI.");
  }

  return JSON.parse(text) as SpeciesSuggestion;
}

export interface CheckInContext {
  plant: {
    nickname: string | null;
    species: string | null;
    approximateAge: string | null;
    historyNote: string | null;
  };
  historySummaries: string;
  weatherText: string;
  userNote: string | null;
  imageUrls: string[];
}

/**
 * PRD §4.4 — Check-in: multimodal 5-layer prompt → raw PlantReport JSON.
 * Narrative formatting is handled downstream by openaiService.
 */
export async function analyzePlantCheckIn(
  context: CheckInContext,
): Promise<RawPlantReport> {
  const ai = getVertexGenAIClient();

  const imageParts = await Promise.all(
    context.imageUrls.map((url) => fetchImagePart(url)),
  );

  const prompt = `You are Twinly's plant intelligence engine. Expert in plant pathology, horticulture, and agronomy.

Layer 2 — Plant identity:
- Nickname: ${context.plant.nickname ?? "Unknown"}
- Species: ${context.plant.species ?? "Unknown"}
- Age: ${context.plant.approximateAge ?? "Unknown"}
- History: ${context.plant.historyNote ?? "None"}

Layer 3 — Health history (last 30 days):
${context.historySummaries || "No prior check-ins."}

Layer 4 — Weather:
${context.weatherText}

Layer 5 — Task:
Analyze the provided images against this full context.
Return the raw PlantReport JSON schema exactly. No prose outside the JSON.
Limit insights to at most 5 items. Use plain language (8th grade reading level).
healthTrend must be one of: improving, stable, declining, critical.
insight category: GROWTH, NUTRIENT, DISEASE_RISK, STRESS, or ENVIRONMENTAL.
severity: low, medium, high, or critical.
Populate rawPredictionContext with your reasoning for the next 1–2 weeks.
Populate weatherImpactRaw with how current weather affects this plant.

User note for this check-in: ${context.userNote ?? "None"}`;

  const response = await ai.models.generateContent({
    model: VERTEX_GEMINI_MODEL,
    contents: [prompt, ...imageParts],
    config: {
      responseMimeType: "application/json",
      responseSchema: rawPlantReportResponseSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Empty response from Vertex AI.");
  }

  return JSON.parse(text) as RawPlantReport;
}

export interface PhotoCompareContext {
  species: string | null;
  nickname: string | null;
  beforeDate: string;
  afterDate: string;
}

/**
 * Compare two check-in photos over time (Vertex multimodal only).
 */
export async function comparePlantPhotos(
  beforeImageUrl: string,
  afterImageUrl: string,
  context: PhotoCompareContext,
): Promise<PhotoComparisonResult> {
  const ai = getVertexGenAIClient();

  const [beforePart, afterPart] = await Promise.all([
    fetchImagePart(beforeImageUrl),
    fetchImagePart(afterImageUrl),
  ]);

  const plantLabel =
    context.nickname || context.species || "this plant";

  const prompt = `You are Twinly's plant vision engine. Compare these two photos of the same plant taken on different dates.

Plant: ${plantLabel}${context.species ? ` (${context.species})` : ""}
Earlier photo date: ${context.beforeDate}
Later photo date: ${context.afterDate}

The first image is the earlier check-in; the second is the later check-in.
Return JSON only with:
- summary: 2-3 sentences for a home gardener
- visibleChanges: array of specific visible differences (leaves, color, growth, damage, etc.)
- healthDelta: one of improved, unchanged, declined, unclear`;

  const response = await ai.models.generateContent({
    model: VERTEX_GEMINI_MODEL,
    contents: [prompt, beforePart, afterPart],
    config: {
      responseMimeType: "application/json",
      responseSchema: photoComparisonResponseSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Empty response from Vertex AI.");
  }

  return JSON.parse(text) as PhotoComparisonResult;
}
