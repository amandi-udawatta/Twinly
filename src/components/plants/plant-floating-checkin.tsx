"use client";

import Link from "next/link";

import type { AppAppearance } from "@/components/dashboard/dashboard-theme";
import { dashboardCtaPrimary } from "@/components/dashboard/dashboard-theme";
import { cn } from "@/lib/utils";

interface PlantFloatingCheckinProps {
  plantId: string;
  appearance?: AppAppearance;
}

export function PlantFloatingCheckin({
  plantId,
  appearance = "default",
}: PlantFloatingCheckinProps) {
  const isTwinly = appearance === "twinly";

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link
        href={`/plants/${plantId}/checkin`}
        className={cn(
          "inline-flex h-12 items-center justify-center rounded-full px-5 font-poppins text-sm font-semibold shadow-lg transition-transform hover:scale-[1.02]",
          isTwinly
            ? dashboardCtaPrimary
            : "border border-primary/30 bg-primary text-primary-foreground shadow-primary/20",
        )}
      >
        Check in
      </Link>
    </div>
  );
}
