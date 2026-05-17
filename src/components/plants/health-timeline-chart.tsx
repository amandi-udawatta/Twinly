"use client";

/**
 * Recharts line chart of health scores over check-ins.
 * Uses a numeric x-index so multiple Line series do not duplicate axis ticks/tooltips.
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

type IndexedPoint = HealthTimelinePoint & { index: number };

function healthScoreColor(score: number): string {
  if (score > 70) return "#4ade80";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

function ChartTooltip({
  active,
  payload,
  isTwinly,
}: {
  active?: boolean;
  payload?: Array<{ payload?: IndexedPoint; value?: number }>;
  isTwinly: boolean;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;
  if (!point) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-xl px-3 py-2 font-poppins text-xs shadow-md",
        isTwinly
          ? "border border-white/15 bg-black/85 text-white"
          : "border border-border bg-card text-foreground",
      )}
    >
      <p className={isTwinly ? "text-white/70" : "text-muted-foreground"}>
        {point.date}
      </p>
      <p className="mt-1 font-medium">Score: {point.score}</p>
    </div>
  );
}

export function HealthTimelineChart({
  data,
  appearance = "default",
}: HealthTimelineChartProps) {
  const isTwinly = appearance === "twinly";
  const tickFill = isTwinly ? "rgba(255,255,255,0.55)" : "var(--muted-foreground)";
  const gridStroke = isTwinly ? "rgba(255,255,255,0.12)" : undefined;

  const indexedData: IndexedPoint[] = data.map((point, index) => ({
    ...point,
    index,
  }));

  if (indexedData.length === 0) {
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
          <LineChart
            data={indexedData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className={isTwinly ? undefined : "stroke-border"}
              stroke={gridStroke}
            />
            <XAxis
              dataKey="index"
              type="number"
              domain={[0, Math.max(0, indexedData.length - 1)]}
              ticks={indexedData.map((p) => p.index)}
              tickFormatter={(index) =>
                indexedData[Number(index)]?.date ?? ""
              }
              tick={{ fill: tickFill, fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: tickFill, fontSize: 11 }}
              tickLine={false}
            />
            <Tooltip
              content={<ChartTooltip isTwinly={isTwinly} />}
            />
            {indexedData.length > 1
              ? indexedData.slice(0, -1).map((point, i) => {
                  const next = indexedData[i + 1];
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
                      tooltipType="none"
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
                const score = (payload as IndexedPoint).score;
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
                const score = (payload as IndexedPoint).score;
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
