import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const session = await auth.api.getSession({
    // In middleware-like contexts, prefer the request headers.
    headers: request.headers,
  });

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!session) {
    // Allow public auth pages without redirecting to themselves.
    if (pathname === "/sign-in" || pathname === "/sign-up" || pathname === "/") {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // If the user is already signed in, keep them out of auth pages.
  if (pathname === "/sign-in" || pathname === "/sign-up") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard", "/sign-in", "/sign-up", "/create-project-report", "/create-cma-report",
  ], // Specify the routes the middleware applies to
};
