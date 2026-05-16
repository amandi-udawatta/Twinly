"use client";

import { useActionState } from "react";

import type { AuthActionState } from "@/app/auth/types";
import {
  dashboardCtaPrimary,
  dashboardInput,
  dashboardMuted,
  dashboardPanel,
  dashboardPanelTitle,
  twinlyLabel,
} from "@/components/dashboard/dashboard-theme";
import { ErrorBanner } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
    <section className={dashboardPanel}>
      <h2 className={dashboardPanelTitle}>Location</h2>
      <p className={cn("mt-2", dashboardMuted)}>
        Used for WeatherAPI during check-ins and on your dashboard.
      </p>
      {state.error ? (
        <div className="mt-4">
          <ErrorBanner message={state.error} />
        </div>
      ) : null}
      {state.success ? (
        <p
          className="mt-4 rounded-2xl border border-[#57B55D]/40 bg-[#57B55D]/10 px-3 py-2 font-poppins text-sm text-[#57B55D]"
          role="status"
        >
          {state.success}
        </p>
      ) : null}
      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="locationCity" className={twinlyLabel}>
            Your city
          </Label>
          <Input
            id="locationCity"
            name="locationCity"
            defaultValue={initialCity}
            placeholder="e.g. Colombo"
            required
            className={dashboardInput}
          />
        </div>
        <Button
          type="submit"
          disabled={pending}
          className={cn("h-auto", dashboardCtaPrimary)}
        >
          {pending ? "Saving…" : "Save location"}
        </Button>
      </form>
    </section>
  );
}
