import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "cma_admin_session";

const getAdminSecret = () => {
  return process.env.ADMIN_SECRET || process.env.BETTER_AUTH_SECRET || "cma-super-secret-admin-key-2026";
};

export interface AdminSessionPayload {
  email: string;
  role: "admin";
  exp: number; // Unix timestamp in seconds
}

export function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || "admin@cma.com").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "admin123456",
  };
}

export function verifyAdminCredentials(email?: string, password?: string): boolean {
  if (!email || !password) return false;
  const creds = getAdminCredentials();
  const inputEmail = email.trim().toLowerCase();
  return inputEmail === creds.email && password === creds.password;
}

export function signAdminToken(email: string): string {
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const payload: AdminSessionPayload = {
    email: email.trim().toLowerCase(),
    role: "admin",
    exp,
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getAdminSecret())
    .update(payloadStr)
    .digest("base64url");

  return `${payloadStr}.${signature}`;
}

export function verifyAdminToken(token?: string | null): AdminSessionPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadStr, signature] = parts;

  const expectedSignature = crypto
    .createHmac("sha256", getAdminSecret())
    .update(payloadStr)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadStr, "base64url").toString("utf-8")
    ) as AdminSessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    if (payload.role !== "admin") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession(
  req?: Request | NextRequest
): Promise<AdminSessionPayload | null> {
  let token: string | undefined;

  // 1. Try to read from Request Cookie header
  if (req) {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`(?:^|; )${ADMIN_COOKIE_NAME}=([^;]*)`));
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  // 2. If not found or no request passed, try Next.js cookies() API
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    } catch {
      // In certain environments cookies() might throw
    }
  }

  return verifyAdminToken(token);
}

export async function requireAdminAuth(req?: Request | NextRequest): Promise<AdminSessionPayload> {
  const session = await getAdminSession(req);
  if (!session) {
    throw new Error("UNAUTHORIZED_ADMIN");
  }
  return session;
}

export function setAdminCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
