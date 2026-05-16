"use client";

/**
 * Recharts line chart of health scores over check-ins.
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import type { AppAppearance } from "@/components/dashboard/dashboard-theme";
import { dashboardMuted } from "@/components/dashboard/dashboard-theme";
import { cn } from "@/lib/utils";

export interface HealthTimelinePoint {
  /** Unique per check-in (required for React/Recharts keys). */
  id: string;
  date: string;
  score: number;
}

interface HealthTimelineChartProps {
  data: HealthTimelinePoint[];
  appearance?: AppAppearance;
}

function healthScoreColor(score: number): string {
  if (score > 70) return "#4ade80";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function HealthTimelineChart({
  data,
  appearance = "default",
}: HealthTimelineChartProps) {
  const isTwinly = appearance === "twinly";
  const tickFill = isTwinly ? "rgba(255,255,255,0.55)" : "var(--muted-foreground)";
  const gridStroke = isTwinly ? "rgba(255,255,255,0.12)" : undefined;
  const tooltipStyle = isTwinly
    ? {
        background: "rgba(0,0,0,0.85)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "12px",
        color: "#fff",
        fontFamily: "var(--font-poppins), sans-serif",
      }
    : {
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
      };

  if (data.length === 0) {
    return (
      <p
        className={cn(
          "py-8 text-center font-poppins text-sm",
          isTwinly ? dashboardMuted : "text-muted-foreground",
        )}
      >
        No check-in history yet.
      </p>
    );
  }

  return (
    <div className="w-full">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            className={isTwinly ? undefined : "stroke-border"}
            stroke={gridStroke}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: tickFill, fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: tickFill, fontSize: 11 }}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          {data.length > 1
            ? data.slice(0, -1).map((point, index) => {
                const next = data[index + 1];
                return (
                  <Line
                    key={`segment-${point.id}-${next.id}`}
                    data={[point, next]}
                    type="monotone"
                    dataKey="score"
                    stroke={healthScoreColor(next.score)}
                    strokeWidth={2}
                    dot={false}
                    activeDot={false}
                    legendType="none"
                    isAnimationActive={false}
                  />
                );
              })
            : null}
          <Line
            type="monotone"
            dataKey="score"
            stroke="transparent"
            strokeWidth={0}
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (cx == null || cy == null || !payload) return null;
              const score = (payload as { score: number }).score;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={healthScoreColor(score)}
                  stroke="#0d0d0d"
                  strokeWidth={1.5}
                />
              );
            }}
            activeDot={(props) => {
              const { cx, cy, payload } = props;
              if (cx == null || cy == null || !payload) return null;
              const score = (payload as { score: number }).score;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={7}
                  fill={healthScoreColor(score)}
                  stroke="#f5f5f5"
                  strokeWidth={2}
                />
              );
            }}
            isAnimationActive={false}
          />
        </LineChart>
        </ResponsiveContainer>
      </div>
      <div
        role="list"
        aria-label="Health score legend"
        className={cn(
          "mt-4 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/10 py-4 font-poppins text-xs",
          isTwinly ? dashboardMuted : "mt-3 border-border py-3 text-muted-foreground",
        )}
      >
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
          Healthy (&gt;70)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Fair (50–70)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-destructive" />
          Needs care (&lt;50)
        </span>
      </div>
    </div>
  );
}

