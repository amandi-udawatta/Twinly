import Image from "next/image";

import type { AppAppearance } from "@/components/dashboard/dashboard-theme";
import { dashboardCard, dashboardMuted } from "@/components/dashboard/dashboard-theme";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string;
  date: string;
  urls: string[];
}

interface PlantGalleryProps {
  items: GalleryItem[];
  appearance?: AppAppearance;
}

function groupByDate(items: GalleryItem[]): Array<{ date: string; urls: string[] }> {
  const byDate = new Map<string, string[]>();

  for (const item of items) {
    const existing = byDate.get(item.date) ?? [];
    byDate.set(item.date, [...existing, ...item.urls]);
  }

  return Array.from(byDate.entries()).map(([date, urls]) => ({ date, urls }));
}

export function PlantGallery({
  items,
  appearance = "default",
}: PlantGalleryProps) {
  const isTwinly = appearance === "twinly";

  if (items.length === 0) {
    return (
      <p
        className={cn(
          "font-poppins text-sm",
          isTwinly ? dashboardMuted : "text-muted-foreground",
        )}
      >
        No photos from check-ins yet.
      </p>
    );
  }

  const groups = groupByDate(items);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.date}>
          <h3
            className={cn(
              "mb-3 font-poppins text-sm font-medium",
              isTwinly ? "text-white/60" : "text-muted-foreground",
            )}
          >
            {group.date}
          </h3>
          <div className="-mx-1 overflow-x-auto px-1 pb-2">
            <ul className="flex gap-3">
              {group.urls.map((url, i) => (
                <li
                  key={`${group.date}-${url}-${i}`}
                  className={cn(
                    "relative h-36 w-36 shrink-0 overflow-hidden rounded-lg sm:h-40 sm:w-40",
                    isTwinly
                      ? cn(dashboardCard, "border-white/10")
                      : "border border-border",
                  )}
                >
                  <Image
                    src={url}
                    alt={`Plant photo on ${group.date}`}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}
