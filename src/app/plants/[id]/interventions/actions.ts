"use server";

import { revalidatePath } from "next/cache";

import { getPlantById } from "@/lib/data/plants";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/get-user";

export async function createIntervention(
  plantId: string,
  type: string,
  description: string | null,
): Promise<{ error?: string }> {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const plant = await getPlantById(plantId, user.id);
  if (!plant) return { error: "Plant not found." };

  const normalizedType = type.trim().toLowerCase();
  if (!normalizedType) return { error: "Type is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("interventions").insert({
    plant_id: plantId,
    type: normalizedType,
    description: description?.trim() || null,
  });

  if (error) return { error: error.message };

  revalidatePath(`/plants/${plantId}`);
  return {};
}

export async function deleteIntervention(
  plantId: string,
  interventionId: string,
): Promise<{ error?: string }> {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const plant = await getPlantById(plantId, user.id);
  if (!plant) return { error: "Plant not found." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("interventions")
    .delete()
    .eq("id", interventionId)
    .eq("plant_id", plantId);

  if (error) return { error: error.message };

  revalidatePath(`/plants/${plantId}`);
  return {};
}
