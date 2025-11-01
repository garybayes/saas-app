export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/connections", "/settings"],
};
