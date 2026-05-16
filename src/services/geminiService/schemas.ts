/**
 * JSON response schemas for Vertex AI structured output (@google/genai).
 */

import { Type, type Schema } from "@google/genai";

/** Optional species name suggestion from a registration photo. */
export const speciesSuggestionResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    species: { type: Type.STRING },
  },
  required: ["species"],
};

/** Raw PlantReport from Vertex multimodal check-in (PRD §4.4). */
export const rawPlantReportResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    healthScore: { type: Type.NUMBER },
    healthTrend: { type: Type.STRING },
    insights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          severity: { type: Type.STRING },
          title: { type: Type.STRING },
          detail: { type: Type.STRING },
          action: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
        },
        required: [
          "category",
          "severity",
          "title",
          "detail",
          "action",
          "confidence",
        ],
      },
    },
    rawPredictionContext: { type: Type.STRING },
    urgencyScore: { type: Type.NUMBER },
    changesSinceLastScan: { type: Type.STRING },
    weatherImpactRaw: { type: Type.STRING },
  },
  required: [
    "healthScore",
    "healthTrend",
    "insights",
    "rawPredictionContext",
    "urgencyScore",
    "changesSinceLastScan",
    "weatherImpactRaw",
  ],
};

/** Before/after photo comparison (gallery feature). */
export const photoComparisonResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    visibleChanges: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    healthDelta: { type: Type.STRING },
  },
  required: ["summary", "visibleChanges", "healthDelta"],
};
