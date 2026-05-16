export const INTERVENTION_TYPES = [
  "watering",
  "fertilizing",
  "pruning",
  "repotting",
  "pest_treatment",
  "other",
] as const;

export type InterventionType = (typeof INTERVENTION_TYPES)[number];
