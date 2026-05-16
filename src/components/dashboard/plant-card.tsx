import Image from "next/image";
import Link from "next/link";

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
}

export function PlantCard({ plant }: PlantCardProps) {
  const name = plant.nickname || plant.species || "Unnamed plant";
  const score = plant.latest_health_score;
  const urgent = (plant.latest_urgency_score ?? 0) > 7;

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
            <Badge
              variant="destructive"
              className="absolute right-2 top-2"
            >
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
