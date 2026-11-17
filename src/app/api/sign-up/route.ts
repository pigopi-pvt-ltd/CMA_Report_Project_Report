import { auth } from '@/lib/auth'
import { signUpServerSchema } from '@/Schemas/sign-up-schema';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nextParam = searchParams.get("next");
    const baseUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
    const callbackURL = nextParam ? `${baseUrl}${nextParam}` : `${baseUrl}/dashboard`;
    const body = await request.json()
    const { email, password, name } = signUpServerSchema.parse(body);

    const data = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        callbackURL,
      },
    });
    return NextResponse.json({
      message: "Signed-Up Successfully",
      data
    }, { status: 200 })

  } catch (error: any) {
    if (error instanceof ZodError) {
      const firstIssue = error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        {
          message: firstIssue,
          error: firstIssue,
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const message =
      error?.body?.message ||
      error?.message ||
      "An unexpected error occurred during sign up";
    const statusCode =
      typeof error?.statusCode === "number"
        ? error.statusCode
        : typeof error?.status === "number"
        ? error.status
        : 500;

    return NextResponse.json({
      message,
      error: message,
    }, { status: statusCode })
  }
}
