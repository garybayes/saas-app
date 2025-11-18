import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "@auth/core/jwt";

// Public pages
const publicAuthPages = ["/login", "/signup"];

// Private pages
const protectedPages = ["/dashboard", "/connections", "/settings"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Narrow types so TS knows they're strings
  const secret = process.env.AUTH_SECRET ?? "";
  const salt = process.env.AUTH_SALT ?? "";

  const token = await getToken({
    req,
    secret,
    salt,
  });

  const isAuthed = Boolean(token?.sub);

  // Authenticated user trying to visit login/signup → redirect
  if (isAuthed && publicAuthPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Unauthenticated user trying to access protected routes → redirect
  if (!isAuthed && protectedPages.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/connections/:path*",
    "/settings/:path*",
  ],
};
