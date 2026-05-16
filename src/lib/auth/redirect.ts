/**
 * Safe redirect target from ?next= query param (open-redirect protection).
 */

import { DEFAULT_AUTH_REDIRECT } from "@/lib/auth/routes";

export function getSafeRedirectPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }
  return next;
}
