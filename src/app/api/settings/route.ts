import { NextResponse } from "next/server";
import { getShippingSettings } from "@/lib/settings";

export const revalidate = 60; // cache for 60 seconds

export async function GET() {
  const settings = await getShippingSettings();
  return NextResponse.json(settings);
}
