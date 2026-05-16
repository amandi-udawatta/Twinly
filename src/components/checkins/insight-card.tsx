"use client";

/**
 * Single Gemini insight card (PRD §5): severity border, category, action, confidence.
 */

import { useState } from "react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import type { PlantInsight, InsightSeverity } from "@/types/plant-report";
import { cn } from "@/lib/utils";

const SEVERITY_BORDER: Record<InsightSeverity, string> = {
  low: "border-l-primary",
  medium: "border-l-amber-500",
  high: "border-l-orange-500",
  critical: "border-l-destructive",
};

const COLLAPSED_DETAIL_CHARS = 160;

interface InsightCardProps {
  insight: PlantInsight;
  index: number;
}

export function InsightCard({ insight, index }: InsightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const confidencePct = Math.round(insight.confidence * 100);
  const detailLong = insight.detail.length > COLLAPSED_DETAIL_CHARS;
  const showToggle = detailLong;
  const detailVisible =
    expanded || !detailLong
      ? insight.detail
      : `${insight.detail.slice(0, COLLAPSED_DETAIL_CHARS).trimEnd()}…`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className={cn(
        "relative rounded-lg border border-border bg-card p-4 border-l-[3px]",
        SEVERITY_BORDER[insight.severity],
      )}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {insight.category.replace("_", " ")}
        </Badge>
        <span className="text-xs capitalize text-muted-foreground">
          {insight.severity}
        </span>
      </div>
      <h3 className="font-semibold">{insight.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {detailVisible}
      </p>
      {showToggle ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 text-xs font-medium text-primary hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}
      <div className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-sm leading-relaxed">
        <span className="font-medium">What to do: </span>
        {insight.action}
      </div>
      <p className="mt-2 text-right text-xs text-muted-foreground">
        {confidencePct}% confidence
      </p>
    </motion.article>
  );
}
