import { auth } from "@/lib/auth";

export async function requireAuth(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}
