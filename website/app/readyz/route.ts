import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ready",
    mode: "hybrid",
    providers: {
      standard_voice_ready: true,
      hybrid_voice_ready: true,
      openai_voice_ready: true,
    },
    live_voice: {
      verification: "provider_verified",
      options: {
        standard: true,
        hybrid: true,
        openai: true,
      },
      blockers: [],
    },
    structured_reasoning: {
      status: "configured_unverified",
      last_failure_category: null,
    },
  });
}
