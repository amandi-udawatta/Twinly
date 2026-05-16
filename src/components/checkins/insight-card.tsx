"use client";

/**
 * Single Gemini insight card (PRD §5): severity border, category, action, confidence.
 */

import { useState } from "react";
import { motion } from "framer-motion";

import type { AppAppearance } from "@/components/dashboard/dashboard-theme";
import {
  dashboardBody,
  dashboardCard,
  dashboardLink,
  dashboardMuted,
} from "@/components/dashboard/dashboard-theme";
import { Badge } from "@/components/ui/badge";
import type { PlantInsight, InsightSeverity } from "@/types/plant-report";
import { cn } from "@/lib/utils";

const SEVERITY_BORDER: Record<InsightSeverity, string> = {
  low: "border-l-primary",
  medium: "border-l-amber-500",
  high: "border-l-orange-500",
  critical: "border-l-destructive",
};

const TWINLY_SEVERITY_BORDER: Record<InsightSeverity, string> = {
  low: "border-l-[#57B55D]",
  medium: "border-l-amber-400",
  high: "border-l-orange-400",
  critical: "border-l-red-400",
};

const COLLAPSED_DETAIL_CHARS = 160;

interface InsightCardProps {
  insight: PlantInsight;
  index: number;
  appearance?: AppAppearance;
}

export function InsightCard({
  insight,
  index,
  appearance = "default",
}: InsightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const confidencePct = Math.round(insight.confidence * 100);
  const detailLong = insight.detail.length > COLLAPSED_DETAIL_CHARS;
  const showToggle = detailLong;
  const detailVisible =
    expanded || !detailLong
      ? insight.detail
      : `${insight.detail.slice(0, COLLAPSED_DETAIL_CHARS).trimEnd()}…`;
  const isTwinly = appearance === "twinly";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className={cn(
        "relative rounded-lg border border-l-[3px] p-4",
        isTwinly
          ? cn(dashboardCard, TWINLY_SEVERITY_BORDER[insight.severity])
          : cn(
              "border-border bg-card",
              SEVERITY_BORDER[insight.severity],
            ),
      )}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge
          variant="secondary"
          className={cn(
            "font-poppins text-xs capitalize",
            isTwinly && "border-white/15 bg-white/10 text-white/85",
          )}
        >
          {insight.category.replace("_", " ")}
        </Badge>
        <span
          className={cn(
            "font-poppins text-xs capitalize",
            isTwinly ? dashboardMuted : "text-muted-foreground",
          )}
        >
          {insight.severity}
        </span>
      </div>
      <h3 className="font-poppins font-semibold text-white">{insight.title}</h3>
      <p
        className={cn(
          "mt-1 font-poppins text-sm leading-relaxed",
          isTwinly ? dashboardBody : "text-muted-foreground",
        )}
      >
        {detailVisible}
      </p>
      {showToggle ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className={cn(
            "mt-2 font-poppins text-xs font-medium",
            isTwinly ? dashboardLink : "text-primary hover:underline",
          )}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}
      <div
        className={cn(
          "mt-3 rounded-md px-3 py-2 font-poppins text-sm leading-relaxed",
          isTwinly ? "bg-black/40 text-white/85" : "bg-muted/50",
        )}
      >
        <span className="font-medium">What to do: </span>
        {insight.action}
      </div>
      <p
        className={cn(
          "mt-2 text-right font-poppins text-xs",
          isTwinly ? dashboardMuted : "text-muted-foreground",
        )}
      >
        {confidencePct}% confidence
      </p>
    </motion.article>
  );
}
