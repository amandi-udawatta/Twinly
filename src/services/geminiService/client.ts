/**
 * Vertex AI Gemini client — GCP billing/credits via ADC or service account env.
 * No GEMINI_API_KEY / AI Studio free tier.
 */

import { GoogleGenAI } from "@google/genai";

import { getGcpGoogleAuthOptions } from "@/lib/gcp-credentials";

export const GOOGLE_CLOUD_PROJECT =
  process.env.GOOGLE_CLOUD_PROJECT ?? "twinly-496507";

export const GOOGLE_CLOUD_LOCATION =
  process.env.GOOGLE_CLOUD_LOCATION ?? "us-central1";

/** Vertex multimodal model (PRD §4.2). */
export const VERTEX_GEMINI_MODEL = "gemini-2.5-flash";

let cachedClient: GoogleGenAI | null = null;

export function getVertexGenAIClient(): GoogleGenAI {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = new GoogleGenAI({
    vertexai: true,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
    googleAuthOptions: getGcpGoogleAuthOptions(),
  });

  return cachedClient;
}
