import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/adminAuth";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out from admin panel",
  });
  clearAdminCookie(response);
  return response;
}
