import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { PageShell } from "@/components/layout/page-shell";
import { Skeleton } from "@/components/ui/skeleton";

function AuthFormFallback() {
  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function AuthPage() {
  return (
    <PageShell
      title="Account"
      description="Sign in or create an account to manage your plant digital twins."
    >
      <Suspense fallback={<AuthFormFallback />}>
        <AuthForm />
      </Suspense>
    </PageShell>
  );
}
