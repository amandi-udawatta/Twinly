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
