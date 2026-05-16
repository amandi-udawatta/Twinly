import type { WeatherSnapshot } from "@/services/weatherService";

interface WeatherSummaryPanelProps {
  weather: WeatherSnapshot | null;
  error?: string | null;
}

export function WeatherSummaryPanel({
  weather,
  error,
}: WeatherSummaryPanelProps) {
  if (error) {
    return (
      <PanelShell title="Weather">
        <p className="text-sm text-muted-foreground">{error}</p>
      </PanelShell>
    );
  }

  if (!weather) {
    return (
      <PanelShell title="Weather">
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

  return (
    <PanelShell title="Weather">
      <p className="text-sm text-muted-foreground">{weather.location}</p>
      <p className="mt-2 font-heading text-3xl font-semibold text-primary">
        {Math.round(weather.temp_c)}°C
      </p>
      <p className="mt-1 text-sm">{weather.condition}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Humidity {weather.humidity}%
      </p>
      {weather.forecast.length > 0 ? (
        <ul className="mt-4 space-y-2 border-t border-border pt-4">
          {weather.forecast.slice(0, 4).map((day) => (
            <li
              key={day.date}
              className="flex items-center justify-between text-xs text-muted-foreground"
            >
              <span>{day.date.slice(5)}</span>
              <span className="text-foreground">{day.condition}</span>
              <span>
                {day.mintemp_c}–{day.maxtemp_c}°C · {day.daily_chance_of_rain}%
                rain
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </PanelShell>
  );
}

function PanelShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
