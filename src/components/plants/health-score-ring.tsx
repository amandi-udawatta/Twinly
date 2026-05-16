"use client";

/**
 * Animated SVG health score ring (PRD: Apple Watch–style fill on load).
 */

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface HealthScoreRingProps {
  score: number;
  size?: number;
  className?: string;
}

function scoreColor(score: number): string {
  if (score >= 70) return "#4ade80";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

export function HealthScoreRing({
  score,
  size = 120,
  className,
}: HealthScoreRingProps) {
  const [animated, setAnimated] = useState(0);
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, score));
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimated(clamped));
    return () => cancelAnimationFrame(t);
  }, [clamped]);

  return (
    <div className={cn("relative inline-flex", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor(clamped)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-heading text-2xl font-semibold"
        style={{ color: scoreColor(clamped) }}
      >
        {Math.round(clamped)}
      </span>
    </div>
  );
}
