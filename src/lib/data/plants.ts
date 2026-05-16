/**
 * Server-side Supabase queries for plants, check-ins, and analysis.
 */

import { createClient } from "@/lib/supabase/server";
import {
  fetchWeatherForCity,
  type WeatherSnapshot,
} from "@/services/weatherService";
import type { PlantInsight } from "@/types/plant-report";

export interface PlantWithLatestAnalysis {
  id: string;
  nickname: string | null;
  species: string | null;
  approximate_age: number | null;
  history_note: string | null;
  image_url: string | null;
  created_at: string;
  latest_health_score: number | null;
  latest_urgency_score: number | null;
  last_checkin_at: string | null;
}

export async function getPlantsForUser(
  userId: string,
): Promise<PlantWithLatestAnalysis[]> {
  const supabase = await createClient();

  const { data: plants, error } = await supabase
    .from("plants")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!plants?.length) return [];

  const plantIds = plants.map((p) => p.id);

  const { data: analyses } = await supabase
    .from("analysis_results")
    .select("plant_id, health_score, urgency_score, created_at")
    .in("plant_id", plantIds)
    .order("created_at", { ascending: false });

  const latestByPlant = new Map<
    string,
    { health_score: number; urgency_score: number; created_at: string }
  >();
  for (const row of analyses ?? []) {
    if (!latestByPlant.has(row.plant_id)) {
      latestByPlant.set(row.plant_id, {
        health_score: row.health_score,
        urgency_score: row.urgency_score,
        created_at: row.created_at,
      });
    }
  }

  return plants.map((p) => {
    const latest = latestByPlant.get(p.id);
    return {
      ...p,
      latest_health_score: latest?.health_score ?? null,
      latest_urgency_score: latest?.urgency_score ?? null,
      last_checkin_at: latest?.created_at ?? null,
    };
  });
}

