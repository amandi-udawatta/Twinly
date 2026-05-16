import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LocationWeatherBannerProps {
  show: boolean;
}

export function LocationWeatherBanner({ show }: LocationWeatherBannerProps) {
  if (!show) {
    return null;
  }

  return (
    <div
      role="status"
      className="mb-6 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground"
    >
      <p className="font-medium">Add your city for weather-aware check-ins</p>
      <p className="mt-1 text-muted-foreground">
        Twinly uses local forecast data to improve plant health analysis.
      </p>
      <Link
        href="/settings"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-3")}
      >
        Set location in settings
      </Link>
    </div>
  );
}
