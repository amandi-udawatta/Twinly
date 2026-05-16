export type InsightCategory =
  | "GROWTH"
  | "NUTRIENT"
  | "DISEASE_RISK"
  | "STRESS"
  | "ENVIRONMENTAL";

export type InsightSeverity = "low" | "medium" | "high" | "critical";

export type HealthTrend = "improving" | "stable" | "declining" | "critical";

export interface PlantInsight {
  category: InsightCategory;
  severity: InsightSeverity;
  title: string;
  detail: string;
  action: string;
  confidence: number;
}

/** Vertex AI multimodal output before OpenAI narrative pass (PRD §4.4). */
export interface RawPlantReport {
  healthScore: number;
  healthTrend: HealthTrend;
  insights: PlantInsight[];
  rawPredictionContext: string;
  urgencyScore: number;
  changesSinceLastScan: string;
  weatherImpactRaw: string;
}

/** Final report saved to DB and rendered in UI (PRD §4.5). */
export interface PlantReport {
  healthScore: number;
  healthTrend: HealthTrend;
  insights: PlantInsight[];
  recommendations: string[];
  prediction: {
    next14Days: string;
    upcomingRisks: string;
  };
  urgencyScore: number;
  changesSinceLastScan: string;
  weatherImpact: string;
}
