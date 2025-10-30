// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// 🔹 Wrap NextAuth's middleware for route protection
export default withAuth(
  function middleware(req) {
    // Optionally: you can log route access or modify response headers here.
    return NextResponse.next();
  },
  {
    callbacks: {
      // 🔒 If the user has a valid session, allow access
      authorized: ({ token }) => !!token,
    },
  }
);

// 🔹 Apply middleware only to authenticated sections
export const config = {
  matcher: [
    "/connections/:path*", // all subpaths of /connections
    "/settings/:path*",    // all subpaths of /settings
    "/dashboard/:path*",   // for future sections
  ],
};
