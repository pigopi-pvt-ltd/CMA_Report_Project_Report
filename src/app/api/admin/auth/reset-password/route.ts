import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import AdminModel from "@/db/models/adminModel";
import { hashAdminPassword } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp, token, password } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    if (!otp && !token) {
      return NextResponse.json(
        {
          success: false,
          message: "A verification OTP or reset token is required",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    await dbConnect();
    const admin = await AdminModel.findOne({ email: normalizedEmail });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Administrator account not found",
        },
        { status: 404 }
      );
    }

    const now = new Date();
    let isAuthorized = false;

    // Check token-based reset first
    if (token && typeof token === "string") {
      if (
        admin.resetToken === token.trim() &&
        admin.resetTokenExpires &&
        admin.resetTokenExpires > now
      ) {
        isAuthorized = true;
      }
    }

    // Check OTP-based reset if token was not used or failed
    if (!isAuthorized && otp && typeof otp === "string") {
      if (
        admin.resetOtp === otp.trim() &&
        admin.resetOtpExpires &&
        admin.resetOtpExpires > now
      ) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid or expired verification code / token. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Hash the new password and clear the reset credentials
    admin.passwordHash = hashAdminPassword(password);
    admin.resetOtp = undefined;
    admin.resetOtpExpires = undefined;
    admin.resetToken = undefined;
    admin.resetTokenExpires = undefined;
    await admin.save();

    return NextResponse.json({
      success: true,
      message:
        "Password has been reset successfully. You can now sign in with your new password.",
    });
  } catch (error: any) {
    console.error("[Admin Reset Password Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to reset administrator password",
      },
      { status: 500 }
    );
  }
}
