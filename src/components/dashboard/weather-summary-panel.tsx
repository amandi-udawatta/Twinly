import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import {
  dashboardBody,
  dashboardLink,
  dashboardMuted,
} from "@/components/dashboard/dashboard-theme";
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
  appearance?: "default" | "twinly";
}

export function WeatherSummaryPanel({
  weather,
  error,
  title = "Weather",
  forecastDays = 7,
  className,
  forecastLayout = "list",
  appearance = "default",
}: WeatherSummaryPanelProps) {
  const isTwinly = appearance === "twinly";

  if (error) {
    return (
      <PanelShell title={title} className={className} isTwinly={isTwinly}>
        <p className={isTwinly ? dashboardMuted : "text-sm text-muted-foreground"}>
          {error}
        </p>
      </PanelShell>
    );
  }

  if (!weather) {
    return (
      <PanelShell title={title} className={className} isTwinly={isTwinly}>
        <p className={isTwinly ? dashboardMuted : "text-sm text-muted-foreground"}>
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
          to see local conditions for your garden.
        </p>
      </PanelShell>
    );
  }

  const forecast = weather.forecast.slice(0, forecastDays);

  if (forecastLayout === "pills") {
    return (
      <PanelShell title={title} className={className} isTwinly={isTwinly}>
        <WeatherForecastPills
          weather={weather}
          forecastDays={forecastDays}
          appearance={appearance}
        />
      </PanelShell>
    );
  }

  return (
    <PanelShell title={title} className={className} isTwinly={isTwinly}>
      <p className={isTwinly ? dashboardMuted : "text-sm text-muted-foreground"}>
        {weather.location}
      </p>
      <p
        className={cn(
          "mt-2 text-3xl font-semibold",
          isTwinly
            ? "font-poppins font-semibold text-[#57B55D]"
            : "font-heading text-primary",
        )}
      >
        {Math.round(weather.temp_c)}°C
      </p>
      <p className={isTwinly ? dashboardBody : "mt-1 text-sm"}>
        {weather.condition}
      </p>
      <p className={cn("mt-1 text-xs", isTwinly ? dashboardMuted : "text-muted-foreground")}>
        Humidity {weather.humidity}%
      </p>
      {forecast.length > 0 ? (
        <div
          className={cn(
            "mt-4 border-t pt-4",
            isTwinly ? "border-white/10" : "border-border",
          )}
        >
          <p
            className={cn(
              "mb-2 text-xs font-medium uppercase tracking-wide",
              isTwinly ? "font-poppins text-white/50" : "text-muted-foreground",
            )}
          >
            {forecastDays}-day forecast
          </p>
          <ul className="space-y-2">
            {forecast.map((day) => (
              <li
                key={day.date}
                className={cn(
                  "flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs",
                  isTwinly ? dashboardMuted : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "min-w-[3rem] font-medium",
                    isTwinly ? "text-white/90" : "text-foreground",
                  )}
                >
                  {day.date.slice(5)}
                </span>
                <span className={isTwinly ? "text-white/85" : "flex-1 text-foreground"}>
                  {day.condition}
                </span>
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
  isTwinly,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
  isTwinly: boolean;
}) {
  if (isTwinly) {
    return (
      <DashboardPanel title={title} className={className} contentClassName="mt-4">
        {children}
      </DashboardPanel>
    );
  }

  return (
    <section
      className={cn("rounded-xl border border-border bg-card p-6", className)}
    >
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
