import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // Fetch user by email (case-insensitive)
        const user = await prisma.user.findFirst({
          where: {
            email: {
              equals: credentials.email,
              mode: "insensitive",
            },
          },
        });

        if (!user) return null;

        const dbPassword = (user.password ?? "").trim().replace(/\r?\n|\r/g, "");
        const inputPassword = (credentials.password ?? "").trim().replace(/\r?\n|\r/g, "");

        // ✅ Case 1: legacy user (blank password)
        if (!dbPassword && !inputPassword) {
          return { id: user.id, email: user.email, theme: user.theme || "light" };
        }

        // ✅ Case 2: exact match
        if (dbPassword === inputPassword) {
          return { id: user.id, email: user.email, theme: user.theme || "light" };
        }

        // ❌ Otherwise invalid
        return null;
      },
    }),
  ],

  session: { strategy: "jwt" },
  jwt: { maxAge: 60 * 60 * 24 * 7 },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.theme = user.theme;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          theme: (token.theme as string) || "light",
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/connections`;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
