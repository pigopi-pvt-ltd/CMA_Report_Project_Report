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
console.log(data)
    return NextResponse.json({
      message: "Signed-Up Successfully",
      data
    }, { status: 200 })

  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }
    return NextResponse.json({
      message: error.message
    }, { status: error.statusCode })
  }
}
