import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Not implemented — Gemini check-in analysis" },
    { status: 501 },
  );
}
