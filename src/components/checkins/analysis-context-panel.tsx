"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { AppAppearance } from "@/components/dashboard/dashboard-theme";
import { dashboardMuted, twinlyInlineCard } from "@/components/dashboard/dashboard-theme";
import type { AnalysisContext } from "@/types/analysis-context";
import { cn } from "@/lib/utils";

interface AnalysisContextPanelProps {
  context: AnalysisContext;
  className?: string;
  appearance?: AppAppearance;
}

export function AnalysisContextPanel({
  context,
  className,
  appearance = "default",
}: AnalysisContextPanelProps) {
  const [open, setOpen] = useState(false);
  const isTwinly = appearance === "twinly";

  return (
    <section
      className={cn(
        "font-poppins text-sm",
        isTwinly
          ? twinlyInlineCard
          : "rounded-lg border border-border bg-card",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span>
          <span className="font-medium">How Twinly analyzed this</span>
          <span
            className={cn(
              "mt-0.5 block font-poppins text-xs",
              isTwinly ? dashboardMuted : "text-muted-foreground",
            )}
          >
            Powered by Gemini 2.5 Flash on Google Cloud Vertex AI
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          className={cn(
            "space-y-3 border-t px-4 py-3 font-poppins",
            isTwinly ? "border-white/10 text-white/75" : "border-border text-muted-foreground",
          )}
        >
          <div>
            <p
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                isTwinly ? "text-[#57B55D]" : "text-foreground",
              )}
            >
              Plant identity
            </p>
            <p className="mt-1 leading-relaxed">{context.plantIdentity}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground">
              Health history (30 days)
            </p>
            <pre className="mt-1 whitespace-pre-wrap font-sans text-xs leading-relaxed">
              {context.historySummary || "No prior check-ins."}
            </pre>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground">
              Weather context
            </p>
            <pre className="mt-1 whitespace-pre-wrap font-sans text-xs leading-relaxed">
              {context.weatherSummary}
            </pre>
          </div>
          <p className="text-xs">
            {context.photoCount} photo{context.photoCount === 1 ? "" : "s"} analyzed
            in one multimodal Vertex call. OpenAI formats the final gardener-friendly
            text only — it never sees your images.
          </p>
        </div>
      ) : null}
    </section>
  );
}
