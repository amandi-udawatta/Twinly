import Link from "next/link";

import { dashboardMuted, dashboardPanel } from "@/components/dashboard/dashboard-theme";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LocationWeatherBannerProps {
  show: boolean;
  variant?: "default" | "twinly";
}

export function LocationWeatherBanner({
  show,
  variant = "default",
}: LocationWeatherBannerProps) {
  if (!show) {
    return null;
  }

  const isTwinly = variant === "twinly";

  return (
    <div
      role="status"
      className={cn(
        "mb-6 rounded-2xl px-4 py-3 text-sm",
        isTwinly
          ? cn(
              dashboardPanel,
              "border-[#57B55D]/30 bg-[#57B55D]/10 py-4",
            )
          : "border border-primary/30 bg-primary/10 text-foreground",
      )}
    >
      <p
        className={
          isTwinly
            ? "font-poppins text-lg font-semibold text-[#57B55D]"
            : "font-medium"
        }
      >
        Add your city for weather-aware check-ins
      </p>
      <p className={cn("mt-1", isTwinly ? dashboardMuted : "text-muted-foreground")}>
        Twinly uses local forecast data to improve plant health analysis.
      </p>
      <Link
        href="/settings"
        className={cn(
          isTwinly
            ? cn(
                "mt-3 inline-flex rounded-full bg-[#9CA3AF] px-6 py-2.5 font-poppins text-sm font-medium text-white shadow-md transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]",
              )
            : buttonVariants({ variant: "outline", size: "sm" }),
          "mt-3",
        )}
      >
        Set location in settings
      </Link>
    </div>
  );
}
