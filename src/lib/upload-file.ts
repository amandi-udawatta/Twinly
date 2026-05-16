/**
 * Validates multipart uploads on the server (Node may not define global `File`).
 */

/** True when value is a Blob from FormData (Node 18+). */
export function isUploadBlob(value: unknown): value is Blob {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const blob = value as Blob;
  return (
    typeof blob.arrayBuffer === "function" &&
    typeof blob.size === "number" &&
    blob.size > 0
  );
}
