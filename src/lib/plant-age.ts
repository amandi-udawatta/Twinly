export type AgeUnit = "days" | "weeks" | "years";

const MS_PER_DAY = 86_400_000;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;
const DAYS_PER_YEAR = 365;

/**
 * Whole calendar days from `isoDate` (UTC date) through `reference` (default: now).
 */
export function daysElapsedSince(
  isoDate: string,
  reference: Date = new Date(),
): number {
  const start = new Date(isoDate);
  if (Number.isNaN(start.getTime())) {
    return 0;
  }

  const startDay = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
  );
  const refDay = Date.UTC(
    reference.getUTCFullYear(),
    reference.getUTCMonth(),
    reference.getUTCDate(),
  );

  return Math.max(0, Math.floor((refDay - startDay) / MS_PER_DAY));
}

/**
 * Current plant age in days. `baselineDays` is approximate_age at registration;
 * each calendar day after created_at adds one day.
 */
function coercePositiveDays(value: number | string | null | undefined): number | null {
  if (value == null || value === "") {
    return null;
  }
  const n = typeof value === "number" ? value : Number.parseInt(String(value), 10);
  if (!Number.isFinite(n) || n <= 0) {
    return null;
  }
  return n;
}

export function getCurrentAgeDays(
  baselineDays: number | string | null,
  createdAt: string,
  reference: Date = new Date(),
): number | null {
  const baseline = coercePositiveDays(baselineDays);
  if (baseline == null) {
    return null;
  }

  return baseline + daysElapsedSince(createdAt, reference);
}

export interface AgeBreakdown {
  days: number;
  months: number;
  years: number;
}

/** Split total days into years (365d), months (30d), and remaining days. */
export function breakdownAgeDays(totalDays: number): AgeBreakdown {
  const total = Math.max(0, Math.floor(totalDays));
  const years = Math.floor(total / DAYS_PER_YEAR);
  let remainder = total % DAYS_PER_YEAR;
  const months = Math.floor(remainder / DAYS_PER_MONTH);
  const days = remainder % DAYS_PER_MONTH;
  return { days, months, years };
}

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

/** e.g. "16 days 1 month 0 years" */
export function formatAgeBreakdown(totalDays: number | null): string | null {
  if (totalDays == null || totalDays <= 0) {
    return null;
  }

  const { days, months, years } = breakdownAgeDays(totalDays);
  return [
    `${days} ${pluralize(days, "day", "days")}`,
    `${months} ${pluralize(months, "month", "months")}`,
    `${years} ${pluralize(years, "year", "years")}`,
  ].join(" ");
}

/** Human-readable current age for display and AI prompts. */
export function formatPlantAge(
  baselineDays: number | string | null,
  createdAt: string,
  reference: Date = new Date(),
): string | null {
  return formatAgeBreakdown(
    getCurrentAgeDays(baselineDays, createdAt, reference),
  );
}

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

/** Human-readable label for stored age (days) — single best unit. */
export function formatAgeDays(days: number | string | null): string | null {
  const total = coercePositiveDays(days);
  if (total == null) {
    return null;
  }

  if (total >= DAYS_PER_YEAR && total % DAYS_PER_YEAR === 0) {
    const years = total / DAYS_PER_YEAR;
    return years === 1 ? "1 year" : `${years} years`;
  }

  if (total >= DAYS_PER_WEEK && total % DAYS_PER_WEEK === 0) {
    const weeks = total / DAYS_PER_WEEK;
    return weeks === 1 ? "1 week" : `${weeks} weeks`;
  }

  return total === 1 ? "1 day" : `${total} days`;
}

/** Best-effort amount + unit for edit forms from stored days. */
export function daysToAgeFormValues(days: number | null): {
  amount: string;
  unit: AgeUnit;
} {
  if (days == null || days <= 0) {
    return { amount: "", unit: "weeks" };
  }

  if (days >= DAYS_PER_YEAR && days % DAYS_PER_YEAR === 0) {
    return { amount: String(days / DAYS_PER_YEAR), unit: "years" };
  }

  if (days >= DAYS_PER_WEEK && days % DAYS_PER_WEEK === 0) {
    return { amount: String(days / DAYS_PER_WEEK), unit: "weeks" };
  }

  return { amount: String(days), unit: "days" };
}
