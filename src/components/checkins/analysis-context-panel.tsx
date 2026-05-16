"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { AnalysisContext } from "@/types/analysis-context";
import { cn } from "@/lib/utils";

interface AnalysisContextPanelProps {
  context: AnalysisContext;
  className?: string;
}

export function AnalysisContextPanel({
  context,
  className,
}: AnalysisContextPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-card text-sm",
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
          <span className="mt-0.5 block text-xs text-muted-foreground">
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
        <div className="space-y-3 border-t border-border px-4 py-3 text-muted-foreground">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground">
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
