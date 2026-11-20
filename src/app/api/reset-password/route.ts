import { auth } from "@/lib/auth";
import { resetPasswordServerSchema } from "@/Schemas/forgot-password-schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp, token, password } = resetPasswordServerSchema.parse(body);

    if (email && otp) {
      // Reset using OTP
      await auth.api.resetPasswordEmailOTP({
        body: {
          email: email.toLowerCase().trim(),
          otp: otp.trim(),
          password,
        },
      });

      return NextResponse.json(
        {
          message: "Password reset successfully. You can now sign in with your new password.",
        },
        { status: 200 }
      );
    }

    if (token) {
      // Reset using Token
      await auth.api.resetPassword({
        body: {
          newPassword: password,
          token: token.trim(),
        },
      });

      return NextResponse.json(
        {
          message: "Password reset successfully. You can now sign in with your new password.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "Invalid request. Please provide an OTP or a reset token.",
        error: "Invalid request. Please provide an OTP or a reset token.",
      },
      { status: 400 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const firstIssue = error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        {
          message: firstIssue,
          error: firstIssue,
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const err = error as {
      message?: string;
      body?: { message?: string };
      statusCode?: number;
      status?: number;
    };

    const message =
      err?.body?.message ||
      err?.message ||
      "Failed to reset password. The OTP or token may be invalid or expired.";
    const statusCode =
      typeof err?.statusCode === "number"
        ? err.statusCode
        : typeof err?.status === "number"
        ? err.status
        : 500;

    return NextResponse.json(
      {
        message,
        error: message,
      },
      { status: statusCode }
    );
  }
}
