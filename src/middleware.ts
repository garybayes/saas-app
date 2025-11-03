import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // This function is only called if the user is authenticated.
    if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup")) {
      return NextResponse.redirect(new URL("/connections", req.url));
    }
  },
  {
    // Configure `withAuth` behavior
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/connections/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
  ],
};
