import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Not implemented — Gemini registration auto-fill" },
    { status: 501 },
  );
}
