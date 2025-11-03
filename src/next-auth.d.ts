import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      theme: string;
      displayName: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    theme: string;
  }
}
