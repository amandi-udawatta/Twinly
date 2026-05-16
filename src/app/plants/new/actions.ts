"use server";

/**
 * Create a new plant record and upload cover photo to Supabase Storage.
 */

import { redirect } from "next/navigation";

import { ageToDays, parseAgeUnit } from "@/lib/plant-age";
import { isUploadBlob } from "@/lib/upload-file";
import { createClient } from "@/lib/supabase/server";
import { uploadPlantPhoto } from "@/services/storageService";

import type { SavePlantState } from "@/app/plants/new/types";

export async function savePlant(
  _prev: SavePlantState,
  formData: FormData,
): Promise<SavePlantState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in.", plantId: null };
  }

  const nickname = String(formData.get("nickname") ?? "").trim();
  const species = String(formData.get("species") ?? "").trim();
  const historyNote = String(formData.get("historyNote") ?? "").trim();
  const imageFile = formData.get("image");

  const ageAmountRaw = String(formData.get("ageAmount") ?? "").trim();
  const ageUnitRaw = String(formData.get("ageUnit") ?? "").trim();

  if (!species) {
    return { error: "Plant name is required.", plantId: null };
  }

  if (!isUploadBlob(imageFile)) {
    return { error: "Cover photo is required.", plantId: null };
  }

  let approximateAge: number | null = null;
  if (ageAmountRaw) {
    const amount = Number.parseInt(ageAmountRaw, 10);
    const unit = parseAgeUnit(ageUnitRaw);
    if (!Number.isFinite(amount) || amount <= 0) {
      return { error: "Enter a valid age number.", plantId: null };
    }
    if (!unit) {
      return { error: "Choose days, weeks, or years for age.", plantId: null };
    }
    approximateAge = ageToDays(amount, unit);
  }

  const { data: plant, error: insertError } = await supabase
    .from("plants")
    .insert({
      user_id: user.id,
      nickname: nickname || null,
      species,
      approximate_age: approximateAge,
      history_note: historyNote || null,
    })
    .select("id")
    .single();

  if (insertError || !plant) {
    return {
      error: insertError?.message ?? "Failed to create plant.",
      plantId: null,
    };
  }

  try {
    const { publicUrl } = await uploadPlantPhoto(
      supabase,
      user.id,
      plant.id,
      imageFile,
    );

    await supabase
      .from("plants")
      .update({ image_url: publicUrl })
      .eq("id", plant.id);
  } catch (uploadErr) {
    await supabase.from("plants").delete().eq("id", plant.id);
    const message =
      uploadErr instanceof Error ? uploadErr.message : "Upload failed.";
    return { error: message, plantId: null };
  }

  redirect(`/plants/new?step=qr&plantId=${plant.id}`);
}
