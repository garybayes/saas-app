export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/connections/:path*", "/settings/:path*"],
};
