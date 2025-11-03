import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const protectedPaths = ["/dashboard", "/connections", "/settings"];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/connections", req.url));
  }

  if (!token && isProtectedPath) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/connections/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
  ],
};
