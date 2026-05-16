"use client";

import Image from "next/image";

import { dashboardBody, dashboardMuted } from "@/components/dashboard/dashboard-theme";
import type { WeatherSnapshot } from "@/services/weatherService";
import { cn } from "@/lib/utils";

interface WeatherForecastPillsProps {
  weather: WeatherSnapshot;
  forecastDays?: number;
  className?: string;
  appearance?: "default" | "twinly";
}

export function WeatherForecastPills({
  weather,
  forecastDays = 7,
  className,
  appearance = "default",
}: WeatherForecastPillsProps) {
  const forecast = weather.forecast.slice(0, forecastDays);
  const isTwinly = appearance === "twinly";

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-start gap-3">
        {weather.condition_icon ? (
          <Image
            src={weather.condition_icon}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12"
            unoptimized
          />
        ) : null}
        <div>
          <p className={isTwinly ? dashboardMuted : "text-sm text-muted-foreground"}>
            {weather.location}
          </p>
          <p
            className={cn(
              "mt-1 text-2xl font-semibold",
              isTwinly
                ? "font-poppins font-semibold text-[#57B55D]"
                : "font-heading text-primary",
            )}
          >
            {Math.round(weather.temp_c)}°C now
          </p>
          <p className={isTwinly ? dashboardMuted : "text-sm text-muted-foreground"}>
            {weather.condition} · {weather.humidity}% humidity
          </p>
        </div>
      </div>
      <div className="-mx-1 overflow-x-auto px-1 pb-2">
        <ul className="flex gap-3">
          {forecast.map((day) => {
            const label = new Date(`${day.date}T12:00:00`).toLocaleDateString(
              undefined,
              { weekday: "short" },
            );

            return (
              <li
                key={day.date}
                className={cn(
                  "flex min-w-[7.5rem] shrink-0 flex-col items-center rounded-2xl px-4 py-4 text-center shadow-sm",
                  isTwinly
                    ? "border border-white/10 bg-black/50 backdrop-blur-sm"
                    : "border border-border bg-[#0D0D0D]/60",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-medium",
                    isTwinly ? "font-poppins text-white/55" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
                <span
                  className={cn(
                    "mt-1 text-[10px]",
                    isTwinly ? "text-white/45" : "text-muted-foreground",
                  )}
                >
                  {day.date.slice(5)}
                </span>
                {day.condition_icon ? (
                  <Image
                    src={day.condition_icon}
                    alt={day.condition}
                    width={64}
                    height={64}
                    className="mt-3 h-16 w-16"
                    unoptimized
                  />
                ) : null}
                <p
                  className={cn(
                    "mt-2 min-h-[2.5rem] text-xs leading-snug",
                    isTwinly ? dashboardBody : "text-foreground",
                  )}
                >
                  {day.condition}
                </p>
                <p
                  className={cn(
                    "mt-2 text-sm font-semibold",
                    isTwinly ? "font-poppins text-white" : "text-foreground",
                  )}
                >
                  {day.mintemp_c}–{day.maxtemp_c}°C
                </p>
                <p className={cn("mt-1 text-xs", isTwinly ? dashboardMuted : "text-muted-foreground")}>
                  {day.daily_chance_of_rain}% rain
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
