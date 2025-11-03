import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const publicPages = ["/login", "/signup"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const isPublicPage = publicPages.some((path) => pathname.startsWith(path));

  // If the user is authenticated and on a public page, redirect to connections
  if (token && isPublicPage) {
    return NextResponse.redirect(new URL("/connections", req.url));
  }

  // If the user is not authenticated and not on a public page, redirect to login
  if (!token && !isPublicPage) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
