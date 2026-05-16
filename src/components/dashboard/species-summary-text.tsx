"use client";

import { useState } from "react";

import { dashboardBody, dashboardLink } from "@/components/dashboard/dashboard-theme";
import { cn } from "@/lib/utils";

const COLLAPSED_CHARS = 160;

interface SpeciesSummaryTextProps {
  summary: string;
}

export function SpeciesSummaryText({ summary }: SpeciesSummaryTextProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = summary.length > COLLAPSED_CHARS;
  const visible =
    expanded || !isLong
      ? summary
      : `${summary.slice(0, COLLAPSED_CHARS).trimEnd()}…`;

  return (
    <div className="mt-2 flex-1">
      <p className={cn(dashboardBody, "text-white/70")}>{visible}</p>
      {isLong ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className={cn(dashboardLink, "mt-2 text-xs font-medium")}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
}
