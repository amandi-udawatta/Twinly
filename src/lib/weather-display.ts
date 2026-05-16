import type { WeatherSnapshot } from "@/services/weatherService";

/** Parse JSON stored on checkins.weather_snapshot. */
export function parseWeatherSnapshot(raw: unknown): WeatherSnapshot | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const snapshot = raw as WeatherSnapshot;
  if (
    typeof snapshot.temp_c !== "number" ||
    typeof snapshot.humidity !== "number" ||
    typeof snapshot.condition !== "string"
  ) {
    return null;
  }

  return snapshot;
}

/** One-line label for history rows and compact strips. */
export function formatWeatherCompact(snapshot: WeatherSnapshot): string {
  const rainToday = snapshot.forecast[0]?.daily_chance_of_rain;
  const rainPart =
    rainToday !== undefined ? ` · ${rainToday}% rain today` : "";
  return `${Math.round(snapshot.temp_c)}°C · ${snapshot.humidity}% humidity · ${snapshot.condition}${rainPart}`;
}
