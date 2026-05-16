"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPlantById } from "@/lib/data/plants";
import { isUploadBlob } from "@/lib/upload-file";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/get-user";
import {
  deleteAllPlantStorage,
  uploadPlantPhoto,
} from "@/services/storageService";

export type PlantActionResult = { error?: string; success?: boolean };

export async function updatePlant(
  plantId: string,
  _prev: PlantActionResult,
  formData: FormData,
): Promise<PlantActionResult> {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const plant = await getPlantById(plantId, user.id);
  if (!plant) return { error: "Plant not found." };

  const nickname = String(formData.get("nickname") ?? "").trim();
  const imageFile = formData.get("image");

  const supabase = await createClient();
  let imageUrl = plant.image_url;

  if (isUploadBlob(imageFile)) {
    try {
      const { publicUrl } = await uploadPlantPhoto(
        supabase,
        user.id,
        plantId,
        imageFile,
      );
      imageUrl = publicUrl;
    } catch (uploadErr) {
      const message =
        uploadErr instanceof Error ? uploadErr.message : "Upload failed.";
      return { error: message };
    }
  }

  const { error } = await supabase
    .from("plants")
    .update({
      nickname: nickname || null,
      image_url: imageUrl,
    })
    .eq("id", plantId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/plants/${plantId}`);
  revalidatePath("/plants");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deletePlant(
  plantId: string,
): Promise<PlantActionResult> {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const plant = await getPlantById(plantId, user.id);
  if (!plant) return { error: "Plant not found." };

  const supabase = await createClient();

  try {
    await deleteAllPlantStorage(supabase, user.id, plantId);
  } catch (storageErr) {
    const message =
      storageErr instanceof Error
        ? storageErr.message
        : "Could not remove plant photos.";
    return { error: message };
  }

  const { error } = await supabase
    .from("plants")
    .delete()
    .eq("id", plantId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/plants");
  revalidatePath("/dashboard");
  redirect("/plants");
}
