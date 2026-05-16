/**
 * GCP auth for Vertex AI — supports inline JSON in env (Vercel/production)
 * or a local file path for development.
 */

import fs from "fs";
import path from "path";

import type { GoogleAuthOptions } from "google-auth-library";

export interface ServiceAccountJson {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri?: string;
  token_uri?: string;
  auth_provider_x509_cert_url?: string;
  client_x509_cert_url?: string;
  universe_domain?: string;
}

function parseServiceAccountJson(raw: string): ServiceAccountJson {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON must be the full service account JSON object.",
    );
  }

  let parsed: ServiceAccountJson;
  try {
    parsed = JSON.parse(trimmed) as ServiceAccountJson;
  } catch {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON. Use a single line (minified) in .env.local.",
    );
  }

  if (!parsed.client_email || !parsed.private_key) {
    throw new Error(
      "Service account JSON must include client_email and private_key.",
    );
  }

  return parsed;
}

function loadJsonFromEnv(): ServiceAccountJson | undefined {
  const inline = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (inline) {
    return parseServiceAccountJson(inline);
  }

  const base64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64?.trim();
  if (base64) {
    const decoded = Buffer.from(base64, "base64").toString("utf8");
    return parseServiceAccountJson(decoded);
  }

  return undefined;
}

function loadJsonFromFilePath(): ServiceAccountJson | undefined {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (!raw || raw.startsWith("{")) {
    return undefined;
  }

  const resolved = path.isAbsolute(raw)
    ? raw
    : path.resolve(process.cwd(), raw);

  if (!fs.existsSync(resolved)) {
    return undefined;
  }

  const contents = fs.readFileSync(resolved, "utf8");
  return parseServiceAccountJson(contents);
}

/**
 * Auth options for @google/genai Vertex client.
 * Prefer GOOGLE_SERVICE_ACCOUNT_JSON in production (Vercel, etc.).
 */
export function getGcpGoogleAuthOptions(): GoogleAuthOptions {
  const credentials =
    loadJsonFromEnv() ?? loadJsonFromFilePath();

  if (credentials) {
    return { credentials };
  }

  throw new Error(
    "GCP credentials missing. Set one of:\n" +
      "  GOOGLE_SERVICE_ACCOUNT_JSON={\"type\":\"service_account\",...}  (single line, for deploy)\n" +
      "  GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=<base64 of JSON>\n" +
      "  GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/key.json  (local file only)\n\n" +
      "Tip: jq -c . secrets/gcp-service-account.json",
  );
}