export async function getPlantById(plantId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("id", plantId)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getPlantAnalysisHistory(plantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("analysis_results")
    .select("*")
    .eq("plant_id", plantId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCheckinsWithPhotos(plantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("checkins")
    .select("*")
    .eq("plant_id", plantId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLatestAnalysisForPlant(plantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("analysis_results")
    .select("*")
    .eq("plant_id", plantId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export function parseInsights(raw: unknown): PlantInsight[] {
  if (!Array.isArray(raw)) return [];
  return raw as PlantInsight[];
}

export interface GardenHealthPoint {
  id: string;
  date: string;
  score: number;
}

export interface SpeciesGardenSummary {
  speciesKey: string;
  species: string;
  plantCount: number;
  imageUrl: string | null;
  avgHealthThisWeek: number | null;
  checkinsThisWeek: number;
  summary: string;
  primaryPlantId: string;
}

/** One card per species: image, weekly check-ins, and short summary. */
export async function getGardenSpeciesSummaries(
  userId: string,
): Promise<SpeciesGardenSummary[]> {
  const plants = await getPlantsForUser(userId);
  if (!plants.length) return [];

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const plantIds = plants.map((p) => p.id);
  const supabase = await createClient();

  const { data: analyses, error: analysesError } = await supabase
    .from("analysis_results")
    .select("plant_id, health_score, health_trend, changes_summary, created_at")
    .in("plant_id", plantIds)
    .gte("created_at", weekAgo.toISOString())
    .order("created_at", { ascending: false });

  if (analysesError) throw new Error(analysesError.message);

  const { data: checkins } = await supabase
    .from("checkins")
    .select("plant_id, photo_urls")
    .in("plant_id", plantIds)
    .order("created_at", { ascending: false });

  const photoByPlant = new Map<string, string>();
  for (const row of checkins ?? []) {
    if (!photoByPlant.has(row.plant_id) && row.photo_urls?.[0]) {
      photoByPlant.set(row.plant_id, row.photo_urls[0]);
    }
  }

  const bySpecies = new Map<string, PlantWithLatestAnalysis[]>();
  for (const plant of plants) {
    const key = plant.species?.trim().toLowerCase() || "unknown";
    const group = bySpecies.get(key) ?? [];
    group.push(plant);
    bySpecies.set(key, group);
  }

  return Array.from(bySpecies.entries())
    .map(([speciesKey, group]) => {
      const displaySpecies =
        group[0].species?.trim() || "Unknown species";
      const groupIds = new Set(group.map((p) => p.id));
      const weekAnalyses = (analyses ?? []).filter((row) =>
        groupIds.has(row.plant_id),
      );

      const imageUrl =
        group.find((p) => p.image_url)?.image_url ??
        group.map((p) => photoByPlant.get(p.id)).find(Boolean) ??
        null;

      const scores = weekAnalyses.map((row) => row.health_score);
      const avgHealth =
        scores.length > 0
          ? Math.round(
              scores.reduce((sum, value) => sum + value, 0) / scores.length,
            )
          : null;

      const latest = weekAnalyses[0];
      const plantLabel =
        group.length === 1 ? "plant" : "plants";
      let summary: string;

      if (weekAnalyses.length === 0) {
        summary = `No check-ins this week across ${group.length} ${displaySpecies} ${plantLabel}.`;
      } else {
        const parts: string[] = [];
        if (avgHealth !== null) {
          parts.push(`Average health ${avgHealth} across ${weekAnalyses.length} check-in${weekAnalyses.length === 1 ? "" : "s"}.`);
        }
        if (latest?.health_trend) {
          parts.push(`Latest trend: ${latest.health_trend}.`);
        }
        const change = latest?.changes_summary?.trim();
        if (change) {
          parts.push(change);
        }
        summary = parts.join(" ");
      }

      return {
        speciesKey,
        species: displaySpecies,
        plantCount: group.length,
        imageUrl,
        avgHealthThisWeek: avgHealth,
        checkinsThisWeek: weekAnalyses.length,
        summary,
        primaryPlantId: group[0].id,
      };
    })
    .sort((a, b) => a.species.localeCompare(b.species));
}

/** Average garden health score per check-in day (all plants). */
export async function getGardenHealthTimeline(
  userId: string,
): Promise<GardenHealthPoint[]> {
  const supabase = await createClient();

  const { data: plants } = await supabase
    .from("plants")
    .select("id")
    .eq("user_id", userId);

  if (!plants?.length) return [];

  const plantIds = plants.map((p) => p.id);

  const { data: results, error } = await supabase
    .from("analysis_results")
    .select("health_score, created_at")
    .in("plant_id", plantIds)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const byDate = new Map<string, number[]>();
  for (const row of results ?? []) {
    const date = row.created_at.slice(0, 10);
    const bucket = byDate.get(date) ?? [];
    bucket.push(row.health_score);
    byDate.set(date, bucket);
  }

  return Array.from(byDate.entries())
    .map(([date, scores]) => ({
      id: `garden-${date}`,
      date,
      score: Math.round(
        scores.reduce((sum, value) => sum + value, 0) / scores.length,
      ),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export interface EnvironmentalInsight {
  id: string;
  plantName: string;
  text: string;
  /** ISO timestamp for display and uniqueness across same-day check-ins. */
  createdAt: string;
}

/** Recent weather-impact notes across the garden for the dashboard. */
export async function getRecentEnvironmentalInsights(
  userId: string,
  limit = 5,
): Promise<EnvironmentalInsight[]> {
  const supabase = await createClient();

  const { data: plants } = await supabase
    .from("plants")
    .select("id, nickname, species")
    .eq("user_id", userId);

  if (!plants?.length) return [];

  const plantIds = plants.map((p) => p.id);
  const nameById = new Map(
    plants.map((p) => [
      p.id,
      p.nickname || p.species || "Unnamed plant",
    ]),
  );

  const { data: results, error } = await supabase
    .from("analysis_results")
    .select("id, plant_id, weather_impact, created_at")
    .in("plant_id", plantIds)
    .not("weather_impact", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (results ?? [])
    .filter((row) => row.weather_impact?.trim())
    .map((row) => ({
      id: row.id,
      plantName: nameById.get(row.plant_id) ?? "Plant",
      text: row.weather_impact as string,
      createdAt: row.created_at,
    }));
}

export async function getUserLocationCity(
  userId: string,
): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("location_city")
    .eq("id", userId)
    .single();

  return data?.location_city ?? null;
}

export interface UserWeatherContext {
  locationCity: string | null;
  weather: WeatherSnapshot | null;
  error: string | null;
}

/** Live WeatherAPI data for the signed-in user's saved city. */
export async function getUserWeatherContext(
  userId: string,
): Promise<UserWeatherContext> {
  const locationCity = await getUserLocationCity(userId);
  if (!locationCity) {
    return { locationCity: null, weather: null, error: null };
  }

  try {
    const weather = await fetchWeatherForCity(locationCity);
    return { locationCity, weather, error: null };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Weather data is unavailable right now.";
    return { locationCity, weather: null, error: message };
  }
}

export async function getCheckInHistorySummaries(
  plantId: string,
  days = 30,
): Promise<string> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: checkins } = await supabase
    .from("checkins")
    .select("id, created_at")
    .eq("plant_id", plantId)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  if (!checkins?.length) return "";

  const ids = checkins.map((c) => c.id);
  const { data: results } = await supabase
    .from("analysis_results")
    .select("checkin_id, health_score, changes_summary, created_at")
    .in("checkin_id", ids);

  const byCheckin = new Map(
    (results ?? []).map((r) => [r.checkin_id, r]),
  );

  return checkins
    .map((c) => {
      const r = byCheckin.get(c.id);
      if (!r) return null;
      return `${c.created_at.slice(0, 10)}: score ${r.health_score}, ${r.changes_summary ?? "no summary"}`;
    })
    .filter(Boolean)
    .join("\n");
}
