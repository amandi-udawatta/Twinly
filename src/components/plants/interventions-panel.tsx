"use client";

import { useState, useTransition } from "react";

import {
  createIntervention,
  deleteIntervention,
} from "@/app/plants/[id]/interventions/actions";
import { INTERVENTION_TYPES } from "@/lib/intervention-types";
import { ErrorBanner } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InterventionRow } from "@/lib/data/interventions";

interface InterventionsPanelProps {
  plantId: string;
  interventions: InterventionRow[];
}

export function InterventionsPanel({
  plantId,
  interventions,
}: InterventionsPanelProps) {
  const [type, setType] = useState<string>(INTERVENTION_TYPES[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onAdd = () => {
    setError(null);
    startTransition(async () => {
      const result = await createIntervention(plantId, type, description);
      if (result.error) {
        setError(result.error);
        return;
      }
      setDescription("");
    });
  };

  const onDelete = (id: string) => {
    setError(null);
    startTransition(async () => {
      const result = await deleteIntervention(plantId, id);
      if (result.error) setError(result.error);
    });
  };

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-medium">Log an intervention</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Record watering, pruning, and other care you performed.
        </p>
        <div className="mt-4 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="intervention-type">Type</Label>
            <select
              id="intervention-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={pending}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm capitalize"
            >
              {INTERVENTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="intervention-note">Notes (optional)</Label>
            <Textarea
              id="intervention-note"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              disabled={pending}
              placeholder="e.g. diluted liquid feed, 500ml water"
            />
          </div>
          {error ? <ErrorBanner message={error} /> : null}
          <Button type="button" onClick={onAdd} disabled={pending}>
            Add intervention
          </Button>
        </div>
      </div>

      {interventions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No interventions logged yet.</p>
      ) : (
        <ul className="space-y-2">
          {interventions.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-border px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium capitalize">
                  {item.type.replace("_", " ")}
                </p>
                {item.description ? (
                  <p className="mt-1 text-muted-foreground">{item.description}</p>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                disabled={pending}
                onClick={() => onDelete(item.id)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
