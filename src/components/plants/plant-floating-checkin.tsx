"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

interface PlantFloatingCheckinProps {
  plantId: string;
}

export function PlantFloatingCheckin({ plantId }: PlantFloatingCheckinProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link
        href={`/plants/${plantId}/checkin`}
        className={cn(
          "inline-flex h-12 items-center justify-center rounded-full border border-primary/30 bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]",
        )}
      >
        Check in
      </Link>
    </div>
  );
}
