/**
 * POST /api/compare-photos
 * Vertex Gemini multimodal before/after comparison for two check-ins.
 */

import { NextResponse } from "next/server";

import { getPlantById, getCheckinsWithPhotos } from "@/lib/data/plants";
import { createClient } from "@/lib/supabase/server";
import { comparePlantPhotos } from "@/services/geminiService";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      plantId?: string;
      beforeCheckinId?: string;
      afterCheckinId?: string;
    };

    const { plantId, beforeCheckinId, afterCheckinId } = body;

    if (!plantId || !beforeCheckinId || !afterCheckinId) {
      return NextResponse.json(
        { error: "plantId, beforeCheckinId, and afterCheckinId are required." },
        { status: 400 },
      );
    }

    if (beforeCheckinId === afterCheckinId) {
      return NextResponse.json(
        { error: "Choose two different check-ins to compare." },
        { status: 400 },
      );
    }

    const plant = await getPlantById(plantId, user.id);
    if (!plant) {
      return NextResponse.json({ error: "Plant not found." }, { status: 404 });
    }

    const checkins = await getCheckinsWithPhotos(plantId);
    const before = checkins.find((c) => c.id === beforeCheckinId);
    const after = checkins.find((c) => c.id === afterCheckinId);

    if (!before?.photo_urls?.[0] || !after?.photo_urls?.[0]) {
      return NextResponse.json(
        { error: "Both check-ins need at least one photo." },
        { status: 400 },
      );
    }

    const result = await comparePlantPhotos(
      before.photo_urls[0],
      after.photo_urls[0],
      {
        species: plant.species,
        nickname: plant.nickname,
        beforeDate: before.created_at.slice(0, 10),
        afterDate: after.created_at.slice(0, 10),
      },
    );

    return NextResponse.json({ comparison: result });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Photo comparison failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
