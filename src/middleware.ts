// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "@auth/core/jwt";

const protectedPaths = ["/dashboard", "/connections", "/settings"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip public paths
  if (!protectedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET ?? "";
  const salt = process.env.AUTH_SALT ?? secret;

  const token = await getToken({ req, secret, salt });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/connections/:path*", "/settings/:path*"],
};
