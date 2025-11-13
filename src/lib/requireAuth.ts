// src/lib/requireAuth.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@auth/core/jwt";

/**
 * Shared authentication helper for API routes.
 * Validates JWT session and returns userId or an error response.
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ userId: string | null; response?: NextResponse }> {
  const secret = process.env.AUTH_SECRET ?? "";
  const salt = process.env.AUTH_SALT ?? secret; // ✅ fallback ensures required param

  const token = await getToken({
    req,
    secret,
    salt, // ✅ new required param in Auth.js v2
  });

  if (!token?.sub) {
    return {
      userId: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { userId: token.sub };
}
