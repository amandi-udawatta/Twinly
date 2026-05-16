/** Context returned from /api/analyze for "How Twinly analyzed this" UI. */

export interface AnalysisContext {
  plantIdentity: string;
  historySummary: string;
  weatherSummary: string;
  photoCount: number;
}
