/** Vercel serverless request body limit is ~4.5 MB; leave headroom for multipart. */
export const MAX_UPLOAD_PAYLOAD_BYTES = 3_500_000;

export const MAX_SINGLE_IMAGE_BYTES = 1_200_000;
