/**
 * POST /api/register-plant
 * Optional Vertex AI species name suggestion from an uploaded photo.
 */

import { NextResponse } from "next/server";

import { isUploadBlob } from "@/lib/upload-file";
import { createClient } from "@/lib/supabase/server";
import { suggestSpeciesFromImage } from "@/services/geminiService";

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
    const file = formData.get("image");

    if (!isUploadBlob(file)) {
      return NextResponse.json(
        { error: "Image file is required." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    const suggestion = await suggestSpeciesFromImage(base64, mimeType);

    return NextResponse.json(suggestion);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Species suggestion failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
