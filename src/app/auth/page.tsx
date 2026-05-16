import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { dashboardPanel } from "@/components/dashboard/dashboard-theme";
import { PageShell } from "@/components/layout/page-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function AuthFormFallback() {
  return (
    <div className={cn("mx-auto w-full max-w-md space-y-4", dashboardPanel)}>
      <Skeleton className="h-8 w-48 bg-white/10" />
      <Skeleton className="h-64 w-full bg-white/10" />
    </div>
  );
}

export default function AuthPage() {
  return (
    <PageShell
      variant="twinly"
      title="Account"
      description="Sign in or create an account to manage your plant digital twins."
    >
      <Suspense fallback={<AuthFormFallback />}>
        <AuthForm />
      </Suspense>
    </PageShell>
  );
}
