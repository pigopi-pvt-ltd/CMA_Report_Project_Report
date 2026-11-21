import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/db/dbConnect";
import AdminModel from "@/db/models/adminModel";
import { ensureAdminSeeded } from "@/lib/adminAuth";
import { sendAdminPasswordResetEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid email address is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    await dbConnect();
    await ensureAdminSeeded();

    const admin = await AdminModel.findOne({ email: normalizedEmail });
    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "No administrator account found with this email address",
        },
        { status: 404 }
      );
    }

    // Generate 6-digit numeric OTP and 32-byte secure token
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    admin.resetOtp = otp;
    admin.resetOtpExpires = expires;
    admin.resetToken = token;
    admin.resetTokenExpires = expires;
    await admin.save();

    // Construct reset link URL
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.BETTER_AUTH_URL ||
      "http://localhost:3000";
    const resetUrl = `${baseUrl.replace(/\/$/, "")}/admin/reset-password?token=${token}&email=${encodeURIComponent(
      normalizedEmail
    )}`;

    // Send email via nodemailer
    await sendAdminPasswordResetEmail({
      to: normalizedEmail,
      otp,
      resetUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Verification code and reset instructions sent to your email.",
      email: normalizedEmail,
    });
  } catch (error: any) {
    console.error("[Admin Forgot Password Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to process password reset request",
      },
      { status: 500 }
    );
  }
}
