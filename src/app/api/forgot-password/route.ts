import { auth } from "@/lib/auth";
import { forgotPasswordSchema } from "@/Schemas/forgot-password-schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import dbConnect from "@/db/dbConnect";
import UserModel from "@/db/models/userModel";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);
    const normalizedEmail = email.toLowerCase().trim();

    // Verify if user exists
    await dbConnect();
    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (!existingUser) {
      return NextResponse.json(
        {
          message: "No account found with this email address",
          error: "No account found with this email address",
        },
        { status: 404 }
      );
    }

    // Trigger Better-Auth password reset with OTP
    await auth.api.requestPasswordResetEmailOTP({
      body: {
        email: normalizedEmail,
      },
    });

    return NextResponse.json(
      {
        message: "Verification code sent to your email",
        email: normalizedEmail,
      },
      { status: 200 }
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
      "Failed to process password reset request. Please try again.";
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
