/** Normalized species key — must match dashboard species grouping. */
export function plantSpeciesKey(species: string | null | undefined): string {
  return species?.trim().toLowerCase() || "unknown";
}

export interface SpeciesFilterOption {
  key: string;
  label: string;
}

export function buildSpeciesFilterOptions(
  plants: { species: string | null }[],
): SpeciesFilterOption[] {
  const map = new Map<string, string>();

  for (const plant of plants) {
    const key = plantSpeciesKey(plant.species);
    if (!map.has(key)) {
      map.set(key, plant.species?.trim() || "Unknown");
    }
  }

  return Array.from(map.entries())
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function parseSpeciesSearchParam(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  try {
    const decoded = decodeURIComponent(value).trim().toLowerCase();
    return decoded || null;
  } catch {
    const fallback = value.trim().toLowerCase();
    return fallback || null;
  }
}
