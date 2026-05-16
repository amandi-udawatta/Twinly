/**
 * Route helpers for auth middleware and redirects.
 * Protected routes require a Supabase session (see middleware.ts).
 */

/** Paths that require the user to be signed in. */
export const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/plants",
  "/settings",
] as const;

/** True when pathname is a protected app route (not landing or public scan redirect). */
export function isProtectedPath(pathname: string): boolean {
  if (pathname === "/plants") return true;
  if (pathname === "/plants/new") return true;
  if (pathname.startsWith("/dashboard")) return true;
  if (pathname.startsWith("/settings")) return true;
  // /plants/[id] and /plants/[id]/checkin
  if (/^\/plants\/[^/]+/.test(pathname)) return true;
  return false;
}

/** Auth page — signed-in users are redirected away. */
export const AUTH_PATH = "/auth";

/** Default redirect after successful sign-in. */
export const DEFAULT_AUTH_REDIRECT = "/dashboard";
