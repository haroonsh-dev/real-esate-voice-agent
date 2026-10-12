import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const slots: string[] = [];
  for (let dayOffset = 1; dayOffset <= 3; dayOffset++) {
    for (const hour of [11, 15, 17]) {
      const slot = new Date(now);
      slot.setDate(now.getDate() + dayOffset);
      slot.setHours(hour, 0, 0, 0);
      slots.push(slot.toISOString());
    }
  }
  return NextResponse.json({ data: slots });
}
