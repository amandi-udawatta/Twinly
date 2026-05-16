export type PhotoComparisonHealthDelta =
  | "improved"
  | "unchanged"
  | "declined"
  | "unclear";

export interface PhotoComparisonResult {
  summary: string;
  visibleChanges: string[];
  healthDelta: PhotoComparisonHealthDelta;
}
