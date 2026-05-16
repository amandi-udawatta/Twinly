import type { PlantReport, RawPlantReport } from "@/types/plant-report";

/** DB constraint: analysis_results.health_score 0–100 */
export function clampHealthScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
}

/** DB constraint: analysis_results.urgency_score 0–10 */
export function clampUrgencyScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.min(10, Math.max(0, Math.round(score)));
}

export function normalizeRawPlantReport(raw: RawPlantReport): RawPlantReport {
  return {
    ...raw,
    healthScore: clampHealthScore(raw.healthScore),
    urgencyScore: clampUrgencyScore(raw.urgencyScore),
  };
}

export function normalizePlantReport(report: PlantReport): PlantReport {
  return {
    ...report,
    healthScore: clampHealthScore(report.healthScore),
    urgencyScore: clampUrgencyScore(report.urgencyScore),
  };
}
