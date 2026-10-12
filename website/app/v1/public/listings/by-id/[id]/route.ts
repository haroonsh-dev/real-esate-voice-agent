import { NextResponse } from "next/server";
import { FALLBACK_VERIFIED_LISTINGS } from "@/lib/fallbackData";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const normalized = decodeURIComponent(id).trim().toUpperCase();
  const listing =
    FALLBACK_VERIFIED_LISTINGS.find(
      (item) => item.id.toUpperCase() === normalized || item.slug.toLowerCase() === id.toLowerCase()
    ) || FALLBACK_VERIFIED_LISTINGS[0];

  if (!listing) {
    return NextResponse.json({ detail: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json(listing);
}
