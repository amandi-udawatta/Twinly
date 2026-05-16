import { WeatherForecastPills } from "@/components/weather/weather-forecast-pills";
import type { WeatherSnapshot } from "@/services/weatherService";
import { cn } from "@/lib/utils";

interface WeatherSummaryPanelProps {
  weather: WeatherSnapshot | null;
  error?: string | null;
  title?: string;
  forecastDays?: number;
  className?: string;
  /** Vertical list on dashboard; horizontal pills on plant predictions. */
  forecastLayout?: "list" | "pills";
}

export function WeatherSummaryPanel({
  weather,
  error,
  title = "Weather",
  forecastDays = 7,
  className,
  forecastLayout = "list",
}: WeatherSummaryPanelProps) {
  if (error) {
    return (
      <PanelShell title={title} className={className}>
        <p className="text-sm text-muted-foreground">{error}</p>
      </PanelShell>
    );
  }

  if (!weather) {
    return (
      <PanelShell title={title} className={className}>
        <p className="text-sm text-muted-foreground">
          Add your city in{" "}
          <a href="/settings" className="text-primary underline-offset-4 hover:underline">
            settings
          </a>{" "}
          to see local conditions for your garden.
        </p>
      </PanelShell>
    );
  }

  const forecast = weather.forecast.slice(0, forecastDays);

  if (forecastLayout === "pills") {
    return (
      <PanelShell title={title} className={className}>
        <WeatherForecastPills weather={weather} forecastDays={forecastDays} />
      </PanelShell>
    );
  }

  return (
    <PanelShell title={title} className={className}>
      <p className="text-sm text-muted-foreground">{weather.location}</p>
      <p className="mt-2 font-heading text-3xl font-semibold text-primary">
        {Math.round(weather.temp_c)}°C
      </p>
      <p className="mt-1 text-sm">{weather.condition}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Humidity {weather.humidity}%
      </p>
      {forecast.length > 0 ? (
        <div className="mt-4 border-t border-border pt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {forecastDays}-day forecast
          </p>
          <ul className="space-y-2">
            {forecast.map((day) => (
              <li
                key={day.date}
                className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs text-muted-foreground"
              >
                <span className="min-w-[3rem] font-medium text-foreground">
                  {day.date.slice(5)}
                </span>
                <span className="flex-1 text-foreground">{day.condition}</span>
                <span className="shrink-0">
                  {day.mintemp_c}–{day.maxtemp_c}°C · {day.daily_chance_of_rain}%
                  rain
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </PanelShell>
  );
}

function PanelShell({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card p-6",
        className,
      )}
    >
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
