"use client";

/**
 * Email/password sign-in and sign-up with optional city for weather context.
 */

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { signIn, signUp } from "@/app/auth/actions";
import { authInitialState, type AuthActionState } from "@/app/auth/types";
import { ErrorBanner } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function AuthMessages({ state }: { state: AuthActionState }) {
  if (state.error) {
    return <ErrorBanner message={state.error} />;
  }
  if (state.success) {
    return (
      <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
        {state.success}
      </p>
    );
  }
  return null;
}

export function AuthForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";

  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    authInitialState,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    authInitialState,
  );

  return (
    <Card className="mx-auto w-full max-w-md border-border/80">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Welcome to Twinly</CardTitle>
        <CardDescription>
          Sign in or create an account to track your plants.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-6 space-y-4">
            <AuthMessages state={signInState} />
            <form action={signInAction} className="space-y-4">
              <input type="hidden" name="next" value={next} />
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
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
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm password</Label>
                <Input
                  id="signup-confirm"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-city">Your city (for weather)</Label>
                <Input
                  id="signup-city"
                  name="locationCity"
                  type="text"
                  placeholder="e.g. Colombo"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={signUpPending}
              >
                {signUpPending ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
