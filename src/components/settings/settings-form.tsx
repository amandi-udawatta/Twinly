"use client";

import { useActionState } from "react";

import type { AuthActionState } from "@/app/auth/types";
import { ErrorBanner } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = { error: null, success: null };

interface SettingsFormProps {
  action: (
    prev: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
  initialCity: string;
}

export function SettingsForm({ action, initialCity }: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-heading text-lg font-semibold">Location</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Used for WeatherAPI during check-ins and on your dashboard.
      </p>
      {state.error ? (
        <div className="mt-4">
          <ErrorBanner message={state.error} />
        </div>
      ) : null}
      {state.success ? (
        <p className="mt-4 text-sm text-primary" role="status">
          {state.success}
        </p>
      ) : null}
      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="locationCity">Your city</Label>
          <Input
            id="locationCity"
            name="locationCity"
            defaultValue={initialCity}
            placeholder="e.g. Colombo"
            required
            className="bg-[#0D0D0D]"
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save location"}
        </Button>
      </form>
    </section>
  );
}
