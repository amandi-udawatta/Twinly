/**
 * Client-side image compression for API uploads (Vercel ~4.5 MB body limit).
 */

import {
  MAX_SINGLE_IMAGE_BYTES,
  MAX_UPLOAD_PAYLOAD_BYTES,
} from "@/lib/upload-limits";

const MAX_DIMENSION = 1920;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image."));
    };
    img.src = url;
  });
}

function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Image compression failed."));
      },
      "image/jpeg",
      quality,
    );
  });
}

async function compressOne(
  file: File,
  quality: number,
): Promise<File> {
  const img = await loadImage(file);
  let { width, height } = img;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    if (width >= height) {
      height = Math.round((height * MAX_DIMENSION) / width);
      width = MAX_DIMENSION;
    } else {
      width = Math.round((width * MAX_DIMENSION) / height);
      height = MAX_DIMENSION;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not prepare image for upload.");
  }
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvasToJpegBlob(canvas, quality);
  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

/**
 * Resize and JPEG-compress images so check-in uploads stay under Vercel limits.
 */
export async function compressImagesForUpload(files: File[]): Promise<File[]> {
  const out: File[] = [];
  let quality = 0.85;

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      out.push(file);
      continue;
    }

    let compressed = await compressOne(file, quality);
    while (compressed.size > MAX_SINGLE_IMAGE_BYTES && quality > 0.45) {
      quality -= 0.1;
      compressed = await compressOne(file, quality);
    }
    out.push(compressed);
  }

  const total = out.reduce((sum, f) => sum + f.size, 0);
  if (total > MAX_UPLOAD_PAYLOAD_BYTES) {
    throw new Error(
      "Photos are still too large after compression. Try fewer photos or smaller originals.",
    );
  }

  return out;
}
