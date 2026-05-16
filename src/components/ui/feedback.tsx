/**
 * Shared feedback UI: errors and loading states for forms and async flows.
 */

import { Skeleton } from "@/components/ui/skeleton";

export interface ErrorBannerProps {
  message: string;
}

/** User-facing error message for forms and pages. */
export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {message}
    </p>
  );
}

export interface LoadingStateProps {
  message?: string;
}

/** Centered loading indicator (e.g. while Gemini runs). */
export function LoadingState({
  message = "Loading…",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="flex gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-3 rounded-full" />
      </div>
      <p className="animate-pulse text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
