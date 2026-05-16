"use client";

import Link from "next/link";
import { useState } from "react";

import {
  DailyCheckInDialog,
  type DailyCheckInPlant,
} from "@/components/plants/daily-checkin-dialog";
import { cn } from "@/lib/utils";

interface PlantsFloatingActionsProps {
  plants: DailyCheckInPlant[];
}

export function PlantsFloatingActions({ plants }: PlantsFloatingActionsProps) {
  const [checkInOpen, setCheckInOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <Link
          href="/plants/new"
          className={cn(
            "inline-flex h-12 items-center justify-center rounded-full border border-primary/30 bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]",
          )}
        >
          + Register
        </Link>
        <button
          type="button"
          onClick={() => setCheckInOpen(true)}
          className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground shadow-lg transition-transform hover:border-primary/40 hover:scale-[1.02]"
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
