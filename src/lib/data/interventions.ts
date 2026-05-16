import { createClient } from "@/lib/supabase/server";

export interface InterventionRow {
  id: string;
  plant_id: string;
  type: string;
  description: string | null;
  created_at: string;
}

export async function getInterventionsForPlant(
  plantId: string,
): Promise<InterventionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interventions")
    .select("*")
    .eq("plant_id", plantId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
