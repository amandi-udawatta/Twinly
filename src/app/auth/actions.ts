"use server";

/**
 * Supabase Auth server actions for email/password flows.
 * Session cookies are managed by @supabase/ssr via the server client.
 */

import { redirect } from "next/navigation";

import { getSafeRedirectPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";
import type { AuthActionState } from "@/app/auth/types";

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const locationCity = String(formData.get("locationCity") ?? "").trim();
  const next = String(formData.get("next") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required.", success: null };
  }

  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters.",
      success: null,
    };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", success: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: email.split("@")[0],
      },
    },
  });

  if (error) {
    return { error: error.message, success: null };
  }

  // Optional: save location for WeatherAPI during check-ins
  if (data.user && locationCity) {
    await supabase
      .from("users")
      .update({ location_city: locationCity })
      .eq("id", data.user.id);
  }

  // If email confirmation is disabled, session exists — go to app
  if (data.session) {
    redirect(getSafeRedirectPath(next || null));
  }

  return {
    error: null,
    success:
      "Account created. Check your email to confirm your address, then sign in.",
  };
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required.", success: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message, success: null };
  }

  redirect(getSafeRedirectPath(next || null));
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updateLocationCity(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const locationCity = String(formData.get("locationCity") ?? "").trim();

  if (!locationCity) {
    return { error: "City is required.", success: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in.", success: null };
  }

  const { error } = await supabase
    .from("users")
    .update({ location_city: locationCity })
    .eq("id", user.id);

  if (error) {
    return { error: error.message, success: null };
  }

  return { error: null, success: "Location saved." };
}
