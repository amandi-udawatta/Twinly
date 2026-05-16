import type { AppAppearance } from "@/components/dashboard/dashboard-theme";
import {
  dashboardLink,
  dashboardMuted,
  twinlyInlineCard,
} from "@/components/dashboard/dashboard-theme";
import type { WeatherSnapshot } from "@/services/weatherService";
import { cn } from "@/lib/utils";

interface CheckinWeatherStripProps {
  weather: WeatherSnapshot | null;
  error?: string | null;
  appearance?: AppAppearance;
}

export function CheckinWeatherStrip({
  weather,
  error,
  appearance = "default",
}: CheckinWeatherStripProps) {
  const isTwinly = appearance === "twinly";

  if (error) {
    return (
      <div
        className={cn(
          "px-4 py-3 font-poppins text-sm",
          isTwinly
            ? twinlyInlineCard
            : "rounded-lg border border-border bg-card text-muted-foreground",
        )}
      >
        Weather could not be loaded. You can still check in — analysis may have
        less environmental context.
      </div>
    );
  }

  if (!weather) {
    return (
      <div
        className={cn(
          "px-4 py-3 font-poppins text-sm",
          isTwinly
            ? "rounded-2xl border border-dashed border-white/20 bg-black/20"
            : "rounded-lg border border-dashed border-border bg-card/50 text-muted-foreground",
        )}
      >
        Add your city in{" "}
        <a
          href="/settings"
          className={
            isTwinly
              ? dashboardLink
              : "text-primary underline-offset-4 hover:underline"
          }
        >
          settings
        </a>{" "}
        to include live weather in this check-in.
      </div>
    );
  }

  const today = weather.forecast[0];

  return (
    <div
      className={
        isTwinly
          ? twinlyInlineCard
          : "rounded-lg border border-border bg-card px-4 py-3"
      }
    >
      <p
        className={cn(
          "font-poppins text-xs font-medium uppercase tracking-wide",
          isTwinly ? "text-white/50" : "text-muted-foreground",
        )}
      >
        Garden weather today
      </p>
      <p
        className={cn(
          "mt-1 font-poppins text-sm font-medium",
          isTwinly ? "text-white" : "text-foreground",
        )}
      >
        {weather.location} · {Math.round(weather.temp_c)}°C · {weather.condition}
      </p>
      <p className={cn("mt-1 font-poppins text-xs", isTwinly ? dashboardMuted : "text-muted-foreground")}>
        Humidity {weather.humidity}%
        {today ? ` · ${today.daily_chance_of_rain}% chance of rain` : ""}
      </p>
    </div>
  );
}
