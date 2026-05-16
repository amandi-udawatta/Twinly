/**
 * GET /api/weather?city=Colombo
 * Proxy to WeatherAPI for client or debugging (server uses weatherService directly).
 */

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { fetchWeatherForCity } from "@/services/weatherService";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let city = searchParams.get("city")?.trim();

    if (!city) {
      const { data: profile } = await supabase
        .from("users")
        .select("location_city")
        .eq("id", user.id)
        .single();
      city = profile?.location_city ?? undefined;
    }

    if (!city) {
      return NextResponse.json(
        { error: "City is required. Set location on your profile." },
        { status: 400 },
      );
    }

    const weather = await fetchWeatherForCity(city);
    return NextResponse.json(weather);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Weather fetch failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
