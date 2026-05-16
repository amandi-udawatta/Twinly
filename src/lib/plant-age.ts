export type AgeUnit = "days" | "weeks" | "years";

const DAYS_PER_WEEK = 7;
const DAYS_PER_YEAR = 365;

export function ageToDays(amount: number, unit: AgeUnit): number {
  if (amount <= 0 || !Number.isFinite(amount)) {
    return 0;
  }

  switch (unit) {
    case "days":
      return Math.round(amount);
    case "weeks":
      return Math.round(amount * DAYS_PER_WEEK);
    case "years":
      return Math.round(amount * DAYS_PER_YEAR);
    default:
      return Math.round(amount);
  }
}

export function parseAgeUnit(value: string): AgeUnit | null {
  if (value === "days" || value === "weeks" || value === "years") {
    return value;
  }
  return null;
}

/** Human-readable label for stored age (days). */
export function formatAgeDays(days: number | null): string | null {
  if (days == null || days <= 0) {
    return null;
  }

  if (days >= DAYS_PER_YEAR && days % DAYS_PER_YEAR === 0) {
    const years = days / DAYS_PER_YEAR;
    return years === 1 ? "1 year" : `${years} years`;
  }

  if (days >= DAYS_PER_WEEK && days % DAYS_PER_WEEK === 0) {
    const weeks = days / DAYS_PER_WEEK;
    return weeks === 1 ? "1 week" : `${weeks} weeks`;
  }

  return days === 1 ? "1 day" : `${days} days`;
}
