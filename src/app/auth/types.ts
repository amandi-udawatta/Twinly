/**
 * Shared auth form state types (safe to import from client components).
 */

export interface AuthActionState {
  error: string | null;
  success: string | null;
}

export const authInitialState: AuthActionState = {
  error: null,
  success: null,
};
