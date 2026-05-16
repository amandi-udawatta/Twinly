"use client";

import Link from "next/link";
import { useState } from "react";

import {
  dashboardCtaPrimary,
  dashboardCtaSecondary,
} from "@/components/dashboard/dashboard-theme";
import {
  DailyCheckInDialog,
  type DailyCheckInPlant,
} from "@/components/plants/daily-checkin-dialog";
import { cn } from "@/lib/utils";

interface PlantsFloatingActionsProps {
  plants: DailyCheckInPlant[];
  appearance?: "default" | "twinly";
}

export function PlantsFloatingActions({
  plants,
  appearance = "default",
}: PlantsFloatingActionsProps) {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const isTwinly = appearance === "twinly";

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <Link
          href="/plants/new"
          className={cn(
            "inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-lg transition-transform hover:scale-[1.02]",
            isTwinly
              ? dashboardCtaPrimary
              : "border border-primary/30 bg-primary text-primary-foreground shadow-primary/20",
          )}
        >
          + Register
        </Link>
        <button
          type="button"
          onClick={() => setCheckInOpen(true)}
          className={cn(
            "inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-lg transition-transform hover:scale-[1.02]",
            isTwinly
              ? cn(
                  dashboardCtaSecondary,
                  "border border-white/15 bg-black/50 backdrop-blur-md",
                )
              : "border border-border bg-card text-foreground hover:border-primary/40",
          )}
        >
          Daily check-in
        </button>
      </div>
      <DailyCheckInDialog
        open={checkInOpen}
        plants={plants}
        onClose={() => setCheckInOpen(false)}
      />
    </>
  );
}
