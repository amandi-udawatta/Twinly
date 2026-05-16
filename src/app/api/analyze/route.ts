/**
 * POST /api/analyze
 * Dual-engine check-in pipeline:
 * 1. Vertex AI (gemini-2.5-flash) → raw PlantReport
 * 2. OpenAI (gpt-4o-mini) → final PlantReport → Supabase
 */

import { NextResponse } from "next/server";

import {
  getCheckInHistorySummaries,
  getPlantById,
} from "@/lib/data/plants";
import { isUploadBlob } from "@/lib/upload-file";
import { createClient } from "@/lib/supabase/server";
import { formatAgeDays } from "@/lib/plant-age";
import {
  clampHealthScore,
  clampUrgencyScore,
  normalizePlantReport,
  normalizeRawPlantReport,
} from "@/lib/plant-report-scores";
import { analyzePlantCheckIn } from "@/services/geminiService";
import { formatPlantReportFromRaw } from "@/services/openaiService";
import {
  fetchWeatherForCity,
  formatWeatherForPrompt,
} from "@/services/weatherService";
import { uploadPlantPhotos } from "@/services/storageService";
import type { AnalysisContext } from "@/types/analysis-context";
import type { Json } from "@/types/database";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const plantId = String(formData.get("plantId") ?? "");
    const userNote = String(formData.get("userNote") ?? "").trim() || null;

    if (!plantId) {
      return NextResponse.json({ error: "plantId is required." }, { status: 400 });
    }

    const plant = await getPlantById(plantId, user.id);
    if (!plant) {
      return NextResponse.json({ error: "Plant not found." }, { status: 404 });
    }

    const files: Blob[] = [];
    for (const entry of formData.getAll("photos")) {
      if (isUploadBlob(entry)) {
        files.push(entry);
      }
    }

    if (files.length === 0 || files.length > 4) {
      return NextResponse.json(
        { error: "Provide 1 to 4 photos." },
        { status: 400 },
      );
    }

    const photoUrls = await uploadPlantPhotos(
      supabase,
      user.id,
      plantId,
      files,
    );

    const { data: profile } = await supabase
      .from("users")
      .select("location_city")
      .eq("id", user.id)
      .single();

    let weatherSnapshot: Json | null = null;
    let weatherText = "Weather data unavailable.";

    if (profile?.location_city) {
      try {
        const weather = await fetchWeatherForCity(profile.location_city);
        weatherSnapshot = JSON.parse(JSON.stringify(weather)) as Json;
        weatherText = formatWeatherForPrompt(weather);
      } catch {
        weatherText = "Weather data could not be loaded for this check-in.";
      }
    }

    const historySummaries = await getCheckInHistorySummaries(plantId);

    const plantIdentity = [
      plant.nickname ? `Nickname: ${plant.nickname}` : null,
      plant.species ? `Species: ${plant.species}` : null,
      plant.approximate_age != null
        ? `Age: ${formatAgeDays(plant.approximate_age)}`
        : null,
      plant.history_note ? `History: ${plant.history_note}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    const analysisContext: AnalysisContext = {
      plantIdentity: plantIdentity || "No profile details",
      historySummary: historySummaries || "No prior check-ins.",
      weatherSummary: weatherText,
      photoCount: photoUrls.length,
    };

    const rawReport = normalizeRawPlantReport(
      await analyzePlantCheckIn({
        plant: {
          nickname: plant.nickname,
          species: plant.species,
          approximateAge: formatAgeDays(plant.approximate_age),
          historyNote: plant.history_note,
        },
        historySummaries,
        weatherText,
        userNote,
        imageUrls: photoUrls,
      }),
    );

    const report = normalizePlantReport(
      await formatPlantReportFromRaw(rawReport),
    );

    const { data: checkin, error: checkinError } = await supabase
      .from("checkins")
      .insert({
        plant_id: plantId,
        user_id: user.id,
        photo_urls: photoUrls,
        user_note: userNote,
        weather_snapshot: weatherSnapshot,
      })
      .select("id")
      .single();

    if (checkinError || !checkin) {
      return NextResponse.json(
        { error: checkinError?.message ?? "Failed to save check-in." },
        { status: 500 },
      );
    }

    const insights = report.insights.slice(0, 5);

    const { error: analysisError } = await supabase
      .from("analysis_results")
      .insert({
        checkin_id: checkin.id,
        plant_id: plantId,
        health_score: clampHealthScore(report.healthScore),
        health_trend: report.healthTrend,
        insights: insights as unknown as Json,
        recommendations: report.recommendations as unknown as Json,
        prediction: report.prediction as unknown as Json,
        urgency_score: clampUrgencyScore(report.urgencyScore),
        changes_summary: report.changesSinceLastScan,
        weather_impact: report.weatherImpact,
      });

    if (analysisError) {
      return NextResponse.json({ error: analysisError.message }, { status: 500 });
    }

    return NextResponse.json({
      checkinId: checkin.id,
      report: { ...report, insights },
      analysisContext,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Analysis failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
