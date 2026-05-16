"use client";

import { useState } from "react";

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
      <p className="text-sm leading-relaxed text-muted-foreground">{visible}</p>
      {isLong ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 text-xs font-medium text-primary hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
}
