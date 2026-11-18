import { NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  signAdminToken,
  setAdminCookie,
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    const token = signAdminToken(email);
    const response = NextResponse.json({
      success: true,
      message: "Admin authenticated successfully",
      email: email.trim().toLowerCase(),
    });

    setAdminCookie(response, token);
    return response;
  } catch (error: any) {
    console.error("[Admin Login Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
