import type { WeatherSnapshot } from "@/services/weatherService";

interface CheckinWeatherStripProps {
  weather: WeatherSnapshot | null;
  error?: string | null;
}

export function CheckinWeatherStrip({ weather, error }: CheckinWeatherStripProps) {
  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
        Weather could not be loaded. You can still check in — analysis may have
        less environmental context.
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/50 px-4 py-3 text-sm text-muted-foreground">
        Add your city in{" "}
        <a href="/settings" className="text-primary underline-offset-4 hover:underline">
          settings
        </a>{" "}
        to include live weather in this check-in.
      </div>
    );
  }

  const today = weather.forecast[0];

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Garden weather today
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">
        {weather.location} · {Math.round(weather.temp_c)}°C · {weather.condition}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Humidity {weather.humidity}%
        {today ? ` · ${today.daily_chance_of_rain}% chance of rain` : ""}
      </p>
    </div>
  );
}
