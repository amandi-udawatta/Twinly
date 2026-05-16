/**
 * Supabase Storage helpers for plant photos.
 * Path format: {userId}/{plantId}/{timestamp}.{ext}
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

const BUCKET = "plant-photos";

function extensionFromMime(mimeType: string | undefined): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/gif") return "gif";
  return "jpg";
}

export function buildPlantPhotoPath(
  userId: string,
  plantId: string,
  file: Blob,
): string {
  const ext = extensionFromMime(file.type);
  return `${userId}/${plantId}/${Date.now()}.${ext}`;
}

export async function uploadPlantPhoto(
  supabase: SupabaseClient<Database>,
  userId: string,
  plantId: string,
  file: Blob,
): Promise<{ publicUrl: string; path: string }> {
  const path = buildPlantPhotoPath(userId, plantId, file);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg",
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { publicUrl, path };
}

export async function uploadPlantPhotos(
  supabase: SupabaseClient<Database>,
  userId: string,
  plantId: string,
  files: Blob[],
): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const { publicUrl } = await uploadPlantPhoto(supabase, userId, plantId, file);
    urls.push(publicUrl);
  }
  return urls;
}

/** Remove all objects under {userId}/{plantId}/ (cover + check-in photos). */
export async function deleteAllPlantStorage(
  supabase: SupabaseClient<Database>,
  userId: string,
  plantId: string,
): Promise<void> {
  const prefix = `${userId}/${plantId}`;
  const paths: string[] = [];
  let offset = 0;
  const limit = 100;

  for (;;) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(prefix, { limit, offset });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.length) break;

    for (const item of data) {
      if (item.name) {
        paths.push(`${prefix}/${item.name}`);
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }

  if (paths.length === 0) return;

  const { error: removeError } = await supabase.storage
    .from(BUCKET)
    .remove(paths);

  if (removeError) {
    throw new Error(removeError.message);
  }
}
