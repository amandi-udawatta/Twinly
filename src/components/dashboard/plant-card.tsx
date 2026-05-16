import Image from "next/image";
import Link from "next/link";

import {
  dashboardCard,
  dashboardHealthTone,
  dashboardMuted,
} from "@/components/dashboard/dashboard-theme";
import type { PlantWithLatestAnalysis } from "@/lib/data/plants";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function healthColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 70) return "text-primary";
  if (score >= 40) return "text-amber-500";
  return "text-destructive";
}

function daysSince(iso: string | null): string {
  if (!iso) return "Never checked in";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Checked in today";
  if (days === 1) return "1 day since check-in";
  return `${days} days since check-in`;
}

interface PlantCardProps {
  plant: PlantWithLatestAnalysis;
  appearance?: "default" | "twinly";
}

export function PlantCard({ plant, appearance = "default" }: PlantCardProps) {
  const name = plant.nickname || plant.species || "Unnamed plant";
  const score = plant.latest_health_score;
  const urgent = (plant.latest_urgency_score ?? 0) > 7;
  const isTwinly = appearance === "twinly";

  if (isTwinly) {
    return (
      <Link href={`/plants/${plant.id}`} className="group block h-full">
        <article
          className={cn(
            dashboardCard,
            "h-full transition-colors hover:border-[#57B55D]/40",
          )}
        >
          <div className="relative aspect-[4/3] bg-black/50">
            {plant.image_url ? (
              <Image
                src={plant.image_url}
                alt={name}
                fill
                className="object-cover transition-transform group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div
                className={cn(
                  dashboardMuted,
                  "flex h-full items-center justify-center text-sm",
                )}
              >
                No photo
              </div>
            )}
            {urgent ? (
              <span className="absolute right-2 top-2 rounded-full bg-red-500/90 px-2.5 py-0.5 font-poppins text-xs font-medium text-white">
                Needs attention
              </span>
            ) : null}
          </div>
          <div className="space-y-1 p-4">
            <h3 className="font-poppins text-lg font-semibold text-white transition-colors group-hover:text-[#57B55D]">
              {name}
            </h3>
            <p className={dashboardMuted}>
              {plant.species ?? "Species unknown"}
            </p>
            <div className="flex items-center justify-between pt-2 text-sm">
              <span
                className={cn(
                  "font-poppins font-semibold",
                  dashboardHealthTone(score),
                )}
              >
                {score !== null ? `Health ${score}` : "No score yet"}
              </span>
              <span className={dashboardMuted}>
                {daysSince(plant.last_checkin_at)}
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/plants/${plant.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-colors hover:border-primary/40">
        <div className="relative aspect-[4/3] bg-muted">
          {plant.image_url ? (
            <Image
              src={plant.image_url}
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No photo
            </div>
          )}
          {urgent ? (
            <Badge variant="destructive" className="absolute right-2 top-2">
              Needs attention
            </Badge>
          ) : null}
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-lg">{name}</CardTitle>
          <CardDescription>{plant.species ?? "Species unknown"}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm">
          <span className={cn("font-semibold", healthColor(score))}>
            {score !== null ? `Health ${score}` : "No score yet"}
          </span>
          <span className="text-muted-foreground">
            {daysSince(plant.last_checkin_at)}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
