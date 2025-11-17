import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Works ONLY with your actual cookie format
const cookieName = "next-auth.session-token";

export async function requireAuth(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName,
  });

  if (!token?.sub) {
    return {
      userId: null,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  return { userId: token.sub };
}
