/** Parse recommendations JSON from analysis_results. */

/** Coerce prediction.upcomingRisks from DB (may be string, array, or object). */
export function formatUpcomingRisks(raw: unknown): string {
  if (typeof raw === "string") return raw.trim();
  if (Array.isArray(raw)) {
    return raw
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .join(" ");
  }
  if (raw && typeof raw === "object") {
    const values = Object.values(raw as Record<string, unknown>)
      .filter((v): v is string => typeof v === "string")
      .map((v) => v.trim())
      .filter(Boolean);
    if (values.length > 0) return values.join(" ");
  }
  return "";
}

export function parseRecommendations(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .slice(0, 5);
}
