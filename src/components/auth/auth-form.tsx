"use client";

/**
 * Email/password sign-in and sign-up with optional city for weather context.
 */

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { signIn, signUp } from "@/app/auth/actions";
import { authInitialState, type AuthActionState } from "@/app/auth/types";
import {
  dashboardCtaPrimary,
  dashboardInput,
  dashboardMuted,
  dashboardPanel,
  dashboardPanelTitle,
  twinlyLabel,
  twinlyTabTrigger,
  twinlyTabsList,
} from "@/components/dashboard/dashboard-theme";
import { ErrorBanner } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function AuthMessages({ state }: { state: AuthActionState }) {
  if (state.error) {
    return <ErrorBanner message={state.error} />;
  }
  if (state.success) {
    return (
      <p className="rounded-2xl border border-[#57B55D]/40 bg-[#57B55D]/10 px-3 py-2 font-poppins text-sm text-[#57B55D]">
        {state.success}
      </p>
    );
  }
  return null;
}

export function AuthForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const defaultTab =
    searchParams.get("tab") === "signup" ? "signup" : "signin";

  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    authInitialState,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    authInitialState,
  );

  return (
    <div
      className={cn("mx-auto w-full max-w-md font-poppins", dashboardPanel)}
    >
      <h2 className={dashboardPanelTitle}>Welcome to Twinly</h2>
      <p className={cn("mt-2", dashboardMuted)}>
        Sign in or create an account to track your plants.
      </p>

      <Tabs defaultValue={defaultTab} key={defaultTab} className="mt-6">
        <TabsList className={twinlyTabsList}>
          <TabsTrigger value="signin" className={twinlyTabTrigger}>
            Sign in
          </TabsTrigger>
          <TabsTrigger value="signup" className={twinlyTabTrigger}>
            Sign up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="mt-6 space-y-4">
          <AuthMessages state={signInState} />
          <form action={signInAction} className="space-y-4">
            <input type="hidden" name="next" value={next} />
            <div className="space-y-2">
              <Label htmlFor="signin-email" className={twinlyLabel}>
                Email
              </Label>
              <Input
                id="signin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className={dashboardInput}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password" className={twinlyLabel}>
                Password
              </Label>
              <Input
                id="signin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                className={dashboardInput}
              />
            </div>
            <Button
              type="submit"
              className={cn("h-auto w-full", dashboardCtaPrimary)}
              disabled={signInPending}
            >
              {signInPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup" className="mt-6 space-y-4">
          <AuthMessages state={signUpState} />
          <form action={signUpAction} className="space-y-4">
            <input type="hidden" name="next" value={next} />
            <div className="space-y-2">
              <Label htmlFor="signup-email" className={twinlyLabel}>
                Email
              </Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className={dashboardInput}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className={twinlyLabel}>
                Password
              </Label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className={dashboardInput}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-confirm" className={twinlyLabel}>
                Confirm password
              </Label>
              <Input
                id="signup-confirm"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className={dashboardInput}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-city" className={twinlyLabel}>
                Your city (for weather)
              </Label>
              <Input
                id="signup-city"
                name="locationCity"
                type="text"
                placeholder="e.g. Colombo"
                className={dashboardInput}
              />
            </div>
            <Button
              type="submit"
              className={cn("h-auto w-full", dashboardCtaPrimary)}
              disabled={signUpPending}
            >
              {signUpPending ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
